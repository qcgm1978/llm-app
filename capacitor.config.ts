import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.revelationreader.app.infinite_read',
  appName: '',
  webDir: 'dist',
  android: {
    webContentsDebuggingEnabled: true,
    backButtonBehavior: 'back',
    iconPath: {
      ldpi: 'assets/android/icon_36x36.png',
      mdpi: 'assets/android/icon_48x48.png',
      hdpi: 'assets/android/icon_72x72.png',
      xhdpi: 'assets/android/icon_96x96.png',
      xxhdpi: 'assets/android/icon_144x144.png',
      xxxhdpi: 'assets/android/icon_192x192.png'
    },
    roundIconPath: {
      ldpi: 'assets/android/icon_36x36.png',
      mdpi: 'assets/android/icon_48x48.png',
      hdpi: 'assets/android/icon_72x72.png',
      xhdpi: 'assets/android/icon_96x96.png',
      xxhdpi: 'assets/android/icon_144x144.png',
      xxxhdpi: 'assets/android/icon_192x192.png'
    }
  }
};


export default config;
