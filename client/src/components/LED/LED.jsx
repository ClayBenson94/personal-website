import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import io from 'socket.io-client';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Fab } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons'
import LockModal from './LockModal';
import RainbowModal from './RainbowModal';
import PulseModal from './PulseModal';
import CustomModal from './CustomModal';
import Bulb from 'bulb';

const styles = theme => ({
	controlsContainer: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	gridSpacing: {
		margin: theme.spacing(3),
	},
});

class LED extends React.Component {
	constructor(props) {
		super(props);

		// this.socket = io(`${window.location.protocol}//${window.location.hostname}:8333/led`, { secure: true });
		this.socket = io(`https://home.claybenson.me:8334/led`, { secure: true });
		this.state = {
			glowColor: {
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
		this.setGlowColor = this.setGlowColor.bind(this);

		this.bulb = new Bulb({ r: 0, g: 0, b: 0 }, this.setGlowColor) //TODO: Add method that uses this.state.glowColor
	}

	setGlowColor(rgb) {
		this.setState({
			glowColor: rgb,
		});
	}

	onColorClicked({ rgb }) {
		this.socket.emit('color', rgb);
	}

	componentDidMount() {
		this.socket.on('set color', (rgb) => {
			this.bulb.setColor(rgb);
		});

		this.socket.on('locked', (locked) => {
			this.setState({
				locked: locked
			});
		});

		this.socket.on('pattern start', (patternObj) => {
			this.bulb.startPattern(patternObj);
		});

		this.socket.on('pattern stop', () => {
			this.bulb.stopPattern();
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
			patternName: 'custom',
			colors: colors,
			smooth: smooth,
			speed: speed,
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
		const { glowColor, locked, lockModalOpen, rainbowModalOpen, pulseModalOpen, customModalOpen } = this.state;
		const boxShadowStyle = { boxShadow: `0 0 4rem 1.3rem rgb(${glowColor.r},${glowColor.g},${glowColor.b})` }

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
								color={this.bulb.getColor()}
								onChangeComplete={this.onColorClicked}
								disableAlpha={true} />
						</Grid>
						<Grid className={classes.gridSpacing} item xs={12}>
							<Fab size="small" className={classes.button} onClick={() => { this.setState({ lockModalOpen: true }) }} color="primary">
								<FontAwesomeIcon icon={locked ? faLock : faLockOpen} />
							</Fab>
							<Button disabled={locked || (this.bulb.getPattern() && this.bulb.getPattern().patternName === "rainbow")} className={classes.button} color="primary" variant="contained" onClick={() => { this.setState({ rainbowModalOpen: true }) }}>Rainbow</Button>
							<Button disabled={locked || (this.bulb.getPattern() && this.bulb.getPattern().patternName === "pulse")} className={classes.button} color="primary" variant="contained" onClick={() => { this.setState({ pulseModalOpen: true }) }}>Pulse</Button>
							<Button disabled={locked || (this.bulb.getPattern() && this.bulb.getPattern().patternName === "custom")} className={classes.button} color="primary" variant="contained" onClick={() => { this.setState({ customModalOpen: true }) }}>Custom</Button>
						</Grid>
						<Grid item xs={12}>
							<Button disabled={!this.bulb.getPattern()} className={classes.button} color="primary" variant="contained" onClick={this.onPatternStop}>Stop Pattern</Button>
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