import './btn.css';

export default function OnClickBtn({ label, icon, bgColor, color, onClick }: { label: string; icon: React.ReactNode; bgColor: string; color: string; onClick: () => void }) {
    return (
        <div
            className="pill-action"
            onClick={onClick}
            style={{backgroundColor: bgColor, color: color}}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onClick();
                }
            }}
        >
            <span className="text">{label}</span>
            <span className="icon">{icon}</span>
        </div>
    );
}