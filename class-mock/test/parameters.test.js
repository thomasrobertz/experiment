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

      // Single element
      let result = Parameters.diff([5], [5])
      expect(result.length).to.equal(0)

      result = Parameters.diff([5], [6])[0]
      expect(result.reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL")
      expect(result.expected).to.equal(5)
      expect(result.actual).to.equal(6)
      
      result = Parameters.diff([5], ["x"])[0]
      expect(result.reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL")
      expect(result.expected).to.equal(5)
      expect(result.actual).to.equal("x")

      // Many elements
      result = Parameters.diff([5, 6, "x"], [5, 6, "x"])
      expect(result.length).to.equal(0)

      result = Parameters.diff([5, 6, "x"], [5, 6, "y"])
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL")          
      expect(result[0].expected).to.equal("x")
      expect(result[0].actual).to.equal("y")      

      // Many diffs
      result = Parameters.diff([5, 6, "x"], [7, 6, "y"])
      expect(result.length).to.equal(2)
      expect(result[0].reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL") 
      expect(result[1].reason).to.equal("ARRAY_ELEMENTS_NOT_EQUAL") 
      expect(result[0].expected).to.equal(5)
      expect(result[0].actual).to.equal(7) 
      expect(result[1].expected).to.equal("x")
      expect(result[1].actual).to.equal("y")      

      // Length
      result = Parameters.diff([5, 6], [5, 6, "x"])
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("ARRAY_NOT_SAME_LENGTH")

      result = Parameters.diff([5, 6], [6])[0]
      expect(result.reason).to.equal("ARRAY_NOT_SAME_LENGTH")

      result = Parameters.diff([[]], [[[]]])
      expect(result.length).to.equal(1) 
      expect(result[0].reason).to.equal("ARRAY_NOT_SAME_LENGTH")

      // Nested
      result = Parameters.diff([5, 6, "x", [2, "y"]], [5, 6, "x", [2, "y"]])
      expect(result.length).to.equal(0)

      result = Parameters.diff([5, 6, "x", [2, "z"]], [5, 6, "x", [2, "y"]])
      expect(result.length).to.equal(1)      
      expect(result[0].expected).to.equal("z")
      expect(result[0].actual).to.equal("y")       

      // Nested many diffs
      result = Parameters.diff([5, 8, "x", [2, "z"]], [5, 6, "x", [2, "y"]])
      expect(result.length).to.equal(2)      
      expect(result[0].expected).to.equal(8)
      expect(result[0].actual).to.equal(6)            
      expect(result[1].expected).to.equal("z")
      expect(result[1].actual).to.equal("y")      

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

      // Simple
      let result = Parameters.diff({"x": 5}, {"x": 5})
      expect(result.length).to.equal(0)

      result = Parameters.diff({"x": 5}, {"x": 6})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("OBJECT_PROPERTIES_NOT_EQUAL")      
      expect(result[0].expected).to.equal(5)      
      expect(result[0].actual).to.equal(6)
      expect(result[0].additional).to.equal("x")  

      result = Parameters.diff({"x": 5}, {"y": 5})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("OBJECT_PROPERTY_NOT_EXISTS")      
      expect(result[0].expected).to.equal("x")      
      
      result = Parameters.diff({"x": 5, "w": 8}, {"y": 5})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("OBJECT_PROPERTY_NOT_EXISTS")      
      expect(result[0].expected).to.equal("x")      

      result = Parameters.diff({"x": 5, "w": 8}, {"x": 5})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("OBJECT_PROPERTY_NOT_EXISTS")      
      expect(result[0].expected).to.equal("w")

      // Nested
      result = Parameters.diff({"x": 5, "w": {"z": "7"}}, {"x": 5, "w": {"z": "7"}})
      expect(result.length).to.equal(0)

      result = Parameters.diff({"x": 5, "w": {"z": "u"}}, {"x": 5, "w": {"z": "7"}})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("OBJECT_PROPERTIES_NOT_EQUAL")      
      expect(result[0].expected).to.equal("u")      
      expect(result[0].actual).to.equal("7")
      expect(result[0].additional).to.equal("z")        

      result = Parameters.diff({"x": 5, "w": {"z": "u"}}, {"x": 5, "w": {"b": "7"}})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("OBJECT_PROPERTY_NOT_EXISTS")      
      expect(result[0].expected).to.equal("z")              
    }),

    it('should diff mixed arrays and objects', function() {
      
      let result = Parameters.diff({"x": 5, "y": [{"a": 5}, {"b": [1, 2, 3]}]}, {"x": 5, "y": [{"a": 5}, {"b": [1, 2, 3]}]})
      expect(result.length).to.equal(0)

      result = Parameters.diff({"x": 5, "y": [{"a": 5}, {"b": [1, 2, 3]}]}, {"x": 5, "y": [{"a": 5}, {"b": [1, 5, 3]}]})
      expect(result.length).to.equal(1)

      result = Parameters.diff([5, {"a": "x"}], [5, {"a": "x"}])
      expect(result.length).to.equal(0)      
       
      result = Parameters.diff([5, {"a": "y"}], [5, {"a": "x"}])
      expect(result.length).to.equal(1)        
    }),

    it('should reject different types', function () {
      let result = Parameters.diff([5], {"x": 5})
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("PRIMITIVE_DIFFERENT_TYPES")

      result = Parameters.diff([5], "x")
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("PRIMITIVE_DIFFERENT_TYPES")

      result = Parameters.diff({"x": 5}, 5)
      expect(result.length).to.equal(1)
      expect(result[0].reason).to.equal("PRIMITIVE_DIFFERENT_TYPES")
    })
  })

})
