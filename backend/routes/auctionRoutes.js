const express = require("express");
const multer = require('multer');
const {
    createAuctionItem,
    getAuctionItems,
    updateAuctionItem,
    deleteAuctionItem,
    getAuctionItemById,
    getAuctionItemsByUser,
    getAuctionWinner,
    getAuctionsWonByUser,
	getTempAuctionById,
} = require("../controllers/auctionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.route("/").get(getAuctionItems).post(authMiddleware, upload.single("image"), createAuctionItem);
router.post("/user", authMiddleware, getAuctionItemsByUser);
router.get("/winner/:id", authMiddleware, getAuctionWinner);
router.post("/won", authMiddleware, getAuctionsWonByUser);
router.get("/temp/:id", getTempAuctionById);

router
    .route("/:id")
    .get(authMiddleware, getAuctionItemById)
    .put(authMiddleware, updateAuctionItem)
    .delete(authMiddleware, deleteAuctionItem);
 

module.exports = router;
