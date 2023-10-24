"use client"
import { useRouter } from "next/navigation"
import { Toast } from "./Toast"
import { useState } from "react"

export default function EditTournamentButton({
	params,
}: {
	params: { id: number; url: string }
}) {
	const router = useRouter()
	const [showToast, setShowToast] = useState(false)

	const handleClick = () => {
		setShowToast(true)
		setTimeout(() => {
			setShowToast(false)
		}, 2000)
		router.push("/tournament/" + params.url)
	}

	return (
		<>
			<span
				className="tooltip tooltip-top tooltip-success"
				data-tooltip="Edit">
				<button
					onClick={() => {
						handleClick()
					}}
					id={params.id.toString()}
					className="btn btn-circle bg-green-500 h-8 w-8 mx-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-6 h-6">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
						/>
					</svg>
				</button>
			</span>
			{showToast && (
				<Toast
					type="warning"
					message="Getting tournament..."
				/>
			)}
		</>
	)
}
