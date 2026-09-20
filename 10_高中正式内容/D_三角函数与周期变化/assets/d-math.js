window.dMath = function (body) {
  const source = '<math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true"><mrow>' + body + '</mrow></math>';
  return window.MathJax?.mathml2chtml ? MathJax.mathml2chtml(source, {display: false}).outerHTML : source;
};
