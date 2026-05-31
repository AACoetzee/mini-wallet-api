const express = require("express");

const { seedDemoData } = require("../data/store");

const router = express.Router();

router.post("/seed", (req, res) => {
  const demoData = seedDemoData();

  return res.status(201).json({
    message: "Demo data loaded.",
    ...demoData
  });
});

module.exports = router;
