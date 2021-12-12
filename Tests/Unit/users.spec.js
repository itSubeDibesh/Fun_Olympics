import Config from '../../Config/Http.js';

const
    User = Config.Db_Collection.User,
    DummyEntryData = {
        email: 'amockData@ismt.edu.np',
        country: 'NP',
        role: "User"
    },
    DummyUpdateData = {
        email: 'amockData@ismt.edu.np',
        country: 'UK',
        role: "Admin"
    }

describe('User - CRUD 🛠🎯🧪', () => {
    describe.skip("User - Create ➕", () => {
        it.skip('should create a new user', () => {
            return User
                .set(DummyEntryData.email, DummyEntryData)
                .then(
                    user => {
                        expect(user).not.toBeNull();
                        expect(user).toHaveProperty('_writeTime')
                    }
                )
        })
    })
    describe("User - Read 📖", () => {
        it("should return all the user data", () => {
            return User
                .get()
                .then(data => {
                    const dataset = data.docs
                    expect(dataset).not.toBeNull()
                })
        })
        it("should return user by email", () => {
            return User
                .getByDoc('email').then(data => {
                    const dataset = data.data
                    expect(dataset['email']).not.toBeNull()
                })
        })
        it.skip("fetch user data using respective email", () => {
            return User
                .getByQuery('email', '==', 'amockData@ismt.edu.np')
                .then(users => {
                    expect(users.docs[0].data().email).toEqual('amockData@ismt.edu.np')
                })
        })
    })
    describe.skip("User - Update 🔧", () => {
        it.skip('should update existing user', () => {
            return User
                .set(DummyUpdateData.email, DummyUpdateData)
                .then(
                    user => {
                        expect(user).not.toBeNull();
                        expect(user).toHaveProperty('_writeTime')
                    }
                )
        })
    })
    describe.skip("User - Delete ❌", () => {
        it.skip('should delete field from user', () => {
            return User
                .deleteField(DummyUpdateData.email, 'country')
                .then(user => {
                    expect(user).not.toBeNull();
                    expect(user).toHaveProperty('_writeTime')
                })
        })
        it.skip('should delete existing user', () => {
            return User
                .deleteDoc(DummyUpdateData.email)
                .then(
                    user => {
                        expect(user).not.toBeNull();
                        expect(user).toHaveProperty('_writeTime')
                    }
                )
        })
    })
});
