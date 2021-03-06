var Parameters = require('./parameters')
var parameters = new Parameters()

module.exports = class Evaluate {
   
    static FAILED = "failed"
    static PASSED = "passed"

    constructor(expectations) {
        this.expectations = expectations
        this.resultFilter = Evaluate.FAILED
		this.failMessages = []
    }

    failed() {
        this.resultFilter = Evaluate.FAILED
        return this
    }

    passed() {
        this.resultFilter = Evaluate.PASSED
        return this
    }
    
    addMessage(name, type, reason) {
       this.failMessages.push({ 
           "name": name,
           "type": type,
           "reason": reason
       }) 
    }

    filter(resultFilter) {
        if (resultFilter === undefined) {
            resultFilter = this.resultFilter
        }
        return this.expectations.filter(e => {
            const countResult = e.expectedCount === e.actualCount
            const parametersResult = Parameters.diff(e.expectedParameters, e.actualParameters)            
            if (this.resultFilter === Evaluate.FAILED) {
                if (!countResult) {
                    this.addMessage(e.name, "method", Parameters.createReason("Counts do not equal", e.expectedCount, e.actualCount))
                }
                if (parametersResult.length > 0) {
                    parametersResult.forEach(r => this.addMessage(e.name, "parameters", r))
                }
                return (!countResult) || (parametersResult.length > 0)
            }
            return countResult && (parametersResult.length === 0)
        })
    }

    log() {
        console.log(this.failMessages)
        console.log("Count of " + this.resultFilter + ": " +  this.filter().length);
        console.log("Fail messages count: " + this.failMessages.length);
    }
}
