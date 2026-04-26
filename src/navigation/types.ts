import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * 根导航参数类型 - Bottom Tab Navigation
 */
export type RootTabParamList = {
  Timer: undefined;
  Todos: undefined;
  Stats: undefined;
  Settings: undefined;
};

/**
 * 所有导航参数类型
 */
export type RootStackParamList = RootTabParamList;
