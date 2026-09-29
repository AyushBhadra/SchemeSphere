const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getSchemes = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { titleHindi: regex },
        { description: regex },
        { department: regex },
      ];
    }

    const schemes = await Scheme.find(filter).sort({ title: 1 });
    res.status(200).json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schemes', error: error.message });
  }
};

const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid scheme id' });
    }

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch scheme', error: error.message });
  }
};

const createScheme = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'title and category are required' });
    }

    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create scheme', error: error.message });
  }
};

const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid scheme id' });
    }

    const scheme = await Scheme.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json(scheme);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update scheme', error: error.message });
  }
};

const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid scheme id' });
    }

    const scheme = await Scheme.findByIdAndDelete(id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    res.status(200).json({ message: 'Scheme deleted', id: scheme._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete scheme', error: error.message });
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
};
