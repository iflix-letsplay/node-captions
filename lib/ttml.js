/** @module ttml
 * @memberOf node-captions
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    moment = require('moment'),
    macros = require('./macros.js'),
    defaultConfig = require('../config/ttml.json');

function validateText(text) {
    var macro_check = new RegExp(/^({break}|{italic}|{end-italic})$/);
    //return true since the text is not just a macro
    if (macro_check.test(text.toString().replace(/\s+/g, ''))) {
        return false;
    } else {
        return true;
    }
}
module.exports = {

    /**
     * generates TTML from JSON
     * @function
     * @param {array} data - JSON array of captions
     * @param {object} config - TTML configuration
     * @public
     */
    generate: function(data, config = {}) {
        var TTML_BODY = '',
            index = 0,
            splitText,
            captions = data,
            TTML = Object.assign({}, defaultConfig, config);

        TTML_BODY += TTML.header.join('\n') + '\n';
        captions.forEach(function(caption) {
            if (caption.text.length > 0 && validateText(caption.text)) {
                if ((/&/.test(caption.text)) && !(/&amp;/.test(caption.text))) {
                    caption.text = caption.text.replace(/&/g, '&amp;');
                }
                if ((/</.test(caption.text)) && !(/&lt;/.test(caption.text))) {
                    caption.text = caption.text.replace(/</g, '&lt;');
                }
                if ((/>/.test(caption.text)) && !(/&gt;/.test(caption.text))) {
                    caption.text = caption.text.replace(/>/g, '&gt;');
                }
                TTML_BODY += TTML.lineTemplate.replace('{region}', 'pop1')
                    .replace('{startTime}', module.exports.formatTime(caption.startTimeMicro))
                    .replace('{endTime}', module.exports.formatTime(caption.endTimeMicro))
                    .replace('{text}', module.exports.renderMacros(macros.fixItalics(macros.cleanMacros(caption.text)))) + '\n';
            }
        });

        return TTML_BODY + TTML.footer.join('\n') + '\n';
    },
    /**
     * renders TTML stylings from macros
     * @function
     * @param {string} data - data to convert
     * @public
     */
    renderMacros: function(data) {
        return data
          .replace(/\{italic\}/g, '<span tts:fontStyle="italic">')
          .replace(/\{end-italic\}/g, '</span>')
          .replace(/\{break\}/g, '<br />');
    },
    /**
     * formats microseocnds to TTML timestamp
     * @function
     * @param {string} microseconds - JSON array of captions
     * @public
     */
    formatTime: function(microseconds) {
        var milliseconds = microseconds / 1000;
        return moment.utc(milliseconds).format("HH:mm:ss:SS");
    }

};
