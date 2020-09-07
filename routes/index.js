var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  if (req.session.login) {
    res.redirect("/users/1");
    return;
  }
  res.render("index", {
    title: "aplikacja do wpisów",
    error_msg: req.session.login_fail
      ? "Niepoprawne hasło lub nazwa użytkownika!"
      : undefined,
    csrfToken: req.csrfToken(),
  });
});

router.post("/", async (req, res, next) => {
  const row = await req.get(req.db)(
    `SELECT * FROM osoba WHERE login = ? AND haslo = ?`, [req.body.login, req.body.haslo]
  );
  if (row !== undefined) {
    req.session.login = row.login;
    req.session.teacher = row.nauczyciel == 1;
    req.session.login_fail = false;
    res.redirect("/users");
  } else {
    req.session.login_fail = true;
    res.redirect("/");
  }
});

// wylogowywanie
router.get("/logout", (req, res, next) => {
  delete req.session.login;
  delete req.session.login_fail;
  res.redirect("/");
});

module.exports = router;
