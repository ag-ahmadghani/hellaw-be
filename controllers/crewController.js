const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//konfigurasi multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/crews/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Get All Crew
exports.getCrews = (req, res) => {
    db.query("SELECT * FROM crews", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res,json(results);
    });
};

//Get Crew by Id
exports.getCrewById = (req, res) => {
    db.query("SELECT * FROM crews WHERE id = ?", [id], (err, results) =>{
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Crew not found" });
        res.json(results[0]);
    });
};

//Create Crew
exports.createCrew = (req, res) => {
    const { nama, role, moto } = req.body;
    const imagePath =  `http://localhost:5000/uploads/crews/${req.file.filename}`;

    db.query(
        "INSERT INTO crews (nama, role, moto, image) VALUES (?, ?, ?, ?)",
        [nama, role, moto, imagePath],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: results.insertId,
                nama,
                role,
                moto,
                imagePath
            });
        }
    )
};

// Update Crew
exports.updateCrew = (req, res) => {
    const { id } = req.params;
    const { nama, role, moto } = req.body;

    // cek image
    db.query("SELECT image FROM crews WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Crew not found" });

        let oldImage = results[0].image;
        let newImage = oldImage;

        // Jika ada upload baru
        if (req.file) {
            newImage = `http://localhost:5000/uploads/crews/${req.file.filename}`;

            if (oldImage) {
                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "crews",
                    path.basename(oldImage)
                );
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Failed to delete old image:" , err);
                });
            }
        }
        
        // Update data
        db.query(
            "UPDATE crews SET nama=?, role=?, moto=?, image=? WHERE id=?",
            [nama, role, moto, newImage, id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Crew berhasil di update" });
            }
        )
    });
};

// Delete Crew
exports.deleteCrew = (req, res) => {
    const { id } = req.params;

        // Ambil data Crew dulu untuk hapus image
    db.query("SELECT image FROM crews WHERE id=?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.status(404).json({ message: "Crew not found" });

        const image = results[0].image;

        // Hapus data Crew
        db.query("DELETE FROM crews WHERE id=?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Hapus file image dari folder
            if (image) {
            const imagePath = path.join(
                __dirname,
                "..",
                "uploads",
                "crews",
                path.basename(image)
            );
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
            }

            res.json({ message: "Crew deleted successfully" });
        });
    });
};

exports.upload = upload;