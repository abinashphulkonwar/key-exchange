export const getUsersList = async () => {
  const req = await fetch("/api/chat/users-list", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await req.json();
  return data;
};
