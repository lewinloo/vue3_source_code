import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from './baseHandlers'

// 将数据转换成响应式数据
const reactiveMap = new WeakMap(); // 弱引用，不会导致内存泄露，有利于性能


export function reactive(target: any) {
  if (!isObject(target)) {
    return;
  }

  // 代理对象被再次代理可以直接返回(如果一个目标对象被代理过了，则会走 get)
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  // 如果存在该代理，则直接返回(实现同一个对象都多次代理，返回同一个代理)
  let existProxy = reactiveMap.get(target);
  if (existProxy) return existProxy 

  // Proxy 配合 Reflect 使用
  const proxy = new Proxy(target, mutableHandlers);

  // 缓存代理
  reactiveMap.set(target, proxy);
  return proxy
}
