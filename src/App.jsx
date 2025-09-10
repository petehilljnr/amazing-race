
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import About from './components/About';
import { useUserStore } from './stores/userStore';

function App() {
  const isAuthenticated = useUserStore(state => state.isAuthenticated());

  return (
    <Router>
      <Layout>
        <Routes>
          {!isAuthenticated && (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
          <Route path="/login" element={<Login />} />
          {isAuthenticated && (
            <>
              <Route path="/" element={<About />} />
              <Route path="/about" element={<About />} />
              {/* Add more authenticated routes here */}
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
