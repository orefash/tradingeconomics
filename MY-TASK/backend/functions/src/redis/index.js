"use strict";
const { createClient } = require('redis');

const getClient = () => {

    try{
        const redisClient = createClient({
            password: process.env.REDIS_PASS,
            socket: {
                host: 'redis-10143.c55.eu-central-1-1.ec2.cloud.redislabs.com',
                port: 10143
            }
        });


        // console.log('gh:33 ')

        redisClient.on('error', err => {
            console.log('Redis Client Error', err)
            return null;
        });
        // console.log('gh: ', redisClient)
        return redisClient;

    }catch(err){
        return null;
    }

}

module.exports = { getClient };