/**
 * @author yuan
 */
'use script'
var MesureTool=window.MesureTool=MesureTool||{};
var m=MesureTool.distance=function (map,option) {
    var total = 0;
    this._map = map;
    var _b = false;
    this._option = option;
    this.c = this._map.getDefaultCursor();
    this._map.setDefaultCursor('default');
    this._map.disableDoubleClickZoom();
    var dot = undefined;
    var ls = {
        boxShadow: 'rgb(102, 102, 102) 0px 0px 10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid  rgb(206, 207, 212)'
    }
    this.state = 1;
    var _self = this;
    var begin, line, ml,t,last;
    $(document).keyup(function (evt) {
        if (evt.keyCode === 27) {//Esc
            if (_self && _self.state == 1) {
                _b = false;
                var l = _self._map.getOverlays();
                for (var i = 0; i < l.length; i++) {
                    var m = l[i];
                    if (m._LN = 'MEASURE') {
                        m.remove();
                    }
                }
                if (last) {
                    dot = undefined;
                    begin = undefined;
                    line = undefined;
                    ml = undefined;
                    total=0;
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
                var l = new BMap.Label('', {offset: new BMap.Size(10, -10), position: e.point, enableMassClear: false});
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
            last=e;
        }
    }
    this.evt_dbl = function (e) {
        clearTimeout(t);
        this.state = 0;
        _b = false;
    }
}
m.prototype.state=function () {
    return this.state;
};

m.prototype.open=function () {
    this._map.addEventListener('mousemove', this.evt_mov)
    this._map.addEventListener('dblclick', this.evt_dbl)
    this._map.addEventListener('click', this.evt_clk);
}
m.prototype.close=function () {
    this.state = 0;
    this._map.setDefaultCursor(this.c);
    var l = this._map.getOverlays();
    for (var i = 0; i < l.length; i++) {
        var m = l[i];
        if (m._LN == 'MEASURE') {
            m.remove();
        }
    }
    this._map.removeEventListener('mousemove',this.evt_mov);
    this._map.removeEventListener('dblclick',this.evt_dbl);
    this._map.removeEventListener('click',this.evt_clk);
    //this._map.enableDoubleClickZoom();//
    if (this._option.callback && typeof this._option.callback == 'function') {
        this._option.callback();
    }
}
 function  dis(n1,n2,_map) {
     return _map.getDistance(n1, n2);
 }
 function setL(_e,_map) {
     if (_e.pixel.x > 30) {
         $('.m-dot .info:last').css({left: (_e.pixel.x+10) + 'px', top: _e.pixel.y + 'px'});
     }
     else {
         $('.m-dot .info:last').css({left: (_e.pixel.x - 20) + 'px', top: _e.pixel.y + 'px'});
     }
     if (_map) {
         if (_e.pixel.x <= 2) {
             _map.panBy(-5, 0);
         }
         if (_e.pixel.y <= 2) {
             _map.panBy(0, -5);
         }
         if (_e.clientX - _e.pixel.x <= 2) {
             _map.panBy(5, 0);
         }
         if (_e.clientY - _e.pixel.y <= 2) {
             _map.panBy(0, 5);
         }
     }
 }


function b(f){var f=window.event||f;f.stopPropagation?f.stopPropagation():f.cancelBubble=true}

