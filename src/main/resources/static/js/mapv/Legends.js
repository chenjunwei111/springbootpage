
"user strict";
(function(windows,doc)
{
window.Legends = window.Legends ? window.Legends : {};

function AddLegendPanel(_name,clr) {
    var legends = doc.createElement("div");
    legends.setAttribute("class", "map-legend");
    legends.setAttribute("id", "map-legend-" + _name);
    legends.setAttribute("style", "text-align: center;position: absolute;border-radius: 3px;border:1px solid silver;width: auto;height: auto;right:20px;opacity: 0.85;background: white;display: none;");//bottom:45px;

    doc.querySelector("#" + basemap.VMapCfg.mapSelector).appendChild(legends);

    var label = doc.createElement("label");
    label.setAttribute("class", "map-legend-label");
    label.setAttribute("style", "font-size:10px;margin-bottom:1px");
    label.innerText = "图例";
    legends.appendChild(label);

    var line = doc.createElement("div");
    line.setAttribute("class", "map-legend-line");
    line.setAttribute("style", "border-bottom:1px solid #efefef;width:93.5%;margin-top:2px;margin-bottom:4px;");
    legends.appendChild(line);

    for (var l = 0; l < clr.length; l++) {
        var span = doc.createElement("div");
        span.setAttribute("class", "map-legend-span");
        span.setAttribute("id", "map-legend-span-" + l);
        span.setAttribute("style", "display: block")
        var div = doc.createElement("div");
        div.setAttribute("class", "map-legend-style");
        div.setAttribute("style", "float:left;width: 15px;height: 15px;border: 0px solid darkblue;border-radius: 9px;background:" + "#" + clr[l].style + ";margin-left:5px;margin-top:3px");

        //span.innerHTML="<div class='style-div' style='width: 18px;height: 18px;border: 0px solid darkblue;border-radius: 9px;background:red;display: block;\'> </div> "+"lengend_"+l;
        var txt = doc.createElement("div");
        txt.setAttribute("class", "map-legend-text");
        txt.setAttribute("style", "margin-left:35px;height:20px; font:default;text-align: left;margin-right:5px");
        txt.innerText = clr[l].text;

        span.appendChild(div);
        span.appendChild(txt);
        legends.appendChild(span);

        if (clr[l].tip) {
            commdiv.$addMoveTip(clr[l].tip, "#map-legend-span-" + l, 4);
        }
    }
    var ls = doc.querySelectorAll(".map-legend");
    var h = 0;
    if (ls.length > 0) {
        for (var l = 0; l < ls.length; l++) {
            if (ls[l].id == "map-legend-" + _name)
                continue;
            h = h + ls[l].offsetHeight + 5;//设为auto 取得高度
        }
    }
    legends.style.bottom = h + 45 + "px";
    return legends;
}

/*
增加图例
name  stylemap.styleName
text 标头
clritem text-图例描述 style-图例颜色 #fff000
 */
 Legends.AddLegend=function(name,text,clritem)
{
    Legends.CloseLegend(name);
	if(name&&clritem) {
	    var _name=stylemap.getName(name);
	    var id="#map-legend-"+_name;
	    $(id).remove();
        var legends = AddLegendPanel(_name,clritem);
        if (legends) {
            $(id+" .map-legend-label").text(text);
            legends.style.display = "block";
            legends.style.width=legends.offsetWidth+5+"px";
            legends.style.height=legends.offsetHeight+5+"px";
            commdiv.$setDragDiv("map-legend-"+_name);
        }
    }
}

/*
关闭Legend 不传参关闭所有
name stylemap.styleName
 */
Legends.CloseLegend=function(name)
{
    if(name==undefined) {
        $(".map-legend").remove();
        return;
    }
    $("#map-legend-"+stylemap.getName(name)).remove();
}

/*
隐藏Legend 不传参隐藏所有
name stylemap.styleName
 */
Legends.HideLegend=function (name) {
    if(name==undefined) {
        $(".map-legend").css("display","none");
        return;
    }
    $("#map-legend-"+stylemap.getName(name)).css("display","none");
}

/*
显示Legend 不传参显示所有
name stylemap.styleName
 */
Legends.ShowLegend=function (name) {
    if(name==undefined) {
        $(".map-legend").css("display","block");
        return;
    }
    $("#map-legend-"+stylemap.getName(name)).css("display","block");
}


})(window,document);

