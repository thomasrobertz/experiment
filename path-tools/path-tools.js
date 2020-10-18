const fse = require('fs-extra') 
const Strategy = require('./strategy-js')
const Validation = require('./validation')

class PathTools {

	static Directory = "directory"
	static File = "file"
	static Both = "both"

	constructor(path = "") {
		
		if (path === "") {
			path = "./"
		}

		this.validation = new Validation(path)
		this.path = this.validation.path

		this.fileTypes = PathTools.File	
		this.isRecursive = false

		// Results
		this.listResult = []
	}

	types(fileTypes) {
		this.fileTypes = fileTypes		
		return this
	}

	recursive(recursive = true) {
		this.isRecursive = recursive
		return this
	}

	isFile(path = "") {
		try {
			return fse.lstatSync(path).isFile()
		} catch (e) {
			return false
		}		
	}

	isDirectory(path = "") {
		try {
			return fse.lstatSync(path).isDirectory()
		} catch (e) {
			return false
		}		
	}
	
	pushToResult(target, itemType, current, depth) {
		target.push(
			{ 
				"type": itemType,
				"name": current,
				"depth": depth					
			}
		)
	}

	list(path = "", fileTypesToScan = this.fileTypes, result = {}, depth = 0) {

		if (path === "") {
			path = this.path
		}

		if(fileTypesToScan === undefined) {
			fileTypesToScan = this.fileTypes			
		}

		let currentResult

		switch(fileTypesToScan) {
			case PathTools.File:
				currentResult = fse.readdirSync(path, { withFileTypes: true })
					.filter(i => i.isFile())		
					.map(item => item.name)	
				break;
			case PathTools.Directory:
				currentResult = fse.readdirSync(path, { withFileTypes: true })
					.filter(i => i.isDirectory())		
					.map(item => item.name)	
				break;
			case PathTools.Both:
				currentResult = fse.readdirSync(path, { withFileTypes: true })
					.map(item => item.name)	
				break;
		}
				
		if((this.fileTypes === fileTypesToScan) || (this.fileTypes === PathTools.Both)) {
			result[path] = []
			currentResult.forEach(current => {
				let itemType = this.fileTypes
				if(this.fileTypes === PathTools.Both) {
					itemType = PathTools.File
					if (this.isDirectory(path + "/" + current)) {
						itemType = PathTools.Directory
					}
				}
				this.pushToResult(result[path], itemType, current, depth)
				/*
				result[path].push(
					{ 
						"type": itemType,
						"name": current,
						"depth": depth					
					}
				)
				*/
			}) 
		}
						
		if (this.isRecursive && (currentResult.length > 0)) {
		
			// Get subdirectories, but not recursively from list()!
			let subdirectories = fse.readdirSync(path,  { withFileTypes: true })
				.filter(i => i.isDirectory())			
				.map(item => item.name)	

			depth++

			// Recurse over each subdirectory.
			subdirectories.forEach(s => {

				// Rebuild the path that points to the current path.
				const subdirectory = path + "/" + s

				// Recurse over the subdirectories in the current subdirectory.
				this.list(subdirectory, PathTools.Directory, result, depth)

				if ((this.fileTypes === PathTools.File) || (this.fileTypes === PathTools.Both)) {

					// List all files in the current directory.
					let subdirectoryFiles = fse.readdirSync(subdirectory,  { withFileTypes: true })
						.filter(i => i.isFile())			
						.map(item => item.name)

					if (subdirectoryFiles.length > 0) {
						result[subdirectory] = []

						// Recurse over the files in the current directory.
						subdirectoryFiles.forEach(f => {
							let itemType = this.fileTypes
							if(this.fileTypes === PathTools.Both) {
								itemType = PathTools.File
								if (this.isDirectory(path + "/" + f)) {
									itemType = PathTools.Directory
								}
							}
							this.pushToResult(result[subdirectory], itemType, f, depth)
						}) 
					}
				}
			})			
		} 		
		return result					
	}

	read(encoding = "utf-8") {
		if(!this.isFile(this.path)) {
			this.isNotFileStrategy()
		}
		return fse.readFileSync(this.path, encoding)		
	}
}

var p = new PathTools("test")

console.log(p.types(PathTools.Both).recursive().list())			// another, moved, test1-3

//console.log(__dirname)