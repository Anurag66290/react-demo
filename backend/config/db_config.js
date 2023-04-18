'use strict';
let mongoURI = "";

if (process.env.NODE_ENV === "dev") {
    mongoURI = ``
} else if (process.env.NODE_ENV === "local") {
    mongoURI = `mongodb://localhost:27017/${process.env.DATABASE}`;
}
module.exports = {
    mongo: mongoURI
};
