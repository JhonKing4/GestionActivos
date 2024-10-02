import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path= '/' element= { <Login></Login>} />
        <Route path= '/home' element= {Home} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
