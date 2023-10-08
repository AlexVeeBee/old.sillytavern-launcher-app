import LoadingCircle from "../UI/LoadingCircle";
import { JSX } from "preact";
import Card from "../components/card";

const Sidebar = ({
    topButtons,
    bottomButtons,
    pages,
}: {
    topButtons: JSX.Element[],
    bottomButtons: JSX.Element[],
    pages: JSX.Element[],
}) => {
    return (
        <div className="sidebar-container">
            <div className="sidebar">
                <div className="sidebar-top">
                    {topButtons}
                </div>
                <div className="sidebar-bottom">
                    {bottomButtons}
                </div>
            </div>
            <div className="content">
                {pages}
            </div>
        </div>
    );
}

const LauncherDashboard = () => {
    return (
        <Sidebar 
            topButtons={[
                <button>General</button>,
                <button>Backups</button>,
                <button>Toolbox</button>,
                <button>Danger zone</button>,
            ]}
            bottomButtons={[
                <button>Settings</button>,
                <button>About</button>,
            ]}
            pages={[
                <div className="page">
                    <Card title="Placeholder">
                        <div className="card-section">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                        </div>
                    </Card>
                </div>,
            ]}
        />
    );
}

export default LauncherDashboard;