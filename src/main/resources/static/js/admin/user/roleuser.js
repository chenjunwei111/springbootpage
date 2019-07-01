var id;//用户编号，唯一值
var type;//三种类型：add(添加),edit(编辑),look(查看)
var model;//模型，单选树节点模型还是复选框模型


var ids =new Array();
var ThisPageids=new Array();//该页所有数据（8页）
var AlltotalChecked=new Array();//数据库返回的所有数据

$(function () {


    var jsobj = GetRequest();
    if (jsobj === null) {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return;
    }
    id = jsobj.id;
    type = jsobj.type;

    setProvince();//设置省份

    $('#selectCity').empty();
    $("#selectCity").prepend("<option value='不限' spdb='不限' selected='selected'>--不限--</option>"); //为Select插入一个Option(第一个位置)


    //取消按钮
    $("#btnCancel").click(function () {
        parent.window.document.getElementById("txtid").value="error";
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    //提交按钮
    $("#btnSubmit").click(function () {
        var usercodes = [];
        //将变量合并，将呈现出来的和未呈现出来都合并 去重
        usercodes=(ids.concat(AlltotalChecked)).distinct();
        if(usercodes.length==0){
            //msg('选择的用户个数为：0，请重新选择');
            //询问框
            layer.confirm('当前未选择用户，是否继续？', {
                btn: ['是','否'] //按钮
            }, function(){
                $("#btnSubmit").hide();
                submitData(null);
            }, function(){
            });
            return;
        }

        //询问框
        layer.confirm('选择的用户个数共为：'+usercodes.length+',是否继续？', {
            btn: ['是','否'] //按钮
        }, function(){
            $("#btnSubmit").hide();
            submitData(usercodes);
        }, function(){
        });
    });

    $('#selectProvince').on('change',function(){
        //判断是否选取prompt属性，无返回值；
        var parentDeptCode = $(this).val();
        //var parentDeptCode1 = $("#selectProvince").find("option:selected").attr('spdb');
        setCity(parentDeptCode);
    });

    $('.search').click(function(){
        getData();
    });

});




var removeChecked=new Array();



//表格点击事件~（1个）
layui.use('table', function() {
    var table = layui.table;
    table.on('checkbox(dtUser)', function (obj) {
        var data=obj.data;
        //点击去重
        ids=ids.distinct();
        if(obj.type==="all"){
            //全选控制（遍历当前页变量数据）
            if(obj.checked==true){//勾选
                  for(var i=0;i<ThisPageids.length;i++){
                      ids.push(ThisPageids[i]);//选中的放进 选中变量
                      removeChecked=removeChecked.remove(removeChecked,ThisPageids[i]);//  去除在 取消变量中的值
                  }
            }else {//取消
                for(var i=0;i<ThisPageids.length;i++){
                    ids=remove(ids,ThisPageids[i]);//去除 在选中变量中的值
                    AlltotalChecked=remove(AlltotalChecked,ThisPageids[i]); //去除在全局所有数据中的值
                    removeChecked.push(ThisPageids[i]);//添加到取消变量中的值
                }
            }
        }else{
            //单个勾选
            if(obj.checked==true){//勾选
                ids.push(data.USER_CODE);//添加到 选中变量
                removeChecked=remove(removeChecked,data.USER_CODE);//去除 取消变量
            }else{//取消
                ids=remove(ids,data.USER_CODE);// 去除 选中变量
                AlltotalChecked=remove(AlltotalChecked,data.USER_CODE); //去除 全局所有数据中的值
                removeChecked.push(data.USER_CODE); //添加 到取消变量
            }
        }
        console.log("选中的")
        console.log(ids);

        console.log("点了没选的");
        console.log(removeChecked);
    });

    // table.on('tool(dtUser)', function(obj) {
    //     var data = obj.data;
    //     if (obj.event =='clickUser') {
    //         console.log(obj.data);
    //     }
    // });
});


function submitData(usercodes){
    var url = "/userperce/TROLEUser/insertListRoleUser?";
    var pojo = RoleObjPojo = {roleid:id,vs:usercodes};
    $.ajax({
        url:url,
        data:JSON.stringify(pojo),
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            if(res=="ok"){
                if(usercodes==null||usercodes==''){
                    msg("清空用户成功！");
                }else{
                    msg("添加用户成功！");
                }
                setTimeout(function(){
                    parent.window.document.getElementById("txtid").value="ok";
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                },3000)
            }else{
                msg("添加用户失败！");
            }
        }
    })
}


//数据呈现

var all=0;

function getData()  {
    var prov = $('#selectProvince').val();
    var citycode = $("#selectCity").find("option:selected").attr('spdb');//$('#selectCity').val();
    //prov是省份的拼音,PARENT_DEPT_CODE
    //citycode-->AREA_CODE
    if(prov==null||prov=='')prov='不限';
    if(citycode==null||citycode=='')citycode='不限';
    var pojo=PLteSectorPojo={sectorid:id,citycode:citycode,cellid:prov};
    layui.use('table', function() {
        var  w= $("#dtUser").width()-130;  //求出表格宽度
        var table = layui.table;
        table.render({
            elem: '#dtUser',//html页面绑定的DIV
            url: '/userperce/User/getUserListByCheckBox?',//传POJO后面一定要接（？）号
            method: 'post',
            height: 350, //设定高度，不写默认100%
            page: true, //是否显示分页 （true/false）
            where:{pojo:pojo},//传的对象，已经在底层JSON化。
            sortType:"remote", //默认: "local"或空,排序
            layout:['prev', 'page', 'next','count','limit'],
            limits: [8,40, 100],//可以选择多少数量的数据显示（不分页则无效）
            limit: 8, //每页默认30的数量
            cols: [  //表格表头生成，需要JAVA返回的变量名，以及需要呈现的中文名
                [ //可以指定宽度
                    {checkbox: true,width:w/14,title:'勾选选择用户', event:"clickUser"},
                    {field: 'USER_CODE', title: '用户序列', width:  0,style:"display:none;"},
                    {field: 'USER_NAME', title: '用户名', width:  w/2},
                    {field: 'DEPT_NAME', title: '归属部门', width: w/4},
                    {field: 'ISVALID', title: '是否有效', width:  w/4,toolbar : '#toolIsvalid'}
                ]
            ],
            done:function (res,curr,count) {
                //首次加载 数据库所有选中变量
                if(all==0){
                    all++;
                    var allTotal=res.allTotal;
                    for(var q=0;q<allTotal.length;q++){
                        if(allTotal[q].LAY_CHECKED){
                            AlltotalChecked.push(allTotal[q].USER_CODE);
                        }
                    }
                }

                ThisPageids.length==0;//初始化本页数据
                ids=ids.distinct();//去重选中值

                    //将上一页勾选的在变量，在前端继续呈现勾选状态
                    for(var k=0;k< res.list.length;k++){
                        if(ids.length!=0){
                        for(var j=0;j<ids.length;j++){

                            if(res.list[k].USER_CODE == ids[j])
                            {
                                res.list[k]["LAY_CHECKED"]=true;
                                $('.layui-table-body .layui-table tr[data-index=' + k + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                                continue;
                            }
                        }
                    }
                }

                //遍历将数据库已经勾选的值放入 公共变量
                for(var i=0;i< res.list.length;i++){
                    //遍历这一页的数据
                    ThisPageids.push(res.list[i].USER_CODE);

                    var checkId=res.list[i].LAY_CHECKED;//字段判断数据是否被勾选
                    if(checkId==true){
                        //将上一页取消的在变量，在前端继续呈现取消状态
                        if(removeChecked.length!=0){
                            for(var re=0;re<removeChecked.length;re++){
                                if(removeChecked[re]==res.list[i].USER_CODE){
                                    res.list[i]["LAY_CHECKED"]=null;
                                    $('.layui-table-body .layui-table tr[data-index=' + i + '] input[type="checkbox"]').next().removeClass('layui-form-checked');
                                    continue;
                                }
                            }
                        }
                        else {
                          ids.push(res.list[i].USER_CODE);
                        }
                    }
                }
            }
        });
    });
}



function setProvince(){
    var url = "/userperce/department/getAdminDepartmentByParentDeptCode?parentDeptCode=ROOT";
    $.ajax({
        url:url,
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            $("#selectProvince").empty();
            if(res==null || res.length==0){
                return;
            }
            for(var i=0;i<res.length;i++){
                $("#selectProvince").append("<option value='"+res[i].deptcode+"' spdb='"+res[i].areacode+"'>"+res[i].deptname+"</option>");
            }
            $("#selectProvince").prepend("<option value='不限'  spdb='不限' selected='selected'>--不限--</option>"); //为Select插入一个Option(第一个位置)
            setCity('不限');
            getData();
        }
    })
}

function setCity(parentDeptCode){
    if(parentDeptCode=='不限'){
        $("#selectCity").empty();
        $("#selectCity").prepend("<option value='不限'>--不限--</option>"); //为Select插入一个Option(第一个位置)
        return;
    }
    var url = "/userperce/department/getAdminDepartmentByParentDeptCode?parentDeptCode="+parentDeptCode;
    $.ajax({
        url:url,
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            $("#selectCity").empty();
            if(res==null || res.length==0){
                return;
            }
            for(var i=0;i<res.length;i++){
                $("#selectCity").append("<option value='"+res[i].deptcode+"' spdb='"+res[i].areacode+"'>"+res[i].deptname+"</option>");
            }
            $("#selectCity").prepend("<option value='不限' spdb='不限' selected='selected'>--不限--</option>"); //为Select插入一个Option(第一个位置)
            $("#selectCity").val('不限');
        }
    })
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

//数组去重
Array.prototype.distinct = function (){
    var arr = this,
        i,
        j,
        len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
            if(arr[i] == arr[j]){
                arr.splice(j,1);
                len--;
                j--;
            }
        }
    }
    return arr;
};


//数组去掉某个元素
  function remove(arr,value) {
    var index = this.getIndex(arr,value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};


function getIndex(arr,value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == value) return i;
    }
    return -1;
}

