// Bigint implementation
'use strict';class JSBI extends Array{constructor(a,b){if(a>JSBI.__kMaxLength)throw new RangeError("Maximum BigInt size exceeded");super(a),this.sign=b}static BigInt(a){var b=Math.floor,c=Number.isFinite;if("number"==typeof a){if(0===a)return JSBI.__zero();if((0|a)===a)return 0>a?JSBI.__oneDigit(-a,!0):JSBI.__oneDigit(a,!1);if(!c(a)||b(a)!==a)throw new RangeError("The number "+a+" cannot be converted to BigInt because it is not an integer");return JSBI.__fromDouble(a)}if("string"==typeof a){const b=JSBI.__fromString(a);if(null===b)throw new SyntaxError("Cannot convert "+a+" to a BigInt");return b}if("boolean"==typeof a)return!0===a?JSBI.__oneDigit(1,!1):JSBI.__zero();if("object"==typeof a){if(a.constructor===JSBI)return a;const b=JSBI.__toPrimitive(a);return JSBI.BigInt(b)}throw new TypeError("Cannot convert "+a+" to a BigInt")}toDebugString(){const a=["BigInt["];for(const b of this)a.push((b?(b>>>0).toString(16):b)+", ");return a.push("]"),a.join("")}toString(a=10){if(2>a||36<a)throw new RangeError("toString() radix argument must be between 2 and 36");return 0===this.length?"0":0==(a&a-1)?JSBI.__toStringBasePowerOfTwo(this,a):JSBI.__toStringGeneric(this,a,!1)}static toNumber(a){const b=a.length;if(0===b)return 0;if(1===b){const b=a.__unsignedDigit(0);return a.sign?-b:b}const c=a.__digit(b-1),d=JSBI.__clz32(c),e=32*b-d;if(1024<e)return a.sign?-Infinity:1/0;let f=e-1,g=c,h=b-1;const i=d+1;let j=32===i?0:g<<i;j>>>=12;const k=i-12;let l=12<=i?0:g<<20+i,m=20+i;0<k&&0<h&&(h--,g=a.__digit(h),j|=g>>>32-k,l=g<<k,m=k),0<m&&0<h&&(h--,g=a.__digit(h),l|=g>>>32-m,m-=32);const n=JSBI.__decideRounding(a,m,h,g);if((1===n||0===n&&1==(1&l))&&(l=l+1>>>0,0===l&&(j++,0!=j>>>20&&(j=0,f++,1023<f))))return a.sign?-Infinity:1/0;const o=a.sign?-2147483648:0;return f=f+1023<<20,JSBI.__kBitConversionInts[1]=o|f|j,JSBI.__kBitConversionInts[0]=l,JSBI.__kBitConversionDouble[0]}static unaryMinus(a){if(0===a.length)return a;const b=a.__copy();return b.sign=!a.sign,b}static bitwiseNot(a){return a.sign?JSBI.__absoluteSubOne(a).__trim():JSBI.__absoluteAddOne(a,!0)}static exponentiate(a,b){if(b.sign)throw new RangeError("Exponent must be positive");if(0===b.length)return JSBI.__oneDigit(1,!1);if(0===a.length)return a;if(1===a.length&&1===a.__digit(0))return a.sign&&0==(1&b.__digit(0))?JSBI.unaryMinus(a):a;if(1<b.length)throw new RangeError("BigInt too big");let c=b.__unsignedDigit(0);if(1===c)return a;if(c>=JSBI.__kMaxLengthBits)throw new RangeError("BigInt too big");if(1===a.length&&2===a.__digit(0)){const b=1+(c>>>5),d=a.sign&&0!=(1&c),e=new JSBI(b,d);e.__initializeDigits();const f=1<<(31&c);return e.__setDigit(b-1,f),e}let d=null,e=a;for(0!=(1&c)&&(d=a),c>>=1;0!==c;c>>=1)e=JSBI.multiply(e,e),0!=(1&c)&&(null===d?d=e:d=JSBI.multiply(d,e));return d}static multiply(a,b){if(0===a.length)return a;if(0===b.length)return b;let c=a.length+b.length;32<=a.__clzmsd()+b.__clzmsd()&&c--;const d=new JSBI(c,a.sign!==b.sign);d.__initializeDigits();for(let c=0;c<a.length;c++)JSBI.__multiplyAccumulate(b,a.__digit(c),d,c);return d.__trim()}static divide(a,b){if(0===b.length)throw new RangeError("Division by zero");if(0>JSBI.__absoluteCompare(a,b))return JSBI.__zero();const c=a.sign!==b.sign,d=b.__unsignedDigit(0);let e;if(1===b.length&&65535>=d){if(1===d)return c===a.sign?a:JSBI.unaryMinus(a);e=JSBI.__absoluteDivSmall(a,d,null)}else e=JSBI.__absoluteDivLarge(a,b,!0,!1);return e.sign=c,e.__trim()}static remainder(a,b){if(0===b.length)throw new RangeError("Division by zero");if(0>JSBI.__absoluteCompare(a,b))return a;const c=b.__unsignedDigit(0);if(1===b.length&&65535>=c){if(1===c)return JSBI.__zero();const b=JSBI.__absoluteModSmall(a,c);return 0===b?JSBI.__zero():JSBI.__oneDigit(b,a.sign)}const d=JSBI.__absoluteDivLarge(a,b,!1,!0);return d.sign=a.sign,d.__trim()}static add(a,b){const c=a.sign;return c===b.sign?JSBI.__absoluteAdd(a,b,c):0<=JSBI.__absoluteCompare(a,b)?JSBI.__absoluteSub(a,b,c):JSBI.__absoluteSub(b,a,!c)}static subtract(a,b){const c=a.sign;return c===b.sign?0<=JSBI.__absoluteCompare(a,b)?JSBI.__absoluteSub(a,b,c):JSBI.__absoluteSub(b,a,!c):JSBI.__absoluteAdd(a,b,c)}static leftShift(a,b){return 0===b.length||0===a.length?a:b.sign?JSBI.__rightShiftByAbsolute(a,b):JSBI.__leftShiftByAbsolute(a,b)}static signedRightShift(a,b){return 0===b.length||0===a.length?a:b.sign?JSBI.__leftShiftByAbsolute(a,b):JSBI.__rightShiftByAbsolute(a,b)}static unsignedRightShift(){throw new TypeError("BigInts have no unsigned right shift; use >> instead")}static lessThan(a,b){return 0>JSBI.__compareToBigInt(a,b)}static lessThanOrEqual(a,b){return 0>=JSBI.__compareToBigInt(a,b)}static greaterThan(a,b){return 0<JSBI.__compareToBigInt(a,b)}static greaterThanOrEqual(a,b){return 0<=JSBI.__compareToBigInt(a,b)}static equal(a,b){if(a.sign!==b.sign)return!1;if(a.length!==b.length)return!1;for(let c=0;c<a.length;c++)if(a.__digit(c)!==b.__digit(c))return!1;return!0}static notEqual(a,b){return!JSBI.equal(a,b)}static bitwiseAnd(a,b){var c=Math.max;if(!a.sign&&!b.sign)return JSBI.__absoluteAnd(a,b).__trim();if(a.sign&&b.sign){const d=c(a.length,b.length)+1;let e=JSBI.__absoluteSubOne(a,d);const f=JSBI.__absoluteSubOne(b);return e=JSBI.__absoluteOr(e,f,e),JSBI.__absoluteAddOne(e,!0,e).__trim()}return a.sign&&([a,b]=[b,a]),JSBI.__absoluteAndNot(a,JSBI.__absoluteSubOne(b)).__trim()}static bitwiseXor(a,b){var c=Math.max;if(!a.sign&&!b.sign)return JSBI.__absoluteXor(a,b).__trim();if(a.sign&&b.sign){const d=c(a.length,b.length),e=JSBI.__absoluteSubOne(a,d),f=JSBI.__absoluteSubOne(b);return JSBI.__absoluteXor(e,f,e).__trim()}const d=c(a.length,b.length)+1;a.sign&&([a,b]=[b,a]);let e=JSBI.__absoluteSubOne(b,d);return e=JSBI.__absoluteXor(e,a,e),JSBI.__absoluteAddOne(e,!0,e).__trim()}static bitwiseOr(a,b){var c=Math.max;const d=c(a.length,b.length);if(!a.sign&&!b.sign)return JSBI.__absoluteOr(a,b).__trim();if(a.sign&&b.sign){let c=JSBI.__absoluteSubOne(a,d);const e=JSBI.__absoluteSubOne(b);return c=JSBI.__absoluteAnd(c,e,c),JSBI.__absoluteAddOne(c,!0,c).__trim()}a.sign&&([a,b]=[b,a]);let e=JSBI.__absoluteSubOne(b,d);return e=JSBI.__absoluteAndNot(e,a,e),JSBI.__absoluteAddOne(e,!0,e).__trim()}static asIntN(a,b){if(0===b.length)return b;if(0===a)return JSBI.__zero();if(a>=JSBI.__kMaxLengthBits)return b;const c=a+31>>>5;if(b.length<c)return b;const d=b.__unsignedDigit(c-1),e=1<<(31&a-1);if(b.length===c&&d<e)return b;if(!((d&e)===e))return JSBI.__truncateToNBits(a,b);if(!b.sign)return JSBI.__truncateAndSubFromPowerOfTwo(a,b,!0);if(0==(d&e-1)){for(let d=c-2;0<=d;d--)if(0!==b.__digit(d))return JSBI.__truncateAndSubFromPowerOfTwo(a,b,!1);return b.length===c&&d===e?b:JSBI.__truncateToNBits(a,b)}return JSBI.__truncateAndSubFromPowerOfTwo(a,b,!1)}static asUintN(a,b){if(0===b.length)return b;if(0===a)return JSBI.__zero();if(b.sign){if(a>JSBI.__kMaxLengthBits)throw new RangeError("BigInt too big");return JSBI.__truncateAndSubFromPowerOfTwo(a,b,!1)}if(a>=JSBI.__kMaxLengthBits)return b;const c=a+31>>>5;if(b.length<c)return b;const d=31&a;if(b.length==c){if(0===d)return b;const a=b.__digit(c-1);if(0==a>>>d)return b}return JSBI.__truncateToNBits(a,b)}static ADD(a,b){if(a=JSBI.__toPrimitive(a),b=JSBI.__toPrimitive(b),"string"==typeof a)return"string"!=typeof b&&(b=b.toString()),a+b;if("string"==typeof b)return a.toString()+b;if(a=JSBI.__toNumeric(a),b=JSBI.__toNumeric(b),JSBI.__isBigInt(a)&&JSBI.__isBigInt(b))return JSBI.add(a,b);if("number"==typeof a&&"number"==typeof b)return a+b;throw new TypeError("Cannot mix BigInt and other types, use explicit conversions")}static LT(a,b){return JSBI.__compare(a,b,0)}static LE(a,b){return JSBI.__compare(a,b,1)}static GT(a,b){return JSBI.__compare(a,b,2)}static GE(a,b){return JSBI.__compare(a,b,3)}static EQ(a,b){for(;;){if(JSBI.__isBigInt(a))return JSBI.__isBigInt(b)?JSBI.equal(a,b):JSBI.EQ(b,a);if("number"==typeof a){if(JSBI.__isBigInt(b))return JSBI.__equalToNumber(b,a);if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b)}else if("string"==typeof a){if(JSBI.__isBigInt(b))return a=JSBI.__fromString(a),null!==a&&JSBI.equal(a,b);if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b)}else if("boolean"==typeof a){if(JSBI.__isBigInt(b))return JSBI.__equalToNumber(b,+a);if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b)}else if("symbol"==typeof a){if(JSBI.__isBigInt(b))return!1;if("object"!=typeof b)return a==b;b=JSBI.__toPrimitive(b)}else if("object"==typeof a){if("object"==typeof b&&b.constructor!==JSBI)return a==b;a=JSBI.__toPrimitive(a)}else return a==b}}static NE(a,b){return!JSBI.EQ(a,b)}static __zero(){return new JSBI(0,!1)}static __oneDigit(a,b){const c=new JSBI(1,b);return c.__setDigit(0,a),c}__copy(){const a=new JSBI(this.length,this.sign);for(let b=0;b<this.length;b++)a[b]=this[b];return a}__trim(){let a=this.length,b=this[a-1];for(;0===b;)a--,b=this[a-1],this.pop();return 0===a&&(this.sign=!1),this}__initializeDigits(){for(let a=0;a<this.length;a++)this[a]=0}static __decideRounding(a,b,c,d){if(0<b)return-1;let e;if(0>b)e=-b-1;else{if(0===c)return-1;c--,d=a.__digit(c),e=31}let f=1<<e;if(0==(d&f))return-1;if(f-=1,0!=(d&f))return 1;for(;0<c;)if(c--,0!==a.__digit(c))return 1;return 0}static __fromDouble(a){JSBI.__kBitConversionDouble[0]=a;const b=2047&JSBI.__kBitConversionInts[1]>>>20,c=b-1023,d=(c>>>5)+1,e=new JSBI(d,0>a);let f=1048575&JSBI.__kBitConversionInts[1]|1048576,g=JSBI.__kBitConversionInts[0];const h=20,i=31&c;let j,k=0;if(i<20){const a=h-i;k=a+32,j=f>>>a,f=f<<32-a|g>>>a,g<<=32-a}else if(i===20)k=32,j=f,f=g;else{const a=i-h;k=32-a,j=f<<a|g>>>32-a,f=g<<a}e.__setDigit(d-1,j);for(let b=d-2;0<=b;b--)0<k?(k-=32,j=f,f=g):j=0,e.__setDigit(b,j);return e.__trim()}static __isWhitespace(a){return!!(13>=a&&9<=a)||(159>=a?32==a:131071>=a?160==a||5760==a:196607>=a?(a&=131071,10>=a||40==a||41==a||47==a||95==a||4096==a):65279==a)}static __fromString(a,b=0){let c=0;const e=a.length;let f=0;if(f===e)return JSBI.__zero();let g=a.charCodeAt(f);for(;JSBI.__isWhitespace(g);){if(++f===e)return JSBI.__zero();g=a.charCodeAt(f)}if(43===g){if(++f===e)return null;g=a.charCodeAt(f),c=1}else if(45===g){if(++f===e)return null;g=a.charCodeAt(f),c=-1}if(0===b){if(b=10,48===g){if(++f===e)return JSBI.__zero();if(g=a.charCodeAt(f),88===g||120===g){if(b=16,++f===e)return null;g=a.charCodeAt(f)}else if(79===g||111===g){if(b=8,++f===e)return null;g=a.charCodeAt(f)}else if(66===g||98===g){if(b=2,++f===e)return null;g=a.charCodeAt(f)}}}else if(16===b&&48===g){if(++f===e)return JSBI.__zero();if(g=a.charCodeAt(f),88===g||120===g){if(++f===e)return null;g=a.charCodeAt(f)}}for(;48===g;){if(++f===e)return JSBI.__zero();g=a.charCodeAt(f)}const h=e-f;let i=JSBI.__kMaxBitsPerChar[b],j=JSBI.__kBitsPerCharTableMultiplier-1;if(h>1073741824/i)return null;const k=i*h+j>>>JSBI.__kBitsPerCharTableShift,l=new JSBI(k+31>>>5,!1),n=10>b?b:10,o=10<b?b-10:0;if(0==(b&b-1)){i>>=JSBI.__kBitsPerCharTableShift;const b=[],c=[];let d=!1;do{let h=0,j=0;for(;;){let b;if(g-48>>>0<n)b=g-48;else if((32|g)-97>>>0<o)b=(32|g)-87;else{d=!0;break}if(j+=i,h=h<<i|b,++f===e){d=!0;break}if(g=a.charCodeAt(f),32<j+i)break}b.push(h),c.push(j)}while(!d);JSBI.__fillFromParts(l,b,c)}else{l.__initializeDigits();let c=!1,h=0;do{let k=0,p=1;for(;;){let i;if(g-48>>>0<n)i=g-48;else if((32|g)-97>>>0<o)i=(32|g)-87;else{c=!0;break}const d=p*b;if(4294967295<d)break;if(p=d,k=k*b+i,h++,++f===e){c=!0;break}g=a.charCodeAt(f)}j=32*JSBI.__kBitsPerCharTableMultiplier-1;const q=i*h+j>>>JSBI.__kBitsPerCharTableShift+5;l.__inplaceMultiplyAdd(p,k,q)}while(!c)}if(f!==e){if(!JSBI.__isWhitespace(g))return null;for(f++;f<e;f++)if(g=a.charCodeAt(f),!JSBI.__isWhitespace(g))return null}return 0!=c&&10!==b?null:(l.sign=-1==c,l.__trim())}static __fillFromParts(a,b,c){let d=0,e=0,f=0;for(let g=b.length-1;0<=g;g--){const h=b[g],i=c[g];e|=h<<f,f+=i,32===f?(a.__setDigit(d++,e),f=0,e=0):32<f&&(a.__setDigit(d++,e),f-=32,e=h>>>i-f)}if(0!==e){if(d>=a.length)throw new Error("implementation bug");a.__setDigit(d++,e)}for(;d<a.length;d++)a.__setDigit(d,0)}static __toStringBasePowerOfTwo(a,b){const c=a.length;let d=b-1;d=(85&d>>>1)+(85&d),d=(51&d>>>2)+(51&d),d=(15&d>>>4)+(15&d);const e=d,f=b-1,g=a.__digit(c-1),h=JSBI.__clz32(g);let i=0|(32*c-h+e-1)/e;if(a.sign&&i++,268435456<i)throw new Error("string too long");const j=Array(i);let k=i-1,l=0,m=0;for(let d=0;d<c-1;d++){const b=a.__digit(d),c=(l|b<<m)&f;j[k--]=JSBI.__kConversionChars[c];const g=e-m;for(l=b>>>g,m=32-g;m>=e;)j[k--]=JSBI.__kConversionChars[l&f],l>>>=e,m-=e}const n=(l|g<<m)&f;for(j[k--]=JSBI.__kConversionChars[n],l=g>>>e-m;0!==l;)j[k--]=JSBI.__kConversionChars[l&f],l>>>=e;if(a.sign&&(j[k--]="-"),-1!=k)throw new Error("implementation bug");return j.join("")}static __toStringGeneric(a,b,c){const d=a.length;if(0===d)return"";if(1===d){let d=a.__unsignedDigit(0).toString(b);return!1===c&&a.sign&&(d="-"+d),d}const e=32*d-JSBI.__clz32(a.__digit(d-1)),f=JSBI.__kMaxBitsPerChar[b],g=f-1;let h=e*JSBI.__kBitsPerCharTableMultiplier;h+=g-1,h=0|h/g;const i=h+1>>1,j=JSBI.exponentiate(JSBI.__oneDigit(b,!1),JSBI.__oneDigit(i,!1));let k,l;const m=j.__unsignedDigit(0);if(1===j.length&&65535>=m){k=new JSBI(a.length,!1),k.__initializeDigits();let c=0;for(let b=2*a.length-1;0<=b;b--){const d=c<<16|a.__halfDigit(b);k.__setHalfDigit(b,0|d/m),c=0|d%m}l=c.toString(b)}else{const c=JSBI.__absoluteDivLarge(a,j,!0,!0);k=c.quotient;const d=c.remainder.__trim();l=JSBI.__toStringGeneric(d,b,!0)}k.__trim();let n=JSBI.__toStringGeneric(k,b,!0);for(;l.length<i;)l="0"+l;return!1===c&&a.sign&&(n="-"+n),n+l}static __unequalSign(a){return a?-1:1}static __absoluteGreater(a){return a?-1:1}static __absoluteLess(a){return a?1:-1}static __compareToBigInt(a,b){const c=a.sign;if(c!==b.sign)return JSBI.__unequalSign(c);const d=JSBI.__absoluteCompare(a,b);return 0<d?JSBI.__absoluteGreater(c):0>d?JSBI.__absoluteLess(c):0}static __compareToNumber(a,b){if(b|!0){const c=a.sign,d=0>b;if(c!==d)return JSBI.__unequalSign(c);if(0===a.length){if(d)throw new Error("implementation bug");return 0===b?0:-1}if(1<a.length)return JSBI.__absoluteGreater(c);const e=Math.abs(b),f=a.__unsignedDigit(0);return f>e?JSBI.__absoluteGreater(c):f<e?JSBI.__absoluteLess(c):0}return JSBI.__compareToDouble(a,b)}static __compareToDouble(a,b){if(b!==b)return b;if(b===1/0)return-1;if(b===-Infinity)return 1;const c=a.sign;if(c!==0>b)return JSBI.__unequalSign(c);if(0===b)throw new Error("implementation bug: should be handled elsewhere");if(0===a.length)return-1;JSBI.__kBitConversionDouble[0]=b;const d=2047&JSBI.__kBitConversionInts[1]>>>20;if(2047==d)throw new Error("implementation bug: handled elsewhere");const e=d-1023;if(0>e)return JSBI.__absoluteGreater(c);const f=a.length;let g=a.__digit(f-1);const h=JSBI.__clz32(g),i=32*f-h,j=e+1;if(i<j)return JSBI.__absoluteLess(c);if(i>j)return JSBI.__absoluteGreater(c);let k=1048576|1048575&JSBI.__kBitConversionInts[1],l=JSBI.__kBitConversionInts[0];const m=20,n=31-h;if(n!==(i-1)%31)throw new Error("implementation bug");let o,p=0;if(20>n){const a=m-n;p=a+32,o=k>>>a,k=k<<32-a|l>>>a,l<<=32-a}else if(20===n)p=32,o=k,k=l;else{const a=n-m;p=32-a,o=k<<a|l>>>32-a,k=l<<a}if(g>>>=0,o>>>=0,g>o)return JSBI.__absoluteGreater(c);if(g<o)return JSBI.__absoluteLess(c);for(let d=f-2;0<=d;d--){0<p?(p-=32,o=k>>>0,k=l,l=0):o=0;const b=a.__unsignedDigit(d);if(b>o)return JSBI.__absoluteGreater(c);if(b<o)return JSBI.__absoluteLess(c)}if(0!==k||0!==l){if(0===p)throw new Error("implementation bug");return JSBI.__absoluteLess(c)}return 0}static __equalToNumber(a,b){var c=Math.abs;return b|0===b?0===b?0===a.length:1===a.length&&a.sign===0>b&&a.__unsignedDigit(0)===c(b):0===JSBI.__compareToDouble(a,b)}static __comparisonResultToBool(a,b){switch(b){case 0:return 0>a;case 1:return 0>=a;case 2:return 0<a;case 3:return 0<=a;}throw new Error("unreachable")}static __compare(a,b,c){if(a=JSBI.__toPrimitive(a),b=JSBI.__toPrimitive(b),"string"==typeof a&&"string"==typeof b)switch(c){case 0:return a<b;case 1:return a<=b;case 2:return a>b;case 3:return a>=b;}if(JSBI.__isBigInt(a)&&"string"==typeof b)return b=JSBI.__fromString(b),null!==b&&JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a,b),c);if("string"==typeof a&&JSBI.__isBigInt(b))return a=JSBI.__fromString(a),null!==a&&JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a,b),c);if(a=JSBI.__toNumeric(a),b=JSBI.__toNumeric(b),JSBI.__isBigInt(a)){if(JSBI.__isBigInt(b))return JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(a,b),c);if("number"!=typeof b)throw new Error("implementation bug");return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(a,b),c)}if("number"!=typeof a)throw new Error("implementation bug");if(JSBI.__isBigInt(b))return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(b,a),2^c);if("number"!=typeof b)throw new Error("implementation bug");return 0===c?a<b:1===c?a<=b:2===c?a>b:3===c?a>=b:void 0}__clzmsd(){return JSBI.__clz32(this[this.length-1])}static __absoluteAdd(a,b,c){if(a.length<b.length)return JSBI.__absoluteAdd(b,a,c);if(0===a.length)return a;if(0===b.length)return a.sign===c?a:JSBI.unaryMinus(a);let d=a.length;(0===a.__clzmsd()||b.length===a.length&&0===b.__clzmsd())&&d++;const e=new JSBI(d,c);let f=0,g=0;for(;g<b.length;g++){const c=b.__digit(g),d=a.__digit(g),h=(65535&d)+(65535&c)+f,i=(d>>>16)+(c>>>16)+(h>>>16);f=i>>>16,e.__setDigit(g,65535&h|i<<16)}for(;g<a.length;g++){const b=a.__digit(g),c=(65535&b)+f,d=(b>>>16)+(c>>>16);f=d>>>16,e.__setDigit(g,65535&c|d<<16)}return g<e.length&&e.__setDigit(g,f),e.__trim()}static __absoluteSub(a,b,c){if(0===a.length)return a;if(0===b.length)return a.sign===c?a:JSBI.unaryMinus(a);const d=new JSBI(a.length,c);let e=0,f=0;for(;f<b.length;f++){const c=a.__digit(f),g=b.__digit(f),h=(65535&c)-(65535&g)-e;e=1&h>>>16;const i=(c>>>16)-(g>>>16)-e;e=1&i>>>16,d.__setDigit(f,65535&h|i<<16)}for(;f<a.length;f++){const b=a.__digit(f),c=(65535&b)-e;e=1&c>>>16;const g=(b>>>16)-e;e=1&g>>>16,d.__setDigit(f,65535&c|g<<16)}return d.__trim()}static __absoluteAddOne(a,b,c=null){const d=a.length;null===c?c=new JSBI(d,b):c.sign=b;let e=!0;for(let f,g=0;g<d;g++){if(f=a.__digit(g),e){const a=-1===f;f=0|f+1,e=a}c.__setDigit(g,f)}return e&&c.__setDigitGrow(d,1),c}static __absoluteSubOne(a,b){const c=a.length;b=b||c;const d=new JSBI(b,!1);let e=!0;for(let f,g=0;g<c;g++){if(f=a.__digit(g),e){const a=0===f;f=0|f-1,e=a}d.__setDigit(g,f)}if(e)throw new Error("implementation bug");for(let e=c;e<b;e++)d.__setDigit(e,0);return d}static __absoluteAnd(a,b,c=null){let d=a.length,e=b.length,f=e;if(d<e){f=d;const c=a,g=d;a=b,d=e,b=c,e=g}let g=f;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)&b.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteAndNot(a,b,c=null){const d=a.length,e=b.length;let f=e;d<e&&(f=d);let g=d;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)&~b.__digit(h));for(;h<d;h++)c.__setDigit(h,a.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteOr(a,b,c=null){let d=a.length,e=b.length,f=e;if(d<e){f=d;const c=a,g=d;a=b,d=e,b=c,e=g}let g=d;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)|b.__digit(h));for(;h<d;h++)c.__setDigit(h,a.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteXor(a,b,c=null){let d=a.length,e=b.length,f=e;if(d<e){f=d;const c=a,g=d;a=b,d=e,b=c,e=g}let g=d;null===c?c=new JSBI(g,!1):g=c.length;let h=0;for(;h<f;h++)c.__setDigit(h,a.__digit(h)^b.__digit(h));for(;h<d;h++)c.__setDigit(h,a.__digit(h));for(;h<g;h++)c.__setDigit(h,0);return c}static __absoluteCompare(a,b){const c=a.length-b.length;if(0!=c)return c;let d=a.length-1;for(;0<=d&&a.__digit(d)===b.__digit(d);)d--;return 0>d?0:a.__unsignedDigit(d)>b.__unsignedDigit(d)?1:-1}static __multiplyAccumulate(a,b,c,d){if(0===b)return;const e=65535&b,f=b>>>16;let g=0,h=0,j=0;for(let k=0;k<a.length;k++,d++){let b=c.__digit(d),i=65535&b,l=b>>>16;const m=a.__digit(k),n=65535&m,o=m>>>16,p=JSBI.__imul(n,e),q=JSBI.__imul(n,f),r=JSBI.__imul(o,e),s=JSBI.__imul(o,f);i+=h+(65535&p),l+=j+g+(i>>>16)+(p>>>16)+(65535&q)+(65535&r),g=l>>>16,h=(q>>>16)+(r>>>16)+(65535&s)+g,g=h>>>16,h&=65535,j=s>>>16,b=65535&i|l<<16,c.__setDigit(d,b)}for(;0!=g||0!==h||0!==j;d++){let a=c.__digit(d);const b=(65535&a)+h,e=(a>>>16)+(b>>>16)+j+g;h=0,j=0,g=e>>>16,a=65535&b|e<<16,c.__setDigit(d,a)}}static __internalMultiplyAdd(a,b,c,d,e){let f=c,g=0;for(let h=0;h<d;h++){const c=a.__digit(h),d=JSBI.__imul(65535&c,b),i=(65535&d)+g+f;f=i>>>16;const j=JSBI.__imul(c>>>16,b),k=(65535&j)+(d>>>16)+f;f=k>>>16,g=j>>>16,e.__setDigit(h,k<<16|65535&i)}if(e.length>d)for(e.__setDigit(d++,f+g);d<e.length;)e.__setDigit(d++,0);else if(0!==f+g)throw new Error("implementation bug")}__inplaceMultiplyAdd(a,b,c){c>this.length&&(c=this.length);const e=65535&a,f=a>>>16;let g=0,h=65535&b,j=b>>>16;for(let k=0;k<c;k++){const a=this.__digit(k),b=65535&a,c=a>>>16,d=JSBI.__imul(b,e),i=JSBI.__imul(b,f),l=JSBI.__imul(c,e),m=JSBI.__imul(c,f),n=h+(65535&d),o=j+g+(n>>>16)+(d>>>16)+(65535&i)+(65535&l);h=(i>>>16)+(l>>>16)+(65535&m)+(o>>>16),g=h>>>16,h&=65535,j=m>>>16;this.__setDigit(k,65535&n|o<<16)}if(0!=g||0!==h||0!==j)throw new Error("implementation bug")}static __absoluteDivSmall(a,b,c){null===c&&(c=new JSBI(a.length,!1));let d=0;for(let e,f=2*a.length-1;0<=f;f-=2){e=(d<<16|a.__halfDigit(f))>>>0;const g=0|e/b;d=0|e%b,e=(d<<16|a.__halfDigit(f-1))>>>0;const h=0|e/b;d=0|e%b,c.__setDigit(f>>>1,g<<16|h)}return c}static __absoluteModSmall(a,b){let c=0;for(let d=2*a.length-1;0<=d;d--){const e=(c<<16|a.__halfDigit(d))>>>0;c=0|e%b}return c}static __absoluteDivLarge(a,b,d,e){const f=b.__halfDigitLength(),g=b.length,c=a.__halfDigitLength()-f;let h=null;d&&(h=new JSBI(c+2>>>1,!1),h.__initializeDigits());const i=new JSBI(f+2>>>1,!1);i.__initializeDigits();const j=JSBI.__clz16(b.__halfDigit(f-1));0<j&&(b=JSBI.__specialLeftShift(b,j,0));const k=JSBI.__specialLeftShift(a,j,1),l=b.__halfDigit(f-1);let m=0;for(let n,o=c;0<=o;o--){n=65535;const a=k.__halfDigit(o+f);if(a!==l){const c=(a<<16|k.__halfDigit(o+f-1))>>>0;n=0|c/l;let d=0|c%l;const e=b.__halfDigit(f-2),g=k.__halfDigit(o+f-2);for(;JSBI.__imul(n,e)>>>0>(d<<16|g)>>>0&&(n--,d+=l,!(65535<d)););}JSBI.__internalMultiplyAdd(b,n,0,g,i);let e=k.__inplaceSub(i,o,f+1);0!==e&&(e=k.__inplaceAdd(b,o,f),k.__setHalfDigit(o+f,k.__halfDigit(o+f)+e),n--),d&&(1&o?m=n<<16:h.__setDigit(o>>>1,m|n))}return e?(k.__inplaceRightShift(j),d?{quotient:h,remainder:k}:k):d?h:void 0}static __clz16(a){return JSBI.__clz32(a)-16}__inplaceAdd(a,b,c){let d=0;for(let e=0;e<c;e++){const c=this.__halfDigit(b+e)+a.__halfDigit(e)+d;d=c>>>16,this.__setHalfDigit(b+e,c)}return d}__inplaceSub(a,b,c){let d=0;if(1&b){b>>=1;let e=this.__digit(b),f=65535&e,g=0;for(;g<c-1>>>1;g++){const c=a.__digit(g),h=(e>>>16)-(65535&c)-d;d=1&h>>>16,this.__setDigit(b+g,h<<16|65535&f),e=this.__digit(b+g+1),f=(65535&e)-(c>>>16)-d,d=1&f>>>16}const h=a.__digit(g),i=(e>>>16)-(65535&h)-d;d=1&i>>>16,this.__setDigit(b+g,i<<16|65535&f);if(b+g+1>=this.length)throw new RangeError("out of bounds");0==(1&c)&&(e=this.__digit(b+g+1),f=(65535&e)-(h>>>16)-d,d=1&f>>>16,this.__setDigit(b+a.length,4294901760&e|65535&f))}else{b>>=1;let e=0;for(;e<a.length-1;e++){const c=this.__digit(b+e),f=a.__digit(e),g=(65535&c)-(65535&f)-d;d=1&g>>>16;const h=(c>>>16)-(f>>>16)-d;d=1&h>>>16,this.__setDigit(b+e,h<<16|65535&g)}const f=this.__digit(b+e),g=a.__digit(e),h=(65535&f)-(65535&g)-d;d=1&h>>>16;let i=0;0==(1&c)&&(i=(f>>>16)-(g>>>16)-d,d=1&i>>>16),this.__setDigit(b+e,i<<16|65535&h)}return d}__inplaceRightShift(a){if(0===a)return;let b=this.__digit(0)>>>a;const c=this.length-1;for(let e=0;e<c;e++){const c=this.__digit(e+1);this.__setDigit(e,c<<32-a|b),b=c>>>a}this.__setDigit(c,b)}static __specialLeftShift(a,b,c){const d=a.length,e=new JSBI(d+c,!1);if(0===b){for(let b=0;b<d;b++)e.__setDigit(b,a.__digit(b));return 0<c&&e.__setDigit(d,0),e}let f=0;for(let g=0;g<d;g++){const c=a.__digit(g);e.__setDigit(g,c<<b|f),f=c>>>32-b}return 0<c&&e.__setDigit(d,f),e}static __leftShiftByAbsolute(a,b){const c=JSBI.__toShiftAmount(b);if(0>c)throw new RangeError("BigInt too big");const e=c>>>5,f=31&c,g=a.length,h=0!==f&&0!=a.__digit(g-1)>>>32-f,j=g+e+(h?1:0),k=new JSBI(j,a.sign);if(0===f){let b=0;for(;b<e;b++)k.__setDigit(b,0);for(;b<j;b++)k.__setDigit(b,a.__digit(b-e))}else{let b=0;for(let a=0;a<e;a++)k.__setDigit(a,0);for(let c=0;c<g;c++){const g=a.__digit(c);k.__setDigit(c+e,g<<f|b),b=g>>>32-f}if(h)k.__setDigit(g+e,b);else if(0!==b)throw new Error("implementation bug")}return k.__trim()}static __rightShiftByAbsolute(a,b){const c=a.length,d=a.sign,e=JSBI.__toShiftAmount(b);if(0>e)return JSBI.__rightShiftByMaximum(d);const f=e>>>5,g=31&e;let h=c-f;if(0>=h)return JSBI.__rightShiftByMaximum(d);let i=!1;if(d){if(0!=(a.__digit(f)&(1<<g)-1))i=!0;else for(let b=0;b<f;b++)if(0!==a.__digit(b)){i=!0;break}}if(i&&0===g){const b=a.__digit(c-1);0==~b&&h++}let j=new JSBI(h,d);if(0===g)for(let b=f;b<c;b++)j.__setDigit(b-f,a.__digit(b));else{let b=a.__digit(f)>>>g;const d=c-f-1;for(let c=0;c<d;c++){const e=a.__digit(c+f+1);j.__setDigit(c,e<<32-g|b),b=e>>>g}j.__setDigit(d,b)}return i&&(j=JSBI.__absoluteAddOne(j,!0,j)),j.__trim()}static __rightShiftByMaximum(a){return a?JSBI.__oneDigit(1,!0):JSBI.__zero()}static __toShiftAmount(a){if(1<a.length)return-1;const b=a.__unsignedDigit(0);return b>JSBI.__kMaxLengthBits?-1:b}static __toPrimitive(a,b="default"){if("object"!=typeof a)return a;if(a.constructor===JSBI)return a;const c=a[Symbol.toPrimitive];if(c){const a=c(b);if("object"!=typeof a)return a;throw new TypeError("Cannot convert object to primitive value")}const d=a.valueOf;if(d){const b=d.call(a);if("object"!=typeof b)return b}const e=a.toString;if(e){const b=e.call(a);if("object"!=typeof b)return b}throw new TypeError("Cannot convert object to primitive value")}static __toNumeric(a){return JSBI.__isBigInt(a)?a:+a}static __isBigInt(a){return"object"==typeof a&&null!==a&&a.constructor===JSBI}static __truncateToNBits(a,b){const c=a+31>>>5,d=new JSBI(c,b.sign),e=c-1;for(let c=0;c<e;c++)d.__setDigit(c,b.__digit(c));let f=b.__digit(e);if(0!=(31&a)){const b=32-(31&a);f=f<<b>>>b}return d.__setDigit(e,f),d.__trim()}static __truncateAndSubFromPowerOfTwo(a,b,c){var d=Math.min;const e=a+31>>>5,f=new JSBI(e,c);let g=0;const h=e-1;let j=0;for(const e=d(h,b.length);g<e;g++){const a=b.__digit(g),c=0-(65535&a)-j;j=1&c>>>16;const d=0-(a>>>16)-j;j=1&d>>>16,f.__setDigit(g,65535&c|d<<16)}for(;g<h;g++)f.__setDigit(g,0|-j);let k=h<b.length?b.__digit(h):0;const l=31&a;let m;if(0==l){const a=0-(65535&k)-j;j=1&a>>>16;const b=0-(k>>>16)-j;m=65535&a|b<<16}else{const a=32-l;k=k<<a>>>a;const b=1<<32-a,c=(65535&b)-(65535&k)-j;j=1&c>>>16;const d=(b>>>16)-(k>>>16)-j;m=65535&c|d<<16,m&=b-1}return f.__setDigit(h,m),f.__trim()}__digit(a){return this[a]}__unsignedDigit(a){return this[a]>>>0}__setDigit(a,b){this[a]=0|b}__setDigitGrow(a,b){this[a]=0|b}__halfDigitLength(){const a=this.length;return 65535>=this.__unsignedDigit(a-1)?2*a-1:2*a}__halfDigit(a){return 65535&this[a>>>1]>>>((1&a)<<4)}__setHalfDigit(a,b){const c=a>>>1,d=this.__digit(c),e=1&a?65535&d|b<<16:4294901760&d|65535&b;this.__setDigit(c,e)}static __digitPow(a,b){let c=1;for(;0<b;)1&b&&(c*=a),b>>>=1,a*=a;return c}}JSBI.__kMaxLength=33554432,JSBI.__kMaxLengthBits=JSBI.__kMaxLength<<5,JSBI.__kMaxBitsPerChar=[0,0,32,51,64,75,83,90,96,102,107,111,115,119,122,126,128,131,134,136,139,141,143,145,147,149,151,153,154,156,158,159,160,162,163,165,166],JSBI.__kBitsPerCharTableShift=5,JSBI.__kBitsPerCharTableMultiplier=1<<JSBI.__kBitsPerCharTableShift,JSBI.__kConversionChars=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],JSBI.__kBitConversionBuffer=new ArrayBuffer(8),JSBI.__kBitConversionDouble=new Float64Array(JSBI.__kBitConversionBuffer),JSBI.__kBitConversionInts=new Int32Array(JSBI.__kBitConversionBuffer),JSBI.__clz32=Math.clz32||function(a){return 0===a?32:0|31-(0|Math.log(a>>>0)/Math.LN2)},JSBI.__imul=Math.imul||function(c,a){return 0|c*a},module.exports=JSBI;