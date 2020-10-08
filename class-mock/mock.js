const nearley = require("nearley");
const grammar = require("./dsl/grammar.js")
const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar))

//console.log(parser.feed(">3 and <8").results)

const call = (expectedCount) => {
    if(expectedCount === undefined) {
        throw new Error("Number of expected calls must be specified.")
    }
    return {
        "operation": "Call",
        "expectedCount": expectedCount,
        "actualCount": 0
    }
}

// TODO: Use Que? Then: For each history item consume an expectation

const expectations = [
    { "methodName": call(2) },
    { "otherMethod": call(1) }
]

const callHistory = [
    { name: "methodName", parameters: [] },
    { name: "methodName", parameters: [] },
    { name: "otherMethod", parameters: [] }
]

Object.entries(callHistory).forEach(call => {
    expectations[call[1].name].actualCount++   
})

console.log(expectations)

















