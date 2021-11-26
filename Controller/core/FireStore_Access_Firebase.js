import FIREBASE_ADMIN from './Firebase_Core.js'

export default class FireStore extends FIREBASE_ADMIN {
    /**
     * Creates an instance of FireStore.
     * @param {string} collectionName
     * @memberof FireStore
     */
    constructor(collectionName) {
        super()
        this.collectionName = collectionName
        this.firestore = this.getFirestore()
        this.collection = this.firestore.collection(this.collectionName)
    }

    /**
     * @param {object} data
     * @return {Promise} 
     * @memberof FireStore
     */
    add(data) {
        data.createdAt = this.FieldValue.serverTimestamp()
        return this.collection.add(data)
    }

    update(docId, data) {
        data.updatedAt = this.FieldValue.serverTimestamp()
        return this.collection.doc(docId).update(data)
    }

    deleteDoc(docId) {
        return this.collection.doc(docId).delete()
    }

    deleteField(docId, fieldName) {
        return this.collection.doc(docId).update({
            [fieldName]: this.FieldValue.delete()
        })
    }

    getByDoc(docId) {
        return this.collection.doc(docId).get()
    }

    get(){
        return this.collection.get()
    }

    getByQuery(field, condition, value) {
        return this.collection.where(field, condition, value).get()
    }

}
