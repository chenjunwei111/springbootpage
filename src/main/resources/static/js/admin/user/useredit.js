var usercode;//用户编号，唯一值
var type;//三种类型：add(添加),edit(编辑),look(查看)
var model;//模型，单选树节点模型还是复选框模型

var deptcode;
var deptname;

$(function () {
    var jsobj = GetRequest();
    if (jsobj == null) {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return;
    }
    usercode = jsobj.id;
    type = jsobj.type;

    if (jsobj.type == 'add') {
        setData(null);
    } else if (jsobj.type == 'edit' || jsobj.type == 'select' || jsobj.type == 'info') {
        getData();
        //$('#USER_NAME').attr("readonly",true);
        $('#USER_NAME').attr("disabled",true);
        $('#USER_NAME').addClass('readonly');
    }

    $("#btnSubmit").click(function () {
        submit();
    });
    $("#btnCancel").click(function () {
        //parent.layer.closeAll();
        //关闭本窗口
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });
    $("#btnAddDepartment").click(function () {
        openAddDepartment();
    });

});

function openAddDepartment() {
    $('#txtid').val('');

    parent.layer.open({
        type: 2,
        title: ["部门列表", "font-size:16px"],
        area: ["500px", "500px"],
        anim: 2,
        skin: 'layui-layer-lan',
        maxmin: false,
        id: 'tree',
        resize: false,
        moveType: 1,
        shade: 0,
        scrollbar: false,
        content: 'departmenttree.html?type=isvalid&id=&model=simple&deptcode='+deptcode,
        end: function () {
            //要判断是提交后还是取消后的操作
            var backvalue = parent.window.document.getElementById("txtid").value;
            if (backvalue != null && backvalue != '') {
                deptname = parent.window.document.getElementById("DEPT_NAME").value;
                deptcode = parent.window.document.getElementById("DEPT_CODE").value;
                $('#DEPT_NAME').val(deptname);
            }
        }
    })
}
function submit() {
    console.log($('#hISVALID').val());
    if($('#USER_NAME').val()==null || $('#USER_NAME').val()==''){
        $('#spanmessage').html('用户名不能为空');
        return;
    }
    if( $('#USER_NAME').val().length>20){
        $('#spanmessage').html('用户名长度超过20个字符');
        return;
    }
    if($('#PHONE').val()==null || $('#PHONE').val()==''){
        $('#spanmessage').html('用户号码不能为空');
        return;
    }
    if( $('#PHONE').val().length!=11){
        $('#spanmessage').html('用户号码长度必须为11位');
        return;
    }


    if($('#PASSWORD').val()==null || $('#PASSWORD').val()==''){
        $('#spanmessage').html('密码不能为空');
        return;
    }

    if($('#PASSWORD').val()==="123456" ){
        $('#spanmessage').html('密码过于简单');
        return;
    }



    if( $('#PASSWORD').val().length<4){
        $('#spanmessage').html('密码设置不能低于4位');
        return;
    }
    if( $('#PASSWORD').val().length>20){
        $('#spanmessage').html('密码长度超过20个字符');
        return;
    }
    if($('#DEPT_NAME').val()==null || $('#DEPT_NAME').val()==''){
        $('#spanmessage').html('职能部门不能为空');
        return;
    }
    if( $('#EMAIL').val()!='' && $('#EMAIL').val().length>64 ){
        $('#spanmessage').html('邮箱过长或不符合规范');
        return;
    }

    if(isCellphone($('#PHONE').val())==false){
        $('#spanmessage').html('电话号码过长或不符合规范');
        return;
    }
    var pojo = UsersPojo = {};
    UsersPojo.username = $('#USER_NAME').val();
    UsersPojo.password = $('#PASSWORD').val();
    UsersPojo.phone = $('#PHONE').val();
    UsersPojo.deptcode = deptcode;
    UsersPojo.deptname = deptname;
    UsersPojo.isvalid = $('#hISVALID').val();
    UsersPojo.email = $('#EMAIL').val();
    var url;
    if(type=='edit'){
        UsersPojo.usercode = usercode;
        url= "/userperce/User/editOneUser?";
    }else if(type=='add'){
        url= "/userperce/User/addOneUser?";
    }else if(type=='info'){
        UsersPojo.usercode = usercode;
        url= "/userperce/User/editOneUser?";
    }
    submitData(UsersPojo,url);
}
function submitData(pojo,url){
    $.ajax({
        url: url,
        data: JSON.stringify(pojo),
        method: "POST",
        contentType: 'application/json',
        success: function (res) {
            if (res == 'ok'){
                msg('提交成功');
                setTimeout(function(){
                    parent.window.document.getElementById("txtid").value = "ok";
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                },3000)

            }else{
                $('#spanmessage').html(res);
            }
        }
    });
}

//数据呈现
function getData() {
    var username = $('#txtUserName').val();
    var pojo = PLteSectorPojo = {cellid: usercode}
    var url = "/userperce/User/getOneUser?";
    $.ajax({
        url: url,
        data: JSON.stringify(pojo),
        method: "POST",
        contentType: 'application/json',
        success: function (res) {
            if (res == null){
                setData(null);
            }else{
                setData(res);
            }
        }
    });
    if (type == 'select') {
        $("#btnSubmit").hide();
        $("#btnAddDepartment").hide();
    }
    if (type == 'info') {
        //$('#USER_NAME').attr("readonly",true);
        $('#USER_NAME').attr("disabled",true);
        $('#USER_NAME').addClass('readonly');
        $("#btnAddDepartment").hide();
        $('#ISVALID').attr("disabled",true);
    }
}
layui.use(['layer', 'form'], function () {
    var layer = layui.layer, $ = layui.jquery;
    var form = layui.form;
    form.on('switch(ISVALID)', function (data) {
        var isvalid = data.elem.checked;
        if(isvalid==true||isvalid=='true'){
            $('#hISVALID').val(1);
        }else{
            $('#hISVALID').val(0);
        }
    });
});

function setData(data) {
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer, $ = layui.jquery;
        var form = layui.form;
        if (data == null) {
            $('#USER_NAME').val('');
            $('#PASSWORD').val('');
            $('#DEPT_NAME').val('');
            $('#hISVALID').val(1);
            $('#EMAIL').val('');
            $('#PHONE').val('');
            deptcode = '';
            deptname='';
        } else {
            $('#USER_NAME').val(data.USER_NAME);
            $('#PASSWORD').val(data.PASSWORD);
            $('#DEPT_NAME').val(data.DEPT_NAME);
            deptcode = data.DEPT_CODE;
            deptname=data.DEPT_NAME;
            $('#hISVALID').val(data.ISVALID);
            if (data.ISVALID == 0) {
                $('#ISVALID').removeAttr('checked');
                form.render('checkbox');//强制重绘checkbox
            }
            $('#EMAIL').val(data.EMAIL);
            $('#PHONE').val(data.PHONE);
        }
    });
}


//地址获取参数
function GetRequest() {
    var url = location.search;
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = new Array();
        strs = str.split('&');
        if (strs.length < 3)return null;
        var type1 = strs[0].split('=')[1];
        var id1 = strs[1].split('=')[1];
        var model1 = strs[2].split('=')[1];
        var jsobj = {};
        jsobj.type = type1;
        jsobj.id = id1;
        jsobj.model = model1;
        return jsobj;
    }
}