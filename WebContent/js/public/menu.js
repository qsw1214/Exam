/**
 * Qlq   2018.1.8将菜单的js抽出去
 */
/*******************菜单插件部分********************/
;
(function($, window, document, undefined) {
	if ($('ul.mtree').length) {
		var collapsed = true;
		var close_same_level = false;
		var duration = 400;
		var listAnim = true;
		var easing = 'easeOutQuart';
		$('.mtree ul').css({
			'overflow' : 'hidden',
			'height' : collapsed ? 0 : 'auto',
			'display' : collapsed ? 'none' : 'block'
		});
		var node = $('.mtree li:has(ul)');
		node
				.each(function(index, val) {
					$(this).children(':first-child').css('cursor', 'pointer');
					$(this).addClass(
							'mtree-node mtree-'
									+ (collapsed ? 'closed' : 'open'));
					$(this)
							.children('ul')
							.addClass(
									'mtree-level-'
											+ ($(this).parentsUntil(
													$('ul.mtree'), 'ul').length + 1));
				});
		$('.mtree li > *:first-child').on(
				'click.mtree-active',
				function(e) {
					if ($(this).parent().hasClass('mtree-closed')) {
						$('.mtree-active').not($(this).parent()).removeClass(
								'mtree-active');
						$(this).parent().addClass('mtree-active');
					} else if ($(this).parent().hasClass('mtree-open')) {
						$(this).parent().removeClass('mtree-active');
					} else {
						$('.mtree-active').not($(this).parent()).removeClass(
								'mtree-active');
						$(this).parent().toggleClass('mtree-active');
					}
				});
		node.children(':first-child').on(
				'click.mtree',
				function(e) {
					var el = $(this).parent().children('ul').first();
					var isOpen = $(this).parent().hasClass('mtree-open');
					if ((close_same_level || $('.csl').hasClass('active'))
							&& !isOpen) {
						var close_items = $(this).closest('ul').children(
								'.mtree-open').not($(this).parent()).children(
								'ul');
						if ($.Velocity) {
							close_items.velocity({
								height : 0
							}, {
								duration : duration,
								easing : easing,
								display : 'none',
								delay : 100,
								complete : function() {
									setNodeClass($(this).parent(), true);
								}
							});
						} else {
							close_items.delay(100).slideToggle(duration,
									function() {
										setNodeClass($(this).parent(), true);
									});
						}
					}
					el.css({
						'height' : 'auto'
					});
					if (!isOpen && $.Velocity && listAnim)
						el.find(' > li, li.mtree-open > ul > li').css({
							'opacity' : 0
						}).velocity('stop').velocity('list');
					if ($.Velocity) {
						el.velocity('stop').velocity(
								{
									height : isOpen ? [ 0, el.outerHeight() ]
											: [ el.outerHeight(), 0 ]
								},
								{
									queue : false,
									duration : duration,
									easing : easing,
									display : isOpen ? 'none' : 'block',
									begin : setNodeClass($(this).parent(),
											isOpen),
									complete : function() {
										if (!isOpen)
											$(this).css('height', 'auto');
									}
								});
					} else {
						setNodeClass($(this).parent(), isOpen);
						el.slideToggle(duration);
					}
					e.preventDefault();
				});
		function setNodeClass(el, isOpen) {
			if (isOpen) {
				el.removeClass('mtree-open').addClass('mtree-closed');
			} else {
				el.removeClass('mtree-closed').addClass('mtree-open');
			}
		}
		if ($.Velocity && listAnim) {
			$.Velocity.Sequences.list = function(element, options, index, size) {
				$.Velocity.animate(element, {
					opacity : [ 1, 0 ],
					translateY : [ 0, -(index + 1) ]
				}, {
					delay : index * (duration / size / 2),
					duration : duration,
					easing : easing
				});
			};
		}
		if ($('.mtree').css('opacity') == 0) {
			if ($.Velocity) {
				$('.mtree').css('opacity', 1).children().css('opacity', 0)
						.velocity('list');
			} else {
				$('.mtree').show(200);
			}
		}
	}
}(jQuery, this, this.document));
$(document)
		.ready(
				function() {
					var mtree = $('ul.mtree');
					mtree.wrap('<div class=mtree-demo></div>');
					var skins = [ 'transit' ];
					mtree.addClass(skins[0]);
					$('body')
							.prepend(
									'<div class="mtree-skin-selector" style="display: none;"><ul class="button-group radius"></ul></div>');
					var s = $('.mtree-skin-selector');
					$.each(skins, function(index, val) {
						s.find('ul').append(
								'<li><button class="small skin">' + val
										+ '</button></li>');
					});
					s
							.find('ul')
							.append(
									'<li><button class="small csl active"></button></li>');
					s.find('button.skin').each(
							function(index) {
								$(this).on(
										'click.mtree-skin-selector',
										function() {
											s.find('button.skin.active')
													.removeClass('active');
											$(this).addClass('active');
											mtree.removeClass(skins.join(' '))
													.addClass(skins[index]);
										});
							});
					s.find('button:first').addClass('active');
					s.find('.csl').on('click.mtree-close-same-level',
							function() {
								$(this).toggleClass('active');
							});
				});

/***********************菜单折叠部分*********************/
$(function() {
	var u = location.pathname;

	u = u.substring(11, u.length);
	var fir = u.indexOf("/");
	var filename = u.substring(0, fir)
	//		删除class
	$(".mtree-active").removeClass("mtree-active mtree-open");
	if (filename == "examParper") {
		$(".mtree").children("li:eq(0)").removeClass("mtree-closed");
		$(".mtree").children("li:eq(0)").addClass("mtree-active mtree-open");
		$(".mtree").children("li:eq(0)").find("ul").css({
			display : "block",
			height : "auto"
		});
	}
	//获取到当前页面的二根文件夹名称（view下一层的文件夹）
	/* 
	 * 根据文件夹名称，展开相应的菜单
	 * 菜单展开方式是 添加 in 类， 
	 * 根据获取的file地址。截取view下一次文件夹。根据该文件夹，判断展开内容
	 */
	/* 	$(".in").removeClass("in");
		if (filename == "examParper") {
			$("#collapse1").addClass("in");
		} else if (filename == "gradeManage") {
			$("#collapse3").addClass("in");
		} else if (filename == "innerDepart") {
			$("#collapse6").addClass("in");
		} else if (filename == "outDepart") {
			$("#collapse4").addClass("in");
		} else if (filename == "questionLibrary") {
			$("#collapse2").addClass("in");
		} else if (filename == "systemManage") {
			$("#collapse8").addClass("in");
		} else if (filename == "train") {
			$("#collapse7").addClass("in");
		} else if (filename == "overhaul") {
			$("#collapse5").addClass("in");
		} else if (filename == "news") {
			$("#collapse9").addClass("in");
		} */

	//alert(filename)
	//根据文件夹名称，展开相应的菜单
	//菜单展开方式是 添加 in 类，
	//1、有 in 类的 div ，删除 in 类
	//2、根据文件名，查找已知的每个文件夹的id
	//3、根据id ，添加 in 类
})