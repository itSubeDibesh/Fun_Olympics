import Config from '../../Config/Http.js';

const
    Comments = Config.Db_Collection.Comments,
    DummyEntryData = {
        comment: 'This is a dummy comment',
        email: 'dummyEmail@gmail.com',
        hasProfanity: false,
        video_id: 'tMPWEcciRoA',
        title: 'Dummy Title',
    };

describe.skip('Comments - CRUD 🛠🎯🧪', () => {
    describe.skip("Comments - Create ➕", () => {
        it.skip('should create a new comments', () => {
            return Comments
                .add(DummyEntryData)
                .then(
                    Comments => {
                        expect(Comments).not.toBeNull()
                    }
                )
        })
    })
    describe.skip("Comments - Read 📖", () => {
        it.skip("should return all the comments data", () => {
            return Comments
                .get()
                .then(Comments => {
                    const dataset = Comments.docs
                    expect(dataset).not.toBeNull()
                })
        })
        it.skip("should return Comments by comment", () => {
            return Comments
                .getByDoc('comment').then(Comments => {
                    const dataset = Comments.data
                    expect(dataset['comment']).not.toBeNull()
                })
        })
        it.skip("fetch comments data using respective comment", () => {
            return Comments
                .getByQuery('comment', '==', DummyEntryData.comment)
                .then(Comments => {
                    expect(Comments.docs[0].data().comment).toEqual(DummyEntryData.comment)
                })
        })
    })
    describe.skip("Comments - Delete ❌", () => {
        it.skip('should delete existing comments', () => {
            return Comments
                .getByQuery('comment', '==', DummyEntryData.comment)
                .then(response => {
                    Comments
                        .deleteDoc(response.docs[0].id)
                        .then(
                            Comments => {
                                expect(Comments).not.toBeNull();
                                expect(Comments).toHaveProperty('_writeTime')
                            }
                        )
                })
        })
    })
});
