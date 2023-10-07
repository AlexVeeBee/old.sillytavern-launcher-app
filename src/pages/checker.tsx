import { useEffect, useState } from "preact/hooks";
import StatusWidget, { Status } from "../UI/StatusWidget";
import LoadingLine from "../UI/loadingline";
import BasePage from "./_basepage"
import { Command } from "@tauri-apps/api/shell"
import { message } from "@tauri-apps/api/dialog"

const InstallChecker = () => {
    const [appStatus, setAppStatus] = useState<Status>("Paused");
    // const [appStatusLog, setAppStatusLog] = useState<string[]>([]);

    // node
    const [nodeStatus, setNodeStatus] = useState<Status>("Waiting");
    const [nodeStatusContext, setNodeStatusContext] = useState<string>("node --version");
    const installNode = async () => {
        try {
            const c = new Command("install-node");
            setNodeStatusContext("winget");
            setNodeStatus("Downloading");
            console.log("install-node", c);
            const r = await c.execute();
            console.log("command executed: node", r);
            if (r.code === 0) {
                setNodeStatus("Done");
            } else {
                setNodeStatus("Error");
            }
            return r.code === 0;
        } catch (e) {
            console.error("install-node", e);
            setNodeStatus("Error");
            return false;
        }
    }
    const NodeInstalled = async () => {
        try {
            const c = new Command("node-installed");
            const r = await c.execute();
            console.log("node installed", r);
            setNodeStatus("Done");
            return r.code === 0;
        } catch (e) {
            console.error(e);
            setNodeStatus("Error");
            // @ts-ignore
            return await installNode();
        }
    }

    // git
    const [gitStatus, setGitStatus] = useState<Status>("Waiting");
    const [gitStatusContext, setGitStatusContext] = useState<string>("git --version");
    // const [gitTLogStatus, setGitSLogtatus] = useState<string[]>([]);
    const installGit = async () => {
        try {
            const c = new Command("install-git");
            setGitStatusContext("winget");
            setGitStatus("Downloading");
            setSillytavernStatus("Paused");
            console.log("install-git", c);
            const r = await c.execute();
            console.log("command executed: git", r);
            if (r.code === 0) {
                setGitStatus("Done");
                localStorage.setItem("jump-to-checker", "true");
                message("Git installed, please restart the launcher");
                return false;
            } else {
                setGitStatus("Error");
            }
            return r.code === 0;
        } catch (e) {
            console.warn("Error while installing git");
            console.error(e);
            setGitStatus("Error");
        }
    }
    const gitinstalled = async () => {
        try {
            const c = new Command("git-installed");
            const r = await c.execute();
            console.log("git installed",r);
            if (r.code === 0) {
                setGitStatus("Done");
            } else {
                setGitStatus("Error");
            }
            return r.code === 0;
        } catch (e) {
            console.log(e);
            setGitStatus("Waiting");
            return installGit();
        }
    }

    // sillytavern
    const [sillytavernStatus, setSillytavernStatus] = useState<Status>("Waiting");
    const [sillytavernStatusLog, setsetSillytavernStatusLog] = useState<string[]>([]);
    const getSTlog = () => {
        return sillytavernStatusLog;
    }
    const pullSillytavern = async () => {
        try {
            setSillytavernStatus("Downloading");
            const c = new Command("git-pull-st");
            console.log("pulling sillytavern", c);
            const r = await c.execute();
            console.log("command executed: git pull", r);
            if (r.code === 0) {
                setSillytavernStatus("Done");
            } else if (r.code === 128) {
                setSillytavernStatus("Done");
                return true;
            } else {
                setSillytavernStatus("Error");
            }
            return r.code === 0;
        } catch (e) {
            console.log(e);
            setSillytavernStatus("Error");
            // @ts-ignore
            setsetSillytavernStatusLog([getSTlog() ,e.toString()]);
            return false;
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
            } else if (r.code === 128) {
                setSillytavernStatus("Done");
                setsetSillytavernStatusLog([r.stderr.toString()]);
                return pullSillytavern();
            } else {
                setSillytavernStatus("Done");
                pullSillytavern();
            }
            return r.code === 0;
        } catch (e) {
            console.log(e);
            setSillytavernStatus("Error");
            // @ts-ignore
            setsetSillytavernStatusLog([e.toString()]);
            return false;
        }
    }
    const checkApps = async () => {
        const i_node = await NodeInstalled();
        const i_git = await gitinstalled();
        if (i_node && i_git) {
            const c_st = await cloneSillytavern();
            if (c_st) {
                if (!localStorage.getItem("installed")) {
                    localStorage.setItem("installed", "true");
                    message("Ready to launch, please restart the launcher");
                } else {
                    router.navigate("/launcher");
                }
            }
        }
        if (!i_node || !i_git) {
            setAppStatus("Error");
        }
    }
    useEffect(() => {
        setAppStatus("Paused");
        checkApps();
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
            <StatusWidget status={nodeStatus} statusText={"Node"} statusContent={nodeStatusContext}
                // textlines={gitTLogStatus}
            />
            <StatusWidget status={gitStatus} statusText={"Git"} statusContent={gitStatusContext}
                // textlines={gitTLogStatus}
            />
            <StatusWidget status={sillytavernStatus} statusText={"Sillytavern"} statusContent="git clone"
                textlines={sillytavernStatusLog}
            />
            <p>A system restart may be required to complete the installation</p>
        </BasePage>
        </>
    )
}

export default InstallChecker;