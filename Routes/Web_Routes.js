import Authorization from '../Controller/Authorization.js'
import Settings from '../Controller/Settings.js'
import Accounts from '../Controller/Account.js'
import Stream from '../Controller/Stream.js'
import Notice from '../Controller/Notice.js'
import Users from '../Controller/Users.js'

export default class Web_Routes {
    constructor(Application) {
        Application.use('/', Authorization);
        Application.use('/', Settings);
        Application.use('/', Accounts);
        Application.use('/', Stream);
        Application.use('/', Notice);
        Application.use('/', Users);
    }
}