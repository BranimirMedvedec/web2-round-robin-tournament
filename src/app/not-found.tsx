import Link from "next/link"

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
			<p className="text-lg mb-8">Could not find requested resource</p>
			<Link
				href="/"
				className="text-blue-500 hover:underline">
				Return Home
			</Link>
		</div>
	)
}
