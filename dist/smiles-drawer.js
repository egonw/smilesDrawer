'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The SmilesDrawer namespace.
 * @typicalname SmilesDrawer
 */
var SmilesDrawer = {
    Version: '1.0.0'
};

/**
 * Cleans a SMILES string (removes non-valid characters)
 *
 * @static
 * @param {String} smiles A SMILES string.
 * @returns {String} The clean SMILES string.
 */
SmilesDrawer.clean = function (smiles) {
    return smiles.replace(/[^A-Za-z0-9@\.\+\-\?!\(\)\[\]\{\}/\\=#\$:\*]/g, '');
};

/**
 * Applies the smiles drawer draw function to each canvas element that has a smiles string in the data-smiles attribute.
 *
 * @static
 * @param {Object} options SmilesDrawer options.
 * @param {String} [selector='canvas[data-smiles]'] Selectors for the draw areas (canvas elements).
 * @param {String} [themeName='light'] The theme to apply.
 * @param {Function} [onError='null'] A callback function providing an error object.
 */
SmilesDrawer.apply = function (options) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'canvas[data-smiles]';
    var themeName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'light';
    var onError = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var smilesDrawer = new SmilesDrawer.Drawer(options);
    var elements = document.querySelectorAll(selector);

    var _loop = function _loop() {
        var element = elements[i];

        SmilesDrawer.parse(element.getAttribute('data-smiles'), function (tree) {
            smilesDrawer.draw(tree, element, themeName, false);
        }, function (err) {
            if (onError) {
                onError(err);
            }
        });
    };

    for (var i = 0; i < elements.length; i++) {
        _loop();
    }
};

/**
 * Parses the entered smiles string.
 * 
 * @static
 * @param {String} smiles A SMILES string.
 * @param {Function} successCallback A callback that is called on success with the parse tree.
 * @param {Function} errorCallback A callback that is called with the error object on error.
 */
SmilesDrawer.parse = function (smiles, successCallback, errorCallback) {
    try {
        if (successCallback) {
            successCallback(SmilesDrawer.Parser.parse(smiles));
        }
    } catch (err) {
        if (errorCallback) {
            errorCallback(err);
        }
    }
};

// There be dragons (polyfills)

if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function value(_value) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ? len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = _value;
                k++;
            }

            // Step 13.
            return O;
        }
    });
}
/** 
 * A static class containing helper functions for array-related tasks. 
 */
SmilesDrawer.ArrayHelper = function () {
    function ArrayHelper() {
        _classCallCheck(this, ArrayHelper);
    }

    _createClass(ArrayHelper, null, [{
        key: 'clone',

        /**
         * Clone an array or an object. If an object is passed, a shallow clone will be created.
         *
         * @static
         * @param {*} arr The array or object to be cloned.
         * @returns {*} A clone of the array or object.
         */
        value: function clone(arr) {
            var out = Array.isArray(arr) ? [] : {};

            for (var key in arr) {
                var value = arr[key];

                if (typeof value.clone === 'function') {
                    out[key] = value.clone();
                } else {
                    out[key] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? SmilesDrawer.ArrayHelper.clone(value) : value;
                }
            }

            return out;
        }

        /**
         * Returns a string representation of an array. If the array contains objects with an id property, the id property is printed for each of the elements.
         *
         * @static
         * @param {Object[]} arr An array.
         * @param {*} arr[].id If the array contains an object with the property 'id', the properties value is printed. Else, the array elements value is printend.
         * @returns {String} A string representation of the array.
         */

    }, {
        key: 'print',
        value: function print(arr) {
            if (arr.length == 0) {
                return '';
            }

            var s = '(';

            for (var i = 0; i < arr.length; i++) {
                s += arr[i].id ? arr[i].id + ', ' : arr[i] + ', ';
            }

            s = s.substring(0, s.length - 2);

            return s + ')';
        }

        /**
         * Run a function for each element in the array. The element is supplied as an argument for the callback function
         *
         * @static
         * @param {Array} arr An array.
         * @param {Function} callback The callback function that is called for each element.
         */

    }, {
        key: 'each',
        value: function each(arr, callback) {
            for (var i = 0; i < arr.length; i++) {
                callback(arr[i]);
            }
        }

        /**
         * Return the array element from an array containing objects, where a property of the object is set to a given value.
         *
         * @static
         * @param {Array} arr An array.
         * @param {String|Number} property A property contained within an object in the array.
         * @param {String|Number} value The value of the property.
         * @returns {*} The array element matching the value.
         */

    }, {
        key: 'get',
        value: function get(arr, property, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][property] == value) {
                    return arr[i];
                }
            }
        }

        /**
         * Checks whether or not an array contains a given value. the options object passed as a second argument can contain three properties. value: The value to be searched for. property: The property that is to be searched for a given value. func: A function that is used as a callback to return either true or false in order to do a custom comparison.
         *
         * @static
         * @param {Array} arr An array.
         * @param {Object} options See method description.
         * @param {String} options.property The property on which to check.
         * @param {*} options.value The value for which to check.
         * @param {Function} [options.func=undefined] A custom property function.
         * @returns {Boolean} A boolean whether or not the array contains a value.
         */

    }, {
        key: 'contains',
        value: function contains(arr, options) {
            if (!options.property && !options.func) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == options.value) {
                        return true;
                    }
                }
            } else if (options.func) {
                for (var _i = 0; _i < arr.length; _i++) {
                    if (options.func(arr[_i])) {
                        return true;
                    }
                }
            } else {
                for (var _i2 = 0; _i2 < arr.length; _i2++) {
                    if (arr[_i2][options.property] == options.value) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Returns an array containing the intersection between two arrays. That is, values that are common to both arrays.
         *
         * @static
         * @param {Array} arrA An array.
         * @param {Array} arrB An array.
         * @returns {Array} The intersecting vlaues.
         */

    }, {
        key: 'intersection',
        value: function intersection(arrA, arrB) {
            var intersection = new Array();

            for (var i = 0; i < arrA.length; i++) {
                for (var j = 0; j < arrB.length; j++) {
                    if (arrA[i] === arrB[j]) {
                        intersection.push(arrA[i]);
                    }
                }
            }

            return intersection;
        }

        /**
         * Returns an array of unique elements contained in an array.
         *
         * @static
         * @param {Array} arr An array.
         * @returns {Array} An array of unique elements contained within the array supplied as an argument.
         */

    }, {
        key: 'unique',
        value: function unique(arr) {
            var contains = {};
            return arr.filter(function (i) {
                // using !== instead of hasOwnProperty (http://andrew.hedges.name/experiments/in/)
                return contains[i] !== undefined ? false : contains[i] = true;
            });
        }

        /**
         * Count the number of occurences of a value in an array.
         *
         * @static
         * @param {Array} arr An array.
         * @param {*} value A value to be counted.
         * @returns {Number} The number of occurences of a value in the array.
         */

    }, {
        key: 'count',
        value: function count(arr, value) {
            var count = 0;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    count++;
                }
            }

            return count;
        }

        /**
         * Toggles the value of an array. If a value is not contained in an array, the array returned will contain all the values of the original array including the value. If a value is contained in an array, the array returned will contain all the values of the original array excluding the value.
         *
         * @static
         * @param {Array} arr An array.
         * @param {*} value A value to be toggled.
         * @returns {Array} The toggled array.
         */

    }, {
        key: 'toggle',
        value: function toggle(arr, value) {
            var newArr = [];

            var removed = false;
            for (var i = 0; i < arr.length; i++) {
                // Do not copy value if it exists
                if (arr[i] !== value) {
                    newArr.push(arr[i]);
                } else {
                    // The element was not copied to the new array, which
                    // means it was removed
                    removed = true;
                }
            }

            // If the element was not removed, then it was not in the array
            // so add it
            if (!removed) {
                newArr.push(value);
            }

            return newArr;
        }

        /**
         * Remove a value from an array.
         *
         * @static
         * @param {Array} arr An array.
         * @param {*} value A value to be removed.
         * @returns {Array} A new array with the element with a given value removed.
         */

    }, {
        key: 'remove',
        value: function remove(arr, value) {
            var tmp = [];

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== value) {
                    tmp.push(arr[i]);
                }
            }

            return tmp;
        }

        /**
         * Remove a value from an array with unique values.
         *
         * @static
         * @param {Array} arr An array.
         * @param {*} value A value to be removed.
         * @returns {Array} An array with the element with a given value removed.
         */

    }, {
        key: 'removeUnique',
        value: function removeUnique(arr, value) {
            var index = array.indexOf(value);

            if (index > -1) {
                arr.splice(index, 1);
            }

            return arr;
        }

        /**
         * Remove all elements contained in one array from another array.
         *
         * @static
         * @param {Array} arrA The array to be filtered.
         * @param {Array} arrB The array containing elements that will be removed from the other array.
         * @returns {Array} The filtered array.
         */

    }, {
        key: 'removeAll',
        value: function removeAll(arrA, arrB) {
            return arrA.filter(function (item) {
                return arrB.indexOf(item) === -1;
            });
        }

        /**
         * Merges two arrays and returns the result. The first array will be appended to the second array.
         *
         * @static
         * @param {Array} arrA An array.
         * @param {Array} arrB An array.
         * @returns {Array} The merged array.
         */

    }, {
        key: 'merge',
        value: function merge(arrA, arrB) {
            var arr = new Array(arrA.length + arrB.length);

            for (var i = 0; i < arrA.length; i++) {
                arr[i] = arrA[i];
            }

            for (var _i3 = 0; _i3 < arrB.length; _i3++) {
                arr[arrA.length + _i3] = arrB[_i3];
            }

            return arr;
        }

        /**
         * Checks whether or not an array contains all the elements of another array, without regard to the order.
         *
         * @static
         * @param {Array} arrA An array.
         * @param {Array} arrB An array.
         * @returns {Boolean} A boolean indicating whether or not both array contain the same elements.
         */

    }, {
        key: 'containsAll',
        value: function containsAll(arrA, arrB) {
            var containing = 0;
            for (var i = 0; i < arrA.length; i++) {
                for (var j = 0; j < arrB.length; j++) {
                    if (arrA[i] === arrB[j]) {
                        containing++;
                    }
                }
            }

            return containing === arrB.length;
        }

        /**
         * Sort an array of atomic number information. Where the number is indicated as x, x.y, x.y.z, ...
         *
         * @param {Object[]} arr An array of vertex ids with their associated atomic numbers.
         * @param {Number} arr[].vertexId A vertex id.
         * @param {Number} arr[].atomicNumber The atomic number associated with the vertex id.
         * @returns {Object[]} The array sorted by atomic number. Example of an array entry: { atomicNumber: 2, vertexId: 5 }.
         */

    }, {
        key: 'sortByAtomicNumberDesc',
        value: function sortByAtomicNumberDesc(arr) {
            var map = arr.map(function (e, i) {
                return { index: i, value: e.atomicNumber.split('.').map(Number) };
            });

            map.sort(function (a, b) {
                var min = Math.min(b.value.length, a.value.length);
                var i = 0;

                while (i < min && b.value[i] === a.value[i]) {
                    i++;
                }

                return i === min ? b.value.length - a.value.length : b.value[i] - a.value[i];
            });

            return map.map(function (e) {
                return arr[e.index];
            });
        }

        /**
         * Copies a an n-dimensional array.
         * 
         * @param {Array} arr The array to be copied.
         * @returns {Array} The copy.
         */

    }, {
        key: 'deepCopy',
        value: function deepCopy(arr) {
            var newArr = [];

            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];

                if (item instanceof Array) {
                    newArr[i] = SmilesDrawer.ArrayHelper.deepCopy(item);
                } else {
                    newArr[i] = item;
                }
            }

            return newArr;
        }
    }]);

    return ArrayHelper;
}();

/** 
 * A class representing an atom.
 * 
 * @property {String} element The element symbol of this atom. Single-letter symbols are always uppercase. Examples: H, C, F, Br, Si, ...
 * @property {Boolean} drawExplicit A boolean indicating whether or not this atom is drawn explicitly (for example, a carbon atom). This overrides the default behaviour.
 * @property {Object[]} ringbonds An array containing the ringbond ids and bond types as specified in the original SMILE.
 * @property {Number} ringbonds[].id The ringbond id as defined in the SMILES.
 * @property {String} ringbonds[].bondType The bond type of the ringbond as defined in the SMILES.
 * @property {Number[]} rings The ids of rings which contain this atom.
 * @property {String} bondType The bond type associated with this array. Examples: -, =, #, ...
 * @property {Boolean} isBridge A boolean indicating whether or not this atom is part of a bridge in a bridged ring (contained by the largest ring).
 * @property {Boolean} isBridgeNode A boolean indicating whether or not this atom is a bridge node (a member of the largest ring in a bridged ring which is connected to a bridge-atom).
 * @property {Number[]} originalRings Used to back up rings when they are replaced by a bridged ring.
 * @property {Number} bridgedRing The id of the bridged ring if the atom is part of a bridged ring.
 * @property {Number[]} anchoredRings The ids of the rings that are anchored to this atom. The centers of anchored rings are translated when this atom is translated.
 * @property {Object} bracket If this atom is defined as a bracket atom in the original SMILES, this object contains all the bracket information. Example: { hcount: {Number}, charge: ['--', '-', '+', '++'], isotope: {Number} }.
 * @property {Number} plane Specifies on which "plane" the atoms is in stereochemical deptictions (-1 back, 0 middle, 1 front).
 * @property {Object[]} attachedPseudoElements A map with containing information for pseudo elements or concatinated elements. The key is comprised of the element symbol and the hydrogen count.
 * @property {String} attachedPseudoElement[].element The element symbol.
 * @property {Number} attachedPseudoElement[].count The number of occurences that match the key.
 * @property {Number} attachedPseudoElement[].hyrogenCount The number of hydrogens attached to each atom matching the key.
 * @property {Boolean} hasAttachedPseudoElements A boolean indicating whether or not this attom will be drawn with an attached pseudo element or concatinated elements.
 * @property {Boolean} isDrawn A boolean indicating whether or not this atom is drawn. In contrast to drawExplicit, the bond is drawn neither.
 * @property {Boolean} isConnectedToRing A boolean indicating whether or not this atom is directly connected (but not a member of) a ring.
 * @property {String[]} neighbouringElements An array containing the element symbols of neighbouring atoms.
 * @property {Boolean} isPartOfAromaticRing A boolean indicating whether or not this atom is part of an explicitly defined aromatic ring. Example: c1ccccc1.
 * @property {Number} bondCount The number of bonds in which this atom is participating.
 */
SmilesDrawer.Atom = function () {
    /**
     * The constructor of the class Atom.
     *
     * @param {String} element The one-letter code of the element.
     * @param {String} [bondType='-'] The type of the bond associated with this atom.
     */
    function Atom(element) {
        var bondType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';

        _classCallCheck(this, Atom);

        this.element = element.length === 1 ? element.toUpperCase() : element;
        this.drawExplicit = false;
        this.ringbonds = [];
        this.rings = [];
        this.bondType = bondType;
        this.isBridge = false;
        this.isBridgeNode = false;
        this.originalRings = [];
        this.bridgedRing = null;
        this.anchoredRings = [];
        this.bracket = null;
        this.plane = 0;
        this.order = {};
        this.attachedPseudoElements = {};
        this.hasAttachedPseudoElements = false;
        this.isDrawn = true;
        this.isConnectedToRing = false;
        this.neighbouringElements = [];
        this.isPartOfAromaticRing = element !== this.element;
        this.bondCount = 0;
    }

    /**
     * Adds a neighbouring element to this atom.
     * 
     * @param {String} element A string representing an element.
     */


    _createClass(Atom, [{
        key: 'addNeighbouringElement',
        value: function addNeighbouringElement(element) {
            this.neighbouringElements.push(element);
        }

        /**
         * Attaches a pseudo element (e.g. Ac) to the atom.
         * @param {String} element The element identifier (e.g. Br, C, ...).
         * @param {String} previousElement The element that is part of the main chain (not the terminals that are converted to the pseudo element or concatinated).
         * @param {Number} [hydrogenCount=0] The number of hydrogens for the element.
         */

    }, {
        key: 'attachPseudoElement',
        value: function attachPseudoElement(element, previousElement) {
            var hydrogenCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            var key = hydrogenCount + element;

            if (this.attachedPseudoElements[key]) {
                this.attachedPseudoElements[key].count += 1;
            } else {
                this.attachedPseudoElements[key] = {
                    element: element,
                    count: 1,
                    hydrogenCount: hydrogenCount,
                    previousElement: previousElement
                };
            }

            this.hasAttachedPseudoElements = true;
        }

        /**
         * Returns the attached pseudo elements sorted by hydrogen count (ascending).
         *
         * @returns {Object} The sorted attached pseudo elements.
         */

    }, {
        key: 'getAttachedPseudoElements',
        value: function getAttachedPseudoElements() {
            var ordered = {};
            var that = this;

            Object.keys(this.attachedPseudoElements).sort().forEach(function (key) {
                ordered[key] = that.attachedPseudoElements[key];
            });

            return ordered;
        }

        /**
         * Returns the number of attached pseudo elements.
         *
         * @returns {Number} The number of attached pseudo elements.
         */

    }, {
        key: 'getAttachedPseudoElementsCount',
        value: function getAttachedPseudoElementsCount() {
            return Object.keys(this.attachedPseudoElements).length;
        }

        /**
         * Defines this atom as the anchor for a ring. When doing repositionings of the vertices and the vertex associated with this atom is moved, the center of this ring is moved as well.
         *
         * @param {Number} ringId A ring id.
         */

    }, {
        key: 'addAnchoredRing',
        value: function addAnchoredRing(ringId) {
            if (!SmilesDrawer.ArrayHelper.contains(this.anchoredRings, { value: ringId })) {
                this.anchoredRings.push(ringId);
            }
        }

        /**
         * Returns the number of ringbonds (breaks in rings to generate the MST of the smiles) within this atom is connected to.
         *
         * @returns {Number} The number of ringbonds this atom is connected to.
         */

    }, {
        key: 'getRingbondCount',
        value: function getRingbondCount() {
            return this.ringbonds.length;
        }

        /**
         * Backs up the current rings.
         */

    }, {
        key: 'backupRings',
        value: function backupRings() {
            this.originalRings = Array(this.rings.length);

            for (var i = 0; i < this.rings.length; i++) {
                this.originalRings[i] = this.rings[i];
            }
        }

        /**
         * Restores the most recent backed up rings.
         */

    }, {
        key: 'restoreRings',
        value: function restoreRings() {
            this.rings = Array(this.originalRings.length);

            for (var i = 0; i < this.originalRings.length; i++) {
                this.rings[i] = this.originalRings[i];
            }
        }

        /**
         * Checks whether or not two atoms share a common ringbond id. A ringbond is a break in a ring created when generating the spanning tree of a structure.
         *
         * @param {SmilesDrawer.Atom} atomA An atom.
         * @param {SmilesDrawer.Atom} atomB An atom.
         * @returns {Boolean} A boolean indicating whether or not two atoms share a common ringbond.
         */

    }, {
        key: 'haveCommonRingbond',
        value: function haveCommonRingbond(atomA, atomB) {
            for (var i = 0; i < atomA.ringbonds.length; i++) {
                for (var j = 0; j < atomB.ringbonds.length; j++) {
                    if (atomA.ringbonds[i].id == atomB.ringbonds[j].id) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Returns the order of this atom given a central atom.
         * 
         * @param {Number} center The id of the central atom in respect to which the order is defined.
         * @returns {Number} The order of this atom in respect to the center atom.
         */

    }, {
        key: 'getOrder',
        value: function getOrder(center) {
            return this.order[center];
        }

        /**
         * Sets the order of this atom given a center. This is required since two atoms can have an order in respect to two different centers when connected by ringbonds.
         *
         * @param {Number} center The id of the central atom in respect to which the order is defined.
         * @param {Number} order The order of this atom.
         */

    }, {
        key: 'setOrder',
        value: function setOrder(center, order) {
            this.order[center] = order;
        }

        /**
         * Check whether or not the neighbouring elements of this atom equal the supplied array.
         * 
         * @param {String[]} arr An array containing all the elements that are neighbouring this atom. E.g. ['C', 'O', 'O', 'N']
         * @returns {Boolean} A boolean indicating whether or not the neighbours match the supplied array of elements.
         */

    }, {
        key: 'neighbouringElementsEqual',
        value: function neighbouringElementsEqual(arr) {
            if (arr.length !== this.neighbouringElements.length) {
                return false;
            }

            arr.sort();
            this.neighbouringElements.sort();

            for (var i = 0; i < this.neighbouringElements.length; i++) {
                if (arr[i] !== this.neighbouringElements[i]) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Get the atomic number of this atom.
         * 
         * @returns {Number} The atomic number of this atom.
         */

    }, {
        key: 'getAtomicNumber',
        value: function getAtomicNumber() {
            return Atom.atomicNumbers[this.element];
        }

        /**
         * Sorts an array of vertices by their respecitve atomic number.
         *
         * @param {SmilesDrawer.Vertex} root The central vertex
         * @param {Number[]} neighbours An array of vertex ids.
         * @param {SmilesDrawer.Vertex[]} vertices An array containing the vertices associated with the current molecule.
         * @param {SmilesDrawer.Ring[]} rings An array containing the rings associated with the current molecule.
         * @returns {Object[]} The array sorted by atomic number. Example of an array entry: { atomicNumber: 2, vertexId: 5 }.
         */

    }], [{
        key: 'sortByAtomicNumber',
        value: function sortByAtomicNumber(neighbours, vertices) {
            var orderedVertices = new Array(neighbours.length);

            for (var i = 0; i < neighbours.length; i++) {
                var vertex = vertices[neighbours[i]];
                var val = Atom.atomicNumbers[vertex.value.element];

                orderedVertices[i] = {
                    atomicNumber: val.toString(),
                    vertexId: vertex.id
                };
            }

            return SmilesDrawer.ArrayHelper.sortByAtomicNumberDesc(orderedVertices);
        }

        /**
         * Checks wheter or not two atoms have the same atomic number
         *
         * @param {Object[]} sortedAtomicNumbers An array of vertex ids with their associated atomic numbers.
         * @param {Number} sortedAtomicNumbers[].vertexId A vertex id.
         * @param {Number} sortedAtomicNumbers[].atomicNumber The atomic number associated with the vertex id.
         * @returns {Boolean} A boolean indicating whether or not there are duplicate atomic numbers.
         */

    }, {
        key: 'hasDuplicateAtomicNumbers',
        value: function hasDuplicateAtomicNumbers(sortedAtomicNumbers) {
            var found = {};

            for (var i = 0; i < sortedAtomicNumbers.length; i++) {
                var v = sortedAtomicNumbers[i];

                if (found[v.atomicNumber] !== undefined) {
                    return true;
                }

                found[v.atomicNumber] = true;
            }

            return false;
        }

        /**
         * Returns sets of duplicate atomic numbers.
         *
         * @param {Object[]} sortedAtomicNumbers An array of vertex ids with their associated atomic numbers.
         * @param {Number} sortedAtomicNumbers[].vertexId A vertex id.
         * @param {Number} sortedAtomicNumbers[].atomicNumber The atomic number associated with the vertex id.
         * @returns {Array[]} An array of arrays containing the indices of duplicate atomic numbers.
         */

    }, {
        key: 'getDuplicateAtomicNumbers',
        value: function getDuplicateAtomicNumbers(sortedAtomicNumbers) {
            var duplicates = {};
            var dpl = [];

            for (var i = 0; i < sortedAtomicNumbers.length; i++) {
                var v = sortedAtomicNumbers[i];

                if (duplicates[v.atomicNumber] === undefined) {
                    duplicates[v.atomicNumber] = [];
                }

                duplicates[v.atomicNumber].push(i);
            }

            for (var key in duplicates) {
                var arr = duplicates[key];

                if (arr.length > 1) {
                    dpl.push(arr);
                }
            }

            return dpl;
        }
    }]);

    return Atom;
}();

/**
 * A map mapping element symbols to their maximum bonds.
 */
SmilesDrawer.Atom.maxBonds = {
    'C': 4,
    'N': 3,
    'O': 2,
    'P': 3,
    'S': 2,
    'B': 3,
    'F': 1,
    'I': 1,
    'Cl': 1,
    'Br': 1
};

/**
 * A map mapping element symbols to the atomic number.
 */
SmilesDrawer.Atom.atomicNumbers = {
    'H': 1,
    'He': 2,
    'Li': 3,
    'Be': 4,
    'B': 5,
    'b': 5,
    'C': 6,
    'c': 6,
    'N': 7,
    'n': 7,
    'O': 8,
    'o': 8,
    'F': 9,
    'Ne': 10,
    'Na': 11,
    'Mg': 12,
    'Al': 13,
    'Si': 14,
    'P': 15,
    'p': 15,
    'S': 16,
    's': 16,
    'Cl': 17,
    'Ar': 18,
    'K': 19,
    'Ca': 20,
    'Sc': 21,
    'Ti': 22,
    'V': 23,
    'Cr': 24,
    'Mn': 25,
    'Fe': 26,
    'Co': 27,
    'Ni': 28,
    'Cu': 29,
    'Zn': 30,
    'Ga': 31,
    'Ge': 32,
    'As': 33,
    'Se': 34,
    'Br': 35,
    'Kr': 36,
    'Rb': 37,
    'Sr': 38,
    'Y': 39,
    'Zr': 40,
    'Nb': 41,
    'Mo': 42,
    'Tc': 43,
    'Ru': 44,
    'Rh': 45,
    'Pd': 46,
    'Ag': 47,
    'Cd': 48,
    'In': 49,
    'Sn': 50,
    'Sb': 51,
    'Te': 52,
    'I': 53,
    'Xe': 54,
    'Cs': 55,
    'Ba': 56,
    'La': 57,
    'Ce': 58,
    'Pr': 59,
    'Nd': 60,
    'Pm': 61,
    'Sm': 62,
    'Eu': 63,
    'Gd': 64,
    'Tb': 65,
    'Dy': 66,
    'Ho': 67,
    'Er': 68,
    'Tm': 69,
    'Yb': 70,
    'Lu': 71,
    'Hf': 72,
    'Ta': 73,
    'W': 74,
    'Re': 75,
    'Os': 76,
    'Ir': 77,
    'Pt': 78,
    'Au': 79,
    'Hg': 80,
    'Tl': 81,
    'Pb': 82,
    'Bi': 83,
    'Po': 84,
    'At': 85,
    'Rn': 86,
    'Fr': 87,
    'Ra': 88,
    'Ac': 89,
    'Th': 90,
    'Pa': 91,
    'U': 92,
    'Np': 93,
    'Pu': 94,
    'Am': 95,
    'Cm': 96,
    'Bk': 97,
    'Cf': 98,
    'Es': 99,
    'Fm': 100,
    'Md': 101,
    'No': 102,
    'Lr': 103,
    'Rf': 104,
    'Db': 105,
    'Sg': 106,
    'Bh': 107,
    'Hs': 108,
    'Mt': 109,
    'Ds': 110,
    'Rg': 111,
    'Cn': 112,
    'Uut': 113,
    'Uuq': 114,
    'Uup': 115,
    'Uuh': 116,
    'Uus': 117,
    'Uuo': 118
};

SmilesDrawer.Atom.mass = {
    'H': 1,
    'He': 2,
    'Li': 3,
    'Be': 4,
    'B': 5,
    'b': 5,
    'C': 6,
    'c': 6,
    'N': 7,
    'n': 7,
    'O': 8,
    'o': 8,
    'F': 9,
    'Ne': 10,
    'Na': 11,
    'Mg': 12,
    'Al': 13,
    'Si': 14,
    'P': 15,
    'p': 15,
    'S': 16,
    's': 16,
    'Cl': 17,
    'Ar': 18,
    'K': 19,
    'Ca': 20,
    'Sc': 21,
    'Ti': 22,
    'V': 23,
    'Cr': 24,
    'Mn': 25,
    'Fe': 26,
    'Co': 27,
    'Ni': 28,
    'Cu': 29,
    'Zn': 30,
    'Ga': 31,
    'Ge': 32,
    'As': 33,
    'Se': 34,
    'Br': 35,
    'Kr': 36,
    'Rb': 37,
    'Sr': 38,
    'Y': 39,
    'Zr': 40,
    'Nb': 41,
    'Mo': 42,
    'Tc': 43,
    'Ru': 44,
    'Rh': 45,
    'Pd': 46,
    'Ag': 47,
    'Cd': 48,
    'In': 49,
    'Sn': 50,
    'Sb': 51,
    'Te': 52,
    'I': 53,
    'Xe': 54,
    'Cs': 55,
    'Ba': 56,
    'La': 57,
    'Ce': 58,
    'Pr': 59,
    'Nd': 60,
    'Pm': 61,
    'Sm': 62,
    'Eu': 63,
    'Gd': 64,
    'Tb': 65,
    'Dy': 66,
    'Ho': 67,
    'Er': 68,
    'Tm': 69,
    'Yb': 70,
    'Lu': 71,
    'Hf': 72,
    'Ta': 73,
    'W': 74,
    'Re': 75,
    'Os': 76,
    'Ir': 77,
    'Pt': 78,
    'Au': 79,
    'Hg': 80,
    'Tl': 81,
    'Pb': 82,
    'Bi': 83,
    'Po': 84,
    'At': 85,
    'Rn': 86,
    'Fr': 87,
    'Ra': 88,
    'Ac': 89,
    'Th': 90,
    'Pa': 91,
    'U': 92,
    'Np': 93,
    'Pu': 94,
    'Am': 95,
    'Cm': 96,
    'Bk': 97,
    'Cf': 98,
    'Es': 99,
    'Fm': 100,
    'Md': 101,
    'No': 102,
    'Lr': 103,
    'Rf': 104,
    'Db': 105,
    'Sg': 106,
    'Bh': 107,
    'Hs': 108,
    'Mt': 109,
    'Ds': 110,
    'Rg': 111,
    'Cn': 112,
    'Uut': 113,
    'Uuq': 114,
    'Uup': 115,
    'Uuh': 116,
    'Uus': 117,
    'Uuo': 118
    /** 
     * A class wrapping a canvas element.
     * 
     * @property {HTMLElement} canvas The HTML element for the canvas associated with this CanvasWrapper instance.
     * @property {CanvasRenderingContext2D} ctx The CanvasRenderingContext2D of the canvas associated with this CanvasWrapper instance.
     * @property {Object} colors The colors object as defined in the SmilesDrawer options.
     * @property {Object} opts The SmilesDrawer options.
     * @property {Number} drawingWidth The width of the canvas.
     * @property {Number} drawingHeight The height of the canvas.
     * @property {Number} offsetX The horizontal offset required for centering the drawing.
     * @property {Number} offsetY The vertical offset required for centering the drawing.
     * @property {Number} fontLarge The large font size in pt.
     * @property {Number} fontSmall The small font size in pt.
     */
};SmilesDrawer.CanvasWrapper = function () {
    /**
     * The constructor for the class CanvasWrapper.
     *
     * @param {String|HTMLElement} target The canvas id or the canvas HTMLElement.
     * @param {Object} theme A theme from the smiles drawer options.
     * @param {Object} options The smiles drawer options object.
     */
    function CanvasWrapper(target, theme, options) {
        _classCallCheck(this, CanvasWrapper);

        if (typeof target === 'string' || target instanceof String) {
            this.canvas = document.getElementById(target);
        } else {
            this.canvas = target;
        }

        this.ctx = this.canvas.getContext('2d');
        this.colors = theme;
        this.opts = options;
        this.drawingWidth = 0.0;
        this.drawingHeight = 0.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;

        this.fontLarge = this.opts.fontSizeLarge + 'pt Helvetica, Arial, sans-serif';
        this.fontSmall = this.opts.fontSizeSmall + 'pt Helvetica, Arial, sans-serif';

        this.updateSize(this.opts.width, this.opts.height);

        this.ctx.font = this.fontLarge;
        this.hydrogenWidth = this.ctx.measureText('H').width;
        this.halfHydrogenWidth = this.hydrogenWidth / 2.0;

        // TODO: Find out why clear was here.
        // this.clear();
    }

    /**
     * Update the width and height of the canvas
     * 
     * @param {Number} width 
     * @param {Number} height 
     */


    _createClass(CanvasWrapper, [{
        key: 'updateSize',
        value: function updateSize(width, height) {
            this.devicePixelRatio = window.devicePixelRatio || 1;
            this.backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
            this.ratio = this.devicePixelRatio / this.backingStoreRatio;

            if (this.ratio !== 1) {
                this.canvas.width = width * this.ratio;
                this.canvas.height = height * this.ratio;
                this.canvas.style.width = width + 'px';
                this.canvas.style.height = height + 'px';
                this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
            } else {
                this.canvas.width = width * this.ratio;
                this.canvas.height = height * this.ratio;
            }
        }

        /**
         * Sets a provided theme.
         *
         * @param {Object} theme A theme from the smiles drawer options.
         */

    }, {
        key: 'setTheme',
        value: function setTheme(theme) {
            this.colors = theme;
        }

        /**
         * Scale the canvas based on vertex positions.
         *
         * @param {SmilesDrawer.Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
         */

    }, {
        key: 'scale',
        value: function scale(vertices) {
            // Figure out the final size of the image
            var maxX = -Number.MAX_VALUE;
            var maxY = -Number.MAX_VALUE;
            var minX = Number.MAX_VALUE;
            var minY = Number.MAX_VALUE;

            for (var i = 0; i < vertices.length; i++) {
                var p = vertices[i].position;

                if (maxX < p.x) maxX = p.x;
                if (maxY < p.y) maxY = p.y;
                if (minX > p.x) minX = p.x;
                if (minY > p.y) minY = p.y;
            }

            // Add padding
            var padding = 20.0;
            maxX += padding;
            maxY += padding;
            minX -= padding;
            minY -= padding;

            this.drawingWidth = maxX - minX;
            this.drawingHeight = maxY - minY;

            var scaleX = this.canvas.offsetWidth / this.drawingWidth;
            var scaleY = this.canvas.offsetHeight / this.drawingHeight;

            var scale = scaleX < scaleY ? scaleX : scaleY;

            this.ctx.scale(scale, scale);

            this.offsetX = -minX;
            this.offsetY = -minY;

            // Center
            if (scaleX < scaleY) {
                this.offsetY += this.canvas.offsetHeight / (2.0 * scale) - this.drawingHeight / 2.0;
            } else {
                this.offsetX += this.canvas.offsetWidth / (2.0 * scale) - this.drawingWidth / 2.0;
            }
        }

        /**
         * Resets the transform of the canvas.
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        /**
         * Returns the hex code of a color associated with a key from the current theme.
         *
         * @param {String} key The color key in the theme (e.g. C, N, BACKGROUND, ...).
         * @returns {String} A color hex value.
         */

    }, {
        key: 'getColor',
        value: function getColor(key) {
            key = key.toUpperCase();

            if (key in this.colors) {
                return this.colors[key];
            }

            return this.colors['C'];
        }

        /**
         * Draws a circle to a canvas context.
         * @param {Number} x The x coordinate of the circles center.
         * @param {Number} y The y coordinate of the circles center.
         * @param {Number} radius The radius of the circle
         * @param {String} color A hex encoded color.
         * @param {Boolean} [fill=true] Whether to fill or stroke the circle.
         * @param {Boolean} [debug=false] Draw in debug mode.
         * @param {String} [debugText=''] A debug message.
         */

    }, {
        key: 'drawCircle',
        value: function drawCircle(x, y, radius, color) {
            var fill = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
            var debug = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
            var debugText = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';

            var ctx = this.ctx;
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

            ctx.save();
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, radius, 0, SmilesDrawer.MathHelper.twoPI, true);
            ctx.closePath();

            if (debug) {
                if (fill) {
                    ctx.fillStyle = '#f00';
                    ctx.fill();
                } else {
                    ctx.strokeStyle = '#f00';
                    ctx.stroke();
                }

                this.drawDebugText(x, y, debugText);
            } else {
                if (fill) {
                    ctx.fillStyle = color;
                    ctx.fill();
                } else {
                    ctx.strokeStyle = color;
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        /**
         * Draw a line to a canvas.
         *
         * @param {SmilesDrawer.Line} line A line.
         * @param {Boolean} [dashed=false] Whether or not the line is dashed.
         * @param {Number} [alpha=1.0] The alpha value of the color.
         */

    }, {
        key: 'drawLine',
        value: function drawLine(line) {
            var dashed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;

            var ctx = this.ctx;
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

            // Add a shadow behind the line
            var shortLine = line.clone().shorten(4.0);

            var l = shortLine.getLeftVector().clone();
            var r = shortLine.getRightVector().clone();

            l.x += offsetX;
            l.y += offsetY;

            r.x += offsetX;
            r.y += offsetY;

            // Draw the "shadow"
            if (!dashed) {
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.moveTo(l.x, l.y);
                ctx.lineTo(r.x, r.y);
                ctx.lineCap = 'round';
                ctx.lineWidth = this.opts.bondThickness * 2.5;
                ctx.strokeStyle = this.getColor('BACKGROUND');
                ctx.stroke();
                ctx.globalCompositeOperation = 'source-over';
                ctx.restore();
            }

            l = line.getLeftVector().clone();
            r = line.getRightVector().clone();

            l.x += offsetX;
            l.y += offsetY;

            r.x += offsetX;
            r.y += offsetY;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(r.x, r.y);
            ctx.lineCap = 'round';
            ctx.lineWidth = this.opts.bondThickness;

            var gradient = this.ctx.createLinearGradient(l.x, l.y, r.x, r.y);
            gradient.addColorStop(0.4, this.getColor(line.getLeftElement()) || this.getColor('C'));
            gradient.addColorStop(0.6, this.getColor(line.getRightElement()) || this.getColor('C'));

            if (dashed) {
                ctx.setLineDash([1, 1]);
                ctx.lineWidth = this.opts.bondThickness;
            }

            if (alpha < 1.0) {
                ctx.globalAlpha = alpha;
            }

            ctx.strokeStyle = gradient;

            ctx.stroke();
            ctx.restore();
        }

        /**
         * Draw a wedge on the canvas.
         *
         * @param {SmilesDrawer.Line} line A line.
         * @param {Number} width The wedge width.
         */

    }, {
        key: 'drawWedge',
        value: function drawWedge(line) {
            var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3.0;

            if (isNaN(line.from.x) || isNaN(line.from.y) || isNaN(line.to.x) || isNaN(line.to.y)) {
                return;
            }

            var ctx = this.ctx;
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

            // Add a shadow behind the line
            var shortLine = line.clone().shorten(5.0);

            var l = shortLine.getLeftVector().clone();
            var r = shortLine.getRightVector().clone();

            l.x += offsetX;
            l.y += offsetY;

            r.x += offsetX;
            r.y += offsetY;

            l = line.getLeftVector().clone();
            r = line.getRightVector().clone();

            l.x += offsetX;
            l.y += offsetY;

            r.x += offsetX;
            r.y += offsetY;

            ctx.save();

            var normals = SmilesDrawer.Vector2.normals(l, r);

            normals[0].normalize();
            normals[1].normalize();

            var isRightChiralCenter = line.getRightChiral();

            var start = l;
            var end = r;

            if (isRightChiralCenter) {
                start = r;
                end = l;
            }

            var t = SmilesDrawer.Vector2.add(start, SmilesDrawer.Vector2.multiplyScalar(normals[0], 0.75));
            var u = SmilesDrawer.Vector2.add(end, SmilesDrawer.Vector2.multiplyScalar(normals[0], width));
            var v = SmilesDrawer.Vector2.add(end, SmilesDrawer.Vector2.multiplyScalar(normals[1], width));
            var w = SmilesDrawer.Vector2.add(start, SmilesDrawer.Vector2.multiplyScalar(normals[1], 0.75));

            ctx.beginPath();
            ctx.moveTo(t.x, t.y);
            ctx.lineTo(u.x, u.y);
            ctx.lineTo(v.x, v.y);
            ctx.lineTo(w.x, w.y);

            var gradient = this.ctx.createRadialGradient(r.x, r.y, this.opts.bondLength, r.x, r.y, 0);
            gradient.addColorStop(0.4, this.getColor(line.getLeftElement()) || this.getColor('C'));
            gradient.addColorStop(0.6, this.getColor(line.getRightElement()) || this.getColor('C'));

            ctx.fillStyle = gradient;

            ctx.fill();
            ctx.restore();
        }

        /**
         * Draw a dashed wedge on the canvas.
         *
         * @param {SmilesDrawer.Line} line A line.
         * @param {Number} width The wedge width.
         */

    }, {
        key: 'drawDashedWedge',
        value: function drawDashedWedge(line) {
            var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6.0;

            if (isNaN(line.from.x) || isNaN(line.from.y) || isNaN(line.to.x) || isNaN(line.to.y)) {
                return;
            }

            var ctx = this.ctx;
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

            var l = line.getLeftVector().clone();
            var r = line.getRightVector().clone();

            l.x += offsetX;
            l.y += offsetY;

            r.x += offsetX;
            r.y += offsetY;

            ctx.save();

            var normals = SmilesDrawer.Vector2.normals(l, r);

            normals[0].normalize();
            normals[1].normalize();

            var isRightChiralCenter = line.getRightChiral();

            var start = void 0;
            var end = void 0;
            var sStart = void 0;
            var sEnd = void 0;

            var shortLine = line.clone();

            if (isRightChiralCenter) {
                start = r;
                end = l;

                shortLine.shortenRight(3.0);

                sStart = shortLine.getRightVector().clone();
                sEnd = shortLine.getLeftVector().clone();
            } else {
                start = l;
                end = r;

                shortLine.shortenLeft(3.0);

                sStart = shortLine.getLeftVector().clone();
                sEnd = shortLine.getRightVector().clone();
            }

            sStart.x += offsetX;
            sStart.y += offsetY;
            sEnd.x += offsetX;
            sEnd.y += offsetY;

            var t = SmilesDrawer.Vector2.add(start, SmilesDrawer.Vector2.multiplyScalar(normals[0], 0.75));
            var u = SmilesDrawer.Vector2.add(end, SmilesDrawer.Vector2.multiplyScalar(normals[0], width / 2.0));
            var v = SmilesDrawer.Vector2.add(end, SmilesDrawer.Vector2.multiplyScalar(normals[1], width / 2.0));
            var w = SmilesDrawer.Vector2.add(start, SmilesDrawer.Vector2.multiplyScalar(normals[1], 0.75));

            ctx.beginPath();
            ctx.moveTo(t.x, t.y);
            ctx.lineTo(u.x, u.y);
            ctx.lineTo(v.x, v.y);
            ctx.lineTo(w.x, w.y);

            var gradient = this.ctx.createRadialGradient(r.x, r.y, this.bondLength, r.x, r.y, 0);
            gradient.addColorStop(0.4, this.getColor(line.getLeftElement()) || this.getColor('C'));
            gradient.addColorStop(0.6, this.getColor(line.getRightElement()) || this.getColor('C'));

            ctx.fillStyle = gradient;

            ctx.fill();

            // Now dash it
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.moveTo(sStart.x, sStart.y);
            ctx.lineTo(sEnd.x, sEnd.y);
            ctx.lineCap = 'butt';
            ctx.lineWidth = width;
            ctx.setLineDash([1, 1]);
            ctx.strokeStyle = this.getColor('BACKGROUND');
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        /**
         * Draws a debug text message at a given position
         *
         * @param {Number} x The x coordinate.
         * @param {Number} y The y coordinate.
         * @param {String} text The debug text.
         */

    }, {
        key: 'drawDebugText',
        value: function drawDebugText(x, y, text) {
            var ctx = this.ctx;

            ctx.save();
            ctx.font = '5px Droid Sans, sans-serif';
            ctx.textAlign = 'start';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#ff0000';
            ctx.fillText(text, x + this.offsetX, y + this.offsetY);
            ctx.restore();
        }

        /**
         * Draw a ball to the canvas.
         *
         * @param {Number} x The x position of the text.
         * @param {Number} y The y position of the text.
         * @param {String} elementName The name of the element (single-letter).
         */

    }, {
        key: 'drawBall',
        value: function drawBall(x, y, elementName) {
            var ctx = this.ctx;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + this.offsetX, y + this.offsetY, this.opts.bondLength / 4.5, 0, SmilesDrawer.MathHelper.twoPI, false);
            ctx.fillStyle = this.getColor(elementName);
            ctx.fill();
            ctx.restore();
        }

        /**
         * Draw a point to the canvas.
         *
         * @param {Number} x The x position of the point.
         * @param {Number} y The y position of the point.
         * @param {String} elementName The name of the element (single-letter).
         */

    }, {
        key: 'drawPoint',
        value: function drawPoint(x, y, elementName) {
            var ctx = this.ctx;
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, 1.5, 0, SmilesDrawer.MathHelper.twoPI, true);
            ctx.closePath();
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            ctx.beginPath();
            ctx.arc(x + this.offsetX, y + this.offsetY, 0.75, 0, SmilesDrawer.MathHelper.twoPI, false);
            ctx.fillStyle = this.getColor(elementName);
            ctx.fill();
            ctx.restore();
        }

        /**
         * Draw a text to the canvas.
         *
         * @param {Number} x The x position of the text.
         * @param {Number} y The y position of the text.
         * @param {String} elementName The name of the element (single-letter).
         * @param {Number} hydrogens The number of hydrogen atoms.
         * @param {String} direction The direction of the text in relation to the associated vertex.
         * @param {Boolean} isTerminal A boolean indicating whether or not the vertex is terminal.
         * @param {String} charge The charge of the atom.
         * @param {Number} isotope The isotope number.
         * @param {Object[]} attachedPseudoElements A map with containing information for pseudo elements or concatinated elements. The key is comprised of the element symbol and the hydrogen count.
         * @param {String} attachedPseudoElement[].element The element symbol.
         * @param {Number} attachedPseudoElement[].count The number of occurences that match the key.
         * @param {Number} attachedPseudoElement[].hyrogenCount The number of hydrogens attached to each atom matching the key.
         */

    }, {
        key: 'drawText',
        value: function drawText(x, y, elementName, hydrogens, direction, isTerminal, charge, isotope) {
            var attachedPseudoElement = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

            var ctx = this.ctx;
            var offsetX = this.offsetX;
            var offsetY = this.offsetY;

            ctx.save();

            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';

            var pseudoElementHandled = false;

            // Charge
            var chargeText = '+';
            var chargeWidth = 0;

            if (charge) {
                if (charge === 2) {
                    chargeText = '2+';
                } else if (charge === -1) {
                    chargeText = '-';
                } else if (charge === -2) {
                    chargeText = '2-';
                }

                ctx.font = this.fontSmall;
                chargeWidth = ctx.measureText(chargeText).width;
            }

            var isotopeText = '0';
            var isotopeWidth = 0;

            if (isotope > 0) {
                isotopeText = isotope;
                ctx.font = this.fontSmall;
                isotopeWidth = ctx.measureText(isotopeText).width;
            }

            ctx.font = this.fontLarge;
            ctx.fillStyle = this.getColor('BACKGROUND');

            var dim = ctx.measureText(elementName);

            dim.totalWidth = dim.width + chargeWidth;
            dim.height = parseInt(this.fontLarge, 10);

            var r = dim.width > this.opts.fontSizeLarge ? dim.width : this.opts.fontSizeLarge;
            r /= 1.25;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x + offsetX, y + offsetY, r, 0, SmilesDrawer.MathHelper.twoPI, true);
            ctx.closePath();
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            var cursorPos = -dim.width / 2.0;
            var cursorPosLeft = -dim.width / 2.0;

            ctx.fillStyle = this.getColor(elementName);
            ctx.fillText(elementName, x + offsetX + cursorPos, y + this.opts.halfFontSizeLarge + offsetY);
            cursorPos += dim.width;

            if (charge) {
                ctx.font = this.fontSmall;
                ctx.fillText(chargeText, x + offsetX + cursorPos, y - this.opts.fifthFontSizeSmall + offsetY);
                cursorPos += chargeWidth;
            }

            if (isotope > 0) {
                ctx.font = this.fontSmall;
                ctx.fillText(isotopeText, x + offsetX + cursorPosLeft - isotopeWidth, y - this.opts.fifthFontSizeSmall + offsetY);
                cursorPosLeft -= isotopeWidth;
            }

            ctx.font = this.fontLarge;

            var hydrogenWidth = 0;
            var hydrogenCountWidth = 0;

            if (hydrogens === 1) {
                var hx = x + offsetX;
                var hy = y + offsetY + this.opts.halfFontSizeLarge;

                hydrogenWidth = this.hydrogenWidth;
                cursorPosLeft -= hydrogenWidth;

                if (direction === 'left') {
                    hx += cursorPosLeft;
                } else if (direction === 'right') {
                    hx += cursorPos;
                } else if (direction === 'up' && isTerminal) {
                    hx += cursorPos;
                } else if (direction === 'down' && isTerminal) {
                    hx += cursorPos;
                } else if (direction === 'up' && !isTerminal) {
                    hy -= this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                    hx -= this.halfHydrogenWidth;
                } else if (direction === 'down' && !isTerminal) {
                    hy += this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                    hx -= this.halfHydrogenWidth;
                }

                ctx.fillText('H', hx, hy);

                cursorPos += hydrogenWidth;
            } else if (hydrogens > 1) {
                var _hx = x + offsetX;
                var _hy = y + offsetY + this.opts.halfFontSizeLarge;

                hydrogenWidth = this.hydrogenWidth;
                ctx.font = this.fontSmall;
                hydrogenCountWidth = ctx.measureText(hydrogens).width;
                cursorPosLeft -= hydrogenWidth + hydrogenCountWidth;

                if (direction === 'left') {
                    _hx += cursorPosLeft;
                } else if (direction === 'right') {
                    _hx += cursorPos;
                } else if (direction === 'up' && isTerminal) {
                    _hx += cursorPos;
                } else if (direction === 'down' && isTerminal) {
                    _hx += cursorPos;
                } else if (direction === 'up' && !isTerminal) {
                    _hy -= this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                    _hx -= this.halfHydrogenWidth;
                } else if (direction === 'down' && !isTerminal) {
                    _hy += this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                    _hx -= this.halfHydrogenWidth;
                }

                ctx.font = this.fontLarge;
                ctx.fillText('H', _hx, _hy);

                ctx.font = this.fontSmall;
                ctx.fillText(hydrogens, _hx + this.halfHydrogenWidth + hydrogenCountWidth, _hy + this.opts.fifthFontSizeSmall);

                cursorPos += hydrogenWidth + this.halfHydrogenWidth + hydrogenCountWidth;
            }

            if (pseudoElementHandled) {
                ctx.restore();
                return;
            }

            for (var key in attachedPseudoElement) {
                if (!attachedPseudoElement.hasOwnProperty(key)) {
                    continue;
                }

                var openParenthesisWidth = 0;
                var closeParenthesisWidth = 0;

                var _element = attachedPseudoElement[key].element;
                var elementCount = attachedPseudoElement[key].count;
                var hydrogenCount = attachedPseudoElement[key].hydrogenCount;

                ctx.font = this.fontLarge;

                if (elementCount > 1 && hydrogenCount > 0) {
                    openParenthesisWidth = ctx.measureText('(').width;
                    closeParenthesisWidth = ctx.measureText(')').width;
                }

                var elementWidth = ctx.measureText(_element).width;
                var elementCountWidth = 0;

                hydrogenWidth = 0;

                if (hydrogenCount > 0) {
                    hydrogenWidth = this.hydrogenWidth;
                }

                ctx.font = this.fontSmall;

                if (elementCount > 1) {
                    elementCountWidth = ctx.measureText(elementCount).width;
                }

                hydrogenCountWidth = 0;

                if (hydrogenCount > 1) {
                    hydrogenCountWidth = ctx.measureText(hydrogenCount).width;
                }

                ctx.font = this.fontLarge;

                var _hx2 = x + offsetX;
                var _hy2 = y + offsetY + this.opts.halfFontSizeLarge;

                ctx.fillStyle = this.getColor(_element);

                if (elementCount > 0) {
                    cursorPosLeft -= elementCountWidth;
                }

                if (elementCount > 1 && hydrogenCount > 0) {
                    if (direction === 'left') {
                        cursorPosLeft -= closeParenthesisWidth;
                        ctx.fillText(')', _hx2 + cursorPosLeft, _hy2);
                    } else {
                        ctx.fillText('(', _hx2 + cursorPos, _hy2);
                        cursorPos += openParenthesisWidth;
                    }
                }

                if (direction === 'left') {
                    cursorPosLeft -= elementWidth;
                    ctx.fillText(_element, _hx2 + cursorPosLeft, _hy2);
                } else {
                    ctx.fillText(_element, _hx2 + cursorPos, _hy2);
                    cursorPos += elementWidth;
                }

                if (hydrogenCount > 0) {
                    if (direction === 'left') {
                        cursorPosLeft -= hydrogenWidth + hydrogenCountWidth;
                        ctx.fillText('H', _hx2 + cursorPosLeft, _hy2);

                        if (hydrogenCount > 1) {
                            ctx.font = this.fontSmall;
                            ctx.fillText(hydrogenCount, _hx2 + cursorPosLeft + hydrogenWidth, _hy2 + this.opts.fifthFontSizeSmall);
                        }
                    } else {
                        ctx.fillText('H', _hx2 + cursorPos, _hy2);
                        cursorPos += hydrogenWidth;

                        if (hydrogenCount > 1) {
                            ctx.font = this.fontSmall;
                            ctx.fillText(hydrogenCount, _hx2 + cursorPos, _hy2 + this.opts.fifthFontSizeSmall);
                            cursorPos += hydrogenCountWidth;
                        }
                    }
                }

                ctx.font = this.fontLarge;

                if (elementCount > 1 && hydrogenCount > 0) {
                    if (direction === 'left') {
                        cursorPosLeft -= openParenthesisWidth;
                        ctx.fillText('(', _hx2 + cursorPosLeft, _hy2);
                    } else {
                        ctx.fillText(')', _hx2 + cursorPos, _hy2);
                        cursorPos += closeParenthesisWidth;
                    }
                }

                ctx.font = this.fontSmall;

                if (elementCount > 1) {
                    if (direction === 'left') {
                        ctx.fillText(elementCount, _hx2 + cursorPosLeft + openParenthesisWidth + closeParenthesisWidth + hydrogenWidth + hydrogenCountWidth + elementWidth, _hy2 + this.opts.fifthFontSizeSmall);
                    } else {
                        ctx.fillText(elementCount, _hx2 + cursorPos, _hy2 + this.opts.fifthFontSizeSmall);
                        cursorPos += elementCountWidth;
                    }
                }
            }

            ctx.restore();
        }

        /**
         * Draws a dubug dot at a given coordinate and adds text.
         *
         * @param {Number} x The x coordinate.
         * @param {Number} y The y coordindate.
         * @param {String} [debugText=''] A string.
         * @param {String} [color='#f00'] A color in hex form.
         */

    }, {
        key: 'drawDebugPoint',
        value: function drawDebugPoint(x, y) {
            var debugText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
            var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#f00';

            this.drawCircle(x, y, 2, color, true, true, debugText);
        }

        /**
         * Draws a ring inside a provided ring, indicating aromaticity.
         *
         * @param {SmilesDrawer.Ring} ring A ring.
         */

    }, {
        key: 'drawAromaticityRing',
        value: function drawAromaticityRing(ring) {
            var ctx = this.ctx;
            var radius = SmilesDrawer.MathHelper.apothemFromSideLength(this.opts.bondLength, ring.getSize());

            ctx.save();
            ctx.strokeStyle = this.getColor('C');
            ctx.lineWidth = this.opts.bondThickness;
            ctx.beginPath();
            ctx.arc(ring.center.x + this.offsetX, ring.center.y + this.offsetY, radius - this.opts.bondSpacing, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        /**
         * Clear the canvas.
         *
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
        }
    }]);

    return CanvasWrapper;
}();
/** 
 * The main class of the application representing the smiles drawer 
 * 
 * @property {SmilesDrawer.Graph} graph The graph associated with this SmilesDrawer.Drawer instance.
 * @property {Number} ringIdCounter An internal counter to keep track of ring ids.
 * @property {Number} ringConnectionIdCounter An internal counter to keep track of ring connection ids.
 * @property {SmilesDrawer.CanvasWrapper} canvasWrapper The SmilesDrawer.CanvasWrapper associated with this SmilesDrawer.Drawer instance.
 * @property {Number} totalOverlapScore The current internal total overlap score.
 * @property {Object} defaultOptions The default options.
 * @property {Object} opts The merged options.
 * @property {Object} theme The current theme.
 */
SmilesDrawer.Drawer = function () {
    /**
     * The constructor for the class SmilesDrawer.
     *
     * @param {Object} options An object containing custom values for different options. It is merged with the default options.
     */
    function Drawer(options) {
        _classCallCheck(this, Drawer);

        this.graph = null;
        this.ringIdCounter = 0;
        this.ringConnectionIdCounter = 0;
        this.canvasWrapper = null;
        this.totalOverlapScore = 0;

        this.defaultOptions = {
            width: 500,
            height: 500,
            bondThickness: 0.6, // TODO: Add to doc
            bondLength: 14.4,
            shortBondLength: 0.85 * 14.4,
            bondSpacing: 0.18 * 14.4,
            atomVisualization: 'default',
            isomeric: false,
            debug: false,
            terminalCarbons: false,
            explicitHydrogens: false, // TODO: Add to doc
            compactDrawing: true,
            fontSizeLarge: 6,
            fontSizeSmall: 4,
            themes: {
                dark: {
                    C: '#fff',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#fff',
                    BACKGROUND: '#141414'
                },
                light: {
                    C: '#222',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#222',
                    BACKGROUND: '#fff'
                }
            }
        };

        this.opts = this.extend(true, this.defaultOptions, options);
        this.opts.halfBondSpacing = this.opts.bondSpacing / 2.0;
        this.opts.bondLengthSq = this.opts.bondLength * this.opts.bondLength;
        this.opts.halfFontSizeLarge = this.opts.fontSizeLarge / 2.0;
        this.opts.quarterFontSizeLarge = this.opts.fontSizeLarge / 4.0;
        this.opts.fifthFontSizeSmall = this.opts.fontSizeSmall / 5.0;

        // Set the default theme.
        this.theme = this.opts.themes.dark;
    }

    /**
     * A helper method to extend the default options with user supplied ones.
     */


    _createClass(Drawer, [{
        key: 'extend',
        value: function extend() {
            var that = this;
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
                deep = arguments[0];
                i++;
            }

            var merge = function merge(obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                            extended[prop] = that.extend(true, extended[prop], obj[prop]);
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            for (; i < length; i++) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;
        }
    }, {
        key: 'draw',


        /**
         * Draws the parsed smiles data to a canvas element.
         *
         * @param {Object} data The tree returned by the smiles parser.
         * @param {String|HTMLElement} target The id of the HTML canvas element the structure is drawn to - or the element itself.
         * @param {String} themeName='dark' The name of the theme to use. Built-in themes are 'light' and 'dark'.
         * @param {Boolean} infoOnly=false Only output info on the molecule without drawing anything to the canvas.
         */
        value: function draw(data, target) {
            var themeName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'light';
            var infoOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            this.data = data;
            this.canvasWrapper = new SmilesDrawer.CanvasWrapper(target, this.opts.themes[themeName], this.opts);
            this.infoOnly = infoOnly;

            this.ringIdCounter = 0;
            this.ringConnectionIdCounter = 0;

            this.graph = new SmilesDrawer.Graph(data, this.opts.isomeric);
            this.rings = [];
            this.ringConnections = [];

            this.originalRings = [];
            this.originalRingConnections = [];

            this.bridgedRing = false;

            this.initRings();
            this.annotateStereochemistry();

            if (!this.explicitHydrogens) {
                for (var i = 0; i < this.graph.vertices.length; i++) {
                    if (this.graph.vertices[i].value.element === 'H') {
                        this.graph.vertices[i].value.isDrawn = false;
                    }
                }
            }

            if (this.opts.isomeric) {
                this.annotateStereochemistry();
            }

            if (!this.infoOnly) {
                this.position();

                // Restore the ring information (removes bridged rings and replaces them with the original, multiple, rings)
                this.restoreRingInformation();

                // Atoms bonded to the same ring atom
                this.resolvePrimaryOverlaps();

                var overlapScore = this.getOverlapScore();

                this.totalOverlapScore = this.getOverlapScore().total;

                for (var i = 0; i < this.graph.edges.length; i++) {
                    var edge = this.graph.edges[i];

                    if (this.isEdgeRotatable(edge)) {
                        var subTreeDepthA = this.getTreeDepth(edge.sourceId, edge.targetId);
                        var subTreeDepthB = this.getTreeDepth(edge.targetId, edge.sourceId);

                        // Only rotate the shorter subtree
                        var a = edge.targetId;
                        var b = edge.sourceId;

                        if (subTreeDepthA > subTreeDepthB) {
                            a = edge.sourceId;
                            b = edge.targetId;
                        }

                        var subTreeOverlap = this.getSubtreeOverlapScore(b, a, overlapScore.vertexScores);

                        if (subTreeOverlap.value > 1.0) {
                            var vertexA = this.graph.vertices[a];
                            var vertexB = this.graph.vertices[b];
                            var neighbours = vertexB.getNeighbours(a);

                            if (neighbours.length === 1) {
                                var neighbour = this.graph.vertices[neighbours[0]];
                                var angle = neighbour.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, SmilesDrawer.MathHelper.toRad(120));

                                this.rotateSubtree(neighbour.id, vertexB.id, angle, vertexB.position);

                                // If the new overlap is bigger, undo change
                                var newTotalOverlapScore = this.getOverlapScore().total;

                                if (newTotalOverlapScore > this.totalOverlapScore) {
                                    this.rotateSubtree(neighbour.id, vertexB.id, -angle, vertexB.position);
                                } else {
                                    this.totalOverlapScore = newTotalOverlapScore;
                                }
                            } else if (neighbours.length == 2) {
                                // Switch places / sides
                                // If vertex a is in a ring, do nothing
                                if (vertexB.value.rings.length + vertexA.value.rings.length > 0) {
                                    continue;
                                }

                                var neighbourA = this.graph.vertices[neighbours[0]];
                                var neighbourB = this.graph.vertices[neighbours[1]];

                                var angleA = neighbourA.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, SmilesDrawer.MathHelper.toRad(120));
                                var angleB = neighbourB.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, SmilesDrawer.MathHelper.toRad(120));

                                this.rotateSubtree(neighbourA.id, vertexB.id, angleA, vertexB.position);
                                this.rotateSubtree(neighbourB.id, vertexB.id, angleB, vertexB.position);

                                var _newTotalOverlapScore = this.getOverlapScore().total;

                                if (_newTotalOverlapScore > this.totalOverlapScore) {
                                    this.rotateSubtree(neighbourA.id, vertexB.id, -angleA, vertexB.position);
                                    this.rotateSubtree(neighbourB.id, vertexB.id, -angleB, vertexB.position);
                                } else {
                                    this.totalOverlapScore = _newTotalOverlapScore;
                                }
                            }

                            overlapScore = this.getOverlapScore();
                        }
                    }
                }

                this.resolveSecondaryOverlaps(overlapScore.scores);

                // Set the canvas to the appropriate size
                this.canvasWrapper.scale(this.graph.vertices);

                // Initialize pseudo elements or shortcuts
                if (this.opts.compactDrawing && this.opts.atomVisualization === 'default') {
                    this.initPseudoElements();
                }

                // Do the actual drawing
                this.drawEdges(this.opts.debug);
                this.drawVertices(this.opts.debug);
                this.canvasWrapper.reset();
            }
        }

        /**
         * Returns the number of rings this edge is a part of.
         *
         * @param {Number} edgeId The id of an edge.
         * @returns {Number} The number of rings the provided edge is part of.
         */

    }, {
        key: 'edgeRingCount',
        value: function edgeRingCount(edgeId) {
            var edge = this.graph.edges[edgeId];
            var a = this.graph.vertices[edge.sourceId];
            var b = this.graph.vertices[edge.targetId];

            return Math.min(a.value.rings.length, b.value.rings.length);
        }

        /**
         * Returns an array containing the bridged rings associated with this  molecule.
         *
         * @returns {SmilesDrawer.Ring[]} An array containing all bridged rings associated with this molecule.
         */

    }, {
        key: 'getBridgedRings',
        value: function getBridgedRings() {
            var bridgedRings = [];

            for (var i = 0; i < this.rings.length; i++) {
                if (this.rings[i].isBridged) {
                    bridgedRings.push(this.rings[i]);
                }
            }

            return bridgedRings;
        }

        /**
         * Returns an array containing all fused rings associated with this molecule.
         *
         * @returns {SmilesDrawer.Ring[]} An array containing all fused rings associated with this molecule.
         */

    }, {
        key: 'getFusedRings',
        value: function getFusedRings() {
            var fusedRings = [];

            for (var i = 0; i < this.rings.length; i++) {
                if (this.rings[i].isFused) {
                    fusedRings.push(this.rings[i]);
                }
            }

            return fusedRings;
        }

        /**
         * Returns an array containing all spiros associated with this molecule.
         *
         * @returns {SmilesDrawer.Ring[]} An array containing all spiros associated with this molecule.
         */

    }, {
        key: 'getSpiros',
        value: function getSpiros() {
            var spiros = [];

            for (var i = 0; i < this.rings.length; i++) {
                if (this.rings[i].isSpiro) {
                    spiros.push(this.rings[i]);
                }
            }

            return spiros;
        }

        /**
         * Returns a string containing a semicolon and new-line separated list of ring properties: Id; Members Count; Neighbours Count; IsSpiro; IsFused; IsBridged; Ring Count (subrings of bridged rings)
         *
         * @returns {String} A string as described in the method description.
         */

    }, {
        key: 'printRingInfo',
        value: function printRingInfo() {
            var result = '';
            for (var i = 0; i < this.rings.length; i++) {
                var ring = this.rings[i];

                result += ring.id + ';';
                result += ring.members.length + ';';
                result += ring.neighbours.length + ';';
                result += ring.isSpiro ? 'true;' : 'false;';
                result += ring.isFused ? 'true;' : 'false;';
                result += ring.isBridged ? 'true;' : 'false;';
                result += ring.rings.length + ';';
                result += '\n';
            }

            return result;
        }

        /**
         * Returns the total overlap score of the current molecule.
         *
         * @returns {Number} The overlap score.
         */

    }, {
        key: 'getTotalOverlapScore',
        value: function getTotalOverlapScore() {
            return this.totalOverlapScore;
        }

        /**
         * Returns the ring count of the current molecule.
         *
         * @returns {Number} The ring count.
         */

    }, {
        key: 'getRingCount',
        value: function getRingCount() {
            return this.rings.length;
        }

        /**
         * Checks whether or not the current molecule  a bridged ring.
         *
         * @returns {Boolean} A boolean indicating whether or not the current molecule  a bridged ring.
         */

    }, {
        key: 'hasBridgedRing',
        value: function hasBridgedRing() {
            return this.bridgedRing;
        }

        /**
         * Returns the number of heavy atoms (non-hydrogen) in the current molecule.
         *
         * @returns {Number} The heavy atom count.
         */

    }, {
        key: 'getHeavyAtomCount',
        value: function getHeavyAtomCount() {
            var hac = 0;

            for (var i = 0; i < this.graph.vertices.length; i++) {
                if (this.graph.vertices[i].value.element !== 'H') {
                    hac++;
                }
            }

            return hac;
        }

        /**
         * Returns the type of the ringbond (e.g. '=' for a double bond). The ringbond represents the break in a ring introduced when creating the MST. If the two vertices supplied as arguments are not part of a common ringbond, the method returns null.
         *
         * @param {SmilesDrawer.Vertex} vertexA A vertex.
         * @param {SmilesDrawer.Vertex} vertexB A vertex.
         * @returns {String|null} Returns the ringbond type or null, if the two supplied vertices are not connected by a ringbond.
         */

    }, {
        key: 'getRingbondType',
        value: function getRingbondType(vertexA, vertexB) {
            // Checks whether the two vertices are the ones connecting the ring
            // and what the bond type should be.
            if (vertexA.value.getRingbondCount() < 1 || vertexB.value.getRingbondCount() < 1) {
                return null;
            }

            for (var i = 0; i < vertexA.value.ringbonds.length; i++) {
                for (var j = 0; j < vertexB.value.ringbonds.length; j++) {
                    // if(i != j) continue;
                    if (vertexA.value.ringbonds[i].id === vertexB.value.ringbonds[j].id) {
                        // If the bonds are equal, it doesn't matter which bond is returned.
                        // if they are not equal, return the one that is not the default ("-")
                        if (vertexA.value.ringbonds[i].bondType === '-') {
                            return vertexB.value.ringbonds[j].bond;
                        } else {
                            return vertexA.value.ringbonds[i].bond;
                        }
                    }
                }
            }

            return null;
        }

        /**
         * Initializes rings and ringbonds for the current molecule.
         */

    }, {
        key: 'initRings',
        value: function initRings() {
            var openBonds = new Map();

            // Close the open ring bonds (spanning tree -> graph)
            for (var i = this.graph.vertices.length - 1; i >= 0; i--) {
                var vertex = this.graph.vertices[i];

                if (vertex.value.ringbonds.length === 0) {
                    continue;
                }

                for (var j = 0; j < vertex.value.ringbonds.length; j++) {
                    var ringbondId = vertex.value.ringbonds[j].id;

                    // If the other ringbond id has not been discovered,
                    // add it to the open bonds map and continue.
                    // if the other ringbond id has already been discovered,
                    // create a bond between the two atoms.
                    if (!openBonds.has(ringbondId)) {
                        openBonds.set(ringbondId, vertex.id);
                    } else {
                        var sourceVertexId = vertex.id;
                        var targetVertexId = openBonds.get(ringbondId);
                        var edgeId = this.graph.addEdge(new SmilesDrawer.Edge(sourceVertexId, targetVertexId, 1));
                        var targetVertex = this.graph.vertices[targetVertexId];

                        vertex.addChild(targetVertexId);
                        vertex.value.addNeighbouringElement(targetVertex.value.element);
                        targetVertex.addChild(sourceVertexId);
                        targetVertex.value.addNeighbouringElement(vertex.value.element);
                        vertex.edges.push(edgeId);
                        targetVertex.edges.push(edgeId);

                        openBonds.delete(ringbondId);
                    }
                }
            }

            // Get the rings in the graph (the SSSR)
            var rings = SmilesDrawer.SSSR.getRings(this.graph);

            if (rings === null) {
                return;
            }

            for (var i = 0; i < rings.length; i++) {
                var ringVertices = [].concat(_toConsumableArray(rings[i]));
                var ringId = this.addRing(new SmilesDrawer.Ring(ringVertices));

                // Add the ring to the atoms
                for (var j = 0; j < ringVertices.length; j++) {
                    this.graph.vertices[ringVertices[j]].value.rings.push(ringId);
                }
            }

            // Find connection between rings
            // Check for common vertices and create ring connections. This is a bit
            // ugly, but the ringcount is always fairly low (< 100)
            for (var i = 0; i < this.rings.length - 1; i++) {
                for (var j = i + 1; j < this.rings.length; j++) {
                    var a = this.rings[i];
                    var b = this.rings[j];
                    var ringConnection = new SmilesDrawer.RingConnection(a, b);

                    // If there are no vertices in the ring connection, then there
                    // is no ring connection
                    if (ringConnection.vertices.size > 0) {
                        this.addRingConnection(ringConnection);
                    }
                }
            }

            // Add neighbours to the rings
            for (var i = 0; i < this.rings.length; i++) {
                var ring = this.rings[i];
                ring.neighbours = SmilesDrawer.RingConnection.getNeighbours(this.ringConnections, ring.id);
            }

            // Anchor the ring to one of it's members, so that the ring center will always
            // be tied to a single vertex when doing repositionings
            for (var i = 0; i < this.rings.length; i++) {
                var _ring = this.rings[i];
                this.graph.vertices[_ring.members[0]].value.addAnchoredRing(_ring.id);
            }

            // Backup the ring information to restore after placing the bridged ring.
            // This is needed in order to identify aromatic rings and stuff like this in
            // rings that are member of the superring.
            this.backupRingInformation();

            // Replace rings contained by a larger bridged ring with a bridged ring
            while (this.rings.length > 0) {
                var id = -1;
                for (var i = 0; i < this.rings.length; i++) {
                    var _ring3 = this.rings[i];

                    if (this.isPartOfBridgedRing(_ring3.id) && !_ring3.isBridged) {
                        id = _ring3.id;
                    }
                }

                if (id === -1) {
                    break;
                }

                var _ring2 = this.getRing(id);

                var involvedRings = this.getBridgedRingRings(_ring2.id);

                this.bridgedRing = true;
                this.createBridgedRing(involvedRings, _ring2.members[0]);

                // Remove the rings
                for (var i = 0; i < involvedRings.length; i++) {
                    this.removeRing(involvedRings[i]);
                }
            }
        }

        /**
         * Returns all rings connected by bridged bonds starting from the ring with the supplied ring id.
         *
         * @param {Number} ringId A ring id.
         * @returns {Number[]} An array containing all ring ids of rings part of a bridged ring system.
         */

    }, {
        key: 'getBridgedRingRings',
        value: function getBridgedRingRings(ringId) {
            var involvedRings = [];
            var that = this;

            var recurse = function recurse(r) {
                var ring = that.getRing(r);

                involvedRings.push(r);

                for (var i = 0; i < ring.neighbours.length; i++) {
                    var n = ring.neighbours[i];

                    if (involvedRings.indexOf(n) === -1 && n !== r && SmilesDrawer.RingConnection.isBridge(that.ringConnections, that.graph.vertices, r, n)) {
                        recurse(n);
                    }
                }
            };

            recurse(ringId);

            return SmilesDrawer.ArrayHelper.unique(involvedRings);
        }

        /**
         * Checks whether or not a ring is part of a bridged ring.
         *
         * @param {Number} ringId A ring id.
         * @returns {Boolean} A boolean indicating whether or not the supplied ring (by id) is part of a bridged ring system.
         */

    }, {
        key: 'isPartOfBridgedRing',
        value: function isPartOfBridgedRing(ringId) {
            for (var i = 0; i < this.ringConnections.length; i++) {
                if (this.ringConnections[i].containsRing(ringId) && this.ringConnections[i].isBridge(this.graph.vertices)) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Creates a bridged ring.
         *
         * @param {Number[]} ringIds An array of ids of rings involved in the bridged ring.
         * @param {Number} sourceVertexId The vertex id to start the bridged ring discovery from.
         * @returns {SmilesDrawer.Ring} The bridged ring.
         */

    }, {
        key: 'createBridgedRing',
        value: function createBridgedRing(ringIds, sourceVertexId) {
            var ringMembers = new Set();
            var vertices = new Set();
            var neighbours = new Set();

            for (var i = 0; i < ringIds.length; i++) {
                var _ring4 = this.getRing(ringIds[i]);
                _ring4.isPartOfBridged = true;

                for (var j = 0; j < _ring4.members.length; j++) {
                    vertices.add(_ring4.members[j]);
                }

                for (var j = 0; j < _ring4.neighbours.length; j++) {
                    var id = _ring4.neighbours[j];

                    if (ringIds.indexOf(id) === -1) {
                        neighbours.add(_ring4.neighbours[j]);
                    }
                }
            }

            // A vertex is part of the bridged ring if it only belongs to
            // one of the rings (or to another ring
            // which is not part of the bridged ring).
            var leftovers = new Set();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = vertices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _id = _step.value;

                    var _vertex = this.graph.vertices[_id];
                    var intersection = SmilesDrawer.ArrayHelper.intersection(ringIds, _vertex.value.rings);

                    if (_vertex.value.rings.length === 1 || intersection.length === 1) {
                        ringMembers.add(_vertex.id);
                    } else {
                        leftovers.add(_vertex.id);
                    }
                }

                // Vertices can also be part of multiple rings and lay on the bridged ring,
                // however, they have to have at least two neighbours that are not part of
                // two rings
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var tmp = [];
            var insideRing = [];

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = leftovers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _id2 = _step2.value;

                    var _vertex2 = this.graph.vertices[_id2];
                    var onRing = false;

                    for (var _j = 0; _j < _vertex2.edges.length; _j++) {
                        if (this.edgeRingCount(_vertex2.edges[_j]) === 1) {
                            onRing = true;
                        }
                    }

                    if (onRing) {
                        _vertex2.value.isBridgeNode = true;
                        ringMembers.add(_vertex2.id);
                    } else {
                        _vertex2.value.isBridge = true;
                        ringMembers.add(_vertex2.id);
                    }
                }

                // Create the ring
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var ring = new SmilesDrawer.Ring([].concat(_toConsumableArray(ringMembers)));

            ring.isBridged = true;
            ring.neighbours = [].concat(_toConsumableArray(neighbours));

            for (var i = 0; i < ringIds.length; i++) {
                ring.rings.push(this.getRing(ringIds[i]).clone());
            }

            this.addRing(ring);

            for (var i = 0; i < ring.members.length; i++) {
                this.graph.vertices[ring.members[i]].value.bridgedRing = ring.id;
            }

            // Atoms inside the ring are no longer part of a ring but are now
            // associated with the bridged ring
            for (var i = 0; i < insideRing.length; i++) {
                var vertex = this.graph.vertices[insideRing[i]];
                vertex.value.rings = Array();
            }

            // Remove former rings from members of the bridged ring and add the bridged ring
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = ringMembers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _id3 = _step3.value;

                    var _vertex3 = this.graph.vertices[_id3];
                    _vertex3.value.rings = SmilesDrawer.ArrayHelper.removeAll(_vertex3.value.rings, ringIds);
                    _vertex3.value.rings.push(ring.id);
                }

                // Remove all the ring connections no longer used
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            for (var i = 0; i < ringIds.length; i++) {
                for (var j = i + 1; j < ringIds.length; j++) {
                    this.removeRingConnectionsBetween(ringIds[i], ringIds[j]);
                }
            }

            // Update the ring connections and add this ring to the neighbours neighbours
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = neighbours[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _id4 = _step4.value;

                    var connections = this.getRingConnections(_id4, ringIds);

                    for (var j = 0; j < connections.length; j++) {
                        this.getRingConnection(connections[j]).updateOther(ring.id, _id4);
                    }

                    this.getRing(_id4).neighbours.push(ring.id);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return ring;
        }

        /**
         * Checks whether or not two vertices are in the same ring.
         *
         * @param {SmilesDrawer.Vertex} vertexA A vertex.
         * @param {SmilesDrawer.Vertex} vertexB A vertex.
         * @returns {Boolean} A boolean indicating whether or not the two vertices are in the same ring.
         */

    }, {
        key: 'areVerticesInSameRing',
        value: function areVerticesInSameRing(vertexA, vertexB) {
            // This is a little bit lighter (without the array and push) than
            // getCommonRings().length > 0
            for (var i = 0; i < vertexA.value.rings.length; i++) {
                for (var j = 0; j < vertexB.value.rings.length; j++) {
                    if (vertexA.value.rings[i] === vertexB.value.rings[j]) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Returns an array of ring ids shared by both vertices.
         *
         * @param {SmilesDrawer.Vertex} vertexA A vertex.
         * @param {SmilesDrawer.Vertex} vertexB A vertex.
         * @returns {Number[]} An array of ids of rings shared by the two vertices.
         */

    }, {
        key: 'getCommonRings',
        value: function getCommonRings(vertexA, vertexB) {
            var commonRings = [];

            for (var i = 0; i < vertexA.value.rings.length; i++) {
                for (var j = 0; j < vertexB.value.rings.length; j++) {
                    if (vertexA.value.rings[i] == vertexB.value.rings[j]) {
                        commonRings.push(vertexA.value.rings[i]);
                    }
                }
            }

            return commonRings;
        }

        /**
         * Returns the aromatic or largest ring shared by the two vertices.
         *
         * @param {SmilesDrawer.Vertex} vertexA A vertex.
         * @param {SmilesDrawer.Vertex} vertexB A vertex.
         * @returns {SmilesDrawer.Ring|null} If an aromatic common ring exists, that ring, else the largest (non-aromatic) ring, else null.
         */

    }, {
        key: 'getLargestOrAromaticCommonRing',
        value: function getLargestOrAromaticCommonRing(vertexA, vertexB) {
            var commonRings = this.getCommonRings(vertexA, vertexB);
            var maxSize = 0;
            var largestCommonRing = null;

            for (var i = 0; i < commonRings.length; i++) {
                var ring = this.getRing(commonRings[i]);
                var size = ring.getSize();

                if (ring.isBenzeneLike(this.graph.vertices)) {
                    return ring;
                } else if (size > maxSize) {
                    maxSize = size;
                    largestCommonRing = ring;
                }
            }

            return largestCommonRing;
        }

        /**
         * Returns an array of vertices positioned at a specified location.
         *
         * @param {SmilesDrawer.Vector2} position The position to search for vertices.
         * @param {Number} radius The radius within to search.
         * @param {Number} excludeVertexId A vertex id to be excluded from the search results.
         * @returns {Number[]} An array containing vertex ids in a given location.
         */

    }, {
        key: 'getVerticesAt',
        value: function getVerticesAt(position, radius, excludeVertexId) {
            var locals = [];

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var vertex = this.graph.vertices[i];

                if (vertex.id === excludeVertexId || !vertex.positioned) {
                    continue;
                }

                var distance = position.distanceSq(vertex.position);

                if (distance <= radius * radius) {
                    locals.push(vertex.id);
                }
            }

            return locals;
        }

        /**
         * Returns the closest vertex (connected as well as unconnected).
         *
         * @param {SmilesDrawer.Vertex} vertex The vertex of which to find the closest other vertex.
         * @returns {SmilesDrawer.Vertex} The closest vertex.
         */

    }, {
        key: 'getClosestVertex',
        value: function getClosestVertex(vertex) {
            var minDist = 99999;
            var minVertex = null;

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var v = this.graph.vertices[i];

                if (v.id === vertex.id) {
                    continue;
                }

                var distSq = vertex.position.distanceSq(v.position);

                if (distSq < minDist) {
                    minDist = distSq;
                    minVertex = v;
                }
            }

            return minVertex;
        }

        /**
         * Add a ring to this representation of a molecule.
         *
         * @param {SmilesDrawer.Ring} ring A new ring.
         * @returns {Number} The ring id of the new ring.
         */

    }, {
        key: 'addRing',
        value: function addRing(ring) {
            ring.id = this.ringIdCounter++;
            this.rings.push(ring);

            return ring.id;
        }

        /**
         * Removes a ring from the array of rings associated with the current molecule.
         *
         * @param {Number} ringId A ring id.
         */

    }, {
        key: 'removeRing',
        value: function removeRing(ringId) {
            this.rings = this.rings.filter(function (item) {
                return item.id !== ringId;
            });

            // Also remove ring connections involving this ring
            this.ringConnections = this.ringConnections.filter(function (item) {
                return item.firstRingId !== ringId && item.secondRingId !== ringId;
            });

            // Remove the ring as neighbour of other rings
            for (var i = 0; i < this.rings.length; i++) {
                var r = this.rings[i];
                r.neighbours = r.neighbours.filter(function (item) {
                    return item !== ringId;
                });
            }
        }

        /**
         * Gets a ring object from the array of rings associated with the current molecule by its id. The ring id is not equal to the index, since rings can be added and removed when processing bridged rings.
         *
         * @param {Number} ringId A ring id.
         * @returns {SmilesDrawer.Ring} A ring associated with the current molecule.
         */

    }, {
        key: 'getRing',
        value: function getRing(ringId) {
            for (var i = 0; i < this.rings.length; i++) {
                if (this.rings[i].id == ringId) {
                    return this.rings[i];
                }
            }
        }

        /**
         * Add a ring connection to this representation of a molecule.
         *
         * @param {SmilesDrawer.RingConnection} ringConnection A new ringConnection.
         * @returns {Number} The ring connection id of the new ring connection.
         */

    }, {
        key: 'addRingConnection',
        value: function addRingConnection(ringConnection) {
            ringConnection.id = this.ringConnectionIdCounter++;
            this.ringConnections.push(ringConnection);

            return ringConnection.id;
        }

        /**
         * Removes a ring connection from the array of rings connections associated with the current molecule.
         *
         * @param {Number} ringConnectionId A ring connection id.
         */

    }, {
        key: 'removeRingConnection',
        value: function removeRingConnection(ringConnectionId) {
            this.ringConnections = this.ringConnections.filter(function (item) {
                return item.id !== ringConnectionId;
            });
        }

        /**
         * Removes all ring connections between two vertices.
         *
         * @param {Number} vertexIdA A vertex id.
         * @param {Number} vertexIdB A vertex id.
         */

    }, {
        key: 'removeRingConnectionsBetween',
        value: function removeRingConnectionsBetween(vertexIdA, vertexIdB) {
            var toRemove = [];
            for (var i = 0; i < this.ringConnections.length; i++) {
                var ringConnection = this.ringConnections[i];

                if (ringConnection.firstRingId === vertexIdA && ringConnection.secondRingId === vertexIdB || ringConnection.firstRingId === vertexIdB && ringConnection.secondRingId === vertexIdA) {
                    toRemove.push(ringConnection.id);
                }
            }

            for (var i = 0; i < toRemove.length; i++) {
                this.removeRingConnection(toRemove[i]);
            }
        }

        /**
         * Get a ring connection with a given id.
         * 
         * @param {Number} id 
         * @returns {SmilesDrawer.RingConnection} The ring connection with the specified id.
         */

    }, {
        key: 'getRingConnection',
        value: function getRingConnection(id) {
            for (var i = 0; i < this.ringConnections.length; i++) {
                if (this.ringConnections[i].id == id) {
                    return this.ringConnections[i];
                }
            }
        }

        /**
         * Get the ring connections between a ring and a set of rings.
         *
         * @param {Number} ringId A ring id.
         * @param {Number[]} ringIds An array of ring ids.
         * @returns {Number[]} An array of ring connection ids.
         */

    }, {
        key: 'getRingConnections',
        value: function getRingConnections(ringId, ringIds) {
            var ringConnections = [];

            for (var i = 0; i < this.ringConnections.length; i++) {
                var rc = this.ringConnections[i];

                for (var j = 0; j < ringIds.length; j++) {
                    var id = ringIds[j];

                    if (rc.firstRingId === ringId && rc.secondRingId === id || rc.firstRingId === id && rc.secondRingId === ringId) {
                        ringConnections.push(rc.id);
                    }
                }
            }

            return ringConnections;
        }

        /**
         * Returns the overlap score of the current molecule based on its positioned vertices. The higher the score, the more overlaps occur in the structure drawing.
         *
         * @returns {Object} Returns the total overlap score and the overlap score of each vertex sorted by score (higher to lower). Example: { total: 99, scores: [ { id: 0, score: 22 }, ... ]  }
         */

    }, {
        key: 'getOverlapScore',
        value: function getOverlapScore() {
            var total = 0.0;
            var overlapScores = new Float32Array(this.graph.vertices.length);

            for (var i = 0; i < this.graph.vertices.length; i++) {
                overlapScores[i] = 0;
            }

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var j = this.graph.vertices.length;
                while (--j > i) {
                    var a = this.graph.vertices[i];
                    var b = this.graph.vertices[j];

                    if (!a.value.isDrawn || !b.value.isDrawn) {
                        continue;
                    }

                    var dist = SmilesDrawer.Vector2.subtract(a.position, b.position).lengthSq();

                    if (dist < this.opts.bondLengthSq) {
                        var weighted = (this.opts.bondLength - Math.sqrt(dist)) / this.opts.bondLength;
                        total += weighted;
                        overlapScores[i] += weighted;
                        overlapScores[j] += weighted;
                    }
                }
            }

            var sortable = [];

            for (var i = 0; i < this.graph.vertices.length; i++) {
                sortable.push({
                    id: i,
                    score: overlapScores[i]
                });
            }

            sortable.sort(function (a, b) {
                return b.score - a.score;
            });

            return {
                total: total,
                scores: sortable,
                vertexScores: overlapScores
            };
        }

        /**
         * When drawing a double bond, choose the side to place the double bond. E.g. a double bond should always been drawn inside a ring.
         *
         * @param {SmilesDrawer.Vertex} vertexA A vertex.
         * @param {SmilesDrawer.Vertex} vertexB A vertex.
         * @param {SmilesDrawer.Vector2[]} sides An array containing the two normals of the line spanned by the two provided vertices.
         * @returns {Object} Returns an object containing the following information: {
                totalSideCount: Counts the sides of each vertex in the molecule, is an array [ a, b ],
                totalPosition: Same as position, but based on entire molecule,
                sideCount: Counts the sides of each neighbour, is an array [ a, b ],
                position: which side to position the second bond, is 0 or 1, represents the index in the normal array. This is based on only the neighbours
                anCount: the number of neighbours of vertexA,
                bnCount: the number of neighbours of vertexB
            }
         */

    }, {
        key: 'chooseSide',
        value: function chooseSide(vertexA, vertexB, sides) {
            // Check which side has more vertices
            // Get all the vertices connected to the both ends
            var an = vertexA.getNeighbours(vertexB.id);
            var bn = vertexB.getNeighbours(vertexA.id);
            var anCount = an.length;
            var bnCount = bn.length;

            // All vertices connected to the edge vertexA to vertexB
            var tn = SmilesDrawer.ArrayHelper.merge(an, bn);

            // Only considering the connected vertices
            var sideCount = [0, 0];

            for (var i = 0; i < tn.length; i++) {
                var v = this.graph.vertices[tn[i]].position;

                if (v.sameSideAs(vertexA.position, vertexB.position, sides[0])) {
                    sideCount[0]++;
                } else {
                    sideCount[1]++;
                }
            }

            // Considering all vertices in the graph, this is to resolve ties
            // from the above side counts
            var totalSideCount = [0, 0];

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var _v = this.graph.vertices[i].position;

                if (_v.sameSideAs(vertexA.position, vertexB.position, sides[0])) {
                    totalSideCount[0]++;
                } else {
                    totalSideCount[1]++;
                }
            }

            return {
                totalSideCount: totalSideCount,
                totalPosition: totalSideCount[0] > totalSideCount[1] ? 0 : 1,
                sideCount: sideCount,
                position: sideCount[0] > sideCount[1] ? 0 : 1,
                anCount: anCount,
                bnCount: bnCount
            };
        }

        /**
         * Sets the center for a ring.
         *
         * @param {SmilesDrawer.Ring} ring A ring.
         */

    }, {
        key: 'setRingCenter',
        value: function setRingCenter(ring) {
            var ringSize = ring.getSize();
            var total = new SmilesDrawer.Vector2();

            for (var i = 0; i < ringSize; i++) {
                total.add(this.graph.vertices[ring.members[i]].position);
            }

            ring.center = total.divide(ringSize);
        }

        /**
         * Gets the center of a ring contained within a bridged ring and containing a given vertex.
         *
         * @param {SmilesDrawer.Ring} ring A bridged ring.
         * @param {SmilesDrawer.Vertex} vertex A vertex.
         * @returns {SmilesDrawer.Vector2} The center of the subring that containing the vertex.
         */

    }, {
        key: 'getSubringCenter',
        value: function getSubringCenter(ring, vertex) {
            var rings = vertex.value.originalRings;
            var center = ring.center;
            var smallest = Number.MAX_VALUE;

            // Always get the smallest ring.
            var i = rings.length;
            for (var i = 0; i < rings.length; i++) {
                for (var j = 0; j < ring.rings.length; j++) {
                    if (rings[i] === ring.rings[j].id) {
                        if (ring.rings[j].getSize() < smallest) {
                            center = ring.rings[j].center;
                            smallest = ring.rings[j].getSize();
                        }
                    }
                }
            }

            return center;
        }

        /**
         * Draw the actual edges as bonds to the canvas.
         *
         * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
         */

    }, {
        key: 'drawEdges',
        value: function drawEdges(debug) {
            var that = this;
            var drawn = Array(this.graph.edges.length);
            drawn.fill(false);

            this.graph.traverseBF(0, function (vertex) {
                var edges = that.graph.getEdges(vertex.id);
                for (var i = 0; i < edges.length; i++) {
                    var edgeId = edges[i];
                    if (!drawn[edgeId]) {
                        drawn[edgeId] = true;
                        that.drawEdge(edgeId, debug);
                    }
                }
            });

            // Draw ring for implicitly defined aromatic rings
            if (!this.bridgedRing) {
                for (var i = 0; i < this.rings.length; i++) {
                    var ring = this.rings[i];

                    if (this.isRingAromatic(ring)) {
                        this.canvasWrapper.drawAromaticityRing(ring);
                    }
                }
            }
        }

        /**
         * Draw the an edge as a bonds to the canvas.
         *
         * @param {Number} edgeId An edge id.
         * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
         */

    }, {
        key: 'drawEdge',
        value: function drawEdge(edgeId, debug) {
            var that = this;
            var edge = this.graph.edges[edgeId];
            var vertexA = this.graph.vertices[edge.sourceId];
            var vertexB = this.graph.vertices[edge.targetId];
            var elementA = vertexA.value.element;
            var elementB = vertexB.value.element;

            if ((!vertexA.value.isDrawn || !vertexB.value.isDrawn) && this.opts.atomVisualization === 'default') {
                return;
            }

            var a = vertexA.position;
            var b = vertexB.position;
            var normals = this.getEdgeNormals(edge);

            // Create a point on each side of the line
            var sides = SmilesDrawer.ArrayHelper.clone(normals);

            sides[0].multiplyScalar(10).add(a);
            sides[1].multiplyScalar(10).add(a);

            if (edge.bondType === '=' || this.getRingbondType(vertexA, vertexB) === '=' || edge.isPartOfAromaticRing && this.bridgedRing) {
                // Always draw double bonds inside the ring
                var inRing = this.areVerticesInSameRing(vertexA, vertexB);
                var s = this.chooseSide(vertexA, vertexB, sides);

                if (inRing) {
                    // Always draw double bonds inside a ring
                    // if the bond is shared by two rings, it is drawn in the larger
                    // problem: smaller ring is aromatic, bond is still drawn in larger -> fix this
                    var lcr = this.getLargestOrAromaticCommonRing(vertexA, vertexB);
                    var center = lcr.center;

                    normals[0].multiplyScalar(that.opts.bondSpacing);
                    normals[1].multiplyScalar(that.opts.bondSpacing);

                    // Choose the normal that is on the same side as the center
                    var line = null;

                    if (center.sameSideAs(vertexA.position, vertexB.position, SmilesDrawer.Vector2.add(a, normals[0]))) {
                        line = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[0]), SmilesDrawer.Vector2.add(b, normals[0]), elementA, elementB);
                    } else {
                        line = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[1]), SmilesDrawer.Vector2.add(b, normals[1]), elementA, elementB);
                    }

                    line.shorten(this.opts.bondLength - this.opts.shortBondLength);

                    // The shortened edge
                    if (edge.isPartOfAromaticRing) {
                        this.canvasWrapper.drawLine(line, true);
                    } else {
                        this.canvasWrapper.drawLine(line);
                    }

                    // The normal edge
                    this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB));
                } else if (edge.center) {
                    normals[0].multiplyScalar(that.opts.halfBondSpacing);
                    normals[1].multiplyScalar(that.opts.halfBondSpacing);

                    var lineA = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[0]), SmilesDrawer.Vector2.add(b, normals[0]), elementA, elementB);
                    var lineB = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[1]), SmilesDrawer.Vector2.add(b, normals[1]), elementA, elementB);

                    this.canvasWrapper.drawLine(lineA);
                    this.canvasWrapper.drawLine(lineB);
                } else if (s.anCount == 0 && s.bnCount > 1 || s.bnCount == 0 && s.anCount > 1) {
                    // Both lines are the same length here
                    // Add the spacing to the edges (which are of unit length)
                    normals[0].multiplyScalar(that.opts.halfBondSpacing);
                    normals[1].multiplyScalar(that.opts.halfBondSpacing);

                    var _lineA = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[0]), SmilesDrawer.Vector2.add(b, normals[0]), elementA, elementB);
                    var _lineB = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[1]), SmilesDrawer.Vector2.add(b, normals[1]), elementA, elementB);

                    this.canvasWrapper.drawLine(_lineA);
                    this.canvasWrapper.drawLine(_lineB);
                } else if (s.sideCount[0] > s.sideCount[1]) {
                    normals[0].multiplyScalar(that.opts.bondSpacing);
                    normals[1].multiplyScalar(that.opts.bondSpacing);

                    var _line = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[0]), SmilesDrawer.Vector2.add(b, normals[0]), elementA, elementB);

                    _line.shorten(this.opts.bondLength - this.opts.shortBondLength);
                    this.canvasWrapper.drawLine(_line);
                    this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB));
                } else if (s.sideCount[0] < s.sideCount[1]) {
                    normals[0].multiplyScalar(that.opts.bondSpacing);
                    normals[1].multiplyScalar(that.opts.bondSpacing);

                    var _line2 = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[1]), SmilesDrawer.Vector2.add(b, normals[1]), elementA, elementB);

                    _line2.shorten(this.opts.bondLength - this.opts.shortBondLength);
                    this.canvasWrapper.drawLine(_line2);
                    this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB));
                } else if (s.totalSideCount[0] > s.totalSideCount[1]) {
                    normals[0].multiplyScalar(that.opts.bondSpacing);
                    normals[1].multiplyScalar(that.opts.bondSpacing);

                    var _line3 = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[0]), SmilesDrawer.Vector2.add(b, normals[0]), elementA, elementB);

                    _line3.shorten(this.opts.bondLength - this.opts.shortBondLength);
                    this.canvasWrapper.drawLine(_line3);
                    this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB));
                } else if (s.totalSideCount[0] <= s.totalSideCount[1]) {
                    normals[0].multiplyScalar(that.opts.bondSpacing);
                    normals[1].multiplyScalar(that.opts.bondSpacing);

                    var _line4 = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[1]), SmilesDrawer.Vector2.add(b, normals[1]), elementA, elementB);

                    _line4.shorten(this.opts.bondLength - this.opts.shortBondLength);
                    this.canvasWrapper.drawLine(_line4);
                    this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB));
                } else {}
            } else if (edge.bondType === '#') {
                normals[0].multiplyScalar(that.opts.bondSpacing / 1.5);
                normals[1].multiplyScalar(that.opts.bondSpacing / 1.5);

                var _lineA2 = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[0]), SmilesDrawer.Vector2.add(b, normals[0]), elementA, elementB);
                var _lineB2 = new SmilesDrawer.Line(SmilesDrawer.Vector2.add(a, normals[1]), SmilesDrawer.Vector2.add(b, normals[1]), elementA, elementB);

                this.canvasWrapper.drawLine(_lineA2);
                this.canvasWrapper.drawLine(_lineB2);

                this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB));
            } else if (edge.bondType === '.') {
                // TODO: Something... maybe... version 2?
            } else {
                var isChiralCenterA = vertexA.value.bracket && vertexA.value.bracket.chirality;
                var isChiralCenterB = vertexB.value.bracket && vertexB.value.bracket.chirality;

                if (edge.chiral === 'up') {
                    this.canvasWrapper.drawWedge(new SmilesDrawer.Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
                } else if (edge.chiral === 'down') {
                    this.canvasWrapper.drawDashedWedge(new SmilesDrawer.Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
                } else {
                    this.canvasWrapper.drawLine(new SmilesDrawer.Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
                }
            }

            if (debug) {
                var midpoint = SmilesDrawer.Vector2.midpoint(a, b);
                this.canvasWrapper.drawDebugText(midpoint.x, midpoint.y, 'e: ' + edgeId);
            }
        }

        /**
         * Draws the vertices representing atoms to the canvas.
         *
         * @param {Boolean} debug A boolean indicating whether or not to draw debug messages to the canvas.
         */

    }, {
        key: 'drawVertices',
        value: function drawVertices(debug) {
            var i = this.graph.vertices.length;
            for (var i = 0; i < this.graph.vertices.length; i++) {
                var vertex = this.graph.vertices[i];
                var atom = vertex.value;
                var charge = 0;
                var isotope = 0;
                var bondCount = this.getBondCount(vertex);
                var _element2 = atom.element;
                var hydrogens = SmilesDrawer.Atom.maxBonds[_element2] - bondCount;
                var dir = vertex.getTextDirection(this.graph.vertices);
                var isTerminal = this.opts.terminalCarbons || _element2 !== 'C' || atom.hasAttachedPseudoElements ? vertex.isTerminal() : false;
                var isCarbon = atom.element === 'C';

                if (atom.bracket) {
                    hydrogens = atom.bracket.hcount;
                    charge = atom.bracket.charge;
                    isotope = atom.bracket.isotope;
                }

                if (this.opts.atomVisualization === 'allballs') {
                    this.canvasWrapper.drawBall(vertex.position.x, vertex.position.y, _element2);
                } else if (atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements)) {
                    if (this.opts.atomVisualization === 'default') {
                        this.canvasWrapper.drawText(vertex.position.x, vertex.position.y, _element2, hydrogens, dir, isTerminal, charge, isotope, atom.getAttachedPseudoElements());
                    } else if (this.opts.atomVisualization === 'balls') {
                        this.canvasWrapper.drawBall(vertex.position.x, vertex.position.y, _element2);
                    }
                } else if (vertex.getNeighbourCount() === 2 && vertex.forcePositioned == true) {
                    // If there is a carbon which bonds are in a straight line, draw a dot
                    var a = this.graph.vertices[vertex.neighbours[0]].position;
                    var b = this.graph.vertices[vertex.neighbours[1]].position;
                    var angle = SmilesDrawer.Vector2.threePointangle(vertex.position, a, b);

                    if (Math.abs(Math.PI - angle) < 0.1) {
                        this.canvasWrapper.drawPoint(vertex.position.x, vertex.position.y, _element2);
                    }
                }

                if (debug) {
                    var value = 'v: ' + vertex.id + ' ' + SmilesDrawer.ArrayHelper.print(atom.ringbonds);
                    this.canvasWrapper.drawDebugText(vertex.position.x, vertex.position.y, value);
                }
            }

            // Draw the ring centers for debug purposes
            if (this.opts.debug) {
                for (var i = 0; i < this.rings.length; i++) {
                    var center = this.rings[i].center;
                    this.canvasWrapper.drawDebugPoint(center.x, center.y, 'r: ' + this.rings[i].id);
                }
            }
        }

        /**
         * Position the vertices according to their bonds and properties.
         */

    }, {
        key: 'position',
        value: function position() {
            var startVertex = null;

            // Always start drawing at a bridged ring if there is one
            // If not, start with a ring
            // else, start with 0
            for (var i = 0; i < this.graph.vertices.length; i++) {
                if (this.graph.vertices[i].value.bridgedRing !== null) {
                    startVertex = this.graph.vertices[i];
                    break;
                }
            }

            for (var i = 0; i < this.rings.length; i++) {
                if (this.rings[i].isBridged) {
                    startVertex = this.graph.vertices[this.rings[i].members[0]];
                }
            }

            if (this.rings.length > 0 && startVertex === null) {
                startVertex = this.graph.vertices[this.rings[0].members[0]];
            }

            if (startVertex === null) {
                startVertex = this.graph.vertices[0];
            }

            this.createNextBond(startVertex);
        }

        /**
         * Stores the current information associated with rings.
         */

    }, {
        key: 'backupRingInformation',
        value: function backupRingInformation() {
            this.originalRings = [];
            this.originalRingConnections = [];

            for (var i = 0; i < this.rings.length; i++) {
                this.originalRings.push(this.rings[i]);
            }

            for (var i = 0; i < this.ringConnections.length; i++) {
                this.originalRingConnections.push(this.ringConnections[i]);
            }

            for (var i = 0; i < this.graph.vertices.length; i++) {
                this.graph.vertices[i].value.backupRings();
            }
        }

        /**
         * Restores the most recently backed up information associated with rings.
         */

    }, {
        key: 'restoreRingInformation',
        value: function restoreRingInformation() {
            // Get the subring centers from the bridged rings
            var bridgedRings = this.getBridgedRings();

            this.rings = [];
            this.ringConnections = [];

            for (var i = 0; i < bridgedRings.length; i++) {
                var bridgedRing = bridgedRings[i];

                for (var j = 0; j < bridgedRing.rings.length; j++) {
                    var ring = bridgedRing.rings[j];
                    this.originalRings[ring.id].center = ring.center;
                }
            }

            for (var i = 0; i < this.originalRings.length; i++) {
                this.rings.push(this.originalRings[i]);
            }

            for (var i = 0; i < this.originalRingConnections.length; i++) {
                this.ringConnections.push(this.originalRingConnections[i]);
            }

            for (var i = 0; i < this.graph.vertices.length; i++) {
                this.graph.vertices[i].value.restoreRings();
            }
        }

        // TODO: This needs some cleaning up

        /**
         * Creates a new ring, that is, positiones all the vertices inside a ring.
         *
         * @param {SmilesDrawer.Ring} ring The ring to position.
         * @param {SmilesDrawer.Vector2|null} [center=null] The center of the ring to be created.
         * @param {SmilesDrawer.Vertex|null} [startVertex=null] The first vertex to be positioned inside the ring.
         * @param {SmilesDrawer.Vertex|null} [previousVertex=null] The last vertex that was positioned.
         * @param {Boolean} [previousVertex=false] A boolean indicating whether or not this ring was force positioned already - this is needed after force layouting a ring, in order to draw rings connected to it.
         */

    }, {
        key: 'createRing',
        value: function createRing(ring) {
            var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var startVertex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var previousVertex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (ring.positioned) {
                return;
            }

            center = center ? center : new SmilesDrawer.Vector2(0, 0);

            var orderedNeighbours = ring.getOrderedNeighbours(this.ringConnections);
            var startingAngle = startVertex ? SmilesDrawer.Vector2.subtract(startVertex.position, center).angle() : 0;

            var radius = SmilesDrawer.MathHelper.polyCircumradius(this.opts.bondLength, ring.getSize());
            var angle = SmilesDrawer.MathHelper.centralAngle(ring.getSize());

            ring.centralAngle = angle;

            var a = startingAngle;
            var that = this;
            var startVertexId = startVertex ? startVertex.id : null;

            if (ring.members.indexOf(startVertexId) === -1) {
                if (startVertex) {
                    startVertex.positioned = false;
                }

                startVertexId = ring.members[0];
            }

            // For bridged rings, vertices directly connected to the ring are also positioned.
            var positioned = Array();

            // If the ring is bridged, then draw the vertices inside the ring
            // using a force based approach
            if (ring.isBridged) {
                this.graph.kkLayout(ring.members.slice(), positioned, center, startVertex.id, ring, this.opts.bondLength);
                ring.positioned = true;

                // Update the center of the bridged ring
                this.setRingCenter(ring);
                center = ring.center;

                // Setting the centers for the subrings
                for (var i = 0; i < ring.rings.length; i++) {
                    this.setRingCenter(ring.rings[i]);
                }
            } else {
                ring.eachMember(this.graph.vertices, function (v) {
                    var vertex = that.graph.vertices[v];

                    if (!vertex.positioned) {
                        vertex.setPosition(center.x + Math.cos(a) * radius, center.y + Math.sin(a) * radius);
                    }

                    a += angle;

                    if (!ring.isBridged || ring.rings.length < 3) {
                        vertex.positioned = true;
                    }
                }, startVertexId, previousVertex ? previousVertex.id : null);
            }

            ring.positioned = true;
            ring.center = center;

            // Draw neighbours in decreasing order of connectivity
            for (var i = 0; i < orderedNeighbours.length; i++) {
                var neighbour = this.getRing(orderedNeighbours[i].neighbour);

                if (neighbour.positioned) {
                    continue;
                }

                var vertices = SmilesDrawer.RingConnection.getVertices(this.ringConnections, ring.id, neighbour.id);

                if (vertices.length === 2) {
                    // This ring is a fused ring
                    ring.isFused = true;
                    neighbour.isFused = true;

                    var vertexA = this.graph.vertices[vertices[0]];
                    var vertexB = this.graph.vertices[vertices[1]];

                    // Get middle between vertex A and B
                    var midpoint = SmilesDrawer.Vector2.midpoint(vertexA.position, vertexB.position);

                    // Get the normals to the line between A and B
                    var normals = SmilesDrawer.Vector2.normals(vertexA.position, vertexB.position);

                    // Normalize the normals
                    normals[0].normalize();
                    normals[1].normalize();

                    // Set length from middle of side to center (the apothem)
                    var r = SmilesDrawer.MathHelper.polyCircumradius(this.opts.bondLength, neighbour.getSize());
                    var apothem = SmilesDrawer.MathHelper.apothem(r, neighbour.getSize());

                    normals[0].multiplyScalar(apothem).add(midpoint);
                    normals[1].multiplyScalar(apothem).add(midpoint);

                    // Pick the normal which results in a larger distance to the previous center
                    // Also check whether it's inside another ring
                    var nextCenter = normals[0];
                    if (SmilesDrawer.Vector2.subtract(center, normals[1]).lengthSq() > SmilesDrawer.Vector2.subtract(center, normals[0]).lengthSq()) {
                        nextCenter = normals[1];
                    }

                    // Get the vertex (A or B) which is in clock-wise direction of the other
                    var posA = SmilesDrawer.Vector2.subtract(vertexA.position, nextCenter);
                    var posB = SmilesDrawer.Vector2.subtract(vertexB.position, nextCenter);

                    if (posA.clockwise(posB) === -1) {
                        if (!neighbour.positioned) {
                            this.createRing(neighbour, nextCenter, vertexA, vertexB);
                        }
                    } else {
                        if (!neighbour.positioned) {
                            this.createRing(neighbour, nextCenter, vertexB, vertexA);
                        }
                    }
                } else if (vertices.length === 1) {
                    // This ring is a spiro
                    ring.isSpiro = true;
                    neighbour.isSpiro = true;

                    var _vertexA = this.graph.vertices[vertices[0]];

                    // Get the vector pointing from the shared vertex to the new centpositioner
                    var _nextCenter = SmilesDrawer.Vector2.subtract(center, _vertexA.position);

                    _nextCenter.invert();
                    _nextCenter.normalize();

                    // Get the distance from the vertex to the center
                    var _r = SmilesDrawer.MathHelper.polyCircumradius(this.opts.bondLength, neighbour.getSize());

                    _nextCenter.multiplyScalar(_r);
                    _nextCenter.add(_vertexA.position);

                    if (!neighbour.positioned) {
                        this.createRing(neighbour, _nextCenter, _vertexA);
                    }
                }
            }

            // Next, draw atoms that are not part of a ring that are directly attached to this ring
            for (var i = 0; i < ring.members.length; i++) {
                var ringMember = this.graph.vertices[ring.members[i]];
                var ringMemberNeighbours = ringMember.getNeighbours();

                // If there are multiple, the ovlerap will be resolved in the appropriate step
                for (var j = 0; j < ringMemberNeighbours.length; j++) {
                    var v = this.graph.vertices[ringMemberNeighbours[j]];

                    if (v.positioned) {
                        continue;
                    }

                    v.value.isConnectedToRing = true;
                    this.createNextBond(v, ringMember, this.getSubringCenter(ring, ringMember));
                }
            }

            for (var i = 0; i < positioned.length; i++) {
                var u = this.graph.vertices[positioned[i][1]]; // this is the ring vertex
                var _v2 = this.graph.vertices[positioned[i][0]]; // this is the vertex attached to the ring vertex
                _v2.previousPosition = u.position;
                this.createNextBond(_v2, u, 0, 0, true);
            }
        }

        /**
         * Rotate an entire subtree by an angle around a center.
         *
         * @param {Number} vertexId A vertex id (the root of the sub-tree).
         * @param {Number} parentVertexId A vertex id in the previous direction of the subtree that is to rotate.
         * @param {Number} angle An angle in randians.
         * @param {SmilesDrawer.Vector2} center The rotational center.
         */

    }, {
        key: 'rotateSubtree',
        value: function rotateSubtree(vertexId, parentVertexId, angle, center) {
            var that = this;

            this.traverseTree(vertexId, parentVertexId, function (vertex) {
                vertex.position.rotateAround(angle, center);

                for (var i = 0; i < vertex.value.anchoredRings.length; i++) {
                    var ring = that.rings[vertex.value.anchoredRings[i]];

                    if (ring) {
                        ring.center.rotateAround(angle, center);
                    }
                }
            });
        }

        /**
         * Gets the overlap score of a subtree.
         *
         * @param {Number} vertexId A vertex id (the root of the sub-tree).
         * @param {Number} parentVertexId A vertex id in the previous direction of the subtree.
         * @param {Number[]} vertexOverlapScores An array containing the vertex overlap scores indexed by vertex id.
         * @returns {Object} An object containing the total overlap score and the center of mass of the subtree weighted by overlap score { value: 0.2, center: new SmilesDrawer.Vector2() }.
         */

    }, {
        key: 'getSubtreeOverlapScore',
        value: function getSubtreeOverlapScore(vertexId, parentVertexId, vertexOverlapScores) {
            var that = this;
            var score = 0;
            var center = new SmilesDrawer.Vector2();

            this.traverseTree(vertexId, parentVertexId, function (vertex) {
                var s = vertexOverlapScores[vertex.id];
                score += s;

                var position = that.graph.vertices[vertex.id].position.clone();
                position.multiplyScalar(s);
                center.add(position);
            });

            center.divide(score);

            return {
                value: score,
                center: center
            };
        }

        /**
         * Returns the current (positioned vertices so far) center of mass.
         * 
         * @returns {SmilesDrawer.Vector2} The current center of mass.
         */

    }, {
        key: 'getCurrentCenterOfMass',
        value: function getCurrentCenterOfMass() {
            var total = new SmilesDrawer.Vector2();
            var count = 0;

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var vertex = this.graph.vertices[i];

                if (vertex.positioned) {
                    total.add(vertex.position);
                    count++;
                }
            }

            return total.divide(count);
        }

        /**
         * Returns the current (positioned vertices so far) center of mass in the neighbourhood of a given position.
         *
         * @param {SmilesDrawer.Vector2} vec The point at which to look for neighbours.
         * @param {Number} [r=currentBondLength*2.0] The radius of vertices to include.
         * @returns {SmilesDrawer.Vector2} The current center of mass.
         */

    }, {
        key: 'getCurrentCenterOfMassInNeigbourhood',
        value: function getCurrentCenterOfMassInNeigbourhood(vec) {
            var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.opts.bondLength * 2.0;

            var total = new SmilesDrawer.Vector2();
            var count = 0;
            var rSq = r * r;

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var vertex = this.graph.vertices[i];

                if (vertex.positioned && vec.distanceSq(vertex.position) < rSq) {
                    total.add(vertex.position);
                    count++;
                }
            }

            return total.divide(count);
        }

        /**
         * Resolve primary (exact) overlaps, such as two vertices that are connected to the same ring vertex.
         */

    }, {
        key: 'resolvePrimaryOverlaps',
        value: function resolvePrimaryOverlaps() {
            var overlaps = [];
            var done = Array(this.graph.vertices.length);

            // Looking for overlaps created by two bonds coming out of a ring atom, which both point straight
            // away from the ring and are thus perfectly overlapping.
            for (var i = 0; i < this.rings.length; i++) {
                var ring = this.rings[i];

                for (var j = 0; j < ring.members.length; j++) {
                    var vertex = this.graph.vertices[ring.members[j]];

                    if (done[vertex.id]) {
                        continue;
                    }

                    done[vertex.id] = true;

                    // Look for rings where there are atoms with two bonds outside the ring (overlaps)
                    var nonRingNeighbours = this.getNonRingNeighbours(vertex.id);

                    if (nonRingNeighbours.length > 1) {
                        var rings = [];

                        for (var k = 0; k < vertex.value.rings.length; k++) {
                            rings.push(vertex.value.rings[k]);
                        }

                        overlaps.push({
                            common: vertex,
                            rings: rings,
                            vertices: nonRingNeighbours
                        });
                    }
                }
            }

            for (var i = 0; i < overlaps.length; i++) {
                var overlap = overlaps[i];

                if (overlap.vertices.length === 2) {
                    var a = overlap.vertices[0];
                    var b = overlap.vertices[1];

                    if (!a.value.isDrawn || !b.value.isDrawn) {
                        continue;
                    }

                    var angle = (2 * Math.PI - this.getRing(overlap.rings[0]).getAngle()) / 6.0;

                    this.rotateSubtree(a.id, overlap.common.id, angle, overlap.common.position);
                    this.rotateSubtree(b.id, overlap.common.id, -angle, overlap.common.position);

                    // Decide which way to rotate the vertices depending on the effect it has on the overlap score
                    var overlapScore = this.getOverlapScore();
                    var subTreeOverlapA = this.getSubtreeOverlapScore(a.id, overlap.common.id, overlapScore.vertexScores);
                    var subTreeOverlapB = this.getSubtreeOverlapScore(b.id, overlap.common.id, overlapScore.vertexScores);
                    var total = subTreeOverlapA.value + subTreeOverlapB.value;

                    this.rotateSubtree(a.id, overlap.common.id, -2.0 * angle, overlap.common.position);
                    this.rotateSubtree(b.id, overlap.common.id, 2.0 * angle, overlap.common.position);

                    overlapScore = this.getOverlapScore();
                    subTreeOverlapA = this.getSubtreeOverlapScore(a.id, overlap.common.id, overlapScore.vertexScores);
                    subTreeOverlapB = this.getSubtreeOverlapScore(b.id, overlap.common.id, overlapScore.vertexScores);

                    if (subTreeOverlapA.value + subTreeOverlapB.value > total) {
                        this.rotateSubtree(a.id, overlap.common.id, 2.0 * angle, overlap.common.position);
                        this.rotateSubtree(b.id, overlap.common.id, -2.0 * angle, overlap.common.position);
                    }
                }
            }
        }

        /**
         * Resolve secondary overlaps. Those overlaps are due to the structure turning back on itself.
         *
         * @param {Object[]} scores An array of objects sorted descending by score.
         * @param {Number} scores[].id A vertex id.
         * @param {Number} scores[].score The overlap score associated with the vertex id.
         */

    }, {
        key: 'resolveSecondaryOverlaps',
        value: function resolveSecondaryOverlaps(scores) {
            for (var i = 0; i < scores.length; i++) {
                if (scores[i].score > this.opts.bondLength / (4.0 * this.opts.bondLength)) {
                    var vertex = this.graph.vertices[scores[i].id];

                    if (vertex.isTerminal()) {
                        var closest = this.getClosestVertex(vertex);

                        if (closest) {
                            // If one of the vertices is the first one, the previous vertex is not the central vertex but the dummy
                            // so take the next rather than the previous, which is vertex 1
                            var closestPosition = null;

                            if (closest.isTerminal()) {
                                closestPosition = closest.id === 0 ? this.graph.vertices[1].position : closest.previousPosition;
                            } else {
                                closestPosition = closest.id === 0 ? this.graph.vertices[1].position : closest.position;
                            }

                            var vertexPreviousPosition = vertex.id === 0 ? this.graph.vertices[1].position : vertex.previousPosition;

                            vertex.position.rotateAwayFrom(closestPosition, vertexPreviousPosition, SmilesDrawer.MathHelper.toRad(20));
                        }
                    }
                }
            }
        }

        /**
         * Positiones the next vertex thus creating a bond.
         *
         * @param {SmilesDrawer.Vertex} vertex A vertex.
         * @param {SmilesDrawer.Vertex} previousVertex The previous vertex which has been positioned.
         * @param {SmilesDrawer.Ring|Number} ringOrAngle Either a ring or a number. If the vertex is connected to a ring, it is positioned based on the ring center and thus the ring is supplied. If the vertex is not in a ring, an angle (in radians) is supplied.
         * @param {Number} dir Either 1 or -1 to break ties (if no angle can be elucidated).
         * @param {Boolean} [skipPositioning=false] Whether or not to skip positioning and just check the neighbours.
         */

    }, {
        key: 'createNextBond',
        value: function createNextBond(vertex, previousVertex, ringOrAngle, dir) {
            var skipPositioning = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            if (vertex.positioned && !skipPositioning) {
                return;
            }

            // If the current node is the member of one ring, then point straight away
            // from the center of the ring. However, if the current node is a member of
            // two rings, point away from the middle of the centers of the two rings
            if (!skipPositioning) {
                if (!previousVertex) {
                    // Here, ringOrAngle is always an angle

                    // Add a (dummy) previous position if there is no previous vertex defined
                    // Since the first vertex is at (0, 0), create a vector at (bondLength, 0)
                    // and rotate it by 90°


                    var dummy = new SmilesDrawer.Vector2(this.opts.bondLength, 0);
                    dummy.rotate(SmilesDrawer.MathHelper.toRad(-120));

                    vertex.previousPosition = dummy;
                    vertex.setPosition(this.opts.bondLength, 0);
                    vertex.angle = SmilesDrawer.MathHelper.toRad(-120);
                    vertex.globalAngle = vertex.angle;

                    // Do not position the vertex if it belongs to a bridged ring that is positioned using a layout algorithm.
                    if (vertex.value.bridgedRing === null) {
                        vertex.positioned = true;
                    }
                } else if (previousVertex.value.originalRings.length === 1) {
                    var vecs = Array();
                    var neighbours = previousVertex.getNeighbours();

                    for (var i = 0; i < neighbours.length; i++) {
                        var neighbour = this.graph.vertices[neighbours[i]];

                        if (neighbour.positioned && neighbour.value.originalRings.length > 0) {
                            vecs.push(SmilesDrawer.Vector2.subtract(neighbour.position, previousVertex.position));
                        }
                    }

                    var avg = SmilesDrawer.Vector2.averageDirection(vecs);
                    vertex.setPositionFromVector(avg.invert().multiplyScalar(this.opts.bondLength).add(previousVertex.position));
                    vertex.previousPosition = previousVertex.position;
                    vertex.positioned = true;
                } else if (previousVertex.value.originalRings.length > 1) {
                    var _vecs = Array();
                    var _neighbours = previousVertex.getNeighbours();

                    for (var i = 0; i < _neighbours.length; i++) {
                        var _neighbour = this.graph.vertices[_neighbours[i]];

                        if (_neighbour.positioned && _neighbour.value.originalRings.length > 1) {
                            _vecs.push(SmilesDrawer.Vector2.subtract(_neighbour.position, previousVertex.position));
                        }
                    }

                    var _avg = SmilesDrawer.Vector2.averageDirection(_vecs);
                    _avg.invert().multiplyScalar(this.opts.bondLength).add(previousVertex.position);

                    // Invert if too close to another of the averaged vertices (resolve situations like: CC1CC2NCC3(N)CC1(C)C23CC#C)
                    for (var i = 0; i < _neighbours.length; i++) {
                        var _neighbour2 = this.graph.vertices[_neighbours[i]];

                        if (!_neighbour2.positioned) {
                            continue;
                        }

                        if (SmilesDrawer.Vector2.threePointangle(_avg, previousVertex.position, _neighbour2.position) > 3.1) {
                            _avg.rotateAround(Math.PI, previousVertex.position);
                            break;
                        }
                    }

                    vertex.previousPosition = previousVertex.position;
                    vertex.setPositionFromVector(_avg);
                    vertex.positioned = true;
                } else {
                    // Here, ringOrAngle is always an angle

                    // If the previous vertex was not part of a ring, draw a bond based
                    // on the global angle of the previous bond
                    var v = new SmilesDrawer.Vector2(this.opts.bondLength, 0);
                    v.rotate(ringOrAngle);
                    v.add(previousVertex.position);

                    vertex.globalAngle = ringOrAngle;
                    vertex.setPositionFromVector(v);
                    vertex.previousPosition = previousVertex.position;
                    vertex.positioned = true;
                }
            }

            // Go to next vertex
            // If two rings are connected by a bond ...
            if (vertex.value.bridgedRing !== null) {
                var nextRing = this.getRing(vertex.value.bridgedRing);
                var nextCenter = SmilesDrawer.Vector2.subtract(vertex.previousPosition, vertex.position);

                nextCenter.invert();
                nextCenter.normalize();

                var r = SmilesDrawer.MathHelper.polyCircumradius(this.opts.bondLength, nextRing.members.length);
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertex.position);

                if (!nextRing.positioned) {
                    this.createRing(nextRing, nextCenter, vertex);
                }
            } else if (vertex.value.rings.length > 0) {
                var _nextRing = this.getRing(vertex.value.rings[0]);
                var _nextCenter2 = SmilesDrawer.Vector2.subtract(vertex.previousPosition, vertex.position);

                _nextCenter2.invert();
                _nextCenter2.normalize();

                var _r2 = SmilesDrawer.MathHelper.polyCircumradius(this.opts.bondLength, _nextRing.getSize());

                _nextCenter2.multiplyScalar(_r2);
                _nextCenter2.add(vertex.position);

                if (!_nextRing.positioned) {
                    this.createRing(_nextRing, _nextCenter2, vertex);
                }
            } else {
                // Draw the non-ring vertices connected to this one        
                var _neighbours2 = vertex.getNeighbours();

                if (previousVertex) {
                    _neighbours2 = SmilesDrawer.ArrayHelper.remove(_neighbours2, previousVertex.id);
                }

                var angle = vertex.getAngle();

                if (_neighbours2.length === 1) {
                    var nextVertex = this.graph.vertices[_neighbours2[0]];

                    // Make a single chain always cis except when there's a tribble (yes, this is a Star Trek reference) bond
                    // or if there are successive double bonds
                    if (vertex.value.bondType === '#' || previousVertex && previousVertex.value.bondType === '#' || vertex.value.bondType === '=' && previousVertex && previousVertex.value.bondType === '=') {
                        vertex.value.drawExplicit = false;

                        if (previousVertex) {
                            var straightEdge1 = this.graph.getEdge(vertex.id, previousVertex.id);
                            straightEdge1.center = true;
                        }

                        var straightEdge2 = this.graph.getEdge(vertex.id, nextVertex.id);
                        straightEdge2.center = true;

                        nextVertex.drawExplicit = true;
                        nextVertex.globalAngle = angle;
                        nextVertex.angle = 0.0;
                        this.createNextBond(nextVertex, vertex, nextVertex.globalAngle, -dir);
                    } else if (previousVertex && previousVertex.value.rings.length > 0) {
                        // If coming out of a ring, always draw away from the center of mass
                        var proposedAngleA = SmilesDrawer.MathHelper.toRad(60);
                        var proposedAngleB = -proposedAngleA;

                        var proposedVectorA = new SmilesDrawer.Vector2(this.opts.bondLength, 0);
                        var proposedVectorB = new SmilesDrawer.Vector2(this.opts.bondLength, 0);

                        proposedVectorA.rotate(proposedAngleA).add(vertex.position);
                        proposedVectorB.rotate(proposedAngleB).add(vertex.position);

                        // let centerOfMass = this.getCurrentCenterOfMassInNeigbourhood(vertex.position, 100);
                        var centerOfMass = this.getCurrentCenterOfMass();
                        var distanceA = proposedVectorA.distanceSq(centerOfMass);
                        var distanceB = proposedVectorB.distanceSq(centerOfMass);

                        nextVertex.angle = distanceA < distanceB ? proposedAngleB : proposedAngleA;

                        if (nextVertex.angle > 0) {
                            dir = -1;
                        } else {
                            dir = 1;
                        }

                        nextVertex.globalAngle = angle + nextVertex.angle;
                        this.createNextBond(nextVertex, vertex, nextVertex.globalAngle, dir);
                    } else {
                        if (!dir) {
                            var _proposedAngleA = SmilesDrawer.MathHelper.toRad(60);
                            var _proposedAngleB = -_proposedAngleA;

                            var _proposedVectorA = new SmilesDrawer.Vector2(this.opts.bondLength, 0);
                            var _proposedVectorB = new SmilesDrawer.Vector2(this.opts.bondLength, 0);

                            _proposedVectorA.rotate(_proposedAngleA).add(vertex.position);
                            _proposedVectorB.rotate(_proposedAngleB).add(vertex.position);

                            var _centerOfMass = this.getCurrentCenterOfMass();
                            var _distanceA = _proposedVectorA.distanceSq(_centerOfMass);
                            var _distanceB = _proposedVectorB.distanceSq(_centerOfMass);

                            nextVertex.angle = _distanceA < _distanceB ? _proposedAngleB : _proposedAngleA;

                            if (nextVertex.angle > 0) {
                                dir = -1;
                            } else {
                                dir = 1;
                            }
                        } else {
                            nextVertex.angle = SmilesDrawer.MathHelper.toRad(60) * dir;
                            dir = -dir;
                        }

                        nextVertex.globalAngle = angle + nextVertex.angle;
                        this.createNextBond(nextVertex, vertex, nextVertex.globalAngle, dir);
                    }
                } else if (_neighbours2.length === 2) {
                    // Check for the longer subtree - always go with cis for the longer subtree
                    var subTreeDepthA = this.getTreeDepth(_neighbours2[0], vertex.id);
                    var subTreeDepthB = this.getTreeDepth(_neighbours2[1], vertex.id);

                    // Also get the subtree for the previous direction (this is important when
                    // the previous vertex is the shortest path)
                    var subTreeDepthC = this.getTreeDepth(previousVertex ? previousVertex.id : null, vertex.id);

                    var cis = 0;
                    var trans = 1;

                    if (subTreeDepthA > subTreeDepthB) {
                        cis = 1;
                        trans = 0;
                    }

                    var cisVertex = this.graph.vertices[_neighbours2[cis]];
                    var transVertex = this.graph.vertices[_neighbours2[trans]];

                    // If the origin tree is the shortest, set both vertices to trans
                    if (subTreeDepthC < subTreeDepthA && subTreeDepthC < subTreeDepthB) {
                        if (vertex.position.clockwise(vertex.previousPosition) === 1) {
                            transVertex.angle = SmilesDrawer.MathHelper.toRad(60);
                            cisVertex.angle = -SmilesDrawer.MathHelper.toRad(60);
                            transVertex.globalAngle = angle + transVertex.angle;
                            cisVertex.globalAngle = angle + cisVertex.angle;

                            this.createNextBond(transVertex, vertex, transVertex.globalAngle, -dir);
                            this.createNextBond(cisVertex, vertex, cisVertex.globalAngle, dir);
                        } else {
                            transVertex.angle = -SmilesDrawer.MathHelper.toRad(60);
                            cisVertex.angle = SmilesDrawer.MathHelper.toRad(60);
                            transVertex.globalAngle = angle + transVertex.angle;
                            cisVertex.globalAngle = angle + cisVertex.angle;

                            this.createNextBond(cisVertex, vertex, cisVertex.globalAngle, dir);
                            this.createNextBond(transVertex, vertex, transVertex.globalAngle, -dir);
                        }
                    } else {
                        if (vertex.position.clockwise(vertex.previousPosition) === 1) {
                            transVertex.angle = SmilesDrawer.MathHelper.toRad(60);
                            cisVertex.angle = -SmilesDrawer.MathHelper.toRad(60);
                            transVertex.globalAngle = angle + transVertex.angle;
                            cisVertex.globalAngle = angle + cisVertex.angle;

                            this.createNextBond(transVertex, vertex, transVertex.globalAngle, -dir);
                            this.createNextBond(cisVertex, vertex, cisVertex.globalAngle, -dir);
                        } else {
                            transVertex.angle = -SmilesDrawer.MathHelper.toRad(60);
                            cisVertex.angle = SmilesDrawer.MathHelper.toRad(60);
                            transVertex.globalAngle = angle + transVertex.angle;
                            cisVertex.globalAngle = angle + cisVertex.angle;

                            this.createNextBond(cisVertex, vertex, cisVertex.globalAngle, -dir);
                            this.createNextBond(transVertex, vertex, transVertex.globalAngle, -dir);
                        }
                    }
                } else if (_neighbours2.length === 3) {
                    // The vertex with the longest sub-tree should always go straight
                    var d1 = this.getTreeDepth(_neighbours2[0], vertex.id);
                    var d2 = this.getTreeDepth(_neighbours2[1], vertex.id);
                    var d3 = this.getTreeDepth(_neighbours2[2], vertex.id);

                    var s = this.graph.vertices[_neighbours2[0]];
                    var l = this.graph.vertices[_neighbours2[1]];
                    var _r3 = this.graph.vertices[_neighbours2[2]];

                    if (d2 > d1 && d2 > d3) {
                        s = this.graph.vertices[_neighbours2[1]];
                        l = this.graph.vertices[_neighbours2[0]];
                        _r3 = this.graph.vertices[_neighbours2[2]];
                    } else if (d3 > d1 && d3 > d2) {
                        s = this.graph.vertices[_neighbours2[2]];
                        l = this.graph.vertices[_neighbours2[0]];
                        _r3 = this.graph.vertices[_neighbours2[1]];
                    }

                    if (this.getTreeDepth(l.id, vertex.id) === 1 && this.getTreeDepth(_r3.id, vertex.id) === 1 && this.getTreeDepth(s.id, vertex.id) > 1) {

                        if (!dir) {
                            var _proposedAngleA2 = SmilesDrawer.MathHelper.toRad(60);
                            var _proposedAngleB2 = -_proposedAngleA2;

                            var _proposedVectorA2 = new SmilesDrawer.Vector2(this.opts.bondLength, 0);
                            var _proposedVectorB2 = new SmilesDrawer.Vector2(this.opts.bondLength, 0);

                            _proposedVectorA2.rotate(_proposedAngleA2).add(vertex.position);
                            _proposedVectorB2.rotate(_proposedAngleB2).add(vertex.position);

                            // let centerOfMass = this.getCurrentCenterOfMassInNeigbourhood(vertex.position, 100);
                            var _centerOfMass2 = this.getCurrentCenterOfMass();
                            var _distanceA2 = _proposedVectorA2.distanceSq(_centerOfMass2);
                            var _distanceB2 = _proposedVectorB2.distanceSq(_centerOfMass2);

                            s.angle = _distanceA2 < _distanceB2 ? _proposedAngleB2 : _proposedAngleA2;

                            if (s.angle > 0) {
                                dir = -1;
                            } else {
                                dir = 1;
                            }
                        } else {
                            s.angle = SmilesDrawer.MathHelper.toRad(60) * dir;
                            dir = -dir;
                        }

                        s.globalAngle = angle + s.angle;

                        this.createNextBond(s, vertex, s.globalAngle, -dir);

                        // If it's chiral, the order changes - for anticlockwise, switch the draw order around
                        // to keep the drawing the same
                        if (vertex.value.bracket && vertex.value.bracket.chirality === '@@') {
                            _r3.angle = SmilesDrawer.MathHelper.toRad(30) * dir;
                            l.angle = SmilesDrawer.MathHelper.toRad(90) * dir;

                            _r3.globalAngle = angle + _r3.angle;
                            l.globalAngle = angle + l.angle;

                            this.createNextBond(_r3, vertex, _r3.globalAngle);
                            this.createNextBond(l, vertex, l.globalAngle);
                        } else {
                            l.angle = SmilesDrawer.MathHelper.toRad(30) * dir;
                            _r3.angle = SmilesDrawer.MathHelper.toRad(90) * dir;

                            l.globalAngle = angle + l.angle;
                            _r3.globalAngle = angle + _r3.angle;

                            this.createNextBond(l, vertex, l.globalAngle);
                            this.createNextBond(_r3, vertex, _r3.globalAngle);
                        }
                    } else {
                        s.angle = 0.0;
                        l.angle = SmilesDrawer.MathHelper.toRad(90);
                        _r3.angle = -SmilesDrawer.MathHelper.toRad(90);

                        s.globalAngle = angle + s.angle;
                        l.globalAngle = angle + l.angle;
                        _r3.globalAngle = angle + _r3.angle;

                        this.createNextBond(s, vertex, s.globalAngle);
                        this.createNextBond(l, vertex, l.globalAngle);
                        this.createNextBond(_r3, vertex, _r3.globalAngle);
                    }
                } else if (_neighbours2.length === 4) {
                    // The vertex with the longest sub-tree should always go to the reflected opposide direction
                    var _d = this.getTreeDepth(_neighbours2[0], vertex.id);
                    var _d2 = this.getTreeDepth(_neighbours2[1], vertex.id);
                    var _d3 = this.getTreeDepth(_neighbours2[2], vertex.id);
                    var d4 = this.getTreeDepth(_neighbours2[3], vertex.id);

                    var w = this.graph.vertices[_neighbours2[0]];
                    var x = this.graph.vertices[_neighbours2[1]];
                    var y = this.graph.vertices[_neighbours2[2]];
                    var z = this.graph.vertices[_neighbours2[3]];

                    if (_d2 > _d && _d2 > _d3 && _d2 > d4) {
                        w = this.graph.vertices[_neighbours2[1]];
                        x = this.graph.vertices[_neighbours2[0]];
                        y = this.graph.vertices[_neighbours2[2]];
                        z = this.graph.vertices[_neighbours2[3]];
                    } else if (_d3 > _d && _d3 > _d2 && _d3 > d4) {
                        w = this.graph.vertices[_neighbours2[2]];
                        x = this.graph.vertices[_neighbours2[0]];
                        y = this.graph.vertices[_neighbours2[1]];
                        z = this.graph.vertices[_neighbours2[3]];
                    } else if (d4 > _d && d4 > _d2 && d4 > _d3) {
                        w = this.graph.vertices[_neighbours2[3]];
                        x = this.graph.vertices[_neighbours2[0]];
                        y = this.graph.vertices[_neighbours2[1]];
                        z = this.graph.vertices[_neighbours2[2]];
                    }

                    w.angle = -SmilesDrawer.MathHelper.toRad(36);
                    x.angle = SmilesDrawer.MathHelper.toRad(36);
                    y.angle = -SmilesDrawer.MathHelper.toRad(108);
                    z.angle = SmilesDrawer.MathHelper.toRad(108);

                    w.globalAngle = angle + w.angle;
                    x.globalAngle = angle + x.angle;
                    y.globalAngle = angle + y.angle;
                    z.globalAngle = angle + z.angle;

                    this.createNextBond(w, vertex, w.globalAngle);
                    this.createNextBond(x, vertex, x.globalAngle);
                    this.createNextBond(y, vertex, y.globalAngle);
                    this.createNextBond(z, vertex, z.globalAngle);
                }
            }
        }

        /**
         * Gets the vetex sharing the edge that is the common bond of two rings.
         *
         * @param {SmilesDrawer.Vertex} vertex A vertex.
         * @returns {Number|null} The id of a vertex sharing the edge that is the common bond of two rings with the vertex provided or null, if none.
         */

    }, {
        key: 'getCommonRingbondNeighbour',
        value: function getCommonRingbondNeighbour(vertex) {
            var neighbours = vertex.getNeighbours();

            for (var i = 0; i < neighbours.length; i++) {
                var neighbour = this.graph.vertices[neighbours[i]];

                if (SmilesDrawer.ArrayHelper.All(neighbour.value.rings, vertex.value.rings)) {
                    return neighbour;
                }
            }

            return null;
        }

        /**
         * Check if a vector is inside any ring.
         *
         * @param {SmilesDrawer.Vector2} vec A vector.
         * @returns {Boolean} A boolean indicating whether or not the point (vector) is inside any of the rings associated with the current molecule.
         */

    }, {
        key: 'isPointInRing',
        value: function isPointInRing(vec) {
            for (var i = 0; i < this.rings.length; i++) {
                var ring = this.rings[i];

                if (!ring.positioned) {
                    continue;
                }

                var radius = SmilesDrawer.MathHelper.polyCircumradius(this.opts.bondLength, ring.getSize());
                var radiusSq = radius * radius;

                if (vec.distanceSq(ring.center) < radiusSq) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Check whether or not an edge is part of a ring.
         *
         * @param {SmilesDrawer.Edge} edge An edge.
         * @returns {Boolean} A boolean indicating whether or not the edge is part of a ring.
         */

    }, {
        key: 'isEdgeInRing',
        value: function isEdgeInRing(edge) {
            var source = this.graph.vertices[edge.sourceId];
            var target = this.graph.vertices[edge.targetId];

            return this.areVerticesInSameRing(source, target);
        }

        /**
         * Check whether or not an edge is rotatable.
         *
         * @param {SmilesDrawer.Edge} edge An edge.
         * @returns {Boolean} A boolean indicating whether or not the edge is rotatable.
         */

    }, {
        key: 'isEdgeRotatable',
        value: function isEdgeRotatable(edge) {
            var vertexA = this.graph.vertices[edge.sourceId];
            var vertexB = this.graph.vertices[edge.targetId];

            // Only single bonds are rotatable
            if (edge.bondType !== '-') {
                return false;
            }

            // Do not rotate edges that have a further single bond to each side
            // If the bond is terminal, it doesn't make sense to rotate it
            if (vertexA.getNeighbourCount() + vertexB.getNeighbourCount() < 5) {
                return false;
            }

            // Ringbonds are not rotatable
            if (vertexA.value.rings.length > 0 && vertexB.value.rings.length > 0 && this.areVerticesInSameRing(vertexA, vertexB)) {
                return false;
            }

            return true;
        }

        /**
         * Check whether or not a ring is an implicitly defined aromatic ring (lower case smiles).
         *
         * @param {SmilesDrawer.Ring} ring A ring.
         * @returns {Boolean} A boolean indicating whether or not a ring is implicitly defined as aromatic.
         */

    }, {
        key: 'isRingAromatic',
        value: function isRingAromatic(ring) {
            for (var i = 0; i < ring.members.length; i++) {
                var vertex = this.graph.vertices[ring.members[i]];

                if (!vertex.value.isPartOfAromaticRing) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Get the normals of an edge.
         *
         * @param {SmilesDrawer.Edge} edge An edge.
         * @returns {SmilesDrawer.Vector2[]} An array containing two vectors, representing the normals.
         */

    }, {
        key: 'getEdgeNormals',
        value: function getEdgeNormals(edge) {
            var v1 = this.graph.vertices[edge.sourceId].position;
            var v2 = this.graph.vertices[edge.targetId].position;

            // Get the normalized normals for the edge
            var normals = SmilesDrawer.Vector2.units(v1, v2);

            return normals;
        }

        /**
         * Get the depth of a subtree in the direction opposite to the vertex specified as the parent vertex.
         *
         * @param {Number} vertexId A vertex id.
         * @param {Number} parentVertexId The id of a neighbouring vertex.
         * @returns {Number} The depth of the sub-tree.
         */

    }, {
        key: 'getTreeDepth',
        value: function getTreeDepth(vertexId, parentVertexId) {
            if (vertexId === null || parentVertexId === null) {
                return 0;
            }

            var neighbours = this.graph.vertices[vertexId].getSpanningTreeNeighbours(parentVertexId);
            var max = 0;

            for (var i = 0; i < neighbours.length; i++) {
                var childId = neighbours[i];
                var d = this.getTreeDepth(childId, vertexId);

                if (d > max) {
                    max = d;
                }
            }

            return max + 1;
        }

        /**
         * Traverse a sub-tree in the graph.
         *
         * @param {Number} vertexId A vertex id.
         * @param {Number} parentVertexId A neighbouring vertex.
         * @param {Function} callback The callback function that is called with each visited as an argument.
         * @param {Number} [maxDepth=null] The maximum depth of the recursion. If null, there is no limit.
         * @param {Boolean} [ignoreFirst=false] Whether or not to ignore the starting vertex supplied as vertexId in the callback.
         */

    }, {
        key: 'traverseTree',
        value: function traverseTree(vertexId, parentVertexId, callback) {
            var maxDepth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var ignoreFirst = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            var depth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
            var visited = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

            if (maxDepth !== null && depth > maxDepth + 1) {
                return;
            }

            for (var j = 0; j < visited.length; j++) {
                if (visited[j] === vertexId) {
                    return;
                }
            }

            visited.push(vertexId);

            var vertex = this.graph.vertices[vertexId];
            var neighbours = vertex.getNeighbours(parentVertexId);

            if (!ignoreFirst || depth > 1) {
                callback(vertex);
            }

            for (var i = 0; i < neighbours.length; i++) {
                this.traverseTree(neighbours[i], vertexId, callback, maxDepth, ignoreFirst, depth + 1, visited);
            }
        }

        /**
         * Gets the number of bonds of a vertex.
         *
         * @param {SmilesDrawer.Vertex} vertex A vertex.
         * @returns {Number} The number of bonds the vertex participates in.
         */

    }, {
        key: 'getBondCount',
        value: function getBondCount(vertex) {
            var count = 0;

            for (var i = 0; i < vertex.edges.length; i++) {
                count += this.graph.edges[vertex.edges[i]].getBondCount();
            }

            return count;
        }

        /**
         * Returns an array of vertices that are neighbouring a vertix but are not members of a ring (including bridges).
         *
         * @param {Number} vertexId A vertex id.
         * @returns {SmilesDrawer.Vertex[]} An array of vertices.
         */

    }, {
        key: 'getNonRingNeighbours',
        value: function getNonRingNeighbours(vertexId) {
            var nrneighbours = [];
            var vertex = this.graph.vertices[vertexId];
            var neighbours = vertex.getNeighbours();

            for (var i = 0; i < neighbours.length; i++) {
                var neighbour = this.graph.vertices[neighbours[i]];
                var nIntersections = SmilesDrawer.ArrayHelper.intersection(vertex.value.rings, neighbour.value.rings).length;

                if (nIntersections === 0 && neighbour.value.isBridge == false) {
                    nrneighbours.push(neighbour);
                }
            }

            return nrneighbours;
        }
    }, {
        key: 'annotateStereochemistry',
        value: function annotateStereochemistry() {
            var _this = this;

            var maxDepth = 5;
            // For each stereo-center

            var _loop2 = function _loop2() {
                var vertex = _this.graph.vertices[i];

                if (!vertex.value.bracket || !vertex.value.bracket.chirality) {
                    return 'continue';
                }

                var neighbours = vertex.getNeighbours();
                var nNeighbours = neighbours.length;
                var priorities = Array(nNeighbours);

                for (j = 0; j < nNeighbours; j++) {
                    var visited = new Uint8Array(_this.graph.vertices.length);
                    var priority = new Uint16Array(maxDepth * 2.0 + 1);
                    visited[vertex.id] = 1;
                    _this.visitStereochemistry(neighbours[j], visited, priority, maxDepth, 0);

                    // Break ties by the position in the smiles string as per specification
                    priority[maxDepth * 2.0] = neighbours[j];
                    priorities[j] = [j, priority];
                }

                priorities.sort(function (a, b) {
                    for (var j = 0; j < nNeighbours; j++) {
                        if (a[1][j] > b[1][j]) {
                            return -1;
                        } else if (a[1][j] < b[1][j]) {
                            return 1;
                        }
                    }

                    return 0;
                });

                console.log(priorities);
            };

            for (var i = 0; i < this.graph.vertices.length; i++) {
                var j;

                var _ret2 = _loop2();

                if (_ret2 === 'continue') continue;
            }
        }
    }, {
        key: 'visitStereochemistry',
        value: function visitStereochemistry(vertexId, visited, priority, maxDepth, depth) {
            visited[vertexId] = 1;
            var atomicNumber = this.graph.vertices[vertexId].value.getAtomicNumber();

            priority[depth + depth] += atomicNumber;
            priority[maxDepth] = Math.max(priority[maxDepth], atomicNumber);

            var neighbours = this.graph.vertices[vertexId].getNeighbours();

            for (var i = 0; i < neighbours.length; i++) {
                if (visited[neighbours[i]] !== 1 && depth < maxDepth - 1) {
                    this.visitStereochemistry(neighbours[i], visited, priority, maxDepth, depth + 1);
                }
            }
        }

        /**
         * Creates pseudo-elements (such as Et, Me, Ac, Bz, ...) at the position of the carbon sets
         * the involved atoms not to be displayed.
         */

    }, {
        key: 'initPseudoElements',
        value: function initPseudoElements() {
            for (var i = 0; i < this.graph.vertices.length; i++) {
                var _vertex4 = this.graph.vertices[i];
                var neighbourIds = _vertex4.getNeighbours();
                var _neighbours3 = [];

                for (var j = 0; j < neighbourIds.length; j++) {
                    _neighbours3.push(this.graph.vertices[neighbourIds[j]]);
                }

                // Ignore atoms that have less than 3 neighbours, except if
                // the vertex is connected to a ring and has two neighbours
                if (_vertex4.getNeighbourCount() < 3 || _vertex4.value.rings.length > 0) {
                    continue;
                }

                // Continue if there are less than two heteroatoms
                // or if a neighbour has more than 1 neighbour
                var heteroAtomCount = 0;
                var ctn = 0;

                for (var j = 0; j < _neighbours3.length; j++) {
                    var neighbour = _neighbours3[j];
                    var neighbouringElement = neighbour.value.element;
                    var neighbourCount = neighbour.getNeighbourCount();

                    if (neighbouringElement !== 'C' && neighbouringElement !== 'H' && neighbourCount === 1) {
                        heteroAtomCount++;
                    }

                    if (neighbourCount > 1) {
                        ctn++;
                    }
                }

                if (ctn > 1 || heteroAtomCount < 2) {
                    continue;
                }

                // Get the previous atom (the one which is not terminal)
                var previous = null;

                for (var j = 0; j < _neighbours3.length; j++) {
                    var _neighbour3 = _neighbours3[j];

                    if (_neighbour3.getNeighbourCount() > 1) {
                        previous = _neighbour3;
                    }
                }

                for (var j = 0; j < _neighbours3.length; j++) {
                    var _neighbour4 = _neighbours3[j];

                    if (_neighbour4.getNeighbourCount() > 1) {
                        continue;
                    }

                    _neighbour4.value.isDrawn = false;

                    var hydrogens = SmilesDrawer.Atom.maxBonds[_neighbour4.value.element] - this.getBondCount(_neighbour4);

                    if (_neighbour4.value.bracket) {
                        hydrogens = _neighbour4.value.bracket.hcount;
                    }

                    _vertex4.value.attachPseudoElement(_neighbour4.value.element, previous ? previous.value.element : null, hydrogens);
                }
            }

            // The second pass
            for (var i = 0; i < this.graph.vertices.length; i++) {
                var _vertex5 = this.graph.vertices[i];
                var atom = _vertex5.value;
                var _element3 = atom.element;

                if (_element3 === 'C' || _element3 === 'H' || !atom.isDrawn) {
                    continue;
                }

                var _neighbourIds = _vertex5.getNeighbours();
                var _neighbours4 = [];

                for (var j = 0; j < _neighbourIds.length; j++) {
                    _neighbours4.push(this.graph.vertices[_neighbourIds[j]]);
                }

                for (var j = 0; j < _neighbours4.length; j++) {
                    var _neighbour5 = _neighbours4[j].value;

                    if (!_neighbour5.hasAttachedPseudoElements || _neighbour5.getAttachedPseudoElementsCount() !== 2) {
                        continue;
                    }

                    var pseudoElements = _neighbour5.getAttachedPseudoElements();

                    if (pseudoElements.hasOwnProperty('0O') && pseudoElements.hasOwnProperty('3C')) {
                        _neighbour5.isDrawn = false;
                        _vertex5.value.attachPseudoElement('Ac', '', 0);
                    }
                }
            }
        }
    }]);

    return Drawer;
}();
/** 
 * A class representing an edge. 
 * 
 * @property {Number} id The id of this edge.
 * @property {Number} sourceId The id of the source vertex.
 * @property {Number} targetId The id of the target vertex.
 * @property {Number} weight The weight of this edge.
 * @property {String} [bondType='-'] The bond type of this edge.
 * @property {Boolean} [isPartOfAromaticRing=false] Whether or not this edge is part of an aromatic ring.
 * @property {Boolean} [center=false] Wheter or not the bond is centered. For example, this affects straight double bonds.
 * @property {String} [chiral=''] Chirality information.
 */
SmilesDrawer.Edge = function () {
    /**
     * The constructor for the class Edge.
     *
     * @param {Number} sourceId A vertex id.
     * @param {Number} targetId A vertex id.
     * @param {Number} [weight=1] The weight of the edge.
     */
    function Edge(sourceId, targetId) {
        var weight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        _classCallCheck(this, Edge);

        this.id = null;
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.weight = weight;
        this.bondType = '-';
        this.isPartOfAromaticRing = false;
        this.center = false;
        this.chiral = '';
    }

    /**
     * Returns the number of bonds associated with the bond type of this edge.
     *
     * @returns {Number} The number of bonds associated with this edge.
     */


    _createClass(Edge, [{
        key: 'getBondCount',
        value: function getBondCount() {
            return Edge.bonds[this.bondType];
        }

        /**
         * An object mapping the bond type to the number of bonds.
         *
         * @returns {Object} The object containing the map.
         */

    }], [{
        key: 'bonds',
        get: function get() {
            return {
                '-': 1,
                '/': 1,
                '\\': 1,
                '=': 2,
                '#': 3,
                '$': 4
            };
        }
    }]);

    return Edge;
}();

/** 
 * A class representing the molecular graph. 
 * 
 * @property {SmilesDrawer.Vertex[]} vertices The vertices of the graph.
 * @property {SmilesDrawer.Edge[]} edges The edges of this graph.
 * @property {Object} vertexIdsToEdgeId A map mapping vertex ids to the edge between the two vertices. The key is defined as vertexAId + '_' + vertexBId.
 * @property {Object} elementCount A map associating element symbols with the number of occurences in this graph.
 * @property {Boolean} isometric A boolean indicating whether or not the SMILES associated with this graph is isometric.
 */
SmilesDrawer.Graph = function () {
    /**
     * The constructor of the class Graph.
     * 
     * @param {Object} parseTree A SMILES parse tree.
     * @param {Boolean} [isomeric=false] A boolean specifying whether or not the SMILES is isomeric.
     */
    function Graph(parseTree) {
        var isomeric = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Graph);

        this.vertices = [];
        this.edges = [];
        this.vertexIdsToEdgeId = {};
        this.elementCount = {};
        this.isomeric = isomeric;

        // Used for the bridge detection algorithm
        this._time = 0;
        this._init(parseTree);
        this._initInfos();
    }

    /**
     * PRIVATE FUNCTION. Initializing the graph from the parse tree.
     *
     * @param {Object} node The current node in the parse tree.
     * @param {Number} parentVertexId=null The id of the previous vertex.
     * @param {Boolean} isBranch=false Whether or not the bond leading to this vertex is a branch bond. Branches are represented by parentheses in smiles (e.g. CC(O)C).
     */


    _createClass(Graph, [{
        key: '_init',
        value: function _init(node) {
            var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var parentVertexId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var isBranch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            // Create a new vertex object
            var atom = new SmilesDrawer.Atom(node.atom.element ? node.atom.element : node.atom, node.bond);

            atom.branchBond = node.branchBond;
            atom.ringbonds = node.ringbonds;
            atom.bracket = node.atom.element ? node.atom : null;
            atom.setOrder(parentVertexId, order);

            var vertex = new SmilesDrawer.Vertex(atom);
            var parentVertex = this.vertices[parentVertexId];

            this.addVertex(vertex);

            // Add the id of this node to the parent as child
            if (parentVertexId !== null) {
                vertex.setParentVertexId(parentVertexId);
                vertex.value.addNeighbouringElement(parentVertex.value.element);
                parentVertex.addChild(vertex.id);
                parentVertex.value.addNeighbouringElement(atom.element);

                // In addition create a spanningTreeChildren property, which later will
                // not contain the children added through ringbonds
                parentVertex.spanningTreeChildren.push(vertex.id);

                // Add edge between this node and its parent
                var edge = new SmilesDrawer.Edge(parentVertexId, vertex.id, 1);

                if (isBranch) {
                    edge.bondType = vertex.value.branchBond;
                } else {
                    edge.bondType = parentVertex.value.bondType;
                }

                var edgeId = this.addEdge(edge);
                vertex.edges.push(edgeId);
                parentVertex.edges.push(edgeId);
            }

            if (atom.bracket && this.isomeric) {
                for (var i = 0; i < atom.bracket.hcount; i++) {
                    if (this.isomeric) {
                        this._init({ atom: { element: 'H', bond: '-' }, ringbonds: [] }, i + 1, vertex.id);
                    }
                }
            }

            var offset = node.ringbondCount + 1;

            if (atom.bracket) {
                offset += atom.bracket.hcount;
            }

            for (var i = 0; i < node.branchCount; i++) {
                this._init(node.branches[i], i + offset, vertex.id, true);
            }

            if (node.hasNext) {
                this._init(node.next, node.branchCount + offset, vertex.id);
            }
        }

        /**
         * PRIVATE FUNCTION. Initializes element counts etc.
         */

    }, {
        key: '_initInfos',
        value: function _initInfos() {
            for (var i = 0; i < this.vertices.length; i++) {
                var atom = this.vertices[i].value;

                if (typeof this.elementCount[atom.element] !== 'undefined') {
                    this.elementCount[atom.element] += 1;
                } else {
                    this.elementCount[atom.element] = 0;
                }
            }
        }

        /**
         * Clears all the elements in this graph (edges and vertices).
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.vertices = [];
            this.edges = [];
            this.vertexIdsToEdgeId = {};
        }

        /**
         * Add a vertex to the graph.
         *
         * @param {SmilesDrawer.Vertex} vertex A new vertex.
         * @returns {Number} The vertex id of the new vertex.
         */

    }, {
        key: 'addVertex',
        value: function addVertex(vertex) {
            vertex.id = this.vertices.length;
            this.vertices.push(vertex);

            return vertex.id;
        }

        /**
         * Add an edge to the graph.
         *
         * @param {SmilesDrawer.Edge} edge A new edge.
         * @returns {Number} The edge id of the new edge.
         */

    }, {
        key: 'addEdge',
        value: function addEdge(edge) {
            edge.id = this.edges.length;
            this.edges.push(edge);

            this.vertexIdsToEdgeId[edge.sourceId + '_' + edge.targetId] = edge.id;
            this.vertexIdsToEdgeId[edge.targetId + '_' + edge.sourceId] = edge.id;
            edge.isPartOfAromaticRing = this.vertices[edge.sourceId].value.isPartOfAromaticRing && this.vertices[edge.targetId].value.isPartOfAromaticRing;

            return edge.id;
        }

        /**
         * Returns the edge between two given vertices.
         *
         * @param {Number} vertexIdA A vertex id.
         * @param {Number} vertexIdB A vertex id.
         * @returns {Number|null} The edge or, if no edge can be found, null.
         */

    }, {
        key: 'getEdge',
        value: function getEdge(vertexIdA, vertexIdB) {
            var edgeId = this.vertexIdsToEdgeId[vertexIdA + '_' + vertexIdB];

            return edgeId === undefined ? null : this.edges[edgeId];
        }

        /**
         * Returns the ids of edges connected to a vertex.
         *
         * @param {Number} vertexId A vertex id.
         * @returns {Array[]} An array containing the ids of edges connected to the vertex.
         */

    }, {
        key: 'getEdges',
        value: function getEdges(vertexId) {
            var edgeIds = Array();
            var vertex = this.vertices[vertexId];

            for (var i = 0; i < vertex.neighbours.length; i++) {
                edgeIds.push(this.vertexIdsToEdgeId[vertexId + '_' + vertex.neighbours[i]]);
            }

            return edgeIds;
        }

        /**
         * Returns the edge between two given vertices.
         *
         * @param {Number} vertexIdA A vertex id.
         * @param {Number} vertexIdB A vertex id.
         * @returns {Number|null} The edge or, if no edge can be found, null.
         */

    }, {
        key: 'hasEdge',
        value: function hasEdge(vertexIdA, vertexIdB) {
            return this.vertexIdsToEdgeId[vertexIdA + '_' + vertexIdB] !== undefined;
        }

        /**
         * Returns an array containing the vertex ids of this graph.
         * 
         * @returns {Number[]} An array containing all vertex ids of this graph.
         */

    }, {
        key: 'getVertexList',
        value: function getVertexList() {
            var arr = [this.vertices.length];

            for (var i = 0; i < this.vertices.length; i++) {
                arr[i] = this.vertices[i].id;
            }

            return arr;
        }

        /**
         * Returns an array containing source, target arrays of this graphs edges.
         * 
         * @returns {Array[]} An array containing source, target arrays of this graphs edges. Example: [ [ 2, 5 ], [ 6, 9 ] ].
         */

    }, {
        key: 'getEdgeList',
        value: function getEdgeList() {
            var arr = [this.edges.length];

            for (var i = 0; i < this.edges.length; i++) {
                arr[i] = [this.edges[i].sourceId, this.edges[i].targetId];
            }

            return arr;
        }

        /**
         * Get the adjacency matrix of the graph.
         * 
         * @returns {Array[]} The adjancency matrix of the molecular graph.
         */

    }, {
        key: 'getAdjacencyMatrix',
        value: function getAdjacencyMatrix() {
            var length = this.vertices.length;
            var adjacencyMatrix = Array(length);

            for (var i = 0; i < length; i++) {
                adjacencyMatrix[i] = new Array(length);
                adjacencyMatrix[i].fill(0);
            }

            for (var i = 0; i < this.edges.length; i++) {
                var edge = this.edges[i];

                adjacencyMatrix[edge.sourceId][edge.targetId] = 1;
                adjacencyMatrix[edge.targetId][edge.sourceId] = 1;
            }

            return adjacencyMatrix;
        }

        /**
         * Get the adjacency matrix of the graph with all bridges removed (thus the components). Thus the remaining vertices are all part of ring systems.
         * 
         * @returns {Array[]} The adjancency matrix of the molecular graph with all bridges removed.
         */

    }, {
        key: 'getComponentsAdjacencyMatrix',
        value: function getComponentsAdjacencyMatrix() {
            var length = this.vertices.length;
            var adjacencyMatrix = Array(length);
            var bridges = this.getBridges();

            for (var i = 0; i < length; i++) {
                adjacencyMatrix[i] = new Array(length);
                adjacencyMatrix[i].fill(0);
            }

            for (var i = 0; i < this.edges.length; i++) {
                var edge = this.edges[i];

                adjacencyMatrix[edge.sourceId][edge.targetId] = 1;
                adjacencyMatrix[edge.targetId][edge.sourceId] = 1;
            }

            for (var i = 0; i < bridges.length; i++) {
                adjacencyMatrix[bridges[i][0]][bridges[i][1]] = 0;
                adjacencyMatrix[bridges[i][1]][bridges[i][0]] = 0;
            }

            return adjacencyMatrix;
        }

        /**
         * Get the adjacency matrix of a subgraph.
         * 
         * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
         * @returns {Array[]} The adjancency matrix of the subgraph.
         */

    }, {
        key: 'getSubgraphAdjacencyMatrix',
        value: function getSubgraphAdjacencyMatrix(vertexIds) {
            var length = vertexIds.length;
            var adjacencyMatrix = Array(length);

            for (var i = 0; i < length; i++) {
                adjacencyMatrix[i] = new Array(length);
                adjacencyMatrix[i].fill(0);

                for (var j = 0; j < length; j++) {
                    if (i === j) {
                        continue;
                    }

                    if (this.hasEdge(vertexIds[i], vertexIds[j])) {
                        adjacencyMatrix[i][j] = 1;
                    }
                }
            }

            return adjacencyMatrix;
        }

        /**
         * Get the distance matrix of the graph.
         * 
         * @returns {Array[]} The distance matrix of the graph.
         */

    }, {
        key: 'getDistanceMatrix',
        value: function getDistanceMatrix() {
            var length = this.vertices.length;
            var adja = this.getAdjacencyMatrix();
            var dist = Array(length);

            for (var i = 0; i < length; i++) {
                dist[i] = Array(length);
                dist[i].fill(Infinity);
            }

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (adja[i][j] === 1) {
                        dist[i][j] = 1;
                    }
                }
            }

            for (var k = 0; k < length; k++) {
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (dist[i][j] > dist[i][k] + dist[k][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }

            return dist;
        }

        /**
         * Get the distance matrix of a subgraph.
         * 
         * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
         * @returns {Array[]} The distance matrix of the subgraph.
         */

    }, {
        key: 'getSubgraphDistanceMatrix',
        value: function getSubgraphDistanceMatrix(vertexIds) {
            var length = vertexIds.length;
            var adja = this.getSubgraphAdjacencyMatrix(vertexIds);
            var dist = Array(length);

            for (var i = 0; i < length; i++) {
                dist[i] = Array(length);
                dist[i].fill(Infinity);
            }

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (adja[i][j] === 1) {
                        dist[i][j] = 1;
                    }
                }
            }

            for (var k = 0; k < length; k++) {
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (dist[i][j] > dist[i][k] + dist[k][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }

            return dist;
        }

        /**
         * Get the adjacency list of the graph.
         * 
         * @returns {Array[]} The adjancency list of the graph.
         */

    }, {
        key: 'getAdjacencyList',
        value: function getAdjacencyList() {
            var length = this.vertices.length;
            var adjacencyList = Array(length);

            for (var i = 0; i < length; i++) {
                adjacencyList[i] = [];

                for (var j = 0; j < length; j++) {
                    if (i === j) {
                        continue;
                    }

                    if (this.hasEdge(this.vertices[i].id, this.vertices[j].id)) {
                        adjacencyList[i].push(j);
                    }
                }
            }

            return adjacencyList;
        }

        /**
         * Get the adjacency list of a subgraph.
         * 
         * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
         * @returns {Array[]} The adjancency list of the subgraph.
         */

    }, {
        key: 'getSubgraphAdjacencyList',
        value: function getSubgraphAdjacencyList(vertexIds) {
            var length = vertexIds.length;
            var adjacencyList = Array(length);

            for (var i = 0; i < length; i++) {
                adjacencyList[i] = [];

                for (var j = 0; j < length; j++) {
                    if (i === j) {
                        continue;
                    }

                    if (this.hasEdge(vertexIds[i], vertexIds[j])) {
                        adjacencyList[i].push(j);
                    }
                }
            }

            return adjacencyList;
        }

        /**
         * Returns an array containing the edge ids of bridges. A bridge splits the graph into multiple components when removed.
         * 
         * @returns {Number[]} An array containing the edge ids of the bridges.
         */

    }, {
        key: 'getBridges',
        value: function getBridges() {
            var length = this.vertices.length;
            var visited = new Array(length);
            var disc = new Array(length);
            var low = new Array(length);
            var parent = new Array(length);
            var adj = this.getAdjacencyList();
            var outBridges = [];

            visited.fill(false);
            parent.fill(null);
            this._time = 0;

            for (var i = 0; i < length; i++) {
                if (!visited[i]) {
                    this._bridgeDfs(i, visited, disc, low, parent, adj, outBridges);
                }
            }

            return outBridges;
        }

        /**
         * Traverses the graph in breadth-first order.
         * 
         * @param {Number} startVertexId The id of the starting vertex.
         * @param {Function} callback The callback function to be called on every vertex.
         */

    }, {
        key: 'traverseBF',
        value: function traverseBF(startVertexId, callback) {
            var length = this.vertices.length;
            var visited = new Array(length);

            visited.fill(false);

            var queue = [startVertexId];

            while (queue.length > 0) {
                // JavaScripts shift() is O(n) ... bad JavaScript, bad!
                var u = queue.shift();
                var _vertex6 = this.vertices[u];

                callback(_vertex6);

                for (var i = 0; i < _vertex6.neighbours.length; i++) {
                    var v = _vertex6.neighbours[i];
                    if (!visited[v]) {
                        visited[v] = true;
                        queue.push(v);
                    }
                }
            }
        }

        /**
         * Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs. https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
         * 
         * @param {Number[]} vertexIds An array containing vertexIds to be placed using the force based layout.
         * @param {Array[]} outAdditionallyPositioned Vertices connected to the bridged ring which were also positioned. Include the ring vertex id they are attached to in the form: [ [ vertexId, ringVertexId ] ].
         * @param {SmilesDrawer.Vector2} center The center of the layout.
         * @param {Number} startVertexId A vertex id. Should be the starting vertex - e.g. the first to be positioned and connected to a previously place vertex.
         * @param {SmilesDrawer.Ring} ring The bridged ring associated with this force-based layout.
         */

    }, {
        key: 'kkLayout',
        value: function kkLayout(vertexIds, outAdditionallyPositioned, center, startVertexId, ring, bondLength) {
            var edgeStrength = bondLength;

            // Add vertices that are directly connected to the ring
            var i = vertexIds.length;
            while (i--) {
                var _vertex7 = this.vertices[vertexIds[i]];
                var j = _vertex7.neighbours.length;
                while (j--) {
                    var neighbour = this.vertices[_vertex7.neighbours[j]];
                    if (neighbour.value.rings.length === 0 && vertexIds.indexOf(neighbour.id) === -1) {
                        vertexIds.push(neighbour.id);
                        outAdditionallyPositioned.push([neighbour.id, _vertex7.id]);
                    }
                }
            }

            var matDist = this.getSubgraphDistanceMatrix(vertexIds);
            var length = vertexIds.length;

            // Initialize the positions. Place all vertices on a ring around the center
            var radius = SmilesDrawer.MathHelper.polyCircumradius(500, length);
            var angle = SmilesDrawer.MathHelper.centralAngle(length);
            var a = 0.0;
            var arrPositionX = new Float32Array(length);
            var arrPositionY = new Float32Array(length);
            var arrPositioned = Array(length);
            i = length;
            while (i--) {
                var _vertex8 = this.vertices[vertexIds[i]];
                if (!_vertex8.positioned) {
                    arrPositionX[i] = center.x + Math.cos(a) * radius;
                    arrPositionY[i] = center.y + Math.sin(a) * radius;
                } else {
                    arrPositionX[i] = _vertex8.position.x;
                    arrPositionY[i] = _vertex8.position.y;
                }
                arrPositioned[i] = _vertex8.positioned;
                a += angle;
            }

            // Create the matrix containing the lengths
            var matLength = Array(length);
            i = length;
            while (i--) {
                matLength[i] = new Array(length);
                var j = length;
                while (j--) {
                    matLength[i][j] = bondLength * matDist[i][j];
                }
            }

            // Create the matrix containing the spring strenghts
            var matStrength = Array(length);
            i = length;
            while (i--) {
                matStrength[i] = Array(length);
                var j = length;
                while (j--) {
                    matStrength[i][j] = edgeStrength * Math.pow(matDist[i][j], -2);
                }
            }

            // Create the matrix containing the energies
            var matEnergy = Array(length);
            var arrEnergySumX = new Float32Array(length);
            var arrEnergySumY = new Float32Array(length);
            i = length;
            while (i--) {
                matEnergy[i] = Array(length);
            }

            i = length;
            var ux = void 0,
                uy = void 0,
                dEx = void 0,
                dEy = void 0,
                vx = void 0,
                vy = void 0,
                denom = void 0;

            while (i--) {
                ux = arrPositionX[i];
                uy = arrPositionY[i];
                dEx = 0.0;
                dEy = 0.0;
                var _j2 = length;
                while (_j2--) {
                    if (i === _j2) {
                        continue;
                    }
                    vx = arrPositionX[_j2];
                    vy = arrPositionY[_j2];
                    denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                    matEnergy[i][_j2] = [matStrength[i][_j2] * (ux - vx - matLength[i][_j2] * (ux - vx) * denom), matStrength[i][_j2] * (uy - vy - matLength[i][_j2] * (uy - vy) * denom)];
                    matEnergy[_j2][i] = matEnergy[i][_j2];
                    dEx += matEnergy[i][_j2][0];
                    dEy += matEnergy[i][_j2][1];
                }
                arrEnergySumX[i] = dEx;
                arrEnergySumY[i] = dEy;
            }

            // Utility functions, maybe inline them later
            var energy = function energy(index) {
                return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]];
            };

            var highestEnergy = function highestEnergy() {
                var maxEnergy = 0.0;
                var maxEnergyId = 0;
                var maxDEX = 0.0;
                var maxDEY = 0.0;

                i = length;
                while (i--) {
                    var _energy = energy(i),
                        _energy2 = _slicedToArray(_energy, 3),
                        _delta = _energy2[0],
                        _dEX = _energy2[1],
                        _dEY = _energy2[2];

                    if (_delta > maxEnergy && arrPositioned[i] === false) {
                        maxEnergy = _delta;
                        maxEnergyId = i;
                        maxDEX = _dEX;
                        maxDEY = _dEY;
                    }
                }

                return [maxEnergyId, maxEnergy, maxDEX, maxDEY];
            };

            var update = function update(index, dEX, dEY) {
                var dxx = 0.0;
                var dyy = 0.0;
                var dxy = 0.0;
                var ux = arrPositionX[index];
                var uy = arrPositionY[index];
                var arrL = matLength[index];
                var arrK = matStrength[index];

                i = length;
                while (i--) {
                    if (i === index) {
                        continue;
                    }

                    var _vx = arrPositionX[i];
                    var _vy = arrPositionY[i];
                    var l = arrL[i];
                    var k = arrK[i];
                    var m = (ux - _vx) * (ux - _vx);
                    var _denom = 1.0 / Math.pow(m + (uy - _vy) * (uy - _vy), 1.5);
                    dxx += k * (1 - l * (uy - _vy) * (uy - _vy) * _denom);
                    dyy += k * (1 - l * m * _denom);
                    dxy += k * (l * (ux - _vx) * (uy - _vy) * _denom);
                }

                // Prevent division by zero
                if (dxx === 0) {
                    dxx = 0.1;
                }

                if (dyy === 0) {
                    dyy = 0.1;
                }

                if (dxy === 0) {
                    dxy = 0.1;
                }

                var dy = dEX / dxx + dEY / dxy;
                dy /= dxy / dxx - dyy / dxy; // had to split this onto two lines because the syntax highlighter went crazy.
                var dx = -(dxy * dy + dEX) / dxx;

                arrPositionX[index] += dx;
                arrPositionY[index] += dy;

                // Update the energies
                var arrE = matEnergy[index];
                dEX = 0.0;
                dEY = 0.0;

                ux = arrPositionX[index];
                uy = arrPositionY[index];

                var vx = void 0,
                    vy = void 0,
                    prevEx = void 0,
                    prevEy = void 0,
                    denom = void 0;

                i = length;
                while (i--) {
                    if (index === i) {
                        continue;
                    }
                    vx = arrPositionX[i];
                    vy = arrPositionY[i];
                    // Store old energies
                    prevEx = arrE[i][0];
                    prevEy = arrE[i][1];
                    denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                    dx = arrK[i] * (ux - vx - arrL[i] * (ux - vx) * denom);
                    dy = arrK[i] * (uy - vy - arrL[i] * (uy - vy) * denom);

                    arrE[i] = [dx, dy];
                    dEX += dx;
                    dEY += dy;
                    arrEnergySumX[i] += dx - prevEx;
                    arrEnergySumY[i] += dy - prevEy;
                }
                arrEnergySumX[index] = dEX;
                arrEnergySumY[index] = dEY;
            };

            // Setting parameters
            var threshold = 0.1;
            var innerThreshold = 0.1;
            var maxIteration = 1000;
            var maxInnerIteration = 50;
            var maxEnergy = 1e9;

            // Setting up variables for the while loops
            var maxEnergyId = 0;
            var dEX = 0.0;
            var dEY = 0.0;
            var delta = 0.0;
            var iteration = 0;
            var innerIteration = 0;

            while (maxEnergy > threshold && maxIteration > iteration) {
                iteration++;

                var _highestEnergy = highestEnergy();

                var _highestEnergy2 = _slicedToArray(_highestEnergy, 4);

                maxEnergyId = _highestEnergy2[0];
                maxEnergy = _highestEnergy2[1];
                dEX = _highestEnergy2[2];
                dEY = _highestEnergy2[3];

                delta = maxEnergy;
                innerIteration = 0;
                while (delta > innerThreshold && maxInnerIteration > innerIteration) {
                    innerIteration++;
                    update(maxEnergyId, dEX, dEY);

                    var _energy3 = energy(maxEnergyId);

                    var _energy4 = _slicedToArray(_energy3, 3);

                    delta = _energy4[0];
                    dEX = _energy4[1];
                    dEY = _energy4[2];
                }
            }

            i = length;
            while (i--) {
                var index = vertexIds[i];
                var _vertex9 = this.vertices[index];
                _vertex9.position.x = arrPositionX[i];
                _vertex9.position.y = arrPositionY[i];
                _vertex9.positioned = true;
                _vertex9.forcePositioned = true;
            }
        }

        /**
         * PRIVATE FUNCTION used by getBridges().
         */

    }, {
        key: '_bridgeDfs',
        value: function _bridgeDfs(u, visited, disc, low, parent, adj, outBridges) {
            visited[u] = true;
            disc[u] = low[u] = ++this._time;

            for (var i = 0; i < adj[u].length; i++) {
                var v = adj[u][i];

                if (!visited[v]) {
                    parent[v] = u;

                    this._bridgeDfs(v, visited, disc, low, parent, adj, outBridges);

                    low[u] = Math.min(low[u], low[v]);

                    // If low > disc, we have a bridge
                    if (low[v] > disc[u]) {
                        outBridges.push([u, v]);
                    }
                } else if (v !== parent[u]) {
                    low[u] = Math.min(low[u], disc[v]);
                }
            }
        }

        /**
         * Returns the connected components of the graph.
         * 
         * @param {Array[]} adjacencyMatrix An adjacency matrix.
         * @returns {Set[]} Connected components as sets.
         */

    }], [{
        key: 'getConnectedComponents',
        value: function getConnectedComponents(adjacencyMatrix) {
            var length = adjacencyMatrix.length;
            var visited = new Array(length);
            var components = new Array();
            var count = 0;

            visited.fill(false);

            for (var u = 0; u < length; u++) {
                if (!visited[u]) {
                    var component = Array();
                    visited[u] = true;
                    component.push(u);
                    count++;
                    Graph._ccGetDfs(u, visited, adjacencyMatrix, component);
                    if (component.length > 1) {
                        components.push(component);
                    }
                }
            }

            return components;
        }

        /**
         * Returns the number of connected components for the graph. 
         * 
         * @param {Array[]} adjacencyMatrix An adjacency matrix.
         * @returns {Number} The number of connected components of the supplied graph.
         */

    }, {
        key: 'getConnectedComponentCount',
        value: function getConnectedComponentCount(adjacencyMatrix) {
            var length = adjacencyMatrix.length;
            var visited = new Array(length);
            var count = 0;

            visited.fill(false);

            for (var u = 0; u < length; u++) {
                if (!visited[u]) {
                    visited[u] = true;
                    count++;
                    Graph._ccCountDfs(u, visited, adjacencyMatrix);
                }
            }

            return count;
        }

        /**
         * PRIVATE FUNCTION used by getConnectedComponentCount().
         */

    }, {
        key: '_ccCountDfs',
        value: function _ccCountDfs(u, visited, adjacencyMatrix) {
            for (var v = 0; v < adjacencyMatrix[u].length; v++) {
                var c = adjacencyMatrix[u][v];

                if (!c || visited[v] || u === v) {
                    continue;
                }

                visited[v] = true;
                Graph._ccCountDfs(v, visited, adjacencyMatrix);
            }
        }

        /**
         * PRIVATE FUNCTION used by getConnectedComponents().
         */

    }, {
        key: '_ccGetDfs',
        value: function _ccGetDfs(u, visited, adjacencyMatrix, component) {
            for (var v = 0; v < adjacencyMatrix[u].length; v++) {
                var c = adjacencyMatrix[u][v];

                if (!c || visited[v] || u === v) {
                    continue;
                }

                visited[v] = true;
                component.push(v);
                Graph._ccGetDfs(v, visited, adjacencyMatrix, component);
            }
        }
    }]);

    return Graph;
}();
/** 
 * A class representing a line.
 * 
 * @property {SmilesDrawer.Vector2} from The SmilesDrawer.Vector2 defining the start of the line.
 * @property {SmilesDrawer.Vector2} to The SmilesDrawer.Vector2 defining the end of the line.
 * @property {String} elementFrom The element symbol associated with the start of the line.
 * @property {String} elementTo The element symbol associated with the end of the line.
 * @property {Boolean} chiralFrom A boolean indicating whether or not the source atom is a chiral center.
 * @property {Boolean} chiralTo A boolean indicating whether or tno the target atom is a chiral center.
 */
SmilesDrawer.Line = function () {
    /**
     * The constructor for the class Line.
     *
     * @param {Vector2} [from=new Vector2(0, 0)] A vector marking the beginning of the line.
     * @param {Vector2} [to=new Vector2(0, 0)] A vector marking the end of the line.
     * @param {string} [elementFrom=null] A one-letter representation of the element associated with the vector marking the beginning of the line.
     * @param {string} [elementTo=null] A one-letter representation of the element associated with the vector marking the end of the line.
     * @param {boolean} [chiralFrom=false] Whether or not the from atom is a chiral center.
     * @param {boolean} [chiralTo=false] Whether or not the to atom is a chiral center.
     */
    function Line() {
        var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new SmilesDrawer.Vector2(0, 0);
        var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new SmilesDrawer.Vector(0, 0);
        var elementFrom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var elementTo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var chiralFrom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var chiralTo = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Line);

        this.from = from;
        this.to = to;
        this.elementFrom = elementFrom;
        this.elementTo = elementTo;
        this.chiralFrom = chiralFrom;
        this.chiralTo = chiralTo;
    }

    /**
     * Clones this line and returns the clone.
     *
     * @returns {SmilesDrawer.Line} A clone of this line.
     */


    _createClass(Line, [{
        key: 'clone',
        value: function clone() {
            return new SmilesDrawer.Line(this.from.clone(), this.to.clone(), this.elementFrom, this.elementTo);
        }

        /**
         * Returns the length of this line.
         *
         * @returns {Number} The length of this line.
         */

    }, {
        key: 'getLength',
        value: function getLength() {
            return Math.sqrt(Math.pow(this.to.x - this.from.x, 2) + Math.pow(this.to.y - this.from.y, 2));
        }

        /**
         * Returns the angle of the line in relation to the coordinate system (the x-axis).
         *
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'getAngle',
        value: function getAngle() {
            // Get the angle between the line and the x-axis
            var diff = SmilesDrawer.Vector2.subtract(this.getRightVector(), this.getLeftVector());
            return diff.angle();
        }

        /**
         * Returns the right vector (the vector with the larger x value).
         *
         * @returns {SmilesDrawer.Vector2} The right vector.
         */

    }, {
        key: 'getRightVector',
        value: function getRightVector() {
            // Return the vector with the larger x value (the right one)
            if (this.from.x < this.to.x) {
                return this.to;
            } else {
                return this.from;
            }
        }

        /**
         * Returns the left vector (the vector with the smaller x value).
         *
         * @returns {SmilesDrawer.Vector2} The left vector.
         */

    }, {
        key: 'getLeftVector',
        value: function getLeftVector() {
            // Return the vector with the smaller x value (the left one)
            if (this.from.x < this.to.x) {
                return this.from;
            } else {
                return this.to;
            }
        }

        /**
         * Returns the element associated with the right vector (the vector with the larger x value).
         *
         * @returns {String} The element associated with the right vector.
         */

    }, {
        key: 'getRightElement',
        value: function getRightElement() {
            if (this.from.x < this.to.x) {
                return this.elementTo;
            } else {
                return this.elementFrom;
            }
        }

        /**
         * Returns the element associated with the left vector (the vector with the smaller x value).
         *
         * @returns {String} The element associated with the left vector.
         */

    }, {
        key: 'getLeftElement',
        value: function getLeftElement() {
            if (this.from.x < this.to.x) {
                return this.elementFrom;
            } else {
                return this.elementTo;
            }
        }

        /**
         * Returns whether or not the atom associated with the right vector (the vector with the larger x value) is a chiral center.
         *
         * @returns {Boolean} Whether or not the atom associated with the right vector is a chiral center.
         */

    }, {
        key: 'getRightChiral',
        value: function getRightChiral() {
            if (this.from.x < this.to.x) {
                return this.chiralTo;
            } else {
                return this.chiralFrom;
            }
        }

        /**
         * Returns whether or not the atom associated with the left vector (the vector with the smaller x value) is a chiral center.
         *
         * @returns {Boolean} Whether or not the atom  associated with the left vector is a chiral center.
         */

    }, {
        key: 'getLeftChiral',
        value: function getLeftChiral() {
            if (this.from.x < this.to.x) {
                return this.chiralFrom;
            } else {
                return this.chiralTo;
            }
        }

        /**
         * Set the value of the right vector.
         *
         * @param {Number} x The x value.
         * @param {Number} y The y value.
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'setRightVector',
        value: function setRightVector(x, y) {
            if (this.from.x < this.to.x) {
                this.to.x = x;
                this.to.y = y;
            } else {
                this.from.x = x;
                this.from.y = y;
            }

            return this;
        }

        /**
         * Set the value of the left vector.
         *
         * @param {Number} x The x value.
         * @param {Number} y The y value.
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'setLeftVector',
        value: function setLeftVector(x, y) {
            if (this.from.x < this.to.x) {
                this.from.x = x;
                this.from.y = y;
            } else {
                this.to.x = x;
                this.to.y = y;
            }

            return this;
        }

        /**
         * Rotates this line to be aligned with the x-axis. The center of rotation is the left vector.
         *
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'rotateToXAxis',
        value: function rotateToXAxis() {
            var left = this.getLeftVector();

            this.setRightVector(left.x + this.getLength(), left.y);

            return this;
        }

        /**
         * Rotate the line by a given value (in radians). The center of rotation is the left vector.
         *
         * @param {Number} theta The angle (in radians) to rotate the line.
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'rotate',
        value: function rotate(theta) {
            var l = this.getLeftVector();
            var r = this.getRightVector();
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            var x = cosTheta * (r.x - l.x) - sinTheta * (r.y - l.y) + l.x;
            var y = sinTheta * (r.x - l.x) - cosTheta * (r.y - l.y) + l.y;

            this.setRightVector(x, y);

            return this;
        }

        /**
         * Shortens this line from the "from" direction by a given value (in pixels).
         *
         * @param {Number} by The length in pixels to shorten the vector by.
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'shortenFrom',
        value: function shortenFrom(by) {
            var f = SmilesDrawer.Vector2.subtract(this.to, this.from);

            f.normalize();
            f.multiplyScalar(by);

            this.from.add(f);

            return this;
        }

        /**
         * Shortens this line from the "to" direction by a given value (in pixels).
         *
         * @param {Number} by The length in pixels to shorten the vector by.
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'shortenTo',
        value: function shortenTo(by) {
            var f = SmilesDrawer.Vector2.subtract(this.from, this.to);

            f.normalize();
            f.multiplyScalar(by);

            this.to.add(f);

            return this;
        }

        /**
         * Shorten the right side.
         *
         * @param {Number} by The length in pixels to shorten the vector by.
         * @returns {SmilesDrawer.Line} Returns itself.
         */

    }, {
        key: 'shortenRight',
        value: function shortenRight(by) {
            if (this.from.x < this.to.x) {
                this.shortenTo(by);
            } else {
                this.shortenFrom(by);
            }

            return this;
        }

        /**
         * Shorten the left side.
         * 
         * @param {Number} by The length in pixels to shorten the vector by.
         * @returns {SmilesDrawer.Line} Returns itself.
         */

    }, {
        key: 'shortenLeft',
        value: function shortenLeft(by) {
            if (this.from.x < this.to.x) {
                this.shortenFrom(by);
            } else {
                this.shortenTo(by);
            }

            return this;
        }

        /**
         * Shortens this line from both directions by a given value (in pixels).
         *
         * @param {Number} by The length in pixels to shorten the vector by.
         * @returns {SmilesDrawer.Line} This line.
         */

    }, {
        key: 'shorten',
        value: function shorten(by) {
            var f = SmilesDrawer.Vector2.subtract(this.from, this.to);

            f.normalize();
            f.multiplyScalar(by / 2.0);

            this.to.add(f);
            this.from.subtract(f);

            return this;
        }

        /**
         * Returns the normals of this line.
         *
         * @returns {SmilesDrawer.Vector2[]} An array containing the two normals as vertices.
         */

    }, {
        key: 'getNormals',
        value: function getNormals() {
            var delta = SmilesDrawer.Vector2.subtract(from, to);

            return [new SmilesDrawer.Vector2(-delta.y, delta.x), new SmilesDrawer.Vector2(delta.y, -delta.x)];
        }
    }]);

    return Line;
}();

/** 
 * A static class containing helper functions for math-related tasks. 
 */
SmilesDrawer.MathHelper = function () {
    function MathHelper() {
        _classCallCheck(this, MathHelper);
    }

    _createClass(MathHelper, null, [{
        key: 'round',

        /**
         * Rounds a value to a given number of decimals.
         *
         * @static
         * @param {Number} value A number.
         * @param {Number} decimals The number of decimals.
         * @returns {Number} A number rounded to a given number of decimals.
         */
        value: function round(value, decimals) {
            decimals = decimals ? decimals : 1;
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
        }

        /**
         * Returns the means of the angles contained in an array. In radians.
         *
         * @static
         * @param {Number[]} arr An array containing angles (in radians).
         * @returns {Number} The mean angle in radians.
         */

    }, {
        key: 'meanAngle',
        value: function meanAngle(arr) {
            var sin = 0.0;
            var cos = 0.0;

            for (var i = 0; i < arr.length; i++) {
                sin += Math.sin(arr[i]);
                cos += Math.cos(arr[i]);
            }

            return Math.atan2(sin / arr.length, cos / arr.length);
        }

        /**
         * Returns the inner angle of a n-sided regular polygon.
         *
         * @static
         * @param {Number} n Number of sides of a regular polygon.
         * @returns {Number} The inner angle of a given regular polygon.
         */

    }, {
        key: 'innerAngle',
        value: function innerAngle(n) {
            return SmilesDrawer.MathHelper.toRad((n - 2) * 180 / n);
        }

        /**
         * Returns the circumradius of a n-sided regular polygon with a given side-length.
         *
         * @static
         * @param {Number} s The side length of the regular polygon.
         * @param {Number} n The number of sides.
         * @returns {Number} The circumradius of the regular polygon.
         */

    }, {
        key: 'polyCircumradius',
        value: function polyCircumradius(s, n) {
            return s / (2 * Math.sin(Math.PI / n));
        }

        /**
         * Returns the apothem of a regular n-sided polygon based on its radius.
         *
         * @static
         * @param {Number} r The radius.
         * @param {Number} n The number of edges of the regular polygon.
         * @returns {Number} The apothem of a n-sided polygon based on its radius.
         */

    }, {
        key: 'apothem',
        value: function apothem(r, n) {
            return r * Math.cos(Math.PI / n);
        }
    }, {
        key: 'apothemFromSideLength',
        value: function apothemFromSideLength(s, n) {
            var r = SmilesDrawer.MathHelper.polyCircumradius(s, n);

            return SmilesDrawer.MathHelper.apothem(r, n);
        }

        /**
         * The central angle of a n-sided regular polygon. In radians.
         *
         * @static
         * @param {Number} n The number of sides of the regular polygon.
         * @returns {Number} The central angle of the n-sided polygon in radians.
         */

    }, {
        key: 'centralAngle',
        value: function centralAngle(n) {
            return SmilesDrawer.MathHelper.toRad(360 / n);
        }

        /**
         * Convertes radians to degrees.
         *
         * @static
         * @param {Number} rad An angle in radians.
         * @returns {Number} The angle in degrees.
         */

    }, {
        key: 'toDeg',
        value: function toDeg(rad) {
            return rad * SmilesDrawer.MathHelper.degFactor;
        }

        /**
         * Converts degrees to radians.
         *
         * @static
         * @param {Number} deg An angle in degrees.
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'toRad',
        value: function toRad(deg) {
            return deg * SmilesDrawer.MathHelper.radFactor;
        }
    }]);

    return MathHelper;
}();

/** The factor to convert degrees to radians. */
SmilesDrawer.MathHelper.radFactor = Math.PI / 180;

/** The factor to convert radians to degrees. */
SmilesDrawer.MathHelper.degFactor = 180 / Math.PI;

/** Two times PI. */
SmilesDrawer.MathHelper.twoPI = 2 * Math.PI;
SmilesDrawer.Parser = function () {
    "use strict";

    /*
     * Generated by PEG.js 0.9.0.
     *
     * http://pegjs.org/
     */

    function peg$subclass(child, parent) {
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";

        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, peg$SyntaxError);
        }
    }

    peg$subclass(peg$SyntaxError, Error);

    function peg$parse(input) {
        var options = arguments.length > 1 ? arguments[1] : {},
            parser = this,
            peg$FAILED = {},
            peg$startRuleFunctions = {
            chain: peg$parsechain
        },
            peg$startRuleFunction = peg$parsechain,
            peg$c0 = function peg$c0(s) {
            var branches = [];
            var rings = [];

            for (var i = 0; i < s[1].length; i++) {
                branches.push(s[1][i]);
            }

            for (var i = 0; i < s[2].length; i++) {
                var bond = s[2][i][0] ? s[2][i][0] : '-';
                rings.push({
                    'bond': bond,
                    'id': s[2][i][1]
                });
            }

            for (var i = 0; i < s[3].length; i++) {
                branches.push(s[3][i]);
            }

            for (var i = 0; i < s[6].length; i++) {
                branches.push(s[6][i]);
            }

            return {
                'atom': s[0],
                'isBracket': s[0].element ? true : false,
                'branches': branches,
                'branchCount': branches.length,
                'ringbonds': rings,
                'ringbondCount': rings.length,
                'bond': s[4] ? s[4] : '-',
                'next': s[5],
                'hasNext': s[5] ? true : false
            };

            return s;
        },
            peg$c1 = "(",
            peg$c2 = {
            type: "literal",
            value: "(",
            description: "\"(\""
        },
            peg$c3 = ")",
            peg$c4 = {
            type: "literal",
            value: ")",
            description: "\")\""
        },
            peg$c5 = function peg$c5(b) {
            var bond = b[1] ? b[1] : '-';
            b[2].branchBond = bond;
            return b[2];
        },
            peg$c6 = function peg$c6(a) {
            return a;
        },
            peg$c7 = /^[\-=#$:\/\\.]/,
            peg$c8 = {
            type: "class",
            value: "[-=#$:/\\\\.]",
            description: "[-=#$:/\\\\.]"
        },
            peg$c9 = function peg$c9(b) {
            return b;
        },
            peg$c10 = "[",
            peg$c11 = {
            type: "literal",
            value: "[",
            description: "\"[\""
        },
            peg$c12 = "se",
            peg$c13 = {
            type: "literal",
            value: "se",
            description: "\"se\""
        },
            peg$c14 = "as",
            peg$c15 = {
            type: "literal",
            value: "as",
            description: "\"as\""
        },
            peg$c16 = "]",
            peg$c17 = {
            type: "literal",
            value: "]",
            description: "\"]\""
        },
            peg$c18 = function peg$c18(b) {
            return {
                'isotope': b[1],
                'element': b[2],
                'chirality': b[3],
                'hcount': b[4],
                'charge': b[5],
                'class': b[6]
            };
        },
            peg$c19 = "B",
            peg$c20 = {
            type: "literal",
            value: "B",
            description: "\"B\""
        },
            peg$c21 = "r",
            peg$c22 = {
            type: "literal",
            value: "r",
            description: "\"r\""
        },
            peg$c23 = "C",
            peg$c24 = {
            type: "literal",
            value: "C",
            description: "\"C\""
        },
            peg$c25 = "l",
            peg$c26 = {
            type: "literal",
            value: "l",
            description: "\"l\""
        },
            peg$c27 = /^[NOPSFI]/,
            peg$c28 = {
            type: "class",
            value: "[NOPSFI]",
            description: "[NOPSFI]"
        },
            peg$c29 = function peg$c29(o) {
            if (o.length > 1) return o.join('');
            return o;
        },
            peg$c30 = /^[bcnops]/,
            peg$c31 = {
            type: "class",
            value: "[bcnops]",
            description: "[bcnops]"
        },
            peg$c32 = "*",
            peg$c33 = {
            type: "literal",
            value: "*",
            description: "\"*\""
        },
            peg$c34 = function peg$c34(w) {
            return w;
        },
            peg$c35 = /^[A-Z]/,
            peg$c36 = {
            type: "class",
            value: "[A-Z]",
            description: "[A-Z]"
        },
            peg$c37 = /^[a-z]/,
            peg$c38 = {
            type: "class",
            value: "[a-z]",
            description: "[a-z]"
        },
            peg$c39 = function peg$c39(e) {
            return e.join('');
        },
            peg$c40 = "%",
            peg$c41 = {
            type: "literal",
            value: "%",
            description: "\"%\""
        },
            peg$c42 = /^[1-9]/,
            peg$c43 = {
            type: "class",
            value: "[1-9]",
            description: "[1-9]"
        },
            peg$c44 = /^[0-9]/,
            peg$c45 = {
            type: "class",
            value: "[0-9]",
            description: "[0-9]"
        },
            peg$c46 = function peg$c46(r) {
            if (r.length == 1) return Number(r);
            return Number(r.join('').replace('%', ''));
        },
            peg$c47 = "@",
            peg$c48 = {
            type: "literal",
            value: "@",
            description: "\"@\""
        },
            peg$c49 = "TH",
            peg$c50 = {
            type: "literal",
            value: "TH",
            description: "\"TH\""
        },
            peg$c51 = /^[12]/,
            peg$c52 = {
            type: "class",
            value: "[12]",
            description: "[12]"
        },
            peg$c53 = "AL",
            peg$c54 = {
            type: "literal",
            value: "AL",
            description: "\"AL\""
        },
            peg$c55 = "SP",
            peg$c56 = {
            type: "literal",
            value: "SP",
            description: "\"SP\""
        },
            peg$c57 = /^[1-3]/,
            peg$c58 = {
            type: "class",
            value: "[1-3]",
            description: "[1-3]"
        },
            peg$c59 = "TB",
            peg$c60 = {
            type: "literal",
            value: "TB",
            description: "\"TB\""
        },
            peg$c61 = "OH",
            peg$c62 = {
            type: "literal",
            value: "OH",
            description: "\"OH\""
        },
            peg$c63 = function peg$c63(c) {
            if (!c[1]) return '@';
            if (c[1] == '@') return '@@';

            return c[1].join('').replace(',', '');
        },
            peg$c64 = function peg$c64(c) {
            return c;
        },
            peg$c65 = "+",
            peg$c66 = {
            type: "literal",
            value: "+",
            description: "\"+\""
        },
            peg$c67 = function peg$c67(c) {
            if (!c[1]) return 1;
            if (c[1] != '+') return Number(c[1].join(''));
            return 2;
        },
            peg$c68 = "-",
            peg$c69 = {
            type: "literal",
            value: "-",
            description: "\"-\""
        },
            peg$c70 = function peg$c70(c) {
            if (!c[1]) return -1;
            if (c[1] != '-') return -Number(c[1].join(''));
            return -2;
        },
            peg$c71 = "H",
            peg$c72 = {
            type: "literal",
            value: "H",
            description: "\"H\""
        },
            peg$c73 = function peg$c73(h) {
            if (h[1]) return Number(h[1]);
            return 1;
        },
            peg$c74 = ":",
            peg$c75 = {
            type: "literal",
            value: ":",
            description: "\":\""
        },
            peg$c76 = /^[0]/,
            peg$c77 = {
            type: "class",
            value: "[0]",
            description: "[0]"
        },
            peg$c78 = function peg$c78(c) {
            return Number(c[1][0] + c[1][1].join(''));
        },
            peg$c79 = function peg$c79(i) {
            return Number(i.join(''));
        },
            peg$currPos = 0,
            peg$savedPos = 0,
            peg$posDetailsCache = [{
            line: 1,
            column: 1,
            seenCR: false
        }],
            peg$maxFailPos = 0,
            peg$maxFailExpected = [],
            peg$silentFails = 0,
            peg$result;

        if ("startRule" in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
                throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
            }

            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }

        function text() {
            return input.substring(peg$savedPos, peg$currPos);
        }

        function location() {
            return peg$computeLocation(peg$savedPos, peg$currPos);
        }

        function expected(description) {
            throw peg$buildException(null, [{
                type: "other",
                description: description
            }], input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
        }

        function error(message) {
            throw peg$buildException(message, null, input.substring(peg$savedPos, peg$currPos), peg$computeLocation(peg$savedPos, peg$currPos));
        }

        function peg$computePosDetails(pos) {
            var details = peg$posDetailsCache[pos],
                p,
                ch;

            if (details) {
                return details;
            } else {
                p = pos - 1;
                while (!peg$posDetailsCache[p]) {
                    p--;
                }

                details = peg$posDetailsCache[p];
                details = {
                    line: details.line,
                    column: details.column,
                    seenCR: details.seenCR
                };

                while (p < pos) {
                    ch = input.charAt(p);
                    if (ch === "\n") {
                        if (!details.seenCR) {
                            details.line++;
                        }
                        details.column = 1;
                        details.seenCR = false;
                    } else if (ch === "\r" || ch === '\u2028' || ch === '\u2029') {
                        details.line++;
                        details.column = 1;
                        details.seenCR = true;
                    } else {
                        details.column++;
                        details.seenCR = false;
                    }

                    p++;
                }

                peg$posDetailsCache[pos] = details;
                return details;
            }
        }

        function peg$computeLocation(startPos, endPos) {
            var startPosDetails = peg$computePosDetails(startPos),
                endPosDetails = peg$computePosDetails(endPos);

            return {
                start: {
                    offset: startPos,
                    line: startPosDetails.line,
                    column: startPosDetails.column
                },
                end: {
                    offset: endPos,
                    line: endPosDetails.line,
                    column: endPosDetails.column
                }
            };
        }

        function peg$fail(expected) {
            if (peg$currPos < peg$maxFailPos) {
                return;
            }

            if (peg$currPos > peg$maxFailPos) {
                peg$maxFailPos = peg$currPos;
                peg$maxFailExpected = [];
            }

            peg$maxFailExpected.push(expected);
        }

        function peg$buildException(message, expected, found, location) {
            function cleanupExpected(expected) {
                var i = 1;

                expected.sort(function (a, b) {
                    if (a.description < b.description) {
                        return -1;
                    } else if (a.description > b.description) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                while (i < expected.length) {
                    if (expected[i - 1] === expected[i]) {
                        expected.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            }

            function buildMessage(expected, found) {
                function stringEscape(s) {
                    function hex(ch) {
                        return ch.charCodeAt(0).toString(16).toUpperCase();
                    }

                    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
                        return '\\x0' + hex(ch);
                    }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
                        return '\\x' + hex(ch);
                    }).replace(/[\u0100-\u0FFF]/g, function (ch) {
                        return '\\u0' + hex(ch);
                    }).replace(/[\u1000-\uFFFF]/g, function (ch) {
                        return '\\u' + hex(ch);
                    });
                }

                var expectedDescs = new Array(expected.length),
                    expectedDesc,
                    foundDesc,
                    i;

                for (i = 0; i < expected.length; i++) {
                    expectedDescs[i] = expected[i].description;
                }

                expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];

                foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

                return "Expected " + expectedDesc + " but " + foundDesc + " found.";
            }

            if (expected !== null) {
                cleanupExpected(expected);
            }

            return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location);
        }

        function peg$parsechain() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parseatom();
            if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parsebranch();
                while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$parsebranch();
                }
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parsebond();
                    if (s6 === peg$FAILED) {
                        s6 = null;
                    }
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parsering();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parsebond();
                        if (s6 === peg$FAILED) {
                            s6 = null;
                        }
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parsering();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = [];
                        s6 = peg$parsebranch();
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            s6 = peg$parsebranch();
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parsebond();
                            if (s6 === peg$FAILED) {
                                s6 = null;
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsechain();
                                if (s7 === peg$FAILED) {
                                    s7 = null;
                                }
                                if (s7 !== peg$FAILED) {
                                    s8 = [];
                                    s9 = peg$parsebranch();
                                    while (s9 !== peg$FAILED) {
                                        s8.push(s9);
                                        s9 = peg$parsebranch();
                                    }
                                    if (s8 !== peg$FAILED) {
                                        s2 = [s2, s3, s4, s5, s6, s7, s8];
                                        s1 = s2;
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c0(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsebranch() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 40) {
                s2 = peg$c1;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c2);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parsebond();
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s4 = peg$parsechain();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                            s5 = peg$c3;
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c4);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s2 = [s2, s3, s4, s5];
                            s1 = s2;
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c5(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseatom() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseorganicsymbol();
            if (s1 === peg$FAILED) {
                s1 = peg$parsearomaticsymbol();
                if (s1 === peg$FAILED) {
                    s1 = peg$parsebracketatom();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parsewildcard();
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsebond() {
            var s0, s1;

            s0 = peg$currPos;
            if (peg$c7.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c8);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c9(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsebracketatom() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
                s2 = peg$c10;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c11);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parseisotope();
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c12) {
                        s4 = peg$c12;
                        peg$currPos += 2;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c13);
                        }
                    }
                    if (s4 === peg$FAILED) {
                        if (input.substr(peg$currPos, 2) === peg$c14) {
                            s4 = peg$c14;
                            peg$currPos += 2;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c15);
                            }
                        }
                        if (s4 === peg$FAILED) {
                            s4 = peg$parsearomaticsymbol();
                            if (s4 === peg$FAILED) {
                                s4 = peg$parseelementsymbol();
                                if (s4 === peg$FAILED) {
                                    s4 = peg$parsewildcard();
                                }
                            }
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parsechiral();
                        if (s5 === peg$FAILED) {
                            s5 = null;
                        }
                        if (s5 !== peg$FAILED) {
                            s6 = peg$parsehcount();
                            if (s6 === peg$FAILED) {
                                s6 = null;
                            }
                            if (s6 !== peg$FAILED) {
                                s7 = peg$parsecharge();
                                if (s7 === peg$FAILED) {
                                    s7 = null;
                                }
                                if (s7 !== peg$FAILED) {
                                    s8 = peg$parseclass();
                                    if (s8 === peg$FAILED) {
                                        s8 = null;
                                    }
                                    if (s8 !== peg$FAILED) {
                                        if (input.charCodeAt(peg$currPos) === 93) {
                                            s9 = peg$c16;
                                            peg$currPos++;
                                        } else {
                                            s9 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c17);
                                            }
                                        }
                                        if (s9 !== peg$FAILED) {
                                            s2 = [s2, s3, s4, s5, s6, s7, s8, s9];
                                            s1 = s2;
                                        } else {
                                            peg$currPos = s1;
                                            s1 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s1;
                                        s1 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s1;
                                    s1 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s1;
                                s1 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s1;
                            s1 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c18(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseorganicsymbol() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 66) {
                s2 = peg$c19;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c20);
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 114) {
                    s3 = peg$c21;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c22);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                s1 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 67) {
                    s2 = peg$c23;
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c24);
                    }
                }
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 108) {
                        s3 = peg$c25;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c26);
                        }
                    }
                    if (s3 === peg$FAILED) {
                        s3 = null;
                    }
                    if (s3 !== peg$FAILED) {
                        s2 = [s2, s3];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
                if (s1 === peg$FAILED) {
                    if (peg$c27.test(input.charAt(peg$currPos))) {
                        s1 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c28);
                        }
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c29(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsearomaticsymbol() {
            var s0, s1;

            s0 = peg$currPos;
            if (peg$c30.test(input.charAt(peg$currPos))) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c31);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsewildcard() {
            var s0, s1;

            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c32;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c33);
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c34(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseelementsymbol() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (peg$c35.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c36);
                }
            }
            if (s2 !== peg$FAILED) {
                if (peg$c37.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c38);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsering() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 37) {
                s2 = peg$c40;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c41);
                }
            }
            if (s2 !== peg$FAILED) {
                if (peg$c42.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c43);
                    }
                }
                if (s3 !== peg$FAILED) {
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 === peg$FAILED) {
                if (peg$c44.test(input.charAt(peg$currPos))) {
                    s1 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c46(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsechiral() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 64) {
                s2 = peg$c47;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c48);
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 64) {
                    s3 = peg$c47;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c48);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c49) {
                        s4 = peg$c49;
                        peg$currPos += 2;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c50);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c51.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c52);
                            }
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                    if (s3 === peg$FAILED) {
                        s3 = peg$currPos;
                        if (input.substr(peg$currPos, 2) === peg$c53) {
                            s4 = peg$c53;
                            peg$currPos += 2;
                        } else {
                            s4 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c54);
                            }
                        }
                        if (s4 !== peg$FAILED) {
                            if (peg$c51.test(input.charAt(peg$currPos))) {
                                s5 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c52);
                                }
                            }
                            if (s5 !== peg$FAILED) {
                                s4 = [s4, s5];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                        if (s3 === peg$FAILED) {
                            s3 = peg$currPos;
                            if (input.substr(peg$currPos, 2) === peg$c55) {
                                s4 = peg$c55;
                                peg$currPos += 2;
                            } else {
                                s4 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                    peg$fail(peg$c56);
                                }
                            }
                            if (s4 !== peg$FAILED) {
                                if (peg$c57.test(input.charAt(peg$currPos))) {
                                    s5 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                } else {
                                    s5 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c58);
                                    }
                                }
                                if (s5 !== peg$FAILED) {
                                    s4 = [s4, s5];
                                    s3 = s4;
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                            if (s3 === peg$FAILED) {
                                s3 = peg$currPos;
                                if (input.substr(peg$currPos, 2) === peg$c59) {
                                    s4 = peg$c59;
                                    peg$currPos += 2;
                                } else {
                                    s4 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                        peg$fail(peg$c60);
                                    }
                                }
                                if (s4 !== peg$FAILED) {
                                    if (peg$c42.test(input.charAt(peg$currPos))) {
                                        s5 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                    } else {
                                        s5 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c43);
                                        }
                                    }
                                    if (s5 !== peg$FAILED) {
                                        if (peg$c44.test(input.charAt(peg$currPos))) {
                                            s6 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s6 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c45);
                                            }
                                        }
                                        if (s6 === peg$FAILED) {
                                            s6 = null;
                                        }
                                        if (s6 !== peg$FAILED) {
                                            s4 = [s4, s5, s6];
                                            s3 = s4;
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                } else {
                                    peg$currPos = s3;
                                    s3 = peg$FAILED;
                                }
                                if (s3 === peg$FAILED) {
                                    s3 = peg$currPos;
                                    if (input.substr(peg$currPos, 2) === peg$c61) {
                                        s4 = peg$c61;
                                        peg$currPos += 2;
                                    } else {
                                        s4 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                            peg$fail(peg$c62);
                                        }
                                    }
                                    if (s4 !== peg$FAILED) {
                                        if (peg$c42.test(input.charAt(peg$currPos))) {
                                            s5 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                        } else {
                                            s5 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                                peg$fail(peg$c43);
                                            }
                                        }
                                        if (s5 !== peg$FAILED) {
                                            if (peg$c44.test(input.charAt(peg$currPos))) {
                                                s6 = input.charAt(peg$currPos);
                                                peg$currPos++;
                                            } else {
                                                s6 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                    peg$fail(peg$c45);
                                                }
                                            }
                                            if (s6 === peg$FAILED) {
                                                s6 = null;
                                            }
                                            if (s6 !== peg$FAILED) {
                                                s4 = [s4, s5, s6];
                                                s3 = s4;
                                            } else {
                                                peg$currPos = s3;
                                                s3 = peg$FAILED;
                                            }
                                        } else {
                                            peg$currPos = s3;
                                            s3 = peg$FAILED;
                                        }
                                    } else {
                                        peg$currPos = s3;
                                        s3 = peg$FAILED;
                                    }
                                }
                            }
                        }
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c63(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsecharge() {
            var s0, s1;

            s0 = peg$currPos;
            s1 = peg$parseposcharge();
            if (s1 === peg$FAILED) {
                s1 = peg$parsenegcharge();
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c64(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseposcharge() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 43) {
                s2 = peg$c65;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c66);
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 43) {
                    s3 = peg$c65;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c66);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    if (peg$c42.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c43);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                        if (s5 === peg$FAILED) {
                            s5 = null;
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c67(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsenegcharge() {
            var s0, s1, s2, s3, s4, s5;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 45) {
                s2 = peg$c68;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c69);
                }
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 45) {
                    s3 = peg$c68;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c69);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    if (peg$c42.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c43);
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s5 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                        if (s5 === peg$FAILED) {
                            s5 = null;
                        }
                        if (s5 !== peg$FAILED) {
                            s4 = [s4, s5];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c70(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parsehcount() {
            var s0, s1, s2, s3;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 72) {
                s2 = peg$c71;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c72);
                }
            }
            if (s2 !== peg$FAILED) {
                if (peg$c44.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c73(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseclass() {
            var s0, s1, s2, s3, s4, s5, s6;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 58) {
                s2 = peg$c74;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c75);
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                if (peg$c42.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c43);
                    }
                }
                if (s4 !== peg$FAILED) {
                    s5 = [];
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s6 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s6 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    while (s6 !== peg$FAILED) {
                        s5.push(s6);
                        if (peg$c44.test(input.charAt(peg$currPos))) {
                            s6 = input.charAt(peg$currPos);
                            peg$currPos++;
                        } else {
                            s6 = peg$FAILED;
                            if (peg$silentFails === 0) {
                                peg$fail(peg$c45);
                            }
                        }
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                    if (peg$c76.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c77);
                        }
                    }
                }
                if (s3 !== peg$FAILED) {
                    s2 = [s2, s3];
                    s1 = s2;
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c78(s1);
            }
            s0 = s1;

            return s0;
        }

        function peg$parseisotope() {
            var s0, s1, s2, s3, s4;

            s0 = peg$currPos;
            s1 = peg$currPos;
            if (peg$c42.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                    peg$fail(peg$c43);
                }
            }
            if (s2 !== peg$FAILED) {
                if (peg$c44.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) {
                        peg$fail(peg$c45);
                    }
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    if (peg$c44.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) {
                            peg$fail(peg$c45);
                        }
                    }
                    if (s4 === peg$FAILED) {
                        s4 = null;
                    }
                    if (s4 !== peg$FAILED) {
                        s2 = [s2, s3, s4];
                        s1 = s2;
                    } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                }
            } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c79(s1);
            }
            s0 = s1;

            return s0;
        }

        peg$result = peg$startRuleFunction();

        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
        } else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
                peg$fail({
                    type: "end",
                    description: "end of input"
                });
            }

            throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
        }
    }

    return {
        SyntaxError: peg$SyntaxError,
        parse: peg$parse
    };
}();
/** 
 * A class representing a ring.
 * 
 * @property {Number} id The id of this ring.
 * @property {Number[]} members An array containing the vertex ids of the ring members.
 * @property {Number[]} edges An array containing the edge ids of the edges between the ring members.
 * @property {Number[]} insiders An array containing the vertex ids of the vertices contained within the ring if it is a bridged ring.
 * @property {Number[]} neighbours An array containing the ids of neighbouring rings.
 * @property {Boolean} positioned A boolean indicating whether or not this ring has been positioned.
 * @property {SmilesDrawer.Vector2} center The center of this ring.
 * @property {SmilesDrawer.Ring[]} rings The rings contained within this ring if this ring is bridged.
 * @property {Boolean} isBridged A boolean whether or not this ring is bridged.
 * @property {Boolean} isPartOfBridged A boolean whether or not this ring is part of a bridge ring.
 * @property {Boolean} isSpiro A boolean whether or not this ring is part of a spiro.
 * @property {Boolean} isFused A boolean whether or not this ring is part of a fused ring.
 * @property {Number} centralAngle The central angle of this ring.
 * @property {Boolean} canFlip A boolean indicating whether or not this ring allows flipping of attached vertices to the inside of the ring.
 */
SmilesDrawer.Ring = function () {
    /**
     * The constructor for the class Ring.
     *
     * @param {Number[]} members An array containing the vertex ids of the members of the ring to be created.
     */
    function Ring(members) {
        _classCallCheck(this, Ring);

        this.id = null;
        this.members = members;
        this.edges = [];
        this.insiders = [];
        this.neighbours = [];
        this.positioned = false;
        this.center = new SmilesDrawer.Vector2();
        this.rings = [];
        this.isBridged = false;
        this.isPartOfBridged = false;
        this.isSpiro = false;
        this.isFused = false;
        this.centralAngle = 0.0;
        this.canFlip = true;
    }

    /**
     * Clones this ring and returns the clone.
     *
     * @returns {SmilesDrawer.Ring} A clone of this ring.
     */


    _createClass(Ring, [{
        key: 'clone',
        value: function clone() {
            var clone = new Ring(this.members);

            clone.id = this.id;
            clone.insiders = SmilesDrawer.ArrayHelper.clone(this.insiders);
            clone.neighbours = SmilesDrawer.ArrayHelper.clone(this.neighbours);
            clone.positioned = this.positioned;
            clone.center = this.center.clone();
            clone.rings = SmilesDrawer.ArrayHelper.clone(this.rings);
            clone.isBridged = this.isBridged;
            clone.isPartOfBridged = this.isPartOfBridged;
            clone.isSpiro = this.isSpiro;
            clone.isFused = this.isFused;
            clone.centralAngle = this.centralAngle;
            clone.canFlip = this.canFlip;

            return clone;
        }

        /**
         * Returns the size (number of members) of this ring.
         *
         * @returns {Number} The size (number of members) of this ring.
         */

    }, {
        key: 'getSize',
        value: function getSize() {
            return this.members.length;
        }

        /**
         * Gets the polygon representation (an array of the ring-members positional vectors) of this ring.
         *
         * @param {SmilesDrawer.Vertex[]} vertices An array of vertices representing the current molecule.
         * @returns {SmilesDrawer.Vector2[]} An array of the positional vectors of the ring members.
         */

    }, {
        key: 'getPolygon',
        value: function getPolygon(vertices) {
            var polygon = [];

            for (var i = 0; i < this.members.length; i++) {
                polygon.push(vertices[this.members[i]].position);
            }

            return polygon;
        }

        /**
         * Returns the angle of this ring in relation to the coordinate system.
         *
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'getAngle',
        value: function getAngle() {
            return Math.PI - this.centralAngle;
        }

        /**
         * Loops over the members of this ring from a given start position in a direction opposite to the vertex id passed as the previousId.
         *
         * @param {SmilesDrawer.Vertex[]} vertices The vertices associated with the current molecule.
         * @param {Function} callback A callback with the current vertex id as a parameter.
         * @param {Number} startVertexId The vertex id of the start vertex.
         * @param {Number} previousVertexId The vertex id of the previous vertex (the loop calling the callback function will run in the opposite direction of this vertex).
         */

    }, {
        key: 'eachMember',
        value: function eachMember(vertices, callback, startVertexId, previousVertexId) {
            startVertexId = startVertexId || startVertexId === 0 ? startVertexId : this.members[0];
            var current = startVertexId;
            var max = 0;

            while (current != null && max < 100) {
                var prev = current;

                callback(prev);
                current = vertices[current].getNextInRing(vertices, this.id, previousVertexId);
                previousVertexId = prev;

                // Stop while loop when arriving back at the start vertex
                if (current == startVertexId) {
                    current = null;
                }

                max++;
            }
        }

        /**
         * Returns an array containing the neighbouring rings of this ring ordered by ring size.
         *
         * @param {SmilesDrawer.RingConnection[]} ringConnections An array of ring connections associated with the current molecule.
         * @returns {Object[]} An array of neighbouring rings sorted by ring size. Example: { n: 5, neighbour: 1 }.
         */

    }, {
        key: 'getOrderedNeighbours',
        value: function getOrderedNeighbours(ringConnections) {
            var orderedNeighbours = Array(this.neighbours.length);

            for (var i = 0; i < this.neighbours.length; i++) {
                var vertices = SmilesDrawer.RingConnection.getVertices(ringConnections, this.id, this.neighbours[i]);

                orderedNeighbours[i] = {
                    n: vertices.size,
                    neighbour: this.neighbours[i]
                };
            }

            orderedNeighbours.sort(function (a, b) {
                // Sort highest to lowest
                return b.n - a.n;
            });

            return orderedNeighbours;
        }

        /**
         * Check whether this ring is an implicitly defined benzene-like (e.g. C1=CC=CC=C1) with 6 members and 3 double bonds.
         *
         * @param {SmilesDrawer.Vertex[]} vertices An array of vertices associated with the current molecule.
         * @returns {Boolean} A boolean indicating whether or not this ring is an implicitly defined benzene-like.
         */

    }, {
        key: 'isBenzeneLike',
        value: function isBenzeneLike(vertices) {
            var db = this.getDoubleBondCount(vertices);
            var length = this.members.length;

            return db === 3 && length === 6 || db === 2 && length === 5;
        }

        /**
         * Get the number of double bonds inside this ring.
         *
         * @param {SmilesDrawer.Vertex[]} vertices An array of vertices associated with the current molecule.
         * @returns {Number} The number of double bonds inside this ring.
         */

    }, {
        key: 'getDoubleBondCount',
        value: function getDoubleBondCount(vertices) {
            var doubleBondCount = 0;

            for (var i = 0; i < this.members.length; i++) {
                var atom = vertices[this.members[i]].value;

                if (atom.bondType === '=' || atom.branchBond === '=') {
                    doubleBondCount++;
                }
            }

            return doubleBondCount;
        }

        /**
         * Checks whether or not this ring contains a member with a given vertex id.
         *
         * @param {Number} vertexId A vertex id.
         * @returns {Boolean} A boolean indicating whether or not this ring contains a member with the given vertex id.
         */

    }, {
        key: 'contains',
        value: function contains(vertexId) {
            for (var i = 0; i < this.members.length; i++) {
                if (this.members[i] == vertexId) {
                    return true;
                }
            }

            return false;
        }
    }]);

    return Ring;
}();

/** 
 * A class representing a ring connection.
 * 
 * @property {Number} id The id of this ring connection.
 * @property {Number} firstRingId A ring id.
 * @property {Number} secondRingId A ring id.
 * @property {Set<Number>} vertices A set containing the vertex ids participating in the ring connection.
 */
SmilesDrawer.RingConnection = function () {
    /**
     * The constructor for the class RingConnection.
     *
     * @param {SmilesDrawer.Ring} firstRing A ring.
     * @param {SmilesDrawer.Ring} secondRing A ring.
     */
    function RingConnection(firstRing, secondRing) {
        _classCallCheck(this, RingConnection);

        this.id = null;
        this.firstRingId = firstRing.id;
        this.secondRingId = secondRing.id;
        this.vertices = new Set();

        for (var m = 0; m < firstRing.members.length; m++) {
            var c = firstRing.members[m];

            for (var n = 0; n < secondRing.members.length; n++) {
                var d = secondRing.members[n];

                if (c === d) {
                    this.addVertex(c);
                }
            }
        }
    }

    /**
     * Adding a vertex to the ring connection.
     *
     * @param {Number} vertexId A vertex id.
     */


    _createClass(RingConnection, [{
        key: 'addVertex',
        value: function addVertex(vertexId) {
            this.vertices.add(vertexId);
        }

        /**
         * Update the ring id of this ring connection that is not the ring id supplied as the second argument.
         *
         * @param {Number} ringId A ring id. The new ring id to be set.
         * @param {Number} otherRingId A ring id. The id that is NOT to be updated.
         */

    }, {
        key: 'updateOther',
        value: function updateOther(ringId, otherRingId) {
            if (this.firstRingId === otherRingId) {
                this.secondRingId = ringId;
            } else {
                this.firstRingId = ringId;
            }
        }

        /**
         * Returns a boolean indicating whether or not a ring with a given id is participating in this ring connection.
         * 
         * @param {Number} ringId A ring id.
         * @returns {Boolean} A boolean indicating whether or not a ring with a given id participates in this ring connection.
         */

    }, {
        key: 'containsRing',
        value: function containsRing(ringId) {
            return this.firstRingId === ringId || this.secondRingId === ringId;
        }

        /**
         * Checks whether or not this ring connection is a bridge in a bridged ring.
         *
         * @param {SmilesDrawer.Vertex[]}. vertices The array of vertices associated with the current molecule.
         * @returns {Boolean} A boolean indicating whether or not this ring connection is a bridge.
         */

    }, {
        key: 'isBridge',
        value: function isBridge(vertices) {
            if (this.vertices.size > 2) {
                return true;
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.vertices[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var vertexId = _step5.value;

                    if (vertices[vertexId].value.rings.length > 2) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return false;
        }

        /**
         * Checks whether or not two rings are connected by a bridged bond.
         *
         * @static
         * @param {SmilesDrawer.RingConnection[]} ringConnections An array of ring connections containing the ring connections associated with the current molecule.
         * @param {SmilesDrawer.Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
         * @param {Number} firstRingId A ring id.
         * @param {Nmber} secondRingId A ring id.
         * @returns {Boolean} A boolean indicating whether or not two rings ar connected by a bridged bond.
         */

    }], [{
        key: 'isBridge',
        value: function isBridge(ringConnections, vertices, firstRingId, secondRingId) {
            var ringConnection = null;

            for (var i = 0; i < ringConnections.length; i++) {
                ringConnection = ringConnections[i];

                if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId || ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                    return ringConnection.isBridge(vertices);
                }
            }

            return false;
        }

        /**
         * Retruns the neighbouring rings of a given ring.
         *
         * @static
         * @param {SmilesDrawer.RingConnection[]} ringConnections An array of ring connections containing ring connections associated with the current molecule.
         * @param {Number} ringId A ring id.
         * @returns {Number[]} An array of ring ids of neighbouring rings.
         */

    }, {
        key: 'getNeighbours',
        value: function getNeighbours(ringConnections, ringId) {
            var neighbours = [];

            for (var i = 0; i < ringConnections.length; i++) {
                var ringConnection = ringConnections[i];

                if (ringConnection.firstRingId === ringId) {
                    neighbours.push(ringConnection.secondRingId);
                } else if (ringConnection.secondRingId === ringId) {
                    neighbours.push(ringConnection.firstRingId);
                }
            }

            return neighbours;
        }

        /**
         * Returns an array of vertex ids associated with a given ring connection.
         *
         * @static
         * @param {SmilesDrawer.RingConnection[]} ringConnections An array of ring connections containing ring connections associated with the current molecule.
         * @param {Number} firstRingId A ring id.
         * @param {Number} secondRingId A ring id.
         * @returns {Number[]} An array of vertex ids associated with the ring connection.
         */

    }, {
        key: 'getVertices',
        value: function getVertices(ringConnections, firstRingId, secondRingId) {
            for (var i = 0; i < ringConnections.length; i++) {
                var ringConnection = ringConnections[i];
                if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId || ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                    return [].concat(_toConsumableArray(ringConnection.vertices));
                }
            }
        }
    }]);

    return RingConnection;
}();

/** A class encapsulating the functionality to find the smallest set of smallest rings in a graph. */
SmilesDrawer.SSSR = function () {
    function SSSR() {
        _classCallCheck(this, SSSR);
    }

    _createClass(SSSR, null, [{
        key: 'getRings',

        /**
         * Returns an array containing arrays, each representing a ring from the smallest set of smallest rings in the graph.
         * 
         * @param {SmilesDrawer.Graph} graph A SmilesDrawer.Graph object.
         * @returns {Array[]} An array containing arrays, each representing a ring from the smallest set of smallest rings in the group.
         */
        value: function getRings(graph) {
            var adjacencyMatrix = graph.getComponentsAdjacencyMatrix();
            if (adjacencyMatrix.length === 0) {
                return null;
            }

            var connectedComponents = SmilesDrawer.Graph.getConnectedComponents(adjacencyMatrix);
            var rings = new Array();

            for (var i = 0; i < connectedComponents.length; i++) {
                var connectedComponent = connectedComponents[i];
                var ccAdjacencyMatrix = graph.getSubgraphAdjacencyMatrix(connectedComponent);

                var arrBondCount = Array(ccAdjacencyMatrix.length);
                var arrRingCount = Array(ccAdjacencyMatrix.length);

                for (var j = 0; j < ccAdjacencyMatrix.length; j++) {
                    arrRingCount[j] = 0;
                    arrBondCount[j] = 0;

                    for (var k = 0; k < ccAdjacencyMatrix[j].length; k++) {
                        arrBondCount[j] += ccAdjacencyMatrix[j][k];
                    }
                }

                // Get the edge list and the theoretical number of rings in SSSR
                var nEdges = SmilesDrawer.SSSR.getEdgeList(ccAdjacencyMatrix).length;
                var nSssr = nEdges - ccAdjacencyMatrix.length + 1;

                // If all vertices have 3 incident edges, calculate with different formula (see Euler)
                var allThree = true;
                for (var j = 0; j < arrBondCount.length; j++) {
                    if (arrBondCount[j] !== 3) {
                        allThree = false;
                    }
                }

                if (allThree) {
                    nSssr = 2.0 + nEdges - ccAdjacencyMatrix.length;
                }

                var _SmilesDrawer$SSSR$ge = SmilesDrawer.SSSR.getPathIncludedDistanceMatrices(ccAdjacencyMatrix),
                    d = _SmilesDrawer$SSSR$ge.d,
                    pe = _SmilesDrawer$SSSR$ge.pe,
                    pe_prime = _SmilesDrawer$SSSR$ge.pe_prime;

                var c = SmilesDrawer.SSSR.getRingCandidates(d, pe, pe_prime);
                var sssr = SmilesDrawer.SSSR.getSSSR(c, d, ccAdjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nSssr);

                for (var _i4 = 0; _i4 < sssr.length; _i4++) {
                    var ring = new Array(sssr[_i4].length);
                    var index = 0;

                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = sssr[_i4][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var val = _step6.value;

                            // Get the original id of the vertex back
                            ring[index++] = connectedComponent[val];
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }

                    rings.push(ring);
                }
            }

            return rings;
        }

        /**
         * Creates a printable string from a matrix (2D array).
         * 
         * @param {Array[]} matrix A 2D array.
         * @returns {String} A string representing the matrix.
         */

    }, {
        key: 'matrixToString',
        value: function matrixToString(matrix) {
            var str = '';

            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    str += matrix[i][j] + ' ';
                }

                str += '\n';
            }

            return str;
        }

        /**
         * Returnes the two path-included distance matrices used to find the sssr.
         * 
         * @param {Array[]} adjacencyMatrix An adjacency matrix.
         * @returns {Object} The path-included distance matrices. { p1, p2 }
         */

    }, {
        key: 'getPathIncludedDistanceMatrices',
        value: function getPathIncludedDistanceMatrices(adjacencyMatrix) {
            var length = adjacencyMatrix.length;
            var d = Array(length);
            var pe = Array(length);
            var pe_prime = Array(length);
            var l = 0;
            var m = 0;
            var n = 0;

            var i = length;
            while (i--) {
                d[i] = Array(length);
                pe[i] = Array(length);
                pe_prime[i] = Array(length);

                var j = length;
                while (j--) {
                    d[i][j] = i === j || adjacencyMatrix[i][j] === 1 ? adjacencyMatrix[i][j] : Number.POSITIVE_INFINITY;

                    if (d[i][j] === 1) {
                        pe[i][j] = [[[i, j]]];
                    } else {
                        pe[i][j] = [];
                    }

                    pe_prime[i][j] = [];
                }
            }

            var k = length;
            var j;
            while (k--) {
                i = length;
                while (i--) {
                    j = length;
                    while (j--) {
                        var previousPathLength = d[i][j];
                        var newPathLength = d[i][k] + d[k][j];

                        if (previousPathLength > newPathLength) {
                            var l, m, n;
                            if (previousPathLength === newPathLength + 1) {
                                pe_prime[i][j] = [pe[i][j].length];
                                l = pe[i][j].length;
                                while (l--) {
                                    pe_prime[i][j][l] = [pe[i][j][l].length];
                                    m = pe[i][j][l].length;
                                    while (m--) {
                                        pe_prime[i][j][l][m] = [pe[i][j][l][m].length];
                                        n = pe[i][j][l][m].length;
                                        while (n--) {
                                            pe_prime[i][j][l][m][n] = [pe[i][j][l][m][0], pe[i][j][l][m][1]];
                                        }
                                    }
                                }
                            } else {
                                pe_prime[i][j] = [];
                            }

                            d[i][j] = newPathLength;

                            pe[i][j] = [[]];

                            l = pe[i][k][0].length;
                            while (l--) {
                                pe[i][j][0].push(pe[i][k][0][l]);
                            }

                            l = pe[k][j][0].length;
                            while (l--) {
                                pe[i][j][0].push(pe[k][j][0][l]);
                            }
                        } else if (previousPathLength === newPathLength) {
                            if (pe[i][k].length && pe[k][j].length) {
                                var l;
                                if (pe[i][j].length) {
                                    var tmp = [];

                                    l = pe[i][k][0].length;
                                    while (l--) {
                                        tmp.push(pe[i][k][0][l]);
                                    }

                                    l = pe[k][j][0].length;
                                    while (l--) {
                                        tmp.push(pe[k][j][0][l]);
                                    }

                                    pe[i][j].push(tmp);
                                } else {
                                    var _tmp = [];
                                    l = pe[i][k][0].length;
                                    while (l--) {
                                        _tmp.push(pe[i][k][0][l]);
                                    }

                                    l = pe[k][j][0].length;
                                    while (l--) {
                                        _tmp.push(pe[k][j][0][l]);
                                    }

                                    pe[i][j][0] = _tmp;
                                }
                            }
                        } else if (previousPathLength === newPathLength - 1) {
                            var l;
                            if (pe_prime[i][j].length) {
                                var _tmp2 = [];

                                l = pe[i][k][0].length;
                                while (l--) {
                                    _tmp2.push(pe[i][k][0][l]);
                                }

                                l = pe[k][j][0].length;
                                while (l--) {
                                    _tmp2.push(pe[k][j][0][l]);
                                }

                                pe_prime[i][j].push(_tmp2);
                            } else {
                                var _tmp3 = [];

                                l = pe[i][k][0].length;
                                while (l--) {
                                    _tmp3.push(pe[i][k][0][l]);
                                }

                                l = pe[k][j][0].length;
                                while (l--) {
                                    _tmp3.push(pe[k][j][0][l]);
                                }

                                pe_prime[i][j][0] = _tmp3;
                            }
                        }
                    }
                }
            }

            return {
                d: d,
                pe: pe,
                pe_prime: pe_prime
            };
        }

        /**
         * Get the ring candidates from the path-included distance matrices.
         * 
         * @param {Array[]} d The distance matrix.
         * @param {Array[]} pe A matrix containing the shortest paths.
         * @param {Array[]} pe_prime A matrix containing the shortest paths + one vertex.
         * @returns {Array[]} The ring candidates.
         */

    }, {
        key: 'getRingCandidates',
        value: function getRingCandidates(d, pe, pe_prime) {
            var length = d.length;
            var candidates = [];
            var c = 0;

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (d[i][j] === 0 || pe[i][j].length === 1 && pe_prime[i][j] === 0) {
                        continue;
                    } else {
                        // c is the number of vertices in the cycle.
                        if (pe_prime[i][j].length !== 0) {
                            c = 2 * (d[i][j] + 0.5);
                        } else {
                            c = 2 * d[i][j];
                        }

                        if (c !== Infinity) {
                            candidates.push([c, pe[i][j], pe_prime[i][j]]);
                        }
                    }
                }
            }

            // Candidates have to be sorted by c
            candidates.sort(function (a, b) {
                return a[0] - b[0];
            });

            return candidates;
        }

        /**
         * Searches the candidates for the smallest set of smallest rings.
         * 
         * @param {Array[]} c The candidates.
         * @param {Array[]} d The distance matrix.
         * @param {Array[]} adjacencyMatrix An adjacency matrix.
         * @param {Array[]} pe A matrix containing the shortest paths.
         * @param {Array[]} pe_prime A matrix containing the shortest paths + one vertex.
         * @param {Array[]} arrBondCount A matrix containing the bond count of each vertex.
         * @param {Array[]} arrRingCount A matrix containing the number of rings associated with each vertex.
         * @param {Number} nsssr The theoretical number of rings in the graph.
         * @returns {Set[]} The smallest set of smallest rings.
         */

    }, {
        key: 'getSSSR',
        value: function getSSSR(c, d, adjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nsssr) {
            var cSssr = [];
            var allBonds = [];

            for (var i = 0; i < c.length; i++) {
                if (c[i][0] % 2 !== 0) {
                    for (var j = 0; j < c[i][2].length; j++) {
                        var bonds = c[i][1][0].concat(c[i][2][j]);
                        // Some bonds are added twice, resulting in [[u, v], [u, v]] instead of [u, v].
                        // TODO: This is a workaround, fix later. Probably should be a set rather than an array, however the computational overhead
                        //       is probably bigger compared to leaving it like this.
                        for (var k = 0; k < bonds.length; k++) {
                            if (bonds[k][0].constructor === Array) bonds[k] = bonds[k][0];
                        }

                        var atoms = SSSR.bondsToAtoms(bonds);

                        if (SSSR.getBondCount(atoms, adjacencyMatrix) === atoms.size && !SSSR.pathSetsContain(cSssr, atoms, bonds, allBonds, arrBondCount, arrRingCount)) {
                            cSssr.push(atoms);
                            allBonds = allBonds.concat(bonds);
                        }

                        if (cSssr.length > nsssr) {
                            return cSssr;
                        }
                    }
                } else {
                    for (var _j3 = 0; _j3 < c[i][1].length - 1; _j3++) {
                        var _bonds = c[i][1][_j3].concat(c[i][1][_j3 + 1]);
                        // Some bonds are added twice, resulting in [[u, v], [u, v]] instead of [u, v].
                        // TODO: This is a workaround, fix later. Probably should be a set rather than an array, however the computational overhead
                        //       is probably bigger compared to leaving it like this.
                        for (var k = 0; k < _bonds.length; k++) {
                            if (_bonds[k][0].constructor === Array) _bonds[k] = _bonds[k][0];
                        }

                        var _atoms = SSSR.bondsToAtoms(_bonds);

                        if (SSSR.getBondCount(_atoms, adjacencyMatrix) === _atoms.size && !SSSR.pathSetsContain(cSssr, _atoms, _bonds, allBonds, arrBondCount, arrRingCount)) {
                            cSssr.push(_atoms);
                            allBonds = allBonds.concat(_bonds);
                        }

                        if (cSssr.length > nsssr) {
                            return cSssr;
                        }
                    }
                }
            }

            return cSssr;
        }

        /**
         * Returns the number of edges in a graph defined by an adjacency matrix.
         * 
         * @param {Array[]} adjacencyMatrix An adjacency matrix.
         * @returns {Number} The number of edges in the graph defined by the adjacency matrix.
         */

    }, {
        key: 'getEdgeCount',
        value: function getEdgeCount(adjacencyMatrix) {
            var edgeCount = 0;
            var length = adjacencyMatrix.length;

            var i = length - 1;
            while (i--) {
                var j = length;
                while (j--) {
                    if (adjacencyMatrix[i][j] === 1) {
                        edgeCount++;
                    }
                }
            }

            return edgeCount;
        }

        /**
         * Returns an edge list constructed form an adjacency matrix.
         * 
         * @param {Array[]} adjacencyMatrix An adjacency matrix.
         * @returns {Array[]} An edge list. E.g. [ [ 0, 1 ], ..., [ 16, 2 ] ]
         */

    }, {
        key: 'getEdgeList',
        value: function getEdgeList(adjacencyMatrix) {
            var length = adjacencyMatrix.length;
            var edgeList = [];

            var i = length - 1;
            while (i--) {
                var j = length;
                while (j--) {
                    if (adjacencyMatrix[i][j] === 1) {
                        edgeList.push([i, j]);
                    }
                }
            }

            return edgeList;
        }

        /**
         * Return a set of vertex indices contained in an array of bonds.
         * 
         * @param {Array} bonds An array of bonds. A bond is defined as [ sourceVertexId, targetVertexId ].
         * @returns {Set<Number>} An array of vertices.
         */

    }, {
        key: 'bondsToAtoms',
        value: function bondsToAtoms(bonds) {
            var atoms = new Set();

            var i = bonds.length;
            while (i--) {
                atoms.add(bonds[i][0]);
                atoms.add(bonds[i][1]);
            }
            return atoms;
        }

        /**
        * Returns the number of bonds within a set of atoms.
        * 
        * @param {Set<Number>} atoms An array of atom ids.
        * @param {Array[]} adjacencyMatrix An adjacency matrix.
        * @returns {Number} The number of bonds in a set of atoms.
        */

    }, {
        key: 'getBondCount',
        value: function getBondCount(atoms, adjacencyMatrix) {
            var count = 0;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = atoms[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var u = _step7.value;
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = atoms[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var v = _step8.value;

                            if (u === v) {
                                continue;
                            }
                            count += adjacencyMatrix[u][v];
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return count / 2;
        }

        /**
         * Checks whether or not a given path already exists in an array of paths.
         * 
         * @param {Set[]} pathSets An array of sets each representing a path.
         * @param {Set<Number>} pathSet A set representing a path.
         * @param {Array[]} bonds The bonds associated with the current path.
         * @param {Array[]} allBonds All bonds currently associated with rings in the SSSR set.
         * @param {Array[]} arrBondCount A matrix containing the bond count of each vertex.
         * @param {Array[]} arrRingCount A matrix containing the number of rings associated with each vertex.
         * @returns {Boolean} A boolean indicating whether or not a give path is contained within a set.
         */

    }, {
        key: 'pathSetsContain',
        value: function pathSetsContain(pathSets, pathSet, bonds, allBonds, arrBondCount, arrRingCount) {
            var i = pathSets.length;
            while (i--) {
                if (SSSR.isSupersetOf(pathSet, pathSets[i])) {
                    return true;
                }

                if (pathSets[i].size !== pathSet.size) {
                    continue;
                }

                if (SSSR.areSetsEqual(pathSets[i], pathSet)) {
                    return true;
                }
            }

            // Check if the edges from the candidate are already all contained within the paths of the set of paths.
            // TODO: For some reason, this does not replace the isSupersetOf method above -> why?
            var count = 0;
            var allContained = false;
            i = bonds.length;
            while (i--) {
                var j = allBonds.length;
                while (j--) {
                    if (bonds[i][0] === allBonds[j][0] && bonds[i][1] === allBonds[j][1] || bonds[i][1] === allBonds[j][0] && bonds[i][0] === allBonds[j][1]) {
                        count++;
                    }

                    if (count === bonds.length) {
                        allContained = true;
                    }
                }
            }

            // If all the bonds and thus vertices are already contained within other rings
            // check if there's one vertex with ringCount < bondCount
            var specialCase = false;
            if (allContained) {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = pathSet[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var _element4 = _step9.value;

                        if (arrRingCount[_element4] < arrBondCount[_element4]) {
                            specialCase = true;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            }

            if (allContained && !specialCase) {
                return true;
            }

            // Update the ring counts for the vertices
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = pathSet[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var _element5 = _step10.value;

                    arrRingCount[_element5]++;
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            return false;
        }

        /**
         * Checks whether or not two sets are equal (contain the same elements).
         * 
         * @param {Set<Number>} setA A set.
         * @param {Set<Number>} setB A set.
         * @returns {Boolean} A boolean indicating whether or not the two sets are equal.
         */

    }, {
        key: 'areSetsEqual',
        value: function areSetsEqual(setA, setB) {
            if (setA.size !== setB.size) {
                return false;
            }

            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = setA[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var _element6 = _step11.value;

                    if (!setB.has(_element6)) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                        _iterator11.return();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return true;
        }

        /**
         * Checks whether or not a set (setA) is a superset of another set (setB).
         * 
         * @param {Set<Number>} setA A set.
         * @param {Set<Number>} setB A set.
         * @returns {Boolean} A boolean indicating whether or not setB is a superset of setA.
         */

    }, {
        key: 'isSupersetOf',
        value: function isSupersetOf(setA, setB) {
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = setB[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var element = _step12.value;

                    if (!setA.has(element)) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            return true;
        }
    }]);

    return SSSR;
}();
/** 
 * A class representing a 2D vector.
 * 
 * @property {Number} x The x component of the vector.
 * @property {Number} y The y component of the vector.
 */
SmilesDrawer.Vector2 = function () {
    /**
     * The constructor of the class Vector2.
     *
     * @param {Number} x The initial x coordinate value.
     * @param {Number} y The initial y coordinate value.
     */
    function Vector2(x, y) {
        _classCallCheck(this, Vector2);

        if (arguments.length == 0) {
            this.x = 0;
            this.y = 0;
        } else if (arguments.length == 1) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Clones this vector and returns the clone.
     *
     * @returns {SmilesDrawer.Vector2} The clone of this vector.
     */


    _createClass(Vector2, [{
        key: 'clone',
        value: function clone() {
            return new SmilesDrawer.Vector2(this.x, this.y);
        }

        /**
         * Returns a string representation of this vector.
         *
         * @returns {String} A string representation of this vector.
         */

    }, {
        key: 'toString',
        value: function toString() {
            return '(' + this.x + ',' + this.y + ')';
        }

        /**
         * Add the x and y coordinate values of a vector to the x and y coordinate values of this vector.
         *
         * @param {SmilesDrawer.Vector2} vec Another vector.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'add',
        value: function add(vec) {
            this.x += vec.x;
            this.y += vec.y;

            return this;
        }

        /**
         * Subtract the x and y coordinate values of a vector from the x and y coordinate values of this vector.
         *
         * @param {SmilesDrawer.Vector2} vec Another vector.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'subtract',
        value: function subtract(vec) {
            this.x -= vec.x;
            this.y -= vec.y;

            return this;
        }

        /**
         * Divide the x and y coordinate values of this vector by a scalar.
         *
         * @param {Number} scalar The scalar.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'divide',
        value: function divide(scalar) {
            this.x /= scalar;
            this.y /= scalar;

            return this;
        }

        /**
         * Multiply the x and y coordinate values of this vector by the values of another vector.
         *
         * @param {SmilesDrawer.Vector2} v A vector.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'multiply',
        value: function multiply(v) {
            this.x *= v.x;
            this.y *= v.y;

            return this;
        }

        /**
         * Multiply the x and y coordinate values of this vector by a scalar.
         *
         * @param {Number} scalar The scalar.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(scalar) {
            this.x *= scalar;
            this.y *= scalar;

            return this;
        }

        /**
         * Inverts this vector. Same as multiply(-1.0).
         *
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'invert',
        value: function invert() {
            this.x = -this.x;
            this.y = -this.y;

            return this;
        }

        /**
         * Returns the angle of this vector in relation to the coordinate system.
         *
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'angle',
        value: function angle() {
            return Math.atan2(this.y, this.x);
        }

        /**
         * Returns the euclidean distance between this vector and another vector.
         *
         * @param {SmilesDrawer.Vector2} vec A vector.
         * @returns {Number} The euclidean distance between the two vectors.
         */

    }, {
        key: 'distance',
        value: function distance(vec) {
            return Math.sqrt((vec.x - this.x) * (vec.x - this.x) + (vec.y - this.y) * (vec.y - this.y));
        }

        /**
         * Returns the squared euclidean distance between this vector and another vector. When only the relative distances of a set of vectors are needed, this is is less expensive than using distance(vec).
         *
         * @param {SmilesDrawer.Vector2} vec Another vector.
         * @returns {Number} The squared euclidean distance of the two vectors.
         */

    }, {
        key: 'distanceSq',
        value: function distanceSq(vec) {
            return (vec.x - this.x) * (vec.x - this.x) + (vec.y - this.y) * (vec.y - this.y);
        }

        /**
         * Checks whether or not this vector is in a clockwise or counter-clockwise rotational direction compared to another vector in relation to the coordinate system.
         *
         * @param {SmilesDrawer.Vector2} vec Another vector.
         * @returns {Number} Returns -1, 0 or 1 if the vector supplied as an argument is clockwise, neutral or counter-clockwise respectively to this vector in relation to the coordinate system.
         */

    }, {
        key: 'clockwise',
        value: function clockwise(vec) {
            var a = this.y * vec.x;
            var b = this.x * vec.y;

            if (a > b) {
                return -1;
            } else if (a === b) {
                return 0;
            }

            return 1;
        }

        /**
         * Rotates this vector by a given number of radians around the origin of the coordinate system.
         *
         * @param {Number} angle The angle in radians to rotate the vector.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'rotate',
        value: function rotate(angle) {
            var tmp = new SmilesDrawer.Vector2();
            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            tmp.x = this.x * cosAngle - this.y * sinAngle;
            tmp.y = this.x * sinAngle + this.y * cosAngle;

            this.x = tmp.x;
            this.y = tmp.y;

            return this;
        }

        /**
         * Rotates this vector around another vector.
         *
         * @param {Number} angle The angle in radians to rotate the vector.
         * @param {SmilesDrawer.Vector2} vec The vector which is used as the rotational center.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'rotateAround',
        value: function rotateAround(angle, vec) {
            var s = Math.sin(angle);
            var c = Math.cos(angle);

            this.x -= vec.x;
            this.y -= vec.y;

            var x = this.x * c - this.y * s;
            var y = this.x * s + this.y * c;

            this.x = x + vec.x;
            this.y = y + vec.y;

            return this;
        }

        /**
         * Rotate a vector around a given center to the same angle as another vector (so that the two vectors and the center are in a line, with both vectors on one side of the center), keeps the distance from this vector to the center.
         *
         * @param {SmilesDrawer.Vector2} vec The vector to rotate this vector to.
         * @param {SmilesDrawer.Vector2} center The rotational center.
         * @param {Number} [offsetAngle=0.0] An additional amount of radians to rotate the vector.
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'rotateTo',
        value: function rotateTo(vec, center) {
            var offsetAngle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;

            // Problem if this is first position
            this.x += 0.001;
            this.y -= 0.001;

            var a = SmilesDrawer.Vector2.subtract(this, center);
            var b = SmilesDrawer.Vector2.subtract(vec, center);
            var angle = SmilesDrawer.Vector2.angle(b, a);

            this.rotateAround(angle + offsetAngle, center);

            return this;
        }

        /**
         * Rotates the vector away from a specified vector around a center.
         * 
         * @param {SmilesDrawer.Vector2} vec The vector this one is rotated away from.
         * @param {SmilesDrawer.Vector2} center The rotational center.
         * @param {Number} angle The angle by which to rotate.
         */

    }, {
        key: 'rotateAwayFrom',
        value: function rotateAwayFrom(vec, center, angle) {
            this.rotateAround(angle, center);

            var distSqA = this.distanceSq(vec);

            this.rotateAround(-2.0 * angle, center);

            var distSqB = this.distanceSq(vec);

            // If it was rotated towards the other vertex, rotate in other direction by same amount.
            if (distSqB < distSqA) {
                this.rotateAround(2.0 * angle, center);
            }
        }

        /**
         * Returns the angle in radians used to rotate this vector away from a given vector.
         * 
         * @param {SmilesDrawer.Vector2} vec The vector this one is rotated away from.
         * @param {SmilesDrawer.Vector2} center The rotational center.
         * @param {Number} angle The angle by which to rotate.
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'getRotateAwayFromAngle',
        value: function getRotateAwayFromAngle(vec, center, angle) {
            var tmp = this.clone();

            tmp.rotateAround(angle, center);

            var distSqA = tmp.distanceSq(vec);

            tmp.rotateAround(-2.0 * angle, center);

            var distSqB = tmp.distanceSq(vec);

            if (distSqB < distSqA) {
                return angle;
            } else {
                return -angle;
            }
        }

        /**
         * Returns the angle in radians used to rotate this vector towards a given vector.
         * 
         * @param {SmilesDrawer.Vector2} vec The vector this one is rotated towards to.
         * @param {SmilesDrawer.Vector2} center The rotational center.
         * @param {Number} angle The angle by which to rotate.
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'getRotateTowardsAngle',
        value: function getRotateTowardsAngle(vec, center, angle) {
            var tmp = this.clone();

            tmp.rotateAround(angle, center);

            var distSqA = tmp.distanceSq(vec);

            tmp.rotateAround(-2.0 * angle, center);

            var distSqB = tmp.distanceSq(vec);

            if (distSqB > distSqA) {
                return angle;
            } else {
                return -angle;
            }
        }

        /**
         * Gets the angles between this vector and another vector around a common center of rotation.
         *
         * @param {SmilesDrawer.Vector2} vec Another vector.
         * @param {SmilesDrawer.Vector2} center The center of rotation.
         * @returns {Number} The angle between this vector and another vector around a center of rotation in radians.
         */

    }, {
        key: 'getRotateToAngle',
        value: function getRotateToAngle(vec, center) {
            var a = SmilesDrawer.Vector2.subtract(this, center);
            var b = SmilesDrawer.Vector2.subtract(vec, center);
            var angle = SmilesDrawer.Vector2.angle(b, a);

            return Number.isNaN(angle) ? 0.0 : angle;
        }

        /**
         * Checks whether a vector lies within a polygon spanned by a set of vectors.
         *
         * @param {SmilesDrawer.Vector2[]} polygon An array of vectors spanning the polygon.
         * @returns {Boolean} A boolean indicating whether or not this vector is within a polygon.
         */

    }, {
        key: 'isInPolygon',
        value: function isInPolygon(polygon) {
            var inside = false;

            // Its not always a given, that the polygon is convex (-> sugars)
            for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                if (polygon[i].y > this.y != polygon[j].y > this.y && this.x < (polygon[j].x - polygon[i].x) * (this.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
                    inside = !inside;
                }
            }

            return inside;
        }

        /**
         * Returns the length of this vector.
         *
         * @returns {Number} The length of this vector.
         */

    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        /**
         * Returns the square of the length of this vector.
         *
         * @returns {Number} The square of the length of this vector.
         */

    }, {
        key: 'lengthSq',
        value: function lengthSq() {
            return this.x * this.x + this.y * this.y;
        }

        /**
         * Normalizes this vector.
         *
         * @returns {SmilesDrawer.Vector2} Returns itself.
         */

    }, {
        key: 'normalize',
        value: function normalize() {
            this.divide(this.length());

            return this;
        }

        /**
         * Returns a normalized copy of this vector.
         *
         * @returns {SmilesDrawer.Vector2} A normalized copy of this vector.
         */

    }, {
        key: 'normalized',
        value: function normalized() {
            return SmilesDrawer.Vector2.divide(this, this.length());
        }

        /**
         * Calculates which side of a line spanned by two vectors this vector is.
         *
         * @param {SmilesDrawer.Vector2} vecA A vector.
         * @param {SmilesDrawer.Vector2} vecB A vector.
         * @returns {Number} A number indicating the side of this vector, given a line spanned by two other vectors.
         */

    }, {
        key: 'whichSide',
        value: function whichSide(vecA, vecB) {
            return (this.x - vecA.x) * (vecB.y - vecA.y) - (this.y - vecA.y) * (vecB.x - vecA.x);
        }

        /**
         * Checks whether or not this vector is on the same side of a line spanned by two vectors as another vector.
         *
         * @param {SmilesDrawer.Vector2} vecA A vector spanning the line.
         * @param {SmilesDrawer.Vector2} vecB A vector spanning the line.
         * @param {SmilesDrawer.Vector2} vecC A vector to check whether or not it is on the same side as this vector.
         * @returns {Boolean} Returns a boolean indicating whether or not this vector is on the same side as another vector.
         */

    }, {
        key: 'sameSideAs',
        value: function sameSideAs(vecA, vecB, vecC) {
            var d = this.whichSide(vecA, vecB);
            var dRef = vecC.whichSide(vecA, vecB);

            return d < 0 && dRef < 0 || d == 0 && dRef == 0 || d > 0 && dRef > 0;
        }

        /**
         * Adds two vectors and returns the result as a new vector.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A summand.
         * @param {SmilesDrawer.Vector2} vecB A summand.
         * @returns {SmilesDrawer.Vector2} Returns the sum of two vectors.
         */

    }], [{
        key: 'add',
        value: function add(vecA, vecB) {
            return new SmilesDrawer.Vector2(vecA.x + vecB.x, vecA.y + vecB.y);
        }

        /**
         * Subtracts one vector from another and returns the result as a new vector.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA The minuend.
         * @param {SmilesDrawer.Vector2} vecB The subtrahend.
         * @returns {SmilesDrawer.Vector2} Returns the difference of two vectors.
         */

    }, {
        key: 'subtract',
        value: function subtract(vecA, vecB) {
            return new SmilesDrawer.Vector2(vecA.x - vecB.x, vecA.y - vecB.y);
        }

        /**
         * Multiplies two vectors (value by value) and returns the result.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector.
         * @param {SmilesDrawer.Vector2} vecB A vector.
         * @returns {SmilesDrawer.Vector2} Returns the product of two vectors.
         */

    }, {
        key: 'multiply',
        value: function multiply(vecA, vecB) {
            return new SmilesDrawer.Vector2(vecA.x * vecB.x, vecA.y * vecB.y);
        }

        /**
         * Multiplies two vectors (value by value) and returns the result.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vec A vector.
         * @param {Number} scalar A scalar.
         * @returns {SmilesDrawer.Vector2} Returns the product of two vectors.
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(vec, scalar) {
            return new SmilesDrawer.Vector2(vec).multiply(scalar);
        }

        /**
         * Returns the midpoint of a line spanned by two vectors.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector spanning the line.
         * @param {SmilesDrawer.Vector2} vecB A vector spanning the line.
         * @returns {SmilesDrawer.Vector2} The midpoint of the line spanned by two vectors.
         */

    }, {
        key: 'midpoint',
        value: function midpoint(vecA, vecB) {
            return new SmilesDrawer.Vector2((vecA.x + vecB.x) / 2, (vecA.y + vecB.y) / 2);
        }

        /**
         * Returns the normals of a line spanned by two vectors.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector spanning the line.
         * @param {SmilesDrawer.Vector2} vecB A vector spanning the line.
         * @returns {SmilesDrawer.Vector2[]} An array containing the two normals, each represented by a vector.
         */

    }, {
        key: 'normals',
        value: function normals(vecA, vecB) {
            var delta = SmilesDrawer.Vector2.subtract(vecB, vecA);

            return [new SmilesDrawer.Vector2(-delta.y, delta.x), new SmilesDrawer.Vector2(delta.y, -delta.x)];
        }

        /**
         * Returns the unit (normalized normal) vectors of a line spanned by two vectors.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector spanning the line.
         * @param {SmilesDrawer.Vector2} vecB A vector spanning the line.
         * @returns {SmilesDrawer.Vector2[]} An array containing the two unit vectors.
         */

    }, {
        key: 'units',
        value: function units(vecA, vecB) {
            var delta = SmilesDrawer.Vector2.subtract(vecB, vecA);

            return [new SmilesDrawer.Vector2(-delta.y, delta.x).normalize(), new SmilesDrawer.Vector2(delta.y, -delta.x).normalize()];
        }

        /**
         * Divides a vector by another vector and returns the result as new vector.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA The dividend.
         * @param {SmilesDrawer.Vector2} vecB The divisor.
         * @returns {SmilesDrawer.Vector2} The fraction of the two vectors.
         */

    }, {
        key: 'divide',
        value: function divide(vecA, vecB) {
            if (vecB.x && vecB.y) {
                return new SmilesDrawer.Vector2(vecA.x / vecB.x, vecA.y / vecB.y);
            }

            return new SmilesDrawer.Vector2(vecA.x / vecB, vecA.y / vecB);
        }

        /**
         * Returns the dot product of two vectors.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector.
         * @param {SmilesDrawer.Vector2} vecB A vector.
         * @returns {Number} The dot product of two vectors.
         */

    }, {
        key: 'dot',
        value: function dot(vecA, vecB) {
            return vecA.x * vecB.x + vecA.y * vecB.y;
        }

        /**
         * Returns the angle between two vectors.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector.
         * @param {SmilesDrawer.Vector2} vecB A vector.
         * @returns {Number} The angle between two vectors in radians.
         */

    }, {
        key: 'angle',
        value: function angle(vecA, vecB) {
            var dot = SmilesDrawer.Vector2.dot(vecA, vecB);

            return Math.acos(dot / (vecA.length() * vecB.length()));
        }

        /**
         * Returns the angle between two vectors based on a third vector in between.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA A vector.
         * @param {SmilesDrawer.Vector2} vecB A vector.
         * @param {SmilesDrawer.Vector2} vecC A vector.
         * @returns {Number} The angle in radians.
         */

    }, {
        key: 'threePointangle',
        value: function threePointangle(vecA, vecB, vecC) {
            var ab = SmilesDrawer.Vector2.subtract(vecB, vecA);
            var bc = SmilesDrawer.Vector2.subtract(vecC, vecB);
            var abLength = vecA.distance(vecB);
            var bcLength = vecB.distance(vecC);

            return Math.acos(SmilesDrawer.Vector2.dot(ab, bc) / (abLength * bcLength));
        }

        /**
         * Returns the scalar projection of a vector on another vector.
         *
         * @static
         * @param {SmilesDrawer.Vector2} vecA The vector to be projected.
         * @param {SmilesDrawer.Vector2} vecB The vector to be projection upon.
         * @returns {Number} The scalar component.
         */

    }, {
        key: 'scalarProjection',
        value: function scalarProjection(vecA, vecB) {
            var unit = vecB.normalized();

            return SmilesDrawer.Vector2.dot(vecA, unit);
        }

        /**
        * Returns the average vector (normalized) of the input vectors.
        *
        * @static
        * @param {Array()} vecs An array containing vectors.
        * @returns {SmilesDrawer.Vector2} The resulting vector (normalized).
        */

    }, {
        key: 'averageDirection',
        value: function averageDirection(vecs) {
            var avg = new SmilesDrawer.Vector2(0.0, 0.0);

            for (var i = 0; i < vecs.length; i++) {
                var vec = vecs[i];
                avg.add(vec);
            }

            return avg.normalize();
        }
    }]);

    return Vector2;
}();

/** 
 * A class representing a vertex.
 * 
 * @property {Number} id The id of this vertex.
 * @property {Atom} value The atom associated with this vertex.
 * @property {SmilesDrawer.Vector2} position The position of this vertex.
 * @property {SmilesDrawer.Vector2} previousPosition The position of the previous vertex.
 * @property {Number|null} parentVertexId The id of the previous vertex.
 * @property {Number[]} children The ids of the children of this vertex.
 * @property {Number[]} spanningTreeChildren The ids of the children of this vertex as defined in the spanning tree defined by the SMILES.
 * @property {Number[]} edges The ids of edges associated with this vertex.
 * @property {Boolean} positioned A boolean indicating whether or not this vertex has been positioned.
 * @property {Number} angle The angle of this vertex.
 * @property {Number} globalAngle The global angle of this vertex.
 * @property {Number} dir The direction of this vertex.
 * @property {Number} neighbourCount The number of neighbouring vertices.
 * @property {Number[]} neighbours The vertex ids of neighbouring vertices.
 * @property {String[]} neighbouringElements The element symbols associated with neighbouring vertices.
 * @property {Boolean} forcePositioned A boolean indicating whether or not this vertex was positioned using a force-based approach.
 */
SmilesDrawer.Vertex = function () {
    /**
     * The constructor for the class Vertex.
     *
     * @param {*} value The value associated with this vertex.
     * @param {Number} [x=0] The initial x coordinate of the positional vector of this vertex.
     * @param {Number} [y=0] The initial y coordinate of the positional vector of this vertex.
     */
    function Vertex(value) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, Vertex);

        this.id = null;
        this.value = value;
        this.position = new SmilesDrawer.Vector2(x ? x : 0, y ? y : 0);
        this.previousPosition = new SmilesDrawer.Vector2(0, 0);
        this.parentVertexId = null;
        this.children = [];
        this.spanningTreeChildren = [];
        this.edges = [];
        this.positioned = false;
        this.angle = 0.0;
        this.globalAngle = 0.0;
        this.dir = 1.0;
        this.neighbourCount = 0;
        this.neighbours = [];
        this.neighbouringElements = [];
        this.forcePositioned = false;
    }

    /**
     * Set the 2D coordinates of the vertex.
     * 
     * @param {Number} x The x component of the coordinates.
     * @param {Number} y The y component of the coordinates.
     * 
     */


    _createClass(Vertex, [{
        key: 'setPosition',
        value: function setPosition(x, y) {
            this.position.x = x;
            this.position.y = y;
        }

        /**
         * Set the 2D coordinates of the vertex from a Vector2.
         * 
         * @param {SmilesDrawer.Vector2} v A 2D vector.
         * 
         */

    }, {
        key: 'setPositionFromVector',
        value: function setPositionFromVector(v) {
            this.position.x = v.x;
            this.position.y = v.y;
        }

        /**
         * Add a child vertex id to this vertex.
         * @param {Number} vertexID The id of a vertex to be added as a child to this vertex.
         */

    }, {
        key: 'addChild',
        value: function addChild(vertexId) {
            this.neighbourCount++;
            this.children.push(vertexId);
            this.neighbours.push(vertexId);

            this.value.bondCount++;
        }

        /**
         * Set the vertex id of the parent.
         * 
         * @param {Number} parentVertexId The parents vertex id.
         */

    }, {
        key: 'setParentVertexId',
        value: function setParentVertexId(parentVertexId) {
            this.neighbourCount++;
            this.parentVertexId = parentVertexId;
            this.neighbours.push(parentVertexId);

            this.value.bondCount++;
        }

        /**
         * Returns true if this vertex is terminal (has no parent or child vertices), otherwise returns false. Always returns true if associated value has property hasAttachedPseudoElements set to true.
         *
         * @returns {Boolean} A boolean indicating whether or not this vertex is terminal.
         */

    }, {
        key: 'isTerminal',
        value: function isTerminal() {
            if (this.value.hasAttachedPseudoElements) {
                return true;
            }

            return this.parentVertexId === null && this.children.length < 2 || this.children.length === 0;
        }

        /**
         * Clones this vertex and returns the clone.
         *
         * @returns {SmilesDrawer.Vertex} A clone of this vertex.
         */

    }, {
        key: 'clone',
        value: function clone() {
            var clone = new Vertex(this.value, this.position.x, this.position.y);
            clone.id = this.id;
            clone.previousPosition = new SmilesDrawer.Vector2(this.previousPosition.x, this.previousPosition.y);
            clone.parentVertexId = this.parentVertexId;
            clone.children = SmilesDrawer.ArrayHelper.clone(this.children);
            clone.spanningTreeChildren = SmilesDrawer.ArrayHelper.clone(this.spanningTreeChildren);
            clone.edges = SmilesDrawer.ArrayHelper.clone(this.edges);
            clone.positioned = this.positioned;
            clone.angle = this.angle;
            clone.forcePositioned = this.forcePositioned;
            return clone;
        }

        /**
         * Returns true if this vertex and the supplied vertex both have the same id, else returns false.
         *
         * @param {SmilesDrawer.Vertex} vertex The vertex to check.
         * @returns {Boolean} A boolean indicating whether or not the two vertices have the same id.
         */

    }, {
        key: 'equals',
        value: function equals(vertex) {
            return this.id === vertex.id;
        }

        /**
         * Returns the angle of this vertexes positional vector. If a reference vector is supplied in relations to this vector, else in relations to the coordinate system.
         *
         * @param {SmilesDrawer.Vertex} [referenceVector=null] - The reference vector.
         * @param {Boolean} [returnAsDegrees=false] - If true, returns angle in degrees, else in radians.
         * @returns {Number} The angle of this vertex.
         */

    }, {
        key: 'getAngle',
        value: function getAngle() {
            var referenceVector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var returnAsDegrees = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var u = null;

            if (!referenceVector) {
                u = SmilesDrawer.Vector2.subtract(this.position, this.previousPosition);
            } else {
                u = SmilesDrawer.Vector2.subtract(this.position, referenceVector);
            }

            if (returnAsDegrees) {
                return SmilesDrawer.MathHelper.toDeg(u.angle());
            }

            return u.angle();
        }

        /**
         * Returns the suggested text direction when text is added at the position of this vertex.
         *
         * @param {SmilesDrawer.Vertex[]} vertices The array of vertices for the current molecule.
         * @returns {String} The suggested direction of the text.
         */

    }, {
        key: 'getTextDirection',
        value: function getTextDirection(vertices) {
            var neighbours = this.getDrawnNeighbours(vertices);
            var angles = [];

            for (var i = 0; i < neighbours.length; i++) {
                angles.push(this.getAngle(vertices[neighbours[i]].position));
            }

            var textAngle = SmilesDrawer.MathHelper.meanAngle(angles);

            // Round to 0, 90, 180 or 270 degree
            var halfPi = Math.PI / 2.0;
            textAngle = Math.round(Math.round(textAngle / halfPi) * halfPi, 3);

            if (textAngle === 2) {
                return 'down';
            } else if (textAngle === -2) {
                return 'up';
            } else if (textAngle === 0 || textAngle === -0) {
                return 'right'; // is checking for -0 necessary?
            } else if (textAngle === 3 || textAngle === -3) {
                return 'left';
            } else {
                return 'down'; // default to down
            }
        }

        /**
         * Returns an array of ids of neighbouring vertices.
         *
         * @param {Number} [vertexId=null] If a value is supplied, the vertex with this id is excluded from the returned indices.
         * @returns {Number[]} An array containing the ids of neighbouring vertices.
         */

    }, {
        key: 'getNeighbours',
        value: function getNeighbours() {
            var vertexId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (vertexId === null) {
                return this.neighbours;
            }

            var arr = [];

            for (var i = 0; i < this.neighbours.length; i++) {
                if (this.neighbours[i] !== vertexId) {
                    arr.push(this.neighbours[i]);
                }
            }

            return arr;
        }

        /**
         * Returns an array of ids of neighbouring vertices that will be drawn (vertex.value.isDrawn === true).
         * 
         * @param {SmilesDrawer.Vertex[]} vertices An array containing the vertices associated with the current molecule.
         * @returns {Number[]} An array containing the ids of neighbouring vertices that will be drawn.
         */

    }, {
        key: 'getDrawnNeighbours',
        value: function getDrawnNeighbours(vertices) {
            var arr = [];

            for (var i = 0; i < this.neighbours.length; i++) {
                if (vertices[this.neighbours[i]].value.isDrawn) {
                    arr.push(this.neighbours[i]);
                }
            }

            return arr;
        }

        /**
         * Returns the number of neighbours of this vertex.
         *
         * @returns {Number} The number of neighbours.
         */

    }, {
        key: 'getNeighbourCount',
        value: function getNeighbourCount() {
            return this.neighbourCount;
        }

        /**
         * Returns a list of ids of vertices neighbouring this one in the original spanning tree, excluding the ringbond connections.
         *
         * @param {Number} [vertexId=null] If supplied, the vertex with this id is excluded from the array returned.
         * @returns {Number[]} An array containing the ids of the neighbouring vertices.
         */

    }, {
        key: 'getSpanningTreeNeighbours',
        value: function getSpanningTreeNeighbours() {
            var vertexId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var neighbours = [];

            for (var i = 0; i < this.spanningTreeChildren.length; i++) {
                if (vertexId === undefined || vertexId != this.spanningTreeChildren[i]) {
                    neighbours.push(this.spanningTreeChildren[i]);
                }
            }

            if (this.parentVertexId != null) {
                if (vertexId === undefined || vertexId != this.parentVertexId) {
                    neighbours.push(this.parentVertexId);
                }
            }

            return neighbours;
        }

        /**
         * Gets the next vertex in the ring in opposide direction to the supplied vertex id.
         *
         * @param {SmilesDrawer.Vertex[]} vertices The array of vertices for the current molecule.
         * @param {Number} ringId The id of the ring containing this vertex.
         * @param {Number} previousVertexId The id of the previous vertex. The next vertex will be opposite from the vertex with this id as seen from this vertex.
         * @returns {Number} The id of the next vertex in the ring.
         */

    }, {
        key: 'getNextInRing',
        value: function getNextInRing(vertices, ringId, previousVertexId) {
            var neighbours = this.getNeighbours();

            for (var i = 0; i < neighbours.length; i++) {
                if (SmilesDrawer.ArrayHelper.contains(vertices[neighbours[i]].value.rings, { value: ringId }) && neighbours[i] != previousVertexId) {
                    return neighbours[i];
                }
            }

            return null;
        }
    }]);

    return Vertex;
}();