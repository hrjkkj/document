/*!
 * Tencent Video Source Tracing
 *
 * deploy exclude v.qq.com
 * - This script will set a cookie named "qtag" on current subdomain,
 * - and a global string variable "TEN_VIDEO_PTAG".
 *
 * @date    2015-05-29
 * @author  jamieyan
 */
!
function(t, e, r) {
	var n = {
		getUrlParam: function(e, r) {
			if (!e) return "";
			r = r || t.location.href;
			var n, a = RegExp("[?&#]" + e + "=([^&#]+)", "gi"),
			i = r.match(a);
			return i && i.length > 0 ? (n = i[i.length - 1].split("="), n && n.length > 1 ? n[1] : "") : ""
		},
		getHostnameFromUrl: function(e) {
			e = e || t.location.href;
			var r = RegExp("^(?:f|ht)tp(?:s)?://([^/]+)", "im"),
			n = e.match(r);
			return n && 2 === n.length ? n[1] : ""
		},
		contains: function(t, e) {
			for (var r = t.length; r--;) if (t[r] === e) return ! 0;
			return ! 1
		},
		__author__: "jamieyan"
	};
	n.cookie = function() {
		var t = function() {
			return t.get.apply(t, arguments)
		},
		n = t.utils = {
			isArray: Array.isArray ||
			function(t) {
				return "[object Array]" === Object.prototype.toString.call(t)
			},
			isPlainObject: function(t) {
				return !! t && "[object Object]" === Object.prototype.toString.call(t)
			},
			toArray: function(t) {
				return Array.prototype.slice.call(t)
			},
			getKeys: Object.keys ||
			function(t) {
				var e = [],
				r = "";
				for (r in t) t.hasOwnProperty(r) && e.push(r);
				return e
			},
			escape: function(t) {
				return (t + "").replace(/[,;"\\=\s%]/g,
				function(t) {
					return encodeURIComponent(t)
				})
			},
			retrieve: function(t, e) {
				return null === t ? e: t
			}
		};
		return t.defaults = {},
		t.expiresMultiplier = 86400,
		t.set = function(t, a, i) {
			if (n.isPlainObject(t)) for (var o in t) t.hasOwnProperty(o) && this.set(o, t[o], a);
			else {
				i = n.isPlainObject(i) ? i: {
					expires: i
				};
				var s = i.expires !== r ? i.expires: this.defaults.expires || "",
				c = typeof s;
				"string" === c && "" !== s ? s = new Date(s) : "number" === c && (s = new Date( + new Date + 1e3 * this.expiresMultiplier * s)),
				"" !== s && "toGMTString" in s && (s = ";expires=" + s.toGMTString());
				var l = i.path || this.defaults.path;
				l = l ? ";path=" + l: "";
				var u = i.domain || this.defaults.domain;
				u = u ? ";domain=" + u: "";
				var g = i.secure || this.defaults.secure ? ";secure": "";
				e.cookie = n.escape(t) + "=" + n.escape(a) + s + l + u + g
			}
			return this
		},
		t.remove = function(t) {
			t = n.isArray(t) ? t: n.toArray(arguments);
			for (var e = 0,
			r = t.length; r > e; e++) this.set(t[e], "", -1);
			return this
		},
		t.empty = function() {
			return this.remove(n.getKeys(this.all()))
		},
		t.get = function(t, e) {
			e = e || r;
			var a = this.all();
			if (n.isArray(t)) {
				for (var i = {},
				o = 0,
				s = t.length; s > o; o++) {
					var c = t[o];
					i[c] = n.retrieve(a[c], e)
				}
				return i
			}
			return n.retrieve(a[t], e)
		},
		t.all = function() {
			if ("" === e.cookie) return {};
			for (var t = e.cookie.split("; "), r = {},
			n = 0, a = t.length; a > n; n++) {
				var i, o, s = t[n].split("=");
				try {
					i = decodeURIComponent(s[0])
				} catch(c) {
					i = s[0]
				}
				try {
					o = decodeURIComponent(s[1])
				} catch(c) {
					o = s[1]
				}
				r[i] = o
			}
			return r
		},
		t.enabled = function() {
			if (navigator.cookieEnabled) return ! 0;
			var e = "_" === t.set("_", "_").get("_");
			return t.remove("_"),
			e
		},
		t
	} ();
	var a = {
		_config: {
			key: "ptag",
			dm: location.hostname,
			path: "/"
		},
		_res: {
			ptag: null,
			qtag: null
		},
		getWhole: function() {
			return n.cookie.get(this._config.key) || ""
		},
		get: function() {
			var t = n.cookie.get(this._config.key);
			if (t && "string" == typeof t) {
				var e = t.split("|");
				this._res.ptag = e[0] || null,
				this._res.qtag = e[1] || null
			}
			return this._res
		},
		set: function(t, e) {
			if (t) {
				var r = "string" == typeof t.ptag ? t.ptag: this.get().ptag || "",
				a = "string" == typeof t.qtag ? t.qtag: this.get().qtag || "",
				i = r + "|" + a;
				return n.cookie.set(this._config.key, i, {
					expires: "",
					domain: e || this._config.dm,
					path: this._config.path
				})
			}
		}
	},
	i = {
		all: ["/"],
		"sports.qq.com": ["/", "/nba/", "/nbavideo/", "/kbsweb/game.htm", "/photo/"],
		"fashion.qq.com": ["/vogue/vogue_list.htm", "/lifestyle/lifestyle_list.htm"]
	},
	o = function() {
		for (var r = "",
		o = t.location.href.toLowerCase(), s = e.referrer, c = "" !== s ? n.getHostnameFromUrl(s) : null, l = c && c !== location.hostname, u = ["ptag", "adtag", "pgv_ref"], g = 0, f = u.length; f > g && !(r = n.getUrlParam(u[g], o)); g++); ! r && l && (r = c.replace(/\./g, "_")),
		r && a.set({
			ptag: r,
			qtag: ""
		}),
		(n.contains(i.all, location.pathname) || i[location.hostname] && n.contains(i[location.hostname], location.pathname)) && a.set({
			qtag: location.pathname
		})
	};
	t.TEN_VIDEO_PTAG = function() {
		return o(),
		a.getWhole()
	} ()
} (window, document);
/*  |xGv00|d5b2f1c478d16a03a505bc5a932dc429 */
