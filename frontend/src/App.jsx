import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortfolioPage from './pages/PortfolioPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function Protected({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: {
              background: 'rgba(8,16,32,0.95)',
              color: '#e8edf5',
              border: '1px solid rgba(56,139,253,0.2)',
              fontSize: '13px',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              fontFamily: 'Outfit, sans-serif',
            },
            success: { iconTheme: { primary: '#3fb950', secondary: 'rgba(8,16,32,0.95)' } },
            error:   { iconTheme: { primary: '#f85149', secondary: 'rgba(8,16,32,0.95)' } },
          }} />
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<Protected><AdminDashboard /></Protected>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
