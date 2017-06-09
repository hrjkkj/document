try { !
	function() {
		function e(e) {
			this.key = e,
			this.curCookie = "",
			this.lsCookie = "",
			this.udCookie = "",
			this.soCookie = "",
			this.udData = t(this.key),
			this.soObject = i(this.key, this),
			this.findCookie = "",
			this.type = -1,
			this.IS = !1,
			this.timer = 0,
			this.support = !1
		}
		function t(e) {
			var t = null,
			i = !0,
			o = "userData" + e;
			if (! (t = document.getElementById(o))) try {
				t = document.createElement("INPUT"),
				t.type = "hidden",
				t.style.display = "none",
				t.setAttribute("id", o),
				t.setAttribute("data-for", "result"),
				t.addBehavior("#default#userData"),
				$("body").prepend(t);
				var n = new Date;
				n.setDate(n.getDate() + 365),
				t.expires = n.toUTCString()
			} catch(s) {
				i = !1,
				t = null
			}
			return {
				setItem: function(e) {
					try {
						i && t && (t.setAttribute(o, e), t.save(o))
					} catch(n) {}
				},
				getItem: function() {
					try {
						if (i && t) return t.load(o),
						t.getAttribute(o) || ""
					} catch(e) {}
				},
				isSupport: function() {
					return i && t ? !0 : !1
				}
			}
		}
		function i(e, t) {
			function i() {
				c || (c = !0, $(window).on("swap_begin",
				function() {
					t.syncCookie()
				}), $(window).on("swap_end",
				function() {
					setTimeout(function() {
						t.IS = !0,
						t.syncAll(),
						t.IS = !1
					},
					0)
				}))
			}
			var o = null,
			n = !0,
			r = 0,
			a = "sharedObject" + e,
			d = "ec_swf_ready_callback",
			c = !1;
			if (window[d] = function() {
				r && clearTimeout(r),
				o = document[a] || window[a],
				t.syncAll(),
				i()
			},
			r = setTimeout(function() {
				t.syncAll(),
				i(),
				t.support = t.support || t.udData.isSupport() || t.soObject.isSupport(),
				t.support || t.sendLog(2)
			},
			2e3), document.getElementById(a)) o = document[a] || window[a];
			else try {
				var l = $('<div data-for="result" id="swfEveryCookieWrap"></div>').css({
					width: 0,
					height: 0,
					overflow: "hidden"
				}),
				u = $('<div id="swfEveryCookie"></div>');
				l.append(u),
				$("body").prepend(l);
				var f = {
					callback: d
				},
				p = {
					swliveconnect: "true",
					allowScriptAccess: "always"
				},
				h = {
					id: a,
					name: a
				};
				s.embedSWF("https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/env.swf", "swfEveryCookie", "0", "0", "9.0.0", !1, f, p, h)
			} catch(v) {
				n = !1
			}
			return {
				setItem: function(e) {
					try {
						if (n && o && o.setPSID) return o.setPSID(a, e)
					} catch(t) {}
				},
				getItem: function() {
					try {
						if (n && o && o.getPSID) return o.getPSID(a) || ""
					} catch(e) {}
				},
				isSupport: function() {
					return n && o ? !0 : !1
				}
			}
		}
		function o(e) {
			return e ? decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + e + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || "": void 0
		}
		function n(e, t, i, o, n, s) {
			return ! e || /^(?:expires|max\-age|path|domain|secure)$/i.test(e) ? !1 : (document.cookie = encodeURIComponent(e) + "=" + encodeURIComponent(t) + (i ? "; expires=" + i: "") + (n ? "; domain=" + n: "") + (o ? "; path=" + o: "") + (s ? "; secure": ""), !0)
		}
		var s = function() {
			function e() {
				if (!G && document.getElementsByTagName("body")[0]) {
					try {
						var e, t = C("span");
						t.style.display = "none",
						e = P.getElementsByTagName("body")[0].appendChild(t),
						e.parentNode.removeChild(e),
						e = null,
						t = null
					} catch(i) {
						return
					}
					G = !0;
					for (var o = V.length,
					n = 0; o > n; n++) V[n]()
				}
			}
			function t(e) {
				G ? e() : V[V.length] = e
			}
			function i(e) {
				if (typeof U.addEventListener !== L) U.addEventListener("load", e, !1);
				else if (typeof P.addEventListener !== L) P.addEventListener("load", e, !1);
				else if (typeof U.attachEvent !== L) k(U, "onload", e);
				else if ("function" == typeof U.onload) {
					var t = U.onload;
					U.onload = function() {
						t(),
						e()
					}
				} else U.onload = e
			}
			function o() {
				var e = P.getElementsByTagName("body")[0],
				t = C(O);
				t.setAttribute("style", "visibility:hidden;"),
				t.setAttribute("type", F);
				var i = e.appendChild(t);
				i ? !
				function() {
					if (typeof i.GetVariable !== L) try {
						var o = i.GetVariable("$version");
						o && (o = o.split(" ")[1].split(","), Z.pv = [g(o[0]), g(o[1]), g(o[2])])
					} catch(s) {
						Z.pv = [8, 0, 0]
					} else Z.pv = [8, 0, 0];
					e.removeChild(t),
					i = null,
					n()
				} () : n()
			}
			function n() {
				var e = W.length;
				if (e > 0) for (var t = 0; e > t; t++) {
					var i = W[t].id,
					o = W[t].callbackFn,
					n = {
						success: !1,
						id: i
					};
					if (Z.pv[0] > 0) {
						var s = m(i);
						if (s) if (!w(W[t].swfVersion) || Z.wk && Z.wk < 312) if (W[t].expressInstall && a()) {
							var l = {};
							l.data = W[t].expressInstall,
							l.width = s.getAttribute("width") || "0",
							l.height = s.getAttribute("height") || "0",
							s.getAttribute("class") && (l.styleclass = s.getAttribute("class")),
							s.getAttribute("align") && (l.align = s.getAttribute("align"));
							for (var u = {},
							f = s.getElementsByTagName("param"), p = f.length, h = 0; p > h; h++)"movie" !== f[h].getAttribute("name").toLowerCase() && (u[f[h].getAttribute("name")] = f[h].getAttribute("value"));
							d(l, u, i, o)
						} else c(s),
						o && o(n);
						else S(i, !0),
						o && (n.success = !0, n.ref = r(i), n.id = i, o(n))
					} else if (S(i, !0), o) {
						var v = r(i);
						v && typeof v.SetVariable !== L && (n.success = !0, n.ref = v, n.id = v.id),
						o(n)
					}
				}
			}
			function r(e) {
				var t = null,
				i = m(e);
				return i && "OBJECT" === i.nodeName.toUpperCase() && (t = typeof i.SetVariable !== L ? i: i.getElementsByTagName(O)[0] || i),
				t
			}
			function a() {
				return ! J && w("6.0.65") && (Z.win || Z.mac) && !(Z.wk && Z.wk < 312)
			}
			function d(e, t, i, o) {
				var n = m(i);
				if (i = y(i), J = !0, T = o || null, N = {
					success: !1,
					id: i
				},
				n) {
					"OBJECT" === n.nodeName.toUpperCase() ? (I = l(n), A = null) : (I = n, A = i),
					e.id = x,
					(typeof e.width === L || !/%$/.test(e.width) && g(e.width) < 310) && (e.width = "310"),
					(typeof e.height === L || !/%$/.test(e.height) && g(e.height) < 137) && (e.height = "137");
					var s = Z.ie ? "ActiveX": "PlugIn",
					r = "MMredirectURL=" + encodeURIComponent(U.location.toString().replace(/&/g, "%26")) + "&MMplayerType=" + s + "&MMdoctitle=" + encodeURIComponent(P.title.slice(0, 47) + " - Flash Player Installation");
					if (typeof t.flashvars !== L ? t.flashvars += "&" + r: t.flashvars = r, Z.ie && 4 != n.readyState) {
						var a = C("div");
						i += "SWFObjectNew",
						a.setAttribute("id", i),
						n.parentNode.insertBefore(a, n),
						n.style.display = "none",
						h(n)
					}
					f(e, t, i)
				}
			}
			function c(e) {
				if (Z.ie && 4 != e.readyState) {
					e.style.display = "none";
					var t = C("div");
					e.parentNode.insertBefore(t, e),
					t.parentNode.replaceChild(l(e), t),
					h(e)
				} else e.parentNode.replaceChild(l(e), e)
			}
			function l(e) {
				var t = C("div");
				if (Z.win && Z.ie) t.innerHTML = e.innerHTML;
				else {
					var i = e.getElementsByTagName(O)[0];
					if (i) {
						var o = i.childNodes;
						if (o) for (var n = o.length,
						s = 0; n > s; s++) 1 == o[s].nodeType && "PARAM" === o[s].nodeName || 8 == o[s].nodeType || t.appendChild(o[s].cloneNode(!0))
					}
				}
				return t
			}
			function u(e, t) {
				var i = C("div");
				return i.innerHTML = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" + e + "'>" + t + "</object>",
				i.firstChild
			}
			function f(e, t, i) {
				var o, n = m(i);
				if (i = y(i), Z.wk && Z.wk < 312) return o;
				if (n) {
					var s, r, a, d = C(Z.ie ? "div": O);
					typeof e.id === L && (e.id = i);
					for (a in t) t.hasOwnProperty(a) && "movie" !== a.toLowerCase() && p(d, a, t[a]);
					Z.ie && (d = u(e.data, d.innerHTML));
					for (s in e) e.hasOwnProperty(s) && (r = s.toLowerCase(), "styleclass" === r ? d.setAttribute("class", e[s]) : "classid" !== r && "data" !== r && d.setAttribute(s, e[s]));
					Z.ie ? H[H.length] = e.id: (d.setAttribute("type", F), d.setAttribute("data", e.data)),
					n.parentNode.replaceChild(d, n),
					o = d
				}
				return o
			}
			function p(e, t, i) {
				var o = C("param");
				o.setAttribute("name", t),
				o.setAttribute("value", i),
				e.appendChild(o)
			}
			function h(e) {
				var t = m(e);
				t && "OBJECT" === t.nodeName.toUpperCase() && (Z.ie ? (t.style.display = "none",
				function i() {
					if (4 == t.readyState) {
						for (var e in t)"function" == typeof t[e] && (t[e] = null);
						t.parentNode.removeChild(t)
					} else setTimeout(i, 10)
				} ()) : t.parentNode.removeChild(t))
			}
			function v(e) {
				return e && e.nodeType && 1 === e.nodeType
			}
			function y(e) {
				return v(e) ? e.id: e
			}
			function m(e) {
				if (v(e)) return e;
				var t = null;
				try {
					t = P.getElementById(e)
				} catch(i) {}
				return t
			}
			function C(e) {
				return P.createElement(e)
			}
			function g(e) {
				return parseInt(e, 10)
			}
			function k(e, t, i) {
				e.attachEvent(t, i),
				q[q.length] = [e, t, i]
			}
			function w(e) {
				e += "";
				var t = Z.pv,
				i = e.split(".");
				return i[0] = g(i[0]),
				i[1] = g(i[1]) || 0,
				i[2] = g(i[2]) || 0,
				t[0] > i[0] || t[0] == i[0] && t[1] > i[1] || t[0] == i[0] && t[1] == i[1] && t[2] >= i[2] ? !0 : !1
			}
			function b(e, t, i, o) {
				var n = P.getElementsByTagName("head")[0];
				if (n) {
					var s = "string" == typeof i ? i: "screen";
					if (o && (_ = null, $ = null), !_ || $ != s) {
						var r = C("style");
						r.setAttribute("type", "text/css"),
						r.setAttribute("media", s),
						_ = n.appendChild(r),
						Z.ie && typeof P.styleSheets !== L && P.styleSheets.length > 0 && (_ = P.styleSheets[P.styleSheets.length - 1]),
						$ = s
					}
					_ && (typeof _.addRule !== L ? _.addRule(e, t) : typeof P.createTextNode !== L && _.appendChild(P.createTextNode(e + " {" + t + "}")))
				}
			}
			function S(e, t) {
				if (X) {
					var i = t ? "visible": "hidden",
					o = m(e);
					G && o ? o.style.visibility = i: "string" == typeof e && b("#" + e, "visibility:" + i)
				}
			}
			function E(e) {
				var t = /[\\\"<>\.;]/,
				i = null !== t.exec(e);
				return i && typeof encodeURIComponent !== L ? encodeURIComponent(e) : e
			} {
				var I, A, T, N, _, $, L = "undefined",
				O = "object",
				B = "Shockwave Flash",
				D = "ShockwaveFlash.ShockwaveFlash",
				F = "application/x-shockwave-flash",
				x = "SWFObjectExprInst",
				j = "onreadystatechange",
				U = window,
				P = document,
				R = navigator,
				M = !1,
				V = [],
				W = [],
				H = [],
				q = [],
				G = !1,
				J = !1,
				X = !0,
				z = !1,
				Z = function() {
					var e = typeof P.getElementById !== L && typeof P.getElementsByTagName !== L && typeof P.createElement !== L,
					t = R.userAgent.toLowerCase(),
					i = R.platform.toLowerCase(),
					o = /win/.test(i ? i: t),
					n = /mac/.test(i ? i: t),
					s = /webkit/.test(t) ? parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
					r = "Microsoft Internet Explorer" === R.appName,
					a = [0, 0, 0],
					d = null;
					if (typeof R.plugins !== L && typeof R.plugins[B] === O) d = R.plugins[B].description,
					d && typeof R.mimeTypes !== L && R.mimeTypes[F] && R.mimeTypes[F].enabledPlugin && (M = !0, r = !1, d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), a[0] = g(d.replace(/^(.*)\..*$/, "$1")), a[1] = g(d.replace(/^.*\.(.*)\s.*$/, "$1")), a[2] = /[a-zA-Z]/.test(d) ? g(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1")) : 0);
					else if (typeof U.ActiveXObject !== L) try {
						var c = new ActiveXObject(D);
						c && (d = c.GetVariable("$version"), d && (r = !0, d = d.split(" ")[1].split(","), a = [g(d[0]), g(d[1]), g(d[2])]))
					} catch(l) {}
					return {
						w3: e,
						pv: a,
						wk: s,
						ie: r,
						win: o,
						mac: n
					}
				} (); !
				function() {
					Z.w3 && ((typeof P.readyState !== L && ("complete" === P.readyState || "interactive" === P.readyState) || typeof P.readyState === L && (P.getElementsByTagName("body")[0] || P.body)) && e(), G || (typeof P.addEventListener !== L && P.addEventListener("DOMContentLoaded", e, !1), Z.ie && (P.attachEvent(j,
					function t() {
						"complete" === P.readyState && (P.detachEvent(j, t), e())
					}), U == top && !
					function i() {
						if (!G) {
							try {
								P.documentElement.doScroll("left")
							} catch(t) {
								return void setTimeout(i, 0)
							}
							e()
						}
					} ()), Z.wk && !
					function o() {
						return G ? void 0 : /loaded|complete/.test(P.readyState) ? void e() : void setTimeout(o, 0)
					} ()))
				} ()
			}
			V[0] = function() {
				M ? o() : n()
			}; !
			function() {
				Z.ie && window.attachEvent("onunload",
				function() {
					for (var e = q.length,
					t = 0; e > t; t++) q[t][0].detachEvent(q[t][1], q[t][2]);
					for (var i = H.length,
					o = 0; i > o; o++) h(H[o]);
					for (var n in Z) Z[n] = null;
					Z = null;
					for (var r in s) s[r] = null;
					s = null
				})
			} ();
			return {
				registerObject: function(e, t, i, o) {
					if (Z.w3 && e && t) {
						var n = {};
						n.id = e,
						n.swfVersion = t,
						n.expressInstall = i,
						n.callbackFn = o,
						W[W.length] = n,
						S(e, !1)
					} else o && o({
						success: !1,
						id: e
					})
				},
				getObjectById: function(e) {
					return Z.w3 ? r(e) : void 0
				},
				embedSWF: function(e, i, o, n, s, r, c, l, u, p) {
					var h = y(i),
					v = {
						success: !1,
						id: h
					};
					Z.w3 && !(Z.wk && Z.wk < 312) && e && i && o && n && s ? (S(h, !1), t(function() {
						o += "",
						n += "";
						var t = {};
						if (u && typeof u === O) for (var y in u) t[y] = u[y];
						t.data = e,
						t.width = o,
						t.height = n;
						var m = {};
						if (l && typeof l === O) for (var C in l) m[C] = l[C];
						if (c && typeof c === O) for (var g in c) if (c.hasOwnProperty(g)) {
							var k = z ? encodeURIComponent(g) : g,
							b = z ? encodeURIComponent(c[g]) : c[g];
							typeof m.flashvars !== L ? m.flashvars += "&" + k + "=" + b: m.flashvars = k + "=" + b
						}
						if (w(s)) {
							var E = f(t, m, i);
							t.id == h && S(h, !0),
							v.success = !0,
							v.ref = E,
							v.id = E.id
						} else {
							if (r && a()) return t.data = r,
							void d(t, m, i, p);
							S(h, !0)
						}
						p && p(v)
					})) : p && p(v)
				},
				switchOffAutoHideShow: function() {
					X = !1
				},
				enableUriEncoding: function(e) {
					z = typeof e === L ? !0 : e
				},
				ua: Z,
				getFlashPlayerVersion: function() {
					return {
						major: Z.pv[0],
						minor: Z.pv[1],
						release: Z.pv[2]
					}
				},
				hasFlashPlayerVersion: w,
				createSWF: function(e, t, i) {
					return Z.w3 ? f(e, t, i) : void 0
				},
				showExpressInstall: function(e, t, i, o) {
					Z.w3 && a() && d(e, t, i, o)
				},
				removeSWF: function(e) {
					Z.w3 && h(e)
				},
				createCSS: function(e, t, i, o) {
					Z.w3 && b(e, t, i, o)
				},
				addDomLoadEvent: t,
				addLoadEvent: i,
				getQueryParamValue: function(e) {
					var t = P.location.search || P.location.hash;
					if (t) {
						if (/\?/.test(t) && (t = t.split("?")[1]), !e) return E(t);
						for (var i = t.split("&"), o = 0; o < i.length; o++) if (i[o].substring(0, i[o].indexOf("=")) == e) return E(i[o].substring(i[o].indexOf("=") + 1))
					}
					return ""
				},
				expressInstallCallback: function() {
					if (J) {
						var e = m(x);
						e && I && (e.parentNode.replaceChild(I, e), A && (S(A, !0), Z.ie && (I.style.display = "block")), T && T(N)),
						J = !1
					}
				},
				version: "2.3"
			}
		} ();
		e.prototype = {
			syncAll: function() {
				this.curCookie = this.httpCookie(),
				this.lsCookie = this.locStorage(),
				this.udCookie = this.udData.getItem(),
				this.IS === !1 && (this.soCookie = this.soObject.getItem()),
				this.everyCookieAll()
			},
			quickSync: function() {
				var e = this.httpCookie(),
				t = this.locStorage();
				t && e !== t && this.httpCookie(t)
			},
			locStorage: function(e) {
				try {
					var t = window.localStorage;
					if (t) {
						if (this.support = !0, void 0 === e) return t.getItem(this.key) || "";
						t.setItem(this.key, e)
					}
				} catch(i) {
					this.support = !1
				}
			},
			setFind: function(e, t) {
				this.findCookie = e,
				this.type = t
			},
			sendLog: function(e) {
				if (! (bds && bds.comm && 1 == bds.comm.ishome && window.s_domain && "home" == window.s_domain.base)) {
					var t = bds && bds.comm && bds.comm.ishome ? 1 : 0;
					if (1 !== t || bds.comm.queryEnc || (bds.comm.queryEnc = "inlo"), e = e || 0, 0 === e) {
						var i = "undefined" == typeof this.lsCookie ? "0": "1",
						o = "undefined" == typeof this.udCookie ? "0": "1",
						n = "undefined" == typeof this.soCookie ? "0": "1";
						c({
							fm: "inlo",
							rsv_psid_page: t,
							rsv_psid1: this.curCookie,
							rsv_psid2: this.findCookie,
							rsv_psid_type: this.type,
							rsv_psid_dev: i + o + n
						})
					} else 1 === e ? c({
						fm: "inlo",
						rsv_psid_page: t,
						rsv_psid0: this.httpCookie(),
						rsv_psid_deep_clear: 1
					}) : 2 === e && c({
						fm: "inlo",
						rsv_psid_page: t,
						rsv_psid0: this.httpCookie(),
						rsv_psid_not_support: 1
					})
				}
			},
			checkCookie: function() {
				if (this.findCookie) return void(this.type = 4);
				if (this.lsCookie) return void this.setFind(this.lsCookie, 1);
				if (this.udCookie) return void this.setFind(this.udCookie, 2);
				if (this.soCookie) return void this.setFind(this.soCookie, 3);
				if (this.curCookie) {
					this.setFind(this.curCookie, 0);
					var e = this;
					return void setTimeout(function() { (e.support || e.udData.isSupport() || e.soObject.isSupport()) && e.sendLog(1)
					},
					0)
				}
			},
			httpCookie: function(e) {
				if (void 0 === e) return o(this.key);
				var t = new Date;
				t.setTime(t.getTime() + 1009152e6),
				n(this.key, e, t.toUTCString(), "/", ".baidu.com")
			},
			syncCookie: function() {
				this.curCookie = this.httpCookie(),
				this.findCookie && this.curCookie !== this.findCookie && (this.type = 4, this.httpCookie(this.findCookie), this.sendLog())
			},
			everyCookieAll: function() {
				if (this.checkCookie(), this.findCookie) if (this.curCookie !== this.findCookie && (this.httpCookie(this.findCookie), this.sendLog()), this.lsCookie !== this.findCookie && this.locStorage(this.findCookie), this.udCookie !== this.findCookie && this.udData.setItem(this.findCookie), this.IS === !1) this.soCookie !== this.findCookie && this.soObject.setItem(this.findCookie);
				else {
					this.timer && clearTimeout(this.timer);
					var e = this;
					this.timer = setTimeout(function() {
						e.soCookie = e.soObject.getItem(),
						e.findCookie && e.soCookie !== e.findCookie && e.soObject.setItem(e.findCookie)
					},
					2e3)
				}
			}
		};
		var r = new e(String.fromCharCode(66, 73, 68, 85, 80, 83, 73, 68));
		r.quickSync(),
		$(window).on("unload",
		function() {
			r.syncAll()
		})
	} ()
} catch(e) {}