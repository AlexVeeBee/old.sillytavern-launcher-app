import './statuswidget.css';
import svgs from '../SVG';
export type Status = "Waiting" | "Downloading" | "Error" | "Done" | "Paused" | "Update";

interface StatusWidgetProps {
    status: Status;
    statusText?: string;
    statusContent?: string;
    textlines?: string[];
}
const randid = () => Math.random().toString(36).substr(2, 9);

const StatusWidget = ({
    status,
    statusText,
    statusContent,
    textlines
}: StatusWidgetProps) => {
    return (
        <div className="status-widget" id={randid()}>
            <div className="status">
                {
                    status === "Waiting" ?
                        svgs.waiting
                    : status === "Downloading" ?
                        svgs.downloading
                    : status === "Error" ?
                        svgs.error
                    : status === "Done" ?
                        svgs.check
                    : status === "Paused" ?
                        svgs.paused
                    : status === "Update" ?
                        svgs.update
                    : <></>
                }
                <p className="status-text">{statusText || status}</p>
                <p className="content">{statusContent}</p>
            </div>
                {
                    textlines && textlines?.length > 0 ?
                        <div class="text">
                            {
                                textlines.map((line) => <p>{line}</p>)
                            }
                        </div>
                    : <></>
                }
                        {/* <For each={props.textlines}>
                            {(line) => <p>{line}</p>}
                        </For> */}
        </div>
    );
}

export default StatusWidget;