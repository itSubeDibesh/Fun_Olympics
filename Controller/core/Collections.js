import FireStore from "./FireStore_Access_Firebase.js";

export class User extends FireStore { constructor() { super('User'); } }
export class Role extends FireStore { constructor() { super('Role'); } }
export class Comments extends FireStore { constructor() { super('Comments'); } }
export class Video extends FireStore { constructor() { super('Video'); } }
export class Notice extends FireStore { constructor() { super('Notice'); } }
export class Reminder extends FireStore { constructor() { super('Reminder'); } }
export class Profanity extends FireStore { constructor() { super('Profanity'); } }
export class FAQ extends FireStore { constructor() { super('FAQ'); } }
