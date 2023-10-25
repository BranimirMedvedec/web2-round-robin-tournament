import { Match } from "@/types/tournamentData/match"
import { firestoreDB } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Round } from "@/types/tournamentData/round"
import { Schedule } from "@/types/tournamentData/schedule"
import { Scoring } from "@/types/tournamentInfo/scoring"

export default async function updateMatch(
	colName: string,
	docId: string,
	roundNumber: number,
	match: Match,
	scoring: Scoring
) {
	const matchesRef = doc(firestoreDB, colName, docId)

	try {
		const matchesData = await getDoc(matchesRef)
		if (!matchesData.exists()) throw new Error("No such document!")

		const updatedRounds: Round[] = [...matchesData.data().rounds]
		updatedRounds[roundNumber - 1].matches[match.matchNumber - 1] = match

		const schedule: Schedule = { rounds: updatedRounds }

		await setDoc(matchesRef, schedule)
	} catch (error) {
		// console.log(error)
		return null
	}
}
