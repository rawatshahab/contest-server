const http = require("http");
const app = require("./src/app");
const {mongoDBConnectionHandler} = require("./src/db/mongoDB");

const PORT = 5009;
const server = http.createServer(app);
mongoDBConnectionHandler().then(() => {
  server.listen(PORT, () => {
    console.log(`server up on ${PORT}`);
  });
}).catch((error) => {
  console.log(error);
});