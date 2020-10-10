module.exports = class CallHistory {
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
