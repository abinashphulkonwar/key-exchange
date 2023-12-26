import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { ApplicationDb } from "./web-api/Index-db/index.ts";
(async () => {
  await ApplicationDb.init();

  ApplicationDb.db()?.add("test", "test");
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
