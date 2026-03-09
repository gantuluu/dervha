import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
