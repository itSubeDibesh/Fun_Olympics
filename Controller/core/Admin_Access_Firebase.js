import FIREBASE_ADMIN from "./Firebase_Core.js"

export default class Admin_Access extends FIREBASE_ADMIN {
    constructor() {
        super()
        this.auth = this.getAuth()
    }

    createUser(email, password, displayName, phoneNumber) {
        return this.auth.createUser({
            email: email,
            password: password,
            displayName: displayName,
            phoneNumber: phoneNumber,
            disabled: false,
            emailVerified: false
        })
    }

    updateUser(uid, displayName, phoneNumber=null, disabled = false) {
        return this.auth.updateUser(uid, {
            displayName: displayName,
            phoneNumber: phoneNumber,
            disabled: disabled,
        })
    }

    deleteUser(uid) {
        return this.auth.deleteUser(uid)
    }

    /**
     * @param {array} uids
     * @return {Promise} 
     * @memberof Admin_Access
     */
    deleteMultiUsers(uids) {
        return this.auth.deleteUsers(uids)
    }

    getUser(uid) {
        return this.auth.getUser(uid)
    }

    getUserByEmail(email) {
        return this.auth.getUserByEmail(email)
    }

    getUserByPhoneNumber(phoneNumber) {
        return this.auth.getUserByPhoneNumber(phoneNumber)
    }

    getUserByProviderId(providerId) {
        return this.auth.getUserByProviderId(providerId)
    }

    listAllUsers(nextPageToken) {
        return this.auth.listUsers(1000, nextPageToken)
    }

}