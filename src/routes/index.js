
const mountRoutes = (app)=>{
app.use("/contest", require("../feature/contest/routes/contest.route"));
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});
}



module.exports = {mountRoutes};
