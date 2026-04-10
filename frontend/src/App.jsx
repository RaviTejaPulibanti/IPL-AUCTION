import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuctionProvider } from './context/AuctionContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AuctionRoom from './pages/AuctionRoom';
import TeamDashboard from './pages/TeamDashboard';

// Placeholder components

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AuctionProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <AuctionRoom />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/team" 
                  element={
                    <ProtectedRoute>
                      <TeamDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuctionProvider>
    </AuthProvider>
  );
}

export default App;
