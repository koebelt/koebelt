import "./ContactButton.css";

function ContactButton(props) {
    return (
        <a className="contact-container button" href='/contact' style={props.pos === 1 ? { bottom: 30, right: 30 } : { top: 30, right: 30 }}>
            <p className="contact">
                {props.title}
            </p>
        </a>
    );
}

export default ContactButton;