import Config from '../Config/Http.js';

// Setting Application Routes
const profanityRouter = Config.express.Router();

profanityRouter.get('/profanity', Config.isLoggedIn, Config.HasAccess, (req, res) => {
    res.render('Pages/Profanity', Config.dataSet({ title: 'Profanity', login: req.session.login, status: req.session.status }));
});

export default profanityRouter;