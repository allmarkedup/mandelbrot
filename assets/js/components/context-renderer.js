'use strict';

const $ = global.jQuery;
const nunjucks = require('nunjucks');

module.exports = class Renderer {

  constructor(el) {
    this._el = $(el);
    this._iframe = this._el.find('iframe').get(0);
    if (!this._iframe) {
      throw new Error('No iframe found in preview renderer!');
    }
    let script = this._el.find('script[type="fractal/context-template"]');
    this._template = script.get(0).textContent;
  }

  update(data) {
    this._data = data;
    const template = this._template;
    const html = nunjucks.renderString(template, data);
    console.warn('render(', template, data, ') =>', html);
    const doc = this._iframe.contentDocument;
    const root = doc.querySelector('[data-behaviour="context-preview"]');
    (root || doc.body).innerHTML = html;
  }

};
