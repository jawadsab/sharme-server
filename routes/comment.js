import express from "express";
import auth from "../middleware/auth.js";
import {getAllComments,postComment} from "../controllers/comment.js";

const router = express.Router();



router.route("/").get(getAllComments);
router.route("/:id").post(auth,postComment);

export default router;