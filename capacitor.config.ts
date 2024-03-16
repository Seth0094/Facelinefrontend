import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.faceline.app',
  appName: 'faceline',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
