var roleid;//编号，唯一值
var type;//三种类型：add(添加),edit(编辑),look(查看)
var model;//模型，单选树节点模型还是复选框模型

$(function () {
    var jsobj = GetRequest();
    if (jsobj == null) {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return;
    }
    roleid = jsobj.id;
    type = jsobj.type;

    if (jsobj.type == 'add') {
        setData(null);
    } else if (jsobj.type == 'edit' || jsobj.type == 'select') {
        getData();
        //$('#ROLE_NAME').attr("readonly",true);
        $('#ROLE_NAME').attr("disabled",true);
        $('#ROLE_NAME').addClass('readonly');
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

});


function submit() {
    console.log($('#hISVALID').val());
    if ($('#ROLE_NAME').val() == null || $('#ROLE_NAME').val() == '') {
        $('#spanmessage').html('角色名称不能为空');
        return;
    }
    if ($('#ROLE_NAME').val().length > 20) {
        $('#spanmessage').html('角色名称长度超过20个字符');
        return;
    }
    if ($('#DESCRIPTION').val() != '' && $('#DESCRIPTION').val().length > 200) {
        $('#spanmessage').html('功能描述长度超过200个字符');
        return;
    }
    var pojo = TrolePojo = {};

    TrolePojo.rolename = $('#ROLE_NAME').val();
    TrolePojo.description = $('#DESCRIPTION').val();
    TrolePojo.isvalid = $('#hISVALID').val();

    var url;
    if (type == 'edit') {
        TrolePojo.roleid = roleid;
        url = "/userperce/Trole/editOneRole?";
    } else if (type == 'add') {
        url = "/userperce/Trole/addOneRole?";
    }
    submitData(TrolePojo, url);
}
function submitData(pojo, url) {
    $.ajax({
        url: url,
        data: JSON.stringify(pojo),
        method: "POST",
        contentType: 'application/json',
        success: function (res) {
            if (res == 'ok') {
                msg('提交成功');
                setTimeout(function () {
                    parent.window.document.getElementById("txtid").value = "ok";
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                }, 3000)

            }else{
                $('#spanmessage').html(res);
            }
        }
    });
}

//数据呈现
function getData() {
    var pojo = PLteSectorPojo = {cellid: roleid}
    var url = "/userperce/Trole/getOneRole?";
    $.ajax({
        url: url,
        data: JSON.stringify(pojo),
        method: "POST",
        contentType: 'application/json',
        success: function (res) {
            if (res == null) {
                setData(null);
            } else {
                setData(res);
            }
        }
    });
    if (type == 'select') {
        $("#btnSubmit").hide();
        $("#btnAddDepartment").hide();
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
            $('#ROLE_NAME').val('');
            $('#DESCRIPTION').val('');
            $('#hISVALID').val(1);
        } else {
            $('#ROLE_NAME').val(data.ROLE_NAME);
            $('#DESCRIPTION').val(data.DESCRIPTION);
            $('#hISVALID').val(data.ISVALID);
            if (data.ISVALID == 0) {
                $('#ISVALID').removeAttr('checked');
                form.render('checkbox');//强制重绘checkbox
            }
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