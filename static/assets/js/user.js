/**
 * 所有其他类型的方法
 * 
 * @type {{init: $.userUtils.init, queryList: $.userUtils.queryList}}
 */
// 由于是以单独的html代码块嵌入html文件中，#userTable缺少初始化的过程，必须添加
/*$('#userTable').bootstrapTable({
	queryParams : function(params) {
		return {
			offset : params.offset,
			pageSize : params.limit
		// 对象查询相关可以从此处传递值,具体实现需自行编码
		// 例如: id:id

		}
	},
	responseHandler : function(response) {
		if (response.code != '000') {
			// $.utils.alertError(response.message);
			return null;
		}
		return response.data;
	}
});*/

//配置日历
$('.form_datetime').datetimepicker({
    minView: "month", //选择日期后，不会再跳转去选择时分秒 
    language:  'zh-CN',
    format: 'yyyy-mm-dd',
    todayBtn:  1,
    autoclose: 1,
});
$.userUtils = {
	init : function() {
		$.userUtils.queryList();
		$.userUtils.initValid();
	},
	queryList : function() {
		$('#userTable').bootstrapTable({
			url : getContextPath() + "/user/selectByExample",
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
					// $.utils.alertError(response.message);
					return null;
				}
				return response.obj;
			}
		});
	},
	refresh : function() {
		$('#userTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/user/selectByExample",
			queryParams : function(params) {
				return {
					offset : params.offset,
					pageSize : params.limit
				}
			},
			responseHandler : function(response) {
				if (!response.success) {
					// $.utils.alertError(response.message);
					return null;
				}
				return response.obj;
			}
		});
	},
	initValid : function() {

		$('#addUserForm').validate({
			rules : {
				sysUsername : {
					required : true,
					digits : true
				},
				sysPwd : {
					required : true,
					rangelength : [ 6, 10 ]
				},
				sysPwdConfirm : {
					required : true,
					equalTo : '#password'
				},
				sysName : {
					required : true
				}
			},
			messages : {
				sysUsername : {
					required : "用户名不能为空",
					digits : "用户名为数字工号"
				},
				sysPwd : {
					required : "密码不能为空",
					rangelength : "密码长度6-10位"
				},
				sysPwdConfirm : {
					required : "密码不能为空",
					equalTo : "两次输入密码不一致"
				},
				sysName : {
					required : "用户姓名不能为空"
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

		$('#updateUserForm').validate({
			rules : {
				sysName : {
					required : true
				}
			},
			messages : {
				sysName : {
					required : "用户姓名不能为空"
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
 * @type {{deleteById: $.userUtils.button.deleteById, updateById:
 *       $.userUtils.button.updateById, deleteBatch:
 *       $.userUtils.button.deleteBatch}}
 */
$.userUtils.button = {
	add : function() {

		$('#addUserForm div').removeClass('has-error');

		$('#addUserForm').validate().resetForm();

		$('#addUserForm')[0].reset();

		$('#addUserDialog').modal('show');
	},
	deleteByPrimaryKey : function(id) {

		$("#idForDel").val(id);

		$('#deleteUserDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath() + "/user/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#updateUserForm div').removeClass('has-error');

					$('#updateUserForm').validate().resetForm();

					$('#updateUserForm')[0].reset();

					$('#updateUserForm').fill(JSON.parse(data));

					$('#updateUserDialog').modal('show');
				}
			}
		});
	},
	changeUserRole : function(value) {
		$("input[name='userUid']").val(value);
		$("#userRoleTable").bootstrapTable('refresh', {
			query : {
				userUid : value
			}
		});
		$("#changeUserRoleDialog").modal('show');
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#userTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchUserDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath() + "/user/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				debugger;
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#showUserForm')[0].reset();

					$('#showUserForm').fill(JSON.parse(data));

					$('#showUserDialog').modal('show');
				}
			}
		});
	}

};

/**
 * 所有直接通过操作与后台进行交互的方法
 * 
 * @type {{addUser: $.userUtils.submit.addUser, updateABC:
 *       $.userUtils.submit.updateUser, deleteById:
 *       $.userUtils.submit.deleteById, search: $.userUtils.submit.search,
 *       batch: $.userUtils.submit.batch}}
 */
$.userUtils.submit = {
	addUser : function() {
		if ($('#addUserForm').valid()) {
			$.utils.submit('/user/insert', '#addUserForm', '#addUserDialog',
					'新增出错~', null, '#userTable', null, '新增成功~');
		}
	},
	updateUser : function() {
		if ($('#updateUserForm').valid()) {
			$.utils.submit('/user/updateByPrimaryKeySelective',
					'#updateUserForm', '#updateUserDialog', '修改出错~', null,
					'#userTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils
				.submit('/user/deleteByPrimaryKey', '#deleteUserForm',
						'#deleteUserDialog', '删除出错~', null, '#userTable', null,
						'删除成功~');
	},
	search : function() {

		$("#userTable").bootstrapTable('destroy');

		// 重新传递查询条件,也可以修改URL
		$("#userTable").bootstrapTable({
			url : getContextPath() + "/user/selectByPrimaryKey",
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
		var list = $('#userTable').bootstrapTable('getAllSelections');
		// 进行Ajax交互处理数据
	}

};

/**
 * 所有额外处理格式化的方法
 * 
 * @type {{operation: $.userUtils.formatter.operation}}
 */
$.userUtils.formatter = {
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' class='btn btn-info' style='float:none' onclick='$.userUtils.button.selectByPrimaryKey(\""
				+ row.id
				+ "\")'>查看</button>"
				+ "<button type='button' class='btn btn-success' style='float:none' onclick='$.userUtils.button.updateById(\""
				+ row.id
				+ "\")'>修改</button>"
				+ "<button type='button' class='btn btn-warning' style='float:none' onclick='$.userUtils.button.deleteByPrimaryKey(\""
				+ row.id
				+ "\")'>删除</button>"
				+ "<button type='button' class='btn btn-success' style='float:none' onclick='$.userUtils.button.changeUserRole(\""
				+ row.sysUserUid + "\")'>分配角色</button>" + "</div>";
		return html;
	}
};

$("#userRoleTable").bootstrapTable({
	url : getContextPath() + "/role/getAllRoleByUserNo",
	cache : false,
	responseHandler : function(response) {
		if (response.obj != null) {
			return response.obj;
		} else {
			$.utils.alertError("返回数据空");
			return null;
		}
	}
});

$.userRole = {
	id : function(value, row, index) {
		return row.id;
	},
	bindState : function(value) {
		if (value) {
			return "<span class='paddingLeft' style='color:green'>" + "已绑定"
					+ "</span>";
		} else {
			return "<span class='paddingLeft' style='color:red'>" + "未绑定"
					+ "</span>";
		}
	},
	operation : function(value, row) {
		var userUid = $("input[name='userUid']").val();
		if (row.bindState == true) {
			var html = '<button class="marginLeft btn btn-info" onclick="$.userRole.bindUser(\''
					+ row.sysRoleUid
					+ '\','
					+ false
					+ ',\''
					+ userUid
					+ '\')">取消绑定</button>';
		} else {
			var html = '<button class="marginLeft btn btn-warning" onclick="$.userRole.bindUser(\''
					+ row.sysRoleUid
					+ '\','
					+ true
					+ ',\''
					+ userUid
					+ '\')">绑定角色</button>';
		}
		return html;
	},
	bindUser : function(roleUid, state, userUid) {
		$.ajax({
			url : getContextPath() + "/role/changeUserRole",
			data : {
				roleUid : roleUid,
				state : state,
				userUid : userUid
			},
			cache : false,
			success : function(response) {
				debugger;
				if (response.success) {
					if (response.obj == null) {
						$.utils.alertError('数据库为空！');
					} else {
						$('#userRoleTable').bootstrapTable('refresh', {
							query : {
								userUid : userUid
							}
						});
					}
				} else {
					$.utils.alertError('更改绑定状态出错！');
				}
			}
		});
	}
}

/**
 * 页面渲染结束后自动执行的类
 */
$(document).ready(function() {
	$.userUtils.init();
});
