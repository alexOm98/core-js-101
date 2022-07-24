/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const res = JSON.parse(json);
  Object.setPrototypeOf(res, proto);
  return res;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const order = [
  'el',
  'id',
  'class',
  'attr',
  'pseudoClass',
  'pseudoEl',
];
const oneTimeSelectors = ['el', 'id', 'pseudoEl'];
const error1 = 'Element, id and pseudo-element should not occur more then one time inside the selector';
const error2 = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';

class SelectorBuilder {
  constructor() {
    this.usedSelectors = [];
    this.str = '';
  }

  element(value) {
    this.process('el');
    this.str += value;
    return this;
  }

  id(value) {
    this.process('id');
    this.str += `#${value}`;
    return this;
  }

  class(value) {
    this.process('class');
    this.str += `.${value}`;
    return this;
  }

  attr(value) {
    this.process('attr');
    this.str += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.process('pseudoClass');
    this.str += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.process('pseudoEl');
    this.str += `::${value}`;
    return this;
  }

  process(selector) {
    if (this.usedSelectors[this.usedSelectors.length - 1] === selector
      && oneTimeSelectors.includes(selector)) throw new Error(error1);
    if (order.indexOf(this.usedSelectors[this.usedSelectors.length - 1])
      > order.indexOf(selector)) throw new Error(error2);
    this.usedSelectors.push(selector);
  }

  stringify() {
    return this.str;
  }
}
const cssSelectorBuilder = {
  element: (value) => new SelectorBuilder().element(value),

  id: (value) => new SelectorBuilder().id(value),

  class: (value) => new SelectorBuilder().class(value),

  attr: (value) => new SelectorBuilder().attr(value),

  pseudoClass: (value) => new SelectorBuilder().pseudoClass(value),

  pseudoElement: (value) => new SelectorBuilder().pseudoElement(value),

  combine(sel1, combin, sel2) {
    this.str = `${sel1.str} ${combin} ${sel2.str}`;
    return this;
  },
  stringify() {
    return this.str;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
