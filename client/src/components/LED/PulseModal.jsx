import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';
import { ChromePicker } from 'react-color';
import Slider from "@material-ui/lab/Slider";

const styles = theme => ({
	picker: {
		margin: 'auto',
		touchAction: 'none',
		[theme.breakpoints.down('xs')]: {
			width: '160px !important',
		},
	},
	slider: {
		marginBottom: theme.spacing(4),
		touchAction: 'none',
	},
	dialog: {
		overflow: 'hidden', //hack because dialog has scrollbars even though no content overflows? Maybe MUI v4 issue
	},
});

class PulseModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			speed: 45,
			brightness: 100,
		};

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onSpeedChanged = this.onSpeedChanged.bind(this);
		this.onColorChanged = this.onColorChanged.bind(this);
	}

	onCancel() {
		this.props.onCancel();
		this.setState({
			speed: 45,
			color: {},
		});
	}

	onSubmit() {
		this.props.onSubmit(this.state.speed, this.state.color);
		this.setState({
			speed: 45,
			color: {},
		});
	}

	onSpeedChanged(event, value) {
		this.setState({
			speed: value,
		});
	}

	onColorChanged(colorObj) {
		this.setState({
			color: colorObj.rgb,
		});
	}

	render() {
		const { classes, open } = this.props;
		const { speed, color } = this.state;

		let speedText = '';
		if (speed <= 40) {
			speedText = 'Fast';
		} else if (speed > 40 && speed <= 70) {
			speedText = 'Medium';
		} else if (speed > 70) {
			speedText = 'Slow';
		}

		return (
			<Dialog fullWidth open={open} onClose={this.onCancel}>
				<DialogTitle>Pulse</DialogTitle>
				<DialogContent className={classes.dialog}>
					<Typography variant="body1" gutterBottom>
						Speed: {speedText}
					</Typography>
					<Slider
						min={100}
						max={10}
						step={5}
						value={speed}
						onChange={this.onSpeedChanged}
						className={classes.slider}
					/>
				</DialogContent>
				<ChromePicker
					color={color}
					onChangeComplete={this.onColorChanged}
					className={classes.picker}
					disableAlpha={true}
				/>
				<DialogActions>
					<Button onClick={this.onCancel} color="primary">
						Cancel
					</Button>
					<Button onClick={this.onSubmit} color="primary">
						Start
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

PulseModal.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(PulseModal);