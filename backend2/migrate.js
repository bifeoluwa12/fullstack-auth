const mongoose = require("mongoose");

const uri =
  "mongodb+srv://ifeoluwa:Won1%40love@student.6ntehcm.mongodb.net/myDatabase";

async function migrate() {
  try {
    // Connect using mongoose
    const conn = await mongoose.createConnection(uri).asPromise();

    // Get native MongoDB client
    const client = conn.getClient();

    // Access databases
    const testDB = client.db("test");
    const targetDB = client.db("myDatabase");

    // Access collections
    const testUsers = testDB.collection("users");
    const targetUsers = targetDB.collection("users");

    // Fetch data (NOW works)
    const users = await testUsers.find({}).toArray();

    if (users.length === 0) {
      console.log("❌ No data found in test.users");
      return;
    }

    console.log(`Found ${users.length} users. Moving...`);

    // Remove _id to avoid duplicate key error
    const cleanedUsers = users.map(({ _id, ...rest }) => rest);

    // Insert into new DB
    await targetUsers.insertMany(cleanedUsers);

    console.log("✅ Data moved successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    mongoose.connection.close();
  }
}

migrate();
