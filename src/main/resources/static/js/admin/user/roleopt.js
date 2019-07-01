$(function () {
    $(".search").click(function () {
        getData();
    });
    $("#btnAdd").click(function () {
        addRole();
    });
    getData();
});



//点击事件~（1个）
layui.use('table', function() {
    var table = layui.table;
    table.on('tool(dtRole)', function (obj) {
        var data = obj.data;
        var roleid = data.ROLE_ID;
        var rolename = data.ROLE_NAME;
        if (obj.event === 'edit') {
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["编辑角色","font-size:16px"],
                area:["500px","350px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'roleedit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'roleedit.html?type=edit&id='+roleid+'&model=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtRoleName').val('')
                        getData();
                    }
                }
            });
        }
        if (obj.event === 'select') {
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["查看角色","font-size:16px"],
                area:["500px","365px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'roleedit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'roleedit.html?type=select&id='+roleid+'&model=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtRoleName').val('')
                        getData();
                    }
                }
            });
        }

        if (obj.event === 'delete') {
            layer.confirm('是否删除角色：'+rolename+'？', {
                btn: ['是','否'] //按钮
            }, function(){
                deleteRole(roleid);
            }, function(){
            });
        }

        if (obj.event === 'adduser') {//角色-->添加用户
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["添加用户","font-size:16px"],
                area:["1000px","426px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'roleuser',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'roleuser1.html?type=edit&id='+roleid+'&model=checkbox',//'roleuser.html?type=edit&id='+roleid+'&model=checkbox',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtRoleName').val('')
                        getData();
                    }
                }
            });
        }

        if (obj.event === 'addfunction') {//角色-->添加功能
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["添加功能","font-size:16px"],
                area:["500px","500px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'tree',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'functiontree.html?type=edit&id='+roleid+'&model=checkbox',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtRoleName').val('')
                        getData();
                    }
                }
            });
        }

        if (obj.event === 'adddepartment') {//角色-->添加部门
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["数据查看权限","font-size:16px"],
                area:["500px","500px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'useredit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'departmenttree.html?type=isvalid&id='+roleid+'&model=checkbox&deptcode=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtRoleName').val('')
                        getData();
                    }
                }
            });
        }
    });
});


//数据呈现
function getData()  {
    var rolename = $('#txtRoleName').val();
    var pojo=PLteSectorPojo={sectorid:rolename}
    layui.use('table', function() {
        var  w= $("#dtRole").width()-150;  //求出表格宽度
        var table = layui.table;
        table.render({
            elem: '#dtRole',//html页面绑定的DIV
            url: '/userperce/Trole/getRoleList?',//传POJO后面一定要接（？）号
            method: 'post',
            height: 700, //设定高度，不写默认100%
            page: true, //是否显示分页 （true/false）
            where:{pojo:pojo},//传的对象，已经在底层JSON化。
            sortType:"remote", //默认: "local"或空,排序
            limits: [15,50, 100],//可以选择多少数量的数据显示（不分页则无效）
            limit: 15, //每页默认30的数量
            cols: [  //表格表头生成，需要JAVA返回的变量名，以及需要呈现的中文名
                [ //可以指定宽度
                    {field: 'ROLE_NAME', title: '角色名', width:  w/6,event: 'select', style: 'cursor: pointer;color:#85EFFF;' },
                    {field: 'ISVALID', title: '是否有效', width:  w/6,toolbar : '#toolIsvalid'},
                    {field: 'DESCRIPTION', title: '功能描述', width: w/6},
                    {title: '操作', width: w/2,toolbar : '#toolopt'}
                ]
            ]
        });
    });
}

//删除角色
function deleteRole(roleid){
    var pojo = TrolePojo = {roleid:roleid,isvalid:0};
    var url = '/userperce/Trole/editOneRole';
    $.ajax({
        url:url,
        data:JSON.stringify(pojo),
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            console.log(res);
            if(res=="1"){
                msg("删除用户成功！");
                setTimeout(function(){
                    //$('#txtRoleName').val('')
                    getData();
                },3000);
            }else{
                msg("删除用户失败！");
            }
        }
    })
}

function addRole(){
    $('#txtid').val('');
    layer.open({
        type:2,
        title:["新增角色","font-size:16px"],
        area:["500px","365px"],
        anim:2,
        skin:'layui-layer-lan',
        maxmin:false,
        id:'useradd',
        resize:false,
        moveType:1,
        shade: 0.65,
        scrollbar:false,
        content:'roleedit.html?type=add&id=&model=',
        end:function(){
            //要判断是提交后还是取消后的操作
            if($('#txtid').val()=='ok'){
                msg("新增角色成功！");
                setTimeout(function(){
                    $('#txtRoleName').val('')
                    getData();
                },3000);
            }
        }
    });
}