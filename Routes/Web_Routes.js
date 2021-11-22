import Authorization from '../Controller/Authorization.js'

export default class Web_Routes {
    constructor(Application) {
        Application.use('/', Authorization);
    }
}