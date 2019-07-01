(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.geoTools = global.geoTools || {})));
}(this, (function (exports) {
    'use strict';

    /**
     * @param option compelete:function close:function
     * @type {geoTools.Draw}
     */
  var g=geoTools.Draw=function (map,option) {
      this._map = map;
      this._option = option;
      this.s = 0;
      var poly;
      this.p = [];
      var bp;
      var me = this;
      this.c = function (e) {
          if(this.s==0)
              return;
          me.l = undefined;
          //判断是否有交叉点
          if (me.p.length > 1) {
              // intersect(e.point,me.p);
          }
          me.p.push(e.point);
          if (me.p.length == 1) {
              var _m = new BMap.Marker(e.point,
                  {
                      icon: new BMap.Icon("../../images/map/tools/draw-over-pot.png", new BMap.Size(10, 10)),
                      // offset: {width: 0, height: -12},
                      enableMassClear: false,
                      enableClicking: true,
                      enableDragging: false
                  });
              _m.GEO_KEY = 'M_DRAGGING';
              _m.addEventListener('click', function (e) {
                  me.clearLay('M_DRAGGING');
                  //增加面
                  addPoly();
                  // var i=0;
                  // for(;i<me.p.length;i++)
                  // {
                  //     addDragMark(me.p[i],i);
                  // }
                  me.close();
                  if (me._option&&me._option.compelete && typeof  me._option.compelete == 'function') {
                      if(poly)
                        me._option.compelete({points:poly.getPath(),sn:poly.GEO_SN});
                  }
              })
              me._map.addOverlay(_m);
              // var l=new BMap.Label('点击完成',{
              //     offset:new BMap.Size(2,-3),
              //     position:e.point,
              //     enableMassClear:false
              // })
              // l.GEO_KEY = 'M_DRAGGING';
              // l.setStyle({ color:"slategray",fontSize:"12px",opacity:0.9})
              // me._map.addOverlay(l);
          }
          else
          {
              addDragMark(e.point,me.p.length)
          }
          bp = e.point;
      }
      this.m = function (e) {
          if (bp) {
              me.l = new BMap.Polyline([bp, e.point], {
                  strokeColor: 'red',
                  strokeWeight: '1',
                  strokeOpacity: '1',
                  strokeStyle: 'dashed',//solid
                  enableMassClear: false,
                  enableClicking: false
              });
              me.l.GEO_KEY = 'M_DRAGGING';
              me._map.addOverlay(me.l);
              bp = undefined;
              return;
          }
          if (me.l) {
              me.l.setPositionAt(1, e.point);
              var k = setTimeout(function (e) {
                      $('.shut-down').css({display: 'block', top: (e.pixel.y - 5) + 'px', left: (e.pixel.x + 5) + 'px'})
                  clearTimeout(k);
              }, 200, e)
          }
      }

      function  addDragMark(e,key) {
          var m = new BMap.Marker(e,
              {
                  icon: new BMap.Icon("../../images/map/tools/draw-pot.png", new BMap.Size(10, 10)),
                  // offset: {width: 0, height: -8},
                  enableMassClear: false,
                  enableClicking: false,
                  enableDragging: true
              });
          m.GEO_KEY = 'M_DRAGGING';
          m.GEO_SN=key;
          if (me._option && me._option.edit == true) {
              m.addEventListener('dragging', function (e) {
                  //e.currentTarget.GEO_KEY
                    if(poly)
                    {
                        var ps=poly.getPath();
                        ps.splice(e.currentTarget.GEO_SN,1,e.point);
                        poly.setPath(ps);
                    }
              })
          }
          me._map.addOverlay(m);
      }
      function  addPoly() {
          poly = new BMap.Polygon(me.p, {
              fillColor: 'blue',
              strokeColor: 'blue',
              strokeWeight: 2,
              fillOpacity: 0.6,
              strokeStyle: 'solid',//或dashed
              enableMassClear: false,
              enableEditing: false,
              enableClicking: false

          })
          poly.GEO_KEY = 'M_PLOY';
          poly.GEO_SN=Math.random().toString(32).replace(".", "");
          me._map.addOverlay(poly);
      }
     this.clearLay= function  (key) {
          var overlay=map.getOverlays();
          if(overlay)
          {
              $.each(overlay,function (a,b) {
                  if(b.GEO_KEY==key)
                  {
                      b.remove();
                  }
              })
          }
      }
  }



 g.prototype.close=function () {
     this._map.removeEventListener('click', this.c);
     this._map.removeEventListener('mousemove', this.m);
     this.clearLay("M_DRAGGING");
     this.s=0;
     this.l=undefined;
     $('#'+this._map.getContainer().id +' .shut-down').remove();
     if( this._option.close&&typeof  this._option.close=='function') {
         this._option.close();
     }
     // return this.p;
  }

  g.prototype.open=function () {
      this._map.addEventListener('click', this.c);
      this._map.addEventListener('mousemove', this.m)
      this.s = 1;
      var _self=this;
      $('#' + this._map.getContainer().id + ' .shut-down').remove();
      $('#' + this._map.getContainer().id).append("<div class='shut-down' title='删除绘制图层' style='width:16px;height:16px;position:absolute;display: none'><img src='../../images/map/tools/draw-shut.png' style='max-width: 16px;max-height: 16px;'></div>")
      $('#' + this._map.getContainer().id + ' .shut-down').on('click', function (e) {
          _self.clearLay("M_DRAGGING");
          _self.p = [];
          $('.shut-down').css('display','none');
          _self.l=undefined;
      })
      $('#' + this._map.getContainer().id + ' .shut-down').hover(function () {
          $('.shut-down img').attr('src','../../images/map/tools/draw-shut-move.png')
      }, function (e) {
          $('.shut-down img').attr('src','../../images/map/tools/draw-shut.png')
      })
  }

    function  intersect(e,p) {

        var i=1;
        var l0=[{x:e.lng,y:e.lat},{x:p[p.length-1][1].lng,y:p[p.length-1][1].lat}];
        for(;i<p.length;i++)
        {
            var r0=r.lineIntersect(l0,[{x:p[i][0].lng,y:p[i][0].lat},{x:p[i][1].lng,y:p[i][1].lat}]);
        }
    }

  var r={
      lineIntersect:function (lineA,lineB) {
          var a=lineA[0];
          var b=lineA[1];
          var c=lineB[0];
          var d=lineB[1];
          // 三角形abc 面积的2倍
          var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
          // 三角形abd 面积的2倍
          var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
          // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
          if ( area_abc*area_abd>=0 ) {
              return false;
          }
          // 三角形cda 面积的2倍
          var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
          // 三角形cdb 面积的2倍
          // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
          var area_cdb = area_cda + area_abc - area_abd ;
          if ( area_cda * area_cdb >= 0 ) {
              return false;
          }
          //计算交点坐标
          var t = area_cda / ( area_abd- area_abc );
          var dx= t*(b.x - a.x),
              dy= t*(b.y - a.y);
          return { x: a.x + dx , y: a.y + dy };
      }
  }



  exports.$draw=g;
  exports.$Relation=r;

    Object.defineProperty(exports, '__esModule', {value: true});
})));