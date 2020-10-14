var expect = require('chai').expect

var callHistory = new (require('../callHistory'))()
var Expectations = require('../expectations').Expectations
var Expectation = require('../expectations').Expectation
var Parameters = require('../parameters')
var parameters = new Parameters()
var Evaluate = require('../evaluate')

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

function standardCall(withNext = false) {
  callHistory.clear()  
  callHistory.call("Method1")
  callHistory.call("Method2").call("Method2").call("Method2")
  callHistory.call("Method3", "x")
  callHistory.call("Method4", 4).call("Method4", "y")
  callHistory.call("Method1").call("Method1")
  callHistory.call("Method5", {"key": 1, "value": [0, 1]})

  if (withNext) {
    callHistory.call("Method6")
    callHistory.call("Method7").call("Method7")
    callHistory.call("Method8")
  }
}


describe('Evaluate', function () {
  
  describe('success', function () {
    it('should calculate all correct expectations', function () {
      const expectations = createExpectations() 
      standardCall()

      const evaluate = new Evaluate(expectations)

      const result = evaluate.filter()

      expect(result.length).to.equal(6)
    })   
  })

})