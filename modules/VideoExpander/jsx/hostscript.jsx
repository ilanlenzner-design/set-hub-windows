if (typeof JSON !== 'object') {
    JSON = {};
}
(function () {
    'use strict';
    function f(n) { return n < 10 ? '0' + n : n; }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z'
                : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf(); };
    }
    var cx, escapable, gap, indent, meta, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string': return quote(value);
            case 'number': return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null': return String(value);
            case 'object':
                if (!value) return 'null';
                gap += indent; partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind; return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i]; v = str(k, value);
                            if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind; return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };
        JSON.stringify = function (value, replacer, space) {
            var i; gap = ''; indent = '';
            if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } }
            else if (typeof space === 'string') { indent = space; }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', { '': value });
        };
    }
    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) { value[k] = v; }
                            else { delete value[k]; }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({ '': j }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());
// After Effects ExtendScript functions

/**
 * Get information about the selected layer
 * @returns {string} JSON string with layer info or null
 */
function getSelectedLayer() {
    try {
        var comp = app.project.activeItem;

        if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ error: "No active composition" });
        }

        if (comp.selectedLayers.length === 0) {
            return JSON.stringify({ error: "No layer selected" });
        }

        var layer = comp.selectedLayers[0];

        // Check if it's an AV layer with source
        if (!(layer instanceof AVLayer)) {
            return JSON.stringify({ error: "Selected layer is not an AV layer (must be footage, not text/shape/adjustment layer)" });
        }

        if (!layer.source) {
            return JSON.stringify({ error: "Layer has no source" });
        }

        var layerInfo = {
            name: layer.name,
            startTime: layer.startTime,
            duration: layer.source.duration,
            inPoint: layer.inPoint,
            outPoint: layer.outPoint,
            width: layer.source.width,
            height: layer.source.height
        };

        return JSON.stringify(layerInfo);

    } catch (error) {
        return JSON.stringify({ error: "Exception: " + error.toString() });
    }
}

/**
 * Export the selected layer as a video file
 * @returns {string} Path to exported video file
 */
function exportSelectedLayer() {
    try {
        var comp = app.project.activeItem;

        if (!comp || !(comp instanceof CompItem)) {
            return "Error: No active composition";
        }

        if (comp.selectedLayers.length === 0) {
            return "Error: No layer selected";
        }

        var layer = comp.selectedLayers[0];

        if (!(layer instanceof AVLayer) || !layer.source) {
            return "Error: Selected layer is not an AV layer";
        }

        // Check if source is a footage item
        if (!(layer.source instanceof FootageItem)) {
            return "Error: Layer source is not a footage item";
        }

        var footage = layer.source;

        // If the footage has a file, return it directly
        if (footage.file) {
            return footage.file.fsName;
        }

        // If it's a solid or generated, we need to render it
        // For now, return error - we can enhance this later
        return "Error: Layer source doesn't have a file. Please use a video file layer.";

    } catch (error) {
        return "Error: " + error.toString();
    }
}

/**
 * Import video file and add it to the active composition
 * @param {string} videoPath - Path to video file
 * @returns {string} "success" or error message
 */
function importAndAddVideo(videoPath) {
    try {
        var comp = app.project.activeItem;

        if (!comp || !(comp instanceof CompItem)) {
            return "Error: No active composition";
        }

        // Import the video file
        var importOptions = new ImportOptions(new File(videoPath));

        if (!importOptions.file.exists) {
            return "Error: Video file does not exist: " + videoPath;
        }

        var footage = app.project.importFile(importOptions);

        if (!footage) {
            return "Error: Failed to import video file";
        }

        // Add to composition
        var newLayer = comp.layers.add(footage);

        // Position at the top of the layer stack
        newLayer.moveToBeginning();

        // Select the new layer
        for (var i = 1; i <= comp.selectedLayers.length; i++) {
            comp.selectedLayers[i - 1].selected = false;
        }
        newLayer.selected = true;

        return "success";

    } catch (error) {
        return "Error: " + error.toString();
    }
}

