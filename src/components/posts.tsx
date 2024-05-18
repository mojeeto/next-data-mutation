"use client";

import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import { PostType } from "@/lib/posts";
import { useOptimistic } from "react";
import { togglePostLikeStatus } from "@/actions/posts";
import Image from "next/image";

function Post({
  post,
  action,
}: {
  post: PostType;
  action: (postId: string | number) => void;
}) {
  return (
    <article className="post">
      <div className="post-image">
        <Image
          src={post.imageUrl}
          width={200}
          height={120}
          alt={post.title}
          quality={50}
          loader={(config) => {
            const [urlStart, urlEnd] = config.src.split("upload/");
            const transformation = `w_200,q_${config.quality}`;
            return `${urlStart}upload/${transformation}/${urlEnd}`;
          }}
        />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={`${post.createdAt}`}>
                {formatDate(post.createdAt!.toString())}
              </time>
            </p>
          </div>
          <div>
            <form
              action={action.bind(null, post.id!)}
              className={post.isLiked! ? "liked" : ""}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }: { posts: PostType[] }) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId) => {
      const targetPostId = updatedPostId as number;
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === targetPostId,
      );

      if (updatedPostIndex === -1) {
        return prevPosts;
      }

      const updatedPost = { ...prevPosts[updatedPostIndex] };
      if (!updatedPost) return prevPosts;
      updatedPost.likes = updatedPost.likes! + (updatedPost.isLiked! ? -1 : 1);
      updatedPost.isLiked = !updatedPost.isLiked!;

      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;
      return newPosts;
    },
  );

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatePost(postId: number | string) {
    updateOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
