'use strict'
imports: {Class} from: '../mmclass/src/class.js'
exports: {Parser}

var AbstractParser = Class({
	parse: function(source, index) {
	},
	concat: function() {
		[].unshift.call(arguments, this)
		return new Seq(arguments)
	},
	or: function() {
		[].unshift.call(arguments, this)
		return new Union(arguments)
	},
	optional: function() {
		return this.or(Empty)
	}
})

var Parser = Class.extend(AbstractParser)({
	constructor: function(rules) {
		this.rules = rules
	},
	parse: function(source) {
		return this.rules.Source.parse(source)
	}
})


var Succeed = Class.extend(AbstractParser)({
	parse: function(source, index) {
		return {index: 0, length: 0}
	}
})

var Empty = new Succeed()

var Lexeme = Class.extend(AbstractParser)({
	constructor: function(pattern) {
		this.pattern = pattern
	},
	parse: function(source, index) {
		var r = this.pattern.exec(source.slice(index))
		return r ? {index: r.index, length: r[0].length} : null
	}
})

function toParsers(elements) {
	var parsers = []
	for (var i = 0; i < elements.length; i++) {
		var e = elements[i]
		if (e instanceof AbstractParser) parsers.push(e)
		else if (isRegExp(e)) parsers.push(new Lexeme(e))
		else throw TypeError('element should be Parser or RegExp')
	}
	return parsers
}

function isRegExp(obj) {
	return {}.toString.call(obj) === '[object RegExp]'
}

var Union = Class.extend(AbstractParser)({
	constructor: function(elements) {
		this.elements = toParsers(elements)
	},
	parse: function(source, index) {
		for (var i = 0; i < this.elements.length; i++) {
			var r = this.elements[i].parse(source, index)
			if (r) return r
		}
	}
})
var Seq = Class.extend(AbstractParser)({
	constructor: function(elements) {
		this.elements = toParsers(elements)
	},
	parse: function(source, index) {
		var result = [], offset = 0
		for (var i = 0; i < this.elements.length; i++) {
			var r = this.elements[i].parse(source, index + offset)
			if (!r) return null
			result.push(r)
			offset += r.index + r.length
		}
		return {index: 0, length: offset, sequence: result}
	}
})


var ParserError = Class.extend(Error, {name: 'ParserError'})({
	constructor: function(message, context) {
		this.message = message || this.name
		this.context = context
	},
	toString: function($super) {
		var s = $super.toString()
		if (this.context) s += ' @ ' + this.context
		return s
	}
})

var OffsideError = Class.extend(ParserError, {name: 'OffsideError'})({
	constructor: function($super, context) {
		$super(this.name, context)
	}
})

var ProcessorError = Class.extend(Error, {name: 'ProcessorError'})({
	constructor: function(cause, context) {
		this.message = this.name
		this.cause = cause
		this.context = context
	},
	toString: function($super) {
		var s = $super.toString()
		if (this.context) s += ' @ ' + this.context
		if (this.cause) s += ' (' + this.cause + ')'
		return s
	}
})
