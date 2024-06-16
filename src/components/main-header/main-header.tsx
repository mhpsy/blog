'use client'
import Image from 'next/image'
import Link from 'next/link'
import { CiMenuBurger } from 'react-icons/ci'
import { useState } from 'react'
import { AllRouterDialog } from './all-router-dialog'
import { PostList } from '@/utils'
import { SelectTheme } from '@/components/select-theme'

export function MainHeader() {
    const [showDialog, setShowDialog] = useState(false)
    const openRouterDialog = () => {
        setShowDialog(!showDialog)
    }
    return (
        <header
            className="
        w-full flex
        h-[50px] md:h-[60px] lg:h-[80px]
        "
        >
            <div className="
        container mx-auto flex
      "
            >
                <div className="flex-1 flex items-center">
                    <div className="
          w-10 h-10
          flex-center
          rounded-full overflow-hidden
          "
                    >
                        <Link href="/">
                            <Image
                                src="/favicon.ico"
                                width={40}
                                height={40}
                                alt="Logo"
                            />
                        </Link>
                    </div>
                </div>

                <nav className="hidden md:flex justify-center items-center">
                    <ul className="flex justify-center items-center gap-4 px-3">
                        {PostList.map(route => (
                            <li
                                key={route.path}
                                className="text-mt2 normal-text-hover"
                            >
                                <Link href={route.path}>{route.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <SelectTheme />
                </nav>

                <div className="block md:hidden">
                    <div className="h-full flex-center text-2xl cursor-pointer" onClick={openRouterDialog}>
                        <CiMenuBurger></CiMenuBurger>
                    </div>
                </div>

                {showDialog && <AllRouterDialog onClickClose={() => setShowDialog(false)} />}

            </div>
        </header>
    )
}
