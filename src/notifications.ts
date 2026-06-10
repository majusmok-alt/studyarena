// Local notifications — daily streak reminders. Native-only; every call is a
// safe no-op on the web so the browser build is unaffected.
import { isNative } from './native';

const STREAK_REMINDER_ID = 1001;
const PREF_KEY = 'studyarena:notifs';

export function notificationsEnabled(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) === '1';
  } catch {
    return false;
  }
}

function setPref(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** Returns true if reminders are now enabled (permission granted + scheduled). */
export async function enableStreakReminder(hour = 19): Promise<boolean> {
  if (!isNative) {
    setPref(true); // remembered; takes effect inside the native app
    return true;
  }
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') {
      setPref(false);
      return false;
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          id: STREAK_REMINDER_ID,
          title: '🔥 Keep your streak alive',
          body: "You haven't studied today — jump in before midnight to protect your rank.",
          schedule: { on: { hour, minute: 0 }, allowWhileIdle: true },
        },
      ],
    });
    setPref(true);
    return true;
  } catch {
    setPref(false);
    return false;
  }
}

export async function disableStreakReminder(): Promise<void> {
  setPref(false);
  if (!isNative) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: STREAK_REMINDER_ID }] });
  } catch {
    /* ignore */
  }
}

export async function toggleStreakReminder(on: boolean): Promise<boolean> {
  return on ? enableStreakReminder() : (await disableStreakReminder(), false);
}
