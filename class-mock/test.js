
// Based on https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript (Zlato)
function compareArrays(a, b) {
	
	results = []

    if (!b) {
		results.push({ reson: "NOT_AN_ARRAY" })
		return results
	}

    for (var i = 0, l=a.length; i < l; i++) {        
        if (a[i] instanceof Array && b[i] instanceof Array) {
			return compareArrays(a[i], b[i])
        }           
        else if (a[i] != b[i]) { 
			results.push({
				reson: "NOT_EQUAL",
				a: a[i],
				b: b[i]
			})  
        }           
    }       
    return results;
}

function compareObjects(a, b) {
    //For the first loop, we only check for types
    for (propName in this) {
        //Check for inherited methods and properties - like .equals itself
        if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        //Check instance type
        else if (typeof this[propName] != typeof object2[propName]) {
            //Different types => not equal
            return false;
        }
    }
    //Now a deeper check using other objects property names
    for(propName in object2) {
        //We must check instances anyway, there may be a property that only exists in object2
            //I wonder, if remembering the checked values from the first loop would be faster or not 
        if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof this[propName] != typeof object2[propName]) {
            return false;
        }
        //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
        if(!this.hasOwnProperty(propName))
          continue;
        
        //Now the detail check and recursion
        
        //This returns the script back to the array comparing
        /**REQUIRES Array.equals**/
        if (this[propName] instanceof Array && object2[propName] instanceof Array) {
                   // recurse into the nested arrays
           if (!this[propName].equals(object2[propName]))
                        return false;
        }
        else if (this[propName] instanceof Object && object2[propName] instanceof Object) {
                   // recurse into another objects
                   //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
           if (!this[propName].equals(object2[propName]))
                        return false;
        }
        //Normal value comparison for strings and numbers
        else if(this[propName] != object2[propName]) {
           return false;
        }
    }
    //If everything passed, let's say YES
    return true;
}

var a = ["s"]
var b = ["x"]

console.log(compareArrays(a, b));