import './input.css'

export default function input({type, placeholder, value, onChange, icon}: {type: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon?: React.ReactNode}) {
    return (
        <div className="input_group">
            {icon}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}