import Config from '../Config/Http.js';

const
    {
        express,
        isLoggedIn,
        HasAccess,
        dataSet,
        extractVideoID,
        has_profanity,
        Db_Collection
    } = Config,
    // Setting Application Routes
    streamRouter = express.Router(),
    {
        Video,
        Comments,
        Profanity,
        Reminder,
        Notice
    } = Db_Collection,
    Stream = Video;

streamRouter
    .get('/stream', isLoggedIn, HasAccess, (req, res) => {
        const success = req.session.success,
            error = req.session.error,
            warning = req.session.warning;
        req.session.success = null;
        req.session.error = null;
        req.session.warning = null;
        let profanity_dataset = []
        Profanity
            .get()
            .then(profanity => {
                const pf = profanity.docs
                for (let index = 0; index < pf.length; index++) {
                    const element = pf[index].data();
                    profanity_dataset.push(element.word)
                }
                req.session.profanity_dataset = profanity_dataset
                res.render('Pages/Stream', dataSet({
                    title: 'Stream',
                    login: req.session.login,
                    status: req.session.status,
                    notice_length: req.session.notice_length,
                    success,
                    error,
                    warning
                }));
            })
    });

streamRouter.post('/stream/comment', isLoggedIn, HasAccess, (req, res) => {
    const data = req.body;
    const { profanity_dataset, login } = req.session;
    const hasProfanity = has_profanity(data.comment, profanity_dataset)
    Comments.add({
        comment: data.comment,
        video_id: data.video_id,
        title: data.title,
        hasProfanity,
        email: login.user.email,
    })
        .then(() => {
            res.send({ status: true })
        })
        .catch(err => {
            res.send({ status: false })
        })
})

streamRouter.get('/stream/comment', isLoggedIn, HasAccess, (req, res) => {
    const { video_id } = req.query;
    Comments
        .getByQuery('video_id', '==', video_id, 'createdAt', 'desc')
        .then(comments => {
            const mapped_comments = comments.docs.map(comment => {
                return {
                    comment: comment.data().comment,
                    video_id: comment.data().video_id,
                    title: comment.data().title,
                    hasProfanity: comment.data().hasProfanity,
                    email: comment.data().email,
                    createdAt: comment.data().createdAt.toDate()
                }
            })
            res.send({ status: true, comments: mapped_comments })
        })
        .catch(err => {
            res.send({ status: false, message: 'Something went wrong' })
        })
})

streamRouter.get('/stream/initial', isLoggedIn, HasAccess, (req, res) => {
    Promise
        .all([
            // Get Streams
            Stream.get(),
            // Reminder Data
            Reminder.get(),
        ])
        .then(([
            StreamData,
            ReminderData
        ]) => {
            const stream_data = StreamData.docs.map(stream => {
                return {
                    id: stream.data()._id,
                    title: stream.data().title,
                    category: stream.data().category,
                    isLive: stream.data().isLive,
                    type: stream.data().type,
                    videoId: stream.data().videoId,
                    date: stream.data().date,
                }
            })
            const reminder_data = ReminderData.docs.map(reminder => {
                return {
                    id: reminder.data()._id,
                    title: reminder.data().title,
                    type: reminder.data().type,
                    videoId: reminder.data().video_id,
                    date: reminder.data().date,
                    email: reminder.data().email
                }})

            res.send({
                StreamData: stream_data,
                ReminderData: reminder_data
            })
        })
})

streamRouter
    .get('/stream/editor', isLoggedIn, HasAccess, (req, res) => {
        Promise
            .all([
                Stream.get(),
                Comments.get()
            ])
            .then(([stream, comments]) => {
                const stream_data = stream.docs.map(stream => {
                    return {
                        id: stream.id,
                        title: stream.data().title,
                        videoId: stream.data().videoId,
                        date: stream.data().date,
                        type: stream.data().type,
                        category: stream.data().category,
                        isLive: stream.data().isLive,
                    }
                });
                // Comment Mapping
                const comment_data = comments.docs.map(comment => {
                    return {
                        id: comment.id,
                        comment: comment.data().comment,
                        video_id: comment.data().video_id,
                        title: comment.data().title,
                        hasProfanity: comment.data().hasProfanity,
                        email: comment.data().email,
                        createdAt: comment.data().createdAt.toDate()
                    }
                })

                const success = req.session.success,
                    error = req.session.error,
                    warning = req.session.warning;
                req.session.success = null;
                req.session.error = null;
                req.session.warning = null;
                res.render('Pages/Stream-Editor', dataSet({
                    title: 'Stream Editor',
                    login: req.session.login,
                    status: req.session.status,
                    notice_length: req.session.notice_length,
                    success,
                    error,
                    warning,
                    stream: stream_data,
                    comment: comment_data
                }));
            })
            .catch(err => {
                res.render('Pages/Stream-Editor', dataSet({
                    title: 'Stream Editor',
                    login: req.session.login,
                    status: req.session.status,
                    notice_length: req.session.notice_length,
                    error: err
                }));
            })
    });

streamRouter.get('/stream/comment/delete', isLoggedIn, HasAccess, (req, res) => {
    const { id } = req.query;
    Comments
        .deleteDoc(id)
        .then(() => {
            Notice.deleteDoc(id)
            req.session.success = { message: "Comment Deleted Successfully" };
            res.redirect('/stream/editor');
        })
        .catch(err => {
            req.session.error = err;
            res.redirect('/stream/editor');
        })
})

streamRouter
    .get('/stream/editor/:action', isLoggedIn, HasAccess, (req, res) => {
        const { action } = req.params;
        const { id } = req.query;
        if (action.toLowerCase() === 'add') {
            res.render('Pages/Stream-AddEdit', dataSet({
                title: 'Stream Editor',
                action: 'Add',
                login: req.session.login,
                notice_length: req.session.notice_length,
                status: req.session.status
            }));
        }
        else if (action.toLowerCase() === 'edit') {
            // Fetch By Id And Send The Data
            Stream
                .getByDoc(id)
                .then(stream => {
                    const dataset = {
                        id: stream.id,
                        title: stream.data().title,
                        videoId: stream.data().videoId,
                        date: stream.data().date,
                        type: stream.data().type,
                        category: stream.data().category,
                        isLive: stream.data().isLive,
                    }
                    res.render('Pages/Stream-AddEdit', dataSet({
                        title: 'Stream Editor',
                        action: 'Edit',
                        stream: dataset,
                        notice_length: req.session.notice_length,
                        login: req.session.login,
                        status: req.session.status
                    }));

                }).catch(err => {
                    req.session.error = err;
                    req.redirect('/stream/editor');
                })
        }
        else if (action.toLowerCase() === 'delete') {
            Stream
                .deleteDoc(id)
                .then(() => {
                    Notice.deleteDoc(id)
                    req.session.success = { message: "Stream Deleted Successfully" };
                    res.redirect('/stream/editor');
                })
                .catch(err => {
                    req.session.error = err;
                    res.redirect('/stream/editor');
                })
        }
        else {
            res.redirect('/stream/editor');
        }
    })

streamRouter.post('/stream/reminder', isLoggedIn, HasAccess, (req, res) => {
    const data = req.body;
    const {login} = req.session;
    Promise.all([
        Reminder.add({
            title: data.title,
            date: data.date,
            video_id: data.video_id,
            type: data.type,
            email: login.user.email,
        }),
        Notice.add({
            title: data.title,
            date: data.date,
            video_id: data.video_id,
            type: data.type,
            email: login.user.email,
            comment_type: 'Reminder',
            expire: data.date,
        })
    ])
    .then(()=>{
        res.send({status: true, message: 'Reminder Added Successfully'})
    })
    .catch(err => {
        res.send({status: false, message: "Something Went Wrong"})
    })
})


streamRouter
    .post('/stream/editor/entry', isLoggedIn, HasAccess, (req, res) => {
        const { id, title, link, isLive, date, category, type, action } = req.body;
        if (action.toLowerCase() === 'add') {
            const videoId = extractVideoID(link);
            Stream
                .set(videoId, {
                    title,
                    videoId,
                    date,
                    category,
                    type,
                    isLive: isLive === 'on' ? true : false
                }).then(() => {
                    Notice.set(videoId, {
                        action: 'Add',
                        comment_type: 'Stream',
                        videoId: videoId,
                        expire: new Date().toISOString().split('T')[0],
                        title,
                        date,
                        type,
                        isLive: isLive === 'on' ? true : false
                    })
                    req.session.success = { message: "Stream Added Successfully" };
                    res.redirect('/stream/editor');
                }).catch(err => {
                    req.session.error = err;
                    res.redirect('/stream/editor');
                })
        } else if (action.toLowerCase() === 'edit') {
            const videoId = extractVideoID(link);
            Stream
                .set(id, {
                    title,
                    videoId,
                    date,
                    category,
                    type,
                    isLive: isLive === 'on' ? true : false
                })
                .then(() => {
                    Notice.set(videoId, {
                        action: 'Edit',
                        comment_type: 'Stream',
                        videoId: videoId,
                        expire: new Date().toISOString().split('T')[0],
                        title,
                        date,
                        type,
                        isLive: isLive === 'on' ? true : false
                    })
                    req.session.success = { message: "Stream Edited Successfully" };
                    res.redirect('/stream/editor');
                }
                ).catch(err => {
                    req.session.error = err;
                    res.redirect('/stream/editor');
                })
        }
    })


export default streamRouter;