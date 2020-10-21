class FastFood {

	constructor() {
		this.reset()
	}

	reset() {
		this.foodItem = null
		this.drinkItem = null
		this.foodSize = "Medium"
		this.drinkSize = "Medium"
		this.condiment = null
		this.context = ""
	}

	food(foodItem) {
		this.foodItem = foodItem
		this.context = "Food"
		return this
	}
	
	drink(drinkItem) {
		this.drinkItem = drinkItem
		this.context = "Drink"		
		return this		
	}

	get burger() {
		this.foodItem = "Burger"
		this.context = "Food"
		return this
	}

	get hotdog() {
		this.foodItem = "Hot Dog"
		this.context = "Food"
		return this
	}
	
	with(condiment) {
		if (this.context != "Food" || this.foodItem != "Hot Dog") {
			throw new Error("Can only have condiments for hot dog")
		}
		this.condiment = condiment
		return this
	}

	get coke() {
		this.drinkItem = "Coke"
		this.context = "Drink"
		return this
	}

	get sprite() {
		this.foodItem = "Sprite"
		this.context = "Drink"
		return this
	}	

	get small() {
		if (this.context == "Food") {
			this.foodSize = "Small"
		}
		if (this.context == "Drink") {
			this.drinkSize = "Small"
		}
		return this		
	}

	get medium() {
		if (this.context == "Food") {
			this.foodSize = "Medium"
		}
		if (this.context == "Drink") {
			this.drinkSize = "Medium"
		}
		return this		
	}

	get large() {
		if (this.context == "Food") {
			this.foodSize = "Large"
		}
		if (this.context == "Drink") {
			this.drinkSize = "Large"
		}
		return this		
	}

	order() {
		let foodOrder = ""
		let drinkOrder = ""		
		if (this.foodItem != null) {
			foodOrder = this.foodSize + " " + this.foodItem
			if (this.condiment != null) {
				foodOrder += " (" + this.condiment + ")"
			}
		}
		if (this.drinkItem != null) {
			drinkOrder = this.drinkSize + " " + this.drinkItem
		}		
		this.reset()
		return "Ordered: " + foodOrder + " " + drinkOrder
	}
}

const f = new FastFood()
console.log(f.burger.order())
console.log(f.burger.large.order())
console.log(f.hotdog.order())
console.log(f.hotdog.with("Ketchup").order())
console.log(f.burger.small.coke.large.order())