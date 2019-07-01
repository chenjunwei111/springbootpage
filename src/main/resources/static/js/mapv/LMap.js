'use script'
var SPMap = window.SPMap = SPMap || {};
var Loaded = false;
var t = SPMap.Map = function(mapselector, option) {
    Loaded = false;

    try {
        var map;
        if ($map == 0) {
            map = new BMap.Map(mapselector, {
                minZoom : 11,
                maxZoom : 19,
                enableMapClick : false
            });
            map.net = 'onLine';
            // return map;
        } else if ($map == 1) {
            map = loadol();
            map.net = 'offLine';
            // isoff = true;
            // return map;
        }
    } catch (e) {
        throw new Error("load map failed.");
        // return m;
    } finally {
        if (map) {
            map.disableDoubleClickZoom();
            map.enableScrollWheelZoom();
            map.enableKeyboard();
            map.disableContinuousZoom();
            map.setMapStyle({
                style : 'bluish'
            })
            map.setDefaultCursor('auto');
            var sz=(option&&option.defZoom)||17;
            map.centerAndZoom((option&&(option.defCity||option.defPoint)) || '昆明',sz)
            map.setZoom(sz);
            Loaded = true;
            return map;
        }
    }

    function loadol() {
        var outputPath = '/olmap/tiles/';
        var fromat = ".png";
        var tileLayer = new BMap.TileLayer();
        tileLayer.getTilesUrl = function(tileCoord, zoom) {
            var x = tileCoord.x;
            var y = tileCoord.y;
            var url = outputPath + zoom + '/' + x + '_' + y + fromat;
            return url;
        }
        var tileMapType = new BMap.MapType('tileMapType', tileLayer);

        var map = new BMap.Map(mapselector, {
            mapType : tileMapType
        });
        var _option = option || {
            minZoom : 7,
            maxZoom : 19,
            defCity : '昆明',
            defLocation : {
                Lng : 102.762764,
                Lat : 25.002435
            },
            enableZoomByScrollWheel : true
        }
        map.setMaxZoom(18);
        map.setMinZoom(7);

        // 创建地图实例
        var point = new BMap.Point(102.762764, 25.002435); // 创建点坐标
        map.centerAndZoom(point, 16);
        // map.disableDoubleClickZoom();
        // map.enableScrollWheelZoom();
        // map.enableKeyboard();
        // map.disableContinuousZoom();
        // map.setMapStyle({style:'bluish'})
        // map.setDefaultCursor('auto');
        return map;
    }
}
