import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FEFDF8]">
        <Navbar />
        <div className= "max-w-5xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;