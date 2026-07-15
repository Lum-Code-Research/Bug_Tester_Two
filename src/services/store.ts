export interface Post {
  id: number;
  author: string;
  body: string;
  createdAt: string;
}

const posts: Post[] = [
  {
    id: 1,
    author: "Ada",
    body: "Welcome to BoardLite.",
    createdAt: new Date().toISOString(),
  },
];

let nextId = 2;

export function listPosts(limit = 20, offset = 0): { items: Post[]; total: number } {
  const ordered = [...posts].reverse();
  return {
    total: ordered.length,
    items: ordered.slice(offset, offset + limit),
  };
}

export function addPost(author: string, body: string): Post {
  const post: Post = {
    id: nextId++,
    author,
    body,
    createdAt: new Date().toISOString(),
  };
  posts.push(post);
  return post;
}

export function searchPosts(query: string): Post[] {
  const needle = query.toLowerCase();
  if (!needle) {
    return [...posts].reverse();
  }
  return posts
    .filter(
      (post) =>
        post.author.toLowerCase().includes(needle) ||
        post.body.toLowerCase().includes(needle),
    )
    .reverse();
}
