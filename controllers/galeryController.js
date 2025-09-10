const db = require("../config/db");
const multer = require("multer");

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

  db.query(
    "UPDATE galerys SET acara=?, lokasi=?, deskripsi=?, tanggal=? WHERE id=?",
    [acara, lokasi, deskripsi, tanggal, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Galery updated successfully" });
    }
  );
};

// DELETE Galery
exports.deleteGalery = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM galerys WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Galery deleted successfully" });
  });
};

exports.upload = upload;