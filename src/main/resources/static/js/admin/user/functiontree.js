var type;
var id;
var model;
var tree;

$(function () {
    var jsobj = GetRequest();
    if(jsobj==null){
        parent.layer.close('tree');
        return;
    }
    type = jsobj.type;
    id = jsobj.id;
    model = jsobj.model;

    $('#treeCheckBox').hide();
    $('#treeSimple').hide();

    if(model=='simple'){
        //$('.title').html('部门列表');
        $('#treeSimple').show();
        loadSampleTree();
    }else if(model=='checkbox'){
        //$('.title').html('部门列表');
        $('#treeCheckBox').show();
        loadCheckBoxTree();
    }
    $("#btnSubmit").click(function () {
        if(model=='checkbox'){
            var oCks = tree.GetChecked(); //这是方法
            var funId = [];
            for (var i = 0; i < oCks.length; i++) {
                funId.push(oCks[i].value);
            }
            var pojo = RoleObjPojo = {roleid:id,vs:funId};
            var url = '/userperce/TROLETfunction/insertListRoidFun';
            $.ajax({
                url:url,
                data:JSON.stringify(pojo),
                method:"POST",
                contentType: 'application/json',
                success:function (res) {
                    console.log(res);
                    if(res=="ok"){
                        msg("添加功能成功！");
                        setTimeout(function(){
                            parent.window.document.getElementById("txtid").value="ok";
                            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                            parent.layer.close(index); //再执行关闭
                        },3000)

                    }else{
                        msg("添加功能失败！");
                    }
                }
            })
        }else{
            parent.window.document.getElementById("txtid").value="ok";
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭
        }
    });
    $("#btnCancel").click(function () {
        parent.window.document.getElementById("txtid").value="error";
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
});

function loadCheckBoxTree(){
    //layui 的 form 模块是必须的
    layui.use(['form'], function () {
        var form = layui.form;

        //3、最完整的参数用法
        tree = new layuiXtree({
            elem: 'treeCheckBox'//必填
            , form: form        //必填
            , data: '/userperce/funcution/getAdminFunctionByCheckBox?roleid='+id//必填
            , isopen: false  //加载完毕后的展开状态，默认值：true
            , ckall: false    //启用全选功能，默认值：false
            , ckallback: function () { } //全选框状态改变后执行的回调函数
            , islinkage:true//是否联动
            , icon: {        //三种图标样式，更改几个都可以，用的是layui的图标
                open: "&#xe7a0;"       //节点打开的图标
                , close: "&#xe622;"    //节点关闭的图标
                , end: "&#xe621;"      //末尾节点的图标
            }
            , color: {       //三种图标颜色，独立配色，更改几个都可以
                open: "rgb(238, 154, 0)"        //节点图标打开的颜色
                , close: "rgb(238, 154, 0)"     //节点图标关闭的颜色
                , end: "rgb(130, 130, 130)"       //末级节点图标的颜色
            }
            , click: function (data) {  //节点选中状态改变事件监听，全选框有自己的监听事件
                //parent.window.document.getElementById("DEPT_NAME").value=data.id;
                //parent.window.document.getElementById("DEPT_CODE").value=data.value;
            },dataBindEnd:function(jsondata){
                console.log(jsondata);
                var node =   tree.GetParent('530100');//云南省默认展开
                $(node).prev().click();
                console.log(node);

            }
        });

        //获取全部[选中的][末级节点]原checkbox DOM对象，返回Array
        //document.getElementById('btn1').onclick = function () {
        //    var oCks = tree.GetChecked(); //这是方法
        //    for (var i = 0; i < oCks.length; i++) {
        //        console.log(oCks[i].value);
        //    }
        //}
    });
}

function loadSampleTree(){
    layui.use(['tree', 'layer', 'form'], function() {
        var layer = layui.layer
            , $ = layui.jquery;
        $.ajax({
            url:'/userperce/funcution/getAdminSmapleFunction?',
            //data:JSON.stringify(pojo),
            method:"POST",
            contentType: 'application/json',
            success:function (data) {
                console.log(data);
                layui.tree({
                    elem: '#treeSimple', //传入元素选择器
                    nodes: data ,
                    click: function(item){ //点击节点回调
                        //layer.msg('当前节名称：'+ item.name + '<br>全部参数：'+ JSON.stringify(item));
                        parent.window.document.getElementById("DEPT_NAME").value=item.name;
                        parent.window.document.getElementById("DEPT_CODE").value=item.id;
                        console.log(item);
                    }
                });
            }
        })
    });
}


//地址获取参数
function GetRequest() {
    var url = location.search;
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = new Array();
        strs = str.split('&');
        if(strs.length<3)return null;
        var type1 = strs[0].split('=')[1];
        var id1 = strs[1].split('=')[1];
        var model1 = strs[2].split('=')[1];
        var jsobj = {};
        jsobj.type = type1;
        jsobj.id = id1;
        jsobj.model =model1;
        return jsobj;
    }
}