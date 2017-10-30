$.testVersionInfoUtils = {
	init : function() {
		$.testVersionInfoUtils.initStyle();
		$.testVersionInfoUtils.initButton();
		$.testVersionInfoUtils.queryList();
		$.testVersionInfoUtils.initValid();
		$.utils.findAllApp("addAppName","addAppId","/testVersionInfo/getAllApp");
		$.utils.searchApp("searchAppName","searchAppId","/testVersionInfo/getAllApp");
		$.testVersionInfoUtils.custom.changeRadio("addTestVersionInfoForm","getInterfaceType");
		$.testVersionInfoUtils.custom.uploadFile();
	},
	
	initStyle : function(){
		
	},
	
	initButton :function(){
		$('.form_datetime').datetimepicker({
			language : 'zh-CN',
			format : 'yyyy-mm-dd hh:ii:ss',
			todayHighlight : true,
			autoclose : true,
			todayBtn : 1,
			pickerPosition : "bottom-left",
			// minView : "month" // 如果要选择时分秒怎么删除该配置
		});
	},
	
	queryList : function() {
		$('#testVersionInfoTable').bootstrapTable({
			url : getContextPath() + "/testVersionInfo/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit,
					// 对象查询相关可以从此处传递值,具体实现需自行编码
					// 例如: id:id
				}
			},
			responseHandler : function(response) {
				if (response.success == true) {
					return response.obj;
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	
	refresh : function() {
		$('#testVersionInfoTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/testVersionInfo/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit
				}
			},
			responseHandler : function(response) {
				if (response.success == true) {
					return response.obj;
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	
	initValid : function() {
		$('#addTestVersionInfoForm').validate({
			rules : {
			},
			messages : {
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

		$('#updateTestVersionInfoForm').validate({
			rules : {
			},
			messages : {
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
	}
};

$.testVersionInfoUtils.button = {
	add : function() {
		$('#addTestVersionInfoForm div').removeClass('has-error');

		$('#addTestVersionInfoForm').validate().resetForm();

		$('#addTestVersionInfoForm')[0].reset();

    	$("#addTestVersionInfoForm input[name='packagePath']").removeAttr("required");
    	
    	$("#addTestVersionInfoForm input[name='uploadjar']").removeAttr("required");
    	$(".fileerrorTip").html("")
        $(".showFileName").html("");

		$('#addTestVersionInfoDialog').modal('show');
	},
	deleteByPrimaryKey : function (
            id
    ) {

        $("#idForDel").val(id);

		$('#deleteTestVersionInfoDialog').modal('show');

	},
	updateById : function( id,dataNum,jarPath ) {
		$.ajax({
			url : getContextPath() + "/testVersionInfo/selectByPrimaryKey",
			data : {
					id:id
			},
			success : function(response) {
				if (response.success == true) {
					$('#updateTestVersionInfoForm div').removeClass('has-error');
					$('#updateTestVersionInfoForm').validate().resetForm();
					$('#updateTestVersionInfoForm')[0].reset();
					$(".fileerrorTip").html("")
			        $(".showFileName").html("");
					if(response.obj.getinterfaceType == 0){
						$("input[name='updateInterfaceType']:eq(0)").prop("checked",'checked')
					}else{
						$("input[name='updateInterfaceType']:eq(1)").prop("checked",'checked')
					}
					if(response.obj.defaultVersion == 0){
						$("input[name='updatedefaultVersion']:eq(0)").prop("checked",'checked')
					}else{
						$("input[name='updatedefaultVersion']:eq(1)").prop("checked",'checked')
					}
					if(dataNum>0 && jarPath != ''){
						$("#updateJar").css("display","none");
					}else{
						$("#updateJar").css("display","block");
					}
					var data = $.utils.objToJson(response.obj);
					$('#updateTestVersionInfoForm').fill(JSON.parse(data));
					$('#updateTestVersionInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}				
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testVersionInfoTable').bootstrapTable('getAllSelections');
		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}
		for(i=0;i<list.length;i++){
			if(list[i].defaultVersion == 1){
				$.utils.alertWarning("包含默认版本，不能执行批量删除操作");
				return;
			}
		}

		$("#batchTestVersionInfoDialog").modal("show");

	},
	selectByPrimaryKey : function(id,name) {
		$.ajax({
			url : getContextPath() + "/testVersionInfo/selectByPrimaryKey",
			data : {
					id:id
			},
			success : function(response) {
				if (response.success == true) {
					var jarName = $.testVersionInfoUtils.custom.parseJarpath(response.obj.jarPath);
					if(response.obj.getinterfaceType == 0){
						response.obj.getinterfaceType ="扫描jar包"
					}else{
						response.obj.getinterfaceType ="访问接口地址"
					}
					if(response.obj.defaultVersion == 0){
						response.obj.defaultVersion ="非默认上报版本"
					}else{
						response.obj.defaultVersion ="默认上报版本"
					}
					response.obj.jarPath = jarName;
					response.obj.appId = name;
					var data = $.utils.objToJson(response.obj);
					$('#showTestVersionInfoForm')[0].reset();
					$('#showTestVersionInfoForm').fill(JSON.parse(data));
					$('#showTestVersionInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	getAllIntefaceInfo:function(id){
		$("#interfaceTips").modal('show');
		$.ajax({
			url : getContextPath() + "/testVersionInfo/getAllInterfaceInfo",
			method: "post",
		    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		    data:{id:id},
		    success:function(response){
		    	$("#interfaceTips").modal('hide');
		    	if(response.success == true){
		    		$.utils.loadModule("/pages/testInterfaceVersionRel.html");
		    		$("body").removeClass("modal-open");
		    		$(".modal-backdrop.fade.in").remove();
		    		var cc = $(".treeview .choice"); 
		    		$(".treeview .choice").removeClass("choice"); 
		    		cc.next().addClass("choice");
		    		$.testInterfaceVersionRelUtils.submit.search(response.obj.appId,id);
		    	}else{
		    		$.utils.alertWarning(response.errorMessage);
		    	}
		    	
		    }
		})
	}

};

$.testVersionInfoUtils.submit = {
	addTestVersionInfo : function() {
		if ($('#addTestVersionInfoForm').valid()) {
			var appId = $("#addAppId").val() 
			var description =  $("#addTestVersionInfoForm input[name='description']").val()
			var packagePath =  $("#addTestVersionInfoForm input[name='packagePath']").val()
			var version =  $("#addTestVersionInfoForm input[name='version']").val()
			var getinterfaceType =  $("#addTestVersionInfoForm input[type='radio']:checked").val();
			var record = {
					appId:appId,
					description:description,
					packagePath:packagePath,
					version:version,
					getinterfaceType:getinterfaceType,
			}
			console.log(record)
			$.ajaxFileUpload({
	            url : getContextPath() + '/testVersionInfo/insert',
	            data : record,
	            type : 'POST',
	            secureuri : false, // 一般设置为false
	            fileFilter : '.jar',
	            fileElementId : 'uploadjar',
	            dataType : 'json',
	            success : function(response) {
	            	if (response.success == true) {
	            		$("#testVersionInfoTable").bootstrapTable('refresh');
	            		$("#addTestVersionInfoDialog").modal('hide');
	            		$.utils.alertSuccess("新增版本成功");
	            	}else{
	            		$.utils.alertWarning(response.errorMessage)
	            	}
						
	            },
	            error : function() {
	            	$.utils.alertWarning("增加出错");
	            }
	         });
		}
	},
	updateTestVersionInfo : function() {
		$("#updateTestVersionInfoForm input[name='getinterfaceType']").val($('input[name="updateInterfaceType"]:checked').val());
		$("#updateTestVersionInfoForm input[name='defaultVersion']").val($("input[name='updatedefaultVersion']:checked" ).val());
		if ($('#updateTestVersionInfoForm').valid()) {
			var description =  $("#updateTestVersionInfoForm input[name='description']").val()
			var packagePath =  $("#updateTestVersionInfoForm input[name='packagePath']").val()
			var getinterfaceType =  $("#updateTestVersionInfoForm input[name='getinterfaceType']").val();
			var defaultVersion =  $("#updateTestVersionInfoForm input[name='defaultVersion']").val();
			var id =  $("#updateTestVersionInfoForm input[name='id']").val();
			var appId =  $("#updateTestVersionInfoForm input[name='appId']").val();
			var version =  $("#updateTestVersionInfoForm input[name='version']").val();
			var record = {
					id:id,
					appId:appId,
					description:description,
					packagePath:packagePath,
					getinterfaceType:getinterfaceType,
					defaultVersion:defaultVersion,
					version:version
			}
			console.log(record)
			$.ajaxFileUpload({
				url : getContextPath() + '/testVersionInfo/updateByPrimaryKeySelective',
	            data : record,
	            type : 'POST',
	            secureuri : false, // 一般设置为false
	            fileElementId : 'updatejar',
	            dataType : 'json',
	            success : function(response) {
	            	if (response.success == true) {
	            		$("#testVersionInfoTable").bootstrapTable('refresh');
	            		$("#updateTestVersionInfoDialog").modal('hide');
	            		$.utils.alertSuccess("修改成功");
	            	}else{
	            		$.utils.alertWarning(response.errorMessage)
	            	}
						
	            },
	            error : function() {
	            	$.utils.alertWarning("修改出错");
	            }
	         });
		}
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/testVersionInfo/deleteByPrimaryKey', '#deleteTestVersionInfoForm',
				'#deleteTestVersionInfoDialog', '删除出错~', null, '#testVersionInfoTable',
				null, '删除成功~');
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testVersionInfoTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestVersionInfoDialog").modal("show");

	},
	search : function() {
		var fields = $("#searchForm").serializeArray();
		var appId = $("#searchAppId").val();
		var o = {};
		jQuery.each(fields, function(i, fields) {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		$("#testVersionInfoTable").bootstrapTable('destroy');
		// 重新传递查询条件,也可以修改URL
		$("#testVersionInfoTable").bootstrapTable({
			url : getContextPath() + "/testVersionInfo/selectByExample",
			queryParams : function(params) {
				o.offset = params.offset;
				o.pageSize = params.limit;
				o.appId = appId;
				return o;
			},
			responseHandler : function(response) {			
				if (response.success == true) {
					return response.obj;
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});

	},
	batch : function() {
		// 获取全部选择的数据
		var list = $('#testVersionInfoTable').bootstrapTable('getAllSelections');
		var newList = new Array();		
		for (var i = 0; i < list.length; i++) {
			newList.push(list[i].id);
		}
		// 进行Ajax交互处理数据
		$.ajax({
			type : "post",
			url : getContextPath() + "/testVersionInfo/batchDelete",
			dataType : 'json',
			contentType : 'application/json;charset=UTF-8',
			data : JSON.stringify({
				'list' : newList
			}),
			async : false,
			success : function(response) {
				$('#testVersionInfoTable').bootstrapTable('refresh');
				$("#batchTestVersionInfoDialog").modal('hide');
				if (!response.success) {
					$.utils.alertError("批量处理失败");
				} else {
					$.utils.alertSuccess("批量处理成功");
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				$.utils.alertError('AJAX出错');
			}
		});

	}

};

$.testVersionInfoUtils.formatter = {
	operation : function(value, row) {
		var str;
		
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-success' onclick='$.testVersionInfoUtils.button.selectByPrimaryKey(\""
                +row.id
				+ "\", \""+ row.appName +"\")'>查看</button>"
				+ "<button type='button' class='btn btn-primary' onclick='$.testVersionInfoUtils.button.updateById(\""
				+row.id
				+ "\" ,\""+ row.dataNum +"\",\""+row.jarPath +"\")'>修改</button>"
				+ "<button type='button' class='btn btn-danger' onclick='$.testVersionInfoUtils.button.deleteByPrimaryKey(\""
				+row.id;
		if(row.defaultVersion ==1){
			html +="\") ' disabled title='默认启用版本不能删除'>删除</button>"
		}else{
			html +="\")'>删除</button>"
		}
		if(row.dataNum >0){
			str = "重新获取接口信息";
			 html +="<button type='button' class='btn btn-primary' id = 'getinterfacebutton' onclick='$.testVersionInfoUtils.button.getAllIntefaceInfo(\""
					+row.id
	                +"\")'>"+str+"</button>" + "</div>";
		}else{
			str = "获取接口信息";
			 html +="<button type='button' class='btn btn-info' id = 'getinterfacebutton' onclick='$.testVersionInfoUtils.button.getAllIntefaceInfo(\""
					+row.id
	                +"\")'>"+str+"</button>" + "</div>";
		}        
        
		return html;
	}
};

$.testVersionInfoUtils.custom = {
		
		jarpath:function(value){
			var strs= new Array();
			var sUserAgent = navigator.userAgent;
			if(navigator.platform == "Windows" || navigator.platform == "Win32"){
				var strs = value.split("\\");
			}else{
				var strs = value.split("/");
			}
			return strs[strs.length-1];
		},
		getingterfaceType:function(value){
			if(value == 0){
				return "扫描jar包"
			}else{
				return "访问接口地址"
			}
		},
		parseJarpath:function(data){
			var strs= new Array();
			var sUserAgent = navigator.userAgent;
			if(navigator.platform == "Windows" || navigator.platform == "Win32"){
				var strs = data.split("\\");
			}else{
				var strs = data.split("/");
			}
			value = strs[strs.length-1];
			return value;
		},
		getDefaultVersion:function(value){
			if(value == 0){
				return "否"
			}else{
				return "是"
			}
		},
		
		changeRadio:function(formId,radioname){
			$("#"+formId+" input[name='"+radioname+"']").on("change",function(){
			    var radio = $(this);
			    if(radio.val() == 0){
			    	$("#"+formId+" input[name='packagePath']").attr("required", "true");
			    	$("#"+formId+" input[name='uploadjar']").attr("required", "true");
			    }else{
			    	$("#"+formId+" div").removeClass('has-error');
			    	$("#"+formId+" input[name='packagePath']").removeAttr("required");
			    	$("#"+formId+" input[name='uploadjar']").removeAttr("required");
			    }
			});
		},
		uploadFile:function(){
			$(".a-upload").on("change","input[type='file']",function(){
			    var filePath=$(this).val();
			    if(filePath.indexOf(".jar")!=-1){
			        $(".fileerrorTip").html("").hide();
			        var fileName=$.testVersionInfoUtils.custom.parseJarpath(filePath);
			        $("#uploadjar-error").remove()
			        $(".showFileName").html("文件名:"+ fileName);
			    }else{
			        $(".showFileName").html("");
			        $(".fileerrorTip").html("请上传后缀名为.jar的文件").show();
			        return false 
			    }
			})
		}
}



$(document).ready(function() {
	$.testVersionInfoUtils.init();
});


