var expect = require('chai').expect

var Expectations = require('../expectations').Expectations
var Expectation = require('../expectations').Expectation
var callHistory = new (require('../callHistory'))()

function createExpectations(withNext = false) {

  const expectations = new Expectations()

  expectations.addExpectations([
    new Expectation("Method1"),
    new Expectation("Method2", 3),        
    new Expectation("Method3", 1, ["x"]),                
    new Expectation("Method4", 2, [4, "y"]),                        
    new Expectation("Method1", 2),
    new Expectation("Method5", 1, [{"key": 1, "value": [0, 1]}])     
  ])

  if (withNext) {
    expectations.addExpectation(new Expectation("Method6", 1, [], new Expectation("Method7", 2)))
    expectations.addExpectation(new Expectation("Method8"))
  }

  return expectations
}

function standardCall() {
  callHistory.clear()  
  callHistory.call("Method1")
  callHistory.call("Method2").call("Method2").call("Method2")
  callHistory.call("Method3", "x")
  callHistory.call("Method4", 4).call("Method4", "y")
  callHistory.call("Method1").call("Method1")
  callHistory.call("Method5", {"key": 1, "value": [0, 1]})
}

describe('Expectations', function () {
  
  describe('match', function () {
    it('should match all calls', function () {
      
      const expectations = createExpectations() 

      expect(expectations.expectations[0].expectedCount).to.equal(1)
      expect(expectations.expectations[1].expectedCount).to.equal(3)
      expect(expectations.expectations[2].expectedCount).to.equal(1)
      expect(expectations.expectations[3].expectedCount).to.equal(2)
      expect(expectations.expectations[4].expectedCount).to.equal(2)      
      expect(expectations.expectations[5].expectedCount).to.equal(1)        

      expect(expectations.expectations[0].actualCount).to.equal(0)
      expect(expectations.expectations[1].actualCount).to.equal(0)
      expect(expectations.expectations[2].actualCount).to.equal(0)
      expect(expectations.expectations[3].actualCount).to.equal(0)
      expect(expectations.expectations[4].actualCount).to.equal(0) 
      expect(expectations.expectations[5].actualCount).to.equal(0)       

      expect(expectations.expectations[0].actualParameters).to.equal(undefined)
      expect(expectations.expectations[1].actualParameters).to.equal(undefined)
      expect(expectations.expectations[2].actualParameters).to.equal(undefined)
      expect(expectations.expectations[3].actualParameters).to.equal(undefined)
      expect(expectations.expectations[4].actualParameters).to.equal(undefined) 
      expect(expectations.expectations[5].actualParameters).to.equal(undefined)       

      standardCall()
      const matches = expectations.match(callHistory)

      expect(matches[0].actualCount).to.equal(matches[0].expectedCount)
      expect(matches[1].actualCount).to.equal(matches[1].expectedCount)
      expect(matches[2].actualCount).to.equal(matches[2].expectedCount)
      expect(matches[3].actualCount).to.equal(matches[3].expectedCount)
      expect(matches[4].actualCount).to.equal(matches[4].expectedCount)      
      expect(matches[5].actualCount).to.equal(matches[5].expectedCount)           

      expect(matches[0].expectedParameters).to.equal(undefined)
      expect(matches[1].expectedParameters).to.equal(undefined)
      expect(matches[2].expectedParameters).to.eql(["x"])
      expect(matches[3].expectedParameters).to.eql([4, "y"])
      expect(matches[4].expectedParameters).to.equal(undefined)                        
      expect(matches[5].expectedParameters).to.eql([{"key": 1, "value": [0, 1]}])                              
    })   

    it('should match all calls in order', function () {
      
      const expectations = createExpectations(true) 

      standardCall()
      callHistory.call("Method6")
      callHistory.call("Method7").call("Method7")
      callHistory.call("Method8")

      const matches = expectations.match(callHistory)

      expect(matches[0].actualCount).to.equal(matches[0].expectedCount)
      expect(matches[1].actualCount).to.equal(matches[1].expectedCount)
      expect(matches[2].actualCount).to.equal(matches[2].expectedCount)
      expect(matches[3].actualCount).to.equal(matches[3].expectedCount)
      expect(matches[4].actualCount).to.equal(matches[4].expectedCount)      
      expect(matches[5].actualCount).to.equal(matches[5].expectedCount)  
      expect(matches[6].actualCount).to.equal(matches[6].expectedCount)  
      expect(matches[7].actualCount).to.equal(matches[7].expectedCount)  
    })

    it('should match all calls even if the call order is different', function () {

      const expectations = createExpectations() 

      callHistory.clear()
      callHistory.call("Method2").call("Method2") // only called twice
      callHistory.call("Method4", 4).call("Method4", "y") // Method 3 not called
      callHistory.call("Method1").call("Method1") // Not called first

      const matches = expectations.match(callHistory)

      expect(matches[0].actualCount).to.equal(1)
      expect(matches[1].actualCount).to.equal(2)
      expect(matches[2].actualCount).to.equal(0)
      expect(matches[3].actualCount).to.equal(2)
      expect(matches[4].actualCount).to.equal(1)                  
      expect(matches[5].actualCount).to.equal(0)      
    }) 
    
    it('should match all calls even if the call order is different and there is a next expectation', function () {

      const expectations = createExpectations(true) 

      callHistory.clear()
      callHistory.call("Method2").call("Method2") // only called twice
      callHistory.call("Method4", 4).call("Method4", "y") // Method3 not called
      callHistory.call("Method1").call("Method1") // Not called first
      callHistory.call("Method8") // Method6 and hence 7 not called

      const matches = expectations.match(callHistory)

      expect(matches[0].actualCount).to.equal(1)
      expect(matches[1].actualCount).to.equal(2)
      expect(matches[2].actualCount).to.equal(0)
      expect(matches[3].actualCount).to.equal(2)
      expect(matches[4].actualCount).to.equal(1)                  
      expect(matches[5].actualCount).to.equal(0)   
      expect(matches[6].actualCount).to.equal(0)   
      expect(matches[7].actualCount).to.equal(1)               
    }) 

    it('should return even if there are no matches', function () {

      const expectations = createExpectations(true) 

      callHistory.clear()
      callHistory.call("MethodX")
      callHistory.call("MethodY")
      callHistory.call("MethodZ")

      const matches = expectations.match(callHistory)           
      expect(matches[0].actualCount).to.equal(0)
    }) 

    it('should return even if there are no calls', function () {

      const expectations = createExpectations(true) 

      callHistory.clear()

      const matches = expectations.match(callHistory)    
      expect(matches[0].actualCount).to.equal(0)
    }) 

    it('should record parameters', function () {
      
      const expectations = createExpectations() 
      
      callHistory.clear()
      callHistory.call("Method1")
      callHistory.call("Method2").call("Method2").call("Method2")
      callHistory.call("Method3", "x")
      callHistory.call("Method4", 5).call("Method4", "y") // 5 is wrong
      callHistory.call("Method1").call("Method1")
      callHistory.call("Method5", {"key": 1, "value": [0, 1]})      

      const matches = expectations.match(callHistory)

      expect(matches[0].actualCount).to.equal(matches[0].expectedCount)
      expect(matches[1].actualCount).to.equal(matches[1].expectedCount)
      expect(matches[2].actualCount).to.equal(matches[2].expectedCount)
      expect(matches[4].actualCount).to.equal(matches[4].expectedCount)      
      expect(matches[5].actualCount).to.equal(matches[5].expectedCount)  

      expect(matches[2].actualParameters[0]).to.equal(matches[2].expectedParameters[0])

      expect(matches[3].actualParameters[0]).to.not.equal(matches[3].expectedParameters[0])
    })     
  })

})