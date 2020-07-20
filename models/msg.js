// -------------------------------------
// SAVE TO ATLAS START
var mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Marjo:boothbaynightmare@remote-doc-otc5a.mongodb.net/Rem_D?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connection Successful!");
});

var MsgSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    msg: {
      type: String,
      trim: true,
    },
  },
  //Put timestamps after closing schema bracets,
  // createdAt is renamed to "sent", updatedAt is set to false
  // because it's the same time as createdAt
  { timestamps: { createdAt: "sent", updatedAt: false } },
);

// Msg.findById("5f109907a2535e127064cb92", { id: '5f109907a2535e127064cb92'},   {
//   var userId = "5f109907a2535e127064cb92";
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(userId);
//   }
// });

//Third parameter names the collection
var Msg = mongoose.model("Msg", MsgSchema, "chatCollection");

module.exports = Msg;
//  SAVE TO ATLAS END
// -------------------------------------
