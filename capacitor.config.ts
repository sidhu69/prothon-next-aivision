import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ansh.tdmarena', // change this to your unique ID
  appName: 'TDM Arena',
  webDir: 'dist',
  server: {
    // remove or set to your own hosting if you have one
    // url: 'https://yourdomain.com',
    cleartext: true
  }
};

export default config;
