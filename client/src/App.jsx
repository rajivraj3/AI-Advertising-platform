import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthLayout, PublicLayout } from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PosterGenerator from './pages/PosterGenerator';
import SloganGenerator from './pages/SloganGenerator';
import Chatbot from './pages/Chatbot';
import CampaignBuilder from './pages/CampaignBuilder';
import SavedCampaigns from './pages/SavedCampaigns';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/poster" element={<PosterGenerator />} />
            <Route path="/slogan" element={<SloganGenerator />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/campaign" element={<CampaignBuilder />} />
            <Route path="/saved" element={<SavedCampaigns />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
