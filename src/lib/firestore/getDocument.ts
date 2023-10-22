import { doc, getDoc } from "firebase/firestore"
import { firestoreDB } from "../firebase"

export default async function getDocument(colName: string, docId: string) {
	try {
		const docRef = doc(firestoreDB, colName, docId)
		const docSnap = await getDoc(docRef)

		if (docSnap.exists()) {
			return docSnap.data()
		} else {
			console.log("No such document!")
		}
	} catch (error) {
		console.error("Error getting document:", error)
	}
}
