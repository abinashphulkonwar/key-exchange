"use strict";
var buildRoutes = function (data) {
  var res = {};
  if (data.element) {
    // @ts-ignore
    res.element = data.element;
  }
  if (data.path) {
    res.path = data.path;
  }
  var childs = [];
  for (var key in data.child) {
    if (data.child[key]) {
      var childRes = buildRoutes(data.child[key]);
      childs.push(childRes);
    }
  }
  res.children = childs;
  return res;
};
var data = {
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
var routes = buildRoutes(data.root);
console.log(JSON.stringify(routes));
