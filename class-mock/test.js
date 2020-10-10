function createReason(reason, expected, actual) {
    return {
        "reason": reason,
        "expected": expected,
        "actual": actual
    }
}

function compareArrays (a, b, result = []) {

    if (!b) {
        result.push(createReason("NOT_ARRAY", a, b))
        return result
    }

    if (a.length != b.length) {
        result.push(createReason("NOT_SAME_LENGTH", a.length, b.length))
        return result
    }

    for (var i = 0, l=a.length; i < l; i++) {
        // Check if we have nested arrays
        if (a[i] instanceof Array && b[i] instanceof Array) {
            if (!compareArrays(a[i], b[i], result)) {
                result.push(createReason("ARRAY_NOT_EQUAL", a, b))  
                return result
            }
        }           
        else if (a[i] != b[i]) { 
            result.push(createReason("ELEMENTS_NOT_EQUAL", a, b))   
            return result            
        }           
    }       
    return result
}

var a = [["x"], ["y"]]
var b = [["x"], ["y", 4]]

console.log(compareArrays(a, b));