import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

/*
  [
    GET = Get data from the server.
    POST = Send data to the server.
    PUT = Update data on the server.
    PATCH = Partially update data on the server.
    DELETE = Delete data from the server.
  ]
*/

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = request.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    return route.handler(request, response);
  }

  response.writeHead(404).end("Not Found!");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
