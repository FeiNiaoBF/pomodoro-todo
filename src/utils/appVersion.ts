import Constants from 'expo-constants';
import appConfig from '../../app.json';

const expoConfig = appConfig.expo;
const iosBuildNumber = Constants.platform?.ios?.buildNumber ?? expoConfig.ios.buildNumber;
const androidVersionCode = Constants.platform?.android?.versionCode ?? expoConfig.android.versionCode;

export const appVersion = {
  name: expoConfig.name,
  version: expoConfig.version,
  iosBuildNumber,
  androidVersionCode,
};

export function getBuildLabel() {
  return `iOS ${appVersion.iosBuildNumber} / Android ${appVersion.androidVersionCode}`;
}
