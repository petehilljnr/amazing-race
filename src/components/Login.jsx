import { useState } from 'react';
import { Box, Button, Input, Heading, VStack, Checkbox } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useUserStore } from '../stores/userStore';
import { Navigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const setUser = useUserStore(state => state.setUser);
  const setTeamId = useUserStore(state => state.setTeamId);
  const setTeamName = useUserStore(state => state.setTeamName);
  const isAuthenticated = useUserStore(state => state.isAuthenticated());

  // Login handler using Firebase Auth
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Add user to store if authenticated
      // Find teamId for the user
      const teamsSnapshot = await getDocs(collection(db, 'teams'));
      let foundTeamId = null;
      let foundTeamName = null;
      teamsSnapshot.forEach(doc => {
        const data = doc.data();
        if (Array.isArray(data.members) && data.members.includes(userCredential.user.uid)) {
          foundTeamId = doc.id;
          foundTeamName = data.name || null;
        }
      });
      if (foundTeamId) {
        setTeamId(foundTeamId);
      }
      if (foundTeamName) {
        setTeamName(foundTeamName);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
  <Box maxW="md" mx="auto" mt={0} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white.500">
      <VStack spacing={6}>
        <Heading as="h2" size="lg">Login</Heading>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </FormControl>
        <Checkbox isChecked={rememberMe} onChange={e => setRememberMe(e.target.checked)}>
          Remember Me
        </Checkbox>
        <Button bg="primary.500" color="white.500" _hover={{ bg: 'orange.500' }} isLoading={loading} onClick={handleLogin} width="full">
          Login
        </Button>
        {error && <Box color="softRed.500">{error}</Box>}
      </VStack>
    </Box>
  );
}

export default Login;
