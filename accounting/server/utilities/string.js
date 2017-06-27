module.exports = {
    isNullOrEmpty: function (str) {
        if (!str) return true;

        if (str.length === 0) return true;

        if (!str.trim()) return true;

        return false;
    },
    isSmallerThan3Chars(str){
        if(!str) return false;

        return str.length < 3;
    }
};