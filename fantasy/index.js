/* eslint-disable id-match, no-use-before-define */

const ø = Symbol('ø')


function isNullable(value) {
  return value === null || typeof value === 'undefined' || Number.isNaN(value)
}

class Some {
  constructor(value) {
    this[ø] = value
  }

  static of(value) {
    return new Some(value)
  }

  static zero() {
    return new None()
  }

  map(ƒ) {
    return Some.of(ƒ(this[ø]))
  }

  ap(option) {
    return option.chain((ƒ) => this.map(ƒ))
  }

  chain(ƒ) {
    return ƒ(this[ø])
  }

  equals(option) {
    return option.map((value) => value === this[ø]).extractOr(false)
  }

  filter(ƒ) {
    return this.chain((value) => ƒ(value) ? Some.of(value) : Some.zero())
  }

  alt(option) {
    return option
  }

  extend(ƒ) {
    return Some.of(ƒ(this[ø]))
  }


  mapOr(value, ƒ) {
    return this.map(ƒ)
  }

  mapOrElse(defaultƒ, mapƒ) {
    return this.map(mapƒ)
  }

  flatmap(optionƒ) {
    return optionƒ(this[ø])
  }

  or(/* option */) {
    return this
  }

  orElse(/* optionƒ */) {
    return this
  }

  extractOr(/* defaultValue */) {
    return this[ø]
  }

  extractOrElse(/* defaultƒ */) {
    return this[ø]
  }

  * iter() {
    yield this[ø]
  }

  isSome() {
    return true
  }

  isNone() {
    return false
  }

  okOr(/* err */) {
    return Ok.of(this[ø])
  }

  okOrElse(/* errƒ */) {
    return Ok.of(this[ø])
  }

  transpose() {
    return isNullable(this[ø])
      ? None.of()
      : this
  }
}

class None {
  static of(/* value */) {
    return new None()
  }

  static zero() {
    return new None()
  }

  map(/* ƒ */) {
    return None.of()
  }

  ap(/* option */) {
    return None.of()
  }

  chain(/* ƒ */) {
    return None.of()
  }

  equals(option) {
    return option.map(() => false).extractOr(true)
  }

  filter(/* ƒ */) {
    return None.of()
  }

  alt(/* option */) {
    return None.of()
  }

  extend(/* ƒ */) {
    return None.of()
  }


  mapOr(value /* ƒ */) {
    return Some.of(value)
  }

  mapOrElse(defaultƒ /* mapƒ */) {
    return Some.of(defaultƒ())
  }

  flatmap(/* optionƒ */) {
    return None.of()
  }

  or(option) {
    return option
  }

  orElse(optionƒ) {
    return optionƒ()
  }

  extractOr(defaultValue) {
    return defaultValue
  }

  extractOrElse(defaultƒ) {
    return defaultƒ()
  }

  * iter() {
    // nothing yields
  }

  isSome() {
    return false
  }

  isNone() {
    return true
  }

  okOr(errValue) {
    return Err.of(errValue)
  }

  okOrElse(errƒ) {
    return Err.of(errƒ())
  }

  transpose() {
    return this
  }
}

function option$is(value) {
  return value instanceof Some || value instanceof None
}

function option$into(value) {
  return isNullable(value)
    ? None.of()
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

const Option = {
  some: Some.of,
  none: None.of,
  is: option$is,
  into: option$into,
  encase: option$encase,
}


class Ok {
  static of(value) {
    return new Ok(value)
  }

  constructor(value) {
    this[ø] = value
  }

  map(okƒ) {
    return Ok.of(okƒ(this[ø]))
  }

  mapOr(value, okƒ) {
    return this.map(okƒ)
  }

  mapOrElse(defaultƒ, mapƒ) {
    return this.map(mapƒ)
  }

  mapErr(/* errƒ */) {
    return this
  }

  mapErrOr(value /* errƒ */) {
    return Err.of(value)
  }

  mapErrOrElse(defaultƒ /* errƒ */) {
    return Err.of(defaultƒ())
  }

  chain(okƒ) {
    return okƒ(this[ø])
  }

  chainErr(/* æƒ */) {
    return this
  }

  flatmap(okƒ) {
    return okƒ(this[ø])
  }

  flatmapErr(/* errƒ */) {
    return this
  }

  ap(result) {
    return result.chain((ƒ) => this.map(ƒ))
  }

  apErr(/* result */) {
    return this
  }

  equals(result) {
    return result.map((value) => value === this[ø]).extractOr(false)
  }

  extractOr(/* defaultValue */) {
    return this[ø]
  }

  extractErrOr(defaultValue) {
    return defaultValue
  }

  * iter() {
    yield this[ø]
  }

  * iterErr() {
    yield this[ø]
  }

  swap() {
    return Err.of(this[ø])
  }

  promise() {
    return Promise.resolve(this[ø])
  }

  either(okƒ /* errƒ */) {
    return okƒ(this[ø])
  }

  bimap(okƒ /* errƒ */) {
    return this.map(okƒ)
  }

  isOk() {
    return true
  }

  isErr() {
    return false
  }

  ok() {
    return Some.of(this[ø])
  }

  err() {
    return None.of()
  }
}


class Err {
  static of(value) {
    return new Err(value)
  }

  constructor(value) {
    this[ø] = value
  }

  map(/* okƒ */) {
    return this
  }

  mapOr(value /* okƒ */) {
    return Ok.of(value)
  }

  mapOrElse(defaultƒ /* okƒ */) {
    return Ok.of(defaultƒ())
  }

  mapErr(errƒ) {
    return Err.of(errƒ(this[ø]))
  }

  mapErrOr(value, errƒ) {
    return this.mapErr(errƒ)
  }

  mapErrOrElse(defaultƒ, errƒ) {
    return this.mapErr(errƒ)
  }

  chain(/* okƒ */) {
    return this
  }

  chainErr(errƒ) {
    return errƒ(this[ø])
  }

  flatmap(/* okƒ */) {
    return this
  }

  flatmapErr(errƒ) {
    return errƒ(this[ø])
  }

  ap(/* result */) {
    return this
  }

  apErr(result) {
    return result.chain((ƒ) => this.mapErr(ƒ))
  }

  equals(result) {
    return result.mapErr((value) => value === this[ø]).extractErrOr(false)
  }

  extractOr(defaultValue) {
    return defaultValue
  }

  extractErrOr(/* defaultValue */) {
    return this[ø]
  }

  * iter() {
    // nothing yields
  }

  * iterErr() {
    yield this[ø]
  }

  swap() {
    return Ok.of(this[ø])
  }

  promise() {
    return Promise.reject(this[ø])
  }

  either(okƒ, errƒ) {
    return errƒ(this[ø])
  }

  bimap(okƒ, errƒ) {
    return this.mapErr(errƒ)
  }

  isOk() {
    return false
  }

  isErr() {
    return true
  }

  ok() {
    return None.of()
  }

  err() {
    return Some.of(this[ø])
  }
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
