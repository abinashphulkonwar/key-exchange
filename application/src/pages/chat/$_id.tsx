import { Box, Button, Flex, Heading, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import { useChats } from "../../hooks/useChat";
import { getCurrentUser } from "../../web-api/user";
import { UseSendMessage } from "../../hooks/useSendMessage";

export const Loader = async ({ request }: { request: Request }) => {
  try {
    console.log("Loader: ", request.url);

    const user = await getCurrentUser();
    return user;
  } catch (err) {
    console.log(err);

    return {
      isLogin: null,
    };
  }
};

export const Index = () => {
  const [input_message, setInputMessage] = useState<string>("");
  const params = useParams<{ _id: string }>();
  const { state } = useLocation() as {
    state: {
      user: { _id: string; email: string };
      device_user_id: string;
    };
  };

  const loader = useLoaderData() as {
    _id: string;
    isLogin: boolean;
  };

  const user = useMemo(() => {
    return {
      _id: state?.device_user_id || loader._id,
    };
  }, [loader, state]);

  const useChat = useChats({
    id: 0,
    _id: params._id || "",
    name: state?.user.email,
    profile: "",
  });

  const useMessage = UseSendMessage({
    id: 0,
    _id: params._id || "",
    name: state?.user.email,
    profile: "",
  });

  const init = async () => {
    try {
      await useChat.setupCurrentUser({ _id: user._id });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    try {
      console.log("rerender: ", state.user.email);
      init();
    } catch (err: any) {
      console.log(err.message);
    }
  }, [params._id]);

  const onMessageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("input");
    setInputMessage(e.target.value);
  };

  const onSendHandler = async () => {
    try {
      const record = await useChat.save(input_message);
      console.log("record: ", record);
      await useMessage.sendMessage(record);

      setInputMessage("");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <Box w={"100%"} maxH={"100vh"} h={"100%"} p={5}>
      <Flex flexDirection={"column"} h={"100%"}>
        <Box>
          <Heading as="h4" size="md" mb={2}>
            {state.user?.email}
          </Heading>

          <Text fontSize="sm">{params._id}</Text>
        </Box>
        <Box flex={1} paddingY={10} overflowY={"scroll"}>
          <Box>
            {useChat.list_messages.map((message) => {
              return (
                <div key={message.id.toString()}>
                  <Text display={"inline"} fontSize="large" fontWeight="500">
                    {message.from == user._id ? "you" : useChat.reciver?.name}{" "}
                  </Text>

                  <Text display={"inline"}>{message.content}</Text>
                </div>
              );
            })}
          </Box>
        </Box>

        <Box>
          <Flex alignItems={"center"}>
            <Textarea
              placeholder="Here is a sample placeholder"
              size="sm"
              resize={"none"}
              value={input_message}
              onChange={onMessageHandler}
            />
            <Box h={"100%"} w={5} />
            <Button onClick={onSendHandler}>Send</Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
