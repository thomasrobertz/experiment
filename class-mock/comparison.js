const nearley = require("nearley");
const grammar = require("./dsl/grammar.js")

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

class ComparisonDsl {
    constructor() {
        this.parser = new nearley.Parser(
            nearley.Grammar.fromCompiled(grammar))
        this.current = null
    }
    parse(input) {        
        const results = this.parser.feed(input).results
        console.log(results)
        this.depthFirst(results)
        return this
    }
    depthFirst(ast) {
        ast.forEach(node => {

        })
    }
    evaluate(input) {
        console.log(this.current);
    }
}

var cmp = new ComparisonDsl()
//cmp.parse("<3").evaluate(4)
cmp.parse(">3 and <8").evaluate(4)