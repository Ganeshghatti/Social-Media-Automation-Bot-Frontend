import * as z from "zod";

export const workSpacePostSchema = z.object({
  posttype: z.string(),
  publishnow: z.boolean(),
  content: z.string().optional(),
  tobePublishedAt: z.string().optional(),
  media: z
    .array(
      z.object({
        originalname: z.string(),
        size: z.number(),
        mimetype: z.string(),
        blobUrl: z.string(),
      })
    )
    .max(4)
    .optional(),
});

export const workSpaceThreadSchema = z.object({
  type: z.string(),
  posttype: z.enum(["post", "thread"]),
  publishnow: z.boolean(),
  tobePublishedAt: z.string().optional(),
  posts: z.array(
    z.object({
      type: z.string(),
      content: z.string().optional(),
      media: z
        .array(
          z.object({
            originalname: z.string(),
            size: z.number(),
            mimetype: z.string(),
            blobUrl: z.string(),
          })
        )
        .max(4)
        .optional(),
    })
  ),
});
