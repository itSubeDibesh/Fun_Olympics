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
    Reminder = Db_Collection.Reminder,
    // Setting Application Routes
    noticeRouter = express.Router();

noticeRouter.get('/notice', HasAccess, isLoggedIn, (req, res) => {
    Notice.get()
        .then( notice=> {
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
                    notice_data
                }));
            })
        .then(err => {
            res.render('Pages/Notice', dataSet({
                title: 'Notice',
                login: req.session.login,
                status: req.session.status,
                error: err
            }));
        })
});



export default noticeRouter;