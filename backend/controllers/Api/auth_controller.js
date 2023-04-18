const { Validator } = require('node-input-validator');
const jwt = require('jsonwebtoken');
const helper = require('../../helpers/helper');
const response = require('../../helpers/response');
const query = require('../../helpers/query');
const password = require('../../helpers/password');
const models = require('../../models/index')
const file = require('../../helpers/file');
const aes = require('../../helpers/aes');
const modelName = 'Users';
module.exports = {

    encryptionForSkPk:async(req, res)=>{
        try {
            const v = new Validator(req.headers, {
                secret_key: 'required|string',
                publish_key: 'required|string',
            });

            let errorsResponse = await helper.checkValidation(v)

            if(errorsResponse){
                return response.failed(res, 'Data is not valid!')
            }

            if((req.headers.secret_key !== process.env.SECRET_KEY) || (req.headers.publish_key !== process.env.PUBLISH_KEY)){
                return response.failed(res,'Something went wrong!')
            }

            //encrypt data
            let encryptedSkData = await aes.encryption(process.env.SECRET_KEY)
            let encryptedPkData = await aes.encryption(process.env.PUBLISH_KEY)

            //decrypt data
            let decryptedSkData = await aes.decryption(encryptedSkData)
            encryptedSkData = 'sk_'+encryptedSkData
            let decryptedPkData = await aes.decryption(encryptedPkData)
            encryptedPkData = 'pk_'+encryptedPkData

            return response.success(res,'data',{encryptedSkData,encryptedPkData,decryptedSkData,decryptedPkData})

        } catch (err) {
            console.log(err,'------err--------');
        }
    },

    file_upload: async function (req, res) {
        try {
            let PAYLOAD = req.body;
            var FILE_TYPE = PAYLOAD.type; // image,video,pdf,etc
            var FOLDER = req.body.folder; //PAYLOAD.folder;// user,category,products,etc

            var image_data = [];
            if (req.files && req.files.image && Array.isArray(req.files.image)) {
                for (var imgkey in req.files.image) {
                    var image_url = await file.fileUploadMultiparty(req.files.image[imgkey], FOLDER, FILE_TYPE);
                    image_data.push(image_url)
                }
                return res.status(200).json({
                    status: true,
                    code: 200,
                    message: 'Successfully',
                    body: image_data
                });
            } else if (req.files.image.name != "") {
                var image_url = await file.fileUploadMultiparty(req.files.image, FOLDER, FILE_TYPE);
                image_data.push(image_url)
                return res.status(200).json({
                    status: true,
                    code: 200,
                    message: 'Successfully',
                    body: image_data
                });
            } else {
                return res.status(400).json({
                    status: false,
                    code: 400,
                    message: "Error - Image can't be empty",
                    body: []
                });
            }
        } catch (err) {
            console.log(err)
            return response.failed(res, err)
        }
    },

    sign_up: async (req, res) => {
        try {
            let whereConditionForCheck = {
                email: req.body.email
            }
            let checkEmail = await query.find_one(modelName, whereConditionForCheck)

            if (checkEmail) {
                return response.failed(res, "Email already exists.");
            }
            
            if (req.body.password) {
                req.body.password = await password.encrypt(req.body.password)
            }

            var imageString = "";
            if (req.body.profile_image) {
                imageString = JSON.parse(req.body.profile_image);
            }

            let obj = {
                original : (imageString != '') ? imageString[0].image : '',
                thumbnail : (imageString != '') ? imageString[0].thumbnail : '',
            }

            req.body.profile_image = obj
            let time = helper.unixTimestamp();

            req.body.login_time = time;

            let create_user = await query.create(modelName,req.body);
            if (create_user) {
                // delete create_user.password;

                let token = jwt.sign({
                    data: {
                        _id: create_user._id,
                        login_time: create_user.login_time,
                    }
                }, process.env.JWT_SECRET_KEY);

                let whereCondition = {
                    _id:create_user._id
                }

                let getData = await query.find_one(modelName,whereCondition)
                getData.access_token = token;

                return response.success(res, "Signup successfully.", getData);
            } else {
                return response.failed(res, "Error. Please try again.")
            }
        } catch (err) {
            return response.failed(res, err);
        }
    },

    login: async (req, res) => {
        try {
            let whereConditionForCheckEmail = {
                email: req.body.email
            }
            let getUser = await query.find_one(modelName,whereConditionForCheckEmail)

            if (!getUser) {
                return response.failed(res, "Incorrect email or password");
            }

            let dbPassword = await password.decrypt(getUser.password)
            let checkPassword = await password.comparePass(req.body.password, dbPassword);

            if (!checkPassword) {
                return response.failed(res, "Incorrect email or password");
            }
            // delete getUser.password;

            let time = helper.unixTimestamp();

            let updateField = {
                login_time: time,
            }

            let whereConditionForUpdate = {
                _id: getUser._id
            }

            await query.update(modelName,whereConditionForUpdate,updateField)

            let whereCondition = {
                _id:getUser._id
            }
            let getData = await query.find_one(modelName,whereCondition)

            let token = jwt.sign({
                data: {
                    _id: getData._id,
                    login_time: getData.login_time,
                }
            }, process.env.JWT_SECRET_KEY);
            
            getData.access_token = token;
            return response.success(res, "Login successfull.", getData);
        } catch (err) {
            return response.failed(res, err);
        }
    },

    logout: async (req, res) => {
		try {
            let whereCondition = {
                _id:req.user._id
            }
            let CheckAuth = await query.find_one(modelName,whereCondition)

			if (CheckAuth) {
                let updateField = {
                    login_time: '0',
                }
    
                await query.update(modelName,whereCondition,updateField)
                
                let msg = "User Logged Out Successfully!"
                return response.success(res, msg, {});
            } else {
                let msg = "Invalid Token!";
                return response.failed(res, msg)
            }
		} catch (error) {
			console.log(error)
			return response.failed(res, error)
		}
    },


}