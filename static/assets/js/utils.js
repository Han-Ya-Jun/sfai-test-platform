function getContextPath() {
	var pathName = document.location.pathname;

	var curWwwPath = window.document.location.href;
	var pos = curWwwPath.indexOf(pathName);

	var localhostPath = curWwwPath.substring(0, pos);

	var length = pathName.split("/");

	var result = '';
	if (length.length > 3) {
		if (length[1] != 'index') {
			result = '/' + length[1];
		}
	}
	return (localhostPath + result);
}

function getBasePath() {
	var pathName = document.location.pathname;

	var length = pathName.split("/");

	var result = '';
	if (length.length > 3) {
		if (length[1] != 'index') {
			result = '/' + length[1];
		}
	}
	return result;
}

$.utils = {
	/**
	 * 时间格式化 formatStr 为“yyyy-MM-dd” dateTime 为日期类型
	 */
	dateFormat : function(formatStr, dateTime) {

		var str = formatStr;
		var Week = [ '日', '一', '二', '三', '四', '五', '六' ];

		str = str.replace(/yyyy|YYYY/, dateTime.getFullYear());
		str = str
				.replace(/yy|YY/, (dateTime.getYear() % 100) > 9 ? (dateTime
						.getYear() % 100).toString() : '0'
						+ (dateTime.getYear() % 100));

		str = str.replace(/MM/,
				dateTime.getMonth() > 8 ? dateTime.getMonth() + 1 : '0'
						+ (dateTime.getMonth() + 1));
		str = str.replace(/M/g, dateTime.getMonth() + 1);

		str = str.replace(/w|W/g, Week[dateTime.getDay()]);

		str = str.replace(/dd|DD/, dateTime.getDate() > 9 ? dateTime.getDate()
				.toString() : '0' + dateTime.getDate());
		str = str.replace(/d|D/g, dateTime.getDate());

		str = str.replace(/hh|HH/, dateTime.getHours() > 9 ? dateTime
				.getHours().toString() : '0' + dateTime.getHours());
		str = str.replace(/h|H/g, dateTime.getHours());
		str = str.replace(/mm/, dateTime.getMinutes() > 9 ? dateTime
				.getMinutes().toString() : '0' + dateTime.getMinutes());
		str = str.replace(/m/g, dateTime.getMinutes());

		str = str.replace(/ss|SS/, dateTime.getSeconds() > 9 ? dateTime
				.getSeconds().toString() : '0' + dateTime.getSeconds());
		str = str.replace(/s|S/g, dateTime.getSeconds());
		return str;
	},
	
	jsonFormat : function (txt,compress/*是否为压缩模式*/){/* 格式化JSON源码(对象转换为JSON文本) */  
        var indentChar = '    ';   
        if(/^\s*$/.test(txt)){   
            alert('数据为空,无法格式化! ');   
            return;   
        }   
        try{var data=eval('('+txt+')');}   
        catch(e){   
            alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');   
            return;   
        };   
        var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;   
           
        var notify=function(name,value,isLast,indent/*缩进*/,formObj){   
            nodeCount++;/*节点计数*/  
            for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */  
            tab=compress?'':tab;/*压缩模式忽略缩进*/  
            maxDepth=++indent;/*缩进递增并记录*/  
            if(value&&value.constructor==Array){/*处理数组*/  
                draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/  
                for (var i=0;i<value.length;i++)   
                    notify(i,value[i],i==value.length-1,indent,false);   
                draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/  
            }else   if(value&&typeof value=='object'){/*处理对象*/  
                    draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/  
                    var len=0,i=0;   
                    for(var key in value)len++;   
                    for(var key in value)notify(key,value[key],++i==len,indent,true);   
                    draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/  
                }else{   
                        if(typeof value=='string')value='"'+value+'"';   
                        draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);   
                };   
        };   
        var isLast=true,indent=0;   
        notify('',data,isLast,indent,false);   
        return draw.join('');   
    },

	submit : function(controllerURL, formId, dialogId, errMsg, data,
			refreshTable, dialogShow, sucMsg) {
		var reqData = null;
		var that = this;

		if (formId) {
			reqData = $(formId).serialize();
		} else {
			reqData = data;
		}
		$.ajax({
			type : "post",
			url : getContextPath() + controllerURL,
			dataType : 'json',
			data : reqData,
			async : false,
			success : function(response) {
				if (response.success == true) {
					if (refreshTable) {
						$(refreshTable).bootstrapTable('refresh');
					}
					if (!dialogShow) {
						$(dialogId).modal('hide');
					}
					if (sucMsg) {
						that.alertSuccess(sucMsg);
					}
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				$.utils.alertError('AJAX出错');
			}
		});
	},
	alertError : function(msg, options) {
		BootstrapDialog.alert({
			type : 'type-danger',
			title : '错误',
			buttonLabel : '确定',
			message : msg,
			draggable : true
		});
	},
	alertSuccess : function(msg, options) {
		BootstrapDialog.alert({
			type : 'type-success',
			title : '正确',
			buttonLabel : '确定',
			message : msg,
			draggable : true
		})
	},
	alertWarning : function(msg, options) {
		BootstrapDialog.alert({
			type : 'type-warning',
			title : '警告',
			buttonLabel : '确定',
			message : msg,
			draggable : true
		});
	},
	alertInfo : function(msg, options) {
		BootstrapDialog.alert({
			type : 'type-info',
			title : '信息',
			buttonLabel : '确定',
			message : msg,
			draggable : true
		});
	},
	objToJson : function(obj) {
		return JSON.stringify(obj);

	},
	updatePsd : function() {
		if ($('#updatePasswordForm').valid()) {
			$.utils.submit('/user/updatePsdByPrimaryKeySelective',
					'#updatePasswordForm', '#updatePassWordDialog', '修改出错~',
					null, false, null, '修改成功~');
		}
	},
	updatePsdByUsername : function() {

		$('#updatePasswordForm div').removeClass('has-error');

		$('#updatePasswordForm').validate().resetForm();

		$('#updatePasswordForm')[0].reset();

		$('#updatePassWordDialog').modal('show');
	},
	initValid : function(id) {
		$('#idForUpdatePsd').val(id);

		$('#updatePasswordForm').validate({
			rules : {
				orignPsd : {
					required : true,
					rangelength : [ 6, 10 ]
				},
				newPsd : {
					required : true,
					rangelength : [ 6, 10 ]
				},
				newPsdConfirm : {
					equalTo : '#newPassword'
				}
			},
			messages : {
				orignPsd : {
					required : "原密码不能为空",
					rangelength : "原密码6-10位"
				},
				newPsd : {
					required : "新密码不能为空",
					rangelength : "新密码6-10位"
				},
				newPsdConfirm : {
					equalTo : "两次密码输入不一致"
				}
			},
			errorClass : "text-danger",
			errorElement : "span",
			highlight : function(element, errorClass, validClass) {
				$(element).parent().addClass('has-error');
			},
			unhighlight : function(element, errorClass, validClass) {
				$(element).parent().removeClass('has-error');
			}
		});
	},
	logout : function() {
		sessionStorage.clear();
		window.location.href = getBasePath() + "/logout";
	},
	init : function() {
		var id = $.utils.loadUserName();
		$.utils.initValid(id);
	},
	initMenu : function() {
		$.utils.init();
		var id = $.utils.loadUserName();
		$("#sidebar-menu").find("li").remove();
		$.utils.loadSideBar(id);
		$(".treeview").each(function (){
			var btn = $(this).children("a").first();
			var menu =$(this).children(".treeview-menu").first();
			var isActive =$(this).hasClass('active');
			// initialize already active menus
			if (isActive) {
				menu.show();
				btn.children(".fa-angle-left").first().removeClass(
						"fa-angle-left").addClass("fa-angle-down");
			}
			// Slide open or close the menu on link click
			btn.click(function(e) {
				e.preventDefault();
				var isActive = btn.parent("li").hasClass('active');
				if (isActive) {
					// Slide up to close menu
					menu.slideUp();
					isActive = false;
					btn.children(".fa-angle-down").first().removeClass(
							"fa-angle-down").addClass("fa-angle-left");
					btn.parent("li").removeClass("active");
				} else {
					menu.slideDown();
					isActive = true;
					$(".treeview").each(
							function() {
								var active = $(this).attr("class");
								if (active != "treeview") {
									$(this).attr("class", "treeview");
									$(this).find(".fa-angle-down").first()
											.removeClass("fa-angle-down")
											.addClass("fa-angle-left");
									/*$(this).children(".treeview-menu").first()
											.css("display", "none")*/
									$(this).children(".treeview-menu").first().slideUp();
								}
							});
                    
					btn.children(".fa-angle-left").first().removeClass(
							"fa-angle-left").addClass("fa-angle-down");
					btn.parent("li").addClass("active");
					btn.next().css("display", "block");
				}
			});

			/* Add margins to submenu elements to give it a tree look */
			menu.find("li > a").each(function() {
				var pad = parseInt($(this).css("margin-left")) + 10;

				$(this).css({
					"margin-left" : pad + "px"
				});
			});
			
			
		});
		$(".treeview-menu > li ").click(function(index, elm) {
			var path = $(this).children("a").attr("data-url");
			$.utils.loadModule(path);
			$(".treeview-menu > li ").each(function(index, elm) {
				$(this).removeClass("choice");
			});
			$(this).addClass("choice");

		});
	},
	loadUserName : function() {
		var id = 0;
		$.ajax({
			url : getContextPath() + "/system/userInfo",
			dataType : 'json',
			type : 'get',
			async : false,
			success : function(response) {
				if (response.success) {
					if (response.obj.sysUsername == null
							|| response.obj.sysUsername == "") {
						window.location.href = '../pages/417.html';
					} else if (response.obj.delStatus) {
						window.location.href = '../pages/404.html';
					} else {
						$("#userName").text(response.obj.sysName);
						$("#userName2").text(response.obj.sysName);
						$("#helloUserName").text(
								"hello," + response.obj.sysName);
						id = response.obj.id;
						$.utils.loadSideBar(id);
					}
				} else {

				}
			},

		});

		return id;
	},
	loadSideBar : function(id) {
		var url = getContextPath() + "/system/loadSideMenus";
		var firstMenu = null;
		var firstChildMenu = null;
		$.ajax({
			url : url,
			data : {
				id : id
			},
			dataType : "json",
			async : false, // 子菜单需要同步加载
			cache : true, // 可以使用缓存
			success : function(response) {
				var html = '';
				var resArr = response.obj;
				for (var i = 0; i < resArr.length; ++i) {// 一级children
					if (firstMenu == null) {
						firstMenu = resArr[i].resourceUrl;
					}
					html += '<li class="treeview">';
					html += '<a href="#">';
					html += '<i class="' + resArr[i].icon + '"></i>';// 图标可以改变
					html += '<span>' + resArr[i].resourceName + '</span>'
					html += '<i class="fa fa-angle-left pull-right"></i>';
					html += '</a>';
					html += '<ul class="treeview-menu">';
					var childMenu2 = resArr[i].childMenu;
					for (var j = 0; j < childMenu2.length; ++j) {// 二级children
						/*
						 * var tempStr = childMenu[k] + ".html"; var
						 * icon=childMenu.icon; alert(icon);
						 */
						var k = childMenu2[j];
						html += '<li><a data-url="' + k.resourceUrl + ".html"
								+ '" href="#"><i class="' + k.icon
								+ '"></i>' + k.resourceName + '</a></li> '

					}
					html += '</ul>'
					html += '</li>';
				}
				$('#sidebar-menu').html(html);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == '401') {

				}
			}
		});
		return firstChildMenu;
	},
	/**
	 * 加载主页面
	 * 
	 * @param path
	 *            页面路径
	 * @param historyFlag
	 *            是否加入到历史记录中,true 为是,false为否
	 * @param sessionFlag
	 *            是否需要清除session,true 为是, false 为否
	 * @param json
	 *            需要存入到session中的json数据
	 */
	loadModule : function(path) {
		var url = getContextPath() + path;
		$.ajax({
			url : url,
			async : false, // 需要异步加载
			dataType : "html",
			cache : false,
			success : function(data) {
				$('#content').html('');
				$('#content').html(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == '401') {
					window.location.href = getContextPath();
				}
			}
		});
	},
	
	/**
	 * select2帮助类 **/
	findAllApp : function(appName,appId,url){
		$("#"+appName).select2({
			ajax:{
				url:getContextPath() + url,
				dataType:'json',
				type:"POST",
				data:function (params) {
					return{
						params:params.term
					}
				},
				processResults:function(data){
					return{
						results:data.obj
					}
				},
				cache:true
			},
			escapeMarkup : function(markup){
				return markup;
			},
			templateResult:function formatRepo(repo){
				markup = "<option>" + repo.name + "</option>";
				return markup;
			},
			templateSelection:function fomratRepoSelection(repo){
				$("#"+appId).val(repo.id);
				$("#"+appName).text(repo.name);
				return repo.name || repo.id;
			}
		});
	},
	searchApp : function(appName,appId,url){
		$("#"+appName).select2({
			ajax:{
				url:getContextPath() + url,
				dataType:'json',
				type:"POST",
				data:function (params) {
					return{
						params:params.term
					}
				},
				processResults:function(data){
					var a = {id:"-1",name:"全部"};
					data.obj.unshift(a);
					return{
						results:data.obj
					}
				},
				cache:true
			},
			escapeMarkup : function(markup){
				return markup;
			},
			templateResult:function formatRepo(repo){
				markup = "<option>" + repo.name + "</option>";
				return markup;
			},
			templateSelection:function fomratRepoSelection(repo){
				$("#"+appId).val(repo.id);
				$("#"+appName).text(repo.name);
				return repo.name || repo.id;
			}
		})	
	},
	isJSON : function(str){
		if (typeof str == 'string') {
	        try {
	            var obj=JSON.parse(str);
	            if(str.indexOf('{')>-1){
	                return true;
	            }else{
	                return false;
	            }

	        } catch(e) {
	            return false;
	        }
	    }
	    return false;
	}
	
};

/** 将表单序列化为一个json对象，只支持单个值的控件 */
$.fn.serializeFormToJson = function() {
	var serializeObj = {};
	$(this.serializeArray()).each(function() {
		serializeObj[this.name] = this.value;
	});
	return serializeObj;
}


/**
 * select2帮助类
 *
 * @param repo
 * @returns {string}
 */
function formatRepo(repo) {

	var markup = "<div class='select2-results__options'>" + repo.name
			+ "</div>";
	return markup;
}

function formatRepoSelection(repo) {
	return repo.name || repo.text;
}

function formatRepoSelectionSys(repo) {
	$("input[name='systemCode']").val(repo.id);
	$("input[name='systemCode']").text(repo.name);
	return repo.name || repo.text;
}

function formatRepoSelectionApp(repo) {
	$("input[name='appName']").val(repo.id);
	return repo.name || repo.text;
}
