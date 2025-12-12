import { cacheLife } from "next/cache";

export async function generateStaticParams() {
  return [{ id: "1" }];
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  "use cache";
  cacheLife("hours")
  const { id } = await params;
  const renderTime = new Date().toISOString();
  let message = "";
   
  if (id === "1") {
    message = "Post 1 was statically generated at build time";
  } else {
    message = `Dynamic post ${id} should be generated on first request, cached via ISR, and served from cache on subsequent requests`;
  }

  const data = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post: { title: string } = await data.json();
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Post {id} (without loading.tsx)</h2>
      <p>{message}.</p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Using "use cache" with cacheLife("hours"). This page fetches data from the API and waits 5 seconds before displaying.
      </p>
      <p style={{ fontSize: "12px", color: "#999" }}>
        <strong>Rendered at:</strong> {renderTime}
      </p>

      <div>
        <h3>Post Content:</h3>
        <p>{post.title}</p>
      </div>
    </div>
  );
}
