/*!
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This file should be included in all pages
 !**/

/*
 * Global variables. If you change any of these vars, don't forget 
 * to change the values in the less files!
 */
var left_side_width = 220; // Sidebar width in pixels

$(function() {
	"use strict";

	// Enable sidebar toggle
	$("[data-toggle='offcanvas']").click(function(e) {
		e.preventDefault();

		// If window is small enough, enable sidebar push menu
		if ($(window).width() <= 992) {
			$('.row-offcanvas').toggleClass('active');
			$('.left-side').removeClass("collapse-left");
			$(".right-side").removeClass("strech");
			$('.row-offcanvas').toggleClass("relative");
		} else {
			// Else, enable content streching
			$('.left-side').toggleClass("collapse-left");
			$(".right-side").toggleClass("strech");
		}
	});

	// Add hover support for touch devices
	$('.btn').bind('touchstart', function() {
		$(this).addClass('hover');
	}).bind('touchend', function() {
		$(this).removeClass('hover');
	});

	// Activate tooltips
	$("[data-toggle='tooltip']").tooltip();

	/*
	 * Add collapse and remove events to boxes
	 */
	$("[data-widget='collapse']").click(function() {
		// Find the box parent
		var box = $(this).parents(".box").first();
		// Find the body and the footer
		var bf = box.find(".box-body, .box-footer");
		if (!box.hasClass("collapsed-box")) {
			box.addClass("collapsed-box");
			bf.slideUp();
		} else {
			box.removeClass("collapsed-box");
			bf.slideDown();
		}
	});

	/*
	 * ADD SLIMSCROLL TO THE TOP NAV DROPDOWNS
	 * ---------------------------------------
	 */
	$(".navbar .menu").slimscroll({
		height : "200px",
		alwaysVisible : false,
		size : "3px"
	}).css("width", "100%");

	/*
	 * INITIALIZE BUTTON TOGGLE ------------------------
	 */
	$('.btn-group[data-toggle="btn-toggle"]').each(function() {
		var group = $(this);
		$(this).find(".btn").click(function(e) {
			group.find(".btn.active").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
		});

	});

	$("[data-widget='remove']").click(function() {
		// Find the box parent
		var box = $(this).parents(".box").first();
		box.slideUp();
	});

	/* Sidebar tree view */
	$(".sidebar .treeview").tree();

	/*
	 * Make sure that the sidebar is streched full height
	 * --------------------------------------------- We are gonna assign a
	 * min-height value every time the wrapper gets resized and upon page load.
	 * We will use Ben Alman's method for detecting the resize event.
	 * 
	 */
	function _fix() {
		// Get window height and the wrapper height
		var height = $(window).height() - $("body > .header").height();
		$(".wrapper").css("min-height", height + "px");
		var content = $(".wrapper").height();
		// If the wrapper height is greater than the window
		if (content > height)
			// then set sidebar height to the wrapper
			$(".left-side, html, body").css("min-height", content + "px");
		else {
			// Otherwise, set the sidebar to the height of the window
			$(".left-side, html, body").css("min-height", height + "px");
		}
	}
	// Fire upon load
	_fix();
	// Fire when wrapper is resized
	$(".wrapper").resize(function() {
		_fix();
		fix_sidebar();
	});

	// Fix the fixed layout sidebar scroll bug
	fix_sidebar();

	$(".treeview-menu > li ").click(function(index, elm) {
		var path = $(this).children("a").attr("data-url");
		$.utils.loadModule(path);
		$(".treeview-menu > li ").each(function(index, elm) {
			$(this).removeClass("choice");
		});
		$(this).addClass("choice");

	});

	window.onresize = function() {
		_fix();
		fix_sidebar();
	};
});
function fix_sidebar() {
	// Make sure the body tag has the .fixed class
	if (!$("body").hasClass("fixed")) {
		return;
	}

	// Add slimscroll
	$(".sidebar").slimscroll({
		height : ($(window).height() - $(".header").height()) + "px",
		color : "rgba(0,0,0,0.2)"
	});
}
function change_layout() {
	$("body").toggleClass("fixed");
	fix_sidebar();
}
function change_skin(cls) {
	$("body").removeClass("skin-blue skin-black");
	$("body").addClass(cls);
}

/*
 * BOX REFRESH BUTTON ------------------ This is a custom plugin to use with the
 * compenet BOX. It allows you to add a refresh button to the box. It converts
 * the box's state to a loading state.
 * 
 * USAGE: $("#box-widget").boxRefresh( options );
 */
(function($) {
	"use strict";

	$.fn.boxRefresh = function(options) {

		// Render options
		var settings = $.extend({
			// Refressh button selector
			trigger : ".refresh-btn",
			// File source to be loaded (e.g: ajax/src.php)
			source : "",
			// Callbacks
			onLoadStart : function(box) {
			}, // Right after the button has been clicked
			onLoadDone : function(box) {
			} // When the source has been loaded

		}, options);

		// The overlay
		var overlay = $('<div class="overlay"></div><div class="loading-img"></div>');

		return this
				.each(function() {
					// if a source is specified
					if (settings.source === "") {
						if (console) {
							console
									.log("Please specify a source first - boxRefresh()");
						}
						return;
					}
					// the box
					var box = $(this);
					// the button
					var rBtn = box.find(settings.trigger).first();

					// On trigger click
					rBtn.click(function(e) {
						e.preventDefault();
						// Add loading overlay
						start(box);

						// Perform ajax call
						box.find(".box-body").load(settings.source, function() {
							done(box);
						});

					});

				});

		function start(box) {
			// Add overlay and loading img
			box.append(overlay);

			settings.onLoadStart.call(box);
		}

		function done(box) {
			// Remove overlay and loading img
			box.find(overlay).remove();

			settings.onLoadDone.call(box);
		}

	};

})(jQuery);

/*
 * SIDEBAR MENU ------------ This is a custom plugin for the sidebar menu. It
 * provides a tree view.
 * 
 * Usage: $(".sidebar).tree();
 * 
 * Note: This plugin does not accept any options. Instead, it only requires a
 * class added to the element that contains a sub-menu.
 * 
 * When used with the sidebar, for example, it would look something like this:
 * <ul class='sidebar-menu'> <li class="treeview active"> <a href="#>Menu</a>
 * <ul class='treeview-menu'> <li class='active'><a href=#>Level 1</a></li>
 * </ul> </li> </ul>
 * 
 * Add .active class to <li> elements if you want the menu to be open
 * automatically on page load. See above for an example.
 */
(function($) {
	"use strict";

	$.fn.tree = function() {

		return this.each(function() {
			var btn = $(this).children("a").first();

			var menu = $(this).children(".treeview-menu").first();
			var isActive = $(this).hasClass('active');

			// initialize already active menus
			if (isActive) {
				menu.show();
				btn.children(".fa-angle-left").first().removeClass(
						"fa-angle-left").addClass("fa-angle-down");
			}
			// Slide open or close the menu on link click
			btn.click(function(e) {
				e.preventDefault();
				var isActive = btn.parent("li").hasClass('active');
				if (isActive) {
					// Slide up to close menu
					menu.slideUp();
					isActive = false;
					btn.children(".fa-angle-down").first().removeClass(
							"fa-angle-down").addClass("fa-angle-left");
					btn.parent("li").removeClass("active");
				} else {
					menu.slideDown();
					isActive = true;
					$(".treeview").each(
							function() {
								var active = $(this).attr("class");
								if (active != "treeview") {
									$(this).attr("class", "treeview");
									$(this).find(".fa-angle-down").first()
											.removeClass("fa-angle-down")
											.addClass("fa-angle-left");
									/*$(this).children(".treeview-menu").first()
											.css("display", "none");*/
									$(this).children(".treeview-menu").first().slideUp();
								}
							});

					btn.children(".fa-angle-left").first().removeClass(
							"fa-angle-left").addClass("fa-angle-down");
					btn.parent("li").addClass("active");
					btn.next().css("display", "block");
				}
			});

			/* Add margins to submenu elements to give it a tree look */
			menu.find("li > a").each(function() {
				var pad = parseInt($(this).css("margin-left")) + 10;

				$(this).css({
					"margin-left" : pad + "px"
				});
			});

		});

	};

}(jQuery));