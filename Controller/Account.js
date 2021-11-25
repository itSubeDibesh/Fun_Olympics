import Config from '../Config/Http.js';

// Setting Application Routes
const accountsRouter = Config.express.Router();
// Setting Firebase Auth
const auth = new Config.Admin_Firebase();

accountsRouter.get('/test', (req, res) => {
    auth.createUser('dsubedi@dsubedi.np','password','Cobra PinCol').then(userRecord=>{
        console.log('Successfully created new user:', userRecord.uid);  
    })
    .catch(error=>{
        console.log('Error creating new user:', error);
    });
    res.send('test');
});

export default accountsRouter;