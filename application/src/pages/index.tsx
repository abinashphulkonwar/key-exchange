import { Box, Heading } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export const Loader = async ({}: { request: Request }) => {
  const req = await fetch("/api/auth/current-user", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!req.ok) {
    return {
      isLogin: false,
    };
  }
  const data = await req.json();
  data.isLogin = true;
  return data;
};

export const Index = () => {
  const data = useLoaderData();
  console.log(data);
  return (
    <Box>
      <Heading>Key Exchanger</Heading>
    </Box>
  );
};
