import Config from '../Config/Http.js';

// Setting Application Routes
const faqRouter = Config.express.Router();

faqRouter.get('/faq', (req, res) => {
    res.render('Pages/FAQ', Config.dataSet({ title: 'FAQ', login: req.session.login, status: req.session.status }));
});

export default faqRouter;