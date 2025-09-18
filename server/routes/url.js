import { Router } from "express";
import { generateShortURL,redirectToOriginalUrl } from "../controllers/Url.js";
const urlRouter = Router();

// Route to generate a short URL
urlRouter.post("/api/shorten", generateShortURL);
urlRouter.get("/:shortId", redirectToOriginalUrl);

export default urlRouter;