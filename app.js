const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("./utils/db");
const Template = require("./models/template");
const { validationResult } = require("express-validator");
const methodOverride = require("method-override");

// buat app
const apps = express();
const port = 3000;

// middleware
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// set view engine
apps.use(express.static("public"));
apps.use(expressLayouts);
apps.set("view engine", "ejs");
apps.use(express.urlencoded({ extended: true }));

apps.use(methodOverride("_method"));

// session
apps.use(cookieParser("rahasia"));
apps.use(
  session({
    secret: "rahasia",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);
apps.use(flash());
// home
apps.get("/", async (req, res) => {
  const data = await Template.find();
  res.render("catatan", {
    layout: "layouts/layout-utama",
    title: "Halaman catatan",
    data,
    msg: req.flash("msg"),
  });
});
// about
apps.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/layout-utama",
    title: "Halaman About",
  });
});
// catatan
apps.get("/catatan", async (req, res) => {
  const data = await Template.find();
  res.render("catatan", {
    layout: "layouts/layout-utama",
    title: "Halaman catatan",
    data,
    msg: req.flash("msg"),
  });
});
// tambah catatan
apps.get("/catatan/tambah", (req, res) => {
  res.render("tambahcatatan", {
    layout: "layouts/layout-utama",
    title: "Halaman tambah catatan",
  });
});
// tambah catatan post method
apps.post("/catatan", async (req, res) => {
  req.body.Judulcatatan = req.body.Judulcatatan.trim(); // Hapus spasi di awal & akhir
  req.body.catatan = req.body.catatan.trim(); // Opsional: hapus spasi juga di catatan
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("tambahcatatan", {
      layout: "layouts/layout-utama",
      title: "Halaman tambah catatan",
      errors: errors.array(),
    });
    return;
  } else {
    try {
      await Template.create(req.body);
      req.flash("msg", "catatan anda sudah masuk jangan lupa berbahagia :)");
      res.redirect("/catatan");
    } catch (error) {
      res.status(500).send("ada kesalahan");
    }
  }
});
// detail catatan
apps.get("/catatan/detail/:id", async (req, res) => {
  const data = await Template.findById(req.params.id);
  res.render("detailcatatan", {
    layout: "layouts/layout-utama",
    title: "Halaman detail catatan",
    data,
  });
});
// hapus catatan
apps.delete("/catatan/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    req.flash("msg", "catatan anda sudah dihapus :)");
    res.redirect("/catatan");
  } catch (error) {
    res.status(500).send("Ada kesalahan");
  }
});
// edit catatan
apps.get("/catatan/edit/:id", async (req, res) => {
  try {
    const data = await Template.findById(req.params.id);
    res.render("editcatatan", {
      layout: "layouts/layout-utama",
      title: "Halaman edit catatan",
      data,
    });
  } catch (error) {
    res.status(500).send("Ada kesalahan");
  }
});
apps.put("/catatan/edit/:id", async (req, res) => {
  try {
    await Template.updateOne(
      { _id: req.params.id },
      {
        $set: {
          Judulcatatan: req.body.Judulcatatan,
          catatan: req.body.catatan,
          statuses: new Date(),
        },
      }
    );
    req.flash("msg", "Catatan berhasil diperbarui!");
    res.redirect("/catatan");
  } catch (error) {
    res.status(500).send("Gagal memperbarui catatan");
  }
});

// handle error
apps.use("/", (req, res) => {
  res.status(404);
  res.render("404", {
    layout: "layouts/layout-utama",
    title: "Halaman tidak ditemukan",
  });
});

apps.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
