const {requireHandle} = require("../middleware/session");
const mountRoutes = (app)=>{
app.use("/user", requireHandle,require("../feature/user/routes/user.route"));
app.use("/contest", require("../feature/contest/routes/contest.route"));
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});
}



module.exports = {mountRoutes};
