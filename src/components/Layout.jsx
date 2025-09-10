import Header from './Header';
import { Box } from '@chakra-ui/react';

function Layout({ children }) {
  return (
    <Box minH="100vh" bg="paleGrey.500">
      <Header />
      <Box as="main" pt={4} px={{ base: 2, md: 8 }} bg="white.500" borderRadius="lg" boxShadow="md" mx={{ base: 0, md: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
