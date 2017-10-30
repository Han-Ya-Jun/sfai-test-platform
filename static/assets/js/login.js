$.login = {
    submit: function () {
    	if ($('#loginForm').valid()){
    		return true;
    	}else{
    		return false;
    	}
    },
    
    initValid : function() {
		$('#loginForm').validate({
			rules : {
				userid : {
					required : true,
				},
				password : {
					required : true,
				}
			},
			messages : {
				userid : {
					required : "用户名不能为空",
				},
				password : {
					required : "密码不能为空",
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
    },
    error:function(){
    	 var message = $.login.getCookie("loginMessage");
    	 if(message != '""'){
    		$("#error").html(message);
    	 }
    },
    getCookie:function(name) {
	    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	    if (arr = document.cookie.match(reg))
//			return unescape(arr[2]);
	        return decodeURI(arr[2]);
	    else
	        return null;
	}
    	
}

$(document).ready(function() {
    $.login.initValid()
    $.login.error()
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function () {
        $('#error').html("");
    });
});