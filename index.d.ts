
declare class ResultClass<A, X> {
  static of<B, Z>(value: B): ResultClass<B, Z>;

  ap<B>(result: ResultClass<((value: A) => B), X>): ResultClass<B, X>;
  apErr<Z>(result: ResultClass<A, ((value: X) => Z)>): ResultClass<A, Z>;
  bimap<B, Z>(okƒ: (value: A) => B, errƒ: (value: X) => Z): ResultClass<B, Z>;
  chain<B>(okƒ: (value: A) => ResultClass<B, X>): ResultClass<B, X>;
  chainErr<Z>(errƒ: (value: X) => ResultClass<A, Z>): ResultClass<A, Z>;
  either<T>(okƒ: (value: A) => T, errƒ: (value: X) => T): T;
  equals(result: ResultClass<A, X>): boolean;
  err(): OptionClass<X>;
  extractErrOr(defaultValue: X): X;
  extractErrOrElse(defaultƒ: () => X): X;
  extractOr(defaultValue: A): A;
  extractOrElse(defaultƒ: () => A): A;
  isErr(): boolean;
  isOk(): boolean;
  iter(): Iterator<A>;
  iterErr(): Iterator<X>;
  map<B>(ƒ: (value: A) => B): ResultClass<B, X>;
  mapErr<Z>(ƒ: (value: X) => Z): ResultClass<A, Z>;
  mapErrOr<Z>(value: Z, ƒ: (value: X) => Z): ResultClass<A, Z>;
  mapErrOrElse<Z>(defaultƒ: () => Z, ƒ: (value: X) => Z): ResultClass<A, Z>;
  mapOr<B>(value: B, ƒ: (value: A) => B): ResultClass<B, X>;
  mapOrElse<B>(defaultƒ: () => A, ƒ: (value: A) => B): ResultClass<B, X>;
  ok(): OptionClass<A>;
  promise(): Promise<A>;
  swap(): ResultClass<X, A>;
}

export class Ok<T, E> extends ResultClass<T, E> {}
export class Err<T, E> extends ResultClass<T, E> {}

export type Result = {
  ok: <T, E>(value: T) => ResultClass<T, E>,
  err: <T, E>(value: E) => ResultClass<T, E>,
  is: (result: any) => boolean,
  into: <T, E>(value: T | ResultClass<T, E>) => ResultClass<T, E>,
  encase<A, Rs, Er = Error>(fn: (a: A) => Rs): ((a: A) => ResultClass<Rs, Er>);
  encase<A, B, Rs, Er = Error>(fn: (a: A, b: B) => Rs): ((a: A, b: B) => ResultClass<Rs, Er>);
  encase<A, B, C, Rs, Er = Error>(fn: (a: A, b: B, c: C) => Rs): ((a: A, b: B, c: C) => ResultClass<Rs, Er>);
  encase<A, B, C, D, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D) => Rs): ((a: A, b: B, c: C, d: D) => ResultClass<Rs, Er>);
  encase<A, B, C, D, E, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D, e: E) => Rs): ((a: A, b: B, c: C, d: D, e: E) => ResultClass<Rs, Er>);
  encase<A, B, C, D, E, F, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F) => ResultClass<Rs, Er>);
  encase<A, B, C, D, E, F, J, Rs, Er = Error>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, j: J) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F, j: J) => ResultClass<Rs, Er>);
}

export const Result: Result


declare class OptionClass<A> {
  static of<S>(value: S): OptionClass<S>;

  alt(option: OptionClass<A>): OptionClass<A>;
  ap<B>(option: OptionClass<((value: A) => B)>): OptionClass<B>;
  chain<B>(optionƒ: (value: A) => OptionClass<B>): OptionClass<B>;
  equals(option: OptionClass<A>): boolean;
  extend<B>(ƒ: (option: OptionClass<A>) => B): OptionClass<B>;
  extractOr(defaultValue: A): A;
  extractOrElse(defaultƒ: () => A): A;
  filter(predicate: (value: A) => boolean): OptionClass<A>;
  isNone(): boolean;
  isSome(): boolean;
  iter(): Iterator<A>;
  map<B>(ƒ: (value: A) => B): OptionClass<B>;
  mapOr<B>(value: B, ƒ: (value: A) => B): OptionClass<B>;
  mapOrElse<B>(defaultƒ: () => B, mapƒ: (value: A) => B): OptionClass<B>;
  okOr<E>(error: E): ResultClass<A, E>;
  okOrElse<E>(errorFn: () => E): ResultClass<A, E>;
  or(option: OptionClass<A>): OptionClass<A>;
  orElse(ƒ: () => OptionClass<A>): OptionClass<A>;
}

export class Some<A> extends OptionClass<A> {}
export class None<A> extends OptionClass<A> {
  static of<S>(): OptionClass<S>;
}

type Option = {
  some: <T>(value: T) => OptionClass<T>,
  none: <T>() => OptionClass<T>,
  is: (value: any) => boolean,
  into: <T>(value?: T) => OptionClass<T>,
  zero: <T>() => OptionClass<T>,
  encase<A, Rs>(fn: (a: A) => Rs): ((a: A) => OptionClass<Rs>);
  encase<A, B, Rs>(fn: (a: A, b: B) => Rs): ((a: A, b: B) => OptionClass<Rs>);
  encase<A, B, C, Rs>(fn: (a: A, b: B, c: C) => Rs): ((a: A, b: B, c: C) => OptionClass<Rs>);
  encase<A, B, C, D, Rs>(fn: (a: A, b: B, c: C, d: D) => Rs): ((a: A, b: B, c: C, d: D) => OptionClass<Rs>);
  encase<A, B, C, D, E, Rs>(fn: (a: A, b: B, c: C, d: D, e: E) => Rs): ((a: A, b: B, c: C, d: D, e: E) => OptionClass<Rs>);
  encase<A, B, C, D, E, F, Rs>(fn: (a: A, b: B, c: C, d: D, e: E, f: F) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F) => OptionClass<Rs>);
  encase<A, B, C, D, E, F, J, Rs>(fn: (a: A, b: B, c: C, d: D, e: E, f: F, j: J) => Rs): ((a: A, b: B, c: C, d: D, e: E, f: F, j: J) => OptionClass<Rs>);
}

export const Option: Option
