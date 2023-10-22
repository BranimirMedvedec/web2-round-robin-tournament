import { Schedule } from "@/types/tournamentData/schedule"
import { Player } from "@/types/tournamentData/player"
import { Standings } from "@/types/tournamentData/standings"
import { Scoring } from "@/types/tournamentInfo/scoring"

export default async function updateStandings(
	schedule: Schedule,
	scoring: Scoring
): Promise<Standings> {
	const findPlayer = (playerName: string) => {
		return (
			table.find((player) => player.name === playerName) || {
				name: playerName,
				wins: 0,
				draws: 0,
				losses: 0,
				points: 0,
			}
		)
	}

	const table: Player[] = []

	schedule.rounds.forEach((round) => {
		round.matches.forEach((match) => {
			if (match.player1 === "BYE" || match.player2 === "BYE") return

			const player1 = findPlayer(match.player1)
			const player2 = findPlayer(match.player2)

			if (match.winner === match.player1) {
				player1.wins += 1
				player2.losses += 1
			} else if (match.winner === match.player2) {
				player1.losses += 1
				player2.wins += 1
			} else if (match.draw) {
				player1.draws += 1
				player2.draws += 1
			}

			if (!table.includes(player1)) table.push(player1)
			if (!table.includes(player2)) table.push(player2)
		})
	})

	table.forEach((player) => {
		player.points =
			player.wins * scoring.win +
			player.draws * scoring.draw +
			player.losses * scoring.loss
	})

	table.sort((a, b) => {
		if (a.points === b.points) {
			return a.name.localeCompare(b.name)
		} else {
			return b.points - a.points
		}
	})

	return {
		table: table,
	}
}
