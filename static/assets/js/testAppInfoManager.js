/**
 * 所有其他类型的方法
 * 
 * @type {{init: $.testAppInfoManagerUtils.init, queryList: $.testAppInfoManagerUtils.queryList}}
 */
$.testAppInfoManagerUtils = {
	init : function() {
		$.testAppInfoManagerUtils.queryList();
		$.testAppInfoManagerUtils.initValid();
		$.testAppInfoManagerUtils.custom.appSelect();
	},
	queryList : function() {

		$('#testAppInfoManagerTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/resource/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit
				// 对象查询相关可以从此处传递值,具体实现需自行编码
				// 例如: id:id

				}
			},
			responseHandler : function(response) {
				return response.obj;
			}
		});
	},
	initValid : function() {

		$('#addResourceForm').validate({
			rules : {
				sysResourceName : {
					required : true,
				},
				sysResourcePath : {
					required : true,
				}
			},
			messages : {
				sysResourceName : {
					required : "资源名不能为空",
				},
				sysResourcePath : {
					required : "资源url不能为空",
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

		$('#updateResourceForm').validate({
			rules : {
				sysResourceName : {
					required : true,
				},
				sysResourcePath : {
					required : true,
				}
			},
			messages : {
				sysResourceName : {
					required : "资源名不能为空",
				},
				sysResourcePath : {
					required : "资源url不能为空",
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

	}
};

/**
 * 所有非后台交互的按钮产生的动作方法
 * 
 * @type {{deleteById: $.testAppInfoManagerUtils.button.deleteById, updateById:
 *       $.testAppInfoManagerUtils.button.updateById, deleteBatch:
 *       $.testAppInfoManagerUtils.button.deleteBatch}}
 */
$.testAppInfoManagerUtils.button = {
	add : function() {

		$('#addResourceForm div').removeClass('has-error');

		$('#addResourceForm').validate().resetForm();

		$('#addResourceForm')[0].reset();

		$('#addResourceDialog').modal('show');
	},
	deleteByPrimaryKey : function(id) {
		$("#idForDel").val(id);

		$('#deleteinterfaceTreeDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath() + "/resource/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#updateResourceForm div').removeClass('has-error');

					$('#updateResourceForm').validate().resetForm();

					$('#updateResourceForm')[0].reset();

					$('#updateResourceForm').fill(JSON.parse(data));

					$('#updateResourceDialog').modal('show');
				}
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#resourceTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchResourceDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath() + "/resource/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (response.code != '000') {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.message);
				} else {
					var data = $.utils.objToJson(response.data);

					$('#showResourceForm')[0].reset();

					$('#showResourceForm').fill(JSON.parse(data));

					$('#showResourceDialog').modal('show');
				}

			}
		});
	}

};

/**
 * 所有直接通过操作与后台进行交互的方法
 * 
 * @type {{addResource: $.testAppInfoManagerUtils.submit.addResource, updateABC:
 *       $.testAppInfoManagerUtils.submit.updateResource, deleteById:
 *       $.testAppInfoManagerUtils.submit.deleteById, search:
 *       $.testAppInfoManagerUtils.submit.search, batch: $.testAppInfoManagerUtils.submit.batch}}
 */
$.testAppInfoManagerUtils.submit = {
	addResource : function() {
		if ($('#addResourceForm').valid()) {
			$.utils.submit('/resource/insert', '#addResourceForm',
					'#addinterfaceTreeDialog', '新增出错~', null, '#resourceTable',
					null, '新增成功~');
			$.resource.refreshTree();
		}
		$.resource.refreshTree();
	},
	updateResource : function() {
		if ($('#updateResourceForm').valid()) {
			$.utils.submit('/resource/updateByPrimaryKeySelective',
					'#updateResourceForm', '#updateResourceDialog', '修改出错~',
					null, '#resourceTable', null, '修改成功~');
		}
	},
	addIcon : function() {
		var $selectedvalue = $("input[name='icon']:checked").val();
		$("#icon").attr("class", $selectedvalue);
		$("#editicon").attr("class", $selectedvalue);
		$("#subIcon").val($selectedvalue);
		$("#editIcon").val($selectedvalue);
		$("#selecticon").modal("hide");
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/resource/deleteByPrimaryKey', '#deleteResourceForm',
				'#deleteinterfaceTreeDialog', '删除出错~', null, '#resourceTable',
				null, '删除成功~');
		$.utils.initMenu();
	},
	search : function() {

		$("#resourceTable").bootstrapTable('removeAll');

		// 重新传递查询条件,也可以修改URL
		$("#resourceTable").bootstrapTable('refreshOptions', {
			url : getContextPath() + "/resource/selectByPrimaryKey",
			queryParams : function(params) {
				return $("#searchForm").serialize();

			},
			responseHandler : function(response) {

				return {
					rows : new Array(response.data),
					totalRecord : 1
				}
			}
		});

	},
	batch : function() {
		// 获取全部选择的数据
		var list = $('#resourceTable').bootstrapTable('getAllSelections');
		// 进行Ajax交互处理数据
	}

};

/**
 * 所有额外处理格式化的方法
 * 
 * @type {{operation: $.testAppInfoManagerUtils.formatter.operation}}
 */
$.testAppInfoManagerUtils.formatter = {
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-info' onclick='$.testAppInfoManagerUtils.button.selectByPrimaryKey("
				+ row.id + ")'>查看</button>" + "</div>";
		var obj = {
			'id' : row.id,
			'fid' : row.sysResourceUid
		};
		return html;
	}
};

$.testAppInfoManager = {
	interfaceTree : null,
	saveResourceId : "",
	init : function() {
		this.interfaceTree = this.initinterfaceTree();
	},
	initinterfaceTree : function() {
		var zTreeObj;
		var nodes;
		$.ajax({
			url : getContextPath() + "/resource/getResourceList",
			async : false,
			success : function(response) {
				if (response.obj == null) {
					$.utils.alertError('返回空数据');
				} else {
					nodes = response.obj;
				}
			}
		});
		// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
		var setting = {
			check : {
				enable : false,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "ps"
				}
			},
			edit : {
				enable : true,
				showRemoveBtn : this.showRemoveBtn,
				showRenameBtn : true,
				removeTitle : "删除节点",
				renameTitle : "修改节点"
			},
			callback : {
				beforeEditName : this.editResource,
				beforeRemove : this.removeResource
			},
			view : {
				addHoverDom : this.addHoverDom,
				removeHoverDom : this.removeHoverDom
			}
		};
		zTreeObj = $.fn.zTree.init($("#interfaceTree"), setting, nodes);
		return zTreeObj;
	},
	refreshTree : function() {
		$.fn.zTree.destroy(this.interfaceTree);
		this.initinterfaceTree();
		$.utils.initMenu();

	},
	addHoverDom : function(treeId, treeNode) {
		if (treeNode.isParent) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag
					|| $("#" + treeNode.tId + "_add").length > 0)
				return;
			var addStr = "<span class='button add' id='" + treeNode.tId
					+ "_add' title='添加节点' onfocus='this.blur();'></span>";
			sObj.append(addStr);
			var btn = $("#" + treeNode.tId + "_add");
			if (btn)
				btn.bind("click", function() {
					$("input[name='sysParentUid'").val(treeNode.uid);
					$("input[name='sysResourceLevel'").val(2);

					$("#addinterfaceTreeDialog").modal("show");
					$("#addinterfaceTreeDialogUrl").css('display', 'block');
					return false;
				});
		}
	},
	removeHoverDom : function(treeId, treeNode) {
		$("#" + treeNode.tId + "_add").unbind().remove();
	},
	showRemoveBtn : function(treeId, treeNode) {
		return true;
	},
	updateResource : function() {
		// 保存更改，刷新tree
		if ($('#updateResourceForm').valid()) {
			var json = $("#updateResourceForm").serializeFormToJson();
			$.ajax({
				url : getContextPath()
						+ "/resource/updateByPrimaryKeySelective",
				data : json,
				async : true,
				type : 'POST',
				success : function(response) {
					if (response.success) {
						if (response.obj == null) {
							$.utils.alertError("返回数据为空");
							$.resource.refreshTree();
						} else {
							$("#updateResourcTreeDialog").modal("hide");
							BootstrapDialog.show({
								type : 'type-success',
								title : '提示',
								message : '修改成功',
								buttons : [ {
									label : '确定',
									action : function(dialog) {
										dialog.close();
										$.resource.refreshTree();
									}
								} ]
							});
						}

					} else {
						$.utils.alertError(response.message);
					}

				}
			});
		}
	},
	editResource : function(treeId, treeNode) {
		var id = treeNode.id;

		if (treeNode.resourceLevel == 1)
			$("#updateinterfaceTreeDialogUrl").css('display', 'none');
		else
			$("#updateinterfaceTreeDialogUrl").css('display', 'block');

		$("#sysResourceNameUpd").val(treeNode.name);
		$("#sysResourcePathUpd").val(treeNode.resourceUrl);
		$("input[name='sysResourceUid'").val(treeNode.uid);
		$("#editicon").attr("class", treeNode.icon);
		$("#idForUpdate").val(id);
		$("#editIcon").val(treeNode.icon);
		// 打开修改的对话框
		$("#updateResourcTreeDialog").modal("show");
		return false; // return false来阻止进入默认的节点编辑状态
	},
	removeResource : function(treeId, treeNode) {
		$.resource.saveResourceId = treeNode.id;
		$("#deleteinterfaceTreeDialog").modal("show");
		return false; // return false 后页面上不会立即删除
	},
	deleteResource : function() {
		var value = $.resource.saveResourceId;
		$.ajax({
			url : getContextPath() + "/resource/deleteByPrimaryKey",
			data : {
				id : value
			},
			async : false,
			success : function(response) {
				if (response.success == false) {
					$.utils.alertError("资源已绑定用户，请先解绑！");
					$("#deleteinterfaceTreeDialog").modal("hide");
					$.resource.refreshTree();
				} else {
					$("#deleteinterfaceTreeDialog").modal("hide");
					$.resource.refreshTree();
				}
			}
		});
	},
	addResource : function() {
		$("input[name='sysResourceLevel'").val(1);
		$("#addinterfaceTreeDialog").modal("show");
		$("#addinterfaceTreeDialogUrl").css('display', 'none');
	},
	selecticon : function() {
		$("#selecticon").modal("show");
	}

};

$.testAppInfoManagerUtils.custom = {
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
				minimumResultsForSearch : Infinity,
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
				var dbAppName = $('#dbAppSelect').val();
				var databaseName = $('#databaseSelect').val();
				initSQLSelect(dbAppName, databaseName);
			});
		}
};

/**
 * 页面渲染结束后自动执行的类
 */
$(document).ready(function() {
	$.testAppInfoManagerUtils.init();
	$.testAppInfoManager.init();
});
