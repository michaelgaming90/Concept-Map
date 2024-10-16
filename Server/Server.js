const express = require('express');
const path = require('path');
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({limit: "100mb"}))

app.put("/save", (req, res) =>
{
  const Data = req.body;
  fs.readFile(path.join(__dirname, "Main_Data.json"), "utf-8", (err, data) =>
  {
    if(err)
    {
      return res.send("Server Failed to Read");
    }
    fs.writeFile(path.join(__dirname, "Main_Data.json"), JSON.stringify(Data, null, 2), (err) =>
    {
      if(err)
      {
        return res.send("Server Failed to Write");
      }
      return res.send("Server Successfully Saved")
    })
  })
})

app.get("/data", (req, res) =>
{
  res.sendFile(path.join(__dirname, "Main_Data.json"));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
