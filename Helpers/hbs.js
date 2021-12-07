import {Privilege} from '../Middleware/config/Permission.js'

export default {
    ifEquals: function (a, b, options) {
        if (a == b) return options.fn(this);
        return options.inverse(this);
    },
    ifNotEquals: function (a, b, options) {
        if (a != b) return options.fn(this);
        return options.inverse(this);
    },
    SN: function (value, options) {
        return parseInt(value + 1);
    },
    ToUpper: function (value, options) {
        return value.toString().toUpperCase();
    },
    ToFirstUpper: function (value, options) {
        return value[0].toUpperCase() + value.slice(1);
    },
    ToString: function (value, options) {
        return value.toString();
    },
    FirstWord: function (value, options) {
        value = value.toString();
        const split_name = value.split(' ')[0];
        return split_name[0].toUpperCase() + split_name.slice(1);
    },
    EmailSplit: function (value, options) {
        value = value.toString();
        const split_email = value.split('@')[0];
        return split_email[0].toUpperCase() + split_email.slice(1);;
    },
    Includes: function (privilege, user_privilege, options) {
        const user = Privilege[user_privilege];
        if (user.includes(privilege)) return options.fn(this);
        return options.inverse(this);
    }
}