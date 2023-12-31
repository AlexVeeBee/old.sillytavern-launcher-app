import { useEffect, useState } from "preact/hooks";
import StatusWidget, { Status } from "../UI/StatusWidget";
import LoadingLine from "../UI/loadingline";
import BasePage from "./_basepage"
import { Command } from "@tauri-apps/api/shell"
import { message } from "@tauri-apps/api/dialog"
import { toast } from "react-hot-toast"

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
    const [sillytavernContext, setSillytavernContext] = useState<string>("git clone");
    const [sillytavernStatusLog, setsetSillytavernStatusLog] = useState<string[]>([]);
    const getSTlog = () => {
        return sillytavernStatusLog;
    }
    const pullSillytavern = async () => {
        try {
            setSillytavernContext("git pull");
            setSillytavernStatus("Update");
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

    // node packages
    const [nodePackagesStatus, setNodePackagesStatus] = useState<Status>("Waiting");
    const [nodePackagesStatusLog, setNodePackagesStatusLog] = useState<string[]>([]);
    const installNodePackages = async () => {
        // try {
        //     console.log("changing directory to sillytavern");
        //     const cd = new Command("cd-st",
        //         ["cd", "jellytheme-Time-Machine"]
        //     );
        //     const r = await cd.execute();
        //     console.log("changed directory to sillytavern", r);
        // } catch (e) {
        //     console.error("cd-st:", e);
        //     setNodePackagesStatus("Error");
        //     // @ts-ignore
        //     setNodePackagesStatusLog([`cd-st: ${e.toString()}`]);
        //     return false;
        // }
        try {
            const npm = new Command("npm-install");
            setNodePackagesStatus("Downloading");
            console.log("installing node packages", npm);
            const r = await npm.execute();
            console.log("command executed: npm install", r);
            if (r.code === 0) {
                setNodePackagesStatus("Done");
                return true;
            } else {
                setNodePackagesStatus("Error");
                return false;
            }
        } catch (e) {
            console.error("npm-install:", e);
            // @ts-ignore
            setNodePackagesStatusLog([`npm-install: ${e.toString()}`]);
            setNodePackagesStatus("Error");
            return false;
        }
    }

    const checkApps = async () => {
        const i_node = await NodeInstalled();
        const i_git = await gitinstalled();
        if (i_node && i_git) {
            const c_st = await cloneSillytavern();
            if (c_st) {
                const i_np = await installNodePackages();
                if (i_np) {
                    setAppStatus("Done");
                    localStorage.removeItem("jump-to-checker");
                    // router.navigate("/launcher");
                }
                if (!i_np) {
                    setAppStatus("Error");
                    return false;
                }

                // if (!localStorage.getItem("installed")) {
                //     localStorage.setItem("installed", "true");
                //     message("Ready to launch, please restart the launcher");
                // } else {
                //     localStorage.removeItem("jump-to-checker");
                //     // router.navigate("/launcher");
                // }
            }
        }
        if (!i_node || !i_git) {
            setAppStatus("Error");
            return false;
        }
    }
    useEffect(() => {
        setAppStatus("Paused");
        checkApps().then((b) => {
            if (!b) {
                toast.error("Error while preparing the launcher");
            }
        }).catch(() => {
            setAppStatus("Error");
        });
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
            <StatusWidget status={sillytavernStatus} statusText={"Sillytavern"} statusContent={sillytavernContext}
                textlines={sillytavernStatusLog}
            />
            <StatusWidget status={nodePackagesStatus} statusText={"Node Packages"} statusContent="npm install"
                textlines={nodePackagesStatusLog}
            />
            <p>A system restart may be required to complete the installation</p>
        </BasePage>
        </>
    )
}

export default InstallChecker;