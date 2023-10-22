import { Session, getSession } from "@auth0/nextjs-auth0"

export default async function ProfilePage() {
	const session: Session | null | undefined = await getSession()
	const user = session?.user || {}

	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold mb-2">Profile Page</h1>
					<p className="mb-4">Username: {user.name}</p>
					<p className="mb-4">Email: {user.email}</p>
					<p
						className={`mb-4 ${
							user.email_verified
								? "text-green-500"
								: "text-red-500"
						}`}>
						Email verified: {user.email_verified.toString()}
					</p>
					<p className="mb-4">Updated at: {user.updated_at}</p>
				</div>
			</div>
		</div>
	)
}
