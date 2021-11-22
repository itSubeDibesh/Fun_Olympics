export default{
    ifEquals: function(a, b, options) {
        if (a === b) return options.fn(this);
        return options.inverse(this);
    },
    ifNotEquals: function(a, b, options) {
        if (a !== b) return options.fn(this);
        return options.inverse(this);
    },
    SN: function(value, options) {
        return parseInt(value + 1);
    },
    ToUpper: function(value, options) {
        return value.toString().toUpperCase();
    },
    ToFirstUpper: function(value, options) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}