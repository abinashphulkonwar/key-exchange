var node = /** @class */ (function () {
  function node(path, element) {
    this.path = path;
    this.element = element;
    this.child = {};
  }
  return node;
})();
var Tree = /** @class */ (function () {
  function Tree(path, element) {
    this.root = new node(path, element);
  }
  Tree.prototype.insert = function (path, element) {
    var paths = path.split("/").filter(function (val) {
      return val.length > 0;
    });
    var current = this.root;
    if (!paths.length || this.root.path != paths[0]) {
      console.log("Invalid");
      return;
    }
    paths.map(function (val, index) {
      var isEnd = index == paths.length - 1;
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
  };
  return Tree;
})();
var tree = new Tree("app", {
  component: "root route",
  loader: function () {
    return "hii";
  },
  action: function () {
    return "hiii";
  },
  ErrorBoundary: "error",
});
tree.insert("/app/login", {
  component: "login route",
  loader: function () {
    return "hii";
  },
  action: function () {
    return "hiii";
  },
  ErrorBoundary: "error login",
});
tree.insert("/app/account", {
  component: "account route",
  loader: function () {
    return "hii";
  },
  action: function () {
    return "hiii";
  },
  ErrorBoundary: "error account",
});
tree.insert("/app", {
  component: "app route",
  loader: function () {
    return "hii";
  },
  action: function () {
    return "hiii";
  },
  ErrorBoundary: "error app",
});
tree.insert("/app/login/data", {
  component: "user login route 🚀",
  loader: function () {
    return "hii";
  },
  action: function () {
    return "hiii";
  },
  ErrorBoundary: "error app 🚀",
});
tree.insert("/app/account", {
  component: "account route 🦸🚀",
  loader: function () {
    return "hii";
  },
  action: function () {
    return "hiii";
  },
  ErrorBoundary: "error account",
});
console.log(JSON.stringify(tree));
