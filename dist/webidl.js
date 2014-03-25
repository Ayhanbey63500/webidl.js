(function(){var e=function(e){var t=[],n={"float":/^-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/,integer:/^-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/,identifier:/^[A-Z_a-z][0-9A-Z_a-z]*/,string:/^"[^"]*"/,whitespace:/^(?:[\t\n\r ]+|[\t\n\r ]*((\/\/.*|\/\*(.|\n|\r)*?\*\/)[\t\n\r ]*))+/,other:/^[^\t\n\r 0-9A-Z_a-z]/},r=[];for(var i in n)r.push(i);while(e.length>0){var s=!1;for(var o=0,u=r.length;o<u;o++){var a=r[o];e=e.replace(n[a],function(e){return t.push({type:a,value:e}),s=!0,""});if(s)break}if(s)continue;throw new Error("Token stream not progressing")}return t},t=function(e){var t=1;e=e.slice();var n="float",r="integer",i="identifier",s="string",o="other",u=function(e,t,n,r){this.message=e,this.line=t,this.input=n,this.tokens=r};u.prototype.toString=function(){return this.message+", line "+this.line+" (tokens: '"+this.input+"')\n"+JSON.stringify(this.tokens,null,4)};var a=function(n){var r="",i=0,s=5;while(i<s&&e.length>i)r+=e[i].value,i++;throw new u(n,t,r,e.slice(0,5))},f=null,l=function(t,n){if(!e.length||e[0].type!==t)return;if(typeof n=="undefined"||e[0].value===n)return f=e.shift(),t===i&&(f.value=f.value.replace(/^_/,"")),f},c=function(){if(!e.length)return;if(e[0].type==="whitespace"){var n=e.shift();return n.value.replace(/\n/g,function(e){return t++,e}),n}},h=function(){var e={type:"whitespace",value:""};for(;;){var t=c();if(!t)break;e.value+=t.value}if(e.value.length>0)return e},p=function(){var e="";h(),l(i,"unsigned")&&(e="unsigned "),h();if(l(i,"short"))return e+"short";if(l(i,"long"))return e+="long",h(),l(i,"long")?e+" long":e;e&&a("Failed to parse integer type")},d=function(){var e="";h(),l(i,"unrestricted")&&(e="unrestricted "),h();if(l(i,"float"))return e+"float";if(l(i,"double"))return e+"double";e&&a("Failed to parse float type")},v=function(){var e=p()||d();if(e)return e;h();if(l(i,"boolean"))return"boolean";if(l(i,"byte"))return"byte";if(l(i,"octet"))return"octet"},m=function(){if(l(i,"true"))return{type:"boolean",value:!0};if(l(i,"false"))return{type:"boolean",value:!1};if(l(i,"null"))return{type:"null"};if(l(i,"Infinity"))return{type:"Infinity",negative:!1};if(l(i,"NaN"))return{type:"NaN"};var t=l(n)||l(r);if(t)return{type:"number",value:1*t.value};var s=l(o,"-");if(s){if(l(i,"Infinity"))return{type:"Infinity",negative:!0};e.unshift(s)}},g=function(e){for(;;){h();if(l(o,"?"))e.nullable&&a("Can't nullable more than once"),e.nullable=!0;else{if(!l(o,"["))return;h(),l(o,"]")||a("Unterminated array type"),e.array?(e.array++,e.nullableArray.push(e.nullable)):(e.array=1,e.nullableArray=[e.nullable]),e.nullable=!1}}},y=function(){var e=v(),t={sequence:!1,nullable:!1,array:!1,union:!1};if(e)t.idlType=e;else if(l(i,"sequence")){h();if(!!l(o,"<"))return t.sequence=!0,t.idlType=w()||a("Error parsing sequence type"),h(),l(o,">")||a("Unterminated sequence"),h(),l(o,"?")&&(t.nullable=!0),t;t.idlType="sequence"}else{var n=l(i);if(!n)return;t.idlType=n.value}return g(t),t.nullable&&!t.array&&t.idlType==="any"&&a("Type any cannot be made nullable"),t},b=function(){h();if(!l(o,"("))return;var e={sequence:!1,nullable:!1,array:!1,union:!0,idlType:[]},t=w()||a("Union type with no content");e.idlType.push(t);for(;;){h();if(!l(i,"or"))break;var n=w()||a("No type after 'or' in union type");e.idlType.push(n)}return l(o,")")||a("Unterminated union type"),g(e),e},w=function(){return y()||b()},E=function(){var t={optional:!1,variadic:!1};t.extAttrs=T(),h(),l(i,"optional")&&(t.optional=!0,h()),t.idlType=w();if(!t.idlType)return;t.optional||(h(),e.length>=3&&e[0].type==="other"&&e[0].value==="."&&e[1].type==="other"&&e[1].value==="."&&e[2].type==="other"&&e[2].value==="."&&(e.shift(),e.shift(),e.shift(),t.variadic=!0)),h();var n=l(i)||a("No name in argument");return t.name=n.value,t.optional&&(h(),t["default"]=N()),t},S=function(){var e=E(),t=[];if(!e)return t;t.push(e);for(;;){h();if(!l(o,","))return t;h();var n=E()||a("Trailing comma in arguments list");t.push(n)}},x=function(){h();var e=l(i);if(!e)return;var t={name:e.value,arguments:null};h();var n=l(o,"=");if(n){h(),t.rhs=l(i);if(!t.rhs)return a("No right hand side to extended attribute assignment")}return h(),l(o,"(")&&(t.arguments=S(),h(),l(o,")")||a("Unclosed argument in extended attribute")),t},T=function(){var e=[];h();if(!l(o,"["))return e;e[0]=x()||a("Extended attribute with not content"),h();while(l(o,","))h(),e.push(x()||a("Trailing comma in extended attribute")),h();return l(o,"]")||a("No end of extended attribute"),e},N=function(){h();if(l(o,"=")){h();var e=m();if(e)return e;var t=l(s)||a("No value for default");return t.value=t.value.replace(/^"/,"").replace(/"$/,""),t}},C=function(){h();if(!l(i,"const"))return;var e={type:"const",nullable:!1};h();var t=v();t||(t=l(i)||a("No type for const"),t=t.value),e.idlType=t,h(),l(o,"?")&&(e.nullable=!0,h());var n=l(i)||a("No name for const");e.name=n.value,h(),l(o,"=")||a("No value assignment for const"),h();var r=m();return r?e.value=r:a("No value for const"),h(),l(o,";")||a("Unterminated const"),e},k=function(){h();if(l(o,":")){h();var e=l(i)||a("No type in inheritance");return e.value}},L=function(e){h(),e||(e={});var t=l(i);return e.name=t?t.value:null,h(),l(o,"(")||a("Invalid operation"),e.arguments=S(),h(),l(o,")")||a("Unterminated operation"),h(),l(o,";")||a("Unterminated operation"),e},A=function(){h();var t;if(!l(i,"callback"))return;h();var n=l(i,"interface");if(n)return e.unshift(n),t=H(),t.type="callback interface",t;var r=l(i)||a("No name for callback");return t={type:"callback",name:r.value},h(),l(o,"=")||a("No assignment in callback"),h(),t.idlType=M(),h(),l(o,"(")||a("No arguments in callback"),t.arguments=S(),h(),l(o,")")||a("Unterminated callback"),h(),l(o,";")||a("Unterminated callback"),t},O=function(){h();var t=[],n={type:"attribute","static":!1,stringifier:!1,inherit:!1,readonly:!1};l(i,"static")?(n["static"]=!0,t.push(f)):l(i,"stringifier")&&(n.stringifier=!0,t.push(f));var r=h();r&&t.push(r);if(l(i,"inherit")){(n["static"]||n.stringifier)&&a("Cannot have a static or stringifier inherit"),n.inherit=!0,t.push(f);var r=h();r&&t.push(r)}if(l(i,"readonly")){n.readonly=!0,t.push(f);var r=h();r&&t.push(r)}if(!l(i,"attribute")){e=t.concat(e);return}h(),n.idlType=w()||a("No type in attribute"),n.idlType.sequence&&a("Attributes cannot accept sequence types"),h();var s=l(i)||a("No name in attribute");return n.name=s.value,h(),l(o,";")||a("Unterminated attribute"),n},M=function(){var e=w();if(!e){if(l(i,"void"))return"void";a("No return type")}return e},_=function(){h();var e={type:"operation",getter:!1,setter:!1,creator:!1,deleter:!1,legacycaller:!1,"static":!1,stringifier:!1};for(;;){h();if(l(i,"getter"))e.getter=!0;else if(l(i,"setter"))e.setter=!0;else if(l(i,"creator"))e.creator=!0;else if(l(i,"deleter"))e.deleter=!0;else{if(!l(i,"legacycaller"))break;e.legacycaller=!0}}if(e.getter||e.setter||e.creator||e.deleter||e.legacycaller)return h(),e.idlType=M(),L(e),e;if(l(i,"static"))return e["static"]=!0,e.idlType=M(),L(e),e;if(l(i,"stringifier"))return e.stringifier=!0,h(),l(o,";")?e:(e.idlType=M(),L(e),e);e.idlType=M(),h();if(l(i,"iterator")){h(),e.type="iterator";if(l(i,"object"))e.iteratorObject="object";else if(l(o,"=")){h();var t=l(i)||a("No right hand side in iterator");e.iteratorObject=t.value}return h(),l(o,";")||a("Unterminated iterator"),e}return L(e),e},D=function(e){for(;;){h();if(!l(o,","))break;h();var t=l(i)||a("Trailing comma in identifiers list");e.push(t.value)}},P=function(){h();if(!l(i,"serializer"))return;var e={type:"serializer"};h();if(l(o,"=")){h();if(l(o,"{")){e.patternMap=!0,h();var t=l(i);t&&t.value==="getter"?e.names=["getter"]:t&&t.value==="inherit"?(e.names=["inherit"],D(e.names)):t?(e.names=[t.value],D(e.names)):e.names=[],h(),l(o,"}")||a("Unterminated serializer pattern map")}else if(l(o,"[")){e.patternList=!0,h();var t=l(i);t&&t.value==="getter"?e.names=["getter"]:t?(e.names=[t.value],D(e.names)):e.names=[],h(),l(o,"]")||a("Unterminated serializer pattern list")}else{var n=l(i)||a("Invalid serializer");e.name=n.value}return h(),l(o,";")||a("Unterminated serializer"),e}return l(o,";")||(e.idlType=M(),h(),e.operation=L()),e},H=function(e){h();if(!l(i,"interface"))return;h();var t=l(i)||a("No name for interface"),n={type:"interface",name:t.value,partial:!1,members:[]};e||(n.inheritance=k()||null),h(),l(o,"{")||a("Bodyless interface");for(;;){h();if(l(o,"}"))return h(),l(o,";")||a("Missing semicolon after interface"),n;var r=T();h();var s=C();if(s){s.extAttrs=r,n.members.push(s);continue}var u=P()||O()||_()||a("Unknown member");u.extAttrs=r,n.members.push(u)}},B=function(){h();if(!l(i,"partial"))return;var e=j(!0)||H(!0)||a("Partial doesn't apply to anything");return e.partial=!0,e},j=function(e){h();if(!l(i,"dictionary"))return;h();var t=l(i)||a("No name for dictionary"),n={type:"dictionary",name:t.value,partial:!1,members:[]};e||(n.inheritance=k()||null),h(),l(o,"{")||a("Bodyless dictionary");for(;;){h();if(l(o,"}"))return h(),l(o,";")||a("Missing semicolon after dictionary"),n;var r=T();h();var s=w()||a("No type for dictionary member");h();var t=l(i)||a("No name for dictionary member");n.members.push({type:"field",name:t.value,idlType:s,extAttrs:r,"default":N()}),h(),l(o,";")||a("Unterminated dictionary member")}},F=function(){h();if(!l(i,"exception"))return;h();var e=l(i)||a("No name for exception"),t={type:"exception",name:e.value,members:[]};t.inheritance=k()||null,h(),l(o,"{")||a("Bodyless exception");for(;;){h();if(l(o,"}"))return h(),l(o,";")||a("Missing semicolon after exception"),t;var n=T();h();var r=C();if(r)r.extAttrs=n,t.members.push(r);else{var s=w();h();var e=l(i);h(),(!s||!e||!l(o,";"))&&a("Unknown member in exception body"),t.members.push({type:"field",name:e.value,idlType:s,extAttrs:n})}}},I=function(){h();if(!l(i,"enum"))return;h();var e=l(i)||a("No name for enum"),t={type:"enum",name:e.value,values:[]};h(),l(o,"{")||a("No curly for enum");var n=!1;for(;;){h();if(l(o,"}"))return h(),n&&a("Trailing comma in enum"),l(o,";")||a("No semicolon after enum"),t;var r=l(s)||a("Unexpected value in enum");t.values.push(r.value.replace(/"/g,"")),h(),l(o,",")?(h(),n=!0):n=!1}},q=function(){h();if(!l(i,"typedef"))return;var e={type:"typedef"};h(),e.typeExtAttrs=T(),h(),e.idlType=w()||a("No type in typedef"),h();var t=l(i)||a("No name in typedef");return e.name=t.value,h(),l(o,";")||a("Unterminated typedef"),e},R=function(){h();var t=l(i);if(!t)return;var n=h();if(l(i,"implements")){var r={type:"implements",target:t.value};h();var s=l(i)||a("Incomplete implements statement");return r["implements"]=s.value,h(),l(o,";")||a("No terminating ; for implements statement"),r}e.unshift(n),e.unshift(t)},U=function(){return A()||H()||B()||j()||F()||I()||q()||R()},z=function(){if(!e.length)return[];var t=[];for(;;){var n=T(),r=U();if(!r){n.length&&a("Stray extended attributes");break}r.extAttrs=n,t.push(r)}return t},W=z();return e.length&&a("Unrecognised tokens"),W},n={parse:function(n){var r=e(n);return t(r)}};typeof module!="undefined"&&module.exports?module.exports=n:window.WebIDL2=n})(),define("idl_parser",function(){}),define("WebIDLParser",["idl_parser"],function(){var e=window.WebIDL2;return delete window.WebIDL2,e}),define("WebIDL",["WebIDLParser"],function(e){function n(){e.call(this)}function r(e,t,n){var r={writable:!0,enumerable:!0,configurable:!0};return r.value=n,Object.defineProperty(e,t,r),e[t]}function i(e,t,n,r,i,s,o){var u={get:i,set:undefined,enumerable:!0,configurable:!!o.unforgable||!0},a;if(typeof e!="object"||typeof t!="string")throw new TypeError;n||(u.set=function(){if(arguments.length===0)throw new TypeError;return s(arguments[0])});if(!!r){if(typeof e!="function"){a=Object.getProtoTypeOf(e).prototype;if(typeof a!="function")throw new TypeError}e=a;return}Object.defineProperty(e,t,u)}function s(e,t){function u(e){return function(){return"function "+e+"() { [native code] }"}}var n="return function "+t+"(){throw new TypeError('DOM object constructor cannot be called as a function')}",r=(new Function(n))(),i=null,s=null,o;return i=u(t),o=function(){return this instanceof e?"[object "+t+"]":"[object "+t+"Prototype]"},e.prototype.toString=o,r.prototype=e.prototype,s={writable:!1,enumerable:!1,configurable:!1},Object.defineProperty(r,"prototype",s),e.prototype.constructor=r,Object.defineProperty(e.prototype,"constructor",{enumerable:!1}),r.__proto__=Object.create({}),e.toString=r.toString=i,Object.defineProperty(window,t,{value:r}),r}function o(e){if(!(e instanceof n))throw new TypeError("Illegal invocation")}var t=s(n,"WebIDL");return n.prototype=Object.create(e),r(t,"implementAttr",i),r(t,"implementOperation",r),r(t,"exportInterface",s),n.prototype.implement=function(){throw o(this),"Not implemented yet"},n.prototype.toJS=function(){throw o(this),"Not implemented yet"},t}),define("WebIDL/types/IDLType",[],function(){function e(e,t,n,r){var i={value:{get:function(){return n},set:function(e){return n=t(e,r),n},configurable:!0},type:{get:function(){return e}},extendedAttrs:{get:function(){return r},set:function(e){r=String(e)}},converter:{get:function(){return t}}};Object.defineProperties(this,i),this.value=n}return e}),define("WebIDL/types/UnrestrictedDouble",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){var t=Number(e);return isNaN(t)?0x7ff8000000000000:t}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.UnrestrictedDouble=function(e){var i="UnrestrictedDouble";if(!(this instanceof n.UnrestrictedDouble))return r(e);t.call(this,i,r,e)},n.UnrestrictedDouble.prototype=t,n.UnrestrictedDouble}),define("WebIDL/types/DOMString",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){var n;return e===null&&t==="TreatNullAs=EmptyString"?"":e===undefined&&t==="TreatUndefinedAs=EmptyString"?"":(n=String(e),n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.DOMString=function(e,i){var s="String";if(!(this instanceof n.DOMString))return r(e,i);t.call(this,s,r,e,i)},n.DOMString.prototype=t,n.DOMString}),define("WebIDL/types/Any",["require","WebIDL","WebIDL/types/IDLType","WebIDL/types/UnrestrictedDouble","WebIDL/types/DOMString"],function(e){function s(e){var n=typeof e;if(n==="undefined")return undefined;if(e===null)return null;if(n==="boolean")return e;if(n==="number")return t.UnrestrictedDouble(e);if(n==="string")return t.DOMString(e);if(n==="object"&&e!==null)return e}var t=e("WebIDL"),n=e("WebIDL/types/IDLType"),r=e("WebIDL/types/UnrestrictedDouble"),i=e("WebIDL/types/DOMString");return t.Any=function(e){var r="Any";if(!(this instanceof t[r]))return s(e);n.call(this,r,s,e)},t.Any.prototype=n,t.Any}),define("WebIDL/types/Boolean",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){var t=!!e;return t}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Boolean=function(e){var i="Boolean";if(!(this instanceof n.Boolean))return r(e);t.call(this,i,r,e)},n.Boolean.prototype=t,n.Boolean}),define("WebIDL/types/Byte",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){function i(e){if(e!==0)return!1;var t=Object.freeze({z:0});try{Object.defineProperty(t,"z",{value:e})}catch(n){return!1}return!0}var n=Number(e),r;if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<Math.pow(-2,7)||n>Math.pow(2,7)-1)throw new TypeError;return n}return t==="Clamp"?(n=Math.min(Math.max(n,Math.pow(-2,7)),Math.pow(2,7)-1),n=Math.abs(n-Math.round(n))===.5?Math.round(n)%2===0?Math.round(n):Math.floor(n):Math.round(n),n=n===0?0:n,n):isNaN(n)||n===0||n===+Infinity||n===-Infinity?0:(n=(n>0?1:-1)*Math.floor(Math.abs(n)),r=Math.pow(2,8),n=(n%r+r)%r,n>=Math.pow(2,7)?n-Math.pow(2,8):n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Byte=function(e,i){var s="Byte";if(!(this instanceof n.Byte))return r(e,i);t.call(this,s,r,e,i)},n.Byte.prototype=t,n.Byte}),define("WebIDL/types/ByteString",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){var t=String(e);for(var n=t.length-1;n>=0;n--)if(t.charCodeAt(n)>255)throw new TypeError;return"".concat(t)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.ByteString=function(e){var i="ByteString";if(!(this instanceof n.ByteString))return r(e);t.call(this,i,r,e)},n.ByteString.prototype=t,n.ByteString}),define("WebIDL/types/CallbackFunction",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){if(typeof e!="function")throw new TypeError;return e}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.CallbackFunction=function(e,i){var s;i||(i="name"in e?e.name:"");if(!(this instanceof n.CallbackFunction))return r(e);t.call(this,i,r,e)},n.CallbackFunction.prototype=t,n.CallbackFunction}),define("WebIDL/types/Date",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){return new Date(e)}function i(e){if(!e instanceof Date)throw new TypeError;return isNaN(e.getTime())?undefined:e.getTime()}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Date=function(e){var s,o,u="Date";if(!(this instanceof n.Date))return i(e);t.call(this,u,i,e),s=Object.getOwnPropertyDescriptor(this,"value"),o=s.get,s.get=function(){var e=o();return r(e)},Object.defineProperty(this,"value",s),this.value=e},n.Date.prototype=t,n.Date}),define("WebIDL/types/Double",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){var t=Number(e);if(isNaN(t)||t===+Infinity||t===-Infinity)throw new TypeError;return t}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Double=function(e){var i="Double";if(!(this instanceof n.Double))return r(e);t.call(this,i,r,e)},n.Double.prototype=t,n.Double}),define("WebIDL/types/Enumeration",["require","WebIDL","WebIDL/types/IDLType"],function(e){function r(e){return e.slice()}function i(e,t){var n=String(e);for(var r=t.length-1,i;r>=0;r--){i=t[r];if(i===n)return i}throw new TypeError}var t=e("WebIDL"),n=e("WebIDL/types/IDLType");return t.Enumeration=function(e,s,o){if(!(this instanceof t.Enumeration))return i(o,s);if(!(s instanceof Array))throw new TypeError("enums must be an array");for(var u=s.length-1;u>=0;u--)if(typeof s[u]!="string")throw new TypeError("Enumeration types must be a string");n.call(this,e,r,s)},t.Enumeration.prototype=n,t.Enumeration.prototype.has=function(e){try{i(e,this.value)}catch(t){return!1}return!0},t.Enumeration}),define("WebIDL/types/Float",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){function r(e){if(e!==0)return!1;var t=Object.freeze({z:0});try{Object.defineProperty(t,"z",{value:e})}catch(n){return!1}return!0}var t,n;t=Number(e);if(isNaN(t)||t===+Infinity||t===-Infinity)throw new TypeError;n=new Float32Array(new ArrayBuffer(4)),n[0]=t;if(n[0]===+Infinity||n[0]===-Infinity)throw new TypeError;return n[0]===0&&!r(n[0])&&r(t)?0:n[0]}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Float=function(e){var i,s,o="Float";if(!(this instanceof n.Float))return r(e);t.call(this,o,r,e),s=new Float32Array(new ArrayBuffer(4)),i=Object.getOwnPropertyDescriptor(this,"value"),i.get=function(){return s[0]},i.set=function(e){return s[0]=r(e),s[0]},Object.defineProperty(this,"value",i),this.value=e},n.Float.prototype=t,n.Float}),define("WebIDL/types/Long",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){function r(e){var t=Number(e),n,r,i;return isNaN(t)||t===0||t===Infinity||t===-Infinity?0:(n=(t>0?1:-1)*Math.floor(Math.abs(t)),r=Math.pow(2,32),i=(n%r+r)%r,i>=Math.pow(2,31)?i-Math.pow(2,32):i)}var n;n=Number(e);if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<Math.pow(-2,31)||n>Math.pow(2,31)-1)throw new TypeError;return n}return t==="Clamp"?(n=Math.min(Math.max(n,Math.pow(-2,31)),Math.pow(2,31)-1),n=Math.abs(n-Math.round(n))===.5?Math.round(n)%2===0?Math.round(n):Math.floor(n):Math.round(n),n):(n=r(n),n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Long=function(e,i){var s="Long";if(!(this instanceof n.Long))return r(e,i);t.call(this,s,r,e,i)},n.Long.prototype=t,n.Long}),define("WebIDL/types/LongLong",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){var n=Number(n);if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<-(Math.pow(2,53)-1)||n>Math.pow(2,53)-1)throw new TypeError;return n}return t==="Clamp"?(n=Math.min(Math.max(n,-(Math.pow(-2,53)-1)),Math.pow(2,53)-1),n=Math.abs(n-Math.round(n))===.5?Math.round(n)%2===0?Math.round(n):Math.floor(n):Math.round(n),n):isNaN(n)||n===0||n===Infinity||n===-Infinity?0:(n=(n>0?1:-1)*Math.floor(Math.abs(n)),n%=Math.pow(2,64),n>=Math.floor(2,63)&&(n-=Math.floor(2,64)),n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.LongLong=function(e,i){var s="LongLong";if(!(this instanceof n.LongLong))return r(e,i);t.call(this,s,r,e,i)},n.LongLong.prototype=t,n.LongLong}),define("WebIDL/types/Object",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError;return e}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Object=function(e){var i="Object";if(!(this instanceof n.Object))return r(e);t.call(this,i,r,e)},n.Object.prototype=t,n.Object}),define("WebIDL/types/Octet",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){function i(e){if(e!==0)return!1;var t=Object.freeze({z:0});try{Object.defineProperty(t,"z",{value:e})}catch(n){return!1}return!0}var n=Number(e),r;if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<0||n>Math.pow(2,8)-1)throw new TypeError;return n}return!isNaN(n)&&t==="Clamp"?(n=Math.min(Math.max(n,0),Math.pow(2,8)-1),n=Math.abs(n-Math.round(n))===.5?Math.round(n)%2===0?Math.round(n):Math.floor(n):Math.round(n),n=n===0&&i(n)?0:n,n):isNaN(n)||n===0||n===+Infinity||n===-Infinity?0:(n=(n>0?1:-1)*Math.floor(Math.abs(n)),r=Math.pow(2,8),n=(n%r+r)%r,n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Octet=function(e,i){var s="Octet";if(!(this instanceof n.Octet))return r(e,i);t.call(this,s,r,e,i)},n.Octet.prototype=t,n.Octet}),define("WebIDL/types/RegExp",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){function r(e){var t=e===null?"null":typeof e;return t==="function"?t="Object":t=t.charAt(0).toUpperCase()+t.slice(1),t}var t=Object.prototype.toString.apply(e),n;if(r(e)!=="Object"||t!=="[object RegExp]")e=new RegExp(e);return e}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.RegExp=function(e){var i="RegExp";if(!(this instanceof n.RegExp))return r(e);t.call(this,i,r,e)},n.RegExp.prototype=t,n.RegExp}),define("WebIDL/types/Short",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){function i(e){if(e!==0)return!1;var t=Object.freeze({z:0});try{Object.defineProperty(t,"z",{value:e})}catch(n){return!1}return!0}var n=Number(e),r;if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<Math.pow(2,-15)||n>Math.pow(2,15)-1)throw new TypeError;return n}return!isNaN(n)&&t==="Clamp"?(n=Math.abs(n-Math.round(n))===.5?Math.round(n)%2===0?Math.round(n):Math.floor(n):Math.round(n),n=n===0?0:n,n=Math.min(Math.max(n,Math.pow(-2,15)),Math.pow(2,15)-1),n):isNaN(n)||n===+Infinity||n===-Infinity?0:(n=(n>0?1:-1)*Math.floor(Math.abs(n)),r=Math.pow(2,16),n=(n%r+r)%r,n>=Math.pow(2,15)?n-Math.pow(2,16):n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.Short=function(e,i){var s="Short";if(!(this instanceof n.Short))return r(e,i);t.call(this,s,r,e,i)},n.Short.prototype=t,n.Short}),define("WebIDL/types/UnrestrictedFloat",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e){function r(e){if(e!==0)return!1;var t=Object.freeze({z:0});try{Object.defineProperty(t,"z",{value:e})}catch(n){return!1}return!0}var t,n;return t=Number(e),isNaN(t)?2143289344:(n=new Float32Array(new ArrayBuffer(4)),n[0]=t,n[0]===+Infinity?+Infinity:n[0]===-Infinity?-Infinity:n[0]===0&&!r(n[0])&&r(t)?0:n[0])}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.UnrestrictedFloat=function(e){var i,s,o,u="UnrestrictedFloat";if(!(this instanceof n.UnrestrictedFloat))return r(e);t.call(this,u,r,e),s=new Float32Array(new ArrayBuffer(4)),i=Object.getPrototypeOf(this),o=Object.getOwnPropertyDescriptor(i,"value"),o.get=function(){return s[0]},o.set=function(e){return s[0]=r(e),s[0]},Object.defineProperty(this,"value",o),this.value=e},n.UnrestrictedFloat.prototype=t,n.UnrestrictedFloat}),define("WebIDL/types/UnsignedLong",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){function r(e){var t,n,r,i;return t=Number(e),isNaN(e)||t===0||t===Infinity||t===-Infinity?0:(n=(t>0?1:-1)*Math.floor(Math.abs(t)),r=Math.pow(2,32),i=(n%r+r)%r,i)}var n=Number(e);if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<0||n>Math.pow(2,32)-1)throw new TypeError;return n}return t==="Clamp"?(n=Math.min(Math.max(n,0),Math.pow(2,32)-1),n=Math.abs(n-Math.round(n))===.5?Math.round(n)%2===0?Math.round(n):Math.floor(n):Math.round(n),n):(n=r(n),n)}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.UnsignedLong=function(e,i){var s="UnsignedLong";if(!(this instanceof n.UnsignedLong))return r(e,i);t.call(this,s,r,e,i)},n.UnsignedLong.prototype=t,n.UnsignedLong}),define("WebIDL/types/UnsignedShort",["require","WebIDL/types/IDLType","WebIDL"],function(e){function r(e,t){function i(e){var t,n,r,i;return t=Number(e),isNaN(t)||t===0||t===Infinity||t===-Infinity?0:(n=(t>0?1:-1)*Math.floor(Math.abs(t)),r=Math.pow(2,16),i=(n%r+r)%r,i)}var n=Number(e),r;if(t==="EnforceRange"){if(isNaN(n)||n===+Infinity||n===-Infinity)throw new TypeError;n=(n>0?1:-1)*Math.floor(Math.abs(n));if(n<0||n>Math.pow(2,16)-1)throw new TypeError;return n}return t==="Clamp"&&(n=Math.min(Math.max(n,0),Math.pow(2,16)-1),r=Math.round(n),n=Math.abs(n-r)===.5?r%2===0?r:Math.floor(n):r),n=i(n),n}var t=e("WebIDL/types/IDLType"),n=e("WebIDL");return n.UnsignedShort=function(e,i){var s="UnsignedShort";if(!(this instanceof n.UnsignedShort))return r(e,i);t.call(this,s,r,e,i)},n.UnsignedShort.prototype=t,n.UnsignedShort}),require.config({baseUrl:"/lib/",paths:{idl_parser:"../node_modules/webidl2/lib/webidl2"}}),require(["WebIDL","WebIDL/types/Any","WebIDL/types/Boolean","WebIDL/types/Byte","WebIDL/types/ByteString","WebIDL/types/CallbackFunction","WebIDL/types/DOMString","WebIDL/types/Date","WebIDL/types/Double","WebIDL/types/Enumeration","WebIDL/types/Float","WebIDL/types/IDLType","WebIDL/types/Long","WebIDL/types/LongLong","WebIDL/types/Object","WebIDL/types/Octet","WebIDL/types/RegExp","WebIDL/types/Short","WebIDL/types/UnrestrictedDouble","WebIDL/types/UnrestrictedFloat","WebIDL/types/UnsignedLong","WebIDL/types/UnsignedShort"]),define("config",function(){});