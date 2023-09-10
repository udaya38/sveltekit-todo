import { connectToDatabase } from "../../db/mongo.server";
import { ObjectId } from "mongodb";
export async function GET() {
  try {
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
    const collection = db.db("todoList").collection("todo");
    const result = await collection.find().toArray();
    console.log(result);
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (err) {
    console.log("error", err);
  }
}

export async function POST({ request }: { request: any }) {
  try {
    const todoList = await request.json();
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
    const collection = db.db("todoList").collection("todo");
    const result = await collection.insertOne(todoList);
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (err) {
    console.log("error", err);
  }
}

export async function DELETE({ request }) {
  try {
    const { id } = await request.json();
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
    const collection = db.db("todoList").collection("todo");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (err) {
    console.log("error", err);
  }
}

export async function PUT({ request }) {
  try {
    const { _id, task } = await request.json();
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
    const collection = db.db("todoList").collection("todo");
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          task,
        },
      }
    );
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (err) {
    console.log("error", err);
  }
}
