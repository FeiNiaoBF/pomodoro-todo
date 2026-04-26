import { NavigatorScreenParams } from '@react-navigation/native';
import { TodayFocusTask } from '../data/todaySample';

/**
 * 根导航参数类型 - Bottom Tab Navigation
 */
export type RootTabParamList = {
  Today: undefined;
  Tasks: undefined;
  Insights: undefined;
};

/**
 * 所有导航参数类型
 */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  Focus: {
    task?: TodayFocusTask;
  };
  Break: {
    task?: TodayFocusTask;
    nextTaskTitle?: string;
    sessionIndex?: number;
  };
};
