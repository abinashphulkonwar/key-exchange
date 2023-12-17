import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
};

export const PersonalAccount = createSlice({
  name: "porsonalAccountSignUp",
  initialState,
  reducers: {
    addUserEmail: (state, action) => {
      state.email = action.payload.email;
    },
    signupEmailPassword: (state, action) => {
      const { email, name, token, time, id, isCreateAccount, refreshToken } =
        action.payload;
      let userId = id || "";
      state.email = email;
      state.name = name;
      state.idToken = token;
      state.token = refreshToken ? `${token} ${refreshToken}` : token;
      state.time = time;
      state.refreshToken = refreshToken;
      if (!isCreateAccount) state.isLogIn = true;
      state.id = userId;
    },

    onGetNotification: (state) => {
      if (state.count?.notificationCount >= 0)
        state.count.notificationCount = state.count.notificationCount + 1;
    },
    onSeeNotification: (
      state,
      action: {
        payload: { count: number };
        type: string;
      }
    ) => {
      try {
        const { count } = action.payload;
        if (typeof count !== "number") throw new Error("count is not a number");
        if (state.count?.notificationCount >= 0)
          state.count.notificationCount = Math.max(
            state.count.notificationCount - count,
            0
          );
      } catch (err: any) {
        console.log(err.message);
      }
    },
    addUsernameChatRomeName: (state, action) => {
      const { username, chatRomeName } = action.payload;
      state.username = username;
      state.chatRomeName = chatRomeName;
    },
    loginEmailPassword: (state, action) => {
      const { email, id, token, time, refreshToken } = action.payload;
      state.email = email;
      state.id = id;
      state.idToken = token;
      state.token = refreshToken ? `${token} ${refreshToken}` : token;

      state.time = time;
      state.isLogIn = true;
      state.refreshToken = refreshToken;
    },
    loginUser: (state) => {
      state.isLogIn = true;
    },
    notLogin: (state, action) => {
      const { screen } = action.payload;

      state.isLogIn = false;
      state.screen = screen;
    },
    logout: (__, _) => {
      return initialState;
    },
    onAccountTypeChange: (__, _) => {},
    setAccountType: (state, action) => {
      const { type } = action.payload;
      state.accountType = type;
    },

    getPrfile: (__, _) => {},
    setProfile: (state, action) => {
      const {
        username,
        chatroomName,
        profile,
        backgroundImage,
        name,
        count,
        token,
        features,
        bio,
      } = action.payload;
      if (username) state.username = username;
      if (chatroomName) state.chatroomName = chatroomName;
      if (profile) state.profile = profile;
      if (backgroundImage) state.backgroundImage = backgroundImage;
      if (name) state.name = name;
      if (count) state.count = count;
      if (token) state.token = token;
      if (features) state.features = features;
      if (bio) state.bio = bio;
    },
    updateProfile: (state, action) => {
      const { username, chatroomName, profile, backgroundImage } =
        action.payload;
      if (username) {
        state.username = username;
      }
      if (chatroomName) {
        state.chatRomeName = chatroomName;
      }
      if (profile) {
        state.profile = profile;
      }
      if (backgroundImage) {
        state.backgroundImage = backgroundImage;
      }
    },
  },
});

export const {
  addUserEmail,
  signupEmailPassword,
  loginEmailPassword,
  addUsernameChatRomeName,

  updateProfile,
  setProfile,
  getPrfile,
  notLogin,
  logout,
  loginUser,
  onAccountTypeChange,
  setAccountType,
  onGetNotification,
  onSeeNotification,
} = PersonalAccount.actions;

export default PersonalAccount.reducer;
