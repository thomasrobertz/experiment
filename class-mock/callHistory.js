module.exports = class CallHistory {
    constructor() {
        this.clear()
    }
    call(name, parameters) {
        if (parameters === undefined) {
            parameters = []
        }
        this.callHistory.push({
            "name": name, 
            "parameters": parameters
        })
    }
    clear() {
        this.callHistory = []
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
