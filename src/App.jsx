import { useState, useEffect, useRef } from "react";
import { FastAverageColor } from "fast-average-color";

function App() {
	const [isAllowed, setIsAllowed] = useState(true);
	const [isDark, setIsDark] = useState(true);
	const [avgColor, setAvgColor] = useState();

	const videoRef = useRef(null);

	function requestCameraAccess() {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			})
			.catch((e) => setIsAllowed(false));
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(avgColor);
	}

	useEffect(() => {
		requestCameraAccess();

		const fac = new FastAverageColor();

		const i = setInterval(() => {
			if (videoRef.current) {
				const color = fac.getColor(videoRef.current, { silent: true });
				setAvgColor(color.hex);
				setIsDark(color.isDark);
			}
		}, 1000 / 15);

		return () => clearInterval(i);
	}, []);

	return (
		<>
			<div
				className="absolute inset-0 -z-50 min-h-screen"
				style={{ backgroundColor: avgColor }}
			></div>

			<video ref={videoRef} className="hidden"></video>

			<h1 className={`${isDark ? "text-gray-100" : "text-gray-900"} text-4xl`}>
				Color Finder
			</h1>

			{isAllowed ? (
				<p className={`${isDark ? "text-gray-100" : "text-gray-900"} text-2xl`}>
					{avgColor}
				</p>
			) : (
				<p className={`text-2xl text-red-500`}>Camera access denied</p>
			)}

			<button
				onClick={copyToClipboard}
				style={{ color: avgColor }}
				className={`${
					isDark ? "bg-gray-100" : "bg-gray-900"
				} rounded-full  p-4`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="h-6 w-6"
				>
					<path
						fillRule="evenodd"
						d="M16.098 2.598a3.75 3.75 0 113.622 6.275l-1.72.46V12a.75.75 0 01-.22.53l-.75.75a.75.75 0 01-1.06 0l-.97-.97-7.94 7.94a2.56 2.56 0 01-1.81.75 1.06 1.06 0 00-.75.31l-.97.97a.75.75 0 01-1.06 0l-.75-.75a.75.75 0 010-1.06l.97-.97a1.06 1.06 0 00.31-.75c0-.68.27-1.33.75-1.81L11.69 9l-.97-.97a.75.75 0 010-1.06l.75-.75A.75.75 0 0112 6h2.666l.461-1.72c.165-.617.49-1.2.971-1.682zm-3.348 7.463L4.81 18a1.06 1.06 0 00-.31.75c0 .318-.06.63-.172.922a2.56 2.56 0 01.922-.172c.281 0 .551-.112.75-.31l7.94-7.94-1.19-1.19z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</>
	);
}

export default App;
