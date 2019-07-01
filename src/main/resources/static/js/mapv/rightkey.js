(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.rightkey = global.rightkey || {})));
}(this, (function (exports) {
    'use strict';


//var srcipt=document.createElement("script");
//srcipt.type="text/javascript";
//srcipt.src="/WebContent/js/jquery-3.1.1.js";
// var CityCode;//530100
// var Date;//20170601
// var setCityDateEvn=function(city,date)
// {
// 	CityCode=city;
// 	Date=date;
// }

    var curserial = 0;
    var menucount = 0;
    var menuMaxnum = 4;

    /*
    Generated Menu Array
    item: sector array
    functid: 0-no function menu 1-dyoverlay menu 2-updownmatrix menu 3-mrgrid menu
    return  menu array
     */
    function AddArrayMenu(item, funcid) {
        if (!item || item.length == 0)
            return;
        curserial = menuMaxnum;
        menucount = item.length;
        var menu = new Array();
        $.each(item, function (idx, s) {
            var twolevel = getTowlevel(s, funcid);
            menu.push(
                {
                    name: s,
                    id: 's_' + s,
                    level: 1,
                    serial: idx.toString(),
                    viewer: idx >= menuMaxnum ? 'none' : 'block'
                }
            )
            // console.log("menu1");
            // console.log(menu);
            Array.prototype.push.apply(menu, twolevel);
            // console.log("menu2");
            // console.log(menu);
        });
        //排序
        // var basemenu=menu.sort(
        //     function(a, b)
        //     {
        //         if(a.level < b.level) return -1;
        //         if(a.level > b.level) return 1;
        //         return 0;
        //     });
        var basemenu = getSortMenu(menu);
        //超过6个显示浮动
        if (item.length > menuMaxnum) {
            basemenu.splice(0, 0,
                {
                    name: '▲',
                    id: 'r-up-menu-item',
                    level: 1,
                    serial: -1,
                    viewer: 'none',
                    callback: function () {
                        upChange();
                    }
                }
            );
            basemenu.push(
                {
                    name: '▼',
                    id: 'r-down-menu-item',
                    level: 1,
                    serial: -2,
                    viewer: 'block',
                    callback: function () {
                        downChange();
                    }
                }
            );
        }
        return basemenu;
    }

//初始化2级基础菜单
    function getTowlevel(pid, maptype) {

        var baseitem = [
            {
                name: "小区RSRP栅格覆盖",
                id: "rsrp-cell-grid_" + pid,
                parent: 's_' + pid,
                level: 2,
                callback: function (e) {
                    console.log(e);
                    var s= e.target.parentNode.id.substring(e.target.parentNode.id.lastIndexOf("_") + 1);
                    $Layer.drawSectorRsrpGrid(s)
                }
            },
            {
                name: "用户RSRP覆盖点",
                id: "user-cell-grid_" + pid,
                parent: 's_' + pid,
                level: 2,
                callback: function (e) {
                    console.log(e);
                    var s= e.target.parentNode.id.substring(e.target.parentNode.id.lastIndexOf("_") + 1);
                    $Layer.drawUserRsrpGrid(s)
                }
            },
            {
                name: "小区属性",
                id: "sector-property_" + pid,
                parent: 's_' + pid,
                level: 2,
                callback: function (e) {
                    doEventForProperty(e.target.parentNode.id);
                }
            }     
        ];
        return baseitem;
    }

    function getSortMenu(arr) {
        if (!arr)
            return;
        var newarr = [];
        for (var maxl = 1; maxl <= 6; maxl++) {
            $.each(arr, function (i, obj) {
                if (obj.level === maxl) {
                    newarr.push(obj);
                }
            })
        }
        return newarr;
    }

    /*******-----------------------------------------------------右键菜单事件---------------------------*******/

    /*
    菜单1级数量变动
     */
    function upChange() {
        curserial--;
        $("#r-down-menu-item").css("display", "block");
        $(".menu-item-line[serial=\"-2\"]").css("display", "block");
        $(".web-context-menu-item[serial=\"" + (curserial - menuMaxnum) + "\"]").css("display", "block");
        $(".menu-item-line[serial=\"" + (curserial - menuMaxnum) + "\"]").css("display", "block");
        $(".web-context-menu-item[serial=\"" + (curserial) + "\"]").css("display", "none");
        $(".menu-item-line[serial=\"" + (curserial) + "\"]").css("display", "none");
        if (curserial == menuMaxnum) {
            $("#r-up-menu-item").css("display", "none");
            $(".menu-item-line[serial=\"-1\"]").css("display", "none");
        }
    }

    function downChange() {
        $("#r-up-menu-item").css("display", "block");
        $(".menu-item-line[serial=\"-1\"]").css("display", "block");
        $(".web-context-menu-item[serial=\"" + (curserial - menuMaxnum) + "\"]").css("display", "none");
        $(".menu-item-line[serial=\"" + (curserial - menuMaxnum) + "\"]").css("display", "none");
        $(".web-context-menu-item[serial=\"" + curserial + "\"]").css("display", "block");
        $(".menu-item-line[serial=\"" + curserial + "\"]").css("display", "block");
        curserial++;
        if (curserial >= menucount) {
            $("#r-down-menu-item").css("display", "none");
            $(".menu-item-line[serial=\"-2\"]").css("display", "none");
            // curserial--;
        }
    }

    /*
     *获取小区属性
     */
    function doEventForProperty(value) {
        var sector = value.substring(value.lastIndexOf("_") + 1);
        //小区数据
        $.ajax
        ({
            type: 'post',
            url: "/userperce/PLteSector/dynamicSqlCnd",
            async: false,//设置为同步
            data: {
                cityCode: basemap.VMapCfg.mapCityCode,//,
                Date: basemap.VMapCfg.mapDate,//
                Cnd: ' and SECTOR_ID=\'' + sector + '\''
            },
            success: function (rsl) {

                var header = [
                    {'field': 'NAME', 'title': '项目', 'width': 95},
                    {'field': 'PROPERTY', 'width': 265, 'title': '属性'},
                ]
                var data = [];
                data.push({NAME: '小区名', PROPERTY: rsl[0].SECTOR_ID});
                data.push({NAME: '小区中文名', PROPERTY: rsl[0].SECTOR_NAME});
                data.push({NAME: '设备', PROPERTY: rsl[0].VENDOR});
                data.push({NAME: 'PCI', PROPERTY: rsl[0].PCI});
                data.push({NAME: '频点', PROPERTY: rsl[0].EARFCN});
                data.push({NAME: '经纬度', PROPERTY: rsl[0].LONGITUDE+'° , '+rsl[0].LATITUDE+'°'});
                data.push({NAME: '方向角', PROPERTY: rsl[0].AZIMUTH});
                data.push({NAME: '覆盖类型', PROPERTY: rsl[0].STYLE});
                data.push({NAME: '电子下倾', PROPERTY: rsl[0].ELECTTILT});
                data.push({NAME: '物理下倾', PROPERTY: rsl[0].MECHTILT});
                data.push({NAME: '总下倾', PROPERTY: rsl[0].TOTLETILT});
                data.push({NAME: '天线高度', PROPERTY: rsl[0].HEIGHT});

                commdiv.$worker({
                    elem: 'property-table',
                    fields: header,
                    height:290,
                    data: data,
                    done:function (rsl) {
                    	$('#map-property .layui-table-header').addClass('hide');
                    	$('#map-property .layui-table-cell').css('line-height','15px');
                    	$('#map-property #close-property').hover(function(){
                    		$(this).css('color','red');
                    		$(this).css('cursor','pointer');
                    	},function()
                    	{
                    		$(this).css('color','white');
                    		$(this).css('cursor','');
                    	});
                    	$('#map-property #close-property').click(function(){
                    		$('#map-property').css('display','none');
                    	});
                    	commdiv.$setDragDiv('map-property','my-drag');
                        $('#map-property').css('display', 'block');
                    }
                });
            }
        });
    }
    
    exports.addArrayMenu = AddArrayMenu;
    Object.defineProperty(exports, '__esModule', {value: true});
})));

