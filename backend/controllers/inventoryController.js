const Inventory = require("../models/Inventory");
const notifyLowStock = require("../utils/notifyLowStock");


// Check Stock before payment
exports.checkStock = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.json({ success: true });

    for (const itemName of items) {
      if (!itemName) continue;
      // If the item is just a pre-made pizza name from cart that isn't in inventory, we ignore or handle gracefully
      const dbItem = await Inventory.findOne({ itemName });
      if (dbItem && dbItem.quantity <= 0) {
        return res.json({ success: false, message: `${itemName} is currently out of stock!` });
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add Inventory Item
exports.addInventory = async (req, res) => {

  try {

    const item = new Inventory(req.body);

    await item.save();

    if (item.quantity <= item.threshold) {
      await notifyLowStock(item);
    }

    res.json({ message: "Inventory item added", item });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


// Get Inventory
exports.getInventory = async (req, res) => {

  try {

    const items = await Inventory.find();

    res.json(items);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


// Update Inventory
exports.updateInventory = async (req, res) => {

  try {

    const { id } = req.params;

    const item = await Inventory.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after" }
    );

    if (!item) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    if (item.quantity <= item.threshold) {
      await notifyLowStock(item);
    }

    res.json(item);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


// Delete Inventory
exports.deleteInventory = async (req, res) => {

  try {

    const { id } = req.params;

    await Inventory.findByIdAndDelete(id);

    res.json({ message: "Inventory item deleted" });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};