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

describe('Mock', function () {
  
  describe('Proxy', function () {
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

})