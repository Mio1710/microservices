import { Outlet } from 'react-router';

export default function UserLayout() {
  return (
    <div>
      <header>
        <h1>User Layout</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2023 User Layout</p>
      </footer>
    </div>
  );
}
