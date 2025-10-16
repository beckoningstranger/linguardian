import multer from "multer";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "data", "csvUploads");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fieldSize: 512 * 1024 }, // 500 KB
  fileFilter: (req, file, cb) => {
    const isCSV =
      file.mimetype === "text/csv" || file.originalname.endsWith(".csv");
    if (!isCSV) return cb(new Error("Only CSV files are allowed!"));
    cb(null, true);
  },
});

export const csvUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("csvfile")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FIELD_VALUE") {
        console.error("LIMIT_FIELD_VALUE");
        return res
          .status(400)
          .json({ error: "File too large. Max 500KB allowed." });
      }
      console.error(err.message);
      return res.status(400).json({ error: err.message });
    }

    if (err) {
      if (err.message === "Only CSV files are allowed!") {
        return res.status(400).json({ error: err.message });
      }

      return res
        .status(500)
        .json({ error: "Unexpected error: " + err.message });
    }

    next();
  });
};
