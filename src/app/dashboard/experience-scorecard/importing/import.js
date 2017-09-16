var fs = require('fs');
var logger = require('./logger.js').default;
var dataFiles = require('./pilot001-file-list.js');
var studyFormat = require('./studyFormat').studyFormat;

const eolCheckOrder = [
    {
        name: 'carriage return + new line',
        token: /\r\n/g
    }, {
        name: 'new line',
        token: /\n/g
    }
];
eolCheckOrder.push({ name: 'carriage return', token: /\r/g });
// eolCheckOrder.push({ name: 'tab', token: /\t/g });

const responseMap = studyFormat.responseMap;
const DATA_ROOT = './data/';
let studyHashMap = {};

dataFiles.forEach(dataFile => {
    let {
        browser,
        fileList,
        key,
        session,
        targets,
        timestamp,
        type,
    } = dataFile;

    // process each referenced file
    if(fileList && fileList.length > 0) {
        fileList.forEach(file => {
            let groupFormat = null;
            if(type) {
                groupFormat = studyFormat.studies[0].groups.find(x => x.title === type);
            }
            console.log(`Importing file '${file}' as ${type ? type : "-" }:${browser}`);

            let rows = importFileAsRows(file);
            let fileHashMap = generateDataMap(rows, targets, key, groupFormat);

            Object.keys(fileHashMap).filter(target => {
                return target != undefined;
            }).forEach(target => {
                if(!studyHashMap[target]) {
                    studyHashMap[target] = {};
                }
                if(!!browser) {
                    studyHashMap[target]['__browser'] = browser;
                    studyHashMap[target]['__session'] = session;
                    studyHashMap[target]['__timestamp'] = timestamp;
                }
                if(type !== null) {
                    studyHashMap[target]['__taskGroup'] = type;
                    studyHashMap[target].__tasks = fileHashMap[target];

                    // if(!studyHashMap[target].__tasks) {
                    //     studyHashMap[target].__tasks = [];
                    // }

                    // let oldVal = studyHashMap[target].__tasks || {};
                    // let mergeVal = fileHashMap[target];
                    // let newVal = Object.assign({}, oldVal, mergeVal);

                    // studyHashMap[target].__tasks = newVal;
                } else {
                    studyHashMap[target] = Object.assign({}, studyHashMap[target], fileHashMap[target]);
                }
            });
        });
    }
});

exportAsFile('export.json', studyHashMap);

function generateDataMap(rows, props, key, groupFormat) {
    let dataMap = {};
    let participantList = [];
    let keyIndex = 0;

    // find keyIndex based
    rows.find((row, index) => {
        let tokens = row.split('\t');

        if(tokens.length && tokens[0] === key) {
            keyIndex = index;
            return true;
        }
        return false;
    });

    // once we find keyIndex, we can cache participant keys
    if(keyIndex < 0) {
        console.log(`key prop "${key}" not found`);
    } else {
        let surveyIds = rows[keyIndex].split('\t').slice(1); // strips first column!

        for(var i = 0; i < surveyIds.length; i++) {
            let surveyId = surveyIds[i];

            participantList.push(surveyId);
            // dataMap[surveyId] = {};
        }
    }

    rows.forEach((row, index) => {
        let rowTokens = row.split('\t'); // tabs

        if(rowTokens.length) {
            /*
            * first column of rowData is expected to contain the property name, which
            * for that row, describes the data contained in subsequent columns
            */
            let propName = rowTokens[0];

            if(props && props[propName] != undefined) {
                let questionFormat = getQuestionFormat(groupFormat, propName);
                let lineOffset = props[propName];
                let targetRow = rows[index + lineOffset];
                let rowCells = targetRow
                    .split('\t')
                    .slice(1); // strip propName column

                for(var i = 0; i < rowCells.length; i++) {
                    let cellVal = scrubResponse(rowCells[i]);

                    if(cellVal.indexOf(':::') >= 0) {
                        let linkParts = cellVal.split(':::');

                        if(linkParts.length === 2) {
                            let duration = getClipDuration(linkParts[0]);
                            let offset = getClipOffset(linkParts[1]);

                            if(duration != undefined && offset != undefined) {
                                cellVal = {
                                    offset,
                                    duration
                                };
                            } else {
                                cellVal = linkParts[0];
                            }
                        }
                    }
                    if(questionFormat) {
                        if(questionFormat.subtype === 'yesNoMaybe') {
                            cellVal = responseMap.yesNoMaybe.byResponse[cellVal];
                        } else if(questionFormat.subtype === 'timeOnTask') {
                            cellVal = responseMap.timeOnTask.byResponse[cellVal];
                        } else if(questionFormat.subtype === 'satisfactionScale') {
                            cellVal = responseMap.satisfactionScale.byResponse[cellVal];
                        } else if(questionFormat.subtype === 'agreementScale') {
                            let n = parseInt(cellVal);

                            cellVal = isNaN(n)
                                ? cellVal
                                : n;
                        } else if(questionFormat.subtype === 'wordAssociation') {
                            let matchWords = responseMap.wordAssociation.responses.reduce((accum, item) => {
                                let reg = new RegExp(('\\b'+item),"gi");
                                let count = (cellVal.match(reg) || []).length;

                                if(count) {
                                    accum[item] = count;
                                }

                                return accum;
                            }, {});

                            let matched ='';
                            Object.keys(matchWords).forEach(x => {
                                if(matchWords[x] > 0) {
                                    matched  = matched + ' ' + x + ':' + matchWords[x];
                                }
                            })
                            console.log('Match: ' + cellVal + ' == ' + matched);
                            cellVal = matchWords;
                        }
                    }

                    if(groupFormat) {
                        let taskIndex = propName.slice(5);

                        if(!dataMap[participantList[i]]) {
                            dataMap[participantList[i]] = [];
                        }

                        dataMap[participantList[i]][taskIndex] = cellVal;
                    } else {
                        if(!dataMap[participantList[i]]) {
                            dataMap[participantList[i]] = {};
                        }

                        dataMap[participantList[i]][propName] = cellVal;
                    }

                }
            }
        }
    });

    return dataMap;
}

function getQuestionFormat(groupFormat, propName) {
    if(groupFormat && groupFormat.tasks) {
        return groupFormat.tasks.find(task => task.id === propName);
    }
}

function scrubResponse(response) {
    return response.replace(/\"/g, '');
}


function exportAsFile(filename, data) {
    fs.writeFile(DATA_ROOT + filename, JSON.stringify(studyHashMap), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`Export successful.`);
    });
}

function importFileAsRows(filename) {
    let fileRows = [];
    let expandedFileRows = [];

    try {
        let fileData = fs.readFileSync(DATA_ROOT + filename, 'utf8');
        let eol;
        let eolInstances = -1;

        // find file eol
        eolCheckOrder.find((eolCheck, index) => {
            let result = fileData.match(eolCheck.token);
            let count = (result || []).length;

            if(count) {
                eol = eolCheck;
                eolInstances = count;

                console.log(`Set eol to '${eolCheck.name}' ${count} instances found.`);

                return true;
            };
        });

        // transform file to rows
        fileRows = fileData.split(eol.token);


        // * Maybe a check at the last fileData char would allow a more precise outcome
        if(fileRows.length !== eolInstances && fileRows.length !== (eolInstances + 1)) {
            console.log('Expected fileRows length ' + fileRows.length + ' to equal eolInstances ' + eolInstances);
        }
        console.log('Row count is ' + fileRows.length);
        console.log('\r\n', '** Processing rows');



        fileRows.forEach((row, index) => {
            let rowNumber = index + 1; // only used for logging
            // TODO djw: eol determination update
            // * in order to handle more than two eol characters, expansion would need to
            //   iterate on char of row, checking for any eol
            let foundEol = eolCheckOrder.find(eolCheck => {
                let count = (row.match(eolCheck.token) || []).length;

                if(count) {
                    let expandedRows = row.split(eolCheck.token);

                    console.log('@row ' + rowNumber + ': Expanding (' + expandedRows.length + ')');
                    expandedRows.forEach((x, i) => {
                        expandedFileRows.push(x);
                        console.log(`  +row ${rowNumber}.${i + 1} - (${expandedFileRows.length})`);
                    });
                }

                return !!count;
            });

            if(!foundEol) {
                expandedFileRows.push(row);
                console.log(`+row ${rowNumber} = (${expandedFileRows.length})`);
            }

        });

    } catch(err) {
        console.log('error loading data: ', err);
    }

    return expandedFileRows;
}

function getClipOffset(url) {
    let offset = undefined;

    if(url.indexOf('http') === 0 && url.indexOf('start=') >= 0) {
        let startVal = parseInt(url.split('start=')[1]);

        if(!isNaN(startVal)) {
            offset = startVal;
        }
    }

    return offset;
}

function getClipDuration(timecode) {
    let duration = undefined;

    if(timecode.indexOf(':') === 2) {
        let timecodeParts = timecode.split(':');
        let minutes = parseInt(timecodeParts[0]);
        let seconds = parseInt(timecodeParts[1]);

        if(!isNaN(minutes) && !isNaN(seconds)) {
            duration = (minutes * 60) + seconds;
        }
    }

    return duration;
}