import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home/home.jsx';
import Dashboard from './pages/Dashboard/dashboard.jsx';
import { AuthContext, AuthProvider } from './Contexts/AuthContext';
import './main.sass';
import './scrollbar.css';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Dashboard /> : <Home />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
