const expect = require('chai').expect
const Strategy = require('../strategy')
var Mock = require('../class-mock/mock')
const { assert } = require('chai')

class Logger {
	log(message) {
		return message
	}
}

function callbackFunction(args) {
	args
}

var logMock = new Mock(Logger)
var callbackFunctionMock = new Mock(callbackFunction)

class TestClass {
	constructor() {
		this.ignoreStrategy = Strategy.ignore()
		this.errorStrategy = Strategy.error()
		this.loggerStrategy = Strategy.log(logMock)
		this.returnStrategy = Strategy.returnValue(5)		
		this.returnStrategyStrict = Strategy.returnStrict(true)	
		this.callbackStrategy = Strategy.callback(callbackFunctionMock)		
		this.returningCallbackStrategy = Strategy.returningCallback(function (message) { 
			if(message === undefined) {
				return "returning callback"
			}
			return "returning callback:" + message				 
		})	
		this.dictionaryStrategy = new Strategy({ 
			"error": Strategy.error(), 
			"return": Strategy.returnValue("returnedValue")  
		})
		//this.composedStrategy =
		//this.consoleStrategy = 
	}
	testIgnore() {
		return this.ignoreStrategy()
	}	
	testLogger() {
		return this.loggerStrategy("logmessage")
	}
	testReturn(what) {
		return this.returnStrategy(what)
	}	
	testReturnStrict() {
		return this.returnStrategyStrict()
	}		
	testCallback(message) {
		return this.callbackStrategy(message)		
	}		
	testReturningCallback(message) {
		return this.returningCallbackStrategy(message)		
	}	
	testDictionaryStrategyError() {
		this.dictionaryStrategy.run("error")
	}
	testDictionaryStrategyReturn() {
		return this.dictionaryStrategy.run("return")
	}	
}

var testClass = new TestClass()

describe('Strategy', function () {

	describe('ignore', function () {
		it('nothing should happen', function () {
			testClass.testIgnore()
			assert(true)
		})
	})

	describe('throw', function () {
	  it('should throw an error', function () {
		// Explicitly call errorStrategy as a function on testClass by binding
		expect(testClass.errorStrategy.bind(testClass)).to.throw(Error)	
	  })
	})

	describe('log', function () {
		it('should log a message', function () {
			testClass.testLogger()
			const history = logMock.getCallHistoryNumber(0)
			expect(history["name"]).to.equal("log")	
		  	expect(history["parameters"]).to.eql(["logmessage"])				  
		})
	})

	describe('callback', function () {
		
		it('should call a callback function', function () {
			testClass.testCallback("input")
			const history = callbackFunctionMock.mock.getCallHistoryNumber(0)
			expect(history["name"]).to.equal("callbackFunction")	
		  	expect(history["parameters"]).to.eql(["input"])			
		})

		it('should return a value from a callback function', function () {
			expect(testClass.testReturningCallback()).to.equal("returning callback");
			expect(testClass.testReturningCallback("msg")).to.equal("returning callback:msg")			  
		})
	})	

	describe('dictionary', function () {
		
		it('should throw an error', function () {
			expect(testClass.testDictionaryStrategyError.bind(testClass)).to.throw(Error)	
		})

		it('should return a value', function () {
			expect(testClass.testDictionaryStrategyReturn()).to.equal("returnedValue")		  
		})
	})

	describe('compose', function () {		

		it('should invoke a callback and return a value from a composition', function () {
			// TODO
		})

		it('should throw on illegal composition', function () {

			// Instead of binding, throwing code can also be wrapped in functions.

			function moreThanOneError() {
				Strategy.compose(Strategy.error(), Strategy.error())
			}
			function moreThanOneReturnValue() {
				Strategy.compose(Strategy.returnValue(), Strategy.returnValue())
			}
			function moreThanOneReturnStrict() {
				Strategy.compose(Strategy.returnStrict(), Strategy.returnStrict())
			}	
			function moreThanOneReturningCallback() {
				Strategy.compose(Strategy.returningCallback(), Strategy.returningCallback())
			}	
		
			function mixErrorAndReturnValue() {
				Strategy.compose(Strategy.error(), Strategy.returnValue())
			}		
			function mixErrorAndReturnStrict() {
				Strategy.compose(Strategy.error(), Strategy.returnStrict())
			}	
			function mixErrorAndReturningCallback() {
				Strategy.compose(Strategy.error(), Strategy.returningCallback())
			}			
		
			function mixReturnValueAndReturnStrict() {
				Strategy.compose(Strategy.returnValue(), Strategy.returnStrict())
			}		
			function mixReturnValueAndReturnCallback() {
				Strategy.compose(Strategy.returnValue(), Strategy.returningCallback())
			}	
		
			function mixReturnStrictAndReturnCallback() {
				Strategy.compose(Strategy.returnStrict(), Strategy.returningCallback())
			}
		
			function mixAll() {
				Strategy.compose(Strategy.error(), Strategy.returnValue(), Strategy.returnStrict(), Strategy.returningCallback())
			}
			
			expect(moreThanOneError).to.throw()
			expect(moreThanOneReturnValue).to.throw()
			expect(moreThanOneReturnStrict).to.throw()
			expect(moreThanOneReturningCallback).to.throw()			
		
			expect(mixErrorAndReturnValue).to.throw()			
			expect(mixErrorAndReturnStrict).to.throw()			
			expect(mixErrorAndReturningCallback).to.throw()			
		
			expect(mixReturnValueAndReturnStrict).to.throw()	
			expect(mixReturnValueAndReturnCallback).to.throw()			
		
			expect(mixReturnStrictAndReturnCallback).to.throw()			
		
			expect(mixAll).to.throw()		  
		})		
	})	

	describe('console', function () {
		it('should log to the console', function () {
			// TODO
			/*
			(function(){
				var logPointer = console.log;
				console.log = function (message) {
					logPointer.apply(console, arguments);
				};
			})();
			*/
			
		})
	})	
})