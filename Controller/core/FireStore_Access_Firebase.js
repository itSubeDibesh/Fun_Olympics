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
        this.fsCollection = this.firestore.collection
        this.fsDoc = this.firestore.doc
    }

    /**
     * @param {object} data
     * @return {Promise} 
     * @memberof FireStore
     * @deprecated This method is deprecated. Use set() instead.
     */
    add(data) {
        data.createdAt = this.FieldValue.serverTimestamp()
        return this.collection.add(data)
    }

    /**
     * @param {String} uniqueDocId
     * @param {Object} data
     * @param {String} [method="add"||'update'] 
     * @return {Promise} 
     * @memberof FireStore
     */
    set(uniqueDocId, data, method = "add") {
        if(method.toLowerCase() == "add")
            data.createdAt = this.FieldValue.serverTimestamp()
        else 
            data.updatedAt = this.FieldValue.serverTimestamp()
        return this.collection.doc(uniqueDocId).set(data)
    }

    /**
     * @param {*} docId
     * @param {*} data
     * @return {*} 
     * @memberof FireStore
     * @deprecated This method is deprecated. Use set() instead.
     */
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
    
    observe(docId, callback) {
        return this.collection.doc(docId).onSnapshot(callback)
    }

    observeByQuery(field, condition, value, callback) {
        return this.collection.where(field, condition, value).onSnapshot(callback)
    }

    observeAll(callback) {
        return this.collection.onSnapshot(callback)
    }

    detach(docId) {
        return this.collection.doc(docId).onSnapshot(() => {})
    }

    detachByQuery(field, condition, value) {
        return this.collection.where(field, condition, value).onSnapshot(() => {})
    }

    detachAll() {
        return this.collection.onSnapshot(() => {})
    }

}
