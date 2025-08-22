import Store from '../models/store.model.js'
import Rating from '../models/rating.model.js'
import mongoose from 'mongoose'

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and Address are required" });
    }

    const store = new Store({ name, email, address, ownerId });
    await store.save();

    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    console.error("Error in createStore:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    let filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (address) filter.address = new RegExp(address, "i");

    const stores = await Store.find(filter).populate("ownerId", "name email");

    const storeData = await Promise.all(
      stores.map(async (store) => {
        const avg = await Rating.aggregate([
          { $match: { storeId: store._id } },
          { $group: { _id: "$storeId", avgRating: { $avg: "$rating" } } },
        ]);

        let userRating = null;
        if (req.user) {
          const rating = await Rating.findOne({
            storeId: store._id,
            userId: req.user.id,
          });
          userRating = rating ? rating.rating : null;
        }

        return {
          _id: store._id,
          name: store.name,
          email: store.email,
          address: store.address,
          owner: store.ownerId ? { name: store.ownerId.name, email: store.ownerId.email } : null,
          avgRating: avg.length > 0 ? avg[0].avgRating : 0,
          userRating,
        };
      })
    );

    res.status(200).json(storeData);
  } catch (error) {
    console.error("Error in getStores:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Store ID" });
    }

    const store = await Store.findById(id).populate("ownerId", "name email");
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const avg = await Rating.aggregate([
      { $match: { storeId: store._id } },
      { $group: { _id: "$storeId", avgRating: { $avg: "$rating" } } },
    ]);

    res.status(200).json({
      _id: store._id,
      name: store.name,
      email: store.email,
      address: store.address,
      owner: store.ownerId ? { name: store.ownerId.name, email: store.ownerId.email } : null,
      avgRating: avg.length > 0 ? avg[0].avgRating : 0,
    });
  } catch (error) {
    console.error("Error in getStoreById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const store = await Store.findByIdAndUpdate(id, updates, { new: true });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Store updated successfully", store });
  } catch (error) {
    console.error("Error in updateStore:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByIdAndDelete(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStore:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {createStore, getStores, getStoreById, updateStore, deleteStore}