const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://saumyamaurya90_db_user:Wander12345@wanderlust.uawakh2.mongodb.net/?appName=wanderlust";
async function main() {
await mongoose.connect(MONGO_URL, {
    family: 4
});
console.log("connected to DB");

await listing.deleteMany({});
console.log("delete successful");

await listing.insertMany(initData.data);
console.log("data was initialized");

await mongoose.connection.close();
}

main().catch((err) => {
    console.log(err);
});
