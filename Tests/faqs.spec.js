import Config from '../Config/Http.js';

const
    FAQ = Config.Db_Collection.FAQ,
    DummyEntryData = {
        question: 'aAa',
        answer: `Creating user is easy. Just follow the steps below.
                        1. Go to the admin panel.
                        2. Click on the "Users" tab.
                        3. Click on the "Add User" button.
                        4. Fill in the form.
                        5. Click on the "Save" button.
                        6. You will be redirected to the "Users" tab.
                        7. You will see the new user in the list.
                    `
    },
    DummyUpdateData = {
        question: 'aAa',
        answer: `Creating user is easy. Just follow the steps below to create new user.
                        1. Go to the admin panel.
                    `
    };

describe('FAQ - CRUD 🛠🎯🧪', () => {
    describe("FAQ - Create ➕", () => {
        it('should create a new faq', () => {
            return FAQ
                .set(DummyEntryData.question, DummyEntryData)
                .then(
                    faq => {
                        expect(faq).not.toBeNull();
                        expect(faq).toHaveProperty('_writeTime')
                    }
                )
        })
    })
    describe("FAQ - Read 📖", () => {
        it("should return all the faq data", () => {
            return FAQ
                .get()
                .then(faq => {
                    const dataset = faq.docs
                    expect(dataset).not.toBeNull()
                })
        })
        it("should return faq by question", () => {
            return FAQ
                .getByDoc('question').then(faq => {
                    const dataset = faq.data
                    expect(dataset['question']).not.toBeNull()
                })
        })
        it("fetch faq data using respective question", () => {
            return FAQ
                .getByQuery('question', '==', DummyUpdateData.question)
                .then(faq => {
                    expect(faq.docs[0].data().question).toEqual(DummyUpdateData.question)
                })
        })
    })
    describe("FAQ - Update 🔧", () => {
        it('should update existing faq', () => {
            return FAQ
                .set(DummyUpdateData.question, DummyUpdateData)
                .then(
                    faq => {
                        expect(faq).not.toBeNull();
                        expect(faq).toHaveProperty('_writeTime')
                    }
                )
        })
    })
    describe("FAQ - Delete ❌", () => {
        it('should delete existing faq', () => {
            return FAQ
                .deleteDoc(DummyUpdateData.question)
                .then(
                    faq => {
                        expect(faq).not.toBeNull();
                        expect(faq).toHaveProperty('_writeTime')
                    }
                )
        })
    })
});
