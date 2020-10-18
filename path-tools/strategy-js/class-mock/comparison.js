/**
 * Some simple comparison and logic tools.
 */
class Node {
    constructor(value) {
        this.value = value        
    }   
    evaluate(input) {
        if (!Number.isInteger(input)) {
            throw new TypeError("input must be an integer")
        }
    }
    and(node) {
        return new And(this, node)
    }
    or(node) {
        return new Or(this, node)
    }    
}

class Times extends Node {
    constructor(value) {
        super(value)
    }
    evaluate(input) {
        return input === this.value
    }    
}

class Greater extends Node {
    constructor(value = 1) {
        let superValue = value
        if (value instanceof Times) {
            superValue = value.value
        }
        super(superValue)
    }
    evaluate(input) {
        return input > this.value
    }
}

class Less extends Greater {
    constructor(value = 1) {
        super(value)
    }
    evaluate(input) {
        return input < this.value
    }
}

class And {
    constructor(left, right) {
        this.left = left
        this.right = right
    }
    evaluate(input) {
        return this.left.evaluate(input) && this.right.evaluate(input)
    }
}

class Or {
    constructor(left, right) {
        this.left = left
        this.right = right
    }
    evaluate(input) {
        return this.left.evaluate(input) || this.right.evaluate(input)
    }
}

class Not {
    constructor(left) {
        this.left = left
        this.right = null
    }
    evaluate(input) {
        return !(this.left.evaluate(input))
    }
}

module.exports = function() {
    this.times = function (v) { return new Times(v) };
    this.once = function () { return new Times(1) };    
    this.less = function (v) { return new Less(v) };     
    this.greater = function (v) { return new Greater(v) };         
    this.not = function (l) { return new Not(l) };

    // Simple parser for strings like ">6"
    this.parse = function (input) { 

        if (input === "+") { 
            // Called at least once.
            return new Greater(0)
        }

        let match = input.match(/\=(\d+)/)        
        if (match) {
            // Called exactly this many times.
            return new Times(Number(match[1]))
        }

        match = input.match(/\>\s*(\d+)\s*\<\s*(\d+)/)
        if (match) {
            // Between.
            return new Greater(Number(match[1])).and(new Less(Number(match[2])))
        }

        match = input.match(/\<\s*(\d+)\s*\>\s*(\d+)/)
        if (match) {
            // Outside.
            return new Less(Number(match[1])).or(new Greater(Number(match[2])))
        }       

        match = input.match(/\>\s*(\d+)/)
        if (match) {
            // Greater than.
            return new Greater(Number(match[1]))
        }        

        match = input.match(/\<\s*(\d+)/)        
        if (match) {
            // Less than.
            return new Less(Number(match[1]))
        }                

        match = input.match(/(\d+)/)        
        if (match) {
            // Integer.
            return new Times(Number(match[1]))
        }  

        throw new Error(`Unable to parse '${input}'`)
    }
}