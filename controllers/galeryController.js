const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET All Galery
exports.getGalerys = (req, res) => {
  db.query("SELECT * FROM galerys", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// GET Galery by ID
exports.getGaleryById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM galerys WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Galery not found" });
    res.json(results[0]);
  });
};

// CREATE Galery
exports.createGalery = (req, res) => {
  const { acara, lokasi, deskripsi, tanggal } = req.body;
  const imagePath = `http://localhost:5000/uploads/${req.file.filename}`;

  db.query(
    "INSERT INTO galerys (acara, lokasi, deskripsi, tanggal, image) VALUES (?, ?, ?, ?, ?)",
    [acara, lokasi, deskripsi, tanggal, imagePath],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: results.insertId,
        acara,
        lokasi,
        deskripsi,
        tanggal,
        imagePath,
      });
    }
  );
};

// UPDATE Galery
exports.updateGalery = (req, res) => {
  const { id } = req.params;
  const { acara, lokasi, deskripsi, tanggal } = req.body;

  // Ambil galery lama untuk cek image
  db.query("SELECT image FROM galerys WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Galery not found" });

    let oldImage = results[0].image;
    let newImage = oldImage;

    // Jika ada upload baru
    if (req.file) {
      newImage = `http://localhost:5000/uploads/${req.file.filename}`;

      // Hapus file lama (ambil filename dari URL lama)
      if (oldImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(oldImage)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
    }

    // Update data
    db.query(
      "UPDATE galerys SET acara=?, lokasi=?, deskripsi=?, tanggal=?, image=? WHERE id=?",
      [acara, lokasi, deskripsi, tanggal, newImage, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Galery updated successfully" });
      }
    );
  });
};

// DELETE Galery
exports.deleteGalery = (req, res) => {
  const { id } = req.params;

  // Ambil data galery dulu untuk hapus image
  db.query("SELECT image FROM galerys WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Galery not found" });

    const image = results[0].image;

    // Hapus data galery
    db.query("DELETE FROM galerys WHERE id=?", [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Hapus file image dari folder
      if (image) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(image)
        );
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }

      res.json({ message: "Galery deleted successfully" });
    });
  });
};

exports.upload = upload;