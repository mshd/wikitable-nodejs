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
var config = require('../controllers/tables');
var processTable = require('./processTable');

function f() {
    
}


function apiMain(request,callback){
    // console.log(request);
    var requestedTable = config.page[
        request.page
        // 'universities'
        ];
    var sparql = requestedTable.query;
    wikidataController.wikidataSparqlGetItems(sparql + " LIMIT 10",function (result) {
        // console.log(result);
        // callback(result);
        // return;
        var table = processTable.process(result,config.page[request.page]);

        callback(table);

    })

}
exports.apiMain = apiMain;


exports.init = function (request, callback) {

    if(!request.page){
        callback('no page req');
    }else{

    }
    var requestedTable = config.page[request.page];
    var sparql = requestedTable.query;
    var sparql = `#Public IDX companies
SELECT ?item ?itemLabel ?ticker WHERE {
  ?item p:P414 ?statement .
  ?statement ps:P414 wd:Q1661737 . # get value of the "educated at" statement, i.e. the institution
  ?statement pq:P249 ?ticker . # filter for doctoral degrees
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
#   OPTIONAL { ?item wdt:P414 ?stock_exchange. }
}`;
    var table = {};
    wikidataController.wikidataSparql(sparql,function (result) {
        // callback(null,result);

        var results= [];
        for(var id in result){
            results.push({
                item: result[id].item.value,
                label: result[id].item.label,
                code: result[id].ticker,

            })
        }
        var returnArray = {
            sparql: sparql,
            results: results,
        };
        callback(returnArray);
        // callback(null,result);
    });
    //
    //


};