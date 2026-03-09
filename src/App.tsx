import Router from './Router';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex justify-center">
      <div className="w-full max-w-[500px] bg-slate-900 shadow-2xl relative overflow-hidden flex flex-col">
        <Router />
      </div>
    </div>
  );
}
