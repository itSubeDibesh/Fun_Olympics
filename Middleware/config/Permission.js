const
    Roles = {
        Guest: {
            name: "GUEST",
            value: "Guest",
            description: "Guest User",
        },
        User: {
            name: "USER",
            value: "User",
            description: "Normal User",
        },
        Admin: {
            name: "ADMIN",
            value: "Admin",
            description: "Administrator User",
        },
        Developer: {
            name: "DEVELOPER",
            value: "Developer",
            description: "Core Developer User",
        },
    }, Privilege = {
        Guest: ["Minor"],
        User: ["Minor", "Basic"],
        Admin: ["Minor", "Basic", "Moderate"],
        Developer: ["Minor", "Basic", "Moderate", "Advanced"],
    }, Access = [
        {
            path: "/",
            name: "home",
            methods: ["GET"],
            type: ["Minor"],
        },
        {
            path: "/login",
            name: "login",
            methods: ["GET", "POST"],
            type: ["Minor"],
        },
        {
            path: "/logout",
            name: "logout",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/register",
            name: "register",
            methods: ["GET", "POST"],
            type: ["Minor"],
        },
        {
            path: "/reset",
            name: "reset",
            methods: ["GET", "POST"],
            type: ["Minor"],
        },
        {
            path: "/dashboard",
            name: "dashboard",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/settings",
            name: "settings",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/email/verify",
            name: "verify",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/email/reset_logged_in",
            name: "reset_logged_in",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/profile/update",
            name: "profile_update",
            methods: ["POST"],
            type: ["Basic"],
        },
        {
            path: "/stream",
            name: "stream",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/stream/initial",
            name: "stream",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/stream/comment",
            name: "stream",
            methods: ["POST"],
            type: ["Basic"],
        },
        {
            path: "/stream/reminder",
            name: "stream",
            methods: ["POST"],
            type: ["Basic"],
        },
        {
            path: "/stream/comment",
            name: "stream",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/stream/comment/delete",
            name: "stream",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/stream/editor",
            name: "stream_editor",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/stream/editor/:action",
            name: "stream_editor",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/stream/editor/entry",
            name: "stream_editor",
            methods: ["POST"],
            type: ["Moderate"],
        },
        {
            path: "/notice",
            name: "notice",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/notice/delete",
            name: "notice",
            methods: ["GET"],
            type: ["Basic"],
        },
        {
            path: "/users",
            name: "users",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/users/reset",
            name: "users_reset",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/users/:action",
            name: "users_action",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/users/entry",
            name: "users_entry",
            methods: ["POST"],
            type: ["Moderate"],
        },
        {
            path: "/users/user/delete",
            name: "users_user_delete",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/faq",
            name: "faq",
            methods: ["GET"],
            type: ["Minor"],
        },
        {
            path: "/faq/:action",
            name: "faq_action",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/faq/entry",
            name: "faq_entry",
            methods: ["POST"],
            type: ["Moderate"],
        },
        {
            path: "/faq/delete/:id",
            name: "faq_delete",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/profanity",
            name: "profanity",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/profanity/:action",
            name: "profanity_action",
            methods: ["GET"],
            type: ["Moderate"],
        },
        {
            path: "/profanity/entry",
            name: "profanity_entry",
            methods: ["POST"],
            type: ["Moderate"],
        },
        {
            path: "*",
            name: "not_found",
            methods: ["GET"],
            type: ["Minor"],
        },
    ];

function get_role_permission(role = "Admin") {
    const
        role_details = Roles[role],
        privilege_details = Privilege[role];
    let user_permission = {
        details: role_details,
        routes: [],
        access_list: [],
        privilege: privilege_details
    };
    privilege_details.forEach(privilege => {
        Access.forEach(access => {
            if (access.type.includes(privilege)) {
                user_permission.routes.push(access.path)
                user_permission.access_list.push(access)
            }
        })
    })
    return user_permission || null;
}

export {
    get_role_permission,
    Roles,
    Privilege,
    Access
}
