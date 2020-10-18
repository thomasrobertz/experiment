var CallHistory = require('./callHistory')
var Evaluate = require('./evaluate')

function isClass(func) {
	return typeof func === 'function' 
	  && /^class\s/.test(Function.prototype.toString.call(func));
}

/**
 * The main mocking class, uses a proxy to intercept and log calls to the target.
 */
module.exports = class Mock {

	constructor(whatToMock, epexctations = null) {
		
		this.callHistory = new CallHistory()
		this.expectations = epexctations

		// For binding 'this' in the handler.
		let self = this
		let proxy
		
		if(isClass(whatToMock)) {
			const handler = {
				get(target, methodName, receiver) {		
					if (methodName in self) {
						return self[methodName]; // Forward	to self.
					}
					if(!(Object.getOwnPropertyNames(whatToMock.prototype).includes(methodName))) {
						throw new Error(`Method ${methodName} does not exist in class ${whatToMock}`)			
					}						
					return function (...args) {					
						// Log target call.
						self.callHistory.call(methodName, args)
					}
				}
			}
			proxy = new Proxy(whatToMock, handler)
		}
		else {
			const handler = {
				apply: function(target, thisArg, args) {
					// Log target call.
					self.callHistory.call(target.name, args)
					return self
				}
			}
			proxy = new Proxy(whatToMock, handler)
			// HACK: Attach an instance of this to the function itself.
			proxy.mock = this			
		}

		return proxy
	}

	static of(whatToMock) {
		return new Mock(whatToMock)
	}

	getCallHistory() {
		return this.callHistory.callHistory
	}

	clearCallHistory() {
		this.callHistory.clear()
		return this
	}

	getCallHistoryNumber(index) {
		return this.callHistory.callHistory[index]
	}

	evaluate(filter) {
		return new Evaluate(this.expectations).filter(filter)	
	}
}