const express = require("express");
const multer = require("multer");

const {
	registerUser,
	loginUser,
	getProfile,
	logoutUser,
	completeRegister,
	getUsers,
	getUser,
	userApprove,
	userCount,
	userComplaint,
	fetchComplaint,
	refresh,
	deleteUser,
	rejectUser,
	updateProfile,
	finallPayment,
	cpoPayment,
	verifyTransaction,
} = require("../controllers/userController");

const router = express.Router();
const  authMiddleware  = require("../middleware/authMiddleware");
const { verify } = require("jsonwebtoken");

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./uploads"),
	filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  
const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/complete-registration/:id",upload.fields([
	{ name: "idImage", maxCount: 1 },
	{ name: "taxCertificate", maxCount: 1 },
	{ name: "businessLicense", maxCount: 1 },
  ]), completeRegister);
router.post("/login", loginUser);
router.post("/refresh", refresh);
router.post("/profile", getProfile);
router.post("/final-payment", finallPayment);
router.post("/cpo-payment", cpoPayment);
router.post("/verifyTransaction", verifyTransaction);
router.get("/users", getUsers);
router.get("/count", userCount);
router.post("/approve/:id", userApprove);
router.post("/reject/:id", rejectUser);
router.get("/:id", getUser);
router.post("/logout", logoutUser);
router.post("/complaints", userComplaint);
router.post("/complaint", fetchComplaint);
router.delete("/delete/:id",authMiddleware, deleteUser);
router.put("/update/:id", upload.fields([
	{ name: "idImage", maxCount: 1 },
	{ name: "taxCertificate", maxCount: 1 },
	{ name: "businessLicense", maxCount: 1 },
  ]),updateProfile); 

module.exports = router;
