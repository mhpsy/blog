/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import dayjs from 'dayjs'
import type { MaybePost, Post } from '@/type'

// TODO:implement previous and nest post

function PostCard(
    { post }: { post: Post },
) {
    return (
        <div className="globals-container">
            <h2 className="mb-1 text-xl">
                <div>
                    {post.title}
                </div>
            </h2>
            <div className="flex gap-2">
                <time dateTime={post.date} className="mb-2 block text-xs text-c1">
                    {dayjs(post.date).format('MMMM D, YYYY')}
                </time>
            </div>

            <div
                className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: post.body.html }}
            />
        </div>
    )
}

export default function PostItem({ post }: { post: MaybePost }) {
    return post
        ? (
            <PostCard post={post} />
            )
        : (
            <div>Not found this post</div>
            )
}
