import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Build S3 client lazily so it reads env vars at request time, not at import time
const getS3Client = () => new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || 'blr1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false,
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const bucket = process.env.DO_SPACES_BUCKET;
    const key = process.env.DO_SPACES_KEY;
    const secret = process.env.DO_SPACES_SECRET;
    const endpoint = process.env.DO_SPACES_ENDPOINT;

    if (!bucket || !key || !secret || !endpoint) {
      console.error('Missing DO Spaces env vars:', { bucket: !!bucket, key: !!key, secret: !!secret, endpoint: !!endpoint });
      return res.status(500).json({ success: false, message: 'Storage not configured on server' });
    }

    const folder = req.body.folder || 'uploads';
    const ext = path.extname(req.file.originalname);
    const fileName = `${folder}/${Date.now()}-${uuidv4()}${ext}`;

    const s3 = getS3Client();

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: req.file.buffer,
      ACL: 'public-read',
      ContentType: req.file.mimetype,
    }));

    const host = endpoint.replace('https://', '');
    const url = `https://${bucket}.${host}/${fileName}`;

    return res.status(200).json({ success: true, url });
  } catch (err) {
    console.error('Upload error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
