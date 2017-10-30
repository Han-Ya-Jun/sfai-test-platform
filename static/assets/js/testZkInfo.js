$.testZkInfoUtils = {
	init : function() {
		$.testZkInfoUtils.initStyle();
		$.testZkInfoUtils.initButton();
		$.testZkInfoUtils.queryList();
		$.testZkInfoUtils.initValid();
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
		$('#testZkInfoTable').bootstrapTable({
			url : getContextPath() + "/testZkInfo/selectByExample",
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
					return response.obj;
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	
	refresh : function() {
		$('#testZkInfoTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/testZkInfo/selectByExample",
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
		$('#addTestZkInfoForm').validate({
			rules : {
                            id : "required",
			},
			messages : {
                        id : "请输入主键!",
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

		$('#updateTestZkInfoForm').validate({
			rules : {
                            id : "required",
			},
			messages : {
                        id : "请输入主键!",
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

$.testZkInfoUtils.button = {
	add : function() {
		$('#addTestZkInfoForm div').removeClass('has-error');

		$('#addTestZkInfoForm').validate().resetForm();

		$('#addTestZkInfoForm')[0].reset();

		$('#addTestZkInfoDialog').modal('show');
	},
	deleteByPrimaryKey : function (
            id
    ) {

        $("#idForDel").val(id);

		$('#deleteTestZkInfoDialog').modal('show');

	},
	updateById : function( 
            id
    ) {
		$.ajax({
			url : getContextPath() + "/testZkInfo/selectByPrimaryKey",
			data : {
					id:id
			},
			success : function(response) {			
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#updateTestZkInfoForm div').removeClass('has-error');
					$('#updateTestZkInfoForm').validate().resetForm();
					$('#updateTestZkInfoForm')[0].reset();
					$('#updateTestZkInfoForm').fill(JSON.parse(data));
					$('#updateTestZkInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}				
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testZkInfoTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestZkInfoDialog").modal("show");

	},
	selectByPrimaryKey : function(
            id
	) {
		$.ajax({
			url : getContextPath() + "/testZkInfo/selectByPrimaryKey",
			data : {
					id:id
			},
			success : function(response) {
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#showTestZkInfoForm')[0].reset();
					$('#showTestZkInfoForm').fill(JSON.parse(data));
					$('#showTestZkInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	}

};

$.testZkInfoUtils.submit = {
	addTestZkInfo : function() {
		if ($('#addTestZkInfoForm').valid()) {
			$.utils.submit('/testZkInfo/insert', '#addTestZkInfoForm','#addTestZkInfoDialog', '新增出错~', null, '#testZkInfoTable',
					null, '新增成功~');
		}
	},
	updateTestZkInfo : function() {
		if ($('#updateTestZkInfoForm').valid()) {
			$.utils.submit('/testZkInfo/updateByPrimaryKeySelective','#updateTestZkInfoForm', '#updateTestZkInfoDialog', '修改出错~',
					null, '#testZkInfoTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/testZkInfo/deleteByPrimaryKey', '#deleteTestZkInfoForm',
				'#deleteTestZkInfoDialog', '修改出错~', null, '#testZkInfoTable',
				null, '修改成功~');
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testZkInfoTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestZkInfoDialog").modal("show");

	},
	search : function() {
		var fields = $("#searchForm").serializeArray();
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
		$("#testZkInfoTable").bootstrapTable('destroy');
		// 重新传递查询条件,也可以修改URL
		$("#testZkInfoTable").bootstrapTable({
			url : getContextPath() + "/testZkInfo/selectByExample",
			queryParams : function(params) {
				o.offset = params.offset;
				o.pageSize = params.limit;
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
		var list = $('#testZkInfoTable').bootstrapTable('getAllSelections');
		var newList = new Array();		
		for (var i = 0; i < list.length; i++) {
			newList.push(list[i].id);
		}
		// 进行Ajax交互处理数据
		$.ajax({
			type : "post",
			url : getContextPath() + "/testZkInfo/batchDelete",
			dataType : 'json',
			contentType : 'application/json;charset=UTF-8',
			data : JSON.stringify({
				'list' : newList
			}),
			async : false,
			success : function(response) {
				$('#testZkInfoTable').bootstrapTable('refresh');
				$("#batchTestZkInfoDialog").modal('hide');
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

$.testZkInfoUtils.formatter = {
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-success' onclick='$.testZkInfoUtils.button.selectByPrimaryKey(\""
                +row.id
				+ "\")'>查看</button>"
				+ "<button type='button' class='btn btn-primary' onclick='$.testZkInfoUtils.button.updateById(\""
				+row.id
				+ "\")'>修改</button>"
				+ "<button type='button' class='btn btn-danger' onclick='$.testZkInfoUtils.button.deleteByPrimaryKey(\""
				+row.id
                +
				"\")'>删除</button>" + "</div>";
		return html;
	}
};

$(document).ready(function() {
	$.testZkInfoUtils.init();
});
