import Config from '../Config/Http.js';

const
    {
        express,
        HasAccess,
        isLoggedIn,
        dataSet,
        Db_Collection
    } = Config,
    Notice = Db_Collection.Notice,
    // Setting Application Routes
    noticeRouter = express.Router();

noticeRouter.get('/notice', HasAccess, isLoggedIn, (req, res) => {
    Notice.get()
        .then(notice => {
            let notice_length = 0;
            notice_length = notice.docs.length
            if (notice_length > 0) {
                for (let index = 0; index < notice.docs.length; index++) {
                    if (notice.docs[index].data().email != undefined) {
                        notice_length -= 1
                    }
                }
            }

            req.session.notice_length = notice_length

            const notice_data = notice.docs.map(item => {
                return {
                    id: item._id,
                    comment_type: item.data().comment_type,
                    action: item.data().action,
                    date: item.data().date,
                    email: item.data().email,
                    expire: item.data().expire,
                    title: item.data().title,
                    type: item.data().type,
                    video_id: item.data().video_id,
                }
            })
            res.render('Pages/Notice', dataSet({
                title: 'Notice',
                login: req.session.login,
                status: req.session.status,
                notice_length: req.session.notice_length,
                notice_data
            }));
        })
        .catch(err => {
            res.render('Pages/Notice', dataSet({
                title: 'Notice',
                login: req.session.login,
                status: req.session.status,
                error: err
            }));
        })
});



export default noticeRouter;