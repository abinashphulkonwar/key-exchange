import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";

export const Index = () => {
  const params = useParams<{ _id: string }>();
  const { state } = useLocation();
  console.log(state);
  return (
    <Box w={"100%"} h={"100%"} p={5}>
      <Flex flexDirection={"column"} h={"100%"}>
        <Box>
          <Heading as="h4" size="md" mb={2}>
            {state?.email}
          </Heading>

          <Text fontSize="sm">{params._id}</Text>
        </Box>
        <Box>
          <Text>hiii</Text>
        </Box>
        <Spacer />

        <Box>
          <Flex alignItems={"center"}>
            <Textarea
              placeholder="Here is a sample placeholder"
              size="sm"
              resize={"none"}
            />
            <Box h={"100%"} w={5} />
            <Button>Send</Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
