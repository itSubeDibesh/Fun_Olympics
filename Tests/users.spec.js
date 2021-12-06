import Config from  '../Config/Http.js';

const User = Config.Db_Collection.User


describe("User - Data Fetch", () => {
    it("Should Return all the User Data", ()=>{
        return User.get().then(data => {
            const dataset = data.docs
            expect(dataset).not.toBeNull()
        })
    })
    it("Should return User By Email", ()=>{
        return User.getByDoc('email').then(data => {
            const dataset = data.data
            expect(dataset['email']).not.toBeNull()
        })
    })
    it("Fetch User Data Using Respective Email", () => {
        return User.getByQuery('email', '==', 'dsubedi@ismt.edu.np').then(users => {
            expect(users.docs[0].data().email).toEqual('dsubedi@ismt.edu.np')
        })
    })
})