'use strict'

exports: Class

function Class(constructor) {
	defProps(constructor, {
		create: function (props) {
			if (props != null)
				return Object.create(this.prototype, getPDs(props))
			else
				return Object.create(this.prototype)
		},
		Extends: function (superClass) {
			this.prototype = Object.create(superClass.prototype)
			return this
		},
		Public: function public_methods(methods) {
			defProps(this.prototype, methods)
			return this
		}
	})
	return constructor
}

function defProps(o, props) {
	Object.defineProperties(o, getPDs(props))
}

function getPDs(o) {
	var pds = {}
	Object.getOwnPropertyNames(o).forEach(function(name){
		pds[name] = Object.getOwnPropertyDescriptor(o, name)
	})
	return pds
}

//exports.Class = Class
Object.augment = defProps
