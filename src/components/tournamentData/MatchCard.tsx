import React, { useEffect, useState, useRef, useCallback } from "react"
import { MouseEvent } from "react"
import updateMatch from "@/lib/firestore/updateMatch"
import { Scoring } from "@/types/tournamentInfo/scoring"
import { Match } from "@/types/tournamentData/match"
import { Player } from "@/types/tournamentData/player"

export default function MatchCard({
	match,
	tournamentId,
	scoring,
	roundNumber,
}: {
	match: Match
	tournamentId: string
	scoring: Scoring
	roundNumber: number
}) {
	const [winner, setWinner] = useState<Player["name"] | undefined>(undefined)
	const [draw, setDraw] = useState<boolean>(false)
	const [disabled, setDisabled] = useState<boolean>(false)
	const matchRef = useRef<Match | null>(null)

	useEffect(() => {
		if (match.player1 === "BYE" || match.player2 === "BYE") {
			setDisabled(true)
		}

		if (match.winner !== undefined) {
			setWinner(match.winner)
		} else if (match.draw === true) {
			setDraw(match.draw)
		}

		matchRef.current = { ...match }
	}, [match])

	const updateMatchFunction = useCallback(
		async (updatedMatch: Match) => {
			await updateMatch(
				"tournamentSchedule",
				tournamentId,
				roundNumber,
				updatedMatch,
				scoring
			)
		},
		[tournamentId, roundNumber, scoring]
	)

	useEffect(() => {
		if (matchRef.current) {
			const updatedMatch = { ...matchRef.current }
			let hasChanged = false

			if (winner) {
				updatedMatch.winner = winner
				delete updatedMatch.draw
				hasChanged = true
			} else if (draw) {
				updatedMatch.draw = draw
				delete updatedMatch.winner
				hasChanged = true
			} else if (winner === undefined && !draw) {
				delete updatedMatch.winner
				delete updatedMatch.draw
				hasChanged = true
			}

			if (hasChanged) {
				updateMatchFunction(updatedMatch)
			}
		}
	}, [winner, draw, updateMatchFunction])

	const handleWinnerChange = (player: Player["name"]) => {
		if (winner === player) {
			setWinner(undefined)
		} else {
			setDraw(false)
			setWinner(player)
		}
	}

	const handleDrawChange = (result: boolean) => {
		if (result === draw) {
			setDraw(false)
		} else {
			setDraw(result)
			setWinner(undefined)
		}
	}

	const drawButtonStyle = () => {
		if (draw) {
			return "btn-warning checked:!btn-warning"
		}
	}

	return (
		<div className="card rounded-lg shadow-md">
			<div className="card-body text-lg font-bold flex flex-col">
				<div className="flex flex-row justify-between">
					<span>{match.player1}</span>
					<div className="flex flex-col">
						<div className="btn-group btn-group-scrollable">
							<input
								type="radio"
								name="options"
								data-content="W"
								className={`btn btn-sm ${
									winner && winner === match.player1
										? "btn-success checked:!btn-success"
										: ""
								}`}
								onClick={() =>
									handleWinnerChange(match.player1)
								}
								disabled={disabled}
							/>

							<input
								type="radio"
								name="options"
								data-content="D"
								className={`btn btn-sm ${drawButtonStyle()}`}
								onClick={() => handleDrawChange(true)}
								disabled={disabled}
							/>
							<input
								type="radio"
								name="options"
								data-content="L"
								className={`btn btn-sm ${
									winner && winner !== match.player1
										? "btn-error checked:!btn-error"
										: ""
								}`}
								onClick={() =>
									handleWinnerChange(match.player2)
								}
								disabled={disabled}
							/>
						</div>
					</div>
				</div>
				<div className="divider divider-horizontal">VS</div>
				<div className="flex flex-row justify-between">
					<p>{match.player2}</p>
					<div className="flex flex-col">
						<div className="btn-group btn-group-scrollable">
							<input
								type="radio"
								name="options"
								data-content="W"
								className={`btn btn-sm ${
									winner && winner === match.player2
										? "btn-success checked:!btn-success"
										: ""
								}`}
								onClick={() =>
									handleWinnerChange(match.player2)
								}
								disabled={disabled}
							/>
							<input
								type="radio"
								name="options"
								data-content="D"
								className={`btn btn-sm ${drawButtonStyle()}`}
								onClick={() => handleDrawChange(true)}
								disabled={disabled}
							/>
							<input
								type="radio"
								name="options"
								data-content="L"
								className={`btn btn-sm ${
									winner && winner !== match.player2
										? "btn-error checked:!btn-error"
										: ""
								}`}
								onClick={() =>
									handleWinnerChange(match.player1)
								}
								disabled={disabled}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
