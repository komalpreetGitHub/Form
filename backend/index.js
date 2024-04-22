const express = require("express");
const cors = require("cors");
const userRouter = require("./user");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/user" , userRouter)


app.listen(5000, () => {
    console.log("server is running")
})