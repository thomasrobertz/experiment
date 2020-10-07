const nearley = require("nearley");
const grammar = require("./dsl/grammar.js")
const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar))

console.log(parser.feed(">3 and <8").results)

const call = (howMany) => {
    if(howMany === undefined) {
        throw new Error("Number of expected calls must be specified.")
    }
    return {
        "operation": "Call",
        "howMany": howMany,
        "count": 0
    }
}

const expectations = {
    "methodName": call(2),
    "otherMethod": call(1) 
}

const callHistory = {
    methodName: [],
    methodName: []
}

//console.log(expect(call(2)));

Object.entries(callHistory).forEach(([method, parameters]) => {
    //console.log(method)
})

Object.entries(expectations).forEach(([method, expectation]) => {
    console.log(method, expectation)
})















