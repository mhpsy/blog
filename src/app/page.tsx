import { getIndexPost } from '@/utils'
import PostItem from '@/components/post-item'

export default function Home() {
    return (
        <div className="globals-container">
            {
        (() => {
            const post = getIndexPost()
            if (post)
                return PostItem({ post })
            else
                return <div>not found index page</div>
        })()
      }
        </div>
    )
}
