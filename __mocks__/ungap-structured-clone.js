// Stub for @ungap/structured-clone
// Node 17+ has native structuredClone, so this is safe to stub.
module.exports = {
  default: (v) => JSON.parse(JSON.stringify(v)),
};
