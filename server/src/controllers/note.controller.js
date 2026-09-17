import Note from '../models/Note.js';
import asyncHandler from '../utils/asyncHandler.js';

const sanitizeTags = (tags = []) =>
  tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);

export const getNotes = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = '',
    tag,
    pinned,
    archived,
    sort = 'updated',
  } = req.query;

  const query = { user: req.user._id };

  if (archived !== undefined) {
    query.isArchived = archived === 'true';
  } else {
    query.isArchived = false;
  }

  if (pinned !== undefined) {
    query.isPinned = pinned === 'true';
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  if (tag) {
    query.tags = { $in: [tag] };
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    updated: { updatedAt: -1 },
  };

  const [notes, total] = await Promise.all([
    Note.find(query)
      .sort(sortOptions[sort] || sortOptions.updated)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean(),
    Note.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      notes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.max(1, Math.ceil(total / Number(limit))),
      },
    },
  });
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }

  res.status(200).json({
    success: true,
    data: { note },
  });
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, color, isPinned, isArchived } = req.body;

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    tags: sanitizeTags(tags || []),
    color: color || 'blue',
    isPinned: Boolean(isPinned),
    isArchived: Boolean(isArchived),
  });

  res.status(201).json({
    success: true,
    data: { note },
  });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }

  const allowedFields = ['title', 'content', 'tags', 'color', 'isPinned', 'isArchived'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'tags') {
        note[field] = sanitizeTags(req.body[field]);
      } else {
        note[field] = req.body[field];
      }
    }
  });

  await note.save();

  res.status(200).json({
    success: true,
    data: { note },
  });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }

  await note.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
  });
});

export const togglePinNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }

  note.isPinned = !note.isPinned;
  await note.save();

  res.status(200).json({
    success: true,
    data: { note },
  });
});

export const toggleArchiveNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }

  note.isArchived = !note.isArchived;
  await note.save();

  res.status(200).json({
    success: true,
    data: { note },
  });
});
