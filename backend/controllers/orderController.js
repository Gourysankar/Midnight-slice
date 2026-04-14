const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const sendEmail = require("../utils/sendEmail");
const notifyLowStock = require("../utils/notifyLowStock");


// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const {
      pizzaBase, sauce, cheese, veggies, meat, price,
      isCartOrder, items, userId: customUserId
    } = req.body;

    const userId = customUserId || req.user.id;

    // 0. PRICE INTEGRITY CALCULATIONS (Custom Pizza Flow)
    let backendPrice = 0;

    if (!isCartOrder) {
      const getIngredientPrice = async (itemName) => {
        if (!itemName) return 0;
        const item = await Inventory.findOne({ itemName });
        return item ? item.price : 0;
      };

      let sum = 0;
      sum += await getIngredientPrice(pizzaBase);
      sum += await getIngredientPrice(sauce);
      sum += await getIngredientPrice(cheese);

      if (veggies && Array.isArray(veggies)) {
        for (let v of veggies) sum += await getIngredientPrice(v);
      }
      if (meat && Array.isArray(meat)) {
        for (let m of meat) sum += await getIngredientPrice(m);
      }

      backendPrice = sum;
    } else {
      // For Cart Orders we fall back to the aggregated price unless we deeply verify each Pizza document
      backendPrice = price;
    }

    // 1. Handle Inventory Reduction (Common for custom pizzas single or in cart)
    const reduceStock = async (itemName) => {
      if (!itemName) return;
      const item = await Inventory.findOneAndUpdate(
        { itemName },
        { $inc: { quantity: -1 } },
        { new: true }
      );

      if (item && item.quantity <= item.threshold) {
        await notifyLowStock(item);
      }
    };

    if (isCartOrder && items) {
      for (const i of items) {
        await reduceStock(i.pizzaBase || i.base);
        await reduceStock(i.sauce);
        await reduceStock(i.cheese);
        if (i.veggies) for (let v of i.veggies) await reduceStock(v);
        if (i.meat) for (let m of i.meat) await reduceStock(m);
      }
    } else {
      // Single custom order logic
      await reduceStock(pizzaBase);
      await reduceStock(sauce);
      await reduceStock(cheese);
      if (veggies) for (let v of veggies) await reduceStock(v);
      if (meat) for (let m of meat) await reduceStock(m);
    }

    // 2. Create Order
    const orderData = {
      userId,
      price: backendPrice > 0 ? backendPrice : price, // Use secure backend calculated price
      paymentStatus: "Paid",
      orderStatus: "Order Received",
    };

    if (isCartOrder) {
      orderData.items = items.map(i => ({
        pizzaId: i._id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity || 1
      }));
      // Assign first item's defaults for backward compatibility if needed
      orderData.pizzaBase = "Cart Order";
    } else {
      orderData.pizzaBase = pizzaBase;
      orderData.sauce = sauce;
      orderData.cheese = cheese;
      orderData.veggies = veggies;
      orderData.meat = meat;
    }

    const order = new Order(orderData);
    await order.save();

    res.json({ message: "Order placed successfully", order });

  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// GET USER ORDERS (hides delivered orders after 5 minutes)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const orders = await Order.find({
      userId,
      $or: [
        // Show all non-delivered orders
        { orderStatus: { $ne: "Delivered" } },
        // Show delivered orders only if delivered within last 5 minutes
        { orderStatus: "Delivered", deliveredAt: { $gt: fiveMinutesAgo } }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updateData = { orderStatus: status };
    if (status === "Delivered") {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send delivery email to user
    if (status === "Delivered" && order.userId?.email) {
      const orderDesc = order.items?.length
        ? order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")
        : [order.pizzaBase, order.sauce, order.cheese].filter(Boolean).join(", ");

      try {
        await sendEmail(
          order.userId.email,
          "🍕 Your Midnight Slice Order Has Been Delivered!",
          `Hi ${order.userId.name || "Customer"},\n\nGreat news! Your order #${orderId.slice(-8).toUpperCase()} has been delivered!\n\nOrder: ${orderDesc}\nTotal: ₹${order.price}\n\nThank you for choosing Midnight Slice. Enjoy your pizza! 🍕\n\nTeam Midnight Slice`
        );
      } catch (emailErr) {
        console.error("Delivery email failed:", emailErr.message);
      }
    }

    res.json({ message: "Status updated", order });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// ADMIN: GET ALL ORDERS
exports.getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find().populate("userId", "name email");

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error"
    });

  }

};