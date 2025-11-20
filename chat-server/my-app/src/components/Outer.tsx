import { Outlet } from 'react-router';

export function Outer() {
  return (
    <div>
      <header>
        <h1>Outer Layout</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <slot />
      <slot />
      <footer>
        <p>&copy; 2023 Outer Layout</p>

        <Outlet />
      </footer>
    </div>
  );
}
export default Outer;
