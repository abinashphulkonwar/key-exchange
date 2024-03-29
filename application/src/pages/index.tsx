import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { getCurrentUser } from "../web-api/user";
import { getUsersList } from "../web-api/get-users-list";
import { useContext, useEffect } from "react";
import { WSContext } from "../context/ws";

export const Loader = async ({}: { request: Request }) => {
  try {
    const user = await getCurrentUser();
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
    user: { isLogin: boolean; _id: string };
    users_list: { _id: string; email: string }[];
  };

  const wsContext = useContext(WSContext);

  useEffect(() => {
    try {
      if (!user.isLogin) return;
      wsContext.setUpUser(user);
    } catch (err: any) {
      console.log(err.message);
    }
  }, [user.isLogin]);

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
      <Flex>
        <Box mx={5} pt={5} overflowY={"scroll"} height={"100vh"}>
          <Heading>Key Exchanger</Heading>
          <Box mt={5}>
            {users_list.map((user_chat) => {
              return (
                <Link
                  to={`/chat/${user_chat._id}`}
                  state={{
                    user: user_chat,
                    device_user_id: user._id,
                  }}
                  key={user_chat._id}
                >
                  <Box boxShadow="xs" p="6" rounded="md" bg="white" mb={5}>
                    <Text>{user_chat._id}</Text>
                    <Text>{user_chat.email}</Text>
                  </Box>
                </Link>
              );
            })}
          </Box>
        </Box>
        <Box flex={1}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};
