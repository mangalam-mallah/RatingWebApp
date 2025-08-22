import express from 'express'
import {createStore, getStores, getStoreById, updateStore, deleteStore} from '../controllers/store.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import authorize from '../middlewares/authorize.middleware.js'

const router = express.Router()
router.get("/", authenticate, getStores);
router.get("/:id", authenticate, getStoreById);
 
router.post("/", authenticate, authorize("ADMIN"), createStore);
router.put("/:id", authenticate, authorize("ADMIN"), updateStore);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteStore);

export default router