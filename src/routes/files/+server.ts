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
    const collection = db.db("todoList").collection("fileDetails");
    const result = await collection.find().toArray();
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (err) {
    console.log("error", err);
  }
}

export async function POST({ request }: { request: any }) {
  let session: any = null;
  let endResult: any = null;
  try {
    const fileData = await request.json();
    const { url, ...rest } = fileData;
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
    session = db.startSession();
    // Define options for the transaction
    const transactionOptions: any = {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
      readPreference: "primary",
    };

    const result = await session.withTransaction(async () => {
      const dbClient = db.db("todoList");

      // Your transactional operations go here
      const collection = dbClient.collection("files");
      const detailsResult = await collection.insertOne({ url }, { session });
      // Perform other transactional operations
      console.log(detailsResult);
      if (!detailsResult) {
        await session?.abortTransaction();
      }

      const collectionDetails = dbClient.collection("fileDetails");
      const finalResult = await collectionDetails.insertOne({
        ...rest,
        fileId: detailsResult.insertedId,
      });
      if (!finalResult) {
        await session?.abortTransaction();
      }
      endResult = {
        filesId: detailsResult.insertedId,
        fileDetailsId: finalResult.insertedId,
      };
    }, transactionOptions);
    console.log("transcaions", result);
    return new Response(JSON.stringify(endResult), {
      status: 200,
    });
  } catch (err) {
    //session?.abortTransaction();
    console.log("error", err);
  }
}

export async function DELETE({ request }: { request: any }) {
  let session: any = null;
  let endResult: any = null;
  try {
    const { id, fileId } = await request.json();
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
    session = db.startSession();
    // Define options for the transaction
    const transactionOptions: any = {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
      readPreference: "primary",
    };

    const result = await session.withTransaction(async () => {
      const dbClient = db.db("todoList");

      // Your transactional operations go here
      const collection = dbClient.collection("files");
      const detailsResult = await collection.deleteOne({
        _id: new ObjectId(fileId),
      });
      // Perform other transactional operations
      console.log(detailsResult);
      if (!detailsResult) {
        await session?.abortTransaction();
      }

      const collectionDetails = dbClient.collection("fileDetails");
      const finalResult = await collectionDetails.deleteOne({
        _id: new ObjectId(id),
      });
      if (!finalResult) {
        await session?.abortTransaction();
      }
      endResult = finalResult;
    }, transactionOptions);
    console.log("transcaions", result);
    return new Response(JSON.stringify(endResult), {
      status: 200,
    });
  } catch (err) {
    //session?.abortTransaction();
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
