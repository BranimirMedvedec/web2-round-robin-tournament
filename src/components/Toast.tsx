import { useEffect, useState } from "react"

type ToastProps = {
	type: "success" | "warning" | "error"
	message: string
}

export function Toast({ type, message }: ToastProps) {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		setVisible(true)
		const timer = setTimeout(() => setVisible(false), 1500)
		return () => clearTimeout(timer)
	}, [])

	const icon = {
		success: (
			<svg
				className="h-4 w-4 text-green-500 mr-2"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fillRule="evenodd"
					d="M18.707 4.293a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 13.586l8.293-8.293a1 1 0 0 1 1.414 0z"
				/>
			</svg>
		),
		warning: (
			<svg
				className="h-4 w-4 text-yellow-500 mr-2"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-9a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1z"
				/>
			</svg>
		),
		error: (
			<svg
				className="h-4 w-4 text-red-500 mr-2"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1.414-9.414a1 1 0 0 1 0-1.414l2-2a1 1 0 1 1 1.414 1.414l-2 2a1 1 0 0 1-1.414 0zm0 4a1 1 0 0 1 0-2 1 1 0 0 1 0 2z"
				/>
			</svg>
		),
	}

	return (
		<div
			className={`absolute bottom-0 left-0 mb-4 ml-4 max-w-xs border rounded-md shadow-lg ${
				visible
					? "opacity-100 translate-y-0"
					: "opacity-0 -translate-y-2"
			} transition-all duration-300 z-100
            ${
				(icon[type] === icon["success"] &&
					`bg-green-100 border-green-500`) ||
				(icon[type] === icon["warning"] &&
					`bg-yellow-100 border-yellow-500`) ||
				(icon[type] === icon["error"] && `bg-red-100 border-red-500`)
			}
            
            `}
			role="alert">
			<div className="flex p-4">
				<div>{icon[type]}</div>
				<div className="ml-3">
					<p className="text-sm text-black">{message}</p>
				</div>
			</div>
		</div>
	)
}
