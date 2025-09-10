import Header from './Header';
import { Box } from '@chakra-ui/react';

function Layout({ children }) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Box as="main" pt={4} px={{ base: 2, md: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
