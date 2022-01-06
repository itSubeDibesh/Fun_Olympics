import Config from '../../Config/Http.js';

const
    FAQ = Config.Db_Collection.FAQ,
    DummyEntryData = {
        question: 'a mock test',
        answer: `Creating user is easy. Just follow the steps below.
                        1. Go to the admin panel.
                    `
    },
    DummyUpdateData = {
        question: 'a mock test',
        answer: `Creating user is easy. Just follow the steps below to create new user.
                        1. Go to the admin panel.
                        2. Click on the "Users" tab.
                        3. Click on the "Add User" button.
                        4. Fill in the form.
                        5. Click on the "Save" button.
                        6. You will be redirected to the "Users" tab.
                        7. You will see the new user in the list.
                    `
    };

describe.skip('FAQ - CRUD 🛠🎯🧪', () => {
    describe.skip("FAQ - Create ➕", () => {
        it.skip('should create a new faq', () => {
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
    describe.skip("FAQ - Read 📖", () => {
        it.skip("should return all the faq data", () => {
            return FAQ
                .get()
                .then(faq => {
                    const dataset = faq.docs
                    expect(dataset).not.toBeNull()
                })
        })
        it.skip("should return faq by question", () => {
            return FAQ
                .getByDoc('question').then(faq => {
                    const dataset = faq.data
                    expect(dataset['question']).not.toBeNull()
                })
        })
        it.skip("fetch faq data using respective question", () => {
            return FAQ
                .getByQuery('question', '==', DummyUpdateData.question)
                .then(faq => {
                    expect(faq.docs[0].data().question).toEqual(DummyUpdateData.question)
                })
        })
    })
    describe.skip("FAQ - Update 🔧", () => {
        it.skip('should update existing faq', () => {
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
    describe.skip("FAQ - Delete ❌", () => {
        it.skip('should delete existing faq', () => {
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
