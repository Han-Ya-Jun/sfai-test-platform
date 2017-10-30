$.testInterfaceVersionRelUtils = {
	init : function() {
		$.testInterfaceVersionRelUtils.initStyle();
		$.testInterfaceVersionRelUtils.initButton();
		$.testInterfaceVersionRelUtils.queryList();
		$.testInterfaceVersionRelUtils.initValid();
		$.testInterfaceVersionRelUtils.custom.appSelect();
		$.testInterfaceVersionRelUtils.custom.versionSelect(-1);
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
		$('#testInterfaceVersionRelTable').bootstrapTable(
				{
					url : getContextPath()
							+ "/testInterfaceVersionRel/selectDetailByExample",
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
		$('#testInterfaceVersionRelTable').bootstrapTable(
				'refreshOptions',
				{
					url : getContextPath()
							+ "/testInterfaceVersionRel/selectDetailByExample",
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
		$('#addTestInterfaceVersionRelForm').validate({
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

		$('#updateTestInterfaceVersionRelForm').validate({
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
	}
};

$.testInterfaceVersionRelUtils.button = {
	add : function() {
		$('#addTestInterfaceVersionRelForm div').removeClass('has-error');

		$('#addTestInterfaceVersionRelForm').validate().resetForm();

		$('#addTestInterfaceVersionRelForm')[0].reset();

		$('#addTestInterfaceVersionRelDialog').modal('show');
	},
	deleteByPrimaryKey : function(id) {

		$("#idForDel").val(id);

		$('#deleteTestInterfaceVersionRelDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceVersionRel/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#updateTestInterfaceVersionRelForm div').removeClass(
							'has-error');
					$('#updateTestInterfaceVersionRelForm').validate()
							.resetForm();
					$('#updateTestInterfaceVersionRelForm')[0].reset();
					$('#updateTestInterfaceVersionRelForm').fill(
							JSON.parse(data));
					$('#updateTestInterfaceVersionRelDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testInterfaceVersionRelTable').bootstrapTable(
				'getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestInterfaceVersionRelDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceVersionRel/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (response.success == true) {
					var data = $.utils.objToJson(response.obj);
					$('#showTestInterfaceVersionRelForm')[0].reset();
					$('#showTestInterfaceVersionRelForm')
							.fill(JSON.parse(data));
					$('#showTestInterfaceVersionRelDialog').modal('show');
				} else {
					$.utils.alertWarning(response.errorMessage);
				}
			}
		});
	},
	
	changeMockFlag : function(id, mockFlag){
		var param = mockFlag;
		if (mockFlag == 1){
			param = 0;
		} else {
			param = 1;
		}
		$("#idForChange").val(id);
		$("#mockFlagForChange").val(param);

		$('#changeMockFlagDialog').modal('show');
	}

};

$.testInterfaceVersionRelUtils.a = {
	showRequestJson : function(requestJson) {
		var result = requestJson.replace(/\“/g, "\"");
		$.testInterfaceVersionRelUtils.custom.formaterJson(result, "#requestJsonFormattered");
		$("#requestJsonFormattered").val(result);
		$('#showRequestJsonDialog').modal('show');
	},

	showResponseJson : function(responseJson) {
		var result = responseJson.replace(/\“/g, "\"");
		$.testInterfaceVersionRelUtils.custom.formaterJson(result, "#responseJsonFormattered");
		$("#responseJsonFormattered").val(result);
		$('#showResponseJsonDialog').modal('show');
	}
};

$.testInterfaceVersionRelUtils.submit = {
	addTestInterfaceVersionRel : function() {
		if ($('#addTestInterfaceVersionRelForm').valid()) {
			$.utils.submit('/testInterfaceVersionRel/insert',
					'#addTestInterfaceVersionRelForm',
					'#addTestInterfaceVersionRelDialog', '新增出错~', null,
					'#testInterfaceVersionRelTable', null, '新增成功~');
		}
	},
	updateTestInterfaceVersionRel : function() {
		if ($('#updateTestInterfaceVersionRelForm').valid()) {
			$.utils.submit(
					'/testInterfaceVersionRel/updateByPrimaryKeySelective',
					'#updateTestInterfaceVersionRelForm',
					'#updateTestInterfaceVersionRelDialog', '修改出错~', null,
					'#testInterfaceVersionRelTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/testInterfaceVersionRel/deleteByPrimaryKey',
				'#deleteTestInterfaceVersionRelForm',
				'#deleteTestInterfaceVersionRelDialog', '修改出错~', null,
				'#testInterfaceVersionRelTable', null, '修改成功~');
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#testInterfaceVersionRelTable').bootstrapTable(
				'getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchTestInterfaceVersionRelDialog").modal("show");

	},
	search : function(appId,versionId) {
		var fields = $("#searchForm").serializeArray();
		appId = appId==null?$('#appSelect').val():appId;
	    versionId = versionId==null?$('#versionSelect').val():versionId;
		var clsName = $('#clsName').val();
		var methodName = $('#methodName').val();
		var requestType = $('#requestType').val();
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
		$("#testInterfaceVersionRelTable").bootstrapTable('destroy');
		$("#testInterfaceVersionRelTable").bootstrapTable(
				{
					url : getContextPath()
							+ "/testInterfaceVersionRel/searchByExample",
					queryParams : function(params) {
						o.offset = params.offset;
						o.pageSize = params.limit;
						o.appId = appId;
						o.versionId = versionId;
						o.clsName = clsName;
						o.methodName = methodName;
						o.requestType = requestType;
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
		var list = $('#testInterfaceVersionRelTable').bootstrapTable(
				'getAllSelections');
		var newList = new Array();
		for (var i = 0; i < list.length; i++) {
			newList.push(list[i].id);
		}
		// 进行Ajax交互处理数据
		$.ajax({
			type : "post",
			url : getContextPath() + "/testInterfaceVersionRel/batchDelete",
			dataType : 'json',
			contentType : 'application/json;charset=UTF-8',
			data : JSON.stringify({
				'list' : newList
			}),
			async : false,
			success : function(response) {
				$('#testInterfaceVersionRelTable').bootstrapTable('refresh');
				$("#batchTestInterfaceVersionRelDialog").modal('hide');
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
	
	changeMockFlagById : function() {
		var id = $("#idForChange").val();
		var mockFlag = $("#mockFlagForChange").val();
		
		$.ajax({
			url : getContextPath()
					+ "/testInterfaceVersionRel/updateByPrimaryKey",
			data : {
				id : id,
				mockFlag : mockFlag
			},
			success : function(response) {
				$('#testInterfaceVersionRelTable').bootstrapTable('refresh');
				$('#changeMockFlagDialog').modal('hide');
			}
		});
	}

};

$.testInterfaceVersionRelUtils.formatter = {

	requestType : function(value, row) {
		if (row.requestType == 0) {
			return "<div class='btn-toolbar' role='toolbar'>http请求</div>";
		} else if (row.requestType == 1) {
			return "<div class='btn-toolbar' role='toolbar'>rpc请求</div>";
		} else {
			return "<div class='btn-toolbar' role='toolbar'>未知请求</div>";
		}
	},

	requestJson : function(value, row) {
		var result = row.requestJson;
		result = result.replace(/\"/g, "“");
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<a onclick=\"$.testInterfaceVersionRelUtils.a.showRequestJson('"
				+ result + "')\" style=\"cursor:pointer\">显示详情</a></div>";
		return html;
	},

	responseJson : function(value, row) {
		var result = row.responseJson;
		result = result.replace(/\"/g, "“");
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<a onclick=\"$.testInterfaceVersionRelUtils.a.showResponseJson('"
				+ result + "')\" style=\"cursor:pointer\">显示详情</a></div>";
		return html;
	},
	
	mockFlag : function(value, row) {
		var mockFlag = row.mockFlag;
		var appMockFlag = row.appMockFlag;
		var html =  "<div class='btn-toolbar' role='toolbar'><input type='checkbox'" ;
		if(appMockFlag == 1){
			if(mockFlag == 1) {
				html += "checked='checked' ";
			}
			html += "onclick=\"$.testInterfaceVersionRelUtils.button.changeMockFlag('" + row.id + "','" + mockFlag + "')\"";
		}else{
			html += "title='请先开启应用mock' disabled";
		}
		html += "/></div>";
		return html;
	},

	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-danger' onclick='$.testInterfaceVersionRelUtils.custom.paramsSetting(\"/pages/testInterfaceDataInfo.html\","
				+ row.id + ")'>参数设置</button></div>";
		return html;
	}
};

$.testInterfaceVersionRelUtils.custom = {
		appSelect : function() {
			var select = $("#appSelect").select2({
				placeholder : "默认全部",
				language : "zh-CN",
				ajax : {
					url : getContextPath() + "/testAppInfo/selectAllAppForCombo",
					dataType : "json",
					type : "POST",
					data : function(para) {
						para.term = "";
						return para;
					},
					processResults : function(data) {
						return {
							results : data
						}
					},
					cache : true
				},
				//minimumResultsForSearch : Infinity,
				escapeMarkup : function(markup) {
					return markup;
				},
				templateResult : function(repo) {
					var markup = "<div class='select2-results__options'>" + repo.text + "</div>";
					return markup;
				},
				templateSelection : function(repo) {
					return repo.name || repo.text;
				}
			}).on('select2:select', function(evt) {
				var appId = evt.params.data.id;
				$.testInterfaceVersionRelUtils.custom.versionSelect(appId);
			});
		},
		
		versionSelect : function(appId) {
			var select = $("#versionSelect").select2({
				placeholder : "默认全部",
				language : "zh-CN",
				ajax : {
					url : getContextPath() + "/testVersionInfo/selectVersionForCombo",
					dataType : "json",
					type : "POST",
					data : {
						appId : appId
					},
					processResults : function(data) {
						return {
							results : data
						}
					},
					cache : true
				},
				//minimumResultsForSearch : Infinity,
				escapeMarkup : function(markup) {
					return markup;
				},
				templateResult : function(repo) {
					var markup = "<div class='select2-results__options'>" + repo.text + "</div>";
					return markup;
				},
				templateSelection : function(repo) {
					return repo.name || repo.text;
				}
			});
		},
		
		paramsSetting : function (path, id) {
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
			$.testInterfaceDataInfoUtils.button.selectByInterfaceId(id);
		},
		
		formaterJson : function (json, jsonTextarea){
			try{
				var input = eval('(' + json + ')');
			} catch (error){
				return alert("Cannot eval JSON:" + error);
			}
			
			var options = {
				collapsed : false,
				withQuotes : true
			}
			$(jsonTextarea).jsonViewer(input, options);
		}
};

$(document).ready(function() {
	$.testInterfaceVersionRelUtils.init();
});

/**
 * 根据应用，初始化数据源列表
 */
function initDBSourceSelect(dbAppName, dbSource) {
	if (null == dbAppName || dbAppName == "") {
		dbAppName = $('#dbAppSelect').val();
	}
	$('#sqlSelect').empty().trigger('change');
	var datas;
	$.ajax({
		url : getContextPath() + "/common/getDBSourceList",
		dataType : 'json',
		async : false,
		data : {
			appName : dbAppName
		},
		success : function(data) {
			datas = data.data;
		},
		cache : true
	});
	var select = $('#databaseSelect').select2({
		placeholder : '默认全部',
		ajax : {
			url : getContextPath() + "/common/getDBSourceList",
			dataType : 'json',
			data : function(term) {
				term.appName = dbAppName;
				return term;
			},
			processResults : function(data) {
				return {
					results : data.data
				}
			},
			cache : true
		},
		data : datas,
		templateResult : formatRepo,
		templateSelection : formatRepoDBSource,
		escapeMarkup : function(markup) {
			return markup;
		}
	}).on('select2:select', function(evt) {
		var dbAppName = $('#dbAppSelect').val();
		var databaseName = $('#databaseSelect').val();
		initSQLSelect(dbAppName, databaseName);
	});

	if (dbSource && dbSource != "") {
		var $option = $("<option selected>" + dbSource + "</option>").val(
				dbSource);
		select.append($option).trigger('change').trigger("select2:select");
	} else {
		select.val(datas[0].id).trigger("change").trigger("select2:select");
	}
}
