import type { allPosts } from 'contentlayer/generated'
import type { Maybe } from '@/type/utils'

type Post = typeof allPosts[0]
type MaybePost = Maybe<Post>
type AllPosts = typeof allPosts

export type{
    Post,
    AllPosts,
    MaybePost,
}
