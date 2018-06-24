/* eslint-disable id-match, no-use-before-define */
const FL = require('fantasy-land')
const show = require('sanctuary-show')


const ø = Symbol('value')
const type = Symbol('type')

function isNullable(value) {
  return value === null || typeof value === 'undefined' || Number.isNaN(value)
}

function Some(value) {
  if (!(this instanceof Some)) {
    return new Some(value)
  }
  this[ø] = value
  this[type] = 'Some'
}

Some.of = (value) => new Some(value)

Object.assign(Some.prototype, {
  map(ƒ) {
    return Some.of(ƒ(this[ø]))
  },

  ap(option) {
    return option.chain((ƒ) => this.map(ƒ))
  },

  chain(ƒ) {
    return ƒ(this[ø])
  },

  equals(option) {
    return option.map((value) => value === this[ø]).extractOr(false)
  },

  filter(ƒ) {
    return this.chain((value) => ƒ(value) ? Some.of(value) : Option.zero())
  },

  alt(/* option */) {
    return this
  },

  extend(ƒ) {
    return Some.of(ƒ(this))
  },


  mapOr(value, ƒ) {
    return this.map(ƒ)
  },

  mapOrElse(defaultƒ, mapƒ) {
    return this.map(mapƒ)
  },

  exists(ƒ) {
    return Boolean(ƒ(this[ø]))
  },

  or(/* option */) {
    return this
  },

  orElse(/* optionƒ */) {
    return this
  },

  and(option) {
    return option
  },

  andThen(optionƒ) {
    return optionƒ()
  },

  extractOr(/* defaultValue */) {
    return this[ø]
  },

  extractOrElse(/* defaultƒ */) {
    return this[ø]
  },

  * iter() {
    yield this[ø]
  },

  isSome() {
    return true
  },

  isNone() {
    return false
  },

  okOr(/* err */) {
    return Ok.of(this[ø])
  },

  okOrElse(/* errƒ */) {
    return Ok.of(this[ø])
  },

  '@@show': function __show() {
    return `Some(${show(this[ø])})`
  },

  of: Some.of,

  toString() {
    return `Some(${this[ø]})`
  },

  inspect() {
    return this.toString()
  },
})

const nothing = Symbol('None')

function None() {
  if (!(this instanceof None)) {
    return new None()
  }
  this[ø] = nothing
  this[type] = 'None'
}

None.of = () => new None()

Object.assign(None.prototype, {

  map(/* ƒ */) {
    return None.of()
  },

  ap(/* option */) {
    return None.of()
  },

  chain(/* ƒ */) {
    return None.of()
  },

  equals(option) {
    return option.map(() => false).extractOr(true)
  },

  filter(/* ƒ */) {
    return None.of()
  },

  alt(option) {
    return option
  },

  extend(/* ƒ */) {
    return None.of()
  },


  mapOr(value /* ƒ */) {
    return Some.of(value)
  },

  mapOrElse(defaultƒ /* mapƒ */) {
    return Some.of(defaultƒ())
  },

  exists(/* ƒ */) {
    return false
  },

  or(option) {
    return option
  },

  orElse(optionƒ) {
    return optionƒ()
  },

  and(/* option */) {
    return this
  },

  andThen(/* optionƒ */) {
    return this
  },

  extractOr(defaultValue) {
    return defaultValue
  },

  extractOrElse(defaultƒ) {
    return defaultƒ()
  },

  * iter() {
    // nothing yields
  },

  isSome() {
    return false
  },

  isNone() {
    return true
  },

  okOr(errValue) {
    return Err.of(errValue)
  },

  okOrElse(errƒ) {
    return Err.of(errƒ())
  },

  '@@show': function __show() {
    return 'None()'
  },

  toString() {
    return 'None()'
  },

  inspect() {
    return this.toString()
  },

  of: None.of,
})

function option$is(value) {
  return value instanceof Some || value instanceof None
}

function option$into(value) {
  return option$is(value)
    ? value
    : Some.of(value)
}

function option$encase(ƒ) {
  return function encased(...args) {
    try {
      return Some.of(ƒ.apply(this, args))
    }
    catch (error) {
      return None.of()
    }
  }
}

function option$fromNullable(value) {
  return isNullable(value)
    ? None.of()
    : Some.of(value)
}

const Option = {
  encase: option$encase,
  fromNullable: option$fromNullable,
  into: option$into,
  is: option$is,
  none: None.of,
  of: Some.of,
  some: Some.of,
  zero: None.of,
}

Some.prototype[FL.equals] = Some.prototype.equals
Some.prototype[FL.map] = Some.prototype.map
Some.prototype[FL.ap] = Some.prototype.ap
Some.prototype[FL.alt] = Some.prototype.or
Some.prototype[FL.chain] = Some.prototype.chain
Some.prototype[FL.extend] = Some.prototype.extend
Some[FL.of] = Some.of
Some[FL.zero] = Option.zero

None.prototype[FL.equals] = None.prototype.equals
None.prototype[FL.map] = None.prototype.map
None.prototype[FL.ap] = None.prototype.ap
None.prototype[FL.alt] = None.prototype.or
None.prototype[FL.chain] = None.prototype.chain
None.prototype[FL.extend] = None.prototype.extend
None[FL.of] = None.of
None[FL.zero] = Option.zero

function Ok(value) {
  if (!(this instanceof Ok)) {
    return new Ok(value)
  }
  this[ø] = value
  this[type] = 'Ok'
}

Ok.of = (value) => new Ok(value)

Ok.prototype = {

  map(okƒ) {
    return Ok.of(okƒ(this[ø]))
  },

  mapOr(value, okƒ) {
    return this.map(okƒ)
  },

  mapOrElse(defaultƒ, mapƒ) {
    return this.map(mapƒ)
  },

  mapErr(/* errƒ */) {
    return this
  },

  mapErrOr(value /* errƒ */) {
    return Err.of(value)
  },

  mapErrOrElse(defaultƒ /* errƒ */) {
    return Err.of(defaultƒ())
  },

  chain(okƒ) {
    return okƒ(this[ø])
  },

  chainErr(/* æƒ */) {
    return this
  },

  ap(result) {
    return result.chain((ƒ) => this.map(ƒ))
  },

  apErr(/* result */) {
    return this
  },

  equals(result) {
    return result.map((value) => value === this[ø]).extractOr(false)
  },

  extractOr(/* defaultValue */) {
    return this[ø]
  },

  extractOrElse(/* defaultƒ */) {
    return this[ø]
  },

  extractErrOr(defaultValue) {
    return defaultValue
  },

  extractErrOrElse(defaultƒ) {
    return defaultƒ()
  },

  * iter() {
    yield this[ø]
  },

  * iterErr() {
    yield this[ø]
  },

  swap() {
    return Err.of(this[ø])
  },

  promise() {
    return Promise.resolve(this[ø])
  },

  either(okƒ /* errƒ */) {
    return okƒ(this[ø])
  },

  bimap(okƒ /* errƒ */) {
    return this.map(okƒ)
  },

  isOk() {
    return true
  },

  isErr() {
    return false
  },

  ok() {
    return Some.of(this[ø])
  },

  err() {
    return None.of()
  },
}

function Err(value) {
  if (!(this instanceof Err)) {
    return new Err(value)
  }
  this[ø] = value
  this[type] = 'Err'
}

Err.of = (value) => new Err(value)

Err.prototype = {

  map(/* okƒ */) {
    return this
  },

  mapOr(value /* okƒ */) {
    return Ok.of(value)
  },

  mapOrElse(defaultƒ /* okƒ */) {
    return Ok.of(defaultƒ())
  },

  mapErr(errƒ) {
    return Err.of(errƒ(this[ø]))
  },

  mapErrOr(value, errƒ) {
    return this.mapErr(errƒ)
  },

  mapErrOrElse(defaultƒ, errƒ) {
    return this.mapErr(errƒ)
  },

  chain(/* okƒ */) {
    return this
  },

  chainErr(errƒ) {
    return errƒ(this[ø])
  },

  ap(/* result */) {
    return this
  },

  apErr(result) {
    return result.chain((ƒ) => this.mapErr(ƒ))
  },

  equals(result) {
    return result.mapErr((value) => value === this[ø]).extractErrOr(false)
  },

  extractOr(defaultValue) {
    return defaultValue
  },

  extractOrElse(defaultƒ) {
    return defaultƒ()
  },

  extractErrOr(/* defaultValue */) {
    return this[ø]
  },

  extractErrOrElse(/* defaultƒ */) {
    return this[ø]
  },

  * iter() {
    // nothing yields
  },

  * iterErr() {
    yield this[ø]
  },

  swap() {
    return Ok.of(this[ø])
  },

  promise() {
    return Promise.reject(this[ø])
  },

  either(okƒ, errƒ) {
    return errƒ(this[ø])
  },

  bimap(okƒ, errƒ) {
    return this.mapErr(errƒ)
  },

  isOk() {
    return false
  },

  isErr() {
    return true
  },

  ok() {
    return None.of()
  },

  err() {
    return Some.of(this[ø])
  },
}

function result$is(value) {
  return value instanceof Ok || value instanceof Err
}

function result$encase(ƒ) {
  return function encased(...args) {
    try {
      return Ok.of(ƒ.apply(this, args))
    }
    catch (error) {
      return Err.of(error)
    }
  }
}

function result$into(value) {
  return result$is(value)
    ? value
    : Ok.of(value)
}

const Result = {
  ok: Ok.of,
  err: Err.of,
  is: result$is,
  into: result$into,
  encase: result$encase,
}

module.exports = {
  Some,
  None,
  Option,

  Ok,
  Err,
  Result,
}
