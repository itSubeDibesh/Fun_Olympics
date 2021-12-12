import Config from '../../Config/Http.js';

const
    Notice = Config.Db_Collection.Notice,
    DummyEntryData = {
        videoId:'tMPWEcciRoA',
        title:'Dummy Title',
        comment_type: 'Stream',
        date: new Date(),
        expire: new Date(),
        isLive: true,
        type: "Live",
        action: "Edit"
    };

describe('Notice - CRUD 🛠🎯🧪', () => {
    describe.skip("Notice - Create ➕", () => {
        it.skip('should create a new notice', () => {
            return Notice
                .set(DummyEntryData.videoId, DummyEntryData)
                .then(
                    notice => {
                        expect(notice).not.toBeNull();
                        expect(notice).toHaveProperty('_writeTime')
                    }
                )
        })
    })
    describe("Notice - Read 📖", () => {
        it("should return all the notice data", () => {
            return Notice
                .get()
                .then(data => {
                    const dataset = data.docs
                    expect(dataset).not.toBeNull()
                })
        })
        it("should return notice by videoId", () => {
            return Notice
                .getByDoc('videoId').then(data => {
                    const dataset = data.data
                    expect(dataset['videoId']).not.toBeNull()
                })
        })
    })
});
