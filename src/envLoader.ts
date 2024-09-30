import { resolve } from "path";
import { existsSync } from "fs";
import dotenv from "dotenv";

const node_env = process.env.NODE_ENV;
console.log("🚀 ~ file: envLoader.ts:6 ~ node_env:", node_env)
const cwd = process.cwd();
// adding all possible names of environment files
const envs = [
    resolve(cwd, `.env.${node_env}`),
    resolve(cwd, `.${node_env}.env`),
    resolve(cwd, ".env"),
    resolve(cwd, ".env.local"),
].filter((filename) => existsSync(filename));
console.log("🚀 ~ file: envLoader.ts:15 ~ envs:", envs)

const envFile = envs?.[0];
if (envFile) dotenv.config({ path: envFile });

if (!node_env) console.log("NODE_ENV is not set.");
else console.log(`NODE_ENV:: ${node_env}`);