import './App.css';
import ContactButton from './components/ContactButton';
import IsAvailable from './components/IsAvailable';
import CustomCursor from './components/CustomCursor';
import ProjectList from './components/ProjectList';
// import Test from './components/test';

function App() {
  return (

      <div className="App">
        <IsAvailable />
        <ContactButton title="Start a project" pos={0} />
        <h1 className='title'>koebelt</h1>
        <p>
          4th Year student developper at EPITECH, experienced in Embedded System developpement, Cross Platform software developpement.
           {/* I have aquired through the years a good proficiency in many languages and technologies. */}
        </p>
        <ProjectList/>

        <ContactButton title="Contact Me" pos={1} />
        
      </div>
  );
}

export default App;
