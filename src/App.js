import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import Country from "./Country"; 
import State from "./State";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Country/>}/>
        <Route path='/state' element={<State/>}/> 
      </Routes>

    </Router>
  );
}

export default App;
