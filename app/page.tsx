import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Cache Components + loading.tsx Bug Reproduction</h1>
      <p>This reproduction demonstrates an issue where ISR/caching stops working when loading.tsx is present.</p>
      <span>Prefetch is disabled</span>
      <h2>With loading.tsx (broken caching):</h2>
      <ul>
        <li><Link prefetch={false} href="/posts/1">Post 1 (statically generated at build time)</Link></li>
        <li><Link prefetch={false} href="/posts/2">Post 2 (should be cached after first request)</Link></li>
        <li><Link prefetch={false} href="/posts/3">Post 3 (should be cached after first request)</Link></li>
        <li><Link prefetch={false} href="/posts/4">Post 4 (should be cached after first request)</Link></li>
        <li><Link prefetch={false} href="/posts/5">Post 5 (should be cached after first request)</Link></li>
      </ul>

      <h2>Without loading.tsx (working correctly):</h2>
      <ul>
        <li><Link prefetch={false} href="/posts-no-loading/1">Post 1 (statically generated at build time)</Link></li>
        <li><Link prefetch={false} href="/posts-no-loading/2">Post 2 (cached after first request)</Link></li>
        <li><Link prefetch={false} href="/posts-no-loading/3">Post 3 (cached after first request)</Link></li>
        <li><Link prefetch={false} href="/posts-no-loading/4">Post 4 (cached after first request)</Link></li>
        <li><Link prefetch={false} href="/posts-no-loading/5">Post 5 (cached after first request)</Link></li>
      </ul>
    </div>
  );
}
