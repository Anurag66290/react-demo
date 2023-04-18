let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Userschema = new Schema(
  {
    first_name: {
      type: String,
      index: true,
      default: "",
    },
    last_name: {
      type: String,
      index: true,
      default: "",
    },
    email: {
      type: String,
      index: true,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    profile_image: {
      original: {type: String, default: ""},
      thumbnail: {type: String, default: ""},
    },
    access_token: {
      type: String,
      trim: true,
      default: "",
    },
    login_time: {
      type: String,
      default: "",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["0", "1"], // 1 - active, 0 - inactive,
      default: "1",
    },
  },
  {timestamps: true}
);

Userschema.pre('remove', function(callback) {
    // Remove all the docs that refers
  

});

const user = mongoose.model('users', Userschema);
module.exports = user;
