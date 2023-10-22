import getDocument from "@/lib/firestore/getDocument"
import { Tournament } from "@/types/tournamentInfo/tournament"
import MatchesSchedule from "@/components/tournamentData/MatchesSchedule"
import StandingsTable from "@/components/tournamentData/StandingsTable"
import { Session, getSession } from "@auth0/nextjs-auth0"
import ShareButton from "@/components/ShareButton"

export default async function TournamentPage({
	params,
}: {
	params: { id: string }
}) {
	const session: Session | null | undefined = await getSession()
	const user = session?.user || {}

	const tournament: Tournament | undefined = (await getDocument(
		"tournamentInfo",
		params.id
	)) as Tournament

	const admin = user.sub === tournament.user_id

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-4">Tournament page</h1>
				{tournament ? (
					<div className="rounded-md shadow-lg p-6 bg-gray-2">
						<div className="flex justify-between">
							<h2 className="text-xl font-bold mb-2">
								{tournament.name}
							</h2>
							{admin && <ShareButton url={params.id} />}
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
							<span className="font-semibold">Contestants:</span>{" "}
							{tournament.contestants.join(", ")}
						</p>
					</div>
				) : (
					<p className="text-red-500">Could not find tournament</p>
				)}
			</div>

			<div className="p-6">
				<h1 className="text-3xl font-bold mb-4">Schedule</h1>
				<MatchesSchedule
					tournamentId={params.id}
					scoring={tournament.scoring}
					admin={admin}
				/>
			</div>

			<div className="p-6">
				<h2 className="text-3xl font-bold mb-4">Standings</h2>
				<StandingsTable
					tournamentId={params.id}
					scoring={tournament.scoring}
				/>
			</div>
		</div>
	)
}
