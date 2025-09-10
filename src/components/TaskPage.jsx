import { useParams } from 'react-router-dom';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useTasksStore } from '../stores/tasksStore';

function TaskPage() {
  const { id } = useParams();
  const task = useTasksStore(state => state.tasks.find(t => t.id === id));

  if (!task) {
    return (
      <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="lightGrey.500">
        <Heading size="md" color="softRed.500">Task not found</Heading>
        <Text mt={4}>No task exists for ID: {id}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white.500">
      <VStack align="start" spacing={4}>
        <Heading size="lg" color="primary.500">{task.title || 'Untitled Task'}</Heading>
        <Text fontSize="md" color="midGrey.500">{task.description || 'No description provided.'}</Text>
        {/* Add more task details here as needed */}
      </VStack>
    </Box>
  );
}

export default TaskPage;
