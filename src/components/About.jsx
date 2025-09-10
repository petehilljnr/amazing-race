import { Box, Heading, Text, VStack } from '@chakra-ui/react';

function About() {
  return (
    <Box maxW={{ base: '100%', md: 'md' }} mx="auto" mt={0} p={{ base: 4, md: 8 }} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="start">
        <Heading as="h2" size="lg">About Amazing Race</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }}>
          Amazing Race is a mobile-first app designed to make team challenges, navigation, and progress tracking easy and fun. Built with React, Firebase, and Chakra UI, it delivers a seamless experience for users on the go.
        </Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
          © 2025 Stantec. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
}

export default About;
