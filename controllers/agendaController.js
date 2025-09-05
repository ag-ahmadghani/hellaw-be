const db = require('../config/db');

// GET all agendas
exports.getAgendas = (req, res) => {
    db.query('SELECT * FROM agendas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// GET agenda by ID
exports.getAgendaById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM agendas WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Agenda not found' });
        res.json(results[0]);
    });
};

// CREATE new agenda
exports.createAgenda = (req, res) => {
    const { acara, lokasi, tempat, tanggal } = req.body;
    db.query(
        'INSERT INTO agendas (acara, lokasi, tempat, tanggal) VALUES (?, ?, ?, ?)',
        [acara, lokasi, tempat, tanggal],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, acara, lokasi, tempat, tanggal });
        }
    );
};

// UPDATE agenda by ID
exports.updateAgenda = (req, res) => {
    const { id } = req.params;
    const { acara, lokasi, tempat, tanggal } = req.body;
    db.query(
        'UPDATE agendas SET acara = ?, lokasi = ?, tempat = ?, tanggal = ? WHERE id = ?',
        [acara, lokasi, tempat, tanggal, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Agenda not found' });
            res.json({ id, acara, lokasi, tempat, tanggal });
        }
    );
};

// DELETE agenda by ID
exports.deleteAgenda = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM agendas WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Agenda not found' });
        res.json({ message: 'Agenda deleted successfully' });
    });
};
