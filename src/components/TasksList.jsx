import { Box, Heading, VStack, Text, Link, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MdHourglassEmpty, MdCheckBoxOutlineBlank, MdDoneAll, MdClose } from 'react-icons/md';

import { useTasksStore } from '../stores/tasksStore';
import { useSubmissionsStore } from '../stores/submissionsStore';

function TasksList() {
  const tasks = useTasksStore(state => state.tasks);
  const submissions = useSubmissionsStore(state => state.submissions);


  return (
    <VStack align="stretch" spacing={2} pb={2}>
      {tasks.length === 0 ? (
        <Text color="midGrey.500">No tasks available.</Text>
      ) : (
        tasks.map(task => {
          const submission = submissions.find(sub => sub.taskId === task.id);
          const status = submission ? submission.status : 'none';
          let statusIcon = null;
          if (status === 'pending') {
            statusIcon = <Icon as={MdHourglassEmpty} color="yellow.500" boxSize={6} mr={2} />;
          } else if (status === 'none') {
            statusIcon = <Icon as={MdCheckBoxOutlineBlank} color="midGrey.500" boxSize={6} mr={2} />;
          } else if (status === 'correct') {
            statusIcon = <Icon as={MdDoneAll} color="green.500" boxSize={6} mr={2} />;
          } else if (status === 'wrong') {
            statusIcon = <Icon as={MdClose} color="softRed.500" boxSize={6} mr={2} />;
          }
          return (
            <Box key={task.id} p={3} borderRadius="md" bg="paleGrey.500">
              <Link as={RouterLink} to={`/task/${task.id}`} color="primary.500" fontWeight="bold" display="flex" alignItems="center">
                {statusIcon}
                {task.name || 'Untitled Task'}
              </Link>
              <Text fontSize="sm" color="black.500">{task.description || 'No description provided.'}</Text>
            </Box>
          );
        })
      )}
    </VStack>
  );
}

export default TasksList;
