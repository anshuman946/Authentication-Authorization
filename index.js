const express = require('express');

const app = express();

require('dotenv').config(); // data loaded from environment file
const PORT = process.env.PORT || 4000;

const cookieparser = require("cookie-parser");
//app.use(cookieParser());
app.use(express.json()); // body m se data parse krke layega

require("./config/database").connect(); // connect is function

//route import and mount
const user = require("./routes/user");
const cookieParser = require('cookie-parser');
app.use("/api/v1", user);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


