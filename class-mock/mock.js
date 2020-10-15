var CallHistory = require('./callHistory')

/**
 * The main mocking class, uses a proxy to intercept and log calls to the target.
 */
module.exports = class Mock {

	constructor(classToMock) {
		
		this.callHistory = new CallHistory()

        // Rebind this
        let self = this
        
        // Intercepting handler
		const handler = {
			get(target, methodName, receiver) {		
				if (methodName in self) {
                    return self[methodName]; // Forward	to self
                }
				if(!(Object.getOwnPropertyNames(classToMock.prototype).includes(methodName))) {
					throw new Error(`Method ${methodName} does not exist in class ${classToMock}`)			
				}						
				return function (...args) {					
                    // Log target call 
                    self.callHistory.call(methodName, args)
				};
			}
		}
		return new Proxy(classToMock, handler);
	}
}