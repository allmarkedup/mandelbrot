'use strict';

const $ = global.jQuery;

const parsers = {
  'json': JSON.parse,
  'yaml': require('js-yaml').safeLoad
};

module.exports = class Editor {

  constructor(el) {

    this._el = $(el);

    const lang = el.getAttribute('data-lang');
    this._lang = lang;

    if (!parsers.hasOwnProperty(lang)) {
      throw new Error('invalid data-lang value: "' + lang + '"');
    }

    this._mirror = window.CodeMirror.fromTextArea(el, {
      mode: lang
    });

    this._mirror.on('change', () => {
      let value;
      try {
        value = parsers[lang](this.value);
      } catch (error) {
        return console.warn('Unable to parse: ' + error);
      }

      this._el.trigger('data', value);
    });

  }

  get language() {
    return this._lang;
  }

  get value() {
    return this._mirror.getValue();
  }

  on(...args) {
    return this._el.on(...args);
  }

};
