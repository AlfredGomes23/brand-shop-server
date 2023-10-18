const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors())
app.use(express.json())

//routes

app.get('/', (req, resp) => {
    resp.send("Server is Running. Welcome to my Brand-Shop.");
});

//terminal
app.listen(port, (req, resp) => {
    console.log("Brand-Shop server in running on port:", port);
})