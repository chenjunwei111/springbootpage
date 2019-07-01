//核心方法
//auto 弹出层DIV ，ID标签
//search 搜索框DIV ，ID标签
//date 查询日期
//cityCode  城市编码
//url java后端查询地址      ///spdbweblte/aoa/queryLikeSectorId
//type 类型

var conmmonauto1=null;
var conmmonsearch1=null;
var conmmoncityCode1=null;
var conmmontype1;
var conmmonurl;


var conmmonauto2=null;
var conmmonsearch2=null;
var conmmonur2;
var cityCode2;
var state2;

var conmmonauto3=null;
var conmmonsearch3=null;
var conmmonur3;


var conmmonaut4 = null;
var conmmonsearch4 = null;
var conmmonur4 ;
var cityCode4 ;
var sendTime ;
var sector;

var map2=null;
var MapUrl=null;
var MapautDiv = null;
var MapsearchInput = null;

var conmmonaut5 = null;
var conmmonsearch5 = null;
var conmmonur5=null;

//查询小区ID
function AutoComplete(auto, search,cityCode,type,url) {
    // console.log("auto1:"+auto+" search:"+search+" cityCode:"+cityCode+" type:"+type+" url:"+url);
    conmmonauto1=auto;
    conmmonsearch1=search;
    conmmoncityCode1=cityCode;
    conmmontype1=type;
    conmmonurl=url;
    if ($("#" + search).val() != "") {
        var autoNode = $("#" + auto); //缓存对象（弹出框）
        var carlist = new Array();
        var n = 0;
        var mylist = [];
        var maxTipsCounts = 8 // 最大显示条数
        var highlightindex = -1;   //高亮
        var aj = $.ajax({
            ///spdbweblte/aoa/queryLikeSectorId
            url: url , // 跳转到后台
            data: {sectorId: $("#" +search).val(), date:$(".date").val(), cityCode: cityCode,type:type},
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {

                mylist = data;
                if (mylist == null) {
                    autoNode.hide();
                    return;
                }
                autoNode.empty(); //清空上次的记录
                for (i in mylist) {
                    if (i < maxTipsCounts) {
                        var wordNode = mylist[i].SECTOR_ID; //弹出框里的每一条内容
                        var newDivNode = $("<div>").attr("id", i); //设置每个节点的id值

                        // document.querySelector("#auto_div").style.width = $("#search_text").outerWidth(true)+10+ 'px'; //设置提示框与输入框宽度一致
                        document.querySelector("#"+auto).style.width ='auto';
                        document.querySelector("#"+auto).style.backgroundColor ='#0a4554';
                        document.querySelector("#"+auto).style.color ='black';
                        // document.querySelector("#auto_div").style.z-index =="99999";
                        newDivNode.attr("style", "font:14px/25px arial;height:28px;padding:2px 20px;cursor: pointer;");
                        newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
                        //鼠标移入高亮，移开不高亮
                        newDivNode.mouseover(function() {
                            if (highlightindex != -1) { //原来高亮的节点要取消高亮（是-1就不需要了）
                                autoNode.children("div").eq(highlightindex).css("background-color", "#0a4554");
                            }
                            //记录新的高亮节点索引
                            highlightindex = $(this).attr("id");
                            $(this).css("background-color", "#183851");
                        });
                        newDivNode.mouseout(function() {
                            $(this).css("background-color", "#0a4554");
                        });
                        //鼠标点击文字上屏
                        newDivNode.click(function() {
                            //取出高亮节点的文本内容
                            var comText = autoNode.hide().children("div").eq(highlightindex).text();
                            highlightindex = -1;
                            //文本框中的内容变成高亮节点的内容
                            $("#" + search).val(comText);
                            $("#search-form").submit();
                        })
                        if (mylist.length > 0) { //如果返回值有内容就显示出来
                            autoNode.show();
                        } else { //服务器端无内容返回 那么隐藏弹出框

                            autoNode.hide();
                            //弹出框隐藏的同时，高亮节点索引值也变成-1
                            highlightindex = -1;
                        }
                    }
                }
            }
        });
    }
}

//查询工单流水号
function AutoComplete2(auto,search,cityCode,state,url) {
    conmmonauto2=auto;
    conmmonsearch2=search;
    conmmonur2=url;
    cityCode2=cityCode;
    state2=state;

    if ($("#" + search).val() != "") {
        var autoNode = $("#" + auto); //缓存对象（弹出框）
        var carlist = new Array();
        var n = 0;
        var mylist = [];
        var maxTipsCounts = 8 // 最大显示条数
        var highlightindex = -1;   //高亮
        var aj = $.ajax({
            ///spdbweblte/aoa/queryLikeSectorId
            url: url , // 跳转到后台
            data: {orderNum: $("#" +search).val(),state:state,cityCode:cityCode},
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {

                mylist = data;
                if (mylist == null) {
                    autoNode.hide();
                    return;
                }
                autoNode.empty(); //清空上次的记录
                for (i in mylist) {
                    if (i < maxTipsCounts) {
                        var wordNode = mylist[i].ORDERNUM; //弹出框里的每一条内容
                        var newDivNode = $("<div>").attr("id", i); //设置每个节点的id值

                        // document.querySelector("#auto_div").style.width = $("#search_text").outerWidth(true)+10+ 'px'; //设置提示框与输入框宽度一致
                        document.querySelector("#"+auto).style.width ='auto';
                        document.querySelector("#"+auto).style.backgroundColor ='#0a4554';
                        // document.querySelector("#auto_div").style.z-index =="99999";
                        newDivNode.attr("style", "font:14px/25px arial;height:28px;padding:2px 20px;cursor: pointer;");
                        newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
                        //鼠标移入高亮，移开不高亮
                        newDivNode.mouseover(function() {
                            if (highlightindex != -1) { //原来高亮的节点要取消高亮（是-1就不需要了）
                                autoNode.children("div").eq(highlightindex).css("background-color", "#0a4554");
                            }
                            //记录新的高亮节点索引
                            highlightindex = $(this).attr("id");
                            $(this).css("background-color", "#183851");
                        });
                        newDivNode.mouseout(function() {
                            $(this).css("background-color", "#0a4554");
                        });
                        //鼠标点击文字上屏
                        newDivNode.click(function() {
                            //取出高亮节点的文本内容
                            var comText = autoNode.hide().children("div").eq(highlightindex).text();
                            highlightindex = -1;
                            //文本框中的内容变成高亮节点的内容
                            $("#" + search).val(comText);
                            $("#search-form").submit();
                        })
                        if (mylist.length > 0) { //如果返回值有内容就显示出来
                            autoNode.show();
                        } else { //服务器端无内容返回 那么隐藏弹出框

                            autoNode.hide();
                            //弹出框隐藏的同时，高亮节点索引值也变成-1
                            highlightindex = -1;
                        }
                    }
                }
            }
        });
    }
}

//查询电话号码
function AutoComplete3(auto,search,cityCode,type,url) {
    // console.log("auto3:"+auto+" search:"+search+" cityCode:"+cityCode+" type:"+type+" url:"+url);
    conmmonauto3=auto;
    conmmonsearch3=search;
    conmmonur3=url;
    if ($("#" + search).val() != "") {
        var autoNode = $("#" + auto); //缓存对象（弹出框）
        var carlist = new Array();
        var n = 0;
        var mylist = [];
        var maxTipsCounts = 8 // 最大显示条数
        var highlightindex = -1;   //高亮
        var aj = $.ajax({
            url: url , // 跳转到后台
            data: {phoneNum: $("#" +search).val()},
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {

                mylist = data;
                if (mylist == null) {
                    autoNode.hide();
                    return;
                }
                autoNode.empty(); //清空上次的记录
                for (i in mylist) {
                    if (i < maxTipsCounts) {
                        var wordNode = mylist[i].PHONENUM; //弹出框里的每一条内容
                        var newDivNode = $("<div>").attr("id", i); //设置每个节点的id值

                        // document.querySelector("#auto_div").style.width = $("#search_text").outerWidth(true)+10+ 'px'; //设置提示框与输入框宽度一致
                        document.querySelector("#"+auto).style.width ='auto';
                        document.querySelector("#"+auto).style.backgroundColor ='#0a4554';
                        // document.querySelector("#auto_div").style.z-index =="99999";
                        newDivNode.attr("style", "font:14px/25px arial;height:28px;padding:2px 20px;cursor: pointer;");
                        newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
                        //鼠标移入高亮，移开不高亮
                        newDivNode.mouseover(function() {
                            if (highlightindex != -1) { //原来高亮的节点要取消高亮（是-1就不需要了）
                                autoNode.children("div").eq(highlightindex).css("background-color", "#0a4554");
                            }
                            //记录新的高亮节点索引
                            highlightindex = $(this).attr("id");
                            $(this).css("background-color", "#183851");
                        });
                        newDivNode.mouseout(function() {
                            $(this).css("background-color", "#0a4554");
                        });
                        //鼠标点击文字上屏
                        newDivNode.click(function() {
                            //取出高亮节点的文本内容
                            var comText = autoNode.hide().children("div").eq(highlightindex).text();
                            highlightindex = -1;
                            //文本框中的内容变成高亮节点的内容
                            $("#" + search).val(comText);
                            $("#search-form").submit();
                        })
                        if (mylist.length > 0) { //如果返回值有内容就显示出来
                            autoNode.show();
                        } else { //服务器端无内容返回 那么隐藏弹出框

                            autoNode.hide();
                            //弹出框隐藏的同时，高亮节点索引值也变成-1
                            highlightindex = -1;
                        }
                    }
                }
            }
        });
    }
}


//查询工单流水号
function AutoCompleteOrderNum(auto,search,url) {
    conmmonaut5 = auto;
    conmmonsearch5 = search;
    conmmonur5=url;
    var stateCode = "";//字符串
	$("#orderState option:selected").each(function(){
	    stateCode += $(this).val()+ "','";
	});
	stateCode = stateCode.substring(0,stateCode.length-3);
	
	var orderType = "";//字符串
	$("#orderType option:selected").each(function(){
		orderType += $(this).val()+ "','";
	});
	orderType = orderType.substring(0,orderType.length-3);
	
    var orderNum =  $("#orderNum").val();
    if ($("#" + search).val() != "") {
        var autoNode = $("#" + auto); //缓存对象（弹出框）
        var carlist = new Array();
        var n = 0;
        var mylist = [];
        var maxTipsCounts = 20 // 最大显示条数
        var highlightindex = -1;   //高亮
        var aj = $.ajax({
            ///spdbweblte/aoa/queryLikeSectorId
            url: conmmonur5 , // 跳转到后台
            data: {orderNum:orderNum,state:stateCode,orderType:orderType},
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
            	//;
                mylist = data;
                if (mylist == null) {
                    autoNode.hide();
                    return;
                }
                autoNode.empty(); //清空上次的记录
                for (i in mylist) {
                    if (i < maxTipsCounts) {
                        var wordNode =  mylist[i].ORDERNUM ; //弹出框里的每一条内容
                        var newDivNode = $("<div>").attr("id", i); //设置每个节点的id值

                        // document.querySelector("#auto_div").style.width = $("#search_text").outerWidth(true)+10+ 'px'; //设置提示框与输入框宽度一致
                        document.querySelector("#"+auto).style.width ='auto';
                        document.querySelector("#"+auto).style.backgroundColor ='#0a4554';
                        // document.querySelector("#auto_div").style.z-index =="99999";
                        newDivNode.attr("style", "font:12px/25px arial;height:auto;padding:2px 2px;cursor: pointer;");
                        newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
                        //鼠标移入高亮，移开不高亮
                        newDivNode.mouseover(function() {
                            if (highlightindex != -1) { //原来高亮的节点要取消高亮（是-1就不需要了）
                                autoNode.children("div").eq(highlightindex).css("background-color", "#0a4554");
                            }
                            //记录新的高亮节点索引
                            highlightindex = $(this).attr("id");
                            $(this).css("background-color", "#183851");
                        });
                        newDivNode.mouseout(function() {
                            $(this).css("background-color", "#0a4554");
                        });
                        //鼠标点击文字上屏
                        newDivNode.click(function() {
                            //取出高亮节点的文本内容
                            var comText = autoNode.hide().children("div").eq(highlightindex).text();
                            highlightindex = -1;
                            //文本框中的内容变成高亮节点的内容
                            $("#" + search).val(comText);
                            $("#search-form").submit();
                        })
                        if (mylist.length > 0) { //如果返回值有内容就显示出来
                            autoNode.show();
                        } else { //服务器端无内容返回 那么隐藏弹出框

                            autoNode.hide();
                            //弹出框隐藏的同时，高亮节点索引值也变成-1
                            highlightindex = -1;
                        }
                    }
                }
               
            }
            
            
        });
    }
}


//查询场所
function AutoCompletePlace(auto,search,deptCode, sendTime) {
	//;
	var sector = $("#vDistrictSITE_OCCUPANCY_SECTOR").val();
    conmmonaut4 = auto;
    conmmonsearch4 = search;
    conmmonur4 = '/userperce/pWorkListDistrict/getSelectSector';
    cityCode4 = deptCode;
    sendTime = sendTime;
    sector = sector;
    if ($("#" + search).val() != "") {
        var autoNode = $("#" + auto); //缓存对象（弹出框）
        var carlist = new Array();
        var n = 0;
        var mylist = [];
        var maxTipsCounts = 20 // 最大显示条数
        var highlightindex = -1;   //高亮
        var aj = $.ajax({
            ///spdbweblte/aoa/queryLikeSectorId
            url: conmmonur4 , // 跳转到后台
            data: {sector:sector,cityCode:deptCode,sendTime:sendTime},
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
            	//;
                mylist = data;
                if (mylist == null) {
                    autoNode.hide();
                    return;
                }
                autoNode.empty(); //清空上次的记录
                for (i in mylist) {
                    if (i < maxTipsCounts) {
                        var wordNode =  mylist[i].SECTOR_ID+"("+ mylist[i].SECTOR_NAME+")" ; //弹出框里的每一条内容
                        var newDivNode = $("<div>").attr("id", i); //设置每个节点的id值

                        // document.querySelector("#auto_div").style.width = $("#search_text").outerWidth(true)+10+ 'px'; //设置提示框与输入框宽度一致
                        document.querySelector("#"+auto).style.width ='auto';
                        document.querySelector("#"+auto).style.backgroundColor ='#0a4554';
                        // document.querySelector("#auto_div").style.z-index =="99999";
                        newDivNode.attr("style", "font:12px/25px arial;height:auto;padding:2px 2px;cursor: pointer;");
                        newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
                        //鼠标移入高亮，移开不高亮
                        newDivNode.mouseover(function() {
                            if (highlightindex != -1) { //原来高亮的节点要取消高亮（是-1就不需要了）
                                autoNode.children("div").eq(highlightindex).css("background-color", "#0a4554");
                            }
                            //记录新的高亮节点索引
                            highlightindex = $(this).attr("id");
                            $(this).css("background-color", "#183851");
                        });
                        newDivNode.mouseout(function() {
                            $(this).css("background-color", "#0a4554");
                        });
                        //鼠标点击文字上屏
                        newDivNode.click(function() {
                            //取出高亮节点的文本内容
                            var comText = autoNode.hide().children("div").eq(highlightindex).text();
                            highlightindex = -1;
                            //文本框中的内容变成高亮节点的内容
                            $("#" + search).val(comText);
                            $("#search-form").submit();
                        })
                        if (mylist.length > 0) { //如果返回值有内容就显示出来
                            autoNode.show();
                        } else { //服务器端无内容返回 那么隐藏弹出框

                            autoNode.hide();
                            //弹出框隐藏的同时，高亮节点索引值也变成-1
                            highlightindex = -1;
                        }
                    }
                }
                
                if(isInit == 1){
                	 $("#auto_div").css("display", "none");
                	 isInit = 0;
                }
            }
            
            
        });
    }
}
/*

var highlightindex2 =-1;   //高亮
var keyNum=null;
function AutoCompleteMapAll(auto,search,map,url) {
    MapautDiv = auto;
    MapsearchInput = search;
    map2=map;
    MapUrl=url;
    if ($("#" + search).val() != "") {
        var autoNode = $("#" + auto); //缓存对象（弹出框）
        var carlist = new Array();
        var n = 0;
        var mylist = [];
        var maxTipsCounts = 8 // 最大显示条数
        var highlightindex = -1;   //高亮
        var aj = $.ajax({
            url: url , // 跳转到后台
            contentType: 'application/json',
            data: JSON.stringify(map),
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {

                mylist = data;
                if (mylist == null) {
                    autoNode.hide();
                    return;
                }
                autoNode.empty(); //清空上次的记录

                var keyName=null;
                for(key in mylist[0])
                {
                     keyName=key;
                }
                for (i in mylist) {
                    if (i < maxTipsCounts) {
                        var wordNode = mylist[i][keyName]; //弹出框里的每一条内容

                        var newDivNode = $("<div>").attr("id", i); //设置每个节点的id值

                        // document.querySelector("#auto_div").style.width = $("#search_text").outerWidth(true)+10+ 'px'; //设置提示框与输入框宽度一致
                        document.querySelector("#"+auto).style.width ='auto';
                        document.querySelector("#"+auto).style.backgroundColor ='#0a4554';
                        document.querySelector("#"+auto).style.position ='absolute';
                        document.querySelector("#"+auto).style.zIndex='99999';
                        newDivNode.attr("style", "font:14px/25px arial;height:28px;padding:2px 20px;cursor: pointer;");
                        newDivNode.html(wordNode).appendTo(autoNode); //追加到弹出框
                        //鼠标移入高亮，移开不高亮
                        newDivNode.mouseover(function() {
                            if (highlightindex != -1) { //原来高亮的节点要取消高亮（是-1就不需要了）
                                autoNode.children("div").eq(highlightindex).css("background-color", "#0a4554");
                            }
                            //记录新的高亮节点索引
                            highlightindex = $(this).attr("id");
                            $(this).css("background-color", "#183851");
                        });
                        newDivNode.mouseout(function() {
                            $(this).css("background-color", "#0a4554");
                        });
                        //鼠标点击文字上屏
                        newDivNode.click(function() {
                            //取出高亮节点的文本内容
                            var comText = autoNode.hide().children("div").eq(highlightindex).text();
                            highlightindex = -1;
                            //文本框中的内容变成高亮节点的内容
                            $("#" + search).val(comText);
                            $("#search-form").submit();
                        })
                        if (mylist.length > 0) { //如果返回值有内容就显示出来
                            autoNode.show();
                        } else { //服务器端无内容返回 那么隐藏弹出框

                            autoNode.hide();
                            //弹出框隐藏的同时，高亮节点索引值也变成-1
                            highlightindex = -1;
                        }
                    }
                }
            }
        });
    }


    $("#"+MapsearchInput).keyup(function(event) {
        //处理键盘操作
        var myEvent = event || window.event;
        var keyCode = myEvent.keyCode;
        if (keyCode == 38 || keyCode == 40) {
            if (keyCode == 38) { //向上
                var autoNodes = $("#"+MapautDiv).children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex2).css("background-color", "#0a4554");
                    highlightindex2--;
                } else {
                    highlightindex2 = autoNodes.length - 1;
                }
                if (highlightindex2 == -1) {
                    highlightindex2 = autoNodes.length - 1;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
            if (keyCode == 40) { //向下
                var autoNodes = $("#"+MapautDiv).children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex2).css("background-color", "#0a4554");
                }
                highlightindex2++;
                if (highlightindex2 == autoNodes.length) {
                    highlightindex2 = 0;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
        } else if (keyCode == 13) { //回车键
            if (highlightindex2 != -1) {
                var comText = $("#"+MapautDiv).hide().children("div").eq(highlightindex2).text();

                highlightindex2 = -1;
                $("#"+MapsearchInput).val(comText);
                if ($("#"+MapautDiv).is(":visible")) {
                    $("#"+MapautDiv).css("display", "none");
                }
            }

        } else {
            if ($("#"+MapsearchInput).val() == "") {
                $("#auto_div").hide();
            } else {   //有文字输入时获取提示词
                if(map2!=""||map2!=null){
                    var numValue="";
                    for(key in map2){
                        numValue=key;
                        break;
                    }
                    map2[numValue]=$("#"+MapsearchInput).val();
                    if(keyNum==null || keyNum!=$("#"+MapsearchInput).val()){
                        keyNum=$("#"+MapsearchInput).val();
                        AutoCompleteMapAll(MapautDiv,MapsearchInput,map2,MapUrl);
                    }
                }
            }
        }
    });

};


*/




//点击屏幕 -框消失
document.onclick = function(e) {
    var e = e ? e : window.event;
    var tar = e.srcElement || e.target;
    if (tar.id != "search_text") {
        if ($("#auto_div").is(":visible")) {
            $("#auto_div").css("display", "none")
        }
    }
    if (tar.id != "search_text2") {
        if ($("#auto_div2").is(":visible")) {
            $("#auto_div2").css("display", "none")
        }
    }
    
    if (tar.id != MapsearchInput) {
        if ($("#"+MapautDiv).is(":visible")) {
            $("#"+MapautDiv).css("display", "none");
        }
    }
    
    if (tar.id != "orderNum") {
        if ($("#auto_div2").is(":visible")) {
            $("#auto_div2").css("display", "none");
        }
    }
}

//键盘操作事件
$(function() {
    //键盘操作
    var highlightindex =-1;   //高亮
    $("#search_text").keyup(function(event) {
        //处理键盘操作
        var myEvent = event || window.event;
        var keyCode = myEvent.keyCode;
        if (keyCode == 38 || keyCode == 40) {
            if (keyCode == 38) { //向上
                var autoNodes = $("#auto_div").children("div");
                if (highlightindex != -1) {
                    autoNodes.eq(highlightindex).css("background-color", "#0a4554");
                    highlightindex--;
                } else {
                    highlightindex = autoNodes.length - 1;
                }
                if (highlightindex == -1) {
                    highlightindex = autoNodes.length - 1;
                }
                autoNodes.eq(highlightindex).css("background-color", "#183851");
            }
            if (keyCode == 40) { //向下
                var autoNodes = $("#auto_div").children("div");
                if (highlightindex != -1) {
                    autoNodes.eq(highlightindex).css("background-color", "#0a4554");
                }
                highlightindex++;
                if (highlightindex == autoNodes.length) {
                    highlightindex = 0;
                }
                autoNodes.eq(highlightindex).css("background-color", "#183851");
            }
        } else if (keyCode == 13) { //回车键
            if (highlightindex != -1) {
                var comText = $("#auto_div").hide().children("div").eq(highlightindex).text();

                highlightindex = -1;
                $("#search_text").val(comText);
                if ($("#auto_div").is(":visible")) {
                    $("#auto_div").css("display", "none")
                }
//                        $("#search-form").submit();
            }

        } else {
            if ($("#search_text").val() == "") {
                $("#auto_div").hide();
            } else {   //有文字输入时获取提示词
                if(conmmonurl!=""||conmmonurl!=null){
                    AutoComplete(conmmonauto1,conmmonsearch1,conmmoncityCode1,conmmontype1,conmmonurl);
                }
                if(conmmonur2!=""||conmmonur2!=null){
                    AutoComplete2(conmmonauto2,conmmonsearch2,cityCode2,state2,conmmonur2);
                }
            }
        }
    });



    var highlightindex2 =-1;   //高亮
    $("#search_text2").keyup(function(event) {
        //处理键盘操作
        var myEvent = event || window.event;
        var keyCode = myEvent.keyCode;
        if (keyCode == 38 || keyCode == 40) {
            if (keyCode == 38) { //向上
                var autoNodes = $("#auto_div2").children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex).css("background-color", "#0a4554");
                    highlightindex2--;
                } else {
                    highlightindex2 = autoNodes.length - 1;
                }
                if (highlightindex2 == -1) {
                    highlightindex2 = autoNodes.length - 1;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
            if (keyCode == 40) { //向下
                var autoNodes = $("#auto_div2").children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex2).css("background-color", "#0a4554");
                }
                highlightindex2++;
                if (highlightindex2 == autoNodes.length) {
                    highlightindex2 = 0;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
        } else if (keyCode == 13) { //回车键
            if (highlightindex2 != -1) {
                var comText = $("#auto_div2").hide().children("div").eq(highlightindex2).text();

                highlightindex2 = -1;
                $("#search_text").val(comText);
                if ($("#auto_div2").is(":visible")) {
                    $("#auto_div2").css("display", "none");
                }
//                        $("#search-form").submit();
            }

        } else {
            if ($("#search_text2").val() == "") {
                $("#auto_div2").hide();
            } else {   //有文字输入时获取提示词
                if(conmmonur3!=""||conmmonur3!=null){
                    AutoComplete3(conmmonauto3,conmmonsearch3,null,null,conmmonur3);
                }
            }
        }
    });
    
    
    
    var highlightindex2 =-1;   //高亮
    $("#vDistrictSITE_OCCUPANCY_SECTOR").keyup(function(event) {
    	//;
        //处理键盘操作
        var myEvent = event || window.event;
        var keyCode = myEvent.keyCode;
        if (keyCode == 38 || keyCode == 40) {
            if (keyCode == 38) { //向上
                var autoNodes = $("#auto_div").children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex).css("background-color", "#0a4554");
                    highlightindex2--;
                } else {
                    highlightindex2 = autoNodes.length - 1;
                }
                if (highlightindex2 == -1) {
                    highlightindex2 = autoNodes.length - 1;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
            if (keyCode == 40) { //向下
                var autoNodes = $("#auto_div").children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex2).css("background-color", "#0a4554");
                }
                highlightindex2++;
                if (highlightindex2 == autoNodes.length) {
                    highlightindex2 = 0;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
        } else if (keyCode == 13) { //回车键
            if (highlightindex2 != -1) {
                var comText = $("#auto_div").hide().children("div").eq(highlightindex2).text();

                highlightindex2 = -1;
                $("#vDistrictSITE_OCCUPANCY_SECTOR").val(comText);
                if ($("#auto_div").is(":visible")) {
                    $("#auto_div").css("display", "none");
                }
//                        $("#search-form").submit();
            }

        } else {
        	//;
            if ($("#vDistrictSITE_OCCUPANCY_SECTOR").val() == "") {
                $("#auto_div").hide();
            } else {   //有文字输入时获取提示词
                if(conmmonur4!=""||conmmonur4!=null){
                	 AutoCompletePlace(conmmonaut4,conmmonsearch4,cityCode4, sendTime);
                }
            }
        }
    });
});

    
    var highlightindex2 =-1;   //高亮
    $("#orderNum").keyup(function(event) {
    	//;
        //处理键盘操作
        var myEvent = event || window.event;
        var keyCode = myEvent.keyCode;
        if (keyCode == 38 || keyCode == 40) {
            if (keyCode == 38) { //向上
                var autoNodes = $("#auto_div2").children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex).css("background-color", "#0a4554");
                    highlightindex2--;
                } else {
                    highlightindex2 = autoNodes.length - 1;
                }
                if (highlightindex2 == -1) {
                    highlightindex2 = autoNodes.length - 1;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
            if (keyCode == 40) { //向下
                var autoNodes = $("#auto_div2").children("div");
                if (highlightindex2 != -1) {
                    autoNodes.eq(highlightindex2).css("background-color", "#0a4554");
                }
                highlightindex2++;
                if (highlightindex2 == autoNodes.length) {
                    highlightindex2 = 0;
                }
                autoNodes.eq(highlightindex2).css("background-color", "#183851");
            }
        } else if (keyCode == 13) { //回车键
            if (highlightindex2 != -1) {
                var comText = $("#auto_div2").hide().children("div").eq(highlightindex2).text();

                highlightindex2 = -1;
                $("#orderNum").val(comText);
                if ($("#auto_div2").is(":visible")) {
                    $("#auto_div2").css("display", "none");
                }
//                        $("#search-form").submit();
            }

        } else {
        	//;
            if ($("#orderNum").val() == "") {
                $("#auto_div2").hide();
            } else {   //有文字输入时获取提示词
                if(conmmonur5!=""||conmmonur5!=null){
                	AutoCompleteOrderNum(conmmonaut5,conmmonsearch5,conmmonur5);
                }
            }
        }
    });
    
    
    
    
