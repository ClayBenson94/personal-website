import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';
import Slider from "@material-ui/lab/Slider";

const styles = theme => ({

});

class RainbowModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			speed: 45,
			brightness: 100,
		};

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onSpeedChanged = this.onSpeedChanged.bind(this);
		this.onBrightnessChanged = this.onBrightnessChanged.bind(this);
	}

	onCancel() {
		this.props.onCancel();
		this.setState({
			speed: 45,
			brightness: 100,
		});
	}

	onSubmit() {
		this.props.onSubmit(this.state.speed, this.state.brightness);
		this.setState({
			speed: 45,
			brightness: 100,
		});
	}

	onSpeedChanged(event, value) {
		this.setState({
			speed: value,
		});
	}

	onBrightnessChanged(event, value) {
		this.setState({
			brightness: value,
		});
	}

	render() {
		const { open } = this.props;
		const { speed, brightness } = this.state;

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
				<DialogTitle>Rainbow</DialogTitle>
				<DialogContent>
					<Typography variant="body2">
						Speed: {speedText}
					</Typography>
					<Slider
						min={100}
						max={10}
						step={5}
						value={speed}
						onChange={this.onSpeedChanged}
					/>
					<Typography variant="body2">
						Brightness: {brightness}%
					</Typography>
					<Slider
						min={20}
						max={100}
						step={5}
						value={brightness}
						onChange={this.onBrightnessChanged}
					/>
				</DialogContent>
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

RainbowModal.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(RainbowModal);