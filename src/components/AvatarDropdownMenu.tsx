import { getSession, Session } from "@auth0/nextjs-auth0"
import Image from "next/image"
import Link from "next/link"

export default async function AvatarDropdownMenu() {
	const session: Session | null | undefined = await getSession()
	const user = session?.user || {}

	return (
		Object.keys(user).length !== 0 && (
			<div className="relative z-10">
				<div className="fixed top-4 right-4">
					<div className="avatar avatar-ring avatar-md">
						<div className="dropdown-container">
							<div className="dropdown dropdown-hover">
								<label
									className="btn btn-ghost flex cursor-pointer px-0 hover:bg-inherit"
									tabIndex={parseInt("0")}>
									<Image
										src={user.picture}
										alt="avatar"
										width="24"
										height="24"
									/>
								</label>
								<div className="dropdown-menu dropdown-menu-bottom-left">
									<Link
										href="/"
										className="dropdown-item text-sm">
										Home page
									</Link>
									<Link
										href="/profile"
										className="dropdown-item text-sm">
										My profile
									</Link>
									<Link
										href="/tournament/list"
										className="dropdown-item text-sm">
										My tournaments
									</Link>
									<Link
										href="/api/auth/logout"
										tabIndex={parseInt("-1")}
										className="dropdown-item text-sm btn-outline-warning">
										Logout
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	)
}
