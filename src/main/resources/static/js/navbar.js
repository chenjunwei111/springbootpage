/** navbar.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['element', 'common'], function(exports) {
	"use strict";
	var $ = layui.jquery,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		element = layui.element,
		common = layui.common,
		cacheName = 'tb_navbar';

	var Navbar = function() {
		/**
		 *  默认配置 
		 */
		this.config = {
			elem: undefined, //容器
			data: undefined, //数据源
			url: undefined, //数据源地址
			type: 'GET', //读取方式
			cached: false, //是否使用缓存
			spreadOne:false //设置是否只展开一个二级菜单
		};
		this.v = '0.0.1';
	};
	Navbar.prototype.render = function() {
		var _that = this;
		var _config = _that.config;
		if(typeof(_config.elem) !== 'string' && typeof(_config.elem) !== 'object') {
			common.throwError('Navbar error: elem参数未定义或设置出错，具体设置格式请参考文档API.');
		}
		var $container;
		if(typeof(_config.elem) === 'string') {
			$container = $('' + _config.elem + '');
		}
		if(typeof(_config.elem) === 'object') {
			$container = _config.elem;
		}
		if($container.length === 0) {
			common.throwError('Navbar error:找不到elem参数配置的容器，请检查.');
		}
		if(_config.data === undefined && _config.url === undefined) {
			common.throwError('Navbar error:请为Navbar配置数据源.')
		}
		if(_config.data !== undefined && typeof(_config.data) === 'object') {
			var html = getHtml(_config.data);
			$container.html(html);
			element.init();
			_that.config.elem = $container;
		} else {
			if(_config.cached) {
				var cacheNavbar = layui.data(cacheName);
				if(cacheNavbar.navbar === undefined) {
					$.ajax({
						type: _config.type,
						url: _config.url,
						async: false, //_config.async,
						dataType: 'json',
						success: function(result, status, xhr) {
							//添加缓存
							layui.data(cacheName, {
								key: 'navbar',
								value: result
							});
							var html = getHtml(result);
							$container.html(html);
							element.init();
						},
						error: function(xhr, status, error) {
							common.msgError('Navbar error:' + error);
						},
						complete: function(xhr, status) {
							_that.config.elem = $container;
						}
					});
				} else {
					var html = getHtml(cacheNavbar.navbar);
					$container.html(html);
					element.init();
					_that.config.elem = $container;
				}
			} else {
				//清空缓存
				layui.data(cacheName, null);
				$.ajax({
					type: _config.type,
					url: _config.url,
					async: false, //_config.async,
					dataType: 'json',
					success: function(result, status, xhr) {
						var html = getHtml(result);
						$container.html(html);
						element.init();
					},
					error: function(xhr, status, error) {
						common.msgError('Navbar error:' + error);
					},
					complete: function(xhr, status) {
						_that.config.elem = $container;
					}
				});
			}
		}
		
		//只展开一个二级菜单
		if(_config.spreadOne){
			var $ul = $container.children('ul');
			$ul.find('li.layui-nav-item').each(function(){
				$(this).on('click',function(){

					$(this).siblings().removeClass('layui-nav-itemed');
				});
			});
		}
		return _that;
	};
	/**
	 * 配置Navbar
	 * @param {Object} options
	 */
	Navbar.prototype.set = function(options) {
		var that = this;
		that.config.data = undefined;
		$.extend(true, that.config, options);
		return that;
	};
	/**
	 * 绑定事件
	 * @param {String} events
	 * @param {Function} callback
	 */
	Navbar.prototype.on = function(events, callback) {

		var that = this;
		var _con = that.config.elem;
		if(typeof(events) !== 'string') {
			common.throwError('Navbar error:事件名配置出错，请参考API文档.');
		}
		var lIndex = events.indexOf('(');
		var eventName = events.substr(0, lIndex);
		var filter = events.substring(lIndex + 1, events.indexOf(')'));
		if(eventName === 'click') {
			if(_con.attr('lay-filter') !== undefined) {
				_con.children('ul').find('li').each(function() {
					var $this = $(this);
					if($this.find('dl').length > 0) {
						var $dd = $this.find('dd').each(function() {
							$(this).on('click', function(event) {
                                //JUNWEI--事件点击冒泡
                                event.stopPropagation()

								var $a = $(this).children('a');
								var href = $a.data('url');
								var icon = $a.children('i:first').data('icon');
								var title = $a.children('cite').text();
								if(href==null){
									return;
								}
								var data = {
									elem: $a,
									field: {
										href: href,
										icon: icon,
										title: title
									}
								}
								callback(data);
							});
						});
					} else {
						$this.on('click', function(event) {
                            event.stopPropagation()
							var $a = $this.children('a');
							var href = $a.data('url');
							var icon = $a.children('i:first').data('icon');
							var title = $a.children('cite').text();
                            if(href==null){
                                return;
                            }
							var data = {
								elem: $a,
								field: {
									href: href,
									icon: icon,
									title: title
								}
							}
							callback(data);
						});
					}
				});
			}
		}
	};
	/**
	 * 清除缓存
	 */
	Navbar.prototype.cleanCached = function(){
		layui.data(cacheName,null);
	};
	/**
	 * 获取html字符串
	 * @param {Object} data
	 */
	function getHtml(data) {
		var ulHtml = '<ul class="layui-nav layui-nav-tree beg-navbar">';
		for(var i = 0; i < data.length; i++) {
			if(data[i].spread) {
				//判断一级菜单是否打开
				ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
			} else {
				ulHtml += '<li class="layui-nav-item">';
			}
			if(data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
				//判断是否有子菜单--有
				ulHtml += '<a href="javascript:;">';
				if(data[i].icon !== undefined && data[i].icon !== '') {
					if(data[i].icon.indexOf('icon-') !== -1) {
						ulHtml += '<i class="iconfont '+data[i].icon+'"></i>';
					} else {
						ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
					}
				}
				ulHtml += '<cite>' + data[i].title + '</cite>'
				ulHtml += '</a>';
				ulHtml += '<dl class="layui-nav-child">'
				for(var j = 0; j < data[i].children.length; j++) {
					//遍历二级子菜单
					if(data[i].children[j].children !== undefined && data[i].children[j].children!==null && data[i].children[j].children.length>0 ){
                        //判断是否 有3级菜单*************************************************************
                        ulHtml += '<li class="threeTtem">';
						ulHtml += '<a href="javascript:;" style="color: #AEB7C2;padding-left: 25px">';
                        if(data[i].children[j].icon !== undefined && data[i].children[j].icon !== '') {
                            if(data[i].children[j].icon.indexOf('icon-') !== -1) {
                                ulHtml += '<i class="iconfont '+data[i].children[j].icon +'"></i>';
                            } else {
                                ulHtml += '<i class="layui-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
                            }
                        }
                        ulHtml += '<cite style="padding-right: 25px">' + data[i].children[j].title + '</cite>'
                        //JUNWEI-------点击变化样式
                        ulHtml += '<i class="faChange fa fa-chevron-right" style="color: #ffffff;"></i>'
                        ulHtml += '</a>';
                        ulHtml += '<dl class="layui-nav-child">'
						for(var k = 0; k < data[i].children[j].children.length; k++){
                            //遍历三级子菜单--（陈君威修改）
                            ulHtml += '<dd title="'+data[i].children[j].children[k].title+'" style="display: none">';
                            if(data[i].children[j].children[k].isValid==0){
                                ulHtml += '<a style="text-align: left;padding-left: 45px;pointer-events: none;cursor: default;"  href="javascript:return false;" data-url=null>';
                            }else {
                                // ulHtml += '<a style="text-align: left;padding-left: 45px"  href="javascript:;" data-url="' + data[i].children[j].children[k].href + '?ran='+new Date().getTime()+'">';
                                ulHtml += '<a style="text-align: left;padding-left: 45px"  href="javascript:;" data-url="' + data[i].children[j].children[k].href + '">';

                            }
                            if(data[i].children[j].children[k].icon !== undefined && data[i].children[j].children[k].icon !== '') {
                                if(data[i].children[j].children[k].icon.indexOf('icon-') !== -1) {
                                    ulHtml += '<i class="iconfont '+data[i].children[j].children[k].icon +'"></i>';
                                } else {
                                    ulHtml += '<i class="layui-icon" data-icon="' + data[i].children[j].children[k].icon + '">' + data[i].children[j].children[k].icon + '</i>';
                                }
                            }
                            ulHtml += '<cite>' + data[i].children[j].children[k].title + '</cite>';
                            ulHtml += '</a>';
                            ulHtml += '</dd>';
						}
                        ulHtml += '</dl>';
                        ulHtml += '</li>';
					}
                     else {
                        ulHtml += '<dd title="'+data[i].children[j].title+'">';
                        if(data[i].children[j].isValid==0){
                            ulHtml += '<a style="pointer-events: none;cursor: default;"  href="javascript:return false;" data-url=null>';
                        }else {
                            // ulHtml += '<a href="javascript:;" data-url="' + data[i].children[j].href + '?ran='+new Date().getTime()+'">';
                            ulHtml += '<a href="javascript:;" data-url="' + data[i].children[j].href + '">';

                        }

                        if(data[i].children[j].icon !== undefined && data[i].children[j].icon !== '') {
                            if(data[i].children[j].icon.indexOf('icon-') !== -1) {
                                ulHtml += '<i class="iconfont '+data[i].children[j].icon +'"></i>';
                            } else {
                                ulHtml += '<i class="layui-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
                            }
                        }
                        ulHtml += '<cite>' + data[i].children[j].title + '</cite>';
                        ulHtml += '</a>';
                        ulHtml += '</dd>';
					}
				}
				ulHtml += '</dl>';
			} else {
				// var dataUrl = (data[i].href !== undefined && data[i].href !== '') ? 'data-url="' + data[i].href + '?ran='+new Date().getTime()+'"' : '';
                var dataUrl = (data[i].href !== undefined && data[i].href !== '') ? 'data-url="' + data[i].href + '"' : '';

                ulHtml += '<a href="javascript:;" ' + dataUrl + '>';
				if(data[i].icon !== undefined && data[i].icon !== '') {
					if(data[i].icon.indexOf('icon-') !== -1) {
						ulHtml += '<i class="iconfont '+data[i].icon +'"></i>';
					} else {
						ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
					}
				}
				ulHtml += '<cite>' + data[i].title + '</cite>'
				ulHtml += '</a>';
			}
			ulHtml += '</li>';
		}
		ulHtml += '</ul>';

		return ulHtml;
	}

	var navbar = new Navbar();

	exports('navbar', function(options) {
		return navbar.set(options);
	});

	var flag=true;
	var tabname=null;
	$(".layui-side-scroll").on("click",".threeTtem",function (event) {
		event.stopPropagation();//阻止冒泡

        var tabname2=$(this).find("cite").eq(0).text();
		// console.log(tabname2)
		if(tabname==null || tabname!=tabname2){
            flag=true;
            $(".threeTtem").find("dd").css("display","none");

            $(".threeTtem").find(".faChange").removeClass("fa-chevron-down");
            $(".threeTtem").find(".faChange").addClass("fa-chevron-right");

            $(this).find("dd").css("display","block");
            $(this).find(".faChange").removeClass("fa-chevron-right");
            $(this).find(".faChange").addClass("fa-chevron-down");
            tabname=tabname2;
		}else {
            //箭头变化
            if(!flag){
                $(this).find(".faChange").removeClass("fa-chevron-right");
                $(this).find(".faChange").addClass("fa-chevron-down");
                $(this).find("dd").css("display","block");
                flag=true;
            }else {
                $(this).find(".faChange").removeClass("fa-chevron-down");
                $(this).find(".faChange").addClass("fa-chevron-right");
                $(this).find("dd").css("display","none");
                flag=false;
            }
		}
        // $(this).find("dd").toggle();

    })

});

