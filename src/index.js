require("dotenv").config();

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const { PORT: port = 4000, MONGO_URI: MONGO_URI } = process.env;

const app = new Koa();
const router = new Router();
