import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './app/page';
import Login from './app/login/page';
import Register from './app/register/page';
import Profile from './app/profile/page';
import AddPost from './app/add/page';
import AdminDashboard from './app/admin/page';
import Speeches from './app/speeches/page';
import Manqabat from './app/manqabat/page';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add" element={<AddPost />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/speeches" element={<Speeches />} />
          <Route path="/manqabat" element={<Manqabat />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;