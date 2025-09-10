import { Box, Heading, VStack, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTasksStore } from '../stores/tasksStore';

function TasksList() {
  const tasks = useTasksStore(state => state.tasks);

  return (
    <Box maxW="md" mx="auto" mt={1} p={5} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white.500">
      <VStack align="stretch" spacing={4}>
        {tasks.length === 0 ? (
          <Text color="midGrey.500">No tasks available.</Text>
        ) : (
          tasks.map(task => (
            <Box key={task.id} p={4} borderWidth={1} borderRadius="md" bg="paleGrey.500">
              <Link as={RouterLink} to={`/task/${task.id}`} color="primary.500" fontWeight="bold">
                {task.name || 'Untitled Task'}
              </Link>
              <Text fontSize="sm" color="black.500">{task.description || 'No description provided.'}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}

export default TasksList;
