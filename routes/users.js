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
    let errors = [];
    if(validateString(req.body.firstname.trim())) {
        req.body.firstname=req.body.firstname.trim().toLowerCase();
    } else {
        errors.push({"firstname":"Invalid value entered"})
    }
    if(validateString(req.body.lastname.trim())) {
        req.body.lastname=req.body.lastname.trim().toLowerCase();
    } else {
        errors.push({"lastname":"Invalid value entered"})
    }
    if(!validatePassword(req.body.password)) {
        errors.push({"password":"Password SHould contain atleast 8 chars with 1 Caps, 1 small, 1 number and 1 special character"})
    }
    if(validateEmail(req.body.email.trim())) {
        req.body.email=req.body.email.trim().toLowerCase();
    } else {
        errors.push({"email":"Invalid value entered"})
    }
    if(req.body.gender.trim().toLowerCase() === "male" || req.body.gender.trim().toLowerCase() === "female" || req.body.gender.trim().toLowerCase() === "other") {
        req.body.gender=req.body.gender.trim().toLowerCase();
    } else {
        errors.push({"gender":"Invalid value entered"})
    }
    if(!moment(req.body.dob, 'YYYY/MM/DD',true).isValid()) {
        errors.push({"dob":"Invalid value entered"})
    }

    if(errors.length > 0)
       return res.json({"status":0,"message":errors});
    else {
        let checkUniqueness = await configurationService.checkMailUsername(req.body.email);
        if (checkUniqueness) {
           if (checkUniqueness[0].email === req.body.email) {
               errors.push({"email":"Already exist"});
           }
           if (errors.length > 0) {
               return res.json({"status": 0, "message": errors});
           }
        }
    }
    req.body.guid=uuidv4();
    req.body.password=generateEncryptedPassword(req.body.password);
    req.body.accesstoken=generateToken(req.body.guid);
    req.body.username=req.body.email.split('@')[1]+req.body.firstname[0]+req.body.lastname[0]+(Math.floor(Math.random() * 999999) + 1).toString().padStart(6,"k");
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
    let reqParams = ["guid", "firstname", "lastname", "username", "password", "gender", "email", "dob", "accesstoken"];
    req.body.guid=uuidv4();
    req.body.password=generateEncryptedPassword(req.body.password);
    req.body.accesstoken=generateToken(req.body.guid);
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

module.exports = router;
