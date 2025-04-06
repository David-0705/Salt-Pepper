const { MongoClient } = require('mongodb');

// Replace the following with your MongoDB Atlas connection string
const uri = "mongodb+srv://afernandes1808:CooSocCnjkVuntlG@cluster0.lz0dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function insertUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    
    const database = client.db("myDatabase");
    const usersCollection = database.collection("users");
    
    // Define the documents to insert
    const users = [
      { 
        email: 'user@example.com', 
        password: 'password123', 
        userType: 'regular', 
        priority: 'low'
      },
      { 
        email: 'john@example.com', 
        password: 'john123', 
        userType: 'regular', 
        priority: 'low'
      },
      { 
        email: '0@0.com',
        password: '12345',
        userType: 'regular',
        priority: 'low'
      },
      { 
        email: 'admin@example.com', 
        password: 'admin123', 
        userType: 'admin', 
        priority: 'high'
      },
      { 
        email: 'police@example.com', 
        password: 'police123', 
        userType: 'authority', 
        authorityType: 'police', 
        priority: 'critical'
      },
      { 
        email: 'traffic@example.com', 
        password: 'traffic123', 
        userType: 'authority', 
        authorityType: 'traffic_police', 
        priority: 'high'
      },
      { 
        email: 'ngo@example.com', 
        password: 'ngo123', 
        userType: 'authority', 
        authorityType: 'ngo', 
        priority: 'medium'
      }
    ];
    
    // Insert the documents
    const result = await usersCollection.insertMany(users);
    
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}

insertUsers().catch(console.error);