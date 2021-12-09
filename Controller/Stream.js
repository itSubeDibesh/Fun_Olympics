import Config from '../Config/Http.js';

const
    {
        express,
        isLoggedIn,
        HasAccess,
        dataSet,
        random_number,
        extractVideoID,
        Db_Collection
    } = Config,
    // Setting Application Routes
    streamRouter = express.Router(),
    {
        Video,
        User,
        Comment,
        Profanity,
        Reminder,
        Notice
    } = Db_Collection,
    Stream = Video;

streamRouter
    .get('/stream', (req, res) => {
        Stream
            .get()
            .then(stream => {
                let stream_data = stream.docs.map(stream => {
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
                const success = req.session.success,
                    error = req.session.error,
                    warning = req.session.warning;
                req.session.success = null;
                req.session.error = null;
                req.session.warning = null;
                res.render('Pages/Stream', dataSet({
                    title: 'Stream',
                    login: req.session.login,
                    status: req.session.status,
                    success,
                    error,
                    warning,
                    stream: stream_data,
                    play: stream_data[random_number(0, stream_data.length - 1)],
                }));
            })
            .catch(err => {
                res.render('Pages/Stream', dataSet({
                    title: 'Stream',
                    login: req.session.login,
                    status: req.session.status,
                    error: err
                }));
            })
    });

streamRouter
    .get('/stream/editor', (req, res) => {
        Stream
            .get()
            .then(stream => {
                let stream_data = stream.docs.map(stream => {
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
                    success,
                    error,
                    warning,
                    stream: stream_data
                }));
            })
            .catch(err => {
                res.render('Pages/Stream-Editor', dataSet({
                    title: 'Stream Editor',
                    login: req.session.login,
                    status: req.session.status,
                    error: err
                }));
            })
    });

streamRouter
    .get('/stream/editor/:action', (req, res) => {
        const { action } = req.params;
        const { id } = req.query;
        if (action.toLowerCase() === 'add') {
            res.render('Pages/Stream-AddEdit', dataSet({
                title: 'Stream Editor',
                action: 'Add',
                login: req.session.login,
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


streamRouter
    .post('/stream/editor/entry', (req, res) => {
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