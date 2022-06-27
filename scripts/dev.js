// 可以获取命令行的参数（node scripts/dev.js reactivity -f global）
// 因为我们需要忽然前两个参数，所以使用slice(2)进行移除
const args = require("minimist")(process.argv.slice(2));
const { build } = require("esbuild");
const { resolve } = require("path");

const target = args._[0] || "reactivity";
const format = args.f || "global";

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

/*
  iife 立即执行函数
  cjs  node中的模块
  esm  浏览器中的EsModule模块
*/
const outputFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm";

const outfile = resolve(  __dirname, `../packages/${target}/dist/${target}.${format}.js`)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 把所有的包全部打包一起
  sourcemap: true,
  format: outputFormat, // 输出的格式
  globalName: pkg.buildOptions?.name, // 打包后的全局名称
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error) console.log('rebuild~~~')
    }
  }
}).then(() => {
  console.log('watching~~~')
})