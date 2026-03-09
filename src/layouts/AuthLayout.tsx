import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex flex-col h-full p-6 justify-center bg-slate-900">
      <Outlet />
    </div>
  );
}
