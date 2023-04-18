var path = require('path');
const fileExtension = require('file-extension');
const sharp = require('sharp') //for image thumbnail
const Thumbler = require('thumbler');//for video thumbnail
const util = require('util')
const fs = require('fs-extra')

module.exports = {
    fileUpload: (file, folder = 'users', parentFolder = 'uploads') => {
        let file_name_string = file.name;
        var file_name_array = file_name_string.split(".");
        var file_extension = file_name_array[file_name_array.length - 1];
        var result = "";
        result = uuid();
        let name = result + '.' + file_extension;
        let nameWithPath = '/' + parentFolder + '/' + folder + '/'+ name;
        file.mv(`public/${parentFolder}/${folder}/${name}`, function (err) {
            if (err) throw err;
        });
        return nameWithPath;
    },

    readFile: async (path) => {
        console.log("  ************ readFile *******************")
        console.log(path, "  ************ pathreadFile *******************")
        return new Promise((resolve, reject) => {
            const readFile = util.promisify(fs.readFile);
            readFile(path).then((buffer) => {
                resolve(buffer);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    writeFile: async (path, buffer) => {
        console.log("  ************ write file *******************")
        return new Promise((resolve, reject) => {
            const writeFile1 = util.promisify(fs.writeFile);
            writeFile1(path, buffer).then((buffer) => {
                resolve(buffer);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    //function createVideoThumb(fileData, thumbnailPath){
    createVideoThumb: async (fileData, thumbnailPath) => {
        var VIDEO_THUMBNAIL_TIME = '00:00:02'
        var VIDEO_THUMBNAIL_SIZE = '300x200'
        var VIDEO_THUMBNAIL_TYPE = 'video'
        return new Promise(async (resolve, reject) => {
            Thumbler({
                type: VIDEO_THUMBNAIL_TYPE,
                input: fileData,
                output: thumbnailPath,
                time: VIDEO_THUMBNAIL_TIME,
                size: VIDEO_THUMBNAIL_SIZE // this optional if null will use the desimention of the video
            }, function (err, path) {
                if (err) reject(err);
                resolve(path);
            });
        });
    },

    fileUploadMultiparty: async function (FILE, FOLDER, FILE_TYPE) {
        try {
            var FILENAME = FILE.name; // actual filename of file
            var FILEPATH = FILE.tempFilePath; // will be put into a temp directory

            THUMBNAIL_IMAGE_SIZE = 300
            THUMBNAIL_IMAGE_QUALITY = 100

            let EXT = fileExtension(FILENAME); //get extension
            EXT = EXT ? EXT : 'jpg';
            FOLDER_PATH = FOLDER ? (FOLDER + "/") : ""; // if folder name then add following "/" 
            var ORIGINAL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
            var THUMBNAIL_FILE_UPLOAD_PATH = "/public/uploads/" + FOLDER_PATH;
            var THUMBNAIL_FILE_UPLOAD_PATH_RETURN = "/uploads/" + FOLDER_PATH;
            var NEW_FILE_NAME = (new Date()).getTime() + "-" + "file." + EXT;
            var NEW_THUMBNAIL_NAME = (new Date()).getTime() + "-" + "thumbnail" + "-" + "file." + ((FILE_TYPE == "video") ? "jpg" : EXT);

            let NEWPATH = path.join(__dirname, '../', ORIGINAL_FILE_UPLOAD_PATH, NEW_FILE_NAME);
            let THUMBNAIL_PATH = path.join(__dirname, '../', ORIGINAL_FILE_UPLOAD_PATH, NEW_THUMBNAIL_NAME);

            let FILE_OBJECT = {
                "image": '',
                "thumbnail": '',
                "fileName": FILENAME,
                "folder": FOLDER,
                "file_type": FILE_TYPE
            }

            let BUFFER = await this.readFile(FILEPATH); //read file from temp path
            await this.writeFile(NEWPATH, BUFFER); //write file to destination

            FILE_OBJECT.image = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_FILE_NAME;

            let THUMB_BUFFER = "";

            if (FILE_TYPE == 'image') { // image thumbnail code
                var THUMB_IMAGE_TYPE = (EXT == "png") ? "png" : "jpeg";
                THUMB_BUFFER = await sharp(BUFFER)
                    .resize(THUMBNAIL_IMAGE_SIZE)
                    .toFormat(THUMB_IMAGE_TYPE, {
                        quality: THUMBNAIL_IMAGE_QUALITY
                    })
                    .toBuffer();
                // FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH + NEW_THUMBNAIL_NAME;
                FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_THUMBNAIL_NAME;
                await this.writeFile(THUMBNAIL_PATH, THUMB_BUFFER);
            } else if (FILE_TYPE == "video") { // video thumbnail code
                await this.createVideoThumb(NEWPATH, THUMBNAIL_PATH, NEW_THUMBNAIL_NAME);
                FILE_OBJECT.thumbnail = THUMBNAIL_FILE_UPLOAD_PATH_RETURN + NEW_THUMBNAIL_NAME;
            } else {
                FILE_OBJECT.thumbnail = ''
            }
            return FILE_OBJECT;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
}