module.exports = {
  parser: 'typescript',
  indent: 2,
  tabWidth: 2,
  // 是否使用分号, true为使用，false为不使用，默认为true
  semi: true,
  // 使用单引号, 默认false
  singleQuote: true,
  // 行尾逗号,默认none,可选 none|es5|all， es5 包括es5中的数组、对象， all 包括函数对象等所有可选
  trailingComma: 'all',
  printWidth: 100,
  // 对象中的空格 默认true：true: { foo: bar }，  false: {foo: bar}
  bracketSpacing: true,
  /*
    JSX标签闭合位置 默认false
    false:
      <div
         className=""
         style={{}}
      >
    true:
      <div
         className=""
         style={{}} >
   */
  jsxBracketSameLine: false,
  // 箭头函数参数括号 默认avoid 可选 avoid| always： avoid 能省略括号的时候就省略 例如x => x， always 总是有括号
  arrowParens: 'always',
  endOfLine: 'lf',
};
