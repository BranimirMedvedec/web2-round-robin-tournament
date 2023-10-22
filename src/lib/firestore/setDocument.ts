import { doc, setDoc } from "firebase/firestore"
import { firestoreDB } from "../firebase"

export default async function setDocument(
	colName: string,
	docId: string,
	data: any
) {
	try {
		await setDoc(doc(firestoreDB, colName, docId), data)
		return true
	} catch (error) {
		console.error("Error adding document: ", error)
		return false
	}
}
