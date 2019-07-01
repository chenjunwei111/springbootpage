//依赖于jquery-3.1.1  bootstrap.js
function  addTree(data,selectorid,callback) {
    tree(data,selectorid);
    settree(callback);
}

function tree(data,selectorid) {
    if($('.tree').length==0) {
        $("#" + selectorid).append(
            "<div class=\"tree\" style='left:2px'>\n" +
            "\n" +
            "    <ul id=\"root-tree\">\n" +
            "\n" +
            "    </ul>\n" +
            "</div>"
        );
        // $("#" + selectorid).css("overflow-y", "auto");
        // $("#" + selectorid).css("overflow-x", "auto");
    }

    // if($(".tree:has(ul)").length>0)
    // {
    //     $('.tree ul').attr("id","root-tree");
    //     console.log($('.tree ul').attr("id")
    //     );
    // }
    // else
    // {
    //     $('.tree').append("<ul id='root-tree'></ul>");
    //     console.log( $('.tree ul'));
    // }
    for (var i = 0; i < data.length; i++) {
        var data2 = data[i];
        if (data[i].icon == "tree-icon-level-th") {
            $("#root-tree").append("<li data-name='" + data[i].code + "'><span><i class='" + data[i].icon + "'  id='" + data[i].code + "'></i> " + data[i].name + "</span></li>");
        } else {
            var children = $("li[data-name='" + data[i].parentCode + "']").children("ul");
            if (children.length == 0) {
                $("li[data-name='" + data[i].parentCode + "']").append("<ul></ul>")
            }
            $("li[data-name='" + data[i].parentCode + "'] > ul").append(
                "<li data-name='" + data[i].code + "'>" +
                "<span>" +
                "<i class='" + data[i].icon + "' id='" + data[i].code + "'></i> " +
                data[i].name +
                "</span>" +
                "</li>")
        }
        for (var j = 0; j < data[i].child.length; j++) {
            var child = data[i].child[j];
            var children = $("li[data-name='" + child.parentCode + "']").children("ul");
            if (children.length == 0) {
                $("li[data-name='" + child.parentCode + "']").append("<ul></ul>")
            }
            $("li[data-name='" + child.parentCode + "'] > ul").append(
                "<li data-name='" + child.code + "'>" +
                "<span>" +
                "<i class='" + child.icon + "' id='" + child.code + "'></i> " +
                child.name +
                "</span>" +
                "</li>")
            var child2 = data[i].child[j].child;
            tree(child2)
        }
        tree(data[i]);
    }
}

     function settree(_callback) {
        $('.tree li:has(ul)').addClass('parent_li');
        $("i[class^='tree-icon-level-']").attr("title","关闭");
        $('.tree-icon-view-close-sign').attr("title","显示");
        $('.tree-icon-view-open-sign').attr("title","隐藏");
        $('.tree li.parent_li > span>i').on('click', function (e) {
            var children = $(this).parent('span').parent('li.parent_li').find(' > ul > li');
            if (children.is(":visible")) {
                children.hide('fast');
                $(this).attr('title', '展开').addClass('tree-icon-level-plus-sign').removeClass('tree-icon-level-minus-sign');
            } else {
                children.show('fast');
                $(this).attr('title', '关闭').addClass('tree-icon-level-minus-sign').removeClass('tree-icon-level-plus-sign');
            }
            e.stopPropagation();
        });
        $("i[class^='tree-icon-view-']").on('click',function (e) {
            // var code=$('.'+e.target.id).closest('li').attr('data-name');
            if($(this).prop("className")=="tree-icon-view-open-sign")
            {
                $(this).addClass('tree-icon-view-close-sign').removeClass('tree-icon-view-open-sign').attr("title","显示");
            }
            else if($(this).prop("className")=="tree-icon-view-close-sign")
            {
                $(this).addClass('tree-icon-view-open-sign').removeClass('tree-icon-view-close-sign').attr("title","隐藏");
            }
            if(_callback&&typeof _callback=='function') {
                _callback(e.target.id);
            }
            e.stopPropagation();
        });
    };