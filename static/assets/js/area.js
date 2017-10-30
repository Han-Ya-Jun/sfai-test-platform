/**
 * 所有其他类型的方法
 * 
 * @type {{init: $.areaUtils.init, queryList: $.areaUtils.queryList}}
 */
$.areaUtils = {
	init : function() {
		//$.areaUtils.queryList();
		$.areaUtils.initValid();
	},
	queryList : function() {

		$('#areaTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/area/selectByExample",
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

		$('#addAreaForm').validate({
			rules : {
				sysAreaName : {
					required : true,
				}
			},
			messages : {
				sysAreaName : {
					required : "地区名称不能为空",
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

		$('#updateAreaForm').validate({
			rules : {
				sysAreaName : {
					required : true,
				}
			},
			messages : {
				sysAreaName : {
					required : "地区名称不能为空",
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
 * @type {{deleteById: $.areaUtils.button.deleteById, updateById:
 *       $.areaUtils.button.updateById, deleteBatch:
 *       $.areaUtils.button.deleteBatch}}
 */
$.areaUtils.button = {
	add : function() {

		$('#addAreaForm div').removeClass('has-error');

		$('#addAreaForm').validate().resetForm();

		$('#addAreaForm')[0].reset();

		$('#addAreaDialog').modal('show');
	},
	deleteByPrimaryKey : function(id) {

		$("#idForDel").val(id);

		$('#deleteAreaDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath() + "/area/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#updateAreaForm div').removeClass('has-error');

					$('#updateAreaForm').validate().resetForm();

					$('#updateAreaForm')[0].reset();

					$('#updateAreaForm').fill(JSON.parse(data));

					$('#updateAreaDialog').modal('show');
				}
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#areaTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchAreaDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath() + "/area/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#showAreaForm')[0].reset();

					$('#showAreaForm').fill(JSON.parse(data));

					$('#showAreaDialog').modal('show');
				}

			}
		});
	}

};

/**
 * 所有直接通过操作与后台进行交互的方法
 * 
 * @type {{addArea: $.areaUtils.submit.addArea, updateABC:
 *       $.areaUtils.submit.updateArea, deleteById:
 *       $.areaUtils.submit.deleteById, search: $.areaUtils.submit.search,
 *       batch: $.areaUtils.submit.batch}}
 */
$.areaUtils.submit = {
	addArea : function() {
		debugger;
		if ($('#addAreaForm').valid()) {
			$.utils.submit('/area/insert', '#addAreaForm', '#addAreaDialog',
					'新增出错~', null, '#areaTable', null, '新增成功~');
			$.area.refreshTree();
		}
		$.area.refreshTree();
	},
	updateArea : function() {
		if ($('#updateAreaForm').valid()) {
			$.utils.submit('/area/updateByPrimaryKeySelective',
					'#updateAreaForm', '#updateAreaDialog', '修改出错~', null,
					'#areaTable', null, '修改成功~');
			$.area.refreshTree();
		}
		$.area.refreshTree();
	},
	deleteByPrimaryKey : function() {
		$.utils
				.submit('/area/deleteByPrimaryKey', '#deleteAreaForm',
						'#deleteAreaDialog', '修改出错~', null, '#areaTable', null,
						'修改成功~');
		$.area.refreshTree();
	},
	search : function() {

		$("#areaTable").bootstrapTable('removeAll');

		// 重新传递查询条件,也可以修改URL
		$("#areaTable").bootstrapTable('refreshOptions', {
			url : getContextPath() + "/area/selectByPrimaryKey",
			queryParams : function(params) {
				return $("#searchForm").serialize();

			},
			responseHandler : function(response) {

				return {
					rows : new Array(response.obj),
					totalRecord : 1
				}
			}
		});

	},
	batch : function() {
		// 获取全部选择的数据
		var list = $('#areaTable').bootstrapTable('getAllSelections');
		// 进行Ajax交互处理数据
	}

};

/**
 * 所有额外处理格式化的方法
 * 
 * @type {{operation: $.areaUtils.formatter.operation}}
 */
$.areaUtils.formatter = {
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-info' onclick='$.areaUtils.button.selectByPrimaryKey("
				+ row.id
				+ ")'>查看</button>"
				+ "<button type='button' class='btn btn-success' onclick='$.areaUtils.button.updateById("
				+ row.id
				+ ")'>修改</button>"
				+ "<button type='button' class='btn btn-warning' onclick='$.areaUtils.button.deleteByPrimaryKey("
				+ row.id + ")'>删除</button>" + "</div>";
		return html;
	}
};

$.area = {
	resourceTree : null,
	saveResourceId : "",
	init : function() {
		this.resourceTree = this.initResourceTree();
	},
	initResourceTree : function() {
		var zTreeObj;
		var nodes;
		$.ajax({
			url : getContextPath() + "/area/getResourceList",
			async : false,
			success : function(response) {
				if (response.obj == null) {
					$.util.alertError('返回空数据');
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
		zTreeObj = $.fn.zTree.init($("#areaTree"), setting, nodes);
		return zTreeObj;
	},
	refreshTree : function() {
		$.fn.zTree.destroy(this.resourceTree);
		this.initResourceTree();
	},
	addHoverDom : function(treeId, treeNode) {
		debugger;
		if (treeNode.level<4) {
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
					var level = treeNode.resourceLevel;
					if (level < 4) {
						level = level + 1;
					}
					$("input[name='sysAreaLevel'").val(level);
					$("input[name='sysParentUid'").val(treeNode.uid);

					$("#addAreaDialog").modal("show");
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
		if ($('#updateAreaForm').valid()) {
			var json = $("#updateAreaForm").serializeFormToJson();
			debugger;
			$.ajax({
				url : getContextPath() + "/area/updateByPrimaryKeySelective",
				data : json,
				async : true,
				type : 'POST',
				success : function(response) {
					if (response.success) {
						if (response.obj == null) {
							$.utils.alertError("返回数据为空");
							$.area.refreshTree();
						} else {
							$("#updateAreaDialog").modal("hide");
							BootstrapDialog.show({
								type : 'type-success',
								title : '提示',
								message : '修改成功',
								buttons : [ {
									label : '确定',
									action : function(dialog) {
										dialog.close();
										$.area.refreshTree();
									}
								} ]
							});
						}
					} else {
						$.utils.alertError(response.errorMessage);
					}
				}
			});
		}
	},
	editResource : function(treeId, treeNode) {
		var id = treeNode.id;

		$("#sysAreaNameUpd").val(treeNode.name);
		$("#idForUpdate").val(id);

		// 打开修改的对话框
		$("#updateAreaDialog").modal("show");
		return false; // return false来阻止进入默认的节点编辑状态
	},
	removeResource : function(treeId, treeNode) {
		debugger;
		$.area.saveResourceId = treeNode.id;
		$("#deleteAreaDialog").modal("show");
		return false; // return false 后页面上不会立即删除
	},
	deleteResource : function() {
		var value = $.area.saveResourceId;
		debugger;
		$.ajax({
			url : getContextPath() + "/area/deleteByPrimaryKey",
			data : {
				id : value
			},
			async : false,
			success : function(response) {
				if (response.success == false) {
					$.utils.alertError("资源已绑定用户，请先解绑！");
					$("#deleteAreaDialog").modal("hide");
					$.area.refreshTree();
				} else {
					$("#deleteAreaDialog").modal("hide");
					$.area.refreshTree();
				}
			}
		});
	},
	addResource : function() {// 第一级菜单
		debugger;
		$("input[name='sysAreaLevel'").val(0);
		$("#addAreaDialog").modal("show");
	}
}

/**
 * 页面渲染结束后自动执行的类
 */
$(document).ready(function() {
	$.areaUtils.init();
	$.area.init();
});
