import { JSX } from "preact/jsx-runtime";
import "./_basepage.css"

interface BasePageProps {
    title: JSX.Element;
    children: JSX.Element | JSX.Element[];
    bodyStyle?: JSX.CSSProperties;
}

export default function BasePage({ title, children, bodyStyle }: BasePageProps) {
    return (
        <div className='basepage'>
            <div className="inner">
                <div className="header">
                    {title}
                </div>
                <div className="body" style={bodyStyle}>
                    {children}
                </div>
            </div>
        </div>
    );
}

