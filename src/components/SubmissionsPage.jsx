import { Box, Heading, VStack, Text, HStack } from '@chakra-ui/react';
import { useSubmissionsStore } from '../stores/submissionsStore';
import { useTasksStore } from '../stores/tasksStore';
import { useLiveQuery } from 'dexie-react-hooks';
import queuedDb from '../stores/queuedSubmissions';

function SubmissionsPage() {
  const submissions = useSubmissionsStore(state => state.submissions);
  const tasks = useTasksStore(state => state.tasks);
  const queuedSubmissions = useLiveQuery(
    async () => await queuedDb.queuedSubmissions.toArray(),
    [],
    []
  );

  // Combine all submissions (Firebase + queued)
  const allSubs = [...submissions, ...queuedSubmissions];

  // Helper to get score from tasks
  const getTaskScore = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return parseInt(task?.points) ?? 1;
  };

  // Tally for "correct"
  const correctSubs = allSubs.filter(sub => sub.status === 'correct');
  const correctCount = correctSubs.length;
  const correctPoints = correctSubs.reduce((sum, sub) => sum + getTaskScore(sub.taskId), 0);

  // Tally for "waiting" or "pending"
  const waitingSubs = allSubs.filter(sub => sub.status === 'waiting' || sub.status === 'pending');
  const waitingCount = waitingSubs.length;
  const waitingPoints = waitingSubs.reduce((sum, sub) => sum + getTaskScore(sub.taskId), 0);

  const totalPossiblePoints = parseInt(correctPoints) + parseInt(waitingPoints);

  return (
    <>
      <Heading size="lg" color="primary.500" mb={6}>Points Summary</Heading>
      <VStack align="stretch" spacing={6} pb={2}>
        <Box p={4} borderRadius="md" bg="green.50" boxShadow="sm"  display="flex"  flexDirection="column" alignItems="center">
          <HStack spacing={4}>
            <Box>
              <Text fontWeight="bold" fontSize="md">
                Correct Submissions ({correctCount})
              </Text>
              <Text fontSize="xl" textAlign="center">
                <strong>{correctPoints} </strong> points earned<br />
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box p={4} borderRadius="md" bg="yellow.50" boxShadow="sm"  display="flex" flexDirection="column" alignItems="center">
          <HStack spacing={4}>
            <Box>
              <Text fontWeight="bold" fontSize="md">
                Waiting / Pending Submissions ({waitingCount})
              </Text>
              <Text fontSize="xl" textAlign="center">
                <strong>{waitingPoints} </strong> possible points earned<br />
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box p={4} borderRadius="md" bg="blue.50" boxShadow="sm" display="flex" flexDirection="column" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" mb={2} textAlign="center">
            Total Possible Points
          </Text>
          <Text
            fontSize={{ base: "6xl", md: "8xl" }}
            fontWeight="extrabold"
            color="primary.500"
            textAlign="center"
            lineHeight="1"
          >
            {totalPossiblePoints}
          </Text>
        </Box>
      </VStack>
    </>
  );
}

export default SubmissionsPage;
