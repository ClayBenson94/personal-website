import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import io from 'socket.io-client';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons'
import LockModal from './LockModal';
import RainbowModal from './RainbowModal';
import PulseModal from './PulseModal';
import CustomModal from './CustomModal';

const styles = theme => ({
	controlsContainer: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	gridSpacing: {
		margin: theme.spacing.unit * 3,
	},
});

class LED extends React.Component {
	constructor(props) {
		super(props);

		// this.socket = io(`${window.location.protocol}//${window.location.hostname}:8333/led`, { secure: true });
		this.socket = io(`${window.location.protocol}//claybenson.me:8333/led`, { secure: true });
		this.state = {
			currentPattern: '',
			selectedColor: {
				r: 0,
				g: 0,
				b: 0,
			},
			locked: false,
			lockModalOpen: false,
			rainbowModalOpen: false,
			pulseModalOpen: false,
			customModalOpen: false,
		};

		this.onColorClicked = this.onColorClicked.bind(this);
		this.onLockCancel = this.onLockCancel.bind(this);
		this.onLockSubmit = this.onLockSubmit.bind(this);
		this.onRainbowCancel = this.onRainbowCancel.bind(this);
		this.onRainbowSubmit = this.onRainbowSubmit.bind(this);
		this.onPulseCancel = this.onPulseCancel.bind(this);
		this.onPulseSubmit = this.onPulseSubmit.bind(this);
		this.onCustomCancel = this.onCustomCancel.bind(this);
		this.onCustomSubmit = this.onCustomSubmit.bind(this);
		this.onPatternStop = this.onPatternStop.bind(this);
	}

	onColorClicked({ rgb }) {
		this.socket.emit('color', rgb);
	}

	componentDidMount() {
		this.socket.on('set color', (rgb) => {
			this.setState({
				selectedColor: rgb,
			});
		});

		this.socket.on('locked', (locked) => {
			this.setState({
				locked: locked
			});
		});

		this.socket.on('pattern start', (patternName) => {
			this.setState({
				currentPattern: patternName
			});
		});

		this.socket.on('pattern stop', () => {
			this.setState({
				currentPattern: ''
			});
		});
	}

	onLockCancel() {
		this.setState({
			lockModalOpen: false,
		});
	}

	onLockSubmit(password) {
		this.socket.emit('toggle lock', password);
		this.setState({
			lockModalOpen: false,
		});
	}

	onRainbowCancel() {
		this.setState({
			rainbowModalOpen: false,
		});
	}

	onRainbowSubmit(speed, brightness) {
		this.socket.emit('pattern start', {
			speed: speed,
			brightnessPercent: brightness,
			patternName: 'rainbow',
		});
		this.setState({
			rainbowModalOpen: false,
		});
	}

	onPulseCancel() {
		this.setState({
			pulseModalOpen: false,
		});
	}

	onPulseSubmit(speed, color) {
		this.socket.emit('pattern start', {
			speed: speed,
			color: color,
			patternName: 'pulse',
		});
		this.setState({
			pulseModalOpen: false,
		});
	}

	onCustomCancel() {
		this.setState({
			customModalOpen: false,
		});
	}

	onCustomSubmit(speed, colors, smooth) {
		this.socket.emit('pattern start', {
			colors: colors,
			smooth: smooth,
			speed: speed,
			patternName: 'custom',
		});
		this.setState({
			customModalOpen: false,
		});
	}

	onPatternStop() {
		this.socket.emit('pattern stop');
	}

	render() {
		const { classes } = this.props;
		const { currentPattern, selectedColor, locked, lockModalOpen, rainbowModalOpen, pulseModalOpen, customModalOpen } = this.state;
		const boxShadowStyle = { boxShadow: `0 0 4rem 1.3rem rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})` }

		return (
			<React.Fragment>
				<LockModal open={lockModalOpen} onCancel={this.onLockCancel} onSubmit={this.onLockSubmit} />
				<RainbowModal open={rainbowModalOpen} onCancel={this.onRainbowCancel} onSubmit={this.onRainbowSubmit} />
				<PulseModal open={pulseModalOpen} onCancel={this.onPulseCancel} onSubmit={this.onPulseSubmit} />
				<CustomModal open={customModalOpen} onCancel={this.onCustomCancel} onSubmit={this.onCustomSubmit} />

				{/* Main Body */}
				<div className={classes.controlsContainer}>
					<Grid container direction="column" alignItems="center" justify="center">
						<Grid className={classes.gridSpacing} style={boxShadowStyle} item xs={12}>
							<SketchPicker
								color={selectedColor}
								onChangeComplete={this.onColorClicked}
								disableAlpha={true} />
						</Grid>
						<Grid alignItems="center" justify="center" className={classes.gridSpacing} item xs={12}>
							<Button className={classes.button} onClick={() => { this.setState({ lockModalOpen: true }) }} color="primary" mini variant="fab">
								<FontAwesomeIcon icon={locked ? faLock : faLockOpen} />
							</Button>
							<Button disabled={locked || currentPattern === "rainbow"} className={classes.button} color="primary" variant="contained" onClick={() => { this.setState({ rainbowModalOpen: true }) }}>Rainbow</Button>
							<Button disabled={locked || currentPattern === "pulse"} className={classes.button} color="primary" variant="contained" onClick={() => { this.setState({ pulseModalOpen: true }) }}>Pulse</Button>
							<Button disabled={locked || currentPattern === "custom"} className={classes.button} color="primary" variant="contained" onClick={() => { this.setState({ customModalOpen: true }) }}>Custom</Button>
						</Grid>
						<Grid item xs={12} alignItems="center" justify="center">
							<Button disabled={!currentPattern} className={classes.button} color="primary" variant="contained" onClick={this.onPatternStop}>Stop Pattern</Button>
						</Grid>
					</Grid>
				</div>
			</React.Fragment>
		)
	}
}

LED.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LED);