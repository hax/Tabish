'use strict'

imports: {Iterator;StopIteration} from: 'iterator.js'

exports: RegExpMatcherIterator
function RegExpMatcherIterator(pattern, source) {
	if (!(pattern.global || pattern.sticky)) {
		throw Error('Pattern should be global or sticky')
	}
	var lastIndex = pattern.lastIndex
	var stop
	return Iterator.create({
		next: function () {
			if (stop) throw StopIteration
			var m = pattern.exec(source)
			if (m == null) {
				stop = true
				throw StopIteration
			}
			if (pattern.lastIndex === lastIndex) {
				pattern.lastIndex++
				return this.next()
			} else {
				lastIndex = pattern.lastIndex
				return m
			}
		}
	})
}
