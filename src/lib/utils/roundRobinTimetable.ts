import { Schedule } from "@/types/tournamentData/schedule"
import { Round } from "@/types/tournamentData/round"
import { Match } from "@/types/tournamentData/match"
import { Player } from "@/types/tournamentData/player"

export default function RoundRobinTimetable(contestants: string[]) {
	const rounds: Round[] = []

	if (contestants.length % 2 !== 0) {
		contestants.push("BYE")
	}

	for (let i = 0; i < contestants.length - 1; i++) {
		const matches: Match[] = []
		for (let j = 0; j < contestants.length / 2; j++) {
			const player1: Player = {
				name: contestants[j],
				wins: 0,
				losses: 0,
				draws: 0,
				points: 0,
			}
			const player2: Player = {
				name: contestants[contestants.length - 1 - j],
				wins: 0,
				losses: 0,
				draws: 0,
				points: 0,
			}

			const match: Match = {
				matchNumber: j + 1,
				player1: player1.name,
				player2: player2.name,
			}

			matches.push(match)
		}

		const round: Round = {
			roundNumber: i + 1,
			matches,
		}

		rounds.push(round)

		contestants.splice(1, 0, contestants.pop() as string)
	}

	const schedule: Schedule = {
		rounds,
	}

	return schedule
}
