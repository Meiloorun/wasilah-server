const Jamaat = require("../models/jamaatModel");
const Region = require("../models/regionModel");

module.exports.getAllJamaats = async (req, res) => {
    try {
        const jamaats = await Jamaat.find().populate('region');
        res.json({ jamaats });
    } catch (error) {
        console.error('Error fetching Jamaats:', error);
        res.status(500).json({error: 'Internal Server Error' });
    }
};