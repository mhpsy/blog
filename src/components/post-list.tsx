import Link from 'next/link'
import type { Post } from '@/type'

export default function postList(
    { posts }: { posts: Post[] },
) {
    return (
        <div className="globals-container">
            {
        posts.map((post) => {
            return (
                <div className="py-3" key={post.url}>
                    <Link className="text-mt2 normal-text-hover text-xl" href={post.url}>{post.title}</Link>
                    <div className="text-mt">
                        desc:
                        {post.dir}
                    </div>
                </div>
            )
        })
      }
        </div>
    )
}
