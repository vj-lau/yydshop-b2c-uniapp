module.exports = function(t) {
	var i = {};

	function e(n) {
		if (i[n]) return i[n].exports;
		var o = i[n] = {
			i: n,
			l: !1,
			exports: {}
		};
		return t[n].call(o.exports, o, o.exports, e), o.l = !0, o.exports
	}
	return e.m = t, e.c = i, e.d = function(t, i, n) {
		e.o(t, i) || Object.defineProperty(t, i, {
			enumerable: !0,
			get: n
		})
	}, e.r = function(t) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(t, "__esModule", {
			value: !0
		})
	}, e.t = function(t, i) {
		if (1 & i && (t = e(t)), 8 & i) return t;
		if (4 & i && "object" == typeof t && t && t.__esModule) return t;
		var n = Object.create(null);
		if (e.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: t
			}), 2 & i && "string" != typeof t)
			for (var o in t) e.d(n, o, function(i) {
				return t[i]
			}.bind(null, o));
		return n
	}, e.n = function(t) {
		var i = t && t.__esModule ? function() {
			return t.default
		} : function() {
			return t
		};
		return e.d(i, "a", i), i
	}, e.o = function(t, i) {
		return Object.prototype.hasOwnProperty.call(t, i)
	}, e.p = "", e(e.s = 0)
}([function(t, i, e) {
	"use strict";
	e.r(i);
	const n = "object" == typeof swan ? "mp-baidu" : "object" == typeof my ? "mp-alipay" : "mp-weixin",
		o = function() {
			if ("undefined" != typeof uni) return uni;
			if ("undefined" != typeof wx) return wx;
			throw new Error("enviroment not support")
		}(),
		r = [.296, .313, .436, .638, .586, .89, .87, .256, .334, .334, .455, .742, .241, .433, .241, .427, .586, .586,
			.586, .586, .586, .586, .586, .586, .586, .586, .241, .241, .742, .742, .742, .483, 1.031, .704, .627, .669, .762,
			.55, .531, .744, .773, .294, .396, .635, .513, .977, .813, .815, .612, .815, .653, .577, .573, .747, .676, 1.018,
			.645, .604, .62, .334, .416, .334, .742, .448, .295, .553, .639, .501, .64, .567, .347, .64, .616, .266, .267,
			.544, .266, .937, .616, .636, .639, .64, .382, .463, .373, .616, .525, .79, .507, .529, .492, .334, .269, .334,
			.742, .296
		];
	var s = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	class h {
		constructor(t, i, e) {
			var n, o, r;
			this.offsetTop = 0, this.offsetLeft = 0, this.contentHeight = 0, this.contentWidth = 0, this.painter = t, this.parent =
				e, this.position = null != (n = i.position) ? n : "static", this.left = null != (o = i.left) ? o : 0, this.top =
				null != (r = i.top) ? r : 0
		}
		layout() {
			return s(this, void 0, void 0, (function*() {
				let t = yield this._layout();
				return this.contentHeight = t.height, this.contentWidth = t.width, t
			}))
		}
		get anchorX() {
			var t, i;
			return null != (i = null === (t = this.parent) || void 0 === t ? void 0 : t.elementX) ? i : 0
		}
		get anchorY() {
			var t, i;
			return null != (i = null === (t = this.parent) || void 0 === t ? void 0 : t.elementY) ? i : 0
		}
		get elementX() {
			switch (this.position) {
				case "absolute":
					return this.left + this.anchorX;
				case "static":
					return this.left + this.offsetLeft + this.anchorX;
				default:
					throw new TypeError("unknown position type")
			}
		}
		get elementY() {
			switch (this.position) {
				case "absolute":
					return this.top + this.anchorY;
				case "static":
					return this.top + this.offsetTop + this.anchorY;
				default:
					throw new TypeError("unknown position type")
			}
		}
		get offsetHeight() {
			return this.top + this.contentHeight
		}
		get offsetWidth() {
			return this.left + this.contentWidth
		}
	}
	class l extends class {
		constructor(t) {
			this.element = t
		}
		get painter() {
			return this.element.painter
		}
	} {
		constructor(t, i) {
			super(t), this.option = i
		}
		get style() {
			const {
				ctx: t,
				upx2px: i
			} = this.painter, {
				x1: e,
				x2: n,
				y1: o,
				y2: r
			} = this.option, s = t.createLinearGradient(i(this.element.elementX + e), i(this.element.elementY + o), i(this.element
				.elementX + n), i(this.element.elementY + r));
			return this.option.colorStops.forEach(t => {
				s.addColorStop(t.offset, t.color)
			}), s
		}
	}

	function a(t, i) {
		if ("string" == typeof i) return i;
		switch (i.type) {
			case "liner-gradient":
				return new l(t, i).style;
			default:
				throw new Error("Unkwon option type")
		}
	}

	function c(t, i, e = 1) {
		return e % 2 ? [Math.floor(t) + .5, Math.floor(i) + .5] : [Math.round(t), Math.round(i)]
	}
	class u extends h {
		constructor(t, i, e) {
			var n, o, r, s, h;
			super(t, i, e), this.option = {
				dx: (n = i.dx, null != n ? n : 0),
				dy: (o = i.dy, null != o ? o : 0),
				color: (r = i.color, null != r ? r : "#000"),
				dashPattern: (s = i.dashPattern, null != s ? s : [1, 0]),
				lineWidth: (h = i.lineWidth, null != h ? h : 1)
			}
		}
		_layout() {
			return {
				width: this.option.dx,
				height: this.option.dy
			}
		}
		paint() {
			let t = this.painter.upx2px(this.elementX),
				i = this.painter.upx2px(this.elementY),
				e = this.painter.upx2px(this.elementX + this.option.dx),
				n = this.painter.upx2px(this.elementY + this.option.dy),
				o = this.painter.upx2px(this.option.lineWidth);
			this.painter.ctx.beginPath(), this.painter.ctx.moveTo(...c(t, i, o)), this.painter.ctx.lineTo(...c(e, n, o)),
				this.painter.ctx.setLineDash(this.option.dashPattern.map(t => this.painter.upx2px(t))), this.painter.setStrokeStyle(
					a(this, this.option.color)), this.painter.ctx.lineWidth = o, this.painter.ctx.stroke()
		}
	}
	class p extends h {
		constructor(t, i, e) {
			var n, o, r, s, h, l, a, c, u, p;
			super(t, i, e), this.option = {
				color: (n = i.color, null != n ? n : "#000"),
				align: (o = i.align, null != o ? o : "left"),
				fontWeight: (r = i.fontWeight, null != r ? r : "normal"),
				fontStyle: (s = i.fontStyle, null != s ? s : "normal"),
				fontFamily: (h = i.fontFamily, null != h ? h : "serial"),
				fontSize: (l = i.fontSize, null != l ? l : 30),
				baseline: (a = i.baseline, null != a ? a : "top"),
				content: (c = i.content, null != c ? c : ""),
				width: (u = i.width, null != u ? u : void 0),
				textDecoration: (p = i.textDecoration, null != p ? p : "none")
			}
		}
		_layout() {
			var t;
			return {
				width: null != (t = this.option.width) ? t : this.painter.measureText(this.option.content, this.option.fontSize),
				height: this.option.fontSize
			}
		}
		paint({
			inTextBlock: t = !1
		} = {}) {
			this.painter.ctx.font = ["normal" != this.option.fontWeight && this.option.fontWeight, "normal" != this.option.fontStyle &&
					this.option.fontStyle, this.painter.upx2px(this.option.fontSize) + "px", this.option.fontFamily
				].filter(Boolean).join(" "), t || this.painter.setFillStyle(a(this, this.option.color)), this.painter.ctx.setFontSize(
					this.painter.upx2px(this.option.fontSize)), this.painter.ctx.setTextBaseline(this.option.baseline), this.painter
				.ctx.setTextAlign(this.option.align), this.painter.ctx.fillText(this.option.content, this.painter.upx2px(this.elementX),
					this.painter.upx2px(this.elementY)), this.paintTextDecoration()
		}
		paintTextDecoration() {
			"line-through" == this.option.textDecoration && new u(this.painter, {
				top: this.elementY + .4 * this.option.fontSize,
				left: this.elementX,
				dx: this.contentWidth,
				dy: 0,
				color: this.option.color
			}).paint()
		}
	}
	class d {
		constructor(t) {
			this.fontSize = t.fontSize, this.lineClamp = t.lineClamp || 1 / 0, this.width = t.width, this.ctx = t.painter.ctx,
				this.painter = t.painter, this.content = t.content, this.lines = [], this.currentLineText = "", this.position =
				0, this.endPostion = this.position, this.isOverflow = !1, this.isDry = !1, this.isFull = !1
		}
		split() {
			return this.ctx.setFontSize(this.fontSize), this.fillText(), this.lines
		}
		minCharNumberInWidth(t) {
			return Math.ceil(t / this.fontSize)
		}
		freeSpaceInCurrentLine() {
			if (this.currentLineText.length) {
				let t = this.painter.measureText(this.currentLineText, this.fontSize);
				return this.width - (t || 0)
			}
			return this.width
		}
		adjustCharNumberInCurrentLine(t) {
			let i = this.currentLineText.length + t,
				e = this.content.length;
			i = Math.min(i, e), this.isDry = i == e, this.currentLineText = this.content.slice(0, i)
		}
		commitLine() {
			this.content = this.content.slice(this.currentLineText.length), this.lines.push(this.currentLineText), this.currentLineText =
				"", this.lines.length == this.lineClamp && (this.isFull = !0, 0 == this.isDry && (this.isOverflow = !0))
		}
		handleOverflow() {
			let t = this.lines.pop();
			t = t.substring(0, Math.max(0, t.length - 1)) + "...", this.lines.push(t)
		}
		fillText() {
			let t = this.freeSpaceInCurrentLine();
			if (t <= 0) {
				if (this.adjustCharNumberInCurrentLine(-1), this.commitLine(), this.isOverflow && this.handleOverflow(), this.isFull)
					return;
				t = this.freeSpaceInCurrentLine()
			} else if (this.isDry) return void this.commitLine();
			let i = this.minCharNumberInWidth(t);
			this.adjustCharNumberInCurrentLine(i), this.fillText()
		}
	}
	var f = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	class x extends h {
		constructor(t, i, e) {
			var n, o, r, s, h, l, a;
			super(t, i, e), this.option = Object.assign(Object.assign({}, i), {
				width: (n = i.width, null != n ? n : 100),
				height: (o = i.height, null != o ? o : "auto"),
				fontSize: (r = i.fontSize, null != r ? r : 30),
				content: (s = i.content, null != s ? s : ""),
				lineHeight: (h = i.lineHeight, null != h ? h : 40),
				lineClamp: (l = i.lineClamp, null != l ? l : 0),
				color: (a = i.color, null != a ? a : "black")
			}), this.lines = []
		}
		_layout() {
			return this.lines = new d({
				fontSize: this.option.fontSize,
				lineClamp: this.option.lineClamp,
				width: this.option.width,
				painter: this.painter,
				content: this.option.content
			}).split(), {
				width: this.option.width,
				height: "auto" == this.option.height ? (this.lines.length - 1) * this.option.lineHeight + this.option.fontSize :
					this.option.height
			}
		}
		paint() {
			return f(this, void 0, void 0, (function*() {
				this.painter.setFillStyle(a(this, this.option.color)), this.lines.map((t, i) => {
					let e = Object.assign(Object.assign({}, this.option), {
						type: "text",
						top: this.elementY + i * this.option.lineHeight,
						left: this.elementX,
						position: this.position,
						content: t
					});
					new p(this.painter, e).paint({
						inTextBlock: !0
					})
				})
			}))
		}
	}
	var m = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	const w = function(t) {
		let i = Object.create(null);
		return function(e) {
			return e in i || (i[e] = t(e)), i[e]
		}
	}((function(t) {
		return m(this, void 0, void 0, (function*() {
			try {
				let {
					width: e = 100,
					height: n = 100
				} = yield(i = uni.getImageInfo, function(t = {}) {
					return new Promise((e, n) => {
						t.success = e, t.fail = n, i(t)
					})
				})({
					src: t
				});
				return {
					width: e,
					height: n
				}
			} catch (t) {
				return console.log("mp-painter:getImageOriginSize: fail, use default size: width = 100, height = 100"), {
					width: 100,
					height: 100
				}
			}
			var i
		}))
	}));
	class y extends h {
		constructor(t, i, e) {
			var n, o, r, s;
			super(t, i, e), this.option = {
				width: (n = i.width, null != n ? n : 100),
				height: (o = i.height, null != o ? o : 100),
				objectFit: (r = i.objectFit, null != r ? r : "fill"),
				objectPosition: (s = i.objectPosition, null != s ? s : ["center", "center"]),
				src: i.src
			}
		}
		_layout() {
			return {
				width: this.option.width,
				height: this.option.height
			}
		}
		paint() {
			return m(this, void 0, void 0, (function*() {
				let t = this.painter.upx2px;
				if (!this.option.src) return;
				let i = yield function(t, i) {
					return m(this, void 0, void 0, (function*() {
						console.log(t,i.src);
						let e = t.platform;
				
						return /^\./.test(i.src) || /^\/static/.test(i.src) || /^data:image\//.test(i.src) || "mp-alipay" ==
							e && /^https:\/\/resource\//.test(i.src) || "mp-weixin" == e && /^wxfile:/.test(i.src) || "mp-baidu" ==
							e && /^bdfile:\/\/tmp/.test(i.src) || /^_doc\//.test(i.src) ? i.src : (console.log("mp-painter:绘制图片: 下载图片文件:", i.src), yield(
								n = i.src, new Promise((t, i) => o.downloadFile({
									url: n,
									success: i => t(i.tempFilePath),
									fail: i
								}))).catch(t => (console.log("mp-painter:下载错误: ", t), "")));
						var n
					}))
				}(this.painter, this.option);
				if (i)
					if (console.log("mp-painter:调用小程序drawImage，使用:", i), "fill" != this.option.objectFit) {
						let {
							sx: e,
							sy: n,
							sh: o,
							sw: r,
							dx: s,
							dy: h,
							dh: l,
							dw: a
						} = function(t, i, e) {
							var n, o;
							let r = i.width / i.height,
								s = e.width / e.height,
								h = 1;
							if (r > s && "contain" == t.objectFit || r <= s && "cover" == t.objectFit) h = e.width / i.width;
							else {
								if (!(r > s && "cover" == t.objectFit || r <= s && "contain" == t.objectFit)) throw new Error(
									"Unkonwn concreteScale");
								h = e.height / i.height
							}
							let l = i.width * h,
								a = i.height * h,
								c = {
									left: 0,
									center: .5,
									right: 1
								} [(null === (n = t.objectPosition) || void 0 === n ? void 0 : n[0]) || "center"],
								u = {
									top: 0,
									center: .5,
									bottom: 1
								} [(null === (o = t.objectPosition) || void 0 === o ? void 0 : o[1]) || "center"],
								p = (e.width - l) * c,
								d = (e.height - a) * u,
								f = (t, i) => [(t - p) / h, (i - d) / h],
								[x, m] = f(0, 0),
								[w, y] = f(e.width, e.height);
							return {
								sx: Math.max(x, 0),
								sy: Math.max(m, 0),
								sw: Math.min(w - x, i.width),
								sh: Math.min(y - m, i.height),
								dx: Math.max(p, 0),
								dy: Math.max(d, 0),
								dw: Math.min(l, e.width),
								dh: Math.min(a, e.height)
							}
						}({
							objectFit: this.option.objectFit,
							objectPosition: this.option.objectPosition
						}, yield w(i), {
							width: this.option.width,
							height: this.option.height
						});
						this.painter.drawImage(i, e, n, r, o, t(s + this.elementX), t(h + this.elementY), t(a), t(l))
					} else this.painter.ctx.drawImage(i, t(this.elementX), t(this.elementY), t(this.option.width), t(this.option
						.height))
			}))
		}
	}
	class g extends class {
		constructor(t, i) {
			var e, n;
			this.element = t, this.left = null != (e = i.left) ? e : 0, this.top = null != (n = i.top) ? n : 0
		}
		get painter() {
			return this.element.painter
		}
		get pathX() {
			return this.element.elementX + this.left
		}
		get pathY() {
			return this.element.elementY + this.top
		}
	} {
		constructor(t, i) {
			super(t, i), this.option = i, this.option.borderRadius && this.assertBorderRadius()
		}
		assertBorderRadius() {
			this.normalizedBorderRadius.some(t => t < 0) && (console.warn("border radius must greater than 0, got:", this.normalizedBorderRadius
				.join(",")), this.option.borderRadius = 0)
		}
		paint() {
			this.reduceBorderRadius();
			let [t, i, e, n] = this.normalizedBorderRadius, {
				ctx: o,
				upx2px: r
			} = this.painter;
			o.beginPath(), o.moveTo(r(this.pathX), r(this.pathY + t)), this.painter.arcTo(r(this.pathX), r(this.pathY), r(
				this.pathX + t), r(this.pathY), r(t)), this.painter.arcTo(r(this.pathX + this.option.width), r(this.pathY), r(
				this.pathX + this.option.width), r(this.pathY + i), r(i)), this.painter.arcTo(r(this.pathX + this.option.width),
				r(this.pathY + this.option.height), r(this.pathX + this.option.width - e), r(this.pathY + this.option.height),
				r(e)), this.painter.arcTo(r(this.pathX), r(this.pathY + this.option.height), r(this.pathX), r(this.pathY +
				this.option.height - n), r(n)), o.closePath()
		}
		get normalizedBorderRadius() {
			return "number" == typeof this.option.borderRadius ? Array.from({
				length: 4
			}).fill(this.option.borderRadius) : [...this.option.borderRadius]
		}
		reduceBorderRadius() {
			let [t, i, e, n] = this.normalizedBorderRadius, o = Math.min(this.option.width / (t + i), this.option.height / (
				i + e), this.option.width / (n + e), this.option.height / (t + n));
			o >= 1 || (this.option.borderRadius = this.normalizedBorderRadius.map(t => t * o))
		}
	}

	function v(t, i) {
		switch (i.type) {
			case "rounded-rect":
				return new g(t, i);
			default:
				throw new Error("Unkwon option type")
		}
	}
	class b extends h {
		constructor(t, i, e) {
			var n, o, r, s, h, l, a;
			super(t, i, e), this.option = {
				width: (n = i.width, null != n ? n : 100),
				height: (o = i.height, null != o ? o : 100),
				borderRadius: (r = i.borderRadius, null != r ? r : 0),
				background: (s = i.background, null != s ? s : "transparent"),
				borderStyle: (h = i.borderStyle, null != h ? h : "solid"),
				borderWidth: (l = i.borderWidth, null != l ? l : 0),
				borderColor: (a = i.borderColor, null != a ? a : "#000")
			}
		}
		_layout() {
			return {
				width: this.option.width,
				height: this.option.height
			}
		}
		paint() {
			(this.shouldFill || this.shouldStroke) && (this.option.borderRadius ? this.paintByPath() : this.paintByRect())
		}
		get shouldFill() {
			return "trasparent" !== this.option.background
		}
		get shouldStroke() {
			return this.option.borderWidth > 0
		}
		applyFillStyle() {
			this.painter.setFillStyle(a(this, this.option.background))
		}
		applyStrokeStyle() {
			var t, i;
			this.painter.ctx.setLineDash((t = this.option.borderStyle, {
				dashed: [i = this.option.borderWidth, i],
				solid: [10, 0]
			} [t])), this.painter.ctx.lineWidth = this.painter.upx2px(this.option.borderWidth), this.painter.setStrokeStyle(
				this.option.borderColor)
		}
		paintByRect() {
			let t = [this.painter.upx2px(this.elementX), this.painter.upx2px(this.elementY), this.painter.upx2px(this.option
				.width), this.painter.upx2px(this.option.height)];
			this.shouldFill && (this.applyFillStyle(), this.painter.ctx.fillRect(...t)), this.shouldStroke && (this.applyStrokeStyle(),
				this.painter.ctx.strokeRect(...t))
		}
		paintByPath() {
			v(this, {
					type: "rounded-rect",
					height: this.option.height,
					width: this.option.width,
					borderRadius: this.option.borderRadius
				}).paint(), this.shouldFill && (this.painter.setFillStyle(a(this, this.option.background)), this.painter.ctx.fill()),
				this.shouldStroke && (this.applyStrokeStyle(), this.painter.ctx.stroke())
		}
	}
	var S = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	class T extends h {
		constructor(t, i, e) {
			var n, o, r, s;
			super(t, i, e), this.childOffsetTop = 0, this.childOffsetLeft = 0, this.option = {
				direction: (n = i.direction, null != n ? n : "vertical"),
				width: (o = i.width, null != o ? o : "auto"),
				height: (r = i.height, null != r ? r : "auto"),
				children: (s = i.children, null != s ? s : [])
			}, this.children = this.option.children.map(t => F(this.painter, t, this))
		}
		_layout() {
			return S(this, void 0, void 0, (function*() {
				return yield this.layoutChildren(), {
					width: this.calcContainerWidth(),
					height: this.calcContainerHeight()
				}
			}))
		}
		layoutChildren() {
			return S(this, void 0, void 0, (function*() {
				for (let t of this.children) yield this.layoutChild(t)
			}))
		}
		layoutChild(t) {
			return S(this, void 0, void 0, (function*() {
				yield t.layout(), "absolute" != t.position && ("vertical" == this.option.direction ? (t.offsetTop = this.childOffsetTop,
					this.childOffsetTop += t.offsetHeight) : (t.offsetLeft = this.childOffsetLeft, this.childOffsetLeft += t.offsetWidth))
			}))
		}
		calcContainerWidth() {
			if ("number" == typeof this.option.width) return this.option.width;
			switch (this.option.direction) {
				case "vertical":
					return this.childrenMaxWidth();
				case "horizontal":
					return this.childOffsetLeft;
				default:
					throw new TypeError("Unknown direction")
			}
		}
		calcContainerHeight() {
			if ("number" == typeof this.option.height) return this.option.height;
			switch (this.option.direction) {
				case "vertical":
					return this.childOffsetTop;
				case "horizontal":
					return this.childrenMaxHeight();
				default:
					throw new TypeError("Unknown direction")
			}
		}
		paint() {
			return S(this, void 0, void 0, (function*() {
				for (let t of this.children) yield t.paint()
			}))
		}
		childrenMaxWidth() {
			return Math.max(...this.children.map(t => t.offsetWidth))
		}
		childrenMaxHeight() {
			return Math.max(...this.children.map(t => t.offsetHeight))
		}
	}
	var j = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	class O extends h {
		constructor(t, i, e) {
			super(t, i, e), this.contentElement = F(t, i.content, this), this.clipPath = v(this, i.path)
		}
		_layout() {
			return this.contentElement.layout()
		}
		paint() {
			return j(this, void 0, void 0, (function*() {
				this.painter.ctx.save(), yield this.clipPath.paint(), this.painter.ctx.clip(), yield this.contentElement.paint(),
					this.painter.ctx.restore()
			}))
		}
	}
	var k = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	class P extends h {
		constructor(t, i, e) {
			var n, o;
			super(t, i, e), this.contentElement = F(t, i.content, this), this.transformOptions = null != (n = i.transform) ?
				n : [], this.transformOrigin = null != (o = i.transformOrigin) ? o : ["center", "center"]
		}
		_layout() {
			return this.contentElement.layout()
		}
		paint() {
			return k(this, void 0, void 0, (function*() {
				this.painter.ctx.save(), this.withTransformOrigin(() => this.transform()), yield this.contentElement.paint(),
					this.painter.ctx.restore()
			}))
		}
		transform() {
			this.transformOptions.forEach(t => this.singleTransform(t))
		}
		singleTransform(t) {
			var i, e, n, o;
			switch (t.type) {
				case "translate":
					return this.painter.ctx.translate(this.painter.upx2px(null != (i = t.x) ? i : 0), this.painter.upx2px(null !=
						(e = t.y) ? e : 0));
				case "rotate":
					return this.painter.ctx.rotate(t.rotate / 180 * Math.PI);
				case "scale":
					return this.painter.ctx.scale(null != (n = t.scaleWidth) ? n : 1, null != (o = t.scaleHeight) ? o : 1);
				case "set-matrix":
					return this.painter.ctx.setTransform(t.scaleX, t.skewX, t.skewY, t.scaleY, this.painter.upx2px(t.translateX),
						this.painter.upx2px(t.translateY));
				default:
					throw new Error("Unknown transform type.")
			}
		}
		withTransformOrigin(t) {
			const i = {
				x: this.elementX + this.contentWidth * {
					left: 0,
					center: .5,
					right: 1
				} [this.transformOrigin[0]],
				y: this.elementY + this.contentHeight * {
					top: 0,
					center: .5,
					bottom: 1
				} [this.transformOrigin[1]]
			};
			this.singleTransform({
				type: "translate",
				x: i.x,
				y: i.y
			}), t(), this.singleTransform({
				type: "translate",
				x: -i.x,
				y: -i.y
			})
		}
	}

	function F(t, i, e) {
		switch (i.type) {
			case "text":
				return new p(t, i, e);
			case "text-block":
				return new x(t, i, e);
			case "image":
				return new y(t, i, e);
			case "line":
				return new u(t, i, e);
			case "rect":
				return new b(t, i, e);
			case "container":
				return new T(t, i, e);
			case "clip":
				return new O(t, i, e);
			case "transform":
				return new P(t, i, e);
			default:
				throw new TypeError("Unkown painter element type")
		}
	}
	let C = function() {
		var t;
		if ("function" == typeof o.upx2px) return o.upx2px;
		let i = (null != (t = o.getSystemInfoSync().screenWidth) ? t : 375) / 750;
		return function(t) {
			return t * i
		}
	}();
	e.d(i, "default", (function() {
		return W
	}));
	var z = function(t, i, e, n) {
		return new(e || (e = Promise))((function(o, r) {
			function s(t) {
				try {
					l(n.next(t))
				} catch (t) {
					r(t)
				}
			}

			function h(t) {
				try {
					l(n.throw(t))
				} catch (t) {
					r(t)
				}
			}

			function l(t) {
				var i;
				t.done ? o(t.value) : (i = t.value, i instanceof e ? i : new e((function(t) {
					t(i)
				}))).then(s, h)
			}
			l((n = n.apply(t, i || [])).next())
		}))
	};
	class W {
		constructor(t, {
			platform: i = n,
			upx2px: e
		} = {}) {
		
			this.ctx = t, this.platform = i, this.upx2px = null != e ? e : C, "mp-alipay" == i && (this.upx2px = t => (null !=
				e ? e : C)(2 * t))
					console.log(t.arcTo,'o')
		}
		draw(t) {
			return z(this, void 0, void 0, (function*() {
				let i = yield this._drawObj(t);
				return yield new Promise(t => this.ctx.draw(!0, t)), yield function(t = 0) {
					return new Promise(i => setTimeout(i, t))
				}(100), i
			}))
		}
		_drawObj(t) {
			return z(this, void 0, void 0, (function*() {
				let i = F(this, t),
					e = yield i.layout();
				return yield i.paint(), e
			}))
		}
		setFillStyle(t) {
			"mp-baidu" == this.platform ? this.ctx.setFillStyle(t) : this.ctx.fillStyle = t
		}
		setStrokeStyle(t) {
			"mp-baidu" == this.platform ? this.ctx.setStrokeStyle(t) : this.ctx.strokeStyle = t
		}
		measureText(t, i) {
			if ("mp-baidu" == this.platform) {
				let e = this.ctx.measureText(t).width;
				if (e) return e / 10 * i
			} else {
				if ("mp-alipay" == this.platform) return t.split("").reduce((t, i) => {
					let e = i.charCodeAt(0);
					return t + (r[e - 32] || 1)
				}, 0) * i; {
					this.ctx.setFontSize(i);
					let e = this.ctx.measureText(t).width;
					if (e) return e
				}
			}
			return t.length * i
		}
		arcTo(t, i, e, n, o) {
			console.log(t,i,e,n,'ok21')
			return o < 2 ? this.ctx.lineTo(t, i) : this.ctx.arcTo ? this.ctx.arcTo(t, i, e, n, o) : this.ctx.lineTo(t, i)
		}
		drawImage(t, i, e, n, o, r, s, h, l) {
			return 9 != arguments.length ? this.ctx.drawImage.call(this, ...arguments) : "mp-baidu" == this.platform ? this.ctx
				.drawImage(t, r, s, h, l, i, e, n, o) : this.ctx.drawImage(t, i, e, n, o, r, s, h, l)
		}
	}
}]);
