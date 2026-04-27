    import '../styles/form.css';
    import screamVideo from '../assets/scream.mp4';
    import OnClickBtn from '../components/onClickbtn';
    import { BoxIcon, ChevronRight, Fingerprint, User2Icon } from 'lucide-react';
    import { GrGithub } from 'react-icons/gr';
    import { BsApple, BsEnvelope } from 'react-icons/bs';
    import Input from '../components/input';
    import { useState } from 'react';
    import OtpStep from '../components/otpStep';
    import { useNavigate, useLocation } from "react-router-dom";

    export default function AuthInterface() {

        const location = useLocation();
        const navigate = useNavigate();
        
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const isRegister = location.pathname === "/register";
        const [step, setStep] = useState<"social" | "otp">("social")

        return (
            <div className="login_card animate-fade-in-up">
                <div className="left_side">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    >
                        <source src={screamVideo} type="video/mp4" />
                    </video>
                </div>
                <div className="right_side">
                    <div className="nat_form">
                        {!isRegister && step === "social" && (
                            <>

                                <h1>Sign In to Planify</h1>
                                <p>Stay connected to your planning to handle your tasks efficiently.</p>

                                <div className="sect_btn">
                                    <OnClickBtn color='#fff'
                                        label="Chart"
                                        icon={<BoxIcon size={18} />}
                                        onClick={() => console.log("Go to login")} bgColor={'#000'}
                                    />
                                    <OnClickBtn color='#fff'
                                        label="Github"
                                        icon={<GrGithub size={18} />}
                                        onClick={() => console.log("Go to login")} bgColor={'#000'}
                                    />
                                    <OnClickBtn color='#fff'
                                        label="Apple"
                                        icon={<BsApple size={18} />}
                                        onClick={() => console.log("Go to login")} bgColor={'#000'}
                                    />
                                </div>

                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<BsEnvelope size={20} color='#b8b8b8' />}
                                />

                                <OnClickBtn color='#000'
                                    label="Continue with email"
                                    icon={<ChevronRight />}
                                    onClick={() => setStep("otp")} bgColor={'#fff'}
                                    width="desktop"
                                />


                                <div className="register_master">
                                    <p>
                                        Don't have an account ?{" "}
                                        <span
                                            className="link_like"
                                            onClick={() => {
                                                setStep("social");
                                                navigate("/register");
                                            }}
                                        >
                                            Create your account
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                        {!isRegister && step === "otp" && (
                            <OtpStep
                                email={email}
                                onBack={() => setStep("social")}
                            />
                        )}

                        {isRegister && (
                            <>
                                <h1>Create an account</h1>
                                <p>Start planning your tasks today.</p>

                                <Input
                                    type="text"
                                    placeholder=" Create a username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<User2Icon size={20} color='#b8b8b8' />}
                                />

                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<BsEnvelope size={20} color='#b8b8b8' />}
                                />

                                <Input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Fingerprint size={20} color='#b8b8b8' />}
                                />

                                <OnClickBtn
                                    label="Continue"
                                    onClick={() => console.log("register flow")}
                                    bgColor="#000"
                                    color="#fff"
                                    width="desktop" icon="" />

                                <div className="register_master">
                                    <p>
                                        Already have an account ?{" "}
                                        <span
                                            className="link_like"
                                            onClick={() => {
                                                setStep("social");
                                                navigate("/login");
                                            }}
                                        >
                                            Sign in
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }