'use strict';

global.jQuery    = require('jquery');
const pjax       = require('jquery-pjax');
const $          = global.jQuery;
const doc        = $(document);
const frctl      = window.frctl || {};

const events     = require('./events');
const utils      = require('./utils');
const framer     = require('./components/frame');
const Tree       = require('./components/tree');
const Pen        = require('./components/pen');
const Editor     = require('./components/context-editor');
const Renderer   = require('./components/context-renderer');

global.fractal = {
    events: events
};

const frame     = framer($('#frame'));
const navTrees  = $.map($('[data-behaviour="tree"]'), t => new Tree(t));

let pens        = [];

loadPen();

if (frctl.env == 'server') {
    doc.pjax('a[data-pjax], code a[href], .Prose a[href]:not([data-no-pjax]), .Browser a[href]:not([data-no-pjax])', '#pjax-container', {
        fragment: '#pjax-container',
        timeout: 10000
    }).on('pjax:start', function(e, xhr, options){
        if (utils.isSmallScreen()) {
            frame.closeSidebar();
        }
        frame.startLoad();
        events.trigger('main-content-preload', options.url);
    }).on('pjax:end', function(){
        events.trigger('main-content-loaded');
        frame.endLoad();
    });
}

events.on('main-content-loaded', loadPen);

function loadPen(){
    setTimeout(function(){
        pens = $.map($('[data-behaviour="pen"]'), p => new Pen(p));
    }, 1);
}

let editor = $('[data-behaviour="context-editor"]');
let preview = $('[data-behaviour="preview"]');

if (editor.length && preview.length) {
    editor = new Editor(editor.get(0));
    let renderer = new Renderer(preview.get(0));
    editor.on('data', function(e, data) {
        renderer.update(data);
    });
}
