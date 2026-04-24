import '../styles/form.css';
import screamVideo from '../assets/scream.mp4';
import OnClickBtn from '../components/onClickbtn';
import { BoxIcon } from 'lucide-react';
import { GrGithub } from 'react-icons/gr';
import { BsApple } from 'react-icons/bs';

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
            <div className="right_side">
                <div className="nat_form">
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
                </div>

                <div className="register_master">
                    <p>Don't have an account ? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    );
}