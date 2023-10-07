import { JSX } from "preact/jsx-runtime";
import "./card.css"

interface CardProps {
    title?: string;
    children: JSX.Element | JSX.Element[];
    headerComponent?: JSX.Element;
}

export default function Card({ title, children, headerComponent }: CardProps) {
    return (
        <div className="card-container">
            {
                title || headerComponent ?
                    <div className="header">
                        {title ? <p className="title">{title}</p> : <></>}
                        {headerComponent ? headerComponent : <></>}
                    </div>
                    : <></>
            }
            <div className="body">
                {children}
            </div>
        </div>
    );
}