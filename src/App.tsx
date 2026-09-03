import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import Home from './pages/Home';
import PNLPractitioner from './pages/PNLPractitioner';
import MasterPNL from './pages/MasterPNL';
import Hipnoterapia from './pages/Hipnoterapia';
import Jornada from './pages/Jornada';
import MasterCoach from './pages/MasterCoach';
import NotFound from './pages/NotFound';
import FixedWhatsApp from './components/FixedWhatsApp';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <FixedWhatsApp />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pnl-practitioner" element={<PNLPractitioner />} />
          <Route path="/master-pnl" element={<MasterPNL />} />
          <Route path="/hipnoterapia" element={<Hipnoterapia />} />
          <Route path="/jornada" element={<Jornada />} />
          <Route path="/master-coach" element={<MasterCoach />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
