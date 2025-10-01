import {
  buildWispClient,
  GetPostsResult,
  GetPostResult,
} from "@wisp-cms/client";

export const wisp = buildWispClient({
  blogId: "2f7e3740-08ee-4ab0-bfb0-77dda52e5245",
});

export type { GetPostsResult, GetPostResult };
