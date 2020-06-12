const wbk = require('wikidata-sdk');
const fetch = require('node-fetch');
const async = require('async');
const moment = require('moment');
const fs = require('fs');
const NodeCache = require('node-cache');
// var cache = require('memory-cache');
// const wikidataLang = require('../public/js/wikidataLang');
var wikidataController = require('../controllers/wikidata');
var dataCache = new NodeCache();
// var config = require('../controllers/tables');

exports.init = function (request, callback) {
    //from the debugging, it's seems that the data is append to the rows, so we need to initialized it for every request
    //Init container data
    rows =[];
    labelIds = [];
    processNode.ownValue = [];
    processNode.nodeImages = [];
    processNode.birthAndDeathPlace = [];
    processNode.result.root = null;
    if(!request.page){
        callback('no page req');
    }
    var requestedTable = config.page[request.page];
    var sparql = requestedTable.query;
    var table = {};
    wikidataController.wikidataSparqlGetItems(sparql,function (result) {
        // callback(null,result);
        console.log(result);
        for(var entityId in result.entities){
            const claims = wbk.simplify.claims(result.entities[entityId], { keepQualifiers: true });
            table[entityId] = {};
            requestedTable.header.forEach(function (headItem) {
                table[entityId][headItem.name] = "test";
            });

        }
        callback(null,table);

        // callback(null,result);
    })

};