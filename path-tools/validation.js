const fse = require('fs-extra') 
const isValid = require('is-valid-path')
const sanitize = require("sanitize-filename")
const Strategy = require('./strategy-js')
const strategy = new Strategy()

module.exports = class Validation {

	static PATH_NOT_FOUND = "PATH_NOT_FOUND"
	static PATH_INVALID = "PATH_INVALID"

	constructor(path = "", checkValidity = true, checkExists = true, sanitize = true, strategies = null) {
		if(strategies  === null) {					
			strategies = Strategy.of({
				"PATH_NOT_FOUND": Strategy.error(), 
				"PATH_INVALID": Strategy.error()
			})			
		}	
		this.strategies = strategies
		if (path !== "") {
			this.path = this.safePath(path, checkValidity, checkExists, sanitize)
		}
	}

	isValid(path) {
		return isValid(path)
	}

	sanitizeFilename(fileName) {
		return sanitize(fileName)
	}

	exists(path) {
		try {
			if (fse.existsSync(path)) {
				return true
			}
		} catch(error) {
			return false
		}		
	}	

	safePath(path, checkValidity = true, checkExists = true, sanitize = true) {
		if (checkValidity) {
			if(!this.isValid(path)) {
				return this.strategies.run(Validation.PATH_INVALID, path)
			}
		}
		if (checkExists) {
			if(!this.exists(path)) {
				return this.strategies.run(Validation.PATH_NOT_FOUND, path)
			}
		}
		if (sanitize) {
			//path = this.sanitizeFilename(path)
		}
		/*
		if (filename.indexOf('\0') !== -1) {
			return respond('That was evil.');
		}
		if (!/^[a-z0-9]+$/.test(filename)) {
			return respond('illegal character');
		}	
		*/	

		return path
	}
}