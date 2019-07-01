$(function () {
    $(".search").click(function () {
        getData();
    });
    $("#btnAdd").click(function () {
        addUser();
    });
    setProvList();
    getData();
});

//点击事件~（1个）
layui.use('table', function() {
    var table = layui.table;
    table.on('tool(dtDepartment)', function (obj) {
        var data = obj.data;
        var areacode = data.AREA_CODE;
        var deptname = data.DEPT_NAME;
        if (obj.event === 'edit') {
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["编辑部门","font-size:16px"],
                area:["500px","540px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'useredit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'departmentedit.html?type=edit&id='+areacode+'&model=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        //$('#txtDeptName').val('')
                        getData();
                    }
                }
            });
        }
        if (obj.event === 'select') {
            $('#txtid').val('');
            layer.open({
                type:2,
                title:["查看部门","font-size:16px"],
                area:["500px","540px"],
                anim:2,
                skin:'layui-layer-lan',
                maxmin:false,
                id:'useredit',
                resize:false,
                moveType:1,
                shade: 0.65,
                scrollbar:false,
                content:'departmentedit.html?type=select&id='+areacode+'&model=',
                end:function(){
                    //要判断是提交后还是取消后的操作
                    if($('#txtid').val()=='ok'){
                        $('#txtDeptName').val('')
                        getData();
                    }
                }
            });
        }
        if (obj.event === 'delete') {
            layer.confirm('是否删除部门：'+deptname+'？', {
                btn: ['是','否'] //按钮
            }, function(){
                deleteDepartment(areacode);
            }, function(){
            });

        }
    });
});


//数据呈现
function getData()  {
    var parentDeptCode = $('#selectProv').val();
    if(parentDeptCode=='不限')parentDeptCode='';
    var deptname = $('#txtDeptName').val();
    var pojo=PLteSectorPojo={sectorid:deptname,cellid:parentDeptCode}
    layui.use('table', function() {
        var  w= $("#dtDepartment").width()-150;  //求出表格宽度
        var table = layui.table;
        table.render({
            elem: '#dtDepartment',//html页面绑定的DIV
            url: '/userperce/department/getDepartmentCnList?',//传POJO后面一定要接（？）号
            method: 'post',
            height: 700, //设定高度，不写默认100%
            page: true, //是否显示分页 （true/false）
            where:{pojo:pojo},//传的对象，已经在底层JSON化。
            sortType:"remote", //默认: "local"或空,排序
            limits: [15,50, 100],//可以选择多少数量的数据显示（不分页则无效）
            limit: 15, //每页默认30的数量
            cols: [  //表格表头生成，需要JAVA返回的变量名，以及需要呈现的中文名
                [ //可以指定宽度
                    {field: 'DEPT_NAME', title: '部门名称', width:  w/5 ,event: 'select', style: 'cursor: pointer;color:#85EFFF;'},
                    {field: 'AREA_CODE', title: '区域编号', width:   w/5 },
                    {field: 'PARENT_DEPT_NAME', title: '归属部门', width:   w/5 },
                    {field: 'ISVALID', title: '是否有效', width:  w/5,toolbar : '#toolIsvalid'},
                    {title: '操作', width: w/5,toolbar : '#toolopt'}
                ]
            ]
        });
    });
}
function setProvList(){
    var url = "/userperce/department/getAdminDepartmentByParentDeptCode?parentDeptCode=ROOT";
    $("#selectProv").empty();
    $.ajax({
        url:url,
        method:"POST",
        success:function (res) {
            console.log(res);
            for(var i=0;i<res.length;i++){
                var option='';
                option = '<option value="'+res[i].deptcode+'" spdb="'+res[i].areacode+'" >'+res[i].deptname+'</option>';
                $("#selectProv").append(option);
            }
            $("#selectProv").prepend("<option value='不限' spdb='不限' selected='selected'>--不限--</option>"); //为Select插入一个Option(第一个位置)
        }
    })
}

//删除部门，只是将isvalid设置为0
function deleteDepartment(areacode){
    var pojo = DepartmentPojo = {areacode:areacode,isvalid:0};
    var url = '/userperce/department/editOneDepartment';
    $.ajax({
        url:url,
        data:JSON.stringify(pojo),
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            console.log(res);
            if(res=="ok"){
                msg("删除部门成功！");
                setTimeout(function(){
                    $('#txtDeptName').val('')
                    getData();
                },3000);
            }else{
                msg("删除部门失败！");
            }
        }
    })
}

function addUser(){
    $('#txtid').val('');
    layer.open({
        type:2,
        title:["新增部门","font-size:16px"],
        area:["500px","540px"],
        anim:2,
        skin:'layui-layer-lan',
        maxmin:false,
        id:'useradd',
        resize:false,
        moveType:1,
        shade: 0.65,
        scrollbar:false,
        content:'departmentedit.html?type=add&id=&model=',
        end:function(){
            //要判断是提交后还是取消后的操作
            if($('#txtid').val()=='ok'){
                $('#txtDeptName').val('')
                getData();
            }
        }
    });
}