import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { getCurrentUser } from "../web-api/user";
import { getUsersList } from "../web-api/get-users-list";

export const Loader = async ({}: { request: Request }) => {
  try {
    console.log("Loader");

    const user = await getCurrentUser();

    console.log(user);
    const users_list = await getUsersList();

    return {
      user: user,
      users_list: users_list,
    };
  } catch (err) {
    console.log(err);

    return {
      user: {
        isLogin: null,
      },
      users_list: [],
    };
  }
};

export const Index = () => {
  const { user, users_list } = useLoaderData() as {
    user: { isLogin: boolean };
    users_list: { _id: string; email: string }[];
  };

  if (!user.isLogin) {
    return (
      <Box>
        <Heading>Not Loged In</Heading>
        <Box h={20} />
        <Flex>
          <Link to={"/auth/login"}>Login</Link>
          <Spacer />
          <Link to={"/auth/signup"}>Create Account</Link>
        </Flex>
        <Outlet />
      </Box>
    );
  }
  return (
    <Box>
      <Outlet />

      <Heading>Key Exchanger</Heading>
      {users_list.map((user) => {
        return (
          <Box boxShadow="xs" p="6" rounded="md" bg="white" mb={5}>
            <Text>{user._id}</Text>
            <Text>{user.email}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
