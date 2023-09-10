import { connectToDatabase } from "../../../db/mongo.server";
import { ObjectId } from "mongodb";
export async function GET(request) {
  try {
    const { params } = request;
    const { id } = params;
    const db = await connectToDatabase();
    if (!db) {
      return new Response(
        JSON.stringify({
          message: "Error connecting to database",
        }),
        {
          status: 500,
        }
      );
    }
    const collection = db.db("todoList").collection("files");
    const result = await collection.findOne({
      _id: new ObjectId(id),
    });
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (err) {
    console.log("error", err);
  }
}
