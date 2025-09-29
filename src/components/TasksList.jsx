import { Box, Heading, VStack, Text, Link, Icon, IconButton } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  MdHourglassEmpty,
  MdNotStarted,
  MdDoneAll,
  MdClose,
  MdHourglassTop,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import { useEffect, useState } from "react";

import { useTasksStore } from "../stores/tasksStore";
import { useSubmissionsStore } from "../stores/submissionsStore";
import queuedDb from "../stores/queuedSubmissions";
import { useUserStore } from "../stores/userStore";
import { useFavouritesStore } from "../stores/favouritesStore";

// Status icon mapping
const statusIconMap = {
  pending: { icon: MdHourglassEmpty, color: "yellow.500" },
  waiting: { icon: MdHourglassTop, color: "red.300" },
  none: { icon: MdNotStarted, color: "midGrey.500" },
  correct: { icon: MdDoneAll, color: "green.500" },
  wrong: { icon: MdClose, color: "red.500" },
};

function TasksList() {
  const tasks = useTasksStore((state) => state.tasks);
  const submissions = useSubmissionsStore((state) => state.submissions);
  const teamId = useUserStore((state) => state.teamId);
  const userId = useUserStore((state) => state.user?.uid );
  const [queuedSubmissions, setQueuedSubmissions] = useState([]);
  const faves = useFavouritesStore((state) => state.faves);
  const addFave = useFavouritesStore((state) => state.addFave);
  const removeFave = useFavouritesStore((state) => state.removeFave);
  console.log(faves)
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

            // Favourite logic
            const isFave = faves.some(
              (f) => f.userId === userId && f.taskId === task.id
            );
            const handleFaveClick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isFave) {
                removeFave(userId, task.id);
              } else {
                addFave({ userId, taskId: task.id });
              }
            };

            return (
              <Box
                key={task.id}
                p={3}
                borderRadius="md"
                bg="paleGrey.500"
                position="relative"
                display="flex"
                flexDirection="column"
              >
                {/* Score circle stays top right */}
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
                    minW={7}
                    h={7}
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
                      mt={0}
                    />
                    {task.name || "Untitled Task"}
                  </Link>
                  <Text fontSize="sm" color="black.500" mt={1}>
                    {task.description || "No description provided."}
                  </Text>
                </Box>
                {/* Footer with star icon aligned right */}
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  width="100%"
                >
                  <IconButton
                    aria-label={isFave ? "Remove from favourites" : "Add to favourites"}
                    icon={
                      isFave ? (
                        <Icon as={MdStar} color="yellow.400" boxSize={6} />
                      ) : (
                        <Icon as={MdStarBorder} color="gray.400" boxSize={6} />
                      )
                    }
                    variant="ghost"
                    size="sm"
                    onClick={handleFaveClick}
                  />
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
