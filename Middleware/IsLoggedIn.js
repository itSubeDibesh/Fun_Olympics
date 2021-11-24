export default function isLoggedIn(req, res, next) {
    if (req.session.login == undefined) {
        req.session.error = { "message": 'Unauthorized, Please Login first!' };
        res.redirect('/login');
    } else {
        if(req.session.status == "LoggedIn"){
            next();
        }else{
            req.session.error = { "message": 'Invalid login credentials!' };
            res.redirect('/login');
        }
    }
}