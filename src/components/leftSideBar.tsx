import { useEffect } from 'react';
import './leftSideBar.css';
import { X } from 'lucide-react';

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
                    <a href="#">Dashboard</a>
                    <a href="#">Profile</a>
                    <a href="#">Settings</a>
                    <a href="#">Logout</a>
                </nav>
            </div>
        </>
    );
}