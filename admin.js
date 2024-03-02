const path = require('path')
const Item = require("./model")

exports.addItem = async (req, res) => {
    const {name, description} = req.body;
    const images = req.files.map(file => {
        return path.join(__dirname, 'uploads', file.filename)
    })
    try {
        const item = await Item.create({
            name,
            description,
            images
        })
        res.status(201).json({
            message: "Item successfully created",
            item: item._id
        });
    } catch (err) {
        res.status(401).json({
            message: "Failed to create item",
            error: err.message
        })
    }
}