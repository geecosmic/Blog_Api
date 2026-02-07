import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: { type: [String], default: [] },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

postSchema.pre("save", async function () {
  // Only regenerate slug when title changes OR slug is missing
  if (!this.isModified("title") && this.slug) return;

  const base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let i = 1;

  // Ensure unique slug
  while (await mongoose.models.Post.findOne({ slug })) {
    slug = `${base}-${i++}`;
  }

  this.slug = slug;
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);

