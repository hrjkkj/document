F.module("superman:setting/setting_constructor",
function(d, f, k) {
	d("setting.css");
	var a = s_domain.staticUrl + "static/superman/img/mod/";
	var c = [];
	if (s_session.strategy_hit == 2) {
		c.push({
			otherClassName: "content-mod",
			childrenClass: "choice-border",
			tip: "mouseScrollGuide",
			domId: "mouseScroll_mod",
			descriptions: "滚轮切换卡片"
		})
	} else {
		if (s_session.strategy_hit == 3) {
			c.push({
				otherClassName: "content-mod",
				childrenClass: "choice-border",
				tip: "conRecommendTip",
				domId: "conRecommend_mod",
				descriptions: "情景推荐"
			})
		}
	}
	var j = $("#s_content_99"),
	g = true;
	var h = {
		skele: ['<div class="s-setting-tab s-opacity-white-background s-opacity-border1-bottom">', '<span class="title">卡片管理</span>', '<a href="#" onclick="return false;" class="hide-mods" id="s_hide_allmods" hidefocus><span class="bg"></span><span>隐藏全部卡片</span></a>', "#{childrenElement}", "</div>", '<div class="s-setting-mods" id="s_setting_mods">', '<div id="s_added_mods" class="s-opacity-white-background s-added-mods#{addModsState}">#{addedMods}</div>', '<div id="s_noadd_mods" class="s-opacity-white-background s-opacity-border3-top s-noadded-mods#{noModsState}">#{noAddedMods}</div>', "</div>"].join(""),
		mod: ['<a class="s-mod-item" id="s_moditem_#{id}" href="#" data-id="#{id}" data-imgname="#{imgname}" data-added="#{state}" data-name="#{name}" onclick="return false;" title=#{title} hidefocus>', '<div class="mod-icon"><img id="s_modimg_#{id}" class="icon-img" src="#{imgUrl}" width="60px" height="60px"/></div>', '<div class="mod-title"><span class="mod-check"></span><span class="title">#{name}</span><span class="subscribe">#{subscribe}</span></div>', "</a>"].join(""),
		confrim: ['<div class="s-setting-confirm" id="s_setting_confrim">', '<div class="s-confirm-win"><p class="tip">您确定取消全部订阅？</p>', '<p><a class="set-btn btn-ok" href="#" onclick="return false;" hidefocus>确认</a>', '<a class="set-btn btn-cancel" href="#" onclick="return false;" hidefocus>取消</a>', "</p>", "</div>", "</div>"].join(""),
		cardCtr: ['<a href="#" onclick="return false;" class="hide-mods #{otherClassName}"  hidefocus>' + ($.browser.ie == 8 ? '<span class="add-forie8" style="width:84px;height:42px;position:absolute;left:0;background:#fff;filter:alpha(opacity=0);"></span>': "") + '<span class="#{borderClass} #{reviewCheck}" id="#{myId}" data-attr="#{tips}"></span><span>#{description}</span></a>']
	};
	f.render = function() {
		var n = $.parseJSON($.trim($("#s_menus_textarea").html())).data;
		n = i(n);
		var s = [],
		t = [];
		$.each(n,
		function(v, w) {
			w.title = w.state == "1" ? "取消": "选择";
			w.subscribe = w.state == "1" ? "取消订阅": "订阅";
			w.imgUrl = $.url.escapeSSL("http://" + ((w.id) % 8 + 1) + ".su.bdimg.com/cardicon/") + w.imgname + (w.state == "0" ? "_b": "") + ".png";
			var u = $.formatString(h.mod, w);
			if (w.state == "1") {
				s.push(u)
			} else {
				t.push(u)
			}
		});
		var p = s.length,
		m = t.length;
		var l = function(u) {
			if (s_session.userTips[u] === true) {
				return true
			}
			return false
		};
		var r = "";
		for (var o = 0; o < c.length; o++) {
			r += $.formatString(h.cardCtr, {
				otherClassName: c[o].otherClassName,
				borderClass: c[o].childrenClass,
				tips: c[o].tip,
				myId: c[o].domId,
				description: c[o].descriptions,
				reviewCheck: l(c[o].tip) ? "checked": ""
			})
		}
		var q = {
			addModsState: p == 0 ? " no-mods": (m == 0 ? " all-mods": ""),
			noModsState: m == 0 ? " no-mods": (p == 0 ? " all-mods": ""),
			addedMods: s.join(""),
			noAddedMods: t.join(""),
			childrenElement: s_session.strategy_hit == 2 || s_session.strategy_hit == 3 ? r: ""
		};
		j.html($.formatString(h.skele, q))
	};
	f.updateModsLayer = function(p) {
		var o = p == "add" ? "#s_added_mods": "#s_noadd_mods",
		m = p == "add" ? "#s_noadd_mods": "#s_added_mods",
		q = $(m),
		l = $(o);
		l.removeClass("no-mods");
		q.removeClass("all-mods");
		if ($.isIE6 && (q.find(".s-mod-item").length == 1 || l.find(".s-mod-item").length == 0)) {
			l.width(l.width() + 1);
			q.width(q.width() + 1);
			setTimeout(function() {
				l.width(l.width() - 1);
				q.width(q.width() - 1)
			},
			10)
		}
		var n = q.find(".s-mod-item").length;
		if (n == 1) {
			q.addClass("no-mods");
			l.addClass("all-mods")
		} else {
			q.removeClass("no-mods");
			l.removeClass("all-mods")
		}
	};
	f.moveModItem = function(p, o) {
		var n = o == "add" ? "#s_added_mods": "#s_noadd_mods",
		l = $(n);
		p.data("added", o == "add" ? "1": "0");
		p.find(".subscribe").html(o == "add" ? "取消订阅": "订阅");
		p.attr("title", o == "add" ? "取消": "选择");
		var m = $.url.escapeSSL("http://" + ((p.data("id")) % 8 + 1) + ".su.bdimg.com/cardicon/") + p.data("imgname") + (o == "add" ? "": "_b") + ".png";
		p.find(".icon-img").attr("src", m);
		l.append(p);
		p.removeClass("is-hover");
		p.find(".mod-title").removeClass("hover-title")
	};
	var i = function(o) {
		var m = [];
		for (var n = 0,
		l = o.length; n < l; n++) {
			if (o[n].ismenu != "1") {
				continue
			}
			if (b(o[n].id)) {
				o[n].state = "1"
			} else {
				o[n].state = "0"
			}
			m.push(o[n])
		}
		return m
	};
	var b = function(p) {
		var n = $("#s_ctner_menus").find(".s-menu"),
		o;
		for (var m = 0,
		l = n.length; m < l; m++) {
			if (p == $(n[m]).attr("data-id")) {
				o = $(n[m]);
				break
			}
		}
		return o
	};
	f.showConfirmPop = function(n, l) {
		var m = $("#s_setting_confrim");
		if (m[0]) {
			m.show()
		} else {
			$("#s_setting_mods").append(h.confrim);
			m = $("#s_setting_confrim");
			m.delegate(".btn-ok", "click",
			function() {
				k.fire("modConfirmOperate", {
					cmd: "ok",
					id: n,
					name: l
				});
				e()
			}).delegate(".btn-cancel", "click",
			function(o) {
				e();
				k.fire("modConfirmOperate", {
					cmd: "cancel",
					opSource: "pop"
				})
			})
		}
		if ($.isIE6) {
			$("#s_setting_confrim").height($("#s_setting_mods").height())
		}
		k.fire("modConfirmOperate", {
			cmd: "show"
		})
	};
	var e = function() {
		$("#s_setting_confrim").hide()
	};
	j.delegate(".s-setting-tab .content-mod", "click",
	function() {
		var n = $(this),
		o = n.children("span.choice-border");
		value = true;
		var m = function(p) {
			if (s_session.userTips[p] === true) {
				return true
			}
			return false
		};
		var l = m(o.attr("data-attr"));
		if (l) {
			value = false;
			o.removeClass("checked")
		} else {
			o.addClass("checked")
		}
		if (s_session.userTips.conRecommendGuide) {
			F.use("superman:common/user_attr",
			function(p) {
				p.setAttr("conRecommendGuide", false)
			})
		}
		F.use("superman:common/user_attr",
		function(p) {
			p.setAttr(o.attr("data-attr"), value)
		})
	});
	f.iconImgUrl = a
});
F.module("superman:start/setting_start",
function(c, b, a) {
	var e = c("setting/setting_constructor"),
	f = c("setting/setting_action");
	var d = false;
	b.init = function(g) {
		if (!$("#s_content_99")[0]) {
			$("#s_ctner_contents").append('<div id="s_content_99" class="s-content" style="display:none"></div>')
		}
		if (!d) {
			e.render();
			f.init();
			if (g == "init") {
				$("#s_content_99").show()
			}
			d = true
		} else {
			if ($("#s_content_99").css("display") == "none") {}
		}
	}
});
F.module("superman:setting/mod_drag",
function(c, d, j) {
	var g = "s_setting_dash_mod",
	i = "s-setting-dash-mod",
	h = "s_setting_drag_mod",
	a = 8,
	e = false;
	d.init = function() {
		if (e) {
			return
		}
		e = true;
		$("#s_added_mods").delegate(".mod-icon", "mousedown",
		function(s) {
			if (s.which == 3) {
				return
			}
			var r = $(this).parents(".s-mod-item"),
			o = r.data("id");
			if (!o) {
				return
			}
			$("#s_added_mods").data("move", "1");
			var t = f(r),
			l = r.offset(),
			n = $("#s_added_mods").offset(),
			v = true,
			m = k(r),
			q = s.pageX - l.left,
			p = s.pageY - l.top,
			u = false;
			r.hide();
			t.css({
				position: "absolute",
				top: l.top - n.top,
				left: l.left - n.left,
				zIndex: 10
			});
			s.stopPropagation();
			$(document).bind("mousemove",
			function(H) {
				if (!o) {
					return
				}
				if (!v) {
					return
				}
				if ($.isIE) {
					t.get(0).setCapture()
				} else {
					window.captureEvents && window.captureEvents(Event.mousemove)
				}
				var J = b(),
				C = {
					x: H.pageX,
					y: H.pageY
				},
				D = $("#s_added_mods").find("." + i).index();
				var L = C.x - q,
				K = C.y - p,
				A = $("#s_added_mods"),
				z = A.offset();
				if (L > z.left && L < (z.left + A.innerWidth() - t.innerWidth())) {
					t.css("left", L - n.left)
				}
				if (K > z.top && K < (z.top + A.innerHeight() - t.innerHeight())) {
					t.css("top", K - n.top)
				}
				var y = document.body.scrollTop || document.documentElement.scrollTop;
				var G = y + 30,
				I = y + document.documentElement.clientHeight - 50;
				if (z.top < G) {
					if (C.y < G) {
						window.scrollBy(0, -20)
					} else {
						if (z.top + A.height() > I && C.y > I) {
							window.scrollBy(0, 20)
						}
					}
				} else {
					if (z.top + A.height() > I) {
						if (C.y > I) {
							window.scrollBy(0, 20)
						}
					}
				}
				for (var B = 0,
				E = J.length; B < E; B++) {
					if (t.attr("id") == J[B].dragId) {
						continue
					}
					if (C.x > J[B].left && C.x < J[B].left + J[B].width && C.y > J[B].top && C.y < J[B].top + J[B].height) {
						var x = $("#" + J[B].dragId);
						if (!x[0]) {
							return
						}
						var w = $("#s_added_mods").find(x).index();
						if (J[B].dragId.indexOf("s_moditem_") >= 0) {
							if (D > w) {
								x.before(m)
							} else {
								x.after(m)
							}
						} else {
							$("#" + J[B].dragId).append(m)
						}
						$("#s_added_mods").toggleClass("s-xxx-ie6");
						u = true
					}
				}
				H.preventDefault();
				H.stopPropagation()
			});
			$(document).bind("mouseup",
			function(w) {
				if (!o) {
					return
				}
				$("#s_added_mods").data("move", "0");
				if (v) {
					if ($.isIE) {
						t.get(0).releaseCapture()
					} else {
						window.releaseEvents && window.releaseEvents(Event.mousemove)
					}
					v = false;
					var x = m.offset();
					t.animate({
						top: x.top - n.top,
						left: x.left - n.left
					},
					{
						duration: 100,
						complete: function() {
							m.after(r).remove();
							t.remove();
							r.show();
							if (u) {
								j.use("setting/setting_action",
								function(y) {
									y.saveSeqNavs(o)
								})
							}
						}
					})
				}
			})
		})
	};
	var k = function(l) {
		var m = document.createElement("a");
		m.id = g;
		m.className = i;
		$(m).html('<div class="dash-inner"></div>');
		if (!$("#" + g)[0]) {
			l.after(m)
		}
		return $(m)
	};
	var f = function(m) {
		var l = document.createElement("div");
		l.id = h;
		l.className = m.attr("class");
		l.innerHTML = m.html();
		if (!$("#" + h)[0]) {
			$("#s_added_mods").append(l)
		}
		if (!$.isIE6) {
			$(l).append("<div class='drag-shadow'></div>")
		}
		$(l).addClass("drag-mod");
		$(l).off("mouseout").off("mouseout");
		return $(l)
	};
	var b = function() {
		var l = new Array(),
		q = null,
		s = null;
		var m = $("#s_added_mods").find(".s-mod-item");
		$.each(m,
		function(v, w) {
			$mod = $(w);
			s = $mod.offset();
			l.push({
				dragId: $mod.attr("id"),
				left: s.left,
				top: s.top,
				width: $mod.width(),
				height: $mod.innerHeight()
			})
		});
		var n = $("#s_added_mods"),
		t = n.find(".s-mod-item");
		count = t.length;
		$.each(t,
		function(v, w) {
			if ($(w).css("style") == "none") {
				count--
			}
		});
		var u = Math.ceil(count / a),
		o = (count % a == 0) ? a: (a - count % a);
		if (o > 0) {
			var p = n.offset();
			var r = {
				dragId: n.attr("id"),
				left: p.left + 96 * (a - o),
				top: p.top + 114 * (o == a ? u: u - 1) + a,
				width: 96 * o + 36,
				height: 114
			};
			l.push(r)
		}
		return l
	}
});
F.module("superman:setting/setting_action",
function(c, g, l) {
	var h = true;
	var i = c("setting/setting_constructor");
	var k = {
		submit: s_domain.baseuri + "/xman/submit/supermod"
	};
	g.init = function() {
		d()
	};
	var d = function() {
		$("#s_hide_allmods").bind("click",
		function() {
			l.fire("modConfirmOperate", {
				cmd: "ok",
				opSource: "btn"
			})
		});
		$("#s_added_mods").delegate(".mod-title", "mouseover",
		function() {
			if ($("#s_added_mods").data("move") == "1") {
				return
			}
			$(this).addClass("hover-title")
		}).delegate(".mod-title", "mouseout",
		function() {
			if ($("#s_added_mods").data("move") == "1") {
				return
			}
			$(this).removeClass("hover-title")
		}).delegate(".mod-icon", "mouseover",
		function() {
			$(this).parents(".s-mod-item").addClass("is-hover");
			F.call("superman:setting/mod_drag", "init")
		}).delegate(".mod-icon", "mouseout",
		function() {
			$(this).parents(".s-mod-item").removeClass("is-hover")
		}).delegate(".subscribe", "click",
		function() {
			if (!h) {
				return
			}
			var o = $(this),
			n = o.parents(".s-mod-item"),
			p = n.data("id");
			if ($("#s_added_mods").find(".s-mod-item").length == 1) {
				i.showConfirmPop(p, n.data("name"));
				return
			}
			l.fire("modOperate", {
				id: p,
				cmd: "del",
				name: n.data("name"),
				ismenu: 1,
				done: function() {
					if (p == 8) {
						l.fire("delSoccerTab")
					}
				}
			});
			f("del", n)
		});
		var m = false;
		$("#s_noadd_mods").delegate(".s-mod-item", "mouseenter",
		function() {
			var n = $(this);
			m = true;
			n.addClass("is-hover");
			var o = ($(this).find(".icon-img").attr("src")).replace(/_b.png$/, ".png");
			$(n.find(".icon-img")[0]).attr("src", o)
		}).delegate(".s-mod-item", "mouseleave",
		function() {
			if (!m) {
				return
			}
			$(this).removeClass("is-hover");
			var n = ($(this).find(".icon-img").attr("src")).replace(/.png$/, "_b.png");
			$($(this).find(".icon-img")[0]).attr("src", n)
		}).delegate(".s-mod-item", "click",
		function() {
			m = false;
			if (!h) {
				return
			}
			var n = $(this),
			o = n.data("id");
			l.fire("modOperate", {
				id: o,
				cmd: "add",
				name: n.data("name"),
				ismenu: 1
			});
			f("add", n);
			if ($("#s_content_99")[0] && $("#s_content_99").height() > 320) {
				$("#s_content_99").css("position", "relative")
			}
		});
		l.listen("superman:setting/setting_constructor", "modConfirmOperate",
		function(n) {
			if (n.cmd == "ok") {
				l.fire("modOperate", {
					id: n.id,
					cmd: "del",
					name: n.name,
					ismenu: 1
				});
				e(n.id, "del",
				function(o) {
					$.ajaxpost(k.submit, {
						cmd: "del",
						id: n.id,
						ids: o
					},
					function(p) {})
				})
			}
		})
	};
	var e = function(q, o, p) {
		var m = [],
		n = $("#s_added_mods").find(".s-mod-item");
		$.each(n,
		function(r, s) {
			var t = $(s).data("id");
			if ($(s).data("temp") == 1 || (o == "del" && t == q)) {
				return
			}
			m.push(t)
		});
		if (o == "add" && $.inArray(parseInt(q, 10), m) == -1) {
			m.push(q)
		}
	};
	var f = function(o, n) {
		h = false;
		i.updateModsLayer(o);
		n.hide();
		var m = j(o, n, n.attr("id").replace("s_moditem_", "s_moveitem_"));
		a(o, m, n)
	};
	g.saveSeqNavs = function(m) {
		if (!m) {
			return
		}
		e(m, "sort",
		function(n) {
			$.ajaxpost(k.submit, {
				cmd: "sort",
				id: m,
				ids: n
			},
			function(o) {});
			l.fire("modOperate", {
				id: m,
				seqids: n,
				cmd: "drag"
			})
		})
	};
	var b = function() {
		var m = $("#s_added_mods").find(".s-mod-item");
		return m.length > 0
	};
	var j = function(o, r, m) {
		var q = r.clone();
		q.attr("id", m);
		q.data("temp", 1);
		if (!$("#" + m)[0]) {
			$("#s_setting_mods").append(q)
		}
		q.off("mouseover").off("mouseout").off("mouseenter").off("mouseleave");
		var p = $("#s_content_99").offset(),
		n = r.offset();
		q.css({
			position: "absolute",
			top: n.top - p.top - 44,
			left: n.left - p.left,
			zIndex: 10
		});
		return q
	};
	var a = function(n, v, o) {
		var y = "s_setting_mods",
		x = $("#" + y),
		t = $("#" + (n == "add" ? "s_added_mods": "s_noadd_mods")).find(".s-mod-item").eq( - 1),
		r = (t.index() + 1) % 8,
		s = x.offset(),
		w = t.offset(),
		p = "",
		m = "",
		u = "",
		q = "";
		if (t[0]) {
			p = r == 0 ? (t.offset().top + 20) : t.offset().top,
			m = r == 0 ? (x.offset().left + 30) : (t.offset().left + 86);
			u = p - s.top;
			q = m - s.left
		} else {
			u = n == "add" ? 20 : ($("#s_noadd_mods").offset().top - s.top + 20);
			q = 30
		}
		v.animate({
			top: u,
			left: q
		},
		{
			duration: 100,
			complete: function() {
				v.remove();
				i.moveModItem(o, n);
				o.show();
				h = true
			}
		})
	};
	g.getModIds = e;
	g.moveModItem = f
});