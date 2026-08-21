import '../styles/form.css';
import screamVideo from '../assets/scream.mp4';
import OnClickBtn from '../components/onClickbtn';
import { Fingerprint, User2Icon } from 'lucide-react';
import { BsEnvelope } from 'react-icons/bs';
import Input from '../components/input';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { checkAvailability, loginUser, registerUser, sessionStorage } from '../api/auth';

type FormErrors = {
    identifier?: string;
    username?: string;
    email?: string;
    password?: string;
    global?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,30}$/;

export default function AuthInterface() {
    const location = useLocation();
    const navigate = useNavigate();
    const isRegister = location.pathname === "/register";

    const [identifier, setIdentifier] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        const nextErrors: FormErrors = {};
        if (!identifier.trim()) nextErrors.identifier = "Email ou username requis.";
        if (!password) nextErrors.password = "Mot de passe requis.";
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors({});
            const data = await loginUser({ identifier: identifier.trim(), password });
            if (!data.token) throw new Error("Session non créée.");
            sessionStorage.setToken(data.token);
            navigate("/dashboard");
        } catch (error) {
            setErrors({ global: error instanceof Error ? error.message : "Erreur de connexion." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async () => {
        const nextErrors: FormErrors = {};
        const cleanedUsername = username.trim();
        const cleanedEmail = email.trim().toLowerCase();

        if (!cleanedUsername) nextErrors.username = "Username requis.";
        else if (!USERNAME_REGEX.test(cleanedUsername)) {
            nextErrors.username = "3-30 caractères (lettres/chiffres/._-).";
        }

        if (!cleanedEmail) nextErrors.email = "Email requis.";
        else if (!EMAIL_REGEX.test(cleanedEmail)) nextErrors.email = "Format email invalide.";

        if (!password) nextErrors.password = "Mot de passe requis.";
        else if (password.length < 6) nextErrors.password = "Minimum 6 caractères.";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrors({});

            const availability = await checkAvailability({ email: cleanedEmail, username: cleanedUsername });
            if (availability.email.exists || availability.username.exists) {
                setErrors({
                    email: availability.email.exists ? "Cet email existe déjà." : undefined,
                    username: availability.username.exists ? "Ce username existe déjà." : undefined,
                });
                return;
            }

            const data = await registerUser({ username: cleanedUsername, email: cleanedEmail, password });
            if (!data.token) throw new Error("Session non créée.");
            sessionStorage.setToken(data.token);
            navigate("/dashboard");
        } catch (error) {
            setErrors({ global: error instanceof Error ? error.message : "Erreur d'inscription." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login_card animate-fade-in-up">
            <div className="left_side">
                <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                    <source src={screamVideo} type="video/mp4" />
                </video>
            </div>
            <div className="right_side">
                <div className="nat_form">
                    {!isRegister && (
                        <>
                            <h1>Sign In to Planify</h1>
                            <p>Connecte-toi pour gérer ton planning.</p>

                            <Input
                                type="text"
                                placeholder="Email ou username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                icon={<BsEnvelope size={20} color='#b8b8b8' />}
                                error={errors.identifier}
                            />

                            <Input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Fingerprint size={20} color='#b8b8b8' />}
                                error={errors.password}
                            />

                            {errors.global && <p className="form_error">{errors.global}</p>}

                            <OnClickBtn
                                color='#fff'
                                label={isSubmitting ? "Connexion..." : "Se connecter"}
                                icon=""
                                onClick={() => {
                                    if (!isSubmitting) handleLogin();
                                }}
                                bgColor={'#000'}
                                width="desktop"
                            />

                            <div className="register_master">
                                <p>
                                    Pas de compte ?{" "}
                                    <span className="link_like" onClick={() => navigate("/register")}>
                                        Créer un compte
                                    </span>
                                </p>
                            </div>
                        </>
                    )}

                    {isRegister && (
                        <>
                            <h1>Create an account</h1>
                            <p>Crée ton compte et démarre rapidement.</p>

                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                icon={<User2Icon size={20} color='#b8b8b8' />}
                                error={errors.username}
                            />

                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<BsEnvelope size={20} color='#b8b8b8' />}
                                error={errors.email}
                            />

                            <Input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Fingerprint size={20} color='#b8b8b8' />}
                                error={errors.password}
                            />

                            {errors.global && <p className="form_error">{errors.global}</p>}

                            <OnClickBtn
                                label={isSubmitting ? "Création..." : "Créer mon compte"}
                                onClick={() => {
                                    if (!isSubmitting) handleRegister();
                                }}
                                bgColor="#000"
                                color="#fff"
                                width="desktop"
                                icon=""
                            />

                            <div className="register_master">
                                <p>
                                    Déjà un compte ?{" "}
                                    <span className="link_like" onClick={() => navigate("/login")}>
                                        Se connecter
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