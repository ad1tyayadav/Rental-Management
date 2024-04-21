const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO = "mongodb://localhost:27017/airbnb";

main()
    .then(() => {
        console.log("connected to db")
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "661b7bb9c265a1a39e42e8a4",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();