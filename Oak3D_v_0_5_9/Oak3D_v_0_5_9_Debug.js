(function (k) {
    var c = {ArrayBuffer:typeof ArrayBuffer !== "undefined", DataView:typeof DataView !== "undefined" && "getFloat64" in DataView.prototype, NodeBuffer:typeof Buffer !== "undefined", NodeBufferFull:typeof Buffer !== "undefined" && "readInt8LE" in Buffer, NodeBufferEndian:typeof Buffer !== "undefined" && "readInt8" in Buffer};
    var e = function (l, o, m, p) {
        if (!(this instanceof arguments.callee)) {
            throw new Error("Constructor may not be called as a function")
        }
        this.buffer = l;
        if (!(c.NodeBuffer && l instanceof Buffer) && !(c.ArrayBuffer && l instanceof ArrayBuffer) && typeof l !== "string") {
            throw new TypeError("Type error")
        }
        this._isArrayBuffer = c.ArrayBuffer && l instanceof ArrayBuffer;
        this._isDataView = c.DataView && this._isArrayBuffer;
        this._isNodeBuffer = c.NodeBuffer && l instanceof Buffer;
        this._littleEndian = p === undefined ? true : p;
        var n = this._isArrayBuffer ? l.byteLength : l.length;
        if (o === undefined) {
            o = 0
        }
        this.byteOffset = o;
        if (m === undefined) {
            m = n - o
        }
        this.byteLength = m;
        if (!this._isDataView) {
            if (typeof o !== "number") {
                throw new TypeError("Type error")
            }
            if (typeof m !== "number") {
                throw new TypeError("Type error")
            }
            if (typeof o < 0) {
                throw new Error("INDEX_SIZE_ERR: DOM Exception 1")
            }
            if (typeof m < 0) {
                throw new Error("INDEX_SIZE_ERR: DOM Exception 1")
            }
        }
        if (this._isDataView) {
            this._view = new DataView(l, o, m);
            this._start = 0
        }
        this._start = o;
        if (o + m > n) {
            throw new Error("INDEX_SIZE_ERR: DOM Exception 1")
        }
        this._offset = 0
    };
    e.createBuffer = function () {
        if (c.NodeBuffer) {
            var m = new Buffer(arguments.length);
            for (var n = 0; n < arguments.length; ++n) {
                m[n] = arguments[n]
            }
            return m
        }
        if (c.ArrayBuffer) {
            var m = new ArrayBuffer(arguments.length);
            var l = new Int8Array(m);
            for (var n = 0; n < arguments.length; ++n) {
                l[n] = arguments[n]
            }
            return m
        }
        return String.fromCharCode.apply(null, arguments)
    };
    e.prototype = {getString:function (o, n) {
        var p;
        if (n === undefined) {
            n = this._offset
        }
        if (typeof n !== "number") {
            throw new TypeError("Type error")
        }
        if (o < 0 || n + o > this.byteLength) {
            throw new Error("INDEX_SIZE_ERR: DOM Exception 1")
        }
        if (this._isNodeBuffer) {
            p = this.buffer.toString("ascii", this._start + n, this._start + n + o)
        } else {
            p = "";
            for (var l = 0; l < o; ++l) {
                var m = this.getUint8(n + l);
                p += String.fromCharCode(m > 127 ? 65533 : m)
            }
        }
        this._offset = n + o;
        return p
    }, getChar:function (l) {
        return this.getString(1, l)
    }, tell:function () {
        return this._offset
    }, seek:function (l) {
        if (typeof l !== "number") {
            throw new TypeError("Type error")
        }
        if (l < 0 || l > this.byteLength) {
            throw new Error("INDEX_SIZE_ERR: DOM Exception 1")
        }
        return this._offset = l
    }, _endianness:function (m, o, l, n) {
        return m + (n ? l - o - 1 : o)
    }, _getFloat32:function (n, l) {
        var u = this._getUint8(this._endianness(n, 0, 4, l)), t = this._getUint8(this._endianness(n, 1, 4, l)), s = this._getUint8(this._endianness(n, 2, 4, l)), p = this._getUint8(this._endianness(n, 3, 4, l)), o = 1 - (2 * (u >> 7)), q = (((u << 1) & 255) | (t >> 7)) - 127, m = ((t & 127) << 16) | (s << 8) | p;
        if (q === 128) {
            if (m !== 0) {
                return NaN
            } else {
                return o * Infinity
            }
        }
        if (q === -127) {
            return o * m * Math.pow(2, -126 - 23)
        }
        return o * (1 + m * Math.pow(2, -23)) * Math.pow(2, q)
    }, _getInt32:function (m, n) {
        var l = this._getUint32(m, n);
        return l > Math.pow(2, 31) - 1 ? l - Math.pow(2, 32) : l
    }, _getUint32:function (p, q) {
        var l = this._getUint8(this._endianness(p, 0, 4, q)), m = this._getUint8(this._endianness(p, 1, 4, q)), n = this._getUint8(this._endianness(p, 2, 4, q)), o = this._getUint8(this._endianness(p, 3, 4, q));
        return(l * Math.pow(2, 24)) + (m << 16) + (n << 8) + o
    }, _getInt16:function (m, n) {
        var l = this._getUint16(m, n);
        return l > Math.pow(2, 15) - 1 ? l - Math.pow(2, 16) : l
    }, _getUint16:function (n, o) {
        var l = this._getUint8(this._endianness(n, 0, 2, o)), m = this._getUint8(this._endianness(n, 1, 2, o));
        return(l << 8) + m
    }, _getInt8:function (m) {
        var l = this._getUint8(m);
        return l > Math.pow(2, 7) - 1 ? l - Math.pow(2, 8) : l
    }, _getUint8:function (l) {
        if (this._isArrayBuffer) {
            return new Uint8Array(this.buffer, l, 1)[0]
        } else {
            if (this._isNodeBuffer) {
                return this.buffer[l]
            } else {
                return this.buffer.charCodeAt(l) & 255
            }
        }
    }};
    var h = {Int8:1, Int16:2, Int32:4, Uint8:1, Uint16:2, Uint32:4, Float32:4, Float64:8};
    var d = {Int8:"Int8", Int16:"Int16", Int32:"Int32", Uint8:"UInt8", Uint16:"UInt16", Uint32:"UInt32", Float32:"Float", Float64:"Double"};
    for (var f in h) {
        if (!h.hasOwnProperty(f)) {
            continue
        }
        (function (m) {
            var l = h[m];
            e.prototype["get" + m] = function (n, p) {
                var o;
                if (p === undefined) {
                    p = this._littleEndian
                }
                if (n === undefined) {
                    n = this._offset
                }
                if (this._isDataView) {
                    o = this._view["get" + m](n, p)
                } else {
                    if (this._isArrayBuffer && (this._start + n) % l === 0 && (l === 1 || p)) {
                        o = new k[m + "Array"](this.buffer, this._start + n, 1)[0]
                    } else {
                        if (this._isNodeBuffer && c.NodeBufferFull) {
                            if (p) {
                                o = this.buffer["read" + d[m] + "LE"](this._start + n)
                            } else {
                                o = this.buffer["read" + d[m] + "BE"](this._start + n)
                            }
                        } else {
                            if (this._isNodeBuffer && c.NodeBufferEndian) {
                                o = this.buffer["read" + d[m]](this._start + n, p)
                            } else {
                                if (typeof n !== "number") {
                                    throw new TypeError("Type error")
                                }
                                if (n + l > this.byteLength) {
                                    throw new Error("INDEX_SIZE_ERR: DOM Exception 1")
                                }
                                o = this["_get" + m](this._start + n, p)
                            }
                        }
                    }
                }
                this._offset = n + l;
                return o
            }
        })(f)
    }
    if (typeof jQuery !== "undefined" && jQuery.fn.jquery >= "1.6.2") {
        var a = function (m) {
            var o;
            try {
                o = IEBinaryToArray_ByteStr(m)
            } catch (t) {
                var n = "Function IEBinaryToArray_ByteStr(Binary)\r\n	IEBinaryToArray_ByteStr = CStr(Binary)\r\nEnd Function\r\nFunction IEBinaryToArray_ByteStr_Last(Binary)\r\n	Dim lastIndex\r\n	lastIndex = LenB(Binary)\r\n	if lastIndex mod 2 Then\r\n		IEBinaryToArray_ByteStr_Last = AscB( MidB( Binary, lastIndex, 1 ) )\r\n	Else\r\n		IEBinaryToArray_ByteStr_Last = -1\r\n	End If\r\nEnd Function\r\n";
                window.execScript(n, "vbscript");
                o = IEBinaryToArray_ByteStr(m)
            }
            var q = IEBinaryToArray_ByteStr_Last(m), v = "", s = 0, p = o.length % 8, u;
            while (s < p) {
                u = o.charCodeAt(s++);
                v += String.fromCharCode(u & 255, u >> 8)
            }
            p = o.length;
            while (s < p) {
                v += String.fromCharCode((u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8, (u = o.charCodeAt(s++), u & 255), u >> 8)
            }
            if (q > -1) {
                v += String.fromCharCode(q)
            }
            return v
        };
        jQuery.ajaxSetup({converters:{"* dataview":function (l) {
            return new e(l)
        }}, accepts:{dataview:"text/plain; charset=x-user-defined"}, responseHandler:{dataview:function (m, l, n) {
            if ("mozResponseArrayBuffer" in n) {
                m.text = n.mozResponseArrayBuffer
            } else {
                if ("responseType" in n && n.responseType === "arraybuffer" && n.response) {
                    m.text = n.response
                } else {
                    if ("responseBody" in n) {
                        m.text = a(n.responseBody)
                    } else {
                        m.text = n.responseText
                    }
                }
            }
        }}});
        jQuery.ajaxPrefilter("dataview", function (l, n, m) {
            if (jQuery.support.ajaxResponseType) {
                if (!l.hasOwnProperty("xhrFields")) {
                    l.xhrFields = {}
                }
                l.xhrFields.responseType = "arraybuffer"
            }
            l.mimeType = "text/plain; charset=x-user-defined"
        })
    }
    k.jDataView = (k.module || {}).exports = e
})(this);
var OAK = {ERROR:0, TYPE_VEC2:1, TYPE_VEC3:2, TYPE_VEC4:4, TYPE_MAT4:8, TYPE_MAT43:16, AXIS_X:1, AXIS_Y:2, AXIS_Z:3, COLLIDE_FALSE:0, COLLIDE_TRUE:1, COLLIDE_CONTAIN:2, SPACE_LOCAL:1, SPACE_PARENT:2, SPACE_WORLD:3, SPACE_VIEW:4, BBOX_AABB:1, BBOX_OBB:2, FLOAT_PRECISION:0.000001, PROJMODE_PERSPECTIVE:1, PROJMODE_ORTHO:2, PROJMODE_ORTHO_NORMALIZED:3, PROJMODE_ORTHO_PIXEL:4, FTPLANE_NEAR:0, FTPLANE_FAR:1, FTPLANE_LEFT:2, FTPLANE_RIGHT:3, FTPLANE_TOP:4, FTPLANE_BOTTOM:5, SKBLEND_ACCUMULATE:1, SKBLEND_LERP:2, BLENDCHANNEL_COLOR:1, BLENDCHANNEL_ALPHA:2, BLENDCHANNEL_ALL:3, MCUSAGE_ALBEDO1:0, MCUSAGE_ALBEDO2:1, MCUSAGE_ALBEDO3:2, MCUSAGE_ALBEDO4:3, MCUSAGE_NORMAL:4, MCUSAGE_OPACITY:5, MCUSAGE_SPECULAR_LEVEL:6, MSCRIPT_CONST1:0, MSCRIPT_CONST2:1, MSCRIPT_CONST3:2, MSCRIPT_CONST4:3, MSCRIPT_CONST5:4, MSCRIPT_CONST6:5, MSCRIPT_CONST7:6, MSCRIPT_CONST8:7, ETYPE_UNKNOWN:0, ETYPE_STATIC:1, ETYPE_DYNAMIC:2, ETYPE_DCT_LIGHT:4, ETYPE_POINT_LIGHT:8, ETYPE_SPOT_LIGHT:16, ETYPE_TERRAIN:32, ETYPE_CUSTOM_MESH:64, ETYPE_VIDEO:128, ETYPE_PARTICLE:256, ETYPE_CONFIG:512, ETYPE_LIGHT:(4 | 8 | 16), ETYPE_VISIBLE:(1 | 2 | 32 | 64 | 128 | 256), ETYPE_INTREE:(1 | 2 | 32 | 64 | 128 | 256), ETYPE_UPDATE:(2 | 256), ETYPE_ALL:4294967295, ESTATE_UNAVAILABLE:1, ESTATE_BASIC_AVAILABLE:2, ESTATE_COMPLETE_AVAILABLE:4, RESDOCTYPE_XML:1, RESDOCTYPE_JSON:2, RESDOCTYPE_BINARY:3, RESDOCTYPE_COLLADA:4, RESDOCTYPE_CUSTOM:5, RESTYPE_UNKNOWN:0, RESTYPE_MODEL:1, RESTYPE_TEXTURE:2, RESTYPE_SKANIMATION:3, RESSTATE_NONE:1, RESSTATE_UNLOAD:2, RESSTATE_LOADING:3, RESSTATE_LOADED:4, RESSTATE_READY:5, RESPRIORITY_HIGH:1, RESPRIORITY_NORMAL:2, RESPRIORITY_LOW:3, LIGHTGROUP_1:1, LIGHTGROUP_2:2, LIGHTGROUP_3:3, LIGHTGROUP_4:4, LIGHTGROUP_5:5, LIGHTGROUP_6:6, LIGHTGROUP_7:7, LIGHTGROUP_8:8, LIGHTGROUP_9:9, LIGHTGROUP_10:10, LIGHTGROUP_11:11, LIGHTGROUP_12:12, LIGHTGROUP_13:13, LIGHTGROUP_14:14, LIGHTGROUP_15:15, LIGHTGROUP_16:16, ENV_FOG1:1, RSTAGE_DEPTH:0, RSTAGE_SHADOW:1, RSTAGE_LIGHTING:2, WORLDMAP_NOT_READ:1, WORLDMAP_PARSING:2, WORLDMAP_PARSED:3, TEXTURE_IMAGE:1, TEXTURE_VIDEO:2, PARTIME_BEGIN:1, PARTIME_END:2, PARTIME_ALL:4294967295};
var tempCanvas = document.createElement("canvas");
if (tempCanvas) {
    tempCanvas.width = 32;
    tempCanvas.height = 32;
    if (tempCanvas.getContext) {
        var tempRc = tempCanvas.getContext("webgl");
        if (tempRc == null) {
            tempRc = tempCanvas.getContext("experimental-webgl")
        }
        if (tempRc) {
            for (var $e6 in tempRc) {
                if ($e6.toUpperCase() == $e6) {
                    OAK[$e6] = tempRc[$e6]
                }
            }
        }
    }
}
function okIsSupportWebGL() {
    if (OAK.__SUPPORT_WEBGL) {
        return OAK.__SUPPORT_WEBGL
    }
    var c = document.createElement("canvas");
    if (c == null) {
        OAK.__SUPPORT_WEBGL = false;
        return false
    }
    c.width = 32;
    c.height = 32;
    if (c.getContext == null) {
        OAK.__SUPPORT_WEBGL = false;
        return false
    }
    var a = c.getContext("experimental-webgl");
    if (a == null) {
        a = c.getContext("webgl")
    }
    if (a == null) {
        OAK.__SUPPORT_WEBGL = false
    } else {
        OAK.__SUPPORT_WEBGL = true
    }
    return OAK.__SUPPORT_WEBGL
}
function okIsIE() {
    return navigator.appName == "Microsoft Internet Explorer"
}
function okGetGLError(d) {
    var c = d.getError();
    if (c == 0) {
        return null
    }
    for (var a in d) {
        if (d[a] == c) {
            return a
        }
    }
}
function okGetGLEnumName(d, c) {
    for (var a in d) {
        if (d[a] == c) {
            return a
        }
    }
    return null
}
function okGenCanvas(c, f, d, e) {
    var a;
    if (okIsIE()) {
        a = document.createElement("object");
        a.width = c;
        a.height = f;
        if (e) {
            a.id = e
        }
        if (d) {
            d.appendChild(a)
        } else {
            document.body.appendChild(a)
        }
        a.type = "application/x-webgl"
    } else {
        a = document.createElement("canvas");
        a.width = c;
        a.height = f;
        if (e) {
            a.id = e
        }
        if (d) {
            d.appendChild(a)
        } else {
            document.body.appendChild(a)
        }
    }
    return a
}
var okRequestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (a) {
    setTimeout(a, 1000 / 60)
};
function okExtension(f) {
    var e = f.getSupportedExtensions();
    for (var d = 0; d < e.length; ++d) {
        var c = e[d];
        var a = f.getExtension(c);
        this[c] = a
    }
}
function okIsUndefined(a) {
    return typeof a == "undefined"
}
function okIsString(a) {
    return typeof a == "string"
}
function okIsElement(a) {
    return a && a.nodeType == 1
}
function okIsFunction(a) {
    return typeof a == "function"
}
function okIsObject(a) {
    return typeof a == "object"
}
function okIsArray(a) {
    return Object.prototype.toString.call(a) === "[object Array]"
}
function okIsNumber(a) {
    return typeof a == "number"
}
function okIsBoolean(a) {
    return typeof a == "boolean"
}
function okIsInt(a) {
    if (parseInt(a) == a) {
        return true
    }
    return false
}
function okFileFilter(c) {
    var a = c.lastIndexOf(".");
    return c.substring(a + 1, c.length)
}
function okLog(d, c, a) {
    window.console.log((c ? ("[" + c + "]") : "") + d);
    if (a) {
        alert("[Oak Debug Stop]")
    }
}
function okGenQuadMesh(h, p, e, s, o, d, c) {
    var n = [p, e, 0, p, o, 0, s, o, 0, s, e, 0];
    var a = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    var k = c ? [0, 1, 0, 0, 1, 0, 1, 1] : [0, 0, 0, 1, 1, 1, 1, 0];
    var f = [0, 1, 2, 0, 2, 3];
    h.setVertexNum(4);
    h.createAttribute("Position", n.length, n);
    h.createAttribute("Normal", a.length, a);
    h.createAttribute("Texcoord1", k.length, k);
    h.createIndex("Default", f.length, f, 35044, 4);
    h.computeBoundingInfo();
    if (d) {
        var m = new Array;
        var q = f.length / 3;
        for (var l = 0; l < q; ++l) {
            m.push(f[l * 3], f[l * 3 + 1]);
            m.push(f[l * 3 + 1], f[l * 3 + 2]);
            m.push(f[l * 3 + 2], f[l * 3])
        }
        h.createIndex("Wireframe", m.length, m, 35044, 1)
    }
    return h
}
function okGenBoxMesh(d, m, o, c) {
    var l = [m.x, m.y, m.z, m.x, m.y, o.z, m.x, o.y, o.z, m.x, o.y, m.z, o.x, m.y, m.z, o.x, o.y, m.z, o.x, o.y, o.z, o.x, m.y, o.z, m.x, o.y, m.z, m.x, o.y, o.z, o.x, o.y, o.z, o.x, o.y, m.z, m.x, m.y, m.z, o.x, m.y, m.z, o.x, m.y, o.z, m.x, m.y, o.z, m.x, o.y, o.z, m.x, m.y, o.z, o.x, m.y, o.z, o.x, o.y, o.z, m.x, o.y, m.z, o.x, o.y, m.z, o.x, m.y, m.z, m.x, m.y, m.z];
    var a = [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
    var e = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    var f = [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1];
    d.setVertexNum(24);
    d.createAttribute("Position", l.length, l);
    d.createAttribute("Normal", a.length, a);
    d.createAttribute("Texcoord1", f.length, f);
    d.createIndex("Default", e.length, e, 35044, 4);
    d.computeBoundingInfo();
    if (c) {
        var k = new Array;
        var n = e.length / 3;
        for (var h = 0; h < n; ++h) {
            k.push(e[h * 3], e[h * 3 + 1]);
            k.push(e[h * 3 + 1], e[h * 3 + 2]);
            k.push(e[h * 3 + 2], e[h * 3])
        }
        d.createIndex("Wireframe", k.length, k, 35044, 1)
    }
    return d
}
function okGenSphereMesh(w, t, a, B, D) {
    var u = new Array;
    u.push(0, t, 0);
    for (var q = 1; q < B; ++q) {
        var I = Math.sin(Math.PI / B * q) * t;
        var n = Math.cos(Math.PI / B * q) * t;
        for (var F = 0; F < a; ++F) {
            var o = Math.sin(Math.PI * 2 / a * F) * I;
            var m = Math.cos(Math.PI * 2 / a * F) * I;
            u.push(o, n, m)
        }
    }
    u.push(0, -t, 0);
    var p = new Array;
    var e = new Array;
    for (var E = 0; E < u.length / 3; ++E) {
        var d = okA.vec3();
        d.x = u[E * 3];
        d.y = u[E * 3 + 1];
        d.z = u[E * 3 + 2];
        d.normalize(true);
        p.push(d.x, d.y, d.z);
        e.push(Math.asin(d.x) / Math.PI + 0.5, Math.asin(d.y) / Math.PI + 0.5);
        okA._vec3(d)
    }
    var c = new Array;
    for (var F = 0; F < a; ++F) {
        c.push(0, 1 + (F % a), 1 + ((F + 1) % a))
    }
    for (var q = 1; q < B - 1; ++q) {
        for (var F = 0; F < a; ++F) {
            var s = 1 + (q - 1) * a;
            var H = 1 + q * a;
            var l = s + (F % a), f = s + ((F + 1) % a);
            var C = H + (F % a), A = H + ((F + 1) % a);
            c.push(l, C, A);
            c.push(A, f, l)
        }
    }
    for (var F = 0; F < a; ++F) {
        c.push(u.length / 3 - 1, 1 + (B - 2) * a + ((F + 1) % a), 1 + (B - 2) * a + (F % a))
    }
    w.setVertexNum(u.length / 3);
    w.createAttribute("Position", u.length, u);
    w.createAttribute("Normal", p.length, p);
    w.createAttribute("Texcoord1", e.length, e);
    w.createIndex("Default", c.length, c, 35044, 4);
    w.computeBoundingInfo();
    if (D) {
        var k = new Array;
        var G = c.length / 3;
        for (var E = 0; E < G; ++E) {
            k.push(c[E * 3], c[E * 3 + 1]);
            k.push(c[E * 3 + 1], c[E * 3 + 2]);
            k.push(c[E * 3 + 2], c[E * 3])
        }
        w.createIndex("Wireframe", k.length, k, 35044, 1)
    }
    return w
}
function okGenColumnMesh(q, o, C, w, v) {
    var p = new Array;
    var c = new Array;
    p.push(0, C * 0.5, 0);
    c.push(1 / 8, 1 / 8);
    for (var A = 0; A < w; ++A) {
        var l = Math.sin(Math.PI * 2 / w * A) * o;
        var f = Math.cos(Math.PI * 2 / w * A) * o;
        p.push(l, C * 0.5, f);
        c.push(Math.sin(Math.PI * 2 / w * A) / 8 + 1 / 8, 1 / 8 - Math.cos(Math.PI * 2 / w * A) / 8)
    }
    p.push(0, -C * 0.5, 0);
    c.push(1 / 8, 5 / 8);
    for (var A = 0; A < w; ++A) {
        var l = Math.sin(Math.PI * 2 / w * A) * o;
        var f = Math.cos(Math.PI * 2 / w * A) * o;
        p.push(l, -C * 0.5, f);
        c.push(Math.sin(Math.PI * 2 / w * A) / 8 + 1 / 8, 5 / 8 - Math.cos(Math.PI * 2 / w * A) / 8)
    }
    for (var A = 0; A < w; ++A) {
        var l = Math.sin(Math.PI * 2 / w * A) * o;
        var f = Math.cos(Math.PI * 2 / w * A) * o;
        p.push(l, C * 0.5, f);
        c.push(A / (2 * w) + 0.5, 0)
    }
    for (var A = 0; A < w; ++A) {
        var l = Math.sin(Math.PI * 2 / w * A) * o;
        var f = Math.cos(Math.PI * 2 / w * A) * o;
        p.push(l, -C * 0.5, f);
        c.push(A / (2 * w) + 0.5, 1)
    }
    var m = new Array;
    for (var y = 0; y < w + 1; ++y) {
        m.push(0, 1, 0)
    }
    for (var y = 0; y < w + 1; ++y) {
        m.push(0, -1, 0)
    }
    for (var y = 0; y < w; ++y) {
        var s = okA.vec3();
        s.set(p[(w * 2 + 2) * 3 + y * 3], 0, p[(w * 2 + 2) * 3 + y * 3 + 2]);
        s.normalize(true);
        m.push(s.x, s.y, s.z);
        okA._vec3(s)
    }
    for (var y = 0; y < w; ++y) {
        var s = okA.vec3();
        s.set(p[(w * 3 + 2) * 3 + y * 3], 0, p[(w * 3 + 2) * 3 + y * 3 + 2]);
        s.normalize(true);
        m.push(s.x, s.y, s.z);
        okA._vec3(s)
    }
    var a = new Array;
    for (var A = 0; A < w; ++A) {
        a.push(0, 1 + (A % w), 1 + ((A + 1) % w))
    }
    for (var A = 0; A < w; ++A) {
        a.push(w + 1, w + 2 + ((A + 1) % w), w + 2 + (A % w))
    }
    for (var A = 0; A < w; ++A) {
        var k = w * 2 + 2 + A, d = w * 2 + 2 + (A + 1) % w;
        var u = w * 3 + 2 + A, t = w * 3 + 2 + (A + 1) % w;
        a.push(k, u, t);
        a.push(t, d, k)
    }
    q.setVertexNum(p.length / 3);
    q.createAttribute("Position", p.length, p);
    q.createAttribute("Normal", m.length, m);
    q.createAttribute("Texcoord1", c.length, c);
    q.createIndex("Default", a.length, a, 35044, 4);
    q.computeBoundingInfo();
    if (v) {
        var e = new Array;
        var B = a.length / 3;
        for (var y = 0; y < B; ++y) {
            e.push(a[y * 3], a[y * 3 + 1]);
            e.push(a[y * 3 + 1], a[y * 3 + 2]);
            e.push(a[y * 3 + 2], a[y * 3])
        }
        q.createIndex("Wireframe", e.length, e, 35044, 1)
    }
    return q
}
function okGenTaperMesh(v, s, E, A, y) {
    var u = new Array;
    var k = new Array;
    u.push(0, -E * 0.5, 0);
    k.push(1 / 8, 1 / 8);
    for (var C = 0; C < A; ++C) {
        var o = Math.sin(Math.PI * 2 / A * C) * s;
        var m = Math.cos(Math.PI * 2 / A * C) * s;
        u.push(o, -E * 0.5, m);
        k.push(Math.sin(Math.PI * 2 / A * C) / 8 + 1 / 8, 1 / 8 - Math.cos(Math.PI * 2 / A * C) / 8)
    }
    u.push(0, E * 0.5, 0);
    k.push(3 / 4, 1 / 4);
    var c = Math.sqrt(s * s + E * E);
    for (var C = 0; C < A; ++C) {
        var o = Math.sin(Math.PI * 2 / A * C) * s;
        var m = Math.cos(Math.PI * 2 / A * C) * s;
        u.push(o, -E * 0.5, m);
        k.push(3 / 4 + Math.sin(Math.PI * 2 / A * C * s / c) / 4, 1 / 4 - Math.cos(Math.PI * 2 / A * C * s / c) / 4)
    }
    var p = new Array;
    for (var B = 0; B < A + 1; ++B) {
        p.push(0, -1, 0)
    }
    p.push(0, 1, 0);
    for (var B = 0; B < A; ++B) {
        p.push(0, 0, 0)
    }
    for (var B = 0; B < A; ++B) {
        var f = new okVec3(u[(A + 1) * 3], u[(A + 1) * 3 + 1], u[(A + 1) * 3 + 2]);
        var e = new okVec3(u[(A + 2) * 3 + B * 3], u[(A + 2) * 3 + B * 3 + 1], u[(A + 2) * 3 + B * 3 + 2]);
        var d = new okVec3(u[(A + 2) * 3 + ((B + 1) % A) * 3], u[(A + 2) * 3 + ((B + 1) % A) * 3 + 1], u[(A + 2) * 3 + ((B + 1) % A) * 3 + 2]);
        var t = okVec3Sub(e, f);
        var q = okVec3Sub(d, f);
        var w = okVec3Cross(t, q);
        w = w.normalize();
        p[(A + 2) * 3 + B * 3] += w.x;
        p[(A + 2) * 3 + B * 3 + 1] += w.y;
        p[(A + 2) * 3 + B * 3 + 2] += w.z;
        p[(A + 2) * 3 + ((B + 1) % A) * 3] += w.x;
        p[(A + 2) * 3 + ((B + 1) % A) * 3 + 1] += w.y;
        p[(A + 2) * 3 + ((B + 1) % A) * 3 + 2] += w.z
    }
    for (var B = 0; B < A; ++B) {
        var w = new okVec3(p[(A + 2) * 3 + B * 3], p[(A + 2) * 3 + B * 3 + 1], p[(A + 2) * 3 + B * 3 + 2]);
        w = w.normalize();
        p[(A + 2) * 3 + B * 3] = w.x;
        p[(A + 2) * 3 + B * 3 + 1] = w.y;
        p[(A + 2) * 3 + B * 3 + 2] = w.z
    }
    var a = new Array;
    for (var C = 0; C < A; ++C) {
        a.push(0, 1 + ((C + 1) % A), 1 + C)
    }
    for (var C = 0; C < A; ++C) {
        a.push(A + 1, A + 2 + C, A + 2 + (C + 1) % A)
    }
    v.setVertexNum(u.length / 3);
    v.createAttribute("Position", u.length, u);
    v.createAttribute("Normal", p.length, p);
    v.createAttribute("Texcoord1", k.length, k);
    v.createIndex("Default", a.length, a, 35044, 4);
    v.computeBoundingInfo();
    if (y) {
        var l = new Array;
        var D = a.length / 3;
        for (var B = 0; B < D; ++B) {
            l.push(a[B * 3], a[B * 3 + 1]);
            l.push(a[B * 3 + 1], a[B * 3 + 2]);
            l.push(a[B * 3 + 2], a[B * 3])
        }
        v.createIndex("Wireframe", l.length, l, 35044, 1)
    }
    return v
}
function okGenFrustumMesh(f, m, c) {
    var p = new Array;
    for (var h = 0; h < 8; ++h) {
        p.push(m.getPoint(h))
    }
    var l = new Array;
    l.push(p[0].x, p[0].y, p[0].z);
    l.push(p[1].x, p[1].y, p[1].z);
    l.push(p[2].x, p[2].y, p[2].z);
    l.push(p[3].x, p[3].y, p[3].z);
    l.push(p[5].x, p[5].y, p[5].z);
    l.push(p[4].x, p[4].y, p[4].z);
    l.push(p[7].x, p[7].y, p[7].z);
    l.push(p[6].x, p[6].y, p[6].z);
    l.push(p[1].x, p[1].y, p[1].z);
    l.push(p[5].x, p[5].y, p[5].z);
    l.push(p[6].x, p[6].y, p[6].z);
    l.push(p[2].x, p[2].y, p[2].z);
    l.push(p[4].x, p[4].y, p[4].z);
    l.push(p[0].x, p[0].y, p[0].z);
    l.push(p[3].x, p[3].y, p[3].z);
    l.push(p[7].x, p[7].y, p[7].z);
    l.push(p[3].x, p[3].y, p[3].z);
    l.push(p[2].x, p[2].y, p[2].z);
    l.push(p[6].x, p[6].y, p[6].z);
    l.push(p[7].x, p[7].y, p[7].z);
    l.push(p[1].x, p[1].y, p[1].z);
    l.push(p[0].x, p[0].y, p[0].z);
    l.push(p[4].x, p[4].y, p[4].z);
    l.push(p[5].x, p[5].y, p[5].z);
    var a = new Array;
    var e = okVec3Cross(okVec3Sub(p[1], p[0]), okVec3Sub(p[3], p[0])).normalize();
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    e = okVec3Cross(okVec3Sub(p[4], p[5]), okVec3Sub(p[6], p[5])).normalize();
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    e = okVec3Cross(okVec3Sub(p[5], p[1]), okVec3Sub(p[2], p[1])).normalize();
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    e = okVec3Cross(okVec3Sub(p[0], p[4]), okVec3Sub(p[7], p[4])).normalize();
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    e = okVec3Cross(okVec3Sub(p[2], p[3]), okVec3Sub(p[7], p[3])).normalize();
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    e = okVec3Cross(okVec3Sub(p[0], p[1]), okVec3Sub(p[5], p[1])).normalize();
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    a.push(e.x, e.y, e.z);
    var d = new Array;
    d.push(0, 1, 2, 0, 2, 3);
    d.push(4, 5, 6, 4, 6, 7);
    d.push(8, 9, 10, 8, 10, 11);
    d.push(12, 13, 14, 12, 14, 15);
    d.push(16, 17, 18, 16, 18, 19);
    d.push(20, 21, 22, 20, 22, 23);
    f.setVertexNum(l.length / 3);
    f.createAttribute("Position", l.length, l);
    f.createAttribute("Normal", a.length, a);
    f.createIndex("Default", d.length, d, 35044, 4);
    f.computeBoundingInfo();
    if (c) {
        var k = new Array;
        var o = d.length / 3;
        for (var h = 0; h < o; ++h) {
            k.push(d[h * 3], d[h * 3 + 1]);
            k.push(d[h * 3 + 1], d[h * 3 + 2]);
            k.push(d[h * 3 + 2], d[h * 3])
        }
        f.createIndex("Wireframe", k.length, k, 35044, 1)
    }
    return f
}
function okCollection() {
    this.$s = new Array;
    this.$m4 = -1;
    this.$l4 = 0;
    this.$A4 = 0
}
okCollection.prototype = {clear:function () {
    this.$s.lengh = 0;
    this.$m4 = -1;
    this.$l4 = 0;
    this.$A4 = 0
}, add:function (d) {
    if (this.$m4 != -1) {
        var c = this.$m4;
        this.$m4 = this.$s[this.$m4].reserve;
        this.$s[c].data = d;
        this.$s[c].reserve = -1;
        this.$s[c].bValid = true;
        this.$l4 += 1;
        return c
    } else {
        var a = new Object;
        a.data = d;
        a.reserve = -1;
        a.bValid = true;
        this.$s.push(a);
        this.$l4 += 1;
        return this.$s.length - 1
    }
}, find:function (c) {
    for (var a = this.$s.length - 1; a >= 0; --a) {
        if (this.$s[a].bValid && this.$s[a].data == c) {
            return true
        }
    }
    return false
}, remove:function (c) {
    for (var a = this.$s.length - 1; a >= 0; --a) {
        if (this.$s[a].bValid && this.$s[a].data == c) {
            this.$s[a].reserve = this.$m4;
            this.$s[a].bValid = false;
            this.$m4 = a;
            this.$l4 -= 1;
            return
        }
    }
}, removeByIndex:function (a) {
    if (this.$s[a].bValid) {
        this.$s[a].reserve = this.$m4;
        this.$s[a].bValid = false;
        this.$m4 = a;
        this.$l4 -= 1
    }
}, getSize:function () {
    return this.$l4
}, getCapacity:function () {
    return this.$s.length
}, getDataByIndex:function (a) {
    return this.$s[a].data
}, isIndexValid:function (a) {
    return(a < this.$s.length) && (a >= 0) && this.$s[a].bValid
}, resetIterator:function () {
    this.$A4 = 0
}, iterate:function () {
    while (this.$A4 < this.$s.length && this.$s[this.$A4].bValid == false) {
        this.$A4++
    }
    if (this.$A4 >= this.$s.length) {
        return null
    }
    return this.$s[this.$A4++].data
}};
function okList() {
    this.$W5 = null;
    this.$M6 = null;
    this.$P4 = 0;
    this.$H5 = new Array
}
okList.prototype = {clear:function () {
    var c = this.$W5;
    while (c) {
        var a = c.next;
        c.data = null;
        c.pre = null;
        c.next = null;
        this.$H5.push(c);
        c = a
    }
    this.$W5 = null;
    this.$M6 = null;
    this.$P4 = 0
}, getRoot:function () {
    return this.$W5
}, getTail:function () {
    return this.$M6
}, getSize:function () {
    return this.$P4
}, isEmpty:function () {
    return(this.$P4 == 0)
}, pushFront:function (a) {
    var c = this.$H5.length ? this.$H5.shift() : new Object;
    c.data = a;
    c.next = this.$W5;
    c.pre = null;
    if (this.$W5) {
        this.$W5.pre = c
    } else {
        this.$M6 = c
    }
    this.$W5 = c;
    this.$P4 += 1
}, popFront:function () {
    if (this.$W5 == null) {
        return null
    }
    var a = this.$W5;
    this.$W5 = this.$W5.next;
    if (this.$W5 != null) {
        this.$W5.pre = null
    } else {
        this.$M6 = null
    }
    this.$P4 -= 1;
    a.pre = null;
    a.next = null;
    var c = a.data;
    a.data = null;
    this.$H5.push(a);
    return c
}, front:function () {
    if (this.$W5) {
        return this.$W5.data
    }
    return null
}, pushBack:function (c) {
    var a = this.$H5.length ? this.$H5.shift() : new Object;
    a.data = c;
    a.pre = this.$M6;
    a.next = null;
    if (this.$M6) {
        this.$M6.next = a
    } else {
        this.$W5 = a
    }
    this.$M6 = a;
    this.$P4 += 1
}, popBack:function () {
    if (this.$M6 == null) {
        return null
    }
    var a = this.$M6;
    this.$M6 = this.$M6.pre;
    if (this.$M6 != null) {
        this.$M6.next = null
    } else {
        this.$W5 = null
    }
    this.$P4 -= 1;
    a.pre = null;
    a.next = null;
    var c = a.data;
    a.data = null;
    this.$H5.push(a);
    return c
}, back:function () {
    if (this.$M6) {
        return this.$M6.data
    }
    return null
}, insertBefore:function (c, d) {
    var a = this.$H5.length ? this.$H5.shift() : new Object;
    a.data = d;
    a.pre = c.pre;
    a.next = c;
    c.pre = a;
    if (a.pre == null) {
        this.$W5 = a
    } else {
        a.pre.next = a
    }
    this.$P4 += 1
}, insertAfter:function (c, d) {
    var a = this.$H5.length ? this.$H5.shift() : new Object;
    a.data = d;
    a.pre = c;
    a.next = c.next;
    c.next = a;
    if (a.next == null) {
        this.$M6 = a
    } else {
        a.next.pre = a
    }
    this.$P4 += 1
}, remove:function (a) {
    if (a == null) {
        return null
    }
    if (a.pre) {
        a.pre.next = a.next
    }
    if (a.next) {
        a.next.pre = a.pre
    }
    if (a == this.$W5) {
        this.$W5 = a.next
    }
    if (a == this.$M6) {
        this.$M6 = a.pre
    }
    a.pre = null;
    a.next = null;
    a.data = null;
    this.$H5.push(a);
    this.$P4 -= 1
}, find:function (a) {
    var c = this.$W5;
    while (c) {
        if (c.data == a) {
            return c
        }
        c = c.next
    }
    return null
}};
function okLayout2DHelper(a, c) {
    this.$F1 = new okList();
    this.$F1.pushBack(new okRect(0, 0, a, c))
}
okLayout2DHelper.prototype = {reset:function (a, c) {
    this.$F1 = new okList();
    this.$F1.pushBack(new okRect(0, 0, a, c))
}, add:function (a, e) {
    var k = this.$F1.getRoot();
    var h = null;
    var d = null, c = null;
    while (k) {
        var f = k.data;
        if (f.width >= a && f.height >= e) {
            h = new okRect(f.x, f.y, a, e);
            this.$F1.remove(k);
            if ((f.width != a) && (f.height != e)) {
                if (Math.max(f.height * (f.width - a), a * (f.height - e)) > Math.max(f.width * (f.height - e), e * (f.width - a))) {
                    d = new okRect(f.x, f.y + e, a, f.height - e);
                    c = new okRect(f.x + a, f.y, f.width - a, f.height)
                } else {
                    d = new okRect(f.x, f.y + e, f.width, f.height - e);
                    c = new okRect(f.x + a, f.y, f.width - a, e)
                }
            } else {
                if (f.width != a) {
                    d = new okRect(f.x + a, f.y, f.width - a, f.height)
                } else {
                    if (f.height != e) {
                        d = new okRect(f.x, f.y + e, f.width, f.height - e)
                    }
                }
            }
            break
        }
        k = k.next
    }
    if (d) {
        this.appendBlankRect(d)
    }
    if (c) {
        this.appendBlankRect(c)
    }
    return h
}, remove:function (a) {
    this.appendBlankRect(a);
    return true
}, appendBlankRect:function (a) {
    if (a == null || a.width <= 0 || a.height <= 0) {
        return
    }
    var d = this.$F1.getRoot();
    while (d) {
        var c = d.data;
        if (c.width * c.height > a.width * a.height) {
            this.$F1.insertBefore(d, a);
            break
        }
        d = d.next
    }
    if (d == null) {
        this.$F1.pushBack(a)
    }
}};
function okPackVec3ToFloat(d) {
    var a = d.x * 255;
    var h = d.y * 255;
    var f = d.z * 255;
    var c = (a << 16) | (h << 8) | f;
    var e = c / (1 << 24);
    return e
}
function okUnpackFloatToVec3(a) {
    r = a - Math.floor(a);
    g = a * 256 - Math.floor(a * 256);
    b = a * 65536 - Math.floor(a * 65536);
    return new okVec3(r, g, b)
}
function okArray2D() {
    this.elementArray = new Array;
    this.oneDimLength;
    this.twoDimLength
}
okArray2D.prototype = {clear:function () {
    for (var d = 0; d < this.elementArray.length; ++d) {
        var c = this.elementArray[d];
        if (!c) {
            continue
        }
        c = []
    }
    this.elementArray = []
}, addElement:function (d, a, c) {
    var e = this.elementArray[d];
    if (!e) {
        e = new Array;
        this.elementArray[d] = e
    }
    e[a] = c
}, getElement:function (c, a) {
    if (c < 0 || c >= this.getOneDimLength()) {
        return
    }
    if (a < 0 || a >= this.getTwoDimLength()) {
        return
    }
    return this.elementArray[c][a]
}, getOneDimLength:function () {
    this.oneDimLength = this.elementArray.length;
    return this.elementArray.length
}, getTwoDimLength:function () {
    var c = 0;
    for (var a = 0; a < this.elementArray.length; ++a) {
        var d = this.elementArray[a];
        if (!d) {
            d = new Array;
            this.elementArray[a] = d
        }
        if (c < d.length) {
            c = d.length
        }
    }
    this.twoDimLength = c;
    return c
}};
function okGenXmlHttpRequest() {
    if (okIsIE()) {
        return new ActiveXObject("Msxml2.XMLHTTP")
    } else {
        return new XMLHttpRequest()
    }
    return null
}
function okGetFileExtName(c) {
    var a = c.lastIndexOf(".");
    if (a == -1) {
        return""
    }
    return c.substr(a + 1)
}
function okGetRelativePath(a, c) {
    a = a.replace(/\\/g, "/");
    a = a.replace(/^\/+/g, "");
    a = a.replace(/\/$/g, "");
    c = c.replace(/\\/g, "/");
    c = c.replace(/^\/+/g, "");
    c = c.replace(/\/$/g, "");
    return a.substr(a.indexOf(c) + c.length)
}
function okGetFileName(a) {
    a = a.replace(/\\/g, "/");
    var c = a.lastIndexOf("/");
    if (c == -1) {
        return a
    } else {
        return a.substr(c + 1)
    }
}
function okExtend(d, c) {
    var a = function () {
    };
    a.prototype = c.prototype;
    d.__parent = c.prototype;
    d.prototype = new a();
    d.prototype.constructor = d
}
function okBaseCall(h, e) {
    var c = arguments.callee.caller;
    if (c.__parent) {
        return c.__parent.constructor.apply(h, Array.prototype.slice.call(arguments, 1))
    }
    var a = Array.prototype.slice.call(arguments, 2);
    var f = false;
    for (var d = h.constructor; d; d = d.__parent && d.__parent.constructor) {
        if (d.prototype[e] === c) {
            f = true
        } else {
            if (f) {
                return d.prototype[e].apply(h, a)
            }
        }
    }
    if (h[e] === c) {
        return h.constructor.prototype[e].apply(h, a)
    } else {
        throw Error("Called from a method of one name to a method of a different name")
    }
}
function okTrim(a) {
    return a.replace(/(^\s*)|(\s*$)/igm, "")
}
function okAPrototype() {
    this.$G1 = new Array;
    this.$H1 = new Array;
    this.$I1 = new Array;
    this.$U = new Array;
    this.$V = new Array;
    this.$W = new Array;
    this.$a1 = new Array;
    this.$31 = new Array;
    this.$3 = new Array;
    this.$j1 = new Array;
    this.$b1 = new Array;
    this.$11 = new Array;
    this.$7 = new Array;
    this.$01 = new Array
}
okAPrototype.prototype = {object:function () {
    if (this.$01.length) {
        return this.$01.shift()
    }
    return new Object
}, _object:function (c) {
    for (var a in c) {
        delete c[a]
    }
    this.$01.push(c)
}, array:function () {
    if (this.$7.length) {
        return this.$7.shift()
    }
    return new Array
}, _array:function (a) {
    a.length = 0;
    this.$7.push(a)
}, vec2:function () {
    if (this.$G1.length) {
        return this.$G1.shift()
    }
    return new okVec2()
}, _vec2:function (a) {
    a.x = 0;
    a.y = 0;
    this.$G1.push(a)
}, vec3:function (d, c, a) {
    if (this.$H1.length) {
        return this.$H1.shift()
    }
    return new okVec3()
}, _vec3:function (a) {
    a.x = 0;
    a.y = 0;
    a.z = 0;
    this.$H1.push(a)
}, vec4:function () {
    if (this.$I1.length) {
        return this.$I1.shift()
    }
    return new okVec4()
}, _vec4:function (a) {
    a.x = 0;
    a.y = 0;
    a.z = 0;
    a.w = 0;
    this.$I1.push(a)
}, mat3:function () {
    if (this.$U.length) {
        return this.$U.shift()
    }
    return new okMat3()
}, _mat3:function (a) {
    a.m00 = 1;
    a.m10 = 0;
    a.m20 = 0;
    a.m01 = 0;
    a.m11 = 1;
    a.m21 = 0;
    a.m02 = 0;
    a.m12 = 0;
    a.m22 = 1;
    this.$U.push(a)
}, mat4:function () {
    if (this.$V.length) {
        return this.$V.shift()
    }
    return new okMat4()
}, _mat4:function (a) {
    a.m00 = 1;
    a.m10 = 0;
    a.m20 = 0;
    a.m30 = 0;
    a.m01 = 0;
    a.m11 = 1;
    a.m21 = 0;
    a.m31 = 0;
    a.m02 = 0;
    a.m12 = 0;
    a.m22 = 1;
    a.m32 = 0;
    a.m03 = 0;
    a.m13 = 0;
    a.m23 = 0;
    a.m33 = 1;
    this.$V.push(a)
}, mat43:function () {
    if (this.$W.length) {
        return this.$W.shift()
    }
    return new okMat43()
}, _mat43:function (a) {
    a.m00 = 1;
    a.m10 = 0;
    a.m20 = 0;
    a.m01 = 0;
    a.m11 = 1;
    a.m21 = 0;
    a.m02 = 0;
    a.m12 = 0;
    a.m22 = 1;
    a.m03 = 0;
    a.m13 = 0;
    a.m23 = 0;
    this.$W.push(a)
}, quat:function () {
    if (this.$a1.length) {
        return this.$a1.shift()
    }
    return new okQuat()
}, _quat:function (a) {
    a.s = 1;
    a.x = 0;
    a.y = 0;
    a.z = 0;
    this.$a1.push(a)
}, plane:function () {
    if (this.$31.length) {
        return this.$31.shift()
    }
    return new okPlane()
}, _plane:function (a) {
    a.vOrigin.x = 0;
    a.vOrigin.y = 0;
    a.vOrigin.z = 0;
    a.vNormal.x = 0;
    a.vNormal.y = 1;
    a.vNormal.z = 0;
    this.$31.push(a)
}, aabbox:function () {
    if (this.$3.length) {
        return this.$3.shift()
    }
    return new okAABBox()
}, _aabbox:function (a) {
    a.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$3.push(a)
}, sceneNode:function () {
    if (this.$j1.length) {
        return this.$j1.shift()
    }
    return new okSceneNode()
}, _sceneNode:function (a) {
    a.clear();
    this.$j1.push(a)
}, renderBatch:function () {
    if (this.$b1.length) {
        return this.$b1.shift()
    }
    return new okRenderBatch()
}, _renderBatch:function (a) {
    a.clear();
    this.$b1.push(a)
}, particle:function () {
    if (this.$11.length) {
        return this.$11.shift()
    }
    return new okParticle()
}, _particle:function (a) {
    a.lf = 0;
    a.tlf = 0;
    a.m.identity();
    a.v.x = 0;
    a.v.y = 0;
    a.v.z = 0;
    a.ac.x = 0;
    a.ac.y = 0;
    a.ac.z = 0;
    a.s.x = 0.1;
    a.s.y = 0.1;
    a.s0.x = 0.1;
    a.s0.y = 0.1;
    a.s1.x = 0.1;
    a.s1.y = 0.1;
    a.c.x = 1;
    a.c.y = 1;
    a.c.z = 1;
    a.c0.x = 1;
    a.c0.y = 1;
    a.c0.z = 1;
    a.c1.x = 1;
    a.c1.y = 1;
    a.c1.z = 1;
    a.a = 0;
    a.fdi = 0;
    a.fdo = 0;
    this.$11.push(a)
}};
var okA = new okAPrototype();
function okFloatEqual(c, a) {
    if ((c - a) < 0.000001 && (c - a) > -0.000001) {
        return true
    }
    return false
}
function okAlign(c, a) {
    return(c + a - 1) & ~(a - 1)
}
function okAlignPower2(a) {
    --a;
    for (var c = 1; c < 32; c <<= 1) {
        a = a | a >> c
    }
    return a + 1
}
function okIsPower2(a) {
    return(a & (a - 1)) == 0
}
function okVec2(c, a) {
    this.x = ((c != null) ? c : 0);
    this.y = ((a != null) ? a : 0)
}
okVec2.prototype = {set:function (c, a) {
    this.x = c;
    this.y = a
}, clone:function (a) {
    var a = (a ? a : okA.vec2());
    a.x = this.x;
    a.y = this.y;
    return a
}, equal:function (a) {
    return this.x == a.x && this.y == a.y
}, neg:function (a) {
    var c = (a ? this : okA.vec2());
    c.x = -this.x;
    c.y = -this.y;
    return c
}, len:function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
}, normalize:function (c) {
    var d = (c ? this : okA.vec2());
    var a = 1 / Math.sqrt(this.x * this.x + this.y * this.y);
    d.x = this.x * a;
    d.y = this.y * a;
    return d
}, inverse:function (a) {
    var c = (a ? this : okA.vec2());
    c.x = 1 / this.x;
    c.y = 1 / this.y;
    return c
}, translate:function (e, d, c) {
    if (e.x) {
        c = d;
        if (c) {
            this.x += e.x;
            this.y += e.y;
            return this
        } else {
            var a = okA.vec2();
            a.x = this.x + e.x;
            a.y = this.y + e.y;
            return a
        }
    } else {
        if (okIsNumber(d)) {
            if (c) {
                this.x += e;
                this.y += d;
                return this
            } else {
                var a = okA.vec2();
                a.x = this.x + e;
                a.y = this.y + d;
                return a
            }
        } else {
            c = d;
            if (c) {
                this.x += e;
                this.y += e;
                return this
            } else {
                var a = okA.vec2();
                a.x = this.x + e;
                a.y = this.y + e;
                return a
            }
        }
    }
}, scale:function (e, d, c) {
    if (e.x) {
        c = d;
        if (c) {
            this.x *= e.x;
            this.y *= e.y;
            return this
        } else {
            var a = okA.vec2();
            a.x = this.x * e.x;
            a.y = this.y * e.y;
            return a
        }
    } else {
        if (okIsNumber(d)) {
            if (c) {
                this.x *= e;
                this.y *= d;
                return this
            } else {
                var a = okA.vec2();
                a.x = this.x * e;
                a.y = this.y * d;
                return a
            }
        } else {
            c = d;
            if (c) {
                this.x *= e;
                this.y *= e;
                return this
            } else {
                var a = okA.vec2();
                a.x = this.x * e;
                a.y = this.y * e;
                return a
            }
        }
    }
}, toArray:function (a) {
    if (a == null) {
        a = okA.array()
    }
    a.push(this.x, this.y);
    return a
}, __isVec2Complete:function () {
    if (this.x != null && this.y != null) {
        return true
    }
    return false
}};
function okVec2Add(c, a) {
    var d = okA.vec2();
    d.x = c.x + a.x;
    d.y = c.y + a.y;
    return d
}
function okVec2AddVal(a, c) {
    var d = okA.vec2();
    d.x = a.x + c;
    d.y = a.y + c;
    return d
}
function okValAddVec2(c, a) {
    var d = okA.vec2();
    d.x = a.x + c;
    d.y = a.y + c;
    return d
}
function okVec2Sub(c, a) {
    var d = okA.vec2();
    d.x = c.x - a.x;
    d.y = c.y - a.y;
    return d
}
function okVec2SubVal(a, c) {
    var d = okA.vec2();
    d.x = a.x - c;
    d.y = a.y - c;
    return d
}
function okValSubVec2(c, a) {
    var d = okA.vec2();
    d.x = c - a.x;
    d.y = c - a.y;
    return d
}
function okVec2Mul(c, a) {
    var d = okA.vec2();
    d.x = c.x * a.x;
    d.y = c.y * a.y;
    return d
}
function okVec2MulVal(a, c) {
    var d = okA.vec2();
    d.x = a.x * c;
    d.y = a.y * c;
    return d
}
function okValMulVec2(c, a) {
    var d = okA.vec2();
    d.x = a.x * c;
    d.y = a.y * c;
    return d
}
function okVec2Div(c, a) {
    var d = okA.vec2();
    d.x = c.x / a.x;
    d.y = c.y / a.y;
    return d
}
function okVec2DivVal(a, c) {
    var d = okA.vec2();
    d.x = a.x / c;
    d.y = a.y / c;
    return d
}
function okValDivVec2(c, a) {
    var d = okA.vec2();
    d.x = c / a.x;
    d.y = c / a.y;
    return d
}
function okVec2Min(c, a) {
    var d = okA.vec2();
    d.x = c.x < a.x ? c.x : a.x;
    d.y = c.y < a.y ? c.y : a.y;
    return d
}
function okVec2Max(c, a) {
    var d = okA.vec2();
    d.x = c.x > a.x ? c.x : a.x;
    d.y = c.y > a.y ? c.y : a.y;
    return d
}
function okVec2Dot(c, a) {
    return c.x * a.x + c.y * a.y
}
function okVec2Cross(c, a) {
    return c.x * a.y - a.x * c.y
}
function okVec2Lerp(e, d, h) {
    var c = okVec2MulVal(e, 1 - h);
    var a = okVec2MulVal(d, h);
    var f = okVec2Add(c, a);
    okA._vec2(c);
    okA._vec2(a);
    return f
}
function okVec2Len(e, d) {
    var c = e.x - d.x;
    var a = e.y - d.y;
    return Math.sqrt(c * c + a * a)
}
function okVec3(d, c, a) {
    this.x = ((d != null) ? d : 0);
    this.y = ((c != null) ? c : 0);
    this.z = ((a != null) ? a : 0)
}
okVec3.prototype = {set:function (d, c, a) {
    this.x = d;
    this.y = c;
    this.z = a
}, clone:function (a) {
    var a = (a ? a : okA.vec3());
    a.x = this.x;
    a.y = this.y;
    a.z = this.z;
    return a
}, equal:function (a) {
    return this.x == a.x && this.y == a.y && this.z == a.z
}, len:function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
}, neg:function (a) {
    var c = (a ? this : okA.vec3());
    c.x = -this.x;
    c.y = -this.y;
    c.z = -this.z;
    return c
}, normalize:function (c) {
    var d = (c ? this : okA.vec3());
    var a = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    d.x = this.x * a;
    d.y = this.y * a;
    d.z = this.z * a;
    return d
}, inverse:function (a) {
    var c = (a ? this : okA.vec3());
    c.x = 1 / this.x;
    c.y = 1 / this.y;
    c.z = 1 / this.z;
    return c
}, translate:function (f, e, c, d) {
    if (f.x) {
        d = e;
        if (d) {
            this.x += f.x;
            this.y += f.y;
            this.z += f.z;
            return this
        } else {
            var a = okA.vec3();
            a.x = this.x + f.x;
            a.y = this.y + f.y;
            a.z = this.z + f.z;
            return a
        }
    } else {
        if (c == null) {
            d = e;
            if (d) {
                this.x += f;
                this.y += f;
                this.z += f;
                return this
            } else {
                var a = okA.vec3();
                a.x = this.x + f;
                a.y = this.y + f;
                a.z = this.z + f;
                return a
            }
        } else {
            if (d) {
                this.x += f;
                this.y += e;
                this.z += c;
                return this
            } else {
                var a = okA.vec3();
                a.x = this.x + f;
                a.y = this.y + e;
                a.z = this.z + c;
                return a
            }
        }
    }
}, scale:function (f, e, c, d) {
    if (f.x) {
        d = e;
        if (d) {
            this.x *= f.x;
            this.y *= f.y;
            this.z *= f.z;
            return this
        } else {
            var a = okA.vec3();
            a.x = this.x * f.x;
            a.y = this.y * f.y;
            a.z = this.z * f.z;
            return a
        }
    } else {
        if (c == null) {
            d = e;
            if (d) {
                this.x *= f;
                this.y *= f;
                this.z *= f;
                return this
            } else {
                var a = okA.vec3();
                a.x = this.x * f;
                a.y = this.y * f;
                a.z = this.z * f;
                return a
            }
        } else {
            if (d) {
                this.x *= f;
                this.y *= e;
                this.z *= c;
                return this
            } else {
                var a = okA.vec3();
                a.x = this.x * f;
                a.y = this.y * e;
                a.z = this.z * c;
                return a
            }
        }
    }
}, rot:function (k, h, f, c, e) {
    var d = okMat43Rot(k, h, f, c);
    var a = okMat43MulVec3(d, this);
    okA._mat43(d);
    if (e) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        okA._vec3(a);
        return this
    } else {
        return a
    }
}, rotX:function (e, d) {
    var c = okMat43RotX(e);
    var a = okMat43MulVec3(c, this);
    okA._mat43(c);
    if (d) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        okA._vec3(a);
        return this
    } else {
        return a
    }
}, rotY:function (e, d) {
    var c = okMat43RotY(e);
    var a = okMat43MulVec3(c, this);
    okA._mat43(c);
    if (d) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        okA._vec3(a);
        return this
    } else {
        return a
    }
}, rotZ:function (e, d) {
    var c = okMat43RotZ(e);
    var a = okMat43MulVec3(c, this);
    okA._mat43(c);
    if (d) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        okA._vec3(a);
        return this
    } else {
        return a
    }
}, toVec4:function (a) {
    if (a == null) {
        a = okA.vec4()
    }
    a.set(this.x, this.y, this.z, 1);
    return a
}, toArray:function (a) {
    if (a == null) {
        a = okA.array()
    }
    a.push(this.x, this.y, this.z);
    return a
}, __isVec3Complete:function () {
    if (this.x != null && this.y != null && this.z != null) {
        return true
    }
    return false
}};
function okVec3Add(c, a) {
    var d = okA.vec3();
    d.x = c.x + a.x;
    d.y = c.y + a.y;
    d.z = c.z + a.z;
    return d
}
function okVec3AddVal(a, c) {
    var d = okA.vec3();
    d.x = a.x + c;
    d.y = a.y + c;
    d.z = a.z + c;
    return d
}
function okValAddVec3(c, a) {
    var d = okA.vec3();
    d.x = a.x + c;
    d.y = a.y + c;
    d.z = a.z + c;
    return d
}
function okVec3Sub(c, a) {
    var d = okA.vec3();
    d.x = c.x - a.x;
    d.y = c.y - a.y;
    d.z = c.z - a.z;
    return d
}
function okVec3SubVal(a, c) {
    var d = okA.vec3();
    d.x = a.x - c;
    d.y = a.y - c;
    d.z = a.z - c;
    return d
}
function okValSubVec3(c, a) {
    var d = okA.vec3();
    d.x = c - a.x;
    d.y = c - a.y;
    d.z = c - a.z;
    return d
}
function okVec3Mul(c, a) {
    var d = okA.vec3();
    d.x = c.x * a.x;
    d.y = c.y * a.y;
    d.z = c.z * a.z;
    return d
}
function okVec3MulVal(a, c) {
    var d = okA.vec3();
    d.x = a.x * c;
    d.y = a.y * c;
    d.z = a.z * c;
    return d
}
function okValMulVec3(c, a) {
    var d = okA.vec3();
    d.x = a.x * c;
    d.y = a.y * c;
    d.z = a.z * c;
    return d
}
function okVec3Div(c, a) {
    var d = okA.vec3();
    d.x = c.x / a.x;
    d.y = c.y / a.y;
    d.z = c.z / a.z;
    return d
}
function okVec3DivVal(a, c) {
    var d = okA.vec3();
    d.x = a.x / c;
    d.y = a.y / c;
    d.z = a.z / c;
    return d
}
function okValDivVec3(c, a) {
    var d = okA.vec3();
    d.x = c / a.x;
    d.y = c / a.y;
    d.z = c / a.z;
    return d
}
function okVec3Min(c, a) {
    var d = okA.vec3();
    d.x = c.x < a.x ? c.x : a.x;
    d.y = c.y < a.y ? c.y : a.y;
    d.z = c.z < a.z ? c.z : a.z;
    return d
}
function okVec3Max(c, a) {
    var d = okA.vec3();
    d.x = c.x > a.x ? c.x : a.x;
    d.y = c.y > a.y ? c.y : a.y;
    d.z = c.z > a.z ? c.z : a.z;
    return d
}
function okVec3Dot(c, a) {
    return c.x * a.x + c.y * a.y + c.z * a.z
}
function okVec3Cross(c, a) {
    var d = okA.vec3();
    d.x = c.y * a.z - c.z * a.y;
    d.y = c.z * a.x - c.x * a.z;
    d.z = c.x * a.y - c.y * a.x;
    return d
}
function okVec3Lerp(e, c, h) {
    var f = 1 - h;
    var d = h;
    var a = okA.vec3();
    a.x = e.x * f + c.x * d;
    a.y = e.y * f + c.y * d;
    a.z = e.z * f + c.z * d;
    return a
}
function okVec3Len(e, d) {
    var c = e.x - d.x;
    var a = e.y - d.y;
    var f = e.z - d.z;
    return Math.sqrt(c * c + a * a + f * f)
}
function okVec4(d, c, a, e) {
    this.x = ((d != null) ? d : 0);
    this.y = ((c != null) ? c : 0);
    this.z = ((a != null) ? a : 0);
    this.w = ((e != null) ? e : 1)
}
okVec4.prototype = {set:function (d, c, a, e) {
    this.x = d;
    this.y = c;
    this.z = a;
    this.w = e
}, clone:function (a) {
    var a = (a ? a : okA.vec4());
    a.x = this.x;
    a.y = this.y;
    a.z = this.z;
    a.w = this.w;
    return a
}, equal:function (a) {
    return okFloatEqual(this.x, a.x) && okFloatEqual(this.y, a.y) && okFloatEqual(this.z, a.z) && okFloatEqual(this.w, a.w)
}, len:function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
}, neg:function (a) {
    var c = (a ? this : okA.vec4());
    c.x = -this.x;
    c.y = -this.y;
    c.z = -this.z;
    c.w = -this.w;
    return c
}, normalize:function (c) {
    var d = (c ? this : okA.vec4());
    var a = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    d.x = this.x * a;
    d.y = this.y * a;
    d.z = this.z * a;
    d.w = this.w * a;
    return d
}, inverse:function (a) {
    var c = (a ? this : okA.vec4());
    c.x = 1 / this.x;
    c.y = 1 / this.y;
    c.z = 1 / this.z;
    c.w = 1 / this.w;
    return c
}, toVec3:function (a) {
    if (a == null) {
        a = okA.vec3()
    }
    a.x = this.x / this.w;
    a.y = this.y / this.w;
    a.z = this.z / this.w;
    return a
}, toArray:function (a) {
    if (a == null) {
        a = okA.array()
    }
    a.push(this.x, this.y, this.z, this.w);
    return a
}, __isVec4Complete:function () {
    if (this.x != null && this.y != null && this.z != null && this.w != null) {
        return true
    }
    return false
}};
function okVec4Add(c, a) {
    var d = okA.vec4();
    d.x = c.x + a.x;
    d.y = c.y + a.y;
    d.z = c.z + a.z;
    d.w = c.w + a.w;
    return d
}
function okVec4AddVal(a, c) {
    var d = okA.vec4();
    d.x = a.x + c;
    d.y = a.y + c;
    d.z = a.z + c;
    d.w = a.w + c;
    return d
}
function okValAddVec4(c, a) {
    var d = okA.vec4();
    d.x = a.x + c;
    d.y = a.y + c;
    d.z = a.z + c;
    d.w = a.w + c;
    return d
}
function okVec4Sub(c, a) {
    var d = okA.vec4();
    d.x = c.x - a.x;
    d.y = c.y - a.y;
    d.z = c.z - a.z;
    d.w = c.w - a.w;
    return d
}
function okVec4SubVal(a, c) {
    var d = okA.vec4();
    d.x = a.x - c;
    d.y = a.y - c;
    d.z = a.z - c;
    d.w = a.w - c;
    return d
}
function okValSubVec4(c, a) {
    var d = okA.vec4();
    d.x = c - a.x;
    d.y = c - a.y;
    d.z = c - a.z;
    d.w = c - a.w;
    return d
}
function okVec4Mul(c, a) {
    var d = okA.vec4();
    d.x = c.x * a.x;
    d.y = c.y * a.y;
    d.z = c.z * a.z;
    d.w = c.w * a.w;
    return d
}
function okVec4MulVal(a, c) {
    var d = okA.vec4();
    d.x = a.x * c;
    d.y = a.y * c;
    d.z = a.z * c;
    d.w = a.w * c;
    return d
}
function okValMulVec4(c, a) {
    var d = okA.vec4();
    d.x = a.x * c;
    d.y = a.y * c;
    d.z = a.z * c;
    d.w = a.w * c;
    return d
}
function okVec4Div(c, a) {
    var d = okA.vec4();
    d.x = c.x / a.x;
    d.y = c.y / a.y;
    d.z = c.z / a.z;
    d.w = c.w / a.w;
    return d
}
function okVec4DivVal(a, c) {
    var d = okA.vec4();
    d.x = a.x / c;
    d.y = a.y / c;
    d.z = a.z / c;
    d.w = a.w / c;
    return d
}
function okValDivVec4(c, a) {
    var d = okA.vec4();
    d.x = c / a.x;
    d.y = c / a.y;
    d.z = c / a.z;
    d.w = c / a.w;
    return d
}
function okVec4Min(c, a) {
    var d = okA.vec4();
    d.x = c.x < a.x ? c.x : a.x;
    d.y = c.y < a.y ? c.y : a.y;
    d.z = c.z < a.z ? c.z : a.z;
    d.w = c.w < a.w ? c.w : a.w;
    return d
}
function okVec4Max(c, a) {
    var d = okA.vec4();
    d.x = c.x > a.x ? c.x : a.x;
    d.y = c.y > a.y ? c.y : a.y;
    d.z = c.z > a.z ? c.z : a.z;
    d.w = c.w > a.w ? c.w : a.w;
    return d
}
function okVec4Dot(c, a) {
    return c.x * a.x + c.y * a.y + c.z * a.z + c.w * a.w
}
function okVec4Lerp(e, d, h) {
    var c = okVec4MulVal(e, 1 - h);
    var a = okVec4MulVal(d, h);
    var f = okVec4Add(c, a);
    okA._vec4(c);
    okA._vec4(a);
    return f
}
function okVec4Len(f, e) {
    var c = f.x - e.x;
    var a = f.y - e.y;
    var h = f.z - e.z;
    var d = f.w - e.w;
    return Math.sqrt(c * c + a * a + h * h + d * d)
}
function okMat3(a) {
    this.m00 = ((a != null) ? a : 1);
    this.m10 = 0;
    this.m20 = 0;
    this.m01 = 0;
    this.m11 = ((a != null) ? a : 1);
    this.m21 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = ((a != null) ? a : 1)
}
okMat3.prototype = {identity:function () {
    this.m00 = 1;
    this.m10 = 0;
    this.m20 = 0;
    this.m01 = 0;
    this.m11 = 1;
    this.m21 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = 1
}, set:function (a) {
    this.m00 = a[0];
    this.m10 = a[1];
    this.m20 = a[2];
    this.m01 = a[3];
    this.m11 = a[4];
    this.m21 = a[5];
    this.m02 = a[6];
    this.m12 = a[7];
    this.m22 = a[8]
}, clone:function (a) {
    var a = (a ? a : okA.mat3());
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    return a
}, equal:function (a) {
    return okFloatEqual(this.m00, a.m00) && okFloatEqual(this.m10, a.m10) && okFloatEqual(this.m20, a.m20) && okFloatEqual(this.m01, a.m01) && okFloatEqual(this.m11, a.m11) && okFloatEqual(this.m21, a.m21) && okFloatEqual(this.m02, a.m02) && okFloatEqual(this.m12, a.m12) && okFloatEqual(this.m22, a.m22)
}, setColumn:function (d, c, a, e) {
    if (d == 0) {
        if (okIsNumber(c)) {
            this.m00 = c;
            this.m10 = a;
            this.m20 = e
        } else {
            this.m00 = c.x;
            this.m10 = c.y;
            this.m20 = c.z
        }
    } else {
        if (d == 1) {
            if (okIsNumber(c)) {
                this.m01 = c;
                this.m11 = a;
                this.m21 = e
            } else {
                this.m01 = c.x;
                this.m11 = c.y;
                this.m21 = c.z
            }
        } else {
            if (d == 2) {
                if (okIsNumber(c)) {
                    this.m02 = c;
                    this.m12 = a;
                    this.m22 = e
                } else {
                    this.m02 = c.x;
                    this.m12 = c.y;
                    this.m22 = c.z
                }
            }
        }
    }
}, getColumn:function (c) {
    var a = okA.vec3();
    if (c == 0) {
        a.set(this.m00, this.m10, this.m20)
    } else {
        if (c == 1) {
            a.set(this.m01, this.m11, this.m21)
        } else {
            if (c == 2) {
                a.set(this.m02, this.m12, this.m22)
            }
        }
    }
    return a
}, det:function () {
    var n = this.m00, m = this.m01, l = this.m02;
    var k = this.m10, f = this.m11, e = this.m12;
    var d = this.m20, c = this.m21, a = this.m22;
    var h = n * f * a + m * e * d + l * k * c - n * e * c - m * k * a - l * f * d;
    return h
}, inverse:function (m) {
    var p = this.m00, o = this.m01, n = this.m02;
    var k = this.m10, h = this.m11, f = this.m12;
    var e = this.m20, d = this.m21, c = this.m22;
    var a = (m ? this : okA.mat3());
    a.m00 = h * c - f * d;
    a.m01 = n * d - o * c;
    a.m02 = o * f - n * h;
    a.m10 = f * e - k * c;
    a.m11 = p * c - n * e;
    a.m12 = n * k - p * f;
    a.m20 = k * d - h * e;
    a.m21 = o * e - p * d;
    a.m22 = p * h - o * k;
    var q = p * h * c + o * f * e + n * k * d - p * f * d - o * k * c - n * h * e;
    var l = 1 / q;
    a.m00 *= l;
    a.m01 *= l;
    a.m02 *= l;
    a.m10 *= l;
    a.m11 *= l;
    a.m12 *= l;
    a.m20 *= l;
    a.m21 *= l;
    a.m22 *= l;
    return a
}, transpose:function (l) {
    var e = (l ? this : okA.mat3());
    var o = this.m00, n = this.m01, m = this.m02;
    var k = this.m10, h = this.m11, f = this.m12;
    var d = this.m20, c = this.m21, a = this.m22;
    e.m00 = o;
    e.m10 = n;
    e.m20 = m;
    e.m01 = k;
    e.m11 = h;
    e.m21 = f;
    e.m02 = d;
    e.m12 = c;
    e.m22 = a;
    return e
}, rot:function (C, a, y, x, w, e) {
    var s = okA.vec3();
    if (w != null) {
        s.x = y;
        s.y = x;
        s.z = w
    } else {
        s.x = y.x;
        s.y = y.y;
        s.z = y.z;
        e = x
    }
    s.normalize(true);
    var h = a * Math.PI / 180;
    var u = Math.cos(h * 0.5);
    var v = Math.sin(h * 0.5);
    var o = okA.quat();
    o.s = u;
    o.x = v * s.x;
    o.y = v * s.y;
    o.z = v * s.z;
    okA._vec3(s);
    var t = okA.mat3();
    o.toMat3(t);
    var p = this.m00;
    var B = this.m10;
    var f = this.m20;
    var n = this.m01;
    var A = this.m11;
    var d = this.m21;
    var l = this.m02;
    var z = this.m12;
    var c = this.m22;
    var k = (e ? this : okA.mat3());
    if (C == 3) {
        k.m00 = t.m00 * p + t.m01 * B + t.m02 * f;
        k.m10 = t.m10 * p + t.m11 * B + t.m12 * f;
        k.m20 = t.m20 * p + t.m21 * B + t.m22 * f;
        k.m01 = t.m00 * n + t.m01 * A + t.m02 * d;
        k.m11 = t.m10 * n + t.m11 * A + t.m12 * d;
        k.m21 = t.m20 * n + t.m21 * A + t.m22 * d;
        k.m02 = t.m00 * l + t.m01 * z + t.m02 * c;
        k.m12 = t.m10 * l + t.m11 * z + t.m12 * c;
        k.m22 = t.m20 * l + t.m21 * z + t.m22 * c
    } else {
        k.m00 = p * t.m00 + n * t.m10 + l * t.m20;
        k.m10 = B * t.m00 + A * t.m10 + z * t.m20;
        k.m20 = f * t.m00 + d * t.m10 + c * t.m20;
        k.m01 = p * t.m01 + n * t.m11 + l * t.m21;
        k.m11 = B * t.m01 + A * t.m11 + z * t.m21;
        k.m21 = f * t.m01 + d * t.m11 + c * t.m21;
        k.m02 = p * t.m02 + n * t.m12 + l * t.m22;
        k.m12 = B * t.m02 + A * t.m12 + z * t.m22;
        k.m22 = f * t.m02 + d * t.m12 + c * t.m22
    }
    okA._mat3(t);
    okA._quat(o);
    return k
}, rotX:function (B, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), v = Math.sin(l);
    var u = this.m00;
    var A = this.m10;
    var h = this.m20;
    var t = this.m01;
    var z = this.m11;
    var e = this.m21;
    var q = this.m02;
    var y = this.m12;
    var d = this.m22;
    var o = this.m03;
    var w = this.m13;
    var a = this.m23;
    var m = (f ? this : this.clone());
    if (B == 3) {
        m.m10 = k * A - v * h;
        m.m20 = v * A + k * h;
        m.m11 = k * z - v * e;
        m.m21 = v * z + k * e;
        m.m12 = k * y - v * d;
        m.m22 = v * y + k * d
    } else {
        var s = u * u + A * A + h * h;
        var p = t * t + z * z + e * e;
        var n = q * q + y * y + d * d;
        var x = (s != 1 || p != 1 || n != 1);
        if (x) {
            s = Math.sqrt(s);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= s;
            m.m10 /= s;
            m.m20 /= s;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m01 = t * k + q * v;
        m.m11 = z * k + y * v;
        m.m21 = e * k + d * v;
        m.m02 = t * -v + q * k;
        m.m12 = z * -v + y * k;
        m.m22 = e * -v + d * k;
        if (x) {
            s = s / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= s;
            m.m10 *= s;
            m.m20 *= s;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, rotY:function (y, a, e) {
    var k = a * Math.PI / 180;
    var h = Math.cos(k), t = Math.sin(k);
    var s = this.m00;
    var x = this.m10;
    var f = this.m20;
    var p = this.m01;
    var w = this.m11;
    var d = this.m21;
    var o = this.m02;
    var v = this.m12;
    var c = this.m22;
    var l = (e ? this : this.clone());
    if (y == 3) {
        l.m00 = h * s + t * f;
        l.m20 = -t * s + h * f;
        l.m01 = h * p + t * d;
        l.m21 = -t * p + h * d;
        l.m02 = h * o + t * c;
        l.m22 = -t * o + h * c
    } else {
        var q = s * s + x * x + f * f;
        var n = p * p + w * w + d * d;
        var m = o * o + v * v + c * c;
        var u = (q != 1 || n != 1 || m != 1);
        if (u) {
            q = Math.sqrt(q);
            n = Math.sqrt(n);
            m = Math.sqrt(m);
            l.m00 /= q;
            l.m10 /= q;
            l.m20 /= q;
            l.m01 /= n;
            l.m11 /= n;
            l.m21 /= n;
            l.m02 /= m;
            l.m12 /= m;
            l.m22 /= m
        }
        l.m00 = s * h + o * -t;
        l.m10 = x * h + v * -t;
        l.m20 = f * h + c * -t;
        l.m02 = s * t + o * h;
        l.m12 = x * t + v * h;
        l.m22 = f * t + c * h;
        if (u) {
            q = q / Math.sqrt(l.m00 * l.m00 + l.m10 * l.m10 + l.m20 * l.m20);
            n = n / Math.sqrt(l.m01 * l.m01 + l.m11 * l.m11 + l.m21 * l.m21);
            m = m / Math.sqrt(l.m02 * l.m02 + l.m12 * l.m12 + l.m22 * l.m22);
            l.m00 *= q;
            l.m10 *= q;
            l.m20 *= q;
            l.m01 *= n;
            l.m11 *= n;
            l.m21 *= n;
            l.m02 *= m;
            l.m12 *= m;
            l.m22 *= m
        }
    }
    return l
}, rotZ:function (B, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), v = Math.sin(l);
    var u = this.m00;
    var A = this.m10;
    var h = this.m20;
    var t = this.m01;
    var z = this.m11;
    var e = this.m21;
    var q = this.m02;
    var y = this.m12;
    var d = this.m22;
    var o = this.m03;
    var w = this.m13;
    var a = this.m23;
    var m = (f ? this : this.clone());
    if (B == 3) {
        m.m00 = k * u + -v * A;
        m.m10 = v * u + k * A;
        m.m01 = k * t + -v * z;
        m.m11 = v * t + k * z;
        m.m02 = k * q + -v * y;
        m.m12 = v * q + k * y
    } else {
        var s = u * u + A * A + h * h;
        var p = t * t + z * z + e * e;
        var n = q * q + y * y + d * d;
        var x = (s != 1 || p != 1 || n != 1);
        if (x) {
            s = Math.sqrt(s);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= s;
            m.m10 /= s;
            m.m20 /= s;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m00 = u * k + t * v;
        m.m10 = A * k + z * v;
        m.m20 = h * k + e * v;
        m.m01 = u * -v + t * k;
        m.m11 = A * -v + z * k;
        m.m21 = h * -v + e * k;
        if (x) {
            s = s / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= s;
            m.m10 *= s;
            m.m20 *= s;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, scale:function (a, h, e, d, m) {
    var l, k, f;
    if (e) {
        l = h;
        k = e;
        f = d
    } else {
        if (h.x) {
            l = h.x;
            e = h.y;
            d = h.z;
            m = e
        } else {
            l = h;
            e = h;
            d = h;
            m = e
        }
    }
    var c = (m ? this : this.clone());
    if (a == 3) {
        c.m00 *= l;
        c.m10 *= k;
        c.m20 *= f;
        c.m01 *= l;
        c.m11 *= k;
        c.m21 *= f;
        c.m02 *= l;
        c.m12 *= k;
        c.m22 *= f
    } else {
        c.m00 *= l;
        c.m10 *= l;
        c.m20 *= l;
        c.m01 *= k;
        c.m11 *= k;
        c.m21 *= k;
        c.m02 *= f;
        c.m12 *= f;
        c.m22 *= f
    }
    return c
}, toMat4:function (a) {
    if (a == null) {
        a = okA.mat4()
    }
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m30 = 0;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m31 = 0;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m32 = 0;
    a.m03 = 0;
    a.m13 = 0;
    a.m23 = 0;
    a.m33 = 1;
    return a
}, toMat43:function (a) {
    if (a == null) {
        a = okA.mat43()
    }
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m03 = 0;
    a.m13 = 0;
    a.m23 = 0;
    return a
}, toQuat:function (a) {
    if (a == null) {
        a = okA.quat()
    }
    var d = this.m00 + this.m11 + this.m22;
    if (d > 0) {
        var c = Math.sqrt(d + 1) * 2;
        a.s = 0.25 * c;
        a.x = (this.m21 - this.m12) / c;
        a.y = (this.m02 - this.m20) / c;
        a.z = (this.m10 - this.m01) / c
    } else {
        if ((this.m00 > this.m11) && (this.m00 > this.m22)) {
            var c = Math.sqrt(1 + this.m00 - this.m11 - this.m22) * 2;
            a.s = (this.m21 - this.m12) / c;
            a.x = 0.25 * c;
            a.y = (this.m01 + this.m10) / c;
            a.z = (this.m02 + this.m20) / c
        } else {
            if (this.m11 > this.m22) {
                var c = Math.sqrt(1 + this.m11 - this.m00 - this.m22) * 2;
                a.s = (this.m02 - this.m20) / c;
                a.x = (this.m01 + this.m10) / c;
                a.y = 0.25 * c;
                a.z = (this.m12 + this.m21) / c
            } else {
                var c = Math.sqrt(1 + this.m22 - this.m00 - this.m11) * 2;
                a.s = (this.m10 - this.m01) / c;
                a.x = (this.m02 + this.m20) / c;
                a.y = (this.m12 + this.m21) / c;
                a.z = 0.25 * c
            }
        }
    }
    return a
}, toArray:function (a) {
    if (a == null) {
        a = okA.array()
    }
    a.push(this.m00, this.m10, this.m20, this.m01, this.m11, this.m21, this.m02, this.m12, this.m22, this.m03, this.m13, this.m23);
    return a
}, __isMat3Complete:function () {
    if (this.m00 != null && this.m01 != null && this.m02 != null && this.m10 != null && this.m11 != null && this.m12 != null && this.m20 != null && this.m21 != null && this.m22 != null) {
        return true
    }
    return false
}};
function okMat3Add(d, c) {
    var a = okA.mat3();
    a.m00 = d.m00 + c.m00;
    a.m10 = d.m10 + c.m10;
    a.m20 = d.m20 + c.m20;
    a.m01 = d.m01 + c.m01;
    a.m11 = d.m11 + c.m11;
    a.m21 = d.m21 + c.m21;
    a.m02 = d.m02 + c.m02;
    a.m12 = d.m12 + c.m12;
    a.m22 = d.m22 + c.m22;
    return a
}
function okMat3AddVal(c, d) {
    var a = okA.mat3();
    a.m00 = c.m00 + d;
    a.m10 = c.m10 + d;
    a.m20 = c.m20 + d;
    a.m01 = c.m01 + d;
    a.m11 = c.m11 + d;
    a.m21 = c.m21 + d;
    a.m02 = c.m02 + d;
    a.m12 = c.m12 + d;
    a.m22 = c.m22 + d;
    return a
}
function okValAddMat3(d, c) {
    var a = okA.mat3();
    a.m00 = c.m00 + d;
    a.m10 = c.m10 + d;
    a.m20 = c.m20 + d;
    a.m01 = c.m01 + d;
    a.m11 = c.m11 + d;
    a.m21 = c.m21 + d;
    a.m02 = c.m02 + d;
    a.m12 = c.m12 + d;
    a.m22 = c.m22 + d;
    return a
}
function okMat3Sub(d, c) {
    var a = okA.mat3();
    a.m00 = d.m00 - c.m00;
    a.m10 = d.m10 - c.m10;
    a.m20 = d.m20 - c.m20;
    a.m01 = d.m01 - c.m01;
    a.m11 = d.m11 - c.m11;
    a.m21 = d.m21 - c.m21;
    a.m02 = d.m02 - c.m02;
    a.m12 = d.m12 - c.m12;
    a.m22 = d.m22 - c.m22;
    return a
}
function okMat3SubVal(c, d) {
    var a = okA.mat3();
    a.m00 = c.m00 - d;
    a.m10 = c.m10 - d;
    a.m20 = c.m20 - d;
    a.m01 = c.m01 - d;
    a.m11 = c.m11 - d;
    a.m21 = c.m21 - d;
    a.m02 = c.m02 - d;
    a.m12 = c.m12 - d;
    a.m22 = c.m22 - d;
    return a
}
function okValSubMat3(d, c) {
    var a = okA.mat3();
    a.m00 = d - c.m00;
    a.m10 = d - c.m10;
    a.m20 = d - c.m20;
    a.m01 = d - c.m01;
    a.m11 = d - c.m11;
    a.m21 = d - c.m21;
    a.m02 = d - c.m02;
    a.m12 = d - c.m12;
    a.m22 = d - c.m22;
    return a
}
function okMat3Mul(d, c) {
    var a = okA.mat3();
    a.m00 = d.m00 * c.m00 + d.m01 * c.m10 + d.m02 * c.m20;
    a.m10 = d.m10 * c.m00 + d.m11 * c.m10 + d.m12 * c.m20;
    a.m20 = d.m20 * c.m00 + d.m21 * c.m10 + d.m22 * c.m20;
    a.m01 = d.m00 * c.m01 + d.m01 * c.m11 + d.m02 * c.m21;
    a.m11 = d.m10 * c.m01 + d.m11 * c.m11 + d.m12 * c.m21;
    a.m21 = d.m20 * c.m01 + d.m21 * c.m11 + d.m22 * c.m21;
    a.m02 = d.m00 * c.m02 + d.m01 * c.m12 + d.m02 * c.m22;
    a.m12 = d.m10 * c.m02 + d.m11 * c.m12 + d.m12 * c.m22;
    a.m22 = d.m20 * c.m02 + d.m21 * c.m12 + d.m22 * c.m22;
    return a
}
function okMat3MulVal(c, d) {
    var a = okA.mat3();
    a.m00 = c.m00 * d;
    a.m10 = c.m10 * d;
    a.m20 = c.m20 * d;
    a.m01 = c.m01 * d;
    a.m11 = c.m11 * d;
    a.m21 = c.m21 * d;
    a.m02 = c.m02 * d;
    a.m12 = c.m12 * d;
    a.m22 = c.m22 * d;
    return a
}
function okValMulMat3(d, c) {
    var a = okA.mat3();
    a.m00 = c.m00 * d;
    a.m10 = c.m10 * d;
    a.m20 = c.m20 * d;
    a.m01 = c.m01 * d;
    a.m11 = c.m11 * d;
    a.m21 = c.m21 * d;
    a.m02 = c.m02 * d;
    a.m12 = c.m12 * d;
    a.m22 = c.m22 * d;
    return a
}
function okMat3MulVec3(c, a) {
    var d = okA.vec3();
    d.x = c.m00 * a.x + c.m01 * a.y + c.m02 * a.z;
    d.y = c.m10 * a.x + c.m11 * a.y + c.m12 * a.z;
    d.z = c.m20 * a.x + c.m21 * a.y + c.m22 * a.z;
    return d
}
function okMat3Lerp(d, c, e) {
    var a = okA.mat3();
    a.m00 = d.m00 * (1 - e) + c.m00 * e;
    a.m10 = d.m10 * (1 - e) + c.m10 * e;
    a.m20 = d.m20 * (1 - e) + c.m20 * e;
    a.m01 = d.m01 * (1 - e) + c.m01 * e;
    a.m11 = d.m11 * (1 - e) + c.m11 * e;
    a.m21 = d.m21 * (1 - e) + c.m21 * e;
    a.m02 = d.m02 * (1 - e) + c.m02 * e;
    a.m12 = d.m12 * (1 - e) + c.m12 * e;
    a.m22 = d.m22 * (1 - e) + c.m22 * e;
    return a
}
function okMat3Scale(e, d, c) {
    var f = okA.vec3();
    if (d != null) {
        f.x = e;
        f.y = d;
        f.z = c
    } else {
        f.x = e.x;
        f.y = e.y;
        f.z = e.z
    }
    var a = okA.mat3();
    a.m00 = f.x;
    a.m11 = f.y;
    a.m22 = f.z;
    okA._vec3(f);
    return a
}
function okMat3RotX(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat3();
    c.m11 = a;
    c.m12 = -d;
    c.m21 = d;
    c.m22 = a;
    return c
}
function okMat3RotY(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat3();
    c.m00 = a;
    c.m02 = d;
    c.m20 = -d;
    c.m22 = a;
    return c
}
function okMat3RotZ(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat3();
    c.m00 = a;
    c.m01 = -d;
    c.m10 = d;
    c.m11 = a;
    return c
}
function okMat3Rot(l, o, n, m) {
    var d = l * Math.PI / 180;
    var h = okA.vec3();
    if (n != null) {
        h.x = o;
        h.y = n;
        h.z = m
    } else {
        h.x = o.x;
        h.y = o.y;
        h.z = o.z
    }
    var k = h.normalize();
    okA._vec3(h);
    var e = Math.cos(d * 0.5);
    var c = Math.sin(d * 0.5);
    var a = new okQuat();
    a.s = e;
    a.x = c * k.x;
    a.y = c * k.y;
    a.z = c * k.z;
    okA._vec3(k);
    var f = okA.mat3();
    a.toMat3(f);
    okA._quat(a);
    return f
}
function okMat4(a) {
    this.m00 = ((a != null) ? a : 1);
    this.m10 = 0;
    this.m20 = 0;
    this.m30 = 0;
    this.m01 = 0;
    this.m11 = ((a != null) ? a : 1);
    this.m21 = 0;
    this.m31 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = ((a != null) ? a : 1);
    this.m32 = 0;
    this.m03 = 0;
    this.m13 = 0;
    this.m23 = 0;
    this.m33 = ((a != null) ? a : 1)
}
okMat4.prototype = {set:function (a) {
    this.m00 = a[0];
    this.m10 = a[1];
    this.m20 = a[2];
    this.m30 = a[3];
    this.m01 = a[4];
    this.m11 = a[5];
    this.m21 = a[6];
    this.m31 = a[7];
    this.m02 = a[8];
    this.m12 = a[9];
    this.m22 = a[10];
    this.m32 = a[11];
    this.m03 = a[12];
    this.m13 = a[13];
    this.m23 = a[14];
    this.m33 = a[15]
}, identity:function () {
    this.m00 = 1;
    this.m10 = 0;
    this.m20 = 0;
    this.m30 = 0;
    this.m01 = 0;
    this.m11 = 1;
    this.m21 = 0;
    this.m31 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = 1;
    this.m32 = 0;
    this.m03 = 0;
    this.m13 = 0;
    this.m23 = 0;
    this.m33 = 1
}, clone:function (a) {
    var a = (a ? a : okA.mat4());
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m30 = this.m30;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m31 = this.m31;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m32 = this.m32;
    a.m03 = this.m03;
    a.m13 = this.m13;
    a.m23 = this.m23;
    a.m33 = this.m33;
    return a
}, equal:function (a) {
    return okFloatEqual(this.m00, a.m00) && okFloatEqual(this.m10, a.m10) && okFloatEqual(this.m20, a.m20) && okFloatEqual(this.m30, a.m30) && okFloatEqual(this.m01, a.m01) && okFloatEqual(this.m11, a.m11) && okFloatEqual(this.m21, a.m21) && okFloatEqual(this.m31, a.m31) && okFloatEqual(this.m02, a.m02) && okFloatEqual(this.m12, a.m12) && okFloatEqual(this.m22, a.m22) && okFloatEqual(this.m32, a.m32) && okFloatEqual(this.m03, a.m03) && okFloatEqual(this.m13, a.m13) && okFloatEqual(this.m23, a.m23) && okFloatEqual(this.m33, a.m33)
}, setColumn:function (d, c, a, f, e) {
    if (d == 0) {
        if (okIsNumber(c)) {
            this.m00 = c;
            this.m10 = a;
            this.m20 = f;
            this.m30 = (e ? e : this.m30)
        } else {
            this.m00 = c.x;
            this.m10 = c.y;
            this.m20 = c.z;
            this.m30 = (c.w ? c.w : this.m30)
        }
    } else {
        if (d == 1) {
            if (okIsNumber(c)) {
                this.m01 = c;
                this.m11 = a;
                this.m21 = f;
                this.m31 = (e ? e : this.m31)
            } else {
                this.m01 = c.x;
                this.m11 = c.y;
                this.m21 = c.z;
                this.m31 = (c.w ? c.w : this.m31)
            }
        } else {
            if (d == 2) {
                if (okIsNumber(c)) {
                    this.m02 = c;
                    this.m12 = a;
                    this.m22 = f;
                    this.m32 = (e ? e : this.m32)
                } else {
                    this.m02 = c.x;
                    this.m12 = c.y;
                    this.m22 = c.z;
                    this.m32 = (c.w ? c.w : this.m32)
                }
            } else {
                if (d == 3) {
                    if (okIsNumber(c)) {
                        this.m03 = c;
                        this.m13 = a;
                        this.m23 = f;
                        this.m33 = (e ? e : this.m33)
                    } else {
                        this.m03 = c.x;
                        this.m13 = c.y;
                        this.m23 = c.z;
                        this.m33 = (c.w ? c.w : this.m33)
                    }
                }
            }
        }
    }
}, getColumn:function (c) {
    var a = okA.vec4();
    if (c == 0) {
        a.set(this.m00, this.m10, this.m20, this.m30)
    } else {
        if (c == 1) {
            a.set(this.m01, this.m11, this.m21, this.m31)
        } else {
            if (c == 2) {
                a.set(this.m02, this.m12, this.m22, this.m32)
            } else {
                if (c == 3) {
                    a.set(this.m03, this.m13, this.m23, this.m33)
                }
            }
        }
    }
    return a
}, det:function () {
    var v = this.m00, u = this.m01, s = this.m02, p = this.m03;
    var m = this.m10, k = this.m11, h = this.m12, f = this.m13;
    var e = this.m20, d = this.m21, c = this.m22, a = this.m23;
    var t = this.m30, q = this.m31, o = this.m32, n = this.m33;
    var l = v * k * c * n + v * h * a * q + v * f * d * o + u * m * a * o + u * h * e * n + u * f * c * t + s * m * d * n + s * k * a * t + s * f * e * q + p * m * c * q + p * k * e * o + p * h * d * t - v * k * a * o - v * h * d * n - v * f * c * q - u * m * c * n - u * h * a * t - u * f * e * o - s * m * a * q - s * k * e * n - s * f * d * t - p * m * d * o - p * k * c * t - p * h * e * q;
    return l
}, inverse:function (l) {
    var h = this.m00, e = this.m01, c = this.m02, a = this.m03;
    var t = this.m10, s = this.m11, q = this.m12, p = this.m13;
    var y = this.m20, x = this.m21, w = this.m22, v = this.m23;
    var m = this.m30, k = this.m31, f = this.m32, d = this.m33;
    var o = (l ? this : okA.mat4());
    o.m00 = s * w * d + q * v * k + p * x * f - s * v * f - q * x * d - p * w * k;
    o.m01 = e * v * f + c * x * d + a * w * k - e * w * d - c * v * k - a * x * f;
    o.m02 = e * q * d + c * p * k + a * s * f - e * p * f - c * s * d - a * q * k;
    o.m03 = e * p * w + c * s * v + a * q * x - e * q * v - c * p * x - a * s * w;
    o.m10 = t * v * f + q * y * d + p * w * m - t * w * d - q * v * m - p * y * f;
    o.m11 = h * w * d + c * v * m + a * y * f - h * v * f - c * y * d - a * w * m;
    o.m12 = h * p * f + c * t * d + a * q * m - h * q * d - c * p * m - a * t * f;
    o.m13 = h * q * v + c * p * y + a * t * w - h * p * w - c * t * v - a * q * y;
    o.m20 = t * x * d + s * v * m + p * y * k - t * v * k - s * y * d - p * x * m;
    o.m21 = h * v * k + e * y * d + a * x * m - h * x * d - e * v * m - a * y * k;
    o.m22 = h * s * d + e * p * m + a * t * k - h * p * k - e * t * d - a * s * m;
    o.m23 = h * p * x + e * t * v + a * s * y - h * s * v - e * p * y - a * t * x;
    o.m30 = t * w * k + s * y * f + q * x * m - t * x * f - s * w * m - q * y * k;
    o.m31 = h * x * f + e * w * m + c * y * k - h * w * k - e * y * f - c * x * m;
    o.m32 = h * q * k + e * t * f + c * s * m - h * s * f - e * q * m - c * t * k;
    o.m33 = h * s * w + e * q * y + c * t * x - h * q * x - e * t * w - c * s * y;
    var u = h * s * w * d + h * q * v * k + h * p * x * f + e * t * v * f + e * q * y * d + e * p * w * m + c * t * x * d + c * s * v * m + c * p * y * k + a * t * w * k + a * s * y * f + a * q * x * m - h * s * v * f - h * q * x * d - h * p * w * k - e * t * w * d - e * q * v * m - e * p * y * f - c * t * v * k - c * s * y * d - c * p * x * m - a * t * x * f - a * s * w * m - a * q * y * k;
    var n = 1 / u;
    o.m00 *= n;
    o.m01 *= n;
    o.m02 *= n;
    o.m03 *= n;
    o.m10 *= n;
    o.m11 *= n;
    o.m12 *= n;
    o.m13 *= n;
    o.m20 *= n;
    o.m21 *= n;
    o.m22 *= n;
    o.m23 *= n;
    o.m30 *= n;
    o.m31 *= n;
    o.m32 *= n;
    o.m33 *= n;
    return o
}, transpose:function (e) {
    var h = (e ? this : okA.mat4());
    var p = this.m00, n = this.m01, m = this.m02, k = this.m03;
    var w = this.m10, v = this.m11, u = this.m12, t = this.m13;
    var f = this.m20, d = this.m21, c = this.m22, a = this.m23;
    var s = this.m30, q = this.m31, o = this.m32, l = this.m33;
    h.m00 = p;
    h.m10 = n;
    h.m20 = m;
    h.m30 = k;
    h.m01 = w;
    h.m11 = v;
    h.m21 = u;
    h.m31 = t;
    h.m02 = f;
    h.m12 = d;
    h.m22 = c;
    h.m32 = a;
    h.m03 = s;
    h.m13 = q;
    h.m23 = o;
    h.m33 = l;
    return h
}, translate:function (h, f, e, c, d) {
    if (f.x) {
        d = e;
        e = f.y;
        c = f.z;
        f = f.x
    } else {
        if (c == null) {
            d = e;
            e = f;
            c = f
        }
    }
    var a = (d ? this : this.clone());
    if (h == 3) {
        a.m00 = this.m00 + f * this.m30;
        a.m10 = this.m10 + e * this.m30;
        a.m20 = this.m20 + c * this.m30;
        a.m01 = this.m01 + f * this.m31;
        a.m11 = this.m11 + e * this.m31;
        a.m21 = this.m21 + c * this.m31;
        a.m02 = this.m02 + f * this.m32;
        a.m12 = this.m12 + e * this.m32;
        a.m22 = this.m22 + c * this.m32;
        a.m03 = this.m03 + f * this.m33;
        a.m13 = this.m13 + e * this.m33;
        a.m23 = this.m23 + c * this.m33
    } else {
        a.m03 = this.m03 + this.m00 * f + this.m01 * e + this.m02 * c;
        a.m13 = this.m13 + this.m10 * f + this.m11 * e + this.m12 * c;
        a.m23 = this.m23 + this.m20 * f + this.m21 * e + this.m22 * c;
        a.m33 = this.m33 + this.m30 * f + this.m31 * e + this.m32 * c
    }
    return a
}, rot:function (J, c, E, D, C, f) {
    var x = okA.vec3();
    if (C != null) {
        x.x = E;
        x.y = D;
        x.z = C
    } else {
        x.x = E.x;
        x.y = E.y;
        x.z = E.z;
        f = D
    }
    x.normalize(true);
    var k = c * Math.PI / 180;
    var A = Math.cos(k * 0.5);
    var B = Math.sin(k * 0.5);
    var u = okA.quat();
    u.s = A;
    u.x = B * x.x;
    u.y = B * x.y;
    u.z = B * x.z;
    okA._vec3(x);
    var z = okA.mat4();
    u.toMat4(z);
    var w = this.m00;
    var I = this.m10;
    var h = this.m20;
    var y = this.m30;
    var t = this.m01;
    var H = this.m11;
    var e = this.m21;
    var v = this.m31;
    var p = this.m02;
    var G = this.m12;
    var d = this.m22;
    var s = this.m32;
    var n = this.m03;
    var F = this.m13;
    var a = this.m23;
    var o = this.m33;
    var l = (f ? this : okA.mat4());
    if (J == 3) {
        l.m00 = z.m00 * w + z.m01 * I + z.m02 * h + z.m03 * y;
        l.m10 = z.m10 * w + z.m11 * I + z.m12 * h + z.m13 * y;
        l.m20 = z.m20 * w + z.m21 * I + z.m22 * h + z.m23 * y;
        l.m30 = z.m30 * w + z.m31 * I + z.m32 * h + z.m33 * y;
        l.m01 = z.m00 * t + z.m01 * H + z.m02 * e + z.m03 * v;
        l.m11 = z.m10 * t + z.m11 * H + z.m12 * e + z.m13 * v;
        l.m21 = z.m20 * t + z.m21 * H + z.m22 * e + z.m23 * v;
        l.m31 = z.m30 * t + z.m31 * H + z.m32 * e + z.m33 * v;
        l.m02 = z.m00 * p + z.m01 * G + z.m02 * d + z.m03 * s;
        l.m12 = z.m10 * p + z.m11 * G + z.m12 * d + z.m13 * s;
        l.m22 = z.m20 * p + z.m21 * G + z.m22 * d + z.m23 * s;
        l.m32 = z.m30 * p + z.m31 * G + z.m32 * d + z.m33 * s;
        l.m03 = z.m00 * n + z.m01 * F + z.m02 * a + z.m03 * o;
        l.m13 = z.m10 * n + z.m11 * F + z.m12 * a + z.m13 * o;
        l.m23 = z.m20 * n + z.m21 * F + z.m22 * a + z.m23 * o;
        l.m33 = z.m30 * n + z.m31 * F + z.m32 * a + z.m33 * o
    } else {
        l.m00 = w * z.m00 + t * z.m10 + p * z.m20 + n * z.m30;
        l.m10 = I * z.m00 + H * z.m10 + G * z.m20 + F * z.m30;
        l.m20 = h * z.m00 + e * z.m10 + d * z.m20 + a * z.m30;
        l.m30 = y * z.m00 + v * z.m10 + s * z.m20 + o * z.m30;
        l.m01 = w * z.m01 + t * z.m11 + p * z.m21 + n * z.m31;
        l.m11 = I * z.m01 + H * z.m11 + G * z.m21 + F * z.m31;
        l.m21 = h * z.m01 + e * z.m11 + d * z.m21 + a * z.m31;
        l.m31 = y * z.m01 + v * z.m11 + s * z.m21 + o * z.m31;
        l.m02 = w * z.m02 + t * z.m12 + p * z.m22 + n * z.m32;
        l.m12 = I * z.m02 + H * z.m12 + G * z.m22 + F * z.m32;
        l.m22 = h * z.m02 + e * z.m12 + d * z.m22 + a * z.m32;
        l.m32 = y * z.m02 + v * z.m12 + s * z.m22 + o * z.m32;
        l.m03 = w * z.m03 + t * z.m13 + p * z.m23 + n * z.m33;
        l.m13 = I * z.m03 + H * z.m13 + G * z.m23 + F * z.m33;
        l.m23 = h * z.m03 + e * z.m13 + d * z.m23 + a * z.m33;
        l.m33 = y * z.m03 + v * z.m13 + s * z.m23 + o * z.m33
    }
    okA._mat4(z);
    okA._quat(u);
    return l
}, rotX:function (F, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), z = Math.sin(l);
    var w = this.m00;
    var E = this.m10;
    var h = this.m20;
    var y = this.m30;
    var v = this.m01;
    var D = this.m11;
    var e = this.m21;
    var x = this.m31;
    var s = this.m02;
    var C = this.m12;
    var d = this.m22;
    var u = this.m32;
    var o = this.m03;
    var A = this.m13;
    var a = this.m23;
    var q = this.m33;
    var m = (f ? this : this.clone());
    if (F == 3) {
        m.m10 = k * E - z * h;
        m.m20 = z * E + k * h;
        m.m11 = k * D - z * e;
        m.m21 = z * D + k * e;
        m.m12 = k * C - z * d;
        m.m22 = z * C + k * d;
        m.m03 = o;
        m.m13 = k * A - z * a;
        m.m23 = z * A + k * a
    } else {
        var t = w * w + E * E + h * h;
        var p = v * v + D * D + e * e;
        var n = s * s + C * C + d * d;
        var B = (t != 1 || p != 1 || n != 1);
        if (B) {
            t = Math.sqrt(t);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= t;
            m.m10 /= t;
            m.m20 /= t;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m01 = v * k + s * z;
        m.m11 = D * k + C * z;
        m.m21 = e * k + d * z;
        m.m31 = x * k + u * z;
        m.m02 = v * -z + s * k;
        m.m12 = D * -z + C * k;
        m.m22 = e * -z + d * k;
        m.m32 = x * -z + u * k;
        if (B) {
            t = t / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= t;
            m.m10 *= t;
            m.m20 *= t;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, rotY:function (F, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), z = Math.sin(l);
    var w = this.m00;
    var E = this.m10;
    var h = this.m20;
    var y = this.m30;
    var v = this.m01;
    var D = this.m11;
    var e = this.m21;
    var x = this.m31;
    var s = this.m02;
    var C = this.m12;
    var d = this.m22;
    var u = this.m32;
    var o = this.m03;
    var A = this.m13;
    var a = this.m23;
    var q = this.m33;
    var m = (f ? this : this.clone());
    if (F == 3) {
        m.m00 = k * w + z * h;
        m.m20 = -z * w + k * h;
        m.m01 = k * v + z * e;
        m.m21 = -z * v + k * e;
        m.m02 = k * s + z * d;
        m.m22 = -z * s + k * d;
        m.m03 = k * o + z * a;
        m.m23 = -z * o + k * a
    } else {
        var t = w * w + E * E + h * h;
        var p = v * v + D * D + e * e;
        var n = s * s + C * C + d * d;
        var B = (t != 1 || p != 1 || n != 1);
        if (B) {
            t = Math.sqrt(t);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= t;
            m.m10 /= t;
            m.m20 /= t;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m00 = w * k + s * -z;
        m.m10 = E * k + C * -z;
        m.m20 = h * k + d * -z;
        m.m30 = y * k + u * -z;
        m.m02 = w * z + s * k;
        m.m12 = E * z + C * k;
        m.m22 = h * z + d * k;
        m.m32 = y * z + u * k;
        if (B) {
            t = t / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= t;
            m.m10 *= t;
            m.m20 *= t;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, rotZ:function (F, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), z = Math.sin(l);
    var w = this.m00;
    var E = this.m10;
    var h = this.m20;
    var y = this.m30;
    var v = this.m01;
    var D = this.m11;
    var e = this.m21;
    var x = this.m31;
    var s = this.m02;
    var C = this.m12;
    var d = this.m22;
    var u = this.m32;
    var o = this.m03;
    var A = this.m13;
    var a = this.m23;
    var q = this.m33;
    var m = (f ? this : this.clone());
    if (F == 3) {
        m.m00 = k * w + -z * E;
        m.m10 = z * w + k * E;
        m.m01 = k * v + -z * D;
        m.m11 = z * v + k * D;
        m.m02 = k * s + -z * C;
        m.m12 = z * s + k * C;
        m.m03 = k * o + -z * A;
        m.m13 = z * o + k * A
    } else {
        var t = w * w + E * E + h * h;
        var p = v * v + D * D + e * e;
        var n = s * s + C * C + d * d;
        var B = (t != 1 || p != 1 || n != 1);
        if (B) {
            t = Math.sqrt(t);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= t;
            m.m10 /= t;
            m.m20 /= t;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m00 = w * k + v * z;
        m.m10 = E * k + D * z;
        m.m20 = h * k + e * z;
        m.m30 = y * k + x * z;
        m.m01 = w * -z + v * k;
        m.m11 = E * -z + D * k;
        m.m21 = h * -z + e * k;
        m.m31 = y * -z + x * k;
        if (B) {
            t = t / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= t;
            m.m10 *= t;
            m.m20 *= t;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, scale:function (a, h, e, d, m) {
    var l, k, f;
    if (d) {
        l = h;
        k = e;
        f = d
    } else {
        if (h.x) {
            l = h.x;
            e = h.y;
            d = h.z;
            m = e
        } else {
            l = h;
            e = h;
            d = h;
            m = e
        }
    }
    var c = (m ? this : this.clone());
    if (a == 3) {
        c.m00 *= l;
        c.m10 *= k;
        c.m20 *= f;
        c.m01 *= l;
        c.m11 *= k;
        c.m21 *= f;
        c.m02 *= l;
        c.m12 *= k;
        c.m22 *= f;
        c.m03 *= l;
        c.m13 *= k;
        c.m23 *= f
    } else {
        c.m00 *= l;
        c.m10 *= l;
        c.m20 *= l;
        c.m30 *= l;
        c.m01 *= k;
        c.m11 *= k;
        c.m21 *= k;
        c.m31 *= k;
        c.m02 *= f;
        c.m12 *= f;
        c.m22 *= f;
        c.m32 *= f
    }
    return c
}, toMat3:function (a) {
    if (a == null) {
        a = okA.mat3()
    }
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    return a
}, toMat43:function (a) {
    if (a == null) {
        a = okA.mat43()
    }
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m03 = this.m03;
    a.m13 = this.m13;
    a.m23 = this.m23;
    return a
}, toQuat:function (a) {
    if (a == null) {
        a = okA.quat()
    }
    var d = this.m00 + this.m11 + this.m22;
    if (d > 0) {
        var c = Math.sqrt(d + 1) * 2;
        a.s = 0.25 * c;
        a.x = (this.m21 - this.m12) / c;
        a.y = (this.m02 - this.m20) / c;
        a.z = (this.m10 - this.m01) / c
    } else {
        if ((this.m00 > this.m11) && (this.m00 > this.m22)) {
            var c = Math.sqrt(1 + this.m00 - this.m11 - this.m22) * 2;
            a.s = (this.m21 - this.m12) / c;
            a.x = 0.25 * c;
            a.y = (this.m01 + this.m10) / c;
            a.z = (this.m02 + this.m20) / c
        } else {
            if (this.m11 > this.m22) {
                var c = Math.sqrt(1 + this.m11 - this.m00 - this.m22) * 2;
                a.s = (this.m02 - this.m20) / c;
                a.x = (this.m01 + this.m10) / c;
                a.y = 0.25 * c;
                a.z = (this.m12 + this.m21) / c
            } else {
                var c = Math.sqrt(1 + this.m22 - this.m00 - this.m11) * 2;
                a.s = (this.m10 - this.m01) / c;
                a.x = (this.m02 + this.m20) / c;
                a.y = (this.m12 + this.m21) / c;
                a.z = 0.25 * c
            }
        }
    }
    return a
}, toArray:function (a) {
    if (a == null) {
        a = okA.array()
    }
    a.push(this.m00, this.m10, this.m20, this.m30, this.m01, this.m11, this.m21, this.m31, this.m02, this.m12, this.m22, this.m32, this.m03, this.m13, this.m23, this.m33);
    return a
}, __isMat4Complete:function () {
    if (this.m00 != null && this.m01 != null && this.m02 != null && this.m03 != null && this.m10 != null && this.m11 != null && this.m12 != null && this.m13 != null && this.m20 != null && this.m21 != null && this.m22 != null && this.m23 != null && this.m30 != null && this.m31 != null && this.m32 != null && this.m33 != null) {
        return true
    }
    return false
}};
function okMat4Add(d, c) {
    var a = okA.mat4();
    a.m00 = d.m00 + c.m00;
    a.m10 = d.m10 + c.m10;
    a.m20 = d.m20 + c.m20;
    a.m30 = d.m30 + c.m30;
    a.m01 = d.m01 + c.m01;
    a.m11 = d.m11 + c.m11;
    a.m21 = d.m21 + c.m21;
    a.m31 = d.m31 + c.m31;
    a.m02 = d.m02 + c.m02;
    a.m12 = d.m12 + c.m12;
    a.m22 = d.m22 + c.m22;
    a.m32 = d.m32 + c.m32;
    a.m03 = d.m03 + c.m03;
    a.m13 = d.m13 + c.m13;
    a.m23 = d.m23 + c.m23;
    a.m33 = d.m33 + c.m33;
    return a
}
function okMat4AddVal(c, d) {
    var a = okA.mat4();
    a.m00 = c.m00 + d;
    a.m10 = c.m10 + d;
    a.m20 = c.m20 + d;
    a.m30 = c.m30 + d;
    a.m01 = c.m01 + d;
    a.m11 = c.m11 + d;
    a.m21 = c.m21 + d;
    a.m31 = c.m31 + d;
    a.m02 = c.m02 + d;
    a.m12 = c.m12 + d;
    a.m22 = c.m22 + d;
    a.m32 = c.m32 + d;
    a.m03 = c.m03 + d;
    a.m13 = c.m13 + d;
    a.m23 = c.m23 + d;
    a.m33 = c.m33 + d;
    return a
}
function okValAddMat4(d, c) {
    var a = okA.mat4();
    a.m00 = c.m00 + d;
    a.m10 = c.m10 + d;
    a.m20 = c.m20 + d;
    a.m30 = c.m30 + d;
    a.m01 = c.m01 + d;
    a.m11 = c.m11 + d;
    a.m21 = c.m21 + d;
    a.m31 = c.m31 + d;
    a.m02 = c.m02 + d;
    a.m12 = c.m12 + d;
    a.m22 = c.m22 + d;
    a.m32 = c.m32 + d;
    a.m03 = c.m03 + d;
    a.m13 = c.m13 + d;
    a.m23 = c.m23 + d;
    a.m33 = c.m33 + d;
    return a
}
function okMat4Sub(d, c) {
    var a = okA.mat4();
    a.m00 = d.m00 - c.m00;
    a.m10 = d.m10 - c.m10;
    a.m20 = d.m20 - c.m20;
    a.m30 = d.m30 - c.m30;
    a.m01 = d.m01 - c.m01;
    a.m11 = d.m11 - c.m11;
    a.m21 = d.m21 - c.m21;
    a.m31 = d.m31 - c.m31;
    a.m02 = d.m02 - c.m02;
    a.m12 = d.m12 - c.m12;
    a.m22 = d.m22 - c.m22;
    a.m32 = d.m32 - c.m32;
    a.m03 = d.m03 - c.m03;
    a.m13 = d.m13 - c.m13;
    a.m23 = d.m23 - c.m23;
    a.m33 = d.m33 - c.m33;
    return a
}
function okMat4SubVal(c, d) {
    var a = okA.mat4();
    a.m00 = c.m00 - d;
    a.m10 = c.m10 - d;
    a.m20 = c.m20 - d;
    a.m30 = c.m30 - d;
    a.m01 = c.m01 - d;
    a.m11 = c.m11 - d;
    a.m21 = c.m21 - d;
    a.m31 = c.m31 - d;
    a.m02 = c.m02 - d;
    a.m12 = c.m12 - d;
    a.m22 = c.m22 - d;
    a.m32 = c.m32 - d;
    a.m03 = c.m03 - d;
    a.m13 = c.m13 - d;
    a.m23 = c.m23 - d;
    a.m33 = c.m33 - d;
    return a
}
function okValSubMat4(d, c) {
    var a = okA.mat4();
    a.m00 = d - c.m00;
    a.m10 = d - c.m10;
    a.m20 = d - c.m20;
    a.m30 = d - c.m30;
    a.m01 = d - c.m01;
    a.m11 = d - c.m11;
    a.m21 = d - c.m21;
    a.m31 = d - c.m31;
    a.m02 = d - c.m02;
    a.m12 = d - c.m12;
    a.m22 = d - c.m22;
    a.m32 = d - c.m32;
    a.m03 = d - c.m03;
    a.m13 = d - c.m13;
    a.m23 = d - c.m23;
    a.m33 = d - c.m33;
    return a
}
function okMat4Mul(d, c) {
    var a = okA.mat4();
    a.m00 = d.m00 * c.m00 + d.m01 * c.m10 + d.m02 * c.m20 + d.m03 * c.m30;
    a.m10 = d.m10 * c.m00 + d.m11 * c.m10 + d.m12 * c.m20 + d.m13 * c.m30;
    a.m20 = d.m20 * c.m00 + d.m21 * c.m10 + d.m22 * c.m20 + d.m23 * c.m30;
    a.m30 = d.m30 * c.m00 + d.m31 * c.m10 + d.m32 * c.m20 + d.m33 * c.m30;
    a.m01 = d.m00 * c.m01 + d.m01 * c.m11 + d.m02 * c.m21 + d.m03 * c.m31;
    a.m11 = d.m10 * c.m01 + d.m11 * c.m11 + d.m12 * c.m21 + d.m13 * c.m31;
    a.m21 = d.m20 * c.m01 + d.m21 * c.m11 + d.m22 * c.m21 + d.m23 * c.m31;
    a.m31 = d.m30 * c.m01 + d.m31 * c.m11 + d.m32 * c.m21 + d.m33 * c.m31;
    a.m02 = d.m00 * c.m02 + d.m01 * c.m12 + d.m02 * c.m22 + d.m03 * c.m32;
    a.m12 = d.m10 * c.m02 + d.m11 * c.m12 + d.m12 * c.m22 + d.m13 * c.m32;
    a.m22 = d.m20 * c.m02 + d.m21 * c.m12 + d.m22 * c.m22 + d.m23 * c.m32;
    a.m32 = d.m30 * c.m02 + d.m31 * c.m12 + d.m32 * c.m22 + d.m33 * c.m32;
    a.m03 = d.m00 * c.m03 + d.m01 * c.m13 + d.m02 * c.m23 + d.m03 * c.m33;
    a.m13 = d.m10 * c.m03 + d.m11 * c.m13 + d.m12 * c.m23 + d.m13 * c.m33;
    a.m23 = d.m20 * c.m03 + d.m21 * c.m13 + d.m22 * c.m23 + d.m23 * c.m33;
    a.m33 = d.m30 * c.m03 + d.m31 * c.m13 + d.m32 * c.m23 + d.m33 * c.m33;
    return a
}
function okMat4MulVal(c, d) {
    var a = okA.mat4();
    a.m00 = c.m00 * d;
    a.m10 = c.m10 * d;
    a.m20 = c.m20 * d;
    a.m30 = c.m30 * d;
    a.m01 = c.m01 * d;
    a.m11 = c.m11 * d;
    a.m21 = c.m21 * d;
    a.m31 = c.m31 * d;
    a.m02 = c.m02 * d;
    a.m12 = c.m12 * d;
    a.m22 = c.m22 * d;
    a.m32 = c.m32 * d;
    a.m03 = c.m03 * d;
    a.m13 = c.m13 * d;
    a.m23 = c.m23 * d;
    a.m33 = c.m33 * d;
    return a
}
function okValMulMat4(d, c) {
    var a = okA.mat4();
    a.m00 = c.m00 * d;
    a.m10 = c.m10 * d;
    a.m20 = c.m20 * d;
    a.m30 = c.m30 * d;
    a.m01 = c.m01 * d;
    a.m11 = c.m11 * d;
    a.m21 = c.m21 * d;
    a.m31 = c.m31 * d;
    a.m02 = c.m02 * d;
    a.m12 = c.m12 * d;
    a.m22 = c.m22 * d;
    a.m32 = c.m32 * d;
    a.m03 = c.m03 * d;
    a.m13 = c.m13 * d;
    a.m23 = c.m23 * d;
    a.m33 = c.m33 * d;
    return a
}
function okMat4MulVec4(c, a) {
    var d = okA.vec4();
    d.x = c.m00 * a.x + c.m01 * a.y + c.m02 * a.z + c.m03 * a.w;
    d.y = c.m10 * a.x + c.m11 * a.y + c.m12 * a.z + c.m13 * a.w;
    d.z = c.m20 * a.x + c.m21 * a.y + c.m22 * a.z + c.m23 * a.w;
    d.w = c.m30 * a.x + c.m31 * a.y + c.m32 * a.z + c.m33 * a.w;
    return d
}
function okMat4MulVec3(d, c) {
    var a = okA.vec4();
    a.x = d.m00 * c.x + d.m01 * c.y + d.m02 * c.z + d.m03;
    a.y = d.m10 * c.x + d.m11 * c.y + d.m12 * c.z + d.m13;
    a.z = d.m20 * c.x + d.m21 * c.y + d.m22 * c.z + d.m23;
    a.w = d.m30 * c.x + d.m31 * c.y + d.m32 * c.z + d.m33;
    var e = 1 / a.w;
    var f = okA.vec3();
    f.x = a.x * e;
    f.y = a.y * e;
    f.z = a.z * e;
    return f
}
function okMat4Lerp(d, c, e) {
    var a = okA.mat4();
    a.m00 = d.m00 * (1 - e) + c.m00 * e;
    a.m10 = d.m10 * (1 - e) + c.m10 * e;
    a.m20 = d.m20 * (1 - e) + c.m20 * e;
    a.m30 = d.m30 * (1 - e) + c.m30 * e;
    a.m01 = d.m01 * (1 - e) + c.m01 * e;
    a.m11 = d.m11 * (1 - e) + c.m11 * e;
    a.m21 = d.m21 * (1 - e) + c.m21 * e;
    a.m31 = d.m31 * (1 - e) + c.m31 * e;
    a.m02 = d.m02 * (1 - e) + c.m02 * e;
    a.m12 = d.m12 * (1 - e) + c.m12 * e;
    a.m22 = d.m22 * (1 - e) + c.m22 * e;
    a.m32 = d.m32 * (1 - e) + c.m32 * e;
    a.m03 = d.m03 * (1 - e) + c.m03 * e;
    a.m13 = d.m13 * (1 - e) + c.m13 * e;
    a.m23 = d.m23 * (1 - e) + c.m23 * e;
    a.m33 = d.m33 * (1 - e) + c.m33 * e;
    return a
}
function okMat4Trans(f, e, d) {
    var c = okA.vec3();
    if (e != null) {
        c.x = f;
        c.y = e;
        c.z = d
    } else {
        c.x = f.x;
        c.y = f.y;
        c.z = f.z
    }
    var a = okA.mat4();
    a.setColumn(3, c.x, c.y, c.z, 1);
    okA._vec3(c);
    return a
}
function okMat4Scale(e, d, c) {
    var f = okA.vec3();
    if (d != null) {
        f.x = e;
        f.y = d;
        f.z = c
    } else {
        f.x = e.x;
        f.y = e.y;
        f.z = e.z
    }
    var a = okA.mat4();
    a.m00 = f.x;
    a.m11 = f.y;
    a.m22 = f.z;
    okA._vec3(f);
    return a
}
function okMat4Rot(l, o, n, m) {
    var h = okA.vec3();
    if (n != null) {
        h.x = o;
        h.y = n;
        h.z = m
    } else {
        h.x = o.x;
        h.y = o.y;
        h.z = o.z
    }
    var k = h.normalize();
    okA._vec3(h);
    var d = l * Math.PI / 180;
    var e = Math.cos(d * 0.5);
    var c = Math.sin(d * 0.5);
    var a = new okQuat();
    a.s = e;
    a.x = c * k.x;
    a.y = c * k.y;
    a.z = c * k.z;
    okA._vec3(k);
    var f = okA.mat4();
    a.toMat4(f);
    return f
}
function okMat4RotX(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat4();
    c.m11 = a;
    c.m12 = -d;
    c.m21 = d;
    c.m22 = a;
    return c
}
function okMat4RotY(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat4();
    c.m00 = a;
    c.m02 = d;
    c.m20 = -d;
    c.m22 = a;
    return c
}
function okMat4RotZ(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat4();
    c.m00 = a;
    c.m01 = -d;
    c.m10 = d;
    c.m11 = a;
    return c
}
function okMat4Proj(c, l, h, k) {
    var f = c * Math.PI / 360;
    var a = k - h;
    var e = 1 / Math.tan(f);
    var d = okA.mat4();
    d.m00 = e / l;
    d.m11 = e;
    d.m22 = -(k + h) / a;
    d.m32 = -1;
    d.m23 = -2 * h * k / a;
    d.m33 = 0;
    return d
}
function okMat4Ortho(a, h, e, d, f, k) {
    var c = okA.mat4();
    c.m00 = 2 / (h - a);
    c.m11 = 2 / (e - d);
    c.m22 = -2 / (k - f);
    c.m03 = -(h + a) / (h - a);
    c.m13 = -(e + d) / (e - d);
    c.m23 = -(k + f) / (k - f);
    return c
}
function okMat4LookAt(k, c, f) {
    var d = okA.vec3();
    d.x = k.x - c.x;
    d.y = k.y - c.y;
    d.z = k.z - c.z;
    d.normalize(true);
    var e = f.normalize();
    var h = okVec3Cross(e, d);
    var a = okA.mat4();
    a.m00 = h.x;
    a.m10 = h.y;
    a.m20 = h.z;
    a.m01 = e.x;
    a.m11 = e.y;
    a.m21 = e.z;
    a.m02 = d.x;
    a.m12 = d.y;
    a.m22 = d.z;
    a.m03 = k.x;
    a.m13 = k.y;
    a.m23 = k.z;
    a.inverse(true);
    okA._vec3(h);
    okA._vec3(e);
    okA._vec3(d);
    return a
}
function okMat43(a) {
    this.m00 = ((a != null) ? a : 1);
    this.m10 = 0;
    this.m20 = 0;
    this.m01 = 0;
    this.m11 = ((a != null) ? a : 1);
    this.m21 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = ((a != null) ? a : 1);
    this.m03 = 0;
    this.m13 = 0;
    this.m23 = 0
}
okMat43.prototype = {set:function (a) {
    this.m00 = a[0];
    this.m10 = a[1];
    this.m20 = a[2];
    this.m01 = a[3];
    this.m11 = a[4];
    this.m21 = a[5];
    this.m02 = a[6];
    this.m12 = a[7];
    this.m22 = a[8];
    this.m03 = a[9];
    this.m13 = a[10];
    this.m23 = a[11]
}, identity:function () {
    this.m00 = 1;
    this.m10 = 0;
    this.m20 = 0;
    this.m01 = 0;
    this.m11 = 1;
    this.m21 = 0;
    this.m02 = 0;
    this.m12 = 0;
    this.m22 = 1;
    this.m03 = 0;
    this.m13 = 0;
    this.m23 = 0
}, clone:function (a) {
    var a = (a ? a : okA.mat43());
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m03 = this.m03;
    a.m13 = this.m13;
    a.m23 = this.m23;
    return a
}, equal:function (a) {
    return okFloatEqual(this.m00, a.m00) && okFloatEqual(this.m10, a.m10) && okFloatEqual(this.m20, a.m20) && okFloatEqual(this.m01, a.m01) && okFloatEqual(this.m11, a.m11) && okFloatEqual(this.m21, a.m21) && okFloatEqual(this.m02, a.m02) && okFloatEqual(this.m12, a.m12) && okFloatEqual(this.m22, a.m22) && okFloatEqual(this.m03, a.m03) && okFloatEqual(this.m13, a.m13) && okFloatEqual(this.m23, a.m23)
}, setColumn:function (d, c, a, e) {
    if (d == 0) {
        if (okIsNumber(c)) {
            this.m00 = c;
            this.m10 = a;
            this.m20 = e
        } else {
            this.m00 = c.x;
            this.m10 = c.y;
            this.m20 = c.z
        }
    } else {
        if (d == 1) {
            if (okIsNumber(c)) {
                this.m01 = c;
                this.m11 = a;
                this.m21 = e
            } else {
                this.m01 = c.x;
                this.m11 = c.y;
                this.m21 = c.z
            }
        } else {
            if (d == 2) {
                if (okIsNumber(c)) {
                    this.m02 = c;
                    this.m12 = a;
                    this.m22 = e
                } else {
                    this.m02 = c.x;
                    this.m12 = c.y;
                    this.m22 = c.z
                }
            } else {
                if (d == 3) {
                    if (okIsNumber(c)) {
                        this.m03 = c;
                        this.m13 = a;
                        this.m23 = e
                    } else {
                        this.m03 = c.x;
                        this.m13 = c.y;
                        this.m23 = c.z
                    }
                }
            }
        }
    }
}, getColumn:function (c) {
    var a = okA.vec3();
    if (c == 0) {
        a.set(this.m00, this.m10, this.m20)
    } else {
        if (c == 1) {
            a.set(this.m01, this.m11, this.m21)
        } else {
            if (c == 2) {
                a.set(this.m02, this.m12, this.m22)
            } else {
                if (c == 3) {
                    a.set(this.m03, this.m13, this.m23)
                }
            }
        }
    }
    return a
}, det:function () {
    var q = this.m00, p = this.m01, o = this.m02, n = this.m03;
    var m = this.m10, k = this.m11, h = this.m12, f = this.m13;
    var e = this.m20, d = this.m21, c = this.m22, a = this.m23;
    var l = q * k * c + p * h * e + o * m * d - q * h * d - p * m * c - o * k * e;
    return l
}, inverse:function (p) {
    var t = this.m00, s = this.m01, q = this.m02, o = this.m03;
    var m = this.m10, l = this.m11, k = this.m12, h = this.m13;
    var f = this.m20, e = this.m21, d = this.m22, c = this.m23;
    var a = (p ? this : okA.mat43());
    a.m00 = l * d - k * e;
    a.m01 = q * e - s * d;
    a.m02 = s * k - q * l;
    a.m03 = s * h * d + q * l * c + o * k * e - s * k * c - q * h * e - o * l * d;
    a.m10 = k * f - m * d;
    a.m11 = t * d - q * f;
    a.m12 = q * m - t * k;
    a.m13 = t * k * c + q * h * f + o * m * d - t * h * d - q * m * c - o * k * f;
    a.m20 = m * e - l * f;
    a.m21 = s * f - t * e;
    a.m22 = t * l - s * m;
    a.m23 = t * h * e + s * m * c + o * l * f - t * l * c - s * h * f - o * m * e;
    var u = t * l * d + s * k * f + q * m * e - t * k * e - s * m * d - q * l * f;
    var n = 1 / u;
    a.m00 *= n;
    a.m01 *= n;
    a.m02 *= n;
    a.m03 *= n;
    a.m10 *= n;
    a.m11 *= n;
    a.m12 *= n;
    a.m13 *= n;
    a.m20 *= n;
    a.m21 *= n;
    a.m22 *= n;
    a.m23 *= n;
    return a
}, transpose:function (l) {
    var e = (l ? this : okA.mat43());
    var o = this.m00, n = this.m01, m = this.m02;
    var k = this.m10, h = this.m11, f = this.m12;
    var d = this.m20, c = this.m21, a = this.m22;
    e.m00 = o;
    e.m10 = n;
    e.m20 = m;
    e.m01 = k;
    e.m11 = h;
    e.m21 = f;
    e.m02 = d;
    e.m12 = c;
    e.m22 = a;
    e.m03 = 0;
    e.m13 = 0;
    e.m23 = 0;
    return e
}, translate:function (h, f, e, c, d) {
    if (f.x) {
        d = e;
        c = f.z;
        e = f.y;
        f = f.x
    } else {
        if (c == null) {
            d = e;
            c = f;
            e = f
        }
    }
    var a = this;
    if (d) {
        a = this.clone()
    }
    if (h == 3) {
        a.m03 += f;
        a.m13 += e;
        a.m23 += c
    } else {
        a.m03 += this.m00 * f + this.m01 * e + this.m02 * c;
        a.m13 += this.m10 * f + this.m11 * e + this.m12 * c;
        a.m23 += this.m20 * f + this.m21 * e + this.m22 * c
    }
    return a
}, rot:function (F, c, A, z, y, f) {
    var u = okA.vec3();
    if (y != null) {
        u.x = A;
        u.y = z;
        u.z = y
    } else {
        u.x = A.x;
        u.y = A.y;
        u.z = A.z;
        f = z
    }
    u.normalize(true);
    var k = c * Math.PI / 180;
    var w = Math.cos(k * 0.5);
    var x = Math.sin(k * 0.5);
    var s = okA.quat();
    s.s = w;
    s.x = x * u.x;
    s.y = x * u.y;
    s.z = x * u.z;
    okA._vec3(u);
    var v = okA.mat4();
    s.toMat4(v);
    var t = this.m00;
    var E = this.m10;
    var h = this.m20;
    var p = this.m01;
    var D = this.m11;
    var e = this.m21;
    var o = this.m02;
    var C = this.m12;
    var d = this.m22;
    var n = this.m03;
    var B = this.m13;
    var a = this.m23;
    var l = (f ? this : okA.mat43());
    if (F == 3) {
        l.m00 = v.m00 * t + v.m01 * E + v.m02 * h;
        l.m10 = v.m10 * t + v.m11 * E + v.m12 * h;
        l.m20 = v.m20 * t + v.m21 * E + v.m22 * h;
        l.m01 = v.m00 * p + v.m01 * D + v.m02 * e;
        l.m11 = v.m10 * p + v.m11 * D + v.m12 * e;
        l.m21 = v.m20 * p + v.m21 * D + v.m22 * e;
        l.m02 = v.m00 * o + v.m01 * C + v.m02 * d;
        l.m12 = v.m10 * o + v.m11 * C + v.m12 * d;
        l.m22 = v.m20 * o + v.m21 * C + v.m22 * d;
        l.m03 = v.m00 * n + v.m01 * B + v.m02 * a + v.m03;
        l.m13 = v.m10 * n + v.m11 * B + v.m12 * a + v.m13;
        l.m23 = v.m20 * n + v.m21 * B + v.m22 * a + v.m23
    } else {
        l.m00 = t * v.m00 + p * v.m10 + o * v.m20;
        l.m10 = E * v.m00 + D * v.m10 + C * v.m20;
        l.m20 = h * v.m00 + e * v.m10 + d * v.m20;
        l.m01 = t * v.m01 + p * v.m11 + o * v.m21;
        l.m11 = E * v.m01 + D * v.m11 + C * v.m21;
        l.m21 = h * v.m01 + e * v.m11 + d * v.m21;
        l.m02 = t * v.m02 + p * v.m12 + o * v.m22;
        l.m12 = E * v.m02 + D * v.m12 + C * v.m22;
        l.m22 = h * v.m02 + e * v.m12 + d * v.m22;
        l.m03 = t * v.m03 + p * v.m13 + o * v.m23 + n;
        l.m13 = E * v.m03 + D * v.m13 + C * v.m23 + B;
        l.m23 = h * v.m03 + e * v.m13 + d * v.m23 + a
    }
    okA._mat4(v);
    okA._quat(s);
    return l
}, rotX:function (B, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), v = Math.sin(l);
    var u = this.m00;
    var A = this.m10;
    var h = this.m20;
    var t = this.m01;
    var z = this.m11;
    var e = this.m21;
    var q = this.m02;
    var y = this.m12;
    var d = this.m22;
    var o = this.m03;
    var w = this.m13;
    var a = this.m23;
    var m = (f ? this : this.clone());
    if (B == 3) {
        m.m10 = k * A - v * h;
        m.m20 = v * A + k * h;
        m.m11 = k * z - v * e;
        m.m21 = v * z + k * e;
        m.m12 = k * y - v * d;
        m.m22 = v * y + k * d;
        m.m03 = o;
        m.m13 = k * w - v * a;
        m.m23 = v * w + k * a
    } else {
        var s = u * u + A * A + h * h;
        var p = t * t + z * z + e * e;
        var n = q * q + y * y + d * d;
        var x = (s != 1 || p != 1 || n != 1);
        if (x) {
            s = Math.sqrt(s);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= s;
            m.m10 /= s;
            m.m20 /= s;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m01 = t * k + q * v;
        m.m11 = z * k + y * v;
        m.m21 = e * k + d * v;
        m.m02 = t * -v + q * k;
        m.m12 = z * -v + y * k;
        m.m22 = e * -v + d * k;
        if (x) {
            s = s / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= s;
            m.m10 *= s;
            m.m20 *= s;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, rotY:function (B, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), v = Math.sin(l);
    var u = this.m00;
    var A = this.m10;
    var h = this.m20;
    var t = this.m01;
    var z = this.m11;
    var e = this.m21;
    var q = this.m02;
    var y = this.m12;
    var d = this.m22;
    var o = this.m03;
    var w = this.m13;
    var a = this.m23;
    var m = (f ? this : this.clone());
    if (B == 3) {
        m.m00 = k * u + v * h;
        m.m20 = -v * u + k * h;
        m.m01 = k * t + v * e;
        m.m21 = -v * t + k * e;
        m.m02 = k * q + v * d;
        m.m22 = -v * q + k * d;
        m.m03 = k * o + v * a;
        m.m23 = -v * o + k * a
    } else {
        var s = u * u + A * A + h * h;
        var p = t * t + z * z + e * e;
        var n = q * q + y * y + d * d;
        var x = (s != 1 || p != 1 || n != 1);
        if (x) {
            s = Math.sqrt(s);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= s;
            m.m10 /= s;
            m.m20 /= s;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m00 = u * k + q * -v;
        m.m10 = A * k + y * -v;
        m.m20 = h * k + d * -v;
        m.m02 = u * v + q * k;
        m.m12 = A * v + y * k;
        m.m22 = h * v + d * k;
        if (x) {
            s = s / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= s;
            m.m10 *= s;
            m.m20 *= s;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, rotZ:function (B, c, f) {
    var l = c * Math.PI / 180;
    var k = Math.cos(l), v = Math.sin(l);
    var u = this.m00;
    var A = this.m10;
    var h = this.m20;
    var t = this.m01;
    var z = this.m11;
    var e = this.m21;
    var q = this.m02;
    var y = this.m12;
    var d = this.m22;
    var o = this.m03;
    var w = this.m13;
    var a = this.m23;
    var m = (f ? this : this.clone());
    if (B == 3) {
        m.m00 = k * u + -v * A;
        m.m10 = v * u + k * A;
        m.m01 = k * t + -v * z;
        m.m11 = v * t + k * z;
        m.m02 = k * q + -v * y;
        m.m12 = v * q + k * y;
        m.m03 = k * o + -v * w;
        m.m13 = v * o + k * w
    } else {
        var s = u * u + A * A + h * h;
        var p = t * t + z * z + e * e;
        var n = q * q + y * y + d * d;
        var x = (s != 1 || p != 1 || n != 1);
        if (x) {
            s = Math.sqrt(s);
            p = Math.sqrt(p);
            n = Math.sqrt(n);
            m.m00 /= s;
            m.m10 /= s;
            m.m20 /= s;
            m.m01 /= p;
            m.m11 /= p;
            m.m21 /= p;
            m.m02 /= n;
            m.m12 /= n;
            m.m22 /= n
        }
        m.m00 = u * k + t * v;
        m.m10 = A * k + z * v;
        m.m20 = h * k + e * v;
        m.m01 = u * -v + t * k;
        m.m11 = A * -v + z * k;
        m.m21 = h * -v + e * k;
        if (x) {
            s = s / Math.sqrt(m.m00 * m.m00 + m.m10 * m.m10 + m.m20 * m.m20);
            p = p / Math.sqrt(m.m01 * m.m01 + m.m11 * m.m11 + m.m21 * m.m21);
            n = n / Math.sqrt(m.m02 * m.m02 + m.m12 * m.m12 + m.m22 * m.m22);
            m.m00 *= s;
            m.m10 *= s;
            m.m20 *= s;
            m.m01 *= p;
            m.m11 *= p;
            m.m21 *= p;
            m.m02 *= n;
            m.m12 *= n;
            m.m22 *= n
        }
    }
    return m
}, scale:function (a, h, e, d, m) {
    var l, k, f;
    if (e) {
        l = h;
        k = e;
        f = d
    } else {
        if (h.x) {
            l = h.x;
            e = h.y;
            d = h.z;
            m = e
        } else {
            l = h;
            e = h;
            d = h;
            m = e
        }
    }
    var c = (m ? this : this.clone());
    if (a == 3) {
        c.m00 *= l;
        c.m10 *= k;
        c.m20 *= f;
        c.m01 *= l;
        c.m11 *= k;
        c.m21 *= f;
        c.m02 *= l;
        c.m12 *= k;
        c.m22 *= f;
        c.m03 *= l;
        c.m13 *= k;
        c.m23 *= f
    } else {
        c.m00 *= l;
        c.m10 *= l;
        c.m20 *= l;
        c.m01 *= k;
        c.m11 *= k;
        c.m21 *= k;
        c.m02 *= f;
        c.m12 *= f;
        c.m22 *= f
    }
    return c
}, toMat3:function (a) {
    if (a == null) {
        a = okA.mat3()
    }
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m30 = 0;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m31 = 0;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m32 = 0;
    return a
}, toMat4:function (a) {
    if (a == null) {
        a = okA.mat4()
    }
    a.m00 = this.m00;
    a.m10 = this.m10;
    a.m20 = this.m20;
    a.m30 = 0;
    a.m01 = this.m01;
    a.m11 = this.m11;
    a.m21 = this.m21;
    a.m31 = 0;
    a.m02 = this.m02;
    a.m12 = this.m12;
    a.m22 = this.m22;
    a.m32 = 0;
    a.m03 = this.m03;
    a.m13 = this.m13;
    a.m23 = this.m23;
    a.m33 = 1;
    return a
}, toQuat:function (a) {
    if (a == null) {
        a = okA.quat()
    }
    var d = this.m00 + this.m11 + this.m22;
    if (d > 0) {
        var c = Math.sqrt(d + 1) * 2;
        a.s = 0.25 * c;
        a.x = (this.m21 - this.m12) / c;
        a.y = (this.m02 - this.m20) / c;
        a.z = (this.m10 - this.m01) / c
    } else {
        if ((this.m00 > this.m11) && (this.m00 > this.m22)) {
            var c = Math.sqrt(1 + this.m00 - this.m11 - this.m22) * 2;
            a.s = (this.m21 - this.m12) / c;
            a.x = 0.25 * c;
            a.y = (this.m01 + this.m10) / c;
            a.z = (this.m02 + this.m20) / c
        } else {
            if (this.m11 > this.m22) {
                var c = Math.sqrt(1 + this.m11 - this.m00 - this.m22) * 2;
                a.s = (this.m02 - this.m20) / c;
                a.x = (this.m01 + this.m10) / c;
                a.y = 0.25 * c;
                a.z = (this.m12 + this.m21) / c
            } else {
                var c = Math.sqrt(1 + this.m22 - this.m00 - this.m11) * 2;
                a.s = (this.m10 - this.m01) / c;
                a.x = (this.m02 + this.m20) / c;
                a.y = (this.m12 + this.m21) / c;
                a.z = 0.25 * c
            }
        }
    }
    return a
}, toArray:function (a) {
    if (a == null) {
        a = okA.array()
    }
    a.push(this.m00, this.m10, this.m20, this.m01, this.m11, this.m21, this.m02, this.m12, this.m22, this.m03, this.m13, this.m23);
    return a
}, __isMat43Complete:function () {
    if (this.m00 != null && this.m01 != null && this.m02 != null && this.m03 != null && this.m10 != null && this.m11 != null && this.m12 != null && this.m13 != null && this.m20 != null && this.m21 != null && this.m22 != null && this.m23 != null) {
        return true
    }
    return false
}};
function okMat43Add(d, c) {
    var a = okA.mat43();
    a.m00 = d.m00 + c.m00;
    a.m10 = d.m10 + c.m10;
    a.m20 = d.m20 + c.m20;
    a.m01 = d.m01 + c.m01;
    a.m11 = d.m11 + c.m11;
    a.m21 = d.m21 + c.m21;
    a.m02 = d.m02 + c.m02;
    a.m12 = d.m12 + c.m12;
    a.m22 = d.m22 + c.m22;
    a.m03 = d.m03 + c.m03;
    a.m13 = d.m13 + c.m13;
    a.m23 = d.m23 + c.m23;
    return a
}
function okMat43AddVal(c, d) {
    var a = okA.mat43();
    a.m00 = c.m00 + d;
    a.m10 = c.m10 + d;
    a.m20 = c.m20 + d;
    a.m01 = c.m01 + d;
    a.m11 = c.m11 + d;
    a.m21 = c.m21 + d;
    a.m02 = c.m02 + d;
    a.m12 = c.m12 + d;
    a.m22 = c.m22 + d;
    a.m03 = c.m03 + d;
    a.m13 = c.m13 + d;
    a.m23 = c.m23 + d;
    return a
}
function okValAddMat43(d, c) {
    var a = okA.mat43();
    a.m00 = c.m00 + d;
    a.m10 = c.m10 + d;
    a.m20 = c.m20 + d;
    a.m01 = c.m01 + d;
    a.m11 = c.m11 + d;
    a.m21 = c.m21 + d;
    a.m02 = c.m02 + d;
    a.m12 = c.m12 + d;
    a.m22 = c.m22 + d;
    a.m03 = c.m03 + d;
    a.m13 = c.m13 + d;
    a.m23 = c.m23 + d;
    return a
}
function okMat43Sub(d, c) {
    var a = okA.mat43();
    a.m00 = d.m00 - c.m00;
    a.m10 = d.m10 - c.m10;
    a.m20 = d.m20 - c.m20;
    a.m01 = d.m01 - c.m01;
    a.m11 = d.m11 - c.m11;
    a.m21 = d.m21 - c.m21;
    a.m02 = d.m02 - c.m02;
    a.m12 = d.m12 - c.m12;
    a.m22 = d.m22 - c.m22;
    a.m03 = d.m03 - c.m03;
    a.m13 = d.m13 - c.m13;
    a.m23 = d.m23 - c.m23;
    return a
}
function okMat43SubVal(c, d) {
    var a = okA.mat43();
    a.m00 = c.m00 - d;
    a.m10 = c.m10 - d;
    a.m20 = c.m20 - d;
    a.m01 = c.m01 - d;
    a.m11 = c.m11 - d;
    a.m21 = c.m21 - d;
    a.m02 = c.m02 - d;
    a.m12 = c.m12 - d;
    a.m22 = c.m22 - d;
    a.m03 = c.m03 - d;
    a.m13 = c.m13 - d;
    a.m23 = c.m23 - d;
    return a
}
function okValSubMat43(d, c) {
    var a = okA.mat43();
    a.m00 = d - c.m00;
    a.m10 = d - c.m10;
    a.m20 = d - c.m20;
    a.m01 = d - c.m01;
    a.m11 = d - c.m11;
    a.m21 = d - c.m21;
    a.m02 = d - c.m02;
    a.m12 = d - c.m12;
    a.m22 = d - c.m22;
    a.m03 = d - c.m03;
    a.m13 = d - c.m13;
    a.m23 = d - c.m23;
    return a
}
function okMat43Mul(d, c) {
    var a = okA.mat43();
    a.m00 = d.m00 * c.m00 + d.m01 * c.m10 + d.m02 * c.m20;
    a.m10 = d.m10 * c.m00 + d.m11 * c.m10 + d.m12 * c.m20;
    a.m20 = d.m20 * c.m00 + d.m21 * c.m10 + d.m22 * c.m20;
    a.m01 = d.m00 * c.m01 + d.m01 * c.m11 + d.m02 * c.m21;
    a.m11 = d.m10 * c.m01 + d.m11 * c.m11 + d.m12 * c.m21;
    a.m21 = d.m20 * c.m01 + d.m21 * c.m11 + d.m22 * c.m21;
    a.m02 = d.m00 * c.m02 + d.m01 * c.m12 + d.m02 * c.m22;
    a.m12 = d.m10 * c.m02 + d.m11 * c.m12 + d.m12 * c.m22;
    a.m22 = d.m20 * c.m02 + d.m21 * c.m12 + d.m22 * c.m22;
    a.m03 = d.m00 * c.m03 + d.m01 * c.m13 + d.m02 * c.m23 + d.m03;
    a.m13 = d.m10 * c.m03 + d.m11 * c.m13 + d.m12 * c.m23 + d.m13;
    a.m23 = d.m20 * c.m03 + d.m21 * c.m13 + d.m22 * c.m23 + d.m23;
    return a
}
function okMat43MulVal(c, d) {
    var a = okA.mat43();
    a.m00 = c.m00 * d;
    a.m10 = c.m10 * d;
    a.m20 = c.m20 * d;
    a.m01 = c.m01 * d;
    a.m11 = c.m11 * d;
    a.m21 = c.m21 * d;
    a.m02 = c.m02 * d;
    a.m12 = c.m12 * d;
    a.m22 = c.m22 * d;
    a.m03 = c.m03 * d;
    a.m13 = c.m13 * d;
    a.m23 = c.m23 * d;
    return a
}
function okValMulMat43(d, c) {
    var a = okA.mat43();
    a.m00 = c.m00 * d;
    a.m10 = c.m10 * d;
    a.m20 = c.m20 * d;
    a.m01 = c.m01 * d;
    a.m11 = c.m11 * d;
    a.m21 = c.m21 * d;
    a.m02 = c.m02 * d;
    a.m12 = c.m12 * d;
    a.m22 = c.m22 * d;
    a.m03 = c.m03 * d;
    a.m13 = c.m13 * d;
    a.m23 = c.m23 * d;
    return a
}
function okMat43MulVec3(c, a) {
    var d = okA.vec3();
    d.x = c.m00 * a.x + c.m01 * a.y + c.m02 * a.z + c.m03;
    d.y = c.m10 * a.x + c.m11 * a.y + c.m12 * a.z + c.m13;
    d.z = c.m20 * a.x + c.m21 * a.y + c.m22 * a.z + c.m23;
    return d
}
function okMat43Lerp(d, c, e) {
    var a = okA.mat43();
    a.m00 = d.m00 * (1 - e) + c.m00 * e;
    a.m10 = d.m10 * (1 - e) + c.m10 * e;
    a.m20 = d.m20 * (1 - e) + c.m20 * e;
    a.m01 = d.m01 * (1 - e) + c.m01 * e;
    a.m11 = d.m11 * (1 - e) + c.m11 * e;
    a.m21 = d.m21 * (1 - e) + c.m21 * e;
    a.m02 = d.m02 * (1 - e) + c.m02 * e;
    a.m12 = d.m12 * (1 - e) + c.m12 * e;
    a.m22 = d.m22 * (1 - e) + c.m22 * e;
    a.m03 = d.m03 * (1 - e) + c.m03 * e;
    a.m13 = d.m13 * (1 - e) + c.m13 * e;
    a.m23 = d.m23 * (1 - e) + c.m23 * e;
    return a
}
function okMat43Trans(f, e, d) {
    var c = okA.vec3();
    if (e != null) {
        c.x = f;
        c.y = e;
        c.z = d
    } else {
        c.x = f.x;
        c.y = f.y;
        c.z = f.z
    }
    var a = okA.mat43();
    a.setColumn(3, c.x, c.y, c.z);
    okA._vec3(c);
    return a
}
function okMat43Scale(e, d, c) {
    var f = okA.vec3();
    if (d != null) {
        f.x = e;
        f.y = d;
        f.z = c
    } else {
        f.x = e.x;
        f.y = e.y;
        f.z = e.z
    }
    var a = okA.mat43();
    a.m00 = f.x;
    a.m11 = f.y;
    a.m22 = f.z;
    okA._vec3(f);
    return a
}
function okMat43RotX(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat43();
    c.m11 = a;
    c.m12 = -d;
    c.m21 = d;
    c.m22 = a;
    return c
}
function okMat43RotY(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat43();
    c.m00 = a;
    c.m02 = d;
    c.m20 = -d;
    c.m22 = a;
    return c
}
function okMat43RotZ(e) {
    var f = e * Math.PI / 180;
    var a = Math.cos(f), d = Math.sin(f);
    var c = okA.mat43();
    c.m00 = a;
    c.m01 = -d;
    c.m10 = d;
    c.m11 = a;
    return c
}
function okMat43Rot(l, o, n, m) {
    var d = l * Math.PI / 180;
    var h = okA.vec3();
    if (n != null) {
        h.x = o;
        h.y = n;
        h.z = m
    } else {
        h.x = o.x;
        h.y = o.y;
        h.z = o.z
    }
    var k = h.normalize();
    okA._vec3(h);
    var e = Math.cos(d * 0.5);
    var c = Math.sin(d * 0.5);
    var a = new okQuat();
    a.s = e;
    a.x = c * k.x;
    a.y = c * k.y;
    a.z = c * k.z;
    okA._vec3(k);
    var f = okA.mat43();
    a.toMat43(f);
    return f
}
function okMat43LookAt(k, c, f) {
    var d = okA.vec3();
    d.x = k.x - c.x;
    d.y = k.y - c.y;
    d.z = k.z - c.z;
    d.normalize(true);
    var e = f.normalize();
    var h = okVec3Cross(e, d);
    var a = okA.mat43();
    a.m00 = h.x;
    a.m10 = h.y;
    a.m20 = h.z;
    a.m01 = e.x;
    a.m11 = e.y;
    a.m21 = e.z;
    a.m02 = d.x;
    a.m12 = d.y;
    a.m22 = d.z;
    a.m03 = k.x;
    a.m13 = k.y;
    a.m23 = k.z;
    a.inverse(true);
    okA._vec3(h);
    okA._vec3(e);
    okA._vec3(d);
    return a
}
function okQuat(e, d, c, a) {
    this.s = ((e != null) ? e : 1);
    this.x = ((d != null) ? d : 0);
    this.y = ((c != null) ? c : 0);
    this.z = ((a != null) ? a : 0)
}
okQuat.prototype = {set:function (e, d, c, a) {
    this.s = e;
    this.x = d;
    this.y = c;
    this.z = a
}, clone:function (a) {
    var a = (a ? a : okA.quat());
    a.s = this.s;
    a.x = this.x;
    a.y = this.y;
    a.z = this.z;
    return a
}, equal:function (a) {
    return this.s == a.s && this.x == a.x && this.y == a.y && this.z == a.z
}, getImVec3:function () {
    var a = okA.vec3();
    a.x = this.x;
    a.y = this.y;
    a.z = this.z;
    return a
}, len:function () {
    return Math.sqrt(this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z)
}, lenSquare:function () {
    return this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z
}, normalize:function (d) {
    if (d) {
        var c = 1 / Math.sqrt(this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z);
        this.s *= c;
        this.x *= c;
        this.y *= c;
        this.z *= c
    } else {
        var a = okA.quat();
        var c = 1 / Math.sqrt(this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z);
        a.s = this.s * c;
        a.x = this.x * c;
        a.y = this.y * c;
        a.z = this.z * c;
        return a
    }
}, conjugate:function (c) {
    var a = c ? this : okA.quat();
    a.set(this.s, -this.x, -this.y, -this.z);
    return a
}, inverse:function (e) {
    var d = this.conjugate();
    var a = 1 / (this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z);
    var c = e ? this : okA.quat();
    c.set(d.s * a, d.x * a, d.y * a, d.z * a);
    okA._quat(d);
    return c
}, toMat3:function (a) {
    var c = 2 / Math.sqrt(this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z);
    if (a == null) {
        a = okA.mat3()
    }
    a.m00 = 1 - c * (this.y * this.y + this.z * this.z);
    a.m10 = c * this.x * this.y + c * this.s * this.z;
    a.m20 = -c * this.s * this.y + c * this.x * this.z;
    a.m01 = c * this.x * this.y - c * this.s * this.z;
    a.m11 = 1 - c * (this.x * this.x + this.z * this.z);
    a.m21 = c * this.s * this.x + c * this.y * this.z;
    a.m02 = c * this.s * this.y + c * this.x * this.z;
    a.m12 = -c * this.s * this.x + c * this.y * this.z;
    a.m22 = 1 - c * (this.x * this.x + this.y * this.y);
    return a
}, toMat4:function (a) {
    var c = 2 / Math.sqrt(this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z);
    if (a == null) {
        a = okA.mat4()
    }
    a.m00 = 1 - c * (this.y * this.y + this.z * this.z);
    a.m10 = c * this.x * this.y + c * this.s * this.z;
    a.m20 = -c * this.s * this.y + c * this.x * this.z;
    a.m01 = c * this.x * this.y - c * this.s * this.z;
    a.m11 = 1 - c * (this.x * this.x + this.z * this.z);
    a.m21 = c * this.s * this.x + c * this.y * this.z;
    a.m02 = c * this.s * this.y + c * this.x * this.z;
    a.m12 = -c * this.s * this.x + c * this.y * this.z;
    a.m22 = 1 - c * (this.x * this.x + this.y * this.y);
    return a
}, toMat43:function (a) {
    var c = 2 / Math.sqrt(this.s * this.s + this.x * this.x + this.y * this.y + this.z * this.z);
    if (a == null) {
        a = okA.mat43()
    }
    a.m00 = 1 - c * (this.y * this.y + this.z * this.z);
    a.m10 = c * this.x * this.y + c * this.s * this.z;
    a.m20 = -c * this.s * this.y + c * this.x * this.z;
    a.m01 = c * this.x * this.y - c * this.s * this.z;
    a.m11 = 1 - c * (this.x * this.x + this.z * this.z);
    a.m21 = c * this.s * this.x + c * this.y * this.z;
    a.m02 = c * this.s * this.y + c * this.x * this.z;
    a.m12 = -c * this.s * this.x + c * this.y * this.z;
    a.m22 = 1 - c * (this.x * this.x + this.y * this.y);
    return a
}, __isQuatComplete:function () {
    if (this.s != null && this.x != null && this.y != null && this.z != null) {
        return true
    }
    return false
}};
function okQuatAdd(d, a) {
    var c = okA.quat();
    c.s = d.s + a.s;
    c.x = d.x + a.x;
    c.y = d.y + a.y;
    c.z = d.z + a.z;
    return c
}
function okQuatSub(d, a) {
    var c = okA.quat();
    c.s = d.s - a.s;
    c.x = d.x - a.x;
    c.y = d.y - a.y;
    c.z = d.z - a.z;
    return c
}
function okQuatMul(f, e) {
    var a = okA.quat();
    var d = f.getImVec3();
    var c = e.getImVec3();
    a.s = f.s * e.s - okVec3Dot(d, c);
    var m = okVec3Cross(d, c);
    var l = okVec3MulVal(d, e.s);
    var k = okVec3MulVal(c, f.s);
    var n = okVec3Add(m, l);
    var h = okVec3Add(n, k);
    a.x = h.x;
    a.y = h.y;
    a.z = h.z;
    okA._vec3(d);
    okA._vec3(c);
    okA._vec3(m);
    okA._vec3(l);
    okA._vec3(k);
    okA._vec3(n);
    okA._vec3(h);
    return a
}
function okQuatDot(c, a) {
    return c.s * a.s + c.x * a.x + c.y * a.y + c.z * a.z
}
function okQuatSlerp(e, d, m) {
    if (e.equal(d)) {
        return e.clone()
    }
    var f = okA.quat();
    var k = e.s * d.s + e.x * d.x + e.y * d.y + e.z * d.z;
    if (k < 0) {
        k = -k;
        f.s = -d.s;
        f.x = -d.x;
        f.y = -d.y;
        f.z = -d.z
    } else {
        f.s = d.s;
        f.x = d.x;
        f.y = d.y;
        f.z = d.z
    }
    k = (k < 1 ? k : 1);
    var c, a;
    if (k != 1 && k != -1) {
        var l = Math.acos(k);
        var h = Math.sin(l);
        c = Math.sin((1 - m) * l) / h;
        a = Math.sin(m * l) / h
    } else {
        c = 1 - m;
        a = m
    }
    f.s = c * e.s + a * f.s;
    f.x = c * e.x + a * f.x;
    f.y = c * e.y + a * f.y;
    f.z = c * e.z + a * f.z;
    return f
}
function okQuatRot(n, l, k, h) {
    var c = n * Math.PI / 180;
    var f = okA.vec3();
    if (k != null) {
        f.x = l;
        f.y = k;
        f.z = h
    } else {
        f.x = l.x;
        f.y = l.y;
        f.z = l.z
    }
    var m = f.normalize();
    okA._vec3(f);
    var d = Math.cos(c * 0.5);
    var a = Math.sin(c * 0.5);
    var e = okA.quat();
    e.s = d;
    e.x = a * m.x;
    e.y = a * m.y;
    e.z = a * m.z;
    okA._vec3(m);
    return e
}
function okPlane(a, c) {
    this.vOrigin = okA.vec3();
    this.vNormal = okA.vec3();
    if (a) {
        this.vOrigin.x = a.x;
        this.vOrigin.y = a.y;
        this.vOrigin.z = a.z
    }
    if (c) {
        this.vNormal.x = c.x;
        this.vNormal.y = c.y;
        this.vNormal.z = c.z
    } else {
        this.vNormal.x = 0;
        this.vNormal.y = 1;
        this.vNormal.z = 0
    }
}
okPlane.prototype = {clone:function (a) {
    var a = (a ? a : okA.plane());
    a.vOrigin.x = this.vOrigin.x;
    a.vOrigin.y = this.vOrigin.y;
    a.vOrigin.z = this.vOrigin.z;
    a.vNormal.x = this.vNormal.x;
    a.vNormal.y = this.vNormal.y;
    a.vNormal.z = this.vNormal.z;
    return a
}, set:function (a, d) {
    this.vOrigin.x = a.x;
    this.vOrigin.y = a.y;
    this.vOrigin.z = a.z;
    var c = 1 / Math.sqrt(d.x * d.x + d.y * d.y + d.z * d.z);
    this.vNormal.x = d.x * c;
    this.vNormal.y = d.y * c;
    this.vNormal.z = d.z * c
}, setOrigin:function (a) {
    this.vOrigin.x = a.x;
    this.vOrigin.y = a.y;
    this.vOrigin.z = a.z
}, setNormal:function (c) {
    var a = 1 / Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
    this.vNormal.x = c.x * a;
    this.vNormal.y = c.y * a;
    this.vNormal.z = c.z * a
}, setByCoefficients:function (f, d, c, a) {
    var e = 1 / Math.sqrt(f * f + d * d + c * c);
    this.vNormal.x = f * e;
    this.vNormal.y = d * e;
    this.vNormal.z = c * e;
    if (!okFloatEqual(f, 0)) {
        this.vOrigin.x = -a / f;
        this.vOrigin.y = 0;
        this.vOrigin.z = 0
    } else {
        if (!okFloatEqual(d, 0)) {
            this.vOrigin.x = 0;
            this.vOrigin.y = -a / d;
            this.vOrigin.z = 0
        } else {
            this.vOrigin.x = 0;
            this.vOrigin.y = 0;
            this.vOrigin.z = -a / c
        }
    }
}, collideVertex:function (c) {
    var d = this.vNormal.x * this.vOrigin.x + this.vNormal.y * this.vOrigin.y + this.vNormal.z * this.vOrigin.z;
    var a = this.vNormal.x * c.x + this.vNormal.y * c.y + this.vNormal.z * c.z;
    if (okFloatEqual(a, d)) {
        return 2
    } else {
        if (a > d) {
            return 1
        } else {
            return 0
        }
    }
}, collideLine:function (d, h, c) {
    var a = (h.x - d.x) * this.vNormal.x + (h.y - d.y) * this.vNormal.y + (h.z - d.z) * this.vNormal.z;
    if (okFloatEqual(a, 0)) {
        if (this.collideVertex(d) == 2) {
            return 2
        }
        return 0
    }
    var f = okVec3Sub(this.vOrigin, d);
    var e = okVec3Dot(this.vNormal, f) / a;
    okA._vec3(f);
    if (c != null) {
        c.fT = e
    }
    return 1
}, collideRay:function (d, f, c) {
    var a = okVec3Dot(f, this.vNormal);
    if (okFloatEqual(a, 0)) {
        if (this.collideVertex(d) == 2) {
            return 2
        }
        return 0
    }
    var h = okVec3Sub(this.vOrigin, d);
    var e = okVec3Dot(this.vNormal, h) / a;
    okA._vec3(h);
    if (c != null) {
        c.fT = e
    }
    if (e < 0) {
        return 0
    }
    return 1
}};
function okPlaneIntersect3(q, o, m) {
    var n = q.vNormal;
    var l = o.vNormal;
    var k = m.vNormal;
    var f = okVec3Cross(l, k);
    var c = okVec3Cross(k, n);
    var p = okVec3Cross(n, l);
    var e = okVec3Dot(q.vOrigin, n);
    var d = okVec3Dot(o.vOrigin, l);
    var a = okVec3Dot(m.vOrigin, k);
    var v = okVec3MulVal(f, e);
    var t = okVec3MulVal(c, d);
    var s = okVec3MulVal(p, a);
    var h = n.x * (l.y * k.z - k.y * l.z) + l.x * (k.y * n.z - n.y * k.z) + k.x * (n.y * l.z - n.z * l.y);
    var u = okA.vec3();
    u.x = (v.x + t.x + s.x) / h;
    u.y = (v.y + t.y + s.y) / h;
    u.z = (v.z + t.z + s.z) / h;
    okA._vec3(f);
    okA._vec3(c);
    okA._vec3(p);
    okA._vec3(v);
    okA._vec3(t);
    okA._vec3(s);
    return u
}
function okAABBox(c, a) {
    this.vMin = okA.vec3();
    this.vMax = okA.vec3();
    if (c != null) {
        this.vMin.x = c.x;
        this.vMin.y = c.y;
        this.vMin.z = c.z
    }
    if (a != null) {
        this.vMax.x = a.x;
        this.vMax.y = a.y;
        this.vMax.z = a.z
    }
    this.$81 = [okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3()];
    this.$v2 = true
}
okAABBox.prototype = {clone:function (a) {
    var c = (a ? a : okA.aabbox());
    c.set(this.vMin, this.vMax);
    return c
}, set:function (c, a) {
    this.vMin.x = c.x;
    this.vMin.y = c.y;
    this.vMin.z = c.z;
    this.vMax.x = a.x;
    this.vMax.y = a.y;
    this.vMax.z = a.z;
    this.$v2 = true
}, setMin:function (d, c, a) {
    if (c == null) {
        this.vMin.x = d.x;
        this.vMin.y = d.y;
        this.vMin.z = d.z
    } else {
        this.vMin.x = d;
        this.vMin.y = c;
        this.vMin.z = a
    }
    this.$v2 = true
}, setMax:function (d, c, a) {
    if (c == null) {
        this.vMax.x = d.x;
        this.vMax.y = d.y;
        this.vMax.z = d.z
    } else {
        this.vMax.x = d;
        this.vMax.y = c;
        this.vMax.z = a
    }
    this.$v2 = true
}, getMin:function () {
    return this.vMin.clone()
}, getMax:function () {
    return this.vMax.clone()
}, union:function (e, c) {
    var f = okA.vec3(), d = okA.vec3();
    f.x = this.vMin.x < e.vMin.x ? this.vMin.x : e.vMin.x;
    f.y = this.vMin.y < e.vMin.y ? this.vMin.y : e.vMin.y;
    f.z = this.vMin.z < e.vMin.z ? this.vMin.z : e.vMin.z;
    d.x = this.vMax.x > e.vMax.x ? this.vMax.x : e.vMax.x;
    d.y = this.vMax.y > e.vMax.y ? this.vMax.y : e.vMax.y;
    d.z = this.vMax.z > e.vMax.z ? this.vMax.z : e.vMax.z;
    var a = c ? this : okA.aabbox();
    a.set(f, d);
    okA._vec3(f);
    okA._vec3(d);
    return a
}, intersect:function (e) {
    var f = okVec3Max(this.vMin, e.vMin);
    var c = okVec3Min(this.vMax, e.vMax);
    var d = okVec3Max(this.vMin, c);
    var a = okA.aabbox();
    a.set(f, d);
    okA._vec3(f);
    okA._vec3(c);
    okA._vec3(d);
    return a
}, getExtent:function (a) {
    if (a == 1) {
        return Math.max(0, this.vMax.x - this.vMin.x)
    } else {
        if (a == 2) {
            return Math.max(0, this.vMax.y - this.vMin.z)
        } else {
            return Math.max(0, this.vMax.z - this.vMin.z)
        }
    }
}, getVolume:function () {
    return Math.max(0, (this.vMax.x - this.vMin.x)) * Math.max(0, (this.vMax.y - this.vMin.y)) * Math.max(0, (this.vMax.z - this.vMin.z))
}, getPoint:function (c) {
    if (this.$v2) {
        var o = this.$81[0];
        o.x = this.vMin.x;
        o.y = this.vMin.y;
        o.z = this.vMin.z;
        var n = this.$81[1];
        n.x = this.vMax.x;
        n.y = this.vMin.y;
        n.z = this.vMin.z;
        var m = this.$81[2];
        m.x = this.vMax.x;
        m.y = this.vMax.y;
        m.z = this.vMin.z;
        var k = this.$81[3];
        k.x = this.vMin.x;
        k.y = this.vMax.y;
        k.z = this.vMin.z;
        var h = this.$81[4];
        h.x = this.vMin.x;
        h.y = this.vMin.y;
        h.z = this.vMax.z;
        var f = this.$81[5];
        f.x = this.vMax.x;
        f.y = this.vMin.y;
        f.z = this.vMax.z;
        var e = this.$81[6];
        e.x = this.vMax.x;
        e.y = this.vMax.y;
        e.z = this.vMax.z;
        var d = this.$81[7];
        d.x = this.vMin.x;
        d.y = this.vMax.y;
        d.z = this.vMax.z;
        this.$v2 = false
    }
    var a = this.$81[c];
    var l = okA.vec3();
    l.x = a.x;
    l.y = a.y;
    l.z = a.z;
    return l
}, transformMat:function (d) {
    var f = okA.vec3();
    var e = okA.vec3();
    var a = okA.vec3();
    var c = okA.vec3();
    a.x = this.vMin.x;
    a.y = this.vMin.y;
    a.z = this.vMin.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = c.x;
    f.y = c.y;
    f.z = c.z;
    e.x = c.x;
    e.y = c.y;
    e.z = c.z;
    a.x = this.vMax.x;
    a.y = this.vMin.y;
    a.z = this.vMin.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    a.x = this.vMin.x;
    a.y = this.vMax.y;
    a.z = this.vMin.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    a.x = this.vMin.x;
    a.y = this.vMin.y;
    a.z = this.vMax.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    a.x = this.vMax.x;
    a.y = this.vMax.y;
    a.z = this.vMin.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    a.x = this.vMax.x;
    a.y = this.vMin.y;
    a.z = this.vMax.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    a.x = this.vMin.x;
    a.y = this.vMax.y;
    a.z = this.vMax.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    a.x = this.vMax.x;
    a.y = this.vMax.y;
    a.z = this.vMax.z;
    c.x = d.m00 * a.x + d.m01 * a.y + d.m02 * a.z + d.m03;
    c.y = d.m10 * a.x + d.m11 * a.y + d.m12 * a.z + d.m13;
    c.z = d.m20 * a.x + d.m21 * a.y + d.m22 * a.z + d.m23;
    f.x = ((f.x < c.x) ? f.x : c.x);
    f.y = ((f.y < c.y) ? f.y : c.y);
    f.z = ((f.z < c.z) ? f.z : c.z);
    e.x = ((e.x > c.x) ? e.x : c.x);
    e.y = ((e.y > c.y) ? e.y : c.y);
    e.z = ((e.z > c.z) ? e.z : c.z);
    this.vMin.x = f.x;
    this.vMin.y = f.y;
    this.vMin.z = f.z;
    this.vMax.x = e.x;
    this.vMax.y = e.y;
    this.vMax.z = e.z;
    okA._vec3(f);
    okA._vec3(e);
    okA._vec3(a);
    okA._vec3(c);
    this.$v2 = true
}, collideVertex:function (a) {
    if (a.x >= this.vMin.x && a.x <= this.vMax.x && a.y >= this.vMin.y && a.y <= this.vMax.y && a.z >= this.vMin.z && a.z <= this.vMax.z) {
        return 1
    }
    return 0
}, collideLine:function (d, c, a) {
    var h = -10000000000, k = 10000000000;
    var p = c.x - d.x;
    var o = c.y - d.y;
    var m = c.z - d.z;
    var t = (this.vMin.x + this.vMax.x) * 0.5 - d.x;
    var x = (this.vMax.x - this.vMin.x) * 0.5;
    var y = t;
    var v = p;
    if (v < -0.001 || v > 0.001) {
        var n = (y + x) / v;
        var l = (y - x) / v;
        if (n > l) {
            var z = n;
            n = l;
            l = z
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l)
    } else {
        if (-y - x > 0 || -y + x < 0) {
            return 0
        }
    }
    var s = (this.vMin.y + this.vMax.y) * 0.5 - d.y;
    var w = (this.vMax.y - this.vMin.y) * 0.5;
    var y = s;
    var v = o;
    if (v < -0.001 || v > 0.001) {
        var n = (y + w) / v;
        var l = (y - w) / v;
        if (n > l) {
            var z = n;
            n = l;
            l = z
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (h > k) {
            return 0
        }
    } else {
        if (-y - w > 0 || -y + w < 0) {
            return 0
        }
    }
    var q = (this.vMin.z + this.vMax.z) * 0.5 - d.z;
    var u = (this.vMax.z - this.vMin.z) * 0.5;
    var y = q;
    var v = m;
    if (v < -0.001 || v > 0.001) {
        var n = (y + u) / v;
        var l = (y - u) / v;
        if (n > l) {
            var z = n;
            n = l;
            l = z
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (h > k) {
            return 0
        }
    } else {
        if (-y - u > 0 || -y + u < 0) {
            return 0
        }
    }
    if (a) {
        a.fT0 = h;
        a.fT1 = k
    }
    return 1
}, collideRay:function (x, l, t) {
    var a = -10000000000, m = 10000000000;
    var s = l;
    var w = (this.vMin.x + this.vMax.x) * 0.5 - x.x;
    var q = (this.vMax.x - this.vMin.x) * 0.5;
    var p = w;
    var o = s.x;
    if (o < -0.001 || o > 0.001) {
        var k = (p + q) / o;
        var c = (p - q) / o;
        if (k > c) {
            var y = k;
            k = c;
            c = y
        }
        a = (a < k ? k : a);
        m = (m < c ? m : c);
        if (m < 0) {
            return 0
        }
    } else {
        if (-p - q > 0 || -p + q < 0) {
            return 0
        }
    }
    var v = (this.vMin.y + this.vMax.y) * 0.5 - x.y;
    var n = (this.vMax.y - this.vMin.y) * 0.5;
    var p = v;
    var o = s.y;
    if (o < -0.001 || o > 0.001) {
        var k = (p + n) / o;
        var c = (p - n) / o;
        if (k > c) {
            var y = k;
            k = c;
            c = y
        }
        a = (a < k ? k : a);
        m = (m < c ? m : c);
        if (a > m || m < 0) {
            return 0
        }
    } else {
        if (-p - n > 0 || -p + n < 0) {
            return 0
        }
    }
    var u = (this.vMin.z + this.vMax.z) * 0.5 - x.z;
    var h = (this.vMax.z - this.vMin.z) * 0.5;
    var p = u;
    var o = s.z;
    if (o < -0.001 || o > 0.001) {
        var k = (p + h) / o;
        var c = (p - h) / o;
        if (k > c) {
            var y = k;
            k = c;
            c = y
        }
        a = (a < k ? k : a);
        m = (m < c ? m : c);
        if (a > m || m < 0) {
            return 0
        }
    } else {
        if (-p - h > 0 || -p + h < 0) {
            return 0
        }
    }
    if (t) {
        t.fT0 = a;
        t.fT1 = m
    }
    return 1
}, collideAABBox:function (e) {
    var d = okVec3Max(this.vMin, e.vMin);
    var a = okVec3Min(this.vMax, e.vMax);
    var c = 0;
    if (d.x > a.x || d.y > a.y || d.z > a.z) {
        c = 0
    } else {
        if (d.equal(e.vMin) && a.equal(e.vMax)) {
            c = 2
        } else {
            c = 1
        }
    }
    okA._vec3(d);
    okA._vec3(a);
    return c
}, __isAABBComplete:function () {
    if (this.vMin.__isVec3Complete() && this.vMax.__isVec3Complete()) {
        return true
    }
    return false
}};
okAABBox.prototype.transformMat43 = okAABBox.prototype.transformMat;
okAABBox.prototype.transformMat4 = okAABBox.prototype.transformMat;
function okOBBox(d, c, a) {
    this.vMin = (d != null) ? d.clone() : okA.vec3();
    this.vMax = (c != null) ? c.clone() : okA.vec3();
    this.$n5 = okA.mat43();
    if (a) {
        a.clone(this.$n5)
    }
    this.$n2 = true;
    this.$p2 = true;
    this.$81 = [new okVec3(this.vMin.x, this.vMin.y, this.vMin.z), new okVec3(this.vMax.x, this.vMin.y, this.vMin.z), new okVec3(this.vMax.x, this.vMax.y, this.vMin.z), new okVec3(this.vMin.x, this.vMax.y, this.vMin.z), new okVec3(this.vMin.x, this.vMin.y, this.vMax.z), new okVec3(this.vMax.x, this.vMin.y, this.vMax.z), new okVec3(this.vMax.x, this.vMax.y, this.vMax.z), new okVec3(this.vMin.x, this.vMax.y, this.vMax.z)];
    this.$v2 = true
}
okOBBox.prototype = {clone:function (a) {
    var a = (a ? a : new okOBBox());
    a.set(this.vMin, this.vMax, this.$n5);
    return a
}, set:function (d, c, a) {
    d.clone(this.vMin);
    c.clone(this.vMax);
    if (a) {
        a.clone(this.$n5)
    }
    this.$n2 = true;
    this.$p2 = true;
    this.$v2 = true
}, setMin:function (d, c, a) {
    if (c == null) {
        d.clone(this.vMin)
    } else {
        this.vMin.set(d, c, a)
    }
    this.$p2 = true;
    this.$v2 = true
}, setMax:function (d, c, a) {
    if (c == null) {
        d.clone(this.vMax)
    } else {
        this.vMax.set(d, c, a)
    }
    this.$p2 = true;
    this.$v2 = true
}, setMat:function (a) {
    a.clone(this.$n5);
    this.$n2 = true;
    this.$p2 = true;
    this.$v2 = true
}, getExtent:function (a) {
    if (a == 1) {
        return Math.max(0, this.vMax.x - this.vMin.x)
    } else {
        if (a == 2) {
            return Math.max(0, this.vMax.y - this.vMin.z)
        } else {
            return Math.max(0, this.vMax.z - this.vMin.z)
        }
    }
}, getVolume:function () {
    return Math.max(0, (this.vMax.x - this.vMin.x)) * Math.max(0, (this.vMax.y - this.vMin.y)) * Math.max(0, (this.vMax.z - this.vMin.z))
}, getPoint:function (c) {
    if (this.$v2) {
        var o = this.$81[0];
        o.x = this.$n5.m00 * this.vMin.x + this.$n5.m01 * this.vMin.y + this.$n5.m02 * this.vMin.z + this.$n5.m03;
        o.y = this.$n5.m10 * this.vMin.x + this.$n5.m11 * this.vMin.y + this.$n5.m12 * this.vMin.z + this.$n5.m13;
        o.z = this.$n5.m20 * this.vMin.x + this.$n5.m21 * this.vMin.y + this.$n5.m22 * this.vMin.z + this.$n5.m23;
        var n = this.$81[1];
        n.x = this.$n5.m00 * this.vMax.x + this.$n5.m01 * this.vMin.y + this.$n5.m02 * this.vMin.z + this.$n5.m03;
        n.y = this.$n5.m10 * this.vMax.x + this.$n5.m11 * this.vMin.y + this.$n5.m12 * this.vMin.z + this.$n5.m13;
        n.z = this.$n5.m20 * this.vMax.x + this.$n5.m21 * this.vMin.y + this.$n5.m22 * this.vMin.z + this.$n5.m23;
        var m = this.$81[2];
        m.x = this.$n5.m00 * this.vMax.x + this.$n5.m01 * this.vMax.y + this.$n5.m02 * this.vMin.z + this.$n5.m03;
        m.y = this.$n5.m10 * this.vMax.x + this.$n5.m11 * this.vMax.y + this.$n5.m12 * this.vMin.z + this.$n5.m13;
        m.z = this.$n5.m20 * this.vMax.x + this.$n5.m21 * this.vMax.y + this.$n5.m22 * this.vMin.z + this.$n5.m23;
        var k = this.$81[3];
        k.x = this.$n5.m00 * this.vMin.x + this.$n5.m01 * this.vMax.y + this.$n5.m02 * this.vMin.z + this.$n5.m03;
        k.y = this.$n5.m10 * this.vMin.x + this.$n5.m11 * this.vMax.y + this.$n5.m12 * this.vMin.z + this.$n5.m13;
        k.z = this.$n5.m20 * this.vMin.x + this.$n5.m21 * this.vMax.y + this.$n5.m22 * this.vMin.z + this.$n5.m23;
        var h = this.$81[4];
        h.x = this.$n5.m00 * this.vMin.x + this.$n5.m01 * this.vMin.y + this.$n5.m02 * this.vMax.z + this.$n5.m03;
        h.y = this.$n5.m10 * this.vMin.x + this.$n5.m11 * this.vMin.y + this.$n5.m12 * this.vMax.z + this.$n5.m13;
        h.z = this.$n5.m20 * this.vMin.x + this.$n5.m21 * this.vMin.y + this.$n5.m22 * this.vMax.z + this.$n5.m23;
        var f = this.$81[5];
        f.x = this.$n5.m00 * this.vMax.x + this.$n5.m01 * this.vMin.y + this.$n5.m02 * this.vMax.z + this.$n5.m03;
        f.y = this.$n5.m10 * this.vMax.x + this.$n5.m11 * this.vMin.y + this.$n5.m12 * this.vMax.z + this.$n5.m13;
        f.z = this.$n5.m20 * this.vMax.x + this.$n5.m21 * this.vMin.y + this.$n5.m22 * this.vMax.z + this.$n5.m23;
        var e = this.$81[6];
        e.x = this.$n5.m00 * this.vMax.x + this.$n5.m01 * this.vMax.y + this.$n5.m02 * this.vMax.z + this.$n5.m03;
        e.y = this.$n5.m10 * this.vMax.x + this.$n5.m11 * this.vMax.y + this.$n5.m12 * this.vMax.z + this.$n5.m13;
        e.z = this.$n5.m20 * this.vMax.x + this.$n5.m21 * this.vMax.y + this.$n5.m22 * this.vMax.z + this.$n5.m23;
        var d = this.$81[7];
        d.x = this.$n5.m00 * this.vMin.x + this.$n5.m01 * this.vMax.y + this.$n5.m02 * this.vMax.z + this.$n5.m03;
        d.y = this.$n5.m10 * this.vMin.x + this.$n5.m11 * this.vMax.y + this.$n5.m12 * this.vMax.z + this.$n5.m13;
        d.z = this.$n5.m20 * this.vMin.x + this.$n5.m21 * this.vMax.y + this.$n5.m22 * this.vMax.z + this.$n5.m23;
        this.$v2 = false
    }
    var a = this.$81[c];
    var l = okA.vec3();
    l.x = a.x;
    l.y = a.y;
    l.z = a.z;
    return l
}, _updateData:function () {
    if (this.$n2) {
        this.$q5 = this.$n5.inverse().transpose(true);
        this.$n2 = false
    }
    if (this.$p2) {
        this.vMinW = okMat43MulVec3(this.$n5, this.vMin);
        this.vMaxW = okMat43MulVec3(this.$n5, this.vMax);
        this.$p2 = false
    }
}, collideLine:function (d, c, a) {
    this._updateData();
    var h = -10000000000, k = 10000000000;
    var t = c.x - d.x;
    var q = c.y - d.y;
    var p = c.z - d.z;
    var s = this.$n5.getColumn(0).normalize(true);
    var o = this.$n5.getColumn(1).normalize(true);
    var m = this.$n5.getColumn(2).normalize(true);
    var w = (this.vMinW.x + this.vMaxW.x) * 0.5 - d.x;
    var v = (this.vMinW.y + this.vMaxW.y) * 0.5 - d.y;
    var u = (this.vMinW.z + this.vMaxW.z) * 0.5 - d.z;
    var B = (okVec3Dot(this.vMaxW, s) - okVec3Dot(this.vMinW, s)) * 0.5;
    var z = (okVec3Dot(this.vMaxW, o) - okVec3Dot(this.vMinW, o)) * 0.5;
    var x = (okVec3Dot(this.vMaxW, m) - okVec3Dot(this.vMinW, m)) * 0.5;
    var A = w * this.$n5.m00 + v * this.$n5.m10 + u * this.$n5.m20;
    var y = t * this.$n5.m00 + q * this.$n5.m10 + p * this.$n5.m20;
    if (y < -0.001 || y > 0.001) {
        var n = (A + B) / y;
        var l = (A - B) / y;
        if (n > l) {
            var C = n;
            n = l;
            l = C
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l)
    } else {
        if (-A - B > 0 || -A + B < 0) {
            return 0
        }
    }
    var A = w * this.$n5.m01 + v * this.$n5.m11 + u * this.$n5.m21;
    var y = t * this.$n5.m01 + q * this.$n5.m11 + p * this.$n5.m21;
    if (y < -0.001 || y > 0.001) {
        var n = (A + z) / y;
        var l = (A - z) / y;
        if (n > l) {
            var C = n;
            n = l;
            l = C
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (h > k) {
            return 0
        }
    } else {
        if (-A - z > 0 || -A + z < 0) {
            return 0
        }
    }
    var A = w * this.$n5.m02 + v * this.$n5.m12 + u * this.$n5.m22;
    var y = t * this.$n5.m02 + q * this.$n5.m12 + p * this.$n5.m22;
    if (y < -0.001 || y > 0.001) {
        var n = (A + x) / y;
        var l = (A - x) / y;
        if (n > l) {
            var C = n;
            n = l;
            l = C
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (h > k) {
            return 0
        }
    } else {
        if (-A - x > 0 || -A + x < 0) {
            return 0
        }
    }
    if (a) {
        a.fT0 = h;
        a.fT1 = k
    }
    return 1
}, collideRay:function (c, q, a) {
    this._updateData();
    var h = -10000000000, k = 10000000000;
    var B = q;
    var p = this.$n5.getColumn(0).normalize(true);
    var o = this.$n5.getColumn(1).normalize(true);
    var m = this.$n5.getColumn(2).normalize(true);
    var u = (this.vMinW.x + this.vMaxW.x) * 0.5 - c.x;
    var t = (this.vMinW.y + this.vMaxW.y) * 0.5 - c.y;
    var s = (this.vMinW.z + this.vMaxW.z) * 0.5 - c.z;
    var y = (okVec3Dot(this.vMaxW, p) - okVec3Dot(this.vMinW, p)) * 0.5;
    var w = (okVec3Dot(this.vMaxW, o) - okVec3Dot(this.vMinW, o)) * 0.5;
    var v = (okVec3Dot(this.vMaxW, m) - okVec3Dot(this.vMinW, m)) * 0.5;
    var z = u * p.x + t * p.y + s * p.z;
    var x = B.x * p.x + B.y * p.y + B.z * p.z;
    if (x < -0.001 || x > 0.001) {
        var n = (z + y) / x;
        var l = (z - y) / x;
        if (n > l) {
            var A = n;
            n = l;
            l = A
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (k < 0) {
            return 0
        }
    } else {
        if (-z - y > 0 || -z + y < 0) {
            return 0
        }
    }
    var z = u * o.x + t * o.y + s * o.z;
    var x = B.x * o.x + B.y * o.y + B.z * o.z;
    if (x < -0.001 || x > 0.001) {
        var n = (z + w) / x;
        var l = (z - w) / x;
        if (n > l) {
            var A = n;
            n = l;
            l = A
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (h > k || k < 0) {
            return 0
        }
    } else {
        if (-z - w > 0 || -z + w < 0) {
            return 0
        }
    }
    var z = u * m.x + t * m.y + s * m.z;
    var x = B.x * m.x + B.y * m.y + B.z * m.z;
    if (x < -0.001 || x > 0.001) {
        var n = (z + v) / x;
        var l = (z - v) / x;
        if (n > l) {
            var A = n;
            n = l;
            l = A
        }
        h = (h < n ? n : h);
        k = (k < l ? k : l);
        if (h > k || k < 0) {
            return 0
        }
    } else {
        if (-z - v > 0 || -z + v < 0) {
            return 0
        }
    }
    if (a) {
        a.fT0 = h;
        a.fT1 = k
    }
    return 1
}, __isOBBComplete:function () {
    if (this.vMin.__isVec3Complete() && this.vMax.__isVec3Complete() && this.$n5.__isMat43Complete()) {
        return true
    }
    return false
}};
function okFrustum() {
    this.$x5 = okA.mat4();
    this.$41 = [okA.plane(), okA.plane(), okA.plane(), okA.plane(), okA.plane(), okA.plane()];
    this.$81 = [okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3(), okA.vec3()];
    this.$v2 = true
}
okFrustum.prototype = {setByViewProjMat:function (a) {
    a.clone(this.$x5);
    this.$41[3].setByCoefficients(a.m30 - a.m00, a.m31 - a.m01, a.m32 - a.m02, a.m33 - a.m03);
    this.$41[2].setByCoefficients(a.m30 + a.m00, a.m31 + a.m01, a.m32 + a.m02, a.m33 + a.m03);
    this.$41[5].setByCoefficients(a.m30 + a.m10, a.m31 + a.m11, a.m32 + a.m12, a.m33 + a.m13);
    this.$41[4].setByCoefficients(a.m30 - a.m10, a.m31 - a.m11, a.m32 - a.m12, a.m33 - a.m13);
    this.$41[1].setByCoefficients(a.m30 - a.m20, a.m31 - a.m21, a.m32 - a.m22, a.m33 - a.m23);
    this.$41[0].setByCoefficients(a.m30 + a.m20, a.m31 + a.m21, a.m32 + a.m22, a.m33 + a.m23);
    this.$v2 = true
}, getPlane:function (a) {
    return this.$41[a]
}, setPlane:function (c, a) {
    a.clone(this.$41[c]);
    this.$v2 = true
}, getPoint:function (a) {
    if (this.$v2) {
        this._genPointList();
        this.$v2 = false
    }
    return this.$81[a]
}, collideVertex:function (a) {
    if (this.$41[0].collideVertex(a) == 0) {
        return 0
    }
    if (this.$41[1].collideVertex(a) == 0) {
        return 0
    }
    if (this.$41[2].collideVertex(a) == 0) {
        return 0
    }
    if (this.$41[3].collideVertex(a) == 0) {
        return 0
    }
    if (this.$41[4].collideVertex(a) == 0) {
        return 0
    }
    if (this.$41[5].collideVertex(a) == 0) {
        return 0
    }
    return 1
}, collideAABBox:function (a) {
    a.getPoint(0);
    return this._collideBox(a.$81)
}, collideOBBox:function (a) {
    a.getPoint(0);
    return this._collideBox(a.$81)
}, _collideBox:function (a) {
    var t = a[0];
    var p = a[1];
    var o = a[2];
    var n = a[3];
    var m = a[4];
    var l = a[5];
    var h = a[6];
    var e = a[7];
    var f = true;
    var d = true;
    var s = true;
    var c = this.$41[0];
    var k, q;
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * t.x + c.vNormal.y * t.y + c.vNormal.z * t.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * p.x + c.vNormal.y * p.y + c.vNormal.z * p.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * o.x + c.vNormal.y * o.y + c.vNormal.z * o.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * n.x + c.vNormal.y * n.y + c.vNormal.z * n.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * m.x + c.vNormal.y * m.y + c.vNormal.z * m.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * l.x + c.vNormal.y * l.y + c.vNormal.z * l.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * h.x + c.vNormal.y * h.y + c.vNormal.z * h.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * e.x + c.vNormal.y * e.y + c.vNormal.z * e.z;
    d = d && (k >= q);
    s = s && (k < q);
    if (s) {
        return 0
    }
    s = true;
    var c = this.$41[1];
    var k, q;
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * t.x + c.vNormal.y * t.y + c.vNormal.z * t.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * p.x + c.vNormal.y * p.y + c.vNormal.z * p.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * o.x + c.vNormal.y * o.y + c.vNormal.z * o.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * n.x + c.vNormal.y * n.y + c.vNormal.z * n.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * m.x + c.vNormal.y * m.y + c.vNormal.z * m.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * l.x + c.vNormal.y * l.y + c.vNormal.z * l.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * h.x + c.vNormal.y * h.y + c.vNormal.z * h.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * e.x + c.vNormal.y * e.y + c.vNormal.z * e.z;
    d = d && (k >= q);
    s = s && (k < q);
    if (s) {
        return 0
    }
    s = true;
    var c = this.$41[2];
    var k, q;
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * t.x + c.vNormal.y * t.y + c.vNormal.z * t.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * p.x + c.vNormal.y * p.y + c.vNormal.z * p.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * o.x + c.vNormal.y * o.y + c.vNormal.z * o.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * n.x + c.vNormal.y * n.y + c.vNormal.z * n.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * m.x + c.vNormal.y * m.y + c.vNormal.z * m.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * l.x + c.vNormal.y * l.y + c.vNormal.z * l.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * h.x + c.vNormal.y * h.y + c.vNormal.z * h.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * e.x + c.vNormal.y * e.y + c.vNormal.z * e.z;
    d = d && (k >= q);
    s = s && (k < q);
    if (s) {
        return 0
    }
    s = true;
    var c = this.$41[3];
    var k, q;
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * t.x + c.vNormal.y * t.y + c.vNormal.z * t.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * p.x + c.vNormal.y * p.y + c.vNormal.z * p.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * o.x + c.vNormal.y * o.y + c.vNormal.z * o.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * n.x + c.vNormal.y * n.y + c.vNormal.z * n.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * m.x + c.vNormal.y * m.y + c.vNormal.z * m.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * l.x + c.vNormal.y * l.y + c.vNormal.z * l.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * h.x + c.vNormal.y * h.y + c.vNormal.z * h.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * e.x + c.vNormal.y * e.y + c.vNormal.z * e.z;
    d = d && (k >= q);
    s = s && (k < q);
    if (s) {
        return 0
    }
    s = true;
    var c = this.$41[4];
    var k, q;
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * t.x + c.vNormal.y * t.y + c.vNormal.z * t.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * p.x + c.vNormal.y * p.y + c.vNormal.z * p.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * o.x + c.vNormal.y * o.y + c.vNormal.z * o.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * n.x + c.vNormal.y * n.y + c.vNormal.z * n.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * m.x + c.vNormal.y * m.y + c.vNormal.z * m.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * l.x + c.vNormal.y * l.y + c.vNormal.z * l.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * h.x + c.vNormal.y * h.y + c.vNormal.z * h.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * e.x + c.vNormal.y * e.y + c.vNormal.z * e.z;
    d = d && (k >= q);
    s = s && (k < q);
    if (s) {
        return 0
    }
    s = true;
    var c = this.$41[5];
    var k, q;
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * t.x + c.vNormal.y * t.y + c.vNormal.z * t.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * p.x + c.vNormal.y * p.y + c.vNormal.z * p.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * o.x + c.vNormal.y * o.y + c.vNormal.z * o.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * n.x + c.vNormal.y * n.y + c.vNormal.z * n.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * m.x + c.vNormal.y * m.y + c.vNormal.z * m.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * l.x + c.vNormal.y * l.y + c.vNormal.z * l.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * h.x + c.vNormal.y * h.y + c.vNormal.z * h.z;
    d = d && (k >= q);
    s = s && (k < q);
    q = c.vNormal.x * c.vOrigin.x + c.vNormal.y * c.vOrigin.y + c.vNormal.z * c.vOrigin.z;
    k = c.vNormal.x * e.x + c.vNormal.y * e.y + c.vNormal.z * e.z;
    d = d && (k >= q);
    s = s && (k < q);
    if (s) {
        return 0
    }
    if (d) {
        return 2
    }
    return 1
}, _genPointList:function () {
    this.$81[0] = okPlaneIntersect3(this.$41[0], this.$41[5], this.$41[2]);
    this.$81[1] = okPlaneIntersect3(this.$41[0], this.$41[5], this.$41[3]);
    this.$81[2] = okPlaneIntersect3(this.$41[0], this.$41[4], this.$41[3]);
    this.$81[3] = okPlaneIntersect3(this.$41[0], this.$41[4], this.$41[2]);
    this.$81[4] = okPlaneIntersect3(this.$41[1], this.$41[5], this.$41[2]);
    this.$81[5] = okPlaneIntersect3(this.$41[1], this.$41[5], this.$41[3]);
    this.$81[6] = okPlaneIntersect3(this.$41[1], this.$41[4], this.$41[3]);
    this.$81[7] = okPlaneIntersect3(this.$41[1], this.$41[4], this.$41[2])
}, __isFrustumComplete:function () {
    if (this.$x5.__isMat4Complete()) {
        return true
    }
    return false
}};
function okRect(e, c, d, a) {
    this.x = ((e != null) ? e : 0);
    this.y = ((c != null) ? c : 0);
    this.width = ((d != null) ? d : 0);
    this.height = ((a != null) ? a : 0)
}
okRect.prototype = {set:function (d, c, e, a) {
    this.x = d;
    this.y = c;
    this.width = width;
    this.height = height
}, clone:function (a) {
    var a = (a ? a : new okRect());
    a.set(this.x, this.y, this.width, this.height);
    return a
}, __isRectComplete:function () {
    if (this.x != null && this.y != null && this.width != null && this.height != null) {
        return true
    }
    return false
}};
function okRectMerge(e, d) {
    var c = Math.min(e.x, d.x);
    var h = Math.min(e.y, d.y);
    var f = Math.max(e.x + e.width - c, d.x + d.width - c);
    var a = Math.max(e.y + e.height - h, d.y + d.height - h);
    return new okRect(c, h, f, a)
}
OAK.VEC2_ZERO = new okVec2(0, 0);
OAK.VEC2_ONE = new okVec2(1, 1);
OAK.VEC2_X = new okVec2(1, 0);
OAK.VEC2_Y = new okVec2(0, 1);
OAK.VEC3_ZERO = new okVec3(0, 0, 0);
OAK.VEC3_ONE = new okVec3(1, 1, 1);
OAK.VEC3_X = new okVec3(1, 0, 0);
OAK.VEC3_Y = new okVec3(0, 1, 0);
OAK.VEC3_Z = new okVec3(0, 0, 1);
OAK.VEC3_INF = new okVec3(10000000000, 10000000000, 10000000000);
OAK.VEC3_NINF = new okVec3(-10000000000, -10000000000, -10000000000);
OAK.VEC3_RED = OAK.VEC3_X;
OAK.VEC3_GREEN = OAK.VEC3_Y;
OAK.VEC3_BLUE = OAK.VEC3_Z;
OAK.VEC3_YELLOW = new okVec3(1, 1, 0);
OAK.VEC3_BLACK = OAK.VEC3_ZERO;
OAK.VEC3_WHITE = OAK.VEC3_ONE;
OAK.VEC4_ZERO = new okVec4(0, 0, 0, 0);
OAK.VEC4_ONE = new okVec4(1, 1, 1, 1);
OAK.VEC4_X = new okVec3(1, 0, 0, 0);
OAK.VEC4_Y = new okVec3(0, 1, 0, 0);
OAK.VEC4_Z = new okVec3(0, 0, 1, 0);
OAK.VEC4_W = new okVec3(0, 0, 0, 1);
OAK.MAT3_ZERO = new okMat3(0);
OAK.MAT3_I = new okMat4(1);
OAK.MAT4_ZERO = new okMat4(0);
OAK.MAT4_I = new okMat4(1);
OAK.MAT43_ZERO = new okMat43(0);
OAK.MAT43_I = new okMat43(1);
function okXmlDoc(a) {
    this.$33 = a
}
okXmlDoc.prototype = {getRootNode:function () {
    return new okXmlNode(this.$33.documentElement)
}};
function okXmlNode(c) {
    this.element = c;
    this.childNodes = new Array();
    this.sText = "";
    if (okIsIE()) {
        for (var a = 0; a < this.element.childNodes.length; ++a) {
            if (this.element.childNodes[a].nodeType == 1) {
                this.childNodes.push(this.element.childNodes[a])
            } else {
                if (this.element.childNodes[a].nodeType == 3) {
                    this.sText += this.element.childNodes[a].text
                }
            }
        }
    } else {
        for (var a = 0; a < this.element.childNodes.length; ++a) {
            if (this.element.childNodes[a].nodeType == Node.ELEMENT_NODE) {
                this.childNodes.push(this.element.childNodes[a])
            } else {
                if (this.element.childNodes[a].nodeType == Node.TEXT_NODE) {
                    this.sText += this.element.childNodes[a].textContent
                }
            }
        }
    }
}
okXmlNode.prototype = {getName:function () {
    return this.element.nodeName
}, getText:function () {
    return this.sText
}, getChildNum:function () {
    return this.childNodes.length
}, getChild:function (a, e) {
    if (okIsNumber(a)) {
        return new okXmlNode(this.childNodes[a])
    } else {
        if (e) {
            a = a.toLowerCase()
        }
        for (var d = 0; d < this.childNodes.length; ++d) {
            var c = e ? (this.childNodes[d].nodeName.toLowerCase() == a) : (this.childNodes[d].nodeName == a);
            if (c) {
                return new okXmlNode(this.childNodes[d])
            }
        }
        return null
    }
}, getAttribNum:function () {
    return this.element.attributes.length
}, getAttribName:function (a) {
    return this.element.attributes[a].name
}, getAttribValueString:function (d, e) {
    if (okIsNumber(d)) {
        return this.element.attributes[d].value
    } else {
        if (e) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = e ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                return this.element.attributes[c].value
            }
        }
    }
    return null
}, getAttribValueInt:function (d, e) {
    if (okIsNumber(d)) {
        return parseInt(this.element.attributes[d].value)
    } else {
        if (e) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = e ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                return parseInt(this.element.attributes[c].value)
            }
        }
    }
    return null
}, getAttribValueFloat:function (d, e) {
    if (okIsNumber(d)) {
        return parseFloat(this.element.attributes[d].value)
    } else {
        if (e) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = e ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                return parseFloat(this.element.attributes[c].value)
            }
        }
    }
    return null
}, getAttribValueVec2:function (d, h) {
    if (okIsNumber(d)) {
        var f = this.element.attributes[d].value.split(" ");
        var e = okA.vec2();
        e.x = parseFloat(f[0]);
        e.y = parseFloat(f[1]);
        return e
    } else {
        if (h) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = h ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                var f = this.element.attributes[c].value.split(" ");
                var e = okA.vec2();
                e.x = parseFloat(f[0]);
                e.y = parseFloat(f[1]);
                return e
            }
        }
    }
    return null
}, getAttribValueVec3:function (d, h) {
    if (okIsNumber(d)) {
        var f = this.element.attributes[d].value.split(" ");
        var e = okA.vec3();
        e.x = parseFloat(f[0]);
        e.y = parseFloat(f[1]);
        e.z = parseFloat(f[2]);
        return e
    } else {
        if (h) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = h ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                var f = this.element.attributes[c].value.split(" ");
                var e = okA.vec3();
                e.x = parseFloat(f[0]);
                e.y = parseFloat(f[1]);
                e.z = parseFloat(f[2]);
                return e
            }
        }
    }
    return null
}, getAttribValueVec4:function (d, h) {
    if (okIsNumber(d)) {
        var f = this.element.attributes[d].value.split(" ");
        var e = okA.vec4();
        e.x = parseFloat(f[0]);
        e.y = parseFloat(f[1]);
        e.z = parseFloat(f[2]);
        e.w = parseFloat(f[3]);
        return e
    } else {
        if (h) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = h ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                var f = this.element.attributes[c].value.split(" ");
                var e = okA.vec3();
                e.x = parseFloat(f[0]);
                e.y = parseFloat(f[1]);
                e.z = parseFloat(f[2]);
                e.w = parseFloat(f[3]);
                return e
            }
        }
    }
    return null
}, getAttribValueMat4:function (e, h) {
    if (okIsNumber(e)) {
        var f = this.element.attributes[e].value.split(" ");
        var c = okA.mat4();
        c.m00 = parseFloat(f[0]);
        c.m10 = parseFloat(f[1]);
        c.m20 = parseFloat(f[2]);
        c.m30 = parseFloat(f[3]);
        c.m01 = parseFloat(f[4]);
        c.m11 = parseFloat(f[5]);
        c.m21 = parseFloat(f[6]);
        c.m31 = parseFloat(f[7]);
        c.m02 = parseFloat(f[8]);
        c.m12 = parseFloat(f[9]);
        c.m22 = parseFloat(f[10]);
        c.m32 = parseFloat(f[11]);
        c.m03 = parseFloat(f[12]);
        c.m13 = parseFloat(f[13]);
        c.m23 = parseFloat(f[14]);
        c.m33 = parseFloat(f[15]);
        return c
    } else {
        if (h) {
            e = e.toLowerCase()
        }
        for (var d = 0; d < this.element.attributes.length; ++d) {
            var a = h ? (this.element.attributes[d].name.toLowerCase() == e) : (this.element.attributes[d].name == e);
            if (a) {
                var f = this.element.attributes[d].value.split(" ");
                var c = okA.mat4();
                c.m00 = parseFloat(f[0]);
                c.m10 = parseFloat(f[1]);
                c.m20 = parseFloat(f[2]);
                c.m30 = parseFloat(f[3]);
                c.m01 = parseFloat(f[4]);
                c.m11 = parseFloat(f[5]);
                c.m21 = parseFloat(f[6]);
                c.m31 = parseFloat(f[7]);
                c.m02 = parseFloat(f[8]);
                c.m12 = parseFloat(f[9]);
                c.m22 = parseFloat(f[10]);
                c.m32 = parseFloat(f[11]);
                c.m03 = parseFloat(f[12]);
                c.m13 = parseFloat(f[13]);
                c.m23 = parseFloat(f[14]);
                c.m33 = parseFloat(f[15]);
                return c
            }
        }
    }
    return null
}, getAttribValueMat43:function (e, h) {
    if (okIsNumber(e)) {
        var f = this.element.attributes[e].value.split(" ");
        var c = okA.mat43();
        c.m00 = parseFloat(f[0]);
        c.m10 = parseFloat(f[1]);
        c.m20 = parseFloat(f[2]);
        c.m01 = parseFloat(f[3]);
        c.m11 = parseFloat(f[4]);
        c.m21 = parseFloat(f[5]);
        c.m02 = parseFloat(f[6]);
        c.m12 = parseFloat(f[7]);
        c.m22 = parseFloat(f[8]);
        c.m03 = parseFloat(f[9]);
        c.m13 = parseFloat(f[10]);
        c.m23 = parseFloat(f[11]);
        return c
    } else {
        if (h) {
            e = e.toLowerCase()
        }
        for (var d = 0; d < this.element.attributes.length; ++d) {
            var a = h ? (this.element.attributes[d].name.toLowerCase() == e) : (this.element.attributes[d].name == e);
            if (a) {
                var f = this.element.attributes[d].value.split(" ");
                var c = okA.mat43();
                c.m00 = parseFloat(f[0]);
                c.m10 = parseFloat(f[1]);
                c.m20 = parseFloat(f[2]);
                c.m01 = parseFloat(f[3]);
                c.m11 = parseFloat(f[4]);
                c.m21 = parseFloat(f[5]);
                c.m02 = parseFloat(f[6]);
                c.m12 = parseFloat(f[7]);
                c.m22 = parseFloat(f[8]);
                c.m03 = parseFloat(f[9]);
                c.m13 = parseFloat(f[10]);
                c.m23 = parseFloat(f[11]);
                return c
            }
        }
    }
    return null
}, getAttribValueQuat:function (e, h) {
    if (okIsNumber(e)) {
        var f = this.element.attributes[e].value.split(" ");
        var c = okA.quat();
        c.s = parseFloat(f[0]);
        c.x = parseFloat(f[1]);
        c.y = parseFloat(f[2]);
        c.z = parseFloat(f[3]);
        return c
    } else {
        if (h) {
            e = e.toLowerCase()
        }
        for (var d = 0; d < this.element.attributes.length; ++d) {
            var a = h ? (this.element.attributes[d].name.toLowerCase() == e) : (this.element.attributes[d].name == e);
            if (a) {
                var f = this.element.attributes[d].value.split(" ");
                var c = okA.quat();
                c.s = parseFloat(f[0]);
                c.x = parseFloat(f[1]);
                c.y = parseFloat(f[2]);
                c.z = parseFloat(f[3]);
                return c
            }
        }
    }
    return null
}, getAttribValueIntArray:function (e, h) {
    if (okIsNumber(e)) {
        var f = this.element.attributes[e].value.split(" ");
        var d = okA.array();
        for (var c = 0; c < f.length; ++c) {
            d.push(parseInt(f[c]))
        }
        return d
    } else {
        if (h) {
            e = e.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = h ? (this.element.attributes[c].name.toLowerCase() == e) : (this.element.attributes[c].name == e);
            if (a) {
                var f = this.element.attributes[c].value.split(" ");
                var d = okA.array();
                for (var c = 0; c < f.length; ++c) {
                    d.push(parseInt(f[c]))
                }
                return d
            }
        }
    }
    return null
}, getAttribValueFloatArray:function (e, h) {
    if (okIsNumber(e)) {
        var f = this.element.attributes[e].value.split(" ");
        var d = okA.array();
        for (var c = 0; c < f.length; ++c) {
            d.push(parseFloat(f[c]))
        }
        return d
    } else {
        if (h) {
            e = e.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = h ? (this.element.attributes[c].name.toLowerCase() == e) : (this.element.attributes[c].name == e);
            if (a) {
                var f = this.element.attributes[c].value.split(" ");
                var d = okA.array();
                for (var c = 0; c < f.length; ++c) {
                    d.push(parseFloat(f[c]))
                }
                return d
            }
        }
    }
    return null
}, getAttribValueStringArray:function (d, e) {
    if (okIsNumber(d)) {
        return this.element.attributes[d].value.split(" ")
    } else {
        if (e) {
            d = d.toLowerCase()
        }
        for (var c = 0; c < this.element.attributes.length; ++c) {
            var a = e ? (this.element.attributes[c].name.toLowerCase() == d) : (this.element.attributes[c].name == d);
            if (a) {
                return this.element.attributes[c].value.split(" ")
            }
        }
    }
    return null
}};
function okParseXML(a) {
    var c;
    if (okIsIE()) {
        c = new ActiveXObject("Microsoft.XMLDOM");
        c.async = "false";
        c.loadXML(a)
    } else {
        var d = new DOMParser();
        c = d.parseFromString(a, "text/xml")
    }
    return c
}
okPackXMLShaderSource = function (a) {
    var f = a.split("");
    var e = f.length;
    for (var c = 0; c < e; ++c) {
        if (f[c] == "<") {
            var h = c;
            c++;
            if (f[c] == "/") {
                while (c < e && f[c] != ">") {
                    ++c
                }
                continue
            }
            while (c < e && f[c] == " ") {
                ++c
            }
            for (; c < e; ++c) {
                var k = f[c];
                if (k == ">") {
                    break
                } else {
                    if (k == " ") {
                        while (c < e && f[c] == " ") {
                            ++c
                        }
                        if (f[c] != ">") {
                            f[h] = "$0";
                            --c
                        }
                        break
                    } else {
                        if (k < "0" || (k > "9" && k < "A") || (k > "Z" && k < "a") || k > "z") {
                            f[h] = "$0";
                            --c;
                            break
                        }
                    }
                }
            }
        } else {
            if (f[c] == ">") {
                f[c] == "$1"
            } else {
                if (f[c] == "&") {
                    f[c] = "$2"
                }
            }
        }
    }
    var d = "";
    for (var c = 0; c < e; ++c) {
        d += f[c]
    }
    return d
};
okUnpackXMLShaderSource = function (a) {
    a = a.replace(/\$0/g, "<");
    a = a.replace(/\$1/g, ">");
    a = a.replace(/\$2/g, "&");
    return a
};
function okBinDoc(c, d) {
    this.$33 = new jDataView(c);
    if (d) {
        var a = this.$33.getString(d.length);
        if (a != d) {
            this.$33 = null;
            return
        }
    }
    this.$X5 = new okBinNode(this.$33, d ? d.length : 0)
}
okBinDoc.prototype = {isValid:function () {
    return this.$33 != null
}, getRootNode:function () {
    return this.$X5
}};
function okBinNode(k, l) {
    this.$33 = k;
    k.seek(l);
    var a = k.getUint16();
    this.$e6 = k.getString(a);
    var h = okA.array();
    var f = okA.array();
    this.$V3 = k.getUint16();
    for (var e = 0; e < this.$V3; ++e) {
        h.push(k.getUint32())
    }
    this.$e4 = k.getUint16();
    for (var e = 0; e < this.$e4; ++e) {
        f.push(k.getUint32())
    }
    this.$P1 = new Object;
    for (var e = 0; e < this.$V3; ++e) {
        var d = new Object;
        d.iOffset = h[e];
        this.$33.seek(h[e]);
        var c = k.getUint16();
        d.$e6 = k.getString(c);
        d.iOffset += (2 + c);
        this.$P1[d.$e6] = d
    }
    this.$V2 = new Object;
    this.$W2 = new Array;
    for (var e = 0; e < this.$e4; ++e) {
        var d = new Object;
        d.iOffset = f[e];
        this.$33.seek(f[e]);
        var c = k.getUint16();
        d.$e6 = k.getString(c);
        this.$V2[d.$e6] = d;
        this.$W2.push(d.$e6)
    }
    okA._array(h);
    okA._array(f);
    this.$X2 = new Object
}
okBinNode.prototype = {getName:function () {
    return this.$e6
}, getChildNum:function () {
    return this.$e4
}, getChild:function (a) {
    if (okIsNumber(a)) {
        a = this.$W2[a]
    }
    if (this.$V2[a] == null) {
        return null
    }
    if (this.$X2[a] == null) {
        this.$X2[a] = new okBinNode(this.$33, this.$V2[a].iOffset)
    }
    return this.$X2[a]
}, getChildMap:function () {
    for (var a in this.$V2) {
        if (this.$X2[a] == null) {
            this.$X2[a] = new okBinNode(this.$33, this.$V2[a].iOffset)
        }
    }
    return this.$X2
}, getAttribNum:function () {
    return this.$V3
}, isAttribExisted:function (a) {
    return this.$P1[a] != null
}, getAttribValueString:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = this.$33.getUint16();
    return this.$33.getString(a)
}, getAttribValueInt:function (a) {
    if (this.$P1[a] == null) {
        return null
    }
    this.$33.seek(this.$P1[a].iOffset);
    return this.$33.getInt32()
}, getAttribValueFloat:function (a) {
    if (this.$P1[a] == null) {
        return null
    }
    this.$33.seek(this.$P1[a].iOffset);
    return this.$33.getFloat32()
}, getAttribValueVec2:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = okA.vec2();
    a.set(this.$33.getFloat32(), this.$33.getFloat32());
    return a
}, getAttribValueVec3:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = okA.vec3();
    a.set(this.$33.getFloat32(), this.$33.getFloat32(), this.$33.getFloat32());
    return a
}, getAttribValueVec4:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = okA.vec4();
    a.set(this.$33.getFloat32(), this.$33.getFloat32(), this.$33.getFloat32(), this.$33.getFloat32());
    return a
}, getAttribValueMat4:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = okA.mat4();
    a.m00 = this.$33.getFloat32();
    a.m10 = this.$33.getFloat32();
    a.m20 = this.$33.getFloat32();
    a.m30 = this.$33.getFloat32();
    a.m01 = this.$33.getFloat32();
    a.m11 = this.$33.getFloat32();
    a.m21 = this.$33.getFloat32();
    a.m31 = this.$33.getFloat32();
    a.m02 = this.$33.getFloat32();
    a.m12 = this.$33.getFloat32();
    a.m22 = this.$33.getFloat32();
    a.m32 = this.$33.getFloat32();
    a.m03 = this.$33.getFloat32();
    a.m13 = this.$33.getFloat32();
    a.m23 = this.$33.getFloat32();
    a.m33 = this.$33.getFloat32();
    return a
}, getAttribValueMat43:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = okA.mat43();
    a.m00 = this.$33.getFloat32();
    a.m10 = this.$33.getFloat32();
    a.m20 = this.$33.getFloat32();
    a.m01 = this.$33.getFloat32();
    a.m11 = this.$33.getFloat32();
    a.m21 = this.$33.getFloat32();
    a.m02 = this.$33.getFloat32();
    a.m12 = this.$33.getFloat32();
    a.m22 = this.$33.getFloat32();
    a.m03 = this.$33.getFloat32();
    a.m13 = this.$33.getFloat32();
    a.m23 = this.$33.getFloat32();
    return a
}, getAttribValueQuat:function (c) {
    if (this.$P1[c] == null) {
        return null
    }
    this.$33.seek(this.$P1[c].iOffset);
    var a = okA.quat();
    a.set(this.$33.getFloat32(), this.$33.getFloat32(), this.$33.getFloat32(), this.$33.getFloat32());
    return a
}, getAttribValueIntArray:function (e) {
    if (this.$P1[e] == null) {
        return null
    }
    this.$33.seek(this.$P1[e].iOffset);
    var d = okA.array();
    var a = this.$33.getInt32();
    for (var c = 0; c < a; ++c) {
        d.push(this.$33.getInt32())
    }
    return d
}, getAttribValueUshortArray:function (e) {
    if (this.$P1[e] == null) {
        return null
    }
    this.$33.seek(this.$P1[e].iOffset);
    var d = okA.array();
    var a = this.$33.getInt32();
    for (var c = 0; c < a; ++c) {
        d.push(this.$33.getUint16())
    }
    return d
}, getAttribValueFloatArray:function (e) {
    if (this.$P1[e] == null) {
        return null
    }
    this.$33.seek(this.$P1[e].iOffset);
    var d = okA.array();
    var a = this.$33.getInt32();
    for (var c = 0; c < a; ++c) {
        d.push(this.$33.getFloat32())
    }
    return d
}, getAttribValueStringArray:function (f) {
    if (this.$P1[f] == null) {
        return null
    }
    this.$33.seek(this.$P1[f].iOffset);
    var e = okA.array();
    var a = this.$33.getInt32();
    for (var d = 0; d < a; ++d) {
        var c = this.$33.getUint16();
        e.push(this.$33.getString(c))
    }
    return e
}};
var okResourceParser = new Object;
okResourceParser.aModelParser = new Object;
okResourceParser.aAnimParser = new Object;
okResourceParser.registerModelParser = function (a, c) {
    if (!(a - 5 >= 0)) {
        okLog("[Error][okResourceParser.registerModelParser] Invalid custom doc type! ");
        return false
    }
    this.aModelParser[a] = c;
    return true
};
okResourceParser.registerSkAnimationParser = function (a, c) {
    if (!(a - 5 >= 0)) {
        okLog("[Error][okResourceParser.registerSkAnimationParser] Invalid custom doc type! ");
        return false
    }
    this.aAnimParser[a] = c;
    return true
};
okResourceParser.loadModel = function (a, e, d, k, h, f) {
    var c = false;
    if (a == 1) {
        c = this._loadModelXML(e, d, k, f)
    } else {
        if (a == 3) {
            c = this._loadModelBinary(e, d, k, f)
        } else {
            if (a == 4) {
                c = this._loadModelCollada(e, d, k, f)
            } else {
                if (this.aModelParser[a]) {
                    c = this.aModelParser[a](e, d, k)
                } else {
                    okLog("[Error][okResourceParser.loadModel] Unsupported document type! ")
                }
            }
        }
    }
    if (c && h) {
        e._genWireframe()
    }
    return c
};
okResourceParser._loadColladaGeometry = function (v) {
    if (v.getName() != "geometry") {
        return null
    }
    var q = v.getAttribValueString("name", true);
    var A = 1;
    var n = new Array();
    var S = {lines:1, linestrips:3, polygons:4, polylist:4, triangles:4, trifans:6, tristrips:5};
    for (var P = 0; P < v.getChildNum(); ++P) {
        switch (v.getChild(P).getName()) {
            case"mesh":
                var f = v.getChild(P);
                var D = new Object();
                var c;
                for (var O = 0; O < f.getChildNum(); ++O) {
                    switch (f.getChild(O).getName()) {
                        case"source":
                            var w = f.getChild(O);
                            var z = w.getAttribValueString("id", true);
                            var K = w.getChild("float_array");
                            var t = K.getAttribValueInt("count", true);
                            var G = K.getText().split(" ");
                            var R = new Array();
                            for (var N = 0; N < t; ++N) {
                                R.push(parseFloat(G[N]))
                            }
                            R.stride = 1;
                            if (w.getChild("technique_common")) {
                                R.stride = w.getChild("technique_common").getChild("accessor").getAttribValueInt("stride", true)
                            }
                            D[z] = R;
                            break;
                        case"vertices":
                            var p = f.getChild(O);
                            for (var N = 0; N < p.getChildNum(); ++N) {
                                var C = p.getChild(N);
                                if (C.getName() == "input" && C.getAttribValueString("semantic") == "POSITION") {
                                    var d = C.getAttribValueString("source").substr(1);
                                    if (D[d]) {
                                        c = D[d];
                                        break
                                    }
                                }
                            }
                            break;
                        case"polylist":
                        case"triangles":
                        case"lines":
                        case"linestrips":
                        case"trifans":
                        case"tristrips":
                            var H = new Object();
                            var B = new Array();
                            var L = 1;
                            for (var N = 0; N < f.getChild(O).getChildNum(); ++N) {
                                var Q = f.getChild(O).getChild(N);
                                switch (Q.getName()) {
                                    case"input":
                                        var E = Q.getAttribValueInt("offset", true);
                                        var u = Q.getAttribValueString("semantic", true);
                                        var d = Q.getAttribValueString("source", true).substr(1);
                                        var o = new Object();
                                        if (u == "VERTEX") {
                                            o.data = c
                                        } else {
                                            o.data = D[d]
                                        }
                                        o.offset = E;
                                        H[u] = o;
                                        if (E + 1 > L) {
                                            L = E + 1
                                        }
                                        break;
                                    case"vcount":
                                        var G = Q.getText().split(" ");
                                        for (var M = 0; M < G.length; ++M) {
                                            if (!isNaN(parseInt(G[M]))) {
                                                B.push(parseInt(G[M]))
                                            }
                                        }
                                        break;
                                    case"p":
                                        var F = new Array();
                                        var G = Q.getText().split(" ");
                                        for (var M = 0; M < G.length; ++M) {
                                            if (!isNaN(parseInt(G[M]))) {
                                                F.push(parseInt(G[M]))
                                            }
                                        }
                                        for (var s in H) {
                                            var o = H[s];
                                            var e = new Array();
                                            for (var M = 0; M < F.length; ++M) {
                                                if (M % L == o.offset) {
                                                    e.push(F[M])
                                                }
                                            }
                                            o.$95 = e;
                                            if (f.getChild(O).getName() == "polylist") {
                                                var y = new Array();
                                                var I = 0;
                                                var h = 0;
                                                for (var J = 0; J < B.length; ++J) {
                                                    h = I + B[J];
                                                    for (var M = I + 1; M < h - 1; ++M) {
                                                        y.push(e[I], e[M], e[M + 1])
                                                    }
                                                    I = h
                                                }
                                                o.$95 = y
                                            }
                                        }
                                        for (var s in H) {
                                            var o = H[s];
                                            if (s != "VERTEX") {
                                                var x = new Array();
                                                for (var M = 0; M < o.$95.length; ++M) {
                                                    for (var J = 0; J < o.data.stride; ++J) {
                                                        x.push(o.data[o.$95[M] * o.data.stride + J])
                                                    }
                                                }
                                                o.data = x;
                                                delete o.$95
                                            }
                                        }
                                        H.indexTopology = S[f.getChild(O).getName()];
                                        var a = q + "____" + (A++);
                                        H.meshName = a;
                                        H.material = f.getChild(O).getAttribValueString("material", true);
                                        n.push(H);
                                        break;
                                    default:
                                }
                            }
                            break;
                        default:
                    }
                }
                break
        }
    }
    return n
};
okResourceParser._loadColladaEffect = function (y) {
    if (!y || y.getName().toLowerCase() != "effect") {
        return null
    }
    var n = new Object();
    n.paramlist = new Object();
    var p = new Object();
    n.attrList = p;
    for (var x = 0; x < y.getChildNum(); ++x) {
        switch (y.getChild(x).getName()) {
            case"profile_COMMON":
                for (var w = 0; w < y.getChild(x).getChildNum(); ++w) {
                    switch (y.getChild(x).getChild(w).getName()) {
                        case"newparam":
                            var z = y.getChild(x).getChild(w);
                            var c = z.getAttribValueString("sid", true);
                            var d = new Object();
                            for (var v = 0; v < z.getChildNum(); ++v) {
                                switch (z.getChild(v).getName()) {
                                    case"semantic":
                                        d.semantic = okTrim(z.getChild(v).getText());
                                        break;
                                    case"float":
                                        d.TYPE = z.getChild(v).getName();
                                        d.value = parseFloat(z.getChild(v).getText());
                                        break;
                                    case"float2":
                                        d.TYPE = z.getChild(v).getName();
                                        var a = z.getChild(v).getText().split(" ");
                                        d.value = new okVec2(parseFloat(a[0]), parseFloat(a[1]));
                                        break;
                                    case"float3":
                                        d.TYPE = z.getChild(v).getName();
                                        var a = z.getChild(v).getText().split(" ");
                                        d.value = new okVec3(parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]));
                                        break;
                                    case"float4":
                                        d.TYPE = z.getChild(v).getName();
                                        var a = z.getChild(v).getText().split(" ");
                                        d.value = new okVec4(parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3]));
                                        break;
                                    case"sampler2D":
                                    case"surface":
                                        d.TYPE = "texture";
                                        var e = new Object();
                                        for (var u = 0; u < z.getChild(v).getChildNum(); ++u) {
                                            switch (z.getChild(v).getChild(u).getName()) {
                                                case"instance_image":
                                                    e[z.getChild(v).getChild(u).getName()] = z.getChild(v).getChild(u).getAttribValueString("url", true);
                                                    break;
                                                case"wrap_s":
                                                case"wrap_t":
                                                case"wrap_p":
                                                case"minfilter":
                                                case"magfilter":
                                                case"mipfilter":
                                                case"mip_max_level":
                                                case"mip_min_level":
                                                case"mip_bias":
                                                case"max_anisotropy":
                                                case"init_from":
                                                case"format":
                                                    e[z.getChild(v).getChild(u).getName()] = z.getChild(v).getChild(u).getText();
                                                    break;
                                                case"source":
                                                    var q = z.getChild(v).getChild(u).getText();
                                                    e.init_from = n.paramlist[q]["value"]["init_from"];
                                                    break
                                            }
                                        }
                                        d.value = e
                                }
                            }
                            n.paramlist[c] = d;
                            break;
                        case"technique":
                            var o = y.getChild(x).getChild(w);
                            for (var v = 0; v < o.getChildNum(); ++v) {
                                switch (o.getChild(v).getName()) {
                                    case"phong":
                                        for (var u = 0; u < o.getChild(v).getChildNum(); ++u) {
                                            switch (o.getChild(v).getChild(u).getName()) {
                                                case"emission":
                                                case"ambient":
                                                case"diffuse":
                                                case"specular":
                                                case"reflective":
                                                case"transparent":
                                                    var f = o.getChild(v).getChild(u);
                                                    for (var t = 0; t < f.getChildNum(); ++t) {
                                                        switch (f.getChild(t).getName()) {
                                                            case"color":
                                                                var s = new Object();
                                                                s.TYPE = "value";
                                                                var a = okTrim(f.getChild(t).getText()).split(" ");
                                                                s.value = new okVec3(parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]));
                                                                p[f.getName()] = s;
                                                                break;
                                                            case"param":
                                                                var s = new Object();
                                                                s.TYPE = "param";
                                                                s.value = f.getChild(t).getAttribValueString("ref", true);
                                                                p[f.getName()] = s;
                                                                break;
                                                            case"texture":
                                                                var s = new Object();
                                                                s.TYPE = "texture";
                                                                s.value = f.getChild(t).getAttribValueString("texture", true);
                                                                s.texcoord = f.getChild(t).getAttribValueString("texcoord", true);
                                                                p[f.getName()] = s;
                                                                break;
                                                            default:
                                                        }
                                                    }
                                                    break;
                                                case"reflectivity":
                                                case"transparency":
                                                case"index_of_refraction":
                                                case"shininess":
                                                    var f = o.getChild(v).getChild(u);
                                                    var h = parseFloat(f.getChild("float").getText());
                                                    var s = new Object();
                                                    s.TYPE = "value";
                                                    s.value = h;
                                                    p[f.getName()] = s;
                                                    break;
                                                default:
                                            }
                                        }
                                        break;
                                    case"lambert":
                                        break;
                                    case"blinn":
                                        break;
                                    case"constant":
                                        break;
                                    default:
                                }
                            }
                            break;
                        default:
                    }
                }
                break;
            default:
        }
    }
    return n
};
okResourceParser._parseColladaNode = function (a, p, f) {
    var u = f.clone();
    for (var m = 0; m < p.getChildNum(); ++m) {
        switch (p.getChild(m).getName()) {
            case"matrix":
                var q = okTrim(p.getChild(m).getText()).split(/\s/);
                var t = new Array();
                for (var k = 0; k < q.length; ++k) {
                    if (!isNaN(parseFloat(q[k]))) {
                        t.push(parseFloat(q[k]))
                    }
                }
                var s = new okMat4();
                s.set(t);
                u = okMat4Mul(u, s);
                break;
            case"rotate":
                var q = okTrim(p.getChild(m).getText()).split(/\s/);
                var t = new Array();
                for (var k = 0; k < q.length; ++k) {
                    if (!isNaN(parseFloat(q[k]))) {
                        t.push(parseFloat(q[k]))
                    }
                }
                u.rot(1, t[3], t[0], t[1], t[2], true);
                break;
            case"scale":
                var q = okTrim(p.getChild(m).getText()).split(/\s/);
                var t = new Array();
                for (var k = 0; k < q.length; ++k) {
                    if (!isNaN(parseFloat(q[k]))) {
                        t.push(parseFloat(q[k]))
                    }
                }
                u.scale(1, t[0], t[1], t[2], true);
                break;
            case"skew":
                break;
            case"translate":
                var q = okTrim(p.getChild(m).getText()).split(/\s/);
                var t = new Array();
                for (var k = 0; k < q.length; ++k) {
                    if (!isNaN(parseFloat(q[k]))) {
                        t.push(parseFloat(q[k]))
                    }
                }
                u.translate(1, t[0], t[1], t[2], true);
                break;
            case"instance_geometry":
                var h = new Object();
                h.matrix = u.clone();
                h.refGeoID = p.getChild(m).getAttribValueString("url", true).substr(1);
                h.materialMap = new Object();
                var c = p.getChild(m).getChild("bind_material");
                if (c) {
                    if (c.getChild("technique_common")) {
                        var n = c.getChild("technique_common");
                        for (var k = 0; k < n.getChildNum(); ++k) {
                            switch (n.getChild(k).getName()) {
                                case"instance_material":
                                    var e = n.getChild(k).getAttribValueString("symbol", true);
                                    var o = n.getChild(k).getAttribValueString("target", true).substr(1);
                                    h.materialMap[e] = o;
                                    for (var d = 0; d < n.getChild(k).getChildNum(); ++d) {
                                        switch (n.getChild(k).getChild(d).getName()) {
                                            case"bind":
                                                var e = n.getChild(k).getChild(d).getAttribValueString("semantic", true);
                                                var o = n.getChild(k).getChild(d).getAttribValueString("target", true);
                                                h.materialMap[e] = o;
                                                break;
                                            case"bind_vertex_input":
                                                var e = n.getChild(k).getChild(d).getAttribValueString("semantic", true);
                                                var o = n.getChild(k).getChild(d).getAttribValueString("input_semantic", true);
                                                h.materialMap[e] = o;
                                                break;
                                            default:
                                        }
                                    }
                                    break
                            }
                        }
                    }
                }
                a.push(h);
                break;
            case"node":
                this._parseColladaNode(a, p.getChild(m), u);
                break;
            default:
        }
    }
};
okResourceParser._loadModelFromCollada = function (h, J, u, ad) {
    if (J.getName().toLowerCase() != "collada") {
        okLog("[Error][okResourceParser._loadModelFromCollada] Invalid Collada XML document");
        return false
    }
    h.clear();
    var ag = new Object();
    if (u) {
        for (var aa = 0; aa < u.length; ++aa) {
            ag[u[aa]] = true
        }
    }
    var L = new Object();
    var D = new Object();
    var I = new Object();
    var G = new Object();
    var p = new Object();
    for (var ab = 0; ab < J.getChildNum(); ++ab) {
        var B = J.getChild(ab);
        switch (B.getName()) {
            case"library_geometries":
                for (var aa = 0; aa < B.getChildNum(); ++aa) {
                    if (B.getChild(aa).getName() == "geometry") {
                        var m = B.getChild(aa);
                        var P = m.getAttribValueString("name", true);
                        if (okIsUndefined(u) || u == null || ag[P]) {
                            var Q = m.getAttribValueString("id", true);
                            var O = this._loadColladaGeometry(m);
                            if (O) {
                                L[Q] = O
                            }
                        }
                    }
                }
                break;
            case"library_visual_scenes":
                for (var aa = 0; aa < B.getChildNum(); ++aa) {
                    if (B.getChild(aa).getName() == "visual_scene") {
                        var ac = B.getChild(aa);
                        var M = ac.getAttribValueString("id", true);
                        var w = new Object();
                        var E = new Array();
                        w.nodes = E;
                        for (var Z = 0; Z < ac.getChildNum(); ++Z) {
                            if (ac.getChild(Z).getName() == "node") {
                                var y = ac.getChild(Z);
                                var N = new okMat4();
                                this._parseColladaNode(E, y, N)
                            }
                        }
                        D[M] = w
                    }
                }
                break;
            case"library_effects":
                for (var aa = 0; aa < B.getChildNum(); ++aa) {
                    if (B.getChild(aa).getName() == "effect") {
                        var ae = B.getChild(aa);
                        var Q = ae.getAttribValueString("id", true);
                        var Y = this._loadColladaEffect(ae);
                        if (Y) {
                            I[Q] = Y
                        }
                    }
                }
                break;
            case"library_images":
                for (var aa = 0; aa < B.getChildNum(); ++aa) {
                    var F = B.getChild(aa);
                    var a = F.getAttribValueString("id", true);
                    var af = F.getChild("init_from").getText();
                    p[a] = af
                }
                break;
            case"library_materials":
                for (var aa = 0; aa < B.getChildNum(); ++aa) {
                    switch (B.getChild(aa).getName()) {
                        case"material":
                            var f = B.getChild(aa);
                            var d = f.getAttribValueString("id", true);
                            var e = f.getChild("instance_effect");
                            var t = new Object();
                            t.refEffect = e.getAttribValueString("url", true).substr(1);
                            var n = new Object();
                            t.paramList = n;
                            for (var Z = 0; Z < e.getChildNum(); ++Z) {
                                switch (e.getChild(Z).getName()) {
                                    case"setparam":
                                        var V = e.getChild(Z).getAttribValueString("ref", true);
                                        var x = new Object();
                                        x.TYPE = "value";
                                        var T = okTrim(e.getChild(Z).getChild(0).getText()).split(" ");
                                        if (T.length == 4) {
                                            x.value = new okVec4(parseFloat(T[0]), parseFloat(T[1]), parseFloat(T[2]), parseFloat(T[3]))
                                        }
                                        if (T.length == 3) {
                                            x.value = new okVec3(parseFloat(T[0]), parseFloat(T[1]), parseFloat(T[2]))
                                        }
                                        if (T.length == 1) {
                                            x.value = parseFloat(T[0])
                                        }
                                        n[V] = x;
                                        break;
                                    default:
                                }
                            }
                            G[d] = t;
                            break;
                        default:
                    }
                }
                break;
            case"scene":
                h.clear();
                for (var aa = 0; aa < B.getChildNum(); ++aa) {
                    if (B.getChild(aa).getName() == "instance_visual_scene") {
                        var ai = B.getChild(aa).getAttribValueString("url", true).substr(1);
                        if (D[ai]) {
                            for (var Z = 0; Z < D[ai]["nodes"].length; ++Z) {
                                var s = L[D[ai]["nodes"][Z].refGeoID];
                                var K = D[ai]["nodes"][Z].materialMap;
                                for (var X = 0; X < s.length; ++X) {
                                    var U = s[X];
                                    var A = h.createMesh(U.meshName);
                                    for (var c in U) {
                                        var C = U[c];
                                        if (C.data && C.data.length > 0) {
                                            A.createAttribute(c, C.data.length, C.data);
                                            A.setVertexNum(C.data.length / C.data.stride)
                                        }
                                        if (C.$95 && C.$95.length > 0) {
                                            A.createIndex("Default", C.$95.length, C.$95, 35044, U.indexTopology)
                                        }
                                    }
                                    A.setMat(D[ai]["nodes"][Z].matrix);
                                    if (U.material && K[U.material]) {
                                        var q = K[U.material];
                                        var W = I[G[q]["refEffect"]];
                                        var o = G[q]["paramList"];
                                        if (W) {
                                            var H = A.getMaterial();
                                            for (var R in W.attrList) {
                                                var x = W.attrList[R];
                                                var v = x.texcoord;
                                                if (x.TYPE == "param" || x.TYPE == "texture") {
                                                    var V = x.value;
                                                    if (o[V]) {
                                                        x = o[V]
                                                    } else {
                                                        x = W.paramlist[V]
                                                    }
                                                }
                                                switch (R) {
                                                    case"emission":
                                                        H.setEmissive(x.value);
                                                        break;
                                                    case"ambient":
                                                        H.setAmbient(x.value);
                                                        break;
                                                    case"diffuse":
                                                        if (x.TYPE != "texture") {
                                                            H.setDiffuse(x.value)
                                                        } else {
                                                            var z = x.value;
                                                            for (var ah in z) {
                                                                switch (ah) {
                                                                    case"instance_image":
                                                                        H.setTextureName(0, okGetFileName(z[ah]));
                                                                        break;
                                                                    case"init_from":
                                                                        H.setTextureName(0, okGetFileName(p[z[ah]]));
                                                                        break;
                                                                    default:
                                                                }
                                                            }
                                                            var S = K[v];
                                                            H.setTextureCoord(0, S)
                                                        }
                                                        break;
                                                    case"specular":
                                                        H.setSpecular(x.value);
                                                        break;
                                                    case"reflective":
                                                    case"transparent":
                                                        break;
                                                    case"transparency":
                                                        H.setAlpha(x.value);
                                                        break;
                                                    case"shininess":
                                                        H.setGlossiness(x.value);
                                                        break;
                                                    case"reflectivity":
                                                    case"index_of_refraction":
                                                        break
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break
        }
    }
    return true
};
okResourceParser._loadModelBinary = function (f, n, m, p) {
    var d = new okBinDoc(n, "OKMDBI");
    if (!d.isValid()) {
        okLog("[Error][okResourceParser.loadModel] Invalid Oak Model Binary document");
        return false
    }
    var u = d.getRootNode();
    var q = u.getAttribValueString("Version");
    var w = q.split(".");
    f.clear();
    var e = new Array;
    var h = u.getChild("MaterialList");
    if (h) {
        for (var c in h.getChildMap()) {
            var a = h.getChild(c);
            var k = new okMaterial(f.rc);
            if (this._parseMaterialBinary(c, a, k, p) == false) {
                return false
            }
            e[c] = k
        }
    }
    var o = u.getChild("MeshList");
    if (o) {
        var l = okA.object();
        if (m) {
            for (var v in o.getChildMap()) {
                l[v] = true
            }
        }
        var t = o.getChildNum();
        for (var v in o.getChildMap()) {
            var s = o.getChild(v);
            if (m && l[v] == null) {
                continue
            }
            if (this._parseMeshBinary(v, s, f, e, p) == false) {
                return false
            }
        }
        okA._object(l)
    }
    f._splitMeshes();
    f.computeBoundingInfo();
    return true
};
okResourceParser._parseMaterialBinary = function (v, l, u, c) {
    u.setDesc(v);
    if (l.isAttribExisted("Emissive")) {
        u.setEmissive(l.getAttribValueVec3("Emissive"))
    }
    if (l.isAttribExisted("Ambient")) {
        u.setAmbient(l.getAttribValueVec3("Ambient"))
    }
    if (l.isAttribExisted("Diffuse")) {
        u.setDiffuse(l.getAttribValueVec3("Diffuse"))
    }
    if (l.isAttribExisted("Specular")) {
        u.setSpecular(l.getAttribValueVec3("Specular"))
    }
    if (l.isAttribExisted("SpecularLevel")) {
        u.setSpecularLevel(l.getAttribValueFloat("SpecularLevel"))
    }
    if (l.isAttribExisted("Glossiness")) {
        u.setGlossiness(l.getAttribValueFloat("Glossiness"))
    }
    if (l.isAttribExisted("Alpha")) {
        u.setAlpha(l.getAttribValueFloat("Alpha"))
    }
    if (l.isAttribExisted("Blend")) {
        u.enableBlend(l.getAttribValueInt("Blend") == 1)
    }
    if (l.isAttribExisted("AlphaTest")) {
        u.enableAlphaTest(l.getAttribValueInt("AlphaTest") == 1)
    }
    if (l.isAttribExisted("AlphaTestValue")) {
        u.setAlphaTestValue(l.getAttribValueFloat("AlphaTestValue"))
    }
    if (l.isAttribExisted("DynamicLighting")) {
        u.enableDynamicLighting(l.getAttribValueInt("DynamicLighting") == 1)
    }
    if (l.isAttribExisted("Wireframe")) {
        u.enableWireframe(l.getAttribValueInt("Wireframe") == 1)
    }
    if (l.isAttribExisted("VertexColor")) {
        u.enableVertexColor(l.getAttribValueInt("VertexColor") == 1)
    }
    if (l.isAttribExisted("DepthTest")) {
        u.enableDepthTest(l.getAttribValueInt("DepthTest") == 1)
    }
    if (l.isAttribExisted("TwoSide")) {
        u.enableTwoSide(l.getAttribValueInt("TwoSide") == 1)
    }
    var e = l.getChild("TextureList");
    if (e) {
        for (var t in e.getChildMap()) {
            var d = e.getChild(t);
            var s = 0;
            if (t == "Albedo1") {
                s = 0
            } else {
                if (t == "Albedo2") {
                    s = 1
                } else {
                    if (t == "Albedo3") {
                        s = 2
                    } else {
                        if (t == "Albedo4") {
                            s = 3
                        } else {
                            if (t == "Normal") {
                                s = 4
                            } else {
                                if (t == "Opacity") {
                                    s = 5
                                } else {
                                    if (t == "SpecularLevel") {
                                        s = 6
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var h = d.getAttribValueString("Name");
            if (h) {
                u.setTextureName(s, h)
            }
            var p = d.getAttribValueString("Texcoord");
            if (p) {
                u.setTextureCoord(s, p)
            }
            var o = d.getAttribValueVec2("TexcoordOffset");
            if (o) {
                u.setTextureCoordOffset(s, o)
            }
            var f = d.getAttribValueVec2("TexcoordScale");
            if (f) {
                u.setTextureCoordScale(s, f)
            }
            var k = d.getAttribValueString("Tangent");
            if (k) {
                u.setTextureTangent(s, k)
            }
            var n = d.getAttribValueString("Binormal");
            if (n) {
                u.setTextureBinormal(s, n)
            }
            var a = d.getAttribValueString("Type");
            if (a) {
                if (a == "2D") {
                    u.setTextureType(s, 3553)
                } else {
                    if (a == "Cube") {
                        u.setTextureType(s, 34067)
                    }
                }
            }
            var q = d.getAttribValueString("Filter");
            if (q) {
                if (q == "Linear") {
                    u.setTextureFilter(s, 9729)
                } else {
                    if (q == "Nearest") {
                        u.setTextureFilter(s, 9728)
                    }
                }
            }
            var m = d.getAttribValueString("Wrap");
            if (m) {
                if (m == "Repeat") {
                    u.setTextureWrap(s, 10497)
                } else {
                    if (m == "Clamp") {
                        u.setTextureWrap(s, 33071)
                    } else {
                        if (m == "Mirror") {
                            u.setTextureWrap(s, 33648)
                        }
                    }
                }
            }
            var m = d.getAttribValueString("WrapU");
            if (m) {
                if (m == "Repeat") {
                    u.setTextureWrapU(s, 10497)
                } else {
                    if (m == "Clamp") {
                        u.setTextureWrapU(s, 33071)
                    } else {
                        if (m == "Mirror") {
                            u.setTextureWrapU(s, 33648)
                        }
                    }
                }
            }
            var m = d.getAttribValueString("WrapV");
            if (m) {
                if (m == "Repeat") {
                    u.setTextureWrapV(s, 10497)
                } else {
                    if (m == "Clamp") {
                        u.setTextureWrapV(s, 33071)
                    } else {
                        if (m == "Mirror") {
                            u.setTextureWrapV(s, 33648)
                        }
                    }
                }
            }
        }
    }
    return true
};
okResourceParser._parseMeshBinary = function (p, d, c, s, M) {
    var y = (d.getAttribValueInt("VertexCount") ? d.getAttribValueInt("VertexCount") : 0);
    var E = (d.getChild("IndexList") ? d.getChild("IndexList").getChildNum() : 0);
    var l = d.getAttribValueMat4("Matrix");
    var G = okA.object();
    var F = okA.object();
    var e = okA.object();
    var I = okA.object();
    var A = {Triangles:4, TriangleStrip:5, TriangleFan:6, Lines:1, LineStrip:3, LineLoop:2, Points:0};
    var f = d.getChild("AttributeList");
    for (var a in f.getChildMap()) {
        var D = f.getChild(a);
        var o = a;
        var k = D.getAttribValueFloatArray("Data");
        var m = k.length / y;
        if (m - Math.floor(m) != 0) {
            okLog("[Error][okResourceParser.loadModel]Failed to parse mesh attribute: " + o + "!");
            return false
        }
        G[o] = k;
        F[o] = m
    }
    var N = d.getChild("IndexList");
    for (var n in N.getChildMap()) {
        var q = N.getChild(n);
        var o = n;
        var k = (y <= 65536 ? q.getAttribValueUshortArray("Data") : q.getAttribValueIntArray("Data"));
        var K = q.getAttribValueString("Topology");
        e[o] = k;
        I[o] = A[K ? K : "Triangles"]
    }
    if (M) {
        var L = okA.array();
        var O = this._packMeshAttributes(y, G, F, L);
        okA._object(G);
        G = okA.object();
        G[O] = L;
        okA._object(F);
        F = okA.object();
        F[O] = L.length / y
    }
    var u = c.createMesh(p);
    if (l) {
        u.setMat(l)
    }
    for (var a in G) {
        var x = G[a];
        if (x.length > 0) {
            u.createAttribute(a, x.length, x)
        }
    }
    for (var n in e) {
        var z = e[n];
        if (z.length > 0) {
            u.createIndex(n, z.length, z, 35044, I[n])
        }
    }
    u.setVertexNum(y);
    okA._object(G);
    okA._object(F);
    okA._object(e);
    okA._object(I);
    var H = d.getChild("Skin");
    if (H) {
        var t = u.getSkin();
        t.clear();
        var J = H.getChild("BoundingBox");
        t.setBoundingBox(J.getAttribValueVec3("Min"), J.getAttribValueVec3("Max"));
        var w = H.getChild("BoneList");
        for (var B in w.getChildMap()) {
            var v = w.getChild(B);
            t.addBone(B, v.getAttribValueMat43("InitMatrix"))
        }
        t.setRefAttributeName(H.getAttribValueString("VertexBoneIndexAttribName"), H.getAttribValueString("VertexBoneWeightAttribName"))
    }
    var J = d.getChild("BoundingBox");
    var h = new okAABBox(J.getAttribValueVec3("Min"), J.getAttribValueVec3("Max"));
    if (l) {
        h.transformMat4(l)
    }
    u.setBoundingBox(h);
    var C = d.getAttribValueString("Material");
    if (C && C != "") {
        s[C].clone(u.getMaterial())
    }
};
okResourceParser._loadModelCollada = function (d, h, e, a) {
    var c = h.indexOf("<");
    var m = h.lastIndexOf(">");
    if (c == -1 || m == -1) {
        return false
    }
    var l = okParseXML(h.substr(c, m - c + 1));
    if (l == null) {
        return false
    }
    var f = new okXmlDoc(l);
    var k = f.getRootNode();
    if (!this._loadModelFromCollada(d, k, e, a)) {
        okLog("[Error][okResourceParser._loadModelFromCollada] Invalid Collada XML document");
        return false
    }
    d._splitMeshes();
    d.computeBoundingInfo();
    return true
};
okResourceParser._loadModelXML = function (h, p, n, q) {
    var A = p.indexOf("<");
    var c = p.lastIndexOf(">");
    if (A == -1 || c == -1) {
        return false
    }
    var o = okParseXML(p.substr(A, c - A + 1));
    if (o == null) {
        return false
    }
    var e = new okXmlDoc(o);
    var w = e.getRootNode();
    if (w.getName().toLowerCase() != "oak3dmodeldocument") {
        okLog("[Error][okResourceParser.loadModel] Invalid Oak Model XML document");
        return false
    }
    var s = w.getAttribValueString("Version", true);
    var z = s.split(".");
    h.clear();
    var f = new Array;
    for (var y = 0; y < w.getChildNum(); ++y) {
        var d = w.getChild(y);
        if (d.getName() == "MaterialList") {
            var m = d.getChildNum();
            for (var x = 0; x < m; ++x) {
                var a = d.getChild(x);
                var k = new okMaterial(h.rc);
                if (this._parseMaterialXML(a, k, q) == false) {
                    return false
                }
                f[a.getAttribValueString("Name")] = k
            }
        } else {
            if (d.getName() == "MeshList") {
                var l = okA.object();
                if (n) {
                    for (var x = 0; x < n.length; ++x) {
                        l[n[x]] = true
                    }
                }
                var u = d.getChildNum();
                for (var x = 0; x < u; ++x) {
                    var t = d.getChild(x);
                    var v = t.getAttribValueString("Name", true);
                    if (n && l[v] == null) {
                        continue
                    }
                    if (this._parseMeshXML(d.getChild(x), h, f, q) == false) {
                        return false
                    }
                }
                okA._object(l)
            }
        }
    }
    h._splitMeshes();
    h.computeBoundingInfo();
    return true
};
okResourceParser._parseMaterialXML = function (a, u, n) {
    var v = a.getAttribValueString("name", true);
    if (v == null) {
        v = a.getAttribValueString("desc", true)
    }
    if (v) {
        u.setDesc(v)
    }
    var s = a.getAttribNum();
    for (var q = 0; q < s; ++q) {
        var l = a.getAttribName(q).toLowerCase();
        switch (l) {
            case"emissive":
                u.setEmissive(a.getAttribValueVec3(q));
                break;
            case"ambient":
                u.setAmbient(a.getAttribValueVec3(q));
                break;
            case"diffuse":
                u.setDiffuse(a.getAttribValueVec3(q));
                break;
            case"specular":
                u.setSpecular(a.getAttribValueVec3(q));
                break;
            case"specularlevel":
                u.setSpecularLevel(a.getAttribValueFloat(q));
                break;
            case"glossiness":
                u.setGlossiness(a.getAttribValueFloat(q));
                break;
            case"alpha":
                u.setAlpha(a.getAttribValueFloat(q));
                break;
            case"blend":
                u.enableBlend(a.getAttribValueString(q).toLowerCase() == "true");
                break;
            case"alphatest":
                u.enableAlphaTest(a.getAttribValueString(q).toLowerCase() == "true");
                break;
            case"alphatestvalue":
                u.setAlphaTestValue(a.getAttribValueFloat(q));
                break;
            case"dynamiclighting":
                u.enableDynamicLighting(a.getAttribValueString(q).toLowerCase() == "true");
                break;
            case"wireframe":
                u.enableWireframe(a.getAttribValueString(q).toLowerCase() == "true");
                break;
            case"vertexcolor":
                u.enableVertexColor(a.getAttribValueString(q).toLowerCase() == "true");
                break;
            case"depthtest":
                u.enableDepthTest(a.getAttribValueString(q).toLowerCase() == "true");
                break;
            case"twoside":
                u.enableTwoSide(a.getAttribValueString(q).toLowerCase() == "true");
                break
        }
    }
    for (var q = 0; q < a.getChildNum(); ++q) {
        var c = a.getChild(q);
        if (c.getName() == "Texture") {
            var e = c.getAttribValueString("channel", true).toLowerCase();
            var w = 0;
            if (e == "albedo1") {
                w = 0
            } else {
                if (e == "albedo2") {
                    w = 1
                } else {
                    if (e == "albedo3") {
                        w = 2
                    } else {
                        if (e == "albedo4") {
                            w = 3
                        } else {
                            if (e == "normal") {
                                w = 4
                            } else {
                                if (e == "opacity") {
                                    w = 5
                                } else {
                                    if (e == "specularlevel") {
                                        w = 6
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var s = c.getAttribNum();
            for (var p = 0; p < s; ++p) {
                var l = c.getAttribName(p).toLowerCase();
                switch (l) {
                    case"name":
                        u.setTextureName(w, c.getAttribValueString(p));
                        break;
                    case"texcoord":
                        u.setTextureCoord(w, c.getAttribValueString(p));
                        break;
                    case"texcoordoffset":
                        u.setTextureCoordOffset(w, c.getAttribValueVec2(p));
                        break;
                    case"texcoordscale":
                        u.setTextureCoordScale(w, c.getAttribValueVec2(p));
                        break;
                    case"type":
                        var f = c.getAttribValueString(p).toLowerCase();
                        if (f == "2d") {
                            u.setTextureType(w, 3553)
                        } else {
                            if (f == "cube") {
                                u.setTextureType(w, 34067)
                            }
                        }
                        break;
                    case"filter":
                        var h = c.getAttribValueString(p).toLowerCase();
                        if (h == "linear") {
                            u.setTextureFilter(w, 9729)
                        } else {
                            if (h == "nearest") {
                                u.setTextureFilter(w, 9728)
                            }
                        }
                        break;
                    case"wrap":
                        var o = c.getAttribValueString(p).toLowerCase();
                        if (o == "repeat") {
                            u.setTextureWrap(w, 10497)
                        } else {
                            if (o == "clamp") {
                                u.setTextureWrap(w, 33071)
                            } else {
                                if (o == "mirror") {
                                    u.setTextureWrap(w, 33648)
                                }
                            }
                        }
                        break;
                    case"wrapu":
                        var o = c.getAttribValueString(p).toLowerCase();
                        if (o == "repeat") {
                            u.setTextureWrapU(w, 10497)
                        } else {
                            if (o == "clamp") {
                                u.setTextureWrapU(w, 33071)
                            } else {
                                if (o == "mirror") {
                                    u.setTextureWrapU(w, 33648)
                                }
                            }
                        }
                        break;
                    case"wrapv":
                        var o = c.getAttribValueString(p).toLowerCase();
                        if (o == "repeat") {
                            u.setTextureWrapV(w, 10497)
                        } else {
                            if (o == "clamp") {
                                u.setTextureWrapV(w, 33071)
                            } else {
                                if (o == "mirror") {
                                    u.setTextureWrapV(w, 33648)
                                }
                            }
                        }
                        break;
                    case"tangent":
                        u.setTextureTangent(w, c.getAttribValueString(p));
                        break;
                    case"binormal":
                        u.setTextureBinormal(w, c.getAttribValueString(p));
                        break
                }
            }
        } else {
            if (c.getName().toLowerCase() == ("Script").toLowerCase()) {
                for (var p = 0; p < c.getChildNum(); ++p) {
                    var m = c.getChild(p);
                    var t = m.getName().toLowerCase();
                    var d = m.getAttribValueString("Code", true);
                    if (d == null) {
                        d = m.getText()
                    }
                    var k = m.getAttribValueString("Enable", true);
                    if (t == "emissive") {
                        if (d) {
                            u.setEmissiveScript(d)
                        }
                        if (k) {
                            u.enableEmissiveScript(k.toLowerCase() == "true")
                        }
                    } else {
                        if (t == "diffuse") {
                            if (d) {
                                u.setDiffuseScript(d)
                            }
                            if (k) {
                                u.enableDiffuseScript(k.toLowerCase() == "true")
                            }
                        } else {
                            if (t == "specular") {
                                if (d) {
                                    u.setSpecularScript(d)
                                }
                                if (k) {
                                    u.enableSpecularScript(k.toLowerCase() == "true")
                                }
                            } else {
                                if (t == "specularpower") {
                                    if (d) {
                                        u.setSpecularPowerScript(d)
                                    }
                                    if (k) {
                                        u.enableSpecularPowerScript(k.toLowerCase() == "true")
                                    }
                                } else {
                                    if (t == "normal") {
                                        if (d) {
                                            u.setNormalScript(d)
                                        }
                                        if (k) {
                                            u.enableNormalScript(k.toLowerCase() == "true")
                                        }
                                    } else {
                                        if (t == "alpha") {
                                            if (d) {
                                                u.setAlphaScript(d)
                                            }
                                            if (k) {
                                                u.enableAlphaScript(k.toLowerCase() == "true")
                                            }
                                        } else {
                                            if (t == "dctlight") {
                                                if (d) {
                                                    u.setDctLightScript(d)
                                                }
                                                if (k) {
                                                    u.enableDctLightScript(k.toLowerCase() == "true")
                                                }
                                            } else {
                                                if (t == "pointlight") {
                                                    if (d) {
                                                        u.setPointLightScript(d)
                                                    }
                                                    if (k) {
                                                        u.enablePointLightScript(k.toLowerCase() == "true")
                                                    }
                                                } else {
                                                    if (t == "spotlight") {
                                                        if (d) {
                                                            u.setSpotLightScript(d)
                                                        }
                                                        if (k) {
                                                            u.enableSpotLightScript(k.toLowerCase() == "true")
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true
};
okResourceParser._packMeshAttributes = function (n, a, m, p) {
    var f = new okList();
    for (var o in a) {
        if (o.toLowerCase() == "position" || o.toLowerCase().indexOf("position/") == 0) {
            f.pushFront(o)
        } else {
            if (o != "Texcoord1" && o != "Texcoord2" && o != "Texcoord3" && o != "Texcoord4") {
                f.pushBack(o)
            }
        }
    }
    if (a.Texcoord1) {
        f.pushBack("Texcoord1")
    }
    if (a.Texcoord2) {
        f.pushBack("Texcoord2")
    }
    if (a.Texcoord3) {
        f.pushBack("Texcoord3")
    }
    if (a.Texcoord4) {
        f.pushBack("Texcoord4")
    }
    for (var l = 0; l < n; ++l) {
        var e = f.getRoot();
        while (e) {
            var o = e.data;
            var k = a[o];
            var d = m[o];
            for (var h = 0; h < d; ++h) {
                p.push(k[l * d + h])
            }
            e = e.next
        }
    }
    var c = "";
    var e = f.getRoot();
    while (e) {
        c += (c != "" ? "/" : "") + e.data;
        e = e.next
    }
    return c
};
okResourceParser._parseMeshXML = function (e, c, t, M) {
    if (e.getName() != "Mesh") {
        return false
    }
    var q = e.getAttribValueString("Name", true);
    var y = (e.getAttribValueInt("VertexCount", true) ? e.getAttribValueInt("VertexCount", true) : 0);
    var D = (e.getChild("IndexList", true) ? e.getChild("IndexList", true).getChildNum() : 0);
    var m = e.getAttribValueMat4("Matrix");
    var F = okA.object();
    var E = okA.object();
    var f = okA.object();
    var H = okA.object();
    var A = {triangles:4, trianglestrip:5, trianglefan:6, lines:1, linestrip:3, lineloop:2, points:0};
    var h = e.getChild("AttributeList", true);
    for (var K = 0; K < h.getChildNum(); ++K) {
        var C = h.getChild(K);
        if (C.getName().toLowerCase() == "attribute") {
            var p = C.getAttribValueString("Name", true);
            var l = C.getAttribValueFloatArray("Data", true);
            var n = l.length / y;
            if (n - Math.floor(n) != 0) {
                okLog("[Error][okResourceParser.loadModel]Failed to parse model attribute: " + p + "!");
                return false
            }
            F[p] = l;
            E[p] = n
        }
    }
    var N = e.getChild("IndexList", true);
    for (var K = 0; K < N.getChildNum(); ++K) {
        var s = N.getChild(K);
        if (s.getName().toLowerCase() == "index") {
            var p = s.getAttribValueString("Name", true);
            var l = s.getAttribValueIntArray("Data", true);
            var I = s.getAttribValueString("Topology", true);
            if (I) {
                I = I.toLowerCase()
            }
            f[p] = l;
            H[p] = A[I ? I : "triangles"]
        }
    }
    if (M) {
        var J = okA.array();
        var O = this._packMeshAttributes(y, F, E, J);
        okA._object(F);
        F = okA.object();
        F[O] = J;
        okA._object(E);
        E = okA.object();
        E[O] = J.length / y
    }
    var v = c.createMesh(q);
    if (m) {
        v.setMat(m)
    }
    for (var a in F) {
        var x = F[a];
        if (x.length > 0) {
            v.createAttribute(a, x.length, x)
        }
    }
    for (var o in f) {
        var z = f[o];
        if (z.length > 0) {
            v.createIndex(o, z.length, z, 35044, H[o])
        }
    }
    v.setVertexNum(y);
    okA._object(F);
    okA._object(E);
    okA._object(f);
    okA._object(H);
    for (var L = 0; L < e.getChildNum(); ++L) {
        var w = e.getChild(L);
        var d = w.getName();
        switch (d) {
            case"Skin":
                var G = w;
                var u = v.getSkin();
                u.clear();
                for (var K = 0; K < G.getChildNum(); ++K) {
                    var w = G.getChild(K);
                    if (w.getName() == "Bone") {
                        u.addBone(w.getAttribValueString("Name"), w.getAttribValueMat43("InitMatrix"))
                    } else {
                        if (w.getName() == "BoundingBox") {
                            u.setBoundingBox(w.getAttribValueVec3("Min"), w.getAttribValueVec3("Max"))
                        }
                    }
                }
                u.setRefAttributeName(G.getAttribValueString("VertexBoneIndexAttribName"), G.getAttribValueString("VertexBoneWeightAttribName"));
                break;
            case"BoundingBox":
                var k = new okAABBox(w.getAttribValueVec3("Min"), w.getAttribValueVec3("Max"));
                if (m) {
                    k.transformMat4(m)
                }
                v.setBoundingBox(k);
                break
        }
    }
    var B = e.getAttribValueString("Material");
    if (B != "") {
        t[B].clone(v.getMaterial())
    }
};
okResourceParser.loadSkAnimation = function (a, e, d) {
    var c = false;
    if (a == 1) {
        c = this._loadSkAnimationXML(e, d)
    } else {
        if (a == 3) {
            c = this._loadSkAnimationBinary(e, d)
        } else {
            if (this.aAnimParser[a]) {
                c = this.aAnimParser[a](e, d)
            } else {
                okLog("[Error][okResourceParser.loadSkAnimation] Unsupported document type! ")
            }
        }
    }
    return c
};
okResourceParser._loadSkAnimationXML = function (u, o) {
    var A = o.indexOf("<");
    var d = o.lastIndexOf(">");
    if (A == -1 || d == -1) {
        return false
    }
    var n = okParseXML(o.substr(A, d - A + 1));
    var f = new okXmlDoc(n);
    var v = f.getRootNode();
    if (v.getName() != "Oak3DAnimationDocument") {
        okLog("[Error][okResourceParser.loadSkAnimation] Invalid Oak Animation XML document");
        return false
    }
    var p = v.getAttribValueString("Version");
    var z = p.split(".");
    u.clear();
    for (var x = 0; x < v.getChildNum(); ++x) {
        var e = v.getChild(x);
        if (e.getName() == "AnimationInfo") {
        } else {
            if (e.getName() == "KeyFrameList") {
                u.setFrameNum(e.getAttribValueInt("Count"));
                if (e.getAttribValueFloat("FrameTime") != null) {
                    u.setFrameTime(e.getAttribValueFloat("FrameTime"))
                }
                u.loadKeyFrameList(e.getAttribValueIntArray("KeyTimeList"))
            } else {
                if (e.getName() == "BoundingBox") {
                    u.setBoundingBox(e.getAttribValueVec3("Min"), e.getAttribValueVec3("Max"))
                } else {
                    if (e.getName() == "BoneList") {
                        for (var w = 0; w < e.getChildNum(); ++w) {
                            var c = e.getChild(w);
                            if (c.getName() == "Bone") {
                                var h = new okSkAnimBone();
                                var y = new Array;
                                var m = new Array;
                                var q = new Array;
                                h.setName(c.getAttribValueString("Name"));
                                for (var t = 0; t < c.getChildNum(); ++t) {
                                    var a = c.getChild(t);
                                    y.push(a.getAttribValueVec3("Translation"));
                                    m.push(a.getAttribValueQuat("Rotation"));
                                    q.push(a.getAttribValueVec3("Scale"))
                                }
                                h.loadKeyTranslateList(y);
                                h.loadKeyQuaternionList(m);
                                h.loadKeyScaleList(q);
                                u.addBone(h)
                            }
                        }
                        for (var w = 0; w < e.getChildNum(); ++w) {
                            var c = e.getChild(w);
                            if (c.getName() == "Bone") {
                                var l = u.getBone(c.getAttribValueString("Name"));
                                var s = c.getAttribValueString("Parent");
                                if (s != "") {
                                    l.setParent(u.getBone(s))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return true
};
okResourceParser._loadSkAnimationBinary = function (u, n) {
    var f = new okBinDoc(n, "OKAMBI");
    if (!f.isValid()) {
        okLog("[Error][okResourceParser.loadModel] Invalid Oak Animation Binary document");
        return false
    }
    var v = f.getRootNode();
    var p = v.getAttribValueString("Version");
    var z = p.split(".");
    u.clear();
    var d = v.getChild("AnimationInfo");
    var t = v.getChild("KeyFrameList");
    if (t) {
        u.setFrameNum(t.getAttribValueInt("Count"));
        if (t.isAttribExisted("FrameTime")) {
            u.setFrameTime(t.getAttribValueFloat("FrameTime"))
        }
        u.loadKeyFrameList(t.getAttribValueIntArray("KeyTimeList"))
    }
    var o = v.getChild("BoneList");
    if (o) {
        for (var e in o.getChildMap()) {
            var c = o.getChild(e);
            var h = new okSkAnimBone();
            var x = new Array;
            var m = new Array;
            var q = new Array;
            h.setName(e);
            var k = c.getChild("KeyList");
            if (k) {
                for (var w = 0; w < k.getChildNum(); ++w) {
                    var a = k.getChild(w);
                    var y = a.getAttribValueFloatArray("TQ");
                    x.push(new okVec3(y[0], y[1], y[2]));
                    m.push(new okQuat(y[3], y[4], y[5], y[6]));
                    if (y.length >= 10) {
                        q.push(new okVec3(y[7], y[8], y[9]))
                    } else {
                        q.push(null)
                    }
                }
                h.loadKeyTranslateList(x);
                h.loadKeyQuaternionList(m);
                h.loadKeyScaleList(q)
            }
            u.addBone(h)
        }
        for (var e in o.getChildMap()) {
            var c = o.getChild(e);
            var l = u.getBone(e);
            var s = c.getAttribValueString("Parent");
            if (s != "") {
                l.setParent(u.getBone(s))
            }
        }
    }
    return true
};
okResourceParser.loadShaderSource = function (h, q, k, c) {
    var f = okPackXMLShaderSource(c);
    var n = new okXmlDoc(okParseXML(f));
    var p = n.getRootNode();
    if (p.getName().toLowerCase() != ("OakShader").toLowerCase()) {
        okLog("[Error][okResourceParser.loadShaderSource] Invalid Oak Shader XML document");
        return false
    }
    var e = p.getChild("Common", true);
    var m = okUnpackXMLShaderSource((e != null) ? e.getText() : "");
    if (q != null) {
        var l = p.getChild("Vertex", true);
        if (l != null) {
            var d = "";
            var a = okUnpackXMLShaderSource(l.getText());
            q.loadSource(m + "\n" + a)
        } else {
            okLog("[Error][okResourceParser.loadShaderSource] Could not find vertex shader in XML Document!");
            return false
        }
    }
    if (k != null) {
        var o = p.getChild("Fragment", true);
        if (o != null) {
            var a = okUnpackXMLShaderSource(o.getText());
            k.loadSource(m + "\n" + a)
        } else {
            okLog("[Error][okResourceParser.loadShaderSource] Could not find fragment shader in XML Document!");
            return false
        }
    }
    return true
};
okResourceParser.loadShaderSourceToMap = function (h, k, c) {
    var d = okPackXMLShaderSource(c);
    var l = new okXmlDoc(okParseXML(d));
    var m = l.getRootNode();
    if (m.getName().toLowerCase() != ("OakShader").toLowerCase()) {
        okLog("[Error][okResourceParser.loadShaderSourceToMap] Invalid Oak Shader XML document");
        return false
    }
    if (k == null) {
        okLog("[Error][okResourceParser.loadShaderSourceToMap] The parameter SourceMap is null !");
        return false
    }
    var e = m.getChildNum();
    for (var f = 0; f < e; ++f) {
        var a = m.getChild(f);
        var c = okUnpackXMLShaderSource(a.getText());
        k[a.getName()] = c
    }
    return true
};
okResourceParser.loadTextureFromImage = function (d, e, c) {
    if (!okIsPower2(e.width) || !okIsPower2(e.height)) {
        if (okIsUndefined(this.texSupportedCanvas) && !okIsIE()) {
            this.texSupportedCanvas = document.createElement("canvas")
        }
        if (this.texSupportedCanvas) {
            this.texSupportedCanvas.width = okAlignPower2(e.width);
            this.texSupportedCanvas.height = okAlignPower2(e.height);
            var a = this.texSupportedCanvas.getContext("2d");
            a.drawImage(e, 0, 0, e.width, e.height, 0, 0, this.texSupportedCanvas.width, this.texSupportedCanvas.height);
            e = this.texSupportedCanvas
        } else {
            return false
        }
    }
    d.createTexture(3553, e.width, e.height, c, 5121, e);
    return true
};
okResourceParser.loadTextureFromVideo = function (c, d, a) {
    c.createTexture(3553, d.width, d.height, a, 5121, d);
    return true
};
okResourceParser.loadTerrainFromXml = function (f, t, p) {
    var d = new okXmlDoc(t);
    var o = d.getRootNode();
    if (o.getName() != "Oak3DModelDocument") {
        okLog("[Error][okResourceParser.loadTerrainFromXml] Invalid Oak Terrain XML document");
        return false
    }
    var m = o.getAttribValueString("Version");
    var w = m.split(".");
    for (var s = 0; s < o.getChildNum(); ++s) {
        var a = o.getChild(s);
        if (a.getName() == "terrainInfo") {
            var c = a.getAttribValueInt("cw");
            var k = a.getAttribValueInt("ch");
            var v = a.getAttribValueInt("ww");
            var h = a.getAttribValueInt("wh");
            f.setChunkSize(c, k);
            f.setWorldMapSize(v, h)
        }
        if (a.getName() == "WorldMap") {
            var x = new okTerrainTile(f.$U5.rc);
            var n = a.getAttribValueFloatArray("min");
            var q = a.getAttribValueFloatArray("max");
            x.setBoundingBox(new okVec3(n[0], n[1], n[2]), new okVec3(q[0], q[1], q[2]));
            var l = a.getAttribValueInt("i");
            var u = a.getAttribValueInt("j");
            x.setGlobalIndex(l, u);
            var e = a.getAttribValueString("url");
            x.setUrl(e);
            f.addWorldMap(x)
        }
    }
    return true
};
okResourceParser.loadWorldMapFromXml = function (d, f) {
    var n = new okXmlDoc(f);
    var o = n.getRootNode();
    if (o.getName() != "Oak3DModelDocument") {
        okLog("[Error][okResourceParser.loadWorldMapFromXml] Invalid Oak Terrain XML document");
        return false
    }
    var l = o.getAttribValueString("Version");
    var p = l.split(".");
    var k;
    var c = o.getAttribValueString("n");
    for (var h = 0; h < d.$K1.length; ++h) {
        if (d.$K1[h].getUrl() == c) {
            k = d.$K1[h];
            break
        }
    }
    if (!k) {
        return
    }
    for (var h = 0; h < o.getChildNum(); ++h) {
        var a = o.getChild(h);
        if (a.getName() == "Textures") {
            this._parseTerrainTextureInOmx(k, a)
        }
        if (a.getName() == "WorldMap") {
            var e = a.getAttribValueFloatArray("min");
            var m = a.getAttribValueFloatArray("max");
            k.setBoundingBox(new okVec3(e[0], e[1], e[2]), new okVec3(m[0], m[1], m[2]));
            k.setGlobalIndex(a.getAttribValueInt("i"), a.getAttribValueInt("j"));
            this._parseTerrainMeshInOmx(k, a);
            k.computeNormal();
            k.fixNormal(d.getWorldMapMap());
            k.createAttributeArrayBuffer("Normal")
        }
    }
    k.setState(3);
    return true
};
okResourceParser._parseTerrainMeshInOmx = function (u, o) {
    for (var z = 0; z < o.getChildNum(); ++z) {
        var d = o.getChild(z);
        var c;
        if (d.getName() == "Mesh") {
            c = new okTerrainTile(u.rc)
        } else {
            c = new okTerrainMesh(u.rc)
        }
        u.addChlidMesh(c);
        var t = d.getAttribValueFloatArray("min");
        var v = d.getAttribValueFloatArray("max");
        c.setBoundingBox(new okVec3(t[0], t[1], t[2]), new okVec3(v[0], v[1], v[2]));
        var k = d.getAttribValueInt("i");
        var f = d.getAttribValueInt("j");
        c.setGlobalIndex(k, f);
        if (d.getName() == "Mesh") {
            this._parseTerrainMeshInOmx(c, d)
        } else {
            c.setName("chunk_" + k.toString() + "_" + f.toString());
            var e = new Array;
            var E = d.getAttribValueFloat("sx");
            var D = d.getAttribValueFloat("sy");
            var l = c.getChunkWidth();
            var A = c.getChunkHeight();
            var p = d.getAttribValueFloatArray("data");
            for (var q = 0; q < A; ++q) {
                for (var s = 0; s < l; ++s) {
                    var B = new Array;
                    B[0] = E * (k * (l - 1) + s);
                    B[1] = D * (f * (A - 1) + q);
                    B[2] = p[q * l + s];
                    for (var C = 0; C < B.length; C++) {
                        e.push(B[C])
                    }
                }
            }
            c.createAttribute("Position", e.length, e, 35044)
        }
    }
};
okResourceParser._parseTerrainTextureInOmx = function (m, c) {
    for (var f = 0; f < c.getChildNum(); ++f) {
        var h = c.getChild(f);
        var d = h.getAttribValueFloatArray("data");
        m.loadTextureFromXml("Texcoord1", d);
        var k = h.getAttribValueString("name");
        var l = m.getMaterialArray();
        for (var e = 0; e < l.length; ++e) {
            var a = l[e];
            if (!a) {
                continue
            }
            a.setTextureName(0, k)
        }
    }
};
okResourceParser.loadTerrainFromBmp = function (d) {
    var c = d.width;
    var a = d.height
};
function okArrayBuffer(a) {
    this.rc = a;
    this.$K3 = null;
    this.$84 = 0;
    this.$o4 = 0;
    this.$n4 = 0;
    this.$74 = 0
}
okArrayBuffer.prototype = {createBuffer:function (e, d, a, c) {
    this.releaseBuffer();
    this.$K3 = this.rc.createBuffer();
    this.$84 = e;
    this.rc.bindBuffer(this.$84, this.$K3);
    this.$o4 = d;
    this.$n4 = ((d == 5123) ? 2 : 4);
    if (okIsNumber(c)) {
        this.$74 = c;
        this.rc.bufferData(this.$84, c * this.$n4, a)
    } else {
        this.$74 = c.length;
        if (okIsArray(c)) {
            if (d == 5126) {
                this.rc.bufferData(this.$84, new Float32Array(c), a)
            } else {
                if (d == 5123) {
                    this.rc.bufferData(this.$84, new Uint16Array(c), a)
                }
            }
        } else {
            this.rc.bufferData(this.$84, c, a)
        }
    }
}, releaseBuffer:function () {
    if (this.$K3 != null) {
        this.rc.deleteBuffer(this.$K3)
    }
    this.$K3 = null
}, updateBuffer:function (a, c, d) {
    this.rc.bindBuffer(this.$84, this.$K3);
    if (okIsArray(d)) {
        if (this.$o4 == 5126) {
            this.rc.bufferSubData(this.$84, a * this.$n4, new Float32Array(d))
        } else {
            if (this.$o4 == 5123) {
                this.rc.bufferSubData(this.$84, a * this.$n4, new Uint16Array(d))
            }
        }
    } else {
        this.rc.bufferSubData(this.$84, a * this.$n4, d)
    }
}, getLength:function () {
    return this.$74
}, bindAttrib:function (d, c, e, a) {
    this.rc.bindBuffer(this.$84, this.$K3);
    this.rc.enableVertexAttribArray(d);
    this.rc.vertexAttribPointer(d, c, this.$o4, false, a * this.$n4, e * this.$n4)
}, bind:function () {
    this.rc.bindBuffer(this.$84, this.$K3)
}, drawIndex:function (a, c, d) {
    this.rc.bindBuffer(this.$84, this.$K3);
    this.rc.drawElements(a, d ? d : this.$74, this.$o4, c ? c * this.$n4 : 0)
}};
function okRenderBuffer(a) {
    this.rc = a;
    this.$M3 = null;
    this.$64 = 0;
    this.$55 = 0;
    this.$x4 = 0
}
okRenderBuffer.prototype = {createBuffer:function (a, c, d) {
    this.releaseBuffer();
    this.$M3 = this.rc.createRenderbuffer();
    this.rc.bindRenderbuffer(36161, this.$M3);
    this.rc.renderbufferStorage(36161, a, c, d);
    this.$64 = a;
    this.$55 = c;
    this.$x4 = d
}, releaseBuffer:function () {
    if (this.$M3 != null) {
        this.rc.deleteRenderbuffer(this.$M3)
    }
    this.$M3 = null;
    this.$64 = 0;
    this.$55 = 0;
    this.$x4 = 0
}};
function okFrameBuffer(a) {
    this.rc = a;
    this.glFrameBufferObj = null
}
okFrameBuffer.prototype = {createBuffer:function () {
    this.glFrameBufferObj = this.rc.createFramebuffer()
}, releaseBuffer:function () {
    if (this.glFrameBufferObj != null) {
        this.rc.deleteFramebuffer(this.glFrameBufferObj)
    }
    this.glFrameBufferObj = null
}, bind:function () {
    this.rc.bindFramebuffer(36160, this.glFrameBufferObj)
}, unbind:function () {
    this.rc.bindFramebuffer(36160, null)
}, attachRenderTexture:function (c, a) {
    this.rc.framebufferTexture2D(36160, 36064 + c, 3553, a ? a.$O3 : null, 0)
}, attachDepthBuffer:function (a) {
    this.rc.framebufferRenderbuffer(36160, 36096, 36161, a.$M3)
}, attachStencilBuffer:function (a) {
    this.rc.framebufferRenderbuffer(36160, 36128, 36161, a.$M3)
}, attachDepthStencilBuffer:function (a) {
    this.rc.framebufferRenderbuffer(36160, 33306, 36161, a ? a.$M3 : null)
}};
function okShader(c, a) {
    this.$N4 = a;
    this.rc = c;
    this.$N3 = this.rc.createShader(this.$N4);
    this.$s6 = "";
    this.$a6 = "mediump"
}
okShader.prototype = {releaseShader:function () {
    if (this.$N3 != null) {
        this.rc.deleteShader(this.$N3)
    }
    this.$N3 = null
}, releaseSource:function () {
    this.$s6 = ""
}, loadSource:function (c, a) {
    if (a) {
        this.$s6 = this._processInc(c, a)
    } else {
        this.$s6 = c.substr(0, c.length)
    }
}, setFloatPrecision:function (a) {
    this.$a6 = a
}, compile:function (h, c) {
    var k = "";
    if (h != null) {
        for (var e in h) {
            k += ("\n#define " + e + " " + h[e] + "\n")
        }
    }
    var f = "";
    if (this.$N4 == 35632) {
        f = "\nprecision " + this.$a6 + " float;\n"
    }
    if (this.$N3 == null) {
        this.$N3 = this.rc.createShader(this.$N4)
    }
    var d = f + ((h != null) ? k + this.$s6 : this.$s6);
    this.rc.shaderSource(this.$N3, d);
    this.rc.compileShader(this.$N3);
    if (!this.rc.getShaderParameter(this.$N3, 35713)) {
        if (c) {
            var a = this.rc.getShaderInfoLog(this.$N3);
            c.errorMsg = a
        }
        okLog("[Error][okShader.compile] Failed to compie shader source!");
        return false
    } else {
        if (c) {
            c.errorMsg = ""
        }
    }
    return true
}, _processInc:function (c, l) {
    var d = okA.array();
    var k = okA.array();
    var q = okA.array();
    var p = -1;
    p = c.indexOf("#include");
    while (p != -1) {
        var o = p + 8;
        while (c[o] != '"' && o < c.length) {
            ++o
        }
        if (c[o] != '"') {
            return""
        }
        var u = o + 1;
        while (c[u] != '"' && u < c.length) {
            ++u
        }
        if (c[u] != '"') {
            return""
        }
        if (u == (o + 1)) {
            return""
        }
        var a = c.substr(o + 1, u - (o + 1));
        d.push(p);
        k.push(u);
        q.push(a);
        if (u < c.length - 1) {
            p = c.indexOf("#include", u)
        } else {
            p = -1
        }
    }
    var n = 0;
    var e = "";
    var t = d.length;
    for (var m = 0; m < t; ++m) {
        var f = d[m];
        var v = k[m];
        var h = q[m];
        var s = l[h];
        if (f - n > 0) {
            e += c.substr(n, f - n)
        }
        if (s) {
            e += s
        }
        n = v + 1
    }
    if (n < c.length) {
        e += c.substr(n)
    }
    okA._array(d);
    okA._array(k);
    okA._array(q);
    return e
}};
function okProgram(a) {
    this.rc = a;
    this.$L3 = this.rc.createProgram();
    this.$b7 = null;
    this.$G3 = null;
    this.$4 = okA.object();
    this.$5 = okA.object();
    this.$t1 = okA.object();
    this.$P6 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.$Q6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.$R6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.$O6 = new Array
}
okProgram.prototype = {releaseProgram:function () {
    if (this.$L3 != null) {
        this.rc.deleteProgram(this.$L3)
    }
    this.$L3 = null
}, attachVertexShader:function (a) {
    this.$b7 = a
}, attachFragmentShader:function (a) {
    this.$G3 = a
}, link:function (a) {
    if (this.$L3 == null) {
        this.$L3 = this.rc.createProgram()
    }
    okA._object(this.$4);
    okA._object(this.$5);
    okA._object(this.$t1);
    this.$4 = okA.object();
    this.$5 = okA.object();
    this.$t1 = okA.object();
    this.rc.attachShader(this.$L3, this.$b7.$N3);
    this.rc.attachShader(this.$L3, this.$G3.$N3);
    this.rc.linkProgram(this.$L3);
    if (!this.rc.getProgramParameter(this.$L3, 35714)) {
        if (a) {
            a.errorMsg = programInfo
        }
        okLog("[Error][okProgram.link] Failed to link program!");
        return false
    }
    var d = this.rc.getProgramParameter(this.$L3, 35721);
    var h = this.rc.getProgramParameter(this.$L3, 35718);
    for (var e = 0; e < d; ++e) {
        var k = this.rc.getActiveAttrib(this.$L3, e);
        var c = k.name.replace(/\[\d*\]/g, "");
        this.$4[c] = this.rc.getAttribLocation(this.$L3, c)
    }
    var f = 0;
    for (var e = 0; e < h; ++e) {
        var k = this.rc.getActiveUniform(this.$L3, e);
        var c = k.name.replace(/\[\d*\]/g, "");
        this.$5[c] = this.rc.getUniformLocation(this.$L3, c);
        if (k.type == 35678 || k.type == 35680) {
            this.$t1[c] = f;
            f += k.size
        }
    }
    return true
}, setUniformInt:function (a, c) {
    this.rc.uniform1i(this.$5[a], c)
}, setUniformInt2:function (c, a, d) {
    if (typeof a == "number") {
        this.rc.uniform2i(this.$5[c], a, d)
    } else {
        this.rc.uniform2i(this.$5[c], a.x, a.y)
    }
}, setUniformInt3:function (c, a, e, d) {
    if (typeof a == "number") {
        this.rc.uniform3i(this.$5[c], a, e, d)
    } else {
        this.rc.uniform3i(this.$5[c], a.x, a.y, a.z)
    }
}, setUniformInt4:function (d, a, f, e, c) {
    if (typeof a == "number") {
        this.rc.uniform4i(this.$5[d], a, f, e, c)
    } else {
        this.rc.uniform4i(this.$5[d], a.x, a.y, a.z, a.w)
    }
}, setUniformIntArray:function (c, a) {
    this.rc.uniform1iv(this.$5[c], a)
}, setUniformInt2Array:function (c, a) {
    this.rc.uniform2iv(this.$5[c], a)
}, setUniformInt3Array:function (c, a) {
    this.rc.uniform3iv(this.$5[c], a)
}, setUniformInt4Array:function (c, a) {
    this.rc.uniform4iv(this.$5[c], a)
}, setUniformFloat:function (c, a) {
    this.rc.uniform1f(this.$5[c], a)
}, setUniformFloat2:function (d, c, a) {
    if (typeof c == "number") {
        this.rc.uniform2f(this.$5[d], c, a)
    } else {
        this.rc.uniform2f(this.$5[d], c.x, c.y)
    }
}, setUniformFloat3:function (e, d, c, a) {
    if (typeof d == "number") {
        this.rc.uniform3f(this.$5[e], d, c, a)
    } else {
        this.rc.uniform3f(this.$5[e], d.x, d.y, d.z)
    }
}, setUniformFloat4:function (f, d, c, a, e) {
    if (typeof d == "number") {
        this.rc.uniform4f(this.$5[f], d, c, a, e)
    } else {
        this.rc.uniform4f(this.$5[f], d.x, d.y, d.z, d.w)
    }
}, setUniformFloatArray:function (c, a) {
    this.rc.uniform1fv(this.$5[c], a)
}, setUniformFloat2Array:function (c, a) {
    this.rc.uniform2fv(this.$5[c], a)
}, setUniformFloat3Array:function (c, a) {
    this.rc.uniform3fv(this.$5[c], a)
}, setUniformFloat4Array:function (c, a) {
    this.rc.uniform4fv(this.$5[c], a)
}, setUniformVec2Array:function (e, d) {
    var f = okA.array();
    var a = d.length;
    for (var c = 0; c < a; ++c) {
        var h = d[c];
        f.push(h.x, h.y)
    }
    this.rc.uniform2fv(this.$5[e], f);
    okA._array(f)
}, setUniformVec3Array:function (e, d) {
    var f = okA.array();
    var a = d.length;
    for (var c = 0; c < a; ++c) {
        var h = d[c];
        f.push(h.x, h.y, h.z)
    }
    this.rc.uniform3fv(this.$5[e], f);
    okA._array(f)
}, setUniformVec4Array:function (e, d) {
    var f = okA.array();
    var a = d.length;
    for (var c = 0; c < a; ++c) {
        var h = d[c];
        f.push(h.x, h.y, h.z, h.w)
    }
    this.rc.uniform4fv(this.$5[e], f);
    okA._array(f)
}, setUniformMat3:function (c, a) {
    var d = this.$P6;
    d[0] = a.m00;
    d[1] = a.m10;
    d[2] = a.m20;
    d[3] = a.m01;
    d[4] = a.m11;
    d[5] = a.m21;
    d[6] = a.m02;
    d[7] = a.m12;
    d[8] = a.m22;
    this.rc.uniformMatrix3fv(this.$5[c], false, d)
}, setUniformMat3Array:function (f, e) {
    var h = this.$O6;
    h.length = 0;
    var c = e.length;
    for (var d = 0; d < c; ++d) {
        var a = e[d];
        h.push(a.m00, a.m10, a.m20, a.m01, a.m11, a.m21, a.m02, a.m12, a.m22)
    }
    this.rc.uniformMatrix3fv(this.$5[f], false, h)
}, setUniformMat4:function (c, a) {
    var d = this.$R6;
    d[0] = a.m00;
    d[1] = a.m10;
    d[2] = a.m20;
    d[3] = a.m30;
    d[4] = a.m01;
    d[5] = a.m11;
    d[6] = a.m21;
    d[7] = a.m31;
    d[8] = a.m02;
    d[9] = a.m12;
    d[10] = a.m22;
    d[11] = a.m32;
    d[12] = a.m03;
    d[13] = a.m13;
    d[14] = a.m23;
    d[15] = a.m33;
    this.rc.uniformMatrix4fv(this.$5[c], false, d)
}, setUniformMat4Array:function (f, e) {
    var h = this.$O6;
    h.length = 0;
    var c = e.length;
    for (var d = 0; d < c; ++d) {
        var a = e[d];
        h.push(a.m00, a.m10, a.m20, a.m30, a.m01, a.m11, a.m21, a.m31, a.m02, a.m12, a.m22, a.m32, a.m03, a.m13, a.m23, a.m33)
    }
    this.rc.uniformMatrix4fv(this.$5[f], false, h)
}, setUniformMat43:function (d, c, a) {
    if (!a) {
        var e = this.$Q6;
        e[0] = c.m00;
        e[1] = c.m01;
        e[2] = c.m02;
        e[3] = c.m03;
        e[4] = c.m10;
        e[5] = c.m11;
        e[6] = c.m12;
        e[7] = c.m13;
        e[8] = c.m20;
        e[9] = c.m21;
        e[10] = c.m22;
        e[11] = c.m23;
        this.rc.uniform4fv(this.$5[d], e)
    } else {
        var e = this.$R6;
        e[0] = c.m00;
        e[1] = c.m10;
        e[2] = c.m20;
        e[3] = 0;
        e[4] = c.m01;
        e[5] = c.m11;
        e[6] = c.m21;
        e[7] = 0;
        e[8] = c.m02;
        e[9] = c.m12;
        e[10] = c.m22;
        e[11] = 0;
        e[12] = c.m03;
        e[13] = c.m13;
        e[14] = c.m23;
        e[15] = 1;
        this.rc.uniformMatrix4fv(this.$5[d], false, e)
    }
}, setUniformMat43Array:function (h, f, d) {
    var k = this.$O6;
    k.length = 0;
    if (!d) {
        var c = f.length;
        for (var e = 0; e < c; ++e) {
            var a = f[e];
            k.push(a.m00, a.m01, a.m02, a.m03, a.m10, a.m11, a.m12, a.m13, a.m20, a.m21, a.m22, a.m23)
        }
        this.rc.uniform4fv(this.$5[h], k)
    } else {
        var c = f.length;
        for (var e = 0; e < c; ++e) {
            var a = f[e];
            k.push(a.m00, a.m10, a.m20, 0, a.m01, a.m11, a.m21, 0, a.m02, a.m12, a.m22, 0, a.m03, a.m13, a.m23, 1)
        }
        this.rc.uniformMatrix4fv(this.$5[h], false, k)
    }
}, setSampler:function (a, c) {
    this.rc.uniform1i(this.$5[a], c)
}, setSamplerArray:function (a, c) {
    this.rc.uniform1iv(this.$5[a], c)
}, setTexture:function (h, c, f, a, d) {
    if (c) {
        var l = this.$5[h];
        var k = this.$t1[h];
        this.rc.uniform1i(this.$5[h], k);
        c.bind(k);
        var e = c.getType();
        f = f ? f : 10497;
        this.rc.texParameteri(e, 10242, f);
        this.rc.texParameteri(e, 10243, f);
        if (c.isMipMap()) {
            if (a == 9728 || a == 9729) {
                a += 9984 - 9728
            } else {
                if (a == null) {
                    a = 9985
                }
            }
        } else {
            a = a ? a : 9729
        }
        this.rc.texParameteri(e, 10241, a);
        d = d ? d : 9729;
        this.rc.texParameteri(e, 10240, d)
    }
}, setTextureArray:function (t, o, a, f, l) {
    var h = this.$5[t];
    var s = this.$t1[t];
    var n = okA.array();
    var s = this.$t1[t];
    var c = o.length;
    for (var k = 0; k < c; ++k) {
        var q = o[k];
        var e = (a ? (okIsNumber(a) ? a : a[k]) : null);
        var m = (f ? (okIsNumber(f) ? f : f[k]) : null);
        var p = (l ? (okIsNumber(l) ? l : l[k]) : null);
        q.bind(s);
        var d = q.getType();
        e = e ? e : 10497;
        this.rc.texParameteri(d, 10242, e);
        this.rc.texParameteri(d, 10243, e);
        if (q.isMipMap()) {
            if (m == 9728 || m == 9729) {
                m += 9984 - 9728
            } else {
                if (m == null) {
                    m = 9985
                }
            }
        } else {
            m = m ? m : 9729
        }
        this.rc.texParameteri(d, 10241, m);
        p = p ? p : 9729;
        this.rc.texParameteri(d, 10240, p);
        n.push(s++)
    }
    this.rc.uniform1iv(this.$5[t], n);
    okA._array(n)
}, setAttribute:function (f, e, d, c, a) {
    var h = this.$4[f];
    if (h != null) {
        e.bindAttrib(h, d, (c != null) ? c : 0, (a != null) ? a : 0)
    }
}, bind:function () {
    this.rc.useProgram(this.$L3)
}};
function okTexture(a) {
    this.rc = a;
    this.$O3 = null;
    this.$Z4 = 0;
    this.$Q4 = 0;
    this.$R4 = 0;
    this.$u4 = 0;
    this.$q2 = false;
    this.$c7 = null
}
okTexture.prototype = {isValid:function () {
    return(this.$O3 != null)
}, getType:function () {
    return this.$Z4
}, createTexture:function (h, k, c, o, d, n, f, m, e, l, a) {
    this.releaseTexture();
    this.$O3 = this.rc.createTexture();
    this.$Z4 = h;
    this.$Q4 = k;
    this.$R4 = c;
    this.$u4 = o;
    this.$q2 = false;
    if (h == 3553) {
        this.rc.bindTexture(3553, this.$O3);
        if (n == null) {
            this.rc.texImage2D(3553, 0, o, k, c, 0, o, d ? d : 5121, null)
        } else {
            if (n.width != null && n.height != null) {
                this.rc.texImage2D(3553, 0, o, o, d ? d : 5121, n);
                this.$Q4 = n.width;
                this.$R4 = n.height;
                if ((typeof n == "object") && (n.constructor == HTMLVideoElement)) {
                    this.$c7 = n
                }
            } else {
                if (okIsArray(n)) {
                    switch (d) {
                        case 5126:
                            n = new Float32Array(n);
                            break;
                        default:
                            n = new Uint8Array(n)
                    }
                }
                this.rc.texImage2D(3553, 0, o, k, c, 0, o, d ? d : 5121, n)
            }
        }
    } else {
        if (h == 34067) {
            this.rc.bindTexture(34067, this.$O3);
            this.$Q4 = n.width;
            this.$R4 = n.height;
            switch (d) {
                case 5126:
                    n = okIsArray(n) ? new Float32Array(n) : n;
                    f = okIsArray(f) ? new Float32Array(f) : f;
                    m = okIsArray(m) ? new Float32Array(m) : m;
                    e = okIsArray(e) ? new Float32Array(e) : e;
                    l = okIsArray(l) ? new Float32Array(l) : l;
                    a = okIsArray(a) ? new Float32Array(a) : a;
                    break;
                default:
                    n = okIsArray(n) ? new Uint8Array(n) : n;
                    f = okIsArray(f) ? new Uint8Array(f) : f;
                    m = okIsArray(m) ? new Uint8Array(m) : m;
                    e = okIsArray(e) ? new Uint8Array(e) : e;
                    l = okIsArray(l) ? new Uint8Array(l) : l;
                    a = okIsArray(a) ? new Uint8Array(a) : a
            }
            if (n.width != null && n.height != null) {
                this.rc.texImage2D(34069, 0, o, o, d ? d : 5121, n)
            } else {
                this.rc.texImage2D(34069, 0, o, k, c, 0, o, d ? d : 5121, n)
            }
            if (f.width != null && f.height != null) {
                this.rc.texImage2D(34070, 0, o, o, d ? d : 5121, f)
            } else {
                this.rc.texImage2D(34070, 0, o, k, c, 0, o, d ? d : 5121, f)
            }
            if (m.width != null && m.height != null) {
                this.rc.texImage2D(34071, 0, o, o, d ? d : 5121, m)
            } else {
                this.rc.texImage2D(34071, 0, o, k, c, 0, o, d ? d : 5121, m)
            }
            if (e.width != null && e.height != null) {
                this.rc.texImage2D(34072, 0, o, o, d ? d : 5121, e)
            } else {
                this.rc.texImage2D(34072, 0, o, k, c, 0, o, d ? d : 5121, e)
            }
            if (l.width != null && l.height != null) {
                this.rc.texImage2D(34073, 0, o, o, d ? d : 5121, l)
            } else {
                this.rc.texImage2D(34073, 0, o, k, c, 0, o, d ? d : 5121, l)
            }
            if (a.width != null && a.height != null) {
                this.rc.texImage2D(34074, 0, o, o, d ? d : 5121, a)
            } else {
                this.rc.texImage2D(34074, 0, o, k, c, 0, o, d ? d : 5121, a)
            }
        }
    }
}, releaseTexture:function () {
    if (this.$O3 != null) {
        this.rc.deleteTexture(this.$O3);
        this.$O3 = null
    }
    if (this.$c7 != null) {
        var a = this.$c7;
        document.body.appendChild(a);
        a.parentNode.removeChild(a);
        a.parentNode = null;
        this.$c7 = null
    }
    this.$Z4 = 0;
    this.$Q4 = 0;
    this.$R4 = 0;
    this.$u4 = 0;
    this.$q2 = false
}, updateTexture:function (l, h, k, c, d, o, f, n, e, m, a) {
    if (this.$Z4 == 3553) {
        this.rc.bindTexture(3553, this.$O3);
        if (o.width != null && o.height != null) {
            this.rc.texSubImage2D(3553, 0, l, h, this.$u4, d ? d : 5121, o)
        } else {
            if (okIsArray(o)) {
                switch (d) {
                    case 5126:
                        o = new Float32Array(o);
                        break;
                    default:
                        o = new Uint8Array(o)
                }
            }
            this.rc.texSubImage2D(3553, 0, l, h, k, c, this.$u4, d ? d : 5121, o)
        }
    } else {
        if (this.$Z4 == 34067) {
            this.rc.bindTexture(34067, this.$O3);
            switch (d) {
                case 5126:
                    o = okIsArray(o) ? new Float32Array(o) : o;
                    f = okIsArray(f) ? new Float32Array(f) : f;
                    n = okIsArray(n) ? new Float32Array(n) : n;
                    e = okIsArray(e) ? new Float32Array(e) : e;
                    m = okIsArray(m) ? new Float32Array(m) : m;
                    a = okIsArray(a) ? new Float32Array(a) : a;
                    break;
                default:
                    o = okIsArray(o) ? new Uint8Array(o) : o;
                    f = okIsArray(f) ? new Uint8Array(f) : f;
                    n = okIsArray(n) ? new Uint8Array(n) : n;
                    e = okIsArray(e) ? new Uint8Array(e) : e;
                    m = okIsArray(m) ? new Uint8Array(m) : m;
                    a = okIsArray(a) ? new Uint8Array(a) : a
            }
            if (o) {
                if (o.width != null && o.height != null) {
                    this.rc.texSubImage2D(34069, 0, l, h, this.$u4, d ? d : 5121, o)
                } else {
                    this.rc.texSubImage2D(34069, 0, l, h, k, c, this.$u4, d ? d : 5121, o)
                }
            }
            if (f) {
                if (f.width != null && f.height != null) {
                    this.rc.texSubImage2D(34070, 0, l, h, this.$u4, d ? d : 5121, f)
                } else {
                    this.rc.texSubImage2D(34070, 0, l, h, k, c, this.$u4, d ? d : 5121, f)
                }
            }
            if (n) {
                if (n.width != null && n.height != null) {
                    this.rc.texSubImage2D(34071, 0, l, h, this.$u4, d ? d : 5121, n)
                } else {
                    this.rc.texSubImage2D(34071, 0, l, h, k, c, this.$u4, d ? d : 5121, n)
                }
            }
            if (e) {
                if (e.width != null && e.height != null) {
                    this.rc.texSubImage2D(34072, 0, l, h, this.$u4, d ? d : 5121, e)
                } else {
                    this.rc.texSubImage2D(34072, 0, l, h, k, c, this.$u4, d ? d : 5121, e)
                }
            }
            if (m) {
                if (m.width != null && m.height != null) {
                    this.rc.texSubImage2D(34073, 0, l, h, this.$u4, d ? d : 5121, m)
                } else {
                    this.rc.texSubImage2D(34073, 0, l, h, k, c, this.$u4, d ? d : 5121, m)
                }
            }
            if (a) {
                if (a.width != null && a.height != null) {
                    this.rc.texSubImage2D(34074, 0, l, h, this.$u4, d ? d : 5121, a)
                } else {
                    this.rc.texSubImage2D(34074, 0, l, h, k, c, this.$u4, d ? d : 5121, a)
                }
            }
        }
    }
}, getSizeU:function (a) {
    var c = (this.$Q4 >> ((a != null) ? a : 0));
    return(c > 0) ? c : 1
}, getSizeV:function (a) {
    var c = (this.$R4 >> ((a != null) ? a : 0));
    return(c > 0) ? c : 1
}, bind:function (a) {
    this.rc.activeTexture(33984 + ((a != null) ? a : 0));
    this.rc.bindTexture(this.$Z4, this.$O3)
}, updateVideoTexture:function () {
    if (!this.$c7) {
        return
    }
    if (this.$c7.readyState === this.$c7.HAVE_ENOUGH_DATA) {
        this.updateTexture(0, 0, 0, 0, 5121, this.$c7);
        this.rc.texParameteri(3553, 10242, 33071);
        this.rc.texParameteri(3553, 10243, 33071);
        this.rc.texParameteri(3553, 10240, 9729);
        this.rc.texParameteri(3553, 10241, 9729)
    }
}, isVideoTexture:function () {
    if (!this.$c7) {
        return false
    }
    return true
}, genMipMap:function () {
    this.rc.generateMipmap(this.$Z4);
    this.$q2 = true
}, isMipMap:function () {
    return this.$q2
}};
function okCamera(a) {
    this.rc = a;
    this.$e6 = "";
    this.$I6 = null;
    this.$i5 = new okMat43(1);
    this.$v5 = new okMat43(1);
    this.$K2 = true;
    this.$L4 = 1;
    this.$t5 = new okMat4(1);
    this.$x2 = true;
    this.$x5 = new okMat4(1);
    this.$w5 = new okMat4(1);
    this.$L2 = true;
    this.$H3 = new okFrustum();
    this.$h2 = true;
    this.$35 = 0;
    this.$45 = 0;
    this.$25 = 0;
    this.$15 = 0;
    this.$17 = new okVec3(0, 0, 0);
    this.$06 = "";
    this.$W3 = -1;
    this.$h3 = 45;
    this.$A3 = 1;
    this.$z3 = 10000
}
okCamera.prototype = {clear:function () {
    this.$e6 = "";
    this.$i5.identity();
    this.$v5.identity();
    this.$K2 = true;
    this.$L4 = 1;
    this.$t5.identity();
    this.$x2 = true;
    this.$x5.identity();
    this.$w5.identity();
    this.$L2 = true;
    this.$H3 = new okFrustum();
    this.$h2 = true;
    this.$35 = 0;
    this.$45 = 0;
    this.$25 = 0;
    this.$15 = 0;
    this.$17.set(0, 0, 0);
    this.$06 = "";
    if (this.$W3 != -1) {
        var a = this.$I6.$U5;
        a.deleteResource(this.$W3);
        this.$W3 = -1
    }
    this.$h3 = 45;
    this.$A3 = 1;
    this.$z3 = 10000
}, reset:function (c, a) {
    if (c != false) {
        this.$i5.setColumn(3, 0, 0, 0)
    }
    if (a != false) {
        this.$i5.setColumn(0, 1, 0, 0);
        this.$i5.setColumn(1, 0, 1, 0);
        this.$i5.setColumn(2, 0, 0, 1)
    }
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, setName:function (a) {
    this.$e6 = a
}, getName:function () {
    return this.$e6
}, setMat:function (a) {
    if (!(a && ((a.__isMat43Complete && a.__isMat43Complete()) || (a.__isMat4Complete && a.__isMat4Complete())))) {
        okLog("[Error][okCamera.setMat] Invalid 4x3 or 4x4 matrix!")
    }
    a.clone(this.$i5);
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, setPos:function (d, c, a) {
    if (d != null && a != null) {
        if (d == null || c == null || a == null || !okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a)) {
            okLog("[Error][okCamera.setPos] Invalid position!")
        }
        this.$i5.m03 = d;
        this.$i5.m13 = c;
        this.$i5.m23 = a
    } else {
        if (d == null || d.__isVec3Complete == null || !d.__isVec3Complete()) {
            okLog("[Error][okCamera.setPos] Invalid position!")
        }
        this.$i5.m03 = d.x;
        this.$i5.m13 = d.y;
        this.$i5.m23 = d.z
    }
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, getPos:function () {
    return this.$i5.getColumn(3)
}, move:function (e, d, c, a) {
    if (e == null || e != 1 && e != 3) {
        okLog("[Error][okCamera.move] Invalid space!")
    }
    if (e == 3) {
        if (d != null && a != null) {
            if (d == null || c == null || a == null || !okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a)) {
                okLog("[Error][okCamera.move] Invalid moving vector!")
            }
            this.$i5.m03 += d;
            this.$i5.m13 += c;
            this.$i5.m23 += a
        } else {
            if (d == null || d.__isVec3Complete == null || !d.__isVec3Complete()) {
                okLog("[Error][okCamera.move] Invalid moving vector!")
            }
            this.$i5.m03 += d.x;
            this.$i5.m13 += d.y;
            this.$i5.m23 += d.z
        }
    } else {
        if (d != null && a != null) {
            if (d == null || c == null || a == null || !okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a)) {
                okLog("[Error][okCamera.move] Invalid moving vector!")
            }
            this.$i5.m03 += (d * this.$i5.m00 + c * this.$i5.m01 + a * this.$i5.m02);
            this.$i5.m13 += (d * this.$i5.m10 + c * this.$i5.m11 + a * this.$i5.m12);
            this.$i5.m23 += (d * this.$i5.m20 + c * this.$i5.m21 + a * this.$i5.m22)
        } else {
            if (d == null || d.__isVec3Complete == null || !d.__isVec3Complete()) {
                okLog("[Error][okCamera.move] Invalid moving vector!")
            }
            this.$i5.m03 += (d.x * this.$i5.m00 + d.y * this.$i5.m01 + d.z * this.$i5.m02);
            this.$i5.m13 += (d.x * this.$i5.m10 + d.y * this.$i5.m11 + d.z * this.$i5.m12);
            this.$i5.m23 += (d.x * this.$i5.m20 + d.y * this.$i5.m21 + d.z * this.$i5.m22)
        }
    }
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, moveRight:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okCamera.moveRight] Invalid moving length value!")
    }
    this.$i5.m03 += a * this.$i5.m00;
    this.$i5.m13 += a * this.$i5.m10;
    this.$i5.m23 += a * this.$i5.m20;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, moveUp:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okCamera.moveUp] Invalid moving length value!")
    }
    this.$i5.m03 += a * this.$i5.m01;
    this.$i5.m13 += a * this.$i5.m11;
    this.$i5.m23 += a * this.$i5.m21;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, moveForward:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okCamera.moveForward] Invalid moving length value!")
    }
    this.$i5.m03 -= a * this.$i5.m02;
    this.$i5.m13 -= a * this.$i5.m12;
    this.$i5.m23 -= a * this.$i5.m22;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotX:function (k, h) {
    if (k == null || k != 1 && k != 3) {
        okLog("[Error][okCamera.rotX] Invalid space!")
    }
    if (h == null || !okIsNumber(h)) {
        okLog("[Error][okCamera.rotX] Invalid rotation angle!")
    }
    var a = okMat43RotX(h);
    if (k == 3) {
        var e = this.$i5.m03;
        var d = this.$i5.m13;
        var c = this.$i5.m23;
        var f = okMat43Mul(a, this.$i5);
        okA._mat43(this.$i5);
        this.$i5 = f
    } else {
        var f = okMat43Mul(this.$i5, a);
        okA._mat43(this.$i5);
        this.$i5 = f
    }
    okA._mat43(a);
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotY:function (k, h) {
    if (k == null || k != 1 && k != 3) {
        okLog("[Error][okCamera.rotY] Invalid space!")
    }
    if (h == null || !okIsNumber(h)) {
        okLog("[Error][okCamera.rotY] Invalid rotation angle!")
    }
    var a = okMat43RotY(h);
    if (k == 3) {
        var e = this.$i5.m03;
        var d = this.$i5.m13;
        var c = this.$i5.m23;
        var f = okMat43Mul(a, this.$i5);
        okA._mat43(this.$i5);
        this.$i5 = f
    } else {
        var f = okMat43Mul(this.$i5, a);
        okA._mat43(this.$i5);
        this.$i5 = f
    }
    okA._mat43(a);
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotZ:function (k, h) {
    if (k == null || k != 1 && k != 3) {
        okLog("[Error][okCamera.rotZ] Invalid space!")
    }
    if (h == null || !okIsNumber(h)) {
        okLog("[Error][okCamera.rotZ] Invalid rotation angle!")
    }
    var a = okMat43RotZ(h);
    if (k == 3) {
        var e = this.$i5.m03;
        var d = this.$i5.m13;
        var c = this.$i5.m23;
        var f = okMat43Mul(a, this.$i5);
        okA._mat43(this.$i5);
        this.$i5 = f
    } else {
        var f = okMat43Mul(this.$i5, a);
        okA._mat43(this.$i5);
        this.$i5 = f
    }
    okA._mat43(a);
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotRight:function (d) {
    if (d == null || !okIsNumber(d)) {
        okLog("[Error][okCamera.rotRight] Invalid rotation angle!")
    }
    var a = okMat43RotX(d);
    var c = okMat43Mul(this.$i5, a);
    okA._mat43(this.$i5);
    this.$i5 = c;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotUp:function (d) {
    if (d == null || !okIsNumber(d)) {
        okLog("[Error][okCamera.rotUp] Invalid rotation angle!")
    }
    var a = okMat43RotY(d);
    var c = okMat43Mul(this.$i5, a);
    okA._mat43(this.$i5);
    this.$i5 = c;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotForward:function (d) {
    if (d == null || !okIsNumber(d)) {
        okLog("[Error][okCamera.rotForward] Invalid rotation angle!")
    }
    var a = okMat43RotZ(-d);
    var c = okMat43Mul(this.$i5, a);
    okA._mat43(this.$i5);
    this.$i5 = c;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, rotTarget:function (e, h, f) {
    if (e == null || !okIsNumber(e)) {
        okLog("[Error][okCamera.rotTarget] Invalid rotation angle!")
    }
    if (h == null || h.__isVec3Complete == null || !h.__isVec3Complete()) {
        okLog("[Error][okCamera.rotTarget] Invalid target!")
    }
    if (f == null || f.__isVec3Complete == null || !f.__isVec3Complete()) {
        okLog("[Error][okCamera.rotTarget] Invalid rotation axis!")
    }
    var c = okA.mat43();
    this.$i5.clone(c);
    c.m03 -= h.x;
    c.m13 -= h.y;
    c.m23 -= h.z;
    var a = okMat43Rot(e, f);
    var d = okMat43Mul(a, c);
    okA._mat43(c);
    d.m03 += h.x;
    d.m13 += h.y;
    d.m23 += h.z;
    d.clone(this.$i5);
    okA._mat43(d);
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, getRightDir:function () {
    var a = okA.vec3();
    a.x = this.$i5.m00;
    a.y = this.$i5.m10;
    a.z = this.$i5.m20;
    return a
}, getUpDir:function () {
    var a = okA.vec3();
    a.x = this.$i5.m01;
    a.y = this.$i5.m11;
    a.z = this.$i5.m21;
    return a
}, getForwardDir:function () {
    var a = okA.vec3();
    a.x = -this.$i5.m02;
    a.y = -this.$i5.m12;
    a.z = -this.$i5.m22;
    return a
}, lookAt:function (n, l, h, k, f, e) {
    var m = okA.vec3();
    var c = okA.vec3();
    if (typeof n == "number") {
        if (n == null || l == null || h == null || !okIsNumber(n) || !okIsNumber(l) || !okIsNumber(h)) {
            okLog("[Error][okCamera.lookAt] Invalid looking target!")
        }
        m.x = n;
        m.y = l;
        m.z = h;
        if (f) {
            if (k == null || f == null || e == null || !okIsNumber(k) || !okIsNumber(f) || !okIsNumber(e) || (k * k + f * f + e * e) < 0.000001) {
                okLog("[Error][okCamera.lookAt] Invalid up vector!")
            }
            c.x = k;
            c.y = f;
            c.z = e
        } else {
            if (k) {
                if (k == null || k.__isVec3Complete == null || !k.__isVec3Complete() || k.len() < 0.000001) {
                    okLog("[Error][okCamera.lookAt] Invalid up vector!")
                }
                c.x = k.x;
                c.y = k.y;
                c.z = k.z
            } else {
                c.x = this.$i5.m01;
                c.y = this.$i5.m11;
                c.z = this.$i5.m21
            }
        }
    } else {
        if (n == null || n.__isVec3Complete == null || !n.__isVec3Complete()) {
            okLog("[Error][okCamera.lookAt] Invalid looking target!")
        }
        m.x = n.x;
        m.y = n.y;
        m.z = n.z;
        if (h) {
            if (l == null || h == null || k == null || !okIsNumber(l) || !okIsNumber(h) || !okIsNumber(k) || (l * l + h * h + k * k) < 0.000001) {
                okLog("[Error][okCamera.lookAt] Invalid up vector!")
            }
            c.x = l;
            c.y = h;
            c.z = k
        } else {
            if (l) {
                if (l == null || l.__isVec3Complete == null || !l.__isVec3Complete() || l.len() < 0.000001) {
                    okLog("[Error][okCamera.lookAt] Invalid up vector!")
                }
                c.x = l.x;
                c.y = l.y;
                c.z = l.z
            } else {
                c.x = this.$i5.m01;
                c.y = this.$i5.m11;
                c.z = this.$i5.m21
            }
        }
    }
    var a = okA.vec3();
    a.x = this.$i5.m03 - m.x;
    a.y = this.$i5.m13 - m.y;
    a.z = this.$i5.m23 - m.z;
    a.normalize(true);
    var d = okVec3Cross(c, a);
    if (d.equal(OAK.VEC3_ZERO)) {
        d.x = this.$i5.m00;
        d.y = this.$i5.m10;
        d.z = this.$i5.m20;
        d.normalize(true);
        c = okVec3Cross(a, d);
        okA._vec3(d);
        d = okVec3Cross(c, a)
    } else {
        okA._vec3(c);
        c = okVec3Cross(a, d)
    }
    d.normalize(true);
    c.normalize(true);
    this.$i5.m00 = d.x;
    this.$i5.m10 = d.y;
    this.$i5.m20 = d.z;
    this.$i5.m01 = c.x;
    this.$i5.m11 = c.y;
    this.$i5.m21 = c.z;
    this.$i5.m02 = a.x;
    this.$i5.m12 = a.y;
    this.$i5.m22 = a.z;
    this.$K2 = true;
    this.$L2 = true;
    this.$h2 = true
}, getViewMat4:function () {
    if (this.$K2) {
        okA._mat43(this.$v5);
        this.$v5 = this.$i5.inverse();
        this.$K2 = false
    }
    var a = okA.mat4();
    this.$v5.toMat4(a);
    return a
}, getViewMat43:function () {
    if (this.$K2) {
        okA._mat43(this.$v5);
        this.$v5 = this.$i5.inverse();
        this.$K2 = false
    }
    var a = okA.mat43();
    this.$v5.clone(a);
    return a
}, getMat4:function () {
    var a = okA.mat4();
    this.$i5.toMat4(a);
    return a
}, getMat43:function () {
    var a = okA.mat43();
    this.$i5.clone(a);
    return a
}, getViewInvMat4:function () {
    var a = okA.mat4();
    this.$i5.toMat4(a);
    return a
}, getViewInvMat43:function () {
    var a = okA.mat43();
    this.$i5.clone(a);
    return a
}, setViewport:function (d, c, a, e) {
    if (d == null || c == null || a == null || e == null || !okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(e)) {
        okLog("[Error][okCamera.setViewport] Invalid viewport!")
    }
    this.$35 = d;
    this.$45 = c;
    this.$25 = a;
    this.$15 = e;
    this.$x2 = true;
    this.$L2 = true;
    this.$h2 = true
}, getViewportLeft:function () {
    return this.$35
}, getViewportTop:function () {
    return this.$45
}, getViewportWidth:function () {
    return this.$25
}, getViewportHeight:function () {
    return this.$15
}, bindViewport:function () {
    var a = this.rc.canvas.clientHeight;
    this.rc.viewport(this.$35, a - (this.$45 + this.$15), this.$25, this.$15);
    this.rc.scissor(this.$35, a - (this.$45 + this.$15), this.$25, this.$15)
}, setBackColor:function (c, a, d, e) {
    if (a == null) {
        if (c == null || c.__isVec4Complete == null || !c.__isVec4Complete()) {
            okLog("[Error][okCamera.setBackColor] Invalid RGBA back color!")
        }
        this.$17.x = c.x;
        this.$17.y = c.y;
        this.$17.z = c.z;
        this.$17.w = (c.w ? c.w : 1)
    } else {
        if (c == null || a == null || d == null || e == null || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(d) || !okIsNumber(e)) {
            okLog("[Error][okCamera.setBackColor] Invalid RGBA back color!")
        }
        this.$17.x = c;
        this.$17.y = a;
        this.$17.z = d;
        this.$17.w = ((e != null) ? e : 1)
    }
}, getBackColor:function () {
    return this.$17
}, setBackTexture:function (a) {
    if (this.$I6 == null) {
        okLog("[Error][okCamera.setBackTexture] This method is only valid when the camera is created by an okScene!")
    }
    var e = this.$I6.$U5;
    if (a != "") {
        var d = this.$I6._packTextureUrl(a);
        this.$W3 = e.createResource(2, d);
        var c = e.getResourceState(this.$W3);
        if (c == 2) {
            e.loadTextureByUrl(this.$W3, d, 6408)
        }
    } else {
        if (this.$W3 != -1) {
            e.deleteResource(this.$W3)
        }
        this.$W3 = -1
    }
    this.$06 = a
}, getBackTextureResourceId:function () {
    return this.$W3
}, setFov:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okCamera.setFov] Invalid fov!")
    }
    this.$h3 = a;
    this.$x2 = true;
    this.$L2 = true
}, getFov:function () {
    return this.$h3
}, setVisibleRange:function (a, c) {
    if (a == null || !okIsNumber(a) || a < 0.01) {
        okLog("[Error][okCamera.setVisibleRange] Invalid near clip value!")
    }
    if (c == null || !okIsNumber(c) || c <= a) {
        okLog("[Error][okCamera.setVisibleRange] Invalid far clip value!")
    }
    this.$A3 = Math.max(0.01, a);
    this.$z3 = c;
    this.$x2 = true;
    this.$L2 = true
}, setVisibleNear:function (a) {
    if (a == null || !okIsNumber(a) || a < 0.01) {
        okLog("[Error][okCamera.setVisibleNear] Invalid near clip value!")
    }
    this.$A3 = a
}, setVisibleFar:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okCamera.setVisibleFar] Invalid far clip value!")
    }
    this.$z3 = a
}, getVisibleNear:function () {
    return this.$A3
}, getVisibleFar:function () {
    return this.$z3
}, setProjMode:function (a) {
    if (a == null || (a != 2 && a != 3 && a != 4 && a != 1)) {
        okLog("[Error][okCamera.setProjMode] Invalid projection mode!")
    }
    if (a == 2) {
        okLog("[Warning][okCamera.setProjMode] 2 is deprecated, please use 3 or 4!");
        a = 3
    }
    this.$L4 = a;
    this.$x2 = true;
    this.$L2 = true
}, getProjMode:function () {
    return this.$L4
}, getProjMat4:function () {
    if (this.$x2) {
        if (this.$L4 == 1) {
            okA._mat4(this.$t5);
            this.$t5 = okMat4Proj(this.$h3, this.$25 / this.$15, this.$A3, this.$z3);
            this.$x2 = false
        } else {
            if (this.$L4 == 3) {
                okA._mat4(this.$t5);
                this.$t5 = okMat4Ortho(-this.$25 / this.$15, this.$25 / this.$15, 1, -1, this.$A3, this.$z3);
                this.$x2 = false
            } else {
                if (this.$L4 == 4) {
                    okA._mat4(this.$t5);
                    this.$t5 = okMat4Ortho(0, this.$25, 0, this.$15, this.$A3, this.$z3);
                    this.$x2 = false
                }
            }
        }
    }
    return this.$t5
}, getViewProjMat4:function () {
    if (this.$L2) {
        okA._mat4(this.$x5);
        okA._mat4(this.$w5);
        this.$x5 = okMat4Mul(this.getProjMat4(), this.getViewMat4());
        this.$w5 = this.$x5.inverse();
        this.$L2 = false
    }
    return this.$x5
}, getViewProjInvMat4:function () {
    if (this.$L2) {
        okA._mat4(this.$x5);
        okA._mat4(this.$w5);
        this.$x5 = okMat4Mul(this.getProjMat4(), this.getViewMat4());
        this.$w5 = this.$x5.inverse();
        this.$L2 = false
    }
    return this.$w5
}, getFrustum:function () {
    if (this.$h2) {
        this.$H3.setByViewProjMat(this.getViewProjMat4());
        this.$h2 = false
    }
    return this.$H3
}, getPickPoint:function (c, h) {
    if (c == null || !okIsNumber(c) || h == null || !okIsNumber(h)) {
        okLog("[Error][okCamera.getPickPoint] Invalid canvas coordinate!")
    }
    var a = c - this.$35;
    var f = this.$15 - (h - this.$45);
    var d = okA.vec3();
    d.x = a / this.$25 * 2 - 1;
    d.y = f / this.$15 * 2 - 1;
    d.z = -0.99;
    var e = okMat4MulVec3(this.getViewProjInvMat4(), d);
    okA._vec3(d);
    return e
}, getPickDir:function (c, k) {
    if (c == null || !okIsNumber(c) || k == null || !okIsNumber(k)) {
        okLog("[Error][okCamera.getPickDir] Invalid canvas coordinate!")
    }
    var e = okA.vec3();
    if (this.$L4 == 1) {
        var a = c - this.$35;
        var h = this.$15 - (k - this.$45);
        var d = okA.vec3();
        d.x = a / this.$25 * 2 - 1;
        d.y = h / this.$15 * 2 - 1;
        d.z = -0.99;
        var f = okMat4MulVec3(this.getViewProjInvMat4(), d);
        e.x = f.x - this.$i5.m03;
        e.y = f.y - this.$i5.m13;
        e.z = f.z - this.$i5.m23;
        okA._vec3(d);
        okA._vec3(f)
    } else {
        e.x = -this.$i5.m02;
        e.y = -this.$i5.m12;
        e.z = -this.$i5.m22
    }
    return e
}, getPickFrustum:function (v, u, t, q) {
    if (v == null || !okIsNumber(v) || u == null || !okIsNumber(u) || t == null || !okIsNumber(t) || t == 0 || q == null || !okIsNumber(q) || q == 0) {
        okLog("[Error][okCamera.getPickFrustum] Invalid canvas area!")
    }
    var o = v + ((t > 0) ? 0 : t);
    var n = u + ((q > 0) ? 0 : q);
    t = (t > 0) ? t : -t;
    q = (q > 0) ? q : -q;
    var p = okA.vec3();
    p.x = this.$i5.m03;
    p.y = this.$i5.m13;
    p.z = this.$i5.m23;
    var f = this.getPickPoint(o, n);
    var d = this.getPickPoint(o + t, n);
    var c = this.getPickPoint(o + t, n + q);
    var a = this.getPickPoint(o, n + q);
    var m = okA.vec3();
    var l = okA.vec3();
    var h = okA.vec3();
    var e = okA.vec3();
    m.x = f.x - p.x;
    m.y = f.y - p.y;
    m.z = f.z - p.z;
    l.x = d.x - p.x;
    l.y = d.y - p.y;
    l.z = d.z - p.z;
    h.x = c.x - p.x;
    h.y = c.y - p.y;
    h.z = c.z - p.z;
    e.x = a.x - p.x;
    e.y = a.y - p.y;
    e.z = a.z - p.z;
    var k = new okFrustum();
    k.setByViewProjMat(this.getViewProjMat4());
    var s = okA.plane();
    var w = okVec3Cross(m, l);
    s.set(p, w);
    okA._vec3(w);
    k.setPlane(4, s);
    var w = okVec3Cross(h, e);
    s.set(p, w);
    okA._vec3(w);
    k.setPlane(5, s);
    var w = okVec3Cross(e, m);
    s.set(p, w);
    okA._vec3(w);
    k.setPlane(2, s);
    var w = okVec3Cross(l, h);
    s.set(p, w);
    okA._vec3(w);
    k.setPlane(3, s);
    okA._vec3(p);
    okA._vec3(f);
    okA._vec3(d);
    okA._vec3(c);
    okA._vec3(a);
    okA._vec3(m);
    okA._vec3(l);
    okA._vec3(h);
    okA._vec3(e);
    return k
}};
function okMaterial() {
    this.$56 = "";
    this.$47 = new okVec3(0, 0, 0);
    this.$Z6 = new okVec3(0, 0, 0);
    this.$37 = new okVec3(1, 1, 1);
    this.$a7 = new okVec3(0, 0, 0);
    this.$w3 = 1;
    this.$j3 = 8;
    this.$93 = 1;
    this.$Z1 = false;
    this.$Z3 = 32774;
    this.$04 = 32774;
    this.$24 = 770;
    this.$X3 = 771;
    this.$34 = 1;
    this.$Y3 = 1;
    this.$S1 = false;
    this.$a3 = 0;
    this.$a2 = true;
    this.$O2 = false;
    this.$n3 = 1;
    this.$J2 = false;
    this.$62 = true;
    this.$72 = true;
    this.$G2 = false;
    this.$67 = new okVec3(1, 1, 1);
    this.$i2 = false;
    this.$f2 = true;
    this.$e2 = true;
    this.$v1 = ["", "", "", "", "", "", ""];
    this.$x1 = [3553, 3553, 3553, 3553, 3553, 3553, 3553];
    this.$u1 = [9729, 9729, 9729, 9729, 9729, 9729, 9729];
    this.$y1 = [10497, 10497, 10497, 10497, 10497, 10497, 10497];
    this.$z1 = [10497, 10497, 10497, 10497, 10497, 10497, 10497];
    this.$C1 = ["Texcoord1", "Texcoord1", "Texcoord1", "Texcoord1", "Texcoord1", "Texcoord1", "Texcoord1"];
    this.$D1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.$E1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.$s1 = ["", "", "", "", "", "", ""];
    this.$c = ["", "", "", "", "", "", ""];
    this.$b2 = true;
    this.$92 = true;
    this.$82 = true;
    this.$E2 = true;
    this.$D2 = true;
    this.$s2 = true;
    this.$R1 = true;
    this.$j2 = true;
    this.$52 = true;
    this.$w2 = true;
    this.$F2 = true;
    this.$96 = "";
    this.$76 = "";
    this.$66 = "";
    this.$B6 = "";
    this.$A6 = "";
    this.$f6 = "";
    this.$Y5 = "";
    this.$b6 = "";
    this.$46 = "";
    this.$r6 = "";
    this.$C6 = "";
    this.$B1 = [new okVec4(), new okVec4(), new okVec4(), new okVec4(), new okVec4(), new okVec4(), new okVec4(), new okVec4()];
    this.$k6 = "";
    this.$j6 = "";
    this.$i6 = "";
    this.$p6 = "";
    this.$o6 = "";
    this.$m6 = "";
    this.$g6 = "";
    this.$l6 = "";
    this.$h6 = "";
    this.$n6 = "";
    this.$q6 = "";
    this.$73 = null;
    this.$w1 = [-1, -1, -1, -1, -1, -1, -1];
    this.$y6 = "";
    this.$u6 = "";
    this.$w6 = "";
    this.$l1 = okA.object();
    this.$B2 = true;
    this.$A2 = true
}
okMaterial.prototype = {clear:function () {
    this.$56 = "";
    this.$47.set(0, 0, 0);
    this.$Z6.set(0, 0, 0);
    this.$37.set(1, 1, 1);
    this.$a7.set(0, 0, 0);
    this.$w3 = 1;
    this.$j3 = 8;
    this.$93 = 1;
    this.$Z1 = false;
    this.$Z3 = 32774;
    this.$04 = 32774;
    this.$24 = 770;
    this.$X3 = 771;
    this.$34 = 1;
    this.$Y3 = 1;
    this.$S1 = false;
    this.$a3 = 0;
    this.$a2 = true;
    this.$O2 = false;
    this.$n3 = 1;
    this.$J2 = false;
    this.$62 = true;
    this.$72 = true;
    this.$G2 = false;
    this.$67.set(1, 1, 1);
    this.$i2 = false;
    this.$f2 = true;
    this.$e2 = true;
    for (var a = 0; a < 7; ++a) {
        this.$v1[a] = "";
        this.$D1[a * 2] = 0;
        this.$D1[a * 2 + 1] = 0;
        this.$E1[a * 2] = 1;
        this.$E1[a * 2 + 1] = 1;
        this.$x1[a] = 3553;
        this.$u1[a] = 9729;
        this.$y1[a] = 10497;
        this.$z1[a] = 10497;
        this.$C1[a] = "Texcoord1";
        this.$s1[a] = "";
        this.$c[a] = ""
    }
    this.$b2 = true;
    this.$92 = true;
    this.$82 = true;
    this.$E2 = true;
    this.$D2 = true;
    this.$s2 = true;
    this.$R1 = true;
    this.$j2 = true;
    this.$52 = true;
    this.$w2 = true;
    this.$F2 = true;
    this.$96 = "";
    this.$76 = "";
    this.$66 = "";
    this.$B6 = "";
    this.$A6 = "";
    this.$f6 = "";
    this.$Y5 = "";
    this.$b6 = "";
    this.$46 = "";
    this.$r6 = "";
    this.$C6 = "";
    for (var a = 0; a < this.$B1.length; ++a) {
        this.$B1[a].set(0, 0, 0, 0)
    }
    this.$k6 = "";
    this.$j6 = "";
    this.$i6 = "";
    this.$p6 = "";
    this.$o6 = "";
    this.$m6 = "";
    this.$g6 = "";
    this.$l6 = "";
    this.$h6 = "";
    this.$n6 = "";
    this.$q6 = "";
    for (var a = 0; a < 7; ++a) {
        this.$w1[a] = -1
    }
    this.$y6 = "";
    this.$u6 = "";
    this.$w6 = "";
    okA._object(this.$l1);
    this.$l1 = okA.object();
    this.$B2 = true;
    this.$A2 = true
}, clone:function (a) {
    var a = (a ? a : new okMaterial());
    a.$56 = this.$56;
    a.$47 = this.$47.clone();
    a.$Z6 = this.$Z6.clone();
    a.$37 = this.$37.clone();
    a.$a7 = this.$a7.clone();
    a.$w3 = this.$w3;
    a.$j3 = this.$j3;
    a.$93 = this.$93;
    a.$Z1 = this.$Z1;
    a.$Z3 = this.$Z3;
    a.$04 = this.$04;
    a.$24 = this.$24;
    a.$X3 = this.$X3;
    a.$34 = this.$34;
    a.$Y3 = this.$Y3;
    a.$S1 = this.$S1;
    a.$a3 = this.$a3;
    a.$a2 = this.$a2;
    a.$O2 = this.$O2;
    a.$n3 = this.$n3;
    a.$J2 = this.$J2;
    a.$62 = this.$62;
    a.$72 = this.$72;
    a.$G2 = this.$G2;
    this.$67.clone(a.$67);
    a.$i2 = this.$i2;
    a.$f2 = this.$f2;
    a.$e2 = this.$e2;
    for (var c = 0; c < 7; ++c) {
        a.setTextureName(c, this.$v1[c]);
        a.setTextureType(c, this.$x1[c]);
        a.setTextureFilter(c, this.$u1[c]);
        a.setTextureWrapU(c, this.$y1[c]);
        a.setTextureWrapV(c, this.$z1[c]);
        a.setTextureCoord(c, this.$C1[c]);
        a.setTextureCoordOffset(c, this.$D1[c * 2], this.$D1[c * 2 + 1]);
        a.setTextureCoordScale(c, this.$E1[c * 2], this.$E1[c * 2 + 1]);
        a.setTextureTangent(c, this.$s1[c]);
        a.setTextureBinormal(c, this.$c[c])
    }
    a.$b2 = this.$b2;
    a.$92 = this.$92;
    a.$82 = this.$82;
    a.$E2 = this.$E2;
    a.bGlossinessScript = this.bGlossinessScript;
    a.$R1 = this.$R1;
    a.$s2 = this.$s2;
    a.$j2 = this.$j2;
    a.$52 = this.$52;
    a.$w2 = this.$w2;
    a.$F2 = this.$F2;
    a.$96 = this.$96;
    a.$76 = this.$76;
    a.$66 = this.$66;
    a.$B6 = this.$B6;
    a.$A6 = this.$A6;
    a.$Y5 = this.$Y5;
    a.$f6 = this.$f6;
    a.$b6 = this.$b6;
    a.$46 = this.$46;
    a.$r6 = this.$r6;
    a.$C6 = this.$C6;
    for (var c = 0; c < this.$B1.length; ++c) {
        this.$B1[c].clone(a.$B1[c])
    }
    a.$k6 = this.$k6;
    a.$j6 = this.$j6;
    a.$i6 = this.$i6;
    a.$p6 = this.$p6;
    a.$o6 = this.$o6;
    a.$g6 = this.$g6;
    a.$m6 = this.$m6;
    a.$l6 = this.$l6;
    a.$h6 = this.$h6;
    a.$n6 = this.$n6;
    a.$q6 = this.$q6;
    a.$B2 = true;
    a.$A2 = true;
    return a
}, setDesc:function (a) {
    this.$56 = a
}, getDesc:function () {
    return this.$56
}, setEmissive:function (c, a, d) {
    if (a != null && d != null) {
        if (c == null || a == null || d == null || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(d)) {
            okLog("[Error][okMaterial.setEmissive] Invalid RGB color!")
        }
        this.$47.set(c, a, d)
    } else {
        if (c == null || c.__isVec3Complete == null || !c.__isVec3Complete()) {
            okLog("[Error][okMaterial.setEmissive] Invalid RGB color!")
        }
        this.$47 = c.clone()
    }
}, getEmissive:function () {
    return this.$47.clone()
}, setAmbient:function (c, a, d) {
    if (a != null && d != null) {
        if (c == null || a == null || d == null || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(d)) {
            okLog("[Error][okMaterial.setAmbient] Invalid RGB color!")
        }
        this.$Z6.set(c, a, d)
    } else {
        if (c == null || c.__isVec3Complete == null || !c.__isVec3Complete()) {
            okLog("[Error][okMaterial.setAmbient] Invalid RGB color!")
        }
        this.$Z6 = c.clone()
    }
}, getAmbient:function () {
    return this.$Z6.clone()
}, setDiffuse:function (c, a, d) {
    if (a != null && d != null) {
        if (c == null || a == null || d == null || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(d)) {
            okLog("[Error][okMaterial.setDiffuse] Invalid RGB color!")
        }
        this.$37.set(c, a, d)
    } else {
        if (c == null || c.__isVec3Complete == null || !c.__isVec3Complete()) {
            okLog("[Error][okMaterial.setDiffuse] Invalid RGB color!")
        }
        this.$37 = c.clone()
    }
}, getDiffuse:function () {
    return this.$37.clone()
}, setSpecular:function (c, a, d) {
    if (a != null && d != null) {
        if (c == null || a == null || d == null || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(d)) {
            okLog("[Error][okMaterial.setSpecular] Invalid RGB color!")
        }
        this.$a7.set(c, a, d)
    } else {
        if (c == null || c.__isVec3Complete == null || !c.__isVec3Complete()) {
            okLog("[Error][okMaterial.setSpecular] Invalid RGB color!")
        }
        this.$a7 = c.clone()
    }
}, getSpecular:function () {
    return this.$a7.clone()
}, setSpecularLevel:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okMaterial.setSpecularLevel] Invalid specular level value!")
    }
    this.$w3 = a
}, getSpecularLevel:function () {
    return this.$w3
}, setGlossiness:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okMaterial.setGlossiness] Invalid glossiness value!")
    }
    this.$j3 = a
}, getGlossiness:function () {
    return this.$j3
}, setAlpha:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okMaterial.setAlpha] Invalid alpha value!")
    } else {
        if (a < 0 || a > 1) {
            okLog("[Warning][okMaterial.setAlpha] Alpha should be between [0.0, 1.0]!")
        }
    }
    this.$93 = a
}, getAlpha:function () {
    return this.$93
}, enableBlend:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableBlend] Invalid parameter!")
    }
    this.$Z1 = a;
    this.$B2 = true;
    this.$A2 = true
}, isBlend:function () {
    okLog("[Warning][okMaterial.isBlend] This method is deprecated, and you can replace it with okMaterial#isBlendEnabled!");
    return this.$Z1
}, isBlendEnabled:function () {
    return this.$Z1
}, setBlendEquation:function (a, c) {
    if (a == 3 || a == 1) {
        this.$Z3 = c
    }
    if (a == 3 || a == 2) {
        this.$04 = c
    }
}, getBlendEquation:function (a) {
    if (a == 1 || a == 3) {
        return this.$Z3
    } else {
        if (a == 2) {
            return this.$04
        }
    }
}, setBlendFunc:function (a, d, c) {
    if (a == 3 || a == 1) {
        this.$24 = d;
        this.$X3 = c
    }
    if (a == 3 || a == 2) {
        this.$34 = d;
        this.$Y3 = c
    }
}, getBlendFuncSrc:function (a) {
    if (a == 1 || a == 3) {
        return this.$24
    } else {
        if (a == 2) {
            return this.$34
        }
    }
}, getBlendFuncDest:function (a) {
    if (a == 1 || a == 3) {
        return this.$X3
    } else {
        if (a == 2) {
            return this.$Y3
        }
    }
}, enableFog:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableFog] Invalid parameter!")
    }
    this.$f2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isFogEnabled:function () {
    return this.$f2
}, enableFacingSpecular:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableFacingSpecular] Invalid parameter!")
    }
    this.$e2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isFacingSpecularEnabled:function () {
    return this.$e2
}, enableAlphaTest:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableAlphaTest] Invalid parameter!")
    }
    this.$S1 = a;
    this.$B2 = true;
    this.$A2 = true
}, isAlphaTest:function () {
    okLog("[Warning][okMaterial.isAlphaTest] This method is deprecated, and you can replace it with okMaterial#isAlphaTestEnabled!");
    return this.$S1
}, isAlphaTestEnabled:function () {
    return this.$S1
}, setAlphaTestValue:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okMaterial.setAlphaTestValue] Invalid alpha test value!")
    }
    this.$a3 = a
}, getAlphaTestValue:function (a) {
    return this.$a3
}, enableDynamicLighting:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableDynamicLighting] Invalid parameter!")
    }
    this.$a2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isDynamicLighting:function () {
    okLog("[Warning][okMaterial.isDynamicLighting] This method is deprecated, and you can replace it with okMaterial#isDynamicLightingEnabled!");
    return this.$a2
}, isDynamicLightingEnabled:function () {
    return this.$a2
}, enableWireframe:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableWireframe] Invalid parameter!")
    }
    this.$O2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isWireframe:function () {
    okLog("[Warning][okMaterial.isWireframe] This method is deprecated, and you can replace it with okMaterial#isWireframeEnabled!");
    return this.$O2
}, isWireframeEnabled:function () {
    return this.$O2
}, setLineWidth:function (a) {
    okLog("[Warning][okMaterial.setLineWidth] This method is deprecated for now!");
    this.$n3 = a
}, getLineWidth:function () {
    return this.$n3
}, enableVertexColor:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableVertexColor] Invalid parameter!")
    }
    this.$J2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isVertexColor:function () {
    okLog("[Warning][okMaterial.isVertexColor] This method is deprecated, and you can replace it with okMaterial#isVertexColorEnabled!");
    return this.$J2
}, isVertexColorEnabled:function () {
    return this.$J2
}, enableDepthTest:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableDepthTest] Invalid parameter!")
    }
    this.$62 = a
}, isDepthTest:function () {
    okLog("[Warning][okMaterial.isDepthTest] This method is deprecated, and you can replace it with okMaterial#isDepthTestEnabled!");
    return this.$62
}, isDepthTestEnabled:function () {
    return this.$62
}, enableDepthWrite:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableDepthWrite] Invalid parameter!")
    }
    this.$72 = a
}, isDepthWrite:function () {
    okLog("[Warning][okMaterial.isDepthWrite] This method is deprecated, and you can replace it with okMaterial#isDepthWriteEnabled!");
    return this.$72
}, isDepthWriteEnabled:function () {
    return this.$72
}, enableTwoSide:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableTwoSide] Invalid parameter!")
    }
    this.$G2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isTwoSide:function () {
    okLog("[Warning][okMaterial.isTwoSide] This method is deprecated, and you can replace it with okMaterial#isTwoSideEnabled!");
    return this.$G2
}, isTwoSideEnabled:function () {
    return this.$G2
}, enableGlow:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableGlow] Invalid parameter!")
    }
    this.$i2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isGlow:function () {
    okLog("[Warning][okMaterial.isGlow] This method is deprecated, and you can replace it with okMaterial#isGlowEnabled!");
    return this.$i2
}, isGlowEnabled:function () {
    return this.$i2
}, setGlowColor:function (c, a, d) {
    if (a != null && d != null) {
        if (c == null || a == null || d == null || !okIsNumber(c) || !okIsNumber(a) || !okIsNumber(d)) {
            okLog("[Error][okMaterial.setGlowColor] Invalid RGB color!")
        }
        this.$67.set(c, a, d)
    } else {
        if (c == null || c.__isVec3Complete == null || !c.__isVec3Complete()) {
            okLog("[Error][okMaterial.setGlowColor] Invalid RGB color!")
        }
        c.clone(this.$67)
    }
}, getGlowColor:function () {
    return this.$67
}, setTextureName:function (h, f) {
    if (h == null || !okIsNumber(h) || h < 0 || h > 6) {
        okLog("[Error][okMaterial.setTextureName] Invalid texture channel!")
    }
    if (f == null || !okIsString(f)) {
        okLog("[Error][okMaterial.setTextureName] Invalid texture name!")
    }
    f = f.replace(/\\/g, "/");
    f = f.replace(/^\/+/g, "");
    this.$v1[h] = f;
    if (f != "") {
        var n = f.split(" ");
        if (n.length == 6) {
            this.$x1[h] = 34067
        }
    }
    if (this.$73 != null) {
        var k = this.$73;
        var c = k.$e7.$I6.$U5;
        var a = k.$e7.$I6;
        if (f != "") {
            var d = k.$e7.$I6._packTextureUrl(f);
            var o = c.createResource(2, d);
            k.addResourceRef(o);
            this.$w1[h] = o;
            var l = c.getResourceState(o);
            if (l == 2) {
                if (this.$x1[h] == 3553) {
                    c.loadTextureByUrl(o, d, 6408)
                } else {
                    if (this.$x1[h] == 34067) {
                        var m = f.split(" ");
                        if (m.length == 6) {
                            c.loadCubeTextureByUrl(o, a._packTextureUrl(m[0]), a._packTextureUrl(m[1]), a._packTextureUrl(m[2]), a._packTextureUrl(m[3]), a._packTextureUrl(m[4]), a._packTextureUrl(m[5]))
                        } else {
                            okLog("[Error][okMaterial.setTextureName] Invalid cube texture name:" + f + "!")
                        }
                    }
                }
            }
        } else {
            this.$w1[h] = -1
        }
    }
    this.$B2 = true;
    this.$A2 = true;
    this.$k6 = "";
    this.$j6 = "";
    this.$i6 = "";
    this.$p6 = "";
    this.$o6 = "";
    this.$m6 = "";
    this.$g6 = "";
    this.$l6 = "";
    this.$h6 = "";
    this.$n6 = "";
    this.$q6 = ""
}, getTextureName:function (a) {
    return this.$v1[a]
}, getTextureResourceId:function (a) {
    return this.$w1[a]
}, setTextureType:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureType] Invalid texture channel!")
    }
    if (a == null || (a != 3553 && a != 34067)) {
        okLog("[Error][okMaterial.setTextureType] Invalid texture type!")
    }
    this.$x1[c] = a;
    if (this.$v1[c] != "") {
        this.setTextureName(c, this.$v1[c])
    }
    this.$k6 = "";
    this.$j6 = "";
    this.$i6 = "";
    this.$p6 = "";
    this.$o6 = "";
    this.$m6 = "";
    this.$g6 = "";
    this.$h6 = "";
    this.$n6 = "";
    this.$q6 = "";
    this.$B2 = true;
    this.$A2 = true;
    this.$k6 = "";
    this.$j6 = "";
    this.$i6 = "";
    this.$p6 = "";
    this.$o6 = "";
    this.$m6 = "";
    this.$g6 = "";
    this.$l6 = "";
    this.$h6 = "";
    this.$n6 = "";
    this.$q6 = ""
}, getTextureType:function (a) {
    return this.$x1[a]
}, setTextureFilter:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureFilter] Invalid texture channel!")
    }
    if (a == null || (a != 9729 && $Z4 != 9728 && $Z4 != 9986 && $Z4 != 9984 && $Z4 != 9987 && $Z4 != 9985)) {
        okLog("[Error][okMaterial.setTextureFilter] Invalid texture filter!")
    }
    this.$u1[c] = a
}, getTextureFilter:function (a) {
    return this.$u1[a]
}, setTextureWrap:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureWrap] Invalid texture channel!")
    }
    if (a == null || (a != 10497 && a != 33071 && a != 33648)) {
        okLog("[Error][okMaterial.setTextureWrap] Invalid texture wrap mode!")
    }
    this.$y1[c] = a;
    this.$z1[c] = a
}, setTextureWrapU:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureWrap] Invalid texture channel!")
    }
    if (a == null || (a != 10497 && a != 33071 && a != 33648)) {
        okLog("[Error][okMaterial.setTextureWrap] Invalid texture wrap mode!")
    }
    this.$y1[c] = a
}, setTextureWrapV:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureWrap] Invalid texture channel!")
    }
    if (a == null || (a != 10497 && a != 33071 && a != 33648)) {
        okLog("[Error][okMaterial.setTextureWrap] Invalid texture wrap mode!")
    }
    this.$z1[c] = a
}, getTextureWrapU:function (a) {
    return this.$y1[a]
}, getTextureWrapV:function (a) {
    return this.$z1[a]
}, setTextureCoord:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureCoord] Invalid texture channel!")
    }
    if (a == null || a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setTextureCoord] Invalid attribute name for texture coordinate!")
    }
    this.$C1[c] = a;
    this.$B2 = true;
    this.$A2 = true
}, getTextureCoord:function (a) {
    return this.$C1[a]
}, setTextureCoordOffset:function (d, c, a) {
    if (d == null || !okIsNumber(d) || d < 0 || d > 6) {
        okLog("[Error][okMaterial.setTextureCoordOffset] Invalid texture channel!")
    }
    if (c == null || (!okIsNumber(c) && c.x == null) || !okIsNumber(a)) {
        okLog("[Error][okMaterial.setTextureCoordOffset] Invalid offset value!")
    }
    if (okIsNumber(c)) {
        this.$D1[d * 2] = c;
        this.$D1[d * 2 + 1] = a
    } else {
        this.$D1[d * 2] = c.x;
        this.$D1[d * 2 + 1] = c.y
    }
}, getTextureCoordOffset:function (c) {
    var a = okA.vec2();
    a.x = this.$D1[c * 2];
    a.y = this.$D1[c * 2 + 1];
    return a
}, setTextureCoordScale:function (d, c, a) {
    if (d == null || !okIsNumber(d) || d < 0 || d > 6) {
        okLog("[Error][okMaterial.setTextureCoordScale] Invalid texture channel!")
    }
    if (c == null || (!okIsNumber(c) && c.x == null) || !okIsNumber(a)) {
        okLog("[Error][okMaterial.setTextureCoordScale] Invalid scaling factor!")
    }
    if (okIsNumber(c)) {
        this.$E1[d * 2] = c;
        this.$E1[d * 2 + 1] = a
    } else {
        this.$E1[d * 2] = c.x;
        this.$E1[d * 2 + 1] = c.y
    }
}, getTextureCoordScale:function (c) {
    var a = okA.vec2();
    a.x = this.$E1[c * 2];
    a.y = this.$E1[c * 2 + 1];
    return a
}, setTextureTangent:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureTangent] Invalid texture channel!")
    }
    if (a == null || a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setTextureTangent] Invalid attribute name for texture tangent!")
    }
    this.$s1[c] = a;
    this.$B2 = true;
    this.$A2 = true
}, getTextureTangent:function (a) {
    return this.$s1[a]
}, setTextureBinormal:function (c, a) {
    if (c == null || !okIsNumber(c) || c < 0 || c > 6) {
        okLog("[Error][okMaterial.setTextureBinormal] Invalid texture channel!")
    }
    if (a == null || a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setTextureBinormal] Invalid attribute name for texture binormal!")
    }
    this.$c[c] = a;
    this.$B2 = true;
    this.$A2 = true
}, getTextureBinormal:function (a) {
    return this.$c[a]
}, enableEmissiveScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableEmissiveScript] Invalid parameter!")
    }
    this.$b2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isEmissiveScriptEnabled:function () {
    return this.$b2
}, enableDiffuseScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableDiffuseScript] Invalid parameter!")
    }
    this.$92 = a;
    this.$B2 = true;
    this.$A2 = true
}, isDiffuseScriptEnabled:function () {
    return this.$92
}, enableDiffusePowerScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableDiffusePowerScript] Invalid parameter!")
    }
    this.$82 = a;
    this.$B2 = true;
    this.$A2 = true
}, isDiffusePowerScriptEnabled:function () {
    return this.$82
}, enableSpecularScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableSpecularScript] Invalid parameter!")
    }
    this.$E2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isSpecularScriptEnabled:function () {
    return this.$E2
}, enableSpecularPowerScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableSpecularPowerScript] Invalid parameter!")
    }
    this.$D2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isSpecularPowerScriptEnabled:function () {
    return this.$D2
}, enableAlphaScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableAlphaScript] Invalid parameter!")
    }
    this.$R1 = a;
    this.$B2 = true;
    this.$A2 = true
}, isAlphaScriptEnabled:function () {
    return this.$R1
}, enableNormalScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableNormalScript] Invalid parameter!")
    }
    this.$s2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isNormalScriptEnabled:function () {
    return this.$s2
}, enableGlowScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableGlowScript] Invalid parameter!")
    }
    this.$j2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isGlowScriptEnabled:function () {
    return this.$j2
}, enableDctLightScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableDctLightScript] Invalid parameter!")
    }
    this.$52 = a;
    this.$B2 = true;
    this.$A2 = true
}, isDctLightScriptEnabled:function () {
    return this.$52
}, enablePointLightScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enablePointLightScript] Invalid parameter!")
    }
    this.$w2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isPointLightScriptEnabled:function () {
    return this.$w2
}, enableSpotLightScript:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okMaterial.enableSpotLightScript] Invalid parameter!")
    }
    this.$F2 = a;
    this.$B2 = true;
    this.$A2 = true
}, isSpotLightScriptEnabled:function () {
    return this.$F2
}, setEmissiveScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setEmissiveScript] Invalid material script!")
    }
    this.$96 = a;
    this.$k6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getEmissiveScript:function () {
    return this.$96
}, getPackedEmissiveScript:function () {
    if (this.$96 != "" && this.$k6 == "") {
        this.$k6 = this._processScript(this.$96, true, "vec3")
    }
    return this.$k6
}, setDiffuseScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setDiffuseScript] Invalid material script!")
    }
    this.$76 = a;
    this.$j6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getDiffuseScript:function () {
    return this.$76
}, getPackedDiffuseScript:function () {
    if (this.$76 != "" && this.$j6 == "") {
        this.$j6 = this._processScript(this.$76, true, "vec3")
    }
    return this.$j6
}, setDiffusePowerScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setDiffusePowerScript] Invalid material script!")
    }
    this.$66 = a;
    this.$i6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getDiffusePowerScript:function () {
    return this.$66
}, getPackedDiffusePowerScript:function () {
    if (this.$66 != "" && this.$i6 == "") {
        this.$i6 = this._processScript(this.$66, true, "float")
    }
    return this.$i6
}, setSpecularScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setSpecularScript] Invalid material script!")
    }
    this.$B6 = a;
    this.$p6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getSpecularScript:function () {
    return this.$B6
}, getPackedSpecularScript:function () {
    if (this.$B6 != "" && this.$p6 == "") {
        this.$p6 = this._processScript(this.$B6, true, "vec3")
    }
    return this.$p6
}, setSpecularPowerScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setSpecularPowerScript] Invalid material script!")
    }
    this.$A6 = a;
    this.$o6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getSpecularPowerScript:function () {
    return this.$A6
}, getPackedSpecularPowerScript:function () {
    if (this.$A6 != "" && this.$o6 == "") {
        this.$o6 = this._processScript(this.$A6, true, "float")
    }
    return this.$o6
}, setNormalScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setNormalScript] Invalid material script!")
    }
    this.$f6 = a;
    this.$m6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getNormalScript:function () {
    return this.$f6
}, getPackedNormalScript:function () {
    if (this.$f6 != "" && this.$m6 == "") {
        this.$m6 = this._processScript(this.$f6, true, "vec3")
    }
    return this.$m6
}, setGlowScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setGlowScript] Invalid material script!")
    }
    this.$b6 = a;
    this.$l6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getGlowScript:function () {
    return this.$b6
}, getPackedGlowScript:function () {
    if (this.$b6 != "" && this.$l6 == "") {
        this.$l6 = this._processScript(this.$b6, true, "vec3")
    }
    return this.$l6
}, setAlphaScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setAlphaScript] Invalid material script!")
    }
    this.$Y5 = a;
    this.$g6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getAlphaScript:function () {
    return this.$Y5
}, getPackedAlphaScript:function () {
    if (this.$Y5 != "" && this.$g6 == "") {
        this.$g6 = this._processScript(this.$Y5, true, "float")
    }
    return this.$g6
}, setDctLightScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setDctLightScript] Invalid material script!")
    }
    this.$46 = a;
    this.$h6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getDctLightScript:function () {
    return this.$46
}, getPackedDctLightScript:function () {
    if (this.$46 != "" && this.$h6 == "") {
        this.$h6 = this._processScript(this.$46, false)
    }
    return this.$h6
}, setPointLightScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setPointLightScript] Invalid material script!")
    }
    this.$r6 = a;
    this.$n6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getPointLightScript:function () {
    return this.$r6
}, getPackedPointLightScript:function () {
    if (this.$r6 != "" && this.$n6 == "") {
        this.$n6 = this._processScript(this.$r6, false)
    }
    return this.$n6
}, setSpotLightScript:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okMaterial.setSpotLightScript] Invalid material script!")
    }
    this.$C6 = a;
    this.$q6 = "";
    this.$B2 = true;
    this.$A2 = true
}, getSpotLightScript:function () {
    return this.$C6
}, getPackedSpotLightScript:function () {
    if (this.$C6 != "" && this.$q6 == "") {
        this.$q6 = this._processScript(this.$C6, false)
    }
    return this.$q6
}, setScriptConst:function (c, a, f, e, d) {
    if (a.x != null) {
        this.$B1[c].x = a.x;
        this.$B1[c].y = a.y;
        this.$B1[c].z = a.z;
        this.$B1[c].w = a.w
    } else {
        this.$B1[c].x = a;
        this.$B1[c].y = f;
        this.$B1[c].z = e;
        this.$B1[c].w = d
    }
}, getScriptConst:function (a) {
    return this.$B1[a].clone()
}, _setEntity:function (a) {
    this.$73 = a
}, _processScript:function (k, f, n) {
    var u = "";
    var h = k.length;
    var s = false;
    for (var o = 0; o < h; ++o) {
        var v = k.charAt(o);
        if (v == "\n") {
            s = false;
            continue
        }
        if (s) {
            continue
        }
        if (v == " ") {
            if (u.length > 0 && o < (h - 1)) {
                var l = u.charCodeAt(u.length - 1);
                var q = k.charCodeAt(o + 1);
                if (((l >= 48 && l <= 57) || (l >= 65 && l <= 90) || (l >= 97 && l <= 122)) && ((q >= 48 && q <= 57) || (q >= 65 && q <= 90) || (q >= 97 && q <= 122))) {
                    u += " "
                }
            }
        } else {
            if (v == "/") {
                if (o == h - 1) {
                    u += "/"
                } else {
                    if (k.charAt(o + 1) == "/") {
                        s = true
                    } else {
                        u += "/"
                    }
                }
            } else {
                u += v
            }
        }
    }
    if (u == "") {
        return""
    }
    if (f) {
        var p = u.match(/\breturn\b/g);
        if (p == null) {
            u = "return " + n + "(" + u + ");"
        }
    }
    u = u.replace(/(^|[^a-zA-Z0-9_\.])(\d+)(?![0-9]|\.)/g, "$1$2.0");
    u = u.replace(/\[(\d+)\.(\d*)\]/g, "[$1]");
    if (this.$v1[0]) {
        u = u.replace(/\(ALBEDO1,/g, " okFunc_FetchTexture(okUni_Sampler0,")
    } else {
        u = u.replace(/\(ALBEDO1,/g, " okFunc_FetchDummyTexture(")
    }
    if (this.$v1[1]) {
        u = u.replace(/\(ALBEDO2,/g, " okFunc_FetchTexture(okUni_Sampler1,")
    } else {
        u = u.replace(/\(ALBEDO2,/g, " okFunc_FetchDummyTexture(")
    }
    if (this.$v1[2]) {
        u = u.replace(/\(ALBEDO3,/g, " okFunc_FetchTexture(okUni_Sampler2,")
    } else {
        u = u.replace(/\(ALBEDO3,/g, " okFunc_FetchDummyTexture(")
    }
    if (this.$v1[3]) {
        u = u.replace(/\(ALBEDO4,/g, " okFunc_FetchTexture(okUni_Sampler3,")
    } else {
        u = u.replace(/\(ALBEDO4,/g, " okFunc_FetchDummyTexture(")
    }
    if (this.$v1[4]) {
        u = u.replace(/\(NORMAL,/g, " okFunc_FetchTexture(okUni_Sampler4,")
    } else {
        u = u.replace(/\(NORMAL,/g, " okFunc_FetchDummyTexture(")
    }
    if (this.$v1[5]) {
        u = u.replace(/\(OPACITY,/g, " okFunc_FetchTexture(okUni_Sampler5,")
    } else {
        u = u.replace(/\(OPACITY,/g, " okFunc_FetchDummyTexture(")
    }
    if (this.$v1[6]) {
        u = u.replace(/\(SPECULARLEVEL,/g, " okFunc_FetchTexture(okUni_Sampler6,")
    } else {
        u = u.replace(/\(SPECULARLEVEL,/g, " okFunc_FetchDummyTexture(")
    }
    u = u.replace(/texture2D okFunc_FetchTexture\(/g, "texture2D");
    u = u.replace(/textureCube okFunc_FetchTexture\(/g, "textureCube");
    var m = okA.array();
    var e = okA.array();
    var d = okA.array();
    var a = -1;
    var t = -1;
    var h = u.length;
    for (var o = 0; o < h; ++o) {
        switch (u.charAt(o)) {
            case"[":
                m.push("[");
                d.push(a);
                e.push(t);
                a = 0;
                t = m.length - 1;
                break;
            case"]":
                if (t != -1) {
                    if (a >= 1) {
                        m[t] = " vec" + (a + 1) + "(";
                        m.push(")")
                    } else {
                        m.push("]")
                    }
                    if (e.length > 0) {
                        t = e.pop()
                    } else {
                        return""
                    }
                    a = d.pop()
                } else {
                    return""
                }
                break;
            case"(":
                m.push("(");
                d.push(a);
                e.push(t);
                a = 0;
                t = m.length - 1;
                break;
            case")":
                if (t != -1) {
                    m.push(")");
                    if (e.length > 0) {
                        t = e.pop()
                    } else {
                        return""
                    }
                    a = d.pop()
                } else {
                    return""
                }
                break;
            case",":
                a += 1;
                m.push(",");
                break;
            default:
                m.push(u.charAt(o))
        }
    }
    u = m.join("");
    okA._array(m);
    okA._array(d);
    okA._array(e);
    return u
}, _genShdKey:function () {
    var o = this.$b2 ? this.getPackedEmissiveScript() : "";
    var e = this.$92 ? this.getPackedDiffuseScript() : "";
    var p = this.$82 ? this.getPackedDiffusePowerScript() : "";
    var m = this.$E2 ? this.getPackedSpecularScript() : "";
    var s = this.$D2 ? this.getPackedSpecularPowerScript() : "";
    var n = this.$R1 ? this.getPackedAlphaScript() : "";
    var t = this.$s2 ? this.getPackedNormalScript() : "";
    var h = this.$j2 ? this.getPackedGlowScript() : "";
    var f = this.$52 ? this.getPackedDctLightScript() : "";
    var q = this.$w2 ? this.getPackedPointLightScript() : "";
    var c = this.$F2 ? this.getPackedSpotLightScript() : "";
    var l = 0;
    for (var k = 0; k < 7; ++k) {
        if (this.$v1[k] != "") {
            l += (2 << (k * 2));
            if (this.$x1[0] == 34067) {
                l += (2 << (k * 2 + 1))
            }
        }
    }
    var a = "" + ((this.$C1[0] != "") ? this.$C1[0].charAt(8) : 0) + ((this.$C1[1] != "") ? this.$C1[1].charAt(8) : 0) + ((this.$C1[2] != "") ? this.$C1[2].charAt(8) : 0) + ((this.$C1[3] != "") ? this.$C1[3].charAt(8) : 0) + ((this.$C1[4] != "") ? this.$C1[4].charAt(8) : 0) + ((this.$C1[5] != "") ? this.$C1[5].charAt(8) : 0) + ((this.$C1[6] != "") ? this.$C1[6].charAt(8) : 0);
    var d = (this.$v1[4] != "") ? 1 : 0;
    this.$y6 = d;
    this.$u6 = "" + l + "_" + a + "_" + d + (this.$a2 ? 1 : 0) + (this.$Z1 ? 1 : 0) + (this.$S1 ? 1 : 0) + (this.$J2 ? 1 : 0) + (this.$G2 ? 1 : 0) + (this.$f2 ? 1 : 0) + (this.$e2 ? 1 : 0) + "_" + o + "_" + e + "_" + p + "_" + m + "_" + s + "_" + n + "_" + t + "_" + h + "_" + f + "_" + q + "_" + c;
    this.$w6 = this.$u6
}, _genShdDef:function () {
    for (var p in this.$l1) {
        delete this.$l1[p]
    }
    var k = this.$b2 ? this.getPackedEmissiveScript() : "";
    var c = this.$92 ? this.getPackedDiffuseScript() : "";
    var l = this.$82 ? this.getPackedDiffusePowerScript() : "";
    var f = this.$E2 ? this.getPackedSpecularScript() : "";
    var n = this.$D2 ? this.getPackedSpecularPowerScript() : "";
    var h = this.$R1 ? this.getPackedAlphaScript() : "";
    var q = this.$s2 ? this.getPackedNormalScript() : "";
    var e = this.$j2 ? this.getPackedGlowScript() : "";
    var d = this.$52 ? this.getPackedDctLightScript() : "";
    var m = this.$w2 ? this.getPackedPointLightScript() : "";
    var a = this.$F2 ? this.getPackedSpotLightScript() : "";
    var o = this.$l1;
    if (this.$a2) {
        o.OK_DYNAMICLIGHTING = 1
    }
    if (this.$J2) {
        o.OK_AUTO_VERTEX_COLOR = 1
    }
    if (this.bTwoSidey) {
        o.OK_TWO_SIDE = 1
    }
    if (this.$Z1) {
        o.OK_BLEND = 1
    }
    if (this.$S1) {
        o.OK_ALPHA_TEST = 1
    }
    if (this.$f2) {
        o.OK_FOG = 1
    }
    if (this.$e2) {
        o.OK_FACING_SPECULAR = 1
    }
    if (this.$v1[0] != "") {
        o.OK_TEX_ALBEDO1 = 1
    }
    if (this.$v1[1] != "") {
        o.OK_TEX_ALBEDO2 = 1
    }
    if (this.$v1[2] != "") {
        o.OK_TEX_ALBEDO3 = 1
    }
    if (this.$v1[3] != "") {
        o.OK_TEX_ALBEDO4 = 1
    }
    if (this.$v1[4] != "") {
        o.OK_TEX_NORMALMAP = 1
    }
    if (this.$v1[5] != "") {
        o.OK_TEX_OPACITY = 1
    }
    if (this.$v1[6] != "") {
        o.OK_TEX_SPECULAR_LEVEL = 1
    }
    if (this.$s1[4] != "") {
        o.OK_TANGENT = 1
    }
    if (this.$c[4] != "") {
        o.OK_BINORMAL = 1
    }
    if (this.$x1[0] == 34067) {
        o.OK_TEX_ALBEDO1_CUBE = 1
    }
    if (this.$x1[1] == 34067) {
        o.OK_TEX_ALBEDO2_CUBE = 1
    }
    if (this.$x1[2] == 34067) {
        o.OK_TEX_ALBEDO3_CUBE = 1
    }
    if (this.$x1[3] == 34067) {
        o.OK_TEX_ALBEDO4_CUBE = 1
    }
    if (k != "") {
        o.OK_SCRIPT_EMISSIVE_CODE = k
    }
    if (c != "") {
        o.OK_SCRIPT_DIFFUSE_CODE = c
    }
    if (l != "") {
        o.OK_SCRIPT_DIFFUSEPOWER_CODE = l
    }
    if (f != "") {
        o.OK_SCRIPT_SPECULAR_CODE = f
    }
    if (n != "") {
        o.OK_SCRIPT_SPECULARPOWER_CODE = n
    }
    if (h != "") {
        o.OK_SCRIPT_ALPHA_CODE = h
    }
    if (q != "") {
        o.OK_SCRIPT_NORMAL_CODE = q
    }
    if (e != "") {
        o.OK_SCRIPT_GLOW_CODE = e
    }
    if (d != "") {
        o.OK_SCRIPT_DCTLIGHT_CODE = d
    }
    if (m != "") {
        o.OK_SCRIPT_POINTLIGHT_CODE = m
    }
    if (a != "") {
        o.OK_SCRIPT_SPOTLIGHT_CODE = a
    }
}, _getShdKeyV:function () {
    if (this.$B2) {
        this._genShdKey();
        this.$B2 = false
    }
    return this.$y6
}, _getShdKeyF:function () {
    if (this.$B2) {
        this._genShdKey();
        this.$B2 = false
    }
    return this.$u6
}, _getShdKeyP:function () {
    if (this.$B2) {
        this._genShdKey();
        this.$B2 = false
    }
    return this.$w6
}, _getShdDef:function (c) {
    if (this.$A2) {
        this._genShdDef();
        this.$A2 = false
    }
    for (var a in this.$l1) {
        c[a] = this.$l1[a]
    }
}};
function okMeshSkin() {
    this.$h = new Array;
    this.$g = new Object;
    this.$i = new Array;
    this.$P2 = new okAABBox(new okVec3(10000000000, 10000000000, 10000000000), new okVec3(-10000000000, -10000000000, -10000000000));
    this.$G6 = "";
    this.$H6 = ""
}
okMeshSkin.prototype = {clear:function () {
    this.$h = new Array;
    this.$g = new Object;
    this.$i = new Array;
    this.$P2.set(new okVec3(10000000000, 10000000000, 10000000000), new okVec3(-10000000000, -10000000000, -10000000000));
    this.$G6 = "";
    this.$H6 = ""
}, clone:function (a) {
    if (a == null) {
        a = new okMeshSkin()
    }
    a.$h = this.$h.slice();
    a.$g = new Object;
    for (var d in this.$g) {
        a.$g[d] = this.$g[d]
    }
    a.$i.length = 0;
    for (var c = 0; c < this.$i.length; ++c) {
        a.$i.push(this.$i[c].clone())
    }
    this.$P2.clone(a.$P2);
    a.$G6 = this.$G6;
    a.$H6 = this.$H6;
    return a
}, setBoundingBox:function (c, a) {
    this.$P2.set(c, a)
}, getBoundingBox:function () {
    return this.$P2
}, addBone:function (a, c) {
    this.$g[a] = this.$h.length;
    this.$h.push(a);
    this.$i.push(c.clone())
}, getBoneNum:function () {
    return this.$h.length
}, setRefAttributeName:function (a, c) {
    this.$G6 = a;
    this.$H6 = c
}, getVertexBoneIdxAttribName:function () {
    return this.$G6
}, getVertexBoneWeightAttribName:function () {
    return this.$H6
}, getBoneNameArray:function () {
    return this.$h
}, getSkinMat:function (a) {
    return this.$i[this.$g[a]]
}, getSkinMatArray:function () {
    return this.$i
}};
function okMesh(a) {
    this.rc = a;
    this.$e6 = "";
    this.$z5 = new okMaterial(a);
    this.$P2 = new okAABBox();
    this.$Q2 = true;
    this.$n5 = okA.mat43();
    this.$q5 = okA.mat43();
    this.$9 = okA.object();
    this.$8 = okA.object();
    this.$U3 = 0;
    this.$05 = 0;
    this.$O1 = okA.object();
    this.$T1 = true;
    this.$I = okA.object();
    this.$H = okA.object();
    this.$J = okA.object();
    this.$z4 = 0;
    this.$M1 = new okMeshSkin
}
okMesh.prototype = {clear:function () {
    this.$e6 = "";
    this.$z5 = new okMaterial(this.rc);
    this.$P2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$Q2 = true;
    this.$n5.identity();
    this.$q5.identity();
    this.$05 = 0;
    this.deleteAttribute();
    this.$T1 = true;
    this.deleteIndex();
    this.$M1.clear()
}, setMat:function (a) {
    this.$n5.m00 = a.m00;
    this.$n5.m10 = a.m10;
    this.$n5.m20 = a.m20;
    this.$n5.m01 = a.m01;
    this.$n5.m11 = a.m11;
    this.$n5.m21 = a.m21;
    this.$n5.m02 = a.m02;
    this.$n5.m12 = a.m12;
    this.$n5.m22 = a.m22;
    this.$n5.m03 = a.m03;
    this.$n5.m13 = a.m13;
    this.$n5.m23 = a.m23;
    this.$n5.clone(this.$q5);
    this.$q5.inverse(true).transpose(true);
    this.$Q2 = true
}, getMat43:function () {
    return this.$n5.clone()
}, getMat4:function () {
    return this.$n5.toMat4()
}, getNormalMat3:function () {
    return this.$q5.toMat3()
}, getNormalMat43:function () {
    return this.$q5.toMat43()
}, getNormalMat4:function () {
    return this.$q5.toMat4()
}, setVertexNum:function (a) {
    this.$05 = a;
    this.$T1 = true
}, getVertexNum:function () {
    return this.$05
}, createAttribute:function (h, a, f, k) {
    if (this.$9[h] == null) {
        this.$U3 += 1
    }
    var e = new Array(a);
    this.$9[h] = e;
    if (f) {
        for (var d = 0; d < a; ++d) {
            e[d] = f[d]
        }
    }
    var c = new okArrayBuffer(this.rc);
    c.createBuffer(34962, 5126, (k != null) ? k : 35044, f ? e : a);
    if (this.$8[h]) {
        this.$8[h].releaseBuffer()
    }
    this.$8[h] = c;
    this.$T1 = true;
    this.$Q2 = true
}, loadAttribute:function (h, c, a, d) {
    var f = this.$9[h];
    if (f) {
        if (a < 0) {
            a = f.length - c
        }
        for (var e = c; e < c + a; ++e) {
            f[e] = d[e - c]
        }
        this.$8[h].updateBuffer(c, a, d);
        this.$Q2 = true
    }
}, deleteAttribute:function (a) {
    if (a == null) {
        this.$9 = new Object;
        this.$8 = new Object;
        this.$U3 = 0
    } else {
        if (this.$9[a]) {
            delete this.$9[a];
            delete this.$8[a];
            this.$U3 -= 1
        }
    }
    this.$T1 = true;
    this.$Q2 = true
}, _getAttribFmt:function () {
    if (this.$T1) {
        okA._object(this.$O1);
        this.$O1 = okA.object();
        var c = this.$8;
        var o = okA.array();
        for (var n in c) {
            var d = c[n];
            var l = n.split("/");
            var h = 0;
            o.length = 0;
            var e = l.length;
            for (var f = 0; f < e; ++f) {
                var m = new okAttribFormat();
                var a = l[f];
                o.push(m);
                this.$O1[a] = m;
                m.$e6 = a;
                m.iIdx = f;
                m.iOffset = h;
                m.buf = d;
                switch (a) {
                    case"Position":
                    case"Normal":
                    case"Color":
                    case"Texcoord1_Tangent":
                    case"Texcoord1_Binormal":
                    case"Texcoord2_Tangent":
                    case"Texcoord2_Binormal":
                    case"Texcoord3_Tangent":
                    case"Texcoord3_Binormal":
                    case"Texcoord4_Tangent":
                    case"Texcoord4_Binormal":
                        m.$P4 = 3;
                        h += 3;
                        break;
                    case"Texcoord1":
                    case"Texcoord2":
                    case"Texcoord3":
                    case"Texcoord4":
                        m.$P4 = 2;
                        h += 2;
                        break;
                    case"BoneIndex":
                    case"BoneWeight":
                        m.$P4 = 4;
                        h += 4;
                        break;
                    default:
                        okLog("[Error][okMesh] Unrecoganized attribute name:" + a + "!")
                }
            }
            e = o.length;
            for (var f = 0; f < e; ++f) {
                o[f].iStride = h
            }
        }
        okA._array(o);
        this.$T1 = false
    }
    return this.$O1
}, createIndex:function (f, a, k, l, h) {
    if (this.$I[f] == null) {
        this.$z4 += 1
    }
    var e = new Array(a);
    this.$I[f] = e;
    if (k) {
        for (var d = 0; d < a; ++d) {
            e[d] = k[d]
        }
    }
    var c = new okArrayBuffer(this.rc);
    c.createBuffer(34963, 5123, (l != null) ? l : 35044, k ? e : a);
    if (this.$H[f]) {
        this.$H[f].releaseBuffer()
    }
    this.$H[f] = c;
    this.$J[f] = (h != null ? h : 4)
}, loadIndex:function (h, c, a, d) {
    var f = this.$I[h];
    if (f) {
        if (a < 0) {
            a = f.length - c
        }
        for (var e = c; e < c + a; ++e) {
            f[e] = d[e - c]
        }
        this.$H[h].updateBuffer(c, a, d)
    }
}, deleteIndex:function (a) {
    for (var c in this.$I) {
        if (a == null || c == a) {
            delete this.$I[c];
            this.$H[c].releaseBuffer();
            delete this.$H[c];
            delete this.$J[c];
            this.$z4 -= 1
        }
    }
}, setIndexTopology:function (a, c) {
    if (this.$J[a]) {
        this.$J[a] = c
    }
}, getIndexTopology:function (c) {
    if (c == null) {
        for (var a in this.$J) {
            return this.$J[a]
        }
    }
    return this.$J[c]
}, setName:function (a) {
    this.$e6 = a
}, getName:function () {
    return this.$e6
}, getAttributeNum:function () {
    return this.$U3
}, getIndexNum:function () {
    return this.$z4
}, getAttributeArray:function (a) {
    return this.$9[a]
}, getAttributeArrayMap:function () {
    return this.$9
}, getAttributeArrayBuffer:function (a) {
    return this.$8[a]
}, getAttributeArrayBufferMap:function () {
    return this.$8
}, getIndexArray:function (a) {
    return this.$I[a]
}, getIndexArrayMap:function () {
    return this.$I
}, getIndexArrayBuffer:function (a) {
    return this.$H[a]
}, getIndexArrayBufferMap:function () {
    return this.$H
}, getMaterial:function () {
    return this.$z5
}, computeBoundingInfo:function () {
    this.$P2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    for (var f in this.$9) {
        if (f.indexOf("Position") != -1) {
            var n = new okVec3(100000, 100000, 100000);
            var e = new okVec3(-100000, -100000, -100000);
            var k = this.$9[f];
            var a = 0;
            var l = 0;
            var m = f.split("/");
            var c = m.length;
            for (var h = 0; h < c; ++h) {
                switch (m[h]) {
                    case"Position":
                        l = a;
                    case"Normal":
                    case"Color":
                        a += 3;
                        break;
                    case"Texcoord1":
                    case"Texcoord2":
                    case"Texcoord3":
                    case"Texcoord4":
                        a += 2;
                        break;
                    case"Texcoord1_Tangent":
                    case"Texcoord2_Tangent":
                    case"Texcoord3_Tangent":
                    case"Texcoord4_Tangent":
                    case"Texcoord1_Binormal":
                    case"Texcoord2_Binormal":
                    case"Texcoord3_Binormal":
                    case"Texcoord4_Binormal":
                        a += 3;
                        break;
                    case"BoneIndex":
                        a += 4;
                        break;
                    case"BoneWeight":
                        a += 4;
                        break
                }
            }
            for (var h = l; h < k.length; h += a) {
                var d = new okVec3(k[h], k[h + 1], k[h + 2]);
                n = okVec3Min(n, d);
                e = okVec3Max(e, d)
            }
            this.$P2.set(n, e);
            break
        }
    }
    this.$P2.transformMat(this.$n5)
}, setBoundingBox:function (c, a) {
    if (a == null) {
        c.clone(this.$P2)
    } else {
        this.$P2.set(c, a)
    }
    this.$Q2 = false
}, getBoundingBox:function () {
    if (this.$Q2) {
        this.computeBoundingInfo();
        this.$Q2 = false
    }
    return this.$P2
}, getBoundingSphereCenter:function () {
    return okVec3MulVal(okVec3Add(this.$P2.vMin, this.$P2.vMax), 0.5)
}, getBoundingSphereRadius:function () {
    return okVec3Sub(this.$P2.vMax, this.$P2.vMin).len() * 0.5
}, getSkin:function () {
    return this.$M1
}, draw:function (a, e, c, d) {
    var a = a != null ? a : "Default";
    this.$H[a].drawIndex(e != null ? e : this.$J[a], c, d)
}};
function okModel(a) {
    this.rc = a;
    this.$X = new Object;
    this.$I4 = 0;
    this.$P2 = new okAABBox(OAK.VEC3_ZERO, OAK.VEC3_ZERO)
}
okModel.prototype = {clear:function () {
    for (var a in this.$X) {
        this.$X[a].clear()
    }
    this.$X = new Object;
    this.$I4 = 0;
    this.$P2 = new okAABBox(OAK.VEC3_ZERO, OAK.VEC3_ZERO)
}, createMesh:function (a) {
    if (this.$X[a] == null) {
        var c = new okMesh(this.rc);
        c.$e6 = a;
        this.$X[a] = c;
        this.$I4 += 1
    }
    return this.$X[a]
}, addMesh:function (a) {
    if (this.$X[a.$e6] == null) {
        this.$I4 += 1
    }
    this.$X[a.$e6] = a
}, removeMesh:function (a) {
    if (this.$X[a.$e6]) {
        delete this.$X[a.$e6]
    }
}, deleteMesh:function (a) {
    for (var c in this.$X) {
        if (a == null || c == a) {
            this.$X[c].clear();
            delete this.$X[c]
        }
    }
}, getMesh:function (a) {
    if (a) {
        return this.$X[a]
    }
    for (var c in this.$X) {
        return this.$X[c]
    }
    return null
}, getMeshMap:function () {
    return this.$X
}, getMeshNum:function () {
    return this.$I4
}, computeBoundingInfo:function () {
    if (this.$I4 == 0) {
        this.$P2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
        return
    }
    var a = new okVec3(100000, 100000, 100000);
    var e = new okVec3(-100000, -100000, -100000);
    for (var d in this.$X) {
        var c = this.$X[d];
        a = okVec3Min(a, c.getBoundingBox().vMin);
        e = okVec3Max(e, c.getBoundingBox().vMax)
    }
    this.$P2.set(a, e)
}, setBoundingBox:function (c, a) {
    if (a == null) {
        c.clone(this.$P2)
    } else {
        this.$P2.set(c, a)
    }
}, getBoundingBox:function () {
    return this.$P2
}, getBoundingSphereCenter:function () {
    return okVec3MulVal(okVec3Add(this.$P2.vMin, this.$P2.vMax), 0.5)
}, getBoundingSphereRadius:function () {
    return okVec3Sub(this.$P2.vMax, this.$P2.vMin).len() * 0.5
}, _genWireframe:function () {
    for (var d in this.$X) {
        var a = this.$X[d];
        var l = a.getIndexArray("Default");
        var c = new Array;
        var n = l.length / 3;
        for (var e = 0; e < n; ++e) {
            var m = l[e * 3];
            var k = l[e * 3 + 1];
            var h = l[e * 3 + 2];
            c.push(m, k, k, h, h, m)
        }
        a.createIndex("Wireframe", c.length, c)
    }
}, _splitMeshes:function () {
    for (var y in this.$X) {
        var u = this.$X[y];
        if (u.getVertexNum() > 65536 && u.getIndexArray("Default")) {
            var q = u.getVertexNum();
            var B = u.getIndexNum();
            var C = u.getIndexTopology("Default");
            var x = u.getAttributeArrayMap();
            var l = u.getIndexArray("Default");
            var k = u.getIndexArray("Default").length;
            var f = 3;
            var E = 0;
            while (E < k) {
                var n = 0;
                while (this.$X[y + "_SV_" + n]) {
                    n++
                }
                var o = this.createMesh(y + "_SV_" + n);
                u.$z5.clone(o.$z5);
                u.$M1.clone(o.$M1);
                u.$P2.clone(o.$P2);
                var d = 0;
                var A = new Array();
                for (var z = 0; z < q; ++z) {
                    A.push(-1)
                }
                var v = okA.object();
                for (var s in x) {
                    v[s] = okA.array()
                }
                var a = okA.array();
                while (E < k) {
                    var D = E;
                    var c = Math.min(E + f, k);
                    var h = d;
                    for (var z = D; z < c; ++z) {
                        var t = l[z];
                        if (A[t] == -1) {
                            A[t] = d;
                            for (var s in v) {
                                var f = x[s].length / q;
                                var e = x[s];
                                var p = v[s];
                                for (var w = 0; w < f; ++w) {
                                    p.push(e[t * f + w])
                                }
                            }
                            d += 1
                        }
                        a.push(A[t])
                    }
                    if (d > 65536) {
                        d = h;
                        for (var s in v) {
                            var p = v[s];
                            var f = u.$9[s].length / q;
                            while (p.length > 65536 * f) {
                                p.pop()
                            }
                        }
                        for (var z = D; z < c; ++z) {
                            a.pop()
                        }
                        break
                    }
                    E += f
                }
                for (var s in v) {
                    var m = v[s];
                    if (m.length > 0) {
                        o.createAttribute(s, m.length, m)
                    }
                }
                if (a.length > 0) {
                    o.createIndex("Default", a.length, a, 35044, C);
                    o.setVertexNum(d)
                } else {
                    this.deleteMesh(o)
                }
            }
            this.deleteMesh(y)
        }
    }
}};
function okSkAnimBone() {
    this.$e6 = "";
    this.$O = new Array;
    this.$M = new Array;
    this.$N = new Array;
    this.$F5 = null;
    this.$j5 = okA.mat43();
    this.$32 = true
}
okSkAnimBone.prototype = {clone:function () {
    var c = new okSkAnimBone();
    c.$e6 = this.$e6;
    for (var a = 0; a < this.$O.length; ++a) {
        c.$O.push(this.$O[a].clone());
        c.$M.push(this.$M[a].clone());
        c.$N.push(this.$N[a].clone())
    }
    c.$F5 = this.$F5;
    c.$j5 = new okMat4();
    c.$32 = true
}, clear:function () {
    this.$e6 = "";
    this.$O.length = 0;
    this.$M.length = 0;
    this.$N.length = 0;
    this.$F5 = null;
    this.$j5.identity();
    this.$32 = true
}, setName:function (a) {
    this.$e6 = a
}, getName:function () {
    return this.$e6
}, setParent:function (a) {
    this.$F5 = a
}, getParent:function () {
    return this.$F5
}, loadKeyTranslateList:function (c) {
    this.$O = new Array;
    for (var a = 0; a < c.length; ++a) {
        this.$O.push(c[a].clone())
    }
}, loadKeyQuaternionList:function (a) {
    this.$M = new Array;
    for (var c = 0; c < a.length; ++c) {
        this.$M.push(a[c].normalize())
    }
}, loadKeyScaleList:function (a) {
    this.$N = new Array;
    for (var c = 0; c < a.length; ++c) {
        this.$N.push(a[c])
    }
}, dirty:function () {
    this.$32 = true
}, update:function (c, a, n) {
    if (this.$32) {
        var e = this.$j5;
        var d = okQuatSlerp(this.$M[c], this.$M[a], n);
        d.normalize(true);
        d.toMat43(e);
        okA._quat(d);
        var s = this.$O[c], o = this.$O[a];
        e.m03 = s.x * (1 - n) + o.x * n;
        e.m13 = s.y * (1 - n) + o.y * n;
        e.m23 = s.z * (1 - n) + o.z * n;
        var h = this.$N[c], f = this.$N[a];
        if (h && f) {
            var q = h.x * (1 - n) + f.x * n;
            var l = h.y * (1 - n) + f.y * n;
            var k = h.z * (1 - n) + f.z * n;
            e.m00 *= q;
            e.m10 *= q;
            e.m20 *= q;
            e.m01 *= l;
            e.m11 *= l;
            e.m21 *= l;
            e.m02 *= k;
            e.m12 *= k;
            e.m22 *= k
        }
        if (this.$F5) {
            if (this.$F5.$32) {
                this.$F5.update(c, a, n)
            }
            var p = okMat43Mul(this.$F5.$j5, this.$j5);
            okA._mat43(this.$j5);
            this.$j5 = p
        }
        this.$32 = false
    }
}, getMat43:function () {
    var a = new okMat43();
    this.$j5.clone(a);
    return a
}, getMat4:function () {
    var a = new okMat4();
    this.$j5.toMat4(a);
    return a
}};
function okSkAnimation() {
    this.$K = new Array;
    this.$P2 = new okAABBox();
    this.$e = new Object;
    this.$54 = 0;
    this.$v4 = 0;
    this.$i3 = 33;
    this.$i4 = -1;
    this.$D4 = -1;
    this.$C4 = -1;
    this.$m3 = 0
}
okSkAnimation.prototype = {clear:function () {
    this.$K = new Array;
    this.$P2 = new okAABBox();
    this.$e = new Object;
    this.$54 = 0;
    this.$v4 = 0;
    this.$i3 = 33;
    this.$i4 = -1;
    this.$D4 = -1;
    this.$C4 = -1;
    this.$m3 = 0
}, setBoundingBox:function (c, a) {
    this.$P2.set(c, a)
}, getBoundingBox:function () {
    return this.$P2
}, loadKeyFrameList:function (c) {
    this.$K = new Array;
    for (var a = 0; a < c.length; ++a) {
        this.$K.push(c[a])
    }
}, addBone:function (a) {
    if (this.$e[a.getName()] == null) {
        this.$54 += 1
    }
    this.$e[a.getName()] = a
}, getBone:function (a) {
    return this.$e[a]
}, getBoneMat43:function (a) {
    if (this.$e[a]) {
        return this.$e[a].getMat43()
    }
    return okA.mat43()
}, getBoneMat4:function (a) {
    if (this.$e[a]) {
        return this.$e[a].getMat4()
    }
    return okA.mat4()
}, getBoneNum:function () {
    return this.$54
}, getBoneList:function () {
    return this.$e
}, setFrameNum:function (a) {
    this.$v4 = a
}, getFrameNum:function () {
    return this.$v4
}, setFrameTime:function (a) {
    this.$i3 = a
}, getFrameTime:function () {
    return this.$i3
}, getAnimLength:function () {
    return this.$v4 * this.$i3
}, setCurTime:function (a) {
    if (this.$i4 != a) {
        this.$i4 = a;
        for (var c in this.$e) {
            this.$e[c].dirty()
        }
        this._upBL(this.$i4 / this.$i3)
    }
}, setCurFrame:function (c) {
    if (this.$i4 != c * this.$i3) {
        this.$i4 = c * this.$i3;
        for (var a in this.$e) {
            this.$e[a].dirty()
        }
        this._upBL(c)
    }
}, getCurTime:function () {
    return this.$i4
}, _lpF:function (c) {
    var e = this.$K;
    var a = e.length;
    for (var d = 0; d < a; ++d) {
        if (e[d] > c) {
            if (d > 0) {
                this.$D4 = d - 1;
                this.$C4 = d
            } else {
                this.$D4 = this.$C4 = 0
            }
            this.$m3 = (c - e[d - 1]) / (e[d] - e[d - 1]);
            return
        }
    }
    this.$D4 = this.$C4 = e.length - 1;
    this.$m3 = 0
}, _upBL:function (a) {
    this._lpF(a);
    for (var c in this.$e) {
        var d = this.$e[c];
        if (d.$32) {
            d.update(this.$D4, this.$C4, this.$m3)
        }
    }
}};
function okSkAnimSubChannel() {
    this.$N1 = null;
    this.$l2 = false;
    this.$x3 = 1;
    this.$i4 = 0
}
okSkAnimSubChannel.prototype = {clone:function (a) {
    var a = a ? a : new okSkAnimSubChannel();
    a.$N1 = this.$N1;
    a.$l2 = this.$l2;
    a.$x3 = this.$x3;
    a.$i4 = this.$i4;
    return a
}, attachAnim:function (a) {
    this.$N1 = a
}, getAnim:function () {
    return this.$N1
}, isActive:function () {
    return(this.$N1 != null) && (this.$i4 < this.$N1.getAnimLength())
}, setSpeed:function (a) {
    this.$x3 = a
}, getSpeed:function () {
    return this.$x3
}, enableLoop:function (a) {
    this.$l2 = a
}, isLoop:function () {
    return this.$l2
}, getFrameTime:function () {
    if (this.$N1) {
        return this.$N1.getFrameTime()
    }
    return 0
}, setCurTime:function (a) {
    this.$i4 = a;
    if (this.$N1) {
        this.$N1.setCurTime(a)
    }
}, update:function (a) {
    if (this.$N1) {
        this.$i4 += (a * this.$x3);
        this.$N1.setCurTime(this.$l2 ? (this.$i4 % this.$N1.getAnimLength()) : this.$i4)
    }
}, getBoneMat43:function (a) {
    if (this.$N1) {
        return this.$N1.getBoneMat43(a)
    }
    return okA.mat43()
}};
function okSkAnimChannel() {
    this.$Q1 = false;
    this.$y5 = new okSkAnimSubChannel();
    this.$Y6 = new okSkAnimSubChannel();
    this.$Y4 = 0;
    this.$j4 = 0
}
okSkAnimChannel.prototype = {clone:function (a) {
    a = a ? a : new okSkAnimChannel();
    a.$Q1 = this.$Q1;
    this.$y5.clone(a.$y5);
    this.$Y6.clone(a.$Y6);
    a.$Y4 = this.$Y4;
    a.$j4 = this.$j4;
    return a
}, activate:function (a) {
    this.$Q1 = a
}, isActive:function () {
    return this.$Q1
}, attachAnim:function (c, a) {
    this.$y5.clone(this.$Y6);
    this.$Y4 = ((a != null) ? a : 0);
    this.$j4 = 0;
    this.$y5.attachAnim(c)
}, getAnim:function () {
    return this.$y5.getAnim()
}, setSpeed:function (a) {
    this.$y5.setSpeed(a)
}, getSpeed:function () {
    return this.$y5.getSpeed()
}, enableLoop:function (a) {
    this.$y5.enableLoop(a)
}, isLoop:function () {
    return this.$y5.isLoop()
}, getFrameTime:function () {
    if (this.$y5) {
        return this.$y5.getFrameTime()
    }
    return 0
}, setCurTime:function (a) {
    this.$y5.setCurTime(a)
}, update:function (a) {
    this.$y5.update(a);
    if (this.$j4 < this.$Y4) {
        this.$Y6.update(a)
    }
    this.$j4 = Math.min(this.$j4 + a, this.$Y4)
}, getBoneMat43:function (c) {
    var d = this.$y5.getBoneMat43(c);
    if (this.$j4 >= this.$Y4 || !this.$Y6.isActive()) {
        return d
    }
    var l = this.$Y6.getBoneMat43(c);
    var h = okA.quat();
    var e = okA.quat();
    d.toQuat(h);
    l.toQuat(e);
    var k = this.$j4 / this.$Y4;
    var a = okQuatSlerp(e, h, k);
    var f = a.toMat43();
    f.m03 = l.m03 * (1 - k) + d.m03 * k;
    f.m13 = l.m13 * (1 - k) + d.m13 * k;
    f.m23 = l.m23 * (1 - k) + d.m23 * k;
    okA._quat(h);
    okA._quat(e);
    okA._quat(a);
    return f
}};
function okSkAnimPlayer() {
    this.$L6 = null;
    this.$f = new Array;
    this.$12 = false;
    this.$d = new Array;
    this.$02 = false;
    this.$k = new Array;
    this.$k.push(new okSkAnimChannel());
    this.$k.push(new okSkAnimChannel());
    this.$14 = 1;
    this.$P2 = new okAABBox();
    this.$W1 = true
}
okSkAnimPlayer.prototype = {clear:function () {
    this.$L6 = null;
    this.$f = new Array;
    this.$12 = false;
    this.$d = new Array;
    this.$02 = false;
    this.$k = new Array;
    this.$k.push(new okSkAnimChannel());
    this.$k.push(new okSkAnimChannel());
    this.$14 = 1;
    this.$P2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$W1 = true
}, clone:function (a) {
    a = a ? a : new okSkAnimPlayer();
    a.$L6 = this.$L6;
    a.$12 = true;
    a.$02 = true;
    a.$k = [this.$k[0].clone(), this.$k[1].clone()];
    a.$14 = this.$14;
    a.$W1 = this.$W1;
    return a
}, setSkin:function (a) {
    this.$L6 = a;
    this.$12 = true;
    this.$02 = true;
    this.update(-1, 0);
    this.$W1 = true
}, getSkin:function () {
    return this.$L6
}, getBoundingBox:function () {
    if (this.$W1) {
        var c = okA.vec3(), a = okA.vec3();
        c.set(10000000000, 10000000000, 10000000000);
        a.set(-10000000000, -10000000000, -10000000000);
        this.$P2.set(c, a);
        if (this.$k[0].isActive() && this.$k[0].getAnim()) {
            this.$P2 = this.$P2.union(this.$k[0].getAnim().getBoundingBox())
        }
        if (this.$k[1].isActive() && this.$k[1].getAnim()) {
            this.$P2 = this.$P2.union(this.$k[1].getAnim().getBoundingBox())
        }
        this.$W1 = false;
        okA._vec3(c);
        okA._vec3(a)
    }
    return this.$P2
}, activateChannel:function (c, a) {
    this.$k[c].activate(a);
    this.$12 = true;
    this.$02 = true;
    this.$W1 = true
}, isActive:function (a) {
    return this.$k[a].isActive()
}, attachAnim:function (d, c, a) {
    this.$k[d].attachAnim(c, a);
    this.$12 = true;
    this.$02 = true;
    this.$W1 = true
}, getAnim:function (a) {
    return this.$k[a].getAnim()
}, setSpeed:function (c, a) {
    this.$k[c].setSpeed(a)
}, getSpeed:function (a) {
    return this.$k[a].getSpeed()
}, enableLoop:function (c, a) {
    this.$k[c].enableLoop(a)
}, isLoop:function (a) {
    return this.$k[a].isLoop()
}, setBlendMode:function (a) {
    this.$14 = a;
    this.$12 = true;
    this.$02 = true
}, getBlendMode:function () {
    return this.$14
}, getFrameTime:function (a) {
    if (this.$k[a]) {
        return this.$k[a].getFrameTime()
    }
    return 0
}, setTime:function (d, a) {
    if (d == -1) {
        for (var c = 0; c < this.$k.length; ++c) {
            if (this.$k[c].isActive()) {
                this.$k[c].setCurTime(a)
            }
        }
    } else {
        this.$k[d].setCurTime(a)
    }
    this.$12 = true;
    this.$02 = true
}, update:function (e, c) {
    if (e == -1) {
        var a = this.$k.length;
        for (var d = 0; d < a; ++d) {
            if (this.$k[d].isActive()) {
                this.$k[d].update(c)
            }
        }
    } else {
        this.$k[e].update(c)
    }
    this.$12 = true;
    this.$02 = true
}, getBoneMat43:function (h) {
    var m = this.$k[0].isActive();
    var l = this.$k[1].isActive();
    if (m && !l) {
        return this.$k[0].getBoneMat43(h)
    } else {
        if (!m && l) {
            return this.$k[1].getBoneMat43(h)
        } else {
            if (!m && !l) {
                return new okMat4()
            }
        }
    }
    var k = okA.mat43();
    var d = this.$k[0].getBoneMat43(h);
    var c = this.$k[1].getBoneMat43(h);
    var f = okA.quat();
    var e = okA.quat();
    d.toQuat(f);
    c.toQuat(e);
    if (this.$14 == 1) {
        var a = okQuatMul(e, f);
        a.toMat43(k);
        k.m03 = d.m03 + c.m03;
        k.m13 = d.m13 + c.m13;
        k.m23 = d.m23 + c.m23
    } else {
        if (this.$14 == 2) {
            var a = okQuatSlerp(e, f, 0.5);
            a.toMat43(k);
            k.m03 = (d.m03 + c.m03) * 0.5;
            k.m13 = (d.m13 + c.m13) * 0.5;
            k.m23 = (d.m23 + c.m23) * 0.5
        }
    }
    okA._quat(f);
    okA._quat(e);
    return k
}, getBoneFinalMat43:function (k) {
    var n = this.$k[0].isActive();
    var m = this.$k[1].isActive();
    if (n && !m) {
        return okMat43Mul(this.$k[0].getBoneMat43(k), this.$L6 ? this.$L6.getSkinMat(k) : okA.mat43())
    } else {
        if (!n && m) {
            return okMat43Mul(this.$k[1].getBoneMat43(k), this.$L6 ? this.$L6.getSkinMat(k) : okA.mat43())
        } else {
            if (!n && !m) {
                return(this.$L6 ? this.$L6.getSkinMat(k) : okA.mat43())
            }
        }
    }
    var l = okA.mat43();
    var e = this.$k[0].getBoneMat43(k);
    var c = this.$k[1].getBoneMat43(k);
    var h = okA.quat();
    var f = okA.quat();
    e.toQuat(h);
    c.toQuat(f);
    if (this.$14 == 1) {
        var a = okQuatMul(f, h);
        a.toMat43(l);
        l.m03 = e.m03 + c.m03;
        l.m13 = e.m13 + c.m13;
        l.m23 = e.m23 + c.m23
    } else {
        if (this.$14 == 2) {
            var a = okQuatSlerp(f, h, 0.5);
            a.toMat43(l);
            l.m03 = (e.m03 + c.m03) * 0.5;
            l.m13 = (e.m13 + c.m13) * 0.5;
            l.m23 = (e.m23 + c.m23) * 0.5
        }
    }
    okA._quat(h);
    okA._quat(f);
    if (this.$L6) {
        var d = okMat43Mul(l, this.$L6.getSkinMat(k));
        okA._mat43(l);
        return d
    } else {
        return l
    }
}, getBoneFinalMat43Array:function () {
    if (this.$02) {
        this.$d.length = 0;
        var d = this.$L6.getBoneNameArray();
        var l = this.$L6.getSkinMatArray();
        var f = d.length;
        var q = this.$k[0].isActive();
        var p = this.$k[1].isActive();
        if (q && !p) {
            for (var m = 0; m < f; ++m) {
                this.$d.push(okMat43Mul(this.$k[0].getBoneMat43(d[m]), l[m]))
            }
        } else {
            if (q && p) {
                for (var m = 0; m < f; ++m) {
                    var n = d[m];
                    var o = okA.mat43();
                    var e = this.$k[0].getBoneMat43(n);
                    var c = this.$k[1].getBoneMat43(n);
                    var k = okA.quat();
                    var h = okA.quat();
                    e.toQuat(k);
                    c.toQuat(h);
                    if (this.$14 == 1) {
                        var a = okQuatMul(h, k);
                        a.toMat43(o);
                        o.m03 = e.m03 + c.m03;
                        o.m13 = e.m13 + c.m13;
                        o.m23 = e.m23 + c.m23
                    } else {
                        if (this.$14 == 2) {
                            var a = okQuatSlerp(h, k, 0.5);
                            a.toMat43(o);
                            o.m03 = (e.m03 + c.m03) * 0.5;
                            o.m13 = (e.m13 + c.m13) * 0.5;
                            o.m23 = (e.m23 + c.m23) * 0.5
                        }
                    }
                    okA._quat(k);
                    okA._quat(h);
                    this.$d.push(okMat43Mul(o, l[m]));
                    okA._mat43(o)
                }
            } else {
                if (!q && p) {
                    for (var m = 0; m < f; ++m) {
                        this.$d.push(okMat43Mul(this.$k[1].getBoneMat43(d[m]), l[m]))
                    }
                } else {
                    okA._array(this.$d);
                    this.$d = l.slice()
                }
            }
        }
        this.$02 = false
    }
    return this.$d
}};
function okCharMetaData(e, c, f, d, a) {
    this.code = 0;
    this.tex = e;
    this.x = c;
    this.y = f;
    this.width = d;
    this.height = a
}
okCharMetaData.prototype = {clone:function () {
    var c = new this.constructor();
    for (var a in this) {
        if (c[a] != this[a]) {
            c[a] = this[a]
        }
    }
    return c
}};
function okFontTexture(d, c, a) {
    this.rc = d;
    this.width = c;
    this.height = a;
    this.ok2DLayoutHelper = new okLayout2DHelper(c, a);
    this.texData = new okTexture(d);
    this.texData.createTexture(3553, c, a, 6408, 5121);
    this.charsList = new okList()
}
okFontTexture.prototype = {addTex:function (a, k, f) {
    var e = this.ok2DLayoutHelper.add(k, f);
    if (e != null) {
        var h = new Array();
        for (var d = 0; d < a.length; ++d) {
            h.push(a[d])
        }
        this.texData.updateTexture(e.x, e.y, e.width, e.height, 5121, h);
        var c = new okCharMetaData(this, e.x, e.y, k, f);
        this.charsList.pushFront(c);
        return this.charsList.getRoot()
    } else {
        return null
    }
}, updateCharNode:function (a) {
    var c = a.data;
    this.charsList.remove(a);
    this.charsList.pushFront(c);
    return this.charsList.getRoot()
}, clearRoom:function () {
    var c = this.charsList.getTail();
    if (c != null) {
        var d = c.data;
        var a = new okRect(d.x, d.y, d.width, d.height);
        if (this.ok2DLayoutHelper.remove(a)) {
            this.charsList.popBack();
            return{opFlag:true, codeRemoved:d.code}
        }
    }
    return{opFlag:false}
}};
function okGetFontName(a, c, f, e, d) {
    return d + " " + f + " " + c + " " + e + " " + a
}
function okFont() {
    this.$B3 = "";
    this.$C3 = 40;
    this.$F3 = "normal";
    this.$E3 = "";
    this.$D3 = "normal";
    this.$V1 = true;
    this.$W6 = 512;
    this.$V6 = 512;
    this.rc = null;
    this.$B5 = 5;
    this.$T6 = new Array();
    this.$U6 = new okList();
    this.$Y2 = new Object();
    this.$L5 = null
}
okFont.prototype = {setCodePageSize:function (e, a) {
    var c = okAlignPower2(e);
    var d = okAlignPower2(a);
    if (c != this.$W6 || d != this.$V6) {
        this.clearAll();
        this.$W6 = c;
        this.$V6 = d
    }
}, setCodePageMaxNum:function (a) {
    if (this.$T6.length > a) {
        this.clearAll()
    }
    this.$B5 = a
}, enableAutoWrap:function (a) {
    this.$V1 = a
}, isAutoWrapEnabled:function () {
    return this.$V1
}, drawText:function (x, v, C, d) {
    var E = this.rc.canvas.width;
    var c = this.rc.canvas.height;
    var y;
    if (d != null) {
        E = d.$Q4;
        c = d.$R4;
        y = new okFrameBuffer(this.rc);
        y.createBuffer();
        y.bind();
        y.attachRenderTexture(0, d)
    }
    var w;
    if (x == null) {
        w = new okRect(0, 0, E, c)
    } else {
        if (x.width <= 0 || x.height <= 0) {
            return
        }
        w = new okRect(x.x, x.y, x.x + x.width, x.y + x.height)
    }
    this.$L5.bind();
    var f = okMat4Trans(0, 0, -3);
    this.$L5.setUniformMat4("matWorld", f);
    var p = okMat4Ortho(0, E, 0, c, 0.1, 10);
    this.$L5.setUniformMat4("matProj", p);
    var A = new okMat4(1);
    if (C != null) {
        A.m00 = C.x;
        A.m11 = C.y;
        A.m22 = C.z;
        if (C.w) {
            A.m33 = C.w
        }
    }
    this.$L5.setUniformMat4("matColor", A);
    var q = new okVec2(w.x, w.y);
    var e = new okVec2(0, 0);
    var I = new okVec2(0, 0);
    var h = new okVec2(0, 0);
    var H;
    var n;
    var l = new Array();
    var s = 0;
    var G = null;
    var u;
    var F;
    for (var D = 0; D < v.length; ++D) {
        if (v.charAt(D) != "\n") {
            G = this.getCharTextureInfo(v.charAt(D), false);
            if (G == null) {
                for (var o = 0; o < l.length; ++o) {
                    u = new okArrayBuffer(this.rc);
                    u.createBuffer(34962, 5126, 35044, l[o].vertexArray);
                    F = new okArrayBuffer(this.rc);
                    F.createBuffer(34962, 5126, 35044, l[o].coordArray);
                    this.$L5.setAttribute("position", u, 3);
                    this.$L5.setAttribute("vertex_coord", F, 2);
                    this.$L5.setSampler("tex", 0);
                    l[o].okTex.bind(0);
                    this.rc.texParameteri(3553, 10240, 9729);
                    this.rc.texParameteri(3553, 10241, 9729);
                    this.rc.drawArrays(4, 0, l[o].vertexArray.length / 3)
                }
                l.splice(0, l.length);
                this.addIndividualCode(v.charAt(D));
                --D;
                continue
            }
            e.x = q.x + G.width - 1;
            e.y = q.y + G.height - 1;
            if (e.x >= w.width) {
                if (this.$V1) {
                    var a = w.x;
                    if (q.x - a > 0.000001) {
                        q.x = w.x;
                        q.y += s;
                        s = 0;
                        if (q.y >= w.height) {
                            break
                        } else {
                            --D;
                            continue
                        }
                    }
                }
                e.x = w.width - 1
            }
            if (e.y >= w.height) {
                e.y = w.height - 1
            }
            H = [e.x, q.y, 0, q.x, q.y, 0, e.x, e.y, 0, q.x, q.y, 0, q.x, e.y, 0, e.x, e.y, 0];
            I.x = G.x / G.tex.width;
            I.y = G.y / G.tex.height;
            h.x = (G.x + e.x - q.x) / G.tex.width;
            h.y = (G.y + e.y - q.y) / G.tex.height;
            n = [h.x, I.y, I.x, I.y, h.x, h.y, I.x, I.y, I.x, h.y, h.x, h.y];
            for (var B = 0; B < l.length; ++B) {
                if (l[B].fontTex === G.tex) {
                    break
                }
            }
            if (B == l.length) {
                var t = new Object();
                t.okTex = G.tex.texData;
                t.fontTex = G.tex;
                t.vertexArray = new Array();
                t.coordArray = new Array();
                l.push(t)
            }
            for (var z = 0; z < H.length; ++z) {
                l[B].vertexArray.push(H[z])
            }
            for (z = 0; z < n.length; ++z) {
                l[B].coordArray.push(n[z])
            }
            if (s < G.height) {
                s = G.height
            }
            if (e.x >= w.width) {
                if (this.$V1) {
                    q.x = w.x;
                    q.y += s;
                    s = 0;
                    if (q.y >= w.height) {
                        break
                    }
                } else {
                    for (D = D + 1; D < v.length; ++D) {
                        if (v.charAt(D) == "\n") {
                            break
                        }
                    }
                }
            } else {
                q.x += G.width
            }
        } else {
            q.x = w.x;
            q.y += s;
            s = 0;
            if (q.y >= w.height) {
                break
            }
        }
    }
    if (l.length > 0) {
        for (var o = 0; o < l.length; ++o) {
            u = new okArrayBuffer(this.rc);
            u.createBuffer(34962, 5126, 35044, l[o].vertexArray);
            F = new okArrayBuffer(this.rc);
            F.createBuffer(34962, 5126, 35044, l[o].coordArray);
            this.$L5.setAttribute("position", u, 3);
            this.$L5.setAttribute("vertex_coord", F, 2);
            this.$L5.setSampler("tex", 0);
            l[o].okTex.bind(0);
            this.rc.texParameteri(3553, 10240, 9729);
            this.rc.texParameteri(3553, 10241, 9729);
            this.rc.drawArrays(4, 0, l[o].vertexArray.length / 3)
        }
    }
    if (d != null) {
        y.unbind()
    }
}, getFontName:function () {
    return okGetFontName(this.$B3, this.$C3, this.$F3, this.$E3, this.$D3)
}, isTexFull:function () {
    return this.$T6.length >= this.$B5
}, increaseFontTex:function () {
    if (!this.isTexFull()) {
        var a = new okFontTexture(this.rc, this.$W6, this.$V6);
        this.$T6.push(a);
        return true
    } else {
        return false
    }
}, getFirstBlankTex:function () {
    if (this.$T6.length <= 0) {
        if (!this.increaseFontTex()) {
            return null
        }
    }
    return this.$T6[this.$T6.length - 1]
}, getFirstReplacableTex:function () {
    if (this.$T6.length <= 0) {
        return null
    }
    if (this.$U6.getRoot() != null) {
        return this.$U6.getRoot().data
    } else {
        return this.$T6[0]
    }
}, getTexture:function (c) {
    var a = this.getCharTextureInfo(c);
    if (a != null) {
        return a.tex
    } else {
        return null
    }
}, updateTexTimeStamp:function (a) {
    var c = this.$U6.find(a);
    this.$U6.remove(c);
    this.$U6.pushFront(a)
}, addIndividualCode:function (d, l) {
    if (okIsUndefined(this.$Y2[d.toString()])) {
        var n = okFontManager.get2DContext();
        okFontManager.clear2DContext();
        var h = n.font;
        n.font = this.getFontName();
        n.fillText(d, 0, 0);
        var e = n.measureText(d).width;
        if (e <= 0) {
            e = 1
        }
        var f = n.getImageData(0, 0, e, this.$C3);
        n.font = h;
        var a = this.getFirstBlankTex();
        if (a == null) {
            return false
        }
        var c = a.addTex(f.data, f.width, f.height);
        if (c == null) {
            if (this.increaseFontTex()) {
                a = this.getFirstBlankTex();
                c = a.addTex(f.data, f.width, f.height)
            } else {
                var m = true;
                if (!(l == null || okIsUndefined(l))) {
                    m = l
                }
                if (m) {
                    a = this.getFirstReplacableTex();
                    if (a) {
                        do {
                            var k = a.clearRoom();
                            if (k.opFlag) {
                                delete this.$Y2[k.codeRemoved];
                                c = a.addTex(f.data, f.width, f.height)
                            } else {
                                break
                            }
                        } while (c == null)
                    }
                }
            }
        }
        if (c != null) {
            c.data.code = d.toString();
            this.$Y2[d.toString()] = c
        } else {
            return false
        }
    }
    return true
}, getCharTextureInfo:function (d, f) {
    var c = this.$Y2[d.toString()];
    if (okIsUndefined(c)) {
        if (this.addIndividualCode(d, f)) {
            c = this.$Y2[d.toString()]
        } else {
            return null
        }
    }
    var a = c.data;
    var e = a.tex;
    this.updateTexTimeStamp(e);
    this.$Y2[d.toString()] = e.updateCharNode(c);
    return a.clone()
}, initProgram:function () {
    var c = new okShader(this.rc, 35633);
    c.loadSource("                       attribute vec3 position;                       attribute vec2 vertex_coord;                       uniform mat4 matWorld, matProj;                       varying vec2 pixel_coord;                       void main(void) {                            gl_Position = matProj * matWorld * vec4(position, 1.0);                            pixel_coord = vertex_coord;                       }                       ");
    c.compile();
    var a = new okShader(this.rc, 35632);
    a.loadSource("                        precision highp float;                        varying vec2 pixel_coord;                        uniform sampler2D tex;                        uniform mat4 matColor;                        void main(void) {                        gl_FragColor = texture2D(tex, pixel_coord) * matColor;                         }                      ");
    a.compile();
    this.$L5 = new okProgram(this.rc);
    this.$L5.attachVertexShader(c);
    this.$L5.attachFragmentShader(a);
    this.$L5.link()
}, clearAll:function () {
    this.$T6 = new Array();
    this.$U6 = new okList();
    this.$Y2 = new Object()
}};
var okFontManager = (function () {
    var a = {};
    var e = null;
    var c = null;
    var d = false;
    return{createFont:function (n, k, l, p, o, m) {
        var h = n.canvas.getAttribute("ID") + okGetFontName(k, l, p, o, m);
        if (a[h] != undefined) {
            return a[h]
        } else {
            var f = new okFont();
            f.$B3 = k;
            f.$C3 = l;
            f.$F3 = p;
            f.$E3 = o;
            f.$D3 = m;
            f.rc = n;
            f.initProgram();
            a[h] = f;
            return f
        }
    }, deleteFont:function (m, h, k, o, n, l) {
        if (arguments.length == 1) {
            var f = m.rc.canvas.getAttribute("ID") + okGetFontName(m.$B3, m.$C3, m.$F3, m.$E3, m.$D3)
        } else {
            var f = m.canvas.getAttribute("ID") + okGetFontName(h, k, o, n, l)
        }
        if (a[f] != undefined) {
            delete a[f]
        }
    }, get2DContext:function () {
        if (c == null) {
            e = document.createElement("canvas");
            e.width = 512;
            e.height = 512;
            c = e.getContext("2d");
            c.fillStyle = "#ffffff";
            c.strokeStyle = "#ffffff";
            c.textBaseline = "top"
        }
        return c
    }, clear2DContext:function () {
        c.clearRect(0, 0, e.width, e.height)
    }}
})();
function okBillBoard(a) {
    this.$L5 = a;
    this.text = "";
    this.font = null;
    this.posAttributeName = "position";
    this.texcoordAttributeName = "vertex_coord";
    this.samplertexAttributeName = "tex"
}
okBillBoard.prototype = {setText:function (a) {
    this.text = a
}, getText:function () {
    return this.text
}, setFont:function (a) {
    this.font = a
}, getFont:function () {
    return this.font
}, setPositionAttrName:function (a) {
    this.posAttributeName = a
}, getPositionAttrName:function () {
    return this.posAttributeName
}, setTexcoordAttrName:function (a) {
    this.texcoordAttributeName = a
}, getTexcoordAttrName:function () {
    return this.texcoordAttributeName
}, setSamplertexAttrName:function (a) {
    this.samplertexAttributeName = a
}, getSamplertexAttrName:function () {
    return this.samplertexAttributeName
}, render:function () {
    if (this.font == null) {
        return
    }
    var f = new Array();
    for (var p = 0; p < this.text.length; ++p) {
        if (this.text.charAt(p) != "\n") {
            f.push(this.font.getCharTextureInfo(this.text.charAt(p)))
        } else {
            f.push(null)
        }
    }
    var q = new okVec2(0, 0);
    var u = new okVec2(0, 0);
    var o = new okVec2(0, 0);
    var l = new okVec2(0, 0);
    var c;
    var e;
    var v, s;
    var t = new Array();
    var a = 0;
    for (var p = 0; p < f.length; ++p) {
        if (f[p] != null) {
            u.x = q.x + f[p].width - 1;
            u.y = q.y + f[p].height - 1;
            c = [u.x, q.y, 0, q.x, q.y, 0, u.x, u.y, 0, q.x, q.y, 0, q.x, u.y, 0, u.x, u.y, 0];
            o.x = f[p].x / f[p].tex.width;
            o.y = f[p].y / f[p].tex.height;
            l.x = (f[p].x + f[p].width - 1) / f[p].tex.width;
            l.y = (f[p].y + f[p].height - 1) / f[p].tex.height;
            e = [l.x, o.y, o.x, o.y, l.x, l.y, o.x, o.y, o.x, l.y, l.x, l.y];
            for (var h = 0; h < t.length; ++h) {
                if (t[h].fontTex === f[p].tex) {
                    break
                }
            }
            if (h == t.length) {
                var n = new Object();
                n.okTex = f[p].tex.texData;
                n.fontTex = f[p].tex;
                n.vertexArray = new Array();
                n.coordArray = new Array();
                t.push(n)
            }
            for (var d = 0; d < c.length; ++d) {
                t[h].vertexArray.push(c[d])
            }
            for (d = 0; d < e.length; ++d) {
                t[h].coordArray.push(e[d])
            }
            q.x += f[p].width;
            if (a < f[p].height) {
                a = f[p].height
            }
        } else {
            q.x = 0;
            q.y += a;
            a = 0
        }
    }
    this.$L5.bind();
    for (var p = 0; p < t.length; ++p) {
        v = new okArrayBuffer(this.$L5.rc);
        v.createBuffer(34962, 5126, 35044, t[p].vertexArray);
        s = new okArrayBuffer(this.$L5.rc);
        s.createBuffer(34962, 5126, 35044, t[p].coordArray);
        this.$L5.setAttribute(this.posAttributeName, v, 3);
        this.$L5.setAttribute(this.texcoordAttributeName, s, 2);
        this.$L5.setSampler(this.samplertexAttributeName, 0);
        t[p].okTex.bind(0);
        this.$L5.rc.texParameteri(3553, 10240, 9729);
        this.$L5.rc.texParameteri(3553, 10241, 9729);
        this.$L5.rc.drawArrays(4, 0, t[p].vertexArray.length / 3)
    }
}};
function okRenderEnvironment() {
    this.rc = null;
    this.$U2 = null;
    this.$I6 = null;
    this.canvas = null;
    this.$a4 = 0;
    this.$94 = 0;
    this.$97 = new okVec3(1, 1, 1);
    this.$77 = new okVec3(0.5, 0.5, 0.5);
    this.$g2 = false;
    this.$57 = new okVec3(1, 1, 1);
    this.$e3 = 3.5;
    this.$g3 = 0.1;
    this.$f3 = 1;
    this.$z2 = true;
    this.$r1 = [true, true, true];
    this.$S4 = 0;
    this.$i4 = 0;
    this.$p3 = 0
}
okRenderEnvironment.prototype.clear = function () {
    this.$U2 = null;
    this.$I6 = null;
    this.$97.set(1, 1, 1);
    this.$77.set(0.3, 0.3, 0.3);
    this.$g2 = false;
    this.$57.set(1, 1, 1);
    this.$e3 = 3.5;
    this.$g3 = 0.1;
    this.$f3 = 1;
    this.$z2 = true;
    this.$r1 = [true, true, true];
    this.$S4 = 0;
    this.$i4 = 0;
    this.$p3 = 0
};
function okBaseEntity(a) {
    this.$Z4 = 0;
    this.$y4 = -1;
    this.$e7 = a;
    this.$U5 = a.$I6.$U5;
    this.$e6 = "";
    this.$s5 = okA.mat43();
    this.$n5 = okA.mat43();
    this.$q5 = okA.mat43();
    this.$o5 = okA.mat43();
    this.$n2 = true;
    this.$m2 = true;
    this.$P2 = new okAABBox();
    this.$E5 = new okOBBox();
    this.$07 = new okVec3();
    this.$b3 = 0;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$F5 = null;
    this.$m = new okList();
    this.$h1 = okA.object()
}
okBaseEntity.prototype.clear = function () {
    this.$s5.identity();
    this.$n5.identity();
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.clearChild();
    this.releaseResource()
};
okBaseEntity.prototype._loadBaseEntityXML = function (c) {
    this.setName(c.getAttribValueString("Name"));
    var a = c.getAttribValueMat43("Matrix");
    if (a) {
        this.setMat(a);
        okA._mat43(a)
    }
};
okBaseEntity.prototype.getType = function () {
    return this.$Z4
};
okBaseEntity.prototype.setId = function (a) {
    this.$y4 = a
};
okBaseEntity.prototype.getId = function () {
    return this.$y4
};
okBaseEntity.prototype.setName = function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setName][Id: " + this.getId() + "] Invalid entity name!")
    }
    this.$e6 = a
};
okBaseEntity.prototype.getName = function () {
    return this.$e6
};
okBaseEntity.prototype.getResourceRefCount = function (a) {
    if (this.$h1[a] == null) {
        return 0
    }
    return this.$h1[a]
};
okBaseEntity.prototype.addResourceRef = function (a) {
    if (this.$h1[a] == null) {
        this.$h1[a] = 1
    } else {
        this.$h1[a] += 1
    }
};
okBaseEntity.prototype.releaseResource = function () {
    var e = this.$U5;
    for (var a in this.$h1) {
        var d = this.$h1[a];
        for (var c = 0; c < d; ++c) {
            e.deleteResource(parseInt(a))
        }
    }
    okA._object(this.$h1);
    this.$h1 = okA.object()
};
okBaseEntity.prototype.getState = function () {
    return 4
};
okBaseEntity.prototype.attachChild = function (a) {
    if (a == null) {
        okLog("[Error][" + this.__getTypeString() + ".attachChild][Id: " + this.getId() + "] Invalid child entity!")
    }
    if (a.$F5 != this) {
        this.$m.pushBack(a);
        a.$F5 = this;
        a._updateMat(true)
    }
};
okBaseEntity.prototype.detachChild = function (a) {
    if (a == null) {
        okLog("[Error][" + this.__getTypeString() + ".attachChild][Id: " + this.getId() + "] Invalid child entity!")
    }
    if (a.$F5 == this) {
        this.$m.remove(this.$m.find(a));
        a.$F5 = null;
        a._updateMat(true)
    }
};
okBaseEntity.prototype.clearChild = function () {
    var a = this.$m.getRoot();
    while (a) {
        var c = a.data;
        c.$F5 = null;
        c._updateMat(true);
        a = a.next
    }
    this.$m.clear()
};
okBaseEntity.prototype.getChildArray = function (c) {
    if (c == null) {
        c = okA.array()
    }
    var a = this.$m.getRoot();
    while (a) {
        c.push(a.data);
        a = a.next
    }
    return c
};
okBaseEntity.prototype._updateMat = function (a) {
    if (!a) {
        if (this.$F5) {
            var c = okMat43Mul(this.$s5, this.$n5);
            this.$s5 = this.$F5.$n5.inverse();
            this.$n5 = okMat43Mul(this.$F5.$n5, c);
            okA._mat43(c);
            this.$n2 = true;
            this.$m2 = true;
            this.$W1 = true;
            this.$t2 = true;
            this.$Y1 = true;
            this.dirtyMatFunc();
            this.$e7.dirtyEntity(this);
            var d = this.$m.getRoot();
            while (d) {
                d.data._updateMat(a);
                d = d.next
            }
        } else {
            this.$s5.identity()
        }
    } else {
        if (this.$F5) {
            this.$s5 = this.$F5.$n5.inverse()
        } else {
            this.$s5.identity()
        }
    }
};
okBaseEntity.prototype.getBoundingBox = function (a) {
    if (a == 2) {
        if (this.$t2) {
            this.$E5.setMin(-0.01, -0.01, -0.01);
            this.$E5.setMax(0.01, 0.01, 0.01);
            this.$E5.setMat(this.$n5);
            this.$t2 = false
        }
        return this.$E5
    } else {
        if (this.$W1) {
            this.$P2.setMin(-0.01, -0.01, -0.01);
            this.$P2.setMax(0.01, 0.01, 0.01);
            this.$W1 = false
        }
        return this.$P2
    }
};
okBaseEntity.prototype.getBoundingSphereCenter = function () {
    if (this._upBBox) {
        this._upBBox()
    }
    if (this.$Y1) {
        var c = this.getBoundingBox(2);
        var a = okMat43MulVec3(c.$n5, c.vMin);
        var d = okMat43MulVec3(c.$n5, c.vMax);
        this.$07.x = (a.x + d.x) * 0.5;
        this.$07.y = (a.y + d.y) * 0.5;
        this.$07.z = (a.z + d.z) * 0.5;
        this.$b3 = Math.sqrt((d.x - a.x) * (d.x - a.x) + (d.y - a.y) * (d.y - a.y) + (d.z - a.z) * (d.z - a.z)) * 0.5;
        okA._vec3(a);
        okA._vec3(d);
        this.$Y1 = false
    }
    return this.$07.clone()
};
okBaseEntity.prototype.getBoundingSphereRadius = function () {
    if (this._upBBox) {
        this._upBBox()
    }
    if (this.$Y1) {
        var c = this.getBoundingBox(2);
        var a = okMat43MulVec3(c.$n5, c.vMin);
        var d = okMat43MulVec3(c.$n5, c.vMax);
        this.$07.x = (a.x + d.x) * 0.5;
        this.$07.y = (a.y + d.y) * 0.5;
        this.$07.z = (a.z + d.z) * 0.5;
        this.$b3 = Math.sqrt((d.x - a.x) * (d.x - a.x) + (d.y - a.y) * (d.y - a.y) + (d.z - a.z) * (d.z - a.z)) * 0.5;
        okA._vec3(a);
        okA._vec3(d);
        this.$Y1 = false
    }
    return this.$b3
};
okBaseEntity.prototype.genRenderBatch = function (a, c, d) {
};
okBaseEntity.prototype.setMat = function (a) {
    if (!(a && ((a.__isMat43Complete && a.__isMat43Complete()) || (a.__isMat4Complete && a.__isMat4Complete())))) {
        okLog("[Error][" + this.__getTypeString() + ".setMat][Id: " + this.getId() + "] Invalid 4x3 or 4x4 matrix!")
    }
    this.$n5.m00 = a.m00;
    this.$n5.m10 = a.m10;
    this.$n5.m20 = a.m20;
    this.$n5.m01 = a.m01;
    this.$n5.m11 = a.m11;
    this.$n5.m21 = a.m21;
    this.$n5.m02 = a.m02;
    this.$n5.m12 = a.m12;
    this.$n5.m22 = a.m22;
    this.$n5.m03 = a.m03;
    this.$n5.m13 = a.m13;
    this.$n5.m23 = a.m23;
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var c = this.$m.getRoot();
    while (c) {
        c.data._updateMat(false);
        c = c.next
    }
};
okBaseEntity.prototype.getMat43 = function () {
    var a = okA.mat43();
    this.$n5.clone(a);
    return a
};
okBaseEntity.prototype.getMat4 = function () {
    var a = okA.mat4();
    this.$n5.toMat4(a);
    return a
};
okBaseEntity.prototype.getNormalMat3 = function () {
    if (this.$n2) {
        this.$n5.clone(this.$q5);
        this.$q5.inverse(true).transpose(true);
        this.$n2 = false
    }
    var a = okA.mat3();
    this.$q5.toMat3(a);
    return a
};
okBaseEntity.prototype.getNormalMat43 = function () {
    if (this.$n2) {
        this.$n5.clone(this.$q5);
        this.$q5.inverse(true).transpose(true);
        this.$n2 = false
    }
    var a = okA.mat43();
    this.$q5.clone(a);
    return a
};
okBaseEntity.prototype.getNormalMat4 = function () {
    if (this.$n2) {
        this.$n5.clone(this.$q5);
        this.$q5.inverse(true).transpose(true);
        this.$n2 = false
    }
    var a = okA.mat4();
    this.$q5.toMat4(a);
    return a
};
okBaseEntity.prototype.getInvMat43 = function () {
    if (this.$m2) {
        okA._mat43(this.$o5);
        this.$o5 = this.$n5.inverse();
        this.$m2 = false
    }
    var a = okA.mat43();
    this.$o5.clone(a);
    return a
};
okBaseEntity.prototype.getInvMat4 = function () {
    if (this.$m2) {
        okA._mat43(this.$o5);
        this.$o5 = this.$n5.inverse();
        this.$m2 = false
    }
    var a = okA.mat4();
    this.$o5.toMat4(a);
    return a
};
okBaseEntity.prototype.setPos = function (d, c, a) {
    if (c == null) {
        if (d == null || d.__isVec3Complete == null || !d.__isVec3Complete()) {
            okLog("[Error][" + this.__getTypeString() + ".setPos][Id: " + this.getId() + "] Invalid position!")
        }
        this.$n5.m03 = d.x;
        this.$n5.m13 = d.y;
        this.$n5.m23 = d.z
    } else {
        if (d == null || c == null || a == null || !okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a)) {
            okLog("[Error][" + this.__getTypeString() + ".setPos][Id: " + this.getId() + "] Invalid position!")
        }
        this.$n5.m03 = d;
        this.$n5.m13 = c;
        this.$n5.m23 = a
    }
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var e = this.$m.getRoot();
    while (e) {
        e.data._updateMat(false);
        e = e.next
    }
};
okBaseEntity.prototype.getPos = function () {
    var a = okA.vec3();
    a.x = this.$n5.m03;
    a.y = this.$n5.m13;
    a.z = this.$n5.m23;
    return a
};
okBaseEntity.prototype.move = function (l, h, f, d) {
    if (l == null || l != 1 && l != 2 && l != 3) {
        okLog("[Error][" + this.__getTypeString() + ".move][Id: " + this.getId() + "] Invalid space!")
    }
    var c = null;
    if (f != null) {
        if (h == null || f == null || d == null || !okIsNumber(h) || !okIsNumber(f) || !okIsNumber(d)) {
            okLog("[Error][" + this.__getTypeString() + ".move][Id: " + this.getId() + "] Invalid moving vector!")
        }
        c = okMat43Trans(h, f, d)
    } else {
        if (h == null || h.__isVec3Complete == null || !h.__isVec3Complete()) {
            okLog("[Error][" + this.__getTypeString() + ".move][Id: " + this.getId() + "] Invalid moving vector!")
        }
        c = okMat43Trans(h.x, h.y, h.z)
    }
    if (l == 3) {
        var a = okMat43Mul(c, this.$n5);
        okA._mat43(this.$n5);
        this.$n5 = a
    } else {
        if (l == 2 && this.$F5) {
            var e = okMat43Mul(this.$s5, this.$n5);
            e = okMat43Mul(c, e);
            okA._mat43(this.$n5);
            this.$n5 = okMat43Mul(this.$F5.$n5, e)
        } else {
            var a = okMat43Mul(this.$n5, c);
            okA._mat43(this.$n5);
            this.$n5 = a
        }
    }
    okA._mat43(c);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var k = this.$m.getRoot();
    while (k) {
        k.data._updateMat(false);
        k = k.next
    }
};
okBaseEntity.prototype.rotTarget = function (f, k, h) {
    if (f == null || !okIsNumber(f)) {
        okLog("[Error][" + this.__getTypeString() + ".rotTarget][Id: " + this.getId() + "] Invalid rotation angle!")
    }
    if (k == null || k.__isVec3Complete == null || !k.__isVec3Complete()) {
        okLog("[Error][" + this.__getTypeString() + ".rotTarget][Id: " + this.getId() + "] Invalid target!")
    }
    if (h == null || h.__isVec3Complete == null || !h.__isVec3Complete()) {
        okLog("[Error][" + this.__getTypeString() + ".rotTarget][Id: " + this.getId() + "] Invalid rotation axis!")
    }
    var c = okA.mat43();
    this.$n5.clone(c);
    c.m03 -= k.x;
    c.m13 -= k.y;
    c.m23 -= k.z;
    var a = okMat43Rot(f, h);
    var d = okMat43Mul(a, c);
    okA._mat43(c);
    d.m03 += k.x;
    d.m13 += k.y;
    d.m23 += k.z;
    d.clone(this.$n5);
    okA._mat43(d);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var e = this.$m.getRoot();
    while (e) {
        e.data._updateMat(false);
        e = e.next
    }
};
okBaseEntity.prototype.getDir = function (a) {
    return this.$n5.getColumn(a - 1).normalize(true)
};
okBaseEntity.prototype.setDir = function (f, e, d, c, a) {
    if (f < 1 || f > 3) {
        okLog("[Error][" + this.__getTypeString() + ".setDir][Id: " + this.getId() + "] Invalid local axis!")
    }
    if (typeof e != "number") {
        if (e == null || e.__isVec3Complete == null || !e.__isVec3Complete()) {
            okLog("[Error][" + this.__getTypeString() + ".setDir][Id: " + this.getId() + "] Invalid direction vector!")
        }
    } else {
        if (e == null || d == null || c == null || !okIsNumber(e) || !okIsNumber(d) || !okIsNumber(c)) {
            okLog("[Error][" + this.__getTypeString() + ".setDir][Id: " + this.getId() + "] Invalid direction vector!")
        }
    }
    this._rotToDir(f, e, d, c, a);
    var h = this.$m.getRoot();
    while (h) {
        h.data._updateMat(false);
        h = h.next
    }
};
okBaseEntity.prototype._rotToDir = function (c, k, e, d, f) {
    var a = okA.array();
    a.push(this.$n5.getColumn(0), this.$n5.getColumn(1), this.$n5.getColumn(2));
    var m = a[0].len();
    var l = a[1].len();
    var h = a[2].len();
    a[0].normalize(true);
    a[1].normalize(true);
    a[2].normalize(true);
    var n = c - 1;
    if (typeof k == "number") {
        a[n].x = k;
        a[n].y = e;
        a[n].z = d
    } else {
        a[n].x = k.x;
        a[n].y = k.y;
        a[n].z = k.z;
        f = e
    }
    a[n].normalize(true);
    if (c == f) {
        return
    }
    var o = ((f != null) ? (f - 1) : null);
    if (o == null || o == ((n + 2) % 3)) {
        var p = a[(n + 1) % 3].clone();
        a[(n + 1) % 3] = okVec3Cross(a[(n + 2) % 3], a[n]);
        if (a[(n + 1) % 3].equal(OAK.VEC3_ZERO)) {
            okA._vec3(a[(n + 1) % 3]);
            a[(n + 1) % 3] = p;
            okA._vec3(a[(n + 2) % 3]);
            a[(n + 2) % 3] = okVec3Cross(a[n], a[(n + 1) % 3]);
            okA._vec3(a[(n + 1) % 3]);
            a[(n + 1) % 3] = okVec3Cross(a[(n + 2) % 3], a[n])
        } else {
            okA._vec3(p);
            okA._vec3(a[(n + 2) % 3]);
            a[(n + 2) % 3] = okVec3Cross(a[n], a[(n + 1) % 3])
        }
    } else {
        var p = a[(n + 2) % 3].clone();
        a[(n + 2) % 3] = okVec3Cross(a[n], a[(n + 1) % 3]);
        if (a[(n + 2) % 3].equal(OAK.VEC3_ZERO)) {
            okA._vec3(a[(n + 2) % 3]);
            a[(n + 2) % 3] = p;
            okA._vec3(a[(n + 1) % 3]);
            a[(n + 1) % 3] = okVec3Cross(a[(n + 2) % 3], a[n]);
            okA._vec3(a[(n + 2) % 3]);
            a[(n + 2) % 3] = okVec3Cross(a[n], a[(n + 1) % 3])
        } else {
            okA._vec3(p);
            okA._vec3(a[(n + 1) % 3]);
            a[(n + 1) % 3] = okVec3Cross(a[(n + 2) % 3], a[n])
        }
    }
    a[0].normalize(true);
    a[1].normalize(true);
    a[2].normalize(true);
    this.$n5.m00 = a[0].x * m;
    this.$n5.m10 = a[0].y * m;
    this.$n5.m20 = a[0].z * m;
    this.$n5.m01 = a[1].x * l;
    this.$n5.m11 = a[1].y * l;
    this.$n5.m21 = a[1].z * l;
    this.$n5.m02 = a[2].x * h;
    this.$n5.m12 = a[2].y * h;
    this.$n5.m22 = a[2].z * h;
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    okA._vec3(a[0]);
    okA._vec3(a[1]);
    okA._vec3(a[2]);
    okA._array(a)
};
okBaseEntity.prototype.rotQuat = function (h, f) {
    if (h == null || h != 1 && h != 2 && h != 3) {
        okLog("[Error][" + this.__getTypeString() + ".rotQuat][Id: " + this.getId() + "] Invalid space!")
    }
    if (f == null || f.__isQuatComplete == null || f.__isQuatComplete() == false) {
        okLog("[Error][" + this.__getTypeString() + ".rotQuat][Id: " + this.getId() + "] Invalid quaternion!")
    }
    var a = f.toMat43();
    if (h == 3) {
        var c = okMat43Mul(a, this.$n5);
        okA._mat43(this.$n5);
        this.$n5 = c
    } else {
        if (h == 2 && this.$F5) {
            var d = okMat43Mul(this.$s5, this.$n5);
            d = okMat43Mul(a, d);
            okA._mat43(this.$n5);
            this.$n5 = okMat43Mul(this.$F5.$n5, d)
        } else {
            var c = okMat43Mul(this.$n5, a);
            okA._mat43(this.$n5);
            this.$n5 = c
        }
    }
    okA._mat43(a);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var e = this.$m.getRoot();
    while (e) {
        e.data._updateMat(false);
        e = e.next
    }
};
okBaseEntity.prototype.rotX = function (a, e) {
    if (a == null || a != 1 && a != 2 && a != 3) {
        okLog("[Error][" + this.__getTypeString() + ".rotX][Id: " + this.getId() + "] Invalid space!")
    }
    if (e == null || !okIsNumber(e)) {
        okLog("[Error][" + this.__getTypeString() + ".rotX][Id: " + this.getId() + "] Invalid rotation angle!")
    }
    var l = okMat43RotX(e);
    if (a == 3) {
        var p = okMat43Mul(l, this.$n5);
        okA._mat43(this.$n5);
        this.$n5 = p
    } else {
        if (a == 2 && this.$F5) {
            var f = okMat43Mul(this.$s5, this.$n5);
            f = okMat43Mul(l, f);
            okA._mat43(this.$n5);
            this.$n5 = okMat43Mul(this.$F5.$n5, f)
        } else {
            var d = this.$n5;
            var n = d.m00 * d.m00 + d.m10 * d.m10 + d.m20 * d.m20;
            var k = d.m01 * d.m01 + d.m11 * d.m11 + d.m21 * d.m21;
            var h = d.m02 * d.m02 + d.m12 * d.m12 + d.m22 * d.m22;
            var o = (n != 1 || k != 1 || h != 1);
            if (o) {
                n = Math.sqrt(n);
                k = Math.sqrt(k);
                h = Math.sqrt(h);
                this.$n5.m00 /= n;
                this.$n5.m10 /= n;
                this.$n5.m20 /= n;
                this.$n5.m01 /= k;
                this.$n5.m11 /= k;
                this.$n5.m21 /= k;
                this.$n5.m02 /= h;
                this.$n5.m12 /= h;
                this.$n5.m22 /= h
            }
            var p = okMat43Mul(this.$n5, l);
            if (o) {
                n = n / Math.sqrt(p.m00 * p.m00 + p.m10 * p.m10 + p.m20 * p.m20);
                k = k / Math.sqrt(p.m01 * p.m01 + p.m11 * p.m11 + p.m21 * p.m21);
                h = h / Math.sqrt(p.m02 * p.m02 + p.m12 * p.m12 + p.m22 * p.m22);
                p.m00 *= n;
                p.m10 *= n;
                p.m20 *= n;
                p.m01 *= k;
                p.m11 *= k;
                p.m21 *= k;
                p.m02 *= h;
                p.m12 *= h;
                p.m22 *= h
            }
            okA._mat43(this.$n5);
            this.$n5 = p
        }
    }
    okA._mat43(l);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var c = this.$m.getRoot();
    while (c) {
        c.data._updateMat(false);
        c = c.next
    }
};
okBaseEntity.prototype.rotY = function (a, e) {
    if (a == null || a != 1 && a != 2 && a != 3) {
        okLog("[Error][" + this.__getTypeString() + ".rotY][Id: " + this.getId() + "] Invalid space!")
    }
    if (e == null || !okIsNumber(e)) {
        okLog("[Error][" + this.__getTypeString() + ".rotY][Id: " + this.getId() + "] Invalid rotation angle!")
    }
    var l = okMat43RotY(e);
    if (a == 3) {
        var p = okMat43Mul(l, this.$n5);
        okA._mat43(this.$n5);
        this.$n5 = p
    } else {
        if (a == 2 && this.$F5) {
            var f = okMat43Mul(this.$s5, this.$n5);
            f = okMat43Mul(l, f);
            okA._mat43(this.$n5);
            this.$n5 = okMat43Mul(this.$F5.$n5, f)
        } else {
            var d = this.$n5;
            var n = d.m00 * d.m00 + d.m10 * d.m10 + d.m20 * d.m20;
            var k = d.m01 * d.m01 + d.m11 * d.m11 + d.m21 * d.m21;
            var h = d.m02 * d.m02 + d.m12 * d.m12 + d.m22 * d.m22;
            var o = (n != 1 || k != 1 || h != 1);
            if (o) {
                n = Math.sqrt(n);
                k = Math.sqrt(k);
                h = Math.sqrt(h);
                this.$n5.m00 /= n;
                this.$n5.m10 /= n;
                this.$n5.m20 /= n;
                this.$n5.m01 /= k;
                this.$n5.m11 /= k;
                this.$n5.m21 /= k;
                this.$n5.m02 /= h;
                this.$n5.m12 /= h;
                this.$n5.m22 /= h
            }
            var p = okMat43Mul(this.$n5, l);
            if (o) {
                n = n / Math.sqrt(p.m00 * p.m00 + p.m10 * p.m10 + p.m20 * p.m20);
                k = k / Math.sqrt(p.m01 * p.m01 + p.m11 * p.m11 + p.m21 * p.m21);
                h = h / Math.sqrt(p.m02 * p.m02 + p.m12 * p.m12 + p.m22 * p.m22);
                p.m00 *= n;
                p.m10 *= n;
                p.m20 *= n;
                p.m01 *= k;
                p.m11 *= k;
                p.m21 *= k;
                p.m02 *= h;
                p.m12 *= h;
                p.m22 *= h
            }
            okA._mat43(this.$n5);
            this.$n5 = p
        }
    }
    okA._mat43(l);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var c = this.$m.getRoot();
    while (c) {
        c.data._updateMat(false);
        c = c.next
    }
};
okBaseEntity.prototype.rotZ = function (a, e) {
    if (a == null || a != 1 && a != 2 && a != 3) {
        okLog("[Error][" + this.__getTypeString() + ".rotZ][Id: " + this.getId() + "] Invalid space!")
    }
    if (e == null || !okIsNumber(e)) {
        okLog("[Error][" + this.__getTypeString() + ".rotZ][Id: " + this.getId() + "] Invalid rotation angle!")
    }
    var l = okMat43RotZ(e);
    if (a == 3) {
        var p = okMat43Mul(l, this.$n5);
        okA._mat43(this.$n5);
        this.$n5 = p
    } else {
        if (a == 2 && this.$F5) {
            var f = okMat43Mul(this.$s5, this.$n5);
            f = okMat43Mul(l, f);
            okA._mat43(this.$n5);
            this.$n5 = okMat43Mul(this.$F5.$n5, f)
        } else {
            var d = this.$n5;
            var n = d.m00 * d.m00 + d.m10 * d.m10 + d.m20 * d.m20;
            var k = d.m01 * d.m01 + d.m11 * d.m11 + d.m21 * d.m21;
            var h = d.m02 * d.m02 + d.m12 * d.m12 + d.m22 * d.m22;
            var o = (n != 1 || k != 1 || h != 1);
            if (o) {
                n = Math.sqrt(n);
                k = Math.sqrt(k);
                h = Math.sqrt(h);
                this.$n5.m00 /= n;
                this.$n5.m10 /= n;
                this.$n5.m20 /= n;
                this.$n5.m01 /= k;
                this.$n5.m11 /= k;
                this.$n5.m21 /= k;
                this.$n5.m02 /= h;
                this.$n5.m12 /= h;
                this.$n5.m22 /= h
            }
            var p = okMat43Mul(this.$n5, l);
            if (o) {
                n = n / Math.sqrt(p.m00 * p.m00 + p.m10 * p.m10 + p.m20 * p.m20);
                k = k / Math.sqrt(p.m01 * p.m01 + p.m11 * p.m11 + p.m21 * p.m21);
                h = h / Math.sqrt(p.m02 * p.m02 + p.m12 * p.m12 + p.m22 * p.m22);
                p.m00 *= n;
                p.m10 *= n;
                p.m20 *= n;
                p.m01 *= k;
                p.m11 *= k;
                p.m21 *= k;
                p.m02 *= h;
                p.m12 *= h;
                p.m22 *= h
            }
            okA._mat43(this.$n5);
            this.$n5 = p
        }
    }
    okA._mat43(l);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var c = this.$m.getRoot();
    while (c) {
        c.data._updateMat(false);
        c = c.next
    }
};
okBaseEntity.prototype.scale = function (l, f, e, c) {
    if (l == null || l != 1 && l != 2 && l != 3) {
        okLog("[Error][" + this.__getTypeString() + ".scale][Id: " + this.getId() + "] Invalid space!")
    }
    var k = null;
    if (e != null) {
        if (f == null || e == null || c == null || !okIsNumber(f) || !okIsNumber(e) || !okIsNumber(c)) {
            okLog("[Error][" + this.__getTypeString() + ".scale][Id: " + this.getId() + "] Invalid scaling factor!")
        }
        k = okMat43Scale(f, e, c)
    } else {
        if (f.x) {
            if (f.__isVec3Complete == null || !f.__isVec3Complete()) {
                okLog("[Error][" + this.__getTypeString() + ".scale][Id: " + this.getId() + "] Invalid scaling factor!")
            }
            k = okMat43Scale(f.x, f.y, f.z)
        } else {
            if (f == null || !okIsNumber(f)) {
                okLog("[Error][" + this.__getTypeString() + ".scale][Id: " + this.getId() + "] Invalid scaling factor!")
            }
            k = okMat43Scale(f, f, f)
        }
    }
    if (l == 3) {
        var a = okMat43Mul(k, this.$n5);
        okA._mat43(this.$n5);
        this.$n5 = a
    } else {
        if (l == 2 && this.$F5) {
            var d = okMat43Mul(this.$s5, this.$n5);
            d = okMat43Mul(k, d);
            okA._mat43(this.$n5);
            this.$n5 = okMat43Mul(this.$F5.$n5, d)
        } else {
            var a = okMat43Mul(this.$n5, k);
            okA._mat43(this.$n5);
            this.$n5 = a
        }
    }
    okA._mat43(k);
    this.$n2 = true;
    this.$m2 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.dirtyMatFunc();
    this.$e7.dirtyEntity(this);
    var h = this.$m.getRoot();
    while (h) {
        h.data._updateMat(false);
        h = h.next
    }
};
okBaseEntity.prototype.dirtyMatFunc = function () {
};
okBaseEntity.prototype.__getTypeString = function () {
    switch (this.$Z4) {
        case 0:
            return"UnknowEntity";
        case 1:
            return"okStaticEntity";
        case 2:
            return"okDynamicEntity";
        case 4:
            return"okDctLightEntity";
        case 8:
            return"okPointLightEntity";
        case 16:
            return"okSpotLightEntity";
        case 32:
            return"okTerrainEntity";
        case 64:
            return"okCustomMeshEntity";
        case 128:
            return"okVideoEntity";
        case 256:
            return"okParticleEntity"
    }
    return"UnknowEntity"
};
function okVisibleEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = (1 | 2 | 32 | 64 | 128 | 256);
    this.$M2 = true;
    this.$y3 = -1;
    this.$22 = false;
    this.$y2 = true;
    this.$t3 = 0.06;
    this.$u3 = 1;
    this.$B4 = 1;
    this.$C2 = false;
    this.$u = okA.array();
    this.$71 = okA.array();
    this.$q1 = okA.array()
}
okExtend(okVisibleEntity, okBaseEntity);
okVisibleEntity.prototype.clear = function () {
    this.$M2 = true;
    this.$y3 = -1;
    if (this.$22) {
        this.$e7.$b4 -= 1
    }
    this.$22 = false;
    this.$y2 = true;
    this.$t3 = 0.0001;
    this.$u3 = 1;
    this.$B4 = 1;
    this.$C2 = false;
    this.clearLight();
    okBaseCall(this, "clear")
};
okVisibleEntity.prototype._loadVisibleEntityXML = function (d) {
    okBaseCall(this, "_loadBaseEntityXML");
    var k = (d.getAttribValueInt("Visible") == 1);
    if (k != null) {
        this.enableVisible(k)
    }
    var a = d.getAttribValueInt("VisibleDistance");
    if (a != null) {
        this.setVisibleDistance(a)
    }
    var e = (d.getAttribValueInt("CastShadow") == 1);
    if (e != null) {
        this.enableCastShadow(e)
    }
    var h = (d.getAttribValueInt("ReceiveShadow") == 1);
    if (h != null) {
        this.enableReceiveShadow(h)
    }
    var m = d.getAttribValueFloat("ShadowFade");
    if (m != null) {
        this.setShadowFade(m)
    }
    var f = d.getAttribValueFloat("ShadowResolution");
    if (f != null) {
        this.setShadowResolution(f)
    }
    var l = d.getAttribValueInt("LightGroup");
    if (l != null) {
        this.setLightGroup(l)
    }
    var c = (d.getAttribValueInt("SkyBox") == 1);
    if (c != null) {
        this.enableSkyBox(c)
    }
};
okVisibleEntity.prototype.addLight = function (a) {
    if (a.$Z4 == 4) {
        this.$u.push(a)
    } else {
        if (a.$Z4 == 8) {
            this.$71.push(a)
        } else {
            if (a.$Z4 == 16) {
                this.$q1.push(a)
            }
        }
    }
};
okVisibleEntity.prototype.removeLight = function (c) {
    var e = null;
    if (c.$Z4 == 4) {
        e = this.$u
    } else {
        if (c.$Z4 == 8) {
            e = this.$71
        } else {
            if (c.$Z4 == 16) {
                e = this.$q1
            }
        }
    }
    if (e == null) {
        return
    }
    var a = e.length;
    for (var d = 0; d < a; ++d) {
        if (e[d] == c) {
            e[d] = e[a - 1];
            e.pop();
            break
        }
    }
};
okVisibleEntity.prototype.findLight = function (c) {
    var e = null;
    if (c.$Z4 == 4) {
        e = this.$u
    } else {
        if (c.$Z4 == 8) {
            e = this.$71
        } else {
            if (c.$Z4 == 16) {
                e = this.$q1
            }
        }
    }
    if (e == null) {
        return false
    }
    var a = e.length;
    for (var d = 0; d < a; ++d) {
        if (e[d] == c) {
            return true
        }
    }
    return false
};
okVisibleEntity.prototype.clearLight = function () {
    this.$u.length = 0;
    this.$71.length = 0;
    this.$q1.length = 0
};
okVisibleEntity.prototype.enableVisible = function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][" + this.__getTypeString() + ".enableVisible][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$M2 = a
};
okVisibleEntity.prototype.isVisible = function () {
    return this.$M2
};
okVisibleEntity.prototype.setVisibleDistance = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setVisibleDistance][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$y3 = a
};
okVisibleEntity.prototype.getVisibleDistance = function () {
    return this.$y3
};
okVisibleEntity.prototype.enableSkyBox = function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][" + this.__getTypeString() + ".enableSkyBox][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$C2 = a;
    this.$e7.forceVisibleEntity(this, a)
};
okVisibleEntity.prototype.isSkyBox = function () {
    return this.$C2
};
okVisibleEntity.prototype.enableCastShadow = function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][" + this.__getTypeString() + ".enableCastShadow][Id: " + this.getId() + "] Invalid parameter!")
    }
    if (a != this.$22) {
        if (a) {
            this.$e7.$b4 += 1
        } else {
            this.$e7.$b4 -= 1
        }
        this.$22 = a
    }
};
okVisibleEntity.prototype.isCastShadow = function () {
    return this.$22
};
okVisibleEntity.prototype.enableReceiveShadow = function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][" + this.__getTypeString() + ".enableReceiveShadow][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$y2 = a
};
okVisibleEntity.prototype.isReceiveShadow = function () {
    return this.$y2
};
okVisibleEntity.prototype.setShadowFade = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setShadowFade][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$t3 = a
};
okVisibleEntity.prototype.getShadowFade = function () {
    return this.$t3
};
okVisibleEntity.prototype.setShadowResolution = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setShadowResolution][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$u3 = a
};
okVisibleEntity.prototype.getShadowResolution = function () {
    return this.$u3
};
okVisibleEntity.prototype.setLightGroup = function (a) {
    this.$B4 = a
};
okVisibleEntity.prototype.getLightGroup = function () {
    return this.$B4
};
function okStaticEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 1;
    this.$J4 = -1;
    this.$Z = okA.object()
}
okExtend(okStaticEntity, okVisibleEntity);
okStaticEntity.prototype.clear = function () {
    var a = this.$U5;
    this.deleteModel();
    if (this.$Z) {
        okA._object(this.$Z)
    }
    this.$Z = okA.object();
    this.onLoad = null;
    this.onload = null;
    okBaseCall(this, "clear")
};
okStaticEntity.prototype.loadEntity = function (a, c) {
    switch (a) {
        case 1:
            this._loadStaticEntityXML(c);
            break
    }
};
okStaticEntity.prototype._loadStaticEntityXML = function (k) {
    okBaseCall(this, "_loadVisibleEntityXML");
    var h = k.getAttribValueString("Model");
    if (h != null) {
        this.loadModel(h, null, null, null, true)
    }
    okA._object(this.$Z);
    this.$Z = okA.object();
    var a = k.getChild("MtrlList");
    if (a != null) {
        var f = a.getChildNum();
        for (var e = 0; e < f; ++e) {
            var d = a.getChild(e);
            var c = new okMaterial(this.$U5.rc);
            okResourceParser._parseMaterialXML(d, c, true);
            this.$Z[d.getAttribValueString("Mesh")] = c
        }
    }
};
okStaticEntity.prototype.getState = function () {
    if (this.$J4 == -1) {
        return 1
    }
    var a = this.$U5.getResourceState(this.$J4);
    if (a != 5) {
        return 1
    }
    return 4
};
okStaticEntity.prototype.loadModel = function (f, d, h, c, a) {
    if (f == null || !okIsString(f)) {
        okLog("[Error][" + this.__getTypeString() + ".loadModel][Id: " + this.getId() + "] Invalid model name!")
    }
    this.deleteModel();
    var e = this.$e7.$I6._packModelUrl(f);
    this.$J4 = this.$U5.createResource(1, e);
    this.$U5.registerListener(this.$J4, this);
    if (this.$U5.getResourceState(this.$J4) == 2) {
        if (d == null) {
            this.$U5.loadModelByUrl(this.$J4, e, h, c)
        } else {
            this.$U5.loadModelByText(this.$J4, d, h, c)
        }
    }
    if (this.$U5.getResourceState(this.$J4) == 5) {
        this._postLoadModel(a)
    }
    return true
};
okStaticEntity.prototype.getModel = function () {
    if (this.$J4 == -1 || this.$U5.getResourceState(this.$J4) != 5) {
        return null
    }
    return this.$U5.getResource(this.$J4)
};
okStaticEntity.prototype.deleteModel = function () {
    if (this.$J4 != -1) {
        this.$U5.deleteResource(this.$J4);
        this.$U5.removeListener(this.$J4, this);
        this.$J4 = -1;
        this.$Z = new Object;
        this.$W1 = true;
        this.$t2 = true;
        this.$Y1 = true
    }
};
okStaticEntity.prototype.getMaterialMap = function () {
    return this.$Z
};
okStaticEntity.prototype.getMaterial = function (c) {
    if (c == null) {
        for (var a in this.$Z) {
            return this.$Z[a]
        }
        return null
    }
    return this.$Z[c]
};
okStaticEntity.prototype.getBoundingBox = function (e) {
    if (e == 2) {
        if (this.$t2) {
            var c = this.getModel();
            if (c == null) {
                var d = this.$n5.getColumn(3);
                this.$E5.setMin(d);
                this.$E5.setMax(d);
                this.$E5.setMat(this.$n5);
                okA._vec3(d)
            } else {
                var a = c.getBoundingBox();
                this.$E5.setMin(a.vMin);
                this.$E5.setMax(a.vMax);
                this.$E5.setMat(this.$n5);
                this.$t2 = false
            }
        }
        return this.$E5
    } else {
        if (this.$W1) {
            var c = this.getModel();
            if (c == null) {
                var d = this.$n5.getColumn(3);
                this.$P2.set(d, d);
                okA._vec3(d)
            } else {
                c.getBoundingBox().clone(this.$P2);
                this.$P2.transformMat(this.$n5);
                this.$W1 = false
            }
        }
        return this.$P2
    }
};
okStaticEntity.prototype.genRenderBatch = function (w, a) {
    var q = this.$e7.$I6;
    var s = this.$U5;
    var f = this.getModel();
    if (f == null) {
        return
    }
    var m = a.$U2;
    if (this.$y3 > 0) {
        var d = m.getPos();
        var n = (d.x - this.$n5.m03) * (d.x - this.$n5.m03) + (d.y - this.$n5.m13) * (d.y - this.$n5.m13) + (d.z - this.$n5.m23) * (d.z - this.$n5.m23);
        if (n > this.$y3 * this.$y3) {
            return
        }
    }
    var l = f.getMeshMap();
    for (var e in l) {
        var p = l[e];
        var v = this.getMaterial(e);
        var k = okA.renderBatch();
        for (var t = 0; t < 7; ++t) {
            var u = v.getTextureResourceId(t);
            if (u == -1) {
                continue
            }
            var o = s.getResource(u);
            if (!o) {
                continue
            }
            if (o.isVideoTexture()) {
                o.updateVideoTexture()
            }
        }
        k.$a = p._getAttribFmt();
        if (v.$O2 && p.$H.Wireframe) {
            k.$95 = p.$H.Wireframe;
            k.$r4 = 1
        } else {
            k.$95 = p.$H.Default;
            k.$r4 = 4
        }
        k.$s4 = 0;
        k.$q4 = k.$95.getLength();
        k.$A5 = v;
        var h = this.getMat4();
        if (this.$C2) {
            h.m03 += m.$i5.m03;
            h.m13 += m.$i5.m13;
            h.m23 += m.$i5.m23
        }
        k.$p5 = p.getMat4();
        k.$r5 = p.getNormalMat4();
        k.$n5 = h;
        k.$q5 = this.getNormalMat4();
        k.$t = this.$u;
        k.$61 = this.$71;
        k.$p1 = this.$q1;
        var c = new okAABBox();
        p.getBoundingBox().clone(c);
        if (this.$C2) {
            c.set(new okVec3(c.vMin.x + m.$i5.m03, c.vMin.y + m.$i5.m13, c.vMin.z + m.$i5.m23), new okVec3(c.vMax.x + m.$i5.m03, c.vMax.y + m.$i5.m13, c.vMax.z + m.$i5.m23))
        }
        c.transformMat(this.$n5);
        k.$S2 = c;
        k.$y2 = this.$y2;
        k.$B4 = this.$B4;
        w.push(k)
    }
};
okStaticEntity.prototype.onMessage = function (a) {
    switch (a.sMsg) {
        case"RES_READY":
            if (this.$J4 == a.aArgs[0]) {
                this._postLoadModel(false)
            }
            break
    }
};
okStaticEntity.prototype._postLoadModel = function (a) {
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$e7.dirtyEntity(this);
    if (a != true) {
        var c = this.$U5.getResource(this.$J4);
        if (c) {
            for (var e in c.getMeshMap()) {
                var d = new okMaterial();
                d.$73 = this;
                c.getMesh(e).getMaterial().clone(d);
                this.$Z[e] = d
            }
        }
    }
    if (this.onLoad) {
        this.onLoad(this.getId(), this.$J4)
    } else {
        if (this.onload) {
            this.onload(this.getId(), this.$J4)
        }
    }
};
function okDynamicEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 2;
    this.$J4 = -1;
    this.$Z = new Object;
    this.$Z2 = new okSkAnimPlayer();
    this.$51 = new Object;
    this.$R2 = new okAABBox();
    this.$X1 = true;
    this.$u2 = false;
    this.$44 = (this.$e7.$I6.$53.$63.iVertexUniformNum >= 220 ? 64 : 32)
}
okExtend(okDynamicEntity, okVisibleEntity);
okDynamicEntity.prototype.clear = function () {
    this.deleteModel();
    this.$Z2.clear();
    for (var a in this.$51) {
        this.$51[a].clear()
    }
    okA._object(this.$51);
    this.$51 = okA.object();
    this.$X1 = true;
    this.$u2 = false;
    okBaseCall(this, "clear")
};
okDynamicEntity.prototype.getState = function () {
    if (this.$J4 == -1) {
        return 1
    }
    var a = this.$U5.getResourceState(this.$J4);
    if (a != 5) {
        return 1
    }
    return 4
};
okDynamicEntity.prototype.loadModel = function (e, c, f, a) {
    if (e == null || !okIsString(e)) {
        okLog("[Error][" + this.__getTypeString() + ".loadModel][Id: " + this.getId() + "] Invalid model name!")
    }
    this.deleteModel();
    var d = this.$e7.$I6._packModelUrl(e);
    this.$J4 = this.$U5.createResource(1, d);
    this.$U5.registerListener(this.$J4, this);
    if (this.$U5.getResourceState(this.$J4) == 2) {
        if (c == null) {
            this.$U5.loadModelByUrl(this.$J4, d, f, a)
        } else {
            this.$U5.loadModelByText(this.$J4, c, f, a)
        }
    }
    if (this.$U5.getResourceState(this.$J4) == 5) {
        this._postLoadModel(this.$J4)
    }
    return true
};
okDynamicEntity.prototype.getModel = function () {
    if (this.$J4 == -1 || this.$U5.getResourceState(this.$J4) != 5) {
        return null
    }
    return this.$U5.getResource(this.$J4)
};
okDynamicEntity.prototype.loadSkAnimation = function (f, l, m, d, h, k) {
    if (m == null || !okIsString(m)) {
        okLog("[Error][" + this.__getTypeString() + ".loadSkAnimation][Id: " + this.getId() + "] Invalid animation name!")
    }
    var a = this.$U5;
    var c = this.$e7.$I6._packSkAnimationUrl(m);
    var n = a.createResource(3, c);
    this.addResourceRef(n);
    if (a.getResourceState(n) == 2) {
        if (d == null) {
            a.loadSkAnimationByUrl(n, c, h)
        } else {
            a.loadSkAnimationByText(n, d, h)
        }
    }
    var e = a.getResource(n);
    if (k) {
        if (this.$51[k] == null) {
            this.$51[k] = this.$Z2.clone()
        }
        this.$51[k].activateChannel(f, true);
        this.$51[k].attachAnim(f, e, l)
    } else {
        for (var k in this.$51) {
            this.$51[k].activateChannel(f, true);
            this.$51[k].attachAnim(f, e, l)
        }
        this.$Z2.activateChannel(f, true);
        this.$Z2.attachAnim(f, e, l)
    }
    if (a.getResourceState(n) == 5) {
        this._postLoadAnim(n)
    }
    return true
};
okDynamicEntity.prototype.deleteModel = function () {
    if (this.$J4 != -1) {
        this.$U5.removeListener(this.$J4, this);
        this.$U5.deleteResource(this.$J4);
        this.$J4 = -1;
        this.$Z = new Object
    }
};
okDynamicEntity.prototype.deleteSkAnimation = function (d, c) {
    if (c == null) {
        for (var c in this.$51) {
            for (var a = 0; a < 2; ++a) {
                if (d == -1 || a == d) {
                    this.$51[c].activateChannel(a, false);
                    this.$51[c].attachAnim(a, null)
                }
            }
        }
        for (var a = 0; a < 2; ++a) {
            if (d == -1 || a == d) {
                this.$Z2.activateChannel(a, false);
                this.$Z2.attachAnim(a, null)
            }
        }
    } else {
        if (this.$51[c]) {
            for (var a = 0; a < 2; ++a) {
                if (d == -1 || a == d) {
                    this.$51[c].activateChannel(a, false);
                    this.$51[c].attachAnim(a, null)
                }
            }
        } else {
            this.$51[c] = this.$Z2.clone();
            for (var a = 0; a < 2; ++a) {
                if (d == -1 || a == d) {
                    this.$51[c].activateChannel(a, false);
                    this.$51[c].attachAnim(a, null)
                }
            }
        }
    }
};
okDynamicEntity.prototype.getMaterialMap = function () {
    return this.$Z
};
okDynamicEntity.prototype.getMaterial = function (c) {
    if (c == null) {
        for (var a in this.$Z) {
            return this.$Z[a]
        }
        return null
    }
    return this.$Z[c]
};
okDynamicEntity.prototype.getBoundingBox = function (h) {
    if (this.$X1) {
        if (this.$U5.getResourceState(this.$J4) == 5) {
            var c = this.$U5.getResource(this.$J4);
            okA._aabbox(this.$R2);
            this.$R2 = c.getBoundingBox();
            this.$R2 = this.$R2.union(this.$Z2.getBoundingBox());
            for (var f in c.getMeshMap()) {
                var a = c.getMesh(f);
                var e = this.$51[f];
                if (e) {
                    this.$R2 = this.$R2.union(e.getBoundingBox())
                }
            }
        } else {
            this.$R2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO)
        }
        this.$X1 = false;
        this.$W1 = true;
        this.$t2 = true;
        this.$Y1 = true
    }
    if (h == 2) {
        if (this.$t2) {
            var c = this.getModel();
            if (c == null) {
                var d = this.$n5.getColumn(3);
                this.$E5.setMin(d);
                this.$E5.setMax(d);
                this.$E5.setMat(this.$n5);
                okA._vec3(d)
            } else {
                this.$E5.setMin(this.$R2.vMin);
                this.$E5.setMax(this.$R2.vMax);
                this.$E5.setMat(this.$n5);
                this.$t2 = false
            }
        }
        return this.$E5
    } else {
        if (this.$W1) {
            var c = this.getModel();
            if (c == null) {
                var d = this.$n5.getColumn(3);
                this.$P2.set(d, d);
                okA._vec3(d)
            } else {
                this.$R2.clone(this.$P2);
                this.$P2.transformMat(this.$n5);
                this.$W1 = false
            }
        }
        return this.$P2
    }
};
okDynamicEntity.prototype.genRenderBatch = function (D, a) {
    var u = this.$U5;
    var h = this.getModel();
    if (h == null) {
        return
    }
    var o = a.$U2;
    if (this.$y3 > 0) {
        var d = o.getPos();
        var p = (d.x - this.$n5.m03) * (d.x - this.$n5.m03) + (d.y - this.$n5.m13) * (d.y - this.$n5.m13) + (d.z - this.$n5.m23) * (d.z - this.$n5.m23);
        if (p > this.$y3 * this.$y3) {
            return
        }
    }
    var n = h.getMeshMap();
    for (var e in n) {
        var s = n[e];
        var C = this.getMaterial(e);
        var l = okA.renderBatch();
        for (var z = 0; z < 7; ++z) {
            var B = C.getTextureResourceId(z);
            if (B == -1) {
                continue
            }
            var q = u.getResource(B);
            if (!q) {
                continue
            }
            if (q.isVideoTexture()) {
                q.updateVideoTexture()
            }
        }
        l.$a = s._getAttribFmt();
        if (C.$O2 && s.$H.Wireframe) {
            l.$95 = s.$H.Wireframe;
            l.$r4 = 1
        } else {
            l.$95 = s.$H.Default;
            l.$r4 = 4
        }
        l.$s4 = 0;
        l.$q4 = l.$95.getLength();
        l.$A5 = C;
        var k = this.getMat4();
        if (this.$C2) {
            k.m03 += o.$i5.m03;
            k.m13 += o.$i5.m13;
            k.m23 += o.$i5.m23
        }
        l.$p5 = s.getMat4();
        l.$r5 = s.getNormalMat4();
        l.$n5 = k;
        l.$q5 = this.getNormalMat4();
        l.$t = this.$u;
        l.$61 = this.$71;
        l.$p1 = this.$q1;
        var y = (this.$51[e] ? this.$51[e] : this.$Z2);
        if (y.getAnim(0) || y.getAnim(1)) {
            var x = s.getSkin();
            if (y.getSkin() != x) {
                y.setSkin(x)
            }
            var f = y.getBoneFinalMat43Array();
            var w = f.length;
            if (w > 0) {
                var v = okA.array();
                v.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                for (var A = 0; A < w; ++A) {
                    var t = f[A];
                    v.push(t.m00, t.m01, t.m02, t.m03, t.m10, t.m11, t.m12, t.m13, t.m20, t.m21, t.m22, t.m23)
                }
                for (var A = w; A < this.$44; ++A) {
                    v.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
                l.$f = v;
                l.$26 = x.getVertexBoneIdxAttribName();
                l.$36 = x.getVertexBoneWeightAttribName()
            }
        }
        var c = new okAABBox();
        s.getBoundingBox().clone(c);
        c.transformMat(this.$n5);
        l.$S2 = c;
        l.$y2 = this.$y2;
        l.$B4 = this.$B4;
        D.push(l)
    }
};
okDynamicEntity.prototype.activateChannel = function (e, a, d) {
    if (d) {
        if (this.$51[d] == null) {
            this.$51[d] = this.$Z2.clone()
        }
        this.$51[d].activateChannel(e, a)
    } else {
        for (var c in this.$51) {
            this.$51[c].activateChannel(e, a)
        }
        this.$Z2.activateChannel(e, a)
    }
};
okDynamicEntity.prototype.isActive = function (c, a) {
    if (a) {
        if (this.$51[a] == null) {
            return this.$Z2.isActive(c)
        }
        return this.$51[a].isActive(c)
    } else {
        return this.$Z2.isActive(c)
    }
};
okDynamicEntity.prototype.setSpeed = function (e, a, d) {
    if (d) {
        if (this.$51[d] == null) {
            this.$51[d] = this.$Z2.clone()
        }
        this.$51[d].setSpeed(e, a)
    } else {
        for (var c in this.$51) {
            this.$51[c].setSpeed(e, a)
        }
        this.$Z2.setSpeed(e, a)
    }
};
okDynamicEntity.prototype.getSpeed = function (c, a) {
    if (a) {
        if (this.$51[a] == null) {
            return this.$Z2.getSpeed(c)
        }
        return this.$51[a].getSpeed(c)
    } else {
        return this.$Z2.getSpeed(c)
    }
};
okDynamicEntity.prototype.enableLoop = function (e, c, d) {
    if (d) {
        if (this.$51[d] == null) {
            this.$51[d] = this.$Z2.clone()
        }
        this.$51[d].enableLoop(e, c)
    } else {
        for (var a in this.$51) {
            this.$51[a].enableLoop(e, c)
        }
        this.$Z2.enableLoop(e, c)
    }
};
okDynamicEntity.prototype.isLoop = function (c, a) {
    if (a) {
        if (this.$51[a] == null) {
            return this.$Z2.isLoop(c)
        }
        return this.$51[a].isLoop(c)
    } else {
        return this.$Z2.isLoop(c)
    }
    return 0
};
okDynamicEntity.prototype.setBlendMode = function (d, c) {
    if (c) {
        if (this.$51[c] == null) {
            this.$51[c] = this.$Z2.clone()
        }
        this.$51[c].setBlendMode(d)
    } else {
        for (var a in this.$51) {
            this.$51[a].setBlendMode(d)
        }
        this.$Z2.setBlendMode(d)
    }
};
okDynamicEntity.prototype.getBlendMode = function (a) {
    if (a) {
        if (this.$51[a] == null) {
            return this.$Z2.getBlendMode()
        }
        return this.$51[a].getBlendMode()
    } else {
        return this.$Z2.getBlendMode()
    }
    return 0
};
okDynamicEntity.prototype.getFrameTime = function (c, a) {
    if (a) {
        if (this.$51[a] == null) {
            return this.$Z2.getFrameTime(c)
        }
        return this.$51[a].getFrameTime(c)
    } else {
        return this.$Z2.getFrameTime(c)
    }
    return 0
};
okDynamicEntity.prototype.setTime = function (e, a, d) {
    if (d) {
        if (this.$51[d] == null) {
            this.$51[d] = this.$Z2.clone()
        }
        this.$51[d].setTime(e, a)
    } else {
        for (var c in this.$51) {
            this.$51[c].setTime(e, a)
        }
        this.$Z2.setTime(e, a)
    }
};
okDynamicEntity.prototype.update = function (a, d) {
    if (this.$u2) {
        return
    }
    if (d) {
        if (this.$51[d] == null) {
            this.$51[d] = this.$Z2.clone()
        }
        this.$51[d].update(-1, a)
    } else {
        for (var c in this.$51) {
            this.$51[c].update(-1, a)
        }
        this.$Z2.update(-1, a)
    }
};
okDynamicEntity.prototype.pause = function (a) {
    this.$u2 = a
};
okDynamicEntity.prototype.isPause = function () {
    return this.$u2
};
okDynamicEntity.prototype.onMessage = function (a) {
    switch (a.sMsg) {
        case"RES_READY":
            if (this.$J4 == a.aArgs[0]) {
                this._postLoadModel(a.aArgs[0])
            } else {
                this._postLoadAnim(a.aArgs[0])
            }
            break
    }
};
okDynamicEntity.prototype._postLoadModel = function (d) {
    var a = this.$U5.getResource(this.$J4);
    var a = this.$U5.getResource(this.$J4);
    if (a) {
        for (var e in a.getMeshMap()) {
            var c = new okMaterial();
            c.$73 = this;
            a.getMesh(e).getMaterial().clone(c);
            this.$Z[e] = c
        }
    }
    this.$X1 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$e7.dirtyEntity(this);
    if (this.onLoad) {
        this.onLoad(this.getId(), d)
    }
    if (this.onload) {
        this.onload(this.getId(), d)
    }
};
okDynamicEntity.prototype._postLoadAnim = function (a) {
    this.$X1 = true;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$e7.dirtyEntity(this);
    if (this.onLoad) {
        this.onLoad(this.getId(), a)
    }
    if (this.onload) {
        this.onload(this.getId(), a)
    }
};
function okCustomMeshEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 64;
    this.$C5 = new okMesh(this.$U5.rc);
    this.$D5 = new okMaterial();
    this.$D5.$73 = this;
    this.$86 = "";
    this.$r4 = 0;
    this.$s4 = 0;
    this.$q4 = 0;
    this.$R2 = new okAABBox()
}
okExtend(okCustomMeshEntity, okVisibleEntity);
okCustomMeshEntity.prototype.clear = function () {
    this.$C5.clear();
    this.$D5.clear();
    this.$86 = "";
    this.$r4 = 0;
    this.$s4 = 0;
    this.$q4 = 0;
    this.$R2 = new okAABBox();
    okBaseCall(this, "clear")
};
okCustomMeshEntity.prototype.getMesh = function () {
    return this.$C5
};
okCustomMeshEntity.prototype.setVertexNum = function (a) {
    this.$C5.setVertexNum(a)
};
okCustomMeshEntity.prototype.getVertexNum = function () {
    return this.$C5.getVertexNum()
};
okCustomMeshEntity.prototype.createAttribute = function (d, a, c, e) {
    this.$C5.createAttribute(d, a, c, e)
};
okCustomMeshEntity.prototype.loadAttribute = function (e, c, a, d) {
    this.$C5.loadAttribute(e, c, a, d)
};
okCustomMeshEntity.prototype.deleteAttribute = function (a) {
    this.$C5.deleteAttribute(a)
};
okCustomMeshEntity.prototype.createIndex = function (c, a, e, f, d) {
    this.$C5.createIndex(c, a, e, f, d)
};
okCustomMeshEntity.prototype.loadIndex = function (e, c, a, d) {
    this.$C5.loadIndex(e, c, a, d)
};
okCustomMeshEntity.prototype.deleteIndex = function (a) {
    this.$C5.deleteIndex(a)
};
okCustomMeshEntity.prototype.setIndexTopology = function (a, c) {
    this.$C5.setIndexTopology(a, c)
};
okCustomMeshEntity.prototype.getIndexTopology = function (a) {
    return this.$C5.getIndexTopology(a)
}, okCustomMeshEntity.prototype.setActiveIndex = function (c, d, a, e) {
    this.$86 = ((c != null) ? c : "");
    this.$r4 = ((d != null) ? d : this.$C5.getIndexTopology());
    this.$s4 = ((a != null) ? a : 0);
    this.$q4 = ((e != null) ? e : 0)
};
okCustomMeshEntity.prototype.getAttributeNum = function () {
    return this.$C5.$U3
};
okCustomMeshEntity.prototype.getIndexNum = function () {
    return this.$C5.$z4
};
okCustomMeshEntity.prototype.getAttributeArray = function (a) {
    return this.$C5.$9[a]
};
okCustomMeshEntity.prototype.getAttributeArrayBuffer = function (a) {
    return this.$C5.$8[a]
};
okCustomMeshEntity.prototype.getIndexArray = function (a) {
    return this.$C5.$I[a]
};
okCustomMeshEntity.prototype.getIndexArrayBuffer = function (a) {
    return this.$C5.$H[a]
};
okCustomMeshEntity.prototype.getMaterial = function () {
    return this.$D5
};
okCustomMeshEntity.prototype.setBoundingBox = function (f, e, d) {
    if (f == 1) {
        this.$R2.set(e, d)
    } else {
        if (f == 3) {
            var c = this.$n5.inverse();
            var a = okMat43MulVec3(c, e);
            var h = okMat43MulVec3(c, d);
            this.$R2.set(a, h);
            okA._vec3(a);
            okA._vec3(h)
        }
    }
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$e7.dirtyEntity(this)
};
okCustomMeshEntity.prototype.computeBoundingBox = function () {
    okLog("[Error][" + this.__getTypeString() + ".computeBoundingBox][Id: " + this.getId() + "] This method has been deprecated cause it's unnecessary to compute bounding box manually in the latest version of Oak3D!")
};
okCustomMeshEntity.prototype.getBoundingBox = function (a) {
    this._upBBox();
    if (a == 2) {
        if (this.$t2) {
            this.$E5.setMin(this.$R2.vMin);
            this.$E5.setMax(this.$R2.vMax);
            this.$E5.setMat(this.$n5);
            this.$t2 = false
        }
        return this.$E5
    } else {
        if (this.$W1) {
            this.$R2.clone(this.$P2);
            this.$P2.transformMat(this.$n5);
            this.$W1 = false
        }
        return this.$P2
    }
};
okCustomMeshEntity.prototype.genRenderBatch = function (d, m) {
    var a = m.$U2;
    var c = this.$U5;
    if (this.$y3 > 0) {
        var k = a.getPos();
        var p = (k.x - this.$n5.m03) * (k.x - this.$n5.m03) + (k.y - this.$n5.m13) * (k.y - this.$n5.m13) + (k.z - this.$n5.m23) * (k.z - this.$n5.m23);
        if (p > this.$y3 * this.$y3) {
            return
        }
    }
    var e = this.$C5;
    var q = this.$D5;
    var n = okA.renderBatch();
    for (var h = 0; h < 7; ++h) {
        var s = q.getTextureResourceId(h);
        if (s == -1) {
            continue
        }
        var l = c.getResource(s);
        if (!l) {
            continue
        }
        if (l.isVideoTexture()) {
            l.updateVideoTexture()
        }
    }
    n.$a = e._getAttribFmt();
    if (this.$86 == "") {
        if (q.$O2 && e.$H.Wireframe) {
            n.$95 = e.$H.Wireframe;
            n.$r4 = 1
        } else {
            n.$95 = e.$H.Default;
            n.$r4 = 4
        }
        n.$s4 = 0;
        if (n.$95) {
            n.$q4 = n.$95.getLength()
        }
    } else {
        n.$95 = e.getIndexArrayBuffer(this.$86);
        n.$r4 = this.$r4;
        n.$s4 = this.$s4;
        n.$q4 = this.$q4
    }
    if (n.$95 == null) {
        okA._renderBatch(n);
        return
    }
    n.$A5 = q;
    var f = this.getMat4();
    if (this.$C2) {
        f.m03 += a.$i5.m03;
        f.m13 += a.$i5.m13;
        f.m23 += a.$i5.m23
    }
    n.$p5 = e.getMat4();
    n.$r5 = e.getNormalMat4();
    n.$n5 = f;
    n.$q5 = this.getNormalMat4();
    n.$t = this.$u;
    n.$61 = this.$71;
    n.$p1 = this.$q1;
    var o = new okAABBox();
    e.getBoundingBox().clone(o);
    o.transformMat(this.$n5);
    n.$S2 = o;
    n.$y2 = this.$y2;
    n.$B4 = this.$B4;
    d.push(n)
};
okCustomMeshEntity.prototype._upBBox = function () {
    var c = this.$R2;
    var a = this.$C5.getBoundingBox();
    if (c.vMin.x != a.vMin.x || c.vMin.y != a.vMin.y || c.vMin.z != a.vMin.z || c.vMax.x != a.vMax.x || c.vMax.y != a.vMax.y || c.vMax.z != a.vMax.z) {
        this.$C5.computeBoundingInfo();
        this.$C5.$P2.clone(this.$R2);
        this.$W1 = true;
        this.$t2 = true;
        this.$Y1 = true;
        this.$e7.dirtyEntity(this)
    }
};
function okParticle() {
    this.lf = 0;
    this.tlf = 0;
    this.m = new okMat43();
    this.v = new okVec3();
    this.ac = new okVec3();
    this.s = new okVec2(0.1, 0.1);
    this.s0 = new okVec2(0.1, 0.1);
    this.s1 = new okVec2(0.1, 0.1);
    this.c = new okVec3(1, 1, 1);
    this.c0 = new okVec3();
    this.c1 = new okVec3();
    this.a = 0;
    this.fdi = 0;
    this.fdo = 0
}
function okParticleEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 256;
    this.$C5 = new okMesh(this.$U5.rc);
    this.$E6 = "";
    var c = this.$C5.getMaterial();
    c.$73 = this;
    c.setEmissive(0, 0, 0);
    c.setDiffuse(1, 1, 1);
    c.enableBlend(true);
    c.enableDynamicLighting(false);
    c.enableTwoSide(true);
    c.enableDepthWrite(false);
    c.setDiffuseScript("VC");
    c.setAlphaScript("TC2.x * ALPHA");
    this.$21 = new okList();
    this.$F4 = -1;
    this.$U1 = true;
    this.$o2 = true;
    this.$Q = [3000, 3000];
    this.$c3 = 50;
    this.$t4 = 1;
    this.$d3 = 50;
    this.$w = [0, 30];
    this.$x = [new okVec3(0, 0, 0), new okVec3(0, 0, 0)];
    this.$y = [1, 1];
    this.$2 = [new okVec3(0, 0, 0), new okVec3(0, 0, 0)];
    this.$n1 = [new okVec2(0.5, 0.5), new okVec2(0.5, 0.5)];
    this.$o1 = [new okVec2(0.5, 0.5), new okVec2(0.5, 0.5)];
    this.$I2 = false;
    this.$q = [new okVec3(1, 1, 1), new okVec3(1, 1, 1)];
    this.$r = [new okVec3(1, 1, 1), new okVec3(1, 1, 1)];
    this.$H2 = false;
    this.$B = [1000, 1000];
    this.$C = [1000, 1000];
    this.$T3 = 1;
    this.$S3 = 1;
    this.$R3 = 1;
    this.$a = okA.object();
    this.$a.Position = new okAttribFormat();
    this.$a.Color = new okAttribFormat();
    this.$a.Texcoord1 = new okAttribFormat();
    this.$a.Texcoord2 = new okAttribFormat();
    this.$a.Position = new okAttribFormat();
    this.$a.Position.$e6 = "Position";
    this.$a.Position.iIdx = 0;
    this.$a.Position.iOffset = 0;
    this.$a.Position.$P4 = 3;
    this.$a.Position.iStride = 3;
    this.$a.Color = new okAttribFormat();
    this.$a.Color.$e6 = "Color";
    this.$a.Color.iIdx = 0;
    this.$a.Color.iOffset = 0;
    this.$a.Color.$P4 = 3;
    this.$a.Color.iStride = 7;
    this.$a.Texcoord1 = new okAttribFormat();
    this.$a.Texcoord1.$e6 = "Texcoord1";
    this.$a.Texcoord1.iIdx = 1;
    this.$a.Texcoord1.iOffset = 3;
    this.$a.Texcoord1.$P4 = 2;
    this.$a.Texcoord1.iStride = 7;
    this.$a.Texcoord2 = new okAttribFormat();
    this.$a.Texcoord2.$e6 = "Texcoord2";
    this.$a.Texcoord2.iIdx = 2;
    this.$a.Texcoord2.iOffset = 5;
    this.$a.Texcoord2.$P4 = 2;
    this.$a.Texcoord2.iStride = 7;
    this.$Q1 = true
}
okExtend(okParticleEntity, okVisibleEntity);
okParticleEntity.prototype.setTexture = function (e, a, f, h, c) {
    var d = this.$C5.getMaterial();
    d.setTextureName(0, e);
    d.setTextureCoord(0, "Texcoord1");
    if (e != "") {
        d.setDiffuseScript("VC * (ALBEDO1, TC1).rgb")
    } else {
        d.setDiffuseScript("VC")
    }
    if (e != "") {
        d.setAlphaScript("TC2.x * ALPHA * (ALBEDO1, TC1)." + (okIsString(a) ? a.toLowerCase() : "a"))
    } else {
        d.setAlphaScript("TC2.x * ALPHA")
    }
    this.$T3 = (f ? f : 1);
    this.$S3 = (h ? h : 1);
    this.$R3 = (c ? c : 1)
};
okParticleEntity.prototype.setParticleMaxNum = function (a) {
    if (a != this.$F4) {
        this.$F4 = Math.min(a, 16384);
        this.$U1 = (this.$F4 < 0);
        this.$o2 = true
    }
};
okParticleEntity.prototype._evalMaxNum = function () {
    if (this.$U1) {
        this.$F4 = Math.floor(this.$Q[1] / this.$c3 * this.$t4) + 1;
        this.$F4 = Math.min(this.$F4, 16384)
    }
    this.$C5.createAttribute("Position", this.$F4 * 4 * 3, null, 35048);
    this.$C5.createAttribute("Color/Texcoord1/Texcoord2", this.$F4 * 4 * 7, null, 35048);
    var a = okA.array();
    for (var c = 0; c < this.$F4; ++c) {
        a.push(c * 4, c * 4 + 1, c * 4 + 3, c * 4 + 3, c * 4 + 1, c * 4 + 2)
    }
    this.$C5.createIndex("Default", this.$F4 * 2 * 3, a, 35048, 4);
    okA._array(a)
};
okParticleEntity.prototype.getParticleMaxNum = function () {
    return this.$F4
};
okParticleEntity.prototype.setEmitDir = function (d, c, a) {
    this._rotToDir(2, d, c, a)
};
okParticleEntity.prototype.getEmitDir = function () {
    return this.$n5.getColumn(2)
};
okParticleEntity.prototype.setEmitDirRange = function (a, c) {
    this.$w[0] = a;
    this.$w[1] = ((c != null) ? c : a)
};
okParticleEntity.prototype.getEmitDirRangeMin = function () {
    return this.$w[0]
};
okParticleEntity.prototype.getEmitDirRangeMax = function () {
    return this.$w[1]
};
okParticleEntity.prototype.setEmitCycle = function (a) {
    this.$c3 = a;
    this.$d3 = a;
    if (this.$U1) {
        this.$o2 = true
    }
};
okParticleEntity.prototype.getEmitCycle = function () {
    return this.$c3
};
okParticleEntity.prototype.setEmitFlow = function (a) {
    this.$t4 = a;
    if (this.$U1) {
        this.$o2 = true
    }
};
okParticleEntity.prototype.getEmitFlow = function () {
    return this.$t4
};
okParticleEntity.prototype.setEmitPos = function (d, c, a) {
    this.setPos(d, c, a)
};
okParticleEntity.prototype.getEmitPos = function () {
    return this.$n5.getColumn(3)
};
okParticleEntity.prototype.setEmitPosRange = function (c, e, h, a, d, f) {
    if (f != null) {
        this.$x[0].x = c;
        this.$x[0].y = e;
        this.$x[0].z = h;
        this.$x[1].x = a;
        this.$x[1].y = d;
        this.$x[1].z = f
    } else {
        if (fZ != null) {
            this.$x[0].x = c;
            this.$x[0].y = e;
            this.$x[0].z = h;
            this.$x[1].x = c;
            this.$x[1].y = e;
            this.$x[1].z = h
        } else {
            if (fY != null) {
                this.$x[0].x = c.x;
                this.$x[0].y = c.y;
                this.$x[0].z = c.z;
                this.$x[1].x = e.x;
                this.$x[1].y = e.y;
                this.$x[1].z = e.z
            } else {
                this.$x[0].x = c.x;
                this.$x[0].y = c.y;
                this.$x[0].z = c.z;
                this.$x[1].x = c.x;
                this.$x[1].y = c.y;
                this.$x[1].z = c.z
            }
        }
    }
};
okParticleEntity.prototype.getEmitPosRangeMin = function () {
    return this.aEmitOffset[0].clone()
};
okParticleEntity.prototype.getEmitPosRangeMax = function () {
    return this.aEmitOffset[1].clone()
};
okParticleEntity.prototype.setEmitVelocity = function (a, c) {
    this.$y[0] = a;
    this.$y[1] = (c != null ? c : a)
};
okParticleEntity.prototype.getEmitVelocityMin = function () {
    return this.$y[0]
};
okParticleEntity.prototype.getEmitVelocityMax = function () {
    return this.$y[1]
};
okParticleEntity.prototype.setParticleLife = function (a, c) {
    this.$Q[0] = a;
    this.$Q[1] = ((c != null) ? c : a);
    if (this.$U1) {
        this.$o2 = true
    }
};
okParticleEntity.prototype.getParticleLifeMin = function () {
    return this.$Q[0]
};
okParticleEntity.prototype.getParticleLifeMax = function () {
    return this.$Q[1]
};
okParticleEntity.prototype.setParticleAcceleration = function (c, e, h, a, d, f) {
    if (f != null) {
        this.$2[0].x = c;
        this.$2[0].y = e;
        this.$2[0].z = h;
        this.$2[1].x = a;
        this.$2[1].y = d;
        this.$2[1].z = f
    } else {
        if (h != null) {
            this.$2[0].x = c;
            this.$2[0].y = e;
            this.$2[0].z = h;
            this.$2[1].x = c;
            this.$2[1].y = e;
            this.$2[1].z = h
        } else {
            if (e != null) {
                this.$2[0].x = c.x;
                this.$2[0].y = c.y;
                this.$2[0].z = c.z;
                this.$2[1].x = e.x;
                this.$2[1].y = e.y;
                this.$2[1].z = e.z
            } else {
                this.$2[0].x = c.x;
                this.$2[0].y = c.y;
                this.$2[0].z = c.z;
                this.$2[1].x = c.x;
                this.$2[1].y = c.y;
                this.$2[1].z = c.z
            }
        }
    }
};
okParticleEntity.prototype.getParticleAccelerationMin = function () {
    return this.$2[0].clone()
};
okParticleEntity.prototype.getParticleAccelerationMax = function () {
    return this.$2[1].clone()
};
okParticleEntity.prototype.setParticleSize = function (a, d, f, c, e) {
    if (a & 1) {
        if (e != null) {
            this.$n1[0].x = d;
            this.$n1[0].y = f;
            this.$n1[1].x = c;
            this.$n1[1].y = e
        } else {
            if (okIsNumber(f)) {
                this.$n1[0].x = d;
                this.$n1[0].y = f;
                this.$n1[1].x = d;
                this.$n1[1].y = f
            } else {
                if (f) {
                    this.$n1[0].x = d.x;
                    this.$n1[0].y = d.y;
                    this.$n1[1].x = f.x;
                    this.$n1[1].y = f.y
                } else {
                    this.$n1[0].x = d.x;
                    this.$n1[0].y = d.y;
                    this.$n1[1].x = d.x;
                    this.$n1[1].y = d.y
                }
            }
        }
    }
    if (a & 2) {
        if (e != null) {
            this.$o1[0].x = d;
            this.$o1[0].y = f;
            this.$o1[1].x = c;
            this.$o1[1].y = e
        } else {
            if (okIsNumber(f)) {
                this.$o1[0].x = d;
                this.$o1[0].y = f;
                this.$o1[1].x = d;
                this.$o1[1].y = f
            } else {
                if (f) {
                    this.$o1[0].x = d.x;
                    this.$o1[0].y = d.y;
                    this.$o1[1].x = f.x;
                    this.$o1[1].y = f.y
                } else {
                    this.$o1[0].x = d.x;
                    this.$o1[0].y = d.y;
                    this.$o1[1].x = d.x;
                    this.$o1[1].y = d.y
                }
            }
        }
    }
};
okParticleEntity.prototype.getParticleSizeMin = function (a) {
    if (a == 1) {
        return this.$n1[0].clone()
    } else {
        return this.$o1[0].clone()
    }
};
okParticleEntity.prototype.getParticleSizeMax = function (a) {
    if (a == OAK.PTIME_BEGIN) {
        return this.$n1[1].clone()
    } else {
        return this.$o1[1].clone()
    }
};
okParticleEntity.prototype.enableVarySize = function (a) {
    this.$I2 = a
};
okParticleEntity.prototype.isVarySize = function () {
    return this.$I2
};
okParticleEntity.prototype.setParticleColor = function (a, h, f, k, d, c, e) {
    if (a & 1) {
        if (e != null) {
            this.$q[0].x = h;
            this.$q[0].y = f;
            this.$q[0].z = k;
            this.$q[1].x = d;
            this.$q[1].y = c;
            this.$q[1].z = e
        } else {
            if (k != null) {
                this.$q[0].x = h;
                this.$q[0].y = f;
                this.$q[0].z = k;
                this.$q[1].x = h;
                this.$q[1].y = f;
                this.$q[1].z = k
            } else {
                if (f != null) {
                    this.$q[0].x = h.x;
                    this.$q[0].y = h.y;
                    this.$q[0].z = h.z;
                    this.$q[1].x = f.x;
                    this.$q[1].y = f.y;
                    this.$q[1].z = f.z
                } else {
                    this.$q[0].x = h.x;
                    this.$q[0].y = h.y;
                    this.$q[0].z = h.z;
                    this.$q[1].x = h.x;
                    this.$q[1].y = h.y;
                    this.$q[1].z = h.z
                }
            }
        }
    }
    if (a & 2) {
        if (e != null) {
            this.$r[0].x = h;
            this.$r[0].y = f;
            this.$r[0].z = k;
            this.$r[1].x = d;
            this.$r[1].y = c;
            this.$r[1].z = e
        } else {
            if (k != null) {
                this.$r[0].x = h;
                this.$r[0].y = f;
                this.$r[0].z = k;
                this.$r[1].x = h;
                this.$r[1].y = f;
                this.$r[1].z = k
            } else {
                if (f != null) {
                    this.$r[0].x = h.x;
                    this.$r[0].y = h.y;
                    this.$r[0].z = h.z;
                    this.$r[1].x = f.x;
                    this.$r[1].y = f.y;
                    this.$r[1].z = f.z
                } else {
                    this.$r[0].x = h.x;
                    this.$r[0].y = h.y;
                    this.$r[0].z = h.z;
                    this.$r[1].x = h.x;
                    this.$r[1].y = h.y;
                    this.$r[1].z = h.z
                }
            }
        }
    }
};
okParticleEntity.prototype.getParticleColorMin = function (a) {
    if (a == 1) {
        return this.$q[0].clone()
    } else {
        return this.$r[0].clone()
    }
};
okParticleEntity.prototype.getParticleColorMax = function (a) {
    if (a == 1) {
        return this.$q[1].clone()
    } else {
        return this.$r[1].clone()
    }
};
okParticleEntity.prototype.enableVaryColor = function (a) {
    this.$H2 = a
};
okParticleEntity.prototype.isVaryColor = function () {
    return this.$H2
};
okParticleEntity.prototype.setParticleFadeInTime = function (a, c) {
    this.$B[0] = a;
    this.$B[1] = ((c != null) ? c : a)
};
okParticleEntity.prototype.getParticleFadeInTimeMin = function () {
    return this.$B[0]
};
okParticleEntity.prototype.getParticleFadeInTimeMax = function () {
    return this.$B[1]
};
okParticleEntity.prototype.setParticleFadeOutTime = function (a, c) {
    this.$C[0] = a;
    this.$C[1] = ((c != null) ? c : a)
};
okParticleEntity.prototype.getParticleFadeOutTimeMin = function () {
    return this.$C[0]
};
okParticleEntity.prototype.getParticleFadeOutTimeMax = function () {
    return this.$C[1]
};
okParticleEntity.prototype.getMaterial = function () {
    return this.$C5.getMaterial()
};
okParticleEntity.prototype.getBoundingBox = function (a) {
    if (a == 2) {
        if (this.$t2) {
            this.$t2 = false
        }
        return this.$E5
    } else {
        if (this.$W1) {
            this.$W1 = false
        }
        return this.$P2
    }
};
okParticleEntity.prototype.update = function (n) {
    if (!this.$Q1) {
        return
    }
    if (this.$o2) {
        this._evalMaxNum();
        this.$o2 = false
    }
    var e = okA.array();
    var a = this.getNormalMat43();
    var q = this.$n5.getColumn(3);
    var u = this.$n5.getColumn(3);
    var v = this.$21.getRoot();
    while (v) {
        var s = v.data;
        s.lf += n;
        if (s.lf > s.tlf) {
            var x = v.next;
            okA._particle(s);
            this.$21.remove(v);
            v = x;
            continue
        }
        s.m.m03 += s.v.x * n / 1000;
        s.m.m13 += s.v.y * n / 1000;
        s.m.m23 += s.v.z * n / 1000;
        s.v.x += s.ac.x * n / 1000;
        s.v.y += s.ac.y * n / 1000;
        s.v.z += s.ac.z * n / 1000;
        var o = s.lf / s.tlf;
        if (this.$I2) {
            s.s.x = (1 - o) * s.s0.x + o * s.s1.x;
            s.s.y = (1 - o) * s.s0.y + o * s.s1.y
        }
        if (this.$H2) {
            s.c.x = (1 - o) * s.c0.x + o * s.c1.x;
            s.c.y = (1 - o) * s.c0.y + o * s.c1.y;
            s.c.z = (1 - o) * s.c0.z + o * s.c1.z
        }
        if (s.lf <= s.fdi) {
            s.a = s.lf / s.fdi
        } else {
            if (s.lf >= s.tlf - s.fdo) {
                s.a = (s.tlf - s.lf) / s.fdo
            } else {
                s.a = 1
            }
        }
        q.x = (q.x < s.m.m03 ? q.x : s.m.m03);
        q.y = (q.y < s.m.m13 ? q.y : s.m.m13);
        q.z = (q.z < s.m.m23 ? q.z : s.m.m23);
        u.x = (u.x > s.m.m03 ? u.x : s.m.m03);
        u.y = (u.y > s.m.m13 ? u.y : s.m.m13);
        u.z = (u.z > s.m.m23 ? u.z : s.m.m23);
        var k = Math.floor(s.lf / s.tlf * this.$R3);
        var h = Math.floor(k / this.$T3);
        var l = k - h * this.$T3;
        var c = l / this.$T3, f = (l + 1) / this.$T3;
        var z = h / this.$S3, m = (h + 1) / this.$S3;
        e.push(s.c.x, s.c.y, s.c.z, c, z, s.a, 0, s.c.x, s.c.y, s.c.z, c, m, s.a, 0, s.c.x, s.c.y, s.c.z, f, m, s.a, 0, s.c.x, s.c.y, s.c.z, f, z, s.a, 0);
        v = v.next
    }
    this.$d3 += n;
    if (this.$d3 >= this.$c3) {
        this.$d3 -= this.$c3;
        var d = this.$t4;
        while (d > 0 && this.$21.getSize() < this.$F4) {
            d -= 1;
            var s = okA.particle();
            this.$21.pushBack(s);
            var A = Math.random();
            s.tlf = (1 - A) * this.$Q[0] + A * this.$Q[1];
            s.lf = 0;
            this.$n5.clone(s.m);
            A = Math.random();
            s.m.m03 += (1 - A) * this.$x[0].x + A * this.$x[1].x;
            A = Math.random();
            s.m.m13 += (1 - A) * this.$x[0].y + A * this.$x[1].y;
            A = Math.random();
            s.m.m23 += (1 - A) * this.$x[0].z + A * this.$x[1].z;
            A = Math.random();
            var w = new okVec3(0, 1, 0);
            w.rotZ((1 - A) * this.$w[0] + A * this.$w[1], true);
            w.rotY(Math.random() * 360, true);
            w = okMat43MulVec3(a, w);
            A = Math.random();
            var y = (1 - A) * this.$y[0] + A * this.$y[1];
            s.v.x = w.x * y;
            s.v.y = w.y * y;
            s.v.z = w.z * y;
            A = Math.random();
            s.ac.x = (1 - A) * this.$2[0].x + A * this.$2[1].x;
            s.ac.y = (1 - A) * this.$2[0].y + A * this.$2[1].y;
            s.ac.z = (1 - A) * this.$2[0].z + A * this.$2[1].z;
            A = Math.random();
            s.s0.x = (1 - A) * this.$n1[0].x + A * this.$n1[1].x;
            A = Math.random();
            s.s0.y = (1 - A) * this.$n1[0].y + A * this.$n1[1].y;
            A = Math.random();
            s.s1.x = (1 - A) * this.$o1[0].x + A * this.$o1[1].x;
            A = Math.random();
            s.s1.y = (1 - A) * this.$o1[0].x + A * this.$o1[1].x;
            s.s.x = s.s0.x;
            s.s.y = s.s0.y;
            A = Math.random();
            s.c0.x = (1 - A) * this.$q[0].x + A * this.$q[1].x;
            A = Math.random();
            s.c0.y = (1 - A) * this.$q[0].y + A * this.$q[1].y;
            A = Math.random();
            s.c0.z = (1 - A) * this.$q[0].z + A * this.$q[1].z;
            A = Math.random();
            s.c1.x = (1 - A) * this.$r[0].x + A * this.$r[1].x;
            A = Math.random();
            s.c1.y = (1 - A) * this.$r[0].y + A * this.$r[1].y;
            A = Math.random();
            s.c1.z = (1 - A) * this.$r[0].z + A * this.$r[1].z;
            s.c.x = s.c0.x;
            s.c.y = s.c0.y;
            s.c.z = s.c0.z;
            A = Math.random();
            s.fdi = (1 - A) * this.$B[0] + A * this.$B[1];
            A = Math.random();
            s.fdo = (1 - A) * this.$C[0] + A * this.$C[1];
            s.a = 0;
            q.x = (q.x < s.m.m03 ? q.x : s.m.m03);
            q.y = (q.y < s.m.m13 ? q.y : s.m.m13);
            q.z = (q.z < s.m.m23 ? q.z : s.m.m23);
            u.x = (u.x > s.m.m03 ? u.x : s.m.m03);
            u.y = (u.y > s.m.m13 ? u.y : s.m.m13);
            u.z = (u.z > s.m.m23 ? u.z : s.m.m23);
            var k = Math.floor(s.lf / s.tlf * this.$R3);
            var h = Math.floor(k / this.$T3);
            var l = k - h * this.$T3;
            var c = l / this.$T3, f = (l + 1) / this.$T3;
            var z = h / this.$S3, m = (h + 1) / this.$S3;
            e.push(s.c.x, s.c.y, s.c.z, c, z, s.a, 0, s.c.x, s.c.y, s.c.z, c, m, s.a, 0, s.c.x, s.c.y, s.c.z, f, m, s.a, 0, s.c.x, s.c.y, s.c.z, f, z, s.a, 0)
        }
    }
    this.$C5.loadAttribute("Color/Texcoord1/Texcoord2", 0, this.$21.getSize() * 4 * 7, e);
    this.$P2.set(q, u);
    this.$E5.setMin(q);
    this.$E5.setMax(u);
    this.$07.x = (q.x + u.x) * 0.5;
    this.$07.y = (q.y + u.y) * 0.5;
    this.$07.z = (q.z + u.z) * 0.5;
    this.$b3 = Math.sqrt((u.x - q.x) * (u.x - q.x) + (u.y - q.y) * (u.y - q.y) + (u.z - q.z) * (u.z - q.z)) * 0.5;
    this.$W1 = false;
    this.$t2 = false;
    this.$Y1 = false;
    okA._array(e);
    okA._vec3(q);
    okA._vec3(u)
};
okParticleEntity.prototype.genRenderBatch = function (A, a) {
    if (this.iCount == 0 || !this.$Q1) {
        return
    }
    if (this.$o2) {
        this._evalMaxNum();
        this.$o2 = false
    }
    var v = this.$U5;
    var x = a.$U2;
    var s = this.$C5;
    var z = this.$C5.getMaterial();
    var h = okA.renderBatch();
    for (var w = 0; w < 7; ++w) {
        var y = z.getTextureResourceId(w);
        if (y == -1) {
            continue
        }
        var n = v.getResource(y);
        if (!n) {
            continue
        }
        if (n.isVideoTexture()) {
            n.updateVideoTexture()
        }
    }
    var f = x.getRightDir();
    var e = x.getUpDir();
    var m = okA.vec3();
    var k = okA.vec3();
    var l = okA.array();
    var u = this.$21.getRoot();
    while (u) {
        var t = u.data;
        var d = t.s.x * 0.5, q = t.s.y * 0.5;
        m.x = f.x * d;
        m.y = f.y * d;
        m.z = f.z * d;
        k.x = e.x * q;
        k.y = e.y * q;
        k.z = e.z * q;
        l.push(t.m.m03 - m.x + k.x, t.m.m13 - m.y + k.y, t.m.m23 - m.z + k.z, t.m.m03 - m.x - k.x, t.m.m13 - m.y - k.y, t.m.m23 - m.z - k.z, t.m.m03 + m.x - k.x, t.m.m13 + m.y - k.y, t.m.m23 + m.z - k.z, t.m.m03 + m.x + k.x, t.m.m13 + m.y + k.y, t.m.m23 + m.z + k.z);
        u = u.next
    }
    this.$C5.loadAttribute("Position", 0, this.$21.getSize() * 4 * 3, l);
    okA._vec3(f);
    okA._vec3(e);
    okA._vec3(m);
    okA._vec3(k);
    okA._array(l);
    h.$a = okA.object();
    var o = this.$C5.$8;
    this.$a.Position.buf = o.Position;
    this.$a.Color.buf = o["Color/Texcoord1/Texcoord2"];
    this.$a.Texcoord1.buf = o["Color/Texcoord1/Texcoord2"];
    this.$a.Texcoord2.buf = o["Color/Texcoord1/Texcoord2"];
    h.$a.Position = this.$a.Position;
    h.$a.Color = this.$a.Color;
    h.$a.Texcoord1 = this.$a.Texcoord1;
    h.$a.Texcoord2 = this.$a.Texcoord2;
    h.$95 = s.$H.Default;
    h.$r4 = 4;
    h.$s4 = 0;
    h.$q4 = this.$21.getSize() * 6;
    h.$A5 = z;
    var c = okA.mat4();
    if (this.$C2) {
        c.m03 += cam.$i5.m03;
        c.m13 += cam.$i5.m13;
        c.m23 += cam.$i5.m23
    }
    h.$p5 = s.getMat4();
    h.$r5 = s.getNormalMat4();
    h.$n5 = c;
    h.$q5 = okA.mat4();
    h.$t = this.$u;
    h.$61 = this.$71;
    h.$p1 = this.$q1;
    h.$S2 = this.$P2;
    h.$y2 = false;
    h.$B4 = this.$B4;
    A.push(h)
};
okParticleEntity.prototype.activate = function (a) {
    this.$Q1 = a;
    if (this.$Q1 = false) {
        var c = this.$21.getRoot();
        while (c) {
            var d = c.data;
            okA._particle(d);
            c = c.next
        }
        this.$21.clear();
        this.$d3 = this.$c3
    }
};
okParticleEntity.prototype.isActive = function () {
    return this.$Q1
};
function okTerrainMesh(a) {
    this.rc = a;
    this.$z5 = new okMaterial(a);
    this.$G5;
    this.$l = new Array;
    this.$h5 = new okArray2D;
    this.$e6;
    this.$P2 = new okAABBox();
    this.$9 = new Object;
    this.$8 = new Object;
    this.$U3 = 0;
    this.$I = new Object;
    this.$H = new Object;
    this.$z4 = 0;
    this.$g4;
    this.$f4;
    this.$X4;
    this.$W4;
    this.$Q3 = new okVec2;
    this.$P3 = new okVec2;
    this.$h4;
    this.$G4;
    this.$X6 = false;
    this.$T2 = false;
    this.$b5 = false;
    this.$V5 = false
}
okTerrainMesh.prototype = {clear:function () {
    for (var e in this.$9) {
        if (sAttribName == null || e == sAttribName) {
            delete this.$9[e];
            this.$8[e].releaseBuffer();
            delete this.$8[e];
            this.$U3 -= 1
        }
    }
    for (var d in this.$I) {
        if (sIndexName == null || d == sIndexName) {
            delete this.$I[d];
            this.$H[d].releaseBuffer();
            delete this.$H[d];
            this.$z4 -= 1
        }
    }
    for (var a = 0; a < this.$l.length; ++a) {
        var c = this.$l[a];
        c.clear()
    }
    this.$z5.clear()
}, setBoundingBox:function (c, a) {
    var e = new okVec3(c.x, c.y, c.z);
    var d = new okVec3(a.x, a.y, a.z);
    if (d == null) {
        e.clone(this.$P2)
    } else {
        this.$P2.set(e, d)
    }
}, getBoundingBox:function () {
    return this.$P2
}, setParentTerrain:function (a) {
    this.$G5 = a;
    if (this.$z5) {
        this.$z5.$73 = a
    }
}, getParentTerrain:function () {
    return this.$G5
}, getMaterial:function () {
    return this.$z5
}, setGlobalIndex:function (c, a) {
    this.$P3.set(c, a)
}, getGlobalIndex:function () {
    return this.$P3
}, setChunkSize:function (a, c) {
    this.$g4 = a;
    this.$f4 = c;
    this.computeMaxLOD()
}, getChunkWidth:function () {
    return this.$g4
}, getChunkHeight:function () {
    return this.$f4
}, setTerrainSize:function (a, c) {
    this.$X4 = a;
    this.$W4 = c
}, setGridSpace:function (a) {
    this.$Q3 = a
}, setName:function (a) {
    this.$e6 = a
}, getName:function () {
    return this.$e6
}, detectCollision:function (n) {
    var A = this.$g4;
    var p = this.$f4;
    var e = this.$P2.vMax.x - this.$P2.vMin.x;
    var B = this.$P2.vMax.y - this.$P2.vMin.y;
    var t = e / (A - 1);
    var q = B / (p - 1);
    var o = (n.x - this.$P2.vMin.x) / t;
    var k = (n.y - this.$P2.vMin.y) / q;
    i = Math.floor(o);
    j = Math.floor(k);
    if (i == o && j == k) {
        var f = this.$9.Position;
        if (!f) {
            return
        }
        var v = f[(i + j * A) * 3 + 2];
        return v
    }
    var l = new okVec2(n.x, n.y);
    var y = i + j * A;
    var x = (i + 1) + (j + 1) * A;
    var u = i + (j + 1) * A;
    var s = (i + 1) + j * A;
    if ((i + j) % 2 == 0) {
        if (this._insideTriangle(x, u, y, l)) {
            return this._intersectedPoint(x, u, y, l)
        } else {
            if (this._insideTriangle(y, s, x, l)) {
                return this._intersectedPoint(y, s, x, l)
            }
        }
    } else {
        if (this._insideTriangle(s, y, u, l)) {
            return this._intersectedPoint(s, y, u, l)
        } else {
            if (this._insideTriangle(u, x, s, l)) {
                return this._intersectedPoint(u, x, s, l)
            }
        }
    }
}, _insideTriangle:function (s, p, o, l) {
    var f = this.$9.Position;
    if (!f) {
        return
    }
    var d = new okVec2(f[s * 3 + 0], f[s * 3 + 1]);
    var t = new okVec2(f[p * 3 + 0], f[p * 3 + 1]);
    var n = new okVec2(f[o * 3 + 0], f[o * 3 + 1]);
    var v = okVec2Sub(l, d);
    var u = okVec2Sub(l, t);
    var q = okVec2Sub(l, n);
    var k = okVec2Cross(v, u);
    var h = okVec2Cross(u, q);
    var e = okVec2Cross(q, v);
    if (k >= 0 && h >= 0 && e >= 0) {
        return true
    }
    if (k <= 0 && h <= 0 && e <= 0) {
        return true
    }
    return false
}, _intersectedPoint:function (v, s, o, f) {
    var e = this.$9.Position;
    if (!e) {
        return
    }
    var w = f.x;
    var q = f.y;
    var d = new okVec3(e[v * 3 + 0], e[v * 3 + 1], e[v * 3 + 2]);
    var u = new okVec3(e[s * 3 + 0], e[s * 3 + 1], e[s * 3 + 2]);
    var l = new okVec3(e[o * 3 + 0], e[o * 3 + 1], e[o * 3 + 2]);
    var k = d.z - (d.z - u.z) * (d.x - w) / (d.x - u.x);
    var t = d.y - (d.y - u.y) * (d.x - w) / (d.x - u.x);
    var h = d.z - (d.z - l.z) * (d.x - w) / (d.x - l.x);
    var p = d.y - (d.y - l.y) * (d.x - w) / (d.x - l.x);
    var n = k - (k - h) * (t - q) / (t - p);
    return n
}, createAttribute:function (h, a, f, k) {
    if (!this.$9[h]) {
        this.$9[h] = new Array
    }
    for (var d = 0; d < f.length; ++d) {
        this.$9[h].push(f[d])
    }
    var e = this.$9[h];
    var c = new okArrayBuffer(this.rc);
    c.createBuffer(34962, 5126, (k != null) ? k : 35044, new Float32Array(e));
    if (this.$8[h]) {
        this.$8[h].releaseBuffer()
    }
    this.$8[h] = c
}, createAttributeData:function (d, a) {
    this.releaseAttributeArrayBuffer(d);
    if (!this.$9[d]) {
        this.$9[d] = new Array
    }
    for (var c = 0; c < a.length; ++c) {
        this.$9[d].push(a[c])
    }
}, releaseAttributeData:function (c) {
    this.releaseAttributeArrayBuffer(c);
    for (var d in this.$9) {
        if (c == null || d == c) {
            var a = this.$9[d];
            delete a;
            a = []
        }
    }
}, createAttributeArrayBuffer:function (d, e) {
    for (var f in this.$9) {
        if (d == null || f == d) {
            var c = this.$9[f];
            var a = new okArrayBuffer(this.rc);
            a.createBuffer(34962, 5126, (e != null) ? e : 35044, new Float32Array(c));
            if (this.$8[f]) {
                this.$8[f].releaseBuffer()
            }
            this.$8[f] = a
        }
    }
}, releaseAttributeArrayBuffer:function (a) {
    for (var c in this.$8) {
        if (a == null || c == a) {
            this.$8[c].releaseBuffer();
            delete this.$8[c]
        }
    }
}, createIndexData:function (d, a) {
    this.releaseIndexArrayBuffer(d);
    if (!this.$I[d]) {
        this.$I[d] = new Array
    }
    for (var c = 0; c < a.length; ++c) {
        this.$I[d].push(a[c])
    }
}, releaseIndexData:function (a) {
    this.releaseIndexArrayBuffer(a);
    for (var d in this.$I) {
        if (a == null || d == a) {
            var c = this.$I[curAttribName];
            delete c;
            c = []
        }
    }
}, createIndexArrayBuffer:function (d) {
    for (var e in this.$I) {
        if (d == null || e == d) {
            var c = this.$I[e];
            var a = new okArrayBuffer(this.rc);
            a.createBuffer(34963, 5123, 35044, new Uint16Array(c));
            if (this.$H[e]) {
                this.$H[e].releaseBuffer()
            }
            this.$H[e] = a
        }
    }
}, releaseIndexArrayBuffer:function (a) {
    for (var c in this.$H) {
        if (a == null || c == a) {
            this.$H[c].releaseBuffer();
            delete this.$H[c]
        }
    }
}, distributeAttribute:function (l, o) {
    var n = new Array(this.$g4 * this.$f4);
    var m = this.$P3.x;
    var e = this.$P3.y;
    var k = m * (this.$g4 - 1);
    var f = e * (this.$f4 - 1);
    for (var c = 0; c < this.$g4; ++c) {
        for (var a = 0; a < this.$f4; ++a) {
            var q = k + c;
            var p = f + a;
            var h = p * this.$X4 + q;
            var d = a * this.$g4 + c;
            if (l == "Normal") {
                n[d * 3 + 0] = o[h * 3 + 0];
                n[d * 3 + 1] = o[h * 3 + 1];
                n[d * 3 + 2] = o[h * 3 + 2]
            } else {
                if (l == "Texcoord1") {
                    n[d * 3 + 0] = o[h * 3 + 0];
                    n[d * 3 + 1] = o[h * 3 + 1]
                }
            }
        }
    }
    this.createAttribute(l, n.length, n)
}, clearFillCrashFlag:function () {
    this.$X6 = false;
    this.$T2 = false;
    this.$b5 = false;
    this.$V5 = false
}, computeMaxLOD:function () {
    var c = this.$g4 - 1;
    var d = 1;
    for (var a = 0; ; ++a) {
        d = d * 2;
        if (d >= c) {
            this.$G4 = a + 1;
            return
        }
    }
}, cullByFrustum:function (f, e, c, h) {
    if (c.collideAABBox(this.getBoundingBox()) == 0) {
        return
    }
    this.computeLOD(h);
    var d = this.$P3.x;
    var a = this.$P3.y;
    f.addElement(d, a, this)
}, getCurrentLOD:function () {
    return this.$h4
}, setCurrentLOD:function (a) {
    this.$h4 = a
}, computeLOD:function (d) {
    var e = this.getBoundingBox();
    var m = 80;
    var a = new okVec3((e.vMin.x + e.vMax.x) / 2, (e.vMin.y + e.vMax.y) / 2, e.vMax.z);
    var l = okVec3Len(a, d);
    var k = Math.abs(e.vMax.x - e.vMin.x);
    var h = k * 2;
    for (var f = 0; f <= this.$G4; ++f) {
        h = h / 2;
        if (l >= m * h) {
            return
        }
        this.$h4 = f
    }
}, computePosInIndexArray:function () {
    var c = this.$P3.x;
    var a = this.$P3.y;
    if (this.$h4 == 0) {
        if ((c + a) % 2 == 0) {
            return 0
        } else {
            return 1
        }
    } else {
        return(this.$h4 << 4) + (8 * this.$T2 + 4 * this.$V5 + 2 * this.$X6 + 1 * this.$b5)
    }
}, computeNormal:function () {
    var C = this.$9.Position;
    if (!C) {
        return
    }
    var B = this.$g4;
    var I = this.$f4;
    var A;
    var v;
    var u;
    var F;
    var E = new Array(B * I);
    for (var H = 0; H < B; ++H) {
        for (var G = 0; G < I; ++G) {
            if (H == 0 || H == B - 1 || G == 0 || G == I - 1) {
                A = 0;
                v = 0;
                u = 1;
                F = H + G * B
            } else {
                var k = (H - 1) + (G - 1) * B;
                var e = H + (G - 1) * B;
                var d = (H + 1) + (G - 1) * B;
                var c = (H - 1) + G * B;
                F = H + G * B;
                var a = (H + 1) + G * B;
                var L = (H - 1) + (G + 1) * B;
                var K = H + (G + 1) * B;
                var J = (H + 1) + (G + 1) * B;
                var t = C[k * 3 + 2];
                var s = C[e * 3 + 2];
                var q = C[d * 3 + 2];
                var o = C[c * 3 + 2];
                var D = C[F * 3 + 2];
                var n = C[a * 3 + 2];
                var m = C[L * 3 + 2];
                var l = C[K * 3 + 2];
                var f = C[J * 3 + 2];
                A = (t * 1 + o * 2 + m * 1 + q * (-1) + n * (-2) + f * (-1)) / 8 / 2;
                v = (t * 1 + s * 2 + q * 1 + m * (-1) + l * (-2) + f * (-1)) / 8 / 2;
                u = 1
            }
            E[F * 3 + 0] = A;
            E[F * 3 + 1] = v;
            E[F * 3 + 2] = u
        }
    }
    this._normalizeNormals();
    this.createAttributeData("Normal", E)
}, computeNormalOfTriangle:function (n, m, l) {
    var k = this.$g4 * this.$f4;
    if (n < 0 || n >= k || m < 0 || m >= k || l < 0 || l >= k) {
        return okVec3(0, 0, 0)
    }
    var e = this.$9["Position/Normal"];
    if (!e) {
        return okVec3(0, 0, 0)
    }
    var d = new okVec3(e[n * 6], e[n * 6 + 1], e[n * 6 + 2]);
    var o = new okVec3(e[m * 6], e[m * 6 + 1], e[m * 6 + 2]);
    var h = new okVec3(e[l * 6], e[l * 6 + 1], e[l * 6 + 2]);
    var p = okVec3Sub(d, o);
    var f = okVec3Sub(h, o);
    return okVec3Cross(f, p)
}, _normalizeNormals:function (a) {
    if (!a) {
        return
    }
    var e = this.$g4 * this.$f4;
    for (var d = 0; d < e; ++d) {
        var c = new okVec3(a[d * 3 + 0], a[d * 3 + 1], a[d * 3 + 2]);
        c = c.normalize();
        a[d * 3 + 0] = c.x;
        a[d * 3 + 1] = c.y;
        a[d * 3 + 2] = c.z
    }
}, fixNormal:function (f, h) {
    var c = h.x;
    var k = h.y;
    var e = f.getElement(c, k - 1);
    this.fixTopNormal(e);
    var a = f.getElement(c - 1, k);
    this.fixLeftNormal(a);
    var d = f.getElement(c - 1, k - 1);
    this.fixTopLeftNormal(e, a, d)
}, fixTopNormal:function (k) {
    if (!k) {
        return
    }
    var m = this.$9.Position;
    if (!m) {
        return
    }
    var l = k.$9.Position;
    if (!l) {
        return
    }
    var d = this.$9.Normal;
    if (!d) {
        return
    }
    var c = k.$9.Normal;
    if (!c) {
        return
    }
    var H = k.$g4 * (k.$g4 - 2);
    var V = k.$g4 * (k.$g4 - 1);
    for (var O = 1; O < this.$g4 - 1; ++O) {
        var U = H + (O - 1);
        var T = H + O;
        var S = H + (O + 1);
        var e = V + (O - 1);
        var f = V + O;
        var K = V + (O + 1);
        var R = O - 1;
        var I = O;
        var Q = O + 1;
        var N = this.$g4 + (O - 1);
        var M = this.$g4 + O;
        var L = this.$g4 + (O + 1);
        var B = l[U * 3 + 2];
        var A = l[T * 3 + 2];
        var w = l[S * 3 + 2];
        var a = l[e * 3 + 2];
        var J = l[f * 3 + 2];
        var G = l[K * 3 + 2];
        var u = m[R * 3 + 2];
        var P = m[I * 3 + 2];
        var t = m[Q * 3 + 2];
        var q = m[N * 3 + 2];
        var o = m[M * 3 + 2];
        var n = m[L * 3 + 2];
        var E = (B * 1 + u * 2 + q * 1 + w * (-1) + t * (-2) + n * (-1)) / 8 / 2;
        var D = (B * 1 + A * 2 + w * 1 + q * (-1) + o * (-2) + n * (-1)) / 8 / 2;
        var C = 1;
        var F = new okVec3(E, D, C);
        F = F.normalize();
        d[I * 3 + 0] = c[f * 3 + 0] = F.x;
        d[I * 3 + 1] = c[f * 3 + 1] = F.y;
        d[I * 3 + 2] = c[f * 3 + 2] = F.z
    }
}, fixLeftNormal:function (H) {
    if (!H) {
        return
    }
    var O = this.$9.Position;
    if (!O) {
        return
    }
    var N = H.$9.Position;
    if (!N) {
        return
    }
    var c = this.$9.Normal;
    if (!c) {
        return
    }
    var U = H.$9.Normal;
    if (!U) {
        return
    }
    var F = this.$g4;
    for (var L = 1; L < this.$f4 - 1; ++L) {
        var k = L * F - 2;
        var f = L * F - 1;
        var l = (L - 1) * F;
        var e = (L - 1) * F + 1;
        var d = (L + 1) * F - 2;
        var I = (L + 1) * F - 1;
        var J = L * F;
        var a = L * F + 1;
        var T = (L + 2) * F - 2;
        var S = (L + 2) * F - 1;
        var P = (L + 1) * F;
        var R = (L + 1) * F + 1;
        var A = N[k * 3 + 2];
        var u = N[f * 3 + 2];
        var K = O[l * 3 + 2];
        var t = O[e * 3 + 2];
        var s = N[d * 3 + 2];
        var M = N[I * 3 + 2];
        var Q = O[J * 3 + 2];
        var q = O[a * 3 + 2];
        var o = N[T * 3 + 2];
        var n = N[S * 3 + 2];
        var E = O[P * 3 + 2];
        var m = O[R * 3 + 2];
        var D = (A * 1 + s * 2 + o * 1 + t * (-1) + q * (-2) + m * (-1)) / 8 / 2;
        var C = (A * 1 + u * 2 + t * 1 + o * (-1) + n * (-2) + m * (-1)) / 8 / 2;
        var B = 1;
        var G = new okVec3(D, C, B);
        G = G.normalize();
        U[I * 3 + 0] = c[J * 3 + 0] = G.x;
        U[I * 3 + 1] = c[J * 3 + 1] = G.y;
        U[I * 3 + 2] = c[J * 3 + 2] = G.z
    }
}, fixTopLeftNormal:function (H, B, u) {
    if (!H || !B || !u) {
        return
    }
    var O = this.$9.Position;
    if (!O) {
        return
    }
    var N = H.$9.Position;
    if (!N) {
        return
    }
    var L = B.$9.Position;
    if (!L) {
        return
    }
    var K = u.$9.Position;
    if (!K) {
        return
    }
    var c = this.$9.Normal;
    if (!c) {
        return
    }
    var U = H.$9.Normal;
    if (!U) {
        return
    }
    var S = B.$9.Normal;
    if (!S) {
        return
    }
    var Q = u.$9.Normal;
    if (!Q) {
        return
    }
    var M = this.$f4;
    var F = this.$g4;
    var l = (M - 1) * F - 2;
    var f = (M - 1) * F - 1;
    var e = (M - 2) * F + 1;
    var d = F - 2;
    var J = 0;
    var a = 1;
    var T = 2 * F - 2;
    var R = F;
    var P = F + 1;
    var A = K[l * 3 + 2];
    var t = K[f * 3 + 2];
    var s = N[e * 3 + 2];
    var q = L[d * 3 + 2];
    var I = O[J * 3 + 2];
    var o = O[a * 3 + 2];
    var n = L[T * 3 + 2];
    var m = O[R * 3 + 2];
    var k = O[P * 3 + 2];
    var E = (A * 1 + q * 2 + n * 1 + s * (-1) + o * (-2) + k * (-1)) / 8 / 2;
    var D = (A * 1 + t * 2 + s * 1 + n * (-1) + m * (-2) + k * (-1)) / 8 / 2;
    var C = 1;
    var G = new okVec3(E, D, C);
    G = G.normalize();
    c[0 + 0] = U[(M - 1) * F * 3 + 0] = S[(F - 1) * 3 + 0] = Q[(M * F - 1) * 3 + 0] = G.x;
    c[0 + 1] = U[(M - 1) * F * 3 + 1] = S[(F - 1) * 3 + 1] = Q[(M * F - 1) * 3 + 1] = G.y;
    c[0 + 2] = U[(M - 1) * F * 3 + 2] = S[(F - 1) * 3 + 2] = Q[(M * F - 1) * 3 + 2] = G.z
}};
function okTerrainTile(a) {
    this.rc = a;
    this.$l = new Array;
    this.$h5 = new okArray2D;
    this.$P2 = new okAABBox();
    this.$T4 = 1;
    this.sUrl = "";
    this.$G5;
    this.$g4;
    this.$f4;
    this.$X4;
    this.$W4;
    this.$85;
    this.$65;
    this.$P3 = new okVec2
}
okTerrainTile.prototype = {setParentTerrain:function (a) {
    this.$G5 = a
}, getParentTerrain:function () {
    return this.$G5
}, setBoundingBox:function (c, a) {
    var e = new okVec3(c.x, c.y, c.z);
    var d = new okVec3(a.x, a.y, a.z);
    if (d == null) {
        e.clone(this.$P2)
    } else {
        this.$P2.set(e, d)
    }
}, getBoundingBox:function () {
    var a = new okAABBox();
    this.$P2.clone(a);
    return a
}, setUrl:function (a) {
    this.sUrl = a
}, getUrl:function () {
    return this.sUrl
}, setGlobalIndex:function (c, a) {
    this.$P3.set(c, a)
}, getGlobalIndex:function () {
    return this.$P3
}, setChunkSize:function (a, c) {
    this.$g4 = a;
    this.$f4 = c
}, getChunkWidth:function () {
    return this.$g4
}, getChunkHeight:function () {
    return this.$f4
}, setWorldMapSize:function (a, c) {
    this.$85 = a;
    this.$65 = c
}, setTerrainSize:function (a, c) {
    this.$X4 = a;
    this.$W4 = c
}, setGridSpace:function (a) {
    this.$Q3 = a
}, setState:function (a) {
    this.$T4 = a
}, getState:function () {
    return this.$T4
}, getMaterialArray:function () {
    var h = new Array;
    this.createLocalLeafMeshMap();
    var a = this.$h5.getOneDimLength();
    var f = this.$h5.getTwoDimLength();
    for (var e = 0; e < a; ++e) {
        for (var d = 0; d < f; ++d) {
            var c = this.$h5.getElement(e, d);
            if (!c) {
                continue
            }
            h.push(c.getMaterial())
        }
    }
    return h
}, getMaterialMap:function () {
    var k = new Array;
    this.createLocalLeafMeshMap();
    var a = this.$h5.getOneDimLength();
    var h = this.$h5.getTwoDimLength();
    for (var e = 0; e < a; ++e) {
        for (var d = 0; d < h; ++d) {
            var c = this.$h5.getElement(e, d);
            if (!c) {
                continue
            }
            var f = c.getName();
            k[f] = c.getMaterial()
        }
    }
    return k
}, getMaterial:function (f) {
    this.createLocalLeafMeshMap();
    var a = this.$h5.getOneDimLength();
    var h = this.$h5.getTwoDimLength();
    for (var e = 0; e < a; ++e) {
        for (var d = 0; d < h; ++d) {
            var c = this.$h5.getElement(e, d);
            if (!c) {
                continue
            }
            if (c.getName() == f) {
                return c.getMaterial()
            }
        }
    }
    return null
}, getLeafChunkMap:function () {
    this.createLocalLeafMeshMap();
    return this.$h5
}, addChlidMesh:function (a) {
    a.setParentTerrain(this.$G5);
    a.setChunkSize(this.$g4, this.$f4);
    this.$l.push(a)
}, createLeafMesh:function (n, d, k, t, u) {
    var e = new okVec3(-100000, -100000, -100000);
    var v = new okVec3(100000, 100000, 100000);
    var o = new okTerrainMesh(this.rc);
    o.setParentTerrain(this.$G5);
    o.setName("chunk_" + n.toString() + "_" + d.toString());
    o.setGlobalIndex(n, d);
    o.setChunkSize(this.$g4, this.$f4);
    o.setTerrainSize(this.$X4, this.$W4);
    o.setGridSpace(this.$Q3);
    this.$l.push(o);
    var p = new Array;
    for (var h = 0; h < this.$f4; ++h) {
        for (var m = 0; m < this.$g4; ++m) {
            var c = n * (this.$g4 - 1) + m;
            var l = d * (this.$f4 - 1) + h;
            var s = c + l * this.$X4;
            var q = u[s];
            var f = c * this.$Q3.x;
            var a = l * this.$Q3.y;
            p.push(f);
            p.push(a);
            p.push(q);
            v = okVec3Min(v, new okVec3(f, a, q));
            e = okVec3Max(e, new okVec3(f, a, q))
        }
    }
    o.setBoundingBox(v, e);
    k.set(v.x, v.y, v.z);
    t.set(e.x, e.y, e.z);
    o.createAttribute("Position", p.length, p, 35044)
}, createChildMesh:function (l, a, h, o, e, q, s) {
    var c = new okVec3(-100000, -100000, -100000);
    var u = new okVec3(100000, 100000, 100000);
    var p = new okTerrainTile(this.rc);
    p.setParentTerrain(this.$G5);
    p.setGlobalIndex(l, a);
    p.setWorldMapSize(this.$85, this.$65);
    p.setTerrainSize(this.$X4, this.$W4);
    p.setChunkSize(this.$g4, this.$f4);
    p.setGridSpace(this.$Q3);
    this.$l.push(p);
    for (var k = 0; k < 2; ++k) {
        for (var f = 0; f < 2; ++f) {
            var m = l * 2 + k;
            var t = a * 2 + f;
            var d = new okVec3;
            var n = new okVec3;
            if (e >= q - 1) {
                p.createLeafMesh(m, t, d, n, s)
            } else {
                p.createChildMesh(m, t, d, n, e + 1, q, s)
            }
            u = okVec3Min(u, d);
            c = okVec3Max(c, n)
        }
    }
    p.setBoundingBox(u, c);
    h.set(u.x, u.y, u.z);
    o.set(c.x, c.y, c.z)
}, detectCollision:function (e) {
    for (var c = 0; c < this.$l.length; ++c) {
        var d = this.$l[c];
        var a = d.getBoundingBox();
        if (e.x >= a.vMin.x && e.x <= a.vMax.x && e.y >= a.vMin.y && e.y <= a.vMax.y) {
            return d.detectCollision(e)
        }
    }
}, computeNormal:function () {
    this.createLocalLeafMeshMap();
    var a = this.$h5.getOneDimLength();
    var f = this.$h5.getTwoDimLength();
    for (var e = 0; e < a; ++e) {
        for (var d = 0; d < f; ++d) {
            var c = this.$h5.getElement(e, d);
            if (!c) {
                continue
            }
            c.computeNormal();
            c.fixNormal(this.$h5, new okVec2(e, d))
        }
    }
}, fixNormal:function (u) {
    var s = this.$P3.x;
    var q = this.$P3.y;
    var d = u.getElement(s - 1, q);
    if (d && d.getState() == 3) {
        d.createLocalLeafMeshMap();
        var k = d.$h5.getOneDimLength();
        var v = d.$h5.getTwoDimLength();
        for (var o = 0; o < v; ++o) {
            var t = d.$h5.getElement(k - 1, o);
            var l = this.$h5.getElement(0, o);
            l.fixLeftNormal(t)
        }
    }
    var a = u.getElement(s + 1, q);
    if (a && a.getState() == 3) {
        a.createLocalLeafMeshMap();
        var k = a.$h5.getOneDimLength();
        var v = a.$h5.getTwoDimLength();
        for (var o = 0; o < v; ++o) {
            var x = a.$h5.getElement(0, o);
            var l = this.$h5.getElement(k - 1, o);
            x.fixLeftNormal(l)
        }
    }
    var p = u.getElement(s, q - 1);
    if (p && p.getState() == 3) {
        p.createLocalLeafMeshMap();
        var k = p.$h5.getOneDimLength();
        var v = p.$h5.getTwoDimLength();
        for (var o = 0; o < k; ++o) {
            var e = p.$h5.getElement(o, v - 1);
            var l = this.$h5.getElement(o, 0);
            l.fixTopNormal(e)
        }
    }
    var f = u.getElement(s, q + 1);
    if (f && f.getState() == 3) {
        f.createLocalLeafMeshMap();
        var k = f.$h5.getOneDimLength();
        var v = f.$h5.getTwoDimLength();
        for (var o = 0; o < k; ++o) {
            var z = f.$h5.getElement(o, 0);
            var l = this.$h5.getElement(o, v - 1);
            z.fixTopNormal(l)
        }
    }
    var n = u.getElement(s - 1, q - 1);
    if (n && n.getState() == 3 && p && p.getState() == 3 && d && d.getState() == 3) {
        this.createLocalLeafMeshMap();
        var k = this.$h5.getOneDimLength();
        var v = this.$h5.getTwoDimLength();
        var l = this.$h5.getElement(0, 0);
        var e = p.$h5.getElement(0, v - 1);
        var t = d.$h5.getElement(k - 1, 0);
        var y = n.$h5.getElement(k - 1, v - 1);
        l.fixTopLeftNormal(e, t, y)
    }
    if (p && p.getState() == 3) {
        var c = new Array;
        var k = p.$h5.getOneDimLength();
        var v = p.$h5.getTwoDimLength();
        for (var o = 0; o < k; ++o) {
            c.push(new okVec2(o, v - 1))
        }
        p.createAttributeArrayBuffer("Normal", c)
    }
    if (d && d.getState() == 3) {
        var c = new Array;
        var k = d.$h5.getOneDimLength();
        var v = d.$h5.getTwoDimLength();
        for (var o = 0; o < v; ++o) {
            c.push(new okVec2(k - 1, o))
        }
        d.createAttributeArrayBuffer("Normal", c)
    }
    if (f && f.getState() == 3) {
        var c = new Array;
        var k = f.$h5.getOneDimLength();
        var v = f.$h5.getTwoDimLength();
        for (var o = 0; o < k; ++o) {
            c.push(new okVec2(o, 0))
        }
        f.createAttributeArrayBuffer("Normal", c)
    }
    if (a && a.getState() == 3) {
        var c = new Array;
        var k = a.$h5.getOneDimLength();
        var v = a.$h5.getTwoDimLength();
        for (var o = 0; o < v; ++o) {
            c.push(new okVec2(0, o))
        }
        a.createAttributeArrayBuffer("Normal", c)
    }
    if (n && n.getState() == 3) {
        var c = new Array;
        var k = n.$h5.getOneDimLength();
        var v = n.$h5.getTwoDimLength();
        c.push(new okVec2(k - 1, v - 1));
        n.createAttributeArrayBuffer("Normal", c)
    }
}, distributeAttribute:function (h, d) {
    this.createLocalLeafMeshMap();
    var a = this.$h5.getOneDimLength();
    var k = this.$h5.getTwoDimLength();
    for (var f = 0; f < a; ++f) {
        for (var e = 0; e < k; ++e) {
            var c = this.$h5.getElement(f, e);
            if (!c) {
                continue
            }
            c.distributeAttribute(h, d)
        }
    }
}, createLocalLeafMeshMap:function () {
    var a = this.$l;
    var c = new Array;
    while (1) {
        for (var h = 0; h < a.length; ++h) {
            var e = a[h];
            for (var f = 0; f < e.$l.length; f++) {
                c.push(e.$l[f])
            }
        }
        if (c.length == 0) {
            break
        }
        a = c;
        c = []
    }
    var d = 0;
    var k = 0;
    this.$h5.clear();
    if (a.length > 0) {
        var m = a[0].getGlobalIndex();
        d = m.x;
        k = m.y
    }
    for (var h = 0; h < a.length; ++h) {
        var e = a[h];
        var m = e.getGlobalIndex();
        var n = m.x - d;
        var l = m.y - k;
        this.$h5.addElement(n, l, e)
    }
}, loadTextureFromXml:function (o, z) {
    this.createLocalLeafMeshMap();
    var h = this.$h5.getElement(0, 0);
    var a = h.getGlobalIndex();
    var m = a.x;
    var s = a.y;
    var k = (z[14] - z[2]) / (z[12] - z[0]);
    var y = (z[15] - z[3]) / (z[13] - z[1]);
    var c = z[12] / (this.$g4 - 1);
    var f = z[13] / (this.$f4 - 1);
    var A = z[0] / (this.$g4 - 1);
    var e = z[1] / (this.$f4 - 1);
    for (var u = A; u < c; ++u) {
        for (var t = e; t < f; ++t) {
            var n = this.$h5.getElement(u - m, t - s);
            if (!n) {
                continue
            }
            var w = (u * (this.$g4 - 1) + z[0]) * k + z[2];
            var l = (t * (this.$f4 - 1) + z[1]) * y + z[3];
            var d = new Array;
            for (var v = 0; v < this.$f4; ++v) {
                for (var p = 0; p < this.$g4; ++p) {
                    var q = (v * this.$g4 + p) * 2;
                    d[q] = w + p * k;
                    d[q + 1] = l + v * y
                }
            }
            n.createAttribute(o, d.length, d);
            var x = n.getMaterial();
            x.$73 = n.$G5;
            x.setEmissive(OAK.VEC3_ZERO);
            x.setAmbient(0.01, 0.01, 0.01);
            x.setDiffuse(0.976471, 0.990196, 0.901961);
            x.setSpecular(0.01, 0.01, 0.01);
            x.setTextureCoord(0, o)
        }
    }
}, cullByFrustum:function (f, e, a, h) {
    if (a.collideAABBox(this.getBoundingBox()) == 0) {
        return
    }
    for (var c = 0; c < this.$l.length; ++c) {
        var d = this.$l[c];
        if (!d) {
            continue
        }
        d.cullByFrustum(f, e, a, h)
    }
}, createAttributeArrayBuffer:function (k, n) {
    this.createLocalLeafMeshMap();
    var l = this.$h5.getOneDimLength();
    var h = this.$h5.getTwoDimLength();
    for (var e = 0; e < l; ++e) {
        for (var d = 0; d < h; ++d) {
            var a = this.$h5.getElement(e, d);
            if (!a) {
                continue
            }
            if (!n || n.length == 0) {
                a.createAttributeArrayBuffer(k)
            } else {
                for (var c = 0; c < n.length; ++c) {
                    var f = n[c];
                    if (e == f.x && d == f.y) {
                        a.createAttributeArrayBuffer(k);
                        break
                    }
                }
            }
        }
    }
}};
function okTerrainEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 32;
    this.$g4;
    this.$f4;
    this.$85;
    this.$65;
    this.$X4;
    this.$W4;
    this.$V4;
    this.$U4;
    this.$75;
    this.$Q3 = new okVec2;
    this.$p = new Array;
    this.$K1 = new Array;
    this.$d7 = new okArray2D;
    this.$Y = new Object;
    this.$k2 = false;
    this.$N2 = false
}
okExtend(okTerrainEntity, okVisibleEntity);
okTerrainEntity.prototype.clear = function () {
    var e = this.$U5;
    if (this.$Y) {
        okA._object(this.$Y)
    }
    this.$Y = okA.object();
    for (var d = 0; d < this.$p.length; ++d) {
        var a = this.$p[d];
        a.releaseBuffer();
        delete a
    }
    for (var d = 0; d < this.$K1.length; d++) {
        var c = this.$K1[d];
        c.clear()
    }
    okBaseCall(this, "clear")
};
okTerrainEntity.prototype.setChunkSize = function (a, d) {
    if (a > 129 || d > 129 || a < 3 || d < 3) {
        return false
    }
    if (!okIsInt(Math.log(a - 1) / Math.log(2))) {
        return false
    }
    if (!okIsInt(Math.log(d - 1) / Math.log(2))) {
        return false
    }
    this.$g4 = a;
    this.$f4 = d;
    var c;
    if (this.$N2 == false || this.$N2 == null) {
        c = "Default"
    } else {
        c = "Wireframe"
    }
    this.createChunkIndexBufferArray(a, d, c);
    return true
};
okTerrainEntity.prototype.setWorldMapSize = function (a, c) {
    this.$85 = a;
    this.$65 = c
};
okTerrainEntity.prototype.setTerrainSize = function (a, d) {
    this.$V4 = a;
    this.$U4 = d;
    var c = Math.ceil(Math.log(a - 1) / Math.log(2));
    var e = Math.ceil(Math.log(d - 1) / Math.log(2));
    this.$X4 = Math.pow(2, c) + 1;
    this.$W4 = Math.pow(2, e) + 1;
    this.setWorldMapSize(this.$X4, this.$W4)
};
okTerrainEntity.prototype.setGridSpacing = function (a, c) {
    this.$Q3.set(a, c)
};
okTerrainEntity.prototype.getMaterialMap = function () {
    var e = new Object;
    for (var f = 0; f < this.$K1.length; ++f) {
        var h = this.$K1[f];
        if (!h) {
            continue
        }
        var a = h.getLeafChunkMap();
        var o = a.getOneDimLength();
        var k = a.getTwoDimLength();
        for (var d = 0; d < o; ++d) {
            for (var c = 0; c < k; ++c) {
                var l = a.getElement(d, c);
                e[l.getName()] = l.getMaterial()
            }
        }
    }
    return e
};
okTerrainEntity.prototype.getMaterial = function (e) {
    for (var d = 0; d < this.$K1.length; ++d) {
        var c = this.$K1[d];
        if (!c) {
            continue
        }
        var a = c.getMaterial(e);
        if (a) {
            return a
        }
    }
    return NULL
};
okTerrainEntity.prototype.loadAttribute = function (m, o) {
    o = this._fillData(m, o);
    if (m == "Height") {
        this.rotX(1, -90);
        this.$k2 = false;
        this.$75 = Math.log((this.$85 - 1) / (this.$g4 - 1)) / Math.log(2);
        var n = (this.$X4 - 1) / (this.$85 - 1);
        var k = (this.$W4 - 1) / (this.$65 - 1);
        var d = new okVec3(10000, 10000, 10000);
        var l = new okVec3(-10000, -10000, -10000);
        for (var f = 0; f < n; ++f) {
            for (var e = 0; e < k; ++e) {
                var a = new okVec3;
                var c = new okVec3;
                this.createWorldMap(f, e, 0, a, c, o);
                d = okVec3Min(d, a);
                l = okVec3Max(l, c)
            }
        }
        this.$P2.set(d, l);
        this.$k2 = true
    } else {
        if (m == "Normal" || m == "Texcoord1") {
            for (var f = 0; f < this.$K1.length; ++f) {
                var h = this.$K1[f];
                if (!h) {
                    continue
                }
                h.distributeAttribute(m, o)
            }
        }
    }
};
okTerrainEntity.prototype._fillData = function (h, l) {
    var a = this.$X4;
    var m = this.$W4;
    var f = this.$V4;
    var k = this.$U4;
    if (h == "Height" && l.length < a * m) {
        var e = new Array;
        for (var c = 0; c < m; ++c) {
            for (var d = 0; d < a; ++d) {
                if (d < f && c < k) {
                    e.push(l[c * f + d])
                } else {
                    e.push(0)
                }
            }
        }
        return e
    } else {
        if (h == "Normal" && l.length < a * m * 3) {
            var e = new Array;
            for (var c = 0; c < m; ++c) {
                for (var d = 0; d < a; ++d) {
                    if (d < f && c < k) {
                        e.push(l[(c * f + d) * 3 + 0]);
                        e.push(l[(c * f + d) * 3 + 1]);
                        e.push(l[(c * f + d) * 3 + 2])
                    } else {
                        e.push(0);
                        e.push(0);
                        e.push(1)
                    }
                }
            }
            return e
        } else {
            if (h == "Texcoord1" && l.length < a * m * 2) {
                var e = new Array;
                for (var c = 0; c < m; ++c) {
                    for (var d = 0; d < a; ++d) {
                        if (d < f && c < k) {
                            e.push(l[(c * f + d) * 2 + 0]);
                            e.push(l[(c * f + d) * 2 + 1])
                        } else {
                            e.push(0);
                            e.push(0)
                        }
                    }
                }
                return e
            } else {
                return l
            }
        }
    }
};
okTerrainEntity.prototype.computeNormal = function () {
    var f = this.$d7.getOneDimLength();
    var a = this.$d7.getTwoDimLength();
    for (var e = 0; e < f; ++e) {
        for (var c = 0; c < a; ++c) {
            var d = this.$d7.getElement(e, c);
            if (!d) {
                continue
            }
            d.computeNormal();
            d.fixNormal(this.$d7)
        }
    }
    for (var e = 0; e < f; ++e) {
        for (var c = 0; c < a; ++c) {
            var d = this.$d7.getElement(e, c);
            if (!d) {
                continue
            }
            d.createAttributeArrayBuffer("Normal")
        }
    }
};
okTerrainEntity.prototype.enableWireframe = function (a) {
    this.$N2 = a
};
okTerrainEntity.prototype.getState = function () {
    if (!this.$k2) {
        return 1
    } else {
        return 4
    }
};
okTerrainEntity.prototype.cullByFrustum = function (d) {
    if (d.collideAABBox(this.getBoundingBox(1)) == 0) {
        return 0
    }
    for (var f = 0; f < this.$K1.length; ++f) {
        var e = this.$K1[f];
        var c = e.getBoundingBox();
        c.transformMat43(this.$n5);
        if (d.collideAABBox(c) == 0) {
            continue
        }
        if (e.getState() == 1) {
            var k = this;
            var h = okGenXmlHttpRequest();
            var a = this.$e7.$I6.getTerrainUrl() + "/" + e.getUrl();
            h.open("GET", a, true);
            if (okIsIE()) {
                h.onreadystatechange = function () {
                    if (h.readyState == 4) {
                        if (h.status == 200 || h.status == 0) {
                            okResourceParser.loadWorldMapFromXml(k, okParseXML(h.responseText));
                            k.$e7.dirtyEntity(k)
                        }
                    }
                }
            } else {
                h.onload = function () {
                    okResourceParser.loadWorldMapFromXml(k, okParseXML(h.responseText));
                    k.$e7.dirtyEntity(k)
                }
            }
            h.send();
            e.setState(2)
        }
    }
    return 1
};
okTerrainEntity.prototype.load = function (c) {
    this.rotX(1, -90);
    this.$k2 = false;
    c = this.$e7.$I6.getTerrainUrl() + "/" + c;
    var a = okGenXmlHttpRequest();
    a.open("GET", c, false);
    a.send();
    okResourceParser.loadTerrainFromXml(this, okParseXML(a.responseText), this.$N2);
    this.$k2 = true
};
okTerrainEntity.prototype.getWorldMaps = function () {
    return this.$K1
};
okTerrainEntity.prototype.getWorldMapMap = function () {
    return this.$d7
};
okTerrainEntity.prototype.createWorldMap = function (n, d, f, k, q, s) {
    if (f > this.$75) {
        return
    }
    var o = new okTerrainTile(this.$U5.rc);
    o.setGlobalIndex(n, d);
    this.addWorldMap(o);
    o.setWorldMapSize(this.$85, this.$65);
    o.setTerrainSize(this.$X4, this.$W4);
    o.setChunkSize(this.$g4, this.$f4);
    o.setGridSpace(this.$Q3);
    var l = new okVec3(-100000, -100000, -100000);
    var a = new okVec3(100000, 100000, 100000);
    if (this.$75 == 0) {
        o.createLeafMesh(n, d, a, l, s)
    } else {
        for (var m = 0; m < 2; ++m) {
            for (var h = 0; h < 2; ++h) {
                var t = n * 2 + m;
                var e = d * 2 + h;
                var p = new okVec3;
                var c = new okVec3;
                if (this.$75 == 1) {
                    o.createLeafMesh(t, e, p, c, s)
                } else {
                    o.createChildMesh(t, e, p, c, f + 1, this.$75, s)
                }
                a = okVec3Min(a, p);
                l = okVec3Max(l, c)
            }
        }
    }
    o.setBoundingBox(a, l);
    k.set(a.x, a.y, a.z);
    q.set(l.x, l.y, l.z);
    o.setState(3)
};
okTerrainEntity.prototype.addWorldMap = function (c) {
    c.setParentTerrain(this);
    c.setChunkSize(this.$g4, this.$f4);
    this.$K1.push(c);
    var a = c.getGlobalIndex();
    this.$d7.addElement(a.x, a.y, c)
};
okTerrainEntity.prototype.addTexture = function (a) {
};
okTerrainEntity.prototype.createChunkIndexBufferArray = function (x, E, o) {
    var d;
    var z = 1;
    for (var D = 0; ; ++D) {
        z = z * 2;
        if (z >= x - 1) {
            d = D + 1;
            break
        }
    }
    var G = new Array;
    for (var A = 0; A <= d; ++A) {
        var t = 1;
        for (var D = 0; D < A; D++) {
            t *= 2
        }
        var F = (x - 1) / t;
        if (A == 0) {
            var D = 0;
            var C = 0;
            var c = new Array;
            c[0] = (D + (C + 1) * x) * F;
            c[1] = (D + C * x) * F;
            c[2] = ((D + 1) + C * x) * F;
            this._addToIndexArrayList(G, o, c, 0);
            var a = new Array;
            a[0] = (D + (C + 1) * x) * F;
            a[1] = ((D + 1) + C * x) * F;
            a[2] = ((D + 1) + (C + 1) * x) * F;
            this._addToIndexArrayList(G, o, a, 0);
            var c = new Array;
            c[0] = (D + (C + 1) * x) * F;
            c[1] = (D + C * x) * F;
            c[2] = ((D + 1) + (C + 1) * x) * F;
            this._addToIndexArrayList(G, o, c, 1);
            var a = new Array;
            a[0] = (D + C * x) * F;
            a[1] = ((D + 1) + C * x) * F;
            a[2] = ((D + 1) + (C + 1) * x) * F;
            this._addToIndexArrayList(G, o, a, 1)
        } else {
            for (var q = 0; q < 16; ++q) {
                var s = (A << 4) + q;
                var u = 0;
                var y = 0;
                var f = t;
                var p = t;
                var m = q & 1;
                var B = (q >> 1) & 1;
                var e = (q >> 2) & 1;
                var v = (q >> 3) & 1;
                if (m == 1) {
                    u = 1
                }
                if (e == 1) {
                    f = t - 1
                }
                if (B == 1) {
                    y = 1
                }
                if (v == 1) {
                    p = t - 1
                }
                for (var D = u; D < f; ++D) {
                    for (var C = y; C < p; ++C) {
                        if ((D + C) % 2 == 0) {
                            var c = new Array;
                            c[0] = (D + C * x) * F;
                            c[1] = ((D + 1) + (C + 1) * x) * F;
                            c[2] = (D + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, c, s);
                            var a = new Array;
                            a[0] = (D + C * x) * F;
                            a[1] = ((D + 1) + C * x) * F;
                            a[2] = ((D + 1) + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, a, s)
                        } else {
                            var c = new Array;
                            c[0] = (D + C * x) * F;
                            c[1] = ((D + 1) + C * x) * F;
                            c[2] = (D + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, c, s);
                            var a = new Array;
                            a[0] = (D + (C + 1) * x) * F;
                            a[1] = ((D + 1) + C * x) * F;
                            a[2] = ((D + 1) + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, a, s)
                        }
                    }
                }
                if (B == 1) {
                    var C = 0;
                    for (var D = 0; D < t; D += 2) {
                        if (D != 0 || m == 0) {
                            var c = new Array;
                            c[0] = (D + C * x) * F;
                            c[1] = ((D + 1) + (C + 1) * x) * F;
                            c[2] = (D + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, c, s)
                        }
                        var a = new Array;
                        a[0] = (D + C * x) * F;
                        a[1] = ((D + 2) + C * x) * F;
                        a[2] = ((D + 1) + (C + 1) * x) * F;
                        this._addToIndexArrayList(G, o, a, s);
                        if (D != t - 2 || e == 0) {
                            var H = new Array;
                            H[0] = ((D + 1) + (C + 1) * x) * F;
                            H[1] = ((D + 2) + C * x) * F;
                            H[2] = ((D + 2) + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, H, s)
                        }
                    }
                }
                if (v == 1) {
                    var C = t - 1;
                    for (var D = 0; D < t; D += 2) {
                        if (D != 0 || m == 0) {
                            var c = new Array;
                            c[0] = (D + C * x) * F;
                            c[1] = ((D + 1) + C * x) * F;
                            c[2] = (D + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, c, s)
                        }
                        var a = new Array;
                        a[0] = (D + (C + 1) * x) * F;
                        a[1] = ((D + 1) + C * x) * F;
                        a[2] = ((D + 2) + (C + 1) * x) * F;
                        this._addToIndexArrayList(G, o, a, s);
                        if (D != t - 2 || e == 0) {
                            var H = new Array;
                            H[0] = ((D + 1) + C * x) * F;
                            H[1] = ((D + 2) + C * x) * F;
                            H[2] = ((D + 2) + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, H, s)
                        }
                    }
                }
                if (m == 1) {
                    var D = 0;
                    for (var C = 0; C < t; C += 2) {
                        if (C != 0 || B == 0) {
                            var c = new Array;
                            c[0] = (D + C * x) * F;
                            c[1] = ((D + 1) + C * x) * F;
                            c[2] = ((D + 1) + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, c, s)
                        }
                        var a = new Array;
                        a[0] = (D + C * x) * F;
                        a[1] = ((D + 1) + (C + 1) * x) * F;
                        a[2] = (D + (C + 2) * x) * F;
                        this._addToIndexArrayList(G, o, a, s);
                        if (C != t - 2 || v == 0) {
                            var H = new Array;
                            H[0] = (D + (C + 2) * x) * F;
                            H[1] = ((D + 1) + (C + 1) * x) * F;
                            H[2] = ((D + 1) + (C + 2) * x) * F;
                            this._addToIndexArrayList(G, o, H, s)
                        }
                    }
                }
                if (e == 1) {
                    var D = t - 1;
                    for (var C = 0; C < t; C += 2) {
                        if (C != 0 || B == 0) {
                            var c = new Array;
                            c[0] = (D + C * x) * F;
                            c[1] = ((D + 1) + C * x) * F;
                            c[2] = (D + (C + 1) * x) * F;
                            this._addToIndexArrayList(G, o, c, s)
                        }
                        var a = new Array;
                        a[0] = (D + (C + 1) * x) * F;
                        a[1] = ((D + 1) + C * x) * F;
                        a[2] = ((D + 1) + (C + 2) * x) * F;
                        this._addToIndexArrayList(G, o, a, s);
                        if (C != t - 2 || v == 0) {
                            var H = new Array;
                            H[0] = (D + (C + 2) * x) * F;
                            H[1] = (D + (C + 1) * x) * F;
                            H[2] = ((D + 1) + (C + 2) * x) * F;
                            this._addToIndexArrayList(G, o, H, s)
                        }
                    }
                }
            }
        }
    }
    for (var D = 0; D < G.length; ++D) {
        var n = G[D];
        if (!n) {
            continue
        }
        var k = new okArrayBuffer(this.$U5.rc);
        k.createBuffer(34963, 5123, 35044, new Uint16Array(n));
        this.$p[D] = k
    }
};
okTerrainEntity.prototype._addToIndexArrayList = function (f, d, l, a) {
    if (!f[a]) {
        f[a] = new Array
    }
    var e = new Array;
    if (d == "Wireframe") {
        var m = l[0];
        var k = l[1];
        var h = l[2];
        e.push(m, k, k, h, h, m)
    } else {
        var m = l[0];
        var k = l[1];
        var h = l[2];
        e.push(m, k, h)
    }
    for (var c = 0; c < e.length; c++) {
        f[a].push(e[c])
    }
};
okTerrainEntity.prototype.createMaterial = function (a) {
    var c = "EntityMtrl" + this.$e6 + a;
    this.$Y[a] = this.$U5.createMaterial(c)
};
okTerrainEntity.prototype.getBoundingBox = function (e) {
    if (e == 2) {
        if (this.$t2) {
            if (this.$K1.length == 0) {
                this.$E5.setMin(OAK.VEC3_ZERO);
                this.$E5.setMax(OAK.VEC3_ZERO);
                this.$E5.setMat(this.$n5)
            } else {
                var a = okA.aabbox();
                for (var d = 0; d < this.$K1.length; ++d) {
                    var c = this.$K1[d];
                    if (d == 0) {
                        c.getBoundingBox().clone(a)
                    } else {
                        a = a.union(c.getBoundingBox())
                    }
                }
                this.$E5.setMin(a.vMin);
                this.$E5.setMax(a.vMax);
                this.$E5.setMat(this.$n5);
                this.$t2 = false;
                okA._aabbox(a)
            }
        }
        return this.$E5
    } else {
        if (this.$W1) {
            if (this.$K1.length == 0) {
                this.$P2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO)
            } else {
                for (var d = 0; d < this.$K1.length; ++d) {
                    var c = this.$K1[d];
                    if (d == 0) {
                        c.getBoundingBox().clone(this.$P2)
                    } else {
                        this.$P2 = this.$P2.union(c.getBoundingBox())
                    }
                }
                this.$P2.transformMat(this.$n5);
                this.$W1 = false
            }
        }
        return this.$P2
    }
};
okTerrainEntity.prototype.detectCollision = function (k) {
    var e = this.getInvMat43();
    var h = okMat43MulVec3(e, k);
    for (var d = 0; d < this.$K1.length; ++d) {
        var c = this.$K1[d];
        var a = c.getBoundingBox();
        if (h.x >= a.vMin.x && h.x <= a.vMax.x && h.y >= a.vMin.y && h.y <= a.vMax.y) {
            var f = c.detectCollision(h);
            h.z = f;
            return okMat43MulVec3(this.getMat43(), h)
        }
    }
    return null
};
okTerrainEntity.prototype.genRenderBatch = function (D, h) {
    if (this.$K1.length == 0) {
        return
    }
    var E = h.$U2;
    var d = E.getPos();
    d = okMat43MulVec3(this.$n5.inverse(), d);
    var M = new okFrustum();
    var e = new okMat4();
    okMat43Mul(this.$n5.inverse(), E.$i5).toMat4(e);
    var s = e.inverse();
    M.setByViewProjMat(okMat4Mul(E.$t5, s));
    var U = new okArray2D;
    for (var T = 0; T < this.$K1.length; ++T) {
        var m = this.$K1[T];
        if (m.getState() == 3) {
            m.cullByFrustum(U, E, M, d)
        }
    }
    var p = false;
    var K = U.getOneDimLength();
    var J = U.getTwoDimLength();
    while (!p) {
        p = true;
        for (var T = 0; T < K; ++T) {
            for (var S = 0; S < J; ++S) {
                var v = U.getElement(T, S);
                if (!v) {
                    continue
                }
                v.clearFillCrashFlag();
                var G = v.getGlobalIndex().x;
                var q = v.getGlobalIndex().y;
                var Q = U.getElement(G - 1, q);
                if (Q) {
                    if (Q.getCurrentLOD() - v.getCurrentLOD() <= -2) {
                        Q.setCurrentLOD(Q.getCurrentLOD() + 1);
                        p = false
                    } else {
                        if (Q.getCurrentLOD() - v.getCurrentLOD() == -1) {
                            v.$b5 = true
                        }
                    }
                }
                var P = U.getElement(G, q - 1);
                if (P) {
                    if (P.getCurrentLOD() - v.getCurrentLOD() <= -2) {
                        P.setCurrentLOD(P.getCurrentLOD() + 1);
                        p = false
                    } else {
                        if (P.getCurrentLOD() - v.getCurrentLOD() == -1) {
                            v.$X6 = true
                        }
                    }
                }
                var O = U.getElement(G + 1, q);
                if (O) {
                    if (O.getCurrentLOD() - v.getCurrentLOD() <= -2) {
                        O.setCurrentLOD(O.getCurrentLOD() + 1);
                        p = false
                    } else {
                        if (O.getCurrentLOD() - v.getCurrentLOD() == -1) {
                            v.$V5 = true
                        }
                    }
                }
                var N = U.getElement(G, q + 1);
                if (N) {
                    if (N.getCurrentLOD() - v.getCurrentLOD() <= -2) {
                        N.setCurrentLOD(N.getCurrentLOD() + 1);
                        p = false
                    } else {
                        if (N.getCurrentLOD() - v.getCurrentLOD() == -1) {
                            v.$T2 = true
                        }
                    }
                }
            }
        }
    }
    var H = new Object;
    var B = new Object;
    var I = this.$U5;
    var K = U.getOneDimLength();
    var J = U.getTwoDimLength();
    for (var T = 0; T < K; ++T) {
        for (var S = 0; S < J; ++S) {
            var v = U.getElement(T, S);
            if (!v) {
                continue
            }
            var c = v.getMaterial();
            c.enableWireframe(this.$N2);
            var F = v.computePosInIndexArray();
            var a = this.$p[F];
            if (!c.isWireframeEnabled()) {
                v.$H.Default = a
            } else {
                v.$H.Wireframe = a
            }
            var w = this.$e7.$I6.$F6;
            var o = okA.renderBatch();
            o.$a = okA.object();
            var W = v.$8;
            var z = okA.array();
            for (var L in W) {
                var u = W[L];
                var f = L.split("/");
                var A = 0;
                z.length = 0;
                var l = f.length;
                for (var R = 0; R < l; ++R) {
                    var V = new okAttribFormat();
                    var C = f[R];
                    z.push(V);
                    o.$a[C] = V;
                    V.$e6 = C;
                    V.iIdx = R;
                    V.iOffset = A;
                    V.buf = u;
                    switch (C) {
                        case"Position":
                        case"Normal":
                        case"Color":
                        case"Texcoord1_Tangent":
                        case"Texcoord1_Binormal":
                        case"Texcoord2_Tangent":
                        case"Texcoord2_Binormal":
                        case"Texcoord3_Tangent":
                        case"Texcoord3_Binormal":
                        case"Texcoord4_Tangent":
                        case"Texcoord4_Binormal":
                            V.$P4 = 3;
                            A += 3;
                            break;
                        case"Texcoord1":
                        case"Texcoord2":
                        case"Texcoord3":
                        case"Texcoord4":
                            V.$P4 = 2;
                            A += 2;
                            break;
                        case"BoneIndex":
                        case"BoneWeight":
                            V.$P4 = 4;
                            A += 4;
                            break;
                        default:
                            okLog("[Error][" + this.__getTypeString() + ".genRenderBatch][Id: " + this.getId() + "] Unrecoganized attribute name:" + C + "!")
                    }
                }
                l = z.length;
                for (var R = 0; R < l; ++R) {
                    z[R].iStride = A
                }
            }
            okA._array(z);
            if (c.$O2 && v.$H.Wireframe) {
                o.$95 = v.$H.Wireframe;
                o.$r4 = 1;
                o.$s4 = 0;
                o.$q4 = o.$95.getLength()
            } else {
                o.$95 = v.$H.Default;
                o.$r4 = 4;
                o.$s4 = 0;
                o.$q4 = o.$95.getLength()
            }
            o.$A5 = c;
            var t = this.getMat4();
            if (this.$C2) {
                t.m03 += cam.$i5.m03;
                t.m13 += cam.$i5.m13;
                t.m23 += cam.$i5.m23
            }
            o.$p5 = okA.mat4();
            o.$r5 = okA.mat4();
            o.$n5 = t;
            o.$q5 = this.getNormalMat4();
            o.$t = this.$u;
            o.$61 = this.$71;
            o.$p1 = this.$q1;
            var n = new okAABBox();
            v.getBoundingBox().clone(n);
            n.transformMat(this.$n5);
            o.$S2 = n;
            o.$y2 = this.$y2;
            o.$B4 = this.$B4;
            D.push(o)
        }
    }
};
function okVideoEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 128;
    this.$C5 = new okMesh(this.$U5.rc);
    this.$D5 = new okMaterial();
    this.$D5.$73 = this;
    this.$D5.setTextureWrap(0, 33071);
    this.$R2 = new okAABBox();
    this.$a5 = new Date();
    this._init()
}
okExtend(okVideoEntity, okVisibleEntity);
okVideoEntity.prototype.clear = function () {
    var a = this.$U5;
    this.$C5.clear();
    this.$D5.clear();
    this.$D5.setTextureWrap(0, 33071);
    this.$R2 = new okAABBox();
    okBaseCall(this, "clear")
};
okVideoEntity.prototype.getState = function () {
    var c = this.$D5.getTextureResourceId(0);
    if (c == -1) {
        return 1
    }
    var a = this.$U5.getResourceState(c);
    if (a != 5) {
        return 1
    }
    return 4
};
okVideoEntity.prototype._init = function () {
    var a = new Array;
    a.push(-1);
    a.push(-1);
    a.push(0);
    a.push(0);
    a.push(0);
    a.push(1);
    a.push(1);
    a.push(-1);
    a.push(0);
    a.push(0);
    a.push(0);
    a.push(1);
    a.push(-1);
    a.push(1);
    a.push(0);
    a.push(0);
    a.push(0);
    a.push(1);
    a.push(1);
    a.push(1);
    a.push(0);
    a.push(0);
    a.push(0);
    a.push(1);
    this.$C5.deleteAttribute("Position/Normal");
    this.$C5.createAttribute("Position/Normal", a.length, a, 35044);
    var d = new Array;
    d.push(0);
    d.push(1);
    d.push(1);
    d.push(1);
    d.push(0);
    d.push(0);
    d.push(1);
    d.push(0);
    this.$C5.deleteAttribute("Texcoord1");
    this.$C5.createAttribute("Texcoord1", d.length, d, 35044);
    this.$R2.set(new okVec3(-1, -1, -0.001), new okVec3(1, 1, 0.001));
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    var c = new Array;
    c.push(1);
    c.push(2);
    c.push(0);
    c.push(1);
    c.push(3);
    c.push(2);
    this.$C5.deleteIndex("Default");
    this.$C5.createIndex("Default", c.length, c, 35044, 4);
    this.$D5.$93 = 1;
    this.$D5.$O2 = false;
    this.$D5.$47 = new okVec3(0, 0, 0);
    this.$D5.$Z6 = new okVec3(0, 0, 0);
    this.$D5.$37 = new okVec3(1, 1, 1);
    this.$D5.$a7 = new okVec3(0, 0, 0);
    this.$D5.enableDynamicLighting(false);
    this.$D5.setTextureType(0, 3553);
    this.$D5.setTextureCoord(0, "Texcoord1")
};
okVideoEntity.prototype.setScreenBoard = function (a, k, c, e, f) {
    f = f ? f : 0;
    var d = new Array;
    d.push(a);
    d.push(k);
    d.push(f);
    d.push(0);
    d.push(0);
    d.push(1);
    d.push(a + c);
    d.push(k);
    d.push(f);
    d.push(0);
    d.push(0);
    d.push(1);
    d.push(a);
    d.push(k + e);
    d.push(f);
    d.push(0);
    d.push(0);
    d.push(1);
    d.push(a + c);
    d.push(k + e);
    d.push(f);
    d.push(0);
    d.push(0);
    d.push(1);
    this.$C5.deleteAttribute("Position/Normal");
    this.$C5.createAttribute("Position/Normal", d.length, d, 35044);
    this.$R2.set(new okVec3(a, k, f - 0.001), new okVec3(a + c, k + e, f + 0.001));
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true
};
okVideoEntity.prototype.loadVideo = function (a) {
    this.$D5.setTextureName(0, a)
};
okVideoEntity.prototype.getVideo = function () {
    var e = this.$U5;
    var a = this.$D5;
    var f = this.$D5.getTextureResourceId(0);
    if (f == -1) {
        return null
    }
    var c = e.getResource(f);
    if (!c) {
        return null
    }
    var d = c.$c7;
    if (!d) {
        return null
    }
    return d
};
okVideoEntity.prototype.getVideoName = function () {
    var d = this.$U5;
    var a = this.$D5;
    var c = a.getTextureName(0);
    return c
};
okVideoEntity.prototype.getVideoTexture = function () {
    var d = this.$U5;
    var a = this.$D5;
    var e = a.getTextureResourceId(0);
    if (e == -1) {
        return null
    }
    var c = d.getResource(e);
    return c
};
okVideoEntity.prototype.setTime = function (e) {
    var f = this.$D5.getTextureResourceId(0);
    var c = this.getVideoTexture();
    var d = c.$c7;
    if (!d) {
        return
    }
    if (e > d.duration * 1000) {
        e = d.duration * 1000
    }
    if (e < 0) {
        e = 0
    }
    function a() {
        d.currentTime = e / 1000;
        d.removeEventListener("canplaythrough", a, false)
    }

    if (d.readyState === 0) {
        d.addEventListener("canplaythrough", a, false)
    } else {
        a()
    }
};
okVideoEntity.prototype.getTime = function () {
    var a = this.getVideo();
    if (!a) {
        return -1
    }
    return a.currentTime * 1000
};
okVideoEntity.prototype.getVideoLength = function () {
    var a = this.getVideo();
    if (!a) {
        return -1
    }
    return a.duration * 1000
};
okVideoEntity.prototype.enableMute = function (a) {
    var c = this.getVideo();
    if (!c) {
        return
    }
    c.muted = a
};
okVideoEntity.prototype.isMute = function () {
    var a = this.getVideo();
    if (!a) {
        return true
    }
    return a.muted
};
okVideoEntity.prototype.pause = function (c) {
    if (c == false) {
        this.play();
        return
    }
    var d = this.getVideo();
    if (!d) {
        return
    }
    function a() {
        d.pause();
        d.removeEventListener("canplaythrough", a, false)
    }

    if (d.readyState === 0) {
        d.addEventListener("canplaythrough", a, false)
    } else {
        a()
    }
};
okVideoEntity.prototype.stop = function () {
    var d = this.getVideo();
    if (!d) {
        return
    }
    var c = this.getVideoLength();

    function a() {
        d.pause();
        d.currentTime = c / 1000;
        d.removeEventListener("canplaythrough", a, false)
    }

    if (d.readyState === 0) {
        d.addEventListener("canplaythrough", a, false)
    } else {
        a()
    }
};
okVideoEntity.prototype.play = function () {
    var c = this.getVideo();
    if (!c) {
        return
    }
    function a() {
        c.play();
        c.removeEventListener("canplaythrough", a, false)
    }

    if (c.readyState === 0) {
        c.addEventListener("canplaythrough", a, false)
    } else {
        a()
    }
};
okVideoEntity.prototype.getMaterial = function () {
    return this.$D5
};
okVideoEntity.prototype.getMesh = function () {
    return this.$C5
};
okVideoEntity.prototype.getBoundingBox = function (a) {
    if (a == 2) {
        if (this.$t2) {
            this.$E5.setMin(this.$R2.vMin);
            this.$E5.setMax(this.$R2.vMax);
            this.$E5.setMat(this.$n5);
            this.$t2 = false
        }
        return this.$E5
    } else {
        if (this.$W1) {
            this.$R2.clone(this.$P2);
            this.$P2.transformMat(this.$n5);
            this.$W1 = false
        }
        return this.$P2
    }
};
okVideoEntity.prototype.genRenderBatch = function (d, l) {
    var a = l.$U2;
    if (this.$y3 > 0) {
        var h = a.getPos();
        var o = (h.x - this.$n5.m03) * (h.x - this.$n5.m03) + (h.y - this.$n5.m13) * (h.y - this.$n5.m13) + (h.z - this.$n5.m23) * (h.z - this.$n5.m23);
        if (o > this.$y3 * this.$y3) {
            return
        }
    }
    var c = this.$U5;
    var e = this.$C5;
    var p = this.$D5;
    var m = okA.renderBatch();
    var s = p.getTextureResourceId(0);
    if (s != -1) {
        var k = c.getResource(s);
        if (k && k.isVideoTexture()) {
            curTime = new Date();
            var q = curTime.getTime() - this.$a5.getTime();
            if (q >= 1000 / 24) {
                this.$a5 = new Date();
                k.updateVideoTexture()
            }
        }
    }
    m.$a = e._getAttribFmt();
    if (p.$O2 && e.$H.Wireframe) {
        m.$95 = e.$H.Wireframe;
        m.$r4 = 1;
        m.$s4 = 0;
        m.$q4 = m.$95.getLength()
    } else {
        m.$95 = e.$H.Default;
        m.$r4 = 4;
        m.$s4 = 0;
        m.$q4 = m.$95.getLength()
    }
    m.$A5 = p;
    var f = this.getMat4();
    if (this.$C2) {
        f.m03 += a.$i5.m03;
        f.m13 += a.$i5.m13;
        f.m23 += a.$i5.m23
    }
    m.$p5 = okA.mat4();
    m.$r5 = okA.mat4();
    m.$n5 = f;
    m.$q5 = this.getNormalMat4();
    m.$t = this.$u;
    m.$61 = this.$71;
    m.$p1 = this.$q1;
    var n = new okAABBox();
    this.getBoundingBox().clone(n);
    m.$S2 = n;
    m.$B4 = this.$B4;
    d.push(m)
};
function okLightEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = (4 | 8 | 16);
    this.$M2 = true;
    this.$27 = new okVec3(1, 1, 1);
    this.$l3 = 1;
    this.$22 = false;
    this.$87 = new okVec3(0.5, 0.5, 0.5);
    this.$O4 = 3;
    this.$t3 = 0.06;
    this.$P = okA.object();
    this.$P[1] = true;
    this.$6 = okA.array()
}
okExtend(okLightEntity, okBaseEntity);
okLightEntity.prototype.clear = function () {
    this.$M2 = true;
    this.$27 = new okVec3(1, 1, 1);
    this.$l3 = 1;
    if (this.$22) {
        this.$e7.$c4 -= 1
    }
    this.$22 = false;
    this.$87.set(0.5, 0.5, 0.5);
    this.$O4 = 3;
    this.$t3 = 0.006;
    this.$P = okA.object();
    this.$P[1] = true;
    this.clearAffectEntity();
    okBaseCall(this, "clear")
};
okLightEntity.prototype.addAffectEntity = function (a) {
    this.$6.push(a)
};
okLightEntity.prototype.removeAffectEntity = function (c) {
    var a = this.$6.length;
    for (var d = 0; d < a; ++d) {
        if (this.$6[d] == c) {
            this.$6[d] = this.$6[a - 1];
            this.$6.pop();
            return
        }
    }
};
okLightEntity.prototype.findAffectEntity = function (c) {
    var a = this.$6.length;
    for (var d = 0; d < a; ++d) {
        if (this.$6[d] == c) {
            return true
        }
    }
    return false
};
okLightEntity.prototype.clearAffectEntity = function () {
    this.$6.length = 0
};
okLightEntity.prototype.enableVisible = function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][" + this.__getTypeString() + ".enableVisible][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$M2 = a
};
okLightEntity.prototype.isVisible = function () {
    return this.$M2
};
okLightEntity.prototype.enableCastShadow = function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][" + this.__getTypeString() + ".enableCastShadow][Id: " + this.getId() + "] Invalid parameter!")
    }
    if (a != this.$22) {
        if (a) {
            this.$e7.$c4 += 1
        } else {
            this.$e7.$c4 -= 1
        }
        this.$22 = a
    }
};
okLightEntity.prototype.isCastShadow = function () {
    return this.$22
};
okLightEntity.prototype.setShadowColor = function (d, c, a) {
    okLog("[Warning][" + this.__getTypeString() + ".setShadowColor][Id: " + this.getId() + "] This function is deprecated and it won't affect anything!");
    if (c == null) {
        d.clone(this.$87)
    } else {
        this.$87.set(d, c, a)
    }
};
okLightEntity.prototype.setShadowFade = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setShadowFade][Id: " + this.getId() + "] Invalid parameter!")
    }
    this.$t3 = a
};
okLightEntity.prototype.getShadowFade = function () {
    return this.$t3
};
okLightEntity.prototype.setColor = function (d, c, a) {
    if (c == null) {
        if (d == null || d.__isVec3Complete == null || !d.__isVec3Complete()) {
            okLog("[Error][" + this.__getTypeString() + ".setColor][Id: " + this.getId() + "] Invalid color!")
        }
        d.x = (d.x > 1 ? 1 : d.x);
        d.x = (d.x < 0 ? 0 : d.x);
        d.y = (d.y > 1 ? 1 : d.y);
        d.y = (d.y < 0 ? 0 : d.y);
        d.z = (d.z > 1 ? 1 : d.z);
        d.z = (d.z < 0 ? 0 : d.z);
        d.clone(this.$27)
    } else {
        if (d == null || c == null || a == null || !okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a)) {
            okLog("[Error][" + this.__getTypeString() + ".setColor][Id: " + this.getId() + "] Invalid color!")
        }
        d = (d > 1 ? 1 : d);
        d = (d < 0 ? 0 : d);
        c = (c > 1 ? 1 : c);
        c = (c < 0 ? 0 : c);
        a = (a > 1 ? 1 : a);
        a = (a < 0 ? 0 : a);
        this.$27.set(d, c, a)
    }
};
okLightEntity.prototype.getColor = function () {
    return this.$27.clone()
};
okLightEntity.prototype.setIntensity = function (a) {
    if (!okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setIntensity][Id: " + this.getId() + "] Invalid intensity!")
    }
    this.$l3 = (a < 0 ? 0 : a)
};
okLightEntity.prototype.getIntensity = function () {
    return this.$l3
};
okLightEntity.prototype.isAffectEntity = function (a) {
    return true
};
okLightEntity.prototype.enableLightGroup = function (a, c) {
    this.$P[a] = c
};
okLightEntity.prototype.isLightGroupEnabled = function (a) {
    return this.$P[a] == true
};
function okDctLightEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 4
}
okExtend(okDctLightEntity, okLightEntity);
okDctLightEntity.prototype.clear = function () {
    okBaseCall(this, "clear")
};
okDctLightEntity.prototype.setLightDir = function (e, d, c) {
    var a = okA.vec3();
    if (d == null) {
        if (e == null || e.__isVec3Complete == null || !e.__isVec3Complete()) {
            okLog("[Error][" + this.__getTypeString() + ".setLightDir][Id: " + this.getId() + "] Invalid light direction!")
        }
        a.x = -e.x;
        a.y = -e.y;
        a.z = -e.z
    } else {
        if (e == null || d == null || c == null || !okIsNumber(e) || !okIsNumber(d) || !okIsNumber(c)) {
            okLog("[Error][" + this.__getTypeString() + ".setLightDir][Id: " + this.getId() + "] Invalid light direction!")
        }
        a.x = -e;
        a.y = -d;
        a.z = -c
    }
    this.setDir(3, a);
    okA._vec3(a)
};
okDctLightEntity.prototype.getLightDir = function () {
    var a = this.$n5.getColumn(2);
    a.x = -a.x;
    a.y = -a.y;
    a.z = -a.z;
    a.normalize(true);
    return a
};
function okPointLightEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 8;
    this.$q3 = 10
}
okExtend(okPointLightEntity, okLightEntity);
okPointLightEntity.prototype.clear = function () {
    this.$q3 = 10;
    okBaseCall(this, "clear")
};
okPointLightEntity.prototype.setRange = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setRange][Id: " + this.getId() + "] Invalid range!")
    }
    this.$q3 = a;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$e7.dirtyEntity(this)
};
okPointLightEntity.prototype.getRange = function () {
    return this.$q3
};
okPointLightEntity.prototype.isAffectEntity = function (c) {
    var a = c.getBoundingSphereCenter();
    var f = this.$n5.getColumn(3);
    var e = (a.x - f.x) * (a.x - f.x) + (a.y - f.y) * (a.y - f.y) + (a.z - f.z) * (a.z - f.z);
    var h = this.$q3 + c.getBoundingSphereRadius();
    okA._vec3(a);
    okA._vec3(f);
    return(e <= h * h)
};
function okSpotLightEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 16;
    this.$n5.identity();
    this.$n5.setColumn(0, 1, 0, 0);
    this.$n5.setColumn(1, 0, 0, -1);
    this.$n5.setColumn(2, 0, 1, 0);
    this.$q3 = 10;
    this.$k3 = Math.PI * 60 / 180;
    this.$o3 = Math.PI * 75 / 180;
    this.$H3 = new okFrustum();
    this.$h2 = true
}
okExtend(okSpotLightEntity, okLightEntity);
okSpotLightEntity.prototype.clear = function () {
    this.$q3 = 10;
    this.$k3 = Math.PI * 60 / 180;
    this.$o3 = Math.PI * 75 / 180;
    this.$h2 = true;
    okBaseCall(this, "clear")
};
okSpotLightEntity.prototype.setLightDir = function (e, d, c) {
    var a = okA.vec3();
    if (d == null) {
        if (e == null || e.__isVec3Complete == null || !e.__isVec3Complete()) {
            okLog("[Error][" + this.__getTypeString() + ".setLightDir][Id: " + this.getId() + "] Invalid light direction!")
        }
        a.x = -e.x;
        a.y = -e.y;
        a.z = -e.z
    } else {
        if (e == null || d == null || c == null || !okIsNumber(e) || !okIsNumber(d) || !okIsNumber(c)) {
            okLog("[Error][" + this.__getTypeString() + ".setLightDir][Id: " + this.getId() + "] Invalid light direction!")
        }
        a.x = -e;
        a.y = -d;
        a.z = -c
    }
    this.setDir(3, a);
    okA._vec3(a)
};
okSpotLightEntity.prototype.getLightDir = function () {
    var a = this.$n5.getColumn(2);
    a.x = -a.x;
    a.y = -a.y;
    a.z = -a.z;
    a.normalize(true);
    return a
};
okSpotLightEntity.prototype.setRange = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setRange][Id: " + this.getId() + "] Invalid range!")
    }
    this.$q3 = a;
    this.$W1 = true;
    this.$t2 = true;
    this.$Y1 = true;
    this.$h2 = true;
    this.$e7.dirtyEntity(this)
};
okSpotLightEntity.prototype.getRange = function () {
    return this.$q3
};
okSpotLightEntity.prototype.setInnerCone = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setInnerCone][Id: " + this.getId() + "] Invalid angle!")
    }
    if (a < 0 || a > 90) {
        okLog("[Warning][" + this.__getTypeString() + ".setInnerCone][Id: " + this.getId() + "] Angle should be between [0, 90]!")
    }
    var c = a * Math.PI / 180;
    this.$k3 = c;
    this.$h2 = true
};
okSpotLightEntity.prototype.getInnerCone = function () {
    return this.$k3 * 180 / Math.PI
};
okSpotLightEntity.prototype.setOuterCone = function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][" + this.__getTypeString() + ".setOuterCone][Id: " + this.getId() + "] Invalid angle!")
    }
    if (a < 0 || a > 90) {
        okLog("[Warning][" + this.__getTypeString() + ".setOuterCone][Id: " + this.getId() + "] Angle should be between [0, 90]!")
    }
    var c = a * Math.PI / 180;
    this.$o3 = c;
    this.$h2 = true
};
okSpotLightEntity.prototype.getOuterCone = function () {
    return this.$o3 * 180 / Math.PI
};
okSpotLightEntity.prototype.getLightFrustum = function () {
    if (this.$h2) {
        var c = okMat4Proj(this.$o3 * 180 / Math.PI, 1, 0.01, this.$q3);
        var d = this.getInvMat4();
        var a = okMat4Mul(c, d);
        this.$H3.setByViewProjMat(a);
        this.$h2 = false
    }
    return this.$H3
};
okSpotLightEntity.prototype.isAffectEntity = function (a) {
    return(this.getLightFrustum().collideAABBox(a.getBoundingBox()) != 0)
};
okSpotLightEntity.prototype.dirtyMatFunc = function () {
    this.$h2 = true
};
function okConfigEntity(a) {
    okBaseCall(this, a);
    this.$Z4 = 512;
    this.$97 = new okVec3(0.3, 0.3, 0.3);
    this.$77 = new okVec3(0.3, 0.3, 0.3);
    this.$z2 = true;
    this.$g2 = false;
    this.$57 = new okVec3(1, 1, 1);
    this.$e3 = 3.5;
    this.$g3 = 0.1;
    this.$f3 = 1
}
okExtend(okConfigEntity, okBaseEntity);
okConfigEntity.prototype.setSkyColor = function (c, a, d) {
    if (fY != null) {
        this.$97.set(c, a, d)
    } else {
        c.clone(this.$97)
    }
};
okConfigEntity.prototype.getSkyColor = function () {
    return this.$97
};
okConfigEntity.prototype.setGroundColor = function (c, a, d) {
    if (fY != null) {
        this.$77.set(c, a, d)
    } else {
        c.clone(this.$77)
    }
};
okConfigEntity.prototype.getGroundColor = function () {
    return this.$77
};
okConfigEntity.prototype.enableShadow = function (a) {
    this.$z2 = a
};
okConfigEntity.prototype.isShadowEnabled = function () {
    return this.$z2
};
okConfigEntity.prototype.enableFog = function (c, a) {
    this.$g2 = a
};
okConfigEntity.prototype.isFogEnabled = function (a) {
    return this.$g2
};
okConfigEntity.prototype.setFogColor = function (e, c, a, d) {
    if (fY == null) {
        this.$57.x = c.x;
        this.$57.y = c.y;
        this.$57.z = c.z
    } else {
        this.$57.x = c;
        this.$57.y = a;
        this.$57.z = d
    }
};
okConfigEntity.prototype.getFogColor = function (a) {
    var c = okA.vec3();
    return this.$57.clone(c)
};
okConfigEntity.prototype.setFogDistanceNear = function (c, a) {
    this.$g3 = Math.max(0.001, a)
};
okConfigEntity.prototype.setFogDistanceFar = function (c, a) {
    this.$f3 = Math.max(0.001, a)
};
okConfigEntity.prototype.getFogDistanceNear = function (a) {
    return this.$g3
};
okConfigEntity.prototype.getFogDistanceFar = function (a) {
    return this.$f3
};
okConfigEntity.prototype.setFogDensity = function (c, a) {
    this.$e3 = a
};
okConfigEntity.prototype.getFogDensity = function (a) {
    return this.$e3
};
function okSceneNode() {
    this.$F5 = null;
    this.$K4 = -1;
    this.$o = [null, null, null, null, null, null, null, null];
    this.$d4 = 0;
    this.$P2 = okA.aabbox();
    this.$n = [okA.aabbox(), okA.aabbox(), okA.aabbox(), okA.aabbox(), okA.aabbox(), okA.aabbox(), okA.aabbox(), okA.aabbox()];
    this.$z = okA.array();
    this.$E4 = 0
}
okSceneNode.prototype = {clear:function () {
    this.$F5 = null;
    this.$K4 = -1;
    for (var a = 0; a < 8; ++a) {
        if (this.$o[a]) {
            this.deleteChild(a)
        }
    }
    this.$P2.set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[0].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[1].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[2].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[3].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[4].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[5].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[6].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$n[7].set(OAK.VEC3_ZERO, OAK.VEC3_ZERO);
    this.$z.length = 0;
    this.$E4 = 0
}, setBoundingBox:function (c) {
    c.clone(this.$P2);
    var h = (c.vMin.x + c.vMax.x) * 0.5;
    var e = (c.vMin.y + c.vMax.y) * 0.5;
    var d = (c.vMin.z + c.vMax.z) * 0.5;
    var f = okA.vec3();
    var a = okA.vec3();
    f.x = c.vMin.x;
    f.y = c.vMin.y;
    f.z = c.vMin.z;
    a.x = h;
    a.y = e;
    a.z = d;
    this.$n[0].set(f, a);
    f.x = h;
    f.y = c.vMin.y;
    f.z = c.vMin.z;
    a.x = c.vMax.x;
    a.y = e;
    a.z = d;
    this.$n[1].set(f, a);
    f.x = c.vMin.x;
    f.y = c.vMin.y;
    f.z = d;
    a.x = h;
    a.y = e;
    a.z = c.vMax.z;
    this.$n[2].set(f, a);
    f.x = h;
    f.y = c.vMin.y;
    f.z = d;
    a.x = c.vMax.x;
    a.y = e;
    a.z = c.vMax.z;
    this.$n[3].set(f, a);
    f.x = c.vMin.x;
    f.y = e;
    f.z = c.vMin.z;
    a.x = h;
    a.y = c.vMax.y;
    a.z = d;
    this.$n[4].set(f, a);
    f.x = h;
    f.y = e;
    f.z = c.vMin.z;
    a.x = c.vMax.x;
    a.y = c.vMax.y;
    a.z = d;
    this.$n[5].set(f, a);
    f.x = c.vMin.x;
    f.y = e;
    f.z = d;
    a.x = h;
    a.y = c.vMax.y;
    a.z = c.vMax.z;
    this.$n[6].set(f, a);
    f.x = c.vMin.x;
    f.y = e;
    f.z = d;
    a.x = c.vMax.x;
    a.y = c.vMax.y;
    a.z = c.vMax.z;
    this.$n[7].set(f, a);
    okA._vec3(f);
    okA._vec3(a)
}, createChild:function (a) {
    if (this.$o[a] != null) {
        return this.$o[a]
    }
    var c = okA.sceneNode();
    c.$F5 = this;
    c.$K4 = a;
    c.$E4 = this.$E4 + 1;
    c.setBoundingBox(this.$n[a]);
    this.$o[a] = c;
    this.$d4 += 1;
    return this.$o[a]
}, deleteChild:function (a) {
    if (this.$o[a] != null) {
        this.$o[a].clear();
        okA._sceneNode(this.$o[a]);
        this.$o[a] = null;
        this.$d4 -= 1
    }
}, getChild:function (a) {
    return this.$o[a]
}, getChildNum:function () {
    return this.$d4
}, attachEntity:function (a) {
    if (a == null) {
        alert(0)
    }
    this.$z.push(a)
}, removeEntity:function (c) {
    var a = this.$z.length;
    for (var d = 0; d < a; ++d) {
        if (this.$z[d] == c) {
            this.$z[d] = this.$z[a - 1];
            this.$z.pop();
            break
        }
    }
}, getEntityNum:function () {
    return this.$z.length
}, getBoundingBox:function () {
    return this.$P2
}, traverseTree:function (e) {
    var a = new Array;
    a.push(this);
    while (a.length != 0) {
        var d = a.shift();
        for (var c = 0; c < 8; ++c) {
            if (d.$o[c] != null) {
                a.push(d.$o[c])
            }
        }
        e(d)
    }
}};
function okSceneZone(a) {
    this.$e6 = "";
    this.$I6 = a;
    this.$H4 = 4;
    this.$w4 = 16;
    this.$X5 = okA.sceneNode();
    this.$A = new okCollection();
    this.$R = new okList();
    this.$c4 = 0;
    this.$b4 = 0;
    this.$D = new Object;
    this.$v = new Object;
    this.$A1 = new okList();
    this.$k4 = 0
}
okSceneZone.prototype = {clear:function () {
    this.$H4 = 4;
    this.$w4 = 1;
    this.$X5.clear();
    this.$R.clear();
    okA._object(this.$v);
    this.$v = okA.object();
    this.$A1.clear();
    this.$A.resetIterator();
    var a;
    while (a = this.$A.iterate()) {
        a.clear()
    }
    this.$A.clear();
    this.$D = new Object
}, setName:function (a) {
    this.$e6 = a
}, getName:function (a) {
    return this.$e6
}, getScene:function () {
    return this.$I6
}, getRootNode:function () {
    return this.$X5
}, setBoundingBox:function (c) {
    this.$X5.clear();
    this.$X5.setBoundingBox(c);
    this.$A.resetIterator();
    var a;
    while (a = this.$A.iterate()) {
        a.__aSceneNodes.length = 0;
        this.$v[a.getId()] = a
    }
}, getBoundingBox:function () {
    return this.$X5.getBoundingBox()
}, setMaxLevel:function (a) {
    this.$H4 = a
}, getMaxLevel:function () {
    return this.$H4
}, setGranularity:function (a) {
    this.$w4 = a
}, getGranularity:function () {
    return this.$w4
}, createEntity:function (f) {
    if (f != 1 && f != 2 && f != 256 && f != 32 && f != 128 && f != 4 && f != 8 && f != 16 && f != 64) {
        okLog("[Error][okScene.createEntity] Invalid entity type!")
    }
    var c = null;
    switch (f) {
        case 1:
            c = new okStaticEntity(this);
            break;
        case 2:
            c = new okDynamicEntity(this);
            break;
        case 256:
            c = new okParticleEntity(this);
            break;
        case 32:
            c = new okTerrainEntity(this);
            break;
        case 128:
            c = new okVideoEntity(this);
            break;
        case 4:
            c = new okDctLightEntity(this);
            this.$R.pushBack(c);
            break;
        case 8:
            c = new okPointLightEntity(this);
            this.$R.pushBack(c);
            break;
        case 16:
            c = new okSpotLightEntity(this);
            this.$R.pushBack(c);
            break;
        case 64:
            c = new okCustomMeshEntity(this);
            break;
        case 512:
            c = new okConfigEntity(this);
            break
    }
    c.setId(this.$A.add(c));
    c.__iSceneVisitFlag = -1;
    if ((f & (1 | 2 | 32 | 64 | 128 | 256)) != 0) {
        c.__aSceneNodes = okA.array();
        this._addEntityToTree(this.$X5, c)
    }
    if ((f & (2 | 256)) != 0) {
        this.$A1.pushBack(c)
    }
    if ((f & (1 | 2 | 32 | 64 | 128 | 256)) != 0) {
        var e = this.$R.getRoot();
        while (e) {
            var a = e.data;
            if (a.isAffectEntity(c)) {
                c.addLight(a)
            }
            a.addAffectEntity(c);
            e = e.next
        }
    } else {
        if ((f & (4 | 8 | 16)) != 0) {
            var a = c;
            this.$A.resetIterator();
            var d;
            while (d = this.$A.iterate()) {
                if (((d.$Z4 & (1 | 2 | 32 | 64 | 128 | 256)) != 0) && a.isAffectEntity(d)) {
                    d.addLight(a);
                    a.addAffectEntity(d)
                }
            }
        }
    }
    return c
}, deleteEntity:function (d) {
    if (d == null) {
        okLog("[Error][okScene.deleteEntity] Entity is null!")
    }
    var h = d;
    if (okIsNumber(d)) {
        h = this.$A.getDataByIndex(d)
    } else {
        if (okIsString(d)) {
            this.$A.resetIterator();
            var m;
            while (m = this.$A.iterate()) {
                if (m.$e6 == d) {
                    h = m;
                    break
                }
            }
        }
    }
    h.clear();
    if ((h.$Z4 & (4 | 8 | 16)) != 0) {
        var a = h;
        var c = a.$6.length;
        for (var f = 0; f < c; ++f) {
            a.$6[f].removeLight(a)
        }
        a.clearAffectEntity();
        this.$R.remove(this.$R.find(a))
    } else {
        if ((h.$Z4 & (1 | 2 | 32 | 64 | 128 | 256)) != 0) {
            this._removeEntityFromTree(h)
        }
        var k = h.$u.length;
        for (var f = 0; f < k; ++f) {
            h.$u[f].removeAffectEntity(h)
        }
        var l = h.$71.length;
        for (var f = 0; f < l; ++f) {
            h.$71[f].removeAffectEntity(h)
        }
        var e = h.$q1.length;
        for (var f = 0; f < e; ++f) {
            h.$q1[f].removeAffectEntity(h)
        }
        h.clearLight()
    }
    if (this.$v[h.getId()] != null) {
        delete this.$v[h.getId()]
    }
    if ((h.$Z4 & (2 | 256)) != 0) {
        this.$A1.remove(this.$A1.find(h))
    }
    this.$A.removeByIndex(h.getId())
}, getEntity:function (a) {
    if (okIsNumber(a)) {
        return this.$A.getDataByIndex(a)
    } else {
        if (okIsString(a)) {
            this.$A.resetIterator();
            var c;
            while (c = this.$A.iterate()) {
                if (c.$e6 == a) {
                    return c
                }
            }
        }
    }
    return null
}, getEntityArray:function (d, e, c) {
    d = ((d != null) ? d : okA.array());
    e = ((e != null) ? e : -1);
    this.$A.resetIterator();
    var a;
    while (a = this.$A.iterate()) {
        if (e & a.$Z4) {
            if (c && !c(a)) {
                continue
            }
            d.push(a)
        }
    }
    return d
}, dirtyEntity:function (a) {
    var c = a.getId();
    if (this.$v[c] == null) {
        this.$v[c] = a
    }
}, forceVisibleEntity:function (a, c) {
    if (c) {
        this.$D[a.getId()] = a.getId()
    } else {
        if (this.$D[a.getId()]) {
            delete this.$D[a.getId()]
        }
    }
}, cullByFrustum:function (l, a, p, o, d) {
    if (l == null || !l.__isFrustumComplete()) {
        okLog("[Error][okScene.cullByFrustum] Invalid frustum!")
    }
    if (a == null || !okIsArray(a)) {
        okLog("[Error][okScene.cullByFrustum] No array to contain the returnning entities!")
    }
    this._upDE();
    if (p == null) {
        p = -1
    }
    if (d == null) {
        d = 1
    }
    this.$k4 += 1;
    var n = [this.$X5];
    while (n.length != 0) {
        var c = n.shift();
        var h = c.$z.length;
        for (var e = 0; e < h; ++e) {
            var f = c.$z[e];
            if (f.__iSceneVisitFlag < this.$k4 && (f.$Z4 & p) && (o == null || o(f)) && (f.getState() != 1)) {
                var k = false;
                if (d == 1) {
                    k = l.collideAABBox(f.getBoundingBox(d))
                } else {
                    k = l.collideOBBox(f.getBoundingBox(d))
                }
                if (k != 0) {
                    a.push(f)
                }
                f.__iSceneVisitFlag = this.$k4
            }
        }
        for (var e = 0; e < 8; ++e) {
            if (c.$o[e] == null) {
                continue
            }
            var m = l.collideAABBox(c.$n[e]);
            if (m == 1) {
                n.push(c.$o[e])
            } else {
                if (m == 2) {
                    this._dumpTree(c.$o[e], a)
                }
            }
        }
    }
}, pick:function (p, h, s, o, c) {
    if (p == null || h == null || !p.__isVec3Complete() || !h.__isVec3Complete() || Math.abs(h.len()) < 0.000001) {
        okLog("[Error][okScene.pick] Invalid picking ray!")
    }
    if (s == null) {
        s = -1
    }
    if (c == null) {
        c = 1
    }
    this._upDE();
    this.$k4 += 1;
    var k = null;
    var q = 10000000000;
    var n = new Object;
    var m = [this.$X5];
    while (m.length != 0) {
        var a = m.shift();
        var f = a.$z.length;
        for (var d = 0; d < f; ++d) {
            var e = a.$z[d];
            if (e.__iSceneVisitFlag < this.$k4 && e.getState() != 1 && (e.$Z4 & s) && (o == null || o(e))) {
                if (e.getBoundingBox(c).collideRay(p, h, n) != 0) {
                    if (n.fT0 > 0 && n.fT0 < q) {
                        k = e;
                        q = n.fT0
                    }
                }
                e.__iSceneVisitFlag = this.$k4
            }
        }
        for (var d = 0; d < 8; ++d) {
            if (a.$o[d] == null) {
                continue
            }
            var l = a.$n[d].collideRay(p, h);
            if (l != 0) {
                m.push(a.$o[d])
            }
        }
    }
    return k
}, update:function (a) {
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okScene.update] Invalid time!")
    }
    var c = this.$A1.getRoot();
    while (c) {
        c.data.update(a);
        c = c.next
    }
}, _visCull:function (x, J) {
    this._upDE();
    this.$k4 += 1;
    for (var m in this.$D) {
        var I = this.getEntity(this.$D[m]);
        I.__iSceneVisitFlag += 1;
        J.push(I)
    }
    var l = x.getFrustum();
    var d = x.getPos();
    var c = x.getForwardDir();
    var E = x.getUpDir();
    var G = x.getRightDir();
    var H = x.getVisibleFar();
    var h = x.getViewportWidth() / x.getViewportHeight();
    var a = x.getFov() * Math.PI / 360;
    var w = Math.tan(a);
    var o = Math.cos(a);
    var q = Math.cos(Math.atan(w * h));
    var C = x.getProjMode();
    var v, u;
    if (C) {
        v = h * w;
        u = w
    } else {
        v = x.getViewportWidth() / x.getViewportHeight();
        u = 1
    }
    var K = okA.array();
    K.push(this.$X5);
    while (K.length != 0) {
        var D = K.shift();
        var f = D.$z.length;
        for (var F = 0; F < f; ++F) {
            var y = D.$z[F];
            if (y.__iSceneVisitFlag < this.$k4) {
                if (y.getState() != 1) {
                    var B = false;
                    var k = y.getBoundingSphereCenter();
                    k.x -= d.x;
                    k.y -= d.y;
                    k.z -= d.z;
                    var L = y.getBoundingSphereRadius();
                    var t = G.x * k.x + G.y * k.y + G.z * k.z;
                    var s = E.x * k.x + E.y * k.y + E.z * k.z;
                    var p = c.x * k.x + c.y * k.y + c.z * k.z;
                    if (C) {
                        var A = L / q;
                        var z = L / o;
                        if (t >= -p * v - A && t <= p * v + A && s >= -p * u - z && s <= p * u + z && p >= -L && p <= H + L) {
                            B = true
                        }
                    } else {
                        if (t >= -v - L && t <= v + L && s >= -u - L && s <= u + L && p >= -L && p <= H + L) {
                            B = true
                        }
                    }
                    okA._vec3(k);
                    if (B) {
                        if (y.$Z4 != 32) {
                            J.push(y)
                        } else {
                            if (y.cullByFrustum(l) != 0) {
                                J.push(y)
                            }
                        }
                    }
                }
                y.__iSceneVisitFlag = this.$k4
            }
        }
        for (var F = 0; F < 8; ++F) {
            if (D.$o[F] == null) {
                continue
            }
            var n = l.collideAABBox(D.$n[F]);
            if (n == 1) {
                K.push(D.$o[F])
            } else {
                if (n == 2) {
                    this._dumpTree(D.$o[F], J)
                }
            }
        }
    }
    okA._array(K);
    okA._vec3(d);
    okA._vec3(c);
    okA._vec3(E);
    okA._vec3(G)
}, _logTree:function (d) {
    this._upDE();
    var a = new Array;
    a.push((d != null) ? d : this.$X5);
    while (a.length != 0) {
        var h = a.pop();
        var k = "";
        for (var f = 0; f < h.$E4; ++f) {
            k += "________"
        }
        k += "[Min:" + h.$P2.vMin.x + "," + h.$P2.vMin.y + "," + h.$P2.vMin.z + "  Max:" + h.$P2.vMax.x + "," + h.$P2.vMax.y + "," + h.$P2.vMax.z + "]";
        k += "[E:";
        var e = true;
        var c = h.$z.length;
        for (var f = 0; f < c; ++f) {
            if (!e) {
                k += ","
            }
            e = false;
            k += h.$z[f].getId()
        }
        k += "]";
        window.console.log(k);
        for (var f = 0; f < h.$o.length; ++f) {
            if (h.$o[f] != null) {
                a.push(h.$o[f])
            }
        }
    }
}, _addEntityToTree:function (d, a) {
    var f = a.getBoundingBox();
    if (d.$E4 == this.$H4 || f.collideAABBox(d.$P2) != 1) {
        d.attachEntity(a);
        a.__aSceneNodes.push(d);
        return
    } else {
        if (d.$z.length <= this.$w4 && d.getChildNum() == 0) {
            d.attachEntity(a);
            a.__aSceneNodes.push(d);
            if (d.$z.length > this.$w4) {
                this._splitNode(d)
            }
            return
        }
    }
    for (var c = 0; c < 8; ++c) {
        var e = d.$n[c].collideAABBox(f);
        if (e == 1) {
            this._addEntityToTree(d.createChild(c), a)
        } else {
            if (e == 2) {
                this._addEntityToTree(d.createChild(c), a);
                break
            }
        }
    }
}, _splitNode:function (c) {
    var m = okA.array();
    var k = c.$z.length;
    for (var d = 0; d < k; ++d) {
        var h = c.$z[d];
        var n = h.getBoundingBox();
        if (n.collideAABBox(c.$P2) != 1) {
            m.push(h)
        } else {
            var a = h.__aSceneNodes.length;
            for (var f = 0; f < a; ++f) {
                if (h.__aSceneNodes[f] == c) {
                    h.__aSceneNodes[f] = h.__aSceneNodes[a - 1];
                    h.__aSceneNodes.pop();
                    break
                }
            }
            c.$z[d] = c.$z[k - 1];
            c.$z.pop();
            k -= 1;
            --d;
            for (var e = 0; e < 8; ++e) {
                var l = c.$n[e].collideAABBox(n);
                if (l == 1) {
                    this._addEntityToTree(c.createChild(e), h)
                } else {
                    if (l == 2) {
                        this._addEntityToTree(c.createChild(e), h);
                        break
                    }
                }
            }
        }
    }
    okA._array(c.$z);
    c.$z = m
}, _removeEntityFromTree:function (c) {
    var a = c.__aSceneNodes.length;
    for (var e = 0; e < a; ++e) {
        var h = c.__aSceneNodes[e];
        h.removeEntity(c);
        if (h.$z.length == 0 && h.getChildNum() == 0) {
            var d = h;
            while (d != null) {
                var f = d.$F5;
                if (f != null) {
                    f.deleteChild(d.$K4);
                    if (f.getEntityNum() == 0 && f.getChildNum() == 0) {
                        d = f
                    } else {
                        d = null
                    }
                } else {
                    d = null
                }
            }
        }
    }
    c.__aSceneNodes.length = 0
}, _upDE:function () {
    var c = okA.array();
    for (var e in this.$v) {
        var a = this.$v[e];
        c.push(a);
        if ((a.$Z4 & (1 | 2 | 32 | 64 | 128 | 256)) != 0) {
            this._removeEntityFromTree(a)
        }
        delete this.$v[e]
    }
    var f = c.length;
    for (var d = 0; d < f; ++d) {
        var a = c[d];
        if ((a.$Z4 & (1 | 2 | 32 | 64 | 128 | 256)) != 0) {
            this._addEntityToTree(this.$X5, a)
        }
        this._evalLE(a)
    }
    okA._array(c)
}, _evalLE:function (d) {
    var h = d.getType();
    if ((h & (4 | 8 | 16)) != 0) {
        var c = d;
        var a = c.$6.length;
        for (var f = 0; f < a; ++f) {
            c.$6[f].removeLight(c)
        }
        c.clearAffectEntity();
        this.$A.resetIterator();
        var e;
        while (e = this.$A.iterate()) {
            if (((e.$Z4 & (1 | 2 | 32 | 64 | 128 | 256)) != 0) && c.isAffectEntity(e)) {
                e.addLight(c);
                c.addAffectEntity(e)
            }
        }
    } else {
        if ((h & (1 | 2 | 32 | 64 | 128 | 256)) != 0) {
            var k = d.$u.length;
            for (var f = 0; f < k; ++f) {
                d.$u[f].removeAffectEntity(d)
            }
            var k = d.$71.length;
            for (var f = 0; f < k; ++f) {
                d.$71[f].removeAffectEntity(d)
            }
            var k = d.$q1.length;
            for (var f = 0; f < k; ++f) {
                d.$q1[f].removeAffectEntity(d)
            }
            d.clearLight();
            lightNode = this.$R.getRoot();
            while (lightNode) {
                var c = lightNode.data;
                if (c.isAffectEntity(d)) {
                    d.addLight(c);
                    c.addAffectEntity(d)
                }
                lightNode = lightNode.next
            }
        }
    }
}, _dumpTree:function (f, h) {
    var k = okA.array();
    k.push(f);
    while (k.length != 0) {
        var e = k.shift();
        var a = e.$z.length;
        for (var d = 0; d < a; ++d) {
            var c = e.$z[d];
            if (c.__iSceneVisitFlag < this.$k4) {
                if (c.getState() != 1) {
                    h.push(c)
                }
                c.__iSceneVisitFlag = this.$k4
            }
        }
        for (var d = 0; d < 8; ++d) {
            if (e.$o[d] == null) {
                continue
            }
            k.push(e.$o[d])
        }
    }
    okA._array(k)
}};
function okScene(a, d) {
    this.$53 = d;
    this.$U5 = d.$U5;
    this.$e6 = a;
    this.$L1 = new Object;
    var c = new okSceneZone(this);
    c.setName("Default");
    this.$L1.Default = c;
    this.$16 = "";
    this.$d6 = "";
    this.$Z5 = "";
    this.$D6 = "";
    this.$F6 = "";
    this.$j = new okList()
}
okScene.prototype = {clear:function () {
    this.clearEntity();
    this.clearCamera()
}, clearEntity:function () {
    for (var a in this.$L1) {
        this.$L1[a].clear()
    }
    okA._object(this.$L1);
    this.$L1 = okA.object();
    var c = new okSceneZone(this);
    c.setName("Default");
    this.$L1.Default = c
}, clearCamera:function () {
    var a = this.$j.getRoot();
    while (a) {
        a.data.clear();
        a = a.next
    }
    this.$j.clear()
}, getName:function () {
    return this.$e6
}, setBaseUrl:function (a) {
    a = a.replace(/\\/g, "/");
    a = a.replace(/\/$/g, "");
    this.$16 = a
}, getBaseUrl:function (a) {
    return this.$16
}, setModelUrl:function (a) {
    a = a.replace(/\\/g, "/");
    a = a.replace(/\/$/g, "");
    this.$d6 = a
}, _packModelUrl:function (c) {
    c = c.replace(/\\/g, "/");
    c = c.replace(/^\/+/g, "");
    if (c.indexOf(":") != -1) {
        return c
    }
    var a = this.$16;
    a += ((a != "") ? ("/" + this.$d6) : this.$d6);
    a += ((a != "") ? ("/" + c) : c);
    return a
}, getModelUrl:function () {
    return this.$d6
}, setSkAnimationUrl:function (a) {
    a = a.replace(/\\/g, "/");
    a = a.replace(/\/$/g, "");
    this.$Z5 = a
}, getSkAnimationUrl:function () {
    return this.$Z5
}, _packSkAnimationUrl:function (c) {
    c = c.replace(/\\/g, "/");
    c = c.replace(/^\/+/g, "");
    if (c.indexOf(":") != -1) {
        return c
    }
    var a = this.$16;
    a += ((a != "") ? ("/" + this.$Z5) : this.$Z5);
    a += ((a != "") ? ("/" + c) : c);
    return a
}, setTerrainUrl:function (a) {
    a = a.replace(/\\/g, "/");
    a = a.replace(/\/$/g, "");
    this.$D6 = a
}, getTerrainUrl:function () {
    return this.$D6
}, _packTerrainUrl:function (c) {
    c = c.replace(/\\/g, "/");
    c = c.replace(/^\/+/g, "");
    if (c.indexOf(":") != -1) {
        return c
    }
    var a = this.$16;
    a += ((a != "") ? ("/" + this.$D6) : this.$D6);
    a += ((a != "") ? ("/" + c) : c);
    return a
}, setTextureUrl:function (a) {
    a = a.replace(/\\/g, "/");
    a = a.replace(/\/$/g, "");
    this.$F6 = a
}, getTextureUrl:function () {
    return this.$F6
}, _packTextureUrl:function (c) {
    c = c.replace(/\\/g, "/");
    c = c.replace(/^\/+/g, "");
    if (c.indexOf(":") != -1) {
        return c
    }
    var a = this.$16;
    a += ((a != "") ? ("/" + this.$F6) : this.$F6);
    a += ((a != "") ? ("/" + c) : c);
    return a
}, getZone:function (a) {
    return this.$L1[(a != null) ? a : "Default"]
}, setZoneBoundingBox:function (e, c, d) {
    var a = this.$L1[(d != null) ? d : "Default"];
    a.setBoundingBox(new okAABBox(e, c))
}, getZoneBoundingBox:function (c) {
    var a = this.$L1[(c != null) ? c : "Default"];
    return a.getBoundingBox()
}, setZoneGranularity:function (d, c) {
    var a = this.$L1[(c != null) ? c : "Default"];
    a.setGranularity(d)
}, getZoneGranularity:function (c) {
    var a = this.$L1[(c != null) ? c : "Default"];
    return a.getGranularity()
}, setZoneMaxLevel:function (c, d) {
    var a = this.$L1[(d != null) ? d : "Default"];
    a.setMaxLevel(c)
}, getZoneMaxLevel:function (c) {
    var a = this.$L1[(c != null) ? c : "Default"];
    return a.getMaxLevel()
}, createCamera:function (a) {
    if (a == null) {
        okLog("[Warning][okScene.createCamera] No camera name!")
    } else {
        if (!okIsString(a)) {
            okLog("[Error][okScene.createCamera] Invalid camera name!")
        }
    }
    var c = new okCamera(this.$U5.rc);
    c.$I6 = this;
    if (a != null) {
        c.setName(a)
    }
    this.$j.pushBack(c);
    return c
}, deleteCamera:function (c) {
    if (okIsString(c)) {
        var a = this.$j.getRoot();
        while (a) {
            if (a.data.getName() == c) {
                a.data.clear();
                this.$j.remove(a);
                return
            }
            a = a.next
        }
    } else {
        c.clear();
        this.$j.remove(this.$j.find(c))
    }
}, getCamera:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okScene.getCamera] Invalid camera name!")
    }
    var c = this.$j.getRoot();
    while (c) {
        if (c.data.getName() == a) {
            return c.data
        }
        c = c.next
    }
    return null
}, getCameraArray:function (c, a) {
    if (c == null) {
        c = okA.array()
    }
    var d = this.$j.getRoot();
    while (d) {
        if (a == null || a(d.data)) {
            c.push(d.data)
        }
        d = d.next
    }
    return c
}, createEntity:function (d, c, f) {
    if (c == null) {
        okLog("[Warning][okScene.createEntity] No entity name!")
    } else {
        if (!okIsString(c)) {
            okLog("[Error][okScene.createEntity] Invalid entity name!")
        }
    }
    var a = this.$L1[(f != null) ? f : "Default"];
    var h = a.createEntity(d);
    if (c) {
        h.setName(c)
    }
    return h
}, deleteEntity:function (c, d) {
    var a = this.$L1[(d != null) ? d : "Default"];
    return a.deleteEntity(c)
}, getEntity:function (c, d) {
    var a = this.$L1[(d != null) ? d : "Default"];
    return a.getEntity(c)
}, getEntityArray:function (d, f, c, e) {
    if (d == null) {
        d = okA.array()
    }
    var a = this.$L1[(e != null) ? e : "Default"];
    a.getEntityArray(d, f, c);
    return d
}, cullByFrustum:function (e, d, k, c, f, h) {
    var a = this.$L1[(h != null) ? h : "Default"];
    return a.cullByFrustum(e, d, k, c, f)
}, pick:function (d, k, h, c, e, f) {
    var a = this.$L1[(f != null) ? f : "Default"];
    return a.pick(d, k, h, c, e)
}, update:function (c, d) {
    var a = this.$L1[(d != null) ? d : "Default"];
    a.update(c)
}};
function okSceneManager(a, c) {
    this.$53 = c;
    this.aSceneList = new Object
}
okSceneManager.prototype = {clear:function () {
    for (var a in this.aSceneList) {
        this.aSceneList[a].clear()
    }
    okA._object(this.aSceneList);
    this.aSceneList = okA.object()
}, createScene:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okSceneManager.createScene] Invalid scene name!")
    }
    var c = this.aSceneList[a];
    if (!c) {
        c = new okScene(a, this.$53);
        this.aSceneList[a] = c
    }
    return c
}, deleteScene:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okSceneManager.deleteScene] Invalid scene name!")
    }
    var c = this.aSceneList[a];
    if (c) {
        c.clear();
        delete this.aSceneList[a]
    }
}, getScene:function (a) {
    if (a == null || !okIsString(a)) {
        okLog("[Error][okSceneManager.getScene] Invalid scene name!")
    }
    return this.aSceneList[a]
}};
function okResource() {
    this.$Z4 = 0;
    this.$c6 = null;
    this.$M4 = 0;
    this.$T4 = 1;
    this.$42 = false;
    this.$T = new okList();
    this.data = null
}
okResource.prototype = {clear:function () {
    if (this.data) {
        if (this.$Z4 == 1) {
            this.data.clear()
        } else {
            if (this.$Z4 == 2) {
                this.data.releaseTexture()
            } else {
                if (this.$Z4 == 3) {
                    this.data.clear()
                }
            }
        }
        this.data = null
    }
    this.$Z4 = 0;
    this.$c6 = null;
    this.$M4 = 0;
    this.$T4 = 1;
    this.$42 = false;
    this.$T.clear()
}};
function okResourceManager(a, c) {
    this.rc = c;
    this.$g1 = new okCollection();
    this.$L = new Object;
    this.bAsyncLoad = a.bAsyncLoad
}
okResourceManager.prototype = {clear:function () {
    this.$g1.resetIterator();
    var a;
    while (a = this.$g1.iterate()) {
        a.clear()
    }
    this.$g1.clear();
    okA._object(this.$L);
    this.$L = okA.object()
}, getResourceType:function (a) {
    if (!this.$g1.isIndexValid(a)) {
        return 0
    }
    return this.$g1.getDataByIndex(a).$Z4
}, getResourceState:function (a) {
    if (!this.$g1.isIndexValid(a)) {
        return 1
    }
    return this.$g1.getDataByIndex(a).$T4
}, getResourceNum:function () {
    return this.$g1.getSize()
}, setCustomResourceState:function (a, d) {
    if (!this.$g1.isIndexValid(a)) {
        return false
    }
    var c = this.$g1.getDataByIndex(a);
    if (!c.$42) {
        return false
    }
    c.$T4 = d;
    return true
}, createResource:function (e, h, f) {
    var a = this.$L[h];
    if (a != null) {
        var c = this.$g1.getDataByIndex(a);
        c.$M4 += 1;
        return a
    }
    var c = new okResource();
    c.$Z4 = e;
    c.$M4 = 1;
    c.$T4 = (f == true) ? 5 : 2;
    c.$c6 = h;
    c.$42 = f == true ? true : false;
    if (e == 1) {
        c.data = new okModel(this.rc)
    } else {
        if (e == 2) {
            c.data = new okTexture(this.rc)
        } else {
            if (e == 3) {
                c.data = new okSkAnimation()
            }
        }
    }
    var d = this.$g1.add(c);
    this.$L[h] = d;
    return d
}, getResource:function (c) {
    if (okIsNumber(c)) {
        if (c < 0) {
            return null
        }
        return this.$g1.getDataByIndex(c).data
    }
    var a = this.$L[c];
    if (a != null) {
        return this.$g1.getDataByIndex(a).data
    }
    return null
}, getResourceId:function (a) {
    if (this.$L[a] != null) {
        return this.$L[a]
    }
    return -1
}, deleteResource:function (c) {
    var d = null;
    var e = -1;
    if (okIsNumber(c)) {
        d = this.$g1.getDataByIndex(c);
        e = c
    } else {
        var a = this.$L[c];
        if (a != null) {
            d = this.$g1.getDataByIndex(a);
            e = a
        }
    }
    if (d) {
        d.$M4 -= 1;
        if (d.$M4 == 0) {
            this.postMessage(e, "RES_DELETED", [e]);
            delete this.$L[d.$c6];
            d.clear();
            this.$g1.removeByIndex(e)
        }
    }
}, registerListener:function (a, d) {
    if (this.$g1.isIndexValid(a)) {
        var c = this.$g1.getDataByIndex(a);
        if (c.$T.find(d) == null) {
            c.$T.pushBack(d)
        }
    }
}, removeListener:function (a, d) {
    if (this.$g1.isIndexValid(a)) {
        var c = this.$g1.getDataByIndex(a);
        c.$T.remove(c.$T.find(d))
    }
}, loadModelByUrl:function (c, d, f, a, h) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var e = this.$g1.getDataByIndex(c);
    if (e.$Z4 != 1 || e.$42) {
        return false
    }
    if (e.$T4 != 3) {
        e.$T4 = 3;
        var k = this;
        var l = okGenXmlHttpRequest();
        l.open("GET", d, this.bAsyncLoad && (h != true));
        l.overrideMimeType("text/plain; charset=x-user-defined");
        if (okIsIE()) {
            l.onreadystatechange = function () {
                if (l.readyState == 4) {
                    if (l.status == 200 || l.status == 0) {
                        var m = a;
                        if (m == null) {
                            var n = l.responseText.substr(0, 6);
                            if (n == "OKMDBI") {
                                m = 3
                            } else {
                                m = 1
                            }
                        }
                        if (okResourceParser.loadModel(m, e.data, l.responseText, f, true, true) == false) {
                            e.$T4 = 2;
                            return
                        }
                        e.$T4 = 5;
                        k.postMessage(c, "RES_READY", [c])
                    }
                }
            }
        } else {
            l.onload = function () {
                var m = a;
                if (m == null) {
                    var n = l.responseText.substr(0, 6);
                    if (n == "OKMDBI") {
                        m = 3
                    } else {
                        m = 1
                    }
                }
                if (okResourceParser.loadModel(m, e.data, l.responseText, f, true, true) == false) {
                    e.$T4 = 2;
                    return
                }
                e.$T4 = 5;
                k.postMessage(c, "RES_READY", [c])
            };
            l.onerror = function () {
                e.$T4 = 2
            }
        }
        l.send()
    } else {
        return false
    }
    return true
}, loadModelByText:function (c, d, h, a) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var e = this.$g1.getDataByIndex(c);
    if (e.$Z4 != 1 || e.$42) {
        return false
    }
    if (e.$T4 != 3) {
        e.$T4 = 3;
        var f = a;
        if (f == null) {
            var k = d.substr(0, 6);
            if (k == "OKMDBI") {
                f = 3
            } else {
                f = 1
            }
        }
        if (okResourceParser.loadModel(f, e.data, d, h, true, true) == false) {
            e.$T4 = 2;
            return
        }
        e.$T4 = 5;
        this.postMessage(c, "RES_READY", [c])
    } else {
        return false
    }
    return true
}, loadSkAnimationByUrl:function (c, d, a, h) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var f = this.$g1.getDataByIndex(c);
    if (f.$Z4 != 3 || f.$42) {
        return false
    }
    if (f.$T4 != 3) {
        f.$T4 = 3;
        var k = this;
        var e = new okGenXmlHttpRequest();
        e.open("GET", d, this.bAsyncLoad && (h != true));
        e.overrideMimeType("text/plain; charset=x-user-defined");
        if (okIsIE()) {
            e.onreadystatechange = function () {
                if (e.readyState == 4) {
                    if (e.status == 200 || e.status == 0) {
                        var l = a;
                        if (l == null) {
                            var m = e.responseText.substr(0, 6);
                            if (m == "OKAMBI") {
                                l = 3
                            } else {
                                l = 1
                            }
                        }
                        if (okResourceParser.loadSkAnimation(l, f.data, e.responseText) == false) {
                            f.$T4 = 2;
                            return false
                        }
                        f.$T4 = 5;
                        k.postMessage(c, "RES_READY", [c])
                    }
                }
            }
        } else {
            e.onload = function () {
                var l = a;
                if (l == null) {
                    var m = e.responseText.substr(0, 6);
                    if (m == "OKAMBI") {
                        l = 3
                    } else {
                        l = 1
                    }
                }
                if (okResourceParser.loadSkAnimation(l, f.data, e.responseText) == false) {
                    f.$T4 = 2;
                    return false
                }
                f.$T4 = 5;
                k.postMessage(c, "RES_READY", [c])
            };
            e.onerror = function () {
                f.$T4 = 2
            }
        }
        e.send()
    } else {
        return false
    }
    return true
}, loadSkAnimationByText:function (c, d, a) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var e = this.$g1.getDataByIndex(c);
    if (e.$Z4 != 3 || e.$42) {
        return false
    }
    if (e.$T4 != 3) {
        e.$T4 = 3;
        var f = a;
        if (f == null) {
            var h = d.substr(0, 6);
            if (h == "OKAMBI") {
                f = 3
            } else {
                f = 1
            }
        }
        if (okResourceParser.loadSkAnimation(f, e.data, d) == false) {
            e.$T4 = 2;
            return false
        }
        e.$T4 = 5;
        this.postMessage(c, "RES_READY", [c])
    } else {
        return false
    }
    return true
}, loadTextureByUrl:function (k, h, o) {
    if (!this.$g1.isIndexValid(k)) {
        return false
    }
    var m = this.$g1.getDataByIndex(k);
    if (m.$Z4 == 0) {
        m.$Z4 = 2;
        m.data = new okTexture(this.rc)
    }
    if (m.$Z4 != 2 || m.$42) {
        return false
    }
    if (m.$T4 != 3) {
        m.$T4 = 3;
        var a = this;
        var c = okFileFilter(h);
        if (c != "mp4" && c != "ogg" && c != "ogv") {
            var d = new Image();
            d.onload = function () {
                okResourceParser.loadTextureFromImage(m.data, d, o);
                m.data.genMipMap();
                m.$T4 = 5;
                a.postMessage(k, "RES_READY", [k])
            };
            d.onerror = function () {
                m.$T4 = 2
            };
            d.src = h
        } else {
            var f = h;
            var h = h.substring(0, h.lastIndexOf("."));
            h.replace("\\", "/");
            h = h.substring(h.lastIndexOf("/") + 1, h.length);
            var p = document.getElementById(h);
            if (!p) {
                p = document.createElement("video");
                p.src = f;
                p.id = h;
                p.autoplay = true;
                p.preload = "auto";
                p.loop = true
            }
            function l(q) {
                p.removeEventListener("canplaythrough", l, false);
                okResourceParser.loadTextureFromVideo(m.data, p, o);
                m.$T4 = 5;
                a.postMessage(k, "RES_READY", [k])
            }

            function e(q) {
                p.play()
            }

            function n(q) {
                m.$T4 = 2
            }

            p.addEventListener("canplaythrough", l, false);
            p.addEventListener("error", n, false);
            p.addEventListener("ended", e, false)
        }
    } else {
        return false
    }
    return true
}, loadTextureByImage:function (c, e, a) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var d = this.$g1.getDataByIndex(c);
    if (d.$Z4 == 0) {
        d.$Z4 = 2;
        d.data = new okTexture(this.rc)
    }
    if (d.$Z4 != 2 || d.$42) {
        return false
    }
    if (d.$T4 != 3) {
        d.$T4 = 3;
        okResourceParser.loadTextureFromImage(d.data, e, a);
        d.data.genMipMap();
        d.$T4 = 5;
        this.postMessage(c, "RES_READY", [c])
    } else {
        return false
    }
    return true
}, loadTextureByVideo:function (c, e, a) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var d = this.$g1.getDataByIndex(c);
    if (d.$Z4 == 0) {
        d.$Z4 = 2;
        d.data = new okTexture(this.rc)
    }
    if (d.$Z4 != 2 || d.$42) {
        return false
    }
    if (d.$T4 != 3) {
        d.$T4 = 3;
        okResourceParser.loadTextureFromVideo(d.data, e, a);
        d.data.$c7 = e;
        d.$T4 = 5;
        this.postMessage(c, "RES_READY", [c])
    } else {
        return false
    }
    return true
}, loadCubeTextureByUrl:function (c, q, f, n, e, l, d, s) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var h = this.$g1.getDataByIndex(c);
    if (h.$Z4 == 0) {
        h.$Z4 = 2;
        h.data = new okTexture(this.rc)
    }
    if (h.$Z4 != 2 || h.$42) {
        return false
    }
    if (h.$T4 != 3) {
        h.$T4 = 3;
        var p = h.data;
        var a = this;
        var o = new Image();
        o.onerror = function () {
            h.$T4 = 2
        };
        var v = new Image();
        v.onerror = function () {
            h.$T4 = 2
        };
        var m = new Image();
        m.onerror = function () {
            h.$T4 = 2
        };
        var u = new Image();
        u.onerror = function () {
            h.$T4 = 2
        };
        var k = new Image();
        k.onerror = function () {
            h.$T4 = 2
        };
        var t = new Image();
        t.onerror = function () {
            h.$T4 = 2
        };
        o.onload = function () {
            v.onload = function () {
                m.onload = function () {
                    u.onload = function () {
                        k.onload = function () {
                            t.onload = function () {
                                p.createTexture(34067, o.width, o.height, 6408, 5121, o, v, m, u, k, t);
                                p.genMipMap();
                                h.$T4 = 5;
                                a.postMessage(c, "RES_READY", [c])
                            };
                            t.src = d
                        };
                        k.src = l
                    };
                    u.src = e
                };
                m.src = n
            };
            v.src = f
        };
        o.src = q
    } else {
        return false
    }
    return true
}, postMessage:function (c, a, h) {
    if (!this.$g1.isIndexValid(c)) {
        return false
    }
    var f = new Object;
    f.sMsg = a;
    f.aArgs = h.slice();
    var d = this.$g1.getDataByIndex(c);
    var e = d.$T.getRoot();
    while (e) {
        e.data.onMessage(f);
        e = e.next
    }
}};
function okShaderManager(a) {
    this.rc = a.rc;
    this.$63 = a.$63;
    this.$t6 = "";
    this.$a6 = "mediump";
    this.$G = null;
    this.$J1 = new Object;
    this.$E = new Object;
    this.$91 = new Object;
    this.$F = okA.object();
    this.$F.OK_VERTEX_UNIFORM_NUM = this.$63.iVertexUniformNum;
    if (this.$63.bFloatRt) {
        this.$F.OK_SUPPORT_FLOAT_RT = 1
    }
    this.aVertexSourceMap = new Object;
    this.aFragmentSourceMap = new Object;
    this.$G = new Object;
    this.$G.HeaderCommon = "varying vec3 okVary_Pos;varying vec4 okVary_ScrTC;\n#ifdef OK_NORMAL\nvarying vec3 okVary_Normal;\n#endif\n#ifdef OK_VERTEX_COLOR\nvarying vec3 okVary_Color;\n#endif\n#ifdef OK_TC12\nvarying vec4 okVary_TC12;\n#else\n#ifdef OK_TC1\nvarying vec2 okVary_TC1;\n#endif\n#ifdef OK_TC2\nvarying vec2 okVary_TC2;\n#endif\n#endif\n#ifdef OK_TC34\nvarying vec4 okVary_TC34;\n#else\n#ifdef OK_TC3\nvarying vec2 okVary_TC3;\n#endif\n#ifdef OK_TC4\nvarying vec2 okVary_TC4;\n#endif\n#endif\n#ifdef OK_TANGENT\nvarying vec3 okVary_Tangent;\n#endif\n#ifdef OK_BINORMAL\nvarying vec3 okVary_Binormal;\n#endif\n";
    this.$G.HeaderFS = "uniform vec4 okUni_General[59];\n#ifdef OK_TEX_ALBEDO1\n#ifdef OK_TEX_ALBEDO1_CUBE\nuniform samplerCube okUni_Sampler0;\n#else\nuniform sampler2D okUni_Sampler0;\n#endif\nuniform vec4 okUni_UvOffsetScale0;\n#endif\n#ifdef OK_TEX_ALBEDO2\n#ifdef OK_TEX_ALBEDO2_CUBE\nuniform samplerCube okUni_Sampler1;\n#else\nuniform sampler2D okUni_Sampler1;\n#endif\nuniform vec4 okUni_UvOffsetScale1;\n#endif\n#ifdef OK_TEX_ALBEDO3\n#ifdef OK_TEX_ALBEDO3_CUBE\nuniform samplerCube okUni_Sampler2;\n#else\nuniform sampler2D okUni_Sampler2;\n#endif\nuniform vec4 okUni_UvOffsetScale2;\n#endif\n#ifdef OK_TEX_ALBEDO4\n#ifdef OK_TEX_ALBEDO4_CUBE\nuniform samplerCube okUni_Sampler3;\n#else\nuniform sampler2D okUni_Sampler3;\n#endif\nuniform vec4 okUni_UvOffsetScale3;\n#endif\n#ifdef OK_TEX_NORMALMAP\nuniform sampler2D okUni_Sampler4;uniform vec4 okUni_UvOffsetScale4;\n#endif\n#ifdef OK_TEX_OPACITY\nuniform sampler2D okUni_Sampler5;uniform vec4 okUni_UvOffsetScale5;\n#endif\n#ifdef OK_TEX_SPECULAR_LEVEL\nuniform sampler2D okUni_Sampler6;uniform vec4 okUni_UvOffsetScale6;\n#endif\nvec3 okGlb_P;vec2 okGlb_ScrTC;vec3 okGlb_N;vec3 okGlb_V;vec3 okGlb_R;\n#define P okGlb_P\n#define SCRTC okGlb_ScrTC\n#define CP okUni_General[8].xyz\n#define N okGlb_N\n#define V okGlb_V\n#define R okGlb_R\n#define T okUni_General[5].w\n#define RAND okUni_General[6].w\n#define EMI okUni_General[0].xyz\n#define AMB okUni_General[1].xyz\n#define DIF okUni_General[2].xyz\n#define SPE okUni_General[3].xyz\n#define GLO okUni_General[0].w\n#define ALPHA okUni_General[2].w\n#define GROUND okUni_General[5].xyz\n#define SKY okUni_General[6].xyz\n#define GLOW okUni_General[4].xyz\n#define C1 okUni_General[51]\n#define C2 okUni_General[52]\n#define C3 okUni_General[53]\n#define C4 okUni_General[54]\n#define C5 okUni_General[55]\n#define C6 okUni_General[56]\n#define C7 okUni_General[57]\n#define C8 okUni_General[58]\n#ifdef OK_VERTEX_COLOR\n#define VC okVary_Color\n#else\n#define VC vec3(0.0,0.0,0.0)\n#endif\n#ifdef OK_TC12\n#define TC1 okVary_TC12.xy\n#define TC2 okVary_TC12.zw\n#else\n#ifdef OK_TC1\n#define TC1 okVary_TC1\n#else\n#define TC1 vec2(0.0)\n#endif\n#ifdef OK_TC2\n#define TC2 okVary_TC2\n#else\n#define TC2 vec2(0.0)\n#endif\n#endif\n#ifdef OK_TC34\n#define TC3 okVary_TC34.xy\n#define TC4 okVary_TC34.zw\n#else\n#ifdef OK_TC3\n#define TC3 okVary_TC3\n#else\n#define TC3 vec2(0.0)\n#endif\n#ifdef OK_TC4\n#define TC4 okVary_TC4\n#else\n#define TC4 vec2(0.0)\n#endif\n#endif\nvec2 okRotTC(vec2 d,float e){float a=cos(e);float b=sin(e);mat2 c=mat2(a,b,-b,a);return(c*(d-0.5))+0.5;}vec3 okFunc_GetMaterialGlow(){\n#ifdef OK_SCRIPT_GLOW_CODE\n{OK_SCRIPT_GLOW_CODE}\n#else\nreturn okUni_General[4].xyz;\n#endif\n}vec3 okFunc_GetMaterialEmissive(){\n#ifdef OK_SCRIPT_EMISSIVE_CODE\n{OK_SCRIPT_EMISSIVE_CODE}\n#else\nreturn okUni_General[0].xyz;\n#endif\n}vec3 okFunc_GetMaterialDiffuse(){\n#ifdef OK_SCRIPT_DIFFUSE_CODE\n{OK_SCRIPT_DIFFUSE_CODE}\n#else\n#if defined(OK_TEX_ALBEDO1)||defined(OK_TEX_ALBEDO2)||defined(OK_TEX_ALBEDO3)||defined(OK_TEX_ALBEDO4)\nvec3 albedo=vec3(1,1,1);\n#ifdef OK_TEX_ALBEDO1\n#ifdef OK_TEX_ALBEDO1_CUBE\nalbedo=textureCube(okUni_Sampler0,R).xyz;\n#else\nalbedo=texture2D(okUni_Sampler0,OK_ALBEDO1_TC*okUni_UvOffsetScale0.zw+okUni_UvOffsetScale0.xy).xyz;\n#endif\n#endif\n#ifdef OK_TEX_ALBEDO2\n#ifdef OK_TEX_ALBEDO2_CUBE\nvec4 albedo2=textureCube(okUni_Sampler1,R);\n#else\nvec4 albedo2=texture2D(okUni_Sampler1,OK_ALBEDO2_TC*okUni_UvOffsetScale1.zw+okUni_UvOffsetScale1.xy);\n#endif\nalbedo=albedo.xyz*albedo2.xyz;\n#endif\n#ifdef OK_TEX_ALBEDO3\n#ifdef OK_TEX_ALBEDO3_CUBE\nvec4 albedo3=textureCube(okUni_Sampler2,R);\n#else\nvec4 albedo3=texture2D(okUni_Sampler2,OK_ALBEDO3_TC*okUni_UvOffsetScale2.zw+okUni_UvOffsetScale2.xy);\n#endif\nalbedo=albedo.xyz*albedo3.xyz;\n#endif\n#ifdef OK_TEX_ALBEDO4\n#ifdef OK_TEX_ALBEDO4_CUBE\nvec4 albedo4=textureCube(okUni_Sampler3,R);\n#else\nvec4 albedo4=texture2D(okUni_Sampler3,OK_ALBEDO4_TC*okUni_UvOffsetScale3.zw+okUni_UvOffsetScale3.xy);\n#endif\nalbedo=albedo.xyz*albedo4.xyz;\n#endif\nreturn albedo*okUni_General[2].xyz;\n#else\nreturn okUni_General[2].xyz;\n#endif\n#endif\n}float okFunc_GetMaterialDiffusePower(){\n#ifdef OK_SCRIPT_DIFFUSEPOWER_CODE\n{OK_SCRIPT_DIFFUSEPOWER_CODE}\n#else\nreturn 1.0;\n#endif\n}vec3 okFunc_GetMaterialSpecular(){\n#ifdef OK_SCRIPT_SPECULAR_CODE\n{OK_SCRIPT_SPECULAR_CODE}\n#else\n#ifdef OK_TEX_SPECULAR_LEVEL\nreturn texture2D(okUni_Sampler6,OK_SPECULAR_LEVEL_TC*okUni_UvOffsetScale6.zw+okUni_UvOffsetScale6.xy).xyz*okUni_General[3].xyz;\n#else\nreturn vec3(okUni_General[1].w)*okUni_General[3].xyz;\n#endif\n#endif\n}float okFunc_GetMaterialSpecularPower(){\n#ifdef OK_SCRIPT_SPECULARPOWER_CODE\n{OK_SCRIPT_SPECULARPOWER_CODE}\n#else\nreturn okUni_General[0].w;\n#endif\n}float okFunc_GetMaterialAlpha(){\n#ifdef OK_SCRIPT_ALPHA_CODE\n{OK_SCRIPT_ALPHA_CODE}\n#else\n#ifdef OK_TEX_OPACITY\nreturn texture2D(okUni_Sampler5,OK_OPACITY_TC*okUni_UvOffsetScale5.zw+okUni_UvOffsetScale5.xy).a;\n#else\nreturn okUni_General[2].a;\n#endif\n#endif\n}\n#ifdef OK_SCRIPT_NORMAL_CODE\nvec3 okFunc_GetNormalScript(){OK_SCRIPT_NORMAL_CODE}\n#endif\nvec3 okFunc_GetMaterialNormal(){\n#ifdef OK_NORMAL\nvec3 vertexNormal=okVary_Normal;\n#else\nvec3 vertexNormal=vec3(0.0,1.0,0.0);\n#endif\n#ifdef OK_SCRIPT_NORMAL_CODE\nvec3 normalT=okFunc_GetNormalScript();mat3 matTangent=mat3(\n#ifdef OK_TANGENT\nokVary_Tangent,\n#else\nvec3(1.0,0.0,0.0),\n#endif\n#ifdef OK_BINORMAL\nokVary_Binormal,\n#else\nvec3(0.0,1.0,0.0),\n#endif\nvertexNormal);vec3 retNormal=normalize(matTangent*normalT);\n#else\n#ifdef OK_TEX_NORMALMAP\nvec3 normalT=texture2D(okUni_Sampler4,OK_NORMALMAP_TC*okUni_UvOffsetScale4.zw+okUni_UvOffsetScale4.xy).xyz;normalT=normalT*2.0-1.0;mat3 matTangent=mat3(\n#ifdef OK_TANGENT\nokVary_Tangent,\n#else\nvec3(1.0,0.0,0.0),\n#endif\n#ifdef OK_BINORMAL\nokVary_Binormal,\n#else\nvec3(0.0,1.0,0.0),\n#endif\nvertexNormal);vec3 retNormal=normalize(matTangent*normalT);\n#else\nvec3 retNormal=normalize(vertexNormal);\n#endif\n#endif\n#ifdef OK_TWO_SIDE\nreturn retNormal*(gl_FrontFacing?1.0:-1.0);\n#else\nreturn retNormal;\n#endif\n}void okFunc_GetMaterialDctLighting(vec3 LDIR,vec3 LCOLOR,inout vec3 LDIFFUSE,inout vec3 LSPECULAR){\n#ifdef OK_SCRIPT_DCTLIGHT_CODE\n{OK_SCRIPT_DCTLIGHT_CODE}\n#endif\n}void okFunc_GetMaterialPointLighting(vec3 LPOS,vec3 LCOLOR,float LRANGE,inout vec3 LDIFFUSE,inout vec3 LSPECULAR){\n#ifdef OK_SCRIPT_POINTLIGHT_CODE\n{OK_SCRIPT_POINTLIGHT_CODE}\n#endif\n}void okFunc_GetMaterialSpotLighting(vec3 LPOS,vec3 LCOLOR,vec3 LDIR,float LINCONE,float LOUTCONE,inout vec3 LDIFFUSE,inout vec3 LSPECULAR){\n#ifdef OK_SCRIPT_SPOTLIGHT_CODE\n{OK_SCRIPT_SPOTLIGHT_CODE}\n#endif\n}void okFunc_ProcessFragment(){P=okVary_Pos;SCRTC=okUni_General[7].xy+(okVary_ScrTC.xy/okVary_ScrTC.w+1.0)*0.5*okUni_General[7].zw;vec3 normal=okFunc_GetMaterialNormal();N=normal;vec3 camVec=normalize(okUni_General[8].xyz-P);V=-camVec;vec3 reflectVec=normalize(reflect(-camVec,normal));R=reflectVec;\n#if defined(OK_ALPHA_TEST)\nif(okFunc_GetMaterialAlpha()<=okUni_General[3].w)discard;\n#else\n#if defined(OK_BLEND)\nif(okFunc_GetMaterialAlpha()<=0.01)discard;\n#endif\n#endif\n}";
    this.$G.HeaderVS = "attribute vec3 okAttr_Pos;\n#ifdef OK_NORMAL\nattribute vec3 okAttr_Normal;\n#endif\n#ifdef OK_VERTEX_COLOR\nattribute vec3 okAttr_Color;\n#endif\n#ifdef OK_TC12\nattribute vec4 okAttr_TC12;\n#else\n#ifdef OK_TC1\nattribute vec2 okAttr_TC1;\n#endif\n#ifdef OK_TC2\nattribute vec2 okAttr_TC2;\n#endif\n#endif\n#ifdef OK_TC34\nattribute vec4 okAttr_TC34;\n#else\n#ifdef OK_TC3\nattribute vec2 okAttr_TC3;\n#endif\n#ifdef OK_TC4\nattribute vec2 okAttr_TC4;\n#endif\n#endif\n#ifdef OK_TANGENT\nattribute vec3 okAttr_Tangent;\n#endif\n#ifdef OK_BINORMAL\nattribute vec3 okAttr_Binormal;\n#endif\n#ifdef OK_SKANIMATION\nattribute vec4 okAttr_BoneIdx;attribute vec4 okAttr_BoneWeight;\n#if OK_VERTEX_UNIFORM_NUM>=220\nuniform vec4 okUni_BoneMat[64*3];\n#else\nuniform vec4 okUni_BoneMat[32*3];\n#endif\n#endif\nuniform mat4 okUni_TransMat[6];void okFunc_ProcessVertex(){\n#ifdef OK_SKANIMATION\nmat4 a=mat4(0.0);ivec4 b=(ivec4(okAttr_BoneIdx)+ivec4(1))*3;{int d=b[0];a+=okAttr_BoneWeight[0]*mat4(okUni_BoneMat[d].x,okUni_BoneMat[d+1].x,okUni_BoneMat[d+2].x,0.0,okUni_BoneMat[d].y,okUni_BoneMat[d+1].y,okUni_BoneMat[d+2].y,0.0,okUni_BoneMat[d].z,okUni_BoneMat[d+1].z,okUni_BoneMat[d+2].z,0.0,okUni_BoneMat[d].w,okUni_BoneMat[d+1].w,okUni_BoneMat[d+2].w,1.0);}{int d=b[1];a+=okAttr_BoneWeight[1]*mat4(okUni_BoneMat[d].x,okUni_BoneMat[d+1].x,okUni_BoneMat[d+2].x,0.0,okUni_BoneMat[d].y,okUni_BoneMat[d+1].y,okUni_BoneMat[d+2].y,0.0,okUni_BoneMat[d].z,okUni_BoneMat[d+1].z,okUni_BoneMat[d+2].z,0.0,okUni_BoneMat[d].w,okUni_BoneMat[d+1].w,okUni_BoneMat[d+2].w,1.0);}{int d=b[2];a+=okAttr_BoneWeight[2]*mat4(okUni_BoneMat[d].x,okUni_BoneMat[d+1].x,okUni_BoneMat[d+2].x,0.0,okUni_BoneMat[d].y,okUni_BoneMat[d+1].y,okUni_BoneMat[d+2].y,0.0,okUni_BoneMat[d].z,okUni_BoneMat[d+1].z,okUni_BoneMat[d+2].z,0.0,okUni_BoneMat[d].w,okUni_BoneMat[d+1].w,okUni_BoneMat[d+2].w,1.0);}{int d=b[3];a+=okAttr_BoneWeight[3]*mat4(okUni_BoneMat[d].x,okUni_BoneMat[d+1].x,okUni_BoneMat[d+2].x,0.0,okUni_BoneMat[d].y,okUni_BoneMat[d+1].y,okUni_BoneMat[d+2].y,0.0,okUni_BoneMat[d].z,okUni_BoneMat[d+1].z,okUni_BoneMat[d+2].z,0.0,okUni_BoneMat[d].w,okUni_BoneMat[d+1].w,okUni_BoneMat[d+2].w,1.0);}\n#endif\n#ifdef OK_NORMAL\nokVary_Normal=(okUni_TransMat[2]*\n#ifdef OK_BILLBOARD\nokUni_TransMat[5]*\n#endif\nokUni_TransMat[3]*\n#ifdef OK_SKANIMATION\na*\n#endif\nvec4(okAttr_Normal,0.0)).xyz;\n#endif\n#ifdef OK_VERTEX_COLOR\nokVary_Color=okAttr_Color;\n#endif\n#ifdef OK_TC12\nokVary_TC12=okAttr_TC12;\n#else\n#ifdef OK_TC1\nokVary_TC1=okAttr_TC1;\n#endif\n#ifdef OK_TC2\nokVary_TC2=okAttr_TC2;\n#endif\n#endif\n#ifdef OK_TC34\nokVary_TC34=okAttr_TC34;\n#else\n#ifdef OK_TC3\nokVary_TC3=okAttr_TC3;\n#endif\n#ifdef OK_TC4\nokVary_TC4=okAttr_TC4;\n#endif\n#endif\n#ifdef OK_TANGENT\nokVary_Tangent=(okUni_TransMat[2]*\n#ifdef OK_BILLBOARD\nokUni_TransMat[5]*\n#endif\nokUni_TransMat[3]*\n#ifdef OK_SKANIMATION\na*\n#endif\nvec4(okAttr_Tangent,0.0)).xyz;\n#endif\n#ifdef OK_BINORMAL\nokVary_Binormal=(okUni_TransMat[2]*\n#ifdef OK_BILLBOARD\nokUni_TransMat[5]*\n#endif\nokUni_TransMat[3]*\n#ifdef OK_SKANIMATION\na*\n#endif\nvec4(okAttr_Binormal,0.0)).xyz;\n#endif\nvec4 c=okUni_TransMat[0]*\n#ifdef OK_BILLBOARD\nokUni_TransMat[5]*\n#endif\nokUni_TransMat[1]*\n#ifdef OK_SKANIMATION\na*\n#endif\nvec4(okAttr_Pos,1.0);okVary_Pos=c.xyz;gl_Position=okUni_TransMat[4]*c;okVary_ScrTC=gl_Position;}";
    this.$G.Lighting = "void okFunc_DctLighting(vec3 normal,vec3 camVec,vec3 reflectVec,vec3 lightDir,vec3 lightColor\n#ifdef OK_DYNAMICSHADOW\n,vec4 shadowMask,vec4 shadowFactor\n#endif\n,inout vec3 diffuse,inout vec3 specular){vec3 curDiffuse=vec3(0.0),curSpecular=vec3(0.0);\n#ifdef OK_SCRIPT_DCTLIGHT_CODE\nokFunc_GetMaterialDctLighting(lightDir,lightColor,curDiffuse,curSpecular);\n#else\nvec3 lightVec=-lightDir;float diffuseFactor=max(0.0,dot(lightVec,normal));\n#ifdef OK_SCRIPT_DIFFUSEPOWER_CODE\ndiffuseFactor=pow(diffuseFactor,okFunc_GetMaterialDiffusePower());\n#endif\ncurDiffuse=diffuseFactor*lightColor;float specularFactor=pow(clamp(dot(reflectVec,lightVec),0.0,1.0),okFunc_GetMaterialSpecularPower());curSpecular=specularFactor*lightColor;\n#endif\n#ifdef OK_DYNAMICSHADOW\nvec3 shadow=mix(vec3(1)-lightColor,vec3(1),dot(shadowMask,shadowFactor));curDiffuse*=shadow;curSpecular*=shadow;\n#endif\ndiffuse+=curDiffuse;specular+=curSpecular;}void okFunc_PointLighting(vec3 pos,vec3 normal,vec3 camVec,vec3 reflectVec,vec3 lightPos,float lightRange,vec3 lightColor\n#ifdef OK_DYNAMICSHADOW\n,vec4 shadowMask,vec4 shadowFactor\n#endif\n,inout vec3 diffuse,inout vec3 specular){vec3 curDiffuse=vec3(0.0),curSpecular=vec3(0.0);\n#ifdef OK_SCRIPT_POINTLIGHT_CODE\nokFunc_GetMaterialPointLighting(lightPos,lightColor,lightRange,curDiffuse,curSpecular);\n#else\nvec3 lightVec=normalize(lightPos-pos);float lenFactor=max(0.0,1.0-distance(lightPos,pos)/lightRange);float diffuseFactor=max(0.0,dot(lightVec,normal))*lenFactor;\n#ifdef OK_SCRIPT_DIFFUSEPOWER_CODE\ndiffuseFactor=pow(diffuseFactor,okFunc_GetMaterialDiffusePower());\n#endif\ncurDiffuse=diffuseFactor*lightColor;float specularFactor=pow(clamp(dot(reflectVec,lightVec),0.0,1.0),okFunc_GetMaterialSpecularPower());curSpecular=specularFactor*lightColor;\n#endif\n#ifdef OK_DYNAMICSHADOW\nvec3 shadow=mix(vec3(1)-lightColor,vec3(1),dot(shadowMask,shadowFactor));curDiffuse*=shadow;curSpecular*=shadow;\n#endif\ndiffuse+=curDiffuse;specular+=curSpecular;}void okFunc_SpotLighting(vec3 pos,vec3 normal,vec3 camVec,vec3 reflectVec,vec3 lightPos,vec3 lightDir,float innerCone,float outerCone,vec3 lightColor\n#ifdef OK_DYNAMICSHADOW\n,vec4 shadowMask,vec4 shadowFactor\n#endif\n,inout vec3 diffuse,inout vec3 specular){vec3 curDiffuse=vec3(0.0),curSpecular=vec3(0.0);\n#ifdef OK_SCRIPT_SPOTLIGHT_CODE\nokFunc_GetMaterialSpotLighting(lightPos,lightColor,lightDir,innerCone,outerCone,curDiffuse,curSpecular);\n#else\nvec3 lightVec=normalize(lightPos-pos);float spotAngl=dot(lightVec,-lightDir);float innerAngl=cos(innerCone*0.5);float outerAngl=cos(outerCone*0.5);float diffuseFactor=clamp((spotAngl-outerAngl)/(innerAngl-outerAngl),0.0,1.0)*max(0.0,dot(lightVec,normal));\n#ifdef OK_SCRIPT_DIFFUSEPOWER_CODE\ndiffuseFactor=pow(diffuseFactor,okFunc_GetMaterialDiffusePower());\n#endif\ncurDiffuse=diffuseFactor*lightColor;float specularFactor=pow(clamp(dot(reflectVec,lightVec),0.0,1.0),okFunc_GetMaterialSpecularPower());curSpecular=specularFactor*lightColor;\n#endif\n#ifdef OK_DYNAMICSHADOW\nvec3 shadow=mix(vec3(1)-lightColor,vec3(1),dot(shadowMask,shadowFactor));curDiffuse*=shadow;curSpecular*=shadow;\n#endif\ndiffuse+=curDiffuse;specular+=curSpecular;}";
    this.$G.Utility = "vec4 okFunc_EncodeFloat(float d){vec4 a=vec4(256*256*256,256*256,256,1);vec4 b=vec4(0,1.0/256.0,1.0/256.0,1.0/256.0);vec4 c=fract(d*a);c-=c.xxyz*b;return c;}float okFunc_DecodeFloat(vec4 e){return dot(vec4(1.0/(256.0*256.0*256.0),1.0/(256.0*256.0),1.0/256.0,1.0),e);}vec3 okFunc_DecodeChar3(float d){return fract(d*vec3(1.0,256.0,65536.0));}vec4 okFunc_FetchTexture(sampler2D f,vec2 g){return texture2D(f,g);}vec4 okFunc_FetchTexture(sampler2D f,vec2 g,float k,float l,float m){m=floor(m);vec2 h=1.0/vec2(k,l);float i=floor(m/k);float j=m-k*i;return texture2D(f,vec2(j,i)*h+g/vec2(k,l));}vec4 okFunc_FetchTexture(samplerCube f,vec3 n){return textureCube(f,n);}vec4 okFunc_FetchDummyTexture(vec2 g){return vec4(1.0);}vec4 okFunc_FetchDummyTexture(vec2 g,float k,float l,float m){return vec4(1.0);}vec4 okFunc_FetchDummyTexture(vec3 n){return vec4(1.0);}";
    this.aVertexSourceMap.Depth = '#include"Utility"\n#include"HeaderCommon"\n#include"HeaderVS"\nvoid main(void){okFunc_ProcessVertex();}';
    this.aFragmentSourceMap.Depth = '#include"Utility"\n#include"HeaderCommon"\n#include"HeaderFS"\nvoid main(void){okFunc_ProcessFragment();\n#ifdef OK_SUPPORT_FLOAT_RT\ngl_FragColor.a=gl_FragCoord.z;\n#else\ngl_FragColor=okFunc_EncodeFloat(gl_FragCoord.z);\n#endif\n}';
    this.aVertexSourceMap.DepthDefault = '#include"Utility"\n#include"HeaderVS"\nvoid main(void){gl_Position=okUni_TransMat[2]*(okUni_TransMat[0]*vec4(okAttr_Pos,1.0));}';
    this.aFragmentSourceMap.DepthDefault = '#include"Utility"\nvoid main(void){\n#ifdef OK_SUPPORT_FLOAT_RT\ngl_FragColor.a=gl_FragCoord.z;\n#else\ngl_FragColor=encodeFloat(gl_FragCoord.z);\n#endif\n}';
    this.aVertexSourceMap.FlatColor = "#if TEX\nvarying vec2 fragmentTexCoord;\n#endif\nattribute vec3 position;\n#if TEX\nattribute vec2 texcoord;\n#endif\nuniform mat4 matWorld;uniform mat4 matViewProj;void main(void){\n#if TEX\nfragmentTexCoord=texcoord;\n#endif\ngl_Position=matViewProj*matWorld*vec4(position,1.0);}";
    this.aFragmentSourceMap.FlatColor = "#if TEX\nvarying vec2 fragmentTexCoord;\n#endif\nuniform vec3 color;\n#if TEX\nuniform sampler2D texSampler;\n#endif\nvoid main(void){\n#if TEX\nvec3 a=color*texture2D(texSampler,fragmentTexCoord).xyz;\n#else\nvec3 a=color;\n#endif\ngl_FragColor=vec4(a,1.0);}";
    this.aVertexSourceMap.GaussianFilter = "varying vec2 okVary_ScrTC;attribute vec3 okAttr_Pos;void main(void){gl_Position=vec4(okAttr_Pos,1.0);okVary_ScrTC=(gl_Position.xy+1.0)*0.5;}";
    this.aFragmentSourceMap.GaussianFilter = "varying vec2 okVary_ScrTC;uniform vec4 okUni_ScreenPosOffsetAndScale;uniform vec2 okUni_TexelSize;uniform sampler2D okUni_Tex;void main(void){vec2 a=okUni_ScreenPosOffsetAndScale.xy+okVary_ScrTC*okUni_ScreenPosOffsetAndScale.zw;vec4 b=texture2D(okUni_Tex,a)*0.25;b+=(texture2D(okUni_Tex,a+okUni_TexelSize*vec2(3.0,0.0))+texture2D(okUni_Tex,a+okUni_TexelSize*vec2(-3.0,0.0))+texture2D(okUni_Tex,a+okUni_TexelSize*vec2(0.0,3.0))+texture2D(okUni_Tex,a+okUni_TexelSize*vec2(0.0,-3.0)))*0.125;b+=(texture2D(okUni_Tex,a+okUni_TexelSize*vec2(3.0,3.0))+texture2D(okUni_Tex,a+okUni_TexelSize*vec2(3.0,-3.0))+texture2D(okUni_Tex,a+okUni_TexelSize*vec2(-3.0,3.0))+texture2D(okUni_Tex,a+okUni_TexelSize*vec2(-3.0,-3.0)))*0.0625;gl_FragColor=b;}";
    this.aVertexSourceMap.Glow = '#include"Utility"\n#include"HeaderCommon"\n#include"HeaderVS"\nvoid main(void){okFunc_ProcessVertex();}';
    this.aFragmentSourceMap.Glow = '#include"Utility"\n#include"HeaderCommon"\n#include"HeaderFS"\nvoid main(void){okFunc_ProcessFragment();vec3 glowColor=okFunc_GetMaterialGlow();\n#ifdef OK_FOG\n{float d=distance(okVary_Pos,okUni_General[8].xyz);float fog=clamp(1.0-1.0/exp(clamp((d-okUni_General[10].x)*okUni_General[10].y,0.0,1.0)*okUni_General[9].w),0.0,1.0);fog=smoothstep(0.0,0.95,fog);glowColor=mix(glowColor,okUni_General[9].xyz,fog);}\n#endif\ngl_FragColor=vec4(glowColor,1.0);}';
    this.aVertexSourceMap.GlowDefault = '#include"HeaderVS"\nvoid main(void){gl_Position=okUni_TransMat[2]*(okUni_TransMat[0]*vec4(okAttr_Pos,1.0));}';
    this.aFragmentSourceMap.GlowDefault = "void main(void){gl_FragColor=vec4(0.0,0.0,0.0,0.0);}";
    this.aVertexSourceMap.Lighting = '#include"Utility"\n#include"HeaderCommon"\n#include"HeaderVS"\nvoid main(void){okFunc_ProcessVertex();}';
    this.aFragmentSourceMap.Lighting = '#include"Utility"\n#include"HeaderCommon"\n#include"HeaderFS"\n#include"Lighting"\n#ifdef OK_DYNAMICSHADOW\nuniform sampler2D okUni_shadowSampler;\n#endif\nvoid main(void){okFunc_ProcessFragment();\n#ifdef OK_DYNAMICLIGHTING\nvec3 emissive=okFunc_GetMaterialEmissive();vec3 ambient=mix(okUni_General[5].xyz,okUni_General[6].xyz,(N.y+1.0)*0.5);ambient*=(okUni_General[1].xyz\n#ifdef OK_FACING_SPECULAR\n+okUni_General[3].xyz*pow(clamp(dot(-V,R),0.0,1.0),8.0)*okFunc_GetMaterialSpecular()\n#endif\n);vec3 diffuse=vec3(0.0);vec3 specular=vec3(0.0);vec3 customlighting=vec3(0.0);\n#ifdef OK_DYNAMICSHADOW\nvec4 shadowFactor=vec4(texture2D(okUni_shadowSampler,SCRTC).xyz,1.0);\n#endif\n#endif\n#ifdef OK_DYNAMICLIGHTING\n#if OK_DCTLIGHT_NUM>=1\nokFunc_DctLighting(N,-V,R,okUni_General[11].xyz,okUni_General[15].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[19],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_DCTLIGHT_NUM>=2\nokFunc_DctLighting(N,-V,R,okUni_General[12].xyz,okUni_General[16].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[20],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_DCTLIGHT_NUM>=3\nokFunc_DctLighting(N,-V,R,okUni_General[13].xyz,okUni_General[17].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[21],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_DCTLIGHT_NUM>=4\nokFunc_DctLighting(N,-V,R,okUni_General[14].xyz,okUni_General[18].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[22],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_POINTLIGHT_NUM>=1\nokFunc_PointLighting(P,N,-V,R,okUni_General[23].xyz,okUni_General[23].w,okUni_General[27].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[31],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_POINTLIGHT_NUM>=2\nokFunc_PointLighting(P,N,-V,R,okUni_General[24].xyz,okUni_General[24].w,okUni_General[28].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[32],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_POINTLIGHT_NUM>=3\nokFunc_PointLighting(P,N,-V,R,okUni_General[25].xyz,okUni_General[25].w,okUni_General[29].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[33],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_POINTLIGHT_NUM>=4\nokFunc_PointLighting(P,N,-V,R,okUni_General[26].xyz,okUni_General[26].w,okUni_General[30].xyz\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[34],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_SPOTLIGHT_NUM>=1\nokFunc_SpotLighting(P,N,-V,R,okUni_General[35].xyz,okUni_General[39].xyz,okUni_General[43].x,okUni_General[43].y,vec3(okUni_General[39].w,okUni_General[43].zw)\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[47],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_SPOTLIGHT_NUM>=2\nokFunc_SpotLighting(P,N,-V,R,okUni_General[36].xyz,okUni_General[40].xyz,okUni_General[44].x,okUni_General[44].y,vec3(okUni_General[40].w,okUni_General[44].zw)\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[48],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_SPOTLIGHT_NUM>=3\nokFunc_SpotLighting(P,N,-V,R,okUni_General[37].xyz,okUni_General[41].xyz,okUni_General[45].x,okUni_General[45].y,vec3(okUni_General[41].w,okUni_General[45].zw)\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[49],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#if OK_SPOTLIGHT_NUM>=4\nokFunc_SpotLighting(P,N,-V,R,okUni_General[38].xyz,okUni_General[42].xyz,okUni_General[46].x,okUni_General[46].y,vec3(okUni_General[42].w,okUni_General[46].zw)\n#ifdef OK_DYNAMICSHADOW\n,okUni_General[50],shadowFactor\n#endif\n,diffuse,specular);\n#endif\n#endif\n#ifdef OK_DYNAMICLIGHTING\nvec3 lightingColor=emissive+(ambient+diffuse)*okFunc_GetMaterialDiffuse()+specular*okFunc_GetMaterialSpecular();\n#else\nvec3 lightingColor=okFunc_GetMaterialEmissive()+(okUni_General[1].xyz+okUni_General[2].xyz)*okFunc_GetMaterialDiffuse();\n#endif\n#ifdef OK_AUTO_VERTEX_COLOR\nlightingColor+=VC;\n#endif\n#ifdef OK_FOG\n{float d=distance(okVary_Pos,okUni_General[8].xyz);float fog=clamp(1.0-1.0/exp(clamp((d-okUni_General[10].x)*okUni_General[10].y,0.0,1.0)*okUni_General[9].w),0.0,1.0);fog=smoothstep(0.0,0.95,fog);lightingColor=mix(lightingColor,okUni_General[9].xyz,fog);}\n#endif\ngl_FragColor=vec4(lightingColor,\n#if defined(OK_BLEND)||defined(OK_ALPHA_TEST)\nokFunc_GetMaterialAlpha()\n#else\n1.0\n#endif\n);}';
    this.aVertexSourceMap.LightingDefault = '#include"HeaderVS"\nvoid main(void){gl_Position=okUni_TransMat[2]*(okUni_TransMat[0]*vec4(okAttr_Pos,1.0));}';
    this.aFragmentSourceMap.LightingDefault = "void main(void){gl_FragColor=vec4(1.0,0.0,0.0,1.0);}";
    this.aVertexSourceMap.Output = "varying vec2 okVary_ScrTC;attribute vec3 okAttr_Pos;uniform vec4 okUni_SrcOffsetScale;uniform vec4 okUni_DestOffsetScale;void main(void){vec2 a=(okAttr_Pos.xy+1.0)*0.5;gl_Position=vec4((okUni_DestOffsetScale.xy+a*okUni_DestOffsetScale.zw)*2.0-1.0,okAttr_Pos.z,1.0);okVary_ScrTC=okUni_SrcOffsetScale.xy+a*okUni_SrcOffsetScale.zw;}";
    this.aFragmentSourceMap.Output = "varying vec2 okVary_ScrTC;uniform sampler2D okUni_Tex;void main(void){vec4 a=texture2D(okUni_Tex,okVary_ScrTC);gl_FragColor=a;}";
    this.aVertexSourceMap.ShadowDepth = '#include"Utility"\n#include"HeaderCommon"\nvarying float okVary_Depth;\n#include"HeaderVS"\nvoid main(void){okFunc_ProcessVertex();okVary_Depth=gl_Position.z;}';
    this.aFragmentSourceMap.ShadowDepth = '#include"Utility"\n#include"HeaderCommon"\nvarying float okVary_Depth;\n#include"HeaderFS"\nvoid main(void){okFunc_ProcessFragment();\n#ifdef OK_SUPPORT_FLOAT_RT\ngl_FragColor.a=okVary_Depth;\n#else\ngl_FragColor=okFunc_EncodeFloat(okVary_Depth);\n#endif\n}';
    this.aVertexSourceMap.ShadowDepthDefault = '#include"Utility"\nvarying float okVary_Depth;\n#include"HeaderVS"\nvoid main(void){gl_Position=okUni_TransMat[2]*(okUni_TransMat[0]*vec4(okAttr_Pos,1.0));okVary_Depth=gl_Position.z;}';
    this.aFragmentSourceMap.ShadowDepthDefault = '#include"Utility"\nvarying float okVary_Depth;void main(void){\n#ifdef OK_SUPPORT_FLOAT_RT\ngl_FragColor.a=okVary_Depth;\n#else\ngl_FragColor=okFunc_EncodeFloat(okVary_Depth);\n#endif\n}';
    this.aVertexSourceMap.ShadowFinal = "varying vec4 screenPos;uniform mat4 matArray[3];attribute vec4 vertMask0;attribute vec4 vertMask1;uniform vec3 vertList[8];void main(void){vec3 a=vertList[0]*vertMask0.x;a+=vertList[1]*vertMask0.y;a+=vertList[2]*vertMask0.z;a+=vertList[3]*vertMask0.w;a+=vertList[4]*vertMask1.x;a+=vertList[5]*vertMask1.y;a+=vertList[6]*vertMask1.z;a+=vertList[7]*vertMask1.w;gl_Position=matArray[0]*vec4(a,1);screenPos=gl_Position;}";
    this.aFragmentSourceMap.ShadowFinal = "varying vec4 screenPos;uniform mat4 matArray[3];uniform vec4 screenPosOffsetAndScale;uniform vec3 shadowPixelSizeAndOffset;uniform vec4 shadowClamp;uniform sampler2D samplerArray[2];vec4 a=vec4(1.0/(256.0*256.0*256.0),1.0/(256.0*256.0),1.0/256.0,1.0);float o(vec4 g){vec4 i=vec4(min(1.0,g.z-shadowPixelSizeAndOffset.z));vec2 j=g.xy/g.w;if(j.x<shadowClamp.x||j.x>shadowClamp.z||j.y<shadowClamp.y||j.y>shadowClamp.w)discard;\n#ifdef OK_SUPPORT_FLOAT_RT\nfloat k=texture2D(samplerArray[1],j).a;\n#else\nfloat k=dot(a,texture2D(samplerArray[1],j));\n#endif\nvec4 m=vec4(dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(-1,-1))),dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(0,-1))),dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(1,-1))),dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(-1,0))));vec4 n=vec4(dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(1,0))),dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(-1,1))),dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(0,1))),dot(a,texture2D(samplerArray[1],j+shadowPixelSizeAndOffset.xy*vec2(1,1))));return(dot(sign(m-i),vec4(1.0))+dot(sign(n-i),vec4(1.0))+k)*0.111111;}void main(void){vec2 b=screenPos.xy/screenPos.w;vec2 c=screenPosOffsetAndScale.xy+(b+1.0)*0.5*screenPosOffsetAndScale.zw;\n#ifdef OK_SUPPORT_FLOAT_RT\nfloat d=texture2D(samplerArray[0],c).a;\n#else\nfloat d=dot(a,texture2D(samplerArray[0],c));\n#endif\nvec4 f=matArray[1]*vec4(b,d*2.0-1.0,1.0);f/=f.w;vec4 g=matArray[2]*f;float h=o(g);gl_FragColor=vec4(vec3(h),1.0);}"
}
okShaderManager.prototype = {clear:function () {
    this.$a6 = "mediump";
    for (var d in this.$J1) {
        this.$J1[d].releaseShader();
        this.$J1[d].releaseSource()
    }
    okA._object(this.$J1);
    this.$J1 = okA.object();
    for (var a in this.$E) {
        this.$E[a].releaseShader();
        this.$E[a].releaseSource()
    }
    okA._object(this.$E);
    this.$E = okA.object();
    for (var c in this.$91) {
        this.$91[c].releaseProgram()
    }
    okA._object(this.$91);
    this.$91 = okA.object()
}, setShaderSourcePath:function (a) {
    this.$t6 = a
}, getProgram:function (a, d, c) {
    switch (a) {
        case"Lighting":
            return this.getLightingProgram(d, c);
        case"Depth":
            return this.getDepthProgram(d, c);
        case"Glow":
            return this.getGlowProgram(d, c);
        case"ShadowDepth":
            return this.getShadowDepthProgram(d, c);
        case"ShadowFinal":
            return this.getShadowFinalProgram();
        case"Output":
            return this.getOutputProgram()
    }
}, getFlatColorProgram:function (f) {
    var p = "Fl";
    var o = this.$91[p];
    if (o != null) {
        return o
    }
    var l = "Fl";
    var d = "Fl";
    var n = this.$J1[l];
    var h = this.$E[d];
    if (n == null || h == null) {
        var a = null, k = null;
        if (n == null) {
            a = new okShader(this.rc, 35633)
        }
        if (h == null) {
            k = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = k;
        this._getSrc("FlatColor", e);
        var m = okA.object();
        this._getGlobalDef(m);
        m.TEX = (f ? 1 : 0);
        if (n == null) {
            a.compile(m);
            this.$J1[l] = a;
            n = a
        }
        if (h == null) {
            k.setFloatPrecision(this.$a6);
            k.compile(m);
            this.$E[d] = k;
            h = k
        }
        okA._object(m)
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(n);
    c.attachFragmentShader(h);
    c.link();
    this.$91[p] = c;
    return c
}, getOutputProgram:function () {
    var n = "Op";
    var m = this.$91[n];
    if (m != null) {
        return m
    }
    var k = "Op";
    var d = "Op";
    var l = this.$J1[k];
    var f = this.$E[d];
    if (l == null || f == null) {
        var a = null, h = null;
        if (l == null) {
            a = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = h;
        this._getSrc("Output", e);
        if (l == null) {
            a.compile();
            this.$J1[k] = a;
            l = a
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile();
            this.$E[d] = h;
            f = h
        }
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(l);
    c.attachFragmentShader(f);
    c.link();
    this.$91[n] = c;
    return c
}, getGaussianProgram:function (l) {
    var p = "Gau" + l;
    var o = this.$91[p];
    if (o != null) {
        return o
    }
    var k = "Gau";
    var d = p;
    var n = this.$J1[k];
    var f = this.$E[d];
    if (n == null || f == null) {
        var m = new Object;
        this._getGlobalDef(m);
        if (l == 0) {
            m.OK_HORIZONTAL = 1
        } else {
            m.OK_VERTICAL = 1
        }
        var a = null, h = null;
        if (n == null) {
            a = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = h;
        this._getSrc("GaussianFilter", e);
        if (n == null) {
            a.compile(m);
            this.$J1[k] = a;
            n = a
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile(m);
            this.$E[d] = h;
            f = h
        }
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(n);
    c.attachFragmentShader(f);
    c.link();
    this.$91[p] = c;
    return c
}, getDefaultDepthProgram:function () {
    var a = "DeD" + this.sGlobayKey;
    var m = this.$91[a];
    if (m != null) {
        return m
    }
    var l = this.$J1[a];
    var f = this.$E[a];
    if (l == null || f == null) {
        var k = okA.object();
        this._getGlobalDef(k);
        var c = null, h = null;
        if (l == null) {
            c = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = c;
        e.sFs = h;
        this._getSrc("DepthDefault", e);
        if (l == null) {
            c.compile(k);
            this.$J1[a] = c;
            l = c
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile(k);
            this.$E[a] = h;
            f = h
        }
        okA._object(k)
    }
    var d = new okProgram(this.rc);
    d.attachVertexShader(l);
    d.attachFragmentShader(f);
    d.link();
    this.$91[a] = d;
    return d
}, getDepthProgram:function (l, f) {
    var q = "De" + f._getShdKeyP(l, true);
    var p = this.$91[q];
    if (p == "Fail") {
        return this.getDefaultShadowDepthProgram()
    }
    if (p != null) {
        return p
    }
    var m = "De" + f._getShdKeyV(l, true);
    var d = "De" + f._getShdKeyF(l, true);
    var o = this.$J1[m];
    var h = this.$E[d];
    if (o == null || h == null) {
        var n = okA.object();
        this._getGlobalDef(n);
        f._getShdDef(l, true, n);
        var a = null, k = null;
        if (o == null) {
            a = new okShader(this.rc, 35633)
        }
        if (h == null) {
            k = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = k;
        this._getSrc("Depth", e);
        if (o == null) {
            if (a.compile(n)) {
                this.$J1[m] = a;
                o = a
            } else {
                this.$91[q] = "Fail";
                return this.getDefaultDepthProgram()
            }
        }
        if (h == null) {
            k.setFloatPrecision(this.$a6);
            if (k.compile(n)) {
                this.$E[d] = k;
                h = k
            } else {
                this.$91[q] = "Fail";
                return this.getDefaultDepthProgram()
            }
        }
        okA._object(n)
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(o);
    c.attachFragmentShader(h);
    if (!c.link()) {
        return this.getDefaultDepthProgram()
    }
    this.$91[q] = c;
    return c
}, getGlowProgram:function (l, f) {
    var n = f.$A5;
    var s = "Gl" + f._getShdKeyP(l, false);
    if (l.$g2 && n.$f2) {
        s += "_1"
    }
    var q = this.$91[s];
    if (q == "Fail") {
        return this.getDefaultShadowDepthProgram()
    }
    if (q != null) {
        return q
    }
    var m = "Gl" + f._getShdKeyV(l, false);
    var d = "Gl" + f._getShdKeyF(l, false);
    if (l.$g2 && n.$f2) {
        d += "_1"
    }
    var p = this.$J1[m];
    var h = this.$E[d];
    if (p == null || h == null) {
        var o = okA.object();
        this._getGlobalDef(o);
        f._getShdDef(l, false, o);
        var a = null, k = null;
        if (p == null) {
            a = new okShader(this.rc, 35633)
        }
        if (h == null) {
            k = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = k;
        this._getSrc("Glow", e);
        if (p == null) {
            if (a.compile(o)) {
                this.$J1[m] = a;
                p = a
            } else {
                this.$91[s] = "Fail";
                return this.getDefaultDepthProgram()
            }
        }
        if (h == null) {
            k.setFloatPrecision(this.$a6);
            if (k.compile(o)) {
                this.$E[d] = k;
                h = k
            } else {
                this.$91[s] = "Fail";
                return this.getDefaultDepthProgram()
            }
        }
        okA._object(o)
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(p);
    c.attachFragmentShader(h);
    if (!c.link()) {
        return this.getDefaultDepthProgram()
    }
    this.$91[s] = c;
    return c
}, getDefaultGlowProgram:function () {
    var a = "GlD";
    var m = this.$91[a];
    if (m != null) {
        return m
    }
    var l = this.$J1[a];
    var f = this.$E[a];
    if (l == null || f == null) {
        var k = okA.object();
        this._getGlobalDef(k);
        var c = null, h = null;
        if (l == null) {
            c = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = c;
        e.sFs = h;
        this._getSrc("GlowDefault", e);
        if (l == null) {
            c.compile(k);
            this.$J1[a] = c;
            l = c
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile(k);
            this.$E[a] = h;
            f = h
        }
        okA._object(k)
    }
    var d = new okProgram(this.rc);
    d.attachVertexShader(l);
    d.attachFragmentShader(f);
    d.link();
    this.$91[a] = d;
    return d
}, getDefaultShadowDepthProgram:function () {
    var a = "ShDD";
    var m = this.$91[a];
    if (m != null) {
        return m
    }
    var l = this.$J1[a];
    var f = this.$E[a];
    if (l == null || f == null) {
        var k = okA.object();
        this._getGlobalDef(k);
        var c = null, h = null;
        if (l == null) {
            c = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = c;
        e.sFs = h;
        this._getSrc("ShadowDepthDefault", e);
        if (l == null) {
            c.compile(k);
            this.$J1[a] = c;
            l = c
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile(k);
            this.$E[a] = h;
            f = h
        }
        okA._object(k)
    }
    var d = new okProgram(this.rc);
    d.attachVertexShader(l);
    d.attachFragmentShader(f);
    d.link();
    this.$91[a] = d;
    return d
}, getShadowDepthProgram:function (l, f) {
    var q = "ShD" + f._getShdKeyP(l, true);
    var p = this.$91[q];
    if (p == "Fail") {
        return this.getDefaultShadowDepthProgram()
    }
    if (p != null) {
        return p
    }
    var m = "ShD" + f._getShdKeyV(l, true);
    var d = "ShD" + f._getShdKeyF(l, true);
    var o = this.$J1[m];
    var h = this.$E[d];
    if (o == null || h == null) {
        var n = okA.object();
        this._getGlobalDef(n);
        f._getShdDef(l, true, n);
        var a = null, k = null;
        if (o == null) {
            a = new okShader(this.rc, 35633)
        }
        if (h == null) {
            k = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = k;
        this._getSrc("ShadowDepth", e);
        if (o == null) {
            if (a.compile(n)) {
                this.$J1[m] = a;
                o = a
            } else {
                this.$91[q] = "Fail";
                return this.getDefaultShadowDepthProgram()
            }
        }
        if (h == null) {
            k.setFloatPrecision(this.$a6);
            if (k.compile(n)) {
                this.$E[d] = k;
                h = k
            } else {
                this.$91[q] = "Fail";
                return this.getDefaultShadowDepthProgram()
            }
        }
        okA._object(n)
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(o);
    c.attachFragmentShader(h);
    if (!c.link()) {
        this.$91[q] = "Fail";
        return this.getDefaultShadowDepthProgram()
    }
    this.$91[q] = c;
    return c
}, getShadowFinalProgram:function () {
    var a = "ShF";
    var m = this.$91[a];
    if (m != null) {
        return m
    }
    var l = this.$J1[a];
    var f = this.$E[a];
    if (l == null || f == null) {
        var k = okA.object();
        this._getGlobalDef(k);
        var c = null, h = null;
        if (l == null) {
            c = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = c;
        e.sFs = h;
        this._getSrc("ShadowFinal", e);
        if (l == null) {
            c.compile(k);
            this.$J1[a] = c;
            l = c
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile(k);
            this.$E[a] = h;
            f = h
        }
        okA._object(k)
    }
    var d = new okProgram(this.rc);
    d.attachVertexShader(l);
    d.attachFragmentShader(f);
    d.link();
    this.$91[a] = d;
    return d
}, getDefaultLightingProgram:function () {
    var a = "LiD";
    var m = this.$91[a];
    if (m != null) {
        return m
    }
    var l = this.$J1[a];
    var f = this.$E[a];
    if (l == null || f == null) {
        var k = okA.object();
        this._getGlobalDef(k);
        var c = null, h = null;
        if (l == null) {
            c = new okShader(this.rc, 35633)
        }
        if (f == null) {
            h = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = c;
        e.sFs = h;
        this._getSrc("LightingDefault", e);
        if (l == null) {
            c.compile(k);
            this.$J1[a] = c;
            l = c
        }
        if (f == null) {
            h.setFloatPrecision(this.$a6);
            h.compile(k);
            this.$E[a] = h;
            f = h
        }
        okA._object(k)
    }
    var d = new okProgram(this.rc);
    d.attachVertexShader(l);
    d.attachFragmentShader(f);
    d.link();
    this.$91[a] = d;
    return d
}, getLightingProgram:function (l, f) {
    var q = "Li" + f._getShdKeyP(l, false);
    var p = this.$91[q];
    if (p == "Fail") {
        return this.getDefaultLightingProgram()
    } else {
        if (p) {
            return p
        }
    }
    var m = "Li" + f._getShdKeyV(l, false);
    var d = "Li" + f._getShdKeyF(l, false);
    var o = this.$J1[m];
    var h = this.$E[d];
    if (o == null || h == null) {
        var n = okA.object();
        this._getGlobalDef(n);
        f._getShdDef(l, false, n);
        var a = null, k = null;
        if (o == null) {
            a = new okShader(this.rc, 35633)
        }
        if (h == null) {
            k = new okShader(this.rc, 35632)
        }
        var e = new Object;
        e.sVs = a;
        e.sFs = k;
        this._getSrc("Lighting", e);
        if (o == null) {
            if (a.compile(n)) {
                this.$J1[m] = a;
                o = a
            } else {
                this.$91[q] = "Fail";
                return this.getDefaultLightingProgram()
            }
        }
        if (h == null) {
            k.setFloatPrecision(this.$a6);
            if (k.compile(n)) {
                this.$E[d] = k;
                h = k
            } else {
                this.$91[q] = "Fail";
                return this.getDefaultLightingProgram()
            }
        }
        okA._object(n)
    }
    var c = new okProgram(this.rc);
    c.attachVertexShader(o);
    c.attachFragmentShader(h);
    if (!c.link()) {
        this.$91[q] = "Fail";
        return this.getDefaultLightingProgram()
    }
    this.$91[q] = c;
    return c
}, _getSrc:function (a, c) {
    if (this.aVertexSourceMap) {
        if (c.sVs) {
            c.sVs.loadSource(this.aVertexSourceMap[a], this.$G)
        }
        if (c.sFs) {
            c.sFs.loadSource(this.aFragmentSourceMap[a], this.$G)
        }
    }
}, _getGlobalDef:function (c) {
    for (var a in this.$F) {
        c[a] = this.$F[a]
    }
}};
function okRenderBaseStage() {
    this.$T5 = null;
    this.$c2 = true;
    this.$1 = [null, null, null, null, null, null]
}
okRenderBaseStage.prototype.clear = function () {
    this.$c2 = true;
    this.deleteResource()
};
okRenderBaseStage.prototype.enable = function (a) {
    this.$c2 = a
};
okRenderBaseStage.prototype.isEnabled = function () {
    return this.$c2
};
okRenderBaseStage.prototype.init = function (a) {
    this.$T5 = a
};
okRenderBaseStage.prototype.createResource = function () {
};
okRenderBaseStage.prototype.deleteResource = function () {
};
okRenderBaseStage.prototype.beginView = function (a) {
};
okRenderBaseStage.prototype.endView = function () {
};
okRenderBaseStage.prototype.prepare = function () {
};
okRenderBaseStage.prototype.render = function () {
};
okRenderBaseStage.prototype._renderBatches = function (v, X, l, k, ac, ai, B) {
    var Z = this.$T5.rc;
    var o = this.$T5.$P5;
    var J = this.$T5.$U5;
    var T = this.$T5.$S5;
    var ab = this.$T5.$K6;
    var M = o.$U2;
    var R = o.$a4;
    var U = o.$94;
    var K = J.getResource("$R$White");
    var aj = J.getResource("$R$WhiteCube");
    var O = M.getPos();
    var f = (B ? B : M.getViewProjMat4());
    var x = M.getViewInvMat4();
    x.m03 = x.m13 = x.m23 = 0;
    this.$1[4] = f;
    this.$1[5] = x;
    var z = okA.array();
    z.push(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, o.$77.x, o.$77.y, o.$77.z, o.$i4 / 1000, o.$97.x, o.$97.y, o.$97.z, o.$p3, M.$35 / R, (U - M.$45 - M.$15) / U, M.$25 / R, M.$15 / U, O.x, O.y, O.z, 1, o.$57.x, o.$57.y, o.$57.z, o.$e3, o.$g3, 1 / (o.$f3 - o.$g3), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    var V = v.length;
    for (var ah = 0; ah < V; ++ah) {
        var m = v[ah];
        if (ac && ac(m) == false) {
            continue
        }
        var C = m.$a;
        var e = m.$A5;
        var ad = o.$z2 && !e.$O2 && m.$y2 && o.$r1[1];
        var E = 0;
        var I = ab.getProgram(X, o, m);
        I.bind();
        this.$1[0] = m.$p5;
        this.$1[1] = m.$n5;
        this.$1[2] = m.$r5;
        this.$1[3] = m.$q5;
        I.setUniformMat4Array("okUni_TransMat", this.$1);
        var P = C.Position;
        if (P) {
            I.setAttribute("okAttr_Pos", P.buf, P.$P4, P.iOffset, P.iStride)
        }
        if (l || k || e.$S1) {
            var Q = C.Normal;
            if (Q) {
                I.setAttribute("okAttr_Normal", Q.buf, Q.$P4, Q.iOffset, Q.iStride)
            }
            var q = C.Color;
            if (q) {
                I.setAttribute("okAttr_Color", q.buf, q.$P4, q.iOffset, q.iStride)
            }
        }
        if (e.$62) {
            Z.enable(2929)
        } else {
            Z.disable(2929)
        }
        if (e.$72) {
            Z.depthMask(true)
        } else {
            Z.depthMask(false)
        }
        if (e.$G2) {
            Z.disable(2884)
        } else {
            Z.enable(2884)
        }
        if (m.$r4 == 1) {
            Z.lineWidth(e.$n3)
        }
        if (e.$Z1) {
            Z.blendEquationSeparate(e.$Z3, e.$04);
            Z.blendFuncSeparate(e.$24, e.$X3, e.$34, e.$Y3)
        }
        if (k || e.$S1) {
            z[0] = e.$47.x;
            z[1] = e.$47.y;
            z[2] = e.$47.z;
            z[3] = e.$j3;
            z[4] = e.$Z6.x;
            z[5] = e.$Z6.y;
            z[6] = e.$Z6.z;
            z[7] = e.$w3;
            z[8] = e.$37.x;
            z[9] = e.$37.y;
            z[10] = e.$37.z;
            z[11] = e.$93;
            z[12] = e.$a7.x;
            z[13] = e.$a7.y;
            z[14] = e.$a7.z;
            z[15] = e.$a3;
            z[16] = e.$67.x;
            z[17] = e.$67.y;
            z[18] = e.$67.z;
            for (var ag = 0; ag < 8; ++ag) {
                var ak = e.$B1[ag];
                z[(51 + ag) * 4] = ak.x;
                z[(51 + ag) * 4 + 1] = ak.y;
                z[(51 + ag) * 4 + 2] = ak.z;
                z[(51 + ag) * 4 + 3] = ak.w
            }
        }
        if (l) {
            var d = T.getRenderTarget("ShadowProj");
            if (ad && d) {
                I.setSampler("okUni_shadowSampler", E);
                d.bind(E);
                Z.texParameteri(3553, 10240, 9729);
                Z.texParameteri(3553, 10241, 9729);
                Z.texParameteri(3553, 10242, 33071);
                Z.texParameteri(3553, 10243, 33071);
                E += 1
            }
            var am = m.$t.length;
            var Y = 0;
            for (var af = 0; af < am; ++af) {
                var al = m.$t[af];
                if (al.$P[m.$B4]) {
                    var W = al.getLightDir();
                    var S = al.getColor();
                    z[(11 + Y) * 4] = W.x;
                    z[(11 + Y) * 4 + 1] = W.y;
                    z[(11 + Y) * 4 + 2] = W.z;
                    z[(15 + Y) * 4] = S.x * al.$l3;
                    z[(15 + Y) * 4 + 1] = S.y * al.$l3;
                    z[(15 + Y) * 4 + 2] = S.z * al.$l3;
                    if (ad) {
                        z[(19 + Y) * 4] = al.$O4 == 0 ? 1 : 0;
                        z[(19 + Y) * 4 + 1] = al.$O4 == 1 ? 1 : 0;
                        z[(19 + Y) * 4 + 2] = al.$O4 == 2 ? 1 : 0;
                        z[(19 + Y) * 4 + 3] = al.$O4 == 3 ? 1 : 0
                    }
                    okA._vec3(W);
                    okA._vec3(S);
                    Y += 1;
                    if (Y == 4) {
                        break
                    }
                }
            }
            var ao = m.$61.length;
            var Y = 0;
            for (var af = 0; af < ao; ++af) {
                var al = m.$61[af];
                if (al.$P[m.$B4]) {
                    var F = al.getPos();
                    var D = al.getRange();
                    var S = al.getColor();
                    z[(23 + Y) * 4] = F.x;
                    z[(23 + Y) * 4 + 1] = F.y;
                    z[(23 + Y) * 4 + 2] = F.z;
                    z[(23 + Y) * 4 + 3] = D;
                    z[(27 + Y) * 4] = S.x * al.$l3;
                    z[(27 + Y) * 4 + 1] = S.y * al.$l3;
                    z[(27 + Y) * 4 + 2] = S.z * al.$l3;
                    if (ad) {
                        z[(31 + Y) * 4] = al.$O4 == 0 ? 1 : 0;
                        z[(31 + Y) * 4 + 1] = al.$O4 == 1 ? 1 : 0;
                        z[(31 + Y) * 4 + 2] = al.$O4 == 2 ? 1 : 0;
                        z[(31 + Y) * 4 + 3] = al.$O4 == 3 ? 1 : 0
                    }
                    okA._vec3(F);
                    okA._vec3(S);
                    Y += 1;
                    if (Y == 4) {
                        break
                    }
                }
            }
            var L = m.$p1.length;
            var Y = 0;
            for (var af = 0; af < L; ++af) {
                var al = m.$p1[af];
                if (al.$P[m.$B4]) {
                    var F = al.getPos();
                    var W = al.getLightDir();
                    var an = al.getInnerCone() * Math.PI / 180;
                    var h = al.getOuterCone() * Math.PI / 180;
                    var S = al.getColor();
                    z[(35 + Y) * 4] = F.x;
                    z[(35 + Y) * 4 + 1] = F.y;
                    z[(35 + Y) * 4 + 2] = F.z;
                    z[(39 + Y) * 4] = W.x;
                    z[(39 + Y) * 4 + 1] = W.y;
                    z[(39 + Y) * 4 + 2] = W.z;
                    z[(39 + Y) * 4 + 3] = S.x * al.$l3;
                    z[(43 + Y) * 4] = an;
                    z[(43 + Y) * 4 + 1] = h;
                    z[(43 + Y) * 4 + 2] = S.y * al.$l3;
                    z[(43 + Y) * 4 + 3] = S.z * al.$l3;
                    if (ad) {
                        z[(47 + Y) * 4] = al.$O4 == 0 ? 1 : 0;
                        z[(47 + Y) * 4 + 1] = al.$O4 == 1 ? 1 : 0;
                        z[(47 + Y) * 4 + 2] = al.$O4 == 2 ? 1 : 0;
                        z[(47 + Y) * 4 + 3] = al.$O4 == 3 ? 1 : 0
                    }
                    okA._vec3(F);
                    okA._vec3(W);
                    okA._vec3(S);
                    Y += 1;
                    if (Y == 4) {
                        break
                    }
                }
            }
        }
        if (k || l || e.$S1) {
            I.setUniformFloat4Array("okUni_General", z)
        }
        if (l || k || e.$S1) {
            for (var ag = 0; ag < 7; ++ag) {
                if (e.$w1[ag] != -1) {
                    var G = J.getResource(e.$w1[ag]);
                    var a = G.isValid();
                    var N = 3553;
                    var A = K;
                    if (G.getType() == 34067) {
                        N = 34067;
                        A = aj
                    }
                    I.setSampler("okUni_Sampler" + ag, E);
                    I.setUniformFloat4("okUni_UvOffsetScale" + ag, e.$D1[ag * 2], e.$D1[ag * 2 + 1], e.$E1[ag * 2], e.$E1[ag * 2 + 1]);
                    if (a) {
                        G.bind(E);
                        var H = G.isMipMap();
                        Z.texParameteri(N, 10240, e.$u1[ag]);
                        if (H) {
                            if (e.$u1[ag] == 9729) {
                                Z.texParameteri(N, 10241, 9985)
                            } else {
                                if (e.$u1[ag] == 9728) {
                                    Z.texParameteri(N, 10241, 9984)
                                } else {
                                    Z.texParameteri(N, 10241, e.$u1[ag])
                                }
                            }
                        } else {
                            if (e.$u1[ag] == 9984 || e.$u1[ag] == 9986) {
                                Z.texParameteri(N, 10241, 9728)
                            } else {
                                if (e.$u1[ag] == 9985 || e.$u1[ag] == 9987) {
                                    Z.texParameteri(N, 10241, 9729)
                                } else {
                                    Z.texParameteri(N, 10241, e.$u1[ag])
                                }
                            }
                        }
                    } else {
                        A.bind(E);
                        Z.texParameteri(N, 10240, 9728);
                        Z.texParameteri(N, 10241, 9728)
                    }
                    Z.texParameteri(N, 10242, e.$y1[ag]);
                    Z.texParameteri(N, 10243, e.$z1[ag]);
                    E += 1
                }
            }
            var p = C.Texcoord1;
            var u = C.Texcoord2;
            if (p && u && p.buf == u.buf && p.iIdx == u.iIdx - 1) {
                I.setAttribute("okAttr_TC12", p.buf, p.$P4 + u.$P4, p.iOffset, p.iStride)
            } else {
                if (p) {
                    I.setAttribute("okAttr_TC1", p.buf, p.$P4, p.iOffset, p.iStride)
                } else {
                    if (u) {
                        I.setAttribute("okAttr_TC2", u.buf, u.$P4, u.iOffset, u.iStride)
                    }
                }
            }
            var t = C.Texcoord3;
            var w = C.Texcoord4;
            if (t && w && t.buf == w.buf && t.iIdx == w.iIdx - 1) {
                I.setAttribute("okAttr_TC34", t.buf, t.$P4 + t.$P4, t.iOffset, t.iStride)
            } else {
                if (t) {
                    I.setAttribute("okAttr_TC3", t.buf, t.$P4, t.iOffset, t.iStride)
                } else {
                    if (w) {
                        I.setAttribute("okAttr_TC4", w.buf, w.$P4, w.iOffset, w.iStride)
                    }
                }
            }
            var s = C[e.$s1[4]];
            if (s) {
                I.setAttribute("okAttr_Tangent", s.buf, s.$P4, s.iOffset, s.iStride)
            }
            var ae = C[e.$c[4]];
            if (ae) {
                I.setAttribute("okAttr_Binormal", ae.buf, ae.$P4, ae.iOffset, ae.iStride)
            }
        }
        if (m.$f) {
            var aa = C[m.$26];
            var y = C[m.$36];
            I.setAttribute("okAttr_BoneIdx", aa.buf, aa.$P4, aa.iOffset, aa.iStride);
            I.setAttribute("okAttr_BoneWeight", y.buf, y.$P4, y.iOffset, y.iStride);
            I.setUniformFloat4Array("okUni_BoneMat", m.$f)
        }
        if (ai) {
            ai(Z, m)
        }
        m.$95.drawIndex(m.$r4, m.$s4, m.$q4)
    }
    Z.enable(2929);
    Z.depthMask(true);
    Z.depthFunc(515);
    Z.enable(2884);
    okA._array(z)
};
function okRenderDepthStage() {
    okBaseCall(this);
    this.$13 = null;
    this.$23 = null;
    this.$03 = null
}
okExtend(okRenderDepthStage, okRenderBaseStage);
okRenderDepthStage.prototype.createResource = function () {
    var e = this.$T5.rc;
    var d = this.$T5.$P5;
    var c = this.$T5.$S5;
    var a = this.$T5.$63;
    if (this.$23 == null) {
        this.$23 = new okTexture(e)
    }
    this.$23.createTexture(3553, d.$a4, d.$94, a.bFloatRt ? 6406 : 6408, a.bFloatRt ? 5126 : 5121);
    c.setRenderTarget("DTex", this.$23);
    if (this.depthStencilBuffer == null) {
        this.depthStencilBuffer = new okRenderBuffer(e)
    }
    this.depthStencilBuffer.createBuffer(34041, d.$a4, d.$94);
    c.setRenderTarget("DSBuf", this.depthStencilBuffer);
    if (this.$13 == null) {
        this.$13 = new okFrameBuffer(e)
    }
    this.$13.createBuffer();
    this.$13.bind();
    this.$13.attachRenderTexture(0, this.$23);
    this.$13.attachDepthStencilBuffer(this.depthStencilBuffer);
    this.$13.unbind()
};
okRenderDepthStage.prototype.deleteResource = function () {
    var d = this.$T5.rc;
    var c = this.$T5.$P5;
    var a = this.$T5.$S5;
    if (this.$23) {
        this.$23.releaseTexture();
        a.setRenderTarget("DTex", null)
    }
    if (this.depthStencilBuffer) {
        this.depthStencilBuffer.releaseBuffer();
        a.setRenderTarget("DSBuf", null)
    }
    if (this.$13) {
        this.$13.releaseBuffer()
    }
};
okRenderDepthStage.prototype.beginView = function (a) {
    var e = this.$T5.rc;
    var c = this.$T5.$P5;
    var d = this.$T5.$P5.$U2;
    if (a != true) {
        this.$13.bind();
        d.bindViewport();
        e.clearColor(1, 1, 1, 1);
        e.clearDepth(1);
        e.clear(16384 | 256 | 1024);
        this.$13.unbind();
        if (c.bAntiAlias) {
            e.clearDepth(1);
            e.clear(256 | 1024)
        }
    }
};
okRenderDepthStage.prototype.endView = function () {
};
okRenderDepthStage.prototype.render = function () {
    var f = this.$T5.rc;
    var d = this.$T5.$P5;
    var c = this.$T5.$R5;
    var a = this.$T5.$63;
    this.$13.bind();
    d.$U2.bindViewport();
    f.enable(2929);
    f.depthFunc(515);
    f.enable(2884);
    f.depthMask(true);
    f.colorMask(true, true, true, true);
    var e = c.getBatchList("Visible_Opaque");
    if (e.length > 0) {
        this._renderBatches(e, "Depth", false, false, this._clipBatch)
    }
    if (a.iDepthBits < 24 && !d.bAntiAlias) {
        f.clearDepth(1);
        f.clear(256)
    }
    this.$13.unbind()
};
okRenderDepthStage.prototype._clipBatch = function (a) {
    return a.$A5.$72
};
function okRenderShadowStage() {
    okBaseCall(this);
    this.$k1 = new Array;
    this.$p4 = 512;
    this.$e5 = null;
    this.$g5 = null;
    this.$d5 = null;
    this.$M5 = null;
    this.$N5 = null;
    this.$J3 = null;
    this.$I3 = null;
    this.$S6 = [0, 1]
}
okExtend(okRenderShadowStage, okRenderBaseStage);
okRenderShadowStage.prototype.clear = function () {
    this.$k1.length = 0;
    okBaseCall(this, "clear")
};
okRenderShadowStage.prototype.createResource = function () {
    var f = this.$T5.rc;
    var e = this.$T5.$P5;
    var d = this.$T5.$R5;
    var c = this.$T5.$S5;
    var a = this.$T5.$63;
    if (this.$g5 == null) {
        this.$g5 = new okTexture(f)
    }
    this.$g5.createTexture(3553, Math.min(this.$p4, e.$a4), Math.min(this.$p4, e.$94), a.bFloatRt ? 6406 : 6408, a.bFloatRt ? 5126 : 5121);
    c.setRenderTarget("ShadowDepth", this.$g5);
    if (this.$d5 == null) {
        this.$d5 = new okRenderBuffer(f)
    }
    this.$d5.createBuffer(33189, Math.min(this.$p4, e.$a4), Math.min(this.$p4, e.$94));
    if (this.$e5 == null) {
        this.$e5 = new okFrameBuffer(f)
    }
    this.$e5.createBuffer();
    this.$e5.bind();
    this.$e5.attachRenderTexture(0, this.$g5);
    this.$e5.attachDepthBuffer(this.$d5);
    this.$e5.unbind();
    if (this.$N5 == null) {
        this.$N5 = new okTexture(f)
    }
    this.$N5.createTexture(3553, e.$a4, e.$94, 6408);
    c.setRenderTarget("ShadowProj", this.$N5);
    if (this.$M5 == null) {
        this.$M5 = new okFrameBuffer(f)
    }
    this.$M5.createBuffer();
    this.$M5.bind();
    this.$M5.attachRenderTexture(0, this.$N5);
    this.$M5.attachDepthStencilBuffer(c.getRenderTarget("DSBuf"));
    this.$M5.unbind();
    if (this.$J3 == null) {
        this.$J3 = [new okArrayBuffer(f), new okArrayBuffer(f)]
    }
    this.$J3[0].createBuffer(34962, 5126, 35044, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    this.$J3[1].createBuffer(34962, 5126, 35044, new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
    if (this.$I3 == null) {
        this.$I3 = new okArrayBuffer(f)
    }
    this.$I3.createBuffer(34963, 5123, 35044, new Uint16Array([0, 1, 2, 0, 2, 3, 1, 5, 6, 1, 6, 2, 3, 2, 6, 3, 6, 7, 4, 0, 3, 4, 3, 7, 4, 5, 1, 4, 1, 0, 4, 7, 6, 4, 6, 5]))
};
okRenderShadowStage.prototype.deleteResource = function () {
    var e = this.$T5.rc;
    var d = this.$T5.$P5;
    var c = this.$T5.$R5;
    var a = this.$T5.$S5;
    if (this.$g5) {
        this.$g5.releaseTexture();
        a.setRenderTarget("ShadowDepth", null)
    }
    if (this.$d5) {
        this.$d5.releaseBuffer()
    }
    if (this.$e5) {
        this.$e5.releaseBuffer()
    }
    if (this.$N5) {
        this.$N5.releaseTexture();
        a.setRenderTarget("ShadowProj", null)
    }
    if (this.$M5) {
        this.$M5.releaseBuffer()
    }
    if (this.$J3[0]) {
        this.$J3[0].releaseBuffer()
    }
    if (this.$J3[1]) {
        this.$J3[1].releaseBuffer()
    }
    if (this.$I3) {
        this.$I3.releaseBuffer()
    }
};
okRenderShadowStage.prototype.beginView = function () {
};
okRenderShadowStage.prototype.endView = function () {
};
okRenderShadowStage.prototype.render = function () {
    var C = this.$T5.rc;
    var a = this.$T5.$P5;
    var k = this.$T5.$K6;
    var x = a.$I6;
    var e = x.getZone();
    var f = this.$T5.$R5;
    var J = this.$T5.$S5;
    var H = a.$U2;
    var G = H.getPos();
    var y = Math.min(a.$a4, this.$p4);
    var w = Math.min(a.$94, this.$p4);
    var B = H.getViewInvMat4();
    B.m03 = B.m13 = B.m23 = 0;
    if (!a.$z2 || !x) {
        return
    }
    this.$k1.length = 0;
    var s = e.$R;
    var o = 0;
    var M = s.getRoot();
    while (M) {
        var p = M.data;
        if (!p.$22 || !p.$M2) {
            p.$O4 = 3
        } else {
            p.$O4 = o;
            o += 1;
            var h = p.$6.length;
            for (var F = 0; F < h; ++F) {
                var t = p.$6[F];
                if ((t.getType() & (1 | 2 | 32 | 64 | 128 | 256)) && t.$M2 && t.$22 && t.getState() != 1) {
                    this._genShadowCaster(p, t, a)
                }
            }
        }
        M = M.next
    }
    var E = this.$k1.length;
    var n = 0;
    var K = new okLayout2DHelper(y, w);
    for (var F = 0; F < E; ++F) {
        var m = this.$k1[F];
        var D = new okVec2(0, 0);
        if (m.$r3 >= 1) {
            D.x = Math.min(y, m.$s3 * Math.max(a.$U2.getViewportWidth(), a.$U2.getViewportHeight()));
            D.y = Math.min(w, D.x / m.$r3)
        } else {
            D.y = Math.min(w, m.$s3 * Math.max(a.$U2.getViewportWidth(), a.$U2.getViewportHeight()));
            D.x = Math.min(y, D.y * m.$r3)
        }
        D.x = Math.max(8, D.x);
        D.y = Math.max(8, D.y);
        m.$O5 = K.add(D.x, D.y);
        if (m.$O5 == null) {
            m.$r2 = true;
            K.reset(y, w);
            m.$O5 = K.add(D.x, D.y)
        }
        m.$O5.width = Math.min(m.$O5.width, a.$a4);
        m.$O5.height = Math.min(m.$O5.height, a.$94);
        m.$O5.width -= 3;
        m.$O5.height -= 3;
        m.$O5.width = okAlign(m.$O5.width, 4);
        m.$O5.height = okAlign(m.$O5.height, 4);
        m.$O5.x += 2;
        m.$O5.y += 2;
        m.$O5.width -= 2;
        m.$O5.height -= 2;
        var c = new okVec2(m.$O5.x / y, m.$O5.y / w);
        var A = new okVec2(m.$O5.width / y, m.$O5.height / w);
        var v = new okMat4();
        m.$m5.clone(v);
        v.m00 = (v.m00 + v.m30) / 2;
        v.m01 = (v.m01 + v.m31) / 2;
        v.m02 = (v.m02 + v.m32) / 2;
        v.m03 = (v.m03 + v.m33) / 2;
        v.m00 = v.m00 * A.x + v.m30 * c.x;
        v.m01 = v.m01 * A.x + v.m31 * c.x;
        v.m02 = v.m02 * A.x + v.m32 * c.x;
        v.m03 = v.m03 * A.x + v.m33 * c.x;
        v.m10 = (v.m10 + v.m30) / 2;
        v.m11 = (v.m11 + v.m31) / 2;
        v.m12 = (v.m12 + v.m32) / 2;
        v.m13 = (v.m13 + v.m33) / 2;
        v.m10 = v.m10 * A.y + v.m30 * c.y;
        v.m11 = v.m11 * A.y + v.m31 * c.y;
        v.m12 = v.m12 * A.y + v.m32 * c.y;
        v.m13 = v.m13 * A.y + v.m33 * c.y;
        m.$u5 = v
    }
    this.$M5.bind();
    H.bindViewport();
    C.clearColor(1, 1, 1, 1);
    C.clear(16384 | 1024);
    var q = J.getRenderTarget("DTex");
    var l = 0;
    while (l < E) {
        this.$e5.bind();
        C.viewport(0, 0, y, w);
        C.scissor(0, 0, y, w);
        C.clearColor(1, 1, 1, 1);
        C.clear(16384 | 256);
        C.enable(2929);
        C.depthFunc(515);
        var u = 0;
        for (u = l; u < E; ++u) {
            var m = this.$k1[u];
            if (m.$r2) {
                m.$r2 = false;
                break
            }
            var I = m.$O5;
            C.viewport(I.x, I.y, I.width, I.height);
            var L = m.$b;
            if (L.length > 0) {
                this._renderBatches(L, "ShadowDepth", false, false, null, this._setDepthBatch, m.$m5)
            }
        }
        this.$M5.bind();
        H.bindViewport();
        for (var F = l; F < u; ++F) {
            var m = this.$k1[F];
            var d = m.$c5;
            C.enable(2884);
            C.disable(2929);
            C.depthMask(false);
            C.enable(3042);
            C.blendFuncSeparate(774, 0, 772, 0);
            C.colorMask(d.$O4 == 0, d.$O4 == 1, d.$O4 == 2, false);
            var z = k.getShadowFinalProgram();
            z.bind();
            z.setAttribute("vertMask0", this.$J3[0], 4);
            z.setAttribute("vertMask1", this.$J3[1], 4);
            if (m.$f5.$v2) {
                m.$f5._genPointList()
            }
            z.setUniformVec3Array("vertList", m.$f5.$81);
            H.getViewProjMat4().clone(this.$1[0]);
            H.getViewProjInvMat4().clone(this.$1[1]);
            m.$u5.clone(this.$1[2]);
            z.setUniformMat4Array("matArray", this.$1);
            z.setUniformFloat4("screenPosOffsetAndScale", H.$35 / this.$N5.getSizeU(), (C.canvas.clientHeight - H.$45 - H.$15) / this.$N5.getSizeV(), H.$25 / this.$N5.getSizeU(), H.$15 / this.$N5.getSizeV());
            z.setUniformFloat3("shadowPixelSizeAndOffset", 1 / y, 1 / w, Math.max(p.$t3, m.$73.$t3));
            z.setUniformFloat4("shadowClamp", m.$O5.x / y, m.$O5.y / w, (m.$O5.x + m.$O5.width) / y, (m.$O5.y + m.$O5.height) / w);
            z.setSamplerArray("samplerArray", this.$S6);
            q.bind(0);
            C.texParameteri(3553, 10240, 9728);
            C.texParameteri(3553, 10241, 9728);
            C.texParameteri(3553, 10242, 33071);
            C.texParameteri(3553, 10243, 33071);
            this.$g5.bind(1);
            C.texParameteri(3553, 10240, 9728);
            C.texParameteri(3553, 10241, 9728);
            C.texParameteri(3553, 10242, 33071);
            C.texParameteri(3553, 10243, 33071);
            this.$I3.drawIndex(4);
            C.disable(3042);
            C.enable(2929);
            l += 1
        }
        C.enable(2884);
        C.depthMask(true);
        C.colorMask(true, true, true, true);
        this.$M5.unbind();
        H.bindViewport()
    }
};
okRenderShadowStage.prototype._setDepthBatch = function (c, a) {
    c.enable(2929)
};
okRenderShadowStage.prototype._genShadowCaster = function (u, C, a) {
    var H = a.$U2;
    if (u.getType() == 4) {
        var l = u.getMat43();
        l.setColumn(3, 0, 0, 0);
        var A = u.getInvMat43();
        var e = C.getBoundingBox();
        var E = okA.vec3(), D = okA.vec3();
        E.x = 10000000000;
        E.y = 10000000000;
        E.z = 10000000000;
        D.x = -10000000000;
        D.y = -10000000000;
        D.z = -10000000000;
        for (var G = 0; G < 8; ++G) {
            var t = e.getPoint(G);
            var B = okMat43MulVec3(A, t);
            E.x = E.x < B.x ? E.x : B.x;
            E.y = E.y < B.y ? E.y : B.y;
            E.z = E.z < B.z ? E.z : B.z;
            D.x = D.x > B.x ? D.x : B.x;
            D.y = D.y > B.y ? D.y : B.y;
            D.z = D.z > B.z ? D.z : B.z
        }
        var x = okA.vec3();
        x.x = (E.x + D.x) * 0.5;
        x.y = (E.y + D.y) * 0.5;
        x.z = (E.z + D.z) * 0.5;
        x.z = D.z + 0.1;
        var o = okA.vec3();
        o.x = D.x - E.x;
        o.y = D.y - E.y;
        o.z = D.z - E.z;
        okA._vec3(D);
        okA._vec3(E);
        l.setColumn(3, okMat43MulVec3(l, x));
        A = l.inverse();
        var q = new okShadowCaster();
        q.$73 = C;
        q.$c5 = u;
        q.$b = new Array;
        C.genRenderBatch(q.$b, a);
        q.$l5 = new okMat4();
        A.toMat4(q.$l5);
        q.$m5 = okMat4Mul(okMat4Ortho(-o.x * 0.5, o.x * 0.5, o.y * 0.5, -o.y * 0.5, 0.1, o.z + 0.1), q.$l5);
        var k = 0.1, s = o.z + 0.1;
        q.$m5.m20 = -A.m20 / (s - k);
        q.$m5.m21 = -A.m21 / (s - k);
        q.$m5.m22 = -A.m22 / (s - k);
        q.$m5.m23 = (-A.m23 - k) / (s - k);
        q.$f5 = new okFrustum();
        q.$f5.setByViewProjMat(okMat4Mul(okMat4Ortho(-o.x * 0.5, o.x * 0.5, o.y * 0.5, -o.y * 0.5, 0.1, 10000), q.$l5));
        q.$r3 = o.x / o.y;
        var F = okVec3Sub(e.vMax, e.vMin).len();
        var z = new okVec4((e.vMax.x + e.vMin.x) * 0.5, (e.vMax.y + e.vMin.y) * 0.5, (e.vMax.z + e.vMin.z) * 0.5, 1);
        var h = okMat4MulVec4(H.getViewProjMat4(), z);
        q.$s3 = C.$u3 * F / Math.max(1, Math.abs(h.w));
        this.$k1.push(q);
        okA._vec3(x);
        okA._vec3(o)
    } else {
        if (u.getType() == 16) {
            var l = u.getMat43();
            var A = l.inverse();
            var e = C.getBoundingBox();
            var E = new okVec3(1000000, 1000000, 1000000);
            var D = new okVec3(-1000000, -1000000, -1000000);
            for (var G = 0; G < 8; ++G) {
                var t = e.getPoint(G);
                var B = okMat43MulVec3(A, t);
                E = okVec3Min(E, B);
                D = okVec3Max(D, B)
            }
            var q = new okShadowCaster();
            q.$73 = C;
            q.$c5 = u;
            q.$b = new Array;
            C.genRenderBatch(q.$b, a);
            q.$l5 = new okMat4();
            A.toMat4(q.$l5);
            q.$r3 = 1;
            var s = -E.z + 0.1, k = Math.max(0.1, -D.z);
            q.$m5 = okMat4Mul(okMat4Proj(u.getOuterCone(), 1, k, s), q.$l5);
            q.$m5.m20 = -q.$l5.m20 / (s - k);
            q.$m5.m21 = -q.$l5.m21 / (s - k);
            q.$m5.m22 = -q.$l5.m22 / (s - k);
            q.$m5.m23 = (-q.$l5.m23 - k) / (s - k);
            q.$f5 = new okFrustum();
            q.$f5.setByViewProjMat(okMat4Mul(okMat4Proj(u.getOuterCone(), 1, k, u.$q3), q.$l5));
            var F = okVec3Sub(e.vMax, e.vMin).len();
            var z = new okVec4((e.vMax.x + e.vMin.x) * 0.5, (e.vMax.y + e.vMin.y) * 0.5, (e.vMax.z + e.vMin.z) * 0.5, 1);
            var h = okMat4MulVec4(H.getViewProjMat4(), z);
            q.$s3 = C.$u3 * F / Math.max(1, Math.abs(h.w));
            this.$k1.push(q)
        } else {
            if (u.getType() == 8) {
                var m = okVec3Sub(u.getPos(), C.getPos());
                var n = new okVec3(0, 1, 0);
                var p = okVec3Cross(n, m);
                if (p.equal(OAK.VEC3_ZERO)) {
                    n.set(1, 0, 0);
                    p = okVec3Cross(n, m)
                }
                n = okVec3Cross(m, p);
                p = p.normalize();
                n = n.normalize();
                m = m.normalize();
                var l = new okMat43();
                l.setColumn(0, p);
                l.setColumn(1, n);
                l.setColumn(2, m);
                l.setColumn(3, u.getPos());
                var A = l.inverse();
                var e = C.getBoundingBox();
                var E = new okVec3(1000000, 1000000, 1000000);
                var D = new okVec3(-1000000, -1000000, -1000000);
                var f = 0, d = 0;
                for (var G = 0; G < 8; ++G) {
                    var t = e.getPoint(G);
                    var B = okMat43MulVec3(A, t);
                    E = okVec3Min(E, B);
                    D = okVec3Max(D, B);
                    f = Math.max(f, Math.atan(Math.abs(B.x) / Math.max(0.1, -B.z)));
                    d = Math.max(d, Math.atan(Math.abs(B.y) / Math.max(0.1, -B.z)))
                }
                if (Math.max(f, d) < 120 * Math.PI / 180) {
                    var q = new okShadowCaster();
                    q.$73 = C;
                    q.$c5 = u;
                    q.$b = new Array;
                    C.genRenderBatch(q.$b, a);
                    q.$l5 = new okMat4();
                    A.toMat4(q.$l5);
                    q.$r3 = Math.tan(f) / Math.tan(d);
                    var s = -E.z + 0.1, k = Math.max(0.1, -D.z);
                    q.$m5 = okMat4Mul(okMat4Proj(d * 2 * 180 / Math.PI, q.$r3, k, s), q.$l5);
                    q.$m5.m20 = -q.$l5.m20 / (s - k);
                    q.$m5.m21 = -q.$l5.m21 / (s - k);
                    q.$m5.m22 = -q.$l5.m22 / (s - k);
                    q.$m5.m23 = (-q.$l5.m23 - k) / (s - k);
                    q.$f5 = new okFrustum();
                    q.$f5.setByViewProjMat(okMat4Mul(okMat4Proj(d * 2 * 180 / Math.PI, q.$r3, k, u.$q3), q.$l5));
                    var F = okVec3Sub(e.vMax, e.vMin).len();
                    var z = new okVec4((e.vMax.x + e.vMin.x) * 0.5, (e.vMax.y + e.vMin.y) * 0.5, (e.vMax.z + e.vMin.z) * 0.5, 1);
                    var h = okMat4MulVec4(H.getViewProjMat4(), z);
                    q.$s3 = C.$u3 * F / Math.max(1, Math.abs(h.w));
                    this.$k1.push(q)
                } else {
                    var I = [new okMat43(), new okMat43(), new okMat43(), new okMat43(), new okMat43(), new okMat43()];
                    var y = u.getPos();
                    I[0].setColumn(0, 0, 1, 0);
                    I[0].setColumn(1, 0, 0, 1);
                    I[0].setColumn(2, 1, 0, 0);
                    I[0].setColumn(3, y);
                    I[1].setColumn(0, 0, -1, 0);
                    I[1].setColumn(1, 0, 0, 1);
                    I[1].setColumn(2, -1, 0, 0);
                    I[1].setColumn(3, y);
                    I[2].setColumn(0, -1, 0, 0);
                    I[2].setColumn(1, 0, 0, 1);
                    I[2].setColumn(2, 0, 1, 0);
                    I[2].setColumn(3, y);
                    I[3].setColumn(0, 1, 0, 0);
                    I[3].setColumn(1, 0, 0, 1);
                    I[3].setColumn(2, 0, -1, 0);
                    I[3].setColumn(3, y);
                    I[4].setColumn(0, 1, 0, 0);
                    I[4].setColumn(1, 0, 1, 0);
                    I[4].setColumn(2, 0, 0, 1);
                    I[4].setColumn(3, y);
                    I[5].setColumn(0, 1, 0, 0);
                    I[5].setColumn(1, 0, -1, 0);
                    I[5].setColumn(2, 0, 0, -1);
                    I[5].setColumn(3, y);
                    var c = [I[0].inverse(), I[1].inverse(), I[2].inverse(), I[3].inverse(), I[4].inverse(), I[5].inverse()];
                    for (var G = 0; G < 6; ++G) {
                        var A = c[G];
                        var e = C.getBoundingBox();
                        var E = new okVec3(1000000, 1000000, 1000000);
                        var D = new okVec3(-1000000, -1000000, -1000000);
                        var f = 0, d = 0;
                        for (var G = 0; G < 8; ++G) {
                            var t = e.getPoint(G);
                            var B = okMat43MulVec3(A, t);
                            E = okVec3Min(E, B);
                            D = okVec3Max(D, B)
                        }
                        var s = -E.z + 0.1, k = Math.max(0.1, -D.z);
                        if (s < 0.1) {
                            continue
                        }
                        var w = new okFrustum();
                        w.setByViewProjMat(okMat4Mul(okMat4Proj(91, 1, k, u.$q3), A));
                        if (w.collideAABBox(e) == 0) {
                            continue
                        }
                        var q = new okShadowCaster();
                        q.$73 = C;
                        q.$c5 = u;
                        q.$b = new Array;
                        C.genRenderBatch(q.$b, a);
                        q.$l5 = new okMat4();
                        A.toMat4(q.$l5);
                        q.$r3 = 1;
                        q.$m5 = okMat4Mul(okMat4Proj(d * 2 * 180 / Math.PI, q.$r3, k, s), q.$l5);
                        q.$m5.m20 = -q.$l5.m20 / (s - k);
                        q.$m5.m21 = -q.$l5.m21 / (s - k);
                        q.$m5.m22 = -q.$l5.m22 / (s - k);
                        q.$m5.m23 = (-q.$l5.m23 - k) / (s - k);
                        q.$f5 = w;
                        var F = okVec3Sub(e.vMax, e.vMin).len();
                        var z = new okVec4((e.vMax.x + e.vMin.x) * 0.5, (e.vMax.y + e.vMin.y) * 0.5, (e.vMax.z + e.vMin.z) * 0.5, 1);
                        var h = okMat4MulVec4(H.getViewProjMat4(), z);
                        q.$s3 = C.$u3 * F / Math.max(1, Math.abs(h.w));
                        this.$k1.push(q)
                    }
                }
            }
        }
    }
};
function okShadowCaster() {
    this.$73 = null;
    this.$c5 = null;
    this.$b = null;
    this.$k5 = null;
    this.$l5 = null;
    this.$m5 = null;
    this.$f5 = null;
    this.$u5 = null;
    this.$r3 = 1;
    this.$s3 = 0;
    this.$O5 = null;
    this.$r2 = false
}
function okRenderLightingStage() {
    okBaseCall(this);
    this.$e5 = null;
    this.$g5 = null
}
okExtend(okRenderLightingStage, okRenderBaseStage);
okRenderLightingStage.prototype.createResource = function () {
    var d = this.$T5.rc;
    var c = this.$T5.$P5;
    var a = this.$T5.$S5;
    if (c.bAntiAlias == false) {
        if (this.$g5 == null) {
            this.$g5 = new okTexture(d)
        }
        this.$g5.createTexture(3553, c.$a4, c.$94, 6408);
        a.setRenderTarget("LTex", this.$g5);
        if (this.$e5 == null) {
            this.$e5 = new okFrameBuffer(d)
        }
        this.$e5.createBuffer();
        this.$e5.bind();
        this.$e5.attachRenderTexture(0, this.$g5);
        this.$e5.attachDepthStencilBuffer(a.getRenderTarget("DSBuf"));
        this.$e5.unbind()
    }
};
okRenderLightingStage.prototype.deleteResource = function () {
    var d = this.$T5.rc;
    var c = this.$T5.$P5;
    var a = this.$T5.$S5;
    if (c.bAntiAlias == false) {
        if (this.$g5) {
            this.$g5.releaseTexture();
            a.setRenderTarget("LTex", null)
        }
        if (this.$e5) {
            this.$e5.releaseBuffer()
        }
    }
};
okRenderLightingStage.prototype.renderBackTex = function (a) {
    var e = this.$T5.rc;
    var c = this.$T5.$P5;
    var d = c.$U2;
    e.disable(2929);
    e.depthMask(false);
    e.disable(3042);
    var k = this.$T5.$U5.getResource("$R$Quad");
    var f = k.getMesh(0);
    var h = this.$T5.$K6.getOutputProgram();
    h.bind();
    h.setAttribute("okAttr_Pos", f.getAttributeArrayBuffer("Position"), 3);
    h.setUniformFloat4("okUni_DestOffsetScale", 0, 0, 1, 1);
    h.setUniformFloat4("okUni_SrcOffsetScale", 0, 1, 1, -1);
    h.setTexture("okUni_Tex", a, 33071, 9729);
    f.draw();
    e.enable(2929);
    e.depthMask(true)
};
okRenderLightingStage.prototype.beginView = function (a) {
    var e = this.$T5.rc;
    var d = this.$T5.$P5.$U2;
    var c = this.$T5.$P5;
    if (a != true) {
        if (c.bAntiAlias) {
            e.bindFramebuffer(36160, null)
        } else {
            this.$e5.bind()
        }
        d.bindViewport();
        if (d.$W3 == -1) {
            var f = d.getBackColor();
            e.clearColor(f.x, f.y, f.z, f.w);
            e.clear(16384)
        } else {
            this.renderBackTex(this.$T5.$U5.getResource(d.$W3))
        }
        if (!c.bAntiAlias) {
            this.$e5.unbind()
        }
    }
};
okRenderLightingStage.prototype.endView = function () {
};
okRenderLightingStage.prototype.render = function (d) {
    var f = this.$T5.rc;
    var d = this.$T5.$P5;
    var c = this.$T5.$R5;
    if (d.bAntiAlias) {
        f.bindFramebuffer(36160, null)
    } else {
        this.$e5.bind()
    }
    d.$U2.bindViewport();
    var e = c.getBatchList("Visible_Opaque");
    if (e.length > 0) {
        f.enable(2929);
        f.depthFunc(515);
        f.enable(2884);
        f.disable(3042);
        this._renderBatches(e, "Lighting", true, true)
    }
    var a = c.getBatchList("Visible_Trans");
    if (a.length > 0) {
        f.enable(3042);
        f.enable(2884);
        this._renderBatches(a, "Lighting", true, true);
        f.disable(3042)
    }
    if (!d.bAntiAlias) {
        this.$e5.unbind()
    }
};
function okRenderPostStage() {
    okBaseCall(this);
    this.$J5 = null;
    this.$K5 = null;
    this.$43 = null;
    this.$I5 = null
}
okExtend(okRenderPostStage, okRenderBaseStage);
okRenderPostStage.prototype.createResource = function () {
    var d = this.$T5.rc;
    var c = this.$T5.$P5;
    var a = this.$T5.$S5;
    if (this.$J5 == null) {
        this.$J5 = new okTexture(d)
    }
    this.$J5.createTexture(3553, c.$a4, c.$94, 6408);
    if (this.$K5 == null) {
        this.$K5 = new okTexture(d)
    }
    this.$K5.createTexture(3553, Math.floor(c.$a4 * 0.5), Math.floor(c.$94 * 0.5), 6408);
    if (this.$43 == null) {
        this.$43 = new okRenderBuffer(d)
    }
    this.$43.createBuffer(34041, Math.floor(c.$a4 * 0.5), Math.floor(c.$94 * 0.5));
    if (this.$I5 == null) {
        this.$I5 = new okFrameBuffer(d)
    }
    this.$I5.createBuffer()
};
okRenderPostStage.prototype.deleteResource = function () {
    var d = this.$T5.rc;
    var c = this.$T5.$P5;
    var a = this.$T5.$S5;
    if (this.$J5) {
        this.$J5.releaseTexture()
    }
    if (this.$K5) {
        this.$K5.releaseTexture()
    }
    if (this.$43) {
        this.$43.releaseBuffer()
    }
    if (this.$I5) {
        this.$I5.releaseBuffer()
    }
};
okRenderPostStage.prototype.beginView = function (a) {
};
okRenderPostStage.prototype.endView = function () {
};
okRenderPostStage.prototype.render = function () {
    var a = this.$T5.rc;
    var m = this.$T5.$P5;
    var h = this.$T5.$K6;
    var p = this.$T5.$U5;
    var f = this.$T5.$R5;
    var q = this.$T5.$S5;
    var d = m.$U2;
    var o = m.$a4;
    var n = m.$94;
    var k = p.getResource("$R$Quad");
    var l = k.getMesh();
    var e = f.getBatchList("Visible_Glow");
    if (e.length > 0) {
        this.$I5.bind();
        this.$I5.attachRenderTexture(0, this.$J5);
        this.$I5.attachDepthStencilBuffer(q.getRenderTarget("DSBuf"));
        a.clearColor(0, 0, 0, 0);
        a.clear(16384);
        a.enable(2929);
        a.depthFunc(515);
        d.bindViewport();
        this._renderBatches(e, "Glow", false, true, null, null, null, true);
        a.disable(2929);
        a.depthMask(false);
        this.$I5.attachRenderTexture(0, this.$K5);
        this.$I5.attachDepthStencilBuffer(this.$43);
        a.viewport(0, 0, this.$K5.getSizeU(), this.$K5.getSizeV());
        var c = h.getGaussianProgram(0);
        c.bind();
        c.setAttribute("okAttr_Pos", l.getAttributeArrayBuffer("Position"), 3);
        c.setUniformFloat2("okUni_TexelSize", 1 / this.$J5.getSizeU(), 1 / this.$J5.getSizeV());
        c.setUniformFloat4("okUni_ScreenPosOffsetAndScale", d.$35 / o, (n - d.$45 - d.$15) / n, d.$25 / o, d.$15 / n);
        c.setTexture("okUni_Tex", this.$J5, 33071, 9729, 9729);
        l.draw();
        a.enable(3042);
        a.blendEquation(32774);
        a.blendFunc(1, 1);
        if (m.bAntiAlias) {
            a.bindFramebuffer(36160, null)
        } else {
            this.$I5.attachRenderTexture(0, q.getRenderTarget("LTex"));
            this.$I5.attachDepthStencilBuffer(q.getRenderTarget("DSBuf"))
        }
        a.viewport(0, 0, o, n);
        var c = h.getGaussianProgram(1);
        c.bind();
        c.setAttribute("okAttr_Pos", l.getAttributeArrayBuffer("Position"), 3);
        c.setUniformFloat2("okUni_TexelSize", 1 / this.$K5.getSizeU(), 1 / this.$K5.getSizeV());
        c.setUniformFloat4("okUni_ScreenPosOffsetAndScale", 0, 0, 1, 1);
        c.setTexture("okUni_Tex", this.$K5, 33071, 9729, 9729);
        l.draw();
        if (!m.bAntiAlias) {
            this.$I5.unbind()
        }
        a.enable(2929);
        a.depthMask(true);
        a.disable(3042)
    }
};
function okAttribFormat() {
    this.$e6 = "";
    this.iOffset = 0;
    this.iStride = 0;
    this.$P4 = 0;
    this.iIdx = 0;
    this.buf = null
}
okAttribFormat.prototype = {clear:function () {
    this.$e6 = "";
    this.iOffset = 0;
    this.iStride = 0;
    this.$P4 = 0;
    this.buf = null
}};
function okRenderBatch() {
    this.$a = okA.object();
    this.$95 = null;
    this.$r4 = 0;
    this.$s4 = 0;
    this.$q4 = 0;
    this.$A5 = null;
    this.$p5 = null;
    this.$r5 = null;
    this.$n5 = null;
    this.$q5 = null;
    this.$t = null;
    this.$61 = null;
    this.$p1 = null;
    this.$S2 = null;
    this.$f = null;
    this.$26 = null;
    this.$36 = null;
    this.$y2 = true;
    this.$d2 = false;
    this.$B4 = -1;
    this.$i1 = new Array;
    this.$v3 = 0;
    this.$y6 = "";
    this.$u6 = "";
    this.$w6 = "";
    this.$z6 = "";
    this.$v6 = "";
    this.$x6 = "";
    this.$l1 = okA.object();
    this.$m1 = okA.object();
    this.$B2 = true;
    this.$A2 = true
}
okRenderBatch.prototype = {clear:function () {
    this.$a = null;
    this.$95 = null;
    this.$r4 = 0;
    this.$s4 = 0;
    this.$q4 = 0;
    this.$A5 = null;
    if (this.$p5) {
        okA._mat4(this.$p5)
    }
    if (this.$r5) {
        okA._mat4(this.$r5)
    }
    if (this.$n5) {
        okA._mat4(this.$n5)
    }
    if (this.$q5) {
        okA._mat4(this.$q5)
    }
    this.$p5 = null;
    this.$r5 = null;
    this.$n5 = null;
    this.$q5 = null;
    this.$t = null;
    this.$61 = null;
    this.$p1 = null;
    if (this.$f) {
        okA._array(this.$f);
        this.$f = null
    }
    this.$26 = null;
    this.$36 = null;
    this.$S2 = null;
    this.$y2 = true;
    this.$d2 = false;
    this.$B4 = -1;
    this.$i1.length = 0;
    this.$y6 = "";
    this.$u6 = "";
    this.$w6 = "";
    this.$z6 = "";
    this.$v6 = "";
    this.$x6 = "";
    for (var a in this.$l1) {
        delete this.$l1[a]
    }
    for (var a in this.$m1) {
        delete this.$m1[a]
    }
    this.$B2 = true;
    this.$A2 = true;
    this.$v3 = 0
}, addResourceId:function (a) {
    this.$i1.push(a)
}, _genShdKey:function (a) {
    var B = this.$A5;
    var d = this.$a;
    var A = 0, C = 0, v = 0;
    var z = this.$t.length;
    for (var t = 0; t < z; ++t) {
        var k = this.$t[t];
        if (k.$P[this.$B4]) {
            A += 1;
            if (A == 4) {
                break
            }
        }
    }
    z = this.$61.length;
    for (var t = 0; t < z; ++t) {
        var k = this.$61[t];
        if (k.$P[this.$B4]) {
            C += 1;
            if (C == 4) {
                break
            }
        }
    }
    z = this.$p1.length;
    for (var t = 0; t < z; ++t) {
        var k = this.$p1[t];
        if (k.$P[this.$B4]) {
            v += 1;
            if (v == 4) {
                break
            }
        }
    }
    var c = a.$z2 && !B.$O2 && this.$y2 && a.$r1[1];
    var f = B._getShdKeyV();
    var n = B._getShdKeyF();
    var h = B._getShdKeyP();
    var x = d.Texcoord1;
    var w = d.Texcoord2;
    var u = d.Texcoord3;
    var s = d.Texcoord4;
    var q = (x ? 1 : 0) + (w ? 2 : 0) + (u ? 4 : 0) + (s ? 8 : 0) + ((x && w && x.iIdx == (w.iIdx - 1)) ? 16 : 0) + ((u && s && u.iIdx == (s.iIdx - 1)) ? 32 : 0);
    var l = 0, y = 0, o = 0;
    var p = 0, e = 0, m = 0;
    l = (this.$f ? 1 : 0) + (this.$d2 ? 2 : 0) + (d.Normal ? 4 : 0) + (d.Color ? 8 : 0);
    y = (d.Normal ? 1 : 0) + (d.Color ? 2 : 0) + (c ? 4 : 0) + (a.$g2 ? 8 : 0);
    o = (this.$f ? 1 : 0) + (this.$d2 ? 2 : 0) + (d.Normal ? 4 : 0) + (d.Color ? 8 : 0) + (c ? 16 : 0) + (a.$g2 ? 32 : 0);
    if (B.$S1) {
        p = (this.$f ? 1 : 0) + (this.$d2 ? 2 : 0) + (d.Normal ? 4 : 0) + (d.Color ? 8 : 0);
        e = (d.Normal ? 1 : 0) + (d.Color ? 2 : 0);
        m = (this.$f ? 1 : 0) + (this.$d2 ? 2 : 0) + (d.Normal ? 4 : 0) + (d.Color ? 8 : 0)
    } else {
        p = (this.$f ? 1 : 0) + (this.$d2 ? 2 : 0);
        e = 0;
        m = (this.$f ? 1 : 0) + (this.$d2 ? 2 : 0)
    }
    this.$y6 = "0" + f + "_" + q + "_" + l;
    this.$u6 = "0" + n + "_" + A + C + v + "_" + q + "_" + y;
    this.$w6 = "0" + h + "_" + A + C + v + "_" + q + "_" + o;
    if (B.$S1) {
        this.$z6 = "1" + f + "_" + q + "_" + p;
        this.$v6 = "1" + n + "_" + q + "_" + e;
        this.$x6 = "1" + h + "_" + q + "_" + m
    } else {
        this.$z6 = "2" + p;
        this.$v6 = "2" + e;
        this.$x6 = "2" + m
    }
}, _genShdDef:function (a) {
    var x = this.$A5;
    var d = this.$a;
    var w = 0, y = 0, p = 0;
    var v = this.$t.length;
    for (var n = 0; n < v; ++n) {
        var h = this.$t[n];
        if (h.$P[this.$B4]) {
            w += 1;
            if (w == 4) {
                break
            }
        }
    }
    v = this.$61.length;
    for (var n = 0; n < v; ++n) {
        var h = this.$61[n];
        if (h.$P[this.$B4]) {
            y += 1;
            if (y == 4) {
                break
            }
        }
    }
    v = this.$p1.length;
    for (var n = 0; n < v; ++n) {
        var h = this.$p1[n];
        if (h.$P[this.$B4]) {
            p += 1;
            if (p == 4) {
                break
            }
        }
    }
    var c = a.$z2 && !x.$O2 && this.$y2 && a.$r1[1];
    var u = d.Texcoord1;
    var t = d.Texcoord2;
    var o = d.Texcoord3;
    var m = d.Texcoord4;
    var l = (u ? 1 : 0) + (t ? 2 : 0) + (o ? 4 : 0) + (m ? 8 : 0) + ((u && t && u.iIdx == (t.iIdx - 1)) ? 16 : 0) + ((o && m && o.iIdx == (m.iIdx - 1)) ? 32 : 0);
    var f = this.$l1;
    x._getShdDef(f);
    f.OK_DCTLIGHT_NUM = w;
    f.OK_POINTLIGHT_NUM = y;
    f.OK_SPOTLIGHT_NUM = p;
    if (this.$f) {
        f.OK_SKANIMATION = 1
    }
    if (this.$d2) {
        f.OK_BILLBOARD = 1
    }
    if (d.Normal) {
        f.OK_NORMAL = 1
    }
    if (d.Color) {
        f.OK_VERTEX_COLOR = 1
    }
    if (c) {
        f.OK_DYNAMICSHADOW = 1
    }
    if (!a.$g2 && f.OK_FOG) {
        delete f.OK_FOG
    }
    var e = okA.object();
    if (l & 16) {
        f.OK_TC12 = 1;
        e.Texcoord1 = "okVary_TC12.xy";
        e.Texcoord2 = "okVary_TC12.zw"
    } else {
        if (l & 1) {
            f.OK_TC1 = 1;
            e.Texcoord1 = "okVary_TC1"
        } else {
            e.Texcoord1 = "vec2(0.0, 0.0)"
        }
        if (l & 2) {
            f.OK_TC2 = 1;
            e.Texcoord2 = "okVary_TC2"
        } else {
            e.Texcoord2 = "vec2(0.0, 0.0)"
        }
    }
    if (l & 32) {
        f.OK_TC34 = 1;
        e.Texcoord3 = "okVary_TC34.xy";
        e.Texcoord4 = "okVary_TC34.zw"
    } else {
        if (l & 4) {
            f.OK_TC3 = 1;
            e.Texcoord3 = "okVary_TC3"
        } else {
            e.Texcoord3 = "vec2(0.0, 0.0)"
        }
        if (l & 8) {
            f.OK_TC4 = 1;
            e.Texcoord4 = "okVary_TC4"
        } else {
            e.Texcoord4 = "vec2(0.0, 0.0)"
        }
    }
    if (e[x.$C1[0]]) {
        f.OK_ALBEDO1_TC = e[x.$C1[0]]
    }
    if (e[x.$C1[1]]) {
        f.OK_ALBEDO2_TC = e[x.$C1[1]]
    }
    if (e[x.$C1[2]]) {
        f.OK_ALBEDO3_TC = e[x.$C1[2]]
    }
    if (e[x.$C1[3]]) {
        f.OK_ALBEDO4_TC = e[x.$C1[3]]
    }
    if (e[x.$C1[4]]) {
        f.OK_NORMALMAP_TC = e[x.$C1[4]]
    }
    if (e[x.$C1[5]]) {
        f.OK_OPACITY_TC = e[x.$C1[5]]
    }
    if (e[x.$C1[6]]) {
        f.OK_SPECULAR_LEVEL_TC = e[x.$C1[6]]
    }
    okA._object(e);
    var q = this.$m1;
    if (x.$S1) {
        for (var k in this.$l1) {
            q[k] = this.$l1[k]
        }
    } else {
        if (this.$f) {
            q.OK_SKANIMATION = 1
        }
        if (this.$d2) {
            q.OK_BILLBOARD = 1
        }
    }
}, _getShdKeyV:function (a, c) {
    if (this.$B2) {
        this._genShdKey(a);
        this.$B2 = false
    }
    return c ? this.$z6 : this.$y6
}, _getShdKeyF:function (a, c) {
    if (this.$B2) {
        this._genShdKey(a);
        this.$B2 = false
    }
    return c ? this.$v6 : this.$u6
}, _getShdKeyP:function (a, c) {
    if (this.$B2) {
        this._genShdKey(a);
        this.$B2 = false
    }
    return c ? this.$x6 : this.$w6
}, _getShdDef:function (c, e, d) {
    if (this.$A2) {
        this._genShdDef(c);
        this.$A2 = false
    }
    if (e) {
        for (var a in this.$m1) {
            d[a] = this.$m1[a]
        }
    } else {
        for (var a in this.$l1) {
            d[a] = this.$l1[a]
        }
    }
}};
function okRenderSourceCollector() {
    this.$e1 = new Object;
    this.$c1 = new Object;
    this.$d1 = new Object;
    this.$S = new Object
}
okRenderSourceCollector.prototype = {clear:function () {
    this.$e1 = new Object;
    for (var c in this.$c1) {
        var e = this.$c1[c];
        if (this.$d1[c] == true) {
            var a = e.length;
            for (var d = 0; d < a; ++d) {
                okA._renderBatch(e[d])
            }
        }
        e.length = 0;
        delete this.$c1[c]
    }
    this.$d1 = new Object;
    this.$S = new Object
}, createEntityList:function (a) {
    var c = new Array;
    this.$e1[a] = c;
    return c
}, clearEntityList:function (a) {
    if (this.$e1[a]) {
        this.$e1[a].length = 0
    }
}, attachEntity:function (c, a, d) {
    this.$e1[c].push(a)
}, genBatchList:function (e, f) {
    var l = this.$e1[e];
    var k = f.$U2;
    if (l != null) {
        var h = new Array;
        var d = l.length;
        for (var c = 0; c < d; ++c) {
            var a = l[c];
            if (a.$M2 && a.getState() != 1) {
                a.genRenderBatch(h, f)
            }
        }
        this.$c1[e] = h;
        this.$d1[e] = false
    }
}, sortBatchListByCamera:function (k, p, o) {
    var d = p.$U2;
    var f = this.$c1[k];
    var h = d.getPos();
    var a = f.length;
    for (var m = 0; m < a; ++m) {
        var l = f[m];
        var q = l.$S2;
        var n = q.vMin;
        var s = q.vMax;
        var c = new okVec3((n.x + s.x) * 0.5, (n.y + s.y) * 0.5, (n.z + s.z) * 0.5);
        l.$v3 = okVec3Len(c, h)
    }
    var e = f.sort(o ? this._N2FSortFunc : this._F2NSortFunc);
    this.$c1[k] = e
}, getEntityList:function (a) {
    return this.$e1[a]
}, createBatchList:function (a) {
    this.$d1[a] = false;
    this.$c1[a] = okA.array();
    return this.$c1[a]
}, getBatchList:function (a) {
    return this.$c1[a]
}, enableReleaseBatch:function (c, a) {
    this.$d1[c] = a
}, createLightList:function (a) {
    this.$S[a] = new Array
}, attachLight:function (c, a) {
    this.$S[c].push(a)
}, getLightList:function (a) {
    return this.$S[a]
}, _F2NSortFunc:function (d, c) {
    return c.$v3 - d.$v3
}, _N2FSortFunc:function (d, c) {
    return d.$v3 - c.$v3
}};
function okRenderTargetCollector(a) {
    this.rc = a;
    this.$f1 = new Object
}
okRenderTargetCollector.prototype = {clear:function () {
    for (var a in this.$f1) {
        delete this.$f1[a]
    }
}, setRenderTarget:function (c, a) {
    this.$f1[c] = a
}, getRenderTarget:function (a) {
    return this.$f1[a]
}, setFinalRenderTarget:function () {
    this.rc.bindFramebuffer(36160, null)
}};
function okRenderer(h, c) {
    var d = h.canvas;
    this.rc = c.rc;
    this.$83 = c.$83;
    this.$63 = c.$63;
    this.$U5 = c.$U5;
    this.$J6 = c.$J6;
    this.$K6 = new okShaderManager(this);
    this.$R5 = new okRenderSourceCollector();
    this.$S5 = new okRenderTargetCollector(this.rc);
    this.$P5 = new okRenderEnvironment();
    this.$P5.canvas = d;
    this.$P5.$a4 = d.width;
    this.$P5.$94 = d.height;
    this.$P5.$S4 = (new Date).getTime();
    this.$P5.$i4 = 0;
    this.$P5.bAntiAlias = h.antialias ? true : false;
    var o = this.$U5.createResource(1, "$R$Quad", true);
    this.$U5.setCustomResourceState(o, 5);
    var f = this.$U5.getResource(o);
    okGenQuadMesh(f.createMesh("Quad"), -1, 1, 1, -1, false, true);
    var k = this.$U5.createResource(2, "$R$White", true);
    this.$U5.setCustomResourceState(k, 5);
    this.$U5.getResource(k).createTexture(3553, 1, 1, 6408, 5121, [255, 255, 255, 255]);
    var m = this.$U5.createResource(2, "$R$Black", true);
    this.$U5.setCustomResourceState(m, 5);
    this.$U5.getResource(m).createTexture(3553, 1, 1, 6408, 5121, [0, 0, 0, 0]);
    var l = this.$U5.createResource(2, "$R$WhiteCube", true);
    this.$U5.setCustomResourceState(l, 5);
    this.$U5.getResource(l).createTexture(34067, 1, 1, 6408, 5121, [255, 255, 255, 255], [255, 255, 255, 255], [255, 255, 255, 255], [255, 255, 255, 255], [255, 255, 255, 255], [255, 255, 255, 255]);
    var a = this.$U5.createResource(2, "$R$BlackCube", true);
    this.$U5.setCustomResourceState(a, 5);
    this.$U5.getResource(a).createTexture(34067, 1, 1, 6408, 5121, [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]);
    this.$N6 = new okFrameBuffer(this.rc);
    this.$N6.createBuffer();
    this.$Q5 = [new okRenderDepthStage(), new okRenderShadowStage(), new okRenderLightingStage(), new okRenderPostStage()];
    var n = this.$Q5.length;
    for (var e = 0; e < n; ++e) {
        this.$Q5[e].init(this)
    }
    this._createPipelineResource();
    for (var e = 0; e < this.$63.iTexNum; ++e) {
        this.rc.activeTexture(33984 + e);
        this.rc.bindTexture(3553, null)
    }
}
okRenderer.prototype = {clear:function () {
    this.$K6.clear();
    this.$R5.clear();
    this.$S5.clear();
    this.$P5.clear();
    this.$U5.deleteResource("$R$Quad");
    this.$U5.deleteResource("$R$White");
    this.$U5.deleteResource("$R$Black");
    this.$U5.deleteResource("$R$WhiteCube");
    this.$U5.deleteResource("$R$BlackCube");
    if (this.$N6) {
        this.$N6.releaseBuffer();
        this.$N6 = null
    }
    var c = this.$Q5.length;
    for (var a = 0; a < c; ++a) {
        this.$Q5[a].clear()
    }
}, _createPipelineResource:function () {
    var c = this.$Q5.length;
    for (var a = 0; a < c; ++a) {
        this.$Q5[a].createResource()
    }
}, _deletePipelineResource:function () {
    var c = this.$Q5.length;
    for (var a = 0; a < c; ++a) {
        this.$Q5[a].init(this);
        this.$Q5[a].deleteResource()
    }
}, _onResize:function () {
    this.$P5.$a4 = this.$P5.canvas.width;
    this.$P5.$94 = this.$P5.canvas.height;
    this._deletePipelineResource();
    this._createPipelineResource()
}, enableStage:function (c, a) {
    this.$Q5[c].enable(a);
    this.$P5.$r1[c] = a
}, isStageEnabled:function (a) {
    return this.$P5.$r1[a]
}, getRenderSourceCollector:function () {
    return this.$R5
}, getRenderTargetCollector:function () {
    return this.$S5
}, clearView:function (a, f, c, e) {
    if (this.$P5.$U2 == null) {
        okLog("[Error][okRenderer.clearView] No active camera! Please call okRenderer.beginView to set active camera.")
    }
    if ((a & ~(16384 | 256 | 1024)) != 0) {
        okLog("[Error][okRenderer.clearView] Unrecognized clear flag! Must be a combination of COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT and STENCIL_BUFFER_BIT.")
    }
    if ((a & 16384) && (f == null || f.x == null || f.y == null || f.z == null || f.w == null)) {
        okLog("[Error][okRenderer.clearView] Invalid color value!")
    }
    if ((a & 256) && c == null) {
        okLog("[Error][okRenderer.clearView] Invalid depth value!")
    }
    if ((a & 1024) && e == null) {
        okLog("[Error][okRenderer.clearView] Invalid stencil value!")
    }
    var d = this.rc;
    if (this.$P5.bAntiAlias) {
        d.bindFramebuffer(36160, null)
    } else {
        this.$Q5[2].$e5.bind()
    }
    if (a & 16384) {
        if (f == null) {
            f = this.$P5.$U2.$17
        }
        d.clearColor(f.x, f.y, f.z, f.w)
    }
    if (a & 256) {
        d.clearDepth(c ? c : 1)
    }
    if (a & 1024) {
        d.stencilFunc(519, e ? e : 0, 4294967295)
    }
    d.clear(a)
}, beginView:function (f, d) {
    if (f == null) {
        okLog("[Error][okRenderer.beginView] Camera can not be null!")
    }
    var e = this.rc;
    var k = this.$U5;
    this.$P5.$U2 = f;
    e.enable(3089);
    e.enable(2929);
    e.depthMask(true);
    e.disable(3042);
    e.enable(2884);
    f.bindViewport();
    var h = this.$Q5.length;
    for (var c = 0; c < h; ++c) {
        var a = this.$Q5[c];
        a.beginView(d)
    }
}, endView:function () {
    var d = this.$Q5.length;
    for (var c = 0; c < d; ++c) {
        var a = this.$Q5[c];
        a.endView()
    }
    this.$P5.$U2 = null
}, renderScene:function (a) {
    if (this.$P5.$U2 == null) {
        okLog("[Error][okRenderer.renderScene] No active camera! Please call okRenderer.beginView to set active camera.")
    }
    if (a == null) {
        okLog("[Error][okRenderer.renderScene] Scene can not be null!")
    }
    this.$P5.$I6 = a;
    var e = this.$R5;
    e.clear();
    a.getZone()._visCull(this.$P5.$U2, e.createEntityList("Visible"));
    this._postCull();
    var f = this.$Q5.length;
    for (var d = 0; d < f; ++d) {
        var c = this.$Q5[d];
        if (c.$c2) {
            c.render()
        }
    }
    this.$P5.$I6 = null
}, renderEntity:function (a) {
    if (this.$P5.$U2 == null) {
        okLog("[Error][okRenderer.renderEntity] No active camera! Please call okRenderer.beginView to set active camera.")
    }
    if (a == null) {
        okLog("[Error][okRenderer.renderEntity] Entity can not be null!")
    }
    var h = this.$R5;
    h.clear();
    var f = h.createEntityList("Visible");
    f.push(a);
    this._postCull();
    var d = this.$P5.$r1[1];
    this.enableStage(1, false);
    var k = this.$Q5.length;
    for (var e = 0; e < k; ++e) {
        var c = this.$Q5[e];
        if (c.$c2) {
            c.render()
        }
    }
    this.enableStage(1, d)
}, renderEntityArray:function (h) {
    if (this.$P5.$U2 == null) {
        okLog("[Error][okRenderer.renderEntityArray] No active camera! Please call okRenderer.beginView to set active camera.")
    }
    if (h == null || !okIsArray(h)) {
        okLog("[Error][okRenderer.renderEntityArray] Invalid entity array!")
    }
    var k = this.$R5;
    k.clear();
    var f = k.createEntityList("Visible");
    var a = h.length;
    for (var e = 0; e < a; ++e) {
        f.push(h[e])
    }
    this._postCull();
    var d = this.$P5.$r1[1];
    this.enableStage(1, false);
    var l = this.$Q5.length;
    for (var e = 0; e < l; ++e) {
        var c = this.$Q5[e];
        if (c.$c2) {
            c.render()
        }
    }
    this.enableStage(1, d)
}, present:function (d) {
    this.$P5.$i4 = (new Date).getTime() - this.$P5.$S4;
    this.$P5.$p3 = Math.random();
    var a = this.rc;
    var l = this.$P5;
    var n = this.$S5;
    if (!l.bAntiAlias) {
        var h = n.getRenderTarget("LTex");
        if (d == null) {
            a.bindFramebuffer(36160, null);
            a.viewport(0, 0, l.$a4, l.$94);
            a.scissor(0, 0, l.$a4, l.$94)
        } else {
            this.$N6.bind();
            this.$N6.attachRenderTexture(0, d);
            var m = d.getSizeU(), e = d.getSizeV();
            a.viewport(0, 0, m, e);
            a.scissor(0, 0, m, e)
        }
        a.disable(2929);
        a.depthMask(false);
        a.disable(3042);
        var f = this.$U5.getResource("$R$Quad");
        var k = f.getMesh(0);
        var c = this.$K6.getOutputProgram();
        c.bind();
        c.setAttribute("okAttr_Pos", k.getAttributeArrayBuffer("Position"), 3);
        c.setTexture("okUni_Tex", h, 33071, 9728);
        c.setUniformFloat4("okUni_DestOffsetScale", 0, 0, 1, 1);
        if (d == null) {
            c.setUniformFloat4("okUni_SrcOffsetScale", 0, 0, 1, 1)
        } else {
            c.setUniformFloat4("okUni_SrcOffsetScale", 0, 0, d.getSizeU() / l.$a4, d.getSizeV() / l.$94)
        }
        k.draw();
        a.enable(2929);
        a.depthMask(true);
        if (d) {
            this.$N6.unbind()
        }
    }
    if (this.$P5.$a4 != this.$P5.canvas.width || this.$P5.$94 != this.$P5.canvas.height) {
        this._onResize()
    }
}, setSceneConfig:function (a) {
    if (a == null) {
        okLog("[Error][okRenderer.setSceneConfig] Invalid okSceneConfig.")
    }
    a.$97.clone(this.$P5.$97);
    a.$77.clone(this.$P5.$77);
    this.$P5.$z2 = a.$z2;
    this.$P5.$g2 = a.$g2;
    a.$57.clone(this.$P5.$57);
    this.$P5.$g3 = a.$g3;
    this.$P5.$f3 = a.$f3;
    this.$P5.$e3 = a.$e3;
    a.iFogMode = this.$P5.iFogMode
}, setSkyColor:function (d, c, a) {
    if (c != null) {
        if (a == null) {
            okLog("[Error][okRenderer.setSkyColor] Invalid color.")
        }
        this.$P5.$97.set(d, c, a)
    } else {
        if (d.__isVec3Complete == null || !d.__isVec3Complete()) {
            okLog("[Error][okRenderer.setSkyColor] Invalid color.")
        }
        d.clone(this.$P5.$97)
    }
}, getSkyColor:function () {
    return this.$P5.$97
}, setGroundColor:function (d, c, a) {
    if (c != null) {
        if (a == null) {
            okLog("[Error][okRenderer.setGroundColor] Invalid color.")
        }
        this.$P5.$77.set(d, c, a)
    } else {
        if (d.__isVec3Complete == null || !d.__isVec3Complete()) {
            okLog("[Error][okRenderer.setGroundColor] Invalid color.")
        }
        d.clone(this.$P5.$77)
    }
}, getGroundColor:function () {
    return this.$P5.$77
}, enableFog:function (c, a) {
    if (c != 1) {
        okLog("[Error][okRenderer.enableFog] Invalid fog index.")
    }
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okRenderer.enableFog] An parameter for indicating if the fog is enabled is needed.")
    }
    this.$P5.$g2 = a
}, isFogEnabled:function (a) {
    return this.$P5.$g2
}, setFogColor:function (e, d, c, a) {
    if (e != 1) {
        okLog("[Error][okRenderer.enableFog] Invalid fog index.")
    }
    if (c == null) {
        if (d.__isVec3Complete == null || !d.__isVec3Complete()) {
            okLog("[Error][okRenderer.setFogColor] Invalid color.")
        }
        this.$P5.$57.x = d.x;
        this.$P5.$57.y = d.y;
        this.$P5.$57.z = d.z
    } else {
        if (!okIsNumber(d) || !okIsNumber(c) || !okIsNumber(a)) {
            okLog("[Error][okRenderer.setFogColor] Invalid color.")
        }
        this.$P5.$57.x = d;
        this.$P5.$57.y = c;
        this.$P5.$57.z = a
    }
}, getFogColor:function (a) {
    var c = okA.vec3();
    return this.$P5.$57.clone(c)
}, setFogDistanceNear:function (c, a) {
    if (c != 1) {
        okLog("[Error][okRenderer.setFogDistanceNear] Invalid fog index.")
    }
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okRenderer.setFogDistanceNear] Distance value can not be ignored!")
    }
    this.$P5.$g3 = Math.max(0.001, a)
}, setFogDistanceFar:function (c, a) {
    if (c != 1) {
        okLog("[Error][okRenderer.setFogDistanceFar] Invalid fog index.")
    }
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okRenderer.setFogDistanceFar] Distance value can not be ignored!")
    }
    this.$P5.$f3 = Math.max(0.001, a)
}, getFogDistanceNear:function (a) {
    return this.$P5.$g3
}, getFogDistanceFar:function (a) {
    return this.$P5.$f3
}, setFogDensity:function (c, a) {
    if (c != 1) {
        okLog("[Error][okRenderer.setFogDensity] Invalid fog index.")
    }
    if (a == null || !okIsNumber(a)) {
        okLog("[Error][okRenderer.setFogDensity] Density value can not be ignored!")
    }
    this.$P5.$e3 = a
}, getFogDensity:function (a) {
    return this.$P5.$e3
}, enableShadow:function (a) {
    if (a == null || (!okIsBoolean(a) && !okIsNumber(a))) {
        okLog("[Error][okRenderer.enableShadow] A parameter to indicate if enabling shadow is needed.")
    }
    this.$P5.$z2 = a
}, isShadowEnabled:function () {
    return this.$P5.$z2
}, _drawTexture:function (a) {
    this.rc.bindFramebuffer(36160, null);
    this.rc.viewport(0, 0, a.getSizeU(), a.getSizeV());
    this.rc.disable(2929);
    var e = this.$U5.getResource("$R$Quad");
    var c = e.getMesh();
    var d = this.$K6.getFlatColorProgram(true);
    d.bind();
    d.setUniformMat4("matWorld", okMat4Mul(okMat4Trans(0, 0, -0.1), okMat4Scale(a.getSizeU() * 0.5, a.getSizeV() * 0.5, 1)));
    d.setUniformMat4("matViewProj", okMat4Ortho(-a.getSizeU() * 0.5, a.getSizeU() * 0.5, a.getSizeV() * 0.5, -a.getSizeV() * 0.5, 0.1, 100));
    d.setAttribute("position", c.getAttributeArrayBuffer("Position"), 3);
    d.setAttribute("texcoord", c.getAttributeArrayBuffer("Texcoord1"), 2);
    d.setUniformFloat3("color", 1, 1, 1);
    d.setSampler("texSampler", 0);
    a.bind(0);
    this.rc.texParameteri(3553, 10240, 9728);
    this.rc.texParameteri(3553, 10241, 9728);
    this.rc.texParameteri(3553, 10242, 33071);
    this.rc.texParameteri(3553, 10243, 33071);
    c.draw()
}, _postCull:function () {
    var a = this.$R5;
    a.genBatchList("Visible", this.$P5);
    a.enableReleaseBatch("Visible", true);
    var h = a.getBatchList("Visible");
    var d = a.createBatchList("Visible_Opaque");
    var k = a.createBatchList("Visible_Trans");
    var l = a.createBatchList("Visible_Glow");
    var c = h.length;
    for (var e = 0; e < c; ++e) {
        var f = h[e];
        var m = f.$A5;
        if (m.$Z1) {
            k.push(f)
        } else {
            d.push(f)
        }
        if (m.$i2) {
            l.push(f)
        }
    }
    a.sortBatchListByCamera("Visible_Trans", this.$P5, 0)
}};
function okEngineInfo(a) {
    this.rc = a;
    this.sPlatform = "";
    this.sBrowserAgent = "";
    this.sBrowserVendor = "";
    this.sWebGLVersion = "";
    this.sGLSLVersion = "";
    this.iAttributeNum = 0;
    this.iVertexUniformNum = 0;
    this.iFragmentUniformNum = 0;
    this.iVaryingNum = 0;
    this.iRedBits = 0;
    this.iGreenBits = 0;
    this.iBlueBits = 0;
    this.iAlphaBits = 0;
    this.iDepthBits = 0;
    this.iTexNum = 0;
    this.iVertexTexNum = 0;
    this.iTexSize = 0;
    this.iCubeTexSize = 0;
    this.$25 = 0;
    this.$15 = 0;
    this.bFloatTex = false;
    this.bFloatRt = false
}
okEngineInfo.prototype = {clear:function () {
    this.sPlatform = "";
    this.sBrowserAgent = "";
    this.sBrowserVendor = "";
    this.sWebGLVersion = "";
    this.sGLSLVersion = "";
    this.iAttributeNum = 0;
    this.iVertexUniformNum = 0;
    this.iFragmentUniformNum = 0;
    this.iVaryingNum = 0;
    this.iRedBits = 0;
    this.iGreenBits = 0;
    this.iBlueBits = 0;
    this.iAlphaBits = 0;
    this.iDepthBits = 0;
    this.iTexNum = 0;
    this.iVertexTexNum = 0;
    this.iTexSize = 0;
    this.iCubeTexSize = 0;
    this.$25 = 0;
    this.$15 = 0;
    this.bFloatTex = false;
    this.bFloatRt = false
}, init:function () {
    var k = this.rc;
    this.sPlatform = navigator.platform;
    this.sBrowserAgent = navigator.userAgent;
    this.sBrowserVendor = k.getParameter(7936);
    var c = k.getParameter(7936);
    this.sWebGLVersion = c.substr(6, (c.indexOf(" ", 6) != -1) ? c.indexOf(" ", 6) - 6 : null);
    var c = k.getParameter(35724);
    this.sGLSLVersion = c.substr(6, (c.indexOf(" ", 14) != -1) ? c.indexOf(" ", 14) - 14 : null);
    var e = k.getSupportedExtensions();
    this.iAttributeNum = k.getParameter(34921);
    this.iVertexUniformNum = k.getParameter(36347);
    this.iFragmentUniformNum = k.getParameter(36349);
    this.iVaryingNum = k.getParameter(36348);
    this.iRedBits = k.getParameter(3410);
    this.iGreenBits = k.getParameter(3411);
    this.iBlueBits = k.getParameter(3412);
    this.iAlphaBits = k.getParameter(3413);
    this.iDepthBits = k.getParameter(3414);
    this.iTexNum = k.getParameter(35661);
    this.iVertexTexNum = k.getParameter(35660);
    this.iTexSize = k.getParameter(3379);
    this.iCubeTexSize = k.getParameter(34076);
    this.$25 = k.getParameter(3386)[0];
    this.$15 = k.getParameter(3386)[1];
    this.bFloatTex = false;
    for (var d = 0; d < e.length; ++d) {
        if (e[d] == "OES_texture_float") {
            this.bFloatTex = true;
            break
        }
    }
    this.bFloatTex = false;
    this.bFloatRt = false;
    if (this.bFloatTex) {
        var a = new okTexture(k);
        a.createTexture(3553, 2, 2, 6408, 5126);
        var h = new okRenderBuffer(k);
        h.createBuffer(34041, 2, 2);
        var f = new okFrameBuffer(k);
        f.createBuffer();
        f.bind();
        f.attachRenderTexture(0, a);
        f.attachDepthStencilBuffer(h);
        if (k.checkFramebufferStatus(36160) == 36053) {
            this.bFloatRt = true
        }
        f.unbind();
        f.releaseBuffer();
        h.releaseBuffer();
        a.releaseTexture()
    }
}, getPlatform:function () {
    return this.sPlatform
}, getBrowserAgent:function () {
    return this.sBrowserAgent
}, getBrowserVendor:function () {
    return this.sBrowserVendor
}, getWebGLVersion:function () {
    return this.sWebGLVersion
}, getGLSLVersion:function () {
    return this.sGLSLVersion
}, getShaderAttributeMaxNum:function () {
    return this.iAttributeNum
}, getShaderVertexUniformMaxNum:function () {
    return this.iVertexUniformNum
}, getShaderFragmentUniformMaxNum:function () {
    return this.iFragmentUniformNum
}, getShaderVaryingMaxNum:function () {
    return this.iVaryingNum
}, getRedBits:function () {
    return this.iRedBits
}, getGreenBits:function () {
    return this.iGreenBits
}, getBlueBits:function () {
    return this.iBlueBits
}, getAlphaBits:function () {
    return this.iAlphaBits
}, getDepthBits:function () {
    return this.iDepthBits
}, getShaderTextureMaxNum:function () {
    return this.iTexNum
}, getShaderVertexTextureMaxNum:function () {
    return this.iVertexTexNum
}, getTextureMaxSize:function () {
    return this.iTexSize
}, getCubeMapTextureMaxSize:function () {
    return this.iCubeTexSize
}, getViewportMaxWidth:function () {
    return this.$25
}, getViewportMaxHeight:function () {
    return this.$15
}, isFloatTextureSupported:function () {
    return this.bFloatTex
}, isFloatRenderTargetSupported:function () {
    return this.bFloatRt = false
}};
function okEngineSetting() {
    this.canvas = null;
    this.antialias = false;
    this.bAsyncLoad = false
}
function okEngine() {
    this.canvas = null;
    this.rc = null;
    this.$83 = null;
    this.$63 = null;
    this.$U5 = null;
    this.$J6 = null;
    this.$T5 = null;
    this.bInitializaed = false
}
okEngine.prototype = {init:function (c) {
    this.clear();
    if (c == null) {
        return false
    }
    var a = null;
    try {
        a = c.canvas.getContext("experimental-webgl", {antialias:c.antialias ? true : false, stencil:true});
        if (a == null) {
            a = c.canvas.getContext("webgl", {antialias:c.antialias, stencil:true})
        }
    } catch (d) {
    }
    if (!a) {
        okLog("[Error][okEngine.init] Failed to initialize WebGL!");
        return false
    }
    this.canvas = c.canvas;
    this.rc = a;
    this.$83 = new okExtension(this.rc);
    this.$63 = new okEngineInfo(this.rc);
    this.$63.init();
    this.$U5 = new okResourceManager(c, this.rc);
    this.$J6 = new okSceneManager(c, this);
    this.$T5 = new okRenderer(c, this);
    this.bInitializaed = true;
    return true
}, clear:function () {
    if (this.$83) {
        this.$83 = null
    }
    if (this.$63) {
        this.$63.clear();
        this.$63 = null
    }
    if (this.$J6) {
        this.$J6.clear();
        this.$J6 = null
    }
    if (this.$T5) {
        this.$T5.clear();
        this.$T5 = null
    }
    if (this.$U5) {
        this.$U5.clear();
        this.$U5 = null
    }
    this.rc = null;
    this.canvas = null;
    this.bInitializaed = false
}, getCanvas:function () {
    return this.canvas
}, getRenderContext:function () {
    if (this.bInitializaed == false) {
        okLog("[Warning][okEngine.getRenderContext] Render context is null! This means the engine isn't initialized successful.")
    }
    return this.rc
}, getEngineInfo:function () {
    if (this.bInitializaed == false) {
        okLog("[Warning][okEngine.getSceneManager] okEngine is not initialized!")
    }
    return this.$63
}, getSceneManager:function () {
    if (this.bInitializaed == false) {
        okLog("[Warning][okEngine.getSceneManager] okEngine is not initialized!")
    }
    return this.$J6
}, getResourceManager:function () {
    if (this.bInitializaed == false) {
        okLog("[Warning][okEngine.getResourceManager] okEngine is not initialized!")
    }
    return this.$U5
}, getRenderer:function () {
    if (this.bInitializaed == false) {
        okLog("[Warning][okEngine.getRenderer] okEngine is not initialized!")
    }
    return this.$T5
}};