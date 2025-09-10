import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import About from './components/About';
import { useUserStore } from './stores/userStore';
import { useTasksStore } from './stores/tasksStore';
import { useSubmissionsStore } from './stores/submissionsStore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import based on your file structure

function App() {
  const isAuthenticated = useUserStore(state => state.isAuthenticated());
  const setTasks = useTasksStore(state => state.setTasks);
  const setSubmissions = useSubmissionsStore(state => state.setSubmissions);
  const teamId = useUserStore(state => state.teamId);

  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasks);
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated, setTasks]);

  useEffect(() => {
    if (isAuthenticated && teamId) {
      const submissionsQuery = query(collection(db, 'submissions'), where('teamId', '==', teamId));
      const unsubscribe = onSnapshot(submissionsQuery, (snapshot) => {
        const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubmissions(submissions);
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated, teamId, setSubmissions]);

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
