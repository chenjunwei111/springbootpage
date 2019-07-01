'user script'
/**
 * @desc legend
 *
 * @param {String} n
 * @constructor
 */
var Legend=function (e) {
    this._e=e;
}
/**
 *@desc  {m:{f:'#cccccc',t:'测试1'},k:'u',s:[{f:'#cccccc',t:'测试2'}]} f:url/#color/rgb()
 * @param {object} l
 */
Legend.prototype.add=function (l) {
    if (!l)
        return;
    if (l.k) {
        this.close(l.k);
    }
    var style = '';
    var __e=this._e?'#'+this._e:'';
    if ($(__e+' #led-content').children(':first').length > 0) {
        style = "style='margin-top: -1px'";
    }

    var h = "<div class='led-buss' " + style + " s='1' k='" + (l.k ? l.k : '') + "'>\n" +
        " <i " + getc(l.m.f, 0) + "></i>\n" +
        " <span>" + l.m.t + "</span>\n" +
        " </div>"
    $(__e+' #led-content').append(h);
    //显示隐藏图层
    if (l.c && typeof  l.c == 'function') {
        var _this=this;
        $(__e+ " .led-buss:last i").click(function (e) {
            var _p = e.target.parentNode;
            var a0 = _p.getAttribute('k');
            var a1 = _p.getAttribute('s');
            if (_p.nextElementSibling.className == 'led-mutil-content') {
                if (a1 == 0) {
                    $(__e+' #' + _p.nextElementSibling.id).animate({height: $('#' + _p.nextElementSibling.id).attr('h') + 'px'})
                    _p.setAttribute('s', '1')
                    //$(".led-sub").fadeIn(500)
                    $(__e+ ' #' + _p.nextElementSibling.id).children('.led-sub').fadeIn(500);
                }
                else {
                    $(__e+  ' #' + _p.nextElementSibling.id).animate({height: 0})
                    _p.setAttribute('s', '0')
                    $(__e+  ' #' + _p.nextElementSibling.id).children('.led-sub').fadeOut(500);
                }
            }
            l.c({k: a0, s: a1});
        })
    }

    if (l.s && l.s.length > 0) {
        var _this=this;
        $(__e+ " .led-buss:last span").addClass('s-mutil').attr('title','折叠');
        $(__e+ " .led-buss:last span").click(function (e) {
            var _p = e.target.parentNode;
            var a1 = _p.getAttribute('s');
            if (_p.nextElementSibling.className == 'led-mutil-content') {
                if (a1 == 0) {
                    $(__e+  ' #' + _p.nextElementSibling.id).animate({height: $('#' + _p.nextElementSibling.id).attr('h') + 'px'})
                    //$(".led-sub").fadeIn(500)
                    $(__e+' #' + _p.nextElementSibling.id).children('.led-sub').fadeIn(500);
                    _p.setAttribute('s', '1')
                    this.setAttribute('title', '折叠')
                }
                else {
                    $(__e+' #' + _p.nextElementSibling.id).animate({height: 0})
                    $(__e+ ' #' + _p.nextElementSibling.id).children('.led-sub').fadeOut(500);
                    _p.setAttribute('s', '0')
                    this.setAttribute('title', '展开')
                }
            }
        })

        var c = Math.random().toString(16).replace(".", "");
        $(__e+' #led-content').append(" <div id='" + c + "' class='led-mutil-content' k='" + (l.k ? l.k : '') + "'></div>");
        var i = 0;
        for (; i < l.s.length; i++) {
            var k = l.s[i];
            if (i == 0) {
                style = "style='margin-top: 1px;padding-top: 2px;'";
            }
            else {
                style = "style='margin-top: -5px;'";
            }
            var h = "<div class='led-sub' " + style + ">\n" +
                " <i " + getc(k.f, 1) + "></i>\n" +
                " <span>" + k.t + "</span>\n" +
                " </div>"
            $(__e+ ' .led-mutil-content').append(h);
        }
        $(__e+ " #" + c).css('display','block')
     //   console.log($("#" + c).css('height').replace('px', ''))
 
        $(__e+ " #" + c).attr('h', $("#" + c).css('height').replace('px', ''));
        if($(__e+' #led-Lyr').attr('status')==1) {
            $(__e + " #led-content").css('opacity', '0.9');
        }
    }
}

Legend.prototype.init=function (s,show) {
     this._e = s ;
    var h = "<div id='led-Lyr' status=" + (show && show == true ?  1 : 0) + "> <div id=\"led-ctrl\" title='图例'>\n" +
        "</div><div id=\"led-content\" >\n" +
        "        </div></div>"
    // var h = "<div id='led-Lyr'> <div id=\"led-ctrl\" ><img class='img-ctrl'/>\n" +
    //     "</div><div id=\"led-content\" >\n" +
    //     "</div></div>"
    $('#' + s).append(h);
    //$("#led-content").animate({width:"100px"});
    if (!show || show == false) {
        $('#' + s + " #led-Lyr").hover(function () {
            if ($('#' + s + ' #led-content').children().length > 0) {
                $('#' + s + " #led-content").fadeIn(500, function () {
                    $('#' + s + " #led-content").css('opacity', '0.9')
                });
            }
        }, function () {
            $('#' + s + " #led-content").fadeOut(1000);
            //  $("#led-content").animate({width:"0px"});
        });
    }
    else {

        // if($('#led-content').children().length>0)
        // {
        //     $("#led-content").fadeIn(500,function () {
        //         $("#led-content").css('opacity','0.9')
        //     });
        // }
    }
}
Legend.prototype.close=function (k) {
    var __e=this._e?'#'+this._e:'';
    if(!k) {
        $(__e+ ' #led-content').empty();
        $(__e+ ' #led-content').css('opacity','0');
        return;
    }
    $.each($(__e+' #led-content').children(),function (a,b) {
        if(b.getAttribute('k').startWith(k))
        {
            b.parentNode.removeChild(b);
        }
    })
    if($(__e+' #led-content').children().length==0)
    {
        $(__e+ ' #led-content').css('opacity','0');
    }
}

function  getc(c,t) {
    if(!c||c=='')
    {
        return '';
    }
    if (c.indexOf('..') >= 0) {
        if (t == 0) {
            return "style='background: url(" + c + ") no-repeat; background-size: 20px 20px;'";
            //return "<img src='"+c+"' style='max-width:100%;height:100%'";
        }
        else {
            return "style='background: url(" + c + ") no-repeat; background-size: 18px 18px;'";
        }
    }
    else {
        return "style='border-radius: 50%;background:" + c + "'";
    }
}


