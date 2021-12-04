//  Server Dependencies
import config from './Config/Http.js'
import helmet from 'helmet'
import xss from 'xss-clean'
import rate_limit from 'express-rate-limit'
import expressHBS from "express-handlebars";
import helpers from './Helpers/hbs.js'
import Web_Routes from './Routes/Web_Routes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import session from 'express-session'

// Extracting directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Creating Server Instance
var Application = config.express()

// Disabling X-Powered-By Header
Application.disable('x-powered-by')

// Preventing XSS
Application.use(xss())

// Preventing Brute Force Attacks
Application.use(rate_limit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5000 // limit each IP to 5000 requests per windowMs
}))

// Setting up Helmet
Application.use(helmet())

// Setting up Handlebars
const hbs = expressHBS.create({
    helpers: helpers,
    extname: '.hbs',
    defaultLayout: 'Main',
    layoutsDir: __dirname + '/Views/Layouts/',
    partialsDir: __dirname + '/Views/Partials/'
})

// Setting Cors options
Application.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

var MemoryStore = session.MemoryStore;

// Setting Session
Application.use(session({
    name : 'app.sid',
    secret: config.secret,
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
}))

// Parsing Url Encoded Data
Application.use(config.express.urlencoded({extended: true}))

// Parsing Json Data
Application.use(config.express.json())

// Setting up Static Folder
Application.use(config.express.static(__dirname + '\\Public'))
// Extracting Static Folder
const nodeModulePath = __dirname + '\\node_modules\\'
const StaticPaths = {
    "css":['bootstrap\\dist\\css','bootstrap-icons\\font'],
    "js":['bootstrap\\dist\\js'],
    'vendors':['lightbox2\\dist']
}
StaticPaths['css'].forEach(path => {
    Application.use('/css/',config.express.static(nodeModulePath + path))
})
StaticPaths['js'].forEach(path => {
    Application.use('/js/',config.express.static(nodeModulePath + path))
})
StaticPaths['vendors'].forEach(path => {
    Application.use('/vendors/',config.express.static(nodeModulePath + path))
})

// Setting up View Engine
Application.engine('hbs', hbs.engine)
Application.set('view engine', 'hbs')

// Setting up Routes
new Web_Routes(Application)

// The 404 Route (ALWAYS Keep this as the last route)
Application.get('*', (req, res) => {
    res.status(404)
    .send({ status: !1, status_code: 404, response: 'Page not found' })
})

// Starting Server
Application.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}, http://localhost:${config.port}`)
})

export default Application