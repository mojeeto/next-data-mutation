"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(
  state: { errors: string[] },
  formData: FormData,
) {
  const title = formData.get("title") as string;
  const image = formData.get("image") as File;
  const content = formData.get("content") as string;

  // --- START::validation
  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required!");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required!");
  }
  if (!image || image.size === 0) {
    errors.push("Image is required!");
  }

  if (errors.length > 0) return { errors };
  // --- END::validation

  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (err) {
    throw new Error(
      "Image upload failed, post was not created. Please try again!",
    );
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  });

  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
