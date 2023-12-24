import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundScreen from "./404";
import { RouteTree } from "./router";

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });
const routeTree = new RouteTree("");
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  const routePath =
    fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`;
  console.log(fileName, routePath);
  const IndexCom = pages[path]?.Index;
  const element = {
    // @ts-ignore
    ErrorBoundary: pages[path]?.ErrorBoundary,
    // @ts-ignore
    component: pages[path]?.Index ? <IndexCom /> : null,
    // @ts-ignore
    loader: pages[path]?.Loader,
    // @ts-ignore
    action: pages[path]?.action,
  };
  console.log("element :", element);
  routeTree.insert(routePath, element);
  console.log(routeTree);

  // routes.push({
  //   path: ,
  //   Element: pages[path]?.Index,
  //   // @ts-ignore
  //   loader: pages[path]?.Loader,
  //   // @ts-ignore
  //   action: pages[path]?.action,
  //   // @ts-ignore
  //   ErrorBoundary: pages[path]?.ErrorBoundary,
  // });
}
const routes = routeTree.create();
console.log(routes);
const router = createBrowserRouter([
  routes,
  {
    path: "*",
    Component: NotFoundScreen,
  },
]);

const App = () => {
  return (
    <div style={{ marginTop: "8px" }}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
