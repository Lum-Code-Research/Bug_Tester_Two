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

export function listPosts(): Post[] {
  return [...posts].reverse();
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
  return posts.filter(
    (post) =>
      post.author.toLowerCase().includes(needle) ||
      post.body.toLowerCase().includes(needle),
  );
}
