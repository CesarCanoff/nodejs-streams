import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { BuildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: BuildRoutePath("/users"),
    handler: async (_, response) => {
      const { search } = request.query;

      const users = database.select("users", search ? {
        name, search,
        age: search
      }: null); 
    
      return response.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: BuildRoutePath("/users"),
    handler: async (request, response) => {
      const { name, age } = request.body;

      const user = {
        id: randomUUID(),
        name,
        age,
      };

      database.insert("users", user);

      return response.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: BuildRoutePath("/users/:id"),
    handler: async (request, response) => {
      const { id } = request.params;
      const { name, age } = request.body;

      database.update("users", id, { name, age });

      return response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: BuildRoutePath("/users/:id"),
    handler: async (request, response) => {
      const { id } = request.params;

      database.delete("users", id);

      return response.writeHead(204).end();
    },
  },
];
