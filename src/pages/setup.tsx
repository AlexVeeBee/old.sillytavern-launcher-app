import AppLogo from "../UI/applogo";
import Card from "../components/card";
import BasePage from "./_basepage";

import placeholderBKG from "../assets/backgrounds/00007-1550702270.png";
import StatusWidget from "../UI/StatusWidget";
import { useEffect, useState } from "preact/hooks";

import { open } from "@tauri-apps/api/dialog";

const BKG = () => {
    return (
        <div style={{
            "z-index": "-1",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            "background-image": `url(${placeholderBKG})`,
            "background-position": "center",
            "background-size": "cover",
            "background-blend-mode": "multiply",
            "background-color": "rgba(0,0,0,0.5)",
        }}
        >
        </div>
    );
}

const Setup = () => {
    const [st_path, set_st_path] = useState<string>("");

    useEffect(() => {
        const jumptocheker = () => {
            localStorage.removeItem("jump-to-checker");
            router.navigate("/checker");
        }
        const shouldjump = localStorage.getItem("jump-to-checker");
        if (shouldjump === "true") {
            jumptocheker();
        }
    });

    return (
        <div>
            <BKG />
            <BasePage title={
                <div class="flex align-center"
                    style={{
                        background: "rgba(0,0,0,0.5)",
                        "border-radius": "8px",
                        "box-shadow": "0 0 4px rgba(0,0,0,0.5)",
                        "padding": "8px 16px",
                    }}
                >
                    <AppLogo/>
                    <div>
                        <p style={{
                            "font-size": "24px",
                        }}>Welcome to Sillytavern Launcher</p>
                        <p>First setup</p>
                    </div>
                </div>
            }
                bodyStyle={{
                    "margin-top": "24px",
                    "display": "flex",
                    "flex-direction": "column",
                    "gap": "12px",
                }}
            >
                <Card title="Sillytavern path">
                    <div class="card-section">
                    </div>
                    <StatusWidget status="Waiting" statusText="Checking current installation"/>
                    <StatusWidget status="Paused" statusText="Install folder"/>
                    <StatusWidget status="Paused" statusText="Install folder"/>
                </Card>
                <Card>
                    <div class="card-section flex align-center" style={{"gap": "12px"}}>
                        <input type="checkbox" name="install-extras" id="install-extras" />
                        <label for="install-extras">Install extras</label>
                    </div>
                </Card>
                <Card>
                    <div class="card-section flex align-center" style={{"gap": "12px"}}>
                        <button class="btn btn-primary"
                            onClick={() => {
                                router.navigate("/checker");
                            }}
                        >Install</button>
                    </div>
                </Card>
            </BasePage>
        </div>
    );
}

export default Setup;