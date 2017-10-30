/**
 * 所有其他类型的方法
 * 
 * @type {{init: $.roleUtils.init, queryList: $.roleUtils.queryList}}
 */
$.roleUtils = {
	init : function() {
		$.roleUtils.queryList();
		$.roleUtils.initValid();
	},
	queryList : function() {

		$('#roleTable').bootstrapTable( {
			url : getContextPath() + "/role/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit
				// 对象查询相关可以从此处传递值,具体实现需自行编码
				// 例如: id:id

				}
			},
			responseHandler : function(response) {
				if (!response.success) {
					return null;
				}
				return response.obj;
			}
		});
	},
	refresh : function() {
		$('#roleTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/role/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit
				}
			},
			responseHandler : function(response) {
				return response.obj;
			}
		});
	},
	initValid : function() {

		$('#addRoleForm').validate({
			rules : {
				sysRoleName : {
					required : true,
				},
				sysRoleDesc : {
					required : true,
				}
			},
			messages : {
				sysRoleName : {
					required : "角色名称不能为空",
				},
				sysRoleDesc : {
					required : "角色描述不能为空",
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

		$('#updateRoleForm').validate({
			rules : {
				sysRoleName : {
					required : true,
				},
				sysRoleDesc : {
					required : true,
				}
			},
			messages : {
				sysRoleName : {
					required : "角色名称不能为空",
				},
				sysRoleDesc : {
					required : "角色描述不能为空",
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
 * @type {{deleteById: $.roleUtils.button.deleteById, updateById:
 *       $.roleUtils.button.updateById, deleteBatch:
 *       $.roleUtils.button.deleteBatch}}
 */
$.roleUtils.button = {
	add : function() {

		$('#addRoleForm div').removeClass('has-error');

		$('#addRoleForm').validate().resetForm();

		$('#addRoleForm')[0].reset();

		$('#addRoleDialog').modal('show');
	},
	deleteByPrimaryKey : function(id) {

		$("#idForDel").val(id);

		$('#deleteRoleDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath() + "/role/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#updateRoleForm div').removeClass('has-error');

					$('#updateRoleForm').validate().resetForm();

					$('#updateRoleForm')[0].reset();

					$('#updateRoleForm').fill(JSON.parse(data));

					$('#updateRoleDialog').modal('show');
				}
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#roleTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}
		$("#batchRoleDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath() + "/role/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {

				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#showRoleForm')[0].reset();

					$('#showRoleForm').fill(JSON.parse(data));

					$('#showRoleDialog').modal('show');
				}

			}
		});
	},
	changeRoleResource : function(id) {
		debugger;
		var value = id;
		$("input[name='roleUidForResource']").val(value);
		initRoleResourceTree(value);
		$("#changeRoleResourceDialog").modal('show');
	},
	changeRoleTable : function(id) {
		debugger;
		var value = id;
		$("input[name='roleId']").val(value);
		$("#roleTableTable").bootstrapTable('refresh', {
			query : {
				roleId : value
			}
		});
		$("#changeRoleTableDialog").modal('show');
	},
	getUid : function(id) {
		var arr = $.roleUtils.formatter.idArr;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id == id) {
				return arr[i].sysRoleUid;
			}
		}

	}

};

/**
 * 所有直接通过操作与后台进行交互的方法
 * 
 * @type {{addRole: $.roleUtils.submit.addRole, updateABC:
 *       $.roleUtils.submit.updateRole, deleteById:
 *       $.roleUtils.submit.deleteById, search: $.roleUtils.submit.search,
 *       batch: $.roleUtils.submit.batch}}
 */
$.roleUtils.submit = {
	addRole : function() {
		if ($('#addRoleForm').valid()) {
			$.utils.submit('/role/insert', '#addRoleForm', '#addRoleDialog',
					'新增出错~', null, '#roleTable', null, '新增成功~');
		}
	},
	updateRole : function() {
		if ($('#updateRoleForm').valid()) {
			$.utils.submit('/role/updateByPrimaryKeySelective',
					'#updateRoleForm', '#updateRoleDialog', '修改出错~', null,
					'#roleTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils
				.submit('/role/deleteByPrimaryKey', '#deleteRoleForm',
						'#deleteRoleDialog', '删除出错~', null, '#roleTable', null,
						'删除成功~');
	},
	search : function() {

		$("#roleTable").bootstrapTable('removeAll');

		// 重新传递查询条件,也可以修改URL
		$("#roleTable").bootstrapTable('refreshOptions', {
			url : getContextPath() + "/role/selectByPrimaryKey",
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
		var list = $('#roleTable').bootstrapTable('getAllSelections');
		// 进行Ajax交互处理数据
	}

};

/**
 * 所有额外处理格式化的方法
 * 
 * @type {{operation: $.roleUtils.formatter.operation}}
 */
$.roleUtils.formatter = {
	idArr : new Array(),
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' style='float:none' class='btn btn-info' onclick='$.roleUtils.button.selectByPrimaryKey(\""
				+ row.id
				+ "\")'>查看</button>"
				+ "<button type='button' style='float:none' class='btn btn-success' onclick='$.roleUtils.button.updateById(\""
				+ row.id
				+ "\")'>修改</button>"
				+ "<button type='button' style='float:none' class='btn btn-warning' onclick='$.roleUtils.button.deleteByPrimaryKey(\""
				+ row.id
				+ "\")'>删除</button>"
				+ "<button type='button' style='float:none' class='btn btn-success' onclick='$.roleUtils.button.changeRoleResource(\""
				+ row.sysRoleUid
				+ "\")'>分配资源</button>"
				+ "<button type='button' style='float:none' class='btn btn-success' onclick='$.roleUtils.button.changeRoleTable(\""
				+ row.sysRoleUid + "\")'>分配应用</button>" + "</div>";
		return html;
	}
};

$.role = {
	saveRoleResource : function() {
		var roleId = $("input[name='roleUidForResource']").val();
		var resTreeObj = $.fn.zTree.getZTreeObj("roleResourceTree");
		var nodes = resTreeObj.getCheckedNodes(true);
		var objarray = nodes.length;
		var chestr = "";
		for (i = 0; i < objarray; i++) {
			chestr += nodes[i].uid + ",";
		}
		$.ajax({
			url : getContextPath() + "/resource/updateRoleResource",
			data : {
				roleId : roleId,
				resList : chestr
			},
			async : false,
			success : function(response) {
				debugger;
				if (response.success == null) {
					$.util.alertError("返回空数据");
				} else {
					var data = response.success;
					$("#changeRoleResourceDialog").modal('hide');
				}
			}
		});
	}
};

function initRoleResourceTree(value) {
	var setting = {
		check : {
			enable : true,
			chkStyle : "checkbox",
			chkboxType : {
				"Y" : "ps",
				"N" : "ps"
			}
		},
	}
	var nodes;
	$.ajax({
		url : getContextPath() + "/resource/getRoleResource",
		data : {
			roleId : value
		},
		async : false,
		success : function(response) {
			if (response.obj == null) {
				$.util.alertError(response);
			} else {
				nodes = response.obj;
				console.table(nodes);
			}
		}
	});
	$.fn.zTree.init($("#roleResourceTree"), setting, nodes);
}

$("#roleTableTable").bootstrapTable({
	url : getContextPath() + "/sysRoleApp/getAllAppByRoleId",
	cache : false,
	responseHandler : function(response) {
		if (response.obj != null) {
			return response.obj;
		} else {
			$.util.alertError("返回数据空");
			return null;
		}
	}
});

$.roleTable = {
	
	bindAppState : function(value,row) {
		var roleId = $("input[name='roleId']").val();
	/*	alert(JSON.stringify(row));
		alert(row.sysRoleUid+"a"+row.sysRoleId);*/
		if (row.states==1) {
			return "<span class='paddingLeft' style='color:green'>" + "已绑定"
					+ "</span>";
		} else {
			return "<span class='paddingLeft' style='color:red'>" + "未绑定"
					+ "</span>";
		}
	},
	operation : function(value, row) {
		var roleId = $("input[name='roleId']").val();
		if (row.states==1) {
			var html = '<button class="marginLeft btn btn-info" onclick="$.roleTable.bindUser(\''
					+ row.appId
					+ '\','
					+ 0
					+ ',\''
					+ roleId
					+ '\')">取消绑定</button>';
		} else {
			var html = '<button class="marginLeft btn btn-warning" onclick="$.roleTable.bindUser(\''
					+ row.appId
					+ '\','
					+ 1
					+ ',\''
					+ roleId
					+ '\')">绑定角色</button>';
		}
		return html;
	},
	bindUser : function(appId, state, roleId) {
		$.ajax({
			url : getContextPath() + "/sysRoleApp/changeRoleApp",
			data : {
				appId : appId,
				states : state,
				roleId : roleId
			},
			cache : false,
			success : function(response) {
				debugger
				if (response.obj == null) {
					$.utils.alertError('数据库为空');
				} else {
					$('#roleTableTable').bootstrapTable('refresh', {
						query : {
							roleId : roleId
						}
					});
				}
			}
		});
	}
}

/**
 * 页面渲染结束后自动执行的类
 */
$(document).ready(function() {
	$.roleUtils.init();
});
