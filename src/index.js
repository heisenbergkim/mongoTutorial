require("dotenv").config();

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const api = require("../api");

const app = new Koa();
const router = new Router();

const {
  PORT: port = 4000, // ���� �������� �ʴ´ٸ� 4000�� �⺻������ ���
  MONGO_URI: mongoURI
} = process.env;

mongoose.Promise = global.Promise; // Node�� Promise�� ����ϵ��� ����
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(e => {
    console.error(e);
  });

// ����� ����
router.use("/api", api.routes()); // api ���Ʈ ����

// ����� ���� ���� bodyParser ����
app.use(bodyParser());

// app �ν��Ͻ��� ����� ����
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log("listening to port", port);
});
