const wbk = require('wikidata-sdk');
const fetch = require('node-fetch');

exports.wikidataApi = function(para, callback) {
    if(para.ids.length === 0){
        callback(null,null);
        return;
    }
    console.log(para);
    const urls = wbk.getManyEntities({
        ids: para.ids,
        languages: para.lang || [ 'en', 'fr', 'de' ], // returns all languages if not specified
        props: para.props || [ 'labels', 'descriptions', 'claims', 'sitelinks/urls' ], // returns all data if not specified
        // format: 'xml', // defaults to json
        // redirections: false // defaults to true
    });
    console.log(urls);
    if(urls.length === 1){
        fetch(urls)
            // .then(response => console.log(response))
            .then(response => response.json())
            // .then(wbk.parse.wd.entities)
            .then(entities => {
                // console.log(entities);
                callback(null,entities);
                // return entities;
            })
            // .catch(error =>{ console.log("ERROR fetch in Wikidata.js :"+error.message); callback(new Error("ERROR fetch in Wikidata.js :"+error.message),null); }); //add Error catch
            //https://nodejs.org/api/errors.html#errors_error_first_callbacks
    }else{
        //https://stackoverflow.com/questions/31710768/how-can-i-fetch-an-array-of-urls-with-promise-all
        //map all requests and emerge the entities
        Promise.all(urls.map(u=>fetch(u))).then(responses =>
            Promise.all(responses.map(res => {
                // console.log(res.);
                return res.json();
            }))
        ).then(texts => {
            var entities = {};
            for(var text in texts){
                for(var index in texts[text].entities){
                    entities[index] = texts[text].entities[index];
                }
            }
            callback(null,{entities: entities});

        })
            // .catch(error => {console.log("Error Promise in wikidata.js : "+error.message); callback(new Error("Error Promise in wikidata.js : "+error.message),null);}); //add Error catch
    }

};

exports.wikidataSparql = function(para, callback) {
    const url = wbk.sparqlQuery(para);
    // callback(url);
    fetch(url)
        .then(response => response.json())
        .then(results => wbk.simplify.sparqlResults(results, { minimize: false }))
        .then(entities => {
            callback(entities);
        });
};

exports.wikidataSparqlGetItems  = function(para, callback) {
    exports.wikidataSparql(para,function (items) {
        console.log(items);
        if(items[0].item.value){
            var ids = items.map(entry => entry.item.value);
        }else {
            var ids = items.map(entry => entry.item);
        }
        exports.wikidataApi({
            ids: ids,
        },function(err,result) {
            callback(result);
        });
    })
};