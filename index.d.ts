
export class ResultException extends Error { }

export interface ResultClass<T, E> {
  isOk(): boolean;
  isErr(): boolean;

  equals<F = E>(result: ResultClass<T, F>): boolean;

  map<U>(fn: (value: T) => U): ResultClass<U, E>;
  mapErr<F>(fn: (error: E) => F): ResultClass<T, F>;
  bimap<U = T, F = E>(map: (data: T) => U, mapErr: (error: E) => F): ResultClass<U, F>;

  chain<U, F = E>(fn: (data: T) => ResultClass<U, F>): ResultClass<U, F>;
  chainErr<U, F = E>(fn: (error: E) => ResultClass<U, F>): ResultClass<U, F>;

  iter(): Iterator<T>;

  and<U, F = E>(result: ResultClass<U, F>): ResultClass<U, F>;
  andThen<U>(fn: (data: T) => ResultClass<U, E>): ResultClass<U, E>;
  or<F>(result: ResultClass<T, F>): ResultClass<T, F>;
  orElse<F>(fn: (error: E) => ResultClass<T, F>): ResultClass<T, F>;

  /**
   * @throws {ResultExpection}
   */
  unwrap(): T;
  unwrapOr(value: T): T;
  unwrapOrElse(fn: (value: E) => T): T;
  unwrapErr(): E;

  /**
   * @throws {ResultExpection}
   */
  expect(msg: string): T;

  /**
   * @throws {ResultExpection}
   */
  expectErr(msg: string): E;
  promise(): Promise<T>;

  swap(): ResultClass<E, T>;
  extract(): T[];
  extractErr(): E[];
}

export type Err = {
  <T, E>(error: E): ResultClass<T, E>,
  isErr: (error: any) => boolean,
  of: <T, E>(error: E) => ResultClass<T, E>,
}

export const Err: Err

export type Ok = {
  <T, E>(value: T): ResultClass<T, E>,
  isOk: (value: any) => boolean,
  of: <T, E>(value: T) => ResultClass<T, E>,
}

export const Ok: Ok

export type Result = {
  ok: Ok,
  err: Err,
  isResult: <T, E>(result: any) => boolean,
  of: <T, E>(value: T) => ResultClass<T, E>,
  into: <T, E>(value: T | E) => ResultClass<T, E>,
  encase<A, Rs, Er = Error>(fn: (a: A) => Rs): ((a: A) => ResultClass<Rs, Er>);
  encase<A, B, Rs, Er = Error>(fn: (a: A, b: B) => Rs): ((a: A, b: B) => ResultClass<Rs, Er>);
  encase<A, B, C, Rs, Er = Error>(fn: (a: A, b: B, c: C) => Rs): ((a: A, b: B, c: C) => ResultClass<Rs, Er>);
  encase<A, B, C, D, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D) => Rs): ((a: A, b: B, c: C, d: D) => ResultClass<Rs, Er>);
  encase<A, B, C, D, E, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D, e: E) => Rs): ((a: A, b: B, c: C, d: D, e: E) => ResultClass<Rs, Er>);
  encase<A, B, C, D, E, F, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F) => ResultClass<Rs, Er>);
  encase<A, B, C, D, E, F, J, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, j: J) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F, j: J) => ResultClass<Rs, Er>);
}

export const Result: Result


export class OptionException extends Error { }

export interface OptionClass<T> {
  equals(option: OptionClass<T>): boolean;

  /** @throws {OptionException} */
  unwrap(): T;
  unwrapOr(value: T): T;
  unwrapOrElse(fn: () => T): T;
  map<U>(fn: (value: T) => U): OptionClass<U>;
  mapOrElse<U>(defFn: () => U, mapFn: (value: T) => U): OptionClass<U>;
  chain<U>(optionFn: (value: T) => OptionClass<U>): OptionClass<U>;
  okOr<E>(error: E): ResultClass<T, E>;
  okOrElse<E>(errorFn: () => E): ResultClass<T, E>;
  iter(): Iterator<T>;
  and<I>(optionB: OptionClass<I>): OptionClass<I>;
  andThen<I>(fn: (value: T) => I): OptionClass<I>;
  filter(predicate: (value: T) => boolean): OptionClass<T>;
  or(optionB: OptionClass<T> | T): OptionClass<T>;
  orElse(fn: () => OptionClass<T> | T): OptionClass<T>;
  isSome(): boolean;
  isNone(): boolean;
}

export type Some = {
  <T>(value: T): OptionClass<T>,
  isSome: <T>(value: OptionClass<T>) => boolean,
  of: <T>(value: T) => OptionClass<T>,
}

export const Some: Some

export type None = {
  <T>(): OptionClass<T>,
  isNone: <T>(value: OptionClass<T>) => boolean,
  of: <T>(none: null | undefined) => OptionClass<T>,
}

export const None: None

export type Option = {
  some: Some,
  none: None,
  isOption: (value: any) => boolean,
  of: <T>(value: T) => OptionClass<T>,
  into: <T>(value: OptionClass<T> | T) => OptionClass<T>,
  encase<A, Rs>(fn: (a: A) => Rs): ((a: A) => OptionClass<Rs>);
  encase<A, B, Rs>(fn: (a: A, b: B) => Rs): ((a: A, b: B) => OptionClass<Rs>);
  encase<A, B, C, Rs>(fn: (a: A, b: B, c: C) => Rs): ((a: A, b: B, c: C) => OptionClass<Rs>);
  encase<A, B, C, D, Rs>(fn: (a: A, b: B, c: C, d: D) => Rs): ((a: A, b: B, c: C, d: D) => OptionClass<Rs>);
  encase<A, B, C, D, E, Rs>(fn: (a: A, b: B, c: C, d: D, e: E) => Rs): ((a: A, b: B, c: C, d: D, e: E) => OptionClass<Rs>);
  encase<A, B, C, D, E, F, Rs>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F) => OptionClass<Rs>);
  encase<A, B, C, D, E, F, J, Rs>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, j: J) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F, j: J) => OptionClass<Rs>);
  wrap<A, Rs>(fn: (a: A) => Rs): ((a: A) => OptionClass<Rs>);
  wrap<A, B, Rs>(fn: (a: A, b: B) => Rs): ((a: A, b: B) => OptionClass<Rs>);
  wrap<A, B, C, Rs>(fn: (a: A, b: B, c: C) => Rs): ((a: A, b: B, c: C) => OptionClass<Rs>);
  wrap<A, B, C, D, Rs>(fn: (a: A, b: B, c: C, d: D) => Rs): ((a: A, b: B, c: C, d: D) => OptionClass<Rs>);
  wrap<A, B, C, D, E, Rs>(fn: (a: A, b: B, c: C, d: D, e: E) => Rs): ((a: A, b: B, c: C, d: D, e: E) => OptionClass<Rs>);
  wrap<A, B, C, D, E, F, Rs>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F) => OptionClass<Rs>);
  wrap<A, B, C, D, E, F, J, Rs>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, j: J) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F, j: J) => OptionClass<Rs>);
}

export const Option: Option
