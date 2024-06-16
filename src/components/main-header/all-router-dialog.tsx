import Link from 'next/link'
import { IoMdClose } from 'react-icons/io'
import { SelectTheme } from '@/components/select-theme'
import { PostList } from '@/utils'

export function AllRouterDialog(
    {
        onClickClose,
    }: {
        onClickClose: () => void
    },
) {
    const closeDialog = () => {
        onClickClose()
    }
    return (
        <div className="fixed z-10 top-0 left-0 h-full w-full bg-mb flex-center">
            <button type="button" className="absolute top-5 right-5" onClick={closeDialog}>
                <IoMdClose size={24} />
            </button>

            <div>
                <ul className="flex flex-col gap-3 ">
                    {PostList.map(route => (
                        <li
                            key={route.path}
                            className="text-mt2 normal-text-hover"
                        >
                            <Link href={route.path} onClick={closeDialog}>{route.name}</Link>
                        </li>
                    ))}
                </ul>

                <div className="mt-10">
                    <SelectTheme />
                </div>

            </div>
        </div>
    )
}
