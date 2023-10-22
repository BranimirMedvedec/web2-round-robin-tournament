import AvatarDropdownMenu from "./AvatarDropdownMenu"

export default function Drawer() {
	return (
		<div className="flex justify-end">
			<input
				type="checkbox"
				id="drawer-right"
				className="drawer-toggle"
			/>

			<label
				htmlFor="drawer-right"
				className="btn btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</label>
			<label
				className="overlay"
				htmlFor="drawer-right"></label>
			<div className="drawer drawer-right">
				<div className="drawer-content pt-10 flex flex-col h-full">
					<label
						htmlFor="drawer-right"
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						✕
					</label>
					<AvatarDropdownMenu />
				</div>
			</div>
		</div>
	)
}
