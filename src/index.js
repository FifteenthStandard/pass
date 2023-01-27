import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Setup from './Setup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename="/pass">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/setup" element={<Setup />} />
    </Routes>
  </BrowserRouter>
);
