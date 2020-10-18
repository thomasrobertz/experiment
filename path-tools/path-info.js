const path = require('path')
const os = require('os')

class PathInfo {
	constructor(path) {
		this.path = path
		this.windows = os.type().indexOf('Windows') >= 0
	}
}