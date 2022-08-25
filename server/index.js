const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();
const {
    graphqlHTTP
} = require('express-graphql');
const schema = require('./schema/schema')
const port = process.env.PORT || 5000

const app = express()
app.use(cors())
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connecting to monggoDB");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongo db disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'DEVELOPMENT'
}))
app.listen(port, () => { 
    connect()
    console.log(`server running on port http://localhost:${port}`)
});