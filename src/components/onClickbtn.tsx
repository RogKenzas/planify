import './btn.css';

export default function OnClickBtn(
    { 
        label, 
        icon, 
        bgColor, 
        color, 
        onClick, 
        width 
    }: { 
        label: string; 
        icon: React.ReactNode; 
        bgColor: string; 
        color: string; 
        onClick: () => void; 
        width?: "full" | "auto" | "desktop"; 
    }) {
    return (
        <div
            className={`pill-action ${width} animate-fade-in-scale`}
            onClick={onClick}
            style={{backgroundColor: bgColor, color: color, width: width}}
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