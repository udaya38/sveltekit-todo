import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGO_URL } from "$env/static/private";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

console.log("udaya");
let cached: boolean = false;
let dbError: boolean = false;
export async function connectToDatabase() {
  if (cached) {
    console.log("cached...");
    return client;
  }
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log("connecting");
    await client.connect();
    cached = true;
    return client;
  } catch {
    console.log("error in mongodb");
    dbError = true;
  }
}
