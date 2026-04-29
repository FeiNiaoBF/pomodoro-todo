import en from '../../src/i18n/locales/en.json';
import zhHans from '../../src/i18n/locales/zh-Hans.json';

describe('translation locale files', () => {
  it('keeps English and Simplified Chinese keys in sync', () => {
    expect(Object.keys(zhHans).sort()).toEqual(Object.keys(en).sort());
  });
});
