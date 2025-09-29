import { Box, Heading, VStack, Text, Link, Icon } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  MdHourglassEmpty,
  MdNotStarted,
  MdDoneAll,
  MdClose,
  MdHourglassTop, // For "waiting"
} from "react-icons/md";
import { useEffect, useState } from "react";

import { useTasksStore } from "../stores/tasksStore";
import { useSubmissionsStore } from "../stores/submissionsStore";
import queuedDb from "../stores/queuedSubmissions"; // Import Dexie queued submissions DB
import { useUserStore } from "../stores/userStore";

// Status icon mapping
const statusIconMap = {
  pending: { icon: MdHourglassEmpty, color: "yellow.500" },
  waiting: { icon: MdHourglassTop, color: "red.300" },
  none: { icon: MdNotStarted, color: "midGrey.500" },
  correct: { icon: MdDoneAll, color: "green.500" },
  wrong: { icon: MdClose, color: "softRed.500" },
};

function TasksList() {
  const tasks = useTasksStore((state) => state.tasks);
  const submissions = useSubmissionsStore((state) => state.submissions);
  const teamId = useUserStore((state) => state.teamId);
  const [queuedSubmissions, setQueuedSubmissions] = useState([]);

  // Load queued submissions from Dexie on mount
  useEffect(() => {
    async function fetchQueued() {
      if (!teamId) return;
      const allQueued = await queuedDb.queuedSubmissions
        .where("teamId")
        .equals(teamId)
        .toArray();
      setQueuedSubmissions(allQueued);
    }
    fetchQueued();
  }, [teamId, submissions]);

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
            // Find submission in either submissions or queuedSubmissions
            const submission =
              submissions.find((sub) => sub.taskId === task.id) ||
              queuedSubmissions.find((sub) => sub.taskId === task.id);

            const status = submission ? submission.status : "none";
            const statusIconProps = statusIconMap[status] || statusIconMap["none"];

            // Score logic
            let score = task.points;
            if (score === undefined || score === null) score = 1;
            let scoreColor = "orange.700"; // bronze (<=2)
            if (score >= 3 && score <= 6) scoreColor = "gray.400"; // silver (3-6)
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
                    <Icon
                      as={statusIconProps.icon}
                      color={statusIconProps.color}
                      boxSize={6}
                      mr={2}
                    />
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
