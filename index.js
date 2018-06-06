/* eslint-disable no-use-before-define */

const symbolSome = Symbol('Option::Some')
const symbolNone = Symbol('Option::None')
const symbolOk = Symbol('Result::Ok')
const symbolErr = Symbol('Result::Err')


class OptionException extends Error { }

function Some(data) {
  return {
    [symbolSome]: true,

    isSome: () => true,

    isNone: () => false,

    equals: (result) => Some.isSome(result) && result.unwrap() === data,

    unwrap: () => data,

    // eslint-disable-next-line no-unused-vars
    unwrapOr: (value) => data,

    // eslint-disable-next-line no-unused-vars
    unwrapOrElse: (fn) => data,

    map: (fn) => Option.fromNullable(fn(data)),

    mapOr: (value, fn) => Option.fromNullable(fn(data)),

    mapOrElse: (defFn, mapFn) => Option.fromNullable(mapFn(data)),

    chain: (optionFn) => Option.into(optionFn(data)),

    // eslint-disable-next-line no-unused-vars
    okOr: (resultErr) => Ok(data),

    // eslint-disable-next-line no-unused-vars
    okOrElse: (resultErrFn) => Ok(data),

    * iter() {
      yield data
    },

    and: (optionB) => Option.isOption(optionB)
      ? optionB
      : Option.fromNullable(optionB),

    andThen: (fn) => Option.into(fn(data)),

    filter: (predicateFn) => predicateFn(data)
      ? Some(data)
      : None(),

    // eslint-disable-next-line no-unused-vars
    or: (optionB) => Some(data),

    // eslint-disable-next-line no-unused-vars
    orElse: (optionFn) => Some(data),
  }
}

Some.isSome = (instance) => instance[symbolSome] === true
Some.of = Some

function None() {
  return {
    [symbolNone]: true,

    isSome: () => false,

    isNone: () => true,

    equals: (result) => None.isNone(result),

    unwrap: () => {
      throw new OptionException('unwrap() called on None value')
    },

    unwrapOr: (value) => value,

    unwrapOrElse: (fn) => fn(),

    // eslint-disable-next-line no-unused-vars
    map: (fn) => None(),

    // eslint-disable-next-line no-unused-vars
    mapOr: (value, fn) => Option.fromNullable(value),

    // eslint-disable-next-line no-unused-vars
    mapOrElse: (defFn, mapFn) => Option.fromNullable(defFn()),

    // eslint-disable-next-line no-unused-vars
    chain: (optionFn) => None(),

    okOr: (resultErr) => Err(resultErr),

    okOrElse: (resultErrFn) => Err(resultErrFn()),

    // eslint-disable-next-line no-empty-function
    * iter() { },

    // eslint-disable-next-line no-unused-vars
    and: (optionB) => None(),

    // eslint-disable-next-line no-unused-vars
    andThen: (fn) => None(),

    // eslint-disable-next-line no-unused-vars
    filter: (predicateFn) => None(),

    or: (optionB) => Option.isOption(optionB)
      ? optionB
      : Option.fromNullable(optionB),

    orElse: (optionFn) => Option.into(optionFn()),
  }
}

None.isNone = (instance) => instance[symbolNone] === true
None.of = None

const Option = {
  some: Some,
  none: None,
  isOption: (instance) => Some.isSome(instance) || None.isNone(instance),
  fromNullable: (value) => (value === null || typeof value === 'undefined')
    ? None()
    : Some(value),
  encase: (fn) => (...args) => {
    try {
      return Some(fn(...args))
    }
    catch (error) {
      return None()
    }
  },
  wrap: (fn) => (...args) => {
    try {
      const result = fn(...args)

      if (typeof result === 'undefined' || result === null || Number.isNaN(result)) {
        return None()
      }

      return Some(result)
    }
    catch (error) {
      return None()
    }
  },
  into: (value) => Option.isOption(value)
    ? value
    : Option.fromNullable(value),
}


class ResultException extends Error { }

function Ok(data) {
  return {
    [symbolOk]: true,

    isOk: () => true,

    isErr: () => false,

    equals: (result) => Ok.isOk(result) && result.unwrap() === data,

    // eslint-disable-next-line no-unused-vars
    either: (mapFn, errFn) => mapFn(data),

    map: (fn) => Ok(fn(data)),

    // eslint-disable-next-line no-unused-vars
    mapErr: (fn) => Ok(data),

    // eslint-disable-next-line no-unused-vars
    bimap: (f, g) => Ok(f(data)),

    chain: (fn) => Result.into(fn(data)),

    // eslint-disable-next-line no-unused-vars
    chainErr: (fn) => Ok(data),

    * iter() {
      yield data
    },

    and: (result) => Result.into(result),

    andThen: (fn) => Result.into(fn(data)),

    // eslint-disable-next-line no-unused-vars
    or: (result) => Ok(data),

    // eslint-disable-next-line no-unused-vars
    orElse: (fn) => Ok(data),

    unwrap: () => data,

    // eslint-disable-next-line no-unused-vars
    unwrapOr: (value) => data,

    // eslint-disable-next-line no-unused-vars
    unwrapOrElse: (fn) => data,

    unwrapErr: () => {
      throw new ResultException(data)
    },

    // eslint-disable-next-line no-unused-vars
    expect: (msg) => data,

    expectErr: (msg) => {
      throw new ResultException(`${msg}: ${data}`)
    },

    promise: () => Promise.resolve(data),

    swap: () => Err(data),

    extract: () => [data],

    extractErr: () => [],

    ok: () => Some(data),

    err: () => None(),
  }
}

Ok.isOk = (instance) => instance[symbolOk] === true
Ok.of = Ok

function Err(error) {
  return {
    [symbolErr]: true,

    isOk: () => false,

    isErr: () => true,

    equals: (result) => Err.isErr(result) && result.unwrapErr() === error,

    either: (okFn, errFn) => errFn(error),

    // eslint-disable-next-line no-unused-vars
    map: (fn) => Err(error),

    mapErr: (fn) => Err(fn(error)),

    // eslint-disable-next-line no-unused-vars
    bimap: (f, g) => Err(g(error)),

    // eslint-disable-next-line no-unused-vars
    chain: (fn) => Err(error),

    chainErr: (fn) => Result.into(fn(error)),

    // eslint-disable-next-line no-empty-function
    * iter() {
    },

    // eslint-disable-next-line no-unused-vars
    and: (result) => Err(error),

    // eslint-disable-next-line no-unused-vars
    andThen: (fn) => Err(error),

    or: (result) => Result.into(result),

    orElse: (fn) => Result.into(fn(error)),

    unwrap: () => {
      throw error
    },

    unwrapOr: (value) => value,

    unwrapOrElse: (fn) => fn(error),

    unwrapErr: () => error,

    expect: (msg) => {
      throw new ResultException(msg)
    },

    // eslint-disable-next-line no-unused-vars
    expectErr: (msg) => error,

    promise: () => Promise.reject(error),

    swap: () => Ok(error),

    extract: () => [],

    extractErr: () => [error],

    ok: () => None(),

    err: () => Some(error),
  }
}

Err.isErr = (instance) => instance[symbolErr] === true
Err.of = Err

const Result = {
  ok: Ok,
  err: Err,
  of: (value) => value instanceof Error
    ? Err.of(value)
    : Ok.of(value),
  into: (value) => Result.isResult(value)
    ? value
    : Result.of(value),
  encase: (fn) => (...args) => {
    try {
      return Ok(fn(...args))
    }
    catch (error) {
      return Err(error)
    }
  },
  isResult: (instance) => Ok.isOk(instance) || Err.isErr(instance),
}

module.exports = {
  Some,
  None,
  Option,
  OptionException,
  Ok,
  Err,
  Result,
  ResultException,
}
