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
function isObject(arr) {
    var type = typeof arr;
    return type === 'function' || type === 'object' && !!arr;
}

function getSelectedLayerInfo() {
    try {
        var activeItem = app.project.activeItem;
        var sourcePath = "";
        var name = "";
        var width = 0;
        var height = 0;
        var hasSource = false;

        // CASE 1: Active Item is a Composition (User selected a layer)
        if (activeItem && activeItem instanceof CompItem) {
            if (activeItem.selectedLayers.length === 0) {
                return '{"error":"No layer selected in Composition"}';
            }
            var layer = activeItem.selectedLayers[0];
            name = layer.name;
            width = layer.width;
            height = layer.height;
            if (layer.source && layer.source.file) {
                sourcePath = layer.source.file.fsName;
                hasSource = true;
            }
        }
        // CASE 2: Active Item is Footage (User selected an image in Project Panel)
        else if (activeItem && activeItem instanceof FootageItem) {
            name = activeItem.name;
            width = activeItem.width;
            height = activeItem.height;
            if (activeItem.file) {
                sourcePath = activeItem.file.fsName;
                hasSource = true;
            } else {
                return '{"error":"Selected project item has no file"}';
            }
        }
        // CASE 3: Nothing or invalid selection
        else {
            // Try checking selected items in project bin if activeItem is null (sometimes happens)
            if (app.project.selection.length > 0 && app.project.selection[0] instanceof FootageItem) {
                var item = app.project.selection[0];
                name = item.name;
                width = item.width;
                height = item.height;
                if (item.file) {
                    sourcePath = item.file.fsName;
                    hasSource = true;
                }
            } else {
                return '{"error":"No active Composition or valid Footage selected"}';
            }
        }

        // Manual JSON stringify
        var json = '{';
        json += '"name":"' + name.replace(/"/g, '\\\\"') + '",';
        json += '"width":' + width + ',';
        json += '"height":' + height + ',';
        json += '"sourcePath":"' + sourcePath.replace(/\\/g, '\\\\').replace(/"/g, '\\\\"') + '"';
        json += '}';

        return json;
    } catch (e) {
        return '{"error":"' + e.toString().replace(/"/g, '\\\\"') + '"}';
    }
}

function importVideo(path) {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "Error: No active composition";
        }

        var importOptions = new ImportOptions(new File(path));
        if (!importOptions.file.exists) {
            return "Error: File does not exist: " + path;
        }

        var footage = app.project.importFile(importOptions);
        if (!footage) {
            return "Error: Failed to import file";
        }

        var newLayer = comp.layers.add(footage);
        newLayer.moveToBeginning();

        // Select only the new layer
        for (var i = 1; i <= comp.selectedLayers.length; i++) {
            comp.selectedLayers[i - 1].selected = false;
        }
        newLayer.selected = true;

        return "success";
    } catch (e) {
        return "Error: " + e.toString();
    }
}

