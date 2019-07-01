//坐标转换
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.mapLabel = global.mapLabel || {})));
}(this, (function (exports) {
    'use strict';
    
    function  Label() {
    }

    //options:{name:,offset:{x,y},size:,font:'18px Arial',style: 'yellow',shadow:{color:'yellow',blur:10}}
    Label.prototype.setLayer=function (layer,options) {
        if (!layer)
            return;
        var data = layer.dataSet._data;
        var _data = [];
        if (options.offset.x == 0 && options.offset.y == 0) {
            $.each(data, function (a, b) {
                var c = getRandom();
                _data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [b.geometry.coordinates[0] + c.x * Math.random(), b.geometry.coordinates[1] + c.y * Math.random()]
                    },
                    label: b.text
                });
            })
        }
        else {
            var $data = [];
            $.each(data, function (a, b) {
                $data.push({lng: b.geometry.coordinates[0], lat: b.geometry.coordinates[1], deg: b.deg, text: b.text});
            })
            var p = new PjComm.PjMapData(layer.map);
            p.SetOffsetPoint($data, options.offset);
            _data.splice(0, _data.length);
            if ($data) {
                $.each($data, function (a, b) {
                    var c = getRandom();
                    _data.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [b.ofslng + c.x * Math.random(), b.ofslat + c.y * Math.random()]
                        },
                        label: b.text
                    });
                })
                $data.splice(0, $data.length);
            }
        }
        // if (_data.length > 0) {
        //     $.each(data, function (a, b) {
        //         delete  b.text;
        //     })
        // }
        var opts = {
            draw: 'text',
            avoid: false,
            // size: options.size || 12,
            font: options.font || '13px Arial',
            zIndex: 9999,
            textKey: 'label'
        }
        if (options.style) {
            opts.fillStyle = options.style
        }
        if (options.shadow) {
            opts.shadowColor = options.shadow.color || 'yellow';
            opts.shadowBlur = options.shadow.blur || 10;
        }
        options.mcode = opts.mcode = Math.random().toString(16).replace(".", "");
        var dataSet = new mapv.DataSet(_data);
        var v = new mapv.baiduMapLayer(layer.map, dataSet, opts);
    }
    
    //options {name:,offset:{x,y},size:,font:'18px Arial',style: 'yellow',shadow:{color:'yellow',blur:10},data:包括lng,lat,deg,text对象数组 或 取得data的数据function}
    Label.prototype.setData=function(map,options) {
        var data=getData(options);
        if(!data||data.length==0)
            return;
        if (options.offset.x == 0 && options.offset.y == 0) {
            $.each(data, function (a, b) {
                var c = getRandom();
                b["geometry"] = {
                    type: 'Point',
                    coordinates: [b.lng + c.x * Math.random(), b.lat + c.y * Math.random()]
                };
                b["label"] = b.text;
                delete  b.text;
                delete  b.lng;
                delete b.lat;
                delete b.deg;
            })
        }
        else {
            var p = new PjComm.PjMapData(map);
            p.SetOffsetPoint(data, offset);
            if (data) {
                var c = getRandom();
                $.each(data, function (a, b) {
                    b["geometry"] = {
                        type: 'Point',
                        coordinates: [b.ofslng + c.x * Math.random(), b.ofslat + c.y * Math.random()]
                    };
                    b["label"] = b.text;
                    // delete  b.text;
                    // delete  b.lng;
                    // delete b.lat;
                    // delete b.deg;
                })
            }
        }
        var opt = {
            draw: 'text',
            avoid: false,
            font: options.font || '13px Arial',
            zIndex: 9999,
            textKey: 'label',
        };
        if (options.style) {
            opt.options.fillStyle = options.style
        }
        if (options.shadow) {
            opt.shadowColor = options.shadow.color || 'yellow';
            opt.shadowBlur = options.shadow.blur || 10;
        }
        options.mcode = opt.mcode = Math.random().toString(16).replace(".", "");
        var dataSet = new mapv.DataSet(data);
        var v = new mapv.baiduMapLayer(map, dataSet, opt);
    }
    function  getData(options) {
        if (typeof options.data === "function") {
            var _data = new Array();
            options.data(_data);
            return _data;
        }
        else if (typeof options.data == "Array") {
            return options.data;
        }
    }

     function getRandom() {
         var r=Math.round(Math.random()*10)
         return r<3?{x:0.0001,y:0.0003}:c<5?{x:-0.0001,y:-0.0003}:c<8?{x:-0.0001,y:0.0003}: {x:0.0001,y:-0.0003};
     }
    exports.Label=Label;
    Object.defineProperty(exports, '__esModule', {value: true});
})));