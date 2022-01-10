const configurationService = require("./../services/ConfigurationService");
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const validateRequiredParameters = require('./../util/validator').validateRequiredParameters;
const {generateEncryptedPassword, generateToken} = require('./../util/utility');
const {isAuthorizedUser} = require('./../auth');

router.get('/',isAuthorizedUser,async (req,res,next)=>{
    let data =await configurationService.getTables();
    console.log(data);
    res.send(data);
});

router.post('/signup',async (req,res)=>{
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
