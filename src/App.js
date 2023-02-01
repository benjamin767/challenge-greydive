import './App.css';
import React from "react";
import Form from './components/Form/Form';
import Answers from './components/Answers/Answers';
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Route 
        exact path="/" component={Form}
      />
      <Route 
        exact path="/answer/:userId" component={Answers}
      />
    </Router>
  );
}

export default App;
