import { RouteObject } from "react-router-dom";
interface element {
  component: string;
  loader: () => any;
  action: () => any;
  ErrorBoundary: string;
}

class node {
  path: string;
  element?: element;
  child: { [key: string]: node };
  constructor(path: string, element?: element) {
    this.path = path;
    this.element = element;
    this.child = {};
  }
}
class Tree {
  root: node;
  constructor(path: string, element?: element) {
    this.root = new node(path, element);
  }
  insert(path: string, element: element) {
    const paths = path.split("/").filter((val) => val.length > 0);
    let current = this.root;
    if (!paths.length || this.root.path != paths[0]) {
      console.log("Invalid");
      return;
    }

    paths.map((val, index) => {
      const isEnd = index == paths.length - 1;
      if (current.path == val) {
        console.log("hii");
        if (isEnd) {
          current.element = element;
        }
        return;
      } else {
        if (current.child[val]) {
          if (isEnd) {
            current.child[val].element = element;
            return;
          }
          current = current.child[val];
        } else {
          if (isEnd) {
            current.child[val] = new node(val, element);
            return;
          }
          current.child[val] = new node(val);
          current = current.child[val];
        }
      }
    });
  }
  create(): RouteObject[] {
    const routes: RouteObject[] = [];
    const paths: node[] = [];
    paths.push(this.root);

    let index = 0;

    while (paths.length) {
      const current = paths.pop();
      if (current?.element) {
        routes.push({
          path: current.path,
          // @ts-ignore
          element: current?.element,
        });
      }
      for (const key in current?.child) {
        const child = current?.child[key];
      }
    }

    return routes;
  }
}

const tree = new Tree("app", {
  component: "root route",
  loader() {
    return "hii";
  },
  action() {
    return "hiii";
  },
  ErrorBoundary: "error",
});

tree.insert("/app/login", {
  component: "login route",
  loader() {
    return "hii";
  },
  action() {
    return "hiii";
  },
  ErrorBoundary: "error login",
});
tree.insert("/app/account", {
  component: "account route",
  loader() {
    return "hii";
  },
  action() {
    return "hiii";
  },
  ErrorBoundary: "error account",
});

tree.insert("/app", {
  component: "app route",
  loader() {
    return "hii";
  },
  action() {
    return "hiii";
  },
  ErrorBoundary: "error app",
});

tree.insert("/app/login/data", {
  component: "user login route 🚀",
  loader() {
    return "hii";
  },
  action() {
    return "hiii";
  },
  ErrorBoundary: "error app 🚀",
});

tree.insert("/app/account", {
  component: "account route 🦸🚀",
  loader() {
    return "hii";
  },
  action() {
    return "hiii";
  },
  ErrorBoundary: "error account",
});

console.log(JSON.stringify(tree));
