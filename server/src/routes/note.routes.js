import express from 'express';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  toggleArchiveNote,
  togglePinNote,
  updateNote,
} from '../controllers/note.controller.js';
import protect from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createNoteSchema, updateNoteSchema } from '../validators/note.validator.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotes);
router.post('/', validate(createNoteSchema), createNote);
router.get('/:id', getNoteById);
router.put('/:id', validate(updateNoteSchema), updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePinNote);
router.patch('/:id/archive', toggleArchiveNote);

export default router;
