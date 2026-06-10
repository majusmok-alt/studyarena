import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.majusmok.studyarena',
  appName: 'StudyArena',
  // Vite builds the web assets here; `npx cap sync` copies them into the native app.
  webDir: 'dist',
  backgroundColor: '#06070d',
  ios: {
    // Match the app's deep dark theme so there's no white flash on launch.
    backgroundColor: '#06070d',
    contentInset: 'always',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#06070d',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK', // dark background → light content
      backgroundColor: '#06070d',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'native',
    },
  },
};

export default config;
