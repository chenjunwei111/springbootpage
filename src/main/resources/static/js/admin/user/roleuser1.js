var id;//角色编号，唯一值
var type;//三种类型：add(添加),edit(编辑),look(查看)
var model;//模型，单选树节点模型还是复选框模型
var box;


var ids =new Array();
var ThisPageids=new Array();//该页所有数据（8页）
var AlltotalChecked=new Array();//数据库返回的所有数据

$(function () {

    var jsobj = GetRequest();
    if (jsobj === null && parent!=null && parent.layer!=undefined && parent.layer.getFrameIndex!=undefined) {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return;
    }
    id = jsobj.id;

    //取消按钮
    $("#btnCancel").click(function () {
        parent.window.document.getElementById("txtid").value="error";
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    //提交按钮
    $("#btnSubmit").click(function () {
        var userCodeStr = box.getSelectedOptions()+'';
        var usercodes = [];
        if(userCodeStr!=null && userCodeStr.length>0){
            usercodes = userCodeStr.split(',');
        }

        //将变量合并，将呈现出来的和未呈现出来都合并 去重
        //usercodes=(ids.concat(AlltotalChecked)).distinct();
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

    getData();
});







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
    var pojo=PLteSectorPojo={sectorid:id};
    var url = "/userperce/User/getUserListByDoubleCheckBox?";
    $.ajax({
        url:url,
        data:JSON.stringify(pojo),
        method:"POST",
        contentType: 'application/json',
        success:function (res) {
            if(res!=null && res.length>0){
               var nonSelectedList = [];
                var selectedList = [];
                for(var i=0;i<res.length;i++){
                    var item = {};
                    item.roleId = res[i].USER_CODE;
                    item.roleName = res[i].USER_NAME+"/"+res[i].PHONE+"/"+res[i].DEPT_NAME;
                    if(res[i].LAY_CHECKED==null || res[i].LAY_CHECKED==0 || res[i].LAY_CHECKED=="0"){
                        nonSelectedList.push(item);
                    }else{
                        selectedList.push(item);
                    }
                }
                box = $('.userContainer').doublebox({
                    nonSelectedListLabel: '选择角色',
                    selectedListLabel: '授权用户角色',
                    preserveSelectionOnMove: 'moved',
                    moveOnSelect: false,
                    nonSelectedList:nonSelectedList,
                    selectedList:selectedList,
                    optionValue:"roleId",
                    optionText:"roleName",
                    doubleMove:true,
                });
            }else{

            }
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

