import { Box, Flex, Heading, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, VStack, Link } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { InfoIcon, AtSignIcon, UnlockIcon } from '@chakra-ui/icons';

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [online, setOnline] = useState(navigator.onLine);
  const teamName = useUserStore(state => state.teamName);
  const clearUser = useUserStore(state => state.clearUser);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
  };

  return (
  <Box as="header" w="100%" bg="primary.500" color="white.500" px={4} py={2} boxShadow="md" position="sticky" top={0} zIndex={1000}>
      <Flex align="center" justify="space-between">
        <Heading as="h1" size="md">{teamName || 'Amazing Race'}</Heading>
        <Flex align="center" gap={2}>
          {online ? (
                <Box as="span" title="Online">
                  <Box as="span" display="inline-block" w={4} h={4} borderRadius="full" bg="trafficGreen.500" mr={2} border="1px solid" borderColor="white.500" />
                </Box>
          ) : (
                <Box as="span" title="Offline">
                  <Box as="span" display="inline-block" w={4} h={4} borderRadius="full" bg="trafficRed.500" mr={2} border="1px solid" borderColor="white.500" />
                </Box>
          )}
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
            aria-label="Open menu"
            onClick={onOpen}
          />
        </Flex>
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="lightGrey.500">
          <DrawerHeader borderBottomWidth="1px" bg="primary.500" color="white.500">Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Flex align="center" gap={2} as={RouterLink} to="/" onClick={onClose}>
                <AtSignIcon color="primary.500" />
                <Box as="span">Home</Box>
              </Flex>
                <Flex align="center" gap={2} as={RouterLink} to="/tasks" onClick={onClose}>
                  <InfoIcon color="yellow.500" />
                  <Box as="span">Tasks</Box>
                </Flex>
              <Flex align="center" gap={2} as={RouterLink} to="/login" onClick={() => { handleLogout(); onClose(); }}>
                <UnlockIcon color="primary.500" />
                <Box as="span">Logout</Box>
              </Flex>
              {/* Add more menu items here */}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Header;
