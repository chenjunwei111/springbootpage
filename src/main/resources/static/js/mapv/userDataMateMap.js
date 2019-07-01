/*
 * author:jys
 */
var self;
var map;
function userDataMateMap() {
	
	
	var data = {};
	//pointAndPoi存放点与场景等数据,areaPointsAndPoi存放场景点与场景等数据
	var pointAndPois=[],areaPointsAndPois=[],points=[],areaPoints=[],newPoint;
	this.init = function() {
		
		var imgDefault = new Image();
		imgDefault.src = '../../images/map/symbols/mark_xdr_sel.png';
        var imgClick = new Image();
        imgClick.src = '../../images/map/symbols/mark_abnormal.png';
		
		//用于和表格交互
		userDataMateMap.initMapData=function(data) {			
			initMapData(data);
		}
		
		//用于和表格点击交互
		userDataMateMap.initMapDataByTableSelect=function(point,poi) {
			initMapDataByTableSelect(point,poi);
		}
	    
		//地图初始化
		 function initMapData(data) {
    		var result = data.list;
    		points=[],pointAndPois=[],areaPointsAndPois=[];
    		if(!result||result.length==0){
    			map.map.clearOverlays();
    		}else{
        		for(var j=0;j<result.length;j++){
        			
        			var point = coordtransform.wgs84tobd09(parseFloat(result[j].CENTERS.split(',')[0]),parseFloat(result[j].CENTERS.split(',')[1]));
        			points.push(point);
        			
        			var pointAndPoi={point:point,CITY:result[j].CITY,COMMUNITY_ID:result[j].COMMUNITY_ID,COMMUNITY_NAME:result[j].COMMUNITY_NAME,MSISDN:result[j].MSISDN};
        			pointAndPois.push(pointAndPoi);
        			
        			var resAreaPonit=String(result[j].LOCATIONS).split(';');
        			areaPoints=[];
                    for(var i=0;i<resAreaPonit.length;i++){
                        var onePont=resAreaPonit[i].split(',');
                        var changeP=coordtransform.wgs84tobd09(parseFloat(onePont[0]),parseFloat(onePont[1]));
                        areaPoints.push([changeP.lng,changeP.lat]);
                    }
                    var areaPointsAndPoi={areaPoints:areaPoints,CITY:result[j].CITY,COMMUNITY_ID:result[j].COMMUNITY_ID,COMMUNITY_NAME:result[j].COMMUNITY_NAME,MSISDN:result[j].MSISDN};
                    var flag=true;
                    for(var k=0;k<areaPointsAndPois.length;k++){
                    	if(areaPointsAndPois[k]==areaPointsAndPoi){
                    		flag=false;
                    	}
                    }
                    if(flag){
                    	areaPointsAndPois.push(areaPointsAndPoi);
                    }
        		}
        		waitjs("UCMap",function(){
        			
        			if(!map) map=new UCMap.Simple('container');
            		
        			newPoint = areaPointsAndPois[0].areaPoints[0] != undefined ? areaPointsAndPois[0].areaPoints[0]:null;
        			//区域
        			initPolygon(areaPointsAndPois,null);
        			
        			//初始化点坐标
    	        	initPoint(points,null);
        			//var cAndZ = getZoomDiy(points);
        			//map.map.setCenter(new BMap.Point(cAndZ.point.lng,cAndZ.point.lat));
            		//map.map.setZoom(cAndZ.zoom);
            	
        		});
        		
    		}

		 }		
		 
	    // 根据经纬极值计算绽放级别。
//		function getZoomDiy(points) {
//			var lngW=points[0].lng,lngE=points[0].lng,latS=points[0].lat,latN=points[0].lat;
//			for(var i=0;i<points.length;i++){
//				if(lngW>parseFloat(points[i].lng)){
//					lngW = parseFloat(points[i].lng);
//				}else if(lngE<parseFloat(points[i].lng)){
//					lngE = parseFloat(points[i].lng);
//				}
//				if(latN>parseFloat(points[i].lat)){
//					latN = parseFloat(points[i].lat);
//				}else if(latS<parseFloat(points[i].lat)){
//					latS = parseFloat(points[i].lat);
//				}
//			}
//			var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]// 级别18到3。
//		    var lngLatWS = new BMap.Point(lngW,latS);  // 创建点坐标西南
//		    var lngLatWN = new BMap.Point(lngE,latN);  // 创建点坐标东北
//		    var distance = map.map.getDistance(lngLatWS,lngLatWN)  // 获取两点距离
//		    for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {  
//		        if(zoom[i] - distance > 0){  
//		            return {point:{lng:(lngW+lngE)/2,lat:(latS+latN)/2},zoom:18-i};
//		        }else if(i == zoomLen-1){//当distance比所有zoom[i]大的时候，默认显示级别
//		        	return {point:{lng:(lngW+lngE)/2,lat:(latS+latN)/2},zoom:5};
//		        }  
//		    }; 
// 
//		}
		 
		 function initMapDataByTableSelect(point,poi){
			 var changePoint = coordtransform.wgs84tobd09(parseFloat(point[0]),parseFloat(point[1]));
			 var areaPois=[],ps=[];
			 //ps.push(changePoint);
			
 			//区域
 			initPolygon(areaPointsAndPois,poi);
 			
 			//初始化点坐标
        	//initPoint(ps.concat(points),changePoint);
 			initPoint(points,changePoint);
		 }
		 
		function initPolygon(parameter,poi) {
			
			var coords=[],style='green';
			if(poi!=null){
				for(var i= 0;i<parameter.length;i++){
					
					if(parameter[i].COMMUNITY_NAME == poi){
						style = 'orange';
						newPoint = parameter[i].areaPoints[0];
					}else{
						style = 'green';
					}
					coords.push({
			            geometry: {
			                type: 'Polygon',
			                coordinates: [parameter[i].areaPoints]
			            },
							fillStyle:style,
							//fillOpacity:0.01,百度原生的不起作用
					});
					
				}
			}else{
				style='green';
				for(var i= 0;i<parameter.length;i++){
					coords.push({
			            geometry: {
			                type: 'Polygon',
			                coordinates: [parameter[i].areaPoints]
			            },
							fillStyle:style,
							//fillOpacity:0.01,百度原生的不起作用
					});
					
				}
			}

			
			map.layer(coords, initPolygonPos(parameter),layer,{lng:newPoint[0],lat:newPoint[1]});
		}
		
		//添加多边形
		function initPolygonPos(parameter) {
			if (parameter.length > 0) {
				var ops = {
	                    draw: 'simple',//
	                    globalAlpha: 0.5,//透明度
			          //  zIndex: 998,
	                    methods: {
	                         click: function (e) {
	                             if (!e || e.length == 0) {
	                                 return;
	                             }
	                             var o = e[0];
	                             //这里联动表格显示对应场景
	                             tableUpdata(o.geometry.coordinates[0]);
	                         },
	
	                    } 
	                }
			}
            return ops;
		}
		
		function initPoint(parameter,point) {
			var coords=[],img;
			for(var i= 0;i<parameter.length;i++){
				img =(point!= null && parameter[i].lng == point.lng && parameter[i].lat == point.lat) ? imgClick:imgDefault;
				coords.push({
		            geometry: {
		                type: 'Point',
		                coordinates: [parameter[i].lng,parameter[i].lat]
		            },
		            icon: img,
		           
				});
				
			}
			map.layer(coords, initPointPos(parameter).options,'poiscene',{lng:newPoint[0],lat:newPoint[1]});
		}
		
		function initPointPos(parameter) {
			if (parameter.length > 0) {
				var ops = {     
		                options: {
		                    draw: 'icon',
//		                    coordType: 'bd0911',
		                    height: 46,
//		                    width: 10,
//		                    size: 10,
//				            zIndex: 99999
		                }
		            };
			}
            return ops;
		}
		
		function tableUpdata(areaPoints) {
			$.each(areaPointsAndPois,function(i,obj){
				if(obj.areaPoints==areaPoints){
					userDataMate.initMapData(obj.COMMUNITY_NAME);
				}
			});
		}
		
	}
}


$(function() {
	self = new userDataMateMap();
	self.init();
});