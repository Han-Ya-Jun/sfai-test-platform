$.scene = {
		addSceneTest : function() {
			$("#addSceneDialog").modal("show");
		},
		appSelect : function() {
			var select = $("#app_select").select2({
				placeholder : "默认全部",
				language : "zh-CN",
				ajax : {
					url : getContextPath() + "/testAppInfo/selectAllAppForCombo",
					dataType : "json",
					type : "POST",
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
					$("input[name='appName']").val(repo.text);
					$("input[name='appName']").text(repo.text);
					return repo.name || repo.text;
				}
				
			}).on("select2:select", function(evt) {
				var appName = $("input[name='appName']").val();
				$.scene.sceneSelect(appName);
			});
			var appName = $("#app_select").val();
			if(appName && appName != "") {
				var option = $("<option selected>" + appName + "</option>").val(appName);
				select.append(option).trigger("change");
			}
		},
		sceneSelect : function(appName, sceneName) {
			var select = $("#scene_select").select2({
				placeholder : "默认全部",
				language : "zh-CN",
				ajax : {
					url : getContextPath() + "/testAppInfo/selectAllAppForCombo",
					dataType : "json",
					type : "POST",
					data : function(params) {
						params.appName = appName;
						return params;
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
					$("input[name='sceneName']").val(repo.id);
					$("input[name='sceneName']").text(repo.name);
					return repo.name || repo.text;
				}
			});
			if (sceneName && sceneName != "") {
				var $option = $("<option selected>" + sceneName + "</option>").val(sceneName);
				select.append($option).trigger('change');
			}
		},
		addRow : function() {
			var row = $('#addSceneTable tr:last').clone(true);

			$("td input:text",row).val("");

			row.insertAfter('#addSceneTable tr:last');

			return false;

		},
		delRow : function(row, index) {
			debugger;
		},
		initWebSocket : function() {
			var websocket = null;
			var url = getContextPath();
			var ws = url.replace('http:','ws:');
			if('WebSocket' in window) {
				websocket = new WebSocket(ws+"/websocket/socketServer.do");
			}else if('MozWebSocket' in window) {
				websocket = new MozWebSocket(ws+"/websocket/socketServer.do");
			}else {
				websocket = new SockJS(url+"/sockjs/socketServer.do");
			}
			websocket.onopen = $.scene.onOpen;
		    websocket.onmessage = $.scene.onMessage;
		    websocket.onerror = $.scene.onError;
		    websocket.onclose = $.scene.onClose;
		    window.close = $.scene.winClose;
		},
		onOpen : function(openEvt) {
		},
		onMessage : function(evt) {
			alert(evt.data);
		},
		onError : function() {
		},
		onClose : function() {
		},
		winClose : function(websocket) {
			websocket.onclose();
		},
		test : function() {
			var html = "";
			for (var i = 1;i < 4;i++) {
				html += "<li style='float: left;' class='app_" + i + "'>"
				html += "<table>";
				html += "<tr><td>应用名</td></tr>";
				html += "<tr><td><div class='radius' style='margin: 0 auto;'></div></td></tr>";
				html += "</table>";
				html += "</li>";
			}
			$("#appNameList").html(html);
			var liNodes = $("#appNameList").children();
			for(var i = 0;i < liNodes.length;i++) {
				if(liNodes[i].className == "app_1") {
					liNodes[i].getElementsByTagName("tr")[1].getElementsByTagName("td")[0].lastChild.style.backgroundColor = "#09C83D";
					//liNodes[i].firstChild.getElementsByTagName("div").style.backgroundColor = "#09C83D";
				}else {
					liNodes[i].getElementsByTagName("tr")[1].getElementsByTagName("td")[0].lastChild.style.backgroundColor = "red";
				}
			}
			var hash = "asdf";
			$.ajax({
				url : getContextPath() + "/http/insertReportData",
				data : {
					hash : hash,
					requestJson : 1,
					responseJson : 2
				},
				jsonType : "json",
				type : "POST",
				success : function(response) {
					debugger;
				}
			});
			
		},
}

$(document).ready(function() {
	$.scene.initWebSocket();
	$.scene.appSelect();
});