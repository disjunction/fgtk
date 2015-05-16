var util = {};

util.removeOneFromArray= function(one, array) {
    for (var i =0 ; i < array.length; i++) {
        if (array[i] == one) {
            return array.splice(i, 1);
        }
    }
};

module.exports = util;
