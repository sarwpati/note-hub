import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: 20000,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function validateTags(tags) {
          return tags.every((tag) => typeof tag === 'string' && tag.trim().length > 0 && tag.trim().length <= 30);
        },
        message: 'Each tag must be a valid non-empty string up to 30 characters',
      },
    },
    color: {
      type: String,
      default: 'blue',
      enum: ['blue', 'green', 'purple', 'yellow', 'red', 'gray', 'pink', 'orange'],
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ user: 1, isArchived: 1, updatedAt: -1 });
noteSchema.index({ user: 1, isPinned: 1, updatedAt: -1 });
noteSchema.index({ user: 1, title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
