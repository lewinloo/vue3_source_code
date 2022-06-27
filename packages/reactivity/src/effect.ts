export let activeEffect: ReactiveEffect | undefined = undefined;
class ReactiveEffect {
  public active = true; // 这个effect默认是激活状态
  constructor(public fn: () => void) {}

  run() {
    // 非激活的情况下，只需要执行函数，不需要进行依赖收集
    if (!this.active) {
      return this.fn();
    }

    try {
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = undefined;
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