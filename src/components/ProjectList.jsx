import './ProjectList.css';
import InfiniteLooper from './InfiniteLooper';
import ProjectListEntry from './ProjectListEntry';
import React, {useState} from 'react';

function ProjectList() {
    const [speed, setSpeed] = useState(10)

    return (
        <div className="projects"
        onMouseEnter={() => setSpeed(50)} 
        onMouseLeave={() => setSpeed(10)}
        >
            {/* <InfiniteLooper speed={speed} direction="up"> */}
                <div className="project-list-entries">

                <ProjectListEntry title="Project 1" link="/" />
                <ProjectListEntry title="Project 1" link="/" />
                <ProjectListEntry title="Project 1" link="/" />
                <ProjectListEntry title="Project 1" link="/" />
                </div>
            {/* </InfiniteLooper> */}
        </div>
    );

};

export default ProjectList;