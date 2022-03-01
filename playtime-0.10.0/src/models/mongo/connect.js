import * as dotenv from "dotenv";
import Mongoose from "mongoose";

import { seedData } from "./seed-data.js";
import * as seeder from "mais-mongoose-seeder";

const seedLib = seeder.default;

async function seed() {
  const seeder = seedLib(Mongoose);
  const dbData = await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
  console.log(dbData);
}

export function connectMongo() {
  dotenv.config();

  Mongoose.connect(process.env.db);
  const db = Mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", function() {
    console.log(`database connected to ${this.name} on ${this.host}`);
    seed();
  });
}
