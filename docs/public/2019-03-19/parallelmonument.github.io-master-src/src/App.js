import React, { lazy, Suspense } from 'react';
import { Router } from '@reach/router';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
//import Home from './Home';
//import AuthAdmin from './AuthAdmin';
const Home = lazy(() => import('./Home'));
const AuthAdmin = lazy(() => import('./AuthAdmin'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Router>
      <Home path="/" />
      <AuthAdmin path="admin" />
    </Router>
  </Suspense>
);
export default App;
