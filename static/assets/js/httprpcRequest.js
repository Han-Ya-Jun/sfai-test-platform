
var mrData = null;
$.httprpcRequest={
		initTree:function(){
			var appId = $("#searchAppId").val();
			var nodes;
			var zTreeObj;
			 $.ajax({
				 url:getContextPath()+"/testInterfaceVersionRel/getAppInterface",
				 type:"POST",
				 dateType : "json",
				 data:{
					 appId:appId
				 },
			 	async:false,
			 	success:function(response){
			 		 nodes = response.obj;
			 		 console.log(nodes);
			 	}
			 });
		 
			 var setting={
					 check:{
						 chkboxType:{"Y":"ps","N":"ps"},
						 chkStyle:"radio",
						 enable:false,
					 },
					 edit:{
						 enable:true,
						 removeTitle:"删除",
						 showRemoveBtn:false,
						 showRenameBtn:false,
					 },
					 callback:{
						 beforeRemove:false,
						 beforeEditName:false,
						 onClick:zTreeOnClick,
						 onRemove:false,
						 onRightClick:false,
						 onExpand:true,
					 },	
			 };
			 zTreeObj = $.fn.zTree.init($("#InterfaceTree"), setting, nodes);
			 return zTreeObj;
		 },	
		 httpFormatParams : function(){
			 var textValue = $("#httpRequestPanel textarea[name='questParams']").val();
			 testValue = $.utils.jsonFormat(textValue);
			 $("#httpRequestPanel textarea[name='questParams']").val(testValue);
		 },
		 rpcFormatParams : function(){
			 var textValue = $("#rpcRequestPanel textarea[name='questParams']").val();
			 testValue = $.utils.jsonFormat(textValue);
			 $("#rpcRequestPanel textarea[name='questParams']").val(testValue);
		 },
};

$.httprpcRequest.submit = {
		httpSend : function(){
			$("#httpRequestPanel textarea[name='responseResult']").val('');

			var httpPath = $("#httpRequestPanel input[name='httpPath']").val();
			var httpRequestType = $("#httpRequestPanel input[name='httpRequestType']").val();
			var params = $("#httpRequestPanel textarea[name='questParams']").val();
			
			var headers = "{\"";
			$('#headerTable').find("tr").each(function(){
				var indexTr = $(this).index();
				if(indexTr==0) return true;
				if(indexTr != 1){
					headers += ",";
				}
				$(this).find("td").each(function(){
					var indexTd = $(this).index();
				});
				var tr = $(this);
				var headerKey = tr.find("input[name='headKey']").val();
				var headerValue = tr.find("input[name='headValue']").val();
				if(headerKey != null && headerValue != null){
					headers = headers + headerKey + "\":\"" + headerValue + "\"";
				}
			});
			headers += "}";
			debugger;
			if(!invokeMockState()){
				$.utils.alertError('Mock参数不存在，请设置mock参数');
			}
			var data = {
					httpPath : httpPath,
					httpRequestType : httpRequestType,
					params : params,
					headers : headers
			}
			
			$.ajax({
				type : "post",
				url : getContextPath() + "/interInvoke/httpRequest",
				dataType : "json",
				data : data,
				async : false,
				success:function(response){
					if (!response.success) {
						$.utils.alertError("http调用失败");
					} else {
						var data = response.obj;
						if($.utils.isJSON(data)){
							data = $.utils.jsonFormat(data);
						}
						$("#httpRequestPanel textarea[name='responseResult']").val(data);
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					$.utils.alertError('AJAX出错');
				}
			});
			
		},
		rpcSend : function(){
			$("#rpcRequestPanel textarea[name='responseResult']").val('');
			var appName = $("#rpcRequestPanel input[name='appName']").val();
			var className = $("#className").text();
			var jarPath = $("#rpcRequestPanel input[name='jarPath']").val();
			var registerAddr = $("#registerAddrId").val();
			var methodName = $("#methodName").text();
			var params = $("#rpcRequestPanel textarea[name='questParams']").val();
			if(!invokeMockState()){
				$.utils.alertError('Mock参数不存在，请设置mock参数');
			}
			var data = {
					appName : appName,
					className : className,
					jarPath : jarPath,
					registAddr : registerAddr,
					method : methodName,
					params : params,
			}
			$.ajax({
				type : "post",
				url : getContextPath() + "/interInvoke/rpcRequest",
				dataType : "json",
				data : data,
				async : false,
				success:function(response){
					if (!response.success) {
						$.utils.alertError("rpc调用失败");
					} else {
						var data = response.obj;
						if($.utils.isJSON(data)){
							data = $.utils.jsonFormat(data);
						}
						$("#rpcRequestPanel textarea[name='responseResult']").val(data);
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					$.utils.alertError('AJAX出错');
				}
			});
			
			
		}
};

function zTreeOnClick(event, treeId, treeNode) {
	var obj = treeNode.appInterfaceInfoVo;
	initRequest(obj);
	initMockManager();
	
};


function initRequest(obj){
	var appName = obj.appName;
	var className = obj.clsName;
	var hashId = obj.hashId;
	var httpRequestType = obj.httpRequestType;
	var methodName = obj.methodName;
	var requestJson = obj.requestJson;
	var requestType = obj.requestType; //0:http 1:rpc
	var responseJson = obj.responseJson;
	var responseObj = obj.responseObj;
	var versionName = obj.versionName;
	var httpPath = obj.httpPath;
	var jarPath = obj.jarPath;
	
	getMockAndReportStatus(obj.methodId, obj.appId);
	debugger;
	getMockAndReportStatus();
	
	if(requestType == "0"){
		$("#rpcRequestPanel").hide();
		$("#httpRequestPanel").show();
		$("#httpRequestPanel input[name='httpRequestType']").val(httpRequestType);
		$("#httpRequestPanel input[name='httpPath']").val(httpPath + "/" + methodName);
		$("#httpRequestPanel textarea[name='questParams']").val($.utils.jsonFormat(requestJson));
		$("#httpRequestPanel textarea[name='extendParams']").val($.utils.jsonFormat(responseObj));
//		$("#httpRequestPanel textarea[name='responseResult']").val($.utils.jsonFormat(responseJson));
		
		initHeaders();
	}else if(requestType == "1"){
		$("#httpRequestPanel").hide();
		$("#rpcRequestPanel").show();
		$("#registerAddr").select2({
			ajax:{
				url:getContextPath() + "/testZkInfo/getZkList",
				dataType:'json',
				type:"GET",
				processResults:function(data){
					return{
						results:data.obj
						
					}
				},
				cache:true
			},
			escapeMarkup : function(markup){
				return markup;
			},
			templateResult:function formatRepo(repo){
				markup = "<option id=" + repo.id+ ">" + repo.name + "</option>";
				return markup;
			},
			templateSelection:function fomratRepoSelection(repo){
				$("#registerAddrId").val(repo.id);
				$("#registerAddr").text(repo.name);
				return repo.name || repo.id;
			}
		});
		
		$("#rpcRequestPanel input[name='appName']").val(appName);
		$("#className").text(className);
		$("#rpcRequestPanel input[name='jarPath']").val(jarPath);
		$("#methodName").text(methodName);
		$("#rpcRequestPanel textarea[name='questParams']").val($.utils.jsonFormat(requestJson));
		$("#rpcRequestPanel textarea[name='extendParams']").val($.utils.jsonFormat(responseObj));
//		$("#rpcRequestPanel textarea[name='responseResult']").val($.utils.jsonFormat(responseJson));
		
	}
};

function invokeMockState(){
	var appMock = mrData.appMockFlag;
	var interMock = mrData.interfaceVersionMockFlag;
	var hasMockMessage = true;
	if(appMock == '1' && interMock == "1" && existDefaultMockMsg() == false){
		return false;
	}
	return true;
}

function initHeaders(){
	
	var html = '';
	html += '<tbody style="display: block;overflow-y: scroll;height:200px;">';
	html += 	'<tr style="margin-bottom:5px;">';
	html += 		'<td style="width:40%;text-align: center;">键</td>';
	html += 		'<td style="width:5%;text-align: center;"></td>';
	html += 		'<td style="width:40%;text-align: center;">值</td>';
	html += 		'<td style="width:10%;text-align:center;"><a class="detail-icon" href="javascript:" onclick="addHeader(this)"><i class="glyphicon glyphicon-plus icon-plus"></i></a></td>';
	html += 	'</tr>';
	
	html += 	'<tr>';
	html += 		'<td style="width:40%;text-align: center;">';
	html += 			'<input type="text" class="header-params form-control" style=" border-radius: 4px !important;" name="headKey" required="" value="Content-Type">'
	html += 		'</td>';
	html += 		'<td style="width:5%;text-align: center;">:</td>';
	html += 		'<td style="width:40%;text-align: center;">';
	html += 		'<input type="text" class="header-params form-control" style=" border-radius: 4px !important;" name="headValue" required="" value="application/json">';
	
	html += 		'</td>';
	html += 	'</tr>';
	html += '</tbody>';
	$("#headerTable").html(html);
}

function addHeader(opt){
	var html = '';
	html += 	'<tr style="margin-bottom:5px;">';
	html += 		'<td style="width:40%;text-align: center;">';
	html += 			'<input type="text" class="header-params form-control" style=" border-radius: 4px !important;" name="headKey" required="">'
	html += 		'</td>';
	html += 		'<td style="width:5%;text-align: center;">:</td>';
	html += 		'<td style="width:40%;text-align: center;">';
	html += 		'<input type="text" class="header-params form-control" style=" border-radius: 4px !important;" name="headValue" required="">';
	
	html += 		'</td>';
	html += 		'<td style="width:10%;text-align:center;"><a class="detail-icon" href="javascript:" onclick="removeHeader(this)"><i class="glyphicon glyphicon-minus icon-minus"></i></a></td>';
	html += 	'</tr>';
	$("#headerTable").append(html);
}

function removeHeader(opt){
	$(opt).parent().parent().remove(); 
}

function initPageShow(){
	var data;
	$.ajax({
		type : "post",
		url : getContextPath() + "/testVersionInfo/getAllApp",
		dataType : "json",
		async : false,
		success:function(response){
			if (!response.success) {
				$.utils.alertError("获取APP列表失败");
			} else {
				data = response.obj;
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			$.utils.alertError('AJAX出错');
		}
	});
	debugger;
	if(data != null && data.length>0){
		var opt = data[0];
		$("#searchAppId").val(opt.id);
		$("#searchAppName").text(opt.name);
		$.httprpcRequest.initTree();
	}
	
}

function initMockManager(){
	$("#mockAdd").attr("style","padding-top:20px;padding-left: 0px;");
	
	$("#mockAdd").empty();
	var html = "";	
	html += "<div class='col-md-6 col-xs-6 col-lg-6 col-sm-6' style = 'padding-right: 0px;padding-left: 0px;'>";
	html += "<button type='button' class='btn btn-default btn-sm btn-block' id='mockBtn' onclick='changeMockFlag()'>未开启mock</button>";
	html += "</div>";
	html += "<div class='col-md-6 col-xs-6 col-lg-6 col-sm-6' style = 'padding-right: 0px;padding-left: 0px;'>";
	html += "<button type='button' class='btn btn-primary btn-sm btn-block' id='reportBtn' onclick='changeReportFlag()'>已开启上报</button>";
	html += "</div>						";	
	$("#mockAdd").append(html);
	
	$("#tableBody").empty();
	var objArr = selectByInterfaceId(mrData.interfaceVersionId);
	html = "";
	if(objArr.length >0){
		for(var i = 0;i < objArr.length; i++){
			html += "<tr>";
			html +=  "<td><a onclick = 'updateMockById("+objArr[i].id+")' style = 'cursor:pointer'>" ;
			html +=  stringLimit(objArr[i].requestJson);
			html +=  "</a></td>";
			html +=  "<td style='text-align: center;'><input  class ='checkboxInTable' type = 'checkbox' onclick='setMockDefault("+objArr[i].id+",$(this))'";
			if(objArr[i].mockDefault == 1 && mrData.appMockFlag == 1 && mrData.interfaceVersionMockFlag == 1){
				html +=  " checked='checked'";
				var str = $.utils.jsonFormat(objArr[i].requestJson);
				$("#httpRequestParams").val(str);
				$("#rpcParams").val(str);
			}
			html +=  "/></td>"
			html +=  "</tr>";	
		}
	}
	else{
		html += "<tr><td>无数据</td><td>无数据</td></tr>"
	}
	$("#tableBody").append(html);
	
	$("#addBtnDiv").empty();
	html = "";
	html += "<div class='col-md-12 col-xs-12 col-lg-12 col-sm-12' id='btnDiv' style='display:none;padding-right: 0px;padding-left: 0px;'>"
	html += "<button type='button' class='btn btn-info btn-sm btn-block' style = 'background-color:#428cb1;' onclick='addMock()'>新增mock参数</button>"
	html += "</div>	";
	$("#addBtnDiv").append(html);
	if(mrData.interfaceVersionMockFlag == 1){
		$("#mockBtn").text("已开启mock");
		$("#mockBtn").attr("class","btn btn-success btn-sm btn-block");
		$("#mockBtn").attr("style","background-color:#428cb1;");
		$("#mockTable").attr("style","");
		$("#btnDiv").attr("style","padding-right: 0px;padding-left: 0px;");
	}
	else{
		$("#mockBtn").text("未开启mock");
		$("#mockBtn").attr("class","btn btn-default btn-sm btn-block");
		$("#mockTable").attr("style","display:none;");
		$("#btnDiv").attr("style","display:none;padding-right: 0px;padding-left: 0px;");
	}
	if(mrData.appReportFlag == 1){
		$("#reportBtn").text("已开启上报");
		$("#reportBtn").attr("class","btn btn-success btn-sm btn-block");
		$("#reportBtn").attr("style","background-color:#428cb1;");
	}
	else{
		$("#reportBtn").text("未开启上报");
		$("#reportBtn").attr("class","btn btn-default btn-sm btn-block");
	}
}

function stringLimit(string){
	var stringObject = string.replace(/\s/g, "")
	var stop = 70;	
	if(stringObject.length <= stop)
		stop = stringObject.length;		
	var result = stringObject.substring(0,stop);
	return result +"...";
}

function setMockDefault(id,checkbox){	
	$.ajax({
		url : getContextPath()
				+ "/mockManager/changeMockDefaultById",
		data : {
			id : id,
			mockDefault : 1
		},
		success : function(response) {
			debugger;
			if(response.success == false){
				$.utils.alertError(response.errorMessage);
			}else{
				$('.checkboxInTable').attr('checked', false);
				checkbox.prop("checked","true");
				var str = $.utils.jsonFormat(response.obj.requestJson);
				$("#httpRequestParams").val(str);
				$("#rpcParams").val(str);
			}
		},
		error : function(response) {
			$.utils.alertError("AJAX出错！");
		}
	});
}

function changeMockFlag(){
	if(mrData.appReportFlag == 1){
		if(mrData.interfaceVersionMockFlag == 0){
			shutDownReport();
			$('#changeMockFlagDialog').modal('show');
		}else{
			$('#changeMockFlagDialog').modal('show');
		}
	}else{
		$('#changeMockFlagDialog').modal('show');
	}
}

function changeReportFlag(){
	if(mrData.interfaceVersionMockFlag == 1){
		if(mrData.appReportFlag == 0){
			shutDownMock();
			$('#changeReportFlagDialog').modal('show');	
		}else{
			$('#changeReportFlagDialog').modal('show');	
		}
				
	}else{
		$('#changeReportFlagDialog').modal('show');	
	}
}

function shutDownMock(){
	var id = mrData.interfaceVersionId;
	var changeMockValue;
	var mockFlag = mrData.interfaceVersionMockFlag;
	if(mockFlag == 1) {
		changeMockValue = 0;
	}
	else changeMockValue = 1;
	$.ajax({
		url : getContextPath()
				+ "/mockManager/updateMethodMock",
		data : {
			appId : mrData.testAppInfoId,
			methodId : id,
			mockFlag : changeMockValue,
		},
		async: false,
		success : function(response) {
			
			$('#changeMockFlagDialog').modal('hide');
			
			if(response.success == false){
				$.utils.alertError(response.errorMessage);
			}
			else{
				mrData.interfaceVersionMockFlag = changeMockValue;
				if(changeMockValue == 1){
					mrData.appMockFlag =1;
					$("#mockTable").attr("style","");
					$("#btnDiv").attr("style","padding-right: 0px;padding-left: 0px;");
					$("#mockBtn").text("已开启mock");
					$("#mockBtn").attr("class","btn btn-success btn-sm btn-block");
					$("#mockBtn").attr("style","background-color:#428cb1;");
				}else{
					$("#mockBtn").text("未开启mock");
					$("#mockBtn").attr("class","btn btn-default btn-sm btn-block");
					$("#mockBtn").attr("style","");
				}
				initMockManager();
			}
		},
		error : function(response) {
			$('#changeMockFlagDialog').modal('hide');
			$.utils.alertError("AJAX出错！");
		}
	});
}

function shutDownReport(){
	var appReportFlag = mrData.appReportFlag;
	var changeFlag;
	if(appReportFlag==0){
		changeFlag = 1;
	}
	else changeFlag = 0;
	$.ajax({
		url : getContextPath()
				+ "/mockManager/updateAppReportFlag",
		data : {
			appId : mrData.testAppInfoId,
			changeFlag : changeFlag,
		},
		async: false,
		success : function(response) {
			if(response.success == false){
				$.utils.alertError(response.errorMessage);
			}
			else {
				mrData.appReportFlag = changeFlag;
				if($("#reportBtn").text() == "已开启上报"){
					$("#reportBtn").text("未开启上报");
					$("#reportBtn").attr("class","btn btn-default btn-sm btn-block");
					$("#reportBtn").attr("style","");
				}else{
					$("#reportBtn").text("已开启上报");
					$("#reportBtn").attr("class","btn btn-success btn-sm btn-block");
					$("#reportBtn").attr("style","background-color:#428cb1;");
				}
			}
		},
		error : function(response) {
			$.utils.alertError("AJAX出错！");
		}
	});

}

function changeReportFlagWhileNoTMock(){
	debugger;
	var appReportFlag = mrData.appReportFlag;
	var changeFlag;
	if(appReportFlag==0){
		changeFlag = 1;
	}
	else changeFlag = 0;
	$.ajax({
		url : getContextPath()
				+ "/mockManager/updateAppReportFlag",
		data : {
			appId : mrData.testAppInfoId,
			changeFlag : changeFlag,
		},
		async: false,
		success : function(response) {
			if(response.success == false){
				$.utils.alertError(response.errorMessage);
			}
			else {
				mrData.appReportFlag = changeFlag;
				if($("#reportBtn").text() == "已开启上报"){
					$("#reportBtn").text("未开启上报");
					$("#reportBtn").attr("class","btn btn-default btn-sm btn-block");
					$("#reportBtn").attr("style","");
				}else{
					$("#reportBtn").text("已开启上报");
					$("#reportBtn").attr("class","btn btn-success btn-sm btn-block");
					$("#reportBtn").attr("style","background-color:#428cb1;");
				}
			}
			$('#changeReportFlagDialog').modal('hide');	
		},
		error : function(response) {
			$.utils.alertError("AJAX出错！");
		}
	});
}

function changeMockFlagConfirm(){
	var id = mrData.interfaceVersionId;
	var changeMockValue;
	var mockFlag = mrData.interfaceVersionMockFlag;
	if(mockFlag == 1) {
		changeMockValue = 0;
	}
	else changeMockValue = 1;
	$.ajax({
		url : getContextPath()
				+ "/mockManager/updateMethodMock",
		data : {
			appId : mrData.testAppInfoId,
			methodId : id,
			mockFlag : changeMockValue,
		},
		async: false,
		success : function(response) {
			
			$('#changeMockFlagDialog').modal('hide');
			
			if(response.success == false){
				$.utils.alertError(response.errorMessage);
			}
			else{
				mrData.interfaceVersionMockFlag = changeMockValue;
				if(changeMockValue == 1){
					mrData.appMockFlag =1;
					$("#mockTable").attr("style","");
					$("#btnDiv").attr("style","padding-right: 0px;padding-left: 0px;");
					$("#mockBtn").text("已开启mock");
					$("#mockBtn").attr("class","btn btn-success btn-sm btn-block");
					$("#mockBtn").attr("style","background-color:#428cb1;");
				}else{
					$("#mockBtn").text("未开启mock");
					$("#mockBtn").attr("class","btn btn-default btn-sm btn-block");
					$("#mockBtn").attr("style","");
				}
				initMockManager();
			}
		},
		error : function(response) {
			$('#changeMockFlagDialog').modal('hide');
			$.utils.alertError("AJAX出错！");
		}
	});
}

function selectByInterfaceId(interfaceId){
	var obj ;
	$.ajax({
		url : getContextPath()
				+ "/mockManager/selectByInterfaceId",
		data : {
			interfaceId : interfaceId
		},
		async: false,
		success : function(response) {
			if(response.success == false){
				$.utils.alertError(response.errorMessage);
			}
			else obj =  response.obj.rows;
		},
		error : function(response) {
			$.utils.alertError("AJAX出错！");
		}
	});
	return obj;
}

var editorRequestUpdate;
var editorResponseUpdate;
var editorRequestAdd;
var editorResponseAdd;
function updateMockById(id) {
	if(typeof(id)=="undefined") {
		return;
	}
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
}

function addMock() {
		var interfaceId = mrData.interfaceVersionId;
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
}

function updateTestInterfaceDataInfo() {
	$('#requestJsonForUpdate').val(editorRequestUpdate.getValue());
	$('#responseJsonForUpdate').val(editorResponseUpdate.getValue());
	if ($('#updateTestInterfaceDataInfoForm').valid()) {
		$.utils.submit(
				'/testInterfaceDataInfo/updateByPrimaryKeySelective',
				'#updateTestInterfaceDataInfoForm',
				'#updateTestInterfaceDataInfoDialog', '修改出错~', null,
				'#testInterfaceDataInfoTable', null, '修改成功~');
	}
	initMockManager();
}

function addTestInterfaceDataInfo() {
	var requestJson = editorRequestAdd.getValue();
	$('#requestJson').val(requestJson);
	$('#responseJson').val(editorResponseAdd.getValue());
	if ($('#addTestInterfaceDataInfoForm').valid()) {
		$.utils.submit('/testInterfaceDataInfo/insert',
				'#addTestInterfaceDataInfoForm',
				'#addTestInterfaceDataInfoDialog', '新增出错~', null,
				'#testInterfaceDataInfoTable', null, '新增成功~');
	};	
	initMockManager();
}


function getMockAndReportStatus(methodId,appId){
	var obj;
	debugger;
	if(!methodId){
		methodId = mrData.interfaceVersionId;
	}
	
	if(!appId){
		appId = mrData.testAppInfoId;
	}
	$.ajax({
		type : "post",
		url : getContextPath() + "/testInterfaceVersionRel/getMockAndReportStatus",
		dataType : "json",
		data : {
			interfaceId : methodId,
			appId : appId
		},
		async : false,
		success:function(response){
			if (!response.success) {
				$.utils.alertError("获取mock状态失败");
			} else {
				obj = response.obj;
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			$.utils.alertError('AJAX出错');
		}
	});
	debugger;
	mrData = {
			testAppInfoId : obj.appId,
			appMockFlag : obj.appMockFlag,
			appReportFlag : obj.appReportFlag,
			interfaceVersionId : obj.methodId,	
			interfaceVersionMockFlag : obj.mockFlag
	};
}	

function existDefaultMockMsg(){
	var checkBoxes = $('.checkboxInTable');
	if(checkBoxes.length <= 0){
		return false;
	}
	for(var i = 0; i< checkBoxes.length ;i++){
		if(checkBoxes[i].checked){
			return (mrData.appMockFlag ==1 && mrData.interfaceVersionMockFlag == 1);
		}
	}
	return false;
}

function initHeight(){
	var height = $(window).height();
	var tableHeight = (height - 450)/2;
	var styleStr="padding-left: 0px;padding-right: 0px;position:relative; height:"+tableHeight+"px; overflow-y:auto";
	$("#tableDiv").attr("style",styleStr);
	
}

$(document).ready(function() {
	$("#rpcRequestPanel").hide();
	$.utils.findAllApp("searchAppName","searchAppId","/testVersionInfo/getAllApp");
	initPageShow();
	initHeight();
//	$(".panel-body").css("height",$(window).height()-100);
});