$('#operateTableTable').bootstrapTable({
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
			return null;
		}
		return response.obj;
	}
});
/**
 * 自定义验证规则
 */
//含有中文
jQuery.validator.addMethod("containChinese", function(value, element) {   
	var tel = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return this.optional(element) || (tel.test(value));
}, "必须包含中文字符");
//不含有中文
jQuery.validator.addMethod("notContainChinese", function(value, element) {   
	var tel = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return this.optional(element) || !(tel.test(value));
}, "不得包含中文字符");
/**
 * 所有其他类型的方法
 * 
 * @type {{init: $.operateTableUtils.init, queryList:
 *       $.operateTableUtils.queryList}}
 */
$.operateTableUtils = {
	init : function() {
		$.operateTableUtils.queryList();
		$.operateTableUtils.initValid();
	},
	queryList : function() {

		$('#operateTableTable').bootstrapTable('refreshOptions', {
			url : getContextPath() + "/operateTable/selectByExample",
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
	initValid : function() {

		$('#addOperateTableForm').validate({
			rules : {
				sysTableEname : {
					required : true,
					notContainChinese:true
				},
				sysTableCname : {
					required : true,
					containChinese:true
				}
			},
			messages : {
				sysTableEname : {
					required : "英文表名不能为空",
					containChinese:"不能包含中文"
				},
				sysTableCname : {
					required : "中文表名不能为空",
					containChinese:"必须有中文字符"
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

		$('#updateOperateTableForm').validate({
			rules : {
				sysTableEname : {
					required : true,
					notContainChinese:true
				},
				sysTableCname : {
					required : true,
					containChinese:true
				}
			},
			messages : {
				sysTableEname : {
					required : "英文表名不能为空",
					containChinese:"不能包含中文"
				},
				sysTableCname : {
					required : "中文表名不能为空",
					containChinese:"必须有中文字符"
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
 * @type {{deleteById: $.operateTableUtils.button.deleteById, updateById:
 *       $.operateTableUtils.button.updateById, deleteBatch:
 *       $.operateTableUtils.button.deleteBatch}}
 */
$.operateTableUtils.button = {
	add : function() {

		$('#addOperateTableForm div').removeClass('has-error');

		$('#addOperateTableForm').validate().resetForm();

		$('#addOperateTableForm')[0].reset();

		$('#addOperateTableDialog').modal('show');
	},
	deleteByPrimaryKey : function(id) {

		$("#idForDel").val(id);

		$('#deleteOperateTableDialog').modal('show');

	},
	updateById : function(id) {
		$.ajax({
			url : getContextPath() + "/operateTable/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#updateOperateTableForm div').removeClass('has-error');

					$('#updateOperateTableForm').validate().resetForm();

					$('#updateOperateTableForm')[0].reset();

					$('#updateOperateTableForm').fill(JSON.parse(data));

					$('#updateOperateTableDialog').modal('show');
				}
			}
		});
	},
	operationBatch : function() {
		// 获取选中的所有数据
		var list = $('#operateTableTable').bootstrapTable('getAllSelections');

		if (list == null || list.length == 0) {
			$.utils.alertWarning("请选择至少一个数据!");
			return;
		}

		$("#batchOperateTableDialog").modal("show");

	},
	selectByPrimaryKey : function(id) {
		$.ajax({
			url : getContextPath() + "/operateTable/selectByPrimaryKey",
			data : {
				id : id
			},
			success : function(response) {
				if (!response.success) {
					// 如果返回Json中存在标识码等,可以通过下面的方法显示错误信息,
					$.utils.alertError(response.errorMessage);
				} else {
					var data = $.utils.objToJson(response.obj);

					$('#showOperateTableForm')[0].reset();

					$('#showOperateTableForm').fill(JSON.parse(data));

					$('#showOperateTableDialog').modal('show');
				}

			}
		});
	}

};

/**
 * 所有直接通过操作与后台进行交互的方法
 * 
 * @type {{addOperateTable: $.operateTableUtils.submit.addOperateTable,
 *       updateABC: $.operateTableUtils.submit.updateOperateTable, deleteById:
 *       $.operateTableUtils.submit.deleteById, search:
 *       $.operateTableUtils.submit.search, batch:
 *       $.operateTableUtils.submit.batch}}
 */
$.operateTableUtils.submit = {
	addOperateTable : function() {
		if ($('#addOperateTableForm').valid()) {
			$.utils.submit('/operateTable/insert', '#addOperateTableForm',
					'#addOperateTableDialog', '新增出错~', null,
					'#operateTableTable', null, '新增成功~');
		}
	},
	updateOperateTable : function() {
		if ($('#updateOperateTableForm').valid()) {
			$.utils.submit('/operateTable/updateByPrimaryKeySelective',
					'#updateOperateTableForm', '#updateOperateTableDialog',
					'修改出错~', null, '#operateTableTable', null, '修改成功~');
		}
	},
	deleteByPrimaryKey : function() {
		$.utils.submit('/operateTable/deleteByPrimaryKey',
				'#deleteOperateTableForm', '#deleteOperateTableDialog',
				'删除出错~', null, '#operateTableTable', null, '删除成功~');
	},
	search : function() {

		$("#operateTableTable").bootstrapTable('removeAll');

		// 重新传递查询条件,也可以修改URL
		$("#operateTableTable").bootstrapTable('refreshOptions', {
			url : getContextPath() + "/operateTable/selectByPrimaryKey",
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
		var list = $('#operateTableTable').bootstrapTable('getAllSelections');
		// 进行Ajax交互处理数据
	}

};

/**
 * 所有额外处理格式化的方法
 * 
 * @type {{operation: $.operateTableUtils.formatter.operation}}
 */
$.operateTableUtils.formatter = {
	operation : function(value, row) {
		var html = "<div class='btn-toolbar' role='toolbar'>"
				+ "<button type='button' style='float:none' class='btn btn-info' onclick='$.operateTableUtils.button.selectByPrimaryKey("
				+ row.id
				+ ")'>查看</button>"
				+ "<button type='button' style='float:none' class='btn btn-success' onclick='$.operateTableUtils.button.updateById("
				+ row.id
				+ ")'>修改</button>"
				+ "<button type='button' style='float:none' class='btn btn-warning' onclick='$.operateTableUtils.button.deleteByPrimaryKey("
				+ row.id + ")'>删除</button>" + "</div>";
		return html;
	}
};

/**
 * 页面渲染结束后自动执行的类
 */
$(document).ready(function() {
	$.operateTableUtils.init();
});
