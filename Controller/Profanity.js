import Config from '../Config/Http.js';

const
    {
        express,
        isLoggedIn,
        HasAccess,
        dataSet,
        Db_Collection
    } = Config,
    // Setting Application Routes
    profanityRouter = express.Router(),
    Profanity = Db_Collection.Profanity;

profanityRouter.get('/profanity', isLoggedIn,
    HasAccess, (req, res) => {
        const success = req.session.success,
            error = req.session.error,
            warning = req.session.warning;
        req.session.success = null;
        req.session.error = null;
        req.session.warning = null;
        Profanity
            .get()
            .then(profanity => {
                let profanity_dataset = profanity.docs.map(element => {
                    return {
                        id: element.id,
                        word: element.data().word,
                    }
                })
                res.render('Pages/Profanity', dataSet({
                    title: 'Profanity',
                    success,
                    error,
                    warning,
                    profanity: profanity_dataset,
                    login: req.session.login,
                    status: req.session.status
                }));
            })
            .catch(err => {
                res.render('Pages/Profanity', dataSet({
                    title: 'Profanity',
                    error: err,
                    login: req.session.login,
                    status: req.session.status
                }));
            })
    });


profanityRouter.get('/profanity/:action', isLoggedIn,
    HasAccess, (req, res) => {
        const { action } = req.params;
        const { id } = req.query;
        if (action.toLowerCase() === 'add') {
            res.render('Pages/Profanity', dataSet({
                title: 'Profanity',
                action: 'Add',
                login: req.session.login,
                status: req.session.status
            }));
        }
        else if (action.toLowerCase() === 'edit') {
            // Fetch By Id And Send The Data
            Profanity
                .getByDoc(id)
                .then(profanity => {
                    const dataset = {
                        id: profanity.id,
                        word: profanity.data().word,
                    }
                    res.render('Pages/Profanity', dataSet({
                        title: 'Profanity',
                        action: 'Edit',
                        profanity: dataset,
                        login: req.session.login,
                        status: req.session.status
                    }));

                }).catch(err => {
                    req.session.error = err;
                    req.redirect('/profanity');
                })
        }
        else if (action.toLowerCase() === 'delete') {
            Profanity
                .deleteDoc(id)
                .then(() => {
                    req.session.success = { message: "Profanity Deleted Successfully" };
                    res.redirect('/profanity');
                })
                .catch(err => {
                    req.session.error = err;
                    res.redirect('/profanity');
                })
        }
        else {
            res.redirect('/profanity');
        }
    })

profanityRouter.post('/profanity/entry', isLoggedIn,
    HasAccess, (req, res) => {
        const { word, id, action } = req.body;
        if (action.toLowerCase() === 'add') {
            Profanity
                .add({ word })
                .then(() => {
                    req.session.success = { message: 'Profanity Added Successfully' };
                    res.redirect('/profanity');
                })
                .catch(err => {
                    req.session.error = err;
                    res.redirect('/profanity');
                });
        }

        if (action.toLowerCase() === 'edit') {
            Profanity
                .update(id, { word })
                .then(() => {
                    req.session.success = { message: "Profanity Updated Successfully" };
                    res.redirect('/profanity');
                })
                .catch(err => {
                    req.session.error = err;
                    res.redirect('/profanity');
                })
        }
    })


export default profanityRouter;