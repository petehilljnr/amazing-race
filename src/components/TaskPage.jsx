import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useTasksStore } from "../stores/tasksStore";
import { useUserStore } from "../stores/userStore";
import { useSubmissionsStore } from "../stores/submissionsStore";
import queuedDb from "../stores/queuedSubmissions";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLiveLocation } from "../utils/location";
import L from "leaflet";
import crosshairSvg from "../assets/crosshair.svg";
import { getDistanceMeters } from "../utils/distance";
import { upsertQueuedSubmission } from "../stores/queuedSubmissions";
import { prepareImage } from "../utils/photoCompress";

const crosshairIcon = new L.Icon({
  iconUrl: crosshairSvg,
  iconSize: [20, 20], // Smaller size
  iconAnchor: [10, 10],
});

function FitBounds({ markerPos, userPos }) {
  const map = useMap();
  const [hasFitBounds, setHasFitBounds] = useState(false);

  useEffect(() => {
    if (!hasFitBounds && markerPos && userPos) {
      const bounds = L.latLngBounds([markerPos, userPos]);
      map.fitBounds(bounds, { padding: [20, 20] });
      setHasFitBounds(true);
    } else if (!hasFitBounds && markerPos) {
      map.setView(markerPos, 15);
      setHasFitBounds(true);
    }
    // Only run on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerPos, userPos, map]);

  return null;
}

function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = useTasksStore((state) => state.tasks.find((t) => t.id === id));
  const teamId = useUserStore((state) => state.teamId);
  const submissions = useSubmissionsStore((state) => state.submissions);
  const [userAnswer, setUserAnswer] = useState("");
  const userLocation = useLiveLocation({ enableHighAccuracy: true });

  useEffect(() => {
    async function checkSubmission() {
      if (!id || !teamId) return;

      // Check existing submissions in Zustand
      const existingSubmission = submissions.find(
        (s) => s.taskId === id && s.teamId === teamId
      );

      if (existingSubmission) {
        setUserAnswer(existingSubmission.answer || "");
        return;
      }

      // Check queued submissions in Dexie
      const queued = await queuedDb.queuedSubmissions.get([id, teamId]);
      if (queued && queued.answer) {
        setUserAnswer(queued.answer);
      }
    }
    checkSubmission();
  }, [id, teamId, submissions]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await prepareImage(file);
        const reader = new FileReader();
        reader.onload = () => setUserAnswer(reader.result);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.log("Error processing image:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!taskId || !teamId || !userAnswer) return;
    const submission = {
      taskId,
      teamId,
      answerType: task.answerType,
      answer: userAnswer,
      status: "waiting",
      modifiedTime: Date.now(),
    };
    await upsertQueuedSubmission(submission);
    navigate("/tasks");
  };

  if (!task) {
    return (
      <Box
        maxW="md"
        mx="auto"
        mt={1}
        p={5}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
        bg="lightGrey.500"
      >
        <Heading size="md" color="softRed.500">
          Task not found
        </Heading>
        <Text mt={4}>No task exists for ID: {id}</Text>
      </Box>
    );
  }

  const markerPos =
    typeof task.lat === "number" && typeof task.lng === "number"
      ? [task.lat, task.lng]
      : null;
  const userPos = userLocation ? [userLocation.lat, userLocation.lng] : null;
  const distance =
    markerPos && userPos
      ? getDistanceMeters(markerPos[0], markerPos[1], userPos[0], userPos[1])
      : null;

  // Example: get teamId and taskId from props, store, or context
  // For demonstration, assuming taskId from task.id and teamId from userStore
  const taskId = task?.id;
  // You may need to import and use useUserStore to get teamId
  // import { useUserStore } from '../stores/userStore';
  // const teamId = useUserStore(state => state.teamId);
  const isSubmitEnabled = Boolean(
    taskId && teamId && userAnswer && userAnswer.trim() !== ""
  );

  return (
    <VStack align="start" spacing={4} pb={4}>
      <Heading size="lg" color="primary.500">
        {task.name || "Untitled Task"}
      </Heading>
      <Text fontSize="md" color="black.500">
        {task.description || "No description provided."}
      </Text>
      {/* Add more task details here as needed */}
      {task.hasGPS && markerPos && (
        <Box
          w="100%"
          h="300px"
          borderRadius="md"
          overflow="hidden"
          boxShadow="sm"
          position="relative"
          pb={8} // Add padding to the bottom for the overlay
        >
          <MapContainer
            center={markerPos}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker
              center={markerPos}
              radius={6}
              color="red"
              fillColor="red"
              fillOpacity={1}
            />
            {userPos && <Marker position={userPos} icon={crosshairIcon} />}
            {/* Add dashed line if both positions exist */}
            {markerPos && userPos && (
              <Polyline
                positions={[markerPos, userPos]}
                pathOptions={{
                  color: "blue",
                  weight: 1,
                  dashArray: "6 6",
                  opacity: 0.7,
                }}
              />
            )}
            <FitBounds markerPos={markerPos} userPos={userPos} />
          </MapContainer>
          {distance !== null && task.hasGPS && (
            <Box
              position="absolute"
              bottom={4} // Increased from 2 for more space
              left={4} // Increased from 2 for more space
              bg="white"
              px={3}
              py={1}
              borderRadius="md"
              boxShadow="lg"
              fontSize="sm"
              color="blue.500"
              zIndex={1000} // Increased zIndex to ensure visibility
            >
              Distance to marker: {distance.toFixed(1)} m
            </Box>
          )}
        </Box>
      )}

      {/* Answer area */}
      {task.answerType === "text" && (
        <Box w="100%" mt={4}>
          <Text fontWeight="bold" mb={2}>
            Your Answer:
          </Text>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </Box>
      )}
      {task.answerType === "photo" && (
        <Box w="100%" mt={0}>
          <Text fontWeight="bold" mb={2}>
            Upload Photo Answer:
          </Text>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
          <label htmlFor="photo-upload">
            <Button as="span" colorScheme="teal" width="100%">
              Choose Photo
            </Button>
          </label>
          {userAnswer && (
            <Box mt={2}>
              <Text fontSize="sm" color="green.500">
                Photo selected!
              </Text>
              <img
                src={userAnswer}
                alt="Selected"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </Box>
      )}
      <Box
        position="fixed"
        left={0}
        bottom={0}
        w="100%"
        p={4}
        bg="white"
        boxShadow="md"
        zIndex={100}
      >
        <Button
          colorScheme="primary"
          width="100%"
          size="lg"
          isDisabled={!isSubmitEnabled}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </VStack>
  );
}

export default TaskPage;
