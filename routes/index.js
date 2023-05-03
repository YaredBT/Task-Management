const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => res.render("welcome"));

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Task.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render("dashboard", { tasks: result });
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});
router.post("/dashboard", ensureAuthenticated, (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.redirect("/dashboard");
    })
    .catch((err) => console.log(err));
});
router.get("/dashboard/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render("details", { task: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
//edit

router.delete("/dashboard/:id", ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/dashboard" });
    })
    .catch((err) => console.log(err));
});
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("create");
});
router.get("/edit", ensureAuthenticated, (req, res) => {
  res.render("edit");
});

module.exports = router;
