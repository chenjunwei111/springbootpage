'use script'
var SPMap=window.SPMap=SPMap||{};
var maploaded;
var t=SPMap.Map=function (mapselector,option) {
    maploaded=false;
    try {
        var map = new BMap.Map(mapselector, {
            minZoom: 11,
            maxZoom: 19,
            enableMapClick: false
        });
        maploaded=true;
        return map;
    }
    catch (e) {
        var m;
        $.ajax({
            type: "post",
            url: '../../js/olmap/olmap-modify.js',
            async: false,
            success: function () {
                m= loadol();
                maploaded=true;
            },
            error: function () {

            }
        })
        return m;
    }

    function loadol() {
        var outputPath = '/olmap/tiles/';
        var fromat = ".png";    //格式
        var tileLayer = new BMap.TileLayer();
        tileLayer.getTilesUrl = function (tileCoord, zoom) {
            var x = tileCoord.x;
            var y = tileCoord.y;
            var url = outputPath + zoom + '/' + x + '_' + y + fromat;
            return url;
        }
        var tileMapType = new BMap.MapType('tileMapType', tileLayer);

        var map = new BMap.Map(mapselector, {mapType: tileMapType});
        var _option = option || {
            minZoom: 7,
            maxZoom: 19,
            defCity: '昆明',
            defLocation: {Lng: 102.762764, Lat: 25.002435},
            enableZoomByScrollWheel: true
        }
        map.setMaxZoom(17);
        map.setMinZoom(7);

        // 创建地图实例
        var point = new BMap.Point(102.762764, 25.002435);  // 创建点坐标
        map.centerAndZoom(point, 13);
        map.disableDoubleClickZoom();
        return map;
    }
}
