import '../styles/form.css';
import screamVideo from '../assets/scream.mp4';
import OnClickBtn from '../components/onClickbtn';
import { BoxIcon, ChevronRight } from 'lucide-react';
import { GrGithub } from 'react-icons/gr';
import { BsApple, BsEnvelope } from 'react-icons/bs';
import Input from '../components/input';
import { useState } from 'react';

export default function Login() {

    const [email, setEmail] = useState("");


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

                    <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<BsEnvelope size={20} color='#b8b8b8'/>} 
                    />

                    <OnClickBtn color='#000'
                        label="Continue with email"
                        icon={<ChevronRight />}
                        onClick={() => console.log("Go to login")} bgColor={'#fff'}
                        width="desktop"
                    />
                </div>

                <div className="register_master">
                    <p>Don't have an account ? <a href="/register">Create your account</a></p>
                </div>
            </div>
        </div>
    );
}