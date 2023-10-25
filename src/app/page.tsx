"use client"
import Link from "next/link"
import CreateTournamentModal from "@/components/CreateTournamentModal"
import { useUser } from "@auth0/nextjs-auth0/client"
import Loading from "@/components/Loading"

export default function Home() {
	const { user, error, isLoading } = useUser()

	if (isLoading) return <Loading />
	if (error) return <div>Error! Please try again.</div>

	return user ? (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="container mx-auto py-8 text-center">
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">
						Web2: Round Robin Tournament
					</h1>
					<h2 className="text-xl mb-4">Welcome, {user.name}!</h2>
				</div>
				<div className="flex flex-col justify-center items-center my-20">
					<p className="text-gray-500 my-2 w-2/3">
						To create a new tournament, click the button below. To
						view and edit your existing tournaments, click the
						avatar in the top right corner.
					</p>
					<CreateTournamentModal />
				</div>
			</div>
		</div>
	) : (
		<div className="flex flex-col items-center justify-center h-screen text-center">
			<h1 className="text-4xl font-bold mb-8">
				Web2: Round Robin Tournament
			</h1>

			<div>
				<h2 className="text-xl mb-4">
					To get started, create a new account or login!
				</h2>
				<h3 className="text-lg">
					<Link
						href="/api/auth/login"
						className="text-blue-500 hover:underline">
						<button className="btn btn-outline-primary">
							Login
						</button>
					</Link>
				</h3>
			</div>
		</div>
	)
}
