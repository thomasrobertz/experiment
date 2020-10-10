const nearley = require("nearley");
const grammar = require("./dsl/grammar.js")
const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar))

//console.log(parser.feed(">3 and <8").results)

class CallHistory {
    constructor() {
        this.callHistory = []
    }
    call(name, parameters) {
        this.callHistory.push({
            "name": name, 
            "parameters": parameters
        })
    }
    length() {
        return this.callHistory.length
    }
    next(name) {
        let match = null
        let i = 0
        for(i; i < this.callHistory.length; i++) {
            let current = this.callHistory[i]
            if(current.name === name) {
                match = current
                break;
            }
        }
        if(match) {
            this.callHistory.splice(i, 1)            
        }
        return match
    }        
}

class Expectation {

    constructor(name, expectedCount, next) {
        if(name === undefined) {
            throw new Error("Expectation needs a method name.")
        }        
        if(expectedCount === undefined) {
            expectedCount = 1
        }
        this.name = name
        this.expectedCount = expectedCount
        this.actualCount = 0 
        this.next = next
    }
    setNext(next) {
        this.next = next
    }
    hasNext() {
        return this.next instanceof Expectation
    }    
}

class Expectations {

    constructor() {
        this.expectations = []
        this.copy = []
        this.current = null
    }

    addExpectation(expectation) {
        this.expectations.push(expectation)
        return this
    }

    next() {
        if (this.current === null) {
            this.current = this.copy.shift()
            return this.current
        }
        if(this.current.actualCount < this.current.expectedCount) {
            return this.current
        }
        if (this.current.hasNext()) {
            this.current = this.current.next
            return this.current
        }
        if(this.copy.length > 0) {
            this.current = this.copy.shift()
        } else {
            return null
        }
        return this.current
    }

    /**
     * Walk expectations and call history entries.
     * Try to match each history entry against the current expectation,
     * until the call history is exhausted.
     * 
     * @param {*} callHistory 
     */
    match(callHistory) {        
        
        this.copy = [...this.expectations]
        let current = this.next()
        let historyMatch

        do {

            historyMatch = callHistory.next(current.name)
           
            if (historyMatch) {
                current.actualCount++
            }

           current = this.next()

        } while(current && historyMatch)

        return this
    }

    flatten() {
        const list = []
        this.expectations.forEach(e => {
            list.push(e)      
            let next = e.next
            while(next) {
                if(next) {
                    list.push(next)
                }
                next = next.next
            }
        })
        return list
    }
}

class Evaluate {
   
    static FAILED = "failed"
    static PASSED = "passed"

    constructor(expectations) {
        this.expectations = expectations.flatten()
        this.resultFilter = Evaluate.FAILED
    }

    failed() {
        this.resultFilter = Evaluate.FAILED
        return this
    }

    passed() {
        this.resultFilter = Evaluate.PASSED
        return this
    }

    filter() {
        return this.expectations.filter(e => {
            if (this.resultFilter === Evaluate.FAILED) {
                return e.expectedCount !== e.actualCount
            }
            return e.expectedCount === e.actualCount
        })
    }

    log() {
        console.log(this.filter());
    }
}

const expectations = new Expectations()
expectations.addExpectation(new Expectation("methodName", 1, 
    new Expectation("methodName", 1, 
    new Expectation("otherMethod", 2))))

const callHistory = new CallHistory()
callHistory.call("methodName", [])
callHistory.call("methodName", [])
callHistory.call("otherMethod", [])
callHistory.call("otherMethod", [])

new Evaluate(expectations.match(callHistory)).passed().log()
















