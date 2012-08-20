如何设计混合式语言，即允许一种语言里内嵌其他的语言，并保持可读性。

例子：HTML/CSS/JavaScript
反例：PHP/JSP => 可读性差，not well-formed！甚至token被拆了！



# Tabish #

### Usage ###

### API ###

Tabish(dsl)

dsl: {
	description : RuleSet | URI
	instructionSet : Object
}


Tabish.Parser(ruleSet)

return a parser as rule set


Tabish.Processor(processors, context)


option
	tab: / /
	emptyLine: /\s*/

seqitem: '- ', scalar 


