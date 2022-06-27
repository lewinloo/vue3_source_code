import { activeEffect } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
  set(target: object, key: PropertyKey, value: any, receiver: any) {
    return Reflect.set(target, key, value, receiver)
  },
  get(target: object, key: PropertyKey, receiver: any) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, receiver)
  },
}