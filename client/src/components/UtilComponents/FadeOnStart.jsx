import React from 'react';
import PropTypes from 'prop-types';
import Fade from '@material-ui/core/Fade';

class FadeOnStart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fading: false,
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({
				fading: true,
			});
		}, this.props.delay);
	}

	render() {
		const {	fading } = this.state;
		const {	timeout	} = this.props;
		return (
			<Fade in={fading} timeout={timeout}>
					{this.props.children}
			</Fade>
		);
	}
}

FadeOnStart.propTypes = {
	delay: PropTypes.number.isRequired,
	timeout: PropTypes.number.isRequired,
};

export default FadeOnStart;