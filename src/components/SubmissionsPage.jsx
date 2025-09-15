import { Box, Heading, VStack, Text, Badge, Icon } from '@chakra-ui/react';
import { MdHourglassEmpty, MdDoneAll, MdClose, MdNotStarted } from 'react-icons/md';
import { useSubmissionsStore } from '../stores/submissionsStore';
import { useLiveQuery } from 'dexie-react-hooks';
import queuedDb from '../stores/queuedSubmissions';

function SubmissionsPage() {
  const submissions = useSubmissionsStore(state => state.submissions);
  const queuedSubmissions = useLiveQuery(
    async () => await queuedDb.queuedSubmissions.toArray(),
    [],
    []
  );

  return (
    <>
      <Heading size="lg" color="primary.500" mb={6}>Submissions</Heading>
      <VStack align="stretch" spacing={2} pb={2}>
        <Heading size="md" color="midGrey.500">Queued Submissions</Heading>
        {queuedSubmissions.length === 0 ? (
          <Text color="midGrey.500">No queued submissions.</Text>
        ) : (
          queuedSubmissions.map((sub, idx) => {
            // Status icon
            const statusIcon = <Icon as={MdHourglassEmpty} color="yellow.500" boxSize={6} mr={2} />;
            // Score logic
            let score = sub.score;
            if (score === undefined || score === null) score = 1;
            let scoreColor = 'orange.700'; // bronze (<=2)
            if (score >= 3 && score <= 6) scoreColor = 'gray.400'; // silver (3-6)
            if (score >= 7) scoreColor = 'yellow.400'; // gold (7+)
            return (
              <Box key={sub.id || idx} p={3} borderRadius="md" bg="paleGrey.500" position="relative">
                <Box
                  position="absolute"
                  top={3}
                  right={3}
                  zIndex={1}
                  display="flex"
                  alignItems="center"
                >
                  <Box
                    borderRadius="full"
                    bg={scoreColor}
                    color="white"
                    minW={8}
                    h={8}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="md"
                    boxShadow="md"
                  >
                    {score}
                  </Box>
                </Box>
                <Box flex="1">
                  <Box display="flex" alignItems="center" fontWeight="bold">
                    {statusIcon}
                    Task: {sub.taskId}
                  </Box>
                  <Text fontSize="sm" color="black.500" mt={1}>{sub.description || 'No description provided.'}</Text>
                </Box>
              </Box>
            );
          })
        )}
        <Heading size="md" color="midGrey.500" mt={8}>Submitted</Heading>
        {submissions.length === 0 ? (
          <Text color="midGrey.500">No submissions yet.</Text>
        ) : (
          submissions.map((sub, idx) => {
            // Status icon
            let statusIcon = null;
            if (sub.status === 'pending') {
              statusIcon = <Icon as={MdHourglassEmpty} color="yellow.500" boxSize={6} mr={2} />;
            } else if (sub.status === 'none') {
              statusIcon = <Icon as={MdNotStarted} color="midGrey.500" boxSize={6} mr={2} />;
            } else if (sub.status === 'correct') {
              statusIcon = <Icon as={MdDoneAll} color="green.500" boxSize={6} mr={2} />;
            } else if (sub.status === 'wrong') {
              statusIcon = <Icon as={MdClose} color="softRed.500" boxSize={6} mr={2} />;
            }
            // Score logic
            let score = sub.score;
            if (score === undefined || score === null) score = 1;
            let scoreColor = 'orange.700'; // bronze (<=2)
            if (score >= 3 && score <= 6) scoreColor = 'gray.400'; // silver (3-6)
            if (score >= 7) scoreColor = 'yellow.400'; // gold (7+)
            return (
              <Box key={sub.id || idx} p={3} borderRadius="md" bg="paleGrey.500" position="relative">
                <Box
                  position="absolute"
                  top={3}
                  right={3}
                  zIndex={1}
                  display="flex"
                  alignItems="center"
                >
                  <Box
                    borderRadius="full"
                    bg={scoreColor}
                    color="white"
                    minW={8}
                    h={8}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="md"
                    boxShadow="md"
                  >
                    {score}
                  </Box>
                </Box>
                <Box flex="1">
                  <Box display="flex" alignItems="center" fontWeight="bold">
                    {statusIcon}
                    Task: {sub.taskId}
                  </Box>
                  <Text fontSize="sm" color="black.500" mt={1}>{sub.description || 'No description provided.'}</Text>
                </Box>
              </Box>
            );
          })
        )}
      </VStack>
    </>
  );
}

export default SubmissionsPage;
