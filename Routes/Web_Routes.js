import Authorization from '../Controller/Authorization.js'
import Settings from '../Controller/Settings.js'
import Accounts from '../Controller/Account.js'

export default class Web_Routes {
    constructor(Application) {
        Application.use('/', Authorization);
        Application.use('/', Settings);
        Application.use('/', Accounts);
    }
}