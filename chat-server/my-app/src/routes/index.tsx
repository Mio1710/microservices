import { Main } from '@/components/Main';
import AdminLayout from '@/layouts/admin';
import About from '@/pages/about';
import { Login } from '@/pages/login';
import { SignUp } from '@/pages/sign-up';
import { Route, Routes } from 'react-router';

export default function RouteApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

      </Route>
      <Route element={<AdminLayout />}></Route>
      {/* Add more routes as needed */}
    </Routes>
  );
}
