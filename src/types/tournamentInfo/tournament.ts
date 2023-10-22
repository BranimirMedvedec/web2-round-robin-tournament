import { Scoring } from "./scoring"

export type Tournament = {
	name: string
	contestants: string[]
	scoring: Scoring
	user_id: string
}
