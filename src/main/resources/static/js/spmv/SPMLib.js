var SPMLib = window.SPMLib = SPMLib || {};
var BMAP_DRAWING_MARKER = "marker", BMAP_DRAWING_POLYLINE = "polyline", BMAP_DRAWING_CIRCLE = "circle",
    BMAP_DRAWING_RECTANGLE = "rectangle", BMAP_DRAWING_POLYGON = "polygon";
(function() {
    var ek = 0;
    var j = 1;
    var c = SPMLib.RectangleZoom = function (n, m) {
        if (!n) {
            return
        }
        this._map = n;
        this._opts = {
            zoomType: ek,
            followText: "",
            strokeWeight: 2,
            strokeColor: "#111",
            style: "solid",
            fillColor: "#ccc",
            opacity: 0.4,
            cursor: "crosshair",
            autoClose: false
        };
        this._setOptions(m);
        this._opts.strokeWeight = this._opts.strokeWeight <= 0 ? 1 : this._opts.strokeWeight;
        this._opts.opacity = this._opts.opacity < 0 ? 0 : this._opts.opacity > 1 ? 1 : this._opts.opacity;
        if (this._opts.zoomType < ek || this._opts.zoomType > j) {
            this._opts.zoomType = ek
        }
        this._isOpen = false;
        this._fDiv = null;
        this._followTitle = null
    };
    c.prototype._setOptions = function (m) {
        if (!m) {
            return
        }
        for (var n in m) {
            if (typeof(m[n]) != "undefined") {
                this._opts[n] = m[n]
            }
        }
    };
    c.prototype.setStrokeColor = function (m) {
        if (typeof m == "string") {
            this._opts.strokeColor = m;
            this._updateStyle()
        }
    };
    c.prototype.setLineStroke = function (m) {
        if (typeof m == "number" && Math.round(m) > 0) {
            this._opts.strokeWeight = Math.round(m);
            this._updateStyle()
        }
    };
    c.prototype.setLineStyle = function (m) {
        if (m == "solid" || m == "dashed") {
            this._opts.style = m;
            this._updateStyle()
        }
    };
    c.prototype.setOpacity = function (m) {
        if (typeof m == "number" && m >= 0 && m <= 1) {
            this._opts.opacity = m;
            this._updateStyle()
        }
    };
    c.prototype.setFillColor = function (m) {
        this._opts.fillColor = m;
        this._updateStyle()
    };
    c.prototype.setCursor = function (m) {
        this._opts.cursor = m;
        fK.setCursor(this._opts.cursor)
    };
    c.prototype._updateStyle = function () {
        if (this._fDiv) {
            this._fDiv.style.border = [this._opts.strokeWeight, "px ", this._opts.style, " ", this._opts.color].join("");
            var m = this._fDiv.style,
                n = this._opts.opacity;
            m.opacity = n;
            m.MozOpacity = n;
            m.KhtmlOpacity = n;
            m.filter = "alpha(opacity=" + (n * 100) + ")"
        }
    };
    c.prototype.getCursor = function () {
        return this._opts.cursor
    };
    c.prototype._bind = function () {
        this.setCursor(this._opts.cursor);
        var n = this;
        dK(this._map.getContainer(), "mousemove",
            function (q) {
                if (!n._isOpen) {
                    return
                }
                if (!n._followTitle) {
                    return
                }
                q = window.event || q;
                var o = q.target || q.srcElement;
                if (o != fK.getDom(n._map)) {
                    n._followTitle.hide();
                    return
                }
                if (!n._mapMoving) {
                    n._followTitle.show()
                }
                var p = fK.getDrawPoint(q, true);
                n._followTitle.setPosition(p)
            });
        if (this._opts.followText) {
            var m = this._followTitle = new BMap.Label(this._opts.followText, {
                offset: new BMap.Size(14, 16)
            });
            this._followTitle.setStyles({
                color: "#333",
                borderColor: "#ff0103"
            })
        }
    };
    c.prototype.open = function () {
        if (this._isOpen == true) {
            return true
        }
        if (!!SPMLib._toolInUse) {
            return
        }
        this._isOpen = true;
        SPMLib._toolInUse = true;
        if (!this.binded) {
            this._bind();
            this.binded = true
        }
        if (this._followTitle) {
            this._map.addOverlay(this._followTitle);
            this._followTitle.hide()
        }
        this._map.addEventListener('rightclick', this.close);
        var o = this;
        var p = this._map;
        var q = 0;
        if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
            q = document.documentMode || +RegExp["\x241"]
        }
        var n = function (s) {
            s = window.event || s;
            if (s.button != 0 && !q || q && s.button != 1) {
                return
            }
            if (!!q && fK.getDom(p).setCapture) {
                fK.getDom(p).setCapture()
            }
            if (!o._isOpen) {
                return
            }
            o._bind.isZooming = true;
            dK(document, "mousemove", m);
            dK(document, "mouseup", r);
            o._bind.mx = s.layerX || s.offsetX || 0;
            o._bind.my = s.layerY || s.offsetY || 0;
            o._bind.ix = s.pageX || s.clientX || 0;
            o._bind.iy = s.pageY || s.clientY || 0;
            ak(fK.getDom(p), "beforeBegin", o._generateHTML());
            o._fDiv = fK.getDom(p).previousSibling;
            o._fDiv.style.width = "0";
            o._fDiv.style.height = "0";
            o._fDiv.style.left = o._bind.mx + "px";
            o._fDiv.style.top = o._bind.my + "px";
            bK(s);
            return h(s)
        };
        var m = function (z) {
            if (o._isOpen == true && o._bind.isZooming == true) {
                var z = window.event || z;
                var u = z.pageX || z.clientX || 0;
                var s = z.pageY || z.clientY || 0;
                var w = o._bind.dx = u - o._bind.ix;
                var t = o._bind.dy = s - o._bind.iy;
                var v = Math.abs(w) - o._opts.strokeWeight;
                var y = Math.abs(t) - o._opts.strokeWeight;
                o._fDiv.style.width = (v < 0 ? 0 : v) + "px";
                o._fDiv.style.height = (y < 0 ? 0 : y) + "px";
                var x = [p.getSize().width, p.getSize().height];
                if (w >= 0) {
                    o._fDiv.style.right = "auto";
                    o._fDiv.style.left = o._bind.mx + "px";
                    if (o._bind.mx + w >= x[0] - 2 * o._opts.strokeWeight) {
                        o._fDiv.style.width = x[0] - o._bind.mx - 2 * o._opts.strokeWeight + "px";
                        o._followTitle && o._followTitle.hide()
                    }
                } else {
                    o._fDiv.style.left = "auto";
                    o._fDiv.style.right = x[0] - o._bind.mx + "px";
                    if (o._bind.mx + w <= 2 * o._opts.strokeWeight) {
                        o._fDiv.style.width = o._bind.mx - 2 * o._opts.strokeWeight + "px";
                        o._followTitle && o._followTitle.hide()
                    }
                }
                if (t >= 0) {
                    o._fDiv.style.bottom = "auto";
                    o._fDiv.style.top = o._bind.my + "px";
                    if (o._bind.my + t >= x[1] - 2 * o._opts.strokeWeight) {
                        o._fDiv.style.height = x[1] - o._bind.my - 2 * o._opts.strokeWeight + "px";
                        o._followTitle && o._followTitle.hide()
                    }
                } else {
                    o._fDiv.style.top = "auto";
                    o._fDiv.style.bottom = x[1] - o._bind.my + "px";
                    if (o._bind.my + t <= 2 * o._opts.strokeWeight) {
                        o._fDiv.style.height = o._bind.my - 2 * o._opts.strokeWeight + "px";
                        o._followTitle && o._followTitle.hide()
                    }
                }
                bK(z);
                return h(z)
            }
        };
        var r = function (A) {
            if (o._isOpen == true) {
                i(document, "mousemove", m);
                i(document, "mouseup", r);
                if (!!q && fK.getDom(p).releaseCapture) {
                    fK.getDom(p).releaseCapture()
                }
                var v = parseInt(o._fDiv.style.left) + parseInt(o._fDiv.style.width) / 2;
                var u = parseInt(o._fDiv.style.top) + parseInt(o._fDiv.style.height) / 2;
                var z = [p.getSize().width, p.getSize().height];
                if (isNaN(v)) {
                    v = z[0] - parseInt(o._fDiv.style.right) - parseInt(o._fDiv.style.width) / 2
                }
                if (isNaN(u)) {
                    u = z[1] - parseInt(o._fDiv.style.bottom) - parseInt(o._fDiv.style.height) / 2
                }
                var C = Math.min(z[0] / Math.abs(o._bind.dx), z[1] / Math.abs(o._bind.dy));
                C = Math.floor(C);
                var x = new BMap.Pixel(v - parseInt(o._fDiv.style.width) / 2, u - parseInt(o._fDiv.style.height) / 2);
                var w = new BMap.Pixel(v + parseInt(o._fDiv.style.width) / 2, u + parseInt(o._fDiv.style.height) / 2);
                var F = p.pixelToPoint(x);
                var E = p.pixelToPoint(w);
                var y = new BMap.Bounds(F, E);
                delete o._bind.dx;
                delete o._bind.dy;
                delete o._bind.ix;
                delete o._bind.iy;
                if (!isNaN(C)) {
                    if (o._opts.zoomType == ek) {
                        targetZoomLv = Math.round(p.getZoom() + (Math.log(C) / Math.log(2)));
                        if (targetZoomLv < p.getZoom()) {
                            targetZoomLv = p.getZoom()
                        }
                    } else {
                        targetZoomLv = Math.round(p.getZoom() + (Math.log(1 / C) / Math.log(2)));
                        if (targetZoomLv > p.getZoom()) {
                            targetZoomLv = p.getZoom()
                        }
                    }
                } else {
                    targetZoomLv = p.getZoom() + (o._opts.zoomType == ek ? 1 : -1)
                }
                var s = p.pixelToPoint({
                        x: v,
                        y: u
                    },
                    p.getZoom());
                p.centerAndZoom(s, targetZoomLv);
                var I = fK.getDrawPoint(A);
                if (o._followTitle) {
                    o._followTitle.setPosition(I);
                    o._followTitle.show()
                }
                o._bind.isZooming = false;
                o._fDiv.parentNode.removeChild(o._fDiv);
                o._fDiv = null;
                $('.oa0i1d4k1').remove();
            }
            var t = y.getSouthWest(),
                B = y.getNorthEast(),
                G = new BMap.Point(B.lng, t.lat),
                H = new BMap.Point(t.lng, B.lat),
                D = new BMap.Polygon([t, H, B, G]);
            D.setStrokeWeight(2);
            D.setStrokeOpacity(0.3);
            D.setStrokeColor("#111");
            D.setFillColor("");
            p.addOverlay(D);
            new g({
                duration: 240,
                fps: 20,
                delay: 500,
                render: function (K) {
                    var J = 0.3 * (1 - K);
                    D.setStrokeOpacity(J)
                },
                finish: function () {
                    p.removeOverlay(D);
                    D = null
                }
            });
            if (o._opts.autoClose) {
                setTimeout(function () {
                        if (o._isOpen == true) {
                            o.close()
                        }
                    },
                    70)
            }
            bK(A);
            return h(A)
        };
        fK.show(this._map);
        this.setCursor(this._opts.cursor);
        if (!this._isBeginDrawBinded) {
            dK(fK.getDom(this._map), "mousedown", n);
            this._isBeginDrawBinded = true
        }
        return true
    };
    c.prototype.close = function () {
        if (!this._isOpen) {
            return
        }
        this._map.removeEventListener('rightclick', this.close);
        this._isOpen = false;
        SPMLib._toolInUse = false;
        this._followTitle && this._followTitle.hide();
        fK.hide()
    };
    c.prototype._generateHTML = function () {
        return ["<div class='oa0i1d4k1' style='position:absolute;z-index:300;border:", this._opts.strokeWeight, "px ", this._opts.style, " ", this._opts.strokeColor, "; opacity:", this._opts.opacity, "; background: ", this._opts.fillColor, "; filter:alpha(opacity=", Math.round(this._opts.opacity * 100), "); width:0; height:0; font-size:0'></div>"].join("")
    };

    function ak(p, m, o) {
        var n, q;
        if (p.insertAdjacentHTML) {
            p.insertAdjacentHTML(m, o)
        } else {
            n = p.ownerDocument.createRange();
            m = m.toUpperCase();
            if (m == "AFTERBEGIN" || m == "BEFOREEND") {
                n.selectNodeContents(p);
                n.collapse(m == "AFTERBEGIN")
            } else {
                q = m == "BEFOREBEGIN";
                n[q ? "setStartBefore" : "setEndAfter"](p);
                n.collapse(q)
            }
            n.insertNode(n.createContextualFragment(o))
        }
        return p
    }

    function k(n, m) {
        ak(n, "beforeEnd", m);
        return n.lastChild
    }

    function bK(m) {
        var m = window.event || m;
        m.stopPropagation ? m.stopPropagation() : m.cancelBubble = true
    }

    function h(m) {
        var m = window.event || m;
        m.preventDefault ? m.preventDefault() : m.returnValue = false;
        return false
    }

    function dK(m, n, o) {
        if (!m) {
            return
        }
        n = n.replace(/^on/i, "").toLowerCase();
        if (m.addEventListener) {
            m.addEventListener(n, o, false)
        } else {
            if (m.attachEvent) {
                m.attachEvent("on" + n, o)
            }
        }
    }

    function i(m, n, o) {
        if (!m) {
            return
        }
        n = n.replace(/^on/i, "").toLowerCase();
        if (m.removeEventListener) {
            m.removeEventListener(n, o, false);
        } else {
            if (m.detachEvent) {
                m.detachEvent("on" + n, o)
            }
        }
    }

    var fK = {
        _map: null,
        _html: "<div  style='background:transparent url('../../spmv/image/blank.gif');position:absolute;left:0;top:0;width:100%;height:100%;z-index:1000' unselectable='on'></div>",
        _maskElement: null,
        _cursor: "default",
        _inUse: false,
        show: function (m) {
            if (!this._map) {
                this._map = m
            }
            this._inUse = true;
            if (!this._maskElement) {
                this._createMask(m)
            }
            this._maskElement.style.display = "block"
        },
        _createMask: function (o) {
            this._map = o;
            if (!this._map) {
                return
            }
            var n = this._maskElement = k(this._map.getContainer(), this._html);
            var m = function (p) {
                bK(p);
                return h(p)
            };
            dK(n, "mouseup",
                function (p) {
                    if (p.button == 2) {
                        m(p)
                    }
                });
            dK(n, "contextmenu", m);
            n.style.display = "none"
        },
        getDrawPoint: function (p, r) {
            p = window.event || p;
            var m = p.layerX || p.offsetX || 0;
            var q = p.layerY || p.offsetY || 0;
            var o = p.target || p.srcElement;
            if (o != fK.getDom(this._map) && r == true) {
                while (o && o != this._map.getContainer()) {
                    if (!(o.clientWidth == 0 && o.clientHeight == 0 && o.offsetParent && o.offsetParent.nodeName.toLowerCase() == "td")) {
                        m += o.offsetLeft;
                        q += o.offsetTop
                    }
                    o = o.offsetParent
                }
            }
            if (o != fK.getDom(this._map) && o != this._map.getContainer()) {
                return
            }
            if (typeof m === "undefined" || typeof q === "undefined") {
                return
            }
            if (isNaN(m) || isNaN(q)) {
                return
            }
            return this._map.pixelToPoint(new BMap.Pixel(m, q))
        },
        hide: function () {
            if (!this._map) {
                return
            }
            this._inUse = false;
            if (this._maskElement) {
                this._maskElement.style.display = "none"
            }
        },
        getDom: function (m) {
            if (!this._maskElement) {
                this._createMask(m)
            }
            return this._maskElement
        },
        setCursor: function (m) {
            this._cursor = m || "default";
            if (this._maskElement) {
                this._maskElement.style.cursor = this._cursor
            }
        }
    };

    function g(p) {
        var m = {
            duration: 1000,
            fps: 30,
            delay: 0,
            transition: l.linear,
            onStop: function () {
            }
        };
        if (p) {
            for (var n in p) {
                m[n] = p[n]
            }
        }
        this._opts = m;
        if (m.delay) {
            var o = this;
            setTimeout(function () {
                    o._beginTime = new Date().getTime();
                    o._endTime = o._beginTime + o._opts.duration;
                    o._launch()
                },
                m.delay)
        } else {
            this._beginTime = new Date().getTime();
            this._endTime = this._beginTime + this._opts.duration;
            this._launch()
        }
    }

    g.prototype._launch = function () {
        var n = this;
        var m = new Date().getTime();
        if (m >= n._endTime) {
            if (typeof n._opts.render == "function") {
                n._opts.render(n._opts.transition(1))
            }
            if (typeof n._opts.finish == "function") {
                n._opts.finish()
            }
            return
        }
        n.schedule = n._opts.transition((m - n._beginTime) / n._opts.duration);
        if (typeof n._opts.render == "function") {
            n._opts.render(n.schedule)
        }
        if (!n.terminative) {
            n._timer = setTimeout(function () {
                    n._launch()
                },
                1000 / n._opts.fps)
        }
    };
    var l = {
        linear: function (m) {
            return m
        },
        reverse: function (m) {
            return 1 - m
        },
        easeInQuad: function (m) {
            return m * m
        },
        easeInCubic: function (m) {
            return Math.pow(m, 3)
        },
        easeOutQuad: function (m) {
            return -(m * (m - 2))
        },
        easeOutCubic: function (m) {
            return Math.pow((m - 1), 3) + 1
        },
        easeInOutQuad: function (m) {
            if (m < 0.5) {
                return m * m * 2
            } else {
                return -2 * (m - 2) * m - 1
            }
            return
        },
        easeInOutCubic: function (m) {
            if (m < 0.5) {
                return Math.pow(m, 3) * 4
            } else {
                return Math.pow(m - 1, 3) * 4 + 1
            }
        },
        easeInOutSine: function (m) {
            return (1 - Math.cos(Math.PI * m)) / 2
        }
    }

    var b = b || {guid: "$BAIDU$"};
    (function () {
        window[b.guid] = {};
        b.extend = function (i, g) {
            for (var h in g) {
                if (g.hasOwnProperty(h)) {
                    i[h] = g[h]
                }
            }
            return i
        };
        b.lang = b.lang || {};
        b.lang.guid = function () {
            return "TANGRAM__" + (window[b.guid]._counter++).toString(36)
        };
        window[b.guid]._counter = window[b.guid]._counter || 1;
        window[b.guid]._instances = window[b.guid]._instances || {};
        b.lang.Class = function (g) {
            this.guid = g || b.lang.guid();
            window[b.guid]._instances[this.guid] = this
        };
        window[b.guid]._instances = window[b.guid]._instances || {};
        b.lang.isString = function (g) {
            return "[object String]" == Object.prototype.toString.call(g)
        };
        b.lang.isFunction = function (g) {
            return "[object Function]" == Object.prototype.toString.call(g)
        };
        b.lang.Class.prototype.toString = function () {
            return "[object " + (this._className || "Object") + "]"
        };
        b.lang.Class.prototype.dispose = function () {
            delete window[b.guid]._instances[this.guid];
            for (var g in this) {
                if (!b.lang.isFunction(this[g])) {
                    delete this[g]
                }
            }
            this.disposed = true
        };
        b.lang.Event = function (g, h) {
            this.type = g;
            this.returnValue = true;
            this.target = h || null;
            this.currentTarget = null
        };
        b.lang.Class.prototype.addEventListener = function (j, i, h) {
            if (!b.lang.isFunction(i)) {
                return
            }
            !this.__listeners && (this.__listeners = {});
            var g = this.__listeners, k;
            if (typeof h == "string" && h) {
                if (/[^\w\-]/.test(h)) {
                    throw ("nonstandard key:" + h)
                } else {
                    i.hashCode = h;
                    k = h
                }
            }
            j.indexOf("on") != 0 && (j = "on" + j);
            typeof g[j] != "object" && (g[j] = {});
            k = k || b.lang.guid();
            i.hashCode = k;
            g[j][k] = i
        };
        b.lang.Class.prototype.removeEventListener = function (i, h) {
            if (b.lang.isFunction(h)) {
                h = h.hashCode
            } else {
                if (!b.lang.isString(h)) {
                    return
                }
            }
            !this.__listeners && (this.__listeners = {});
            i.indexOf("on") != 0 && (i = "on" + i);
            var g = this.__listeners;
            if (!g[i]) {
                return
            }
            g[i][h] && delete g[i][h]
        };
        b.lang.Class.prototype.dispatchEvent = function (k, g) {
            if (b.lang.isString(k)) {
                k = new b.lang.Event(k)
            }
            !this.__listeners && (this.__listeners = {});
            g = g || {};
            for (var j in g) {
                k[j] = g[j]
            }
            var j, h = this.__listeners, l = k.type;
            k.target = k.target || this;
            k.currentTarget = this;
            l.indexOf("on") != 0 && (l = "on" + l);
            b.lang.isFunction(this[l]) && this[l].apply(this, arguments);
            if (typeof h[l] == "object") {
                for (j in h[l]) {
                    h[l][j].apply(this, arguments)
                }
            }
            return k.returnValue
        };
        b.lang.inherits = function (m, k, j) {
            var i, l, g = m.prototype, h = new Function();
            h.prototype = k.prototype;
            l = m.prototype = new h();
            for (i in g) {
                l[i] = g[i]
            }
            m.prototype.constructor = m;
            m.superClass = k.prototype;
            if ("string" == typeof j) {
                l._className = j
            }
        };
        b.dom = b.dom || {};
        b._g = b.dom._g = function (g) {
            if (b.lang.isString(g)) {
                return document.getElementById(g)
            }
            return g
        };
        b.g = b.dom.g = function (g) {
            if ("string" == typeof g || g instanceof String) {
                return document.getElementById(g)
            } else {
                if (g && g.nodeName && (g.nodeType == 1 || g.nodeType == 9)) {
                    return g
                }
            }
            return null
        };
        b.insertHTML = b.dom.insertHTML = function (j, g, i) {
            j = b.dom.g(j);
            var h, k;
            if (j.insertAdjacentHTML) {
                j.insertAdjacentHTML(g, i)
            } else {
                h = j.ownerDocument.createRange();
                g = g.toUpperCase();
                if (g == "AFTERBEGIN" || g == "BEFOREEND") {
                    h.selectNodeContents(j);
                    h.collapse(g == "AFTERBEGIN")
                } else {
                    k = g == "BEFOREBEGIN";
                    h[k ? "setStartBefore" : "setEndAfter"](j);
                    h.collapse(k)
                }
                h.insertNode(h.createContextualFragment(i))
            }
            return j
        };
        b.ac = b.dom.addClass = function (n, o) {
            n = b.dom.g(n);
            var h = o.split(/\s+/), g = n.className, m = " " + g + " ", k = 0, j = h.length;
            for (; k < j; k++) {
                if (m.indexOf(" " + h[k] + " ") < 0) {
                    g += (g ? " " : "") + h[k]
                }
            }
            n.className = g;
            return n
        };
        b.event = b.event || {};
        b.event._listeners = b.event._listeners || [];
        b.on = b.event.on = function (h, k, m) {
            k = k.replace(/^on/i, "");
            h = b._g(h);
            var l = function (o) {
                m.call(h, o)
            }, g = b.event._listeners, j = b.event._eventFilter, n, i = k;
            k = k.toLowerCase();
            if (j && j[k]) {
                n = j[k](h, k, l);
                i = n.type;
                l = n.listener
            }
            if (h.addEventListener) {
                h.addEventListener(i, l, false)
            } else {
                if (h.attachEvent) {
                    h.attachEvent("on" + i, l)
                }
            }
            g[g.length] = [h, k, m, l, i];
            return h
        };
        b.un = b.event.un = function (i, l, h) {
            i = b._g(i);
            l = l.replace(/^on/i, "").toLowerCase();
            var o = b.event._listeners, j = o.length, k = !h, n, m, g;
            while (j--) {
                n = o[j];
                if (n[1] === l && n[0] === i && (k || n[2] === h)) {
                    m = n[4];
                    g = n[3];
                    if (i.removeEventListener) {
                        i.removeEventListener(m, g, false)
                    } else {
                        if (i.detachEvent) {
                            i.detachEvent("on" + m, g)
                        }
                    }
                    o.splice(j, 1)
                }
            }
            return i
        };
        b.getEvent = b.event.getEvent = function (g) {
            return window.event || g
        };
        b.getTarget = b.event.getTarget = function (g) {
            var g = b.getEvent(g);
            return g.target || g.srcElement
        };
        b.preventDefault = b.event.preventDefault = function (g) {
            var g = b.getEvent(g);
            if (g.preventDefault) {
                g.preventDefault()
            } else {
                g.returnValue = false
            }
        };
        b.stopBubble = b.event.stopBubble = function (g) {
            g = b.getEvent(g);
            g.stopPropagation ? g.stopPropagation() : g.cancelBubble = true
        };
        b.browser = b.browser || {};
        if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
            b.browser.ie = b.ie = document.documentMode || +RegExp["\x241"]
        }
    })();
    var d = SPMLib.DrawingManager = function (h, g) {
        if (!h) {
            return
        }
        cF.push(this);
        g = g || {};
        this._initialize(h, g)
    };
    b.lang.inherits(d, b.lang.Class, "DrawingManager");
    d.prototype.open = function () {
        if (this._isOpen == true) {
            return true
        }
        f(this);
        // f(this);
        this._open()
    };
    d.prototype.close = function () {
        if (this._isOpen == false) {
            return true
        }
        var g = this;
        this._close();
        setTimeout(function () {
            g._map.enableDoubleClickZoom()
        }, 2000)
    };
    d.prototype.setDrawingMode = function (g) {
        if (this._drawingType != g) {
            f(this);
            this._setDrawingMode(g)
        }
    };
    d.prototype.getDrawingMode = function () {
        return this._drawingType
    };
    d.prototype.enableCalculate = function () {
        this._enableCalculate = true;
        this._addGeoUtilsLibrary()
    };
    d.prototype.disableCalculate = function () {
        this._enableCalculate = false
    };
    d.prototype._initialize = function (h, g) {
        this._map = h;
        this._opts = g;
        this._drawingType = g.drawingMode || BMAP_DRAWING_MARKER;
        if (g.enableDrawingTool) {
            var i = new a(this, g.drawingToolOptions);
            this._drawingTool = i;
            h.addControl(i)
        }
        if (g.enableCalculate === true) {
            this.enableCalculate()
        } else {
            this.disableCalculate()
        }
        this._isOpen = !!(g.isOpen === true);
        if (this._isOpen) {
            this._open()
        }
        this.markerOptions = g.markerOptions || {};
        this.circleOptions = g.circleOptions || {};
        this.polylineOptions = g.polylineOptions || {};
        this.polygonOptions = g.polygonOptions || {};
        this.rectangleOptions = g.rectangleOptions || {};
        this.controlButton = g.controlButton == "right" ? "right" : "left"
    }, d.prototype._open = function () {
        this._isOpen = true;
        if (!this._mask) {
            this._mask = new e()
        }
        this._map.addOverlay(this._mask);
        this._setDrawingMode(this._drawingType)
    };
    d.prototype._setDrawingMode = function (g) {
        this._drawingType = g;
        if (this._isOpen) {
            this._mask.__listeners = {};
            switch (g) {
                case BMAP_DRAWING_MARKER:
                    this._bindMarker();
                    break;
                case BMAP_DRAWING_CIRCLE:
                    this._bindCircle();
                    break;
                case BMAP_DRAWING_POLYLINE:
                case BMAP_DRAWING_POLYGON:
                    this._bindPolylineOrPolygon();
                    break;
                case BMAP_DRAWING_RECTANGLE:
                    this._bindRectangle();
                    break
            }
        }
        if (this._drawingTool && this._isOpen) {
            this._drawingTool.setStyleByDrawingMode(g)
        }
    };
    d.prototype._close = function () {
        this._isOpen = false;
        if (this._mask) {
            this._map.removeOverlay(this._mask)
        }
        if (this._drawingTool) {
            this._drawingTool.setStyleByDrawingMode("hander")
        }
    };
    d.prototype._bindMarker = function () {
        var i = this, j = this._map, h = this._mask;
        var g = function (l) {
            var k = new BMap.Marker(l.point, i.markerOptions);
            j.addOverlay(k);
            i._dispatchOverlayComplete(k)
        };
        h.addEventListener("click", g)
    };
    d.prototype._bindCircle = function () {
        var m = this, h = this._map, o = this._mask, i = null, k = null;
        var j = function (p) {
            if (m.controlButton == "right" && (p.button == 1 || p.button == 0)) {
                return
            }
            k = p.point;
            i = new BMap.Circle(k, 0, m.circleOptions);
            h.addOverlay(i);
            o.enableEdgeMove();
            o.addEventListener("mousemove", n);
            b.on(document, "mouseup", l)
        };
        var n = function (p) {
            i.setRadius(m._map.getDistance(k, p.point))
        };
        var l = function (q) {
            var p = m._calculate(i, q.point);
            m._dispatchOverlayComplete(i, p);
            k = null;
            o.disableEdgeMove();
            o.removeEventListener("mousemove", n);
            b.un(document, "mouseup", l)
        };
        var g = function (p) {
            b.preventDefault(p);
            b.stopBubble(p);
            if (m.controlButton == "right" && p.button == 1) {
                return
            }
            if (k == null) {
                j(p)
            }
        };
        o.addEventListener("mousedown", g)
    };
    d.prototype._bindPolylineOrPolygon = function () {
        var k = this, m = this._map, h = this._mask, j = [], n = null;
        overlay = null, isBinded = false;
        var l = function (o) {
            if (k.controlButton == "right" && (o.button == 1 || o.button == 0)) {
                return
            }
            j.push(o.point);
            n = j.concat(j[j.length - 1]);
            if (j.length == 1) {
                if (k._drawingType == BMAP_DRAWING_POLYLINE) {
                    overlay = new BMap.Polyline(n, k.polylineOptions)
                } else {
                    if (k._drawingType == BMAP_DRAWING_POLYGON) {
                        overlay = new BMap.Polygon(n, k.polygonOptions)
                    }
                }
                m.addOverlay(overlay)
            } else {
                overlay.setPath(n)
            }
            if (!isBinded) {
                isBinded = true;
                h.enableEdgeMove();
                h.addEventListener("mousemove", i);
                h.addEventListener("dblclick", g)
            }
        };
        var i = function (o) {
            overlay.setPositionAt(n.length - 1, o.point)
        };
        var g = function (p) {
            b.stopBubble(p);
            isBinded = false;
            h.disableEdgeMove();
            h.removeEventListener("mousedown", l);
            h.removeEventListener("mousemove", i);
            h.removeEventListener("dblclick", g);
            if (k.controlButton == "right") {
                j.push(p.point)
            } else {
                if (b.ie <= 8) {
                } else {
                    j.pop()
                }
            }
            overlay.setPath(j);
            var o = k._calculate(overlay, j.pop());
            k._dispatchOverlayComplete(overlay, o);
            j.length = 0;
            n.length = 0;
            k.close()
        };
        h.addEventListener("mousedown", l);
        h.addEventListener("dblclick", function (o) {
            b.stopBubble(o)
        })
    };
    d.prototype._bindRectangle = function () {
        var k = this, n = this._map, h = this._mask, i = null, j = null;
        var m = function (p) {
            b.stopBubble(p);
            b.preventDefault(p);
            if (k.controlButton == "right" && (p.button == 1 || p.button == 0)) {
                return
            }
            j = p.point;
            var o = j;
            i = new BMap.Polygon(k._getRectanglePoint(j, o), k.rectangleOptions);
            n.addOverlay(i);
            h.enableEdgeMove();
            h.addEventListener("mousemove", l);
            b.on(document, "mouseup", g)
        };
        var l = function (o) {
            i.setPath(k._getRectanglePoint(j, o.point))
        };
        var g = function (p) {
            var o = k._calculate(i, i.getPath()[2]);
            k._dispatchOverlayComplete(i, o);
            j = null;
            h.disableEdgeMove();
            h.removeEventListener("mousemove", l);
            b.un(document, "mouseup", g)
        };
        h.addEventListener("mousedown", m)
    };
    d.prototype._calculate = function (j, i) {
        var h = {data: 0, label: null};
        if (this._enableCalculate && SPMLib.GeoUtils) {
            var k = j.toString();
            switch (k) {
                case"[object Polyline]":
                    h.data = SPMLib.GeoUtils.getPolylineDistance(j);
                    break;
                case"[object Polygon]":
                    h.data = SPMLib.GeoUtils.getPolygonArea(j);
                    break;
                case"[object Circle]":
                    var g = j.getRadius();
                    h.data = Math.PI * g * g;
                    break
            }
            if (!h.data || h.data < 0) {
                h.data = 0
            } else {
                h.data = h.data.toFixed(2)
            }
            h.label = this._addLabel(i, h.data)
        }
        return h
    };
    d.prototype._addGeoUtilsLibrary = function () {
        if (!SPMLib.GeoUtils) {
            var g = document.createElement("script");
            g.setAttribute("type", "text/javascript");
            g.setAttribute("src", "../../spmv/SPMLib.js");
            document.body.appendChild(g)
        }
    };
    d.prototype._addLabel = function (g, i) {
        var h = new BMap.Label(i, {position: g});
        this._map.addOverlay(h);
        return h
    };
    d.prototype._getRectanglePoint = function (h, g) {
        return [new BMap.Point(h.lng, h.lat), new BMap.Point(g.lng, h.lat), new BMap.Point(g.lng, g.lat), new BMap.Point(h.lng, g.lat)]
    };
    d.prototype._dispatchOverlayComplete = function (h, i) {
        var g = {"overlay": h, "drawingMode": this._drawingType};
        if (i) {
            g.calculate = i.data || null;
            g.label = i.label || null
        }
        this.dispatchEvent(this._drawingType + "complete", h);
        this.dispatchEvent("overlaycomplete", g)
    };

    function e() {
        this._enableEdgeMove = false
    }

    e.prototype = new BMap.Overlay();
    e.prototype.dispatchEvent = b.lang.Class.prototype.dispatchEvent;
    e.prototype.addEventListener = b.lang.Class.prototype.addEventListener;
    e.prototype.removeEventListener = b.lang.Class.prototype.removeEventListener;
    e.prototype.initialize = function (i) {
        var h = this;
        this._map = i;
        var j = this.container = document.createElement("div");
        var g = this._map.getSize();
        j.style.cssText = "position:absolute;background:url(about:blank);cursor:crosshair;width:" + g.width + "px;height:" + g.height + "px";
        this._map.addEventListener("resize", function (k) {
            h._adjustSize(k.size)
        });
        this._map.getPanes().floatPane.appendChild(j);
        this._bind();
        return j
    };
    e.prototype.draw = function () {
        var i = this._map, g = i.pixelToPoint(new BMap.Pixel(0, 0)), h = i.pointToOverlayPixel(g);
        this.container.style.left = h.x + "px";
        this.container.style.top = h.y + "px"
    };
    e.prototype.enableEdgeMove = function () {
        this._enableEdgeMove = true
    };
    e.prototype.disableEdgeMove = function () {
        clearInterval(this._edgeMoveTimer);
        this._enableEdgeMove = false
    };
    e.prototype._bind = function () {
        var l = this, g = this._map, h = this.container, m = null, n = null;
        var k = function (p) {
            return {x: p.clientX, y: p.clientY}
        };
        var j = function (r) {
            var q = r.type;
            r = b.getEvent(r);
            point = l.getDrawPoint(r);
            var s = function (t) {
                r.point = point;
                l.dispatchEvent(r)
            };
            if (q == "mousedown") {
                m = k(r)
            }
            var p = k(r);
            if (q == "click") {
                if (Math.abs(p.x - m.x) < 5 && Math.abs(p.y - m.y) < 5) {
                    if (!n || !(Math.abs(p.x - n.x) < 5 && Math.abs(p.y - n.y) < 5)) {
                        s("click");
                        n = k(r)
                    } else {
                        n = null
                    }
                }
            } else {
                s(q)
            }
        };
        var o = ["click", "mousedown", "mousemove", "mouseup", "dblclick"], i = o.length;
        while (i--) {
            b.on(h, o[i], j)
        }
        b.on(h, "mousemove", function (p) {
            if (l._enableEdgeMove) {
                l.mousemoveAction(p)
            }
        })
    };
    e.prototype.mousemoveAction = function (n) {
        function g(s) {
            var r = s.clientX, q = s.clientY;
            if (s.changedTouches) {
                r = s.changedTouches[0].clientX;
                q = s.changedTouches[0].clientY
            }
            return new BMap.Pixel(r, q)
        }

        var h = this._map, o = this, i = h.pointToPixel(this.getDrawPoint(n)), k = g(n), l = k.x - i.x, j = k.y - i.y;
        i = new BMap.Pixel((k.x - l), (k.y - j));
        this._draggingMovePixel = i;
        var p = h.pixelToPoint(i), m = {pixel: i, point: p};
        this._panByX = this._panByY = 0;
        if (i.x <= 20 || i.x >= h.width - 20 || i.y <= 50 || i.y >= h.height - 10) {
            if (i.x <= 20) {
                this._panByX = 8
            } else {
                if (i.x >= h.width - 20) {
                    this._panByX = -8
                }
            }
            if (i.y <= 50) {
                this._panByY = 8
            } else {
                if (i.y >= h.height - 10) {
                    this._panByY = -8
                }
            }
            if (!this._edgeMoveTimer) {
                this._edgeMoveTimer = setInterval(function () {
                    h.panBy(o._panByX, o._panByY, {"noAnimation": true})
                }, 30)
            }
        } else {
            if (this._edgeMoveTimer) {
                clearInterval(this._edgeMoveTimer);
                this._edgeMoveTimer = null
            }
        }
    };
    e.prototype._adjustSize = function (g) {
        this.container.style.width = g.width + "px";
        this.container.style.height = g.height + "px"
    };
    e.prototype.getDrawPoint = function (l) {
        var k = this._map, j = b.getTarget(l), h = l.offsetX || l.layerX || 0, m = l.offsetY || l.layerY || 0;
        if (j.nodeType != 1) {
            j = j.parentNode
        }
        while (j && j != k.getContainer()) {
            if (!(j.clientWidth == 0 && j.clientHeight == 0 && j.offsetParent && j.offsetParent.nodeName == "TD")) {
                h += j.offsetLeft || 0;
                m += j.offsetTop || 0
            }
            j = j.offsetParent
        }
        var i = new BMap.Pixel(h, m);
        var g = k.pixelToPoint(i);
        return g
    };

    function a(h, g) {
        this.drawingManager = h;
        g = this.drawingToolOptions = g || {};
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
        this.defaultDrawingModes = [BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE];
        if (g.drawingModes) {
            this.drawingModes = g.drawingModes
        } else {
            this.drawingModes = this.defaultDrawingModes
        }
        if (g.anchor) {
            this.setAnchor(g.anchor)
        }
        if (g.offset) {
            this.setOffset(g.offset)
        }
    }

    a.prototype = new BMap.Control();
    a.prototype.initialize = function (i) {
        var h = this.container = document.createElement("div");
        h.className = "BMapLib_Drawing";
        var g = this.panel = document.createElement("div");
        g.className = "BMapLib_Drawing_panel";
        if (this.drawingToolOptions && this.drawingToolOptions.scale) {
            this._setScale(this.drawingToolOptions.scale)
        }
        h.appendChild(g);
        g.innerHTML = this._generalHtml();
        this._bind(g);
        i.getContainer().appendChild(h);
        return h
    };
    a.prototype._generalHtml = function (m) {
        var h = {};
        h["hander"] = "拖动地图";
        h[BMAP_DRAWING_MARKER] = "画点";
        h[BMAP_DRAWING_CIRCLE] = "画圆";
        h[BMAP_DRAWING_POLYLINE] = "画折线";
        h[BMAP_DRAWING_POLYGON] = "画多边形";
        h[BMAP_DRAWING_RECTANGLE] = "画矩形";
        var n = function (o, i) {
            return '<a class="' + o + '" drawingType="' + i + '" href="javascript:void(0)" title="' + h[i] + '" onfocus="this.blur()"></a>'
        };
        var k = [];
        k.push(n("BMapLib_box BMapLib_hander", "hander"));
        for (var j = 0, g = this.drawingModes.length;
             j < g; j++) {
            var l = "BMapLib_box BMapLib_" + this.drawingModes[j];
            if (j == g - 1) {
                l += " BMapLib_last"
            }
            k.push(n(l, this.drawingModes[j]))
        }
        return k.join("")
    };
    a.prototype._setScale = function (j) {
        var i = 390, g = 50, k = -parseInt((i - i * j) / 2, 10), h = -parseInt((g - g * j) / 2, 10);
        this.container.style.cssText = ["-moz-transform: scale(" + j + ");", "-o-transform: scale(" + j + ");", "-webkit-transform: scale(" + j + ");", "transform: scale(" + j + ");", "margin-left:" + k + "px;", "margin-top:" + h + "px;", "*margin-left:0px;", "*margin-top:0px;", "margin-left:0px\\0;", "margin-top:0px\\0;", "filter: progid:DXImageTransform.Microsoft.Matrix(", "M11=" + j + ",", "M12=0,", "M21=0,", "M22=" + j + ",", "SizingMethod='auto expand');"].join("")
    };
    a.prototype._bind = function (g) {
        var h = this;
        b.on(this.panel, "click", function (k) {
            var j = b.getTarget(k);
            var i = j.getAttribute("drawingType");
            h.setStyleByDrawingMode(i);
            h._bindEventByDraingMode(i)
        })
    };
    a.prototype.setStyleByDrawingMode = function (h) {
        if (!h) {
            return
        }
        var j = this.panel.getElementsByTagName("a");
        for (var k = 0, g = j.length; k < g; k++) {
            var m = j[k];
            if (m.getAttribute("drawingType") == h) {
                var l = "BMapLib_box BMapLib_" + h + "_hover";
                if (k == g - 1) {
                    l += " BMapLib_last"
                }
                m.className = l
            } else {
                m.className = m.className.replace(/_hover/, "")
            }
        }
    };
    a.prototype._bindEventByDraingMode = function (g) {
        var i = this;
        var h = this.drawingManager;
        if (g == "hander") {
            h.close();
            h._map.enableDoubleClickZoom()
        } else {
            h.setDrawingMode(g);
            h.open();
            h._map.disableDoubleClickZoom()
        }
    };
    var cF = [];

    function f(g) {
        var h = cF.length;
        while (h--) {
            if (cF[h] != g) {
                cF[h].close()
            }
        }
    }

    var m = SPMLib.MsDistance = function (map, option) {
        var total = 0;
        this._map = map;
        var _b = false;
        this._option = option;
        this.c = this._map.getDefaultCursor();
        this._map.setDefaultCursor('default');
        this._map.disableDoubleClickZoom();
        var dot = undefined;
        var ls = {
            position: 'relative',
            boxShadow: 'rgb(102, 102, 102) 0px 0px 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid  rgb(206, 207, 212)'
        }
        this.state = 1;
        var _self = this;
        var begin, line, ml, t, last;
        $(document).keyup(function (evt) {
            if (evt.keyCode === 27) {//Esc
                if (_self && _self.state == 1) {
                    _b = false;
                    var l = _self._map.getOverlays();
                    for (var i = 0; i < l.length; i++) {
                        var m = l[i];
                        if (m._LN == 'MEASURE') {
                            m.remove();
                        }
                    }
                    if (last) {
                        dot = undefined;
                        begin = undefined;
                        line = undefined;
                        ml = undefined;
                        total = 0;
                        _self.evt_mov(last);

                    }
                }
            }
        })
        this.evt_clk = function (e) {
            line = undefined;
            clearTimeout(t);
            t = setTimeout(function () {
                if (_self.state == 1) {
                    var k = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat),
                        {
                            icon: new BMap.Icon("../../images/map/tools/m-dot.png", new BMap.Size(6, 6)),
                            enableMassClear: false,
                            enableClicking: false,

                        });
                    k._LN = 'MEASURE';
                    var l = new BMap.Label('', {
                        offset: new BMap.Size(10, -10),
                        position: e.point,
                        enableMassClear: false
                    });
                    l._LN = 'MEASURE';
                    l.setStyle(ls);
                    k.setLabel(l)
                    _self._map.addOverlay(k);
                    if (!begin) {
                        begin = e.point;
                        l.setContent('起点');
                    }
                    else {
                        var _d = dis(e.point, begin, _self._map).toFixed(2)
                        var _t = parseFloat(total) + parseFloat(_d);
                        l.setContent(_t.toFixed(2) + 'm');
                        total = _t;
                        begin = e.point;
                    }
                    line = new BMap.Polyline([(begin || e.point), e.point], {
                        strokeColor: 'red',//silver
                        strokeWeight: '1',
                        strokeOpacity: '1',
                        strokeStyle: 'dashed',//solid
                        enableMassClear: false,
                        enableClicking: false
                    });
                    line._LN = 'MEASURE';
                    _self._map.addOverlay(line);
                    _b = true;
                }
            }, 300)
        }
        this.evt_mov = function (e) {
            if (_self.state == 1) {
                if (!dot) {
                    dot = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat),
                        {
                            icon: new BMap.Icon("../../images/map/tools/m-dot.png", new BMap.Size(6, 6)),
                            enableMassClear: false,
                            enableClicking: false
                        });
                    dot._LN = 'MEASURE';
                    _self._map.addOverlay(dot);
                }
                else {
                    dot.setPosition(e.point);
                }
                if (_b == true) {
                    //画线
                    if (line) {//&&_this._lc==true
                        line.setPositionAt(1, e.point);
                    }
                    var m = dis(begin || e.point, e.point, _self._map).toFixed(2);
                    var _t = parseFloat(total) + parseFloat(m);
                    if (!ml) {
                        ml = new BMap.Label(_t + 'm', {
                            offset: new BMap.Size(10, 0),
                            position: e.point,
                            enableMassClear: false
                        });
                        ml._LN = 'MEASURE';
                        ml.setStyle(ls);
                        dot.setLabel(ml);
                    }
                    else {
                        ml.setPosition(e.point);
                        ml.setContent(_t.toFixed(2) + 'm');
                    }
                }
                last = e;
            }
        }
        this.evt_dbl = function (e) {
            clearTimeout(t);
            _self.state = 0;
            _b = false;
        }
    }
    m.prototype.state = function () {
        return this.state;
    };
    m.prototype.open = function () {
        this._map.addEventListener('mousemove', this.evt_mov)
        this._map.addEventListener('dblclick', this.evt_dbl)
        this._map.addEventListener('click', this.evt_clk);
    }
    m.prototype.close = function () {
        this.state = 0;
        this._map.setDefaultCursor(this.c);
        var l = this._map.getOverlays();
        for (var i = 0; i < l.length; i++) {
            var m = l[i];
            if (m._LN == 'MEASURE') {
                m.remove();
            }
        }
        this._map.removeEventListener('mousemove', this.evt_mov);
        this._map.removeEventListener('dblclick', this.evt_dbl);
        this._map.removeEventListener('click', this.evt_clk);
        //this._map.enableDoubleClickZoom();//
        if (this._option && this._option.callback && typeof this._option.callback == 'function') {
            this._option.callback();
        }
    }

    function dis(n1, n2, _map) {
        return _map.getDistance(n1, n2);
    }




    /**
     * 地球半径
     */
    var EARTHRADIUS = 6370996.81;
    /**
     * @exports GeoUtils as MGeoLib.GeoUtils
     */
    var gU =
        /**
         * GeoUtils类，静态类，勿需实例化即可使用
         * @class GeoUtils类的<b>入口</b>。
         * 该类提供的都是静态方法，勿需实例化即可使用。
         */
        SPMLib.GeoUtils = function () {

        }
    /**
     * 判断点是否在矩形内
     * @param {Point} point 点对象
     * @param {Bounds} bounds 矩形边界对象
     * @returns {Boolean} 点在矩形内返回true,否则返回false
     */
    gU.isPointInRect = function (point, bounds) {
        //检查类型是否正确
        if (!(point instanceof BMap.Point) ||
            !(bounds instanceof BMap.Bounds)) {
            return false;
        }
        var sw = bounds.getSouthWest(); //西南脚点
        var ne = bounds.getNorthEast(); //东北脚点
        return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
    }
    /**
     * 判断点是否在圆形内
     * @param {Point} point 点对象
     * @param {Circle} circle 圆形对象
     * @returns {Boolean} 点在圆形内返回true,否则返回false
     */
    gU.isPointInCircle = function (point, circle) {
        //检查类型是否正确
        if (!(point instanceof BMap.Point) ||
            !(circle instanceof BMap.Circle)) {
            return false;
        }

        //point与圆心距离小于圆形半径，则点在圆内，否则在圆外
        var c = circle.getCenter();
        var r = circle.getRadius();

        var dis = GeoUtils.getDistance(point, c);
        if (dis <= r) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 判断点是否在折线上
     * @param {Point} point 点对象
     * @param {Polyline} polyline 折线对象
     * @returns {Boolean} 点在折线上返回true,否则返回false
     */
    gU.isPointOnPolyline = function (point, polyline) {
        //检查类型
        if (!(point instanceof BMap.Point) ||
            !(polyline instanceof BMap.Polyline)) {
            return false;
        }

        //首先判断点是否在线的外包矩形内，如果在，则进一步判断，否则返回false
        var lineBounds = polyline.getBounds();
        if (!this.isPointInRect(point, lineBounds)) {
            return false;
        }

        //判断点是否在线段上，设点为Q，线段为P1P2 ，
        //判断点Q在该线段上的依据是：( Q - P1 ) × ( P2 - P1 ) = 0，且 Q 在以 P1，P2为对角顶点的矩形内
        var pts = polyline.getPath();
        for (var i = 0; i < pts.length - 1; i++) {
            var curPt = pts[i];
            var nextPt = pts[i + 1];
            //首先判断point是否在curPt和nextPt之间，即：此判断该点是否在该线段的外包矩形内
            if (point.lng >= Math.min(curPt.lng, nextPt.lng) && point.lng <= Math.max(curPt.lng, nextPt.lng) &&
                point.lat >= Math.min(curPt.lat, nextPt.lat) && point.lat <= Math.max(curPt.lat, nextPt.lat)) {
                //判断点是否在直线上公式
                var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) -
                    (nextPt.lng - point.lng) * (curPt.lat - point.lat);
                if (precision < 2e-10 && precision > -2e-10) {//实质判断是否接近0
                    return true;
                }
            }
        }

        return false;
    }
    /**
     * 判断点是否多边形内
     * @param {Point} point 点对象
     * @param {Polyline} polygon 多边形对象
     * @returns {Boolean} 点在多边形内返回true,否则返回false
     */
    gU.isPointInPolygon = function (point, polygon) {
        //检查类型
        if (!(point instanceof BMap.Point) ||
            !(polygon instanceof BMap.Polygon)) {
            return false;
        }

        //首先判断点是否在多边形的外包矩形内，如果在，则进一步判断，否则返回false
        var polygonBounds = polygon.getBounds();
        if (!this.isPointInRect(point, polygonBounds)) {
            return false;
        }

        var pts = polygon.getPath();//获取多边形点

        //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
        //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
        //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

        var N = pts.length;
        var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        var intersectCount = 0;//cross points count of x
        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        var p1, p2;//neighbour bound vertices
        var p = point; //测试点

        p1 = pts[0];//left vertex
        for (var i = 1; i <= N; ++i) {//check all rays
            if (p.equals(p1)) {
                return boundOrVertex;//p is an vertex
            }

            p2 = pts[i % N];//right vertex
            if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {//ray is outside of our interests
                p1 = p2;
                continue;//next ray left point
            }

            if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {//ray is crossing over by the algorithm (common part of)
                if (p.lng <= Math.max(p1.lng, p2.lng)) {//x is before of ray
                    if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {//overlies on a horizontal ray
                        return boundOrVertex;
                    }

                    if (p1.lng == p2.lng) {//ray is vertical
                        if (p1.lng == p.lng) {//overlies on a vertical ray
                            return boundOrVertex;
                        } else {//before ray
                            ++intersectCount;
                        }
                    } else {//cross point on the left side
                        var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng
                        if (Math.abs(p.lng - xinters) < precision) {//overlies on a ray
                            return boundOrVertex;
                        }

                        if (p.lng < xinters) {//before ray
                            ++intersectCount;
                        }
                    }
                }
            } else {//special case when ray is crossing through the vertex
                if (p.lat == p2.lat && p.lng <= p2.lng) {//p crossing over p2
                    var p3 = pts[(i + 1) % N]; //next vertex
                    if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {//p.lat lies between p1.lat & p3.lat
                        ++intersectCount;
                    } else {
                        intersectCount += 2;
                    }
                }
            }
            p1 = p2;//next ray left point
        }

        if (intersectCount % 2 == 0) {//偶数在多边形外
            return false;
        } else { //奇数在多边形内
            return true;
        }
    }
    /**
     * 将度转化为弧度
     * @param {degree} Number 度
     * @returns {Number} 弧度
     */
    gU.degreeToRad = function (degree) {
        return Math.PI * degree / 180;
    }
    /**
     * 将弧度转化为度
     * @param {radian} Number 弧度
     * @returns {Number} 度
     */
    gU.radToDegree = function (rad) {
        return (180 * rad) / Math.PI;
    }
    /**
     * 将v值限定在a,b之间，纬度使用
     */
    function _getRange(v, a, b) {
        if (a != null) {
            v = Math.max(v, a);
        }
        if (b != null) {
            v = Math.min(v, b);
        }
        return v;
    }
    /**
     * 将v值限定在a,b之间，经度使用
     */
    function _getLoop(v, a, b) {
        while (v > b) {
            v -= b - a
        }
        while (v < a) {
            v += b - a
        }
        return v;
    }
    /**
     * 计算两点之间的距离,两点坐标必须为经纬度
     * @param {point1} Point 点对象
     * @param {point2} Point 点对象
     * @returns {Number} 两点之间距离，单位为米
     */
    gU.getDistance = function (point1, point2) {
        //判断类型
        if (!(point1 instanceof BMap.Point) ||
            !(point2 instanceof BMap.Point)) {
            return 0;
        }

        point1.lng = _getLoop(point1.lng, -180, 180);
        point1.lat = _getRange(point1.lat, -74, 74);
        point2.lng = _getLoop(point2.lng, -180, 180);
        point2.lat = _getRange(point2.lat, -74, 74);

        var x1, x2, y1, y2;
        x1 = GeoUtils.degreeToRad(point1.lng);
        y1 = GeoUtils.degreeToRad(point1.lat);
        x2 = GeoUtils.degreeToRad(point2.lng);
        y2 = GeoUtils.degreeToRad(point2.lat);

        return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));
    }
    /**
     * 计算折线或者点数组的长度
     * @param {Polyline|Array<Point>} polyline 折线对象或者点数组
     * @returns {Number} 折线或点数组对应的长度
     */
    gU.getPolylineDistance = function (polyline) {
        //检查类型
        if (polyline instanceof BMap.Polyline ||
            polyline instanceof Array) {
            //将polyline统一为数组
            var pts;
            if (polyline instanceof BMap.Polyline) {
                pts = polyline.getPath();
            } else {
                pts = polyline;
            }

            if (pts.length < 2) {//小于2个点，返回0
                return 0;
            }

            //遍历所有线段将其相加，计算整条线段的长度
            var totalDis = 0;
            for (var i = 0; i < pts.length - 1; i++) {
                var curPt = pts[i];
                var nextPt = pts[i + 1]
                var dis = GeoUtils.getDistance(curPt, nextPt);
                totalDis += dis;
            }

            return totalDis;

        } else {
            return 0;
        }
    }
    /**
     * 计算多边形面或点数组构建图形的面积,注意：坐标类型只能是经纬度，且不适合计算自相交多边形的面积
     * @param {Polygon|Array<Point>} polygon 多边形面对象或者点数组
     * @returns {Number} 多边形面或点数组构成图形的面积
     */
    gU.getPolygonArea = function (polygon) {
        //检查类型

        if (!(polygon instanceof BMap.Polygon) &&
            !(polygon instanceof Array)) {
            return 0;
        }
        var pts;
        if (polygon instanceof BMap.Polygon) {
            pts = polygon.getPath();
        } else {
            pts = polygon;
        }

        if (pts.length < 3) {//小于3个顶点，不能构建面
            return 0;
        }

        var totalArea = 0;//初始化总面积
        var LowX = 0.0;
        var LowY = 0.0;
        var MiddleX = 0.0;
        var MiddleY = 0.0;
        var HighX = 0.0;
        var HighY = 0.0;
        var AM = 0.0;
        var BM = 0.0;
        var CM = 0.0;
        var AL = 0.0;
        var BL = 0.0;
        var CL = 0.0;
        var AH = 0.0;
        var BH = 0.0;
        var CH = 0.0;
        var CoefficientL = 0.0;
        var CoefficientH = 0.0;
        var ALtangent = 0.0;
        var BLtangent = 0.0;
        var CLtangent = 0.0;
        var AHtangent = 0.0;
        var BHtangent = 0.0;
        var CHtangent = 0.0;
        var ANormalLine = 0.0;
        var BNormalLine = 0.0;
        var CNormalLine = 0.0;
        var OrientationValue = 0.0;
        var AngleCos = 0.0;
        var Sum1 = 0.0;
        var Sum2 = 0.0;
        var Count2 = 0;
        var Count1 = 0;
        var Sum = 0.0;
        var Radius = EARTHRADIUS; //6378137.0,WGS84椭球半径
        var Count = pts.length;
        for (var i = 0; i < Count; i++) {
            if (i == 0) {
                LowX = pts[Count - 1].lng * Math.PI / 180;
                LowY = pts[Count - 1].lat * Math.PI / 180;
                MiddleX = pts[0].lng * Math.PI / 180;
                MiddleY = pts[0].lat * Math.PI / 180;
                HighX = pts[1].lng * Math.PI / 180;
                HighY = pts[1].lat * Math.PI / 180;
            }
            else if (i == Count - 1) {
                LowX = pts[Count - 2].lng * Math.PI / 180;
                LowY = pts[Count - 2].lat * Math.PI / 180;
                MiddleX = pts[Count - 1].lng * Math.PI / 180;
                MiddleY = pts[Count - 1].lat * Math.PI / 180;
                HighX = pts[0].lng * Math.PI / 180;
                HighY = pts[0].lat * Math.PI / 180;
            }
            else {
                LowX = pts[i - 1].lng * Math.PI / 180;
                LowY = pts[i - 1].lat * Math.PI / 180;
                MiddleX = pts[i].lng * Math.PI / 180;
                MiddleY = pts[i].lat * Math.PI / 180;
                HighX = pts[i + 1].lng * Math.PI / 180;
                HighY = pts[i + 1].lat * Math.PI / 180;
            }
            AM = Math.cos(MiddleY) * Math.cos(MiddleX);
            BM = Math.cos(MiddleY) * Math.sin(MiddleX);
            CM = Math.sin(MiddleY);
            AL = Math.cos(LowY) * Math.cos(LowX);
            BL = Math.cos(LowY) * Math.sin(LowX);
            CL = Math.sin(LowY);
            AH = Math.cos(HighY) * Math.cos(HighX);
            BH = Math.cos(HighY) * Math.sin(HighX);
            CH = Math.sin(HighY);
            CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
            CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);
            ALtangent = CoefficientL * AL - AM;
            BLtangent = CoefficientL * BL - BM;
            CLtangent = CoefficientL * CL - CM;
            AHtangent = CoefficientH * AH - AM;
            BHtangent = CoefficientH * BH - BM;
            CHtangent = CoefficientH * CH - CM;
            AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
            AngleCos = Math.acos(AngleCos);
            ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
            BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
            CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;
            if (AM != 0)
                OrientationValue = ANormalLine / AM;
            else if (BM != 0)
                OrientationValue = BNormalLine / BM;
            else
                OrientationValue = CNormalLine / CM;
            if (OrientationValue > 0) {
                Sum1 += AngleCos;
                Count1++;
            }
            else {
                Sum2 += AngleCos;
                Count2++;
            }
        }
        var tempSum1, tempSum2;
        tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
        tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2;
        if (Sum1 > Sum2) {
            if ((tempSum1 - (Count - 2) * Math.PI) < 1)
                Sum = tempSum1;
            else
                Sum = tempSum2;
        }
        else {
            if ((tempSum2 - (Count - 2) * Math.PI) < 1)
                Sum = tempSum2;
            else
                Sum = tempSum1;
        }
        totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;

        return totalArea=='NaN'?0:totalArea.toFixed(4); //返回总面积
    }
    /**
     * 计算多边形的中心点
     * @param {BMap.Polygon|Array<BMap.Point>} geometry
     * @return {BMap.Point}
     */
    gU.getPolygonCenter = function (geometry) {
        var points;
        if (geometry instanceof BMap.Polygon) {
            points=geometry.getPath();
        }
        else  if(geometry instanceof Array)
        {
            if(geometry.length>0&&(geometry[0] instanceof BMap.Point))
            {
                points=geometry;
            }
        }
        if(!points)
            return;
        var sum_x = 0;
        var sum_y = 0;
        var sum_area = 0;
        var p1 = points[1];
        for (var i = 2; i < points.length; i++) {
            var p2 = points[i];
            area = Area(points[0], p1, p2);
            sum_area += area;
            sum_x += (points[0].lng + p1.lng + p2.lng) * area;
            sum_y += (points[0].lat + p1.lat + p2.lat) * area;
            p1 = p2;
        }
        var xx = sum_x / sum_area / 3;
        var yy = sum_y / sum_area / 3;
        return new BMap.Point(xx, yy);

    }
    function Area(p0, p1, p2) {
        var area = p0.lng * p1.lat + p1.lng * p2.lat + p2.lng * p0.lat - p1.lng * p0.lat - p2.lng * p1.lat - p0.lng * p2.lat;
        return area / 2;
    }
})();