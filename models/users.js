const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      faceEncoding :{
          type: String,
          required : true
      }
});
const Users = mongoose.model("Users", UserSchema);
module.exports = Users;