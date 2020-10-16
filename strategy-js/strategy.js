module.exports = class Strategy {

	constructor(strategiesDictionary = null) {
		this.strategiesDictionary = strategiesDictionary			
	}

	/**
	 * Runs a strategy by key.
	 * 
	 * @param {*} key 
	 * @param {*} message 
	 */
	run(key, message) { 
		const strategy = this.strategiesDictionary[key]
		if(strategy) {
			return strategy(message)
		} else {
			throw new Error(`Strategy '${key}' not found`)			
		}				
	}

	/**
	 * Returns an error strategy.
	 * 
	 * @param {*} message 
	 */
	static error(message) {	 
		const error = (override) => {
			if(override === undefined) {
				override = message								 
			}
			if (override instanceof Error) { 
				throw override
			}
			throw new Error(override)	
		}			
		return error		
	}

	/**
	 * Returns an error strategy with a fixed message.
	 * 
	 * @param {*} message 
	 */
	static errorFixed(message) {	 
		const error = () => {
			throw new Error(message)	
		}			
		return error		
	}

	/**
	 * Returns a logger strategy.
	 * 
	 * @param {*} logger 
	 */
	static log(logger) {
		const log = (message) => {		
			logger.log(message)		
		}	
		return log			
	}

	/**
	 * Returns a strategy that can return a value.
	 * The caller can pass the value.
	 * 
	 * @param {*} what 
	 */
	static returnValue(what) { 
		const returnValue = (override) => {			
			if (override !== undefined) {
				return override				
			}
			return what
		}
		return returnValue		
	}

	/**
	 * Returns a strategy that always returns the same value.
	 * The value returned is the one that is passed here on creation.
	 * 
	 * @param {*} what 
	 */
	static returnFixed(what) { 
		const returnFixed = () => {			
			return what
		}
		return returnFixed		
	}	

	/**
	 * Returns a strategy that logs messages to the console.
	 * The loglevel can be passed.
	 * 
	 * @param {*} level 
	 */
	static logToConsole(level = "log") {
		const logToConsole = (message) => {
			switch(level) {
				case "info":
					console.info(message)
					break
				case "warn":
					console.warn(message)
					break
				case "debug":
					console.debug(message)
					break					
				case "error":
					console.error(message)					
					break
				default:																		
					console.log(message)					
			}
		}
		return logToConsole		
	}	

	/**
	 * Returns a strategy that just ignores.
	 */
	static ignore() { 
		const ignore = () => { }
		return ignore			
	}

	/**
	 * Returns a strategy that invokes a callback.
	 * 
	 * @param {*} callbackFunction 
	 */
	static callback(callbackFunction) { 
		const callback = (message) => {
			callbackFunction(message)		
		}	
		return callback			
	}

	/**
	 * Returns a strategy that returns the return value of the callback function.
	 * 
	 * @param {*} callbackFunction 
	 */
	static returningCallback(callbackFunction) { 
		const returningCallback = (message) => {
			return callbackFunction(message)		
		}	
		return returningCallback
	}

	/**
	 * Returns a composition of strategies.
	 * Compositions can only contain one of each error, returnValue, returnStrict, or returningCallback strategies.
	 * 
	 * @param  {...any} strategies 
	 */
	static compose(...strategies) { 

		const errorCount = strategies.filter(s => s.name === "error").length
		const returnValueCount = strategies.filter(s => s.name === "returnValue" || s.name === "returnFixed").length		
		const returningCallbackCount = strategies.filter(s => s.name === "returningCallback").length		

		if(errorCount > 1) {
			throw new Error("Can only have one error strategy.")
		}

		if(returnValueCount > 1) {
			throw new Error("Can only have one returnValue/returnFixed strategy.")
		}

		if(returningCallbackCount > 1) {
			throw new Error("Can only have one returningCallback strategy.")
		}

		if(((errorCount + returnValueCount) > 1) ||
			((errorCount + returningCallbackCount) > 1) || 
			((returnValueCount + returningCallbackCount) > 1)) {
			throw new Error("Can only have one of error, returnValue, returnFixed, or returningCallback strategies.")	 
		}

		const compose = (message) => {
			let returnValue = null
			let errorStrategy = null
			// Walk the strategies
			for(let strategy of strategies) { 				
				switch(strategy.name) {
					case "error":
						// If an error strategy is encountered, break to execute it immediately.
						errorStrategy = strategy
						break
					case "returnValue":
					case "returnFixed":						
						// If there is a return value, capture it.
						returnValue = strategy(message)										
						break
					default:
						// Run the strategy.
						strategy(message)						
				}				
			}
			if (errorStrategy) { 
				errorStrategy()
			}
			return returnValue			
		}

		return compose
	}
}