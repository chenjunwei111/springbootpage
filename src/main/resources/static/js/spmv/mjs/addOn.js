(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.aOn = global.aOn || {})));
}(this, (function (exports) {
    'use strict';

    /**----------------------------rk----------------------------------**/
    /**
     *
     * @param option menu:[text,cfb(curtxt,paretxt),sub],maxcnt   addto sLY ;add rkcode hide disable property
     * @private
     */
    function rK(option) {
        var _my = this;
        _my.cs = _my.mn=option.maxcnt||4;//curserial menuMaxnum
        _my.mc = 0;//menucount
        var M = [], lv = 1, doc = document;
        if (!option.menu || option.menu.length == 0)
            return;
        _my.mc = option.menu.length;
        sM(f(M, option.menu));
        //超过6个显示浮动
        if (option.menu.length > _my.mn) {
            M.splice(0, 0,
                {
                    name: '▲',
                    id: 'r-up-menu-item',
                    level: 1,
                    serial: -1,
                    viewer: 'none',
                    callback: function () {
                        uP();
                    }
                }
            );
            M.push(
                {
                    name: '▼',
                    id: 'r-down-menu-item',
                    level: 1,
                    serial: -2,
                    viewer: 'block',
                    callback: function () {
                        dW();
                    }
                }
            );
        }
       return   mU();
        function f(m, a, c) {
            $.each(a, function (i, s) {
                var _c = Math.random().toString(16).replace(".", "");
                m.push({
                    name: this.text,
                    id: _c,// + '_' + this.text
                    parent: c || undefined,
                    level: lv,
                    serial: i,
                    viewer: i >= _my.mn ? 'none' : 'block'
                })

                if (this.sub) {
                    lv++;
                    f(m, this.sub, _c);
                }
                else {
                    lv = 1;
                    c = undefined;
                }
            });
        }
        /*
        菜单1级数量变动
         */
        function uP() {
            _my.cs--;
            $("#r-down-menu-item").css("display", "block");
            $(".menu-item-line[serial=\"-2\"]").css("display", "block");
            $(".web-context-menu-item[serial=\"" + (_my.cs - _my.mn) + "\"]").css("display", "block");
            $(".menu-item-line[serial=\"" + (_my.cs - _my.mn) + "\"]").css("display", "block");
            $(".web-context-menu-item[serial=\"" + (_my.cs) + "\"]").css("display", "none");
            $(".menu-item-line[serial=\"" + (_my.cs) + "\"]").css("display", "none");
            if (_my.cs == _my.mn) {
                $("#r-up-menu-item").css("display", "none");
                $(".menu-item-line[serial=\"-1\"]").css("display", "none");
            }
        }
        function dW() {
            $("#r-up-menu-item").css("display", "block");
            $(".menu-item-line[serial=\"-1\"]").css("display", "block");
            $(".web-context-menu-item[serial=\"" + (_my.cs - _my.mn) + "\"]").css("display", "none");
            $(".menu-item-line[serial=\"" + (_my.cs - _my.mn) + "\"]").css("display", "none");
            $(".web-context-menu-item[serial=\"" + _my.cs + "\"]").css("display", "block");
            $(".menu-item-line[serial=\"" + _my.cs + "\"]").css("display", "block");
            _my.cs++;
            if (_my.cs >= _my.mc) {
                $("#r-down-menu-item").css("display", "none");
                $(".menu-item-line[serial=\"-2\"]").css("display", "none");
                // curserial--;
            }
        }
        function sM() {
            if (!M)
                return;
            var n = [];
            for (var m = 1; m <=_my.cs; m++) {
                $.each(M, function () {
                    if (this.level === m) {
                        n.push(this);
                    }
                })
            }
            M = n;
        }
        function mU() {
            if (!M || M.length == 0)
                return;
            // $('#'+this.mid).remove();
          return  cM();
        }
        function cI(m) {
            // 创建菜单项
            var menuItem = doc.createElement("div");
            menuItem.setAttribute("class", "web-context-menu-item");
            menuItem.setAttribute("id", m.id);
            if (m.serial)
                menuItem.setAttribute("serial", m.serial);
            if (m.viewer)
                menuItem.setAttribute("style", "display:" + m.viewer);
            // 菜单项中的span，菜单名
            var span = doc.createElement("span");
            span.setAttribute("class", "menu-item-name");
            span.setAttribute("style", "padding-top:2px;text-align: center");
            span.innerText = m.name;
            if (m.callback) {
                if (typeof m.callback === 'function')
                    span.addEventListener("click", function (e) {
                        //e.target.parentNode.id
                        console.log(e);
                        m.callback();
                    });
            }
            // 创建小箭头
            var i = doc.createElement("i");
            i.innerText = "▲";
            span.appendChild(i);
            // 创建下一层菜单的容器
            var subContainer = doc.createElement("div");
            subContainer.setAttribute("class", "web-context-menu-items");

            menuItem.appendChild(span);
            menuItem.appendChild(subContainer);
            return menuItem;
        };
        function cL(p) {
            var line = doc.createElement("div");
            line.setAttribute("class", "menu-item-line");
            if (p.viewer)
                line.setAttribute("style", "display:" + p.viewer);
            if (p.serial)
                line.setAttribute("serial", p.serial);
            return line;
        };
        function cM() {
            // var mid=Math.random().toString(16).replace(".", "");
            // 创建菜单层
            _my.menu = doc.createElement("div");
            _my.menu.setAttribute("class", "web-context-menu "+ m+'-menu');
            // menu.setAttribute("id", m+'-web-context-menu');
            // if (!id || id === "body")
            //     doc.querySelector("body").appendChild(menu);
            // else
            doc.querySelector("#" + option._id).appendChild(menu);
            // 创建菜单项容器
            var mcr = doc.createElement("div");
            mcr.setAttribute("class", "web-context-menu-items");
            _my.menu.appendChild(mcr);
            $.each(M, function () {
                var parent = this.parent;
                // 创建菜单项
                var oM = cI(this);
                if (!parent) {
                    mcr.appendChild(oM);
                    mcr.appendChild(cL(this));
                } else {
                    var pN = doc.querySelector("#" + parent + " .web-context-menu-items");
                    pN.appendChild(oM);
                    pN.appendChild(cL(this));
                }
            })
            // 遍历菜单项去掉没有子菜单的菜单项的小箭头
            var aC = _my.menu.querySelectorAll(".web-context-menu-items");
            for (var i = 0; i < aC.length; i++) {
                var oC = aC[i];
                if (!oC.hasChildNodes()) {
                    var iTag = oC.parentElement.querySelector("i")
                    iTag.parentElement.removeChild(iTag);
                    oC.parentNode.firstChild.id = "last-menu-item";
                }
            }
        }
        return _my;
    }
    /*----------------------------end----------------------------------*/

    
    exports.rK = rK;
    Object.defineProperty(exports, '__esModule', {value: true});
})));

