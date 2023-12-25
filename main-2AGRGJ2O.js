var rg = Object.defineProperty,
  ig = Object.defineProperties;
var og = Object.getOwnPropertyDescriptors;
var lu = Object.getOwnPropertySymbols;
var sg = Object.prototype.hasOwnProperty,
  ag = Object.prototype.propertyIsEnumerable;
var uu = (t, e, n) =>
    e in t
      ? rg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  _ = (t, e) => {
    for (var n in (e ||= {})) sg.call(e, n) && uu(t, n, e[n]);
    if (lu) for (var n of lu(e)) ag.call(e, n) && uu(t, n, e[n]);
    return t;
  },
  J = (t, e) => ig(t, og(e));
var du = null;
var Cs = 1;
function Ee(t) {
  let e = du;
  return (du = t), e;
}
var fu = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function cg(t) {
  if (!(Ts(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Cs)) {
    if (!t.producerMustRecompute(t) && !Is(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Cs);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Cs);
  }
}
function hu(t) {
  return t && (t.nextProducerIndex = 0), Ee(t);
}
function pu(t, e) {
  if (
    (Ee(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Ts(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        Ss(t.producerNode[n], t.producerIndexOfThis[n]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Is(t) {
  mi(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e];
    if (r !== n.version || (cg(n), r !== n.version)) return !0;
  }
  return !1;
}
function mu(t) {
  if ((mi(t), Ts(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Ss(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Ss(t, e) {
  if ((lg(t), mi(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      Ss(t.producerNode[r], t.producerIndexOfThis[r]);
  let n = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    mi(i), (i.producerIndexOfThis[r] = e);
  }
}
function Ts(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function mi(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function lg(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function ug() {
  throw new Error();
}
var dg = ug;
function gu(t) {
  dg = t;
}
function O(t) {
  return typeof t == "function";
}
function pn(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var gi = pn(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function Ut(t, e) {
  if (t) {
    let n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var ee = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let o of n) o.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (O(r))
        try {
          r();
        } catch (o) {
          e = o instanceof gi ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            yu(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof gi ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new gi(e);
    }
  }
  add(e) {
    var n;
    if (e && e !== this)
      if (this.closed) yu(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this;
    return n === e || (Array.isArray(n) && n.includes(e));
  }
  _addParent(e) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }
  _removeParent(e) {
    let { _parentage: n } = this;
    n === e ? (this._parentage = null) : Array.isArray(n) && Ut(n, e);
  }
  remove(e) {
    let { _finalizers: n } = this;
    n && Ut(n, e), e instanceof t && e._removeParent(this);
  }
};
ee.EMPTY = (() => {
  let t = new ee();
  return (t.closed = !0), t;
})();
var Ms = ee.EMPTY;
function yi(t) {
  return (
    t instanceof ee ||
    (t && "closed" in t && O(t.remove) && O(t.add) && O(t.unsubscribe))
  );
}
function yu(t) {
  O(t) ? t() : t.unsubscribe();
}
var $e = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var mn = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = mn;
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n);
  },
  clearTimeout(t) {
    let { delegate: e } = mn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function vi(t) {
  mn.setTimeout(() => {
    let { onUnhandledError: e } = $e;
    if (e) e(t);
    else throw t;
  });
}
function rr() {}
var vu = (() => xs("C", void 0, void 0))();
function wu(t) {
  return xs("E", void 0, t);
}
function Du(t) {
  return xs("N", t, void 0);
}
function xs(t, e, n) {
  return { kind: t, value: e, error: n };
}
var Ht = null;
function gn(t) {
  if ($e.useDeprecatedSynchronousErrorHandling) {
    let e = !Ht;
    if ((e && (Ht = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Ht;
      if (((Ht = null), n)) throw r;
    }
  } else t();
}
function bu(t) {
  $e.useDeprecatedSynchronousErrorHandling &&
    Ht &&
    ((Ht.errorThrown = !0), (Ht.error = t));
}
var zt = class extends ee {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), yi(e) && e.add(this))
          : (this.destination = pg);
    }
    static create(e, n, r) {
      return new yn(e, n, r);
    }
    next(e) {
      this.isStopped ? Ns(Du(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Ns(wu(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Ns(vu, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  fg = Function.prototype.bind;
function As(t, e) {
  return fg.call(t, e);
}
var Rs = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(e);
        } catch (r) {
          wi(r);
        }
    }
    error(e) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(e);
        } catch (r) {
          wi(r);
        }
      else wi(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (n) {
          wi(n);
        }
    }
  },
  yn = class extends zt {
    constructor(e, n, r) {
      super();
      let i;
      if (O(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let o;
        this && $e.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && As(e.next, o),
              error: e.error && As(e.error, o),
              complete: e.complete && As(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Rs(i);
    }
  };
function wi(t) {
  $e.useDeprecatedSynchronousErrorHandling ? bu(t) : vi(t);
}
function hg(t) {
  throw t;
}
function Ns(t, e) {
  let { onStoppedNotification: n } = $e;
  n && mn.setTimeout(() => n(t, e));
}
var pg = { closed: !0, next: rr, error: hg, complete: rr };
var vn = (() =>
  (typeof Symbol == "function" && Symbol.observable) || "@@observable")();
function Ce(t) {
  return t;
}
function Os(...t) {
  return Ps(t);
}
function Ps(t) {
  return t.length === 0
    ? Ce
    : t.length === 1
    ? t[0]
    : function (n) {
        return t.reduce((r, i) => i(r), n);
      };
}
var z = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new t();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let o = gg(n) ? n : new yn(n, r, i);
      return (
        gn(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = _u(r)),
        new r((i, o) => {
          let s = new yn({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [vn]() {
      return this;
    }
    pipe(...n) {
      return Ps(n)(this);
    }
    toPromise(n) {
      return (
        (n = _u(n)),
        new n((r, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => r(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function _u(t) {
  var e;
  return (e = t ?? $e.Promise) !== null && e !== void 0 ? e : Promise;
}
function mg(t) {
  return t && O(t.next) && O(t.error) && O(t.complete);
}
function gg(t) {
  return (t && t instanceof zt) || (mg(t) && yi(t));
}
function ks(t) {
  return O(t?.lift);
}
function L(t) {
  return (e) => {
    if (ks(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function j(t, e, n, r, i) {
  return new Fs(t, e, n, r, i);
}
var Fs = class extends zt {
  constructor(e, n, r, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function wn() {
  return L((t, e) => {
    let n = null;
    t._refCount++;
    let r = j(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        n = null;
        return;
      }
      let i = t._connection,
        o = n;
      (n = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(r), r.closed || (n = t.connect());
  });
}
var Dn = class extends z {
  constructor(e, n) {
    super(),
      (this.source = e),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ks(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new ee();
      let n = this.getSubject();
      e.add(
        this.source.subscribe(
          j(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = ee.EMPTY));
    }
    return e;
  }
  refCount() {
    return wn()(this);
  }
};
var Eu = pn(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var me = (() => {
    class t extends z {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Di(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Eu();
      }
      next(n) {
        gn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        gn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        gn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: o } = this;
        return r || i
          ? Ms
          : ((this.currentObservers = null),
            o.push(n),
            new ee(() => {
              (this.currentObservers = null), Ut(o, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: o } = this;
        r ? n.error(i) : o && n.complete();
      }
      asObservable() {
        let n = new z();
        return (n.source = this), n;
      }
    }
    return (t.create = (e, n) => new Di(e, n)), t;
  })(),
  Di = class extends me {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n);
    }
    next(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    error(e) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e);
    }
    complete() {
      var e, n;
      (n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e);
    }
    _subscribe(e) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : Ms;
    }
  };
var fe = class extends me {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let n = super._subscribe(e);
    return !n.closed && e.next(this._value), n;
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this;
    if (e) throw n;
    return this._throwIfClosed(), r;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Ls = {
  now() {
    return (Ls.delegate || Date).now();
  },
  delegate: void 0,
};
var bi = class extends ee {
  constructor(e, n) {
    super();
  }
  schedule(e, n = 0) {
    return this;
  }
};
var ir = {
  setInterval(t, e, ...n) {
    let { delegate: r } = ir;
    return r?.setInterval ? r.setInterval(t, e, ...n) : setInterval(t, e, ...n);
  },
  clearInterval(t) {
    let { delegate: e } = ir;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var _i = class extends bi {
  constructor(e, n) {
    super(e, n), (this.scheduler = e), (this.work = n), (this.pending = !1);
  }
  schedule(e, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(o, this.id, n)),
      this
    );
  }
  requestAsyncId(e, n, r = 0) {
    return ir.setInterval(e.flush.bind(e, this), r);
  }
  recycleAsyncId(e, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && ir.clearInterval(n);
  }
  execute(e, n) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let r = this._execute(e, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, n) {
    let r = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (r = !0), (i = o || new Error("Scheduled action threw falsy error"));
    }
    if (r) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: n } = this,
        { actions: r } = n;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Ut(r, this),
        e != null && (this.id = this.recycleAsyncId(n, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var bn = class t {
  constructor(e, n = t.now) {
    (this.schedulerActionCtor = e), (this.now = n);
  }
  schedule(e, n = 0, r) {
    return new this.schedulerActionCtor(this, e).schedule(r, n);
  }
};
bn.now = Ls.now;
var Ei = class extends bn {
  constructor(e, n = bn.now) {
    super(e, n), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: n } = this;
    if (this._active) {
      n.push(e);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = e.execute(e.state, e.delay))) break;
    while ((e = n.shift()));
    if (((this._active = !1), r)) {
      for (; (e = n.shift()); ) e.unsubscribe();
      throw r;
    }
  }
};
var Cu = new Ei(_i);
var Ne = new z((t) => t.complete());
function Iu(t) {
  return t && O(t.schedule);
}
function Su(t) {
  return t[t.length - 1];
}
function Tu(t) {
  return O(Su(t)) ? t.pop() : void 0;
}
function _t(t) {
  return Iu(Su(t)) ? t.pop() : void 0;
}
function xu(t, e, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o);
        });
  }
  return new (n || (n = Promise))(function (o, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? o(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(t, e || [])).next());
  });
}
function Mu(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Wt(t) {
  return this instanceof Wt ? ((this.v = t), this) : new Wt(t);
}
function Au(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    r[f] &&
      (i[f] = function (h) {
        return new Promise(function (p, g) {
          o.push([f, h, p, g]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      c(r[f](h));
    } catch (p) {
      d(o[0][3], p);
    }
  }
  function c(f) {
    f.value instanceof Wt
      ? Promise.resolve(f.value.v).then(l, u)
      : d(o[0][2], f);
  }
  function l(f) {
    a("next", f);
  }
  function u(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function Nu(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof Mu == "function" ? Mu(t) : t[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(o) {
    n[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (l) {
      o({ value: l, done: a });
    }, s);
  }
}
var Ci = (t) => t && typeof t.length == "number" && typeof t != "function";
function Ii(t) {
  return O(t?.then);
}
function Si(t) {
  return O(t[vn]);
}
function Ti(t) {
  return Symbol.asyncIterator && O(t?.[Symbol.asyncIterator]);
}
function Mi(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function yg() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var xi = yg();
function Ai(t) {
  return O(t?.[xi]);
}
function Ni(t) {
  return Au(this, arguments, function* () {
    let n = t.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Wt(n.read());
        if (i) return yield Wt(void 0);
        yield yield Wt(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Ri(t) {
  return O(t?.getReader);
}
function le(t) {
  if (t instanceof z) return t;
  if (t != null) {
    if (Si(t)) return vg(t);
    if (Ci(t)) return wg(t);
    if (Ii(t)) return Dg(t);
    if (Ti(t)) return Ru(t);
    if (Ai(t)) return bg(t);
    if (Ri(t)) return _g(t);
  }
  throw Mi(t);
}
function vg(t) {
  return new z((e) => {
    let n = t[vn]();
    if (O(n.subscribe)) return n.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function wg(t) {
  return new z((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function Dg(t) {
  return new z((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete());
      },
      (n) => e.error(n)
    ).then(null, vi);
  });
}
function bg(t) {
  return new z((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return;
    e.complete();
  });
}
function Ru(t) {
  return new z((e) => {
    Eg(t, e).catch((n) => e.error(n));
  });
}
function _g(t) {
  return Ru(Ni(t));
}
function Eg(t, e) {
  var n, r, i, o;
  return xu(this, void 0, void 0, function* () {
    try {
      for (n = Nu(t); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        r && !r.done && (o = n.return) && (yield o.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function De(t, e, n, r = 0, i = !1) {
  let o = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((t.add(o), !i)) return o;
}
function Oi(t, e = 0) {
  return L((n, r) => {
    n.subscribe(
      j(
        r,
        (i) => De(r, t, () => r.next(i), e),
        () => De(r, t, () => r.complete(), e),
        (i) => De(r, t, () => r.error(i), e)
      )
    );
  });
}
function Pi(t, e = 0) {
  return L((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e));
  });
}
function Ou(t, e) {
  return le(t).pipe(Pi(e), Oi(e));
}
function Pu(t, e) {
  return le(t).pipe(Pi(e), Oi(e));
}
function ku(t, e) {
  return new z((n) => {
    let r = 0;
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function Fu(t, e) {
  return new z((n) => {
    let r;
    return (
      De(n, e, () => {
        (r = t[xi]()),
          De(
            n,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              o ? n.complete() : n.next(i);
            },
            0,
            !0
          );
      }),
      () => O(r?.return) && r.return()
    );
  });
}
function ki(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new z((n) => {
    De(n, e, () => {
      let r = t[Symbol.asyncIterator]();
      De(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Lu(t, e) {
  return ki(Ni(t), e);
}
function ju(t, e) {
  if (t != null) {
    if (Si(t)) return Ou(t, e);
    if (Ci(t)) return ku(t, e);
    if (Ii(t)) return Pu(t, e);
    if (Ti(t)) return ki(t, e);
    if (Ai(t)) return Fu(t, e);
    if (Ri(t)) return Lu(t, e);
  }
  throw Mi(t);
}
function te(t, e) {
  return e ? ju(t, e) : le(t);
}
function A(...t) {
  let e = _t(t);
  return te(t, e);
}
function _n(t, e) {
  let n = O(t) ? t : () => t,
    r = (i) => i.error(n());
  return new z(e ? (i) => e.schedule(r, 0, i) : r);
}
function js(t) {
  return !!t && (t instanceof z || (O(t.lift) && O(t.subscribe)));
}
var ft = pn(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function F(t, e) {
  return L((n, r) => {
    let i = 0;
    n.subscribe(
      j(r, (o) => {
        r.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: Cg } = Array;
function Ig(t, e) {
  return Cg(e) ? t(...e) : t(e);
}
function Vu(t) {
  return F((e) => Ig(t, e));
}
var { isArray: Sg } = Array,
  { getPrototypeOf: Tg, prototype: Mg, keys: xg } = Object;
function $u(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Sg(e)) return { args: e, keys: null };
    if (Ag(e)) {
      let n = xg(e);
      return { args: n.map((r) => e[r]), keys: n };
    }
  }
  return { args: t, keys: null };
}
function Ag(t) {
  return t && typeof t == "object" && Tg(t) === Mg;
}
function Bu(t, e) {
  return t.reduce((n, r, i) => ((n[r] = e[i]), n), {});
}
function qt(...t) {
  let e = _t(t),
    n = Tu(t),
    { args: r, keys: i } = $u(t);
  if (r.length === 0) return te([], e);
  let o = new z(Ng(r, e, i ? (s) => Bu(i, s) : Ce));
  return n ? o.pipe(Vu(n)) : o;
}
function Ng(t, e, n = Ce) {
  return (r) => {
    Uu(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          Uu(
            e,
            () => {
              let l = te(t[c], e),
                u = !1;
              l.subscribe(
                j(
                  r,
                  (d) => {
                    (o[c] = d), u || ((u = !0), a--), a || r.next(n(o.slice()));
                  },
                  () => {
                    --s || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function Uu(t, e, n) {
  t ? De(n, t, e) : e();
}
function Hu(t, e, n, r, i, o, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    f = () => {
      d && !c.length && !l && e.complete();
    },
    h = (g) => (l < r ? p(g) : c.push(g)),
    p = (g) => {
      o && e.next(g), l++;
      let N = !1;
      le(n(g, u++)).subscribe(
        j(
          e,
          (M) => {
            i?.(M), o ? h(M) : e.next(M);
          },
          () => {
            N = !0;
          },
          void 0,
          () => {
            if (N)
              try {
                for (l--; c.length && l < r; ) {
                  let M = c.shift();
                  s ? De(e, s, () => p(M)) : p(M);
                }
                f();
              } catch (M) {
                e.error(M);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      j(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function ie(t, e, n = 1 / 0) {
  return O(e)
    ? ie((r, i) => F((o, s) => e(r, o, i, s))(le(t(r, i))), n)
    : (typeof e == "number" && (n = e), L((r, i) => Hu(r, i, t, n)));
}
function En(t = 1 / 0) {
  return ie(Ce, t);
}
function zu() {
  return En(1);
}
function Et(...t) {
  return zu()(te(t, _t(t)));
}
function Fi(t) {
  return new z((e) => {
    le(t()).subscribe(e);
  });
}
function be(t, e) {
  return L((n, r) => {
    let i = 0;
    n.subscribe(j(r, (o) => t.call(e, o, i++) && r.next(o)));
  });
}
function Ct(t) {
  return L((e, n) => {
    let r = null,
      i = !1,
      o;
    (r = e.subscribe(
      j(n, void 0, void 0, (s) => {
        (o = le(t(s, Ct(t)(e)))),
          r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
      })
    )),
      i && (r.unsubscribe(), (r = null), o.subscribe(n));
  });
}
function Wu(t, e, n, r, i) {
  return (o, s) => {
    let a = n,
      c = e,
      l = 0;
    o.subscribe(
      j(
        s,
        (u) => {
          let d = l++;
          (c = a ? t(c, u, d) : ((a = !0), u)), r && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function Gt(t, e) {
  return O(e) ? ie(t, e, 1) : ie(t, 1);
}
function Vs(t, e = Cu) {
  return L((n, r) => {
    let i = null,
      o = null,
      s = null,
      a = () => {
        if (i) {
          i.unsubscribe(), (i = null);
          let l = o;
          (o = null), r.next(l);
        }
      };
    function c() {
      let l = s + t,
        u = e.now();
      if (u < l) {
        (i = this.schedule(void 0, l - u)), r.add(i);
        return;
      }
      a();
    }
    n.subscribe(
      j(
        r,
        (l) => {
          (o = l), (s = e.now()), i || ((i = e.schedule(c, t)), r.add(i));
        },
        () => {
          a(), r.complete();
        },
        void 0,
        () => {
          o = i = null;
        }
      )
    );
  });
}
function It(t) {
  return L((e, n) => {
    let r = !1;
    e.subscribe(
      j(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => {
          r || n.next(t), n.complete();
        }
      )
    );
  });
}
function Be(t) {
  return t <= 0
    ? () => Ne
    : L((e, n) => {
        let r = 0;
        e.subscribe(
          j(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete());
          })
        );
      });
}
function $s(t) {
  return F(() => t);
}
function Li(t = Rg) {
  return L((e, n) => {
    let r = !1;
    e.subscribe(
      j(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(t()))
      )
    );
  });
}
function Rg() {
  return new ft();
}
function or(t) {
  return L((e, n) => {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function et(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? be((i, o) => t(i, o, r)) : Ce,
      Be(1),
      n ? It(e) : Li(() => new ft())
    );
}
function Cn(t) {
  return t <= 0
    ? () => Ne
    : L((e, n) => {
        let r = [];
        e.subscribe(
          j(
            n,
            (i) => {
              r.push(i), t < r.length && r.shift();
            },
            () => {
              for (let i of r) n.next(i);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function Bs(t, e) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      t ? be((i, o) => t(i, o, r)) : Ce,
      Cn(1),
      n ? It(e) : Li(() => new ft())
    );
}
function Us(t, e) {
  return L(Wu(t, e, arguments.length >= 2, !0));
}
function Hs(t) {
  return be((e, n) => t <= n);
}
function sr(...t) {
  let e = _t(t);
  return L((n, r) => {
    (e ? Et(t, n, e) : Et(t, n)).subscribe(r);
  });
}
function Re(t, e) {
  return L((n, r) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && r.complete();
    n.subscribe(
      j(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = o++;
          le(t(c, u)).subscribe(
            (i = j(
              r,
              (d) => r.next(e ? e(c, d, u, l++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function ar(t) {
  return L((e, n) => {
    le(t).subscribe(j(n, () => n.complete(), rr)), !n.closed && e.subscribe(n);
  });
}
function ue(t, e, n) {
  let r = O(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r
    ? L((i, o) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        i.subscribe(
          j(
            o,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), o.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                o.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                o.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : Ce;
}
function G(t) {
  for (let e in t) if (t[e] === G) return e;
  throw Error("Could not find renamed property on target object.");
}
function ye(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(ye).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let n = e.indexOf(`
`);
  return n === -1 ? e : e.substring(0, n);
}
function qu(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var Og = G({ __forward_ref__: G });
function Ad(t) {
  return (
    (t.__forward_ref__ = Ad),
    (t.toString = function () {
      return ye(this());
    }),
    t
  );
}
function Pe(t) {
  return Nd(t) ? t() : t;
}
function Nd(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(Og) && t.__forward_ref__ === Ad
  );
}
function Rd(t) {
  return t && !!t.ɵproviders;
}
var Od = "https://g.co/ng/security#xss",
  m = class extends Error {
    constructor(e, n) {
      super(La(e, n)), (this.code = e);
    }
  };
function La(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
var Pg = G({ ɵcmp: G }),
  kg = G({ ɵdir: G }),
  Fg = G({ ɵpipe: G }),
  Lg = G({ ɵmod: G }),
  Gi = G({ ɵfac: G }),
  cr = G({ __NG_ELEMENT_ID__: G }),
  Gu = G({ __NG_ENV_ID__: G });
function ja(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function jg(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : ja(t);
}
function Vg(t, e) {
  let n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new m(-200, `Circular dependency in DI detected for ${t}${n}`);
}
function Va(t, e) {
  let n = e ? ` in ${e}` : "";
  throw new m(-201, !1);
}
function $g(t, e) {
  t == null && Bg(e, t, null, "!=");
}
function Bg(t, e, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (r == null ? "" : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
  );
}
function b(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function Y(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function ho(t) {
  return Ku(t, kd) || Ku(t, Fd);
}
function Pd(t) {
  return ho(t) !== null;
}
function Ku(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function Ug(t) {
  let e = t && (t[kd] || t[Fd]);
  return e || null;
}
function Qu(t) {
  return t && (t.hasOwnProperty(Yu) || t.hasOwnProperty(Hg)) ? t[Yu] : null;
}
var kd = G({ ɵprov: G }),
  Yu = G({ ɵinj: G }),
  Fd = G({ ngInjectableDef: G }),
  Hg = G({ ngInjectorDef: G }),
  k = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(k || {}),
  na;
function Ld() {
  return na;
}
function Oe(t) {
  let e = na;
  return (na = t), e;
}
function jd(t, e, n) {
  let r = ho(t);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & k.Optional) return null;
  if (e !== void 0) return e;
  Va(ye(t), "Injector");
}
var ve = globalThis;
var x = class {
  constructor(e, n) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof n == "number"
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = b({
            token: this,
            providedIn: n.providedIn || "root",
            factory: n.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var zg = {},
  ur = zg,
  ra = "__NG_DI_FLAG__",
  Ki = "ngTempTokenPath",
  Wg = "ngTokenPath",
  qg = /\n/gm,
  Gg = "\u0275",
  Zu = "__source",
  xn;
function Kg() {
  return xn;
}
function St(t) {
  let e = xn;
  return (xn = t), e;
}
function Qg(t, e = k.Default) {
  if (xn === void 0) throw new m(-203, !1);
  return xn === null
    ? jd(t, void 0, e)
    : xn.get(t, e & k.Optional ? null : void 0, e);
}
function y(t, e = k.Default) {
  return (Ld() || Qg)(Pe(t), e);
}
function w(t, e = k.Default) {
  return y(t, po(e));
}
function po(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function ia(t) {
  let e = [];
  for (let n = 0; n < t.length; n++) {
    let r = Pe(t[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new m(900, !1);
      let i,
        o = k.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Yg(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(y(i, o));
    } else e.push(y(r));
  }
  return e;
}
function Vd(t, e) {
  return (t[ra] = e), (t.prototype[ra] = e), t;
}
function Yg(t) {
  return t[ra];
}
function Zg(t, e, n, r) {
  let i = t[Ki];
  throw (
    (e[Zu] && i.unshift(e[Zu]),
    (t.message = Xg(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[Wg] = i),
    (t[Ki] = null),
    t)
  );
}
function Xg(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Gg
      ? t.slice(2)
      : t;
  let i = ye(e);
  if (Array.isArray(e)) i = e.map(ye).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ye(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${t.replace(
    qg,
    `
  `
  )}`;
}
function Dr(t) {
  return { toString: t }.toString();
}
var $d = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })($d || {}),
  rt = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(rt || {}),
  dr = {},
  He = [];
function Bd(t, e, n) {
  let r = t.length;
  for (;;) {
    let i = t.indexOf(e, n);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === r || t.charCodeAt(i + o) <= 32) return i;
    }
    n = i + 1;
  }
}
function oa(t, e, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let o = n[r++],
        s = n[r++],
        a = n[r++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = n[++r];
      Jg(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), r++;
    }
  }
  return r;
}
function Ud(t) {
  return t === 3 || t === 4 || t === 6;
}
function Jg(t) {
  return t.charCodeAt(0) === 64;
}
function $a(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let n = -1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        typeof i == "number"
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? Xu(t, n, i, null, e[++r])
              : Xu(t, n, i, null, null));
      }
    }
  return t;
}
function Xu(t, e, n, r, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (r === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, r !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, n),
    r !== null && t.splice(o++, 0, r),
    i !== null && t.splice(o++, 0, i);
}
var Hd = "ng-template";
function ey(t, e, n) {
  let r = 0,
    i = !0;
  for (; r < t.length; ) {
    let o = t[r++];
    if (typeof o == "string" && i) {
      let s = t[r++];
      if (n && o === "class" && Bd(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; r < t.length && typeof (o = t[r++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function zd(t) {
  return t.type === 4 && t.value !== Hd;
}
function ty(t, e, n) {
  let r = t.type === 4 && !n ? Hd : t.value;
  return e === r;
}
function ny(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    o = oy(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == "number") {
      if (!s && !Ue(r) && !Ue(c)) return !1;
      if (s && Ue(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !ty(t, c, n)) || (c === "" && e.length === 1))
        ) {
          if (Ue(r)) return !1;
          s = !0;
        }
      } else {
        let l = r & 8 ? c : e[++a];
        if (r & 8 && t.attrs !== null) {
          if (!ey(t.attrs, l, n)) {
            if (Ue(r)) return !1;
            s = !0;
          }
          continue;
        }
        let u = r & 8 ? "class" : c,
          d = ry(u, i, zd(t), n);
        if (d === -1) {
          if (Ue(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let f;
          d > o ? (f = "") : (f = i[d + 1].toLowerCase());
          let h = r & 8 ? f : null;
          if ((h && Bd(h, l, 0) !== -1) || (r & 2 && l !== f)) {
            if (Ue(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return Ue(r) || s;
}
function Ue(t) {
  return (t & 1) === 0;
}
function ry(t, e, n, r) {
  if (e === null) return -1;
  let i = 0;
  if (r || !n) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return sy(e, t);
}
function iy(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (ny(t, e[r], n)) return !0;
  return !1;
}
function oy(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e];
    if (Ud(n)) return e;
  }
  return t.length;
}
function sy(t, e) {
  let n = t.indexOf(4);
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n];
      if (typeof r == "number") return -1;
      if (r === e) return n;
      n++;
    }
  return -1;
}
function Ju(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function ay(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = "",
    o = !1;
  for (; n < t.length; ) {
    let s = t[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = t[++n];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + s) : r & 4 && (i += " " + s);
    else
      i !== "" && !Ue(s) && ((e += Ju(o, i)), (i = "")),
        (r = s),
        (o = o || !Ue(r));
    n++;
  }
  return i !== "" && (e += Ju(o, i)), e;
}
function cy(t) {
  return t.map(ay).join(",");
}
function ly(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++r]) : i === 8 && n.push(o);
    else {
      if (!Ue(i)) break;
      i = o;
    }
    r++;
  }
  return { attrs: e, classes: n };
}
function oe(t) {
  return Dr(() => {
    let e = Qd(t),
      n = J(_({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === $d.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || rt.Emulated,
        styles: t.styles || He,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Yd(n);
    let r = t.dependencies;
    return (
      (n.directiveDefs = td(r, !1)), (n.pipeDefs = td(r, !0)), (n.id = fy(n)), n
    );
  });
}
function uy(t) {
  return xt(t) || Wd(t);
}
function dy(t) {
  return t !== null;
}
function Z(t) {
  return Dr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || He,
    declarations: t.declarations || He,
    imports: t.imports || He,
    exports: t.exports || He,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function ed(t, e) {
  if (t == null) return dr;
  let n = {};
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        o = i;
      Array.isArray(i) && ((o = i[1]), (i = i[0])), (n[i] = r), e && (e[i] = o);
    }
  return n;
}
function tn(t) {
  return Dr(() => {
    let e = Qd(t);
    return Yd(e), e;
  });
}
function xt(t) {
  return t[Pg] || null;
}
function Wd(t) {
  return t[kg] || null;
}
function qd(t) {
  return t[Fg] || null;
}
function Gd(t) {
  let e = xt(t) || Wd(t) || qd(t);
  return e !== null ? e.standalone : !1;
}
function Kd(t, e) {
  let n = t[Lg] || null;
  if (!n && e === !0)
    throw new Error(`Type ${ye(t)} does not have '\u0275mod' property.`);
  return n;
}
function Qd(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || dr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || He,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ed(t.inputs, e),
    outputs: ed(t.outputs),
    debugInfo: null,
  };
}
function Yd(t) {
  t.features?.forEach((e) => e(t));
}
function td(t, e) {
  if (!t) return null;
  let n = e ? qd : uy;
  return () => (typeof t == "function" ? t() : t).map((r) => n(r)).filter(dy);
}
function fy(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483647 + 1), "c" + e;
}
var gt = 0,
  $ = 1,
  R = 2,
  ae = 3,
  ze = 4,
  Ge = 5,
  Qi = 6,
  fr = 7,
  ht = 8,
  Nn = 9,
  pt = 10,
  we = 11,
  hr = 12,
  nd = 13,
  br = 14,
  it = 15,
  Ba = 16,
  In = 17,
  Ua = 18,
  mo = 19,
  Zd = 20,
  Tt = 21,
  zs = 22,
  Qt = 23,
  Yt = 25,
  Xd = 1;
var Zt = 7,
  Yi = 8,
  Zi = 9,
  ke = 10,
  Rn = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      (t[(t.HasChildViewsToRefresh = 4)] = "HasChildViewsToRefresh"),
      t
    );
  })(Rn || {});
function Mt(t) {
  return Array.isArray(t) && typeof t[Xd] == "object";
}
function We(t) {
  return Array.isArray(t) && t[Xd] === !0;
}
function Jd(t) {
  return (t.flags & 4) !== 0;
}
function Ha(t) {
  return t.componentOffset > -1;
}
function ef(t) {
  return (t.flags & 1) === 1;
}
function _r(t) {
  return !!t.template;
}
function hy(t) {
  return (t[R] & 512) !== 0;
}
function On(t, e) {
  let n = t.hasOwnProperty(Gi);
  return n ? t[Gi] : null;
}
var sa = class {
  constructor(e, n, r) {
    (this.previousValue = e), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Vn() {
  return tf;
}
function tf(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = my), py;
}
Vn.ngInherit = !0;
function py() {
  let t = rf(this),
    e = t?.current;
  if (e) {
    let n = t.previous;
    if (n === dr) t.previous = e;
    else for (let r in e) n[r] = e[r];
    (t.current = null), this.ngOnChanges(e);
  }
}
function my(t, e, n, r) {
  let i = this.declaredInputs[n],
    o = rf(t) || gy(t, { previous: dr, current: null }),
    s = o.current || (o.current = {}),
    a = o.previous,
    c = a[i];
  (s[i] = new sa(c && c.currentValue, e, a === dr)), (t[r] = e);
}
var nf = "__ngSimpleChanges__";
function rf(t) {
  return t[nf] || null;
}
function gy(t, e) {
  return (t[nf] = e);
}
var rd = null;
var tt = function (t, e, n) {
    rd?.(t, e, n);
  },
  of = "svg",
  yy = "math",
  vy = !1;
function wy() {
  return vy;
}
function ot(t) {
  for (; Array.isArray(t); ) t = t[gt];
  return t;
}
function Dy(t, e) {
  return ot(e[t]);
}
function Ke(t, e) {
  return ot(e[t.index]);
}
function sf(t, e) {
  return t.data[e];
}
function nn(t, e) {
  let n = e[t];
  return Mt(n) ? n : n[gt];
}
function za(t) {
  return (t[R] & 128) === 128;
}
function by(t) {
  return We(t[ae]);
}
function id(t, e) {
  return e == null ? null : t[e];
}
function af(t) {
  t[In] = 0;
}
function _y(t) {
  t[R] & 1024 || ((t[R] |= 1024), za(t) && pr(t));
}
function cf(t) {
  return t[R] & 9216 || t[Qt]?.dirty;
}
function aa(t) {
  cf(t)
    ? pr(t)
    : t[R] & 64 &&
      (wy()
        ? ((t[R] |= 1024), pr(t))
        : t[pt].changeDetectionScheduler?.notify());
}
function pr(t) {
  t[pt].changeDetectionScheduler?.notify();
  let e = t[ae];
  for (
    ;
    e !== null &&
    !((We(e) && e[R] & Rn.HasChildViewsToRefresh) || (Mt(e) && e[R] & 8192));

  ) {
    if (We(e)) e[R] |= Rn.HasChildViewsToRefresh;
    else if (((e[R] |= 8192), !za(e))) break;
    e = e[ae];
  }
}
function lf(t, e) {
  if ((t[R] & 256) === 256) throw new m(911, !1);
  t[Tt] === null && (t[Tt] = []), t[Tt].push(e);
}
function Ey(t, e) {
  if (t[Tt] === null) return;
  let n = t[Tt].indexOf(e);
  n !== -1 && t[Tt].splice(n, 1);
}
var H = { lFrame: gf(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Cy() {
  return H.lFrame.elementDepthCount;
}
function Iy() {
  H.lFrame.elementDepthCount++;
}
function Sy() {
  H.lFrame.elementDepthCount--;
}
function uf() {
  return H.bindingsEnabled;
}
function Ty() {
  return H.skipHydrationRootTNode !== null;
}
function My(t) {
  return H.skipHydrationRootTNode === t;
}
function xy() {
  H.skipHydrationRootTNode = null;
}
function ge() {
  return H.lFrame.lView;
}
function $n() {
  return H.lFrame.tView;
}
function Qe() {
  let t = df();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function df() {
  return H.lFrame.currentTNode;
}
function Ay() {
  let t = H.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function go(t, e) {
  let n = H.lFrame;
  (n.currentTNode = t), (n.isParent = e);
}
function ff() {
  return H.lFrame.isParent;
}
function Ny() {
  H.lFrame.isParent = !1;
}
function Ry(t) {
  return (H.lFrame.bindingIndex = t);
}
function Oy() {
  return H.lFrame.bindingIndex++;
}
function Py(t) {
  let e = H.lFrame,
    n = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), n;
}
function ky() {
  return H.lFrame.inI18n;
}
function Fy(t, e) {
  let n = H.lFrame;
  (n.bindingIndex = n.bindingRootIndex = t), ca(e);
}
function Ly() {
  return H.lFrame.currentDirectiveIndex;
}
function ca(t) {
  H.lFrame.currentDirectiveIndex = t;
}
function jy(t) {
  let e = H.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function hf(t) {
  H.lFrame.currentQueryIndex = t;
}
function Vy(t) {
  let e = t[$];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Ge] : null;
}
function pf(t, e, n) {
  if (n & k.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(n & k.Host); )
      if (((i = Vy(o)), i === null || ((o = o[br]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let r = (H.lFrame = mf());
  return (r.currentTNode = e), (r.lView = t), !0;
}
function Wa(t) {
  let e = mf(),
    n = t[$];
  (H.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1);
}
function mf() {
  let t = H.lFrame,
    e = t === null ? null : t.child;
  return e === null ? gf(t) : e;
}
function gf(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function yf() {
  let t = H.lFrame;
  return (H.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var vf = yf;
function qa() {
  let t = yf();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function yo() {
  return H.lFrame.selectedIndex;
}
function Xt(t) {
  H.lFrame.selectedIndex = t;
}
function $y() {
  let t = H.lFrame;
  return sf(t.tView, t.selectedIndex);
}
function wf() {
  H.lFrame.currentNamespace = of;
}
function By() {
  return H.lFrame.currentNamespace;
}
var Df = !0;
function bf() {
  return Df;
}
function _f(t) {
  Df = t;
}
function Uy(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (r) {
    let s = tf(e);
    (n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o));
}
function Ef(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let o = t.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = o;
    s && (t.contentHooks ??= []).push(-n, s),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      c && (t.viewHooks ??= []).push(-n, c),
      l &&
        ((t.viewHooks ??= []).push(n, l), (t.viewCheckHooks ??= []).push(n, l)),
      u != null && (t.destroyHooks ??= []).push(n, u);
  }
}
function Ui(t, e, n) {
  Cf(t, e, 3, n);
}
function Hi(t, e, n, r) {
  (t[R] & 3) === n && Cf(t, e, n, r);
}
function Ws(t, e) {
  let n = t[R];
  (n & 3) === e && ((n &= 16383), (n += 1), (t[R] = n));
}
function Cf(t, e, n, r) {
  let i = r !== void 0 ? t[In] & 65535 : 0,
    o = r ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == "number") {
      if (((a = e[c]), r != null && a >= r)) break;
    } else
      e[c] < 0 && (t[In] += 65536),
        (a < o || o == -1) &&
          (Hy(t, n, e, c), (t[In] = (t[In] & 4294901760) + c + 2)),
        c++;
}
function od(t, e) {
  tt(4, t, e);
  let n = Ee(null);
  try {
    e.call(t);
  } finally {
    Ee(n), tt(5, t, e);
  }
}
function Hy(t, e, n, r) {
  let i = n[r] < 0,
    o = n[r + 1],
    s = i ? -n[r] : n[r],
    a = t[s];
  i
    ? t[R] >> 14 < t[In] >> 16 &&
      (t[R] & 3) === e &&
      ((t[R] += 16384), od(a, o))
    : od(a, o);
}
var An = -1,
  mr = class {
    constructor(e, n, r) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function zy(t) {
  return t instanceof mr;
}
function Wy(t) {
  return (t.flags & 8) !== 0;
}
function qy(t) {
  return (t.flags & 16) !== 0;
}
function If(t) {
  return t !== An;
}
function Xi(t) {
  let e = t & 32767;
  return t & 32767;
}
function Gy(t) {
  return t >> 16;
}
function Ji(t, e) {
  let n = Gy(t),
    r = e;
  for (; n > 0; ) (r = r[br]), n--;
  return r;
}
var la = !0;
function sd(t) {
  let e = la;
  return (la = t), e;
}
var Ky = 256,
  Sf = Ky - 1,
  Tf = 5,
  Qy = 0,
  nt = {};
function Yy(t, e, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(cr) && (r = n[cr]),
    r == null && (r = n[cr] = Qy++);
  let i = r & Sf,
    o = 1 << i;
  e.data[t + (i >> Tf)] |= o;
}
function Mf(t, e) {
  let n = xf(t, e);
  if (n !== -1) return n;
  let r = e[$];
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    qs(r.data, t),
    qs(e, null),
    qs(r.blueprint, null));
  let i = Ga(t, e),
    o = t.injectorIndex;
  if (If(i)) {
    let s = Xi(i),
      a = Ji(i, e),
      c = a[$].data;
    for (let l = 0; l < 8; l++) e[o + l] = a[s + l] | c[s + l];
  }
  return (e[o + 8] = i), o;
}
function qs(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function xf(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Ga(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let n = 0,
    r = null,
    i = e;
  for (; i !== null; ) {
    if (((r = Pf(i)), r === null)) return An;
    if ((n++, (i = i[br]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return An;
}
function Zy(t, e, n) {
  Yy(t, e, n);
}
function Xy(t, e) {
  if (e === "class") return t.classes;
  if (e === "style") return t.styles;
  let n = t.attrs;
  if (n) {
    let r = n.length,
      i = 0;
    for (; i < r; ) {
      let o = n[i];
      if (Ud(o)) break;
      if (o === 0) i = i + 2;
      else if (typeof o == "number")
        for (i++; i < r && typeof n[i] == "string"; ) i++;
      else {
        if (o === e) return n[i + 1];
        i = i + 2;
      }
    }
  }
  return null;
}
function Af(t, e, n) {
  if (n & k.Optional || t !== void 0) return t;
  Va(e, "NodeInjector");
}
function Nf(t, e, n, r) {
  if (
    (n & k.Optional && r === void 0 && (r = null), !(n & (k.Self | k.Host)))
  ) {
    let i = t[Nn],
      o = Oe(void 0);
    try {
      return i ? i.get(e, r, n & k.Optional) : jd(e, r, n & k.Optional);
    } finally {
      Oe(o);
    }
  }
  return Af(r, e, n);
}
function Rf(t, e, n, r = k.Default, i) {
  if (t !== null) {
    if (e[R] & 2048 && !(r & k.Self)) {
      let s = rv(t, e, n, r, nt);
      if (s !== nt) return s;
    }
    let o = Of(t, e, n, r, nt);
    if (o !== nt) return o;
  }
  return Nf(e, n, r, i);
}
function Of(t, e, n, r, i) {
  let o = tv(n);
  if (typeof o == "function") {
    if (!pf(e, t, r)) return r & k.Host ? Af(i, n, r) : Nf(e, n, r, i);
    try {
      let s;
      if (((s = o(r)), s == null && !(r & k.Optional))) Va(n);
      else return s;
    } finally {
      vf();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = xf(t, e),
      c = An,
      l = r & k.Host ? e[it][Ge] : null;
    for (
      (a === -1 || r & k.SkipSelf) &&
      ((c = a === -1 ? Ga(t, e) : e[a + 8]),
      c === An || !cd(r, !1)
        ? (a = -1)
        : ((s = e[$]), (a = Xi(c)), (e = Ji(c, e))));
      a !== -1;

    ) {
      let u = e[$];
      if (ad(o, a, u.data)) {
        let d = Jy(a, e, n, s, r, l);
        if (d !== nt) return d;
      }
      (c = e[a + 8]),
        c !== An && cd(r, e[$].data[a + 8] === l) && ad(o, a, e)
          ? ((s = u), (a = Xi(c)), (e = Ji(c, e)))
          : (a = -1);
    }
  }
  return i;
}
function Jy(t, e, n, r, i, o) {
  let s = e[$],
    a = s.data[t + 8],
    c = r == null ? Ha(a) && la : r != s && (a.type & 3) !== 0,
    l = i & k.Host && o === a,
    u = ev(a, s, n, c, l);
  return u !== null ? gr(e, s, u, a) : nt;
}
function ev(t, e, n, r, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = o >> 20,
    d = r ? a : a + u,
    f = i ? a + u : l;
  for (let h = d; h < f; h++) {
    let p = s[h];
    if ((h < c && n === p) || (h >= c && p.type === n)) return h;
  }
  if (i) {
    let h = s[c];
    if (h && _r(h) && h.type === n) return c;
  }
  return null;
}
function gr(t, e, n, r) {
  let i = t[n],
    o = e.data;
  if (zy(i)) {
    let s = i;
    s.resolving && Vg(jg(o[n]));
    let a = sd(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? Oe(s.injectImpl) : null,
      u = pf(t, r, k.Default);
    try {
      (i = t[n] = s.factory(void 0, o, t, r)),
        e.firstCreatePass && n >= r.directiveStart && Uy(n, o[n], e);
    } finally {
      l !== null && Oe(l), sd(a), (s.resolving = !1), vf();
    }
  }
  return i;
}
function tv(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(cr) ? t[cr] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Sf : nv) : e;
}
function ad(t, e, n) {
  let r = 1 << t;
  return !!(n[e + (t >> Tf)] & r);
}
function cd(t, e) {
  return !(t & k.Self) && !(t & k.Host && e);
}
var Kt = class {
  constructor(e, n) {
    (this._tNode = e), (this._lView = n);
  }
  get(e, n, r) {
    return Rf(this._tNode, this._lView, e, po(r), n);
  }
};
function nv() {
  return new Kt(Qe(), ge());
}
function Ka(t) {
  return Dr(() => {
    let e = t.prototype.constructor,
      n = e[Gi] || ua(e),
      r = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== r; ) {
      let o = i[Gi] || ua(i);
      if (o && o !== n) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function ua(t) {
  return Nd(t)
    ? () => {
        let e = ua(Pe(t));
        return e && e();
      }
    : On(t);
}
function rv(t, e, n, r, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[R] & 2048 && !(s[R] & 512); ) {
    let a = Of(o, s, n, r | k.Self, nt);
    if (a !== nt) return a;
    let c = o.parent;
    if (!c) {
      let l = s[Zd];
      if (l) {
        let u = l.get(n, nt, r);
        if (u !== nt) return u;
      }
      (c = Pf(s)), (s = s[br]);
    }
    o = c;
  }
  return i;
}
function Pf(t) {
  let e = t[$],
    n = e.type;
  return n === 2 ? e.declTNode : n === 1 ? t[Ge] : null;
}
function vo(t) {
  return Xy(Qe(), t);
}
var ji = "__parameters__";
function iv(t) {
  return function (...n) {
    if (t) {
      let r = t(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function kf(t, e, n) {
  return Dr(() => {
    let r = iv(e);
    function i(...o) {
      if (this instanceof i) return r.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(ji)
          ? c[ji]
          : Object.defineProperty(c, ji, { value: [] })[ji];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), c;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
function ov(t) {
  let e = ve.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function sv(t) {
  return typeof t == "function";
}
function Qa(t, e) {
  t.forEach((n) => (Array.isArray(n) ? Qa(n, e) : e(n)));
}
function Ff(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n);
}
function eo(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function av(t, e) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(e);
  return n;
}
function cv(t, e, n, r) {
  let i = t.length;
  if (i == e) t.push(n, r);
  else if (i === 1) t.push(r, t[0]), (t[0] = n);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = n), (t[e + 1] = r);
  }
}
function lv(t, e, n) {
  let r = Er(t, e);
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), cv(t, r, e, n)), r;
}
function Gs(t, e) {
  let n = Er(t, e);
  if (n >= 0) return t[n | 1];
}
function Er(t, e) {
  return uv(t, e, 1);
}
function uv(t, e, n) {
  let r = 0,
    i = t.length >> n;
  for (; i !== r; ) {
    let o = r + ((i - r) >> 1),
      s = t[o << n];
    if (e === s) return o << n;
    s > e ? (i = o) : (r = o + 1);
  }
  return ~(i << n);
}
var Ya = Vd(kf("Optional"), 8);
var Lf = Vd(kf("SkipSelf"), 4);
function dv(t) {
  let e = [],
    n = new Map();
  function r(i) {
    let o = n.get(i);
    if (!o) {
      let s = t(i);
      n.set(i, (o = s.then(mv)));
    }
    return o;
  }
  return (
    to.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          r(i.templateUrl).then((l) => {
            i.template = l;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((d, f) => {
          a.push(""),
            s.push(
              r(d).then((h) => {
                (a[l + f] = h),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            r(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            })
          );
      let c = Promise.all(s).then(() => gv(o));
      e.push(c);
    }),
    hv(),
    Promise.all(e).then(() => {})
  );
}
var to = new Map(),
  fv = new Set();
function hv() {
  let t = to;
  return (to = new Map()), t;
}
function pv() {
  return to.size === 0;
}
function mv(t) {
  return typeof t == "string" ? t : t.text();
}
function gv(t) {
  fv.delete(t);
}
var Pn = new x("ENVIRONMENT_INITIALIZER"),
  jf = new x("INJECTOR", -1),
  Vf = new x("INJECTOR_DEF_TYPES"),
  no = class {
    get(e, n = ur) {
      if (n === ur) {
        let r = new Error(`NullInjectorError: No provider for ${ye(e)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  };
function yv(...t) {
  return { ɵproviders: $f(!0, t), ɵfromNgModule: !0 };
}
function $f(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    o = (s) => {
      n.push(s);
    };
  return (
    Qa(e, (s) => {
      let a = s;
      da(a, o, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Bf(i, o),
    n
  );
}
function Bf(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n];
    Za(i, (o) => {
      e(o, r);
    });
  }
}
function da(t, e, n, r) {
  if (((t = Pe(t)), !t)) return !1;
  let i = null,
    o = Qu(t),
    s = !o && xt(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = Qu(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = r.has(i);
  if (s) {
    if (a) return !1;
    if ((r.add(i), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) da(l, e, n, r);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      r.add(i);
      let l;
      try {
        Qa(o.imports, (u) => {
          da(u, e, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Bf(l, e);
    }
    if (!a) {
      let l = On(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: He }, i),
        e({ provide: Vf, useValue: i, multi: !0 }, i),
        e({ provide: Pn, useValue: () => y(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = t;
      Za(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Za(t, e) {
  for (let n of t)
    Rd(n) && (n = n.ɵproviders), Array.isArray(n) ? Za(n, e) : e(n);
}
var vv = G({ provide: String, useValue: G });
function Uf(t) {
  return t !== null && typeof t == "object" && vv in t;
}
function wv(t) {
  return !!(t && t.useExisting);
}
function Dv(t) {
  return !!(t && t.useFactory);
}
function fa(t) {
  return typeof t == "function";
}
var wo = new x("Set Injector scope."),
  zi = {},
  bv = {},
  Ks;
function Xa() {
  return Ks === void 0 && (Ks = new no()), Ks;
}
var Ie = class {},
  yr = class extends Ie {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        pa(e, (s) => this.processProvider(s)),
        this.records.set(jf, Sn(void 0, this)),
        i.has("environment") && this.records.set(Ie, Sn(void 0, this));
      let o = this.records.get(wo);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Vf, He, k.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of e) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let n = St(this),
        r = Oe(void 0),
        i;
      try {
        return e();
      } finally {
        St(n), Oe(r);
      }
    }
    get(e, n = ur, r = k.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Gu))) return e[Gu](this);
      r = po(r);
      let i,
        o = St(this),
        s = Oe(void 0);
      try {
        if (!(r & k.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = Tv(e) && ho(e);
            l && this.injectableDefInScope(l)
              ? (c = Sn(ha(e), zi))
              : (c = null),
              this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = r & k.Self ? Xa() : this.parent;
        return (n = r & k.Optional && n === ur ? null : n), a.get(e, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Ki] = a[Ki] || []).unshift(ye(e)), o)) throw a;
          return Zg(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Oe(s), St(o);
      }
    }
    resolveInjectorInitializers() {
      let e = St(this),
        n = Oe(void 0),
        r;
      try {
        let i = this.get(Pn, He, k.Self);
        for (let o of i) o();
      } finally {
        St(e), Oe(n);
      }
    }
    toString() {
      let e = [],
        n = this.records;
      for (let r of n.keys()) e.push(ye(r));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new m(205, !1);
    }
    processProvider(e) {
      e = Pe(e);
      let n = fa(e) ? e : Pe(e && e.provide),
        r = Ev(e);
      if (!fa(e) && e.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = Sn(void 0, zi, !0)),
          (i.factory = () => ia(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e);
      } else {
        let i = this.records.get(n);
      }
      this.records.set(n, r);
    }
    hydrate(e, n) {
      return (
        n.value === zi && ((n.value = bv), (n.value = n.factory())),
        typeof n.value == "object" &&
          n.value &&
          Sv(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let n = Pe(e.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function ha(t) {
  let e = ho(t),
    n = e !== null ? e.factory : On(t);
  if (n !== null) return n;
  if (t instanceof x) throw new m(204, !1);
  if (t instanceof Function) return _v(t);
  throw new m(204, !1);
}
function _v(t) {
  let e = t.length;
  if (e > 0) {
    let r = av(e, "?");
    throw new m(204, !1);
  }
  let n = Ug(t);
  return n !== null ? () => n.factory(t) : () => new t();
}
function Ev(t) {
  if (Uf(t)) return Sn(void 0, t.useValue);
  {
    let e = Cv(t);
    return Sn(e, zi);
  }
}
function Cv(t, e, n) {
  let r;
  if (fa(t)) {
    let i = Pe(t);
    return On(i) || ha(i);
  } else if (Uf(t)) r = () => Pe(t.useValue);
  else if (Dv(t)) r = () => t.useFactory(...ia(t.deps || []));
  else if (wv(t)) r = () => y(Pe(t.useExisting));
  else {
    let i = Pe(t && (t.useClass || t.provide));
    if (Iv(t)) r = () => new i(...ia(t.deps));
    else return On(i) || ha(i);
  }
  return r;
}
function Sn(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 };
}
function Iv(t) {
  return !!t.deps;
}
function Sv(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function Tv(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof x);
}
function pa(t, e) {
  for (let n of t)
    Array.isArray(n) ? pa(n, e) : n && Rd(n) ? pa(n.ɵproviders, e) : e(n);
}
function Nt(t, e) {
  t instanceof yr && t.assertNotDestroyed();
  let n,
    r = St(t),
    i = Oe(void 0);
  try {
    return e();
  } finally {
    St(r), Oe(i);
  }
}
function Mv(t) {
  if (!Ld() && !Kg()) throw new m(-203, !1);
}
function ld(t, e = null, n = null, r) {
  let i = Hf(t, e, n, r);
  return i.resolveInjectorInitializers(), i;
}
function Hf(t, e = null, n = null, r, i = new Set()) {
  let o = [n || He, yv(t)];
  return (
    (r = r || (typeof t == "object" ? void 0 : ye(t))),
    new yr(o, e || Xa(), r || null, i)
  );
}
var Ye = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return ld({ name: "" }, i, r, "");
      {
        let o = r.name ?? "";
        return ld({ name: o }, r.parent, r.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = ur),
    (e.NULL = new no()),
    (e.ɵprov = b({ token: e, providedIn: "any", factory: () => y(jf) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var ma;
function zf(t) {
  ma = t;
}
function xv() {
  if (ma !== void 0) return ma;
  if (typeof document < "u") return document;
  throw new m(210, !1);
}
var Cr = new x("AppId", { providedIn: "root", factory: () => Av }),
  Av = "ng",
  Ja = new x("Platform Initializer"),
  yt = new x("Platform ID", {
    providedIn: "platform",
    factory: () => "unknown",
  });
var Do = new x("AnimationModuleType"),
  Ir = new x("CSP nonce", {
    providedIn: "root",
    factory: () =>
      xv().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function Wf(t) {
  return t instanceof Function ? t() : t;
}
function Nv(t) {
  return (t ?? w(Ye)).get(yt) === "browser";
}
function qf(t) {
  return (t.flags & 128) === 128;
}
var mt = (function (t) {
  return (
    (t[(t.Important = 1)] = "Important"), (t[(t.DashCase = 2)] = "DashCase"), t
  );
})(mt || {});
var Gf = new Map(),
  Rv = 0;
function Ov() {
  return Rv++;
}
function Pv(t) {
  Gf.set(t[mo], t);
}
function kv(t) {
  Gf.delete(t[mo]);
}
var ud = "__ngContext__";
function kn(t, e) {
  Mt(e) ? ((t[ud] = e[mo]), Pv(e)) : (t[ud] = e);
}
var Fv;
function ec(t, e) {
  return Fv(t, e);
}
function tc(t) {
  let e = t[ae];
  return We(e) ? e[ae] : e;
}
function Kf(t) {
  return Yf(t[hr]);
}
function Qf(t) {
  return Yf(t[ze]);
}
function Yf(t) {
  for (; t !== null && !We(t); ) t = t[ze];
  return t;
}
function Tn(t, e, n, r, i) {
  if (r != null) {
    let o,
      s = !1;
    We(r) ? (o = r) : Mt(r) && ((s = !0), (r = r[gt]));
    let a = ot(r);
    t === 0 && n !== null
      ? i == null
        ? eh(e, n, a)
        : ro(e, n, a, i || null, !0)
      : t === 1 && n !== null
      ? ro(e, n, a, i || null, !0)
      : t === 2
      ? Jv(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && tw(e, t, o, n, i);
  }
}
function Lv(t, e) {
  return t.createText(e);
}
function Zf(t, e, n) {
  return t.createElement(e, n);
}
function jv(t, e) {
  let n = e[we];
  Sr(t, e, n, 2, null, null), (e[gt] = null), (e[Ge] = null);
}
function Vv(t, e, n, r, i, o) {
  (r[gt] = i), (r[Ge] = e), Sr(t, r, n, 1, i, o);
}
function $v(t, e) {
  Sr(t, e, e[we], 2, null, null);
}
function Bv(t) {
  let e = t[hr];
  if (!e) return Qs(t[$], t);
  for (; e; ) {
    let n = null;
    if (Mt(e)) n = e[hr];
    else {
      let r = e[ke];
      r && (n = r);
    }
    if (!n) {
      for (; e && !e[ze] && e !== t; ) Mt(e) && Qs(e[$], e), (e = e[ae]);
      e === null && (e = t), Mt(e) && Qs(e[$], e), (n = e && e[ze]);
    }
    e = n;
  }
}
function Uv(t, e, n, r) {
  let i = ke + r,
    o = n.length;
  r > 0 && (n[i - 1][ze] = e),
    r < o - ke
      ? ((e[ze] = n[i]), Ff(n, ke + r, e))
      : (n.push(e), (e[ze] = null)),
    (e[ae] = n);
  let s = e[Ba];
  s !== null && n !== s && Hv(s, e);
  let a = e[Ua];
  a !== null && a.insertView(t), aa(e), (e[R] |= 128);
}
function Hv(t, e) {
  let n = t[Zi],
    i = e[ae][ae][it];
  e[it] !== i && (t[R] |= Rn.HasTransplantedViews),
    n === null ? (t[Zi] = [e]) : n.push(e);
}
function Xf(t, e) {
  let n = t[Zi],
    r = n.indexOf(e),
    i = e[ae];
  n.splice(r, 1);
}
function ga(t, e) {
  if (t.length <= ke) return;
  let n = ke + e,
    r = t[n];
  if (r) {
    let i = r[Ba];
    i !== null && i !== t && Xf(i, r), e > 0 && (t[n - 1][ze] = r[ze]);
    let o = eo(t, ke + e);
    jv(r[$], r);
    let s = o[Ua];
    s !== null && s.detachView(o[$]),
      (r[ae] = null),
      (r[ze] = null),
      (r[R] &= -129);
  }
  return r;
}
function Jf(t, e) {
  if (!(e[R] & 256)) {
    let n = e[we];
    n.destroyNode && Sr(t, e, n, 3, null, null), Bv(e);
  }
}
function Qs(t, e) {
  if (!(e[R] & 256)) {
    (e[R] &= -129),
      (e[R] |= 256),
      e[Qt] && mu(e[Qt]),
      Wv(t, e),
      zv(t, e),
      e[$].type === 1 && e[we].destroy();
    let n = e[Ba];
    if (n !== null && We(e[ae])) {
      n !== e[ae] && Xf(n, e);
      let r = e[Ua];
      r !== null && r.detachView(t);
    }
    kv(e);
  }
}
function zv(t, e) {
  let n = t.cleanup,
    r = e[fr];
  if (n !== null)
    for (let o = 0; o < n.length - 1; o += 2)
      if (typeof n[o] == "string") {
        let s = n[o + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
      } else {
        let s = r[n[o + 1]];
        n[o].call(s);
      }
  r !== null && (e[fr] = null);
  let i = e[Tt];
  if (i !== null) {
    e[Tt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Wv(t, e) {
  let n;
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]];
      if (!(i instanceof mr)) {
        let o = n[r + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            tt(4, a, c);
            try {
              c.call(a);
            } finally {
              tt(5, a, c);
            }
          }
        else {
          tt(4, i, o);
          try {
            o.call(i);
          } finally {
            tt(5, i, o);
          }
        }
      }
    }
}
function qv(t, e, n) {
  return Gv(t, e.parent, n);
}
function Gv(t, e, n) {
  let r = e;
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent);
  if (r === null) return n[gt];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: o } = t.data[r.directiveStart + i];
      if (o === rt.None || o === rt.Emulated) return null;
    }
    return Ke(r, n);
  }
}
function ro(t, e, n, r, i) {
  t.insertBefore(e, n, r, i);
}
function eh(t, e, n) {
  t.appendChild(e, n);
}
function dd(t, e, n, r, i) {
  r !== null ? ro(t, e, n, r, i) : eh(t, e, n);
}
function Kv(t, e, n, r) {
  t.removeChild(e, n, r);
}
function nc(t, e) {
  return t.parentNode(e);
}
function Qv(t, e) {
  return t.nextSibling(e);
}
function Yv(t, e, n) {
  return Xv(t, e, n);
}
function Zv(t, e, n) {
  return t.type & 40 ? Ke(t, n) : null;
}
var Xv = Zv,
  fd;
function th(t, e, n, r) {
  let i = qv(t, r, e),
    o = e[we],
    s = r.parent || e[Ge],
    a = Yv(s, r, e);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) dd(o, i, n[c], a, !1);
    else dd(o, i, n, a, !1);
  fd !== void 0 && fd(o, r, e, n, i);
}
function Wi(t, e) {
  if (e !== null) {
    let n = e.type;
    if (n & 3) return Ke(e, t);
    if (n & 4) return ya(-1, t[e.index]);
    if (n & 8) {
      let r = e.child;
      if (r !== null) return Wi(t, r);
      {
        let i = t[e.index];
        return We(i) ? ya(-1, i) : ot(i);
      }
    } else {
      if (n & 32) return ec(e, t)() || ot(t[e.index]);
      {
        let r = nh(t, e);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = tc(t[it]);
          return Wi(i, r);
        } else return Wi(t, e.next);
      }
    }
  }
  return null;
}
function nh(t, e) {
  if (e !== null) {
    let r = t[it][Ge],
      i = e.projection;
    return r.projection[i];
  }
  return null;
}
function ya(t, e) {
  let n = ke + t + 1;
  if (n < e.length) {
    let r = e[n],
      i = r[$].firstChild;
    if (i !== null) return Wi(r, i);
  }
  return e[Zt];
}
function Jv(t, e, n) {
  let r = nc(t, e);
  r && Kv(t, r, e, n);
}
function rc(t, e, n, r, i, o, s) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type;
    if (
      (s && e === 0 && (a && kn(ot(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) rc(t, e, n.child, r, i, o, !1), Tn(e, t, i, a, o);
      else if (c & 32) {
        let l = ec(n, r),
          u;
        for (; (u = l()); ) Tn(e, t, i, u, o);
        Tn(e, t, i, a, o);
      } else c & 16 ? ew(t, e, r, n, i, o) : Tn(e, t, i, a, o);
    n = s ? n.projectionNext : n.next;
  }
}
function Sr(t, e, n, r, i, o) {
  rc(n, r, t.firstChild, e, i, o, !1);
}
function ew(t, e, n, r, i, o) {
  let s = n[it],
    c = s[Ge].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Tn(e, t, i, u, o);
    }
  else {
    let l = c,
      u = s[ae];
    qf(r) && (l.flags |= 128), rc(t, e, l, u, i, o, !0);
  }
}
function tw(t, e, n, r, i) {
  let o = n[Zt],
    s = ot(n);
  o !== s && Tn(e, t, r, o, i);
  for (let a = ke; a < n.length; a++) {
    let c = n[a];
    Sr(c[$], c, t, e, r, o);
  }
}
function nw(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r);
  else {
    let o = r.indexOf("-") === -1 ? void 0 : mt.DashCase;
    i == null
      ? t.removeStyle(n, r, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= mt.Important)),
        t.setStyle(n, r, i, o));
  }
}
function rw(t, e, n) {
  t.setAttribute(e, "style", n);
}
function rh(t, e, n) {
  n === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", n);
}
function ih(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: o } = n;
  r !== null && oa(t, e, r),
    i !== null && rh(t, e, i),
    o !== null && rw(t, e, o);
}
var Vi;
function iw() {
  if (Vi === void 0 && ((Vi = null), ve.trustedTypes))
    try {
      Vi = ve.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return Vi;
}
function hd(t) {
  return iw()?.createScriptURL(t) || t;
}
var io = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Od})`;
  }
};
function Tr(t) {
  return t instanceof io ? t.changingThisBreaksApplicationSecurity : t;
}
function ic(t, e) {
  let n = ow(t);
  if (n != null && n !== e) {
    if (n === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${n} (see ${Od})`);
  }
  return n === e;
}
function ow(t) {
  return (t instanceof io && t.getTypeName()) || null;
}
var sw = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function oh(t) {
  return (t = String(t)), t.match(sw) ? t : "unsafe:" + t;
}
var bo = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(bo || {});
function aw(t) {
  let e = ah();
  return e ? e.sanitize(bo.URL, t) || "" : ic(t, "URL") ? Tr(t) : oh(ja(t));
}
function cw(t) {
  let e = ah();
  if (e) return hd(e.sanitize(bo.RESOURCE_URL, t) || "");
  if (ic(t, "ResourceURL")) return hd(Tr(t));
  throw new m(904, !1);
}
function lw(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? cw
    : aw;
}
function sh(t, e, n) {
  return lw(e, n)(t);
}
function ah() {
  let t = ge();
  return t && t[pt].sanitizer;
}
var va = class {};
var uw = "h",
  dw = "b";
var fw = (t, e, n) => null;
function oc(t, e, n = !1) {
  return fw(t, e, n);
}
var wa = class {},
  oo = class {};
function hw(t) {
  let e = Error(`No component factory found for ${ye(t)}.`);
  return (e[pw] = t), e;
}
var pw = "ngComponent";
var Da = class {
    resolveComponentFactory(e) {
      throw hw(e);
    }
  },
  _o = (() => {
    let e = class e {};
    e.NULL = new Da();
    let t = e;
    return t;
  })();
function mw() {
  return sc(Qe(), ge());
}
function sc(t, e) {
  return new Ze(Ke(t, e));
}
var Ze = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  e.__NG_ELEMENT_ID__ = mw;
  let t = e;
  return t;
})();
var Jt = class {},
  Eo = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => gw();
    let t = e;
    return t;
  })();
function gw() {
  let t = ge(),
    e = Qe(),
    n = nn(e.index, t);
  return (Mt(n) ? n : t)[we];
}
var yw = (() => {
    let e = class e {};
    e.ɵprov = b({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  Ys = {};
function so(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let o = e[n.index];
    o !== null && r.push(ot(o)), We(o) && vw(o, r);
    let s = n.type;
    if (s & 8) so(t, e, n.child, r);
    else if (s & 32) {
      let a = ec(n, e),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = nh(e, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = tc(e[it]);
        so(c[$], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function vw(t, e) {
  for (let n = ke; n < t.length; n++) {
    let r = t[n],
      i = r[$].firstChild;
    i !== null && so(r[$], r, i, e);
  }
  t[Zt] !== t[gt] && e.push(t[Zt]);
}
var ch = [];
function ww(t) {
  return t[Qt] ?? Dw(t);
}
function Dw(t) {
  let e = ch.pop() ?? Object.create(_w);
  return (e.lView = t), e;
}
function bw(t) {
  t.lView[Qt] !== t && ((t.lView = null), ch.push(t));
}
var _w = J(_({}, fu), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      pr(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[Qt] = this;
    },
  }),
  Ew = "ngOriginalError";
function Zs(t) {
  return t[Ew];
}
var qe = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let n = this._findOriginalError(e);
      this._console.error("ERROR", e),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(e) {
      let n = e && Zs(e);
      for (; n && Zs(n); ) n = Zs(n);
      return n || null;
    }
  },
  lh = new x("", {
    providedIn: "root",
    factory: () => w(qe).handleError.bind(void 0),
  });
var uh = !1,
  Cw = new x("", { providedIn: "root", factory: () => uh });
var Co = {};
function Iw(t, e, n, r) {
  if (!r)
    if ((e[R] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && Ui(e, o, n);
    } else {
      let o = t.preOrderHooks;
      o !== null && Hi(e, o, 0, n);
    }
  Xt(n);
}
function Se(t, e = k.Default) {
  let n = ge();
  if (n === null) return y(t, e);
  let r = Qe();
  return Rf(r, n, Pe(t), e);
}
function dh() {
  let t = "invalid";
  throw new Error(t);
}
function Sw(t, e) {
  let n = t.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) Xt(~i);
        else {
          let o = i,
            s = n[++r],
            a = n[++r];
          Fy(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      Xt(-1);
    }
}
function ac(t, e, n, r, i, o, s, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[gt] = i),
    (d[R] = r | 4 | 128 | 8 | 64),
    (l !== null || (t && t[R] & 2048)) && (d[R] |= 2048),
    af(d),
    (d[ae] = d[br] = t),
    (d[ht] = n),
    (d[pt] = s || (t && t[pt])),
    (d[we] = a || (t && t[we])),
    (d[Nn] = c || (t && t[Nn]) || null),
    (d[Ge] = o),
    (d[mo] = Ov()),
    (d[Qi] = u),
    (d[Zd] = l),
    (d[it] = e.type == 2 ? t[it] : d),
    d
  );
}
function cc(t, e, n, r, i) {
  let o = t.data[e];
  if (o === null) (o = Tw(t, e, n, r, i)), ky() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = n), (o.value = r), (o.attrs = i);
    let s = Ay();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return go(o, !0), o;
}
function Tw(t, e, n, r, i) {
  let o = df(),
    s = ff(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = Pw(t, a, n, e, r, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null &&
      (s
        ? o.child == null && c.parent !== null && (o.child = c)
        : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function fh(t, e, n, r) {
  if (n === 0) return -1;
  let i = e.length;
  for (let o = 0; o < n; o++) e.push(r), t.blueprint.push(r), t.data.push(null);
  return i;
}
function hh(t, e, n, r, i) {
  let o = yo(),
    s = r & 2;
  try {
    Xt(-1), s && e.length > Yt && Iw(t, e, Yt, !1), tt(s ? 2 : 0, i), n(r, i);
  } finally {
    Xt(o), tt(s ? 3 : 1, i);
  }
}
function ph(t, e, n) {
  if (Jd(e)) {
    let r = Ee(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, n[s], s);
      }
    } finally {
      Ee(r);
    }
  }
}
function Mw(t, e, n) {
  uf() && (Vw(t, e, n, Ke(n, e)), (n.flags & 64) === 64 && vh(t, e, n));
}
function xw(t, e, n = Ke) {
  let r = e.localNames;
  if (r !== null) {
    let i = e.index + 1;
    for (let o = 0; o < r.length; o += 2) {
      let s = r[o + 1],
        a = s === -1 ? n(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function mh(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = gh(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function gh(t, e, n, r, i, o, s, a, c, l, u) {
  let d = Yt + r,
    f = d + i,
    h = Aw(d, f),
    p = typeof l == "function" ? l() : l;
  return (h[$] = {
    type: t,
    blueprint: h,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function Aw(t, e) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(r < t ? null : Co);
  return n;
}
function Nw(t, e, n, r) {
  let o = r.get(Cw, uh) || n === rt.ShadowDom,
    s = t.selectRootElement(e, o);
  return Rw(s), s;
}
function Rw(t) {
  Ow(t);
}
var Ow = (t) => null;
function Pw(t, e, n, r, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Ty() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function pd(t, e, n, r) {
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      n = n === null ? {} : n;
      let o = t[i];
      r === null ? md(n, e, i, o) : r.hasOwnProperty(i) && md(n, e, r[i], o);
    }
  return n;
}
function md(t, e, n, r) {
  t.hasOwnProperty(n) ? t[n].push(e, r) : (t[n] = [e, r]);
}
function kw(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = r; u < i; u++) {
    let d = o[u],
      f = n ? n.get(d) : null,
      h = f ? f.inputs : null,
      p = f ? f.outputs : null;
    (c = pd(d.inputs, u, c, h)), (l = pd(d.outputs, u, l, p));
    let g = c !== null && s !== null && !zd(e) ? Yw(c, u, s) : null;
    a.push(g);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (e.flags |= 8),
    c.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function Fw(t, e, n, r) {
  if (uf()) {
    let i = r === null ? null : { "": -1 },
      o = Bw(t, n),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && yh(t, e, n, s, i, a),
      i && Uw(n, r, i);
  }
  n.mergedAttrs = $a(n.mergedAttrs, n.attrs);
}
function yh(t, e, n, r, i, o) {
  for (let l = 0; l < r.length; l++) Zy(Mf(n, e), t, r[l].type);
  zw(n, t.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    c = fh(t, e, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = $a(n.mergedAttrs, u.hostAttrs)),
      Ww(t, n, e, c, u),
      Hw(c, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  kw(t, n, o);
}
function Lw(t, e, n, r, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    jw(s) != a && s.push(a), s.push(n, r, o);
  }
}
function jw(t) {
  let e = t.length;
  for (; e > 0; ) {
    let n = t[--e];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function Vw(t, e, n, r) {
  let i = n.directiveStart,
    o = n.directiveEnd;
  Ha(n) && qw(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || Mf(n, e),
    kn(r, e);
  let s = n.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      l = gr(e, t, a, n);
    if ((kn(l, e), s !== null && Qw(e, a - i, l, c, n, s), _r(c))) {
      let u = nn(n.index, e);
      u[ht] = gr(e, t, a, n);
    }
  }
}
function vh(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    o = n.index,
    s = Ly();
  try {
    Xt(o);
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      ca(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          $w(c, l);
    }
  } finally {
    Xt(-1), ca(s);
  }
}
function $w(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function Bw(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let s = n[o];
      if (iy(e, s.selectors, !1))
        if ((r || (r = []), _r(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              r.unshift(...a, s);
            let c = a.length;
            ba(t, e, c);
          } else r.unshift(s), ba(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
    }
  return r === null ? null : [r, i];
}
function ba(t, e, n) {
  (e.componentOffset = n), (t.components ??= []).push(e.index);
}
function Uw(t, e, n) {
  if (e) {
    let r = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = n[e[i + 1]];
      if (o == null) throw new m(-301, !1);
      r.push(e[i], o);
    }
  }
}
function Hw(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
    _r(e) && (n[""] = t);
  }
}
function zw(t, e, n) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e);
}
function Ww(t, e, n, r, i) {
  t.data[r] = i;
  let o = i.factory || (i.factory = On(i.type, !0)),
    s = new mr(o, _r(i), Se);
  (t.blueprint[r] = s), (n[r] = s), Lw(t, e, r, fh(t, n, i.hostVars, Co), i);
}
function qw(t, e, n) {
  let r = Ke(e, t),
    i = mh(n),
    o = t[pt].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = lc(
    t,
    ac(t, i, null, s, r, e, null, o.createRenderer(r, n), null, null, null)
  );
  t[e.index] = a;
}
function Gw(t, e, n, r, i, o) {
  let s = Ke(t, e);
  Kw(e[we], s, o, t.value, n, r, i);
}
function Kw(t, e, n, r, i, o, s) {
  if (o == null) t.removeAttribute(e, i, n);
  else {
    let a = s == null ? ja(o) : s(o, r || "", i);
    t.setAttribute(e, i, a, n);
  }
}
function Qw(t, e, n, r, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        u = s[a++];
      wh(r, n, c, l, u);
    }
}
function wh(t, e, n, r, i) {
  let o = Ee(null);
  try {
    let s = t.inputTransforms;
    s !== null && s.hasOwnProperty(r) && (i = s[r].call(e, i)),
      t.setInput !== null ? t.setInput(e, i, n, r) : (e[r] = i);
  } finally {
    Ee(o);
  }
}
function Yw(t, e, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      r === null && (r = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 2)
        if (s[a] === e) {
          r.push(o, s[a + 1], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function Zw(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null];
}
function Dh(t, e) {
  let n = t.contentQueries;
  if (n !== null) {
    let r = Ee(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let o = n[i],
          s = n[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          hf(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      Ee(r);
    }
  }
}
function lc(t, e) {
  return t[hr] ? (t[nd][ze] = e) : (t[hr] = e), (t[nd] = e), e;
}
function _a(t, e, n) {
  hf(0);
  let r = Ee(null);
  try {
    e(t, n);
  } finally {
    Ee(r);
  }
}
function Xw(t) {
  return t[fr] || (t[fr] = []);
}
function Jw(t) {
  return t.cleanup || (t.cleanup = []);
}
function bh(t, e) {
  let n = t[Nn],
    r = n ? n.get(qe, null) : null;
  r && r.handleError(e);
}
function _h(t, e, n, r, i) {
  for (let o = 0; o < n.length; ) {
    let s = n[o++],
      a = n[o++],
      c = e[s],
      l = t.data[s];
    wh(l, c, r, a, i);
  }
}
var eD = 100;
function tD(t, e = !0) {
  let n = t[pt],
    r = n.rendererFactory,
    i = n.afterRenderEventManager,
    o = !1;
  o || (r.begin?.(), i?.begin());
  try {
    nD(t);
  } catch (s) {
    throw (e && bh(t, s), s);
  } finally {
    o || (r.end?.(), n.inlineEffectRunner?.flush(), i?.end());
  }
}
function nD(t) {
  Ea(t, 0);
  let e = 0;
  for (; cf(t); ) {
    if (e === eD) throw new m(103, !1);
    e++, Ea(t, 1);
  }
}
function rD(t, e, n, r) {
  let i = e[R];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[pt].inlineEffectRunner?.flush(), Wa(e);
  let s = null,
    a = null;
  !o && iD(t) && ((a = ww(e)), (s = hu(a)));
  try {
    af(e), Ry(t.bindingStartIndex), n !== null && hh(t, e, n, 2, r);
    let c = (i & 3) === 3;
    if (!o)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && Ui(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && Hi(e, d, 0, null), Ws(e, 0);
      }
    if ((oD(e), Eh(e, 0), t.contentQueries !== null && Dh(t, e), !o))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && Ui(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && Hi(e, d, 1), Ws(e, 1);
      }
    Sw(t, e);
    let l = t.components;
    l !== null && Ih(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && _a(2, u, r), !o))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && Ui(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && Hi(e, d, 2), Ws(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[zs])) {
      for (let d of e[zs]) d();
      e[zs] = null;
    }
    o || (e[R] &= -73);
  } catch (c) {
    throw (pr(e), c);
  } finally {
    a !== null && (pu(a, s), bw(a)), qa();
  }
}
function iD(t) {
  return t.type !== 2;
}
function Eh(t, e) {
  for (let n = Kf(t); n !== null; n = Qf(n)) {
    n[R] &= ~Rn.HasChildViewsToRefresh;
    for (let r = ke; r < n.length; r++) {
      let i = n[r];
      Ch(i, e);
    }
  }
}
function oD(t) {
  for (let e = Kf(t); e !== null; e = Qf(e)) {
    if (!(e[R] & Rn.HasTransplantedViews)) continue;
    let n = e[Zi];
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        o = i[ae];
      _y(i);
    }
  }
}
function sD(t, e, n) {
  let r = nn(e, t);
  Ch(r, n);
}
function Ch(t, e) {
  za(t) && Ea(t, e);
}
function Ea(t, e) {
  let r = t[$],
    i = t[R],
    o = t[Qt],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Is(o))),
    o && (o.dirty = !1),
    (t[R] &= -9217),
    s)
  )
    rD(r, t, r.template, t[ht]);
  else if (i & 8192) {
    Eh(t, 1);
    let a = r.components;
    a !== null && Ih(t, a, 1);
  }
}
function Ih(t, e, n) {
  for (let r = 0; r < e.length; r++) sD(t, e[r], n);
}
function uc(t) {
  for (t[pt].changeDetectionScheduler?.notify(); t; ) {
    t[R] |= 64;
    let e = tc(t);
    if (hy(t) && !e) return t;
    t = e;
  }
  return null;
}
var Fn = class {
    get rootNodes() {
      let e = this._lView,
        n = e[$];
      return so(n, e, n.firstChild, []);
    }
    constructor(e, n, r = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[ht];
    }
    set context(e) {
      this._lView[ht] = e;
    }
    get destroyed() {
      return (this._lView[R] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ae];
        if (We(e)) {
          let n = e[Yi],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (ga(e, r), eo(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      Jf(this._lView[$], this._lView);
    }
    onDestroy(e) {
      lf(this._lView, e);
    }
    markForCheck() {
      uc(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[R] &= -129;
    }
    reattach() {
      aa(this._lView), (this._lView[R] |= 128);
    }
    detectChanges() {
      (this._lView[R] |= 1024), tD(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new m(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), $v(this._lView[$], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new m(902, !1);
      (this._appRef = e), aa(this._lView);
    }
  },
  Mr = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = aD;
    let t = e;
    return t;
  })();
function aD(t) {
  return cD(Qe(), ge(), (t & 16) === 16);
}
function cD(t, e, n) {
  if (Ha(t) && !n) {
    let r = nn(t.index, e);
    return new Fn(r, r);
  } else if (t.type & 47) {
    let r = e[it];
    return new Fn(r, e);
  }
  return null;
}
var Sh = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = lD), (e.__NG_ENV_ID__ = (r) => r);
    let t = e;
    return t;
  })(),
  Ca = class extends Sh {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return lf(this._lView, e), () => Ey(this._lView, e);
    }
  };
function lD() {
  return new Ca(ge());
}
var gd = new Set();
function dc(t) {
  gd.has(t) ||
    (gd.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Ia = class extends me {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, n, r) {
    let i = e,
      o = n || (() => null),
      s = r;
    if (e && typeof e == "object") {
      let c = e;
      (i = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((o = Xs(o)), i && (i = Xs(i)), s && (s = Xs(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof ee && e.add(a), a;
  }
};
function Xs(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var he = Ia;
function yd(...t) {}
function uD() {
  let t = typeof ve.requestAnimationFrame == "function",
    e = ve[t ? "requestAnimationFrame" : "setTimeout"],
    n = ve[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && n) {
    let r = e[Zone.__symbol__("OriginalDelegate")];
    r && (e = r);
    let i = n[Zone.__symbol__("OriginalDelegate")];
    i && (n = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n };
}
var U = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new he(!1)),
        (this.onMicrotaskEmpty = new he(!1)),
        (this.onStable = new he(!1)),
        (this.onError = new he(!1)),
        typeof Zone > "u")
      )
        throw new m(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = uD().nativeRequestAnimationFrame),
        hD(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new m(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new m(909, !1);
    }
    run(e, n, r) {
      return this._inner.run(e, n, r);
    }
    runTask(e, n, r, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, dD, yd, yd);
      try {
        return o.runTask(s, n, r);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  dD = {};
function fc(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function fD(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      ve,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Sa(t),
                (t.isCheckStableRunning = !0),
                fc(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Sa(t));
}
function hD(t) {
  let e = () => {
    fD(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, o, s, a) => {
      if (pD(a)) return n.invokeTask(i, o, s, a);
      try {
        return vd(t), n.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          wd(t);
      }
    },
    onInvoke: (n, r, i, o, s, a, c) => {
      try {
        return vd(t), n.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), wd(t);
      }
    },
    onHasTask: (n, r, i, o) => {
      n.hasTask(i, o),
        r === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), Sa(t), fc(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (n, r, i, o) => (
      n.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function Sa(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function vd(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function wd(t) {
  t._nesting--, fc(t);
}
var Ta = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new he()),
      (this.onMicrotaskEmpty = new he()),
      (this.onStable = new he()),
      (this.onError = new he());
  }
  run(e, n, r) {
    return e.apply(n, r);
  }
  runGuarded(e, n, r) {
    return e.apply(n, r);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, n, r, i) {
    return e.apply(n, r);
  }
};
function pD(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function mD(t = "zone.js", e) {
  return t === "noop" ? new Ta() : t === "zone.js" ? new U(e) : t;
}
var Mn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(Mn || {}),
  gD = { destroy() {} };
function hc(t, e) {
  !e && Mv(hc);
  let n = e?.injector ?? w(Ye);
  if (!Nv(n)) return gD;
  dc("NgAfterNextRender");
  let r = n.get(Th),
    i = (r.handler ??= new xa()),
    o = e?.phase ?? Mn.MixedReadWrite,
    s = () => {
      i.unregister(c), a();
    },
    a = n.get(Sh).onDestroy(s),
    c = new Ma(n, o, () => {
      s(), t();
    });
  return i.register(c), { destroy: s };
}
var Ma = class {
    constructor(e, n, r) {
      (this.phase = n),
        (this.callbackFn = r),
        (this.zone = e.get(U)),
        (this.errorHandler = e.get(qe, null, { optional: !0 }));
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  xa = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [Mn.EarlyRead]: new Set(),
          [Mn.Write]: new Set(),
          [Mn.MixedReadWrite]: new Set(),
          [Mn.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    validateBegin() {
      if (this.executingCallbacks) throw new m(102, !1);
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let n of e) n.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Th = (() => {
    let e = class e {
      constructor() {
        (this.renderDepth = 0),
          (this.handler = null),
          (this.internalCallbacks = []);
      }
      begin() {
        this.handler?.validateBegin(), this.renderDepth++;
      }
      end() {
        if ((this.renderDepth--, this.renderDepth === 0)) {
          for (let r of this.internalCallbacks) r();
          (this.internalCallbacks.length = 0), this.handler?.execute();
        }
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = b({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function yD(t, e) {
  let n = nn(e, t),
    r = n[$];
  vD(r, n);
  let i = n[gt];
  i !== null && n[Qi] === null && (n[Qi] = oc(i, n[Nn])), Mh(r, n, n[ht]);
}
function vD(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n]);
}
function Mh(t, e, n) {
  Wa(e);
  try {
    let r = t.viewQuery;
    r !== null && _a(1, r, n);
    let i = t.template;
    i !== null && hh(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && Dh(t, e),
      t.staticViewQueries && _a(2, t.viewQuery, n);
    let o = t.components;
    o !== null && wD(e, o);
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    );
  } finally {
    (e[R] &= -5), qa();
  }
}
function wD(t, e) {
  for (let n = 0; n < e.length; n++) yD(t, e[n]);
}
function Aa(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = qu(i, a);
      else if (o == 2) {
        let c = a,
          l = e[++s];
        r = qu(r, c + ": " + l + ";");
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i);
}
var ao = class extends _o {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let n = xt(e);
    return new Ln(n, this.ngModule);
  }
};
function Dd(t) {
  let e = [];
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let r = t[n];
      e.push({ propName: r, templateName: n });
    }
  return e;
}
function DD(t) {
  let e = t.toLowerCase();
  return e === "svg" ? of : e === "math" ? yy : null;
}
var Na = class {
    constructor(e, n) {
      (this.injector = e), (this.parentInjector = n);
    }
    get(e, n, r) {
      r = po(r);
      let i = this.injector.get(e, Ys, r);
      return i !== Ys || n === Ys ? i : this.parentInjector.get(e, n, r);
    }
  },
  Ln = class extends oo {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = Dd(e.inputs);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return Dd(this.componentDef.outputs);
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = cy(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(e, n, r, i) {
      i = i || this.ngModule;
      let o = i instanceof Ie ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new Na(e, o) : e,
        a = s.get(Jt, null);
      if (a === null) throw new m(407, !1);
      let c = s.get(yw, null),
        l = s.get(Th, null),
        u = s.get(va, null),
        d = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: l,
          changeDetectionScheduler: u,
        },
        f = a.createRenderer(null, this.componentDef),
        h = this.componentDef.selectors[0][0] || "div",
        p = r ? Nw(f, r, this.componentDef.encapsulation, s) : Zf(f, h, DD(h)),
        g = 512;
      this.componentDef.signals
        ? (g |= 4096)
        : this.componentDef.onPush || (g |= 16);
      let N = null;
      p !== null && (N = oc(p, s, !0));
      let M = gh(0, null, null, 1, 0, null, null, null, null, null, null),
        V = ac(null, M, null, g, null, null, d, f, s, null, N);
      Wa(V);
      let K, q;
      try {
        let de = this.componentDef,
          re,
          se = null;
        de.findHostDirectiveDefs
          ? ((re = []),
            (se = new Map()),
            de.findHostDirectiveDefs(de, re, se),
            re.push(de))
          : (re = [de]);
        let je = bD(V, p),
          Ve = _D(je, p, de, re, V, d, f);
        (q = sf(M, Yt)),
          p && ID(f, de, p, r),
          n !== void 0 && SD(q, this.ngContentSelectors, n),
          (K = CD(Ve, de, re, se, V, [TD])),
          Mh(M, V, null);
      } finally {
        qa();
      }
      return new Ra(this.componentType, K, sc(q, V), V, q);
    }
  },
  Ra = class extends wa {
    constructor(e, n, r, i, o) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Fn(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return;
        let o = this._rootLView;
        _h(o[$], o, i, e, n), this.previousInputValues.set(e, n);
        let s = nn(this._tNode.index, o);
        uc(s);
      }
    }
    get injector() {
      return new Kt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function bD(t, e) {
  let n = t[$],
    r = Yt;
  return (t[r] = e), cc(n, r, 2, "#host", null);
}
function _D(t, e, n, r, i, o, s) {
  let a = i[$];
  ED(r, t, e, s);
  let c = null;
  e !== null && (c = oc(e, i[Nn]));
  let l = o.rendererFactory.createRenderer(e, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = ac(i, mh(n), null, u, i[t.index], t, o, l, null, null, c);
  return (
    a.firstCreatePass && ba(a, t, r.length - 1), lc(i, d), (i[t.index] = d)
  );
}
function ED(t, e, n, r) {
  for (let i of t) e.mergedAttrs = $a(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Aa(e, e.mergedAttrs, !0), n !== null && ih(r, n, e));
}
function CD(t, e, n, r, i, o) {
  let s = Qe(),
    a = i[$],
    c = Ke(s, i);
  yh(a, i, s, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = s.directiveStart + u,
      f = gr(i, a, d, s);
    kn(f, i);
  }
  vh(a, i, s), c && kn(c, i);
  let l = gr(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[ht] = i[ht] = l), o !== null)) for (let u of o) u(l, e);
  return ph(a, s, t), l;
}
function ID(t, e, n, r) {
  if (r) oa(t, n, ["ng-version", "17.0.8"]);
  else {
    let { attrs: i, classes: o } = ly(e.selectors[0]);
    i && oa(t, n, i), o && o.length > 0 && rh(t, n, o.join(" "));
  }
}
function SD(t, e, n) {
  let r = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = n[i];
    r.push(o != null ? Array.from(o) : null);
  }
}
function TD() {
  let t = Qe();
  Ef(ge()[$], t);
}
function xr(t) {
  let e = t.inputConfig,
    n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let i = e[r];
      Array.isArray(i) && i[2] && (n[r] = i[2]);
    }
  t.inputTransforms = n;
}
function xh(t, e, n) {
  let r = t[e];
  return Object.is(r, n) ? !1 : ((t[e] = n), !0);
}
function Bn(t, e, n, r) {
  let i = ge(),
    o = Oy();
  if (xh(i, o, e)) {
    let s = $n(),
      a = $y();
    Gw(a, i, t, e, n, r);
  }
  return Bn;
}
function $i(t, e) {
  return (t << 17) | (e << 2);
}
function en(t) {
  return (t >> 17) & 32767;
}
function MD(t) {
  return (t & 2) == 2;
}
function xD(t, e) {
  return (t & 131071) | (e << 17);
}
function Oa(t) {
  return t | 2;
}
function jn(t) {
  return (t & 131068) >> 2;
}
function Js(t, e) {
  return (t & -131069) | (e << 2);
}
function AD(t) {
  return (t & 1) === 1;
}
function Pa(t) {
  return t | 1;
}
function ND(t, e, n, r, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = en(s),
    c = jn(s);
  t[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Er(d, u) > 0) && (l = !0);
  } else u = n;
  if (i)
    if (c !== 0) {
      let f = en(t[a + 1]);
      (t[r + 1] = $i(f, a)),
        f !== 0 && (t[f + 1] = Js(t[f + 1], r)),
        (t[a + 1] = xD(t[a + 1], r));
    } else
      (t[r + 1] = $i(a, 0)), a !== 0 && (t[a + 1] = Js(t[a + 1], r)), (a = r);
  else
    (t[r + 1] = $i(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = Js(t[c + 1], r)),
      (c = r);
  l && (t[r + 1] = Oa(t[r + 1])),
    bd(t, u, r, !0, o),
    bd(t, u, r, !1, o),
    RD(e, u, t, r, o),
    (s = $i(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function RD(t, e, n, r, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    Er(o, e) >= 0 &&
    (n[r + 1] = Pa(n[r + 1]));
}
function bd(t, e, n, r, i) {
  let o = t[n + 1],
    s = e === null,
    a = r ? en(o) : jn(o),
    c = !1;
  for (; a !== 0 && (c === !1 || s); ) {
    let l = t[a],
      u = t[a + 1];
    OD(l, e) && ((c = !0), (t[a + 1] = r ? Pa(u) : Oa(u))),
      (a = r ? en(u) : jn(u));
  }
  c && (t[n + 1] = r ? Oa(o) : Pa(o));
}
function OD(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? Er(t, e) >= 0
    : !1;
}
function _d(t, e, n, r, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  _h(t, n, o[s], s, r);
}
function Io(t, e, n) {
  return PD(t, e, n, !1), Io;
}
function PD(t, e, n, r) {
  let i = ge(),
    o = $n(),
    s = Py(2);
  if ((o.firstUpdatePass && FD(o, t, s, r), e !== Co && xh(i, s, e))) {
    let a = o.data[yo()];
    BD(o, a, i, i[we], t, (i[s + 1] = UD(e, n)), r, s);
  }
}
function kD(t, e) {
  return e >= t.expandoStartIndex;
}
function FD(t, e, n, r) {
  let i = t.data;
  if (i[n + 1] === null) {
    let o = i[yo()],
      s = kD(t, n);
    HD(o, r) && e === null && !s && (e = !1),
      (e = LD(i, o, e, r)),
      ND(i, o, e, n, s, r);
  }
}
function LD(t, e, n, r) {
  let i = jy(t),
    o = r ? e.residualClasses : e.residualStyles;
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = ea(null, t, e, n, r)), (n = vr(n, e.attrs, r)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((n = ea(i, t, e, n, r)), o === null)) {
        let c = jD(t, e, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = ea(null, t, e, c[1], r)),
          (c = vr(c, e.attrs, r)),
          VD(t, e, r, c));
      } else o = $D(t, e, r);
  }
  return (
    o !== void 0 && (r ? (e.residualClasses = o) : (e.residualStyles = o)), n
  );
}
function jD(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings;
  if (jn(r) !== 0) return t[en(r)];
}
function VD(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings;
  t[en(i)] = r;
}
function $D(t, e, n) {
  let r,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    r = vr(r, s, n);
  }
  return vr(r, e.attrs, n);
}
function ea(t, e, n, r, i) {
  let o = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((o = e[a]), (r = vr(r, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (n.directiveStylingLast = a), r;
}
function vr(t, e, n) {
  let r = n ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          lv(t, s, n ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function BD(t, e, n, r, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = AD(l) ? Ed(c, e, n, i, jn(l), s) : void 0;
  if (!co(u)) {
    co(o) || (MD(l) && (o = Ed(c, null, n, i, a, s)));
    let d = Dy(yo(), n);
    nw(r, s, d, i, o);
  }
}
function Ed(t, e, n, r, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      f = n[i + 1];
    f === Co && (f = d ? He : void 0);
    let h = d ? Gs(f, r) : u === r ? f : void 0;
    if ((l && !co(h) && (h = Gs(c, r)), co(h) && ((a = h), s))) return a;
    let p = t[i + 1];
    i = s ? en(p) : jn(p);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = Gs(c, r));
  }
  return a;
}
function co(t) {
  return t !== void 0;
}
function UD(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = ye(Tr(t)))),
    t
  );
}
function HD(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var aN = new RegExp(`^(\\d+)*(${dw}|${uw})*(.*)`);
var zD = (t, e) => null;
function Cd(t, e) {
  return zD(t, e);
}
function Id(t, e) {
  return !e || e.firstChild === null || qf(t);
}
function WD(t, e, n, r = !0) {
  let i = e[$];
  if ((Uv(i, e, t, n), r)) {
    let s = ya(n, t),
      a = e[we],
      c = nc(a, t[Zt]);
    c !== null && Vv(i, t[Ge], a, e, c, s);
  }
  let o = e[Qi];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
var So = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = qD;
  let t = e;
  return t;
})();
function qD() {
  let t = Qe();
  return KD(t, ge());
}
var GD = So,
  Ah = class extends GD {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return sc(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Kt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Ga(this._hostTNode, this._hostLView);
      if (If(e)) {
        let n = Ji(e, this._hostLView),
          r = Xi(e),
          i = n[$].data[r + 8];
        return new Kt(i, n);
      } else return new Kt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let n = Sd(this._lContainer);
      return (n !== null && n[e]) || null;
    }
    get length() {
      return this._lContainer.length - ke;
    }
    createEmbeddedView(e, n, r) {
      let i, o;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (o = r.injector));
      let s = Cd(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, o, s);
      return this.insertImpl(a, i, Id(this._hostTNode, s)), a;
    }
    createComponent(e, n, r, i, o) {
      let s = e && !sv(e),
        a;
      if (s) a = n;
      else {
        let p = n || {};
        (a = p.index),
          (r = p.injector),
          (i = p.projectableNodes),
          (o = p.environmentInjector || p.ngModuleRef);
      }
      let c = s ? e : new Ln(xt(e)),
        l = r || this.parentInjector;
      if (!o && c.ngModule == null) {
        let g = (s ? l : this.parentInjector).get(Ie, null);
        g && (o = g);
      }
      let u = xt(c.componentType ?? {}),
        d = Cd(this._lContainer, u?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(l, i, f, o);
      return this.insertImpl(h.hostView, a, Id(this._hostTNode, d)), h;
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0);
    }
    insertImpl(e, n, r) {
      let i = e._lView;
      if (by(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ae],
            l = new Ah(c, c[Ge], c[ae]);
          l.detach(l.indexOf(e));
        }
      }
      let o = this._adjustIndex(n),
        s = this._lContainer;
      return WD(s, i, o, r), e.attachToViewContainerRef(), Ff(ta(s), o, e), e;
    }
    move(e, n) {
      return this.insert(e, n);
    }
    indexOf(e) {
      let n = Sd(this._lContainer);
      return n !== null ? n.indexOf(e) : -1;
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = ga(this._lContainer, n);
      r && (eo(ta(this._lContainer), n), Jf(r[$], r));
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = ga(this._lContainer, n);
      return r && eo(ta(this._lContainer), n) != null ? new Fn(r) : null;
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n;
    }
  };
function Sd(t) {
  return t[Yi];
}
function ta(t) {
  return t[Yi] || (t[Yi] = []);
}
function KD(t, e) {
  let n,
    r = e[t.index];
  return (
    We(r) ? (n = r) : ((n = Zw(r, e, null, t)), (e[t.index] = n), lc(e, n)),
    YD(n, e, t, r),
    new Ah(n, t, e)
  );
}
function QD(t, e) {
  let n = t[we],
    r = n.createComment(""),
    i = Ke(e, t),
    o = nc(n, i);
  return ro(n, o, r, Qv(n, i), !1), r;
}
var YD = ZD;
function ZD(t, e, n, r) {
  if (t[Zt]) return;
  let i;
  n.type & 8 ? (i = ot(r)) : (i = QD(e, n)), (t[Zt] = i);
}
function XD(t, e, n, r, i, o) {
  let s = e.consts,
    a = id(s, i),
    c = cc(e, t, 2, r, a);
  return (
    Fw(e, n, c, id(s, o)),
    c.attrs !== null && Aa(c, c.attrs, !1),
    c.mergedAttrs !== null && Aa(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function D(t, e, n, r) {
  let i = ge(),
    o = $n(),
    s = Yt + t,
    a = i[we],
    c = o.firstCreatePass ? XD(s, o, i, e, n, r) : o.data[s],
    l = JD(o, i, c, a, e, t);
  i[s] = l;
  let u = ef(c);
  return (
    go(c, !0),
    ih(a, l, c),
    (c.flags & 32) !== 32 && bf() && th(o, i, l, c),
    Cy() === 0 && kn(l, i),
    Iy(),
    u && (Mw(o, i, c), ph(o, c, i)),
    r !== null && xw(i, c),
    D
  );
}
function v() {
  let t = Qe();
  ff() ? Ny() : ((t = t.parent), go(t, !1));
  let e = t;
  My(e) && xy(), Sy();
  let n = $n();
  return (
    n.firstCreatePass && (Ef(n, t), Jd(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      Wy(e) &&
      _d(n, e, ge(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      qy(e) &&
      _d(n, e, ge(), e.stylesWithoutHost, !1),
    v
  );
}
function C(t, e, n, r) {
  return D(t, e, n, r), v(), C;
}
var JD = (t, e, n, r, i, o) => (_f(!0), Zf(r, i, By()));
var lo = "en-US";
var eb = lo;
function tb(t) {
  $g(t, "Expected localeId to be defined"),
    typeof t == "string" && (eb = t.toLowerCase().replace(/_/g, "-"));
}
function Ar(t) {
  return !!t && typeof t.then == "function";
}
function Nh(t) {
  return !!t && typeof t.subscribe == "function";
}
function Un(t, e, n, r) {
  let i = ge(),
    o = $n(),
    s = Qe();
  return rb(o, i, i[we], s, t, e, r), Un;
}
function nb(t, e, n, r) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === n && i[o + 1] === r) {
        let a = e[fr],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function rb(t, e, n, r, i, o, s) {
  let a = ef(r),
    l = t.firstCreatePass && Jw(t),
    u = e[ht],
    d = Xw(e),
    f = !0;
  if (r.type & 3 || s) {
    let g = Ke(r, e),
      N = s ? s(g) : g,
      M = d.length,
      V = s ? (q) => s(ot(q[r.index])) : r.index,
      K = null;
    if ((!s && a && (K = nb(t, e, i, r.index)), K !== null)) {
      let q = K.__ngLastListenerFn__ || K;
      (q.__ngNextListenerFn__ = o), (K.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Md(r, e, u, o, !1);
      let q = n.listen(N, i, o);
      d.push(o, q), l && l.push(i, V, M, M + 1);
    }
  } else o = Md(r, e, u, o, !1);
  let h = r.outputs,
    p;
  if (f && h !== null && (p = h[i])) {
    let g = p.length;
    if (g)
      for (let N = 0; N < g; N += 2) {
        let M = p[N],
          V = p[N + 1],
          de = e[M][V].subscribe(o),
          re = d.length;
        d.push(o, de), l && l.push(i, r.index, re, -(re + 1));
      }
  }
}
function Td(t, e, n, r) {
  try {
    return tt(6, e, n), n(r) !== !1;
  } catch (i) {
    return bh(t, i), !1;
  } finally {
    tt(7, e, n);
  }
}
function Md(t, e, n, r, i) {
  return function o(s) {
    if (s === Function) return r;
    let a = t.componentOffset > -1 ? nn(t.index, e) : e;
    uc(a);
    let c = Td(e, n, r, s),
      l = o.__ngNextListenerFn__;
    for (; l; ) (c = Td(e, n, l, s) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && s.preventDefault(), c;
  };
}
function I(t, e = "") {
  let n = ge(),
    r = $n(),
    i = t + Yt,
    o = r.firstCreatePass ? cc(r, i, 1, e, null) : r.data[i],
    s = ib(r, n, o, e, t);
  (n[i] = s), bf() && th(r, n, s, o), go(o, !1);
}
var ib = (t, e, n, r, i) => (_f(!0), Lv(e[we], r));
var At = class {},
  wr = class {};
var uo = class extends At {
    constructor(e, n, r) {
      super(),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new ao(this));
      let i = Kd(e);
      (this._bootstrapComponents = Wf(i.bootstrap)),
        (this._r3Injector = Hf(
          e,
          n,
          [
            { provide: At, useValue: this },
            { provide: _o, useValue: this.componentFactoryResolver },
            ...r,
          ],
          ye(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  fo = class extends wr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new uo(this.moduleType, e, []);
    }
  };
function ob(t, e, n) {
  return new uo(t, e, n);
}
var ka = class extends At {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new ao(this)),
      (this.instance = null);
    let n = new yr(
      [
        ...e.providers,
        { provide: At, useValue: this },
        { provide: _o, useValue: this.componentFactoryResolver },
      ],
      e.parent || Xa(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function To(t, e, n = null) {
  return new ka({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var sb = (() => {
  let e = class e {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let i = $f(!1, r.type),
          o =
            i.length > 0
              ? To([i], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, o);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = b({
    token: e,
    providedIn: "environment",
    factory: () => new e(y(Ie)),
  });
  let t = e;
  return t;
})();
function Rh(t) {
  dc("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(sb).getOrCreateStandaloneInjector(t));
}
var Bi = null;
function ab(t) {
  (Bi !== null &&
    (t.defaultEncapsulation !== Bi.defaultEncapsulation ||
      t.preserveWhitespaces !== Bi.preserveWhitespaces)) ||
    (Bi = t);
}
var Mo = (() => {
    let e = class e {
      log(r) {
        console.log(r);
      }
      warn(r) {
        console.warn(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Fa = class {
    constructor(e, n) {
      (this.ngModuleFactory = e), (this.componentFactories = n);
    }
  },
  xo = (() => {
    let e = class e {
      compileModuleSync(r) {
        return new fo(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let i = this.compileModuleSync(r),
          o = Kd(r),
          s = Wf(o.declarations).reduce((a, c) => {
            let l = xt(c);
            return l && a.push(new Ln(l)), a;
          }, []);
        return new Fa(i, s);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  cb = new x("compilerOptions");
var Ao = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new fe(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var pc = new x(""),
  Nr = new x(""),
  No = (() => {
    let e = class e {
      constructor(r, i, o) {
        (this._ngZone = r),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._didWork = !1),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          mc || (lb(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          r.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            (this._didWork = !0), (this._isZoneStable = !1);
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                U.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (
          (this._pendingCount += 1), (this._didWork = !0), this._pendingCount
        );
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let r = this._callbacks.pop();
              clearTimeout(r.timeoutId), r.doneCb(this._didWork);
            }
            this._didWork = !1;
          });
        else {
          let r = this.getPendingTasks();
          (this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(r) ? (clearTimeout(i.timeoutId), !1) : !0
          )),
            (this._didWork = !0);
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((r) => ({
              source: r.source,
              creationLocation: r.creationLocation,
              data: r.data,
            }))
          : [];
      }
      addCallback(r, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              r(this._didWork, this.getPendingTasks());
          }, i)),
          this._callbacks.push({ doneCb: r, timeoutId: s, updateCb: o });
      }
      whenStable(r, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(r, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(r) {
        this.registry.registerApplication(r, this);
      }
      unregisterApplication(r) {
        this.registry.unregisterApplication(r);
      }
      findProviders(r, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(U), y(Ro), y(Nr));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ro = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(r, i) {
        this._applications.set(r, i);
      }
      unregisterApplication(r) {
        this._applications.delete(r);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(r) {
        return this._applications.get(r) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(r, i = !0) {
        return mc?.findTestabilityInTree(this, r, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function lb(t) {
  mc = t;
}
var mc,
  Oo = new x("Application Initializer"),
  Oh = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            (this.resolve = r), (this.reject = i);
          })),
          (this.appInits = w(Oo, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let o of this.appInits) {
          let s = o();
          if (Ar(s)) r.push(s);
          else if (Nh(s)) {
            let a = new Promise((c, l) => {
              s.subscribe({ complete: c, error: l });
            });
            r.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          r.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  gc = new x("appBootstrapListener");
function ub(t, e, n) {
  let r = new fo(n);
  return Promise.resolve(r);
}
function db() {
  gu(() => {
    throw new m(600, !1);
  });
}
function fb(t) {
  return t.isBoundToModule;
}
function hb(t, e, n) {
  try {
    let r = n();
    return Ar(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r);
  }
}
function Ph(t, e) {
  return Array.isArray(e) ? e.reduce(Ph, t) : _(_({}, t), e);
}
var Rt = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = w(lh)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = w(Ao).hasPendingTasks.pipe(F((r) => !r))),
        (this._injector = w(Ie));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, i) {
      let o = r instanceof oo;
      if (!this._injector.get(Oh).done) {
        let p =
          "Cannot bootstrap as there are still asynchronous initializers running." +
          (!o && Gd(r)
            ? ""
            : " Bootstrap components in the `ngDoBootstrap` method of the root module.");
        throw new m(405, !1);
      }
      let a;
      o ? (a = r) : (a = this._injector.get(_o).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = fb(a) ? void 0 : this._injector.get(At),
        l = i || a.selector,
        u = a.create(Ye.NULL, [], l, c),
        d = u.location.nativeElement,
        f = u.injector.get(pc, null);
      return (
        f?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            qi(this.components, u),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      if (this._runningTick) throw new m(101, !1);
      try {
        this._runningTick = !0;
        for (let r of this._views) r.detectChanges();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        this._runningTick = !1;
      }
    }
    attachView(r) {
      let i = r;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(r) {
      let i = r;
      qi(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let i = this._injector.get(gc, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => qi(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new m(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function qi(t, e) {
  let n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
function xd(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var pb = (() => {
  let e = class e {
    constructor() {
      (this.zone = w(U)), (this.applicationRef = w(Rt));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function mb(t) {
  return [
    { provide: U, useFactory: t },
    {
      provide: Pn,
      multi: !0,
      useFactory: () => {
        let e = w(pb, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: Pn,
      multi: !0,
      useFactory: () => {
        let e = w(vb);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: lh, useFactory: gb },
  ];
}
function gb() {
  let t = w(U),
    e = w(qe);
  return (n) => t.runOutsideAngular(() => e.handleError(n));
}
function yb(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var vb = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new ee()),
        (this.initialized = !1),
        (this.zone = w(U)),
        (this.pendingTasks = w(Ao));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              U.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            U.assertInAngularZone(), (r ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function wb() {
  return (typeof $localize < "u" && $localize.locale) || lo;
}
var Po = new x("LocaleId", {
  providedIn: "root",
  factory: () => w(Po, k.Optional | k.SkipSelf) || wb(),
});
var kh = new x("PlatformDestroyListeners"),
  Fh = (() => {
    let e = class e {
      constructor(r) {
        (this._injector = r),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(r, i) {
        let o = mD(
          i?.ngZone,
          yb({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = ob(
              r.moduleType,
              this.injector,
              mb(() => o)
            ),
            a = s.injector.get(qe, null);
          return (
            o.runOutsideAngular(() => {
              let c = o.onError.subscribe({
                next: (l) => {
                  a.handleError(l);
                },
              });
              s.onDestroy(() => {
                qi(this._modules, s), c.unsubscribe();
              });
            }),
            hb(a, o, () => {
              let c = s.injector.get(Oh);
              return (
                c.runInitializers(),
                c.donePromise.then(() => {
                  let l = s.injector.get(Po, lo);
                  return tb(l || lo), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(r, i = []) {
        let o = Ph({}, i);
        return ub(this.injector, o, r).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(r) {
        let i = r.injector.get(Rt);
        if (r._bootstrapComponents.length > 0)
          r._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(i);
        else throw new m(-403, !1);
        this._modules.push(r);
      }
      onDestroy(r) {
        this._destroyListeners.push(r);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new m(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let r = this._injector.get(kh, null);
        r && (r.forEach((i) => i()), r.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Ye));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  lr = null,
  Lh = new x("AllowMultipleToken");
function Db(t) {
  if (lr && !lr.get(Lh, !1)) throw new m(400, !1);
  db(), (lr = t);
  let e = t.get(Fh);
  return Eb(t), e;
}
function yc(t, e, n = []) {
  let r = `Platform: ${e}`,
    i = new x(r);
  return (o = []) => {
    let s = jh();
    if (!s || s.injector.get(Lh, !1)) {
      let a = [...n, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : Db(bb(a, r));
    }
    return _b(i);
  };
}
function bb(t = [], e) {
  return Ye.create({
    name: e,
    providers: [
      { provide: wo, useValue: "platform" },
      { provide: kh, useValue: new Set([() => (lr = null)]) },
      ...t,
    ],
  });
}
function _b(t) {
  let e = jh();
  if (!e) throw new m(401, !1);
  return e;
}
function jh() {
  return lr?.get(Fh) ?? null;
}
function Eb(t) {
  t.get(Ja, null)?.forEach((n) => n());
}
var Vh = yc(null, "core", []),
  $h = (() => {
    let e = class e {
      constructor(r) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Rt));
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({}));
    let t = e;
    return t;
  })();
function rn(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function Bh(t) {
  let e = xt(t);
  if (!e) return null;
  let n = new Ln(e);
  return {
    get selector() {
      return n.selector;
    },
    get type() {
      return n.componentType;
    },
    get inputs() {
      return n.inputs;
    },
    get outputs() {
      return n.outputs;
    },
    get ngContentSelectors() {
      return n.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var vc = null;
function on() {
  return vc;
}
function zh(t) {
  vc || (vc = t);
}
var ko = class {},
  ne = new x("DocumentToken"),
  bc = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => w(Cb))(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })(),
  Wh = new x("Location Initialized"),
  Cb = (() => {
    let e = class e extends bc {
      constructor() {
        super(),
          (this._doc = w(ne)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return on().getBaseHref(this._doc);
      }
      onPopState(r) {
        let i = on().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", r, !1),
          () => i.removeEventListener("popstate", r)
        );
      }
      onHashChange(r) {
        let i = on().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", r, !1),
          () => i.removeEventListener("hashchange", r)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(r) {
        this._location.pathname = r;
      }
      pushState(r, i, o) {
        this._history.pushState(r, i, o);
      }
      replaceState(r, i, o) {
        this._history.replaceState(r, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(r = 0) {
        this._history.go(r);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => new e())(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function _c(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let n = 0;
  return (
    t.endsWith("/") && n++,
    e.startsWith("/") && n++,
    n == 2 ? t + e.substring(1) : n == 1 ? t + e : t + "/" + e
  );
}
function Uh(t) {
  let e = t.match(/#|\?|$/),
    n = (e && e.index) || t.length,
    r = n - (t[n - 1] === "/" ? 1 : 0);
  return t.slice(0, r) + t.slice(n);
}
function vt(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var wt = (() => {
    let e = class e {
      historyGo(r) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => w(Ec))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  qh = new x("appBaseHref"),
  Ec = (() => {
    let e = class e extends wt {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            w(ne).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return _c(this._baseHref, r);
      }
      path(r = !1) {
        let i =
            this._platformLocation.pathname + vt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && r ? `${i}${o}` : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(bc), y(qh, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Gh = (() => {
    let e = class e extends wt {
      constructor(r, i) {
        super(),
          (this._platformLocation = r),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(r = !1) {
        let i = this._platformLocation.hash;
        return i == null && (i = "#"), i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(r) {
        let i = _c(this._baseHref, r);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(r, i, a);
      }
      replaceState(r, i, o, s) {
        let a = this.prepareExternalUrl(o + vt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(r, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(bc), y(qh, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Hn = (() => {
    let e = class e {
      constructor(r) {
        (this._subject = new he()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = r);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = Tb(Uh(Hh(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(r = !1) {
        return this.normalize(this._locationStrategy.path(r));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(r, i = "") {
        return this.path() == this.normalize(r + vt(i));
      }
      normalize(r) {
        return e.stripTrailingSlash(Sb(this._basePath, Hh(r)));
      }
      prepareExternalUrl(r) {
        return (
          r && r[0] !== "/" && (r = "/" + r),
          this._locationStrategy.prepareExternalUrl(r)
        );
      }
      go(r, i = "", o = null) {
        this._locationStrategy.pushState(o, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + vt(i)), o);
      }
      replaceState(r, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", r, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(r + vt(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(r = 0) {
        this._locationStrategy.historyGo?.(r);
      }
      onUrlChange(r) {
        return (
          this._urlChangeListeners.push(r),
          this._urlChangeSubscription ||
            (this._urlChangeSubscription = this.subscribe((i) => {
              this._notifyUrlChangeListeners(i.url, i.state);
            })),
          () => {
            let i = this._urlChangeListeners.indexOf(r);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(r = "", i) {
        this._urlChangeListeners.forEach((o) => o(r, i));
      }
      subscribe(r, i, o) {
        return this._subject.subscribe({ next: r, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = vt),
      (e.joinWithSlash = _c),
      (e.stripTrailingSlash = Uh),
      (e.ɵfac = function (i) {
        return new (i || e)(y(wt));
      }),
      (e.ɵprov = b({ token: e, factory: () => Ib(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function Ib() {
  return new Hn(y(wt));
}
function Sb(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let n = e.substring(t.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : e;
}
function Hh(t) {
  return t.replace(/\/index.html$/, "");
}
function Tb(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, n] = t.split(/\/\/[^\/]+/);
    return n;
  }
  return t;
}
function Kh(t, e) {
  e = encodeURIComponent(e);
  for (let n of t.split(";")) {
    let r = n.indexOf("="),
      [i, o] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Qh = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({}));
    let t = e;
    return t;
  })(),
  Cc = "browser",
  Mb = "server";
function Yh(t) {
  return t === Cc;
}
function Ic(t) {
  return t === Mb;
}
var Zh = (() => {
    let e = class e {};
    e.ɵprov = b({
      token: e,
      providedIn: "root",
      factory: () => new wc(y(ne), window),
    });
    let t = e;
    return t;
  })(),
  wc = class {
    constructor(e, n) {
      (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return this.supportsScrolling()
        ? [this.window.pageXOffset, this.window.pageYOffset]
        : [0, 0];
    }
    scrollToPosition(e) {
      this.supportsScrolling() && this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      if (!this.supportsScrolling()) return;
      let n = xb(this.document, e);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(e) {
      this.supportsScrolling() && (this.window.history.scrollRestoration = e);
    }
    scrollToElement(e) {
      let n = e.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(r - o[0], i - o[1]);
    }
    supportsScrolling() {
      try {
        return (
          !!this.window &&
          !!this.window.scrollTo &&
          "pageXOffset" in this.window
        );
      } catch {
        return !1;
      }
    }
  };
function xb(t, e) {
  let n = t.getElementById(e) || t.getElementsByName(e)[0];
  if (n) return n;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = r.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var Fo = class {};
var Mc = class extends ko {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  xc = class t extends Mc {
    static makeCurrent() {
      zh(new t());
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, n) {
      return n === "window"
        ? window
        : n === "document"
        ? e
        : n === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let n = Rb();
      return n == null ? null : Ob(n);
    }
    resetBaseElement() {
      Rr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Kh(document.cookie, e);
    }
  },
  Rr = null;
function Rb() {
  return (
    (Rr = Rr || document.querySelector("base")),
    Rr ? Rr.getAttribute("href") : null
  );
}
function Ob(t) {
  return new URL(t, document.baseURI).pathname;
}
var Ac = class {
    addToWindow(e) {
      (ve.getAngularTestability = (r, i = !0) => {
        let o = e.findTestabilityInTree(r, i);
        if (o == null) throw new m(5103, !1);
        return o;
      }),
        (ve.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (ve.getAllAngularRootElements = () => e.getAllRootElements());
      let n = (r) => {
        let i = ve.getAllAngularTestabilities(),
          o = i.length,
          s = !1,
          a = function (c) {
            (s = s || c), o--, o == 0 && r(s);
          };
        i.forEach((c) => {
          c.whenStable(a);
        });
      };
      ve.frameworkStabilizers || (ve.frameworkStabilizers = []),
        ve.frameworkStabilizers.push(n);
    }
    findTestabilityInTree(e, n, r) {
      if (n == null) return null;
      let i = e.getTestability(n);
      return (
        i ??
        (r
          ? on().isShadowRoot(n)
            ? this.findTestabilityInTree(e, n.host, !0)
            : this.findTestabilityInTree(e, n.parentElement, !0)
          : null)
      );
    }
  },
  Pb = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Nc = new x("EventManagerPlugins"),
  ep = (() => {
    let e = class e {
      constructor(r, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, i, o) {
        return this._findPluginFor(i).addEventListener(r, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(r))), !i))
          throw new m(5101, !1);
        return this._eventNameToPlugin.set(r, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Nc), y(U));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Lo = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Sc = "ng-app-id",
  tp = (() => {
    let e = class e {
      constructor(r, i, o, s = {}) {
        (this.doc = r),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ic(s)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((i) => i.remove()), r.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r);
      }
      onStyleRemoved(r) {
        let i = this.styleRef;
        i.get(r)?.elements?.forEach((o) => o.remove()), i.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${Sc}="${this.appId}"]`);
        if (r?.length) {
          let i = new Map();
          return (
            r.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(r, i) {
        let o = this.styleRef;
        if (o.has(r)) {
          let s = o.get(r);
          return (s.usage += i), s.usage;
        }
        return o.set(r, { usage: i, elements: [] }), i;
      }
      getStyleElement(r, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === r) return o.delete(i), s.removeAttribute(Sc), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Sc, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, i) {
        let o = this.getStyleElement(r, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(ne), y(Cr), y(Ir, 8), y(yt));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Tc = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Oc = /%COMP%/g,
  np = "%COMP%",
  kb = `_nghost-${np}`,
  Fb = `_ngcontent-${np}`,
  Lb = !0,
  jb = new x("RemoveStylesOnCompDestroy", {
    providedIn: "root",
    factory: () => Lb,
  });
function Vb(t) {
  return Fb.replace(Oc, t);
}
function $b(t) {
  return kb.replace(Oc, t);
}
function rp(t, e) {
  return e.map((n) => n.replace(Oc, t));
}
var jo = (() => {
    let e = class e {
      constructor(r, i, o, s, a, c, l, u = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Ic(c)),
          (this.defaultRenderer = new Or(r, a, l, this.platformIsServer));
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === rt.ShadowDom &&
          (i = J(_({}, i), { encapsulation: rt.Emulated }));
        let o = this.getOrCreateRenderer(r, i);
        return (
          o instanceof Vo
            ? o.applyToHost(r)
            : o instanceof Pr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(r, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case rt.Emulated:
              s = new Vo(l, u, i, this.appId, d, a, c, f);
              break;
            case rt.ShadowDom:
              return new Rc(l, u, r, i, a, c, this.nonce, f);
            default:
              s = new Pr(l, u, i, d, a, c, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        y(ep),
        y(tp),
        y(Cr),
        y(jb),
        y(ne),
        y(yt),
        y(U),
        y(Ir)
      );
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Or = class {
    constructor(e, n, r, i) {
      (this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS(Tc[n] || n, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, n) {
      (Xh(e) ? e.content : e).appendChild(n);
    }
    insertBefore(e, n, r) {
      e && (Xh(e) ? e.content : e).insertBefore(n, r);
    }
    removeChild(e, n) {
      e && e.removeChild(n);
    }
    selectRootElement(e, n) {
      let r = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!r) throw new m(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ":" + n;
        let o = Tc[i];
        o ? e.setAttributeNS(o, n, r) : e.setAttribute(n, r);
      } else e.setAttribute(n, r);
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = Tc[r];
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`);
      } else e.removeAttribute(n);
    }
    addClass(e, n) {
      e.classList.add(n);
    }
    removeClass(e, n) {
      e.classList.remove(n);
    }
    setStyle(e, n, r, i) {
      i & (mt.DashCase | mt.Important)
        ? e.style.setProperty(n, r, i & mt.Important ? "important" : "")
        : (e.style[n] = r);
    }
    removeStyle(e, n, r) {
      r & mt.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r);
    }
    setValue(e, n) {
      e.nodeValue = n;
    }
    listen(e, n, r) {
      if (
        typeof e == "string" &&
        ((e = on().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`);
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function Xh(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Rc = class extends Or {
    constructor(e, n, r, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = rp(i.id, i.styles);
      for (let u of l) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n);
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Pr = class extends Or {
    constructor(e, n, r, i, o, s, a, c) {
      super(e, o, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? rp(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Vo = class extends Pr {
    constructor(e, n, r, i, o, s, a, c) {
      let l = i + "-" + r.id;
      super(e, n, r, o, s, a, c, l),
        (this.contentAttr = Vb(l)),
        (this.hostAttr = $b(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, n) {
      let r = super.createElement(e, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Bb = (() => {
    let e = class e extends Lo {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, i, o) {
        return (
          r.addEventListener(i, o, !1), () => this.removeEventListener(r, i, o)
        );
      }
      removeEventListener(r, i, o) {
        return r.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(ne));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Jh = ["alt", "control", "meta", "shift"],
  Ub = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Hb = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  zb = (() => {
    let e = class e extends Lo {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return e.parseEventName(r) != null;
      }
      addEventListener(r, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => on().onAndCancel(r, s.domEventName, a));
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          c = i.indexOf("code");
        if (
          (c > -1 && (i.splice(c, 1), (a = "code.")),
          Jh.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = o), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(r, i) {
        let o = Ub[r.key] || r.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = r.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Jh.forEach((a) => {
                if (a !== o) {
                  let c = Hb[a];
                  c(r) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(r, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, r) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(ne));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Wb() {
  xc.makeCurrent();
}
function qb() {
  return new qe();
}
function Gb() {
  return zf(document), document;
}
var Kb = [
    { provide: yt, useValue: Cc },
    { provide: Ja, useValue: Wb, multi: !0 },
    { provide: ne, useFactory: Gb, deps: [] },
  ],
  ip = yc(Vh, "browser", Kb),
  Qb = new x(""),
  Yb = [
    { provide: Nr, useClass: Ac, deps: [] },
    { provide: pc, useClass: No, deps: [U, Ro, Nr] },
    { provide: No, useClass: No, deps: [U, Ro, Nr] },
  ],
  Zb = [
    { provide: wo, useValue: "root" },
    { provide: qe, useFactory: qb, deps: [] },
    { provide: Nc, useClass: Bb, multi: !0, deps: [ne, U, yt] },
    { provide: Nc, useClass: zb, multi: !0, deps: [ne] },
    jo,
    tp,
    ep,
    { provide: Jt, useExisting: jo },
    { provide: Fo, useClass: Pb, deps: [] },
    [],
  ],
  $o = (() => {
    let e = class e {
      constructor(r) {}
      static withServerTransition(r) {
        return { ngModule: e, providers: [{ provide: Cr, useValue: r.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Qb, 12));
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({ providers: [...Zb, ...Yb], imports: [Qh, $h] }));
    let t = e;
    return t;
  })();
function Xb() {
  return new Pc(y(ne));
}
var Pc = (() => {
  let e = class e {
    constructor(r) {
      this._doc = r;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(r) {
      this._doc.title = r || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(ne));
  }),
    (e.ɵprov = b({
      token: e,
      factory: function (i) {
        let o = null;
        return i ? (o = new i()) : (o = Xb()), o;
      },
      providedIn: "root",
    }));
  let t = e;
  return t;
})();
var P = "primary",
  Qr = Symbol("RouteTitle"),
  Vc = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let n = this.params[e];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Kn(t) {
  return new Vc(t);
}
function t_(t, e, n) {
  let r = n.path.split("/");
  if (
    r.length > t.length ||
    (n.pathMatch === "full" && (e.hasChildren() || r.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < r.length; o++) {
    let s = r[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, r.length), posParams: i };
}
function n_(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; ++n) if (!st(t[n], e[n])) return !1;
  return !0;
}
function st(t, e) {
  let n = t ? $c(t) : void 0,
    r = e ? $c(e) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let o = 0; o < n.length; o++)
    if (((i = n[o]), !pp(t[i], e[i]))) return !1;
  return !0;
}
function $c(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function pp(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let n = [...t].sort(),
      r = [...e].sort();
    return n.every((i, o) => r[o] === i);
  } else return t === e;
}
function mp(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Lt(t) {
  return js(t) ? t : Ar(t) ? te(Promise.resolve(t)) : A(t);
}
var r_ = { exact: yp, subset: vp },
  gp = { exact: i_, subset: o_, ignored: () => !0 };
function sp(t, e, n) {
  return (
    r_[n.paths](t.root, e.root, n.matrixParams) &&
    gp[n.queryParams](t.queryParams, e.queryParams) &&
    !(n.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function i_(t, e) {
  return st(t, e);
}
function yp(t, e, n) {
  if (
    !an(t.segments, e.segments) ||
    !Ho(t.segments, e.segments, n) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let r in e.children)
    if (!t.children[r] || !yp(t.children[r], e.children[r], n)) return !1;
  return !0;
}
function o_(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((n) => pp(t[n], e[n]))
  );
}
function vp(t, e, n) {
  return wp(t, e, e.segments, n);
}
function wp(t, e, n, r) {
  if (t.segments.length > n.length) {
    let i = t.segments.slice(0, n.length);
    return !(!an(i, n) || e.hasChildren() || !Ho(i, n, r));
  } else if (t.segments.length === n.length) {
    if (!an(t.segments, n) || !Ho(t.segments, n, r)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !vp(t.children[i], e.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, t.segments.length),
      o = n.slice(t.segments.length);
    return !an(t.segments, i) || !Ho(t.segments, i, r) || !t.children[P]
      ? !1
      : wp(t.children[P], e, o, r);
  }
}
function Ho(t, e, n) {
  return e.every((r, i) => gp[n](t[i].parameters, r.parameters));
}
var Ot = class {
    constructor(e = new W([], {}), n = {}, r = null) {
      (this.root = e), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        this._queryParamMap || (this._queryParamMap = Kn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      return c_.serialize(this);
    }
  },
  W = class {
    constructor(e, n) {
      (this.segments = e),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return zo(this);
    }
  },
  sn = class {
    constructor(e, n) {
      (this.path = e), (this.parameters = n);
    }
    get parameterMap() {
      return (
        this._parameterMap || (this._parameterMap = Kn(this.parameters)),
        this._parameterMap
      );
    }
    toString() {
      return bp(this);
    }
  };
function s_(t, e) {
  return an(t, e) && t.every((n, r) => st(n.parameters, e[r].parameters));
}
function an(t, e) {
  return t.length !== e.length ? !1 : t.every((n, r) => n.path === e[r].path);
}
function a_(t, e) {
  let n = [];
  return (
    Object.entries(t.children).forEach(([r, i]) => {
      r === P && (n = n.concat(e(i, r)));
    }),
    Object.entries(t.children).forEach(([r, i]) => {
      r !== P && (n = n.concat(e(i, r)));
    }),
    n
  );
}
var Yr = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => new Br())(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  Br = class {
    parse(e) {
      let n = new Uc(e);
      return new Ot(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment()
      );
    }
    serialize(e) {
      let n = `/${kr(e.root, !0)}`,
        r = d_(e.queryParams),
        i = typeof e.fragment == "string" ? `#${l_(e.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  c_ = new Br();
function zo(t) {
  return t.segments.map((e) => bp(e)).join("/");
}
function kr(t, e) {
  if (!t.hasChildren()) return zo(t);
  if (e) {
    let n = t.children[P] ? kr(t.children[P], !1) : "",
      r = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== P && r.push(`${i}:${kr(o, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = a_(t, (r, i) =>
      i === P ? [kr(t.children[P], !1)] : [`${i}:${kr(r, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[P] != null
      ? `${zo(t)}/${n[0]}`
      : `${zo(t)}/(${n.join("//")})`;
  }
}
function Dp(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Bo(t) {
  return Dp(t).replace(/%3B/gi, ";");
}
function l_(t) {
  return encodeURI(t);
}
function Bc(t) {
  return Dp(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Wo(t) {
  return decodeURIComponent(t);
}
function ap(t) {
  return Wo(t.replace(/\+/g, "%20"));
}
function bp(t) {
  return `${Bc(t.path)}${u_(t.parameters)}`;
}
function u_(t) {
  return Object.keys(t)
    .map((e) => `;${Bc(e)}=${Bc(t[e])}`)
    .join("");
}
function d_(t) {
  let e = Object.keys(t)
    .map((n) => {
      let r = t[n];
      return Array.isArray(r)
        ? r.map((i) => `${Bo(n)}=${Bo(i)}`).join("&")
        : `${Bo(n)}=${Bo(r)}`;
    })
    .filter((n) => !!n);
  return e.length ? `?${e.join("&")}` : "";
}
var f_ = /^[^\/()?;#]+/;
function kc(t) {
  let e = t.match(f_);
  return e ? e[0] : "";
}
var h_ = /^[^\/()?;=#]+/;
function p_(t) {
  let e = t.match(h_);
  return e ? e[0] : "";
}
var m_ = /^[^=?&#]+/;
function g_(t) {
  let e = t.match(m_);
  return e ? e[0] : "";
}
var y_ = /^[^&#]+/;
function v_(t) {
  let e = t.match(y_);
  return e ? e[0] : "";
}
var Uc = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new W([], {})
        : new W([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (e.length > 0 || Object.keys(n).length > 0) && (r[P] = new W(e, n)),
      r
    );
  }
  parseSegment() {
    let e = kc(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new m(4009, !1);
    return this.capture(e), new sn(Wo(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let n = p_(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = kc(this.remaining);
      i && ((r = i), this.capture(r));
    }
    e[Wo(n)] = Wo(r);
  }
  parseQueryParam(e) {
    let n = g_(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = v_(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let i = ap(n),
      o = ap(r);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = kc(this.remaining),
        i = this.remaining[r.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new m(4010, !1);
      let o;
      r.indexOf(":") > -1
        ? ((o = r.slice(0, r.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = P);
      let s = this.parseChildren();
      (n[o] = Object.keys(s).length === 1 ? s[P] : new W([], s)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new m(4011, !1);
  }
};
function _p(t) {
  return t.segments.length > 0 ? new W([], { [P]: t }) : t;
}
function Ep(t) {
  let e = {};
  for (let r of Object.keys(t.children)) {
    let i = t.children[r],
      o = Ep(i);
    if (r === P && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[r] = o);
  }
  let n = new W(t.segments, e);
  return w_(n);
}
function w_(t) {
  if (t.numberOfChildren === 1 && t.children[P]) {
    let e = t.children[P];
    return new W(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function Qn(t) {
  return t instanceof Ot;
}
function D_(t, e, n = null, r = null) {
  let i = Cp(t);
  return Ip(i, e, n, r);
}
function Cp(t) {
  let e;
  function n(o) {
    let s = {};
    for (let c of o.children) {
      let l = n(c);
      s[c.outlet] = l;
    }
    let a = new W(o.url, s);
    return o === t && (e = a), a;
  }
  let r = n(t.root),
    i = _p(r);
  return e ?? i;
}
function Ip(t, e, n, r) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Fc(i, i, i, n, r);
  let o = b_(e);
  if (o.toRoot()) return Fc(i, i, new W([], {}), n, r);
  let s = __(o, i, t),
    a = s.processChildren
      ? jr(s.segmentGroup, s.index, o.commands)
      : Tp(s.segmentGroup, s.index, o.commands);
  return Fc(i, s.segmentGroup, a, n, r);
}
function qo(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Ur(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Fc(t, e, n, r, i) {
  let o = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  t === e ? (s = n) : (s = Sp(t, e, n));
  let a = _p(Ep(s));
  return new Ot(a, o, i);
}
function Sp(t, e, n) {
  let r = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (r[i] = n) : (r[i] = Sp(o, e, n));
    }),
    new W(t.segments, r)
  );
}
var Go = class {
  constructor(e, n, r) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      e && r.length > 0 && qo(r[0]))
    )
      throw new m(4003, !1);
    let i = r.find(Ur);
    if (i && i !== mp(r)) throw new m(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function b_(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new Go(!0, 0, t);
  let e = 0,
    n = !1,
    r = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (n = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new Go(n, e, r);
}
var qn = class {
  constructor(e, n, r) {
    (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
  }
};
function __(t, e, n) {
  if (t.isAbsolute) return new qn(e, !0, 0);
  if (!n) return new qn(e, !1, NaN);
  if (n.parent === null) return new qn(n, !0, 0);
  let r = qo(t.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return E_(n, i, t.numberOfDoubleDots);
}
function E_(t, e, n) {
  let r = t,
    i = e,
    o = n;
  for (; o > i; ) {
    if (((o -= i), (r = r.parent), !r)) throw new m(4005, !1);
    i = r.segments.length;
  }
  return new qn(r, !1, i - o);
}
function C_(t) {
  return Ur(t[0]) ? t[0].outlets : { [P]: t };
}
function Tp(t, e, n) {
  if ((t || (t = new W([], {})), t.segments.length === 0 && t.hasChildren()))
    return jr(t, e, n);
  let r = I_(t, e, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < t.segments.length) {
    let o = new W(t.segments.slice(0, r.pathIndex), {});
    return (
      (o.children[P] = new W(t.segments.slice(r.pathIndex), t.children)),
      jr(o, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new W(t.segments, {})
      : r.match && !t.hasChildren()
      ? Hc(t, e, n)
      : r.match
      ? jr(t, 0, i)
      : Hc(t, e, n);
}
function jr(t, e, n) {
  if (n.length === 0) return new W(t.segments, {});
  {
    let r = C_(n),
      i = {};
    if (
      Object.keys(r).some((o) => o !== P) &&
      t.children[P] &&
      t.numberOfChildren === 1 &&
      t.children[P].segments.length === 0
    ) {
      let o = jr(t.children[P], e, n);
      return new W(t.segments, o.children);
    }
    return (
      Object.entries(r).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Tp(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        r[o] === void 0 && (i[o] = s);
      }),
      new W(t.segments, i)
    );
  }
}
function I_(t, e, n) {
  let r = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (r >= n.length) return o;
    let s = t.segments[i],
      a = n[r];
    if (Ur(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!lp(c, l, s)) return o;
      r += 2;
    } else {
      if (!lp(c, {}, s)) return o;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function Hc(t, e, n) {
  let r = t.segments.slice(0, e),
    i = 0;
  for (; i < n.length; ) {
    let o = n[i];
    if (Ur(o)) {
      let c = S_(o.outlets);
      return new W(r, c);
    }
    if (i === 0 && qo(n[0])) {
      let c = t.segments[e];
      r.push(new sn(c.path, cp(n[0]))), i++;
      continue;
    }
    let s = Ur(o) ? o.outlets[P] : `${o}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    s && a && qo(a)
      ? (r.push(new sn(s, cp(a))), (i += 2))
      : (r.push(new sn(s, {})), i++);
  }
  return new W(r, {});
}
function S_(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (e[n] = Hc(new W([], {}), 0, r));
    }),
    e
  );
}
function cp(t) {
  let e = {};
  return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
}
function lp(t, e, n) {
  return t == n.path && st(e, n.parameters);
}
var Vr = "imperative",
  Fe = class {
    constructor(e, n) {
      (this.id = e), (this.url = n);
    }
  },
  Yn = class extends Fe {
    constructor(e, n, r = "imperative", i = null) {
      super(e, n),
        (this.type = 0),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  at = class extends Fe {
    constructor(e, n, r) {
      super(e, n), (this.urlAfterRedirects = r), (this.type = 1);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Pt = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n), (this.reason = r), (this.code = i), (this.type = 2);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  kt = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n), (this.reason = r), (this.code = i), (this.type = 16);
    }
  },
  Hr = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n), (this.error = r), (this.target = i), (this.type = 3);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ko = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = 4);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  zc = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = 7);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Wc = class extends Fe {
    constructor(e, n, r, i, o) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = 8);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  qc = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = 5);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Gc = class extends Fe {
    constructor(e, n, r, i) {
      super(e, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = 6);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Kc = class {
    constructor(e) {
      (this.route = e), (this.type = 9);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Qc = class {
    constructor(e) {
      (this.route = e), (this.type = 10);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Yc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 11);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Zc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 12);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Xc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 13);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Jc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 14);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Qo = class {
    constructor(e, n, r) {
      (this.routerEvent = e),
        (this.position = n),
        (this.anchor = r),
        (this.type = 15);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  zr = class {},
  Wr = class {
    constructor(e) {
      this.url = e;
    }
  };
var el = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new Zr()),
        (this.attachRef = null);
    }
  },
  Zr = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(r, i) {
        let o = this.getOrCreateContext(r);
        (o.outlet = i), this.contexts.set(r, o);
      }
      onChildOutletDestroyed(r) {
        let i = this.getContext(r);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let i = this.getContext(r);
        return i || ((i = new el()), this.contexts.set(r, i)), i;
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Yo = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let n = this.pathFromRoot(e);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(e) {
      let n = tl(e, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(e) {
      let n = tl(e, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(e) {
      let n = nl(e, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return nl(e, this._root).map((n) => n.value);
    }
  };
function tl(t, e) {
  if (t === e.value) return e;
  for (let n of e.children) {
    let r = tl(t, n);
    if (r) return r;
  }
  return null;
}
function nl(t, e) {
  if (t === e.value) return [e];
  for (let n of e.children) {
    let r = nl(t, n);
    if (r.length) return r.unshift(e), r;
  }
  return [];
}
var Te = class {
  constructor(e, n) {
    (this.value = e), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Wn(t) {
  let e = {};
  return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
}
var Zo = class extends Yo {
  constructor(e, n) {
    super(e), (this.snapshot = n), fl(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Mp(t, e) {
  let n = T_(t, e),
    r = new fe([new sn("", {})]),
    i = new fe({}),
    o = new fe({}),
    s = new fe({}),
    a = new fe(""),
    c = new cn(r, i, s, a, o, P, e, n.root);
  return (c.snapshot = n.root), new Zo(new Te(c, []), n);
}
function T_(t, e) {
  let n = {},
    r = {},
    i = {},
    o = "",
    s = new qr([], n, i, o, r, P, e, null, {});
  return new Xo("", new Te(s, []));
}
var cn = class {
  constructor(e, n, r, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(F((l) => l[Qr])) ?? A(void 0)),
      (this.url = e),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      this._paramMap || (this._paramMap = this.params.pipe(F((e) => Kn(e)))),
      this._paramMap
    );
  }
  get queryParamMap() {
    return (
      this._queryParamMap ||
        (this._queryParamMap = this.queryParams.pipe(F((e) => Kn(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function dl(t, e, n = "emptyOnly") {
  let r,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (n === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (r = {
          params: _(_({}, e.params), t.params),
          data: _(_({}, e.data), t.data),
          resolve: _(_(_(_({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (r = {
          params: _({}, t.params),
          data: _({}, t.data),
          resolve: _(_({}, t.data), t._resolvedData ?? {}),
        }),
    i && Ap(i) && (r.resolve[Qr] = i.title),
    r
  );
}
var qr = class {
    get title() {
      return this.data?.[Qr];
    }
    constructor(e, n, r, i, o, s, a, c, l) {
      (this.url = e),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (
        this._paramMap || (this._paramMap = Kn(this.params)), this._paramMap
      );
    }
    get queryParamMap() {
      return (
        this._queryParamMap || (this._queryParamMap = Kn(this.queryParams)),
        this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${n}')`;
    }
  },
  Xo = class extends Yo {
    constructor(e, n) {
      super(n), (this.url = e), fl(this, n);
    }
    toString() {
      return xp(this._root);
    }
  };
function fl(t, e) {
  (e.value._routerState = t), e.children.forEach((n) => fl(t, n));
}
function xp(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(xp).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Lc(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      n = t._futureSnapshot;
    (t.snapshot = n),
      st(e.queryParams, n.queryParams) ||
        t.queryParamsSubject.next(n.queryParams),
      e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
      st(e.params, n.params) || t.paramsSubject.next(n.params),
      n_(e.url, n.url) || t.urlSubject.next(n.url),
      st(e.data, n.data) || t.dataSubject.next(n.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function rl(t, e) {
  let n = st(t.params, e.params) && s_(t.url, e.url),
    r = !t.parent != !e.parent;
  return n && !r && (!t.parent || rl(t.parent, e.parent));
}
function Ap(t) {
  return typeof t.title == "string" || t.title === null;
}
var hl = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = P),
          (this.activateEvents = new he()),
          (this.deactivateEvents = new he()),
          (this.attachEvents = new he()),
          (this.detachEvents = new he()),
          (this.parentContexts = w(Zr)),
          (this.location = w(So)),
          (this.changeDetector = w(Mr)),
          (this.environmentInjector = w(Ie)),
          (this.inputBinder = w(rs, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: i, previousValue: o } = r.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new m(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new m(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new m(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, i) {
        (this.activated = r),
          (this._activatedRoute = i),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, i) {
        if (this.isActivated) throw new m(4013, !1);
        this._activatedRoute = r;
        let o = this.location,
          a = r.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new il(r, c, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: l,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = tn({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Vn],
      }));
    let t = e;
    return t;
  })(),
  il = class {
    constructor(e, n, r) {
      (this.route = e), (this.childContexts = n), (this.parent = r);
    }
    get(e, n) {
      return e === cn
        ? this.route
        : e === Zr
        ? this.childContexts
        : this.parent.get(e, n);
    }
  },
  rs = new x(""),
  up = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(r) {
        this.unsubscribeFromRouteData(r), this.subscribeToRouteData(r);
      }
      unsubscribeFromRouteData(r) {
        this.outletDataSubscriptions.get(r)?.unsubscribe(),
          this.outletDataSubscriptions.delete(r);
      }
      subscribeToRouteData(r) {
        let { activatedRoute: i } = r,
          o = qt([i.queryParams, i.params, i.data])
            .pipe(
              Re(
                ([s, a, c], l) => (
                  (c = _(_(_({}, s), a), c)),
                  l === 0 ? A(c) : Promise.resolve(c)
                )
              )
            )
            .subscribe((s) => {
              if (
                !r.isActivated ||
                !r.activatedComponentRef ||
                r.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              let a = Bh(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(r);
                return;
              }
              for (let { templateName: c } of a.inputs)
                r.activatedComponentRef.setInput(c, s[c]);
            });
        this.outletDataSubscriptions.set(r, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function M_(t, e, n) {
  let r = Gr(t, e._root, n ? n._root : void 0);
  return new Zo(r, e);
}
function Gr(t, e, n) {
  if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = e.value;
    let i = x_(t, e, n);
    return new Te(r, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => Gr(t, a))),
          s
        );
      }
    }
    let r = A_(e.value),
      i = e.children.map((o) => Gr(t, o));
    return new Te(r, i);
  }
}
function x_(t, e, n) {
  return e.children.map((r) => {
    for (let i of n.children)
      if (t.shouldReuseRoute(r.value, i.value.snapshot)) return Gr(t, r, i);
    return Gr(t, r);
  });
}
function A_(t) {
  return new cn(
    new fe(t.url),
    new fe(t.params),
    new fe(t.queryParams),
    new fe(t.fragment),
    new fe(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Np = "ngNavigationCancelingError";
function Rp(t, e) {
  let { redirectTo: n, navigationBehaviorOptions: r } = Qn(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Op(!1, 0, e);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function Op(t, e, n) {
  let r = new Error("NavigationCancelingError: " + (t || ""));
  return (r[Np] = !0), (r.cancellationCode = e), n && (r.url = n), r;
}
function N_(t) {
  return Pp(t) && Qn(t.url);
}
function Pp(t) {
  return t && t[Np];
}
var R_ = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Rh],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && C(0, "router-outlet");
      },
      dependencies: [hl],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function O_(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = To(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function pl(t) {
  let e = t.children && t.children.map(pl),
    n = e ? J(_({}, t), { children: e }) : _({}, t);
  return (
    !n.component &&
      !n.loadComponent &&
      (e || n.loadChildren) &&
      n.outlet &&
      n.outlet !== P &&
      (n.component = R_),
    n
  );
}
function ct(t) {
  return t.outlet || P;
}
function P_(t, e) {
  let n = t.filter((r) => ct(r) === e);
  return n.push(...t.filter((r) => ct(r) !== e)), n;
}
function Xr(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let n = e.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var k_ = (t, e, n, r) =>
    F(
      (i) => (
        new ol(e, i.targetRouterState, i.currentRouterState, n, r).activate(t),
        i
      )
    ),
  ol = class {
    constructor(e, n, r, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, e),
        Lc(this.futureState.root),
        this.activateChildRoutes(n, r, e);
    }
    deactivateChildRoutes(e, n, r) {
      let i = Wn(n);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], r), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, r);
        });
    }
    deactivateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if (i === o)
        if (i.component) {
          let s = r.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, n, s.children);
        } else this.deactivateChildRoutes(e, n, r);
      else o && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(e, n) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, n)
        : this.deactivateRouteAndOutlet(e, n);
    }
    detachAndStoreRouteSubtree(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        o = Wn(e);
      for (let s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, n) {
      let r = n.getContext(e.value.outlet),
        i = r && e.value.component ? r.children : n,
        o = Wn(e);
      for (let s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(e, n, r) {
      let i = Wn(n);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], r),
          this.forwardEvent(new Jc(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Zc(e.value.snapshot));
    }
    activateRoutes(e, n, r) {
      let i = e.value,
        o = n ? n.value : null;
      if ((Lc(i), i === o))
        if (i.component) {
          let s = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, n, s.children);
        } else this.activateChildRoutes(e, n, r);
      else if (i.component) {
        let s = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Lc(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Xr(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, r);
    }
  },
  Jo = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Gn = class {
    constructor(e, n) {
      (this.component = e), (this.route = n);
    }
  };
function F_(t, e, n) {
  let r = t._root,
    i = e ? e._root : null;
  return Fr(r, i, n, [r.value]);
}
function L_(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Xn(t, e) {
  let n = Symbol(),
    r = e.get(t, n);
  return r === n ? (typeof t == "function" && !Pd(t) ? t : e.get(t)) : r;
}
function Fr(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = Wn(e);
  return (
    t.children.forEach((s) => {
      j_(s, o[s.value.outlet], n, r.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => $r(a, n.getContext(s), i)),
    i
  );
}
function j_(
  t,
  e,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = n ? n.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = V_(s, o, o.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Jo(r))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Fr(t, e, a ? a.children : null, r, i) : Fr(t, e, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Gn(a.outlet.component, s));
  } else
    s && $r(e, a, i),
      i.canActivateChecks.push(new Jo(r)),
      o.component
        ? Fr(t, null, a ? a.children : null, r, i)
        : Fr(t, null, n, r, i);
  return i;
}
function V_(t, e, n) {
  if (typeof n == "function") return n(t, e);
  switch (n) {
    case "pathParamsChange":
      return !an(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !an(t.url, e.url) || !st(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !rl(t, e) || !st(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !rl(t, e);
  }
}
function $r(t, e, n) {
  let r = Wn(t),
    i = t.value;
  Object.entries(r).forEach(([o, s]) => {
    i.component
      ? e
        ? $r(s, e.children.getContext(o), n)
        : $r(s, null, n)
      : $r(s, e, n);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? n.canDeactivateChecks.push(new Gn(e.outlet.component, i))
        : n.canDeactivateChecks.push(new Gn(null, i))
      : n.canDeactivateChecks.push(new Gn(null, i));
}
function Jr(t) {
  return typeof t == "function";
}
function $_(t) {
  return typeof t == "boolean";
}
function B_(t) {
  return t && Jr(t.canLoad);
}
function U_(t) {
  return t && Jr(t.canActivate);
}
function H_(t) {
  return t && Jr(t.canActivateChild);
}
function z_(t) {
  return t && Jr(t.canDeactivate);
}
function W_(t) {
  return t && Jr(t.canMatch);
}
function kp(t) {
  return t instanceof ft || t?.name === "EmptyError";
}
var Uo = Symbol("INITIAL_VALUE");
function Zn() {
  return Re((t) =>
    qt(t.map((e) => e.pipe(Be(1), sr(Uo)))).pipe(
      F((e) => {
        for (let n of e)
          if (n !== !0) {
            if (n === Uo) return Uo;
            if (n === !1 || n instanceof Ot) return n;
          }
        return !0;
      }),
      be((e) => e !== Uo),
      Be(1)
    )
  );
}
function q_(t, e) {
  return ie((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && o.length === 0
      ? A(J(_({}, n), { guardsResult: !0 }))
      : G_(s, r, i, t).pipe(
          ie((a) => (a && $_(a) ? K_(r, o, t, e) : A(a))),
          F((a) => J(_({}, n), { guardsResult: a }))
        );
  });
}
function G_(t, e, n, r) {
  return te(t).pipe(
    ie((i) => J_(i.component, i.route, n, e, r)),
    et((i) => i !== !0, !0)
  );
}
function K_(t, e, n, r) {
  return te(e).pipe(
    Gt((i) =>
      Et(
        Y_(i.route.parent, r),
        Q_(i.route, r),
        X_(t, i.path, n),
        Z_(t, i.route, n)
      )
    ),
    et((i) => i !== !0, !0)
  );
}
function Q_(t, e) {
  return t !== null && e && e(new Xc(t)), A(!0);
}
function Y_(t, e) {
  return t !== null && e && e(new Yc(t)), A(!0);
}
function Z_(t, e, n) {
  let r = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!r || r.length === 0) return A(!0);
  let i = r.map((o) =>
    Fi(() => {
      let s = Xr(e) ?? n,
        a = Xn(o, s),
        c = U_(a) ? a.canActivate(e, t) : Nt(s, () => a(e, t));
      return Lt(c).pipe(et());
    })
  );
  return A(i).pipe(Zn());
}
function X_(t, e, n) {
  let r = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => L_(s))
      .filter((s) => s !== null)
      .map((s) =>
        Fi(() => {
          let a = s.guards.map((c) => {
            let l = Xr(s.node) ?? n,
              u = Xn(c, l),
              d = H_(u) ? u.canActivateChild(r, t) : Nt(l, () => u(r, t));
            return Lt(d).pipe(et());
          });
          return A(a).pipe(Zn());
        })
      );
  return A(o).pipe(Zn());
}
function J_(t, e, n, r, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return A(!0);
  let s = o.map((a) => {
    let c = Xr(e) ?? i,
      l = Xn(a, c),
      u = z_(l) ? l.canDeactivate(t, e, n, r) : Nt(c, () => l(t, e, n, r));
    return Lt(u).pipe(et());
  });
  return A(s).pipe(Zn());
}
function eE(t, e, n, r) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return A(!0);
  let o = i.map((s) => {
    let a = Xn(s, t),
      c = B_(a) ? a.canLoad(e, n) : Nt(t, () => a(e, n));
    return Lt(c);
  });
  return A(o).pipe(Zn(), Fp(r));
}
function Fp(t) {
  return Os(
    ue((e) => {
      if (Qn(e)) throw Rp(t, e);
    }),
    F((e) => e === !0)
  );
}
function tE(t, e, n, r) {
  let i = e.canMatch;
  if (!i || i.length === 0) return A(!0);
  let o = i.map((s) => {
    let a = Xn(s, t),
      c = W_(a) ? a.canMatch(e, n) : Nt(t, () => a(e, n));
    return Lt(c);
  });
  return A(o).pipe(Zn(), Fp(r));
}
var Kr = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  es = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function zn(t) {
  return _n(new Kr(t));
}
function nE(t) {
  return _n(new m(4e3, !1));
}
function rE(t) {
  return _n(Op(!1, 3));
}
var sl = class {
    constructor(e, n) {
      (this.urlSerializer = e), (this.urlTree = n);
    }
    lineralizeSegments(e, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return A(r);
        if (i.numberOfChildren > 1 || !i.children[P]) return nE(e.redirectTo);
        i = i.children[P];
      }
    }
    applyRedirectCommands(e, n, r) {
      let i = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        e,
        r
      );
      if (n.startsWith("/")) throw new es(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, n, r, i) {
      let o = this.createSegmentGroup(e, n.root, r, i);
      return new Ot(
        o,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment
      );
    }
    createQueryParams(e, n) {
      let r = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            r[i] = n[a];
          } else r[i] = o;
        }),
        r
      );
    }
    createSegmentGroup(e, n, r, i) {
      let o = this.createSegments(e, n.segments, r, i),
        s = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, r, i);
        }),
        new W(o, s)
      );
    }
    createSegments(e, n, r, i) {
      return n.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, r)
      );
    }
    findPosParam(e, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new m(4001, !1);
      return i;
    }
    findOrReturn(e, n) {
      let r = 0;
      for (let i of n) {
        if (i.path === e.path) return n.splice(r), i;
        r++;
      }
      return e;
    }
  },
  al = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function iE(t, e, n, r, i) {
  let o = ml(t, e, n);
  return o.matched
    ? ((r = O_(e, r)),
      tE(r, e, n, i).pipe(F((s) => (s === !0 ? o : _({}, al)))))
    : A(o);
}
function ml(t, e, n) {
  if (e.path === "**") return oE(n);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || n.length > 0)
      ? _({}, al)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || t_)(n, t, e);
  if (!i) return _({}, al);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s =
    i.consumed.length > 0
      ? _(_({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function oE(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? mp(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function dp(t, e, n, r) {
  return n.length > 0 && cE(t, n, r)
    ? {
        segmentGroup: new W(e, aE(r, new W(n, t.children))),
        slicedSegments: [],
      }
    : n.length === 0 && lE(t, n, r)
    ? {
        segmentGroup: new W(t.segments, sE(t, e, n, r, t.children)),
        slicedSegments: n,
      }
    : { segmentGroup: new W(t.segments, t.children), slicedSegments: n };
}
function sE(t, e, n, r, i) {
  let o = {};
  for (let s of r)
    if (is(t, n, s) && !i[ct(s)]) {
      let a = new W([], {});
      o[ct(s)] = a;
    }
  return _(_({}, i), o);
}
function aE(t, e) {
  let n = {};
  n[P] = e;
  for (let r of t)
    if (r.path === "" && ct(r) !== P) {
      let i = new W([], {});
      n[ct(r)] = i;
    }
  return n;
}
function cE(t, e, n) {
  return n.some((r) => is(t, e, r) && ct(r) !== P);
}
function lE(t, e, n) {
  return n.some((r) => is(t, e, r));
}
function is(t, e, n) {
  return (t.hasChildren() || e.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function uE(t, e, n, r) {
  return ct(t) !== r && (r === P || !is(e, n, t)) ? !1 : ml(e, t, n).matched;
}
function dE(t, e, n) {
  return e.length === 0 && !t.children[n];
}
var cl = class {};
function fE(t, e, n, r, i, o, s = "emptyOnly") {
  return new ll(t, e, n, r, i, s, o).recognize();
}
var hE = 31,
  ll = class {
    constructor(e, n, r, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new sl(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new m(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = dp(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        F((n) => {
          let r = new qr(
              [],
              Object.freeze({}),
              Object.freeze(_({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              P,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Te(r, n),
            o = new Xo("", i),
            s = D_(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, P).pipe(
        Ct((r) => {
          if (r instanceof es)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Kr ? this.noMatchError(r) : r;
        })
      );
    }
    inheritParamsAndData(e, n) {
      let r = e.value,
        i = dl(r, n, this.paramsInheritanceStrategy);
      (r.params = Object.freeze(i.params)),
        (r.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, r));
    }
    processSegmentGroup(e, n, r, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(e, n, r)
        : this.processSegment(e, n, r, r.segments, i, !0).pipe(
            F((o) => (o instanceof Te ? [o] : []))
          );
    }
    processChildren(e, n, r) {
      let i = [];
      for (let o of Object.keys(r.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return te(i).pipe(
        Gt((o) => {
          let s = r.children[o],
            a = P_(n, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        Us((o, s) => (o.push(...s), o)),
        It(null),
        Bs(),
        ie((o) => {
          if (o === null) return zn(r);
          let s = Lp(o);
          return pE(s), A(s);
        })
      );
    }
    processSegment(e, n, r, i, o, s) {
      return te(n).pipe(
        Gt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            n,
            a,
            r,
            i,
            o,
            s
          ).pipe(
            Ct((c) => {
              if (c instanceof Kr) return A(null);
              throw c;
            })
          )
        ),
        et((a) => !!a),
        Ct((a) => {
          if (kp(a)) return dE(r, i, o) ? A(new cl()) : zn(r);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, n, r, i, o, s, a) {
      return uE(r, i, o, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, r, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, n, r, o, s)
          : zn(i)
        : zn(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, n, r, i, o, s) {
      let {
        matched: a,
        consumedSegments: c,
        positionalParamSegments: l,
        remainingSegments: u,
      } = ml(n, i, o);
      if (!a) return zn(n);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > hE && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(ie((f) => this.processSegment(e, r, n, f.concat(u), s, !1)));
    }
    matchSegmentAgainstRoute(e, n, r, i, o) {
      let s = iE(n, r, i, e, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        s.pipe(
          Re((a) =>
            a.matched
              ? ((e = r._injector ?? e),
                this.getChildConfig(e, r, i).pipe(
                  Re(({ routes: c }) => {
                    let l = r._loadedInjector ?? e,
                      {
                        consumedSegments: u,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new qr(
                        u,
                        f,
                        Object.freeze(_({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        gE(r),
                        ct(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        yE(r)
                      ),
                      { segmentGroup: p, slicedSegments: g } = dp(n, u, d, c);
                    if (g.length === 0 && p.hasChildren())
                      return this.processChildren(l, c, p).pipe(
                        F((M) => (M === null ? null : new Te(h, M)))
                      );
                    if (c.length === 0 && g.length === 0)
                      return A(new Te(h, []));
                    let N = ct(r) === o;
                    return this.processSegment(l, c, p, g, N ? P : o, !0).pipe(
                      F((M) => new Te(h, M instanceof Te ? [M] : []))
                    );
                  })
                ))
              : zn(n)
          )
        )
      );
    }
    getChildConfig(e, n, r) {
      return n.children
        ? A({ routes: n.children, injector: e })
        : n.loadChildren
        ? n._loadedRoutes !== void 0
          ? A({ routes: n._loadedRoutes, injector: n._loadedInjector })
          : eE(e, n, r, this.urlSerializer).pipe(
              ie((i) =>
                i
                  ? this.configLoader.loadChildren(e, n).pipe(
                      ue((o) => {
                        (n._loadedRoutes = o.routes),
                          (n._loadedInjector = o.injector);
                      })
                    )
                  : rE(n)
              )
            )
        : A({ routes: [], injector: e });
    }
  };
function pE(t) {
  t.sort((e, n) =>
    e.value.outlet === P
      ? -1
      : n.value.outlet === P
      ? 1
      : e.value.outlet.localeCompare(n.value.outlet)
  );
}
function mE(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function Lp(t) {
  let e = [],
    n = new Set();
  for (let r of t) {
    if (!mE(r)) {
      e.push(r);
      continue;
    }
    let i = e.find((o) => r.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : e.push(r);
  }
  for (let r of n) {
    let i = Lp(r.children);
    e.push(new Te(r.value, i));
  }
  return e.filter((r) => !n.has(r));
}
function gE(t) {
  return t.data || {};
}
function yE(t) {
  return t.resolve || {};
}
function vE(t, e, n, r, i, o) {
  return ie((s) =>
    fE(t, e, n, r, s.extractedUrl, i, o).pipe(
      F(({ state: a, tree: c }) =>
        J(_({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function wE(t, e) {
  return ie((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return A(n);
    let o = new Set(i.map((c) => c.route)),
      s = new Set();
    for (let c of o) if (!s.has(c)) for (let l of jp(c)) s.add(l);
    let a = 0;
    return te(s).pipe(
      Gt((c) =>
        o.has(c)
          ? DE(c, r, t, e)
          : ((c.data = dl(c, c.parent, t).resolve), A(void 0))
      ),
      ue(() => a++),
      Cn(1),
      ie((c) => (a === s.size ? A(n) : Ne))
    );
  });
}
function jp(t) {
  let e = t.children.map((n) => jp(n)).flat();
  return [t, ...e];
}
function DE(t, e, n, r) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Ap(i) && (o[Qr] = i.title),
    bE(o, t, e, r).pipe(
      F(
        (s) => (
          (t._resolvedData = s), (t.data = dl(t, t.parent, n).resolve), null
        )
      )
    )
  );
}
function bE(t, e, n, r) {
  let i = $c(t);
  if (i.length === 0) return A({});
  let o = {};
  return te(i).pipe(
    ie((s) =>
      _E(t[s], e, n, r).pipe(
        et(),
        ue((a) => {
          o[s] = a;
        })
      )
    ),
    Cn(1),
    $s(o),
    Ct((s) => (kp(s) ? Ne : _n(s)))
  );
}
function _E(t, e, n, r) {
  let i = Xr(e) ?? r,
    o = Xn(t, i),
    s = o.resolve ? o.resolve(e, n) : Nt(i, () => o(e, n));
  return Lt(s);
}
function jc(t) {
  return Re((e) => {
    let n = t(e);
    return n ? te(n).pipe(F(() => e)) : A(e);
  });
}
var Vp = (() => {
    let e = class e {
      buildTitle(r) {
        let i,
          o = r.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === P));
        return i;
      }
      getResolvedTitleForRoute(r) {
        return r.data[Qr];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => w(EE))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  EE = (() => {
    let e = class e extends Vp {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let i = this.buildTitle(r);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Pc));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  ei = new x("", { providedIn: "root", factory: () => ({}) }),
  ts = new x("ROUTES"),
  gl = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = w(xo));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return A(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Lt(r.loadComponent()).pipe(
            F($p),
            ue((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            or(() => {
              this.componentLoaders.delete(r);
            })
          ),
          o = new Dn(i, () => new me()).pipe(wn());
        return this.componentLoaders.set(r, o), o;
      }
      loadChildren(r, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return A({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = CE(i, this.compiler, r, this.onLoadEndListener).pipe(
            or(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new Dn(s, () => new me()).pipe(wn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function CE(t, e, n, r) {
  return Lt(t.loadChildren()).pipe(
    F($p),
    ie((i) =>
      i instanceof wr || Array.isArray(i) ? A(i) : te(e.compileModuleAsync(i))
    ),
    F((i) => {
      r && r(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(n).injector),
            (s = o.get(ts, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(pl), injector: o }
      );
    })
  );
}
function IE(t) {
  return t && typeof t == "object" && "default" in t;
}
function $p(t) {
  return IE(t) ? t.default : t;
}
var yl = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => w(SE))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  SE = (() => {
    let e = class e {
      shouldProcessUrl(r) {
        return !0;
      }
      extract(r) {
        return r;
      }
      merge(r, i) {
        return r;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Bp = new x(""),
  Up = new x("");
function TE(t, e, n) {
  let r = t.get(Up),
    i = t.get(ne);
  return t.get(U).runOutsideAngular(() => {
    if (!i.startViewTransition || r.skipNextTransition)
      return (r.skipNextTransition = !1), Promise.resolve();
    let o,
      s = new Promise((l) => {
        o = l;
      }),
      a = i.startViewTransition(() => (o(), ME(t))),
      { onViewTransitionCreated: c } = r;
    return c && Nt(t, () => c({ transition: a, from: e, to: n })), s;
  });
}
function ME(t) {
  return new Promise((e) => {
    hc(e, { injector: t });
  });
}
var vl = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new me()),
        (this.transitionAbortSubject = new me()),
        (this.configLoader = w(gl)),
        (this.environmentInjector = w(Ie)),
        (this.urlSerializer = w(Yr)),
        (this.rootContexts = w(Zr)),
        (this.location = w(Hn)),
        (this.inputBindingEnabled = w(rs, { optional: !0 }) !== null),
        (this.titleStrategy = w(Vp)),
        (this.options = w(ei, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = w(yl)),
        (this.createViewTransition = w(Bp, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => A(void 0)),
        (this.rootComponentType = null);
      let r = (o) => this.events.next(new Kc(o)),
        i = (o) => this.events.next(new Qc(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = r);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(r) {
      let i = ++this.navigationId;
      this.transitions?.next(J(_(_({}, this.transitions.value), r), { id: i }));
    }
    setupNavigations(r, i, o) {
      return (
        (this.transitions = new fe({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: Vr,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          be((s) => s.id !== 0),
          F((s) =>
            J(_({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          Re((s) => {
            this.currentTransition = s;
            let a = !1,
              c = !1;
            return A(s).pipe(
              ue((l) => {
                this.currentNavigation = {
                  id: l.id,
                  initialUrl: l.rawUrl,
                  extractedUrl: l.extractedUrl,
                  trigger: l.source,
                  extras: l.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? J(_({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              Re((l) => {
                let u =
                    !r.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = l.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                if (!u && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new kt(l.id, this.urlSerializer.serialize(l.rawUrl), f, 0)
                    ),
                    l.resolve(null),
                    Ne
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return A(l).pipe(
                    Re((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Yn(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? Ne
                          : Promise.resolve(f)
                      );
                    }),
                    vE(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      r.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    ue((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = J(
                          _({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new Ko(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  u &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: p,
                      restoredState: g,
                      extras: N,
                    } = l,
                    M = new Yn(f, this.urlSerializer.serialize(h), p, g);
                  this.events.next(M);
                  let V = Mp(h, this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      J(_({}, l), {
                        targetSnapshot: V,
                        urlAfterRedirects: h,
                        extras: J(_({}, N), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    A(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new kt(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        f,
                        1
                      )
                    ),
                    l.resolve(null),
                    Ne
                  );
                }
              }),
              ue((l) => {
                let u = new zc(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot
                );
                this.events.next(u);
              }),
              F(
                (l) => (
                  (this.currentTransition = s =
                    J(_({}, l), {
                      guards: F_(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              q_(this.environmentInjector, (l) => this.events.next(l)),
              ue((l) => {
                if (((s.guardsResult = l.guardsResult), Qn(l.guardsResult)))
                  throw Rp(this.urlSerializer, l.guardsResult);
                let u = new Wc(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(u);
              }),
              be((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, "", 3), !1)
              ),
              jc((l) => {
                if (l.guards.canActivateChecks.length)
                  return A(l).pipe(
                    ue((u) => {
                      let d = new qc(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    Re((u) => {
                      let d = !1;
                      return A(u).pipe(
                        wE(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        ue({
                          next: () => (d = !0),
                          complete: () => {
                            d || this.cancelNavigationTransition(u, "", 2);
                          },
                        })
                      );
                    }),
                    ue((u) => {
                      let d = new Gc(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              jc((l) => {
                let u = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        ue((h) => {
                          d.component = h;
                        }),
                        F(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...u(h));
                  return f;
                };
                return qt(u(l.targetSnapshot.root)).pipe(It(null), Be(1));
              }),
              jc(() => this.afterPreactivation()),
              Re(() => {
                let { currentSnapshot: l, targetSnapshot: u } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    u.root
                  );
                return d ? te(d).pipe(F(() => s)) : A(s);
              }),
              F((l) => {
                let u = M_(
                  r.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    J(_({}, l), { targetRouterState: u })),
                  (this.currentNavigation.targetRouterState = u),
                  s
                );
              }),
              ue(() => {
                this.events.next(new zr());
              }),
              k_(
                this.rootContexts,
                r.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              Be(1),
              ue({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new at(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      l.targetRouterState.snapshot
                    ),
                    l.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              ar(
                this.transitionAbortSubject.pipe(
                  ue((l) => {
                    throw l;
                  })
                )
              ),
              or(() => {
                if (!a && !c) {
                  let l = "";
                  this.cancelNavigationTransition(s, l, 1);
                }
                this.currentNavigation?.id === s.id &&
                  (this.currentNavigation = null);
              }),
              Ct((l) => {
                if (((c = !0), Pp(l)))
                  this.events.next(
                    new Pt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    N_(l) ? this.events.next(new Wr(l.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Hr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      l,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(r.errorHandler(l));
                  } catch (u) {
                    s.reject(u);
                  }
                }
                return Ne;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(r, i, o) {
      let s = new Pt(r.id, this.urlSerializer.serialize(r.extractedUrl), i, o);
      this.events.next(s), r.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function xE(t) {
  return t !== Vr;
}
var AE = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => w(NE))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  ul = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, n) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, n) {
      return e.routeConfig === n.routeConfig;
    }
  },
  NE = (() => {
    let e = class e extends ul {};
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = Ka(e)))(o || e);
      };
    })()),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Hp = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({
        token: e,
        factory: () => (() => w(RE))(),
        providedIn: "root",
      }));
    let t = e;
    return t;
  })(),
  RE = (() => {
    let e = class e extends Hp {
      constructor() {
        super(...arguments),
          (this.location = w(Hn)),
          (this.urlSerializer = w(Yr)),
          (this.options = w(ei, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = w(yl)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Ot()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Mp(this.currentUrlTree, null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && r(i.url, i.state);
        });
      }
      handleRouterEvent(r, i) {
        if (r instanceof Yn) this.stateMemento = this.createStateMemento();
        else if (r instanceof kt) this.rawUrlTree = i.initialUrl;
        else if (r instanceof Ko) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          r instanceof zr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : r instanceof Pt && (r.code === 3 || r.code === 2)
            ? this.restoreHistory(i)
            : r instanceof Hr
            ? this.restoreHistory(i, !0)
            : r instanceof at &&
              ((this.lastSuccessfulId = r.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, i) {
        let o = this.urlSerializer.serialize(r);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = _(_({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = _(
            _({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(r, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === r.finalUrl &&
              s === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(r), this.resetUrlToCurrentUrlTree());
      }
      resetState(r) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(r, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: r, ɵrouterPageId: i }
          : { navigationId: r };
      }
    };
    (e.ɵfac = (() => {
      let r;
      return function (o) {
        return (r || (r = Ka(e)))(o || e);
      };
    })()),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Lr = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(Lr || {});
function zp(t, e) {
  t.events
    .pipe(
      be(
        (n) =>
          n instanceof at ||
          n instanceof Pt ||
          n instanceof Hr ||
          n instanceof kt
      ),
      F((n) =>
        n instanceof at || n instanceof kt
          ? Lr.COMPLETE
          : (n instanceof Pt ? n.code === 0 || n.code === 1 : !1)
          ? Lr.REDIRECTING
          : Lr.FAILED
      ),
      be((n) => n !== Lr.REDIRECTING),
      Be(1)
    )
    .subscribe(() => {
      e();
    });
}
function OE(t) {
  throw t;
}
var PE = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  kE = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Ft = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = w(Mo)),
          (this.stateManager = w(Hp)),
          (this.options = w(ei, { optional: !0 }) || {}),
          (this.pendingTasks = w(Ao)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = w(vl)),
          (this.urlSerializer = w(Yr)),
          (this.location = w(Hn)),
          (this.urlHandlingStrategy = w(yl)),
          (this._events = new me()),
          (this.errorHandler = this.options.errorHandler || OE),
          (this.navigated = !1),
          (this.routeReuseStrategy = w(AE)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = w(ts, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!w(rs, { optional: !0 })),
          (this.eventsSubscription = new ee()),
          (this.isNgZoneEnabled = w(U) instanceof U && U.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Pt && i.code !== 0 && i.code !== 1)
              )
                this.navigated = !0;
              else if (i instanceof at) this.navigated = !0;
              else if (i instanceof Wr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  c = {
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || xE(o.source),
                  };
                this.scheduleNavigation(a, Vr, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            LE(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(r);
      }
      resetRootComponentType(r) {
        (this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Vr,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ||
          (this.nonRouterCurrentEntryChangeSubscription =
            this.stateManager.registerNonRouterCurrentEntryChangeListener(
              (r, i) => {
                setTimeout(() => {
                  this.navigateToSyncWithBrowser(r, "popstate", i);
                }, 0);
              }
            ));
      }
      navigateToSyncWithBrowser(r, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let l = _({}, o);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (s.state = l);
        }
        let c = this.parseUrl(r);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(r) {
        (this.config = r.map(pl)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(r, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: l,
          } = i,
          u = l ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case "merge":
            d = _(_({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = Cp(h);
        } catch {
          (typeof r[0] != "string" || !r[0].startsWith("/")) && (r = []),
            (f = this.currentUrlTree.root);
        }
        return Ip(f, r, d, u ?? null);
      }
      navigateByUrl(r, i = { skipLocationChange: !1 }) {
        let o = Qn(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, Vr, null, i);
      }
      navigate(r, i = { skipLocationChange: !1 }) {
        return FE(r), this.navigateByUrl(this.createUrlTree(r, i), i);
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r);
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(r, i) {
        let o;
        if (
          (i === !0 ? (o = _({}, PE)) : i === !1 ? (o = _({}, kE)) : (o = i),
          Qn(r))
        )
          return sp(this.currentUrlTree, r, o);
        let s = this.parseUrl(r);
        return sp(this.currentUrlTree, s, o);
      }
      removeEmptyProps(r) {
        return Object.keys(r).reduce((i, o) => {
          let s = r[o];
          return s != null && (i[o] = s), i;
        }, {});
      }
      scheduleNavigation(r, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((f, h) => {
              (c = f), (l = h);
            }));
        let d = this.pendingTasks.add();
        return (
          zp(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: s,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function FE(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new m(4008, !1);
}
function LE(t) {
  return !(t instanceof zr) && !(t instanceof Wr);
}
var Wp = (() => {
  let e = class e {
    constructor(r, i, o, s, a, c) {
      (this.router = r),
        (this.route = i),
        (this.tabIndexAttribute = o),
        (this.renderer = s),
        (this.el = a),
        (this.locationStrategy = c),
        (this.href = null),
        (this.commands = null),
        (this.onChanges = new me()),
        (this.preserveFragment = !1),
        (this.skipLocationChange = !1),
        (this.replaceUrl = !1);
      let l = a.nativeElement.tagName?.toLowerCase();
      (this.isAnchorElement = l === "a" || l === "area"),
        this.isAnchorElement
          ? (this.subscription = r.events.subscribe((u) => {
              u instanceof at && this.updateHref();
            }))
          : this.setTabIndexIfNotOnNativeEl("0");
    }
    setTabIndexIfNotOnNativeEl(r) {
      this.tabIndexAttribute != null ||
        this.isAnchorElement ||
        this.applyAttributeValue("tabindex", r);
    }
    ngOnChanges(r) {
      this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
    }
    set routerLink(r) {
      r != null
        ? ((this.commands = Array.isArray(r) ? r : [r]),
          this.setTabIndexIfNotOnNativeEl("0"))
        : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
    }
    onClick(r, i, o, s, a) {
      if (
        this.urlTree === null ||
        (this.isAnchorElement &&
          (r !== 0 ||
            i ||
            o ||
            s ||
            a ||
            (typeof this.target == "string" && this.target != "_self")))
      )
        return !0;
      let c = {
        skipLocationChange: this.skipLocationChange,
        replaceUrl: this.replaceUrl,
        state: this.state,
      };
      return this.router.navigateByUrl(this.urlTree, c), !this.isAnchorElement;
    }
    ngOnDestroy() {
      this.subscription?.unsubscribe();
    }
    updateHref() {
      this.href =
        this.urlTree !== null && this.locationStrategy
          ? this.locationStrategy?.prepareExternalUrl(
              this.router.serializeUrl(this.urlTree)
            )
          : null;
      let r =
        this.href === null
          ? null
          : sh(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
      this.applyAttributeValue("href", r);
    }
    applyAttributeValue(r, i) {
      let o = this.renderer,
        s = this.el.nativeElement;
      i !== null ? o.setAttribute(s, r, i) : o.removeAttribute(s, r);
    }
    get urlTree() {
      return this.commands === null
        ? null
        : this.router.createUrlTree(this.commands, {
            relativeTo:
              this.relativeTo !== void 0 ? this.relativeTo : this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: this.preserveFragment,
          });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(Se(Ft), Se(cn), vo("tabindex"), Se(Eo), Se(Ze), Se(wt));
  }),
    (e.ɵdir = tn({
      type: e,
      selectors: [["", "routerLink", ""]],
      hostVars: 1,
      hostBindings: function (i, o) {
        i & 1 &&
          Un("click", function (a) {
            return o.onClick(
              a.button,
              a.ctrlKey,
              a.shiftKey,
              a.altKey,
              a.metaKey
            );
          }),
          i & 2 && Bn("target", o.target);
      },
      inputs: {
        target: "target",
        queryParams: "queryParams",
        fragment: "fragment",
        queryParamsHandling: "queryParamsHandling",
        state: "state",
        relativeTo: "relativeTo",
        preserveFragment: ["preserveFragment", "preserveFragment", rn],
        skipLocationChange: ["skipLocationChange", "skipLocationChange", rn],
        replaceUrl: ["replaceUrl", "replaceUrl", rn],
        routerLink: "routerLink",
      },
      standalone: !0,
      features: [xr, Vn],
    }));
  let t = e;
  return t;
})();
var ns = class {};
var jE = (() => {
    let e = class e {
      constructor(r, i, o, s, a) {
        (this.router = r),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            be((r) => r instanceof at),
            Gt(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(r, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = To(s.providers, r, `Route: ${s.path}`));
          let a = s._injector ?? r,
            c = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(c, s.children ?? s._loadedRoutes));
        }
        return te(o).pipe(En());
      }
      preloadConfig(r, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(r, i))
            : (o = A(null));
          let s = o.pipe(
            ie((a) =>
              a === null
                ? A(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? r, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return te([s, a]).pipe(En());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Ft), y(xo), y(Ie), y(ns), y(gl));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  qp = new x(""),
  VE = (() => {
    let e = class e {
      constructor(r, i, o, s, a = {}) {
        (this.urlSerializer = r),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration =
            a.scrollPositionRestoration || "disabled"),
          (a.anchorScrolling = a.anchorScrolling || "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((r) => {
          r instanceof Yn
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = r.navigationTrigger),
              (this.restoredId = r.restoredState
                ? r.restoredState.navigationId
                : 0))
            : r instanceof at
            ? ((this.lastId = r.id),
              this.scheduleScrollEvent(
                r,
                this.urlSerializer.parse(r.urlAfterRedirects).fragment
              ))
            : r instanceof kt &&
              r.code === 0 &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                r,
                this.urlSerializer.parse(r.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((r) => {
          r instanceof Qo &&
            (r.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(r.position)
              : r.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(r.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(r, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new Qo(
                  r,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      dh();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function $E(t) {
  return t.routerState.root;
}
function ti(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function BE() {
  let t = w(Ye);
  return (e) => {
    let n = t.get(Rt);
    if (e !== n.components[0]) return;
    let r = t.get(Ft),
      i = t.get(Gp);
    t.get(wl) === 1 && r.initialNavigation(),
      t.get(Kp, null, k.Optional)?.setUpPreloading(),
      t.get(qp, null, k.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Gp = new x("", { factory: () => new me() }),
  wl = new x("", { providedIn: "root", factory: () => 1 });
function UE() {
  return ti(2, [
    { provide: wl, useValue: 0 },
    {
      provide: Oo,
      multi: !0,
      deps: [Ye],
      useFactory: (e) => {
        let n = e.get(Wh, Promise.resolve());
        return () =>
          n.then(
            () =>
              new Promise((r) => {
                let i = e.get(Ft),
                  o = e.get(Gp);
                zp(i, () => {
                  r(!0);
                }),
                  (e.get(vl).afterPreactivation = () => (
                    r(!0), o.closed ? A(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function HE() {
  return ti(3, [
    {
      provide: Oo,
      multi: !0,
      useFactory: () => {
        let e = w(Ft);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: wl, useValue: 2 },
  ]);
}
var Kp = new x("");
function zE(t) {
  return ti(0, [
    { provide: Kp, useExisting: jE },
    { provide: ns, useExisting: t },
  ]);
}
function WE() {
  return ti(8, [up, { provide: rs, useExisting: up }]);
}
function qE(t) {
  let e = [
    { provide: Bp, useValue: TE },
    {
      provide: Up,
      useValue: _({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return ti(9, e);
}
var fp = new x("ROUTER_FORROOT_GUARD"),
  GE = [
    Hn,
    { provide: Yr, useClass: Br },
    Ft,
    Zr,
    { provide: cn, useFactory: $E, deps: [Ft] },
    gl,
    [],
  ],
  Dl = (() => {
    let e = class e {
      constructor(r) {}
      static forRoot(r, i) {
        return {
          ngModule: e,
          providers: [
            GE,
            [],
            { provide: ts, multi: !0, useValue: r },
            { provide: fp, useFactory: ZE, deps: [[Ft, new Ya(), new Lf()]] },
            { provide: ei, useValue: i || {} },
            i?.useHash ? QE() : YE(),
            KE(),
            i?.preloadingStrategy ? zE(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? XE(i) : [],
            i?.bindToComponentInputs ? WE().ɵproviders : [],
            i?.enableViewTransitions ? qE().ɵproviders : [],
            JE(),
          ],
        };
      }
      static forChild(r) {
        return {
          ngModule: e,
          providers: [{ provide: ts, multi: !0, useValue: r }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(fp, 8));
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({}));
    let t = e;
    return t;
  })();
function KE() {
  return {
    provide: qp,
    useFactory: () => {
      let t = w(Zh),
        e = w(U),
        n = w(ei),
        r = w(vl),
        i = w(Yr);
      return (
        n.scrollOffset && t.setOffset(n.scrollOffset), new VE(i, r, t, e, n)
      );
    },
  };
}
function QE() {
  return { provide: wt, useClass: Gh };
}
function YE() {
  return { provide: wt, useClass: Ec };
}
function ZE(t) {
  return "guarded";
}
function XE(t) {
  return [
    t.initialNavigation === "disabled" ? HE().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? UE().ɵproviders : [],
  ];
}
var hp = new x("");
function JE() {
  return [
    { provide: hp, useFactory: BE },
    { provide: gc, multi: !0, useExisting: hp },
  ];
}
var Yp = (() => {
  let e = class e {
    getLightGradient() {
      let r = ["#c7dbf7", "#bfc7de", "#c59594"];
      return `linear-gradient(to bottom, ${r[0]}, ${r[1]}, ${r[2]})`;
    }
    getDarkGradient() {
      let r = ["#756AB6", "#AC87C5", "#E0AED0"];
      return `linear-gradient(to bottom, ${r[0]}, ${r[1]}, ${r[2]})`;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Zp = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-animations"]],
      decls: 39,
      vars: 0,
      consts: [
        [
          "width",
          "64",
          "height",
          "64",
          "viewBox",
          "0 0 64 64",
          "fill",
          "none",
          "xmlns",
          "http://www.w3.org/2000/svg",
        ],
        ["id", "study"],
        ["width", "64", "height", "64"],
        ["id", "smoke"],
        [
          "id",
          "smoke-2",
          "d",
          "M9 21L9.55279 19.8944C9.83431 19.3314 9.83431 18.6686 9.55279 18.1056L9 17L8.44721 15.8944C8.16569 15.3314 8.16569 14.6686 8.44721 14.1056L9 13",
          "stroke",
          "#797270",
        ],
        [
          "id",
          "smoke-1",
          "d",
          "M6.5 22L7.05279 20.8944C7.33431 20.3314 7.33431 19.6686 7.05279 19.1056L6.5 18L5.94721 16.8944C5.66569 16.3314 5.66569 15.6686 5.94721 15.1056L6.5 14",
          "stroke",
          "#797270",
        ],
        ["id", "laptop"],
        [
          "id",
          "laptop-base",
          "x",
          "17",
          "y",
          "28",
          "width",
          "20",
          "height",
          "3",
          "fill",
          "#F3F3F3",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "laptop-screen",
          "x",
          "18",
          "y",
          "17",
          "width",
          "18",
          "height",
          "11",
          "fill",
          "#5A524E",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "line-1",
          "x",
          "20",
          "y",
          "19",
          "width",
          "14",
          "height",
          "1",
          "fill",
          "#F78764",
        ],
        [
          "id",
          "line-2",
          "x",
          "20",
          "y",
          "21",
          "width",
          "14",
          "height",
          "1",
          "fill",
          "#F9AB82",
        ],
        [
          "id",
          "line-3",
          "x",
          "20",
          "y",
          "23",
          "width",
          "14",
          "height",
          "1",
          "fill",
          "#F78764",
        ],
        [
          "id",
          "line-4",
          "x",
          "20",
          "y",
          "25",
          "width",
          "14",
          "height",
          "1",
          "fill",
          "#F9AB82",
        ],
        ["id", "cup"],
        [
          "id",
          "Rectangle 978",
          "x",
          "5",
          "y",
          "24",
          "width",
          "5",
          "height",
          "7",
          "fill",
          "#CCC4C4",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Ellipse 416",
          "d",
          "M11 28C12.1046 28 13 27.1046 13 26C13 24.8954 12.1046 24 11 24",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 996",
          "x",
          "6",
          "y",
          "25",
          "width",
          "3",
          "height",
          "1",
          "fill",
          "#D6D2D1",
        ],
        ["id", "books"],
        [
          "id",
          "Rectangle 984",
          "x",
          "58",
          "y",
          "27",
          "width",
          "4",
          "height",
          "14",
          "transform",
          "rotate(90 58 27)",
          "fill",
          "#B16B4F",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 985",
          "x",
          "56",
          "y",
          "23",
          "width",
          "4",
          "height",
          "14",
          "transform",
          "rotate(90 56 23)",
          "fill",
          "#797270",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 986",
          "x",
          "60",
          "y",
          "19",
          "width",
          "4",
          "height",
          "14",
          "transform",
          "rotate(90 60 19)",
          "fill",
          "#F78764",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 993",
          "x",
          "47",
          "y",
          "20",
          "width",
          "12",
          "height",
          "1",
          "fill",
          "#F9AB82",
        ],
        [
          "id",
          "Rectangle 994",
          "x",
          "43",
          "y",
          "24",
          "width",
          "12",
          "height",
          "1",
          "fill",
          "#54504E",
        ],
        [
          "id",
          "Rectangle 995",
          "x",
          "45",
          "y",
          "28",
          "width",
          "12",
          "height",
          "1",
          "fill",
          "#804D39",
        ],
        ["id", "desk"],
        [
          "id",
          "Rectangle 973",
          "x",
          "4",
          "y",
          "31",
          "width",
          "56",
          "height",
          "5",
          "fill",
          "#797270",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 987",
          "x",
          "10",
          "y",
          "36",
          "width",
          "30",
          "height",
          "6",
          "fill",
          "#797270",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 975",
          "x",
          "6",
          "y",
          "36",
          "width",
          "4",
          "height",
          "24",
          "fill",
          "#797270",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 974",
          "x",
          "40",
          "y",
          "36",
          "width",
          "18",
          "height",
          "24",
          "fill",
          "#797270",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Line 129",
          "x1",
          "40",
          "y1",
          "48",
          "x2",
          "58",
          "y2",
          "48",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Line 130",
          "x1",
          "22",
          "y1",
          "39",
          "x2",
          "28",
          "y2",
          "39",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Line 142",
          "x1",
          "46",
          "y1",
          "42",
          "x2",
          "52",
          "y2",
          "42",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Line 131",
          "x1",
          "46",
          "y1",
          "54",
          "x2",
          "52",
          "y2",
          "54",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
        [
          "id",
          "Rectangle 988",
          "x",
          "11",
          "y",
          "37",
          "width",
          "28",
          "height",
          "1",
          "fill",
          "#54504E",
        ],
        [
          "id",
          "Rectangle 992",
          "x",
          "5",
          "y",
          "32",
          "width",
          "54",
          "height",
          "1",
          "fill",
          "#9E9492",
        ],
        [
          "id",
          "Rectangle 989",
          "x",
          "7",
          "y",
          "37",
          "width",
          "2",
          "height",
          "1",
          "fill",
          "#54504E",
        ],
        [
          "id",
          "Rectangle 990",
          "x",
          "41",
          "y",
          "37",
          "width",
          "16",
          "height",
          "1",
          "fill",
          "#54504E",
        ],
        [
          "id",
          "Rectangle 991",
          "x",
          "41",
          "y",
          "49",
          "width",
          "16",
          "height",
          "1",
          "fill",
          "#54504E",
        ],
        [
          "id",
          "Line 143",
          "y1",
          "60",
          "x2",
          "64",
          "y2",
          "60",
          "stroke",
          "#453F3C",
          "stroke-width",
          "2",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (wf(),
          D(0, "svg", 0)(1, "g", 1),
          C(2, "rect", 2),
          D(3, "g", 3),
          C(4, "path", 4)(5, "path", 5),
          v(),
          D(6, "g", 6),
          C(7, "rect", 7)(8, "rect", 8)(9, "rect", 9)(10, "rect", 10)(
            11,
            "rect",
            11
          )(12, "rect", 12),
          v(),
          D(13, "g", 13),
          C(14, "rect", 14)(15, "path", 15)(16, "rect", 16),
          v(),
          D(17, "g", 17),
          C(18, "rect", 18)(19, "rect", 19)(20, "rect", 20)(21, "rect", 21)(
            22,
            "rect",
            22
          )(23, "rect", 23),
          v(),
          D(24, "g", 24),
          C(25, "rect", 25)(26, "rect", 26)(27, "rect", 27)(28, "rect", 28)(
            29,
            "line",
            29
          )(30, "line", 30)(31, "line", 31)(32, "line", 32)(33, "rect", 33)(
            34,
            "rect",
            34
          )(35, "rect", 35)(36, "rect", 36)(37, "rect", 37)(38, "line", 38),
          v()()());
      },
      styles: [
        "svg[_ngcontent-%COMP%]{width:300px;height:300px;margin-left:15%;margin-top:5%}#smoke-1[_ngcontent-%COMP%]{stroke-dasharray:0,10;animation:_ngcontent-%COMP%_smoke 6s ease infinite}#smoke-2[_ngcontent-%COMP%]{stroke-dasharray:0,10;animation:_ngcontent-%COMP%_smoke 6s .5s ease infinite}@keyframes _ngcontent-%COMP%_smoke{0%{stroke-dasharray:0,10}50%{stroke-dasharray:10,0}to{stroke-dasharray:10,0;opacity:0}}#line-1[_ngcontent-%COMP%]{opacity:0;animation:_ngcontent-%COMP%_writing 5s linear forwards infinite}#line-2[_ngcontent-%COMP%]{opacity:0;animation:_ngcontent-%COMP%_writing 8s 1s linear forwards infinite}#line-3[_ngcontent-%COMP%]{opacity:0;animation:_ngcontent-%COMP%_writing 12s 1.5s linear infinite}#line-4[_ngcontent-%COMP%]{opacity:0;animation:_ngcontent-%COMP%_writing 4s 2s linear forwards infinite}@keyframes _ngcontent-%COMP%_writing{0%{width:0px;opacity:1}to{width:14px;opacity:1}}",
      ],
    }));
  let t = e;
  return t;
})();
var Xp = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-hello-animation"]],
      decls: 10,
      vars: 0,
      consts: [
        [1, "wrapper"],
        [1, "wrapper__text"],
        [1, "text"],
        [1, "text", "text--highlight", "animate-delay-3"],
        [1, "text", "text--highlight", "animate-delay-6"],
      ],
      template: function (i, o) {
        i & 1 &&
          (D(0, "div", 0)(1, "div", 1)(2, "h2", 2),
          I(3, "Hello."),
          v()(),
          D(4, "div", 1)(5, "h2", 3),
          I(6, "I am"),
          v()(),
          D(7, "div", 1)(8, "h2", 4),
          I(9, "Laxmikant"),
          v()()());
      },
      styles: [
        "body[_ngcontent-%COMP%]{background-color:#0c2231;height:100vh;display:flex;align-items:center;justify-content:center;position:relative;margin:0}.wrapper[_ngcontent-%COMP%]{position:relative;padding-bottom:200px;padding-top:100px;height:100%}.wrapper__text[_ngcontent-%COMP%]{display:flex;line-height:1.2;overflow:hidden;align-items:center}.text[_ngcontent-%COMP%]{font-family:Exo,sans-serif;color:#242424;text-transform:uppercase;font-size:11vmin;letter-spacing:5px;margin:0;animation:_ngcontent-%COMP%_animate 1s cubic-bezier(.2,.6,.2,1);animation-fill-mode:backwards}.text--highlight[_ngcontent-%COMP%]{color:#002395}.animate-delay-3[_ngcontent-%COMP%]{animation-delay:.8s}.animate-delay-6[_ngcontent-%COMP%]{animation-delay:1.6s}@keyframes _ngcontent-%COMP%_animate{0%{opacity:0;transform:translateY(30vh)}to{opacity:1;transform:translateY(0)}}",
      ],
    }));
  let t = e;
  return t;
})();
var Jp = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-comp1"]],
      decls: 0,
      vars: 0,
      template: function (i, o) {},
    }));
  let t = e;
  return t;
})();
var em = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-projects-grid"]],
      decls: 142,
      vars: 0,
      consts: [
        [1, "main"],
        [1, "container", "margs"],
        [1, "cards"],
        [1, "cards_item"],
        [1, "card"],
        [1, "card_image"],
        ["src", "https://picsum.photos/500/300/?image=10"],
        [1, "card_content"],
        [1, "card_title"],
        [1, "card_text"],
        ["src", "https://picsum.photos/500/300/?image=5"],
        ["src", "https://picsum.photos/500/300/?image=17"],
        [1, "btn", "card_btn"],
        ["src", "https://picsum.photos/500/300/?image=2"],
        ["src", "https://picsum.photos/500/300/?image=11"],
        ["src", "https://picsum.photos/500/300/?image=14"],
      ],
      template: function (i, o) {
        i & 1 &&
          (D(0, "div", 0)(1, "div", 1)(2, "h1"),
          I(3, "Internships"),
          v(),
          D(4, "ul", 2)(5, "li", 3)(6, "div", 4)(7, "div", 5),
          C(8, "img", 6),
          v(),
          D(9, "div", 7)(10, "h2", 8),
          I(11, " Coditas Solutions LLP "),
          C(12, "br"),
          I(13, "Apr 2021- Jul 2021 "),
          v(),
          C(14, "br"),
          D(15, "p", 9),
          I(
            16,
            " Engaged in crafting a resilient web application module, highlighting expertise in Angular to facilitate smooth and user-friendly interactions. "
          ),
          C(17, "br"),
          I(
            18,
            " Orchestrated the execution of thorough CRUD (Create, Read, Update, Delete) operations for a blog application. "
          ),
          C(19, "br"),
          I(
            20,
            " Streamlined communication between the front-end and Firebase backend through a RESTful API, leading to a 25% reduction in latency. Managed and stored user data efficiently using a NoSQL document database, resulting in a 15% improvement in data retrieval speed. "
          ),
          C(21, "br"),
          v()()()(),
          D(22, "li", 3)(23, "div", 4)(24, "div", 5),
          C(25, "img", 10),
          v(),
          D(26, "div", 7)(27, "h2", 8),
          I(28, " Fitverse "),
          C(29, "br"),
          I(30, "Jul 2021 \u2013 Aug 2021 "),
          C(31, "br")(32, "br"),
          v(),
          D(33, "p", 9),
          I(
            34,
            " Designed and implemented a robust web application utilizing Angular, focusing on gathering visitor data encompassing demographics and business-related information. Additionally, established connections with two clients to enhance the platform's functionality. "
          ),
          C(35, "br"),
          I(
            36,
            " Applied data analysis techniques to scrutinize 1,100 data points, resulting in an impressive 300% increase in operational reach. This strategic use of data contributed significantly to the expanded effectiveness and reach of the web application. "
          ),
          C(37, "br"),
          v()()()(),
          C(38, "li", 3),
          v()(),
          D(39, "div", 1)(40, "h1"),
          I(41, "Projects"),
          v(),
          D(42, "ul", 2)(43, "li", 3)(44, "div", 4)(45, "div", 5),
          C(46, "img", 11),
          v(),
          D(47, "div", 7)(48, "h2", 8),
          I(49, "Card Grid Layout"),
          v(),
          D(50, "p", 9),
          I(
            51,
            " Demo of pixel perfect pure CSS simple responsive card grid layout "
          ),
          v(),
          D(52, "button", 12),
          I(53, "Read More"),
          v()()()(),
          D(54, "li", 3)(55, "div", 4)(56, "div", 5),
          C(57, "img", 13),
          v(),
          D(58, "div", 7)(59, "h2", 8),
          I(60, "Card Grid Layout"),
          v(),
          D(61, "p", 9),
          I(
            62,
            " Demo of pixel perfect pure CSS simple responsive card grid layout "
          ),
          v(),
          D(63, "button", 12),
          I(64, "Read More"),
          v()()()(),
          D(65, "li", 3)(66, "div", 4)(67, "div", 5),
          C(68, "img", 6),
          v(),
          D(69, "div", 7)(70, "h2", 8),
          I(71, " Math Exam Processing with Computer Vision "),
          C(72, "br"),
          I(73, "Jan 2023 \u2013 Apr 2023 "),
          v(),
          C(74, "br"),
          D(75, "p", 9),
          I(
            76,
            " Developed a robust and efficient system to handle the extraction and pre-processing of images containing handwritten math exam answer sheets from students in 4th and 5th grades. This involved working with a substantial dataset, consisting of 3,300 labeled images and 14,000 unlabeled images. "
          ),
          C(77, "br"),
          I(
            78,
            " In order to enhance the understanding of the data, a sophisticated coordinate mapping approach was employed across nine specific sections. This technique allowed for the generation of distinct features and effective segmentation of the data, contributing to a more granular analysis. "
          ),
          C(79, "br"),
          I(
            80,
            " Advanced image recognition techniques were implemented to ensure accurate labeling of the data, facilitating the identification and categorization of relevant information within the images. "
          ),
          C(81, "br"),
          I(
            82,
            " The entire process was designed for streamlined efficiency, encompassing both labeled and unlabeled image data. Information from over 50 image areas was systematically consolidated, promoting efficient and thorough analysis of the data. This meticulous approach aimed to provide a comprehensive and detailed understanding of the content within the handwritten math exam answer sheets, thereby contributing to the overall success of the image processing pipeline. "
          ),
          v(),
          D(83, "button", 12),
          I(84, "Read More"),
          v()()()(),
          D(85, "li", 3)(86, "div", 4)(87, "div", 5),
          C(88, "img", 10),
          v(),
          D(89, "div", 7)(90, "h2", 8),
          I(91, " Twitch Social Network Analysis "),
          C(92, "br"),
          I(93, "Jan 2023 \u2013 Apr 2023 "),
          C(94, "br")(95, "br"),
          v(),
          D(96, "p", 9),
          I(
            97,
            " In this project, an extensive examination was undertaken to analyze the structural intricacies of a social network dataset comprising 170,000 nodes, specifically sourced from Twitch users. The primary objective was to categorize and cluster platform users into distinct groups, allowing for a detailed investigation into the inherent characteristics of the data. "
          ),
          C(98, "br"),
          I(
            99,
            " One significant outcome of this analysis was the improvement in predicting links between users, which in turn facilitated more proactive and accurate user recommendations within the Twitch community. "
          ),
          C(100, "br"),
          I(
            101,
            " The methodology employed advanced techniques such as DeepWalk and Node2Vec algorithms, leveraging them to generate graph embeddings for the vast network encompassing 7 million edges. These graph embeddings, serving as multidimensional representations of the network's structure, were subsequently utilized in training Graphical Neural Networks. This sophisticated approach proved instrumental in predicting user lifetime and determining affiliate status on the Twitch platform. By employing these cutting-edge algorithms and methodologies, the project aimed to provide valuable insights into user interactions, preferences, and long-term engagement patterns within the Twitch social network. "
          ),
          v(),
          D(102, "button", 12),
          I(103, "Read More"),
          v()()()(),
          D(104, "li", 3)(105, "div", 4)(106, "div", 5),
          C(107, "img", 14),
          v(),
          D(108, "div", 7)(109, "h2", 8),
          I(110, " Customer Segmentation "),
          C(111, "br"),
          I(112, "Jan 2022 \u2013 May 2022 "),
          C(113, "br")(114, "br"),
          v(),
          D(115, "p", 9),
          I(
            116,
            " Constructed a sophisticated model aimed at predicting customer value by leveraging comprehensive retail data covering an extensive 8-year timeframe, with a primary focus on historical transactional information. "
          ),
          C(117, "br"),
          I(
            118,
            " To ensure data accuracy and reliability, applied programming techniques involving the Interquartile Range (IQR) to effectively eliminate skewed data, specifically targeting the extremes by excluding the bottom and top 5%. The identification of clustering tendencies was carried out through the utilization of statistical measures, such as the Hopkins statistic, coupled with Silhouette analysis, ultimately revealing the presence of 4 distinctive customer clusters. "
          ),
          C(119, "br"),
          I(
            120,
            " For further refinement and classification, the Recency-Frequency-Monetary (RFM) values were transformed, paving the way for the implementation of a K-Nearest Neighbors (K-NN) model. This model demonstrated a commendable 78 percent accuracy rate, proving instrumental in gauging customer lifetime value (LTV) over varying time horizons, specifically for 6, 12, and 24 months. The integration of these advanced analytics techniques not only provided valuable insights into customer behavior but also empowered more informed decision-making within the retail context. "
          ),
          v(),
          D(121, "button", 12),
          I(122, "Read More"),
          v()()()(),
          D(123, "li", 3)(124, "div", 4)(125, "div", 5),
          C(126, "img", 15),
          v(),
          D(127, "div", 7)(128, "h2", 8),
          I(129, " Breast Cancer Risk Analysis "),
          C(130, "br"),
          I(131, "Jan 2021 \u2013 Nov 2021 "),
          C(132, "br"),
          v(),
          D(133, "p", 9),
          C(134, "br"),
          I(
            135,
            " Conducted a thorough analysis of patient breast cancer data with the goal of predicting future risk, resulting in the development of an Artificial Neural Network model with an impressive 85% accuracy. This model was benchmarked against various other machine learning algorithms such as logistic regression, K-NN, SVM, decision trees, and random forests. "
          ),
          C(136, "br"),
          I(
            137,
            " Implemented the Django REST API framework to seamlessly integrate the developed model with the user interface, enhancing accessibility and usability for end-users. "
          ),
          C(138, "br"),
          I(
            139,
            " Furthermore, the research efforts led to the participation in the ICICA\u201921 Conference in November 2021 and subsequent publication in a special edition of the IJNJC (International Journal of Networked and Collaborative Computing) journal. This acknowledgment underscores the significance and recognition of the research findings within the academic and scientific community. "
          ),
          v(),
          D(140, "button", 12),
          I(141, "Read More"),
          v()()()()()()());
      },
      styles: [
        '@import"https://fonts.googleapis.com/css?family=Quicksand:400,700";*[_ngcontent-%COMP%], *[_ngcontent-%COMP%]:before, *[_ngcontent-%COMP%]:after{box-sizing:border-box}.main[_ngcontent-%COMP%]{max-width:1200px;margin:0}.margs[_ngcontent-%COMP%]{margin-top:2%;margin-bottom:2%}h1[_ngcontent-%COMP%]{font-size:50px;font-weight:400;text-align:center}p[_ngcontent-%COMP%]{text-align:left}img[_ngcontent-%COMP%]{height:auto;max-width:100%;vertical-align:middle}.btn[_ngcontent-%COMP%]{color:#fff;padding:1rem;font-size:14px;text-transform:uppercase;border-radius:4px;font-weight:400;display:block;width:100%;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:transparent;transition:background-color .3s ease}.btn[_ngcontent-%COMP%]:hover{background-color:#ffffff1f}.cards[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;justify-content:space-between;list-style:none;margin:0;padding:0}.cards_item[_ngcontent-%COMP%]{display:flex;padding:1rem;width:100%}@media (min-width: 40rem){.cards_item[_ngcontent-%COMP%]{width:50%}}@media (min-width: 56rem){.cards_item[_ngcontent-%COMP%]{width:33.3333%}}.card[_ngcontent-%COMP%]{background-color:#fff;border-radius:.25rem;box-shadow:0 20px 40px -14px #00000040;display:flex;flex-direction:column;overflow:hidden;transition:transform .3s ease}.card[_ngcontent-%COMP%]:hover{transform:scale(1.05)}.card_content[_ngcontent-%COMP%]{flex:1;padding:15px;background:linear-gradient(to bottom left,#ef8d9c 40%,#ffc39e 100%)}.card_title[_ngcontent-%COMP%]{color:#fff;font-size:1.1rem;font-weight:700;letter-spacing:1px;text-transform:capitalize;margin:0}.card_text[_ngcontent-%COMP%]{color:#fff;font-size:.875rem;line-height:1.5;margin-bottom:1.25rem;font-weight:400}.made_by[_ngcontent-%COMP%]{font-weight:400;font-size:13px;margin-top:35px;text-align:center}',
      ],
    }));
  let t = e;
  return t;
})();
var tm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-skills"]],
      decls: 0,
      vars: 0,
      template: function (i, o) {},
      styles: [
        ".icon[_ngcontent-%COMP%]{width:50px}ul[_ngcontent-%COMP%]{list-style:none;padding:auto;margin:auto}li[_ngcontent-%COMP%]{display:inline-block;padding-right:5px;padding-left:5px;margin-bottom:10px}",
      ],
    }));
  let t = e;
  return t;
})();
var bl = (() => {
  let e = class e {
    constructor(r) {
      (this.gradientService = r), (this.isLightTheme = !0);
    }
    ngOnInit() {
      this.updateGradient();
    }
    updateGradient() {
      this.isLightTheme
        ? (this.gradientStyle = this.gradientService.getLightGradient())
        : (this.gradientStyle = this.gradientService.getDarkGradient());
    }
    toggleTheme() {
      (this.isLightTheme = !this.isLightTheme), this.updateGradient();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(Se(Yp));
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-home"]],
      decls: 44,
      vars: 2,
      consts: [
        [1, "custom-global"],
        [1, "navbar", "navbar-expand-lg"],
        [
          1,
          "container",
          "d-flex",
          "justify-content-between",
          "align-items-center",
        ],
        ["href", "#", 1, "navbar-brand"],
        [
          "src",
          "../../assets/images/signature.png",
          "alt",
          "logo",
          "width",
          "250",
        ],
        [1, "position-relative"],
        [1, "navbar-nav"],
        [1, "nav-item"],
        ["routerLink", "/home", 1, "nav-link"],
        ["routerLink", "/services", 1, "nav-link"],
        ["routerLink", "/portfolio", 1, "nav-link"],
        ["routerLink", "/contact", 1, "nav-link"],
        [1, "btn", "btn-light", 3, "click"],
        [1, "container"],
        [1, "row"],
        [1, "col-md-12"],
        [2, "height", "100vh"],
        [1, "container", "tagline"],
        [1, "d-flex", "p-2", "m-4", "justify-content-center"],
        [1, "col-md-7"],
        [2, "padding", "20px"],
        [1, "col-md-5"],
      ],
      template: function (i, o) {
        i & 1 &&
          (D(0, "div", 0)(1, "nav", 1)(2, "div", 2)(3, "a", 3),
          C(4, "img", 4),
          v(),
          D(5, "div", 5)(6, "ul", 6)(7, "li", 7)(8, "a", 8),
          I(9, "Home"),
          v()(),
          D(10, "li", 7)(11, "a", 9),
          I(12, "About"),
          v()(),
          D(13, "li", 7)(14, "a", 10),
          I(15, "Portfolio"),
          v()(),
          D(16, "li", 7)(17, "a", 11),
          I(18, "Contact"),
          v()()()(),
          D(19, "button", 12),
          Un("click", function () {
            return o.toggleTheme();
          }),
          I(20, " Toggle Theme "),
          v()()(),
          D(21, "div", 13)(22, "div", 14)(23, "div", 15)(24, "div", 16),
          C(25, "app-hello-animation"),
          v()(),
          C(26, "app-comp1"),
          v()(),
          D(27, "div", 17)(28, "div", 18),
          I(
            29,
            " I want to create empowering insights, harness the power of Data-driven Informed decisions! "
          ),
          v()(),
          D(30, "div", 13)(31, "div", 14)(32, "div", 19)(33, "div", 20)(
            34,
            "h1"
          ),
          I(35, "About Me"),
          v(),
          D(36, "p"),
          I(
            37,
            " I am a Data Scientist with a passion for transforming raw data into actionable insights. With a robust background in data science, I bring a range of experience in leveraging cutting-edge technologies and analytical methodologies to unravel the stories hidden within datasets. Proficient in SQL, Python, Data Visualization, Machine Learning and a host of data science tools, I thrive on the challenge of solving complex problems and extracting meaningful patterns from seemingly chaotic information. Whether it's building predictive models, crafting data-driven strategies, or diving into the intricacies of machine learning, my journey in the world of data is a testament to a relentless pursuit of knowledge and a commitment to turning data into decisions. Explore with me as we navigate the vast landscape of data science together! "
          ),
          v()()(),
          D(38, "div", 21),
          C(39, "app-animations"),
          v()()(),
          C(40, "app-skills"),
          D(41, "div", 13)(42, "div", 15),
          C(43, "app-projects-grid"),
          v()()()),
          i & 2 && Io("background", o.gradientStyle);
      },
      dependencies: [Wp, Zp, Xp, Jp, em, tm],
      styles: [
        ".header[_ngcontent-%COMP%]{padding:50px 0;text-align:center}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:3em}.intro[_ngcontent-%COMP%]{padding:50px 0;text-align:center}.skills[_ngcontent-%COMP%], .projects[_ngcontent-%COMP%]{padding:50px 0}.contact[_ngcontent-%COMP%]{padding:50px 0;text-align:center}.footer[_ngcontent-%COMP%]{padding:20px 0;text-align:center}h1[_ngcontent-%COMP%]{font-weight:400}p[_ngcontent-%COMP%]{text-align:justify}.tagline[_ngcontent-%COMP%]{font-family:Quicksand,sans-serif;font-size:larger;margin-bottom:5%}.custom-global[_ngcontent-%COMP%]{font-family:Quicksand,sans-serif}",
      ],
    }));
  let t = e;
  return t;
})();
var s0 = [
    { path: "home", component: bl },
    { path: "", component: bl },
  ],
  nm = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({ imports: [Dl.forRoot(s0), Dl] }));
    let t = e;
    return t;
  })();
var rm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-footer"]],
      decls: 28,
      vars: 0,
      consts: [
        [1, "footer"],
        [1, "waves"],
        ["id", "wave1", 1, "wave"],
        ["id", "wave2", 1, "wave"],
        ["id", "wave3", 1, "wave"],
        ["id", "wave4", 1, "wave"],
        [1, "social-icon"],
        [1, "social-icon__item"],
        ["href", "#", 1, "social-icon__link"],
        [
          "src",
          "./logo-linkedin.svg",
          "alt",
          "linkedin",
          "width",
          "36",
        ],
        [
          "src",
          "./logo-github.svg",
          "alt",
          "github",
          "width",
          "36",
        ],
        [
          "src",
          "./mail-open-outline.svg",
          "alt",
          "mail-to",
          "width",
          "36",
        ],
        [1, "menu"],
        [1, "menu__item"],
        ["href", "#", 1, "menu__link"],
      ],
      template: function (i, o) {
        i & 1 &&
          (D(0, "footer", 0)(1, "div", 1),
          C(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5),
          v(),
          D(6, "ul", 6)(7, "li", 7)(8, "a", 8),
          C(9, "img", 9),
          v()(),
          D(10, "li", 7)(11, "a", 8),
          C(12, "img", 10),
          v()(),
          D(13, "li", 7)(14, "a", 8),
          C(15, "img", 11),
          v()()(),
          D(16, "ul", 12)(17, "li", 13)(18, "a", 14),
          I(19, "Home"),
          v()(),
          D(20, "li", 13)(21, "a", 14),
          I(22, "About"),
          v()(),
          D(23, "li", 13)(24, "a", 14),
          I(25, "Contact"),
          v()()(),
          D(26, "p"),
          I(27, "\xA92023 Laxmikant Kabra"),
          v()());
      },
      styles: [
        '@import"https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap";*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif}body[_ngcontent-%COMP%]{display:flex;background:#333;justify-content:flex-end;align-items:flex-end;min-height:100vh}.footer[_ngcontent-%COMP%]{position:relative;width:100%;background:#3586ff;min-height:100px;padding:20px 50px;display:flex;justify-content:center;align-items:center;flex-direction:column}.social-icon[_ngcontent-%COMP%], .menu[_ngcontent-%COMP%]{position:relative;display:flex;justify-content:center;align-items:center;margin:10px 0;flex-wrap:wrap}.social-icon__item[_ngcontent-%COMP%], .menu__item[_ngcontent-%COMP%]{list-style:none}.social-icon__link[_ngcontent-%COMP%]{font-size:2rem;color:#fff;margin:0 10px;display:inline-block;transition:.5s}.social-icon__link[_ngcontent-%COMP%]:hover{transform:translateY(-10px)}.menu__link[_ngcontent-%COMP%]{font-size:1.2rem;color:#fff;margin:0 10px;display:inline-block;transition:.5s;text-decoration:none;opacity:.75;font-weight:300}.menu__link[_ngcontent-%COMP%]:hover{opacity:1}.footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:#fff;margin:15px 0 10px;font-size:1rem;font-weight:300}.wave[_ngcontent-%COMP%]{position:absolute;top:-100px;left:0;width:100%;height:100px;background:url(https://i.ibb.co/wQZVxxk/wave.png);background-size:1000px 100px}.wave#wave1[_ngcontent-%COMP%]{z-index:1000;opacity:1;bottom:0;animation:_ngcontent-%COMP%_animateWaves 4s linear infinite}.wave#wave2[_ngcontent-%COMP%]{z-index:999;opacity:.5;bottom:10px;animation:_ngcontent-%COMP%_animate 4s linear infinite!important}.wave#wave3[_ngcontent-%COMP%]{z-index:1000;opacity:.2;bottom:15px;animation:_ngcontent-%COMP%_animateWaves 3s linear infinite}.wave#wave4[_ngcontent-%COMP%]{z-index:999;opacity:.7;bottom:20px;animation:_ngcontent-%COMP%_animate 3s linear infinite}@keyframes _ngcontent-%COMP%_animateWaves{0%{background-position-x:1000px}to{background-position-x:0px}}@keyframes _ngcontent-%COMP%_animate{0%{background-position-x:-1000px}to{background-position-x:0px}}',
      ],
    }));
  let t = e;
  return t;
})();
var im = (() => {
  let e = class e {
    constructor() {
      this.title = "portfolio";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [["app-root"]],
      decls: 2,
      vars: 0,
      template: function (i, o) {
        i & 1 && C(0, "router-outlet")(1, "app-footer");
      },
      dependencies: [hl, rm],
    }));
  let t = e;
  return t;
})();
var lt = "*";
function om(t, e = null) {
  return { type: 2, steps: t, options: e };
}
function _l(t) {
  return { type: 6, styles: t, offset: null };
}
var jt = class {
    constructor(e = 0, n = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = e + n);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(e) {
      this._position = this.totalTime ? e * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  ni = class {
    constructor(e) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = e);
      let n = 0,
        r = 0,
        i = 0,
        o = this.players.length;
      o == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++n == o && this._onFinish();
            }),
              s.onDestroy(() => {
                ++r == o && this._onDestroy();
              }),
              s.onStart(() => {
                ++i == o && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((e) => e.init());
    }
    onStart(e) {
      this._onStartFns.push(e);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((e) => e()),
        (this._onStartFns = []));
    }
    onDone(e) {
      this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((e) => e.play());
    }
    pause() {
      this.players.forEach((e) => e.pause());
    }
    restart() {
      this.players.forEach((e) => e.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((e) => e.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((e) => e.destroy()),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((e) => e.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(e) {
      let n = e * this.totalTime;
      this.players.forEach((r) => {
        let i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(i);
      });
    }
    getPosition() {
      let e = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null
      );
      return e != null ? e.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((e) => {
        e.beforeDestroy && e.beforeDestroy();
      });
    }
    triggerCallback(e) {
      let n = e == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  os = "!";
function sm(t) {
  return new m(3e3, !1);
}
function c0() {
  return new m(3100, !1);
}
function l0() {
  return new m(3101, !1);
}
function u0(t) {
  return new m(3001, !1);
}
function d0(t) {
  return new m(3003, !1);
}
function f0(t) {
  return new m(3004, !1);
}
function h0(t, e) {
  return new m(3005, !1);
}
function p0() {
  return new m(3006, !1);
}
function m0() {
  return new m(3007, !1);
}
function g0(t, e) {
  return new m(3008, !1);
}
function y0(t) {
  return new m(3002, !1);
}
function v0(t, e, n, r, i) {
  return new m(3010, !1);
}
function w0() {
  return new m(3011, !1);
}
function D0() {
  return new m(3012, !1);
}
function b0() {
  return new m(3200, !1);
}
function _0() {
  return new m(3202, !1);
}
function E0() {
  return new m(3013, !1);
}
function C0(t) {
  return new m(3014, !1);
}
function I0(t) {
  return new m(3015, !1);
}
function S0(t) {
  return new m(3016, !1);
}
function T0(t, e) {
  return new m(3404, !1);
}
function M0(t) {
  return new m(3502, !1);
}
function x0(t) {
  return new m(3503, !1);
}
function A0() {
  return new m(3300, !1);
}
function N0(t) {
  return new m(3504, !1);
}
function R0(t) {
  return new m(3301, !1);
}
function O0(t, e) {
  return new m(3302, !1);
}
function P0(t) {
  return new m(3303, !1);
}
function k0(t, e) {
  return new m(3400, !1);
}
function F0(t) {
  return new m(3401, !1);
}
function L0(t) {
  return new m(3402, !1);
}
function j0(t, e) {
  return new m(3505, !1);
}
function Vt(t) {
  switch (t.length) {
    case 0:
      return new jt();
    case 1:
      return t[0];
    default:
      return new ni(t);
  }
}
function Dm(t, e, n = new Map(), r = new Map()) {
  let i = [],
    o = [],
    s = -1,
    a = null;
  if (
    (e.forEach((c) => {
      let l = c.get("offset"),
        u = l == s,
        d = (u && a) || new Map();
      c.forEach((f, h) => {
        let p = h,
          g = f;
        if (h !== "offset")
          switch (((p = t.normalizePropertyName(p, i)), g)) {
            case os:
              g = n.get(h);
              break;
            case lt:
              g = r.get(h);
              break;
            default:
              g = t.normalizeStyleValue(h, p, g, i);
              break;
          }
        d.set(p, g);
      }),
        u || o.push(d),
        (a = d),
        (s = l);
    }),
    i.length)
  )
    throw M0(i);
  return o;
}
function zl(t, e, n, r) {
  switch (e) {
    case "start":
      t.onStart(() => r(n && El(n, "start", t)));
      break;
    case "done":
      t.onDone(() => r(n && El(n, "done", t)));
      break;
    case "destroy":
      t.onDestroy(() => r(n && El(n, "destroy", t)));
      break;
  }
}
function El(t, e, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    o = Wl(
      t.element,
      t.triggerName,
      t.fromState,
      t.toState,
      e || t.phaseName,
      r ?? t.totalTime,
      i
    ),
    s = t._data;
  return s != null && (o._data = s), o;
}
function Wl(t, e, n, r, i = "", o = 0, s) {
  return {
    element: t,
    triggerName: e,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: o,
    disabled: !!s,
  };
}
function xe(t, e, n) {
  let r = t.get(e);
  return r || t.set(e, (r = n)), r;
}
function am(t) {
  let e = t.indexOf(":"),
    n = t.substring(1, e),
    r = t.slice(e + 1);
  return [n, r];
}
var V0 = (() => (typeof document > "u" ? null : document.documentElement))();
function ql(t) {
  let e = t.parentNode || t.host || null;
  return e === V0 ? null : e;
}
function $0(t) {
  return t.substring(1, 6) == "ebkit";
}
var ln = null,
  cm = !1;
function B0(t) {
  ln ||
    ((ln = U0() || {}), (cm = ln.style ? "WebkitAppearance" in ln.style : !1));
  let e = !0;
  return (
    ln.style &&
      !$0(t) &&
      ((e = t in ln.style),
      !e &&
        cm &&
        (e = "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in ln.style)),
    e
  );
}
function U0() {
  return typeof document < "u" ? document.body : null;
}
function bm(t, e) {
  for (; e; ) {
    if (e === t) return !0;
    e = ql(e);
  }
  return !1;
}
function _m(t, e, n) {
  if (n) return Array.from(t.querySelectorAll(e));
  let r = t.querySelector(e);
  return r ? [r] : [];
}
var Gl = (() => {
    let e = class e {
      validateStyleProperty(r) {
        return B0(r);
      }
      matchesElement(r, i) {
        return !1;
      }
      containsElement(r, i) {
        return bm(r, i);
      }
      getParentElement(r) {
        return ql(r);
      }
      query(r, i, o) {
        return _m(r, i, o);
      }
      computeStyle(r, i, o) {
        return o || "";
      }
      animate(r, i, o, s, a, c = [], l) {
        return new jt(o, s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  li = (() => {
    let e = class e {};
    e.NOOP = new Gl();
    let t = e;
    return t;
  })(),
  fn = class {};
var H0 = 1e3,
  Em = "{{",
  z0 = "}}",
  Cm = "ng-enter",
  xl = "ng-leave",
  ss = "ng-trigger",
  ds = ".ng-trigger",
  lm = "ng-animating",
  Al = ".ng-animating";
function Dt(t) {
  if (typeof t == "number") return t;
  let e = t.match(/^(-?[\.\d]+)(m?s)/);
  return !e || e.length < 2 ? 0 : Nl(parseFloat(e[1]), e[2]);
}
function Nl(t, e) {
  switch (e) {
    case "s":
      return t * H0;
    default:
      return t;
  }
}
function fs(t, e, n) {
  return t.hasOwnProperty("duration") ? t : W0(t, e, n);
}
function W0(t, e, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    o = 0,
    s = "";
  if (typeof t == "string") {
    let a = t.match(r);
    if (a === null) return e.push(sm(t)), { duration: 0, delay: 0, easing: "" };
    i = Nl(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (o = Nl(parseFloat(c), a[4]));
    let l = a[5];
    l && (s = l);
  } else i = t;
  if (!n) {
    let a = !1,
      c = e.length;
    i < 0 && (e.push(c0()), (a = !0)),
      o < 0 && (e.push(l0()), (a = !0)),
      a && e.splice(c, 0, sm(t));
  }
  return { duration: i, delay: o, easing: s };
}
function ui(t, e = {}) {
  return (
    Object.keys(t).forEach((n) => {
      e[n] = t[n];
    }),
    e
  );
}
function Im(t) {
  let e = new Map();
  return (
    Object.keys(t).forEach((n) => {
      let r = t[n];
      e.set(n, r);
    }),
    e
  );
}
function q0(t) {
  return t.length ? (t[0] instanceof Map ? t : t.map((e) => Im(e))) : [];
}
function er(t, e = new Map(), n) {
  if (n) for (let [r, i] of n) e.set(r, i);
  for (let [r, i] of t) e.set(r, i);
  return e;
}
function ut(t, e, n) {
  e.forEach((r, i) => {
    let o = Kl(i);
    n && !n.has(i) && n.set(i, t.style[o]), (t.style[o] = r);
  });
}
function dn(t, e) {
  e.forEach((n, r) => {
    let i = Kl(r);
    t.style[i] = "";
  });
}
function ri(t) {
  return Array.isArray(t) ? (t.length == 1 ? t[0] : om(t)) : t;
}
function G0(t, e, n) {
  let r = e.params || {},
    i = Sm(t);
  i.length &&
    i.forEach((o) => {
      r.hasOwnProperty(o) || n.push(u0(o));
    });
}
var Rl = new RegExp(`${Em}\\s*(.+?)\\s*${z0}`, "g");
function Sm(t) {
  let e = [];
  if (typeof t == "string") {
    let n;
    for (; (n = Rl.exec(t)); ) e.push(n[1]);
    Rl.lastIndex = 0;
  }
  return e;
}
function oi(t, e, n) {
  let r = t.toString(),
    i = r.replace(Rl, (o, s) => {
      let a = e[s];
      return a == null && (n.push(d0(s)), (a = "")), a.toString();
    });
  return i == r ? t : i;
}
function hs(t) {
  let e = [],
    n = t.next();
  for (; !n.done; ) e.push(n.value), (n = t.next());
  return e;
}
var K0 = /-+([a-z0-9])/g;
function Kl(t) {
  return t.replace(K0, (...e) => e[1].toUpperCase());
}
function Q0(t, e) {
  return t === 0 || e === 0;
}
function Y0(t, e, n) {
  if (n.size && e.length) {
    let r = e[0],
      i = [];
    if (
      (n.forEach((o, s) => {
        r.has(s) || i.push(s), r.set(s, o);
      }),
      i.length)
    )
      for (let o = 1; o < e.length; o++) {
        let s = e[o];
        i.forEach((a) => s.set(a, Tm(t, a)));
      }
  }
  return e;
}
function Me(t, e, n) {
  switch (e.type) {
    case 7:
      return t.visitTrigger(e, n);
    case 0:
      return t.visitState(e, n);
    case 1:
      return t.visitTransition(e, n);
    case 2:
      return t.visitSequence(e, n);
    case 3:
      return t.visitGroup(e, n);
    case 4:
      return t.visitAnimate(e, n);
    case 5:
      return t.visitKeyframes(e, n);
    case 6:
      return t.visitStyle(e, n);
    case 8:
      return t.visitReference(e, n);
    case 9:
      return t.visitAnimateChild(e, n);
    case 10:
      return t.visitAnimateRef(e, n);
    case 11:
      return t.visitQuery(e, n);
    case 12:
      return t.visitStagger(e, n);
    default:
      throw f0(e.type);
  }
}
function Tm(t, e) {
  return window.getComputedStyle(t)[e];
}
var Z0 = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  ps = class extends fn {
    normalizePropertyName(e, n) {
      return Kl(e);
    }
    normalizeStyleValue(e, n, r, i) {
      let o = "",
        s = r.toString().trim();
      if (Z0.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") o = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(h0(e, r));
        }
      return s + o;
    }
  };
var ms = "*";
function X0(t, e) {
  let n = [];
  return (
    typeof t == "string"
      ? t.split(/\s*,\s*/).forEach((r) => J0(r, n, e))
      : n.push(t),
    n
  );
}
function J0(t, e, n) {
  if (t[0] == ":") {
    let c = eC(t, n);
    if (typeof c == "function") {
      e.push(c);
      return;
    }
    t = c;
  }
  let r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(I0(t)), e;
  let i = r[1],
    o = r[2],
    s = r[3];
  e.push(um(i, s));
  let a = i == ms && s == ms;
  o[0] == "<" && !a && e.push(um(s, i));
}
function eC(t, e) {
  switch (t) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (n, r) => parseFloat(r) > parseFloat(n);
    case ":decrement":
      return (n, r) => parseFloat(r) < parseFloat(n);
    default:
      return e.push(S0(t)), "* => *";
  }
}
var as = new Set(["true", "1"]),
  cs = new Set(["false", "0"]);
function um(t, e) {
  let n = as.has(t) || cs.has(t),
    r = as.has(e) || cs.has(e);
  return (i, o) => {
    let s = t == ms || t == i,
      a = e == ms || e == o;
    return (
      !s && n && typeof i == "boolean" && (s = i ? as.has(t) : cs.has(t)),
      !a && r && typeof o == "boolean" && (a = o ? as.has(e) : cs.has(e)),
      s && a
    );
  };
}
var Mm = ":self",
  tC = new RegExp(`s*${Mm}s*,?`, "g");
function xm(t, e, n, r) {
  return new Ol(t).build(e, n, r);
}
var dm = "",
  Ol = class {
    constructor(e) {
      this._driver = e;
    }
    build(e, n, r) {
      let i = new Pl(n);
      return this._resetContextStyleTimingState(i), Me(this, ri(e), i);
    }
    _resetContextStyleTimingState(e) {
      (e.currentQuerySelector = dm),
        (e.collectedStyles = new Map()),
        e.collectedStyles.set(dm, new Map()),
        (e.currentTime = 0);
    }
    visitTrigger(e, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        o = [],
        s = [];
      return (
        e.name.charAt(0) == "@" && n.errors.push(p0()),
        e.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == 0)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), o.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == 1) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), s.push(c);
          } else n.errors.push(m0());
        }),
        {
          type: 7,
          name: e.name,
          states: o,
          transitions: s,
          queryCount: r,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(e, n) {
      let r = this.visitStyle(e.styles, n),
        i = (e.options && e.options.params) || null;
      if (r.containsDynamicStyles) {
        let o = new Set(),
          s = i || {};
        if (
          (r.styles.forEach((a) => {
            a instanceof Map &&
              a.forEach((c) => {
                Sm(c).forEach((l) => {
                  s.hasOwnProperty(l) || o.add(l);
                });
              });
          }),
          o.size)
        ) {
          let a = hs(o.values());
          n.errors.push(g0(e.name, a));
        }
      }
      return {
        type: 0,
        name: e.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(e, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = Me(this, ri(e.animation), n);
      return {
        type: 1,
        matchers: X0(e.expr, n.errors),
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: un(e.options),
      };
    }
    visitSequence(e, n) {
      return {
        type: 2,
        steps: e.steps.map((r) => Me(this, r, n)),
        options: un(e.options),
      };
    }
    visitGroup(e, n) {
      let r = n.currentTime,
        i = 0,
        o = e.steps.map((s) => {
          n.currentTime = r;
          let a = Me(this, s, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (n.currentTime = i), { type: 3, steps: o, options: un(e.options) };
    }
    visitAnimate(e, n) {
      let r = oC(e.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        o = e.styles ? e.styles : _l({});
      if (o.type == 5) i = this.visitKeyframes(o, n);
      else {
        let s = e.styles,
          a = !1;
        if (!s) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (s = _l(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(s, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: 4, timings: r, style: i, options: null }
      );
    }
    visitStyle(e, n) {
      let r = this._makeStyleAst(e, n);
      return this._validateStyleAst(r, n), r;
    }
    _makeStyleAst(e, n) {
      let r = [],
        i = Array.isArray(e.styles) ? e.styles : [e.styles];
      for (let a of i)
        typeof a == "string"
          ? a === lt
            ? r.push(a)
            : n.errors.push(y0(a))
          : r.push(Im(a));
      let o = !1,
        s = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((s = a.get("easing")), a.delete("easing")), !o)
          ) {
            for (let c of a.values())
              if (c.toString().indexOf(Em) >= 0) {
                o = !0;
                break;
              }
          }
        }),
        {
          type: 6,
          styles: r,
          easing: s,
          offset: e.offset,
          containsDynamicStyles: o,
          options: null,
        }
      );
    }
    _validateStyleAst(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        o = n.currentTime;
      r && o > 0 && (o -= r.duration + r.delay),
        e.styles.forEach((s) => {
          typeof s != "string" &&
            s.forEach((a, c) => {
              let l = n.collectedStyles.get(n.currentQuerySelector),
                u = l.get(c),
                d = !0;
              u &&
                (o != i &&
                  o >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(v0(c, u.startTime, u.endTime, o, i)),
                  (d = !1)),
                (o = u.startTime)),
                d && l.set(c, { startTime: o, endTime: i }),
                n.options && G0(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(e, n) {
      let r = { type: 5, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(w0()), r;
      let i = 1,
        o = 0,
        s = [],
        a = !1,
        c = !1,
        l = 0,
        u = e.steps.map((M) => {
          let V = this._makeStyleAst(M, n),
            K = V.offset != null ? V.offset : iC(V.styles),
            q = 0;
          return (
            K != null && (o++, (q = V.offset = K)),
            (c = c || q < 0 || q > 1),
            (a = a || q < l),
            (l = q),
            s.push(q),
            V
          );
        });
      c && n.errors.push(D0()), a && n.errors.push(b0());
      let d = e.steps.length,
        f = 0;
      o > 0 && o < d ? n.errors.push(_0()) : o == 0 && (f = i / (d - 1));
      let h = d - 1,
        p = n.currentTime,
        g = n.currentAnimateTimings,
        N = g.duration;
      return (
        u.forEach((M, V) => {
          let K = f > 0 ? (V == h ? 1 : f * V) : s[V],
            q = K * N;
          (n.currentTime = p + g.delay + q),
            (g.duration = q),
            this._validateStyleAst(M, n),
            (M.offset = K),
            r.styles.push(M);
        }),
        r
      );
    }
    visitReference(e, n) {
      return {
        type: 8,
        animation: Me(this, ri(e.animation), n),
        options: un(e.options),
      };
    }
    visitAnimateChild(e, n) {
      return n.depCount++, { type: 9, options: un(e.options) };
    }
    visitAnimateRef(e, n) {
      return {
        type: 10,
        animation: this.visitReference(e.animation, n),
        options: un(e.options),
      };
    }
    visitQuery(e, n) {
      let r = n.currentQuerySelector,
        i = e.options || {};
      n.queryCount++, (n.currentQuery = e);
      let [o, s] = nC(e.selector);
      (n.currentQuerySelector = r.length ? r + " " + o : o),
        xe(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = Me(this, ri(e.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: 11,
          selector: o,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: s,
          animation: a,
          originalSelector: e.selector,
          options: un(e.options),
        }
      );
    }
    visitStagger(e, n) {
      n.currentQuery || n.errors.push(E0());
      let r =
        e.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : fs(e.timings, n.errors, !0);
      return {
        type: 12,
        animation: Me(this, ri(e.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function nC(t) {
  let e = !!t.split(/\s*,\s*/).find((n) => n == Mm);
  return (
    e && (t = t.replace(tC, "")),
    (t = t
      .replace(/@\*/g, ds)
      .replace(/@\w+/g, (n) => ds + "-" + n.slice(1))
      .replace(/:animating/g, Al)),
    [t, e]
  );
}
function rC(t) {
  return t ? ui(t) : null;
}
var Pl = class {
  constructor(e) {
    (this.errors = e),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function iC(t) {
  if (typeof t == "string") return null;
  let e = null;
  if (Array.isArray(t))
    t.forEach((n) => {
      if (n instanceof Map && n.has("offset")) {
        let r = n;
        (e = parseFloat(r.get("offset"))), r.delete("offset");
      }
    });
  else if (t instanceof Map && t.has("offset")) {
    let n = t;
    (e = parseFloat(n.get("offset"))), n.delete("offset");
  }
  return e;
}
function oC(t, e) {
  if (t.hasOwnProperty("duration")) return t;
  if (typeof t == "number") {
    let o = fs(t, e).duration;
    return Cl(o, 0, "");
  }
  let n = t;
  if (n.split(/\s+/).some((o) => o.charAt(0) == "{" && o.charAt(1) == "{")) {
    let o = Cl(0, 0, "");
    return (o.dynamic = !0), (o.strValue = n), o;
  }
  let i = fs(n, e);
  return Cl(i.duration, i.delay, i.easing);
}
function un(t) {
  return t ? ((t = ui(t)), t.params && (t.params = rC(t.params))) : (t = {}), t;
}
function Cl(t, e, n) {
  return { duration: t, delay: e, easing: n };
}
function Ql(t, e, n, r, i, o, s = null, a = !1) {
  return {
    type: 1,
    element: t,
    keyframes: e,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: o,
    totalTime: i + o,
    easing: s,
    subTimeline: a,
  };
}
var si = class {
    constructor() {
      this._map = new Map();
    }
    get(e) {
      return this._map.get(e) || [];
    }
    append(e, n) {
      let r = this._map.get(e);
      r || this._map.set(e, (r = [])), r.push(...n);
    }
    has(e) {
      return this._map.has(e);
    }
    clear() {
      this._map.clear();
    }
  },
  sC = 1,
  aC = ":enter",
  cC = new RegExp(aC, "g"),
  lC = ":leave",
  uC = new RegExp(lC, "g");
function Am(t, e, n, r, i, o = new Map(), s = new Map(), a, c, l = []) {
  return new kl().buildKeyframes(t, e, n, r, i, o, s, a, c, l);
}
var kl = class {
    buildKeyframes(e, n, r, i, o, s, a, c, l, u = []) {
      l = l || new si();
      let d = new Fl(e, n, l, i, o, u, []);
      d.options = c;
      let f = c.delay ? Dt(c.delay) : 0;
      d.currentTimeline.delayNextStep(f),
        d.currentTimeline.setStyles([s], null, d.errors, c),
        Me(this, r, d);
      let h = d.timelines.filter((p) => p.containsAnimation());
      if (h.length && a.size) {
        let p;
        for (let g = h.length - 1; g >= 0; g--) {
          let N = h[g];
          if (N.element === n) {
            p = N;
            break;
          }
        }
        p &&
          !p.allowOnlyTimelineStyles() &&
          p.setStyles([a], null, d.errors, c);
      }
      return h.length
        ? h.map((p) => p.buildKeyframes())
        : [Ql(n, [], [], [], 0, f, "", !1)];
    }
    visitTrigger(e, n) {}
    visitState(e, n) {}
    visitTransition(e, n) {}
    visitAnimateChild(e, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(e.options),
          o = n.currentTimeline.currentTime,
          s = this._visitSubInstructions(r, i, i.options);
        o != s && n.transformIntoNewTimeline(s);
      }
      n.previousNode = e;
    }
    visitAnimateRef(e, n) {
      let r = n.createSubContext(e.options);
      r.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([e.options, e.animation.options], n, r),
        this.visitReference(e.animation, r),
        n.transformIntoNewTimeline(r.currentTimeline.currentTime),
        (n.previousNode = e);
    }
    _applyAnimationRefDelays(e, n, r) {
      for (let i of e) {
        let o = i?.delay;
        if (o) {
          let s =
            typeof o == "number" ? o : Dt(oi(o, i?.params ?? {}, n.errors));
          r.delayNextStep(s);
        }
      }
    }
    _visitSubInstructions(e, n, r) {
      let o = n.currentTimeline.currentTime,
        s = r.duration != null ? Dt(r.duration) : null,
        a = r.delay != null ? Dt(r.delay) : null;
      return (
        s !== 0 &&
          e.forEach((c) => {
            let l = n.appendInstructionToTimeline(c, s, a);
            o = Math.max(o, l.duration + l.delay);
          }),
        o
      );
    }
    visitReference(e, n) {
      n.updateOptions(e.options, !0),
        Me(this, e.animation, n),
        (n.previousNode = e);
    }
    visitSequence(e, n) {
      let r = n.subContextCount,
        i = n,
        o = e.options;
      if (
        o &&
        (o.params || o.delay) &&
        ((i = n.createSubContext(o)),
        i.transformIntoNewTimeline(),
        o.delay != null)
      ) {
        i.previousNode.type == 6 &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = gs));
        let s = Dt(o.delay);
        i.delayNextStep(s);
      }
      e.steps.length &&
        (e.steps.forEach((s) => Me(this, s, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = e);
    }
    visitGroup(e, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        o = e.options && e.options.delay ? Dt(e.options.delay) : 0;
      e.steps.forEach((s) => {
        let a = n.createSubContext(e.options);
        o && a.delayNextStep(o),
          Me(this, s, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((s) => n.currentTimeline.mergeTimelineCollectedStyles(s)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = e);
    }
    _visitTiming(e, n) {
      if (e.dynamic) {
        let r = e.strValue,
          i = n.params ? oi(r, n.params, n.errors) : r;
        return fs(i, n.errors);
      } else return { duration: e.duration, delay: e.delay, easing: e.easing };
    }
    visitAnimate(e, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let o = e.style;
      o.type == 5
        ? this.visitKeyframes(o, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(o, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = e);
    }
    visitStyle(e, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let o = (i && i.easing) || e.easing;
      e.isEmptyStep
        ? r.applyEmptyStep(o)
        : r.setStyles(e.styles, o, n.errors, n.options),
        (n.previousNode = e);
    }
    visitKeyframes(e, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        o = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        e.styles.forEach((c) => {
          let l = c.offset || 0;
          a.forwardTime(l * o),
            a.setStyles(c.styles, c.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + o),
        (n.previousNode = e);
    }
    visitQuery(e, n) {
      let r = n.currentTimeline.currentTime,
        i = e.options || {},
        o = i.delay ? Dt(i.delay) : 0;
      o &&
        (n.previousNode.type === 6 ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = gs));
      let s = r,
        a = n.invokeQuery(
          e.selector,
          e.originalSelector,
          e.limit,
          e.includeSelf,
          !!i.optional,
          n.errors
        );
      n.currentQueryTotal = a.length;
      let c = null;
      a.forEach((l, u) => {
        n.currentQueryIndex = u;
        let d = n.createSubContext(e.options, l);
        o && d.delayNextStep(o),
          l === n.element && (c = d.currentTimeline),
          Me(this, e.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let f = d.currentTimeline.currentTime;
        s = Math.max(s, f);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(s),
        c &&
          (n.currentTimeline.mergeTimelineCollectedStyles(c),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = e);
    }
    visitStagger(e, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        o = e.timings,
        s = Math.abs(o.duration),
        a = s * (n.currentQueryTotal - 1),
        c = s * n.currentQueryIndex;
      switch (o.duration < 0 ? "reverse" : o.easing) {
        case "reverse":
          c = a - c;
          break;
        case "full":
          c = r.currentStaggerTime;
          break;
      }
      let u = n.currentTimeline;
      c && u.delayNextStep(c);
      let d = u.currentTime;
      Me(this, e.animation, n),
        (n.previousNode = e),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  gs = {},
  Fl = class t {
    constructor(e, n, r, i, o, s, a, c) {
      (this._driver = e),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = o),
        (this.errors = s),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = gs),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new ys(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(e, n) {
      if (!e) return;
      let r = e,
        i = this.options;
      r.duration != null && (i.duration = Dt(r.duration)),
        r.delay != null && (i.delay = Dt(r.delay));
      let o = r.params;
      if (o) {
        let s = i.params;
        s || (s = this.options.params = {}),
          Object.keys(o).forEach((a) => {
            (!n || !s.hasOwnProperty(a)) && (s[a] = oi(o[a], s, this.errors));
          });
      }
    }
    _copyOptions() {
      let e = {};
      if (this.options) {
        let n = this.options.params;
        if (n) {
          let r = (e.params = {});
          Object.keys(n).forEach((i) => {
            r[i] = n[i];
          });
        }
      }
      return e;
    }
    createSubContext(e = null, n, r) {
      let i = n || this.element,
        o = new t(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, r || 0)
        );
      return (
        (o.previousNode = this.previousNode),
        (o.currentAnimateTimings = this.currentAnimateTimings),
        (o.options = this._copyOptions()),
        o.updateOptions(e),
        (o.currentQueryIndex = this.currentQueryIndex),
        (o.currentQueryTotal = this.currentQueryTotal),
        (o.parentContext = this),
        this.subContextCount++,
        o
      );
    }
    transformIntoNewTimeline(e) {
      return (
        (this.previousNode = gs),
        (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(e, n, r) {
      let i = {
          duration: n ?? e.duration,
          delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
          easing: "",
        },
        o = new Ll(
          this._driver,
          e.element,
          e.keyframes,
          e.preStyleProps,
          e.postStyleProps,
          i,
          e.stretchStartingKeyframe
        );
      return this.timelines.push(o), i;
    }
    incrementTime(e) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
    }
    delayNextStep(e) {
      e > 0 && this.currentTimeline.delayNextStep(e);
    }
    invokeQuery(e, n, r, i, o, s) {
      let a = [];
      if ((i && a.push(this.element), e.length > 0)) {
        (e = e.replace(cC, "." + this._enterClassName)),
          (e = e.replace(uC, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, e, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !o && a.length == 0 && s.push(C0(n)), a;
    }
  },
  ys = class t {
    constructor(e, n, r, i) {
      (this._driver = e),
        (this.element = n),
        (this.startTime = r),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(e) {
      let n = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || n
        ? (this.forwardTime(this.currentTime + e),
          n && this.snapshotCurrentStyles())
        : (this.startTime += e);
    }
    fork(e, n) {
      return (
        this.applyStylesToKeyframe(),
        new t(
          this._driver,
          e,
          n || this.currentTime,
          this._elementTimelineStylesLookup
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += sC), this._loadKeyframe();
    }
    forwardTime(e) {
      this.applyStylesToKeyframe(), (this.duration = e), this._loadKeyframe();
    }
    _updateStyle(e, n) {
      this._localTimelineStyles.set(e, n),
        this._globalTimelineStyles.set(e, n),
        this._styleSummary.set(e, { time: this.currentTime, value: n });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(e) {
      e && this._previousKeyframe.set("easing", e);
      for (let [n, r] of this._globalTimelineStyles)
        this._backFill.set(n, r || lt), this._currentKeyframe.set(n, lt);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(e, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let o = (i && i.params) || {},
        s = dC(e, this._globalTimelineStyles);
      for (let [a, c] of s) {
        let l = oi(c, o, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? lt),
          this._updateStyle(a, l);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((e, n) => {
          this._currentKeyframe.set(n, e);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((e, n) => {
          this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
        }));
    }
    snapshotCurrentStyles() {
      for (let [e, n] of this._localTimelineStyles)
        this._pendingStyles.set(e, n), this._updateStyle(e, n);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let e = [];
      for (let n in this._currentKeyframe) e.push(n);
      return e;
    }
    mergeTimelineCollectedStyles(e) {
      e._styleSummary.forEach((n, r) => {
        let i = this._styleSummary.get(r);
        (!i || n.time > i.time) && this._updateStyle(r, n.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let e = new Set(),
        n = new Set(),
        r = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, c) => {
        let l = er(a, new Map(), this._backFill);
        l.forEach((u, d) => {
          u === os ? e.add(d) : u === lt && n.add(d);
        }),
          r || l.set("offset", c / this.duration),
          i.push(l);
      });
      let o = e.size ? hs(e.values()) : [],
        s = n.size ? hs(n.values()) : [];
      if (r) {
        let a = i[0],
          c = new Map(a);
        a.set("offset", 0), c.set("offset", 1), (i = [a, c]);
      }
      return Ql(
        this.element,
        i,
        o,
        s,
        this.duration,
        this.startTime,
        this.easing,
        !1
      );
    }
  },
  Ll = class extends ys {
    constructor(e, n, r, i, o, s, a = !1) {
      super(e, n, s.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = o),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: s.duration,
          delay: s.delay,
          easing: s.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let e = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let o = [],
          s = r + n,
          a = n / s,
          c = er(e[0]);
        c.set("offset", 0), o.push(c);
        let l = er(e[0]);
        l.set("offset", fm(a)), o.push(l);
        let u = e.length - 1;
        for (let d = 1; d <= u; d++) {
          let f = er(e[d]),
            h = f.get("offset"),
            p = n + h * r;
          f.set("offset", fm(p / s)), o.push(f);
        }
        (r = s), (n = 0), (i = ""), (e = o);
      }
      return Ql(
        this.element,
        e,
        this.preStyleProps,
        this.postStyleProps,
        r,
        n,
        i,
        !0
      );
    }
  };
function fm(t, e = 3) {
  let n = Math.pow(10, e - 1);
  return Math.round(t * n) / n;
}
function dC(t, e) {
  let n = new Map(),
    r;
  return (
    t.forEach((i) => {
      if (i === "*") {
        r = r || e.keys();
        for (let o of r) n.set(o, lt);
      } else er(i, n);
    }),
    n
  );
}
function hm(t, e, n, r, i, o, s, a, c, l, u, d, f) {
  return {
    type: 0,
    element: t,
    triggerName: e,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: o,
    toState: r,
    toStyles: s,
    timelines: a,
    queriedElements: c,
    preStyleProps: l,
    postStyleProps: u,
    totalTime: d,
    errors: f,
  };
}
var Il = {},
  vs = class {
    constructor(e, n, r) {
      (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
    }
    match(e, n, r, i) {
      return fC(this.ast.matchers, e, n, r, i);
    }
    buildStyles(e, n, r) {
      let i = this._stateStyles.get("*");
      return (
        e !== void 0 && (i = this._stateStyles.get(e?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(e, n, r, i, o, s, a, c, l, u) {
      let d = [],
        f = (this.ast.options && this.ast.options.params) || Il,
        h = (a && a.params) || Il,
        p = this.buildStyles(r, h, d),
        g = (c && c.params) || Il,
        N = this.buildStyles(i, g, d),
        M = new Set(),
        V = new Map(),
        K = new Map(),
        q = i === "void",
        de = { params: hC(g, f), delay: this.ast.options?.delay },
        re = u ? [] : Am(e, n, this.ast.animation, o, s, p, N, de, l, d),
        se = 0;
      if (
        (re.forEach((Ve) => {
          se = Math.max(Ve.duration + Ve.delay, se);
        }),
        d.length)
      )
        return hm(n, this._triggerName, r, i, q, p, N, [], [], V, K, se, d);
      re.forEach((Ve) => {
        let dt = Ve.element,
          ou = xe(V, dt, new Set());
        Ve.preStyleProps.forEach(($t) => ou.add($t));
        let nr = xe(K, dt, new Set());
        Ve.postStyleProps.forEach(($t) => nr.add($t)), dt !== n && M.add(dt);
      });
      let je = hs(M.values());
      return hm(n, this._triggerName, r, i, q, p, N, re, je, V, K, se);
    }
  };
function fC(t, e, n, r, i) {
  return t.some((o) => o(e, n, r, i));
}
function hC(t, e) {
  let n = ui(e);
  for (let r in t) t.hasOwnProperty(r) && t[r] != null && (n[r] = t[r]);
  return n;
}
var jl = class {
  constructor(e, n, r) {
    (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(e, n) {
    let r = new Map(),
      i = ui(this.defaultParams);
    return (
      Object.keys(e).forEach((o) => {
        let s = e[o];
        s !== null && (i[o] = s);
      }),
      this.styles.styles.forEach((o) => {
        typeof o != "string" &&
          o.forEach((s, a) => {
            s && (s = oi(s, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (s = this.normalizer.normalizeStyleValue(a, c, s, n)), r.set(a, s);
          });
      }),
      r
    );
  }
};
function pC(t, e, n) {
  return new Vl(t, e, n);
}
var Vl = class {
  constructor(e, n, r) {
    (this.name = e),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let o = (i.options && i.options.params) || {};
        this.states.set(i.name, new jl(i.style, o, r));
      }),
      pm(this.states, "true", "1"),
      pm(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new vs(e, i, this.states));
      }),
      (this.fallbackTransition = mC(e, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(e, n, r, i) {
    return this.transitionFactories.find((s) => s.match(e, n, r, i)) || null;
  }
  matchStyles(e, n, r) {
    return this.fallbackTransition.buildStyles(e, n, r);
  }
};
function mC(t, e, n) {
  let o = {
    type: 1,
    animation: { type: 2, steps: [], options: null },
    matchers: [(s, a) => !0],
    options: null,
    queryCount: 0,
    depCount: 0,
  };
  return new vs(t, o, e);
}
function pm(t, e, n) {
  t.has(e) ? t.has(n) || t.set(n, t.get(e)) : t.has(n) && t.set(e, t.get(n));
}
var gC = new si(),
  $l = class {
    constructor(e, n, r) {
      (this.bodyNode = e),
        (this._driver = n),
        (this._normalizer = r),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(e, n) {
      let r = [],
        i = [],
        o = xm(this._driver, n, r, i);
      if (r.length) throw x0(r);
      i.length && void 0, this._animations.set(e, o);
    }
    _buildPlayer(e, n, r) {
      let i = e.element,
        o = Dm(this._normalizer, e.keyframes, n, r);
      return this._driver.animate(i, o, e.duration, e.delay, e.easing, [], !0);
    }
    create(e, n, r = {}) {
      let i = [],
        o = this._animations.get(e),
        s,
        a = new Map();
      if (
        (o
          ? ((s = Am(
              this._driver,
              n,
              o,
              Cm,
              xl,
              new Map(),
              new Map(),
              r,
              gC,
              i
            )),
            s.forEach((u) => {
              let d = xe(a, u.element, new Map());
              u.postStyleProps.forEach((f) => d.set(f, null));
            }))
          : (i.push(A0()), (s = [])),
        i.length)
      )
        throw N0(i);
      a.forEach((u, d) => {
        u.forEach((f, h) => {
          u.set(h, this._driver.computeStyle(d, h, lt));
        });
      });
      let c = s.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = Vt(c);
      return (
        this._playersById.set(e, l),
        l.onDestroy(() => this.destroy(e)),
        this.players.push(l),
        l
      );
    }
    destroy(e) {
      let n = this._getPlayer(e);
      n.destroy(), this._playersById.delete(e);
      let r = this.players.indexOf(n);
      r >= 0 && this.players.splice(r, 1);
    }
    _getPlayer(e) {
      let n = this._playersById.get(e);
      if (!n) throw R0(e);
      return n;
    }
    listen(e, n, r, i) {
      let o = Wl(n, "", "", "");
      return zl(this._getPlayer(e), r, o, i), () => {};
    }
    command(e, n, r, i) {
      if (r == "register") {
        this.register(e, i[0]);
        return;
      }
      if (r == "create") {
        let s = i[0] || {};
        this.create(e, n, s);
        return;
      }
      let o = this._getPlayer(e);
      switch (r) {
        case "play":
          o.play();
          break;
        case "pause":
          o.pause();
          break;
        case "reset":
          o.reset();
          break;
        case "restart":
          o.restart();
          break;
        case "finish":
          o.finish();
          break;
        case "init":
          o.init();
          break;
        case "setPosition":
          o.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(e);
          break;
      }
    }
  },
  mm = "ng-animate-queued",
  yC = ".ng-animate-queued",
  Sl = "ng-animate-disabled",
  vC = ".ng-animate-disabled",
  wC = "ng-star-inserted",
  DC = ".ng-star-inserted",
  bC = [],
  Nm = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  _C = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  Xe = "__ng_removed",
  ai = class {
    get params() {
      return this.options.params;
    }
    constructor(e, n = "") {
      this.namespaceId = n;
      let r = e && e.hasOwnProperty("value"),
        i = r ? e.value : e;
      if (((this.value = CC(i)), r)) {
        let o = ui(e);
        delete o.value, (this.options = o);
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(e) {
      let n = e.params;
      if (n) {
        let r = this.options.params;
        Object.keys(n).forEach((i) => {
          r[i] == null && (r[i] = n[i]);
        });
      }
    }
  },
  ii = "void",
  Tl = new ai(ii),
  Bl = class {
    constructor(e, n, r) {
      (this.id = e),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + e),
        Le(n, this._hostClassName);
    }
    listen(e, n, r, i) {
      if (!this._triggers.has(n)) throw O0(r, n);
      if (r == null || r.length == 0) throw P0(n);
      if (!IC(r)) throw k0(r, n);
      let o = xe(this._elementListeners, e, []),
        s = { name: n, phase: r, callback: i };
      o.push(s);
      let a = xe(this._engine.statesByElement, e, new Map());
      return (
        a.has(n) || (Le(e, ss), Le(e, ss + "-" + n), a.set(n, Tl)),
        () => {
          this._engine.afterFlush(() => {
            let c = o.indexOf(s);
            c >= 0 && o.splice(c, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(e, n) {
      return this._triggers.has(e) ? !1 : (this._triggers.set(e, n), !0);
    }
    _getTrigger(e) {
      let n = this._triggers.get(e);
      if (!n) throw F0(e);
      return n;
    }
    trigger(e, n, r, i = !0) {
      let o = this._getTrigger(n),
        s = new ci(this.id, n, e),
        a = this._engine.statesByElement.get(e);
      a ||
        (Le(e, ss),
        Le(e, ss + "-" + n),
        this._engine.statesByElement.set(e, (a = new Map())));
      let c = a.get(n),
        l = new ai(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = Tl),
        !(l.value === ii) && c.value === l.value)
      ) {
        if (!MC(c.params, l.params)) {
          let g = [],
            N = o.matchStyles(c.value, c.params, g),
            M = o.matchStyles(l.value, l.params, g);
          g.length
            ? this._engine.reportError(g)
            : this._engine.afterFlush(() => {
                dn(e, N), ut(e, M);
              });
        }
        return;
      }
      let f = xe(this._engine.playersByElement, e, []);
      f.forEach((g) => {
        g.namespaceId == this.id &&
          g.triggerName == n &&
          g.queued &&
          g.destroy();
      });
      let h = o.matchTransition(c.value, l.value, e, l.params),
        p = !1;
      if (!h) {
        if (!i) return;
        (h = o.fallbackTransition), (p = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: e,
          triggerName: n,
          transition: h,
          fromState: c,
          toState: l,
          player: s,
          isFallbackTransition: p,
        }),
        p ||
          (Le(e, mm),
          s.onStart(() => {
            Jn(e, mm);
          })),
        s.onDone(() => {
          let g = this.players.indexOf(s);
          g >= 0 && this.players.splice(g, 1);
          let N = this._engine.playersByElement.get(e);
          if (N) {
            let M = N.indexOf(s);
            M >= 0 && N.splice(M, 1);
          }
        }),
        this.players.push(s),
        f.push(s),
        s
      );
    }
    deregister(e) {
      this._triggers.delete(e),
        this._engine.statesByElement.forEach((n) => n.delete(e)),
        this._elementListeners.forEach((n, r) => {
          this._elementListeners.set(
            r,
            n.filter((i) => i.name != e)
          );
        });
    }
    clearElementCache(e) {
      this._engine.statesByElement.delete(e), this._elementListeners.delete(e);
      let n = this._engine.playersByElement.get(e);
      n &&
        (n.forEach((r) => r.destroy()),
        this._engine.playersByElement.delete(e));
    }
    _signalRemovalForInnerTriggers(e, n) {
      let r = this._engine.driver.query(e, ds, !0);
      r.forEach((i) => {
        if (i[Xe]) return;
        let o = this._engine.fetchNamespacesByElement(i);
        o.size
          ? o.forEach((s) => s.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i))
        );
    }
    triggerLeaveAnimation(e, n, r, i) {
      let o = this._engine.statesByElement.get(e),
        s = new Map();
      if (o) {
        let a = [];
        if (
          (o.forEach((c, l) => {
            if ((s.set(l, c.value), this._triggers.has(l))) {
              let u = this.trigger(e, l, ii, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, e, !0, n, s),
            r && Vt(a).onDone(() => this._engine.processLeaveNode(e)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(e) {
      let n = this._elementListeners.get(e),
        r = this._engine.statesByElement.get(e);
      if (n && r) {
        let i = new Set();
        n.forEach((o) => {
          let s = o.name;
          if (i.has(s)) return;
          i.add(s);
          let c = this._triggers.get(s).fallbackTransition,
            l = r.get(s) || Tl,
            u = new ai(ii),
            d = new ci(this.id, s, e);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: s,
              transition: c,
              fromState: l,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(e, n) {
      let r = this._engine;
      if (
        (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
        this.triggerLeaveAnimation(e, n, !0))
      )
        return;
      let i = !1;
      if (r.totalAnimations) {
        let o = r.players.length ? r.playersByQueriedElement.get(e) : [];
        if (o && o.length) i = !0;
        else {
          let s = e;
          for (; (s = s.parentNode); )
            if (r.statesByElement.get(s)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(e), i))
        r.markElementAsRemoved(this.id, e, !1, n);
      else {
        let o = e[Xe];
        (!o || o === Nm) &&
          (r.afterFlush(() => this.clearElementCache(e)),
          r.destroyInnerAnimations(e),
          r._onRemovalComplete(e, n));
      }
    }
    insertNode(e, n) {
      Le(e, this._hostClassName);
    }
    drainQueuedTransitions(e) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let o = r.element,
            s = this._elementListeners.get(o);
          s &&
            s.forEach((a) => {
              if (a.name == r.triggerName) {
                let c = Wl(
                  o,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value
                );
                (c._data = e), zl(r.player, a.phase, c, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : n.push(r);
        }),
        (this._queue = []),
        n.sort((r, i) => {
          let o = r.transition.ast.depCount,
            s = i.transition.ast.depCount;
          return o == 0 || s == 0
            ? o - s
            : this._engine.driver.containsElement(r.element, i.element)
            ? 1
            : -1;
        })
      );
    }
    destroy(e) {
      this.players.forEach((n) => n.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, e);
    }
  },
  Ul = class {
    _onRemovalComplete(e, n) {
      this.onRemovalComplete(e, n);
    }
    constructor(e, n, r) {
      (this.bodyNode = e),
        (this.driver = n),
        (this._normalizer = r),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (i, o) => {});
    }
    get queuedPlayers() {
      let e = [];
      return (
        this._namespaceList.forEach((n) => {
          n.players.forEach((r) => {
            r.queued && e.push(r);
          });
        }),
        e
      );
    }
    createNamespace(e, n) {
      let r = new Bl(e, n, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, n)
          ? this._balanceNamespaceList(r, n)
          : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
        (this._namespaceLookup[e] = r)
      );
    }
    _balanceNamespaceList(e, n) {
      let r = this._namespaceList,
        i = this.namespacesByHostElement;
      if (r.length - 1 >= 0) {
        let s = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let c = i.get(a);
          if (c) {
            let l = r.indexOf(c);
            r.splice(l + 1, 0, e), (s = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        s || r.unshift(e);
      } else r.push(e);
      return i.set(n, e), e;
    }
    register(e, n) {
      let r = this._namespaceLookup[e];
      return r || (r = this.createNamespace(e, n)), r;
    }
    registerTrigger(e, n, r) {
      let i = this._namespaceLookup[e];
      i && i.register(n, r) && this.totalAnimations++;
    }
    destroy(e, n) {
      e &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let r = this._fetchNamespace(e);
          this.namespacesByHostElement.delete(r.hostElement);
          let i = this._namespaceList.indexOf(r);
          i >= 0 && this._namespaceList.splice(i, 1),
            r.destroy(n),
            delete this._namespaceLookup[e];
        }));
    }
    _fetchNamespace(e) {
      return this._namespaceLookup[e];
    }
    fetchNamespacesByElement(e) {
      let n = new Set(),
        r = this.statesByElement.get(e);
      if (r) {
        for (let i of r.values())
          if (i.namespaceId) {
            let o = this._fetchNamespace(i.namespaceId);
            o && n.add(o);
          }
      }
      return n;
    }
    trigger(e, n, r, i) {
      if (ls(n)) {
        let o = this._fetchNamespace(e);
        if (o) return o.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(e, n, r, i) {
      if (!ls(n)) return;
      let o = n[Xe];
      if (o && o.setForRemoval) {
        (o.setForRemoval = !1), (o.setForMove = !0);
        let s = this.collectedLeaveElements.indexOf(n);
        s >= 0 && this.collectedLeaveElements.splice(s, 1);
      }
      if (e) {
        let s = this._fetchNamespace(e);
        s && s.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(e) {
      this.collectedEnterElements.push(e);
    }
    markElementAsDisabled(e, n) {
      n
        ? this.disabledNodes.has(e) || (this.disabledNodes.add(e), Le(e, Sl))
        : this.disabledNodes.has(e) &&
          (this.disabledNodes.delete(e), Jn(e, Sl));
    }
    removeNode(e, n, r) {
      if (ls(n)) {
        let i = e ? this._fetchNamespace(e) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
        let o = this.namespacesByHostElement.get(n);
        o && o.id !== e && o.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(e, n, r, i, o) {
      this.collectedLeaveElements.push(n),
        (n[Xe] = {
          namespaceId: e,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: o,
        });
    }
    listen(e, n, r, i, o) {
      return ls(n) ? this._fetchNamespace(e).listen(n, r, i, o) : () => {};
    }
    _buildInstruction(e, n, r, i, o) {
      return e.transition.build(
        this.driver,
        e.element,
        e.fromState.value,
        e.toState.value,
        r,
        i,
        e.fromState.options,
        e.toState.options,
        n,
        o
      );
    }
    destroyInnerAnimations(e) {
      let n = this.driver.query(e, ds, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(e, Al, !0)),
          n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
    }
    destroyActiveAnimationsForElement(e) {
      let n = this.playersByElement.get(e);
      n &&
        n.forEach((r) => {
          r.queued ? (r.markedForDestroy = !0) : r.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(e) {
      let n = this.playersByQueriedElement.get(e);
      n && n.forEach((r) => r.finish());
    }
    whenRenderingDone() {
      return new Promise((e) => {
        if (this.players.length) return Vt(this.players).onDone(() => e());
        e();
      });
    }
    processLeaveNode(e) {
      let n = e[Xe];
      if (n && n.setForRemoval) {
        if (((e[Xe] = Nm), n.namespaceId)) {
          this.destroyInnerAnimations(e);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(e);
        }
        this._onRemovalComplete(e, n.setForRemoval);
      }
      e.classList?.contains(Sl) && this.markElementAsDisabled(e, !1),
        this.driver.query(e, vC, !0).forEach((r) => {
          this.markElementAsDisabled(r, !1);
        });
    }
    flush(e = -1) {
      let n = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((r, i) =>
            this._balanceNamespaceList(r, i)
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let r = 0; r < this.collectedEnterElements.length; r++) {
          let i = this.collectedEnterElements[r];
          Le(i, wC);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let r = [];
        try {
          n = this._flushAnimations(r, e);
        } finally {
          for (let i = 0; i < r.length; i++) r[i]();
        }
      } else
        for (let r = 0; r < this.collectedLeaveElements.length; r++) {
          let i = this.collectedLeaveElements[r];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((r) => r()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let r = this._whenQuietFns;
        (this._whenQuietFns = []),
          n.length
            ? Vt(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(e) {
      throw L0(e);
    }
    _flushAnimations(e, n) {
      let r = new si(),
        i = [],
        o = new Map(),
        s = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((E) => {
        u.add(E);
        let S = this.driver.query(E, yC, !0);
        for (let T = 0; T < S.length; T++) u.add(S[T]);
      });
      let d = this.bodyNode,
        f = Array.from(this.statesByElement.keys()),
        h = vm(f, this.collectedEnterElements),
        p = new Map(),
        g = 0;
      h.forEach((E, S) => {
        let T = Cm + g++;
        p.set(S, T), E.forEach((B) => Le(B, T));
      });
      let N = [],
        M = new Set(),
        V = new Set();
      for (let E = 0; E < this.collectedLeaveElements.length; E++) {
        let S = this.collectedLeaveElements[E],
          T = S[Xe];
        T &&
          T.setForRemoval &&
          (N.push(S),
          M.add(S),
          T.hasAnimation
            ? this.driver.query(S, DC, !0).forEach((B) => M.add(B))
            : V.add(S));
      }
      let K = new Map(),
        q = vm(f, Array.from(M));
      q.forEach((E, S) => {
        let T = xl + g++;
        K.set(S, T), E.forEach((B) => Le(B, T));
      }),
        e.push(() => {
          h.forEach((E, S) => {
            let T = p.get(S);
            E.forEach((B) => Jn(B, T));
          }),
            q.forEach((E, S) => {
              let T = K.get(S);
              E.forEach((B) => Jn(B, T));
            }),
            N.forEach((E) => {
              this.processLeaveNode(E);
            });
        });
      let de = [],
        re = [];
      for (let E = this._namespaceList.length - 1; E >= 0; E--)
        this._namespaceList[E].drainQueuedTransitions(n).forEach((T) => {
          let B = T.player,
            ce = T.element;
          if ((de.push(B), this.collectedEnterElements.length)) {
            let pe = ce[Xe];
            if (pe && pe.setForMove) {
              if (
                pe.previousTriggersValues &&
                pe.previousTriggersValues.has(T.triggerName)
              ) {
                let Bt = pe.previousTriggersValues.get(T.triggerName),
                  Ae = this.statesByElement.get(T.element);
                if (Ae && Ae.has(T.triggerName)) {
                  let pi = Ae.get(T.triggerName);
                  (pi.value = Bt), Ae.set(T.triggerName, pi);
                }
              }
              B.destroy();
              return;
            }
          }
          let Je = !d || !this.driver.containsElement(d, ce),
            _e = K.get(ce),
            bt = p.get(ce),
            Q = this._buildInstruction(T, r, bt, _e, Je);
          if (Q.errors && Q.errors.length) {
            re.push(Q);
            return;
          }
          if (Je) {
            B.onStart(() => dn(ce, Q.fromStyles)),
              B.onDestroy(() => ut(ce, Q.toStyles)),
              i.push(B);
            return;
          }
          if (T.isFallbackTransition) {
            B.onStart(() => dn(ce, Q.fromStyles)),
              B.onDestroy(() => ut(ce, Q.toStyles)),
              i.push(B);
            return;
          }
          let cu = [];
          Q.timelines.forEach((pe) => {
            (pe.stretchStartingKeyframe = !0),
              this.disabledNodes.has(pe.element) || cu.push(pe);
          }),
            (Q.timelines = cu),
            r.append(ce, Q.timelines);
          let ng = { instruction: Q, player: B, element: ce };
          s.push(ng),
            Q.queriedElements.forEach((pe) => xe(a, pe, []).push(B)),
            Q.preStyleProps.forEach((pe, Bt) => {
              if (pe.size) {
                let Ae = c.get(Bt);
                Ae || c.set(Bt, (Ae = new Set())),
                  pe.forEach((pi, Es) => Ae.add(Es));
              }
            }),
            Q.postStyleProps.forEach((pe, Bt) => {
              let Ae = l.get(Bt);
              Ae || l.set(Bt, (Ae = new Set())),
                pe.forEach((pi, Es) => Ae.add(Es));
            });
        });
      if (re.length) {
        let E = [];
        re.forEach((S) => {
          E.push(j0(S.triggerName, S.errors));
        }),
          de.forEach((S) => S.destroy()),
          this.reportError(E);
      }
      let se = new Map(),
        je = new Map();
      s.forEach((E) => {
        let S = E.element;
        r.has(S) &&
          (je.set(S, S),
          this._beforeAnimationBuild(E.player.namespaceId, E.instruction, se));
      }),
        i.forEach((E) => {
          let S = E.element;
          this._getPreviousPlayers(
            S,
            !1,
            E.namespaceId,
            E.triggerName,
            null
          ).forEach((B) => {
            xe(se, S, []).push(B), B.destroy();
          });
        });
      let Ve = N.filter((E) => wm(E, c, l)),
        dt = new Map();
      ym(dt, this.driver, V, l, lt).forEach((E) => {
        wm(E, c, l) && Ve.push(E);
      });
      let nr = new Map();
      h.forEach((E, S) => {
        ym(nr, this.driver, new Set(E), c, os);
      }),
        Ve.forEach((E) => {
          let S = dt.get(E),
            T = nr.get(E);
          dt.set(
            E,
            new Map([...(S?.entries() ?? []), ...(T?.entries() ?? [])])
          );
        });
      let $t = [],
        su = [],
        au = {};
      s.forEach((E) => {
        let { element: S, player: T, instruction: B } = E;
        if (r.has(S)) {
          if (u.has(S)) {
            T.onDestroy(() => ut(S, B.toStyles)),
              (T.disabled = !0),
              T.overrideTotalTime(B.totalTime),
              i.push(T);
            return;
          }
          let ce = au;
          if (je.size > 1) {
            let _e = S,
              bt = [];
            for (; (_e = _e.parentNode); ) {
              let Q = je.get(_e);
              if (Q) {
                ce = Q;
                break;
              }
              bt.push(_e);
            }
            bt.forEach((Q) => je.set(Q, ce));
          }
          let Je = this._buildAnimation(T.namespaceId, B, se, o, nr, dt);
          if ((T.setRealPlayer(Je), ce === au)) $t.push(T);
          else {
            let _e = this.playersByElement.get(ce);
            _e && _e.length && (T.parentPlayer = Vt(_e)), i.push(T);
          }
        } else
          dn(S, B.fromStyles),
            T.onDestroy(() => ut(S, B.toStyles)),
            su.push(T),
            u.has(S) && i.push(T);
      }),
        su.forEach((E) => {
          let S = o.get(E.element);
          if (S && S.length) {
            let T = Vt(S);
            E.setRealPlayer(T);
          }
        }),
        i.forEach((E) => {
          E.parentPlayer ? E.syncPlayerEvents(E.parentPlayer) : E.destroy();
        });
      for (let E = 0; E < N.length; E++) {
        let S = N[E],
          T = S[Xe];
        if ((Jn(S, xl), T && T.hasAnimation)) continue;
        let B = [];
        if (a.size) {
          let Je = a.get(S);
          Je && Je.length && B.push(...Je);
          let _e = this.driver.query(S, Al, !0);
          for (let bt = 0; bt < _e.length; bt++) {
            let Q = a.get(_e[bt]);
            Q && Q.length && B.push(...Q);
          }
        }
        let ce = B.filter((Je) => !Je.destroyed);
        ce.length ? SC(this, S, ce) : this.processLeaveNode(S);
      }
      return (
        (N.length = 0),
        $t.forEach((E) => {
          this.players.push(E),
            E.onDone(() => {
              E.destroy();
              let S = this.players.indexOf(E);
              this.players.splice(S, 1);
            }),
            E.play();
        }),
        $t
      );
    }
    afterFlush(e) {
      this._flushFns.push(e);
    }
    afterFlushAnimationsDone(e) {
      this._whenQuietFns.push(e);
    }
    _getPreviousPlayers(e, n, r, i, o) {
      let s = [];
      if (n) {
        let a = this.playersByQueriedElement.get(e);
        a && (s = a);
      } else {
        let a = this.playersByElement.get(e);
        if (a) {
          let c = !o || o == ii;
          a.forEach((l) => {
            l.queued || (!c && l.triggerName != i) || s.push(l);
          });
        }
      }
      return (
        (r || i) &&
          (s = s.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
          )),
        s
      );
    }
    _beforeAnimationBuild(e, n, r) {
      let i = n.triggerName,
        o = n.element,
        s = n.isRemovalTransition ? void 0 : e,
        a = n.isRemovalTransition ? void 0 : i;
      for (let c of n.timelines) {
        let l = c.element,
          u = l !== o,
          d = xe(r, l, []);
        this._getPreviousPlayers(l, u, s, a, n.toState).forEach((h) => {
          let p = h.getRealPlayer();
          p.beforeDestroy && p.beforeDestroy(), h.destroy(), d.push(h);
        });
      }
      dn(o, n.fromStyles);
    }
    _buildAnimation(e, n, r, i, o, s) {
      let a = n.triggerName,
        c = n.element,
        l = [],
        u = new Set(),
        d = new Set(),
        f = n.timelines.map((p) => {
          let g = p.element;
          u.add(g);
          let N = g[Xe];
          if (N && N.removedBeforeQueried) return new jt(p.duration, p.delay);
          let M = g !== c,
            V = TC((r.get(g) || bC).map((se) => se.getRealPlayer())).filter(
              (se) => {
                let je = se;
                return je.element ? je.element === g : !1;
              }
            ),
            K = o.get(g),
            q = s.get(g),
            de = Dm(this._normalizer, p.keyframes, K, q),
            re = this._buildPlayer(p, de, V);
          if ((p.subTimeline && i && d.add(g), M)) {
            let se = new ci(e, a, g);
            se.setRealPlayer(re), l.push(se);
          }
          return re;
        });
      l.forEach((p) => {
        xe(this.playersByQueriedElement, p.element, []).push(p),
          p.onDone(() => EC(this.playersByQueriedElement, p.element, p));
      }),
        u.forEach((p) => Le(p, lm));
      let h = Vt(f);
      return (
        h.onDestroy(() => {
          u.forEach((p) => Jn(p, lm)), ut(c, n.toStyles);
        }),
        d.forEach((p) => {
          xe(i, p, []).push(h);
        }),
        h
      );
    }
    _buildPlayer(e, n, r) {
      return n.length > 0
        ? this.driver.animate(e.element, n, e.duration, e.delay, e.easing, r)
        : new jt(e.duration, e.delay);
    }
  },
  ci = class {
    constructor(e, n, r) {
      (this.namespaceId = e),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new jt()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(e) {
      this._containsRealPlayer ||
        ((this._player = e),
        this._queuedCallbacks.forEach((n, r) => {
          n.forEach((i) => zl(e, r, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(e.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(e) {
      this.totalTime = e;
    }
    syncPlayerEvents(e) {
      let n = this._player;
      n.triggerCallback && e.onStart(() => n.triggerCallback("start")),
        e.onDone(() => this.finish()),
        e.onDestroy(() => this.destroy());
    }
    _queueEvent(e, n) {
      xe(this._queuedCallbacks, e, []).push(n);
    }
    onDone(e) {
      this.queued && this._queueEvent("done", e), this._player.onDone(e);
    }
    onStart(e) {
      this.queued && this._queueEvent("start", e), this._player.onStart(e);
    }
    onDestroy(e) {
      this.queued && this._queueEvent("destroy", e), this._player.onDestroy(e);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(e) {
      this.queued || this._player.setPosition(e);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(e) {
      let n = this._player;
      n.triggerCallback && n.triggerCallback(e);
    }
  };
function EC(t, e, n) {
  let r = t.get(e);
  if (r) {
    if (r.length) {
      let i = r.indexOf(n);
      r.splice(i, 1);
    }
    r.length == 0 && t.delete(e);
  }
  return r;
}
function CC(t) {
  return t ?? null;
}
function ls(t) {
  return t && t.nodeType === 1;
}
function IC(t) {
  return t == "start" || t == "done";
}
function gm(t, e) {
  let n = t.style.display;
  return (t.style.display = e ?? "none"), n;
}
function ym(t, e, n, r, i) {
  let o = [];
  n.forEach((c) => o.push(gm(c)));
  let s = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let f = e.computeStyle(l, d, i);
      u.set(d, f), (!f || f.length == 0) && ((l[Xe] = _C), s.push(l));
    }),
      t.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => gm(c, o[a++])), s;
}
function vm(t, e) {
  let n = new Map();
  if ((t.forEach((a) => n.set(a, [])), e.length == 0)) return n;
  let r = 1,
    i = new Set(e),
    o = new Map();
  function s(a) {
    if (!a) return r;
    let c = o.get(a);
    if (c) return c;
    let l = a.parentNode;
    return n.has(l) ? (c = l) : i.has(l) ? (c = r) : (c = s(l)), o.set(a, c), c;
  }
  return (
    e.forEach((a) => {
      let c = s(a);
      c !== r && n.get(c).push(a);
    }),
    n
  );
}
function Le(t, e) {
  t.classList?.add(e);
}
function Jn(t, e) {
  t.classList?.remove(e);
}
function SC(t, e, n) {
  Vt(n).onDone(() => t.processLeaveNode(e));
}
function TC(t) {
  let e = [];
  return Rm(t, e), e;
}
function Rm(t, e) {
  for (let n = 0; n < t.length; n++) {
    let r = t[n];
    r instanceof ni ? Rm(r.players, e) : e.push(r);
  }
}
function MC(t, e) {
  let n = Object.keys(t),
    r = Object.keys(e);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let o = n[i];
    if (!e.hasOwnProperty(o) || t[o] !== e[o]) return !1;
  }
  return !0;
}
function wm(t, e, n) {
  let r = n.get(t);
  if (!r) return !1;
  let i = e.get(t);
  return i ? r.forEach((o) => i.add(o)) : e.set(t, r), n.delete(t), !0;
}
var tr = class {
  constructor(e, n, r) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (i, o) => {}),
      (this._transitionEngine = new Ul(e.body, n, r)),
      (this._timelineEngine = new $l(e.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (i, o) =>
        this.onRemovalComplete(i, o));
  }
  registerTrigger(e, n, r, i, o) {
    let s = e + "-" + i,
      a = this._triggerCache[s];
    if (!a) {
      let c = [],
        l = [],
        u = xm(this._driver, o, c, l);
      if (c.length) throw T0(i, c);
      l.length && void 0,
        (a = pC(i, u, this._normalizer)),
        (this._triggerCache[s] = a);
    }
    this._transitionEngine.registerTrigger(n, i, a);
  }
  register(e, n) {
    this._transitionEngine.register(e, n);
  }
  destroy(e, n) {
    this._transitionEngine.destroy(e, n);
  }
  onInsert(e, n, r, i) {
    this._transitionEngine.insertNode(e, n, r, i);
  }
  onRemove(e, n, r) {
    this._transitionEngine.removeNode(e, n, r);
  }
  disableAnimations(e, n) {
    this._transitionEngine.markElementAsDisabled(e, n);
  }
  process(e, n, r, i) {
    if (r.charAt(0) == "@") {
      let [o, s] = am(r),
        a = i;
      this._timelineEngine.command(o, n, s, a);
    } else this._transitionEngine.trigger(e, n, r, i);
  }
  listen(e, n, r, i, o) {
    if (r.charAt(0) == "@") {
      let [s, a] = am(r);
      return this._timelineEngine.listen(s, n, a, o);
    }
    return this._transitionEngine.listen(e, n, r, i, o);
  }
  flush(e = -1) {
    this._transitionEngine.flush(e);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(e) {
    this._transitionEngine.afterFlushAnimationsDone(e);
  }
};
function xC(t, e) {
  let n = null,
    r = null;
  return (
    Array.isArray(e) && e.length
      ? ((n = Ml(e[0])), e.length > 1 && (r = Ml(e[e.length - 1])))
      : e instanceof Map && (n = Ml(e)),
    n || r ? new AC(t, n, r) : null
  );
}
var AC = (() => {
  let e = class e {
    constructor(r, i, o) {
      (this._element = r),
        (this._startStyles = i),
        (this._endStyles = o),
        (this._state = 0);
      let s = e.initialStylesByElement.get(r);
      s || e.initialStylesByElement.set(r, (s = new Map())),
        (this._initialStyles = s);
    }
    start() {
      this._state < 1 &&
        (this._startStyles &&
          ut(this._element, this._startStyles, this._initialStyles),
        (this._state = 1));
    }
    finish() {
      this.start(),
        this._state < 2 &&
          (ut(this._element, this._initialStyles),
          this._endStyles &&
            (ut(this._element, this._endStyles), (this._endStyles = null)),
          (this._state = 1));
    }
    destroy() {
      this.finish(),
        this._state < 3 &&
          (e.initialStylesByElement.delete(this._element),
          this._startStyles &&
            (dn(this._element, this._startStyles), (this._endStyles = null)),
          this._endStyles &&
            (dn(this._element, this._endStyles), (this._endStyles = null)),
          ut(this._element, this._initialStyles),
          (this._state = 3));
    }
  };
  e.initialStylesByElement = new WeakMap();
  let t = e;
  return t;
})();
function Ml(t) {
  let e = null;
  return (
    t.forEach((n, r) => {
      NC(r) && ((e = e || new Map()), e.set(r, n));
    }),
    e
  );
}
function NC(t) {
  return t === "display" || t === "position";
}
var ws = class {
    constructor(e, n, r, i) {
      (this.element = e),
        (this.keyframes = n),
        (this.options = r),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = r.duration),
        (this._delay = r.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((e) => e()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let e = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        e,
        this.options
      )),
        (this._finalKeyframe = e.length ? e[e.length - 1] : new Map());
      let n = () => this._onFinish();
      this.domPlayer.addEventListener("finish", n),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", n);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(e) {
      let n = [];
      return (
        e.forEach((r) => {
          n.push(Object.fromEntries(r));
        }),
        n
      );
    }
    _triggerWebAnimation(e, n, r) {
      return e.animate(this._convertKeyframesToObject(n), r);
    }
    onStart(e) {
      this._originalOnStartFns.push(e), this._onStartFns.push(e);
    }
    onDone(e) {
      this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
    }
    onDestroy(e) {
      this._onDestroyFns.push(e);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((e) => e()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((e) => e()),
        (this._onDestroyFns = []));
    }
    setPosition(e) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = e * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let e = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((r, i) => {
          i !== "offset" && e.set(i, this._finished ? r : Tm(this.element, i));
        }),
        (this.currentSnapshot = e);
    }
    triggerCallback(e) {
      let n = e === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  Ds = class {
    validateStyleProperty(e) {
      return !0;
    }
    validateAnimatableStyleProperty(e) {
      return !0;
    }
    matchesElement(e, n) {
      return !1;
    }
    containsElement(e, n) {
      return bm(e, n);
    }
    getParentElement(e) {
      return ql(e);
    }
    query(e, n, r) {
      return _m(e, n, r);
    }
    computeStyle(e, n, r) {
      return window.getComputedStyle(e)[n];
    }
    animate(e, n, r, i, o, s = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      o && (c.easing = o);
      let l = new Map(),
        u = s.filter((h) => h instanceof ws);
      Q0(r, i) &&
        u.forEach((h) => {
          h.currentSnapshot.forEach((p, g) => l.set(g, p));
        });
      let d = q0(n).map((h) => er(h));
      d = Y0(e, d, l);
      let f = xC(e, d);
      return new ws(e, d, c, f);
    }
  };
var us = "@",
  Om = "@.disabled",
  bs = class {
    constructor(e, n, r, i) {
      (this.namespaceId = e),
        (this.delegate = n),
        (this.engine = r),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(e) {
      this.delegate.destroyNode?.(e);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(e, n) {
      return this.delegate.createElement(e, n);
    }
    createComment(e) {
      return this.delegate.createComment(e);
    }
    createText(e) {
      return this.delegate.createText(e);
    }
    appendChild(e, n) {
      this.delegate.appendChild(e, n),
        this.engine.onInsert(this.namespaceId, n, e, !1);
    }
    insertBefore(e, n, r, i = !0) {
      this.delegate.insertBefore(e, n, r),
        this.engine.onInsert(this.namespaceId, n, e, i);
    }
    removeChild(e, n, r) {
      this.engine.onRemove(this.namespaceId, n, this.delegate);
    }
    selectRootElement(e, n) {
      return this.delegate.selectRootElement(e, n);
    }
    parentNode(e) {
      return this.delegate.parentNode(e);
    }
    nextSibling(e) {
      return this.delegate.nextSibling(e);
    }
    setAttribute(e, n, r, i) {
      this.delegate.setAttribute(e, n, r, i);
    }
    removeAttribute(e, n, r) {
      this.delegate.removeAttribute(e, n, r);
    }
    addClass(e, n) {
      this.delegate.addClass(e, n);
    }
    removeClass(e, n) {
      this.delegate.removeClass(e, n);
    }
    setStyle(e, n, r, i) {
      this.delegate.setStyle(e, n, r, i);
    }
    removeStyle(e, n, r) {
      this.delegate.removeStyle(e, n, r);
    }
    setProperty(e, n, r) {
      n.charAt(0) == us && n == Om
        ? this.disableAnimations(e, !!r)
        : this.delegate.setProperty(e, n, r);
    }
    setValue(e, n) {
      this.delegate.setValue(e, n);
    }
    listen(e, n, r) {
      return this.delegate.listen(e, n, r);
    }
    disableAnimations(e, n) {
      this.engine.disableAnimations(e, n);
    }
  },
  Hl = class extends bs {
    constructor(e, n, r, i, o) {
      super(n, r, i, o), (this.factory = e), (this.namespaceId = n);
    }
    setProperty(e, n, r) {
      n.charAt(0) == us
        ? n.charAt(1) == "." && n == Om
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(e, r))
          : this.engine.process(this.namespaceId, e, n.slice(1), r)
        : this.delegate.setProperty(e, n, r);
    }
    listen(e, n, r) {
      if (n.charAt(0) == us) {
        let i = RC(e),
          o = n.slice(1),
          s = "";
        return (
          o.charAt(0) != us && ([o, s] = OC(o)),
          this.engine.listen(this.namespaceId, i, o, s, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(e, n, r);
    }
  };
function RC(t) {
  switch (t) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return t;
  }
}
function OC(t) {
  let e = t.indexOf("."),
    n = t.substring(0, e),
    r = t.slice(e + 1);
  return [n, r];
}
var _s = class {
  constructor(e, n, r) {
    (this.delegate = e),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, o) => {
        let s = o?.parentNode(i);
        s && o.removeChild(s, i);
      });
  }
  createRenderer(e, n) {
    let r = "",
      i = this.delegate.createRenderer(e, n);
    if (!e || !n?.data?.animation) {
      let l = this._rendererCache,
        u = l.get(i);
      if (!u) {
        let d = () => l.delete(i);
        (u = new bs(r, i, this.engine, d)), l.set(i, u);
      }
      return u;
    }
    let o = n.id,
      s = n.id + "-" + this._currentId;
    this._currentId++, this.engine.register(s, e);
    let a = (l) => {
      Array.isArray(l)
        ? l.forEach(a)
        : this.engine.registerTrigger(o, s, e, l.name, l);
    };
    return n.data.animation.forEach(a), new Hl(this, s, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(e, n, r) {
    if (e >= 0 && e < this._microtaskId) {
      this._zone.run(() => n(r));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((o) => {
            let [s, a] = o;
            s(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([n, r]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var kC = (() => {
  let e = class e extends tr {
    constructor(r, i, o, s) {
      super(r, i, o);
    }
    ngOnDestroy() {
      this.flush();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(ne), y(li), y(fn), y(Rt));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function FC() {
  return new ps();
}
function LC(t, e, n) {
  return new _s(t, e, n);
}
var km = [
    { provide: fn, useFactory: FC },
    { provide: tr, useClass: kC },
    { provide: Jt, useFactory: LC, deps: [jo, tr, U] },
  ],
  Pm = [
    { provide: li, useFactory: () => new Ds() },
    { provide: Do, useValue: "BrowserAnimations" },
    ...km,
  ],
  jC = [
    { provide: li, useClass: Gl },
    { provide: Do, useValue: "NoopAnimations" },
    ...km,
  ],
  Fm = (() => {
    let e = class e {
      static withConfig(r) {
        return { ngModule: e, providers: r.disableAnimations ? jC : Pm };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({ providers: Pm, imports: [$o] }));
    let t = e;
    return t;
  })();
var Yl;
try {
  Yl = typeof Intl < "u" && Intl.v8BreakIterator;
} catch {
  Yl = !1;
}
var fi = (() => {
  let e = class e {
    constructor(r) {
      (this._platformId = r),
        (this.isBrowser = this._platformId
          ? Yh(this._platformId)
          : typeof document == "object" && !!document),
        (this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent)),
        (this.TRIDENT =
          this.isBrowser && /(msie|trident)/i.test(navigator.userAgent)),
        (this.BLINK =
          this.isBrowser &&
          !!(window.chrome || Yl) &&
          typeof CSS < "u" &&
          !this.EDGE &&
          !this.TRIDENT),
        (this.WEBKIT =
          this.isBrowser &&
          /AppleWebKit/i.test(navigator.userAgent) &&
          !this.BLINK &&
          !this.EDGE &&
          !this.TRIDENT),
        (this.IOS =
          this.isBrowser &&
          /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !("MSStream" in window)),
        (this.FIREFOX =
          this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent)),
        (this.ANDROID =
          this.isBrowser &&
          /android/i.test(navigator.userAgent) &&
          !this.TRIDENT),
        (this.SAFARI =
          this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y(yt));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var di;
function VC() {
  if (di == null && typeof window < "u")
    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", { get: () => (di = !0) })
      );
    } finally {
      di = di || !1;
    }
  return di;
}
function Zl(t) {
  return VC() ? t : !!t.capture;
}
function Lm(t) {
  return t.composedPath ? t.composedPath()[0] : t.target;
}
function jm() {
  return (
    (typeof __karma__ < "u" && !!__karma__) ||
    (typeof jasmine < "u" && !!jasmine) ||
    (typeof jest < "u" && !!jest) ||
    (typeof Mocha < "u" && !!Mocha)
  );
}
function Xl(t) {
  return Array.isArray(t) ? t : [t];
}
function Jl(t) {
  return t instanceof Ze ? t.nativeElement : t;
}
var $m = new Set(),
  hn,
  $C = (() => {
    let e = class e {
      constructor(r, i) {
        (this._platform = r),
          (this._nonce = i),
          (this._matchMedia =
            this._platform.isBrowser && window.matchMedia
              ? window.matchMedia.bind(window)
              : UC);
      }
      matchMedia(r) {
        return (
          (this._platform.WEBKIT || this._platform.BLINK) && BC(r, this._nonce),
          this._matchMedia(r)
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(fi), y(Ir, 8));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function BC(t, e) {
  if (!$m.has(t))
    try {
      hn ||
        ((hn = document.createElement("style")),
        e && (hn.nonce = e),
        hn.setAttribute("type", "text/css"),
        document.head.appendChild(hn)),
        hn.sheet &&
          (hn.sheet.insertRule(`@media ${t} {body{ }}`, 0), $m.add(t));
    } catch (n) {
      console.error(n);
    }
}
function UC(t) {
  return {
    matches: t === "all" || t === "",
    media: t,
    addListener: () => {},
    removeListener: () => {},
  };
}
var Um = (() => {
  let e = class e {
    constructor(r, i) {
      (this._mediaMatcher = r),
        (this._zone = i),
        (this._queries = new Map()),
        (this._destroySubject = new me());
    }
    ngOnDestroy() {
      this._destroySubject.next(), this._destroySubject.complete();
    }
    isMatched(r) {
      return Bm(Xl(r)).some((o) => this._registerQuery(o).mql.matches);
    }
    observe(r) {
      let o = Bm(Xl(r)).map((a) => this._registerQuery(a).observable),
        s = qt(o);
      return (
        (s = Et(s.pipe(Be(1)), s.pipe(Hs(1), Vs(0)))),
        s.pipe(
          F((a) => {
            let c = { matches: !1, breakpoints: {} };
            return (
              a.forEach(({ matches: l, query: u }) => {
                (c.matches = c.matches || l), (c.breakpoints[u] = l);
              }),
              c
            );
          })
        )
      );
    }
    _registerQuery(r) {
      if (this._queries.has(r)) return this._queries.get(r);
      let i = this._mediaMatcher.matchMedia(r),
        s = {
          observable: new z((a) => {
            let c = (l) => this._zone.run(() => a.next(l));
            return (
              i.addListener(c),
              () => {
                i.removeListener(c);
              }
            );
          }).pipe(
            sr(i),
            F(({ matches: a }) => ({ query: r, matches: a })),
            ar(this._destroySubject)
          ),
          mql: i,
        };
      return this._queries.set(r, s), s;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(y($C), y(U));
  }),
    (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Bm(t) {
  return t
    .map((e) => e.split(","))
    .reduce((e, n) => e.concat(n))
    .map((e) => e.trim());
}
function Wm(t) {
  return t.buttons === 0 || t.detail === 0;
}
function qm(t) {
  let e =
    (t.touches && t.touches[0]) || (t.changedTouches && t.changedTouches[0]);
  return (
    !!e &&
    e.identifier === -1 &&
    (e.radiusX == null || e.radiusX === 1) &&
    (e.radiusY == null || e.radiusY === 1)
  );
}
var Hm = "cdk-high-contrast-black-on-white",
  zm = "cdk-high-contrast-white-on-black",
  eu = "cdk-high-contrast-active",
  Gm = (() => {
    let e = class e {
      constructor(r, i) {
        (this._platform = r),
          (this._document = i),
          (this._breakpointSubscription = w(Um)
            .observe("(forced-colors: active)")
            .subscribe(() => {
              this._hasCheckedHighContrastMode &&
                ((this._hasCheckedHighContrastMode = !1),
                this._applyBodyHighContrastModeCssClasses());
            }));
      }
      getHighContrastMode() {
        if (!this._platform.isBrowser) return 0;
        let r = this._document.createElement("div");
        (r.style.backgroundColor = "rgb(1,2,3)"),
          (r.style.position = "absolute"),
          this._document.body.appendChild(r);
        let i = this._document.defaultView || window,
          o = i && i.getComputedStyle ? i.getComputedStyle(r) : null,
          s = ((o && o.backgroundColor) || "").replace(/ /g, "");
        switch ((r.remove(), s)) {
          case "rgb(0,0,0)":
          case "rgb(45,50,54)":
          case "rgb(32,32,32)":
            return 2;
          case "rgb(255,255,255)":
          case "rgb(255,250,239)":
            return 1;
        }
        return 0;
      }
      ngOnDestroy() {
        this._breakpointSubscription.unsubscribe();
      }
      _applyBodyHighContrastModeCssClasses() {
        if (
          !this._hasCheckedHighContrastMode &&
          this._platform.isBrowser &&
          this._document.body
        ) {
          let r = this._document.body.classList;
          r.remove(eu, Hm, zm), (this._hasCheckedHighContrastMode = !0);
          let i = this.getHighContrastMode();
          i === 1 ? r.add(eu, Hm) : i === 2 && r.add(eu, zm);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(fi), y(ne));
    }),
      (e.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var tu = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Z({ type: e })),
    (e.ɵinj = Y({}));
  let t = e;
  return t;
})();
function KC() {
  return !0;
}
var QC = new x("mat-sanity-checks", { providedIn: "root", factory: KC }),
  iu = (() => {
    let e = class e {
      constructor(r, i, o) {
        (this._sanityChecks = i),
          (this._document = o),
          (this._hasDoneGlobalChecks = !1),
          r._applyBodyHighContrastModeCssClasses(),
          this._hasDoneGlobalChecks || (this._hasDoneGlobalChecks = !0);
      }
      _checkIsEnabled(r) {
        return jm()
          ? !1
          : typeof this._sanityChecks == "boolean"
          ? this._sanityChecks
          : !!this._sanityChecks[r];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(y(Gm), y(QC, 8), y(ne));
    }),
      (e.ɵmod = Z({ type: e })),
      (e.ɵinj = Y({ imports: [tu, tu] }));
    let t = e;
    return t;
  })();
var nu = class {
    constructor(e, n, r, i = !1) {
      (this._renderer = e),
        (this.element = n),
        (this.config = r),
        (this._animationForciblyDisabledThroughCss = i),
        (this.state = 3);
    }
    fadeOut() {
      this._renderer.fadeOutRipple(this);
    }
  },
  Km = Zl({ passive: !0, capture: !0 }),
  ru = class {
    constructor() {
      (this._events = new Map()),
        (this._delegateEventHandler = (e) => {
          let n = Lm(e);
          n &&
            this._events.get(e.type)?.forEach((r, i) => {
              (i === n || i.contains(n)) && r.forEach((o) => o.handleEvent(e));
            });
        });
    }
    addHandler(e, n, r, i) {
      let o = this._events.get(n);
      if (o) {
        let s = o.get(r);
        s ? s.add(i) : o.set(r, new Set([i]));
      } else
        this._events.set(n, new Map([[r, new Set([i])]])),
          e.runOutsideAngular(() => {
            document.addEventListener(n, this._delegateEventHandler, Km);
          });
    }
    removeHandler(e, n, r) {
      let i = this._events.get(e);
      if (!i) return;
      let o = i.get(n);
      o &&
        (o.delete(r),
        o.size === 0 && i.delete(n),
        i.size === 0 &&
          (this._events.delete(e),
          document.removeEventListener(e, this._delegateEventHandler, Km)));
    }
  },
  Qm = { enterDuration: 225, exitDuration: 150 },
  YC = 800,
  Ym = Zl({ passive: !0, capture: !0 }),
  Zm = ["mousedown", "touchstart"],
  Xm = ["mouseup", "mouseleave", "touchend", "touchcancel"],
  hi = class hi {
    constructor(e, n, r, i) {
      (this._target = e),
        (this._ngZone = n),
        (this._platform = i),
        (this._isPointerDown = !1),
        (this._activeRipples = new Map()),
        (this._pointerUpEventsRegistered = !1),
        i.isBrowser && (this._containerElement = Jl(r));
    }
    fadeInRipple(e, n, r = {}) {
      let i = (this._containerRect =
          this._containerRect ||
          this._containerElement.getBoundingClientRect()),
        o = _(_({}, Qm), r.animation);
      r.centered && ((e = i.left + i.width / 2), (n = i.top + i.height / 2));
      let s = r.radius || ZC(e, n, i),
        a = e - i.left,
        c = n - i.top,
        l = o.enterDuration,
        u = document.createElement("div");
      u.classList.add("mat-ripple-element"),
        (u.style.left = `${a - s}px`),
        (u.style.top = `${c - s}px`),
        (u.style.height = `${s * 2}px`),
        (u.style.width = `${s * 2}px`),
        r.color != null && (u.style.backgroundColor = r.color),
        (u.style.transitionDuration = `${l}ms`),
        this._containerElement.appendChild(u);
      let d = window.getComputedStyle(u),
        f = d.transitionProperty,
        h = d.transitionDuration,
        p =
          f === "none" ||
          h === "0s" ||
          h === "0s, 0s" ||
          (i.width === 0 && i.height === 0),
        g = new nu(this, u, r, p);
      (u.style.transform = "scale3d(1, 1, 1)"),
        (g.state = 0),
        r.persistent || (this._mostRecentTransientRipple = g);
      let N = null;
      return (
        !p &&
          (l || o.exitDuration) &&
          this._ngZone.runOutsideAngular(() => {
            let M = () => this._finishRippleTransition(g),
              V = () => this._destroyRipple(g);
            u.addEventListener("transitionend", M),
              u.addEventListener("transitioncancel", V),
              (N = { onTransitionEnd: M, onTransitionCancel: V });
          }),
        this._activeRipples.set(g, N),
        (p || !l) && this._finishRippleTransition(g),
        g
      );
    }
    fadeOutRipple(e) {
      if (e.state === 2 || e.state === 3) return;
      let n = e.element,
        r = _(_({}, Qm), e.config.animation);
      (n.style.transitionDuration = `${r.exitDuration}ms`),
        (n.style.opacity = "0"),
        (e.state = 2),
        (e._animationForciblyDisabledThroughCss || !r.exitDuration) &&
          this._finishRippleTransition(e);
    }
    fadeOutAll() {
      this._getActiveRipples().forEach((e) => e.fadeOut());
    }
    fadeOutAllNonPersistent() {
      this._getActiveRipples().forEach((e) => {
        e.config.persistent || e.fadeOut();
      });
    }
    setupTriggerEvents(e) {
      let n = Jl(e);
      !this._platform.isBrowser ||
        !n ||
        n === this._triggerElement ||
        (this._removeTriggerEvents(),
        (this._triggerElement = n),
        Zm.forEach((r) => {
          hi._eventManager.addHandler(this._ngZone, r, n, this);
        }));
    }
    handleEvent(e) {
      e.type === "mousedown"
        ? this._onMousedown(e)
        : e.type === "touchstart"
        ? this._onTouchStart(e)
        : this._onPointerUp(),
        this._pointerUpEventsRegistered ||
          (this._ngZone.runOutsideAngular(() => {
            Xm.forEach((n) => {
              this._triggerElement.addEventListener(n, this, Ym);
            });
          }),
          (this._pointerUpEventsRegistered = !0));
    }
    _finishRippleTransition(e) {
      e.state === 0
        ? this._startFadeOutTransition(e)
        : e.state === 2 && this._destroyRipple(e);
    }
    _startFadeOutTransition(e) {
      let n = e === this._mostRecentTransientRipple,
        { persistent: r } = e.config;
      (e.state = 1), !r && (!n || !this._isPointerDown) && e.fadeOut();
    }
    _destroyRipple(e) {
      let n = this._activeRipples.get(e) ?? null;
      this._activeRipples.delete(e),
        this._activeRipples.size || (this._containerRect = null),
        e === this._mostRecentTransientRipple &&
          (this._mostRecentTransientRipple = null),
        (e.state = 3),
        n !== null &&
          (e.element.removeEventListener("transitionend", n.onTransitionEnd),
          e.element.removeEventListener(
            "transitioncancel",
            n.onTransitionCancel
          )),
        e.element.remove();
    }
    _onMousedown(e) {
      let n = Wm(e),
        r =
          this._lastTouchStartEvent &&
          Date.now() < this._lastTouchStartEvent + YC;
      !this._target.rippleDisabled &&
        !n &&
        !r &&
        ((this._isPointerDown = !0),
        this.fadeInRipple(e.clientX, e.clientY, this._target.rippleConfig));
    }
    _onTouchStart(e) {
      if (!this._target.rippleDisabled && !qm(e)) {
        (this._lastTouchStartEvent = Date.now()), (this._isPointerDown = !0);
        let n = e.changedTouches;
        if (n)
          for (let r = 0; r < n.length; r++)
            this.fadeInRipple(
              n[r].clientX,
              n[r].clientY,
              this._target.rippleConfig
            );
      }
    }
    _onPointerUp() {
      this._isPointerDown &&
        ((this._isPointerDown = !1),
        this._getActiveRipples().forEach((e) => {
          let n =
            e.state === 1 || (e.config.terminateOnPointerUp && e.state === 0);
          !e.config.persistent && n && e.fadeOut();
        }));
    }
    _getActiveRipples() {
      return Array.from(this._activeRipples.keys());
    }
    _removeTriggerEvents() {
      let e = this._triggerElement;
      e &&
        (Zm.forEach((n) => hi._eventManager.removeHandler(n, e, this)),
        this._pointerUpEventsRegistered &&
          Xm.forEach((n) => e.removeEventListener(n, this, Ym)));
    }
  };
hi._eventManager = new ru();
var Jm = hi;
function ZC(t, e, n) {
  let r = Math.max(Math.abs(t - n.left), Math.abs(t - n.right)),
    i = Math.max(Math.abs(e - n.top), Math.abs(e - n.bottom));
  return Math.sqrt(r * r + i * i);
}
var eg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Z({ type: e })),
    (e.ɵinj = Y({ imports: [iu, iu] }));
  let t = e;
  return t;
})();
var tg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Z({ type: e, bootstrap: [im] })),
    (e.ɵinj = Y({ imports: [$o, nm, Fm, eg] }));
  let t = e;
  return t;
})();
ip()
  .bootstrapModule(tg)
  .catch((t) => console.error(t));
