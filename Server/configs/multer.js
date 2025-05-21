import multer from "multer";

// Store in memory for Cloudinary upload
const storage = multer.diskStorage({});

const upload = multer({ storage });

export default upload;
