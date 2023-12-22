export const getCurrentUser = async () => {
  console.log("data");
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
