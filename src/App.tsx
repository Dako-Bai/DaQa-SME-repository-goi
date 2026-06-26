import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NBPage from './pages/NBPage';
import AZKPage from './pages/AZKPage';
import PricesPage from './pages/PricesPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';
import { AppProvider } from './contexts/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nb" element={<NBPage />} />
            <Route path="/azk" element={<AZKPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
