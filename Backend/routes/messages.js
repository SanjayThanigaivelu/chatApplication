import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const message = new Message({
      sender: req.user.id,
      content: req.body.content,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      parentMessageId: req.body.parentMessageId || null,
      chatId: req.body.chatId
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
