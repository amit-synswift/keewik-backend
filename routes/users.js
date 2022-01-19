const configurationService = require("./../services/ConfigurationService");
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const validateRequiredParameters = require('./../util/validator').validateRequiredParameters;
const {generateEncryptedPassword, generateToken, validateString, validateUsername, validateEmail, validatePassword} = require('./../util/utility');
const {isAuthorizedUser} = require('./../auth');
const moment = require('moment');

router.get('/',isAuthorizedUser,async (req,res,next)=>{
    let data =await configurationService.getTables();
    console.log(data);
    res.send(data);
});

router.post('/signup',async (req,res)=>{
    let reqParams = ["guid", "firstname", "lastname", "username", "password", "gender", "email", "dob", "accesstoken"];
    let errors = {};
    if(validateString(req.body.firstname.trim())) {
        req.body.firstname=req.body.firstname.trim().toLowerCase();
    } else {
        errors["firstname"]="Please enter a valid Firstname";
    }
    if(validateString(req.body.lastname.trim())) {
        req.body.lastname=req.body.lastname.trim().toLowerCase();
    } else {
        errors["lastname"]="Please enter a valid Lastname";
    }
    if(!(req.body.password && req.body.password.length>=8 && req.body.password.length<256)) {
        errors["password"]="Password length must contain 8 or more characters";
    } else if (!(req.body.password && /[A-Z]/.test(req.body.password))) {
        errors["password"]="Password must contain at least 1 or more Upper case character";
    } else if (!(req.body.password && /[a-z]/.test(req.body.password))) {
        errors["password"]="Password must contain at least 1 or more lower case character";
    } else if (!(req.body.password && /[0-9]/.test(req.body.password))) {
        errors["password"]="Password must contain at least 1 or more number";
    } else if (!(req.body.password && /[!@#$%^&*]/.test(req.body.password))) {
        errors["password"]="Password must contain at least 1 symbol from [!@#$%^&*]";
    }
    if(validateEmail(req.body.email.trim())) {
        req.body.email=req.body.email.trim().toLowerCase();
    } else {
        errors["email"]="Please enter a valid Email";
    }
    if(req.body.gender.trim().toLowerCase() === "male" || req.body.gender.trim().toLowerCase() === "female" || req.body.gender.trim().toLowerCase() === "other") {
        req.body.gender=req.body.gender.trim().toLowerCase();
    } else {
        errors["gender"]="Please select Gender";
    }
    if(!moment(req.body.dob, 'YYYY-MM-DD',true).isValid()) {
        errors["dob"]="Please select a valid Date of Birth";
    }

    if(errors.length > 0)
       return res.json({"status":0,"message":errors});
    else {
        let checkUniqueness = await configurationService.checkIfAlreadyMail(req.body.email);
        console.log("unique =>",checkUniqueness);
        if (checkUniqueness) {
           if (checkUniqueness[0].email) {
               errors["email"]="Email already exist";
               return res.json({"status": 0, "message": errors});
           }
        }
    }
    req.body.guid=uuidv4();
    req.body.password=generateEncryptedPassword(req.body.password);
    req.body.accesstoken=generateToken(req.body.guid);
    req.body.username=req.body.email.split('@')[0]+req.body.firstname[0]+req.body.lastname[0]+(Math.floor(Math.random() * 999999) + 1).toString().padStart(6,"k");
    console.log(req.body);
    validateRequiredParameters(req, reqParams).then( (sp_params)=> {
        configurationService.callSP('create_user', sp_params).then((result)=> {
            console.log("result=>",result);
            var result = result || {};
            if(result[0][0].status == -1){
                console.error('error',result[0][0]);
                res.json({"status":0,"message":"something went wrong"})
            } else {
                return res.json({
                    "status": result[0][0].status,
                    "token": result[0][0].token,
                    "message": result[0][0].message,
                });
            }
        }).catch((err)=>{
            console.error("error => ",err);
            return res.json({"status":0,"message":err});
        });
    }).catch((err)=>{
        console.error("error => ",err);
        return res.json({"status":0,"message":err});
    });
});

router.post('/login',async (req,res)=>{
    let reqParams = ["username", "password", "accesstoken"];
    if(req.body.username) {
        req.body.username=req.body.username.trim().toLowerCase();
        if(req.body.username.contains('@') && !(validateEmail(req.body.username)))
            errors["username"]="Please enter a valid Email";
        else if(!validateUsername(req.body.username))
            errors["username"]="Please enter a valid Username";
        else {
            let userData = await configurationService.checkIfUserExists(req.body.username);
            console.log(userData);
            if (userData[0].total <= 0) {
                errors["username"]="Please enter valid login credentials";
            }
        }
    } else {
        errors["username"]="Please enter a valid Username or Email";
    }
    if(!(req.body.password && req.body.password.length>0)) {
        errors["password"]="Please enter a valid Password";
    }

    if(errors.length > 0)
        return res.json({"status":0,"message":errors});
    req.body.password=generateEncryptedPassword(req.body.password);
    req.body.accesstoken=generateToken(req.body.guid);
    console.log(req.body);
    validateRequiredParameters(req, reqParams).then( (sp_params)=> {
        configurationService.callSP('login_user', sp_params).then((result)=> {
            console.log("result=>",result);
            var result = result || {};
            if(result[0][0].status == -1){
                console.error('error',result[0][0]);
                res.json({"status":0,"message":"something went wrong"})
            } else {
                return res.json({
                    "status": result[0][0].status,
                    "token": result[0][0].token,
                    "message": result[0][0].message,
                });
            }
        }).catch((err)=>{
            console.error("error => ",err);
            return res.json({"status":0,"message":err});
        });
    }).catch((err)=>{
        console.error("error => ",err);
        return res.json({"status":0,"message":err});
    });
});

module.exports = router;
