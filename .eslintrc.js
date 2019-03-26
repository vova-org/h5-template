module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    "browser": true,  
    "commonjs": true,
    "es6": true
  },
  rules: {
    'no-console': 0,
    'no-unreachable': 0,
    'no-constant-condition': 0,
    'no-cond-assign': 0,
    'eqeqeq': 2,//要求使用 === 和 !==
    'no-alert': 1,//禁用 alert、confirm 和 prompt
    'no-multi-spaces': 2,//禁止使用多个空格
    //风格检测
    'block-spacing': 2,//禁止或强制在代码块中开括号前和闭括号后有空格
    'camelcase': 2,//强制使用骆驼拼写法命名约定
    'func-call-spacing': 2,//要求或禁止在函数标识符和其调用之间有空格
    'key-spacing': 2,//强制在对象字面量的属性中键和值之间使用一致的间距
    'linebreak-style': ["error", "windows"],//强制使用一致的换行风格
    'no-multiple-empty-lines': 2,//禁止出现多行空行
    'no-tabs': 2,//禁用 tab
    'no-trailing-spaces': 2,//禁用行尾空格
    'arrow-spacing': 2,//强制箭头函数的箭头前后使用一致的空格
  },
  globals: {
    $: true,
    wx: true,
    CY: true
  },
};