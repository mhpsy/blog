import { allPosts } from 'contentlayer/generated'

// 每一个文件夹的名字
const postsSortByDirOrder = allPosts.sort((a, b) => a.dir_order - b.dir_order)

const allDirs = new Set(
    postsSortByDirOrder.map(v => v.dir),
)

allDirs.delete('')
allDirs.delete('.')

const PostList = [...allDirs].map(v => ({ name: v, path: `/${v}` }))

type PostItem = typeof PostList[0]

export {
    allDirs,
    PostList,
}

export type {
    PostItem,
}
