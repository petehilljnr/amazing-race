import { Box, Heading, Text, VStack, HStack, Icon, Divider } from '@chakra-ui/react';
import { MdHourglassEmpty, MdHourglassTop, MdNotStarted, MdDoneAll, MdClose, MdStar } from "react-icons/md";

const pointsInfo = [
  { points: "1 to 3", description: "Easy task completed correctly", bg: "orange.700", color: "white" },
  { points: "4 to 6", description: "Medium task completed correctly", bg: "gray.400", color: "white" },
  { points: "7 to 10", description: "Hard task completed correctly", bg: "yellow.400", color: "white" },

];

const statusInfo = [
  {
    label: "Not Started",
    icon: MdNotStarted,
    color: "gray.500",
    description: "You have not attempted this task yet."
  },
   {
    label: "Waiting for Upload",
    icon: MdHourglassTop,
    color: "red.300",
    description: "Your answer is waiting to upload to the server."
  },
  {
    label: "Pending",
    icon: MdHourglassEmpty,
    color: "yellow.500",
    description: "Your answer has been submitted and is awaiting review (generally photos)."
  },  
  {
    label: "Correct",
    icon: MdDoneAll,
    color: "green.500",
    description: "Your answer was correct and you earned points for this task."
  },
  {
    label: "Wrong",
    icon: MdClose,
    color: "red.500",
    description: "Your answer was incorrect. You can try again."
  }
];

function About() {
  return (
    <Box maxW={{ base: '100%', md: 'md' }} mx="auto" mt={0} p={{ base: 4, md: 8 }} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="start">
        <Heading as="h2" size="lg">About Amazing Race</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }}>
          Welcome to the Amazing Race - an exciting team-based competition that challenges your skills in navigation, problem-solving, and collaboration.

        </Text>
        <Divider />
        <Heading as="h3" size="md" mt={2}>Safety</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }}>
          <strong>Safety is our top priority.</strong> When participating in outdoor tasks, there must be a minimum of two people from the same team together at all times. Please stay aware of your surroundings and look out for each other.
          <br />
          <br />
          If you encounter any unsafe situations, please report them to the event organizers immediately.
        </Text>
        <Divider />
        <Heading as="h3" size="md" mt={2}>How It Works</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }}>
          Teams will navigate to various locations to complete tasks that test a range of skills. Tasks may include answering questions, solving puzzles, or performing specific activities. Each task has a point value based on its difficulty.
        </Text>
        <Divider />
        <Heading as="h3" size="md" mt={2}>Scoring System</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }}>
          Teams earn points by completing tasks correctly. Each correct answer awards points based on the task's difficulty. Incorrect answers will result in no points. The team with the highest score at the end of the race wins!
        </Text>
        <VStack align="start" spacing={2} mt={2}>
          {pointsInfo.map(point => (
            <HStack key={point.description}>
              <Box
                bg={point.bg}
                color={point.color}
                px={2}
                py={1}
                borderRadius="md"
                w="100px" // <-- Fixed width for all point boxes
                textAlign="center"
                fontWeight="bold"
              >
                {point.points} pts
              </Box>
              <Text ml={2}>{point.description}</Text>
            </HStack>
          ))}
        <Text>
          Task points are shown in the top-right corner of each task card.
        </Text>
        </VStack>
        <Divider />
        <Heading as="h3" size="md" mt={2}>Task Statuses</Heading>
        <VStack align="start" spacing={2}>
        <Text>
          The status of each task helps you track your progress.  The following icons indicate the current state of each task.  These are shown next to each task name in the tasks list and at the top of each task page:
        </Text>
          {statusInfo.map(status => (
            <HStack key={status.label} align="start" spacing={3} w="100%">
              <Icon as={status.icon} color={status.color} boxSize={6} mt={1} />
              <Box>
                <Text fontWeight="bold">{status.label}:</Text>
                <Text pl={2}>{status.description}</Text>
              </Box>
            </HStack>
          ))}
        </VStack>
        <Divider />
        <Heading as="h3" size="md" mt={2}>Favourites</Heading>
        <HStack>
          <Icon as={MdStar} color="yellow.400" boxSize={6} />
          <Text fontSize={{ base: 'md', md: 'lg' }}>
            You can mark tasks as favourites by clicking the star icon on each task card. This helps you easily find and prioritize tasks you want to focus on.
          </Text>
        </HStack>
        <Divider />
        
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
          © 2025 Stantec. All rights reserved.
        </Text>
      </VStack>
    </Box>
  );
}

export default About;
