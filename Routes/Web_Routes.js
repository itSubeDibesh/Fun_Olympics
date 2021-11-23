import Authorization from '../Controller/Authorization.js'
import Settings from '../Controller/Settings.js'

export default class Web_Routes {
    constructor(Application) {
        Application.use('/', Authorization);
        Application.use('/', Settings);
    }
}