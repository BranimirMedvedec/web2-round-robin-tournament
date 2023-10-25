import { deleteDoc, doc } from "firebase/firestore"
import { firestoreDB } from "../firebase"

export default async function deleteDocument(colName: string, docId: string) {
	try {
		await deleteDoc(doc(firestoreDB, colName, docId))
	} catch (error) {
		// console.error("Error removing document: ", error)
        return null
	}
}
