export let activeEffect: ReactiveEffect | undefined = undefined;
class ReactiveEffect {
  // 这个effect默认是激活状态
  public active = true; 
  // 使用 parent 属性记录父亲effect，解决多层effect问题
  public parent: ReactiveEffect | undefined = undefined;
  constructor(public fn: () => void) {}

  run() {
    // 非激活的情况下，只需要执行函数，不需要进行依赖收集
    if (!this.active) {
      return this.fn();
    }

    // 依赖收集，核心就是将当前的 effect 和稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect;
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }

  stop() {
    this.active = false
  }
}

export function effect(fn: () => void) {
  const _effect = new ReactiveEffect(fn);

  _effect.run(); // 默认先执行一次
}

// 依赖收集
const targetMap = new WeakMap();
export function track(target: object, type: string, key: PropertyKey) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if  (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect)
  }

}