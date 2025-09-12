import { Box, Heading, VStack, Text, Link, Icon } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  MdHourglassEmpty,
   MdNotStarted,
  MdDoneAll,
  MdClose,
} from "react-icons/md";

import { useTasksStore } from "../stores/tasksStore";
import { useSubmissionsStore } from "../stores/submissionsStore";

function TasksList() {
  const tasks = useTasksStore((state) => state.tasks);
  const submissions = useSubmissionsStore((state) => state.submissions);

  return (
    <>
      <Heading size="lg" color="primary.500" mb={2}>
        Tasks
      </Heading>

      <VStack align="stretch" spacing={2} pb={2}>
        {tasks.length === 0 ? (
          <Text color="midGrey.500">No tasks available.</Text>
        ) : (
          tasks.map((task) => {
            const submission = submissions.find(
              (sub) => sub.taskId === task.id
            );
            const status = submission ? submission.status : "none";
            let statusIcon = null;
            if (status === "pending") {
              statusIcon = (
                <Icon
                  as={MdHourglassEmpty}
                  color="yellow.500"
                  boxSize={6}
                  mr={2}
                />
              );
            } else if (status === "none") {
              statusIcon = (
                <Icon
                  as={MdNotStarted}
                  color="midGrey.500"
                  boxSize={6}
                  mr={2}
                />
              );
            } else if (status === "correct") {
              statusIcon = (
                <Icon as={MdDoneAll} color="green.500" boxSize={6} mr={2} />
              );
            } else if (status === "wrong") {
              statusIcon = (
                <Icon as={MdClose} color="softRed.500" boxSize={6} mr={2} />
              );
            }

            // Score logic
            let score = task.points;
            if (score === undefined || score === null) score = 1;
            let scoreColor = "orange.700"; // bronze (<=2)
            if (score >= 4 && score <= 6) scoreColor = "gray.400"; // silver (3-6)
            if (score >= 7) scoreColor = "yellow.400"; // gold (7+)

            return (
              <Box
                key={task.id}
                p={3}
                borderRadius="md"
                bg="paleGrey.500"
                position="relative"
              >
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
                  <Link
                    as={RouterLink}
                    to={`/task/${task.id}`}
                    color="primary.500"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                  >
                    {statusIcon}
                    {task.name || "Untitled Task"}
                  </Link>
                  <Text fontSize="sm" color="black.500" mt={1}>
                    {task.description || "No description provided."}
                  </Text>
                </Box>
              </Box>
            );
          })
        )}
      </VStack>
    </>
  );
}

export default TasksList;
