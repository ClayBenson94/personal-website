import React, { Component } from 'react';
import Intro from './Intro/Intro.jsx';
import Resume from './Resume/Resume.jsx';
import Footer from './Footer/Footer.jsx';

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<Intro />
				<Resume />
				<Footer />
			</React.Fragment>
		);
	}
}

export default App;
