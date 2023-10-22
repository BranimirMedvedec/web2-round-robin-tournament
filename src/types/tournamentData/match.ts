import { Player } from "./player"

export type Match = {
	matchNumber: number
	player1: Player["name"]
	player2: Player["name"]
	winner?: Player["name"]
	draw?: boolean
}
