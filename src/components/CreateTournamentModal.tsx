"use client"
import { FormEvent, useEffect, useState } from "react"
import { Tournament } from "@/types/tournamentInfo/tournament"
import { Scoring } from "@/types/tournamentInfo/scoring"
import { Standings } from "@/types/tournamentData/standings"
import setDocument from "@/lib/firestore/setDocument"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/navigation"
import RoundRobinTimetable from "@/lib/utils/roundRobinTimetable"
import { Schedule } from "@/types/tournamentData/schedule"
import CheckTournamentUrlExists from "@/lib/firestore/checkTournamentExists"
import generateRandomString from "@/lib/utils/generateRandomString"
import { Toast } from "./Toast"

export default function TournamentModal() {
	const router = useRouter()
	const { user } = useUser()
	const [tournamentName, setTournamentName] = useState("")
	const [contestants, setContestants] = useState<string[]>([])
	const [win, setWin] = useState<number | null>(null)
	const [draw, setDraw] = useState<number | null>(null)
	const [loss, setLoss] = useState<number | null>(null)
	const [disabled, setDisabled] = useState<boolean>(true)
	const [invalidContestants, setInvalidContestants] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const [showToast, setShowToast] = useState(false)

	const generateTournamentURL = () => {
		return `${tournamentName
			.trimEnd()
			.replace(/\s+/g, "-")}-${generateRandomString(5)}`
	}

	useEffect(() => {
		if (
			!tournamentName ||
			!contestants ||
			(win === 0 ? false : !win) ||
			(draw === 0 ? false : !draw) ||
			(loss === 0 ? false : !loss) ||
			invalidContestants
		) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [tournamentName, contestants, win, draw, loss, invalidContestants])

	const handleInvalidContestantsCheck = (contestants: string[]) => {
		if (
			contestants.length < 4 ||
			contestants.length > 8 ||
			contestants.includes("") ||
			contestants.length !== new Set(contestants).size
		) {
			setInvalidContestants(true)
		} else {
			setInvalidContestants(false)
		}
	}

	async function handleCreateTournament(
		event: FormEvent<HTMLFormElement>
	): Promise<void> {
		event.preventDefault()
		setSubmitting(true)

		setShowToast(true)

		if (!user) return

		let tournamentURL = generateTournamentURL()
		let tournamentExists = await CheckTournamentUrlExists(tournamentURL)

		while (tournamentExists) {
			tournamentURL = generateTournamentURL()
			tournamentExists = await CheckTournamentUrlExists(tournamentURL)
		}

		const scoring: Scoring = {
			win: win!,
			draw: draw!,
			loss: loss!,
		}

		const tournament: Tournament = {
			name: tournamentName,
			contestants: contestants,
			scoring: scoring,
			user_id: user.sub!,
		}

		const resultInfo = await setDocument(
			"tournamentInfo",
			tournamentURL,
			tournament
		)

		const standings: Standings = {
			table: contestants.map((contestant) => {
				return {
					name: contestant,
					wins: 0,
					draws: 0,
					losses: 0,
					points: 0,
				}
			}),
		}

		const resultStandings = await setDocument(
			"tournamentStandings",
			tournamentURL,
			standings
		)

		const schedule: Schedule = RoundRobinTimetable(contestants)

		const resultSchedule = await setDocument(
			"tournamentSchedule",
			tournamentURL,
			schedule
		)

        setShowToast(false)
        


		if (resultInfo && resultSchedule && resultStandings) {
			router.push(`/tournament/${tournamentURL}`)
		} else {
			alert("Error createing the tournament. Please try again.")
		}
	}

	function handleModalClose() {
		setTournamentName("")
		setContestants([])
		setWin(null)
		setDraw(null)
		setLoss(null)
        setInvalidContestants(false)
        setDisabled(true)
        setSubmitting(false)
	}

	return (
		<>
			<article>
				<label
					className="btn btn-primary"
					htmlFor="modal-3">
					Create New Tournament
				</label>
				<input
					className="modal-state"
					id="modal-3"
					type="checkbox"
					onClick={handleModalClose}
				/>
				<div className="modal">
					<label className="modal-overlay"></label>
					<div className="modal-content flex w-full flex-col gap-5 p-7">
						<label
							htmlFor="modal-3"
							className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</label>
						<div className="flex flex-col gap-2">
							<h2 className="text-center text-xl font-semibold">
								Enter Tournament Details
							</h2>
						</div>
						<form onSubmit={handleCreateTournament}>
							<section>
								<div className="form-group">
									<div className="form-field">
										<label className="form-label">
											Tournament Name
										</label>
										<input
											required
											autoFocus
											placeholder="Chess Tournament..."
											type="text"
											className="input max-w-full"
											value={tournamentName}
											onChange={(e) =>
												setTournamentName(
													e.target.value
												)
											}
										/>
									</div>
									<div className="form-field">
										<label
											className={`form-label ${
												invalidContestants
													? "text-error"
													: ""
											}`}>
											Contestants
										</label>
										<div className="form-control">
											<textarea
												required
												className={`textarea max-w-full ${
													invalidContestants
														? "textarea-error"
														: ""
												}`}
												rows={4}
												placeholder="One contestant per line"
												value={contestants.join("\n")}
												onChange={(e) => {
													const contestantsArray =
														e.target.value.split(
															"\n"
														)
													setContestants(
														contestantsArray
													)
													handleInvalidContestantsCheck(
														contestantsArray
													)
												}}
											/>
										</div>
										<label className="form-label">
											<span
												className={`form-label-alt ${
													invalidContestants
														? "text-error"
														: ""
												}`}>
												Enter 4 to 8 unique contestants
												with no empty lines.
											</span>
										</label>
									</div>
									<div className="form-field">
										<label className="form-label">
											<span>Scoring (win/draw/loss)</span>
										</label>
										<div className="form-control justify-between">
											<input
												required
												type="number"
												step={0.5}
												className="input w-1/3"
												placeholder="Win"
												value={
													win === 0 ? 0 : win || ""
												}
												onChange={(e) =>
													setWin(
														e.target.value === "0"
															? 0
															: parseFloat(
																	e.target
																		.value
															  )
													)
												}
											/>
											<input
												required
												type="number"
												step={0.5}
												className="input w-1/3"
												placeholder="Draw"
												value={
													draw === 0 ? 0 : draw || ""
												}
												onChange={(e) =>
													setDraw(
														e.target.value === "0"
															? 0
															: parseFloat(
																	e.target
																		.value
															  )
													)
												}
											/>
											<input
												required
												type="number"
												step={0.5}
												className="input w-1/3"
												placeholder="Loss"
												value={
													loss === 0 ? 0 : loss || ""
												}
												onChange={(e) =>
													setLoss(
														e.target.value === "0"
															? 0
															: parseFloat(
																	e.target
																		.value
															  )
													)
												}
											/>
										</div>
									</div>
									<div className="form-field pt-5">
										<div className="form-control justify-between">
											<button
												type="submit"
												className="btn btn-primary w-full"
												disabled={
													disabled || submitting
												}>
												Create Tournament
											</button>
										</div>
									</div>
								</div>
							</section>
						</form>
					</div>
				</div>
			</article>
			{showToast && (
				<Toast
					type="warning"
					message="Creating your tournament..."
				/>
			)}
		</>
	)
}
