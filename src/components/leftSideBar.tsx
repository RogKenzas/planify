import './leftSideBar.css';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function LeftSideBar({ open, onClose }: Props) {
    return (
        <>
            {/* overlay */}
            <div
                className={`sidebar_overlay ${open ? "show" : ""}`}
                onClick={onClose}
            />

            {/* sidebar */}
            <div className={`left_sidebar ${open ? "open" : ""}`}>
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