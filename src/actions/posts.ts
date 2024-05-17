"use server";

import { storePost } from "@/lib/posts";
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

  await storePost({
    imageUrl: "",
    title,
    content,
    userId: 1,
  });

  redirect("/feed");
}
