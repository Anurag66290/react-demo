const crypto = require('crypto');

module.exports = {
    checkValidation: async (v) => {
        var errorsResponse
        await v.check().then(function (matched) {
            if (!matched) {
                var valdErrors=v.errors;
                var respErrors=[];
                Object.keys(valdErrors).forEach(function(key) {
                    if(valdErrors && valdErrors[key] && valdErrors[key].message){
                        respErrors.push(valdErrors[key].message);
                    }
                });   
                // errorsResponse=respErrors.join(', ');
                errorsResponse=respErrors.length > 0 ? respErrors[0] : '';
            }
        });
        return errorsResponse;
    },

    unixTimestamp: function () {
        var time = Date.now();
        var n = time / 1000;
        return time = Math.floor(n);
    },

    create_auth() {
        try {
            let current_date = (new Date()).valueOf().toString();
            let random = Math.random().toString();
            return crypto.createHash('sha1').update(current_date + random).digest('hex');
        } catch (err) {
            throw err;
        }
    },
}