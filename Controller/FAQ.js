import Config from '../Config/Http.js';

const {
    express,
    HasAccess,
    isLoggedIn,
    dataSet,
    check,
    validationResult,
    Db_Collection
} = Config,
    // Setting Application Routes
    faqRouter = express.Router(),
    FAQ = Db_Collection.FAQ;

// HasAccess
faqRouter.get('/faq', HasAccess, (req, res) => {
    let mode = "Minor"
    // Redirect to According to Privilege
    if (req.session.login != undefined) {
        if (req.session.login.roleDetails.includes("Moderate"))
            mode = "Moderate"
    }
    else mode = "Minor"
    FAQ
        .get()
        .then(faqs => {
            const dataset = faqs.docs.map(faq => {
                return {
                    id: faq.id,
                    question: faq.data().question,
                    answer: faq.data().answer
                }
            });

            const success = req.session.success,
                error = req.session.error,
                warning = req.session.warning;
            req.session.success = null;
            req.session.error = null;
            req.session.warning = null;

            res.render('Pages/FAQ', dataSet({
                title: 'FAQ',
                login: req.session.login,
                status: req.session.status,
                mode,
                success,
                error,
                warning,
                faq: dataset
            }));
        })
        .catch(err => {
            const error = { message: err.message };
            req.session.error = error;
            res.render('Pages/FAQ', dataSet({
                title: 'FAQ',
                login: req.session.login,
                status: req.session.status,
                mode,
                error: req.session.error
            }));
        });
});

faqRouter.get('/faq/:action', HasAccess, isLoggedIn, (req, res) => {
    const { action } = req.params;
    const { id } = req.query;
    if (action.toLowerCase() == "add") {
        res.render('Pages/FAQ-AddEdit', dataSet({
            title: 'FAQ Editor',
            action: 'Add',
            login: req.session.login,
            status: req.session.status,
        }))
    } else if (action.toLowerCase() == "edit") {
        FAQ
            .getByDoc(id)
            .then(faq => {
                const dataset = {
                    id: faq.id,
                    question: faq.data().question,
                    answer: faq.data().answer
                }
                res.render('Pages/FAQ-AddEdit', dataSet({
                    title: 'FAQ Editor',
                    action: 'Edit',
                    faq: dataset,
                    login: req.session.login,
                    status: req.session.status,
                }))
            }).catch(err => {
                const error = { message: err.message };
                req.session.error = error;
                res.redirect('/faq');
            })

    } else if (action.toLowerCase() == "view") {
        FAQ
            .getByDoc(id)
            .then(faq => {
                const dataset = {
                    id: faq.id,
                    question: faq.data().question,
                    answer: faq.data().answer
                }
                res.render('Pages/FAQ-AddEdit', dataSet({
                    title: 'FAQ Editor',
                    action: 'View',
                    faq: dataset,
                    login: req.session.login,
                    status: req.session.status,
                }))
            })
            .catch(err => {
                const error = { message: err.message };
                req.session.error = error;
                res.redirect('/faq');
            })
    } else {
        res.redirect('/faq')
    }
})

faqRouter.post('/faq/entry', HasAccess, isLoggedIn, [
    check('question').isLength({ min: 10 }).withMessage('Question is required'),
    check('answer').isLength({ min: 10 }).withMessage('Answer is required')
], (req, res) => {
    const { question, answer, action, id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('Pages/FAQ-AddEdit', dataSet({
            title: 'FAQ Editor',
            action: action,
            errors: errors.array(),
            login: req.session.login,
            status: req.session.status,
        }))
    } else {
        if (action.toLowerCase() == 'add') {
            FAQ
                .add({
                    question,
                    answer
                })
                .then(() => {
                    req.session.success = { "message": "Fun Olympics: FAQ Added Successfully!" };
                    res.redirect('/faq');
                })
                .catch(err => {
                    req.session.validation = err;
                    res.redirect('/faq');
                });
        } else if (action.toLowerCase() == 'edit') {
            FAQ
                .update(id, {
                    question,
                    answer
                })
                .then(() => {
                    req.session.success = { "message": "Fun Olympics: FAQ Updated Successfully!" };
                    res.redirect('/faq');
                })
                .catch(err => {
                    req.session.error = err;
                    res.redirect('/faq');
                });
        } else {
            res.redirect('/faq');
        }
    }
})

faqRouter.get('/faq/delete/:id', HasAccess, isLoggedIn, (req, res) => {
    const { id } = req.params;
    if (id) {
        FAQ
            .deleteDoc(id)
            .then(() => {
                req.session.success = { "message": "Fun Olympics: FAQ Deleted Successfully!" };
                res.redirect('/faq');
            })
            .catch(err => {
                req.session.error = err;
                res.redirect('/faq');
            });
    } else {
        res.redirect('/faq');
    }
})

export default faqRouter;