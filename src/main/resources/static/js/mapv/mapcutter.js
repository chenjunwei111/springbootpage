var cutterInfo = {};
var maptype=null;
var docpath=null;
function  MapCutter() {
    this.maptype = '';
}

/**
 *@summary cutter
 * @param {String} citycode
 * @param {String} date
 * @param {String} type
 * @param {String} lnglat
 */
    MapCutter.prototype.get = function (citycode, date, type,lnglat) {
        getDocPath();
        $.ajax(
            {
                type: 'post',
                url: '/userperce/Tiles/getTilesFiles',
                async: false,
                data:
                    {
                        folder: docpath+'\\tiles',
                        citycode: citycode,
                        date: date,
                        type: type,
                        range:lnglat//minlng_maxlng_minlat_maxlat
                    },
                success: function (data) {
                    if(data||data.length>0)
                    {
                        cutterInfo = data;
                        maptype = type;
                    }
                    else
                    {msg("无切片数据.")}
                },
                error: function (e) {
                    console.log(e)
                }
            }
        )
    }

    MapCutter.prototype.set = function (zoom) {
        if (!cutterInfo) {
            return false;
        }
        var tiles = cutterInfo[zoom];
        if (!tiles || tiles.length == 0)
            return false;
        var NE = basemap.mapvw.getBounds().getNorthEast();
        var SW = basemap.mapvw.getBounds().getSouthWest();
        var mNE = basemap.mapvw.getMapType().getProjection().lngLatToPoint(new BMap.Point(
            NE.lng, NE.lat));
        var mSW = basemap.mapvw.getMapType().getProjection().lngLatToPoint(new BMap.Point(
            SW.lng, SW.lat));
        var f = Math.pow(2, 18 - zoom);
        var offset = 0;
        // if (zoom >= 17) {
        //     offset = 1024 * f;
        // }
        // else
        if (zoom >= 12) {
            offset = 512 * f;
        }
        else {
            offset = 256 * f;
        }
        mSW = {x: mSW.x - offset, y: mSW.y - offset};
        mNE = {x: mNE.x + offset, y: mNE.y + offset};
        var data = [];
        var src=docpath.indexOf(':')>0?docpath.substring(docpath.indexOf(':')+1):"";

        $.each(tiles, function (a, b) {
            if (b.x >= mSW.x && b.x <= mNE.x && b.y <= mNE.y && b.y >= mSW.y) {
                var img = new Image();
                img.src = src+'/tiles/' + b.path;
                data.push(
                    {
                        geometry: {
                            type: 'Point',
                            coordinates_mercator: [b.x, b.y]
                        },
                        icon: img,
                    }
                )
            }
        })
        if (data.length > 0) {
            var tilelyr = lyrmgr.getMapLayerbyType(lyrmgr.LType.TILESMAP);
            if (tilelyr && tilelyr.length > 0) {
                lyrmgr.updateMapDataByType(lyrmgr.LType.TILESMAP, data);
            }
            else {
                lyrmgr.addMapLayer(data,
                    {
                        mname: maptype,
                        mtype: lyrmgr.LType.TILESMAP,
                        options: {
                            draw: 'icon',
                            coordType: 'mercator',
                        }
                    })
                //this.setLegend();
            }
        }
        data=[];
        return true;
    }

MapCutter.prototype.setLegend= function () {
        $.ajax(
            {
                type: 'post',
                url: '/userperce/Tiles/getTileLgd',
                data: {
                    lyrType: maptype//maptype
                },
                success: function (data) {
                    if (data && data.length > 0) {
                        var l = []
                        $.each(data, function (a, b) {
                            l.push({
                                text: b.text,
                                style: b.s,
                                max: b.max,
                                min: b.min,
                                eqp: b.q//[号的位置 [,):L (,]:R [,]:A (,):N
                            })
                        })
                        Legends.AddLegend(maptype, data[0].h, l);
                        l.splice(0,l.length);
                    }
                }
            })
    }

MapCutter.prototype.clearData=function () {
    cutterInfo={};
}
    function getDocPath() {
        if (docpath)
            return;
        $.ajax(
            {
                type: 'post',
                url: '/userperce/Tiles/getTilesdocPath',
                async: false,
                success: function (data) {
                    docpath = data;
                }
            })
    }
