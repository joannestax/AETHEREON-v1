import { Platform } from 'react-native';

/** Native driver is unavailable on web Metro runtime. */
export const NATIVE_DRIVER = Platform.OS !== 'web';
