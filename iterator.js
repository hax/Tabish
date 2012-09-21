'use strict'

imports: {Class} from: 'type'

var global = new Function('return this')()

exports: var StopIteration
exports: var Iterator

if (global.StopIteration) {
	StopIteration = global.StopIteration
	Iterator = global.Iterator
} else {
	StopIteration = function StopIteration() { return StopIteration }
	Object.defineProperties(StopIteration, {
		prototype: {value: Object.getPrototypeOf(StopIteration)},
		toString: {value: function () { return 'StopIteration' }}
	})

	Iterator = function Iterator(collection, keyOnly) {
		if (collection instanceof Iterator) {
			return collection
		} else if (typeof collection.__iterator__ == 'function') {
			var it = collection.__iterator__()
			return it instanceof Iterator ? it : Iterator.create(it)
		} else {
			return Iterator.create({
				collection: collection,
				keys: Object.keys(collection),
				index: 0
			})
		}
	}
	Object.defineProperty(Iterator.prototype, 'next', {
		value: function () {
			if (this.index < this.keys.length) {
				var key = this.keys[this.index++]
				return this.keyOnly ? key : [key, this.collection[key]]
			} else {
				throw StopIteration
			}
		}
	})
}

Class(Iterator).
	Public({
		traceable: function (size) {
			return TraceableIterator(this, size)
		},
		forEach: function (callbackfn, thisArg) {
			var it = mapping(this, callbackfn, thisArg)
			return Iterator.create({
				next: function() { void it.next() }
			})
		},
		map: function (callbackfn, thisArg) {
			var it = mapping(this, callbackfn, thisArg)
			return Iterator.create({
				next: function() { return it.next()[1] }
			})
		},
		filter: function (callbackfn, thisArg) {
			var it = mapping(this, callbackfn, thisArg)
			return Iterator.create({
				next: function() {
					var v = it.next()
					return v[1] ? v[0] : this.next()
				}
			})
		},
		every: function (callbackfn, thisArg) {
			var it = mapping(this, callbackfn, thisArg)
			try {
				while (true) {
					if (!it.next()[1]) return false
				}
			} catch(e) {
				if (e === StopIteration) return true
				else throw e
			}
		},
		some: function (callbackfn, thisArg) {
			var it = mapping(this, callbackfn, thisArg)
			try {
				while (true) {
					if (it.next()[1]) return true
				}
			} catch(e) {
				if (e === StopIteration) return false
				else throw e
			}
		}
	}).
EndClass

function mapping(iterator, fn, thisArg) {
	var index = 0
	return {
		next: function () {
			var val = iterator.next()
			var mappedVal = fn.call(thisArg, val, index++, iterator)
			return [val, mappedVal]
		}
	}
}

function TraceableIterator(iterator, size) {
	if (!(size >= 1)) size = 1
	var index = 0
	var items = new Array(size + 1)
	return Iterator.create({
		next: function() {
			if (index === 0) {
				items.unshift(iterator.next())
				if (items.length > size) items.pop()
				return items[0]
			} else {
				return items[--index]
			}
		},
		previous: function() {
			if (index < size) return items[index++]
			else throw StopIteration
		}
	})
}

//exports.StopIteration = StopIteration
//exports.Iterator = Iterator

