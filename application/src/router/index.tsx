import { RouteObject } from "react-router-dom";
interface element {
  component: React.ComponentType<{}> | null | undefined;
  loader: () => any;
  action: () => any;
  ErrorBoundary: React.ComponentType<{}> | null | undefined;
}

const buildRoutes = (data: node): RouteObject => {
  const res: RouteObject = {};
  if (data.element?.component) {
    res.Component = data.element.component;
    res.loader = data.element?.loader;
    res.action = data.element?.action;
    res.ErrorBoundary = data.element?.ErrorBoundary;
  }

  res.path = data.path || "/";

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
export class RouteTree {
  root: node;
  constructor(path: string, element?: element) {
    this.root = new node(path, element);
  }
  insert(path: string, element: element) {
    if (path === "/") {
      this.root.element = element;
      return;
    }
    const paths = path.split("/");
    let current = this.root;
    // if (!paths.length || this.root.path != paths[0]) {
    //   console.log("Invalid");
    //   return;
    // }

    paths.map((val, index) => {
      const isEnd = index == paths.length - 1;
      if (current.path == val) {
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
            console.log("hii", element);

            current.child[val] = new node(val, element);
            return;
          }
          current.child[val] = new node(val);
          current = current.child[val];
        }
      }
    });
  }
  create(): RouteObject {
    const routes = buildRoutes(this.root);
    return routes;
  }
}
