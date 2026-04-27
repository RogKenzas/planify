import { useState, useEffect } from "react";
import OnClickBtn from "./onClickbtn";
import "./otpStep.css";

type Props = {
    email: string;
    onBack: () => void;
};

export default function OtpStep({ email, onBack }: Props) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(0);

    const handleResend = async () => {
        if (timer > 0) return;

        setTimer(10);

        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("OTP resent");
    };

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const resetOtp = () => {
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
            document.getElementById("otp-0")?.focus();
        }, 0);
    };

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const next = document.getElementById(`otp-${index + 1}`);
            next?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            prev?.focus();
        }
    };

    const handleVerify = async () => {
        if (loading) return;

        const code = otp.join("");
        if (code.length < 6) return;

        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (code === "123456") {
            setSuccess(true);
            setError(false);
            resetOtp();
        } else {
            setError(true);
            setSuccess(false);
            resetOtp();

            setTimeout(() => setError(false), 400);
        }

        setLoading(false);
    };

    useEffect(() => {
        const isComplete = otp.every((digit) => digit !== "");

        if (isComplete && !loading) {
            handleVerify();
        }
    }, [otp, loading]);

    useEffect(() => {
        document.getElementById("otp-0")?.focus();
    }, []);

    return (
        <div className="otp_container">

            <div className="otp_header">
                <button className="back_btn" onClick={onBack}>←</button>
            </div>

            <h1>Verify your email</h1>
            <p>We sent a code to <strong>{email || "your email"}</strong></p>

            <div className={`otp_inputs ${error ? "error" : ""} ${success ? "success" : ""}`}>
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        disabled={loading}
                        onChange={(e) => handleChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                ))}
            </div>

            <div className="not_received">
                {timer > 0 ? (
                    <span>Resend available in {timer}s</span>
                ) : (
                    <span>
                        Not received?{" "}
                        <button className="resend_btn" onClick={handleResend}>
                            Click here to resend
                        </button>
                    </span>
                )}
            </div>

            <OnClickBtn
                label={loading ? "Verifying..." : "Verify"}
                onClick={handleVerify}
                width="desktop"
                bgColor="#000"
                color="#fff"
                icon=""
            />
        </div>
    );
}