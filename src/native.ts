// Native (Capacitor) bootstrap. No-ops on the web — every call is guarded by
// `isNativePlatform()`, so the browser build is completely unaffected.
import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

export async function initNative(): Promise<void> {
  if (!isNative) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark }); // light text on our dark UI
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#06070d' });
    }
  } catch {
    /* status bar unavailable — ignore */
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    // Give the React tree a beat to paint, then fade the splash out.
    setTimeout(() => void SplashScreen.hide(), 350);
  } catch {
    /* splash screen unavailable — ignore */
  }

  try {
    const { App } = await import('@capacitor/app');
    // Android hardware back: go back in history, or background the app at root.
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else void App.minimizeApp();
    });
  } catch {
    /* app plugin unavailable — ignore */
  }
}

/** Light haptic tap for key interactions (start/finish session, win). */
export async function haptic(): Promise<void> {
  if (!isNative) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* haptics unavailable — ignore */
  }
}
