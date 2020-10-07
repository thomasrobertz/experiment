Main -> _ Expression _ | _ OneOrMore _ 
		{% function(d) {return {type:'Main', d:d, v:d[1].v}} %}

P -> "(" _ Expression _ ")" 
		{% function(d) {return {type:'P', d:d, v:d[2].v}} %}
     | UnsignedInteger             
	 	{% id %}

Expression ->
	Expression _ And _ P 
		{% function(d) {return {type:'And', d:d}} %}
	| Expression _ And _ Comparator _ P 
		{% function(d) {return {type:'And', d:d}} %}
    | Expression _ Or _ P
		{% function(d) {return {type:'Or', d:d}} %}
    | Expression _ Or _ Comparator _ P
		{% function(d) {return {type:'Or', d:d}} %}
    | Not _ P 
		{% function(d) {return {type:'Not', d:d, v:d}} %}	
	| Comparator _ P	
	| P 
		{% id %}

ComparisonExpression -> Comparator 
Comparator -> LessThan | LessThanOrEqual | Equal | GreaterThanOrEqual | GreaterThan
LessThan -> "<"	
		{% function(d) {return {type:'LessThan', d:d, v:d}} %}	
LessThanOrEqual -> "<="	
		{% function(d) {return {type:'LessThanOrEqual', d:d, v:d}} %}	
Equal -> "=" 
		{% function(d) {return {type:'Equal', d:d, v:d}} %}	
GreaterThanOrEqual -> ">=" 
		{% function(d) {return {type:'GreaterThanOrEqual', d:d, v:d}} %}	
GreaterThan -> ">" 
		{% function(d) {return {type:'GreaterThan', d:d, v:d}} %}	
OneOrMore -> "+"
		{% function(d) {return {type:'OneOrMore', d:d, v:d}} %}	

And -> "&&" | "and" | "And" | "AND"	
Or -> "||" | "or" | "Or" | "OR"
Not -> "!" | "not" | "Not" | "NOT"	

UnsignedInteger-> [0-9]:+        
		{% function(d) {return {type: 'Integer', v:d[0].join("")}} %}
_ -> [\s]:*     
		{% function(d) {return null } %}