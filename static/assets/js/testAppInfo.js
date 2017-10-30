$.testAppInfoUtils = {
	init : function() {
		$.testAppInfoUtils.initStyle();
		$.testAppInfoUtils.initButton();
		$.testAppInfoUtils.queryList();
		$.testAppInfoUtils.initValid();
		$.testAppInfoUtils.custom.validateAppName();
		$.testAppInfoUtils.custom.addHttpRequestPath();
		$.testAppInfoUtils.custom.updateHttpRequestPath();
		$.utils.searchApp("searchAppName","searchAppId","/testVersionInfo/getAllApp");
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
		$('#testAppInfoTable').bootstrapTable({
			url : getContextPath() + "/testAppInfo/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit
					// 对象查询相关可以从此处传递值,具体实现需自行编码
					// 例如: id:id
				}
			},
			responseHandler : function(response) {
				if (response.success == true) {
					console.log(response.obj)
					return response.obj;
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	
	refresh : function() {
		$('#testAppInfoTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/testAppInfo/selectByExample",
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
		$('#addTestAppInfoForm').validate({
			rules : {
                            appName : "required",
			},
			messages : {
                        appName : "请输入应用名!",
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

		$('#updateTestAppInfoForm').validate({
			rules : {
                            appName : "required",
			},
			messages : {
                        appName : "请输入应用名!",
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
	
	reportFlag:function(value){
		if(value ==0){
			return "否"
		}else{
			return "是"
		}
	},
	mockFlag:function(value){
		if(value ==0){
			return "否"
		}else{
			return "是"
		}
	}
};

$.testAppInfoUtils.button = {
	add : function() {
		$('#addTestAppInfoForm div').removeClass('has-error');

		$('#addTestAppInfoForm').validate().resetForm();

		$('#addTestAppInfoForm')[0].reset();
		$("#appNameError").css("display","none")

		$('#addTestAppInfoDialog').modal('show');
	},
	deleteByPrimaryKey : function (id) {

        $("#idForDel").val(id);

		$('#deleteTestAppInfoDialog').modal('show');

	},
	updateById : function( 
            id
    ) {
		$.ajax({
			url : getContextPath() + "/testAppInfo/selectByPrimaryKey",
			data : {
					id:id
			},
			success : function(response) {			
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#updateTestAppInfoForm div').removeClass('has-error');
					$('#updateTestAppInfoForm').validate().resetForm();
					$('#updateTestAppInfoForm')[0].reset();
					if(response.obj.reportFlag == 0){
						$("input[name='updatereportFlag']:eq(0)").prop("checked",'checked')
					}else{
						$("input[name='updatereportFlag']:eq(1)").prop("checked",'checked')
					}
					if(response.obj.mockFlag == 0){
						$("input[name='updatemockFlag']:eq(0)").prop("checked",'checked')
					}else{
						$("input[name='updatemockFlag']:eq(1)").prop("checked",'checked')
					}
					$('#updateTestAppInfoForm').fill(JSON.parse(data));
					$('#updateTestAppInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}				
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testAppInfoTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestAppInfoDialog").modal("show");

	},
	selectByPrimaryKey : function(
            id
	) {
		$.ajax({
			url : getContextPath() + "/testAppInfo/selectByPrimaryKey",
			data : {
					id:id
			},
			success : function(response) {
				if (response.success == true) {
					if(response.obj.reportFlag == 1){
						response.obj.reportFlag = "是"
					}else{
						response.obj.reportFlag = "否"
					}
					var data = $.utils.objToJson(response.obj);
					$('#showTestAppInfoForm')[0].reset();
					$('#showTestAppInfoForm').fill(JSON.parse(data));
					$('#showTestAppInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	}

};

$.testAppInfoUtils.submit = {
	addTestAppInfo : function() {
		if ($('#addTestAppInfoForm').valid() &&$("#appNameError").css("display") == "none") {
			$.utils.submit('/testAppInfo/insert', '#addTestAppInfoForm','#addTestAppInfoDialog', '新增出错~', null, '#testAppInfoTable',
					null, '新增成功~');
		}
	},
	updateTestAppInfo : function() {
		$("#updateTestAppInfoForm input[name='reportFlag']").val($("input[name='updatereportFlag']:checked" ).val());
		$("#updateTestAppInfoForm input[name='mockFlag']").val($("input[name='updatemockFlag']:checked" ).val());
		if ($('#updateTestAppInfoForm').valid()) {
			$.utils.submit('/testAppInfo/updateByPrimaryKeySelective','#updateTestAppInfoForm', '#updateTestAppInfoDialog', '修改出错~',
					null, '#testAppInfoTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/testAppInfo/deleteByPrimaryKey', '#deleteTestAppInfoForm',
				'#deleteTestAppInfoDialog', '修改出错~', null, '#testAppInfoTable',
				null, '修改成功~');
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testAppInfoTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestAppInfoDialog").modal("show");

	},
	search : function() {
		var appId = $("#searchAppId").val();
		var o = {};
		$("#testAppInfoTable").bootstrapTable('destroy');
		// 重新传递查询条件,也可以修改URL
		$("#testAppInfoTable").bootstrapTable({
			url : getContextPath() + "/testAppInfo/selectByExample",
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
		var list = $('#testAppInfoTable').bootstrapTable('getAllSelections');
		var newList = new Array();		
		for (var i = 0; i < list.length; i++) {
			newList.push(list[i].id);
		}
		// 进行Ajax交互处理数据
		$.ajax({
			type : "post",
			url : getContextPath() + "/testAppInfo/batchDelete",
			dataType : 'json',
			contentType : 'application/json;charset=UTF-8',
			data : JSON.stringify({
				'list' : newList
			}),
			async : false,
			success : function(response) {
				$('#testAppInfoTable').bootstrapTable('refresh');
				$("#batchTestAppInfoDialog").modal('hide');
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

$.testAppInfoUtils.formatter = {
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-success' onclick='$.testAppInfoUtils.button.selectByPrimaryKey(\""
                +row.id
				+ "\")'>查看</button>"
				+ "<button type='button' class='btn btn-primary' onclick='$.testAppInfoUtils.button.updateById(\""
				+row.id
				+ "\")'>修改</button>"
				+ "<button type='button' class='btn btn-danger' onclick='$.testAppInfoUtils.button.deleteByPrimaryKey(\""
				+row.id
                +
				"\")'>删除</button>" + "</div>";
		return html;
	}
};

$.testAppInfoUtils.custom = {
		validateAppName: function () {
			 $("#addTestAppInfoForm input[name ='appName']").keyup(function(){
	               var regExp = /[A-Za-z]$/;
	               if(!regExp.test($(this).val()) && ($(this).val().trim()!='')){
	            	   $("#appNameError").css("display","block")
	               }else{
	            	   $("#appNameError").css("display","none")
	               }
	       })
		},
		addHttpRequestPath:function(){
			 $("#addTestAppInfoForm textarea[name ='httpUrl']").keyup(function(){
				 if( $(this).val().trim() !=""){
					 $("#addTestAppInfoForm textarea[name ='httpJsonurl']").val( $(this).val()+"/mockBaseCltInfoService/getScanList");
				 }else{
					 $("#addTestAppInfoForm textarea[name ='httpJsonurl']").val('')
				 }
			 });
		},
		updateHttpRequestPath:function(){
			 $("#updateTestAppInfoDialog textarea[name ='httpUrl']").keyup(function(){
				$("#updateTestAppInfoDialog textarea[name ='httpJsonurl']").val($(this).val()+"/mockBaseCltInfoService/getScanList");
			 });
		},
		checkReprotAndMock : function(radioName1, radioName2){
			$("#"+radioName2+"No").prop('checked',true);
		}
}

$(document).ready(function() {
	$.testAppInfoUtils.init();
});
