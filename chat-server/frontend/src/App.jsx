import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { AuthProvider } from './context/auth-context';
import { ThemeProvider } from './context/theme-context';
import RouteApp from './routes';

function App() {
  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <RouteApp />
          </AuthProvider>
        </BrowserRouter>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
}

export default App;
