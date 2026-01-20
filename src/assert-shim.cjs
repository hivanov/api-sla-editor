function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

assert.ok = assert;
assert.equal = (a, b, msg) => { if (a != b) throw new Error(msg || `${a} != ${b}`); };
assert.strictEqual = (a, b, msg) => { if (a !== b) throw new Error(msg || `${a} !== ${b}`); };

module.exports = assert;
