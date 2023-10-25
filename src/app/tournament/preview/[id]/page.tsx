"use client"
import ShareTournamentButton from "@/components/ShareTournamentButton"
import EditTournamentButton from "@/components/EditTournamentButton"
import MatchesSchedule from "@/components/tournamentData/MatchesSchedule"
import StandingsTable from "@/components/tournamentData/StandingsTable"
import getDocument from "@/lib/firestore/getDocument"
import { Tournament } from "@/types/tournamentInfo/tournament"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"

export default function TournamentPreviewPage({
	params,
}: {
	params: { id: string }
}) {
	const { user } = useUser()
	const id = decodeURIComponent(params.id)
	const [tournament, setTournament] = useState<Tournament | undefined>(
		undefined
	)
	const router = useRouter()

	const admin = user?.sub === tournament?.user_id

	useEffect(() => {
		getDocument("tournamentInfo", id)
			.then((tournament) => {
				if (!tournament) {
					router.push("/404")
				}
				setTournament(tournament as Tournament)
			})
			.catch((err) => {
				// console.log(err)
				router.push("/404")
			})
	}, [id, router])

	return (
		tournament && (
			<div className="container mx-auto px-4 py-6">
				<div className="p-6">
					<h1 className="text-3xl font-bold mb-4">Tournament page</h1>
					{tournament ? (
						<div className="rounded-md shadow-lg p-6 bg-gray-2">
							<div className="flex justify-between">
								<h2 className="text-xl font-bold mb-2">
									{tournament.name}
								</h2>
								{admin && (
									<div>
										<ShareTournamentButton
											params={{ url: id }}
										/>
										<EditTournamentButton
											params={{ id: 1, url: id }}
										/>
									</div>
								)}
							</div>
							<p className="mb-2">
								<span className="font-semibold">
									Scoring system:
								</span>{" "}
								Win: {tournament.scoring.win} pts, Draw:{" "}
								{tournament.scoring.draw} pts, Loss:{" "}
								{tournament.scoring.loss} pts
							</p>
							<p>
								<span className="font-semibold">
									Contestants:
								</span>{" "}
								{tournament.contestants.join(", ")}
							</p>
						</div>
					) : (
						<p className="text-red-500">
							Could not find tournament
						</p>
					)}
				</div>

				<div className="p-6">
					<h1 className="text-3xl font-bold mb-4">Schedule</h1>
					<MatchesSchedule
						tournamentId={id}
						scoring={tournament.scoring}
					/>
				</div>

				<div className="p-6">
					<h2 className="text-3xl font-bold mb-4">Standings</h2>
					<StandingsTable
						tournamentId={id}
						scoring={tournament.scoring}
					/>
				</div>
			</div>
		)
	)
}
