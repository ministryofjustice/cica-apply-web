!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=128)}([function(t,e,n){var r=n(3),o=n(39),i=n(4),c=n(27),u=n(47),a=n(64),f=o("wks"),s=r.Symbol,l=a?s:s&&s.withoutSetter||c;t.exports=function(t){return i(f,t)||(u&&i(s,t)?f[t]=s[t]:f[t]=l("Symbol."+t)),f[t]}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var r=n(3),o=n(36).f,i=n(9),c=n(14),u=n(38),a=n(59),f=n(86);t.exports=function(t,e){var n,s,l,p,v,d=t.target,g=t.global,y=t.stat;if(n=g?r:y?r[d]||u(d,{}):(r[d]||{}).prototype)for(s in e){if(p=e[s],l=t.noTargetGet?(v=o(n,s))&&v.value:n[s],!f(g?s:d+(y?".":"#")+s,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;a(p,l)}(t.sham||l&&l.sham)&&i(p,"sham",!0),c(n,s,p,t)}}},function(t,e,n){(function(e){var n=function(t){return t&&t.Math==Math&&t};t.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof e&&e)||Function("return this")()}).call(this,n(83))},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var r=n(8),o=n(55),i=n(7),c=n(23),u=Object.defineProperty;e.f=r?u:function(t,e,n){if(i(t),e=c(e,!0),i(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(5);t.exports=function(t){if(!r(t))throw TypeError(String(t)+" is not an object");return t}},function(t,e,n){var r=n(1);t.exports=!r((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},function(t,e,n){var r=n(8),o=n(6),i=n(16);t.exports=r?function(t,e,n){return o.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(29),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,e,n){var r=n(18);t.exports=function(t){return Object(r(t))}},function(t,e,n){var r=n(8),o=n(1),i=n(4),c=Object.defineProperty,u={},a=function(t){throw t};t.exports=function(t,e){if(i(u,t))return u[t];e||(e={});var n=[][t],f=!!i(e,"ACCESSORS")&&e.ACCESSORS,s=i(e,0)?e[0]:a,l=i(e,1)?e[1]:void 0;return u[t]=!!n&&!o((function(){if(f&&!r)return!0;var t={length:-1};f?c(t,1,{enumerable:!0,get:a}):t[1]=1,n.call(t,s,l)}))}},function(t,e,n){var r=n(22),o=n(18);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(3),o=n(9),i=n(4),c=n(38),u=n(57),a=n(24),f=a.get,s=a.enforce,l=String(String).split("String");(t.exports=function(t,e,n,u){var a=!!u&&!!u.unsafe,f=!!u&&!!u.enumerable,p=!!u&&!!u.noTargetGet;"function"==typeof n&&("string"!=typeof e||i(n,"name")||o(n,"name",e),s(n).source=l.join("string"==typeof e?e:"")),t!==r?(a?!p&&t[e]&&(f=!0):delete t[e],f?t[e]=n:o(t,e,n)):f?t[e]=n:c(e,n)})(Function.prototype,"toString",(function(){return"function"==typeof this&&f(this).source||u(this)}))},function(t,e,n){var r,o;
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/js/scripts.js":
/*!***************************!*\
  !*** ./src/js/scripts.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_ga__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/ga */ "./src/modules/ga/index.js");
/* harmony import */ var _modules_autocomplete_autocomplete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/autocomplete/autocomplete */ "./src/modules/autocomplete/autocomplete.js");
/* harmony import */ var _modules_cookie_banner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/cookie-banner */ "./src/modules/cookie-banner/index.js");
/* harmony import */ var _modules_cookie_preference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modules/cookie-preference */ "./src/modules/cookie-preference/index.js");
/* global ANALYTICS_TRACKING_ID */





(function () {
  var cookiePreference = Object(_modules_cookie_preference__WEBPACK_IMPORTED_MODULE_3__["default"])('_prefs', ['essential', 'analytics']);

  if (cookiePreference.get('analytics').value === '1') {
    var cicaGa = Object(_modules_ga__WEBPACK_IMPORTED_MODULE_0__["default"])(window);
    cicaGa.setUpGAEventTracking();
  } else {
    window["ga-disable-".concat("UA-136710388-2")] = true;
  }

  var autocomplete = Object(_modules_autocomplete_autocomplete__WEBPACK_IMPORTED_MODULE_1__["createAutocomplete"])(window);
  autocomplete.init('.govuk-select');
  var cookieBanner = Object(_modules_cookie_banner__WEBPACK_IMPORTED_MODULE_2__["default"])(window, cookiePreference);
  cookieBanner.show();
})();

/***/ }),

/***/ "./src/modules/autocomplete/autocomplete.js":
/*!**************************************************!*\
  !*** ./src/modules/autocomplete/autocomplete.js ***!
  \**************************************************/
/*! exports provided: createAutocomplete */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createAutocomplete", function() { return createAutocomplete; });
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js");
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_from__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.from */ "./node_modules/core-js/modules/es.array.from.js");
/* harmony import */ var core_js_modules_es_array_from__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_from__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.object.freeze */ "./node_modules/core-js/modules/es.object.freeze.js");
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_13__);















function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* global accessibleAutocomplete */
function createAutocomplete(window) {
  function inputValueTemplate(result) {
    if (typeof result === 'string') {
      return result;
    }

    return result && result.name;
  }

  function suggestionTemplate(result) {
    var templateString;

    if (typeof result === 'string') {
      // on page load.
      templateString = "<strong>".concat(result, "</strong>");
    } else {
      templateString = "<strong>".concat(result.name, "</strong>");
    }

    return templateString;
  }

  function onConfirm(result) {
    var element = window.document.querySelector('.govuk-select');

    if (result) {
      var valueToSelect = result.code;
      element.value = valueToSelect;
    } else {
      element.value = '';
    }
  }

  function htmlCollectionToArray(ddElement) {
    // Turn the array-like html collection into an array
    return _toConsumableArray(ddElement.options);
  }

  function formatResults(optionArray) {
    // <option value="100000001">Ayrshire & Arran</option>
    // =>
    // [{code: 100000001, name: 'Ayrshire & Arran'}, ....]
    return optionArray.map(function (option) {
      return {
        code: option.value,
        name: option.innerHTML
      };
    });
  }
  /**
   * Initialises the `Enhanced auto-complete` select element implementation.
   *
   * @param {(string|NodeList)} elements - A CSS selector for the elements, or a collection of the elements that are to be turned in to autocomplete select elements.
   *
   * @example
   *
   *     autocomplete.init('.govuk-select');
   *     autocomplete.init(window.document.querySelectorAll('.govuk-select'));
   */


  function init(elements) {
    var selectElements = elements;

    if (typeof selectElements === 'string') {
      selectElements = window.document.querySelectorAll(selectElements);
    }

    if (selectElements.length) {
      var _loop = function _loop(i) {
        selectElements[i].parentNode.classList.add('autocomplete__wrapper');
        accessibleAutocomplete.enhanceSelectElement({
          selectElement: selectElements[i],
          minLength: 2,
          defaultValue: '',
          autoselect: true,
          confirmOnBlur: false,
          showAllValues: true,
          displayMenu: 'overlay',
          onConfirm: onConfirm,
          // eslint-disable-next-line no-loop-func
          source: function source(query, syncResults) {
            var resultsArray = htmlCollectionToArray(selectElements[i]);
            var results = formatResults(resultsArray);
            syncResults(query ? results.filter(function (result) {
              // Make the user unable to search for and select the place holder.
              if (result.code === '') {
                return false;
              }

              return result.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            }) : []);
          },
          templates: {
            inputValue: inputValueTemplate,
            suggestion: suggestionTemplate
          }
        });
      };

      for (var i = 0; i < selectElements.length; i += 1) {
        _loop(i);
      }
    }
  }

  return Object.freeze({
    inputValueTemplate: inputValueTemplate,
    suggestionTemplate: suggestionTemplate,
    onConfirm: onConfirm,
    htmlCollectionToArray: htmlCollectionToArray,
    formatResults: formatResults,
    init: init
  });
} // eslint-disable-next-line import/prefer-default-export




/***/ }),

/***/ "./src/modules/cookie-banner/index.js":
/*!********************************************!*\
  !*** ./src/modules/cookie-banner/index.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.object.freeze */ "./node_modules/core-js/modules/es.object.freeze.js");
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_2__);




function createCookieBanner(window, cookiePreference) {
  var cookieBannerElement = window.document.querySelector('#cookie-banner');

  function show() {
    if (!cookiePreference.get()) {
      cookieBannerElement.classList.add('cookie-banner--visible');
    }
  }

  function hide() {
    cookieBannerElement.classList.remove('cookie-banner--visible');
  }

  var buttonAcceptAll = window.document.querySelector('#cookie-banner-accept-all');
  buttonAcceptAll.addEventListener('click', function (e) {
    cookiePreference.acceptAll();
    hide();
    e.preventDefault();
    return false;
  });
  var formCookiePreference = window.document.querySelector('#cookie-preferences');

  if (formCookiePreference) {
    var preferencesElements = formCookiePreference.querySelectorAll('[data-cookie-preference]'); // check/select the radio button that corresponds to the current cookie settings.

    preferencesElements.forEach(function (element) {
      if (element.value === cookiePreference.get(element.getAttribute('data-cookie-preference')).value) {
        // eslint-disable-next-line no-param-reassign
        element.checked = true;
      }
    });
    formCookiePreference.addEventListener('submit', function (e) {
      var preferencesElementsSelected = formCookiePreference.querySelectorAll('[data-cookie-preference]:checked'); // always needs to be set regardless.

      cookiePreference.set('essential', 1);
      preferencesElementsSelected.forEach(function (element) {
        cookiePreference.set(element.getAttribute('data-cookie-preference'), element.value);
      });
      hide();
      window.document.querySelector('#preferences-set-success').classList.remove('moj-banner--invisible'); // eslint-disable-next-line no-param-reassign

      window.document.body.scrollTop = 0; // eslint-disable-next-line no-param-reassign

      window.document.documentElement.scrollTop = 0;
      e.preventDefault();
      return false;
    });
  }

  return Object.freeze({
    show: show,
    hide: hide
  });
}

/* harmony default export */ __webpack_exports__["default"] = (createCookieBanner);

/***/ }),

/***/ "./src/modules/cookie-preference/index.js":
/*!************************************************!*\
  !*** ./src/modules/cookie-preference/index.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js");
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.includes */ "./node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.reduce */ "./node_modules/core-js/modules/es.array.reduce.js");
/* harmony import */ var core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.object.freeze */ "./node_modules/core-js/modules/es.object.freeze.js");
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.string.includes */ "./node_modules/core-js/modules/es.string.includes.js");
/* harmony import */ var core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../node_modules/js-cookie/src/js.cookie */ "./node_modules/js-cookie/src/js.cookie.js");
/* harmony import */ var _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10__);












function createCookiePreference(cookieName, allowedPreferences) {
  var cookieConfig = {
    path: '/',
    expires: 365,
    samesite: 'strict'
  };

  function getDistinctValues(value) {
    var valueTable = [];
    return value.split(',').filter(function (x) {
      return x !== '';
    }) // removes empty array element caused by the trailing comma.
    .reduce(function (acc, item) {
      var accumulator = acc;
      accumulator += '';
      var splitItem = item.split('=');

      if (!valueTable.includes(splitItem[0])) {
        accumulator += "".concat(splitItem[0], "=").concat(splitItem[1], ",");
        valueTable.push(splitItem[0]);
      }

      return accumulator;
    }, '');
  }

  function getPreference(preferenceName) {
    var cookieValue = _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10___default.a.get(cookieName);
    var cookiePreferenceTable = {};

    if (cookieValue) {
      cookiePreferenceTable = window.atob(cookieValue).split(',').reduce(function (acc, item) {
        var splitItem = item.split('='); // eslint-disable-next-line prefer-destructuring

        acc[splitItem[0]] = splitItem[1];
        return acc;
      }, {});
    }

    return {
      name: preferenceName,
      value: cookiePreferenceTable[preferenceName] || null
    };
  }

  function set(preferenceName, preferenceValue) {
    if (!allowedPreferences.includes(preferenceName)) {
      throw Error("Unable to set preference \"".concat(preferenceName, "\" as it is not in the preference whitelist"));
    }

    var currentCookieValue = _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10___default.a.get(cookieName);

    if (currentCookieValue) {
      currentCookieValue = window.atob(currentCookieValue);
      var newCookieValue = getDistinctValues( // add the new one to the front so it is retained after
      // `getDistinctValues` all other preferences with the same name.
      "".concat(preferenceName, "=").concat(preferenceValue, ",").concat(currentCookieValue, ","));
      _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10___default.a.set(cookieName, window.btoa(newCookieValue), cookieConfig);
      return;
    }

    _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10___default.a.set(cookieName, window.btoa("".concat(preferenceName, "=").concat(preferenceValue, ",")), cookieConfig);
  }

  function get(preferenceName) {
    if (preferenceName) {
      return getPreference(preferenceName);
    } // else return true/false if the cookie exists.


    return _node_modules_js_cookie_src_js_cookie__WEBPACK_IMPORTED_MODULE_10___default.a.get(cookieName);
  }

  function acceptAll() {
    allowedPreferences.forEach(function (cookiePreference) {
      set(cookiePreference, '1');
    });
  }

  return Object.freeze({
    set: set,
    get: get,
    acceptAll: acceptAll
  });
}

/* harmony default export */ __webpack_exports__["default"] = (createCookiePreference);

/***/ }),

/***/ "./src/modules/ga/index.js":
/*!*********************************!*\
  !*** ./src/modules/ga/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_splice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js");
/* harmony import */ var core_js_modules_es_array_splice__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_splice__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_assign__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");
/* harmony import */ var core_js_modules_es_object_assign__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.object.freeze */ "./node_modules/core-js/modules/es.object.freeze.js");
/* harmony import */ var core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_freeze__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _vendor_gua_anchor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./vendor/gua-anchor */ "./src/modules/ga/vendor/gua-anchor.js");
/* harmony import */ var _node_modules_debounce__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../node_modules/debounce */ "./node_modules/debounce/index.js");
/* harmony import */ var _node_modules_debounce__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_node_modules_debounce__WEBPACK_IMPORTED_MODULE_6__);








function createCicaGa(window) {
  // eslint-disable-next-line no-undef
  Object(_vendor_gua_anchor__WEBPACK_IMPORTED_MODULE_5__["default"])("http://localhost:3000", window); // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  // gtag('event', <action>, {
  //     'event_category': <category>,
  //     'event_label': <label>,
  //     'value': <value>
  // });

  var defaultOptions = {
    type: 'event',
    // <String>
    action: 'click',
    // <String>
    category: 'category',
    // <String>
    label: undefined,
    // <String>
    value: undefined // non-negative <Integer>

  };

  function send(options) {
    // eslint-disable-next-line prefer-object-spread
    var gtagOptions = Object.assign({}, defaultOptions, options);
    window.gtag(gtagOptions.type, gtagOptions.action, {
      event_category: gtagOptions.category,
      event_label: gtagOptions.label,
      value: gtagOptions.value,
      event_callback: gtagOptions.callback
    });
  }
  /* * ******************************************* * */

  /* * * TRACKING HANDLERS START                 * * */

  /* * ******************************************* * */


  function detailsElementHandler(element) {
    element.addEventListener('click', function () {
      // the open attribute is added when the user reveals
      // the content of the details element.
      // click it from closed to open will result in
      // the open variable having a value of `null`.
      // checking for `null` will tell us that the element
      // is being opened (and not closed). We can then send
      // a GA event for the user opening the details element.
      var open = element.getAttribute('open');

      if (open === null) {
        var detailsTagText = element.querySelector('.govuk-details__summary-text').innerText;
        send({
          action: 'open',
          category: 'details-tag',
          label: detailsTagText
        });
      }
    }, false);
  }

  function scrollThresholdHandler() {
    var body = window.document.body;
    var html = window.document.documentElement;
    var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    var scrollDepthTargets = [10, 25, 50, 75, 90, 100];
    window.document.addEventListener('scroll', _node_modules_debounce__WEBPACK_IMPORTED_MODULE_6___default()(function () {
      if (!scrollDepthTargets.length) {
        return;
      }

      var currentScrollTop = window.document.documentElement.scrollTop;
      var documentScrollPosition = Math.floor(currentScrollTop / documentHeight * 100); // add on the equivalent percentage for an entire screen length
      // because we are measuring from the bottom, not the top.

      documentScrollPosition += Math.floor(window.screen.height / documentHeight * 100);
      scrollDepthTargets.forEach(function (target, index) {
        if (documentScrollPosition >= target) {
          send({
            category: 'scrolling',
            action: "".concat(target, "%"),
            label: window.location.href
          });
          scrollDepthTargets.splice(index, 1);
        }
      });
    }, 100), false);
  }
  /* * ******************************************* * */

  /* * * TRACKING HANDLERS END                   * * */

  /* * ******************************************* * */


  function setUpGAEventTracking() {
    var trackableElements = window.document.querySelectorAll('[data-module], .ga-event'); // GOVUK modules, and custom events tracking.

    trackableElements.forEach(function (element) {
      if (element.classList.contains('ga-event--scrollthreshold')) {
        scrollThresholdHandler();
        return;
      }

      var dataModuleId = element.getAttribute('data-module');

      if (dataModuleId === 'govuk-details') {
        detailsElementHandler(element);
      }
    });
  }

  return Object.freeze({
    setUpGAEventTracking: setUpGAEventTracking
  });
}

/* harmony default export */ __webpack_exports__["default"] = (createCicaGa);

/***/ }),

/***/ "./src/modules/ga/vendor/gua-anchor.js":
/*!*********************************************!*\
  !*** ./src/modules/ga/vendor/gua-anchor.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.slice */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_3__);





/* eslint-disable func-names */

/* eslint-disable no-loop-func */

/* eslint-disable object-shorthand */

/* eslint-disable prefer-destructuring, no-var  */

/**
 * Logs an event with Google Universal Analytics
 * when an external, download, or non http(s), link is clicked.
 *
 * Supports IE6+, Firefox, Chrome, Safari, Opera, and any other standards based browser.
 *
 * Does not track links that the user opens with the right-click context menu e.g. "Open Link in New Tab".
 *
 * If present, does not currently replicate target="_blank" when opening links.
 *
 * @method guaTrackLinks
 * @requires gtag.js
 * @param domain {String} current domain, can be as specific as required e.g.
 *
 * Given the current domain is "http://www.yoursite.co.uk"
 *
 * setting domain to "yoursite.co.uk" would work as follows:
 * http://www.yoursite.co.uk = Internal
 * https://www.yoursite.co.uk/index.html = Internal
 * http://yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk/index.html = Internal
 *
 * setting domain to "subdomain.yoursite.co.uk" would work as follows:
 * http://www.yoursite.co.uk = External
 * https://www.yoursite.co.uk/index.html = External
 * http://yoursite.co.uk = External
 * https://subdomain.yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk/index.html = Internal
 *
 * @param window {Object} window object
 */
// eslint-disable-next-line no-unused-vars
function guaTrackLinks(domain, window) {
  var document = window.document;
  var body = document.body;
  var anchor = document.createElement('a');
  var isQualifiedURL;
  var rDownloads = /.+\.(?:zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|mp4|txt|rar|wma|mov|avi|wmv|flv|wav)$/i; // set the test anchor's href to a relative url "a".

  anchor.href = 'a'; // if the href is still "a" when accessed then the browser doesn't return fully qualified URLs (probably IE <= 7).
  // e.g. should be "http://www.some-domain.co.uk/a" not "a".

  isQualifiedURL = anchor.href !== 'a';

  function handler(ev) {
    var node = ev.target || ev.srcElement;
    var href;
    var hrefNoQuerystring;
    var scheme; // click may have originated from an element within an anchor e.g.
    // <a href="index.html"><img src="logo.jpg" alt="Home" /></a>
    // walk up dom and check if target has a parent anchor

    while (node !== body) {
      if (node.nodeName.toLowerCase() === 'a' && node.href) {
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        // https://msdn.microsoft.com/en-us/ie/ms536429(v=vs.94)
        // on dynamically created links with a relative path, IE 7 does not return a fully qualified URL for the href attribute
        // passing the 4 flag will get this
        href = isQualifiedURL ? node.href : node.getAttribute('href', 4);
        hrefNoQuerystring = href.split('?')[0]; // get scheme from url e.g. http:, https:, mailto:, tel:, etc
        // http://en.wikipedia.org/wiki/URI_scheme

        scheme = href.slice(0, href.indexOf(':') + 1); // handle schemes

        if (scheme.indexOf('http') === 0) {
          if (hrefNoQuerystring.indexOf(domain) === -1) {
            scheme = 'external-link';
          } else if (rDownloads.test(hrefNoQuerystring)) {
            scheme = 'download-link';
          } else {
            // internal link and not a download, ignore it
            break;
          }
        } // will be called for relevant http(s) links and catch all for other schemes (mailto:, tel:, etc)


        window.gtag('event', 'click', {
          event_category: scheme,
          event_label: href,
          event_callback: function event_callback() {
            // eslint-disable-next-line no-param-reassign
            window.location.href = href;
          }
        }); // stop default link click and let the GA hitCallback redirect to the link
        // eslint-disable-next-line no-unused-expressions, no-param-reassign

        ev.preventDefault ? ev.preventDefault() : ev.returnValue = 0;
        break;
      } else {
        node = node.parentNode;
      }
    }
  } // attach listener to body and delegate clicks
  // eslint-disable-next-line no-unused-expressions


  body.addEventListener ? body.addEventListener('click', handler) : body.attachEvent('onclick', handler);
}

/* harmony default export */ __webpack_exports__["default"] = (guaTrackLinks);

/***/ })

/******/ });
