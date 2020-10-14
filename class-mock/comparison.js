class Node {
    constructor(operator, value = null) {
        this.left = null
        this.right = null        
        this.operator = operator
        this.value = value        
    }   
    evaluate(input) {

        const localResult = null

        if (this.operator === "GreaterThan") {
            localResult = input > this.value 
        }
        if (this.operator === "LessThan") {
            localResult = input < this.value 
        }        
          
        if (this.left) {
            localResult = localResult && this.left.evaluate(input)
        }
        if (this.right) {
            localResult = localResult && this.right.evaluate(input)
        }                    

        return localResult
    }
}