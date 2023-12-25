import { Box, Heading } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const Index = () => {
  return (
    <Box>
      <Heading>auth</Heading>
      <Outlet />
    </Box>
  );
};
