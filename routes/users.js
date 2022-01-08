const configurationService = require("./../services/ConfigurationService");
const express = require('express');
const router = express.Router();

router.get('/',async (req,res)=>{
    let data =await configurationService.getTables();
    console.log(data);
    res.send(data);
});

module.exports = router;
