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
        this.actualParameters = undefined
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
        this.copy.push(expectation)
        return this
    }

    addExpectations(expectationsList) {
        this.expectations = this.expectations.concat(expectationsList)
        this.copy = this.copy.concat(expectationsList)
        return this
    }

    /**
     * Advance to the next expectation.
     * The force swtich is used if the current expectation could not be (fully) matched.
     * 
     * @param {*} force 
     */
    next(force = false) {
        if (this.current === null) {
            // First time call.
            this.current = this.copy.shift()
            return this.current
        }
        if((this.current.actualCount < this.current.expectedCount) && !force) {
            // Expected count has not been reached.
            return this.current
        }
        if (this.current.hasNext() && !force) {
            // The current expectation has a next expectation in order.
            this.current = this.current.next
            return this.current
        }
        if(this.copy.length > 0) {
            // There are still expectations.
            this.current = this.copy.shift()
        } else {
            // Expectations are exhausted.
            return null
        }
        return this.current
    }

    /**
     * Walk expectations and call history entries.
     * Try to match each history entry against the expectations,
     * until the call history is exhausted. Also checks parameters.
     * 
     * @param {*} callHistory 
     */       
    match(callHistory, force = false) {
        
        // Get the next expectation
        let current = this.next(force)
        
        // Extra check is be needed on the last recursion
        if(current === null) {            
            return
        }

        let historyMatch

        // Loop over expectations and try to match each against the call history.
        do {
            historyMatch = callHistory.match(current.name)   
            if (historyMatch) { 
                // Match found, increase count and record parameters.
                current.actualCount++
                if (historyMatch.parameters !== undefined) {
                    if (current.actualParameters instanceof Array) {
                        current.actualParameters = current.actualParameters.concat(historyMatch.parameters)
                    } else {
                        current.actualParameters = [historyMatch.parameters]
                    }
                }
            }
            // Advance to next expectation.
            current = this.next()
        } while(current && historyMatch)

        if (current !== null) {
            // There is an unmatched expectations recurse and force to next expectation.
            this.match(callHistory, true)
        }

        return this.expectations
    }

    flatten(expectations, disband = true) {
        const list = []
        expectations.forEach(e => {
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