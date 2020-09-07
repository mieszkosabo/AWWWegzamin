var express = require("express");
var router = express.Router({ mergeParams: true });

const ENTRIES_PER_PAGE = 3;

router.get("/", async function (req, res, next) {
  if (!req.session.login) {
    res.redirect("../");
    return;
  }
  if (req.params.page_num === undefined) {
    res.redirect("users/1");
    return;
  }
  if (req.params.page_num < 1) {
    res.redirect("1");
    return;
  }
  const page = req.params.page_num;

  const sledzoneWpisy = await req.all(req.db)(
    `SELECT * FROM sledzacy JOIN wpis ON
     wpis.login_osoby = sledzacy.login_sledzonego
     WHERE sledzacy.login_osoby = '${req.session.login}'
     LIMIT ${ENTRIES_PER_PAGE} OFFSET ${ENTRIES_PER_PAGE * page - 3}`
  );

  if (sledzoneWpisy.length === 0 && +page !== 1) {
    res.redirect("1");
    return;
  }
  res.render("users", {
    title: "feed",
    sledzoneWpisy: sledzoneWpisy,
    user: req.session.login,
    page: page,
    showMyEntries: req.session.teacher ? req.session.teacher : undefined,
  });
});

router.get("/my_entries", async function (req, res, next) {
  if (!req.session.login || !req.session.teacher) {
    res.redirect("../");
    return;
  }
  const mojeWpisy = await req.all(req.db)(
    `SELECT rowid, tresc FROM wpis
     WHERE login_osoby = '${req.session.login}'`
  );
  res.render("myEntries", {
    title: "My entries",
    user: req.session.login,
    entries: mojeWpisy,
    csrfToken: req.csrfToken(),
  });
});

router.post("/my_entries", async function (req, res, next) {
  const newEntry = req.body.newEntry;
  await req.db_run(req.db)(
    `INSERT INTO wpis VALUES ('${req.session.login}', strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'), ?)`,
    newEntry
  );
  res.redirect("my_entries");
});

router.get("/deleteEntry/:rowId", async function (req, res, next) {
  if (!req.session.login) {
    // sesja wygasła
    res.redirect("../");
    return;
  }
  const entryid = req.params.rowId;
  await req.db_run(req.db)("BEGIN TRANSACTION;");
  const row = await req.get(req.db)(
    `SELECT rowid FROM wpis
     WHERE login_osoby = '${req.session.login}'
     AND rowid = ${entryid}`
  );
  if (!row) {
    res.redirect("../my_entries");
    await req.db_run(req.db)("ROLLBACK;");
    return;
  }
  await req.db_run(req.db)(`DELETE FROM wpis WHERE rowid = ${entryid}`);
  await req.db_run(req.db)("COMMIT;");
  res.redirect("../my_entries");
});

module.exports = router;
