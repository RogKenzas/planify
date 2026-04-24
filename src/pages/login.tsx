import '../styles/form.css';
import screamVideo from '../assets/scream.mp4';

export default function Login() {
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
            <div className="right_side"><p>Page de connexion en développement...</p></div>
            
        </div>
    );
}