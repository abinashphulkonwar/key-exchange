import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundScreen from "./404";

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");
  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    // @ts-ignore
    Element: pages[path]?.Index,
    // @ts-ignore
    loader: pages[path]?.Loader,
    // @ts-ignore
    action: pages[path]?.action,
    // @ts-ignore
    ErrorBoundary: pages[path]?.ErrorBoundary,
  });
}

routes.push({
  path: "*",
  Element: NotFoundScreen,
});

const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    element: <Element />,
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  }))
);

const App = () => {
  return (
    <div style={{ marginTop: "8px" }}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
