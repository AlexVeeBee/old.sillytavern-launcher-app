import logo from "../assets/logos/sillytavernlogo.png"
import "./applogo.css"

interface AppLogoProps {
    showText?: boolean;
}

export default function AppLogo({ showText }: AppLogoProps) {
    return (
        <div className="applogo">
            <img className="logo" src={logo} alt="Silly Tavern Logo" />
            {showText ? <p className="text">Silly Tavern</p> : <></>}
        </div>
    );
}
