$(function () {
    $(".search").click(function () {
        getData();
    });
    $("#btnAdd").click(function () {
        addUser();
    });
    getData();
});



//点击事件~（1个）
layui.use('table', function() {
    var table = layui.table;
    table.on('tool(dtUser)', function (obj) {
        var data = obj.data;
        var userid = data.USER_CODE;
        var username = data.USER_NAME;
        if (obj.event === 'edit') {
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["编辑用户","font-size:16px"],
                area:["500px","500px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'useredit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'useredit.html?type=edit&userid='+userid+'&model=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtUserName').val('')
                        $(".search").click();
                    }
                }
            });

        }
        if (obj.event === 'select') {
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["查看用户","font-size:16px"],
                area:["500px","500px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'useredit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'useredit.html?type=select&userid='+userid+'&model=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        $('#txtUserName').val('')
                        getData();
                    }
                }
            });
        }
        if (obj.event === 'delete') {
            layer.confirm('是否删除用户：'+username+'？', {
                btn: ['是','否'] //按钮
            }, function(){
                deleteUser(userid);
            }, function(){
            });

        }
    });
});


//数据呈现
function getData()  {
    var phone = '';
    var username ='';
    if($("#selectType option:selected").val()=='1'){
        phone = $('#txtUserName').val();
    }else if($("#selectType option:selected").val()=='2'){
        username = $('#txtUserName').val();
    }

    var pojo=PLteSectorPojo={sectorid:phone,city:username}
    layui.use('table', function() {
        var  w= $("#dtUser").width()-150;  //求出表格宽度
        var table = layui.table;
        table.render({
            elem: '#dtUser',//html页面绑定的DIV
            url: '/userperce/User/getUserList?',//传POJO后面一定要接（？）号
            method: 'post',
            height: 700, //设定高度，不写默认100%
            page: true, //是否显示分页 （true/false）
            where:{pojo:pojo},//传的对象，已经在底层JSON化。
            sortType:"remote", //默认: "local"或空,排序
            limits: [15,50, 100],//可以选择多少数量的数据显示（不分页则无效）
            limit: 15, //每页默认30的数量
            cols: [  //表格表头生成，需要JAVA返回的变量名，以及需要呈现的中文名
                [ //可以指定宽度
                    {field: 'PHONE', title: '用户号码', width:  w/6 ,event: 'select', style: 'cursor: pointer;color:#85EFFF;'},
                    {field: 'USER_NAME', title: '用户中文名', width:  w/6 },
                    {field: 'DEPT_NAME', title: '职能部门', width:   w/6 },
                    {field: 'ISVALID', title: '是否有效', width:  w/6,toolbar : '#toolIsvalid'},
                    {field: 'LASTLOGIN', title: '最后一次登录时间', width: w/6},
                    {title: '操作', width: w/6,toolbar : '#toolopt'}
                ]
            ]
        });
    });
}

function deleteUser(userid){
    var pojo = UsersPojo = {usercode:userid};
    var url = '/userperce/User/deleteOneUser?';
    $.ajax({
        url:url,
        data:JSON.stringify(pojo),
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            if(res=='ok'){
                $('#txtUserName').val('')
                getData();
                msg('删除成功');
            }else{
                msg('删除失败');
            }
        }
    })
}

function addUser(){
    $('#txtid').val('');
    layer.open({
        type:2,
        title:["新增用户","font-size:16px"],
        area:["500px","500px"],
        anim:2,
        skin:'layui-layer-lan',
        maxmin:false,
        id:'useradd',
        resize:false,
        moveType:1,
        shade: 0.65,
        scrollbar:false,
        content:'useredit.html?type=add&id=&model=',
        end:function(){
            //要判断是提交后还是取消后的操作
            if($('#txtid').val()=='ok'){
                $('#txtUserName').val('')
                getData();
            }
        }
    });
}