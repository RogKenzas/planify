import { NavLink } from 'react-router-dom'
import './sidebarItem.css'
import type { ReactNode } from 'react'

type Props = {
    icon: ReactNode
    label: string
    href?: string
    onClick?: () => void
}

export default function SidebarItem({ icon, label, href, onClick }: Props) {
    const content = (
        <>
            <div className="icon_wrapper">
                {icon}
            </div>
            <span className="label">{label}</span>
        </>
    )

    if (!href) {
        return (
            <button type="button" className="sidebar_item" onClick={onClick}>
                {content}
            </button>
        )
    }

    return (
        <NavLink to={href} className="sidebar_item" onClick={onClick}>
            {content}
        </NavLink>
    )
}
