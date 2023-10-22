import { doc, getDoc } from "firebase/firestore"
import { firestoreDB } from "../firebase"

export default async function CheckTournamentUrlExists(tournamentUrl: string) {
	const tournamentRef = doc(firestoreDB, "tournamentInfo", tournamentUrl)
	const docSnap = await getDoc(tournamentRef)

	if (docSnap.exists()) {
		return true
	} else {
		return false
	}
}
