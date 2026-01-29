import { Header } from '@/components/Header';
import { Outlet } from 'react-router';

export default function AminLayout() {
  return (
    <div className="admin-layout">
      <Header />

      <main className="admin-content p-4 pt-0">
        <Outlet />
      </main>
    </div>
  );
}
