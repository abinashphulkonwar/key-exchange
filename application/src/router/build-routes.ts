import { RouteObject } from "react-router-dom";

interface node {
  path: string;
  element: {
    component: string;
    ErrorBoundary: string;
  };
  child: {
    [key: string]: node;
  };
}

const buildRoutes = (data: node): RouteObject => {
  const res: RouteObject = {};
  if (data.element) {
    // @ts-ignore
    res.element = data.element;
  }
  if (data.path) {
    res.path = data.path;
  }
  const childs = [];
  for (const key in data.child) {
    if (data.child[key]) {
      const childRes = buildRoutes(data.child[key]);
      childs.push(childRes);
    }
  }
  res.children = childs;
  return res;
};

const data = {
  root: {
    path: "app",
    element: {
      component: "app route",
      ErrorBoundary: "error app",
    },
    child: {
      login: {
        path: "login",
        element: {
          component: "login route",
          ErrorBoundary: "error login",
        },
        child: {
          data: {
            path: "data",
            element: {
              component: "user login route 🚀",
              ErrorBoundary: "error app 🚀",
            },
            child: {},
          },
        },
      },
      account: {
        path: "account",
        element: {
          component: "account route 🦸🚀",
          ErrorBoundary: "error account",
        },
        child: {},
      },
    },
  },
};

const routes = buildRoutes(data.root);
console.log(routes);
