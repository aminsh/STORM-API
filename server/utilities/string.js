module.exports = {
    isNullOrEmpty: function (str) {
        if (!str) return true;

        if (str.length === 0) return true;

        if (!str.trim()) return true;

        return false;
    }
}