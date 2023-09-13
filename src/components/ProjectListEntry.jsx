import "./ProjectListEntry.css";

function ProjectListEntry(props) {
    return (
        <a className="project-list-entry">
            <h3 className="project-list-entry-title">
                {props.title} //
            </h3>
            <div className="project-list-entry-view-container">
                <h3 className="project-list-entry-link" href={props.link}>
                    View
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="project-list-entry-arrow" viewBox="0 0 16 16">
                    <path d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z" />
                </svg>
            </div>
        </a>
    );
}

export default ProjectListEntry;