import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const MdOutlineWbSunny = dynamic(() => import('react-icons/md').then(mod => mod.MdOutlineWbSunny), {
    ssr: false,
})
const MdOutlineDarkMode = dynamic(() => import('react-icons/md').then(mod => mod.MdOutlineDarkMode), {
    ssr: false,
})

function SelectTheme() {
    const { setTheme, theme } = useTheme()
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        setIsDark(theme === 'dark')
    }, [theme])

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark')
    }

    const Icon = isDark ? MdOutlineWbSunny : MdOutlineDarkMode

    return (
        <div className="w-[24px] h-[24px]">
            <button type="button" onClick={toggleTheme} aria-label="change theme">
                <Icon size={24} />
            </button>
        </div>
    )
}

export { SelectTheme }
