import './content.css';
import OnClickBtn from './onClickbtn';
import { useNavigate } from 'react-router-dom';
import HomeComponent from './homeComponent';

function ArrowUpRightIcon() {
    return (
        <svg
            style={{ color: '#000' }}
            width="19"
            height="19"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fill="currentColor"
                d="M7 17a1 1 0 0 1 0-2h7.59L6.7 7.11a1 1 0 1 1 1.41-1.41L16 13.59V6a1 1 0 1 1 2 0v10a1 1 0 0 1-1 1z"
            />
        </svg>
    )
}

export function Content() {
    const navigate = useNavigate()
    // const dataScreenRef = useFadeInOnScroll({ threshold: 0.1 })

    return (
        <div className="ctx__main">

            <div className="content">
                <HomeComponent className='shader' />
                <div className="title animate-fade-in-up">
                    <h1>We Are Making Careers Are Build...</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="sect__btn animate-fade-in-up-delay-100">
                    <OnClickBtn
                        icon={<svg width="16" height="16"><circle cx="8" cy="8" r="8" fill="white" /></svg>}
                        onClick={() => console.log("Clicked !")} label={'Get Started'} bgColor={'#000'} color={'#fff'} />
                    <OnClickBtn
                        label="Login"
                        icon={<ArrowUpRightIcon />}
                        onClick={() => navigate('/login')} bgColor={'#fff'} color={'#000'} />
                </div>

                {/* <div className="data__scream scroll-animate-fade-up  relative w-full h-screen" ref={dataScreenRef}>
                    <div className="relative z-10 text-white">
                        <h2>Mon contenu au-dessus</h2>
                        <p>Je peux cliquer ici 😎</p>
                    </div>
                </div> */}

            </div>
        </div>
    )
}