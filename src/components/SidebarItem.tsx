import './sidebarItem.css';
import type { ReactNode } from 'react';

type Props = {
    icon: ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
};

export default function SidebarItem({ icon, label, href = "#", onClick }: Props) {
    return (
        <a href={href} className="sidebar_item" onClick={onClick}>
            <div className="icon_wrapper">
                {icon}
            </div>
            <span className="label">{label}</span>
        </a>
    );
}