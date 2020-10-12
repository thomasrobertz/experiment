var expect = require('chai').expect
var Parameters = require('../parameters')
var parameters = new Parameters()

describe('Parameters', function () {
  
  describe('diff', function () {
    it('should diff primitives', function () {
      let result = Parameters.diff(5, 5)
      expect(result.length).to.equal(0)
      
      result = Parameters.diff(5, 6)
      expect(result.length).to.equal(1)
      result = result[0]
      expect(result.reason).to.equal("PRIMITIVE_NOT_EQUAL")      
      expect(result.expected).to.equal(5)  
      expect(result.actual).to.equal(6)   
   
      expect(Parameters.diff(1.1, 1.1).length).to.equal(0)
      expect(Parameters.diff(1.1, 1.2).length).to.equal(1)      
         
      expect(Parameters.diff(true, true).length).to.equal(0)
      expect(Parameters.diff(true, false).length).to.equal(1)            

      expect(Parameters.diff("x-test", "x-test").length).to.equal(0)
      expect(Parameters.diff("x-test", "y-test").length).to.equal(1)          

      expect(Parameters.diff(null, null).length).to.equal(0)
      expect(Parameters.diff(undefined, undefined).length).to.equal(0)      
      expect(Parameters.diff(null, undefined).length).to.equal(1)         
      expect(Parameters.diff(null, 5).length).to.equal(1)   
    }),
    
    it('should diff arrays', function() {
      let result = Parameters.diff([5], [5])
      expect(result.length).to.equal(0)

      result = Parameters.diff([5], [6])[0]
      expect(result.reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL")
      expect(result.detailExpected).to.equal(5) // deep equal! (Object / Array members)
      expect(result.detailActual).to.equal(6)
      
      result = Parameters.diff([5, 6], [6])[0]
      expect(result.reason).to.equal("ARRAY_NOT_SAME_LENGTH")

      result = Parameters.diff([5], ["x"])[0]
      expect(result.reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL")
      expect(result.detailExpected).to.equal(5)
      expect(result.detailActual).to.equal("x")

      result = Parameters.diff([5, 6, "x"], [5, 6, "x"])
      expect(result.length).to.equal(0)

      result = Parameters.diff([5, 6, "x"], [5, 6, "y"])
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL")      
      expect(result[0].expected).to.eql([5, 6, "x"])
      expect(result[0].actual).to.eql([5, 6, "y"])       
      expect(result[0].detailExpected).to.equal("x")
      expect(result[0].detailActual).to.equal("y")      

      result = Parameters.diff([5, 6], [5, 6, "x"])
      expect(result.length).to.equal(1)

      // Truthy and more
      expect(Parameters.diff([], []).length).to.equal(0)
      expect(Parameters.diff([], [null]).length).to.equal(1)      
      expect(Parameters.diff([], [NaN]).length).to.equal(1)        
      expect(Parameters.diff([], [0]).length).to.equal(1)         
      expect(Parameters.diff([], [false]).length).to.equal(1)               
      expect(Parameters.diff([], [""]).length).to.equal(1)               
      expect(Parameters.diff([], [undefined]).length).to.equal(1)  
      expect(Parameters.diff([], [5]).length).to.equal(1)                        
      expect(Parameters.diff([null], [null]).length).to.equal(0)
      expect(Parameters.diff([null], [undefined]).length).to.equal(1)      
      expect(Parameters.diff([null], [5]).length).to.equal(1)      
    }),

    it('should diff objects', function() {
      let result = Parameters.diff([5], [5])
      expect(result.length).to.equal(0)
    }),

    it('should reject different types', function () {
      let result = Parameters.diff([5], {"x": 5})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("PRIMITIVE_DIFFERENT_TYPES")

      result = Parameters.diff([5], "x")
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("PRIMITIVE_DIFFERENT_TYPES")
    })
  })

})
