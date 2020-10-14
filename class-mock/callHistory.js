module.exports = class CallHistory {
    
    constructor() {
        this.clear()
    }

    call(name, parameters) {
        let call = {
            "name": name, 
            "parameters": parameters,
            "matched": false
        }
        this.callHistory.push(call)
        this.copy.push(call)        
        return this
    }

    clear() {
        this.callHistory = []
        this.copy = []
        return this
    }

    /**
     * Reset the call history to include the original call list,
     * without the matches that were found already.
     */
    reset() {
        this.callHistory = this.copy.filter(c => { return !(c.matched) })
        return this
    }

    /**
     * Try to match the given name against the call history.
     * If a match is found, it's copy is marked as matched as well,
     * so it won't be found again in subsequent cycles.
     * Auto resets the call history, so if the match is not found, 
     * it can potentially cause an endless loop.
     * 
     * @param {*} name 
     */
    match(name) {
        if (this.callHistory.length === 0) {
            if (this.copy.length > 0) {
                this.reset()
            } else {
                return null
            }
        }
        let match = null
        let i = 0
        for(i; i < this.callHistory.length; i++) {
            let current = this.callHistory[i]
            let currentCopy = this.copy[i]
            if(current.name === name && current.matched === false) {
                match = current
                // Mark the copy as matched.
                currentCopy.matched = true
                break;
            }
        }
        if(match) {            
            this.callHistory.splice(i, 1)         
        }
        return match
    }        
}
