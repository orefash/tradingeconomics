"use strict";
const express = require("express");
const router = express.Router();

const logger = require("firebase-functions/logger");

const { getTE } = require("./te");
const { getClient } = require("./redis");

const { serverStatus, generateYearsBetween } = require("./helpers");
const { COUNTRIES, whitelist } = require("./statics");

router.get('/' , (req , res) =>{
    return res.status(200).json('hello from user route');
});


router.get("/api/uptime", (req, res) => {
    res.status(200).json(
        serverStatus()
    );
});


router.get("/api/fetchChartData/:indicator", async (req, res) => {
    let indicatorValue = req.params.indicator;
    let start_date_value = '2010-01-01';
    let end_date_value = '2022-12-31';

    if (req.query.startYear && req.query.endYear) {
        start_date_value = `${req.query.startYear}-01-01`;
        end_date_value = `${req.query.endYear}-12-31`;

        // console.log(`stD: ${start_date_value}  - - enD: ${end_date_value}`)
    }

    const te = getTE();

    if (te) {

        try {
            const data = await te.getHistoricalData(country = COUNTRIES, indicator = indicatorValue, start_date = start_date_value, end_date = end_date_value);

            const yearList = generateYearsBetween(start_date_value, end_date_value);

            //extract required data as required by chart
            let countryData = {};
            COUNTRIES.forEach(c => {
                countryData[c] = []
            })

            for (let i = 0; i < data.length - 1; i++) {
                countryData[data[i].Country].push(data[i].Value)
            }

            let responseData = {
                yearList,
                countryData
            }

            res.status(200).json(
                {
                    data: responseData
                }
            );
        } catch (error) {

            res.status(500).send(error.message);
        }

    } else {
        res.status(400).send("error: ");
    }
});

function toSentenceCase(str) {
    return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);;
}

router.get("/api/fetchTableData/:country", async (req, res) => {
    let countryValue = toSentenceCase(req.params.country);

    let start_date_value = '2010-01-01';
    let end_date_value = '2022-12-31';

    if (req.query.startYear && req.query.endYear) {
        start_date_value = `${req.query.startYear}-01-01`;
        end_date_value = `${req.query.endYear}-12-31`;

        // console.log(`stD: ${start_date_value}  - - enD: ${end_date_value}`)
    }

    const te = getTE();

    if (te && COUNTRIES.includes(toSentenceCase(countryValue))) {

        try {
            const data = await te.getHistoricalData(country = countryValue, indicator = ["gdp", "population"], start_date = start_date_value, end_date = end_date_value);

            //remove the last object
            data.pop();

            //transaform response data to feed DataTable format
            const newData = data.reduce((result, obj) => {
                // Extract required fields
                const transformedObj = {
                    country: obj.Country,
                    year: new Date(obj.DateTime).getFullYear(),
                    gdp: null,
                    population: null
                };


                //create single data boject for particular year with gdp and population
                if(!result[obj.DateTime])
                    result[obj.DateTime] = transformedObj
                    
                result[obj.DateTime].gdp = obj.Category == "GDP" ? obj.Value : result[obj.DateTime].gdp;
                result[obj.DateTime].population = obj.Category == "Population" ? obj.Value : result[obj.DateTime].population;
             

                return result;
            }, {});


            res.status(200).json(
                {
                    data: Object.values(newData)
                }
            );
        } catch (error) {
            console.log("error exc: ", error.message)

            res.status(500).send(error.message);
        }

    } else {
        console.log("error: ")
        res.status(400).send("error: ");
    }
});


module.exports = router;