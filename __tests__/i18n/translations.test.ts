import en from '../../src/i18n/locales/en.json';
import zhCN from '../../src/i18n/locales/zh-CN.json';

describe('translation locale files', () => {
  it('keeps English and Mainland Chinese keys in sync', () => {
    expect(Object.keys(zhCN).sort()).toEqual(Object.keys(en).sort());
  });
});
