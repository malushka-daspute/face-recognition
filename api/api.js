const express = require("express");
const router = express.Router({ mergeParams: true });
const UserModel = require("../models/users");
const {sendMail} = require('./sendMail')

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  UserModel.find({ email: email }).then((userData) => {
      if(userData.length !== 0){
        if (userData[0].email === email && userData[0].password === password) {
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(userData[0].faceEncoding);
          } else {
            res.status(400).send({
              message: "Email or Password is not Valid",
            });
          }
      } else{
        res.status(400).send({
            message: "User Not Found",
          });
      }
    
  });
});

router.post("/newUser", async (req, res) => {
  const newUserFromClient = {
    email: req.body.email,
    password: req.body.password,
    faceEncoding: req.body.faceEncoding,
  };
 UserModel.find({ email: req.body.email }).then((user) => {
   if (user.length === 0 ) {
      const newUser = UserModel(newUserFromClient);
      newUser
        .save()
        .then(() => {
          console.log("User added in DB");
          try{
            sendMail(newUserFromClient.email)
          } catch(err){
              console.log(err)
          }
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end("User added in DB");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
        res.status(400).send({
            message: "User has already registered",
          });
    }
 });

});

module.exports = router;
