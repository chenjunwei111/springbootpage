/**

 @Name：layui.table 表格操作
 @Author：贤心
 @License：MIT
    
 */
//换行
// var huanhang=function(params){
//     var newParamsName = "";// 最终拼接成的字符串
//     var paramsNameNumber = params.length;// 实际标签的个数
//     var w=document.body.clientWidth
//     if(w<1330){
//         if(paramsNameNumber==5&&params.indexOf("(%)")==2 ){
//             var provideNumber = 5;
//         }else if(paramsNameNumber==5){
//             var provideNumber = 3
//         }else if(paramsNameNumber==9 && params.indexOf("(%)")==6 ){
//             var provideNumber = 5
//         }else if(paramsNameNumber==12){
//             var provideNumber =6
//         }else if(paramsNameNumber>=13){
//             var provideNumber =7
//         }
//         else if(paramsNameNumber>5){
//             console.log(params.indexOf("(%)"))
//             var provideNumber = 4
//         }
//
//     }else{
//         if(paramsNameNumber>=9&&paramsNameNumber<=10){
//             var provideNumber = 5;// 每行能显示的字的个数
//         }else if(paramsNameNumber>10&&paramsNameNumber<12){
//             var provideNumber = 6;// 每行能显示的字的个数
//         }else if(paramsNameNumber==12){
//             var provideNumber = 6;// 每行能显示的字的个数
//         }
//         else if(paramsNameNumber>=13){
//             var provideNumber = 7;// 每行能显示的字的个数
//         }
//         else if(paramsNameNumber==8){
//             var provideNumber =4;// 每行能显示的字的个数
//         }
//         else if(paramsNameNumber==5){
//             var provideNumber = 6;// 每行能显示的字的个数
//         }
//         else {
//             var provideNumber = 4;// 每行能显示的字的个数
//         }
//     }
//     var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
//     /**
//      * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
//      */
//     // 条件等同于rowNumber>1
//     if (paramsNameNumber > provideNumber) {
//         /** 循环每一行,p表示行 */
//         for (var p = 0; p < rowNumber; p++) {
//             var tempStr = "";// 表示每一次截取的字符串
//             var start = p * provideNumber;// 开始截取的位置
//             var end = start + provideNumber;// 结束截取的位置
//             // 此处特殊处理最后一行的索引值
//             if (p == rowNumber - 1) {
//                 // 最后一次不换行
//                 tempStr = params.substring(start, paramsNameNumber);
//             } else {
//                 // 每一次拼接字符串并换行
//                 tempStr = params.substring(start, end) + "<br/>";
//                 // tempStr = params.substring(start, end) + '<br/>';
//             }
//             newParamsName += tempStr;// 最终拼成的字符串
//         }
//     } else {
//         // 将旧标签的值赋给新标签
//         newParamsName = params;
//     }
//     //将最终的字符串返回
//     return newParamsName;
// }


layui.define(['laytpl', 'laypage', 'layer', 'form'], function (exports) {
    "use strict";
    
    var $ = layui.$
        , laytpl = layui.laytpl
        , laypage = layui.laypage
        , layer = layui.layer
        , form = layui.form
        , hint = layui.hint()
        , device = layui.device()

        //外部接口
        , table = {
            config: {
                  checkName: 'LAY_CHECKED' //是否选中状态的字段名
                , indexName: 'LAY_TABLE_INDEX' //下标索引名
            } //全局配置项
            , cache: {} //数据缓存
            , index: layui.table ? (layui.table.index + 10000) : 0

            //设置全局项
            , set: function (options) {
                var that = this;
                that.config = $.extend({}, that.config, options);
                return that;
            }

            //事件监听
            , on: function (events, callback) {
                return layui.onevent.call(this, MOD_NAME, events, callback);
            }
        }

        //操作当前实例
        , thisTable = function () {
            var that = this
                , options = that.config
                , id = options.id;

            id && (thisTable.config[id] = options);

            return {
                reload: function (options) {
                    that.reload.call(that, options);
                }
                , config: options
            }
        }

        //字符常量
        , MOD_NAME = 'table', ELEM = '.layui-table', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'layui-disabled'

        , ELEM_VIEW = 'layui-table-view', ELEM_HEADER = '.layui-table-header', ELEM_BODY = '.layui-table-body', ELEM_MAIN = '.layui-table-main', ELEM_FIXED = '.layui-table-fixed', ELEM_FIXL = '.layui-table-fixed-l', ELEM_FIXR = '.layui-table-fixed-r', ELEM_TOOL = '.layui-table-tool', ELEM_SORT = '.layui-table-sort', ELEM_EDIT = 'layui-table-edit', ELEM_HOVER = 'layui-table-hover'

        //thead区域模板
        , TPL_HEADER = function (options) {
            options = options || {};
            return ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
                , '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
                , '<thead>'
                , '{{# layui.each(d.data.cols, function(i1, item1){ }}'
                , '<tr>'
                , '{{# layui.each(item1, function(i2, item2){ }}'
                , '{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}'
                , '{{# if(item2.fixed === "right"){ right = true; } }}'
                , function () {
                    if (options.fixed && options.fixed !== 'right') {
                        return '{{# if(item2.fixed && item2.fixed !== "right"){ }}';
                    }
                    if (options.fixed === 'right') {
                        return '{{# if(item2.fixed === "right"){ }}';
                    }
                    return '';
                }()
                , '{{# if(item2.checkbox){ }}'
                , '<th data-field="{{ item2.field||i2 }}" data-type="checkbox" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} unresize="true"><div class="layui-table-cell laytable-cell-checkbox"><input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}></div></th>'
                , '{{# } else if(item2.space){ }}'
                , '<th data-field="{{ item2.field||i2 }}" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} unresize="true"><div class="layui-table-cell laytable-cell-space"></div></th>'
                , '{{# } else { }}'
                , '<th data-field="{{ item2.field||i2 }}" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} {{# if(item2.unresize){ }}unresize="true"{{# } }}>'
                , '{{# if(item2.colspan > 1){ }}'
                , '<div class="layui-table-cell laytable-cell-group" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>'
                // , '<span>{{huanhang(item2.title)||""}}</span>'
                , '<span>{{item2.title||""}}</span>'
                , '</div>'
                , '{{# } else { }}'
                , '<div class="layui-table-cell laytable-cell-{{d.index}}-{{item2.field||i2}}" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>'
                // , '<span>{{huanhang(item2.title)||""}}</span>'
                , '<span>{{item2.title||""}}</span>'
                , '{{# if(item2.sort){ }}'
                , '<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>'
                , '{{# } }}'
                , '</div>'
                , '{{# } }}'
                , '</th>'
                , '{{# }; }}'
                , (options.fixed ? '{{# }; }}' : '')
                , '{{# }); }}'
                , '</tr>'
                , '{{# }); }}'
                , '</thead>'
                , '</table>'].join('');
        }

        //tbody区域模板
        , TPL_BODY = ['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" '
            , '{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>'
            , '<tbody></tbody>'
            , '</table>'].join('')

        //主模板
        , TPL_MAIN = ['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">'
            , '{{# var left, right; }}'
            , '<div class="layui-table-header">'
            , TPL_HEADER()
            , '</div>'
            , '<div class="layui-table-body layui-table-main">'
            , TPL_BODY
            , '</div>'

            , '{{# if(left){ }}'
            , '<div class="layui-table-fixed layui-table-fixed-l">'
            , '<div class="layui-table-header">'
            , TPL_HEADER({ fixed: true })
            , '</div>'
            , '<div class="layui-table-body">'
            , TPL_BODY
            , '</div>'
            , '</div>'
            , '{{# }; }}'

            , '{{# if(right){ }}'
            , '<div class="layui-table-fixed layui-table-fixed-r">'
            , '<div class="layui-table-header">'
            , TPL_HEADER({ fixed: 'right' })
            , '<div class="layui-table-mend"></div>'
            , '</div>'
            , '<div class="layui-table-body">'
            , TPL_BODY
            , '</div>'
            , '</div>'
            , '{{# }; }}'

            , '{{# if(d.data.page){ }}'
            , '<div class="layui-table-tool">'
            , '<div class="layui-inline layui-table-page" id="layui-table-page{{d.index}}"></div>'
            , '</div>'
            , '{{# } }}'

            , '<style>'
            , '{{# layui.each(d.data.cols, function(i1, item1){'
            , 'layui.each(item1, function(i2, item2){ }}'
            , '.laytable-cell-{{d.index}}-{{item2.field||i2}}{ width:{{item2.width||50}}px }'
            , '{{# });'
            , '}); }}'
            , '</style>'
            , '</div>'].join('')

        , _WIN = $(window)
        , _DOC = $(document)

        //构造器
        , Class = function (options) {
            var that = this;
            that.index = ++table.index;
            that.config = $.extend({}, that.config, table.config, options);
            that.render();
        };

    //默认配置
    Class.prototype.config = {
        limit: 30 //每页显示的数量
        , loading: true //请求数据时，是否显示loading
    };

    //表格渲染
    Class.prototype.render = function (sets) {
    	
        var that = this, options;

        if (sets) that.config = sets;
        options = that.config;

        options.elem = $(options.elem);
        options.where = options.where || {};

        //请求参数的自定义格式
        options.request = $.extend({
            pageName: 'page'
            , limitName: 'limit'
        }, options.request)

        //响应数据的自定义格式
        options.response = $.extend({
            statusName: 'code'
            , statusCode: 0
            , msgName: 'msg'
            , dataName: 'list'
            , countName: 'total'
        }, options.response)

        if (!options.elem[0]) return that;


        // 表格宽度自适应开始**************************************************
        // var cols_width_count = options.cols[0].length,cols_width_sum = 0 , elem_width = options.width ? options.width :options.elem.parent().width();
        // for(var cols_width = 0 ;cols_width < options.cols[0].length;cols_width++){
        //
        //     if(options.cols[0][cols_width].width){
        //         cols_width_count--,cols_width_sum += options.cols[0][cols_width].width;
        //     }
        // }
        // var cols_width_fix = parseInt((elem_width- 250 - cols_width_sum) / cols_width_count);
        // if(cols_width_fix > 0){
        //     for(cols_width = 0 ;cols_width < options.cols[0].length;cols_width++){
        //         if(!options.cols[0][cols_width].width){
        //             options.cols[0][cols_width].width = cols_width_fix;
        //         }
        //     }
        // }
        // 表格宽度自适应结束


        var othis = options.elem
            , hasRender = othis.next('.' + ELEM_VIEW);

        if (options.height && /^full-\d+$/.test(options.height)) { //full-差距值
            that.fullHeightGap = options.height.split('-')[1];
            options.height = _WIN.height() - that.fullHeightGap;
        }

        //替代元素
        var reElem = that.elem = $(laytpl(TPL_MAIN).render({
            VIEW_CLASS: ELEM_VIEW
            , data: options
            , index: that.index //索引
        }));

        options.index = that.index;

        //生成替代元素
        hasRender[0] && hasRender.remove(); //如果已经渲染，则Rerender
        othis.after(reElem);

        //各级容器
        that.layHeader = reElem.find(ELEM_HEADER);
        that.layMain = reElem.find(ELEM_MAIN);
        that.layBody = reElem.find(ELEM_BODY);
        that.layFixed = reElem.find(ELEM_FIXED);
        that.layFixLeft = reElem.find(ELEM_FIXL);
        that.layFixRight = reElem.find(ELEM_FIXR);
        that.layTool = reElem.find(ELEM_TOOL);

        //设置body区域高度
        if (options.height) {
            that.fullSize();
        }

        //如果多级表头，则填补表头高度
        if (options.cols.length > 1) {
            var th = that.layFixed.find(ELEM_HEADER).find('th');
            th.height(that.layHeader.height() - 1 - parseFloat(th.css('padding-top')) - parseFloat(th.css('padding-bottom')));
        }

        that.pullData(1);
        that.events();
    };

    //表格重载
    Class.prototype.reload = function (options) {
        var that = this;
        that.config = $.extend({}, that.config, options);
        that.render();
    };


    //add by den: 20170901获以服务端数据
    Class.prototype.getSrvData = function (curr, loadIndex, options) {
    	var b=0;
        var that = this
            , request = options.request
            , response = options.response
//            , params = {};

//        params[request.pageName] = curr;
//        params[request.limitName] = options.limit;
        //这里被君威 修改过底层---------------------------------------------------------------
        if(options.where.field==null||options.where.field==undefined||options.where.field==" "){
        	options.where.field="";
        	options.where.sort="";
        }
        $.ajax({
            type: options.method || 'get'
            ,url: options.url + 'pageNo=' + curr + '&pageSize='+options.limit+'&field='+options.where.field+'&sort='+options.where.sort+''//这里被我改了
            ,contentType: 'application/json'
            ,dataType: 'json'
            ,data: JSON.stringify(options.where.pojo)	
            ,success: function (res) {
                if (res[response.statusName] != response.statusCode) {
                    that.renderForm();
                    // add by den: 20170901
                    loadIndex && layer.close(loadIndex);
                    layer.msg((res[response.msgName] || '返回的数据状态异常'), { icon: 6 });
                    //return that.layMain.html('<div class="layui-none">' + (res[response.msgName] || '返回的数据状态异常') + '</div>');
                } else {
                	var a=0;
                	a++;
                    that.renderData(res, curr, res[response.countName]);//数据渲染
                    loadIndex && layer.close(loadIndex);
                    typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
                }
            }
            , error: function (e, m) {
                //that.layMain.html('<div class="layui-none">数据接口请求异常</div>');

                that.renderForm();
                loadIndex && layer.close(loadIndex);

                layer.msg('数据接口请求异常.' + m, { icon: 0 });
            }
        });
    };


    //获得数据
    Class.prototype.pullData = function (curr, loadIndex) {
        var that = this
            , options = that.config
            , request = options.request
            , response = options.response
            , sort = function () {
                if (typeof options.initSort === 'object') {
                    that.sort(options.initSort.field, options.initSort.type);
                }
            };

        if (options.url) { //Ajax请求

            //add by den: 20170901,将getSrvData中的代码单独成一个方法
            that.getSrvData(curr, loadIndex, options);

        } else if (options.data && options.data.constructor === Array) { //已知数据
            var res = {}
                , startLimit = curr * options.limit - options.limit

            res[response.dataName] = options.data.concat().splice(startLimit, options.limit);
            res[response.countName] = options.data.length;
//这里屏蔽sort();
            that.renderData(res, curr, options.data.length), sort();
            typeof options.done === 'function' && options.done(res, curr, res[response.countName]);
        }
    };

    //页码
    Class.prototype.page = 1;

    //遍历表头
    Class.prototype.eachCols = function (callback) {
        layui.each(this.config.cols, function (i1, item1) {
            layui.each(item1, function (i2, item3) {
                callback(i2, item3, [i1, item1]);
            });
        });
    };
    Class.prototype.calcStringPixelsCount = function(str) {
       /* // 字符串字符个数
        var stringCharsCount = str.length * 14;
        return stringCharsCount;
        */        
        // 字符串字符个数
        var stringCharsCount = str.length;
        // 字符串像素个数
        var stringPixelsCount = 0;
        // JS 创建HTML元素：span
        var elementPixelsLengthRuler = document.createElement("span");
        elementPixelsLengthRuler.style.fontSize = 14;  // 设置span的fontsize
        elementPixelsLengthRuler.style.visibility = "hidden";  // 设置span不可见
        elementPixelsLengthRuler.style.display = "inline-block";
        elementPixelsLengthRuler.style.wordBreak = "break-all !important";  // 打断单词
        // 添加span
        document.body.appendChild(elementPixelsLengthRuler);

        for (var i =0; i < stringCharsCount; i++) {
            // 判断字符是否为空格，如果是用&nbsp;替代，原因如下：
            // 1）span计算单个空格字符（ ），其像素长度为0
            // 2）空格字符在字符串的开头或者结果，计算时会忽略字符串
            if (str[i] == " ") {
                elementPixelsLengthRuler.innerHTML = "&nbsp;";
            } else {
                elementPixelsLengthRuler.innerHTML = str[i];
            }

            stringPixelsCount += elementPixelsLengthRuler.offsetWidth;
        }
        elementPixelsLengthRuler.style.display = "none";
        return stringPixelsCount;
        
    };
    Class.prototype.isNumber = function(val){
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)){
            var y = String(val).indexOf(".") + 1;//获取小数点的位置
            var count = String(val).length - y;//获取小数点后的个数
            if(count > 2 && y>0) {
                return true;
            } else {
                return false;
            }
        }else{
            return false;
        }
    };
    //数据渲染
    Class.prototype.renderData = function (res, curr, count, sort) {
    	
    	// console.log(res+"---"+curr+"---"+count+"----"+sort);
    	var that = this
            , options = that.config
            , data = res[options.response.dataName] || []
            , trs = []
            , trs_fixed = []
            , trs_fixed_r = []
            //渲染视图
            , render = function () {
    		//屏蔽
//                if (!sort && that.sortKey) {
//                    return that.sort(that.sortKey.field, that.sortKey.sort, true);
//                }
                layui.each(data, function (i1, item1) {
                	
                    var tds = [], tds_fixed = [], tds_fixed_r = [];
                    if (item1.length === 0) return;
                    if (!sort) {
                        item1[table.config.indexName] = i1;
                    }
                    that.eachCols(function (i3, item3) {
                        var content = item1[item3.field || i3];

                        //var content = item1[item3.field || i3];
                        if (content === undefined || content === null) content = '';

                        if (item3.colspan > 1) return;

                        var td = ['<td data-field="' + (item3.field || i3) + '"' + function () {
                            var attr = [];
                            if (item3.edit) attr.push(' data-edit="true"'); //是否允许单元格编辑
                            if (item3.align) attr.push(' align="' + item3.align + '"'); //对齐方式
                            if (item3.templet) attr.push(' data-content="' + content + '"'); //自定义模板
                            if (item3.toolbar) attr.push(' data-off="true"'); //自定义模板
                            if (item3.event) attr.push(' lay-event="' + item3.event + '"'); //自定义事件
                            if (item3.style) attr.push(' style="' + item3.style + '"'); //自定义样式
                            return attr.join('');
                        }() + '>'
                            , '<div class="layui-table-cell laytable-cell-' + function () {
                                if (item3.checkbox) return 'checkbox';
                                if (item3.space) return 'space'; //间距
                                return options.index + '-' + (item3.field || i3);
                            }() + '">' + function () {
                                if (item3.checkbox) {
                                    return '<input type="checkbox" name="layTableCheckbox" lay-skin="primary" ' + function () {
                                        var checkName = table.config.checkName;
                                        if (item3[checkName]) {
                                            item1[checkName] = item3[checkName];
                                            return item3[checkName] ? 'checked' : '';
                                        }
                                        return item1[checkName] ? 'checked' : '';
                                    }() + '>';
                                }
                                if (item3.toolbar) {
                                    return laytpl($(item3.toolbar).html() || '').render(item1);
                                }

                                if(that.isNumber(content)) {
                                    if (!(item3.field.toUpperCase() == 'LNG' || item3.field.toUpperCase() == 'LAT' || item3.field.toUpperCase() == 'LONGITUDE' || item3.field.toUpperCase() == 'LATITUDE' || item3.field.toUpperCase() == 'UE_X' || item3.field.toUpperCase() == 'UE_Y')) {
                                        content = parseFloat(content).toFixed(2);
                                    }
                                }


                                var str = item3.templet ? laytpl($(item3.templet).html() || String(content)).render(item1) : content;
                                if(that.calcStringPixelsCount(content) > item3.width){
                                	// str = item3.templet ? laytpl($(item3.templet).html() || String(content)).render(item1) : '<span style="width:'+item3.width+'px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="'+content+'">'+content+'</span>';
                                    str = item3.templet ? laytpl($(item3.templet).html() || String(content)).render(item1) : '<span style="width:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="'+content.replace(/，/g,'\n').replace(/,/g,'\n')+'">'+content+'</span>';

                                }
                                return str;
                            }()
                            , '</div></td>'].join('');

                        tds.push(td);
                        if (item3.fixed && item3.fixed !== 'right') tds_fixed.push(td);
                        if (item3.fixed === 'right') tds_fixed_r.push(td);
                    });
                    trs.push('<tr data-index="' + i1 + '">' + tds.join('') + '</tr>');
                    trs_fixed.push('<tr data-index="' + i1 + '">' + tds_fixed.join('') + '</tr>');
                    trs_fixed_r.push('<tr data-index="' + i1 + '">' + tds_fixed_r.join('') + '</tr>');
                });

                that.layBody.scrollTop(0);
                that.layMain.find('tbody').html(trs.join(''));
                that.layFixLeft.find('tbody').html(trs_fixed.join(''));
                that.layFixRight.find('tbody').html(trs_fixed_r.join(''));

                that.renderForm();
                // that.syncCheckAll();
                that.haveInit ? that.scrollPatch() : setTimeout(function () {
                    that.scrollPatch();
                }, 50);
                that.haveInit = true;
            };

        that.key = options.id || options.index;
        table.cache[that.key] = data; //记录数据

        //排序
        if (sort) {
            return render();
        }

        if (data.length === 0) {
            that.renderForm();
            that.layFixed.remove();
            var strUrl=window.location.href;
            var arrUrl=strUrl.split("/");
            var strPage=arrUrl[arrUrl.length-1];
            if(strPage.substring(0,18)=="neighborhooddetail"){
                // console.log(strPage.substring(0,18))
                that.layMain.html('<div class="layui-none"></div>');
                 getQuestion();
                 return ;
            }
            return that.layMain.html('<div class="layui-none">暂无数据</div>');
        }

        render();

        //分页
        if (options.page) {
            that.page = curr;
            that.count = count;
            laypage.render({
                elem: 'layui-table-page' + options.index
                , count: count
                , groups: options.groups || 3
                , limits: options.limits || [10, 20, 30, 40, 50, 60, 70, 80, 90]
                , limit: options.limit
                , curr: curr
                , layout: options.layout || ['prev', 'page', 'next', 'skip', 'count', 'limit']
                , prev: '<i class="layui-icon"></i>'
                , next: '<i class="layui-icon"></i>'
                , theme: options.theme || 'rgb(95, 184, 120)'
                , jump: function (obj, first) {
                    if (!first) {
                        that.page = obj.curr;
                        options.limit = obj.limit;
                        that.pullData(obj.curr, that.loading());
                    }
                }
            });
            that.layTool.find('.layui-table-count span').html(count)
        }
    };

    //渲染表单
    Class.prototype.renderForm = function (type) {
        form.render((type || 'checkbox'), 'LAY-table-' + this.index);
    }

    //客户端: 数据排序(只能针对当前页排序)
    Class.prototype.sort = function (th, type, pull, formEvent) {
        var that = this
            , field
            , config = that.config
            , filter = config.elem.attr('lay-filter')
            , data = table.cache[that.key], thisData;

        //字段匹配
        if (typeof th === 'string') {
            that.layHeader.find('th').each(function (i, item) {
                var othis = $(this)
                    , _field = othis.data('field');
                if (_field === th) {
                    th = othis;
                    field = _field;
                    return false;
                }
            });
        }

        try {
            var field = field || th.data('field');

            //如果欲执行的排序已在状态中，则不执行渲染
            if (that.sortKey && !pull) {
                if (field === that.sortKey.field && type === that.sortKey.sort) {
                    return;
                }
            }

            var elemSort = that.layHeader.find('th .laytable-cell-' + config.index + '-' + field).find(ELEM_SORT);
            that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); //清除其它标题排序状态
            elemSort.attr('lay-sort', type || null);
            that.layFixed.find('th')
        } catch (e) {
            return hint.error('Table modules: Did not match to field');
        }

        //记录排序索引和类型
        that.sortKey = {
            field: field
            , sort: type
        };

        if (type === 'asc') { //升序
            thisData = layui.sort(data, field);
        } else if (type === 'desc') { //降序
            thisData = layui.sort(data, field, true);
        } else { //清除排序
            thisData = layui.sort(data, table.config.indexName);
            delete that.sortKey;
        }

        //调这里函数**************************************************
//        that.renderData({data: thisData}, that.page, that.count);
        that.renderData({data: thisData}, that.page, that.count, true);
        layer.close(that.tipsIndex);

        if (formEvent) {
            layui.event.call(th, MOD_NAME, 'sort(' + filter + ')', {
                field: field
                , type: type
            });
        }
    };


    //服务端: 数据排序
    Class.prototype.srvSort = function (th, type, pull, formEvent) {
        var that = this
            , field
            , config = that.config
            , filter = config.elem.attr('lay-filter')
            , data = table.cache[that.key]
            , thisData;

        //字段匹配
        if (typeof th === 'string') {
            that.layHeader.find('th').each(function (i, item) {
                var othis = $(this)
                    , _field = othis.data('field');
                if (_field === th) {
                    th = othis;
                    field = _field;
                    return false;
                }
            });
        }

        try {
            var field = field || th.data('field');

            //如果欲执行的排序已在状态中，则不执行渲染
            if (that.sortKey && !pull) {
                if (field === that.sortKey.field && type === that.sortKey.sort) {
                    return;
                }
            }

        
            var elemSort = that.layHeader.find('th .laytable-cell-' + config.index + '-' + field).find(ELEM_SORT);
            that.layHeader.find('th').find(ELEM_SORT).removeAttr('lay-sort'); //清除其它标题排序状态
            elemSort.attr('lay-sort', type || null);
            that.layFixed.find('th')
        } catch (e) {
            return hint.error('Table modules: Did not match to field');
        }

        //记录排序索引和类型
        that.sortKey = {
            field: field
            , sort: type
        };

//*******************问题在这里*************************************************
        if (type === 'asc' || type === 'desc') {
            config.where = $.extend(false, {}, config.where, { field: field, sort: type });
            that.getSrvData(that.page, that.loading(), config);

        } else {
            //清除排序
            thisData = layui.sort(data, table.config.indexName);
            delete that.sortKey;
        }

    };


    //请求loading
    Class.prototype.loading = function () {
        var that = this
            , config = that.config;
        if (config.loading && config.url) {
            return layer.msg('<span style="color: black">数据处理中,请稍候...</span>', {
                icon: 16
                //, offset: [
                //    that.layTool.offset().top - 300 - _WIN.scrollTop() + 'px'
                //    , that.layTool.offset().left + that.layTool.width() / 2 - 90 - _WIN.scrollLeft() + 'px'
                //]
                , anim: -1
                , fixed: false
            });
        }
    };

    //同步选中值状态
    Class.prototype.setCheckData = function (index, checked) {
        var that = this
            , config = that.config
            , thisData = table.cache[that.key];
        if (!thisData[index]) return;
        thisData[index][config.checkName] = checked;
    };

    //同步全选按钮状态
    Class.prototype.syncCheckAll = function () {
        var that = this
            , config = that.config
            , checkAllElem = that.layHeader.find('input[name="layTableCheckbox"]')
            , syncColsCheck = function (checked) {
                that.eachCols(function (i, item) {
                    if (item.checkbox) {
                        item[config.checkName] = checked;
                    }
                });
                return checked;
            };

        if (!checkAllElem[0]) return

        if (table.checkStatus(that.key).isAll) {
            if (!checkAllElem[0].checked) {
                checkAllElem.prop('checked', true);
                that.renderForm();
            }
            syncColsCheck(true);
        } else {
            if (checkAllElem[0].checked) {
                checkAllElem.prop('checked', false);
                that.renderForm();
            }
            syncColsCheck(false);
        }
    };

    //获取cssRule
    Class.prototype.getCssRule = function (field, callback) {
        var that = this
            , style = that.elem.find('style')[0]
            , sheet = style.sheet || style.styleSheet
            , rules = sheet.cssRules || sheet.rules;
        layui.each(rules, function (i, item) {
            if (item.selectorText === ('.laytable-cell-' + that.index + '-' + field)) {
                return callback(item), true;
            }
        });
    };

    //尺寸始终铺满
    Class.prototype.fullSize = function () {
        var that = this
            , options = that.config
            , height = options.height, bodyHeight;

        if (that.fullHeightGap) {
            height = _WIN.height() - that.fullHeightGap;
            if (height < 135) height = 135;
            that.elem.css('height', height);
        }


        //tbody区域高度
        if(that.layHeader.height()==0){
            if(that.layHeader[0].innerHTML.indexOf("<br>")>0){
                that.layHeader.height(44);
            }else{
                that.layHeader.height(28);
            }
        }

        //tbody区域高度
        bodyHeight = parseFloat(height) - parseFloat(that.layHeader.height()) - 1;
        if (options.page) {
            bodyHeight = bodyHeight - parseFloat(that.layTool.outerHeight() + 1);
        }
        that.layBody.css('height', bodyHeight);
    };

    //滚动条补丁
    Class.prototype.scrollPatch = function () {
        var that = this
            , scollWidth = that.layMain.width() - that.layMain.prop('clientWidth') //纵向滚动条宽度
            , scollHeight = that.layMain.height() - that.layMain.prop('clientHeight'); //横向滚动条高度
        if (scollWidth && scollHeight) {
            if (!that.elem.find('.layui-table-patch')[0]) {
                var patchElem = $('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>'); //补丁元素
                patchElem.find('div').css({
                    width: scollWidth
                });
                that.layHeader.eq(0).find('thead tr').append(patchElem)
            }
        } else {
            that.layHeader.eq(0).find('.layui-table-patch').remove();
        }
        that.layFixed.find(ELEM_BODY).css('height', that.layMain.height() - scollHeight); //固定列区域高度
        that.layFixRight[scollHeight ? 'removeClass' : 'addClass'](HIDE);
        that.layFixRight.css('right', scollWidth - 1); //操作栏
    };

    //事件处理
    Class.prototype.events = function () {
        var that = this
            , config = that.config
            , _BODY = $('body')
            , dict = {}
            , th = that.layHeader.find('th')
            , resizing
            , ELEM_CELL = '.layui-table-cell'
            , filter = config.elem.attr('lay-filter');

        //拖拽调整宽度    
        th.on('mousemove', function (e) {
            var othis = $(this)
                , oLeft = othis.offset().left
                , pLeft = e.clientX - oLeft;
            if (othis.attr('colspan') > 1 || othis.attr('unresize') || dict.resizeStart) {
                return;
            }
            dict.allowResize = othis.width() - pLeft <= 10; //是否处于拖拽允许区域
            _BODY.css('cursor', (dict.allowResize ? 'col-resize' : ''));
        }).on('mouseleave', function () {
            var othis = $(this);
            if (dict.resizeStart) return;
            _BODY.css('cursor', '');
        }).on('mousedown', function (e) {
            if (dict.allowResize) {
                var field = $(this).data('field');
                e.preventDefault();
                dict.resizeStart = true; //开始拖拽
                dict.offset = [e.clientX, e.clientY]; //记录初始坐标

                that.getCssRule(field, function (item) {
                    dict.rule = item;
                    dict.ruleWidth = parseFloat(item.style.width);
                });
            }
        });
        //拖拽中
        _DOC.on('mousemove', function (e) {
            if (dict.resizeStart) {
                e.preventDefault();
                if (dict.rule) {
                    var setWidth = dict.ruleWidth + e.clientX - dict.offset[0];
                    dict.rule.style.width = setWidth + 'px';
                    layer.close(that.tipsIndex);
                }
                resizing = 1
            }
        }).on('mouseup', function (e) {
            if (dict.resizeStart) {
                dict = {};
                _BODY.css('cursor', '');
                that.scrollPatch();
            }
            if (resizing === 2) {
                resizing = null;
            }
        });

        //排序
        th.on('click', function () {
            var othis = $(this)
                , elemSort = othis.find(ELEM_SORT);

            if (!elemSort[0] || resizing === 1) return resizing = 2;

            var nowType = elemSort.attr('lay-sort')
                , type
                , sortType = config.sortType || 'local';//排序方法: 空或'local':前端排序;'remote':服务端排序

            if (nowType === 'asc') {
                type = 'desc';
            } else if (nowType === 'desc') {
                type = null;
            } else {
                type = 'asc';
            }

            if (sortType == 'remote') {
            	
                //服务端排序
            	that.srvSort(othis, type, null, true);
            } else {
                //客户端排序
                that.sort(othis, type, null, true);
            }

        }).find(ELEM_SORT + ' .layui-edge ').on('click', function (e) {
            var othis = $(this)
                , index = othis.index()
                , field = othis.parents('th').eq(0).data('field')
                , sortType = config.sortType || 'local';//排序方法: 空或local:前端排序;remote:服务端排序

            layui.stope(e);

            if (sortType == 'remote') {
                //服务端排序
                that.srvSort(field, (index === 0 ? 'asc' : 'desc'), null, true);

            } else {
                //客户端排序
                that.sort(field, (index === 0 ? 'asc' : 'desc'), null, true);
            }
            
        });

        //复选框选择
        that.elem.on('click', 'input[name="layTableCheckbox"]+', function () {
            var checkbox = $(this).prev()
                , childs = that.layBody.find('input[name="layTableCheckbox"]')
                , index = checkbox.parents('tr').eq(0).data('index')
                , checked = checkbox[0].checked
                , isAll = checkbox.attr('lay-filter') === 'layTableAllChoose';

            //全选
            if (isAll) {
                childs.each(function (i, item) {
                    item.checked = checked;
                    that.setCheckData(i, checked);
                });
                // that.syncCheckAll();
                that.renderForm();
            } else {
                that.setCheckData(index, checked);
                // that.syncCheckAll();
            }
            layui.event.call(this, MOD_NAME, 'checkbox(' + filter + ')', {
                checked: checked
                , data: table.cache[that.key][index]
                , type: isAll ? 'all' : 'one'
            });
        });

        //行事件
        that.layBody.on('mouseenter', 'tr', function () {
            var othis = $(this)
                , index = othis.index();
            that.layBody.find('tr:eq(' + index + ')').addClass(ELEM_HOVER)
        }).on('mouseleave', 'tr', function () {
            var othis = $(this)
                , index = othis.index();
            that.layBody.find('tr:eq(' + index + ')').removeClass(ELEM_HOVER)
        });

        //单元格编辑
        that.layBody.on('change', '.' + ELEM_EDIT, function () {
            var othis = $(this)
                , value = this.value
                , field = othis.parent().data('field')
                , index = othis.parents('tr').eq(0).data('index')
                , data = table.cache[that.key][index];

            data[field] = value; //更新缓存中的值

            layui.event.call(this, MOD_NAME, 'edit(' + filter + ')', {
                value: value
                , data: data
                , field: field
            });
        }).on('blur', '.' + ELEM_EDIT, function () {
            var templet
                , othis = $(this)
                , field = othis.parent().data('field')
                , index = othis.parents('tr').eq(0).data('index')
                , data = table.cache[that.key][index];
            that.eachCols(function (i, item) {
                if (item.field == field && item.templet) {
                    templet = item.templet;
                }
            });
            othis.siblings(ELEM_CELL).html(
                templet ? laytpl($(templet).html() || this.value).render(data) : this.value
            );
            othis.parent().data('content', this.value);
            othis.remove();
        });

        //单元格事件
        that.layBody.on('click', 'td', function () {
            var othis = $(this)
                , field = othis.data('field')
                , elemCell = othis.children(ELEM_CELL);

            if (othis.data('off')) return;

            //显示编辑框
            if (othis.data('edit')) {
                var input = $('<input class="' + ELEM_EDIT + '">');
                input[0].value = othis.data('content') || elemCell.text();
                othis.find('.' + ELEM_EDIT)[0] || othis.append(input);
                return input.focus();
            }

        //     //如果出现省略，则可查看更多
        //     if (elemCell.prop('scrollWidth') > elemCell.outerWidth()) {
        //         that.tipsIndex = layer.tips([
        //             '<div class="layui-table-tips-main" style="margin-top: -' + (elemCell.height() + 16) + 'px;' + function () {
        //                 if (config.size === 'sm') {
        //                     return 'padding: 4px 15px; font-size: 12px;';
        //                 }
        //                 if (config.size === 'lg') {
        //                     return 'padding: 14px 15px;';
        //                 }
        //                 return '';
        //             }() + '">'
        //             , elemCell.html()
        //             , '</div>'
        //             , '<i class="layui-icon layui-table-tips-c">ဆ</i>'
        //         ].join(''), elemCell[0], {
        //                 tips: [3, '']
        //                 , time: -1
        //                 , anim: -1
        //                 , maxWidth: (device.ios || device.android) ? 300 : 600
        //                 , isOutAnim: false
        //                 , skin: 'layui-table-tips'
        //                 , success: function (layero, index) {
        //                     layero.find('.layui-table-tips-c').on('click', function () {
        //                         layer.close(index);
        //                     });
        //                 }
        //             });
        //     }
        });

        //工具条操作事件
        that.layBody.on('click', '*[lay-event]', function () {
            var othis = $(this)
                , index = othis.parents('tr').eq(0).data('index')
                , tr = that.layBody.find('tr[data-index="' + index + '"]')
                , ELEM_CLICK = 'layui-table-click'
                , data = table.cache[that.key][index];

            layui.event.call(this, MOD_NAME, 'tool(' + filter + ')', {
                data: table.clearCacheKey(data)
                , event: othis.attr('lay-event')
                , tr: tr
                , del: function () {
                    table.cache[that.key][index] = [];
                    tr.remove();
                    that.scrollPatch();
                }
                , update: function (fields) {
                    fields = fields || {};
                    layui.each(fields, function (key, value) {
                        if (key in data) {
                            var templet;
                            data[key] = value;
                            that.eachCols(function (i, item2) {
                                if (item2.field == key && item2.templet) {
                                    templet = item2.templet;
                                }
                            });
                            tr.children('td[data-field="' + key + '"]').children(ELEM_CELL).html(
                                templet ? laytpl($(templet).html() || value).render(data) : value
                            );
                        }
                    });
                }
            });
            tr.addClass(ELEM_CLICK).siblings('tr').removeClass(ELEM_CLICK);
        });

        //同步滚动条
        that.layMain.on('scroll', function () {
            var othis = $(this)
                , scrollLeft = othis.scrollLeft()
                , scrollTop = othis.scrollTop();

            that.layHeader.scrollLeft(scrollLeft);
            that.layFixed.find(ELEM_BODY).scrollTop(scrollTop);

            layer.close(that.tipsIndex);
        });

        _WIN.on('resize', function () { //自适应
            that.fullSize();
            that.scrollPatch();
        });
    };

    //初始化
    table.init = function (filter, settings) {
        settings = settings || {};
        var that = this
            , elemTable = filter ? $('table[lay-filter="' + filter + '"]') : $(ELEM + '[lay-data]')
            , errorTips = 'Table element property lay-data configuration item has a syntax error: ';

        //遍历数据表格
        elemTable.each(function () {
            var othis = $(this), tableData = othis.attr('lay-data');

            try {
                tableData = new Function('return ' + tableData)();
            } catch (e) {
                hint.error(errorTips + tableData)
            }

            var cols = [], options = $.extend({
                elem: this
                , cols: []
                , data: []
                , skin: othis.attr('lay-skin') //风格
                , size: othis.attr('lay-size') //尺寸
                , even: typeof othis.attr('lay-even') === 'string' //偶数行背景
            }, table.config, settings, tableData);

            filter && othis.hide();

            //获取表头数据
            othis.find('thead>tr').each(function (i) {
                options.cols[i] = [];
                $(this).children().each(function (ii) {
                    var th = $(this), itemData = th.attr('lay-data');

                    try {
                        itemData = new Function('return ' + itemData)();
                    } catch (e) {
                        return hint.error(errorTips + itemData)
                    }

                    var row = $.extend({
                        title: th.text()
                        , colspan: th.attr('colspan') //列单元格
                        , rowspan: th.attr('rowspan') //行单元格
                    }, itemData);

                    cols.push(row)
                    options.cols[i].push(row);
                });
            });

            //获取表体数据
            othis.find('tbody>tr').each(function (i1) {
                var tr = $(this), row = {};
                tr.children('td').each(function (i2, item2) {
                    var td = $(this)
                        , field = td.data('field');
                    if (field) {
                        return row[field] = td.html();
                    }
                });
                layui.each(cols, function (i3, item3) {
                    var td = tr.children('td').eq(i3);
                    row[item3.field] = td.html();
                });
                options.data[i1] = row;
            });

            table.render(options);
        });

        return that;
    };

    //表格选中状态
    table.checkStatus = function (id) {
        var nums = 0
            , arr = []
            , data = table.cache[id];
        if (!data) return {};
        //计算全选个数
        layui.each(data, function (i, item) {
            if (item[table.config.checkName]) {
                nums++;
                arr.push(table.clearCacheKey(item));
            }
        });
        return {
            data: arr //选中的数据
            , isAll: nums === data.length //是否全选
        };
    };

    //表格重载
    thisTable.config = {};
    table.reload = function (id, options) {
        var config = thisTable.config[id];
        if (!config) return hint.error('The ID option was not found in the table instance');
        return table.render($.extend({}, config, options));
    };

    //核心入口
    table.render = function (options) {
        var inst = new Class(options);
        return thisTable.call(inst);
    };

    //清除临时Key
    table.clearCacheKey = function (data) {
        data = $.extend({}, data);
        delete data[table.config.checkName];
        delete data[table.config.indexName];
        return data;
    };

    //自动完成渲染
    table.init();

    exports(MOD_NAME, table);
});


//判断数字
function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        var y = String(val).indexOf(".") + 1;//获取小数点的位置
        var count = String(val).length - y;//获取小数点后的个数
        if(count >= 2 && y>0) {
            return true;
        } else {
            return false;
        }
    }else{
        return false;
    }

}