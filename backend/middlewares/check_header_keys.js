const { Validator } = require('node-input-validator');
const helper = require('../helpers/helper');
const response = require('../helpers/response');

module.exports = {
    authenticateHeader: async function (req, res, next) {
        const v = new Validator(req.headers, {
            secret_key: 'required|string',
            publish_key: 'required|string'
        });

        let errorsResponse = await helper.checkValidation(v)

        if(errorsResponse){
            return response.failed(res, 'Data is not valid!')
        }

        if((req.headers.secret_key !== process.env.ENC_SECRET_KEY) || (req.headers.publish_key !== process.env.ENC_PUBLISH_KEY)){
            return response.failed(res,'Something went wrong!!')
        }
        next();
    }
}