import './input.css'
import { useEffect, useState } from 'react';

type Props = {
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    error?: string;
    name?: string;
}

export default function input({ type, placeholder, value, onChange, icon, error, name }: Props) {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (!error) return;
        setIsShaking(true);
        const timeout = setTimeout(() => setIsShaking(false), 380);
        return () => clearTimeout(timeout);
    }, [error]);

    return (
        <div className="input_wrapper">
            <div className={`input_group ${error ? "input_group--error" : ""} ${isShaking ? "input_group--shake" : ""}`}>
                {icon}
                <input
                    type={type}
                    placeholder={error || placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    aria-invalid={Boolean(error)}
                    className={error ? "input_field--error" : ""}
                />
            </div>
            {/* {error && <p className="input_error">{error}</p>} */}
        </div>
    );
}