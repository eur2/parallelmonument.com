import React, { lazy, Suspense } from 'react';
import { Route } from 'wouter';
// import { Router } from '@reach/router';
//import { BrowserRouter as Router, Route } from 'react-router-dom';
//import Home from './Home';
//import AuthAdmin from './AuthAdmin';
const Home = lazy(() => import('./Home'));
const Admin = lazy(() => import('./Admin'));

const App = () => (
  <Suspense fallback={<div>(...)</div>}>
    <Route path="/" component={Home} />
    <Route path="/admin" component={Admin} />
  </Suspense>
);
export default App;
