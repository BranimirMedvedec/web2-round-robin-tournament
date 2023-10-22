import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { UserProvider } from "@auth0/nextjs-auth0/client"
import AvatarDropdownMenu from "@/components/AvatarDropdownMenu"
import { Suspense } from "react"
import Loading from "@/components/Loading"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Round Robin Tournament",
	description: "Round Robin Tournament Web App by Branimir Medvedec",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<UserProvider>
				<body className={inter.className}>
					<AvatarDropdownMenu />
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</body>
			</UserProvider>
		</html>
	)
}
