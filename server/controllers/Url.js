import { nanoid } from "nanoid";
import urlModel from "../models/URL.js";
import isValid from "../services/isValid.js";

export async function generateShortURL(req, res){
    try {
        const { originalUrl } = req.body;
        if(!originalUrl){
            return res.status(400).send({
                message: "Please provide a valid URL",
            });
        }
        if (!isValid(originalUrl)) {
            return res.status(400).send({
                message: "Invalid URL format",
            });
        }
        const shortId = nanoid(8);

        const dataToSave = new urlModel({
            originalUrl,
            shortId,
        });
        const savedData = await dataToSave.save();
        res.status(201).send({shortUrl:`${req.protocol}://${req.get('host')}/${shortId}`});
} catch (error){
    res.status(500).send({
        message: "There is something wrong, Plesse try again ...",
        errString: error.message,
    });
}
    }

export async function redirectToOriginalUrl(req, res) {
    try {
        const { shortId } = req.params;
        const urlData = await urlModel.findOne({ shortId });
        if (!urlData) {
            return res.status(404).send({
                message: "URL not found",
            });
        }
        res.redirect(urlData.originalUrl);
    } catch (error) {
        res.status(500).send({
            message: "There is something wrong, Please try again ...",
            errString: error.message,
        });
    }
}
