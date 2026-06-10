import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

/** Mobile-first shell: a centered phone-width column with the floating bottom nav. */
export function AppLayout() {
  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-md min-h-full px-4 pt-5 pb-28 safe-top">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
