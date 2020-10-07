// Generated automatically by nearley, version 2.19.7
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main", "symbols": ["_", "Expression", "_"]},
    {"name": "Main", "symbols": ["_", "OneOrMore", "_"], "postprocess": function(d) {return {type:'Main', d:d, v:d[1].v}}},
    {"name": "P", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}], "postprocess": function(d) {return {type:'P', d:d, v:d[2].v}}},
    {"name": "P", "symbols": ["UnsignedInteger"], "postprocess": id},
    {"name": "Expression", "symbols": ["Expression", "_", "And", "_", "P"], "postprocess": function(d) {return {type:'And', d:d}}},
    {"name": "Expression", "symbols": ["Expression", "_", "And", "_", "Comparator", "_", "P"], "postprocess": function(d) {return {type:'And', d:d}}},
    {"name": "Expression", "symbols": ["Expression", "_", "Or", "_", "P"], "postprocess": function(d) {return {type:'Or', d:d}}},
    {"name": "Expression", "symbols": ["Expression", "_", "Or", "_", "Comparator", "_", "P"], "postprocess": function(d) {return {type:'Or', d:d}}},
    {"name": "Expression", "symbols": ["Not", "_", "P"], "postprocess": function(d) {return {type:'Not', d:d, v:d}}},
    {"name": "Expression", "symbols": ["Comparator", "_", "P"]},
    {"name": "Expression", "symbols": ["P"], "postprocess": id},
    {"name": "ComparisonExpression", "symbols": ["Comparator"]},
    {"name": "Comparator", "symbols": ["LessThan"]},
    {"name": "Comparator", "symbols": ["LessThanOrEqual"]},
    {"name": "Comparator", "symbols": ["Equal"]},
    {"name": "Comparator", "symbols": ["GreaterThanOrEqual"]},
    {"name": "Comparator", "symbols": ["GreaterThan"]},
    {"name": "LessThan", "symbols": [{"literal":"<"}], "postprocess": function(d) {return {type:'LessThan', d:d, v:d}}},
    {"name": "LessThanOrEqual$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LessThanOrEqual", "symbols": ["LessThanOrEqual$string$1"], "postprocess": function(d) {return {type:'LessThanOrEqual', d:d, v:d}}},
    {"name": "Equal", "symbols": [{"literal":"="}], "postprocess": function(d) {return {type:'Equal', d:d, v:d}}},
    {"name": "GreaterThanOrEqual$string$1", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "GreaterThanOrEqual", "symbols": ["GreaterThanOrEqual$string$1"], "postprocess": function(d) {return {type:'GreaterThanOrEqual', d:d, v:d}}},
    {"name": "GreaterThan", "symbols": [{"literal":">"}], "postprocess": function(d) {return {type:'GreaterThan', d:d, v:d}}},
    {"name": "OneOrMore", "symbols": [{"literal":"+"}], "postprocess": function(d) {return {type:'OneOrMore', d:d, v:d}}},
    {"name": "And$string$1", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "And", "symbols": ["And$string$1"]},
    {"name": "And$string$2", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "And", "symbols": ["And$string$2"]},
    {"name": "And$string$3", "symbols": [{"literal":"A"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "And", "symbols": ["And$string$3"]},
    {"name": "And$string$4", "symbols": [{"literal":"A"}, {"literal":"N"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "And", "symbols": ["And$string$4"]},
    {"name": "Or$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Or", "symbols": ["Or$string$1"]},
    {"name": "Or$string$2", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Or", "symbols": ["Or$string$2"]},
    {"name": "Or$string$3", "symbols": [{"literal":"O"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Or", "symbols": ["Or$string$3"]},
    {"name": "Or$string$4", "symbols": [{"literal":"O"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Or", "symbols": ["Or$string$4"]},
    {"name": "Not", "symbols": [{"literal":"!"}]},
    {"name": "Not$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Not", "symbols": ["Not$string$1"]},
    {"name": "Not$string$2", "symbols": [{"literal":"N"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Not", "symbols": ["Not$string$2"]},
    {"name": "Not$string$3", "symbols": [{"literal":"N"}, {"literal":"O"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Not", "symbols": ["Not$string$3"]},
    {"name": "UnsignedInteger$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "UnsignedInteger$ebnf$1", "symbols": ["UnsignedInteger$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "UnsignedInteger", "symbols": ["UnsignedInteger$ebnf$1"], "postprocess": function(d) {return {type: 'Integer', v:d[0].join("")}}},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
