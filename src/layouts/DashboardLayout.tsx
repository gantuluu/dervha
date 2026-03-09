import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
