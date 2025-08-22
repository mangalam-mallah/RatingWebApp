import express from 'express'
import {getDashboard, getAllStores, getAllUsers, create_user} from '../controllers/admin.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import authorize from '../middlewares/authorize.middleware.js'

const router = express.Router()

router.get("/dashboard", authenticate, authorize("ADMIN"), getDashboard);
router.get("/users", authenticate, authorize("ADMIN"), getAllUsers);
router.get("/stores", authenticate, authorize("ADMIN"), getAllStores);
router.post("/create-user", authenticate, authorize("ADMIN"), create_user)

export default router