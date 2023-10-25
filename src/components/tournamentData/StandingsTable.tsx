"use client"
import { firestoreDB } from "@/lib/firebase"
import updateStandings from "@/lib/firestore/updateStandings"
import { Schedule } from "@/types/tournamentData/schedule"
import { Standings } from "@/types/tournamentData/standings"
import { Scoring } from "@/types/tournamentInfo/scoring"
import { doc, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StandingsTable({
	tournamentId,
	scoring,
}: {
	tournamentId: string
	scoring: Scoring
}) {
	const [standings, setStandings] = useState<Standings | null>(null)
	const router = useRouter()

	useEffect(() => {
		const docRef = doc(firestoreDB, "tournamentSchedule", tournamentId)

		const unsubscribe = onSnapshot(docRef, async (docSnapshot) => {
			if (docSnapshot.exists()) {
				const schedule = docSnapshot.data() as Schedule
				const newStandings = updateStandings(schedule, scoring)
				setStandings(await newStandings)
			} else {
				// console.log("No such document!")
				router.push("/404")
			}
		})
		return () => unsubscribe()
	}, [router, scoring, tournamentId])

	return (
		<div className="flex w-full overflow-x-auto">
			<table className="table-zebra table">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Points</th>
						<th>Wins</th>
						<th>Draws</th>
						<th>Losses</th>
					</tr>
				</thead>
				<tbody>
					{standings &&
						standings.table.map((player, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{player.name}</td>
								<td>{player.points}</td>
								<td>{player.wins}</td>
								<td>{player.draws}</td>
								<td>{player.losses}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}
