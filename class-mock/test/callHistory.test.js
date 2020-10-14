var expect = require('chai').expect
var callHistory = new (require('../callHistory'))()

describe('History', function () {
  
  describe('call', function () {
    it('should record calls', function () {
      callHistory.call("testName1")
      expect(callHistory.callHistory.length).to.equal(1)
      expect(callHistory.callHistory[0]["name"]).to.equal("testName1")
      expect(callHistory.callHistory[0]["parameters"]).to.equal(undefined)      
    })
    it('and parameters', function () {
      callHistory.call("testName2", 44)
      expect(callHistory.callHistory.length).to.equal(2)
      expect(callHistory.callHistory[0]["name"]).to.equal("testName1")
      expect(callHistory.callHistory[0]["parameters"]).to.equal(undefined)      
      expect(callHistory.callHistory[1]["name"]).to.equal("testName2")
      expect(callHistory.callHistory[1]["parameters"]).to.equal(44)                  
    })     
  })

  describe('next', function() {
    it('should return method calls', function () {
      const match = callHistory.next("testName2")
      expect(match.name).to.equal("testName2")
      expect(match.parameters).to.equal(44)
    })   

    it('should remove matched calls', function() {
      expect(callHistory.callHistory.length).to.equal(1)
      expect(callHistory.callHistory[0]["name"]).to.equal("testName1")
      expect(callHistory.callHistory[0]["parameters"]).to.equal(undefined)         
    })
  })

  describe('clear', function() {
    it('should clear calls', function () {
      callHistory.call("justToBeSafe")
      callHistory.clear()
      expect(callHistory.callHistory.length).to.equal(0)
    })   
  })
})
