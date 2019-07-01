(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.commdiv = global.commdiv || {})));
}(this, (function (exports) {
    'use strict';
/*
生成表格
varl={
classname: --类名
classtype: ---类别table table-condensed table-hover table-spriped table-bordered
hrefheader:{headerid:id,title:tips,callback:function}: --链接列
header:[] ---[A,B,C]
data:[[]] ---data[[a,b,c],[d,e,f]]
}
return table
 */
    var addTab =function (varl) {
        if(varl)
        {
            if(varl.classtype)
            {
                var table=document.createElement("table");
                table.setAttribute("class",varl.classtype);
                var thead=document.createElement("thead");
                var tr=document.createElement("tr");
                if(varl.header)
                {
                    $.each(varl.header,function (i,h) {
                        var th=document.createElement("th");
                        th.innerText=h;
                        tr.appendChild(th);
                    })
                }
                thead.appendChild(tr);
                var tbody=document.createElement("tbody");
                var hidx=0;
                if(varl.data)
                {
                    $.each(varl.data,function (i,_data) {
                        hidx=0;
                        var trb=document.createElement("tr");
                        $.each(_data,function (j,v) {
                            var td=document.createElement("td");
                            if(varl.hrefheader&&hidx==varl.hrefheader.headerid) {
                                var a=document.createElement("a");
                                if(typeof  varl.hrefheader.callback ==='function')
                                {
                                    a.setAttribute("href","javascript:void(0)");
                                    a.addEventListener("click",varl.hrefheader.callback);
                                    if(varl.hrefheader.title)
                                    a.setAttribute("title",varl.hrefheader.title);
                                }
                                a.innerText=v;
                                td.appendChild(a);
                            }
                            else {
                                td.innerText = v;
                            }
                            trb.appendChild(td);
                            hidx=hidx+1;
                        });
                        tbody.appendChild(trb);
                    });
                }
                table.appendChild(thead);
                table.appendChild(tbody);
                var divmain=document.createElement("div");
                divmain.setAttribute("class",varl.classname);
                divmain.setAttribute("id",varl.classname+"-id");
                divmain.appendChild(table);
                return divmain;
            }
        }
    }


    /**
     *
     * @param {Object} tabelem {elem:'',fields:[{'field','title','width','sort','event','style'},{}],data:[{}],       ],page:{show:true,limits,limit},skin,clkevt:{idx,name,cbfun},bar:true,commit:fun,del:fun,edit:fun }
     *  event: 'clickName',
     *style: 'cursor: pointer;color:white;'
     *page: true //是否显示分页
     *limits: [5, 7, 10]
     *limit: 5 //每页默认显示的数量
     * skin: 'line',
     * height:300,
     * bar:[{commit:function,text:''}]
     */

    var addTable=function (tabelem) {
        if (!tabelem) {
            return;
        }
        var header = [];
        if (!tabelem.elem)
            return;
        if (tabelem.fields) {
            var i = 0;
            for (; i < tabelem.fields.length; i++) {
                header.push(tabelem.fields[i])
            }
        }
    // <script type="text/html" id="barDemo">
    //         <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看</a>
    //         <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    //         <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
    //         </script>



        //lay-filter="DateTable1" lay-data="{id: 'DateTable1'}"
        if (tabelem.clkevt) {
            header[tabelem.clkevt.idx].event = tabelem.clkevt.name;
            $('#'+tabelem.elem).attr('lay-filter',tabelem.elem);
            $('#'+tabelem.elem).attr('lay-data',"{id:'"+tabelem.elem+"'}");

            layui.use('table', function () {
                var table = layui.table;
                table.on('tool('+tabelem.elem+')', function (obj) {
                    if (obj.event === tabelem.clkevt.name) {
                        if (tabelem.clkevt.cbfun && typeof tabelem.clkevt.cbfun == 'function') {
                            tabelem.clkevt.cbfun(obj.data)
                        }
                    }
                   else if(obj.event === 'commit'){
                        if (tabelem.commit && typeof tabelem.commit == 'function') {
                            tabelem.commit(obj)
                        }
                    } else if(obj.event === 'del'){
                            if (tabelem.del && typeof tabelem.del == 'function') {
                                tabelem.del(obj)
                            }
                    } else if(obj.event === 'edit'){
                        if (tabelem.edit && typeof tabelem.edit == 'function') {
                            tabelem.edit(obj)
                        }
                    }
                });
            });
        }
        var data = [];
        if (tabelem.data) {
            var i = 0;
            for (; i < tabelem.data.length; i++) {
                data.push(tabelem.data[i])
            }
        }
        var json = {
            elem: '#'+tabelem.elem,
            cols: [header],
            data: data,
            even: true,
            id:tabelem.elem+'_cache',
            //,page: true //是否显示分页
            //,limits: [5, 7, 10]
            //,limit: 5 //每页默认显示的数量
        }

        // if(tabelem.bar)
        // {
        //     bar:[{commit:function,text:''}]
        // }

            if (tabelem.page && tabelem.page.show == true) {
            json.page = true;
            json.limits = tabelem.page.limits || [5, 7, 10];
            json.limit = tabelem.page.limit || 5;
        }
        if(tabelem.height)
        {
            json.height=tabelem.height;
        }
        if(tabelem.done)
        {
            json.done=tabelem.done;
        }
        var  table;
        layui.use('table', function () {
              table = layui.table;
           var tab= table.render(
                json
            )
            $('.layui-table[lay-even] tr:nth-child(even)').css('background-color','transparent');
            if(tabelem.table&&typeof tabelem.table=='function')
            {
                tabelem.table(table);
            }

        })
        return table;
            // .layui-table[lay-even] tr:nth-child(even){
            // background-color: transparent;
       // }
    }



    /*
    生成可折叠panel-group
    varl=[{
    classname: xxxx
    classtype: panel-default panel-success panel-info panel-warning panel-primary panel-inverse panel-danger panel-link
    isView:true false  是否默认打开
    headertext: text
    data: xxx div text
    }]
     */
    var addPanel=function (varl) {
     var div=document.createElement("div");
     div.setAttribute("class","panel-group");
     div.setAttribute("id","accordion");
     if(varl)
     {
       //  console.log(Object.prototype.toString.call(varl[0].data));
         $.each(varl,function (i,item) {
             var panel=document.createElement("div");
             panel.setAttribute("class","panel "+item.classtype);
             var head=document.createElement("div");
             head.setAttribute("class","panel-heading");
                 head.innerHTML = "<h3 class=\"panel-title\">\n" +
                     "<a data-toggle=\"collapse\" data-parent=\"#accordion\" \n" +
                     "  href=\"#" + item.classname + "\">\n" +
                     "\t\t\t\t\t" + item.headertext + "\n" +
                     "\t\t\t\t</a>\n" +
                     "\t\t\t</h3>";

             var collapse=document.createElement("div");
             if(item.isView)
             {
                 collapse.setAttribute("class","panel-collapse collapse in");// "+ item.isView ? "
             }
             else
             {
                 collapse.setAttribute("class","panel-collapse collapse");// "+ item.isView ? "
             }
             collapse.setAttribute("id",item.classname);
             var classname="panel-body "+item.classname;
             var pbody=document.createElement("div");
             pbody.setAttribute("class","panel-body "+item.classname);
             if(item.data) {
                 var obj=Object.prototype.toString.call(item.data);
                 if (obj.indexOf("[object HTML")>=0
                     ||obj.indexOf("[object Document")>=0) {
                     pbody.appendChild(item.data);
                 }
                 else {
                     pbody.innerText = item.data;
                 }
             }
             else
             {
                 pbody.innerText = "no data";
             }
             collapse.appendChild(pbody);
             panel.appendChild(head);
             panel.appendChild(collapse);
             div.appendChild(panel);
         })
         return div;
     }
    }
/*
div拖动
 */
    var setDragDiv=function (selectorid,handleid) {
        $('#'+selectorid).draggable(
        		{
            //revert : true,        //拖动后是否回到起始位置，boolean类型
            cursor : 'move',       //鼠标拖拽样式，十字，文本等
           handle : handleid?'#'+handleid:'#'+selectorid,//'#'+basemap.VMapCfg.mapID,//句柄，设置后只在设置后只能在当前元素下实现拖拽
            // disabled : false,       //设置是否可以被拖拽
            //  edge : 10,          //设置边界往内多大距离可以实现拖拽
            //axis : 'v',          //设置拖拽方向，v：垂直拖拽，h：水平拖拽
            //proxy: 'clone',        //设置代理元素，使用clone时为复制当前元素
            // deltaX : 10,         //被拖拽元素左上角距离当前光标的X轴方向的距离
            //  deltaY : 10,         //被拖拽元素左上角距离当前光标的Y轴方向的距离  
        });
        
        $('#'+selectorid).mouseover(function ()
        {
            $('#'+selectorid).css("cursor","move");
        });
    }
    
    var addMoveTip=function (msg,selid,pos) {
        $(selid).on('mouseenter',function () {
            tip(msg,selid,pos);
        })
        $(selid).on('mouseleave',function () {
            loadStop();
        })
    }

    /**
     * @param [double] lng
     * @param [double] lat
     * @return {boolean}
     */
   var  chkll=function(lng,lat) {
        var reglng = /^(((\d|[1-9]\d|1[0-7]\d|0)\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/;
        var reglat = /^([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/;
        if (!reglat.test(lat) || !reglng.test(lat)) {
            return false;
        }
        return true;
    }

    /**
     *@description 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
     * @param [object] val
     * @return {boolean}
     */
    var isNumber=function(val){
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)){
            return true;
        }else{
            return false;
        }

    }

    /**
     * @description 校验正负正数就返回true
     * @param [object] val
     * @return {boolean}
     */
   var isIntNum= function (val){
        var regPos = / ^\d+$/; // 非负整数
        var regNeg = /^\-[1-9][0-9]*$/; // 负整数
        if(regPos.test(val) || regNeg.test(val)){
            return true;
        }else{
            return false;
        }
    }

    exports.$table=addTab;
    exports.$panel=addPanel;
    exports.$setDragDiv=setDragDiv;
    exports.$addMoveTip=addMoveTip;
    exports.$worker=addTable;
    exports.$lonlat=chkll;
    exports.$isNum=isNumber;
    exports.$isInt=isIntNum;
    Object.defineProperty(exports, '__esModule', { value: true });
})));