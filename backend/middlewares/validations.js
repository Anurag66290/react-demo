const { Validator } = require('node-input-validator');
const helper = require('../helpers/helper')
const response = require('../helpers/response')


module.exports = {
    encryptionForSkPk: async function (req, res, next) {
        const v = new Validator(req.headers, {
            secret_key: 'required|string',
            publish_key: 'required|string'
        });

        let errorsResponse = await helper.checkValidation(v)

        if (errorsResponse) {
            return response.failed(res, 'Data is not valid!')
        }
        next();
    },

    file_upload: async function (req, res, next) {
        let v = new Validator( req.body, {
            type: 'required|in:image,video,pdf', 
            folder: 'required|string', 
        });
        let errorsResponse = await helper.checkValidation(v)

        if(errorsResponse){
            return response.failed(res, errorsResponse)
        }
        if (req.files == null) {
            return response.failed(res, "Please select image")
        }
        next();
    },

    sign_up: async function (req, res, next) {
        let v = new Validator( req.body, {
            first_name: 'required', 
            last_name: 'required', 
            email: 'required|email', 
            password: 'required',
            // profile_image: 'required',
        });
        let errorsResponse = await helper.checkValidation(v)

        if(errorsResponse){
            return response.failed(res, errorsResponse)
        }
        next();
    },

    login: async function (req, res, next) {
        let v = new Validator( req.body, {
            email: 'required|email', 
            password: 'required'
        });
        let errorsResponse = await helper.checkValidation(v)

        if(errorsResponse){
            return response.failed(res, errorsResponse)
        }
        next();
    },


}