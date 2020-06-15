
const wbk = require('wikidata-sdk');

exports.requestedTable = null;

function updateTable(requestedTable){
    for(var i in requestedTable.header){
        requestedTable.header[i].property =
            requestedTable.header[i].property || requestedTable.header[i].name;
        requestedTable.header[i].name =
            requestedTable.header[i].name || requestedTable.header[i].property;
    }
    return requestedTable;
}

exports.process = function(result,requestedTable){

    var table= {};
    exports.requestedTable = updateTable(requestedTable);
    console.log(exports.requestedTable);
    console.log(result);
    for(var entityId in result.entities){
        const claims = wbk.simplify.claims(result.entities[entityId].claims, { keepQualifiers: true });
        // table[entityId] = {};
        table[entityId] = processRow(claims);


    }
    return table;

};


function processRow(claims) {
    var row = {};
    exports.requestedTable.header.forEach(function (headItem) {
        row[headItem.name] = (claims[headItem.property] ? claims[headItem.property][0].value : null);
    });
    return row;
}