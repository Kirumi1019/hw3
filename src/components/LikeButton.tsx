"use client";

import { useEffect, useState } from "react";
import type { EventHandler, MouseEvent } from "react";

//import { Heart } from "lucide-react";

import useLike from "@/hooks/useLike";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  initialLikes: number;
  initialLiked?: boolean;
  tweetId: number;
  handle?: string;
};

export default function LikeButton({
  initialLikes,
  initialLiked,
  tweetId,
  handle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { likeTweet, unlikeTweet, loading } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the tweet page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (liked) {
      await unlikeTweet({
        tweetId,
        userHandle: handle,
      });
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await likeTweet({
        tweetId,
        userHandle: handle,
      });
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  // We render `liked` and `likesCount` state on the client.
  // The initial values from the server are only used to initialize the state
  // which does nothing on subsequent renders, thus the liked and likesCount
  // will not be updated on the client even if we do a reouter.refresh().
  // To solve this, we need to update the state when the initial values change.
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);
  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes]);

  return (
    <>
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:text-brand",
        liked && "text-brand",
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10",
          liked && "bg-brand/10",
        )}
      >
        Join!
      </div>
    </button>
    Participants: {(likesCount > 0)?likesCount:0}
    </>
  );
}
