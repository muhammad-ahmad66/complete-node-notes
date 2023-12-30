/*
class calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
}
module.exports = calculator;
*/
// we use module.exports when we wants to export one single value.

// we can then save exported value into a variable when importing it.

// ? We can do it more elegant way. we could assign this class her directly to module.exports. here it's like a function declaration class declaration We can do it with a class expression.

module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
