"use client"
import { firestoreDB } from "@/lib/firebase"
import MatchCard from "./MatchCard"
import { Schedule } from "@/types/tournamentData/schedule"
import { Scoring } from "@/types/tournamentInfo/scoring"
import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function MatchesSchedule({
	tournamentId,
	scoring,
	admin,
}: {
	tournamentId: string
	scoring: Scoring
	admin: boolean
}) {
	const [schedule, setSchedule] = useState<Schedule | null>(null)

	useEffect(() => {
		const docRef = doc(firestoreDB, "tournamentSchedule", tournamentId)

		const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				setSchedule(docSnapshot.data() as Schedule)
			} else {
				console.log("No such document!")
			}
		})
		return () => unsubscribe()
	}, [tournamentId])

	return (
		<div className="container mx-auto">
			<nav className="menu bg-gray-2 p-2 rounded-md">
				<section className="menu-section">
					{schedule &&
						schedule.rounds.map((round) => (
							<ul
								key={"round-" + round.roundNumber.toString()}
								className="menu-items text-center">
								<h2 className="text-2xl font-bold mb-2">
									Round {round.roundNumber}
								</h2>
								<li
									className={`menu-item ${
										admin ? "" : "menu-item-disabled"
									} flex flex-wrap justify-center`}>
										{round.matches.map((match) => (
											<MatchCard
												key={
													"round" +
													round.roundNumber.toString() +
													"-match" +
													match.matchNumber.toString()
												}
												match={match}
												tournamentId={tournamentId}
												scoring={scoring}
												roundNumber={round.roundNumber}
											/>
										))}
								</li>
								<div className="divider my-0"></div>
							</ul>
						))}
				</section>
			</nav>
		</div>
	)
}
