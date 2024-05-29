import "./App.css";
import "./index.css";
import logo from "./logo.svg"

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import AddNewPosition from './AddNewPosition';

function App() {

  

   
  return (
 
<Router>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-new-position" element={<AddNewPosition />} />

      </Routes>
    </Router>     
  );
}

export default App;
