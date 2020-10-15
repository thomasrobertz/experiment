var expect = require('chai').expect
var comparison = require('../comparison')()

describe('Comparison', function () {
  
	describe('comparisons', function () {
	  it('should evaluate equality', function () {		  
		expect(times(8).evaluate(8)).to.be.true
		expect(times(8).evaluate(9)).to.be.false		
		expect(once().evaluate(1)).to.be.true
		expect(once().evaluate(3)).to.be.false		
	  })

	  it('should evaluate inequality', function () {		  
		expect(less(8).evaluate(9)).to.be.false
		expect(less(8).evaluate(8)).to.be.false		
		expect(less(8).evaluate(1)).to.be.true
		expect(greater(8).evaluate(9)).to.be.true
		expect(greater(8).evaluate(8)).to.be.false		
		expect(greater(8).evaluate(1)).to.be.false

		// At least once
		expect(greater(0).evaluate(0)).to.be.false
		expect(greater(0).evaluate(1)).to.be.true
		expect(greater(0).evaluate(30)).to.be.true				
	  })   	  
	})

	describe('logic', function () {	
		it('should evaluate logic', function () {		  
			// Between
			expect(greater(8).and(less(11)).evaluate(4)).to.be.false
			expect(greater(8).and(less(11)).evaluate(10)).to.be.true
			expect(greater(8).and(less(11)).evaluate(15)).to.be.false

			// Outside of
			expect(less(8).or(greater(11)).evaluate(4)).to.be.true	
			expect(less(8).or(greater(11)).evaluate(10)).to.be.false	
			expect(less(8).or(greater(11)).evaluate(15)).to.be.true					
		})   	  
	})

	describe('parse', function () {	
		it('should parse simple strings', function () {		  

			let comparison

			// Exactly
			comparison = parse("=17")
			expect(comparison.evaluate(4)).to.be.false
			expect(comparison.evaluate(17)).to.be.true
			expect(comparison.evaluate(18)).to.be.false

			// Just an integer, same as "="
			comparison = parse("17")
			expect(comparison.evaluate(4)).to.be.false
			expect(comparison.evaluate(17)).to.be.true
			expect(comparison.evaluate(18)).to.be.false

			// At least once
			comparison = parse("+")
			expect(comparison.evaluate(0)).to.be.false
			expect(comparison.evaluate(1)).to.be.true
			expect(comparison.evaluate(8)).to.be.true

			// Less than 
			comparison = parse("<5")
			expect(comparison.evaluate(0)).to.be.true
			expect(comparison.evaluate(3)).to.be.true
			expect(comparison.evaluate(5)).to.be.false			
			expect(comparison.evaluate(8)).to.be.false

			// Greater than
			comparison = parse(">5")
			expect(comparison.evaluate(0)).to.be.false
			expect(comparison.evaluate(3)).to.be.false
			expect(comparison.evaluate(5)).to.be.false			
			expect(comparison.evaluate(8)).to.be.true

			// Between
			comparison = parse(">6 <12")
			expect(comparison.evaluate(4)).to.be.false
			expect(comparison.evaluate(6)).to.be.false
			expect(comparison.evaluate(8)).to.be.true
			expect(comparison.evaluate(9)).to.be.true			
			expect(comparison.evaluate(12)).to.be.false
			expect(comparison.evaluate(16)).to.be.false

			// Outside of
			comparison = parse("< 6 > 12")
			expect(comparison.evaluate(4)).to.be.true
			expect(comparison.evaluate(6)).to.be.false
			expect(comparison.evaluate(8)).to.be.false
			expect(comparison.evaluate(9)).to.be.false			
			expect(comparison.evaluate(12)).to.be.false
			expect(comparison.evaluate(16)).to.be.true			
		})   	  			
	})

  })