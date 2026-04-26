/**
 * Jest setup file: runs before the test framework is installed.
 * Stubs out Expo's WinterCG runtime globals that use `import.meta`,
 * which is not supported in Jest's Node environment.
 *
 * We intercept the lazy getters installed by expo/src/winter/installGlobal
 * by defining the globals BEFORE expo's setup.js tries to lazily resolve them.
 */

// Stub __ExpoImportMetaRegistry before the lazy getter fires
if (!('__ExpoImportMetaRegistry' in global)) {
  Object.defineProperty(global, '__ExpoImportMetaRegistry', {
    configurable: true,
    enumerable: false,
    value: { url: 'http://localhost:8081/' },
  });
}

// Node 17+ has native structuredClone; prevent expo from overriding it with
// @ungap/structured-clone which fails to load outside of Metro's module scope.
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}
