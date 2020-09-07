var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const ostatnieWpisy = await req.all(
    req.db
  )(`SELECT login_osoby, tresc FROM wpis
    ORDER BY timestamp DESC
    LIMIT 5`);

  res.send(ostatnieWpisy);
});

module.exports = router;
