import { get_role_permission, Privilege, Roles, Access } from './config/Permission.js'

function HasAccess(req, res, next) {
    let { path } = req.route
    if (req.session.role != undefined) {
        let permission = get_role_permission(req.session.role)
        if (permission) {
            if (permission.routes.includes(path)) {
                next()
            } else {
                req.session.error = { "message": 'You do not have permission to access this page!' };
                res.redirect('/');
            }
        } else {
            req.session.error = { "message": 'You do not have permission to access this page!' };
            res.redirect('/');
        }
    } else {
        req.session.error = { "message": 'You do not have permission to access this page!' };
        res.redirect('/');
    }
}

export {
    HasAccess,
    get_role_permission,
    Privilege, Roles, Access
}