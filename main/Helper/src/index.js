var fs = require("fs");
var path = "../svgs";
const { parse, stringify } = require("svgson");
let tokM = /M(?<x>\-?[0-9]+(\.[0-9]+)?),(?<y>\-?[0-9]+(\.[0-9]+)?)/i;
let tokL = /L(?<x>\-?[0-9]+(\.[0-9]+)?),(?<y>\-?[0-9]+(\.[0-9]+)?)/;

let scaler = {
    X: {}
};
function processJson(e, content) {
    return parse(content).then(json => {
        let referenceCode = e.substring(0, e.length - 4);
        let bracingPattern = {
            referenceCode: referenceCode,
            members: [],
            quad: [1, 209, 269, 209,  240, 1, 30, 1],
            thickness: 0.01
        };
        json.children.forEach(function(e) {
            if (e.name == "path") {
                let d = e.attributes.d;
                let id = e.attributes.id;
                let serifId = e.attributes['serif:id'];
                let m = tokM.exec(d);
                let l = tokL.exec(d);
                if (m && l) {
                    let mx = m.groups.x;
                    let my = m.groups.y;
                    let lx = l.groups.x;
                    let ly = l.groups.y;
                    bracingPattern.members.push({ code: serifId || id, path: [mx, my, lx, ly]});
                } else {
                    console.log('skipping' + d);
                }
                //for each vertex find the bound
            }
        });
        return bracingPattern;
    });
}

function processEachFile(path, e) {
    var promise = new Promise(function(resolve, reject) {
        let fp = path + "/" + e;
        fs.readFile(fp, "utf8", function(err, contents) {
            if (err) reject(err);
            else resolve(contents);
        });
    });
    return promise;
}

var bracingPatterns = [];
fs.readdir(path, function(err, items) {
    let finalArray = [];
    items.forEach(e => {
        finalArray.push(
            processEachFile(path, e).then(content => {
                return processJson(e, content);
            })
        );
    });
    let resolvedFinalArray = Promise.all(finalArray).then(t => {
        let final = {};
        t.forEach(e => {
            final[e.referenceCode] = e;
        })
        console.log(JSON.stringify(final));
    });
});
