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

const expectations = [
    { "name": "methodName", "expectation": call(2), order: true, status: "" },
    { "name": "otherMethod", "expectation": call(1), order: true, status: "" }
]

const callHistory = [
    { name: "methodName", parameters: [] },
    { name: "methodName", parameters: [] },
    { name: "otherMethod", parameters: [] }
]

do {

    const current = callHistory.shift()
    
    Object.entries(expectations).forEach(expectation => {
        if((expectation[1].name === current.name) && 
            (expectation[1].status === "")) {
            expectation[1].expectation.actualCount++
        }
    })  

} while(callHistory.length > 0)

Object.entries(expectations).forEach(expectation => {
    if(expectation[1].expectation.actualCount === 
        expectation[1].expectation.expectedCount) {
        expectation[1].status = 'passed'
    }
})  

console.log(expectations);
















