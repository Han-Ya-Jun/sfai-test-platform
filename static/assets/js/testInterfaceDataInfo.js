var editorRequestAdd;
var editorResponseAdd;
var editorRequestUpdate;
var editorResponseUpdate;

$.testInterfaceDataInfoUtils = {
	init : function() {
		$.testInterfaceDataInfoUtils.initStyle();
		$.testInterfaceDataInfoUtils.initButton();
		/* $.testInterfaceDataInfoUtils.queryList(); */
		$.testInterfaceDataInfoUtils.initValid();
	},

	initStyle : function() {
		
	},

	initButton : function() {
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
		$('#testInterfaceDataInfoTable').bootstrapTable({
			url : getContextPath() + "/testInterfaceDataInfo/selectByExample",
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

	refresh : function(interfaceId) {
		$('#testInterfaceDataInfoTable')
				.bootstrapTable(
						{
							url : getContextPath()
									+ "/testInterfaceDataInfo/selectByInterfaceId?interfaceId="
									+ interfaceId,
							queryParams : function(params) {
								return {
									offset : params.offset,
									pageSize : params.limit,
									interfaceId : interfaceId
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
		$('#addTestInterfaceDataInfoForm').validate({
			rules : {},
			messages : {},
			errorClass : "text-danger",
			errorElement : "span",
			highlight : function(element, errorClass, validClass) {
				$(element).parent().addClass('has-error');
			},
			unhighlight : function(element, errorClass, validClass) {
				$(element).parent().removeClass('has-error');
			}
		});

		$('#updateTestInterfaceDataInfoForm').validate({
			rules : {},
			messages : {},
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
};
$.testInterfaceDataInfoUtils.button = {
	add : function() {
		var interfaceId = document.getElementById("staticInterfaceId").value;
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceVersionRel/selectInterfaceInfoById",
			data : {
				interfaceId : interfaceId
			},
			success : function(response) {
				$('#addTestInterfaceDataInfoForm div').removeClass('has-error');
	
				$('#addTestInterfaceDataInfoForm').validate().resetForm();
	
				$('#addTestInterfaceDataInfoForm')[0].reset();

				$('#addTestInterfaceDataInfoForm').fill(response);
				
				var requestJson = $.utils.jsonFormat(response.requestJson);
				var responseJson = $.utils.jsonFormat(response.responseJson);
				$('#requestJson').val(requestJson);
				$('#responseJson').val(responseJson);
				$('#addTestInterfaceDataInfoDialog').modal('show');
				
				/*防止上次渲染后的缓存，将textarea元素的所有兄弟（之前的渲染结果CodeMirror）元素全删除*/
				$("#requestJson").siblings().remove(); 
				$("#responseJson").siblings().remove(); 
				
				editorRequestAdd = CodeMirror.fromTextArea(document.getElementById("requestJson"), {
					lineNumbers: true,
					matchBrackets: true
				});
				editorResponseAdd = CodeMirror.fromTextArea(document.getElementById("responseJson"), {
					lineNumbers: true,
					matchBrackets: true
				});
				setTimeout(function() {
					editorRequestAdd.refresh();
				},250);
				
				setTimeout(function() {
					editorResponseAdd.refresh();
				},250);
			}
		});
		
	},
	deleteByPrimaryKey : function(id) {

		$("#idForDel").val(id);

		$('#deleteTestInterfaceDataInfoDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceDataInfo/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#updateTestInterfaceDataInfoForm div').removeClass(
							'has-error');
					$('#updateTestInterfaceDataInfoForm').validate().resetForm();
					$('#updateTestInterfaceDataInfoForm')[0].reset();
					$('#updateTestInterfaceDataInfoForm')
							.fill(JSON.parse(data));
					
					var obj = eval('(' + data + ')');
					var requestJson = $.utils.jsonFormat(obj.requestJson);
					var responseJson = $.utils.jsonFormat(obj.responseJson);
					
					$('#requestJsonForUpdate').val(requestJson);
					$('#responseJsonForUpdate').val(responseJson);
					$('#updateTestInterfaceDataInfoDialog').modal('show');
					
					/*防止上次渲染后的缓存，将textarea元素的所有兄弟（之前的渲染结果CodeMirror）元素全删除*/
					$("#requestJsonForUpdate").siblings().remove(); 
					$("#responseJsonForUpdate").siblings().remove(); 
					
					editorRequestUpdate = CodeMirror.fromTextArea(document.getElementById("requestJsonForUpdate"), {
				        lineNumbers: true,
				        matchBrackets: true
				      });
					editorResponseUpdate = CodeMirror.fromTextArea(document.getElementById("responseJsonForUpdate"), {
				        lineNumbers: true,
				        matchBrackets: true
				      });
					
					/*设置定时，让渲染效果后面延迟刷新，否则页面没有渲染效果*/
					setTimeout(function() {
						editorRequestUpdate.refresh();
					},250);
					setTimeout(function() {
						editorResponseUpdate.refresh();
					},250);
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testInterfaceDataInfoTable').bootstrapTable(
				'getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestInterfaceDataInfoDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceDataInfo/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#showTestInterfaceDataInfoForm')[0].reset();
					$('#showTestInterfaceDataInfoForm').fill(JSON.parse(data));
					$('#showTestInterfaceDataInfoDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	selectByInterfaceId : function(interfaceId) {
		$('#testInterfaceDataInfoTable')
				.bootstrapTable(
						{
							url : getContextPath()
									+ "/testInterfaceDataInfo/selectByInterfaceId?interfaceId="
									+ interfaceId,
							queryParams : function(params) {
								return {
									offset : params.offset,
									pageSize : params.limit,
									interfaceId : interfaceId
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
		$("#staticInterfaceId").val(interfaceId);
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceDataInfo/selectInterfaceAddressById",
			data : {
				interfaceId : interfaceId
			},
			async : false,
			success : function(response) {
				var obj = document.getElementById("interfaceAddress");
				obj.innerHTML = response.appName + " > " + response.version
						+ " > " + response.clsName + " > "
						+ response.methodName;
			}
		});
	},
	
	changeMockDefault : function(id, mockDefault){
		var param = mockDefault;
		if (mockDefault == 1){
			param = 0;
		} else {
			param = 1;
		}
		$("#idForChange").val(id);
		$("#mockDefaultForChange").val(param);

		$('#changeMockDefaultDialog').modal('show');
	}
};

$.testInterfaceDataInfoUtils.submit = {
	addTestInterfaceDataInfo : function() {
		$('#requestJson').val(editorRequestAdd.getValue());
		$('#responseJson').val(editorResponseAdd.getValue());
		if ($('#addTestInterfaceDataInfoForm').valid()) {
			$.utils.submit('/testInterfaceDataInfo/insert',
					'#addTestInterfaceDataInfoForm',
					'#addTestInterfaceDataInfoDialog', '新增出错~', null,
					'#testInterfaceDataInfoTable', null, '新增成功~');
		};
	},
	updateTestInterfaceDataInfo : function() {
		$('#requestJsonForUpdate').val(editorRequestUpdate.getValue());
		$('#responseJsonForUpdate').val(editorResponseUpdate.getValue());
		if ($('#updateTestInterfaceDataInfoForm').valid()) {
			$.utils.submit(
					'/testInterfaceDataInfo/updateByPrimaryKeySelective',
					'#updateTestInterfaceDataInfoForm',
					'#updateTestInterfaceDataInfoDialog', '修改出错~', null,
					'#testInterfaceDataInfoTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/testInterfaceDataInfo/deleteByPrimaryKey',
				'#deleteTestInterfaceDataInfoForm',
				'#deleteTestInterfaceDataInfoDialog', '修改出错~', null,
				'#testInterfaceDataInfoTable', null, '修改成功~');
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testInterfaceDataInfoTable').bootstrapTable(
				'getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestInterfaceDataInfoDialog").modal("show");

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
		$("#testInterfaceDataInfoTable").bootstrapTable('destroy');
		// 重新传递查询条件,也可以修改URL
		$("#testInterfaceDataInfoTable").bootstrapTable({
			url : getContextPath() + "/testInterfaceDataInfo/selectByExample",
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
		var list = $('#testInterfaceDataInfoTable').bootstrapTable(
				'getAllSelections');
		var newList = new Array();
		for (var i = 0; i < list.length; i++) {
			newList.push(list[i].id);
		}
		// 进行Ajax交互处理数据
		$.ajax({
			type : "post",
			url : getContextPath() + "/testInterfaceDataInfo/batchDelete",
			dataType : 'json',
			contentType : 'application/json;charset=UTF-8',
			data : JSON.stringify({
				'list' : newList
			}),
			async : false,
			success : function(response) {
				$('#testInterfaceDataInfoTable').bootstrapTable('refresh');
				$("#batchTestInterfaceDataInfoDialog").modal('hide');
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

	},
	
	changeMockDefaultById : function() {
		var id = $("#idForChange").val();
		var mockDefault = $("#mockDefaultForChange").val();
		
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceDataInfo/changeMockDefaultById",
			data : {
				id : id,
				mockDefault : mockDefault
			},
			success : function(response) {
				$('#testInterfaceDataInfoTable').bootstrapTable('refresh');
				$('#changeMockDefaultDialog').modal('hide');
			}
		});
	}

};

$.testInterfaceDataInfoUtils.formatter = {
	requestType : function(value, row) {
		if (row.requestType == 0) {
			return "<div class='btn-toolbar' role='toolbar'>上报</div>";
		} else if (row.requestType == 1) {
			return "<div class='btn-toolbar' role='toolbar'>手动输入</div>";
		} else {
			return "<div class='btn-toolbar' role='toolbar'>未知类型</div>";
		}
	},

	mockDefault : function(value, row) {
		var mockDefault = row.mockDefault;
		var html =  "<div class='btn-toolbar' role='toolbar'><input type='checkbox'" ;
		if(mockDefault == 1) {
			html += "checked='checked' disabled ";
		}else {
			html += "onclick=\"$.testInterfaceDataInfoUtils.button.changeMockDefault('" + row.id + "','" + mockDefault + "')\"";
		}
		html += "/></div>"
		return html;
	},

	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-primary' onclick='$.testInterfaceDataInfoUtils.button.updateById(\""
				+ row.id
				+ "\")'>修改</button>"
				+ "<button type='button' class='btn btn-danger' onclick='$.testInterfaceDataInfoUtils.button.deleteByPrimaryKey(\""
				+ row.id + "\")'>删除</button>" + "</div>";
		return html;
	}
};

$(document).ready(function() {
	$.testInterfaceDataInfoUtils.init();
});
