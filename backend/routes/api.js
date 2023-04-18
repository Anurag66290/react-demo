var express = require('express');
var router = express.Router();
require('express-group-routes');
var app = express();
/*
|-------------------------------------------------------------------------------------
|   Validation middleware
|-------------------------------------------------------------------------------------
|
*/
const validation = require('../middlewares/validations');

/*
|-------------------------------------------------------------------------------------
|   Header keys middleware
|-------------------------------------------------------------------------------------
|
*/
const requireHeaders = require('../middlewares/check_header_keys').authenticateHeader;
const requireAuthentication = require('../middlewares/user_authentication').authenticateUser;
/*
|-------------------------------------------------------------------------------------
|   Call controller
|-------------------------------------------------------------------------------------
|    
*/
const authController = require('../controllers/Api/auth_controller');
const userController = require('../controllers/Api/user_controller');

app.group((router) => {
    /*
    |-----------------------------------------------------------------------------------
    |   Auth Routes
    |-----------------------------------------------------------------------------------
    |
    */
    router.post('/encryptionForSkPk', [validation.encryptionForSkPk], authController.encryptionForSkPk)
    router.post('/file_upload', [requireHeaders, validation.file_upload],authController.file_upload)

    router.use(requireHeaders);
    router.group("/auth", (router) => {
        router.post('/sign_up', [validation.sign_up], authController.sign_up)
        router.post('/login', [validation.login], authController.login)
        router.use(requireAuthentication);
        router.get('/logout', authController.logout)
    });
    router.group("/user", (router) => {
      router.use(requireAuthentication);
      router.get('/list', userController.list)
    });

});


module.exports = app;