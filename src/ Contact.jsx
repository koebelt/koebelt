import React, {Input} from "react";
import "./Contact.css";

function Contact() {
    return <div className="constact">
        <h1>Contact</h1>
        <p>Get in touch with me, I'm always looking for new opportunities.</p>
        <form action="#" method="POST">
        <input type="text" placeholder="Name" maxLength={30}/>
        <input type="text" placeholder="Email" maxLength={30} />
        <textarea type="text" placeholder="Message" rows={2}/>
        <input type="submit" value="Send" />
        </form>

        <p>
            <a href="mailto:tomkoebel@icloud.com"> tomkoebel@icloud.com</a>
            <a href="phone:+337 69 42 22 50"> +337 69 42 22 50</a>
            <a href="https://www.linkedin.com/in/koebelt/"> LinkedIn</a>
        </p>



    </div>;
    }

export default Contact;