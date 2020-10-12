class Expectation {

    constructor(name, expectedCount, expectedParameters, next) {
        if(name === undefined) {
            throw new Error("Expectation needs a method name.")
        }        
        if(expectedCount === undefined) {
            expectedCount = 1
        }
        this.name = name
        this.expectedCount = expectedCount
        this.actualCount = 0 
        this.expectedParameters = expectedParameters
        this.actualParameters = []
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
     * until the call history is exhausted. Also checks parameters.
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
                current.actualParameters = current.actualParameters.concat(historyMatch.parameters)
            }
           current = this.next()
        } while(current && historyMatch)
        return this
    }

    flatten(disband = true) {
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
        if (disband) {
            list.map(l => l.next = null)
        }
        return list
    }
}

module.exports = { Expectation, Expectations }