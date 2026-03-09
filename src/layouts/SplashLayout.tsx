import { Outlet } from 'react-router-dom';

export default function SplashLayout() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
