import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SMTPSimulator from './SMTPSimulator';
import DynamicSimulator from './pages/Simulator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SMTPSimulator />} />
        <Route path="/simulator" element={<DynamicSimulator />} />
      </Routes>
    </Router>
  );
}

export default App;
