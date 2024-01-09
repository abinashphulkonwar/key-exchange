import { Socket } from "socket.io";

class Node {
  _id: string;
  connections: Socket[];
  constructor(_id: string, connection: Socket) {
    this._id = _id;
    this.connections = [connection];
  }
  insert(connection: Socket) {
    this.connections.push(connection);
    return true;
  }
  remove(connection: Socket) {
    this.connections = this.connections.filter(
      (val) => val.id != connection.id
    );
    return true;
  }
}

export class Connections {
  root: { [key: string]: Node };
  count: number;
  constructor() {
    this.root = {};
    this.count = 0;
  }
  insert(connection: Socket) {
    if (!connection) return false;
    if (!this.root[connection.user._id]) {
      this.root[connection.user._id] = new Node(
        connection.user._id,
        connection
      );
    } else {
      this.root[connection.user._id].insert(connection);
    }

    this.count++;
    return true;
  }
  remove(connection: Socket) {
    if (!this.root[connection.user._id]) return;
    const node = this.root[connection.user._id];
    node.remove(connection);
    if (node.connections.length == 0) delete this.root[connection.user._id];
    this.count--;
  }
  get(userId: string) {
    return this.root[userId]?.connections || [];
  }
}

export const ConnectionsTree = new Connections();

export const add_connection = (connection: Socket) => {
  ConnectionsTree.insert(connection);
};
export const remove_connection = (connection: Socket) => {
  ConnectionsTree.remove(connection);
};
