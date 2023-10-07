import { useEffect, useState } from "preact/hooks";
import StatusWidget, { Status } from "../UI/StatusWidget";
import LoadingLine from "../UI/loadingline";
import BasePage from "./_basepage"
import { Command } from "@tauri-apps/api/shell"
import { message } from "@tauri-apps/api/dialog"

const InstallChecker = () => {
    const [appStatus, setAppStatus] = useState<Status>("Paused");
    // const [appStatusLog, setAppStatusLog] = useState<string[]>([]);

    // git
    const [gitStatus, setGitStatus] = useState<Status>("Waiting");
    const [gitStatusContext, setGitStatusContext] = useState<string>("git --version");
    // const [gitTLogStatus, setGitSLogtatus] = useState<string[]>([]);

    // sillytavern
    const [sillytavernStatus, setSillytavernStatus] = useState<Status>("Waiting");
    const [sillytavernStatusLog, setsetSillytavernStatusLog] = useState<string[]>([]);
    const pullSillytavern = async () => {
        try {
            setSillytavernStatus("Downloading");
            const c = new Command("git-pull-st");
            console.log(c);
            const r = await c.execute();
            console.log(r);
            if (r.code === 0) {
                setSillytavernStatus("Done");
            } else {
                setSillytavernStatus("Done");
                setsetSillytavernStatusLog([r.stderr.toString()]);
            }
        } catch (e) {
            console.log(e);
            setSillytavernStatus("Error");
            // @ts-ignore
            setsetSillytavernStatusLog([e.toString()]);
        }
    }
    const cloneSillytavern = async () => {
        try {
            setSillytavernStatus("Downloading");
            const c = new Command("git-clone-st");
            console.log(c);
            const r = await c.execute();
            console.log(r);
            if (r.code === 0) {
                setSillytavernStatus("Done");
            } else {
                setSillytavernStatus("Done");
                pullSillytavern();
            }
        } catch (e) {
            console.log(e);
            setSillytavernStatus("Error");
            // @ts-ignore
            setsetSillytavernStatusLog([e.toString()]);
        }
    }
    useEffect(() => {
        setAppStatus("Paused");
        const gitinstalled = async () => {
            try {
                const c = new Command("git-installed");
                const r = await c.execute();
                console.log(r);
                if (r.code === 0) {
                    setGitStatus("Done");
                    cloneSillytavern();
                } else {
                    setGitStatus("Error");
                }
            } catch (e) {
                console.log(e);
                try {
                    const c = new Command("install-git");
                    setGitStatusContext("winget");
                    setGitStatus("Downloading");
                    setSillytavernStatus("Paused");
                    console.log("install-git", c);
                    const r = await c.execute();
                    console.log("command executed", r);
                    if (r.code === 0) {
                        setGitStatus("Done");
                        localStorage.setItem("jump-to-checker", "true");
                        message("Git installed, please restart the launcher");
                    } else {
                        setGitStatus("Error");
                    }
                } catch (e) {
                    console.warn("Error while installing git");
                    console.error(e);
                    setGitStatus("Error");
                }
            }
        }
        gitinstalled();
    }, [])

    return (
        <>
        <LoadingLine />
        <BasePage title={<p className={"title"}>Checking installation</p>}
            bodyStyle={{
                marginTop: "24px",
            }}
        >

            <StatusWidget status={appStatus} statusText={"Launcher Update"} statusContent="updater"
                // textlines={appStatusLog}
            />
            <StatusWidget status={gitStatus} statusText={"Git"} statusContent={gitStatusContext}
                // textlines={gitTLogStatus}
            />
            <StatusWidget status={sillytavernStatus} statusText={"Sillytavern"} statusContent="git clone"
                textlines={sillytavernStatusLog}
            />
        </BasePage>
        </>
    )
}

export default InstallChecker;