import { Box, Button, Heading, Input, Text } from "@chakra-ui/react";

export function Index() {
  return (
    <Box>
      <Heading>Create Account</Heading>
      <form action="http://localhost:3000/api/auth/login" method="post">
        <Box>
          <Text>Email</Text>
          <Input
            type="text"
            name="email"
            id="email"
            placeholder="Enter Your User email..."
            required
          />
        </Box>
        <Box>
          <Text>Password</Text>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your User password..."
            required
          />
        </Box>

        <Button type="submit">Sign Up</Button>
      </form>
    </Box>
  );
}
