/**
 * Based on solution in https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript?https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript?
 */
module.exports = class Parameters {

	constructor() { }

	static createReason(reason, expected, actual, additional = "") {		
        return {
            "reason": reason,
            "expected": expected,
			"actual": actual,
            "additional": additional
		}
	}
	
	/**
	 * Compares two parameters.
	 * 
	 * @param {*} a 
	 * @param {*} b 
	 */
	static diff(a, b) {

		let result = []

		// TODO Refactor to method + class constants
		const bothArrays = a instanceof Array && b instanceof Array
		const bothObjects = (a instanceof Object && b instanceof Object)  && !bothArrays
		const oneArray = (a instanceof Array || b instanceof Array) && !bothArrays
		const oneObject = (a instanceof Object || b instanceof Object) && !oneArray && !bothArrays	&& !bothObjects
		const bothPrimitives = !(bothArrays || bothObjects || oneArray || oneObject) 

		if (bothPrimitives) {
			if(a !== b) {
				result.push(Parameters.createReason("PRIMITIVE_NOT_EQUAL", a, b))
			}
			return result
		}

		if(oneArray || oneObject) {
			result.push(Parameters.createReason("PRIMITIVE_DIFFERENT_TYPES", a, b))
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
            result.push(Parameters.createReason("ARRAY_NOT_ARRAY", a, b))
            return result
        }
		
		if (a.length != b.length) {
            result.push(Parameters.createReason("ARRAY_NOT_SAME_LENGTH", a, b))
            return result
		}
		
        for (let i = 0, l=a.length; i < l; i++) {

			const bothArrays = a[i] instanceof Array && b[i] instanceof Array
			const bothObjects = (a[i] instanceof Object && b[i] instanceof Object)  && !bothArrays
			const oneArray = (a[i] instanceof Array || b[i] instanceof Array) && !bothArrays
			const oneObject = (a[i] instanceof Object || b[i] instanceof Object) && !oneArray && !bothArrays && !bothObjects
			const bothPrimitives = !(bothArrays || bothObjects || oneArray || oneObject) 

			if(oneArray || oneObject) {
				result.push(Parameters.createReason("ARRAY_DIFFERENT_TYPES", a, b))
				continue
			}

			if(bothArrays) {
				Parameters.arraysDiff(a[i], b[i], result)
				continue
			}

			if (bothObjects) {
				const objectsDiffResult = Parameters.objectsDiff(a[i], b[i])
				if (objectsDiffResult.length > 0) {
					result = result.concat(objectsDiffResult)
				}
				continue
			}

			if (bothPrimitives) {
				if (a[i] !== b[i]) { 
					result.push(Parameters.createReason("ARRAY_ELEMENTS_NOT_EQUAL", a[i], b[i]))   
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
		for (let propertyName in a) {
			if (a.hasOwnProperty(propertyName) != b.hasOwnProperty(propertyName)) {
				result.push(Parameters.createReason("OBJECT_PROPERTY_NOT_EXISTS", propertyName, ""))
				return result
			}
			else if (typeof a[propertyName] != typeof b[propertyName]) {
				result.push(Parameters.createReason("OBJECT_PROPERTY_DIFFERENT_TYPE", propertyName, typeof(a[propertyName])))
				return result
			}		
		}

		// Check object b types
		for(let propertyName in b) {

			if (a.hasOwnProperty(propertyName) != b.hasOwnProperty(propertyName)) {
				result.push(Parameters.createReason("OBJECT_PROPERTY_NOT_EXISTS", propertyName, ""))
				return result
			}
			else if (typeof a[propertyName] != typeof b[propertyName]) {
				result.push(Parameters.createReason("OBJECT_PROPERTIES_DIFFERENT_TYPES", propertyName, typeof(a[propertyName])))
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
					result = result.concat(arraysDiffResult)
				}
				continue
			}

			if (bothObjects) {
				Parameters.objectsDiff(a[propertyName], b[propertyName], result)			
				continue
			}

			// If we reach this point there can only be two primitives left.
			if(a[propertyName] !== b[propertyName]) {
				result.push(Parameters.createReason("OBJECT_PROPERTIES_NOT_EQUAL", a[propertyName], b[propertyName], propertyName))
			}			
		}
		return result
	}  	
}