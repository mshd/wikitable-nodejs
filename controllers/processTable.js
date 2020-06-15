
const wbk = require('wikidata-sdk');
var wikidataController = require('../controllers/wikidata');

exports.requestedTable = null;
exports.labelsIds = [];
function updateTable(requestedTable){
    for(var i in requestedTable.header){
        requestedTable.header[i].property =
            requestedTable.header[i].property || requestedTable.header[i].name;
        requestedTable.header[i].name =
            requestedTable.header[i].name || requestedTable.header[i].property;
        requestedTable.header[i].apiName =
            requestedTable.header[i].apiName || requestedTable.header[i].name;
    }
    return requestedTable;
}

exports.process = function(result,requestedTable){

    var table= {};
    exports.requestedTable = updateTable(requestedTable);
    console.log(exports.requestedTable);
    console.log(result);
    for(var entityId in result.entities){
        const claims = wbk.simplify.claims(result.entities[entityId].claims,  { keepAll: true });
        // table[entityId] = {};
        table[entityId] = processRow(claims);
    }
    console.log(exports.labelsIds);
    fetchLabels();
    return table;

};

function fetchLabels() {
    var data = wikidataController.wikidataApi({
        ids: Array.from(new Set(exports.labelsIds)),
        props: "labels",
        lang: "en",
    }, function (result) {
        console.log(result);
    });
}
function processRow(claims) {
    var row = {};
    exports.requestedTable.header.forEach(function (headItem) {
        row[headItem.apiName] = claims[headItem.property] ? claims[headItem.property] : null;
        if(Array.isArray(row[headItem.apiName])){
        row[headItem.apiName].forEach(function (r) {
            if(r.type === "wikibase-item") {
                exports.labelsIds.push(r.value);
            }
        });

    }
    });
    return row;
}