"use client"
import DeleteTournamentButton from "@/components/DeleteTournamentButton"
import EditTournamentButton from "@/components/EditTournamentButton"
import ShareTournamentButton from "@/components/ShareTournamentButton"
import { firestoreDB } from "@/lib/firebase"
import { Tournament } from "@/types/tournamentInfo/tournament"
import { useUser } from "@auth0/nextjs-auth0/client"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"

export default function TournamentListPage() {
	const { user, error, isLoading } = useUser()
	const [tournaments, setTournaments] = useState<
		{ id: string; data: Tournament }[]
	>([])
	const router = useRouter()

	const setupFirestoreListener = (user_id: string) => {
		const q = query(
			collection(firestoreDB, "tournamentInfo"),
			where("user_id", "==", user_id)
		)

		return onSnapshot(q, (querySnapshot: any) => {
			const updatedTournaments = querySnapshot.docs.map((doc: any) => {
				return {
					id: doc.id,
					data: doc.data(),
				}
			})
			setTournaments(updatedTournaments)
		})
	}

	useEffect(() => {
		if (user?.sub === undefined || user?.sub === null) return

		const unsubscribe = setupFirestoreListener(user.sub)

		return () => unsubscribe()
	}, [user?.sub])

	if (isLoading) return <Loading />
	if (error) return <div>Error! Please try again.</div>
	if (!user) router.push("/")

	return (
		user && (
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<nav className="menu p-4 rounded-md">
					<section className="menu-section">
						<span className="menu-title font-bold text-4xl mb-4">
							My Tournaments
						</span>
						<ul className="menu-items">
							{tournaments.length > 0 ? (
								tournaments.map((tournament, index) => (
									<li key={index}>
										<div className="divider"></div>
										<input
											type="checkbox"
											id={`menu-${index}`}
											className="menu-toggle"
										/>
										<label
											className="menu-item justify-between bg-gray-1"
											htmlFor={`menu-${index}`}>
											<span className="font-bold text-lg">
												{tournament.data.name}
											</span>

											<span className="menu-icon">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													className="w-4 h-4 stroke-content3">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M8.25 4.5l7.5 7.5-7.5 7.5"
													/>
												</svg>
											</span>
										</label>
										<div className="menu-item-collapse">
											<div className="min-h-0">
												<div>
													<label className="menu-item menu-item-no-animation ml-6">
														<span className="font-semibold">
															Contestants:
														</span>{" "}
														{tournament.data.contestants.join(
															", "
														)}
													</label>
												</div>
												<div>
													<label className="menu-item menu-item-no-animation ml-6">
														<span className="font-semibold">
															Scoring system:
														</span>{" "}
														Win:{" "}
														{
															tournament.data
																.scoring.win
														}
														, Draw:{" "}
														{
															tournament.data
																.scoring.draw
														}
														, Loss:{" "}
														{
															tournament.data
																.scoring.loss
														}
													</label>
												</div>
												<div className="flex justify-end pr-6">
													<EditTournamentButton
														params={{
															id: index,
															url: tournament.id,
														}}
													/>
													<ShareTournamentButton
														params={{
															url: tournament.id,
														}}
													/>
													<DeleteTournamentButton
														params={{
															id: index,
															url: tournament.id,
														}}
													/>
												</div>
											</div>
										</div>
									</li>
								))
							) : (
								<li>
									<p className="text-2xl font-bold mb-4">
										You have not created any tournaments yet
									</p>
									<button
										className="btn btn-primary"
										onClick={() => router.push("/")}>
										Home Page
									</button>
								</li>
							)}
						</ul>
					</section>
				</nav>
			</div>
		)
	)
}
