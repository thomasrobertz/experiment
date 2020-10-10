require("./evaluate")

/**
 * Based on solution in https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript?https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript?
 */
module.exports = class Parameters {

	/**
	 * Compares two parameters.
	 * 
	 * @param {*} a 
	 * @param {*} b 
	 */
	static diff(a, b) {

		let result = []

		const bothArrays = a[i] instanceof Array && b[i] instanceof Array
		const bothObjects = a[i] instanceof Object && b[i] instanceof Object			
		const oneArray = a[i] instanceof Array || b[i] instanceof Array
		const oneObject = a[i] instanceof Object || b[i] instanceof Object			
		const bothPrimitives = !(bothArrays || bothObjects || oneArray || oneObject) 

		if (bothPrimitives) {
			if(!(a === b)) {
				result.push(Evaluate.createReason("PRIMITIVE_NOT_EQUAL", a, b))
			}
			return result
		}

		if(oneArray || oneObject) {
			result.push(Evaluate.createReason("PRIMITIVE_DIFFERENT_TYPES", a, b))
			return result
		}

		if (bothArrays) {
			return Parameters.arraysDiff(a, b)
		}

		if (bothObjects) {
			return Parameters.objectsDiff(a, b)
		}
	}

	/**
	 * Deep compares two arrays.
	 * 
	 * @param {*} a 
	 * @param {*} b 
	 * @param {*} result 
	 */
	static arraysDiff(a, b, result = []) {

        if (!b) {
            result.push(Evaluate.createReason("ARRAY_NOT_ARRAY", a, b))
            return result
        }
		
		if (a.length != b.length) {
            result.push(Evaluate.createReason("ARRAY_NOT_SAME_LENGTH", a, b))
            return result
		}
		
        for (let i = 0, l=a.length; i < l; i++) {

			const bothArrays = a[i] instanceof Array && b[i] instanceof Array
			const bothObjects = a[i] instanceof Object && b[i] instanceof Object			
			const oneArray = a[i] instanceof Array || b[i] instanceof Array
			const oneObject = a[i] instanceof Object || b[i] instanceof Object			
			const bothPrimitives = !(bothArrays || bothObjects || oneArray || oneObject) 

			if(oneArrays || oneObject) {
				result.push(Evaluate.createReason("ARRAY_DIFFERENT_TYPES", a, b))
				continue
			}

			if(bothArrays) {
				const arraysDiffResult = Parameters.arraysDiff(a[i], b[i], result)
                if (arraysDiffResult.length > 0) {
                    result.push(Evaluate.createReason("ARRAY_NOT_EQUAL", a, b))
				}
				continue
			}

			if (bothObjects) {
				const objectsDiffResult = Parameters.objectsDiff(a[i], b[i])
				if (objectsDiffResult.length > 0) {
					result.concat(objectsDiffResult)
				}
				continue
			}

			if (bothPrimitives) {
				if (a[i] != b[i]) { 
					result.push(Evaluate.createReason("ARRAY_ELEMENTS_NOT_EQUAL", a, b))   
				}
				continue
			}
		}       
        return result
	}
	
	/**
	 * Deep compares two objects.
	 * 
	 * @param {*} a 
	 * @param {*} b 
	 * @param {*} result 
	 */
	static objectsDiff(a, b, result = []) {
		
		// Check object a inherited types
		for (propertyName in a) {
			if (a.hasOwnProperty(propertyName) != b.hasOwnProperty(propertyName)) {
				result.push(Evaluate.createReason("OBJECT_PROPERTY_NOT_EXISTS", a, b, propertyName))
				return result
			}
			else if (typeof a[propertyName] != typeof b[propertyName]) {
				result.push(Evaluate.createReason("OBJECT_PROPERTY_DIFFERENT_TYPE", a, b, propertyName))
				return result
			}		
		}

		// Check object b types
		for(propertyName in b) {

			if (a.hasOwnProperty(propertyName) != b.hasOwnProperty(propertyName)) {
				result.push(Evaluate.createReason("OBJECT_PROPERTY_NOT_EXISTS", a, b, propertyName))
				return result
			}
			else if (typeof a[propertyName] != typeof b[propertyName]) {
				result.push(Evaluate.createReason("OBJECT_PROPERTIES_DIFFERENT_TYPES", a, b, propertyName))
				return result
			}
			
			if(!a.hasOwnProperty(propertyName)) {
				// Inherited property, therefore it must be equal.
				continue
			}
			
			// Recurse into arrays or objects if necessary, otherwise compare primitives.			
			const bothArrays = a[propertyName] instanceof Array && b[propertyName] instanceof Array
			const bothObjects = a[propertyName] instanceof Object && b[propertyName] instanceof Object			

			if (bothArrays) {
				const arraysDiffResult = Parameters.arraysDiff(a[propertyName], b[propertyName])
				if (arraysDiffResult.length > 0) {
					result.concat(arraysDiffResult)
				}
				continue
			}

			if (bothObjects) {
				const objectsDiffResult = Parameters.objectsDiff(a[propertyName], b[propertyName], result)
				if (objectsDiffResult.length > 0) {
                    result.push(Evaluate.createReason("OBJECT_NOT_EQUAL", a, b))
				}				
				continue
			}

			// If we reach this point there can only be two primitives left.
			if(a[propertyName] != b[propertyName]) {
				result.push(Evaluate.createReason("OBJECT_PROPERTIES_NOT_EQUAL", a, b, propertyName))
			}			
		}
		return result
	}  	
}