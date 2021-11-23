import Config from '../Config/Http.js';

const settingsRouter = Config.express.Router();

function dataSet(data) {
    data.app_name = Config.app_name;
    return data;
}

settingsRouter.get('/Settings', (req, res) => {
    res.render('Pages/Settings', dataSet({ title: 'Settings' }));
});

export default settingsRouter;