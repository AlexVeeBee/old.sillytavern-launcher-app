import { useEffect } from "preact/hooks";
import LoadingCircle from "../UI/LoadingCircle";

const AppStart = () => {
    useEffect(() => {
        const jumptocheker = localStorage.getItem("jump-to-checker");
        const installed = localStorage.getItem("installed");

        if (!jumptocheker) {
            router.navigate("/checker");
            return;
        }

        if (!installed) {
            router.navigate("/setup");
            return;
        }

        router.navigate("/launcher");
    });

    return (
        <LoadingCircle />
    )
}

export default AppStart;