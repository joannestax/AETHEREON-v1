import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Observatory: undefined;
  Chat: undefined;
  Watchlists: undefined;
  Insights: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  SignatureAnalysis: { ticker?: string } | undefined;
  QuotesCommandCenter: undefined;
  BearfallRun: undefined;
};
