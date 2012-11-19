'use strict'
imports: {Parser} from: './parser.js'
imports: {XRegExp} from: 'npm:xregexp'

/*XRegExp.repeat = function(re, min, max) {
	var src = '(?:' + (XRegExp.isRegExp(re) ? re.source : XRegExp.escape(re)) + ')'
	if (min === undefined || min === Infinity) src += '*'
	else if (min === 0 && max === 1) src += '?'
	else if (min === 1 && max === Infinity) src += '+'
	else if (min === max || max === undefined) src += '{' + min + '}'
	else if (max === Infinity) src += '{' + min + ',}'
	else src += '{' + min + ',' + max + '}'
	return XRegExp(src)
}*/

var tabish = new Parser({
	source: function() {

	},
	TAB: /\t/,
	EOL: /\r\n|\n\r|[\n\r\u2028\u2029]/,
	WHITESPACE: /[\t\v\f\u0020\u0085\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\uFDD0-\uFDEF\uFEFF\uFFFE\uFFFF]/,
	COMMENT_START: /\/\//,
	commentLine: function() {
		return XRegExp.build(
			'{{WHITESPACE}}*{{COMMENT_START}}.*?{{EOL}}', this)
	},
	emptyLine: function() {
		return
	}
})


/*
var Parser = Class({
	constructor: function(rules) {
		this.rules = rules
	},
	parse: function(source) {
		return source
		if (!this.rules.Source.exec(source)) throw new ParserError('invalid source')
	}
})*/
/*var parser = new Parser(jedi.rules)
parser.parse(source)


var defaultRules = {
	EOL: /\r\n|\n\r|[\n\r\u2028\u2029]/,
	WhiteSpace: /[\t\v\f\u0020\u0085\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\uFDD0-\uFDEF\uFEFF\uFFFE\uFFFF]/,
}*/

/*
function Rule() {
}
util.prototypeFor(Rule.prototype, {
})
Class(Combinator).Public({
	exec: function(src) {

	},
	or: function(prod) {
	},
	concat: function(prod) {

	},
	repeat: function(min, max) {
	},
})

var Pattern = {
	union: function() {
	},
	concat: function() {
	},
	repeat: function() {
	},
	optional: function() {
	},
	any:
	many: function() {
	},
	any
	literal: function() {
	},
}

var defaultRules = {
	Source: Or()
	EOL: /\r\n|\n\r|[\n\r\u2028\u2029]/,
	WhiteSpace: /[\t\v\f\u0020\u0085\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\uFDD0-\uFDEF\uFEFF\uFFFE\uFFFF]/,
}
*/
/*
var TabishRules = {
	Tab: /\t/,
	Line: function() {
		return this.endsWith(this.EOL)
	},
	EmptyLine: function() {
		return this.Line().match(WhiteSpace().times())
	},
	Indent: function() {},
	CommentStart: '//',
	CommentLine: function() {
		return this.Line().startsWith(
			this.WhiteSpace().times(),
			this.CommentStart(),
		)
	},
	HeaderLine: function() {
		return this.Line().startsWith(
			this.Indent(),
			this.not.WhiteSpace()
		)
	},
	BodyLines: function() {
		return this.or(this.EmptyLine(), this.BodyLine(), this.CommentLine()).times()
	},
}*/


