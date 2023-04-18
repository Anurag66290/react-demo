//Checking the crypto module
const CryptoJS = require("crypto-js");

module.exports = {
    encrypt: async function(text) {
        let encryptdEmail = CryptoJS.AES.encrypt(text, process.env.SECURITY_KEY).toString();
        return encryptdEmail;
    },

    //Decrypting text
    decrypt:async function(text) {
        let bytes  = CryptoJS.AES.decrypt(text, process.env.SECURITY_KEY);
        let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    },
    
    comparePass:async function(reqPass, dbPass) {
        return reqPass == dbPass;
    },
}