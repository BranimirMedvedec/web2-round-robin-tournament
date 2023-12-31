"use client"
import { Toast } from "./Toast"
import { useState } from "react"

export default function ShareTournamentButton({
	params,
}: {
	params: { url: string }
}) {
	const [showToast, setShowToast] = useState(false)

	const handleClick = () => {
		const baseUrl = process.env.NEXT_PUBLIC_URL
		const fullUrl = baseUrl + "/tournament/preview/" + params.url

		navigator.clipboard.writeText(fullUrl)
		setShowToast(true)
		setTimeout(() => {
			setShowToast(false)
		}, 1500)
	}

	return (
		<>
			<span
				className="tooltip tooltip-top tooltip-warning"
				data-tooltip="Share">
				<button
					onClick={() => {
						handleClick()
					}}
					className="btn btn-circle bg-yellow-500 h-8 w-8 mx-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
						/>
					</svg>
				</button>
			</span>
			{showToast && (
				<Toast
					type="success"
					message="Copied to clipboard"
				/>
			)}
		</>
	)
}
