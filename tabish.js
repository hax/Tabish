void function(exports){

	'use strict'
	'import RegExpMatcherIterator'
	'export Tabish'

	
	function parse(source, processor, option) {
		if (source == null) return null
		if (option == null) option = Object.create(defaultOption)
		if (processor == null) processor = defaultProcessor
		
		var result = []
		var it = BlocksIterator(source, option)
		while (true) {
			try {
				var block = it.next()
				result.push(
					processor(block, {tabishOption: option})
				)
			} catch(e) {
				if (e === StopIteration) break
				if (option.maxErrors > 0) {
					option.maxErrors--
					if (e instanceof ParserError) {
						result.push(e)
					} else {
						result.push(ProcessorError(e, block))
					}
				} else {
					//console.error(e.toString())
					throw e
				}
			}
		}
		return result
	}
	
	function defaultProcessor(block, context) {
		return {
			value: block.headerLine,
			children: parse(block.bodyLines, defaultProcessor, context.tabishOption)
		}
	}
	
	function BlocksIterator(source, option) {
		
		option = override(option, defaultOption)
		var indent, nextHeader
		//var line, lineIndent
		
		var lines = LinesIterator(source)
		
		function trimTabs(line, max) {
			if (max == null) max = Infinity
			var tab = option.tab instanceof RegExp ?
				option.tab.source : option.tab
			var re = new RegExp('^(' + tab + ')(.*)')
			var n = 0, s = line.content
			while (n < max) {
				var m = re.exec(s)
				if (m == null) break
				n++
				s = m[2]
			}
			line.indent = n
			line.content = s
			return n
		}
		
		return Iterator.create({
			next: function() {
				var header
				if (indent == null) {
					while (isEmpty(header = lines.next())) {
						if (option.yieldEmptyLineBlock)
							return {headerLine: null, bodyLines: null}
					}
					//console.log('new line:', header.content)
					indent = trimTabs(header)
					//console.log('new header:', header.content, indent)
				} else {
					//console.log('then', headerLine.content, lineIndent, indent)
					/*if (bodyLines != null) {
						try {
							while (true) bodyLines.next()
						} catch(e) {
							if (e !== StopIteration) throw e
						}
					}*/
					if (nextHeader) {
						header = nextHeader
						nextHeader = null
						//console.log('next header:', header.content, indent)
					} else {
						//console.log('end ^')
						//lines.previous()
						throw StopIteration
					}
				}
				var block = {
					headerLine: header,
					bodyLines: Iterator.create({
						next: function() {
							var line = lines.next()
							if (isEmpty(line)) return line
							//console.log('block', header.content, 'process:', line.content, indent)
							var lineIndent = trimTabs(line, indent + 1)
							//console.log('block', header.content, 'processed:', line.content, lineIndent, indent)
							if (lineIndent > indent) {
								line.block = block
								return line
							} else if (lineIndent === indent) {
								//console.log('end', header.content)
								nextHeader = line
								throw StopIteration
							} else {
								//console.log('offside', header.content)
								throw OffsideError(line)
							}
						},
						previous: function() {
							lines.previous()
						},
					})
				}
				return block
			}
		})
	}

	var defaultOption = {
		tab: /\t/
	}

	function LinesIterator(source) {
		if (source instanceof Iterator/*.of(Line)*/) {
			return source
		}
		var lines = source.lines || source
		var context = source.context || {start:1}
		
		function Line(content, index) {
			//console.log('new line', index, ':', content)
			return Line.create({
				content: content,
				index: index
			})
		}
		Class(Line).Public(context).Public({
			toString: function() {
				return (this.fileName ? this.fileName + ':' : 'line ') + 
					(this.start + this.index) +
					': "' + this.content + '"'
			}
		})
		
		if (typeof lines === 'string') {
			return RegExpMatcherIterator(/(.*)(\r\n|\n|\r|$)/g, lines).map(function(m, i){
				return new Line(m[1], i)
			}).traceable()
		} else if (lines instanceof Array/*.of(String)*/) {
			return Iterator(lines).map(function(e){
				return new Line(e[1], e[0])
			}).traceable()
		} else {
			throw Error('Invalid argument:', source)
		}
		
	}
	
	function isEmpty(line) {
		return /^\s*$/.test(line.content)
	}
		
	function override(obj, base) {
		var o = Object.create(base)
		if (obj != null) {
			Object.keys(obj).forEach(function(key){
				o[key] = obj[key]
			})
		}
		return o
	}
	

	function ParserError(message, context) {
		var e = ParserError.create({
			context: context,
			message: message || 'ParserError'
		})
		return e
	}
	Class(ParserError).Extends(Error).Public({
		context: null,
		toString: function() {
			var s = this.message
			if (this.context) s += ' @ ' + this.context
			return s
		}
	})
	
	function OffsideError(context) {
		var e = OffsideError.create({
			context: context,
			message: 'OffsideError'
		})
		return e
	}
	Class(OffsideError).Extends(ParserError)

	function ProcessorError(cause, context) {
		var e = ProcessorError.create({
			message: 'ProcessorError',
			cause: cause,
			context: context
		})
		return e
	}
	Class(ProcessorError).Extends(Error).Public({
		cause: null,
		context: null,
		toString: function() {
			var s = this.message
			if (this.context) s += ' @ ' + this.context
			if (this.cause) s += ' (' + this.cause + ')'
			return s
		}
	})
	
	function Tabish() {
	}
	
	function Parser(ruleSet) {
	}
	
	function RuleSet(rules) {
	}
	
	function RulesetProcessor(ruleset, processor) {
	}
	
	Object.defineProperties(Tabish, {
		Parser: {value: Parser},
		RuleSet: {value: RuleSet},
		ParserError: {value: ParserError},
		OffsideError: {value: OffsideError},
		ProcessorError: {value: ProcessorError},
		parse: {value: parse}
	})

	exports.Tabish = Tabish
	
}(this)