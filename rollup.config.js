import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import builtins from 'rollup-plugin-node-builtins';
// import typescript from 'rollup-plugin-typescript'; 
import globals from 'rollup-plugin-node-globals'
const path = require('path')

export default {
    input: path.join(process.cwd(), 'getHost/gitHost.js'), //入口 
    plugins: [
        resolve({
            preferBuiltins: true
        }),  // 是否打包进来
        commonjs(),  // cmd转esm 
        json(),
        babel({
            runtimeHelpers: true,
            exclude: path.join(process.cwd(), 'node_modules/**'),
            plugins: [],
        }),
        // globals(),
        // builtins(),  //把node环境的api也打包进来了.
        // typescript(),
        uglify(),

    ],
    external: [
        // 'axios'  //外部引用
    ],
    // onwarn(warn) {
    //     if (warn.code == 'MISSING_GLOBAL_NAME') {
    //         return
    //     }
    //     console.log(warn);
    // },
    output: {
        globals: {
            axios: 'axios', // 外部引用插件,指定对应全局变量的名称 
        },
        name: 'getHost',
        format: 'umd',// 'cjs',
        file: path.join(process.cwd(), 'getHost/bundle.js')
    }
}