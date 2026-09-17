import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  content: z.string().trim().min(1, 'Content is required').max(20000, 'Content is too long'),
  tags: z.array(z.string().trim().min(1).max(30)).max(20, 'Too many tags').optional().default([]),
  color: z.enum(['blue', 'green', 'purple', 'yellow', 'red', 'gray', 'pink', 'orange']).optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export const noteQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  tag: z.string().optional(),
  pinned: z.coerce.boolean().optional(),
  archived: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'oldest', 'updated']).default('updated'),
});
