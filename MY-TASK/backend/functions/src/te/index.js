"use strict"

const logger = require("firebase-functions/logger");
const te = require('tradingeconomics');

const teClientKey = process.env.TE_KEY;



const getTE = () => {

    try{
        // logger.info("KEY: ", teClientKey)
        te.login(teClientKey);
        return te;

    }catch(err){
        return null;
    }

}

module.exports = { getTE };