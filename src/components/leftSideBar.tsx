import { useEffect } from 'react';
import './leftSideBar.css';
import { LayoutDashboard, LogOut, Settings, User, X } from 'lucide-react';
import SidebarItem from './SidebarItem';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function LeftSideBar({ open, onClose }: Props) {

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <>
            <div
                className={`sidebar_overlay ${open ? "show" : ""}`}
                onClick={onClose}
            />

            <div className={`left_sidebar ${open ? "open" : ""}`}>

                <button className="close_btn" onClick={onClose}>
                    <X size={18} />
                </button>

                <h2>Menu</h2>

                <nav className="sidebar_nav">
                    <SidebarItem href='/dashboard' icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <SidebarItem icon={<User size={18} />} label="Profile" />
                    <SidebarItem icon={<Settings size={18} />} label="Settings" />
                    <SidebarItem icon={<LogOut size={18} />} label="Logout" />
                </nav>
            </div>
        </>
    );
}