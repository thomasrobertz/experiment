require("./evaluate")

module.exports = class Parameter {
	arrayDiff(a, b, result = []) {
        if (!b) {
            result.push(Evaluate.createReason("NOT_ARRAY", a, b))
            return result
        }
        if (a.length != b.length) {
            result.push(Evaluate.createReason("NOT_SAME_LENGTH", a, b))
            return result
        }
        for (var i = 0, l=a.length; i < l; i++) {
            if (a[i] instanceof Array && b[i] instanceof Array) {
                if (!Evaluate.arrayDiff(a[i], b[i], result)) {
                    result.push(Evaluate.createReason("ARRAY_NOT_EQUAL", a, b))  
                    return result
                }
            }           
            else if (a[i] != b[i]) { 
                result.push(Evaluate.createReason("ELEMENTS_NOT_EQUAL", a, b))   
                return result            
            }           
        }       
        return result
    }
}