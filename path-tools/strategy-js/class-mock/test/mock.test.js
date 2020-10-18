var expect = require('chai').expect
var Mock = require('../mock')

class Database {
  constructor(dependency) {
    this.dependency = dependency
  }
  execute(sql) {
    this.dependency.execute(sql)
  }
}

function testFunction(args) {
  args
}

describe('Mock', function () {
  
  describe('Proxy a Class', function () {
    it('should mock and record calls', function () {
      
      const mock = new Mock(Database)

      mock.execute("Mocked SQL")
      mock.execute("Delete")

      expect(mock.callHistory.callHistory.length).to.equal(2)
      expect(mock.callHistory.callHistory[0]["name"]).to.equal("execute")
      expect(mock.callHistory.callHistory[1]["name"]).to.equal("execute")      
      expect(mock.callHistory.callHistory[0]["parameters"]).to.eql(["Mocked SQL"])
      expect(mock.callHistory.callHistory[1]["parameters"]).to.eql(["Delete"])      
    })
  
  })

  describe('Proxy a Function', function () {
    it('should mock and record function calls', function () {
      
      const fmock = new Mock(testFunction)

      fmock("aaa")
      const returnedMock = fmock("aab")

      const mock = fmock.mock

      expect(mock.callHistory.callHistory.length).to.equal(2)
      expect(mock.callHistory.callHistory[0]["name"]).to.equal("testFunction")
      expect(mock.callHistory.callHistory[1]["name"]).to.equal("testFunction")     
      expect(returnedMock.getCallHistoryNumber(0)["parameters"]).to.eql(["aaa"])
      expect(returnedMock.getCallHistoryNumber(1)["parameters"]).to.eql(["aab"])      
    })
  
  })  

})