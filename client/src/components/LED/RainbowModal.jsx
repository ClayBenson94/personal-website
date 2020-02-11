import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';
import Slider from "@material-ui/core/Slider";

const styles = theme => ({
	slider: {
		marginBottom: theme.spacing(4),
		touchAction: 'none',
	},
	sliderContainer: {
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(2),
	},
	dialog: {
		overflow: 'hidden', //hack because dialog has scrollbars even though no content overflows? Maybe MUI v4 issue
	},
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
		const { open, classes } = this.props;
		const { speed, brightness } = this.state;
		const speedMarks = [
			{
			  value: 1,
			  label: 'Very Slow',
			},
			{
			  value: 50,
			  label: 'Medium',
			},
			{
			  value: 100,
			  label: 'Very Fast',
			},
		];
		const brightnessMarks = [
			{
				value: 20,
				label: 'Very Dim',
			},
			{
				value: 60,
				label: 'Medium',
			},
			{
				value: 100,
				label: 'Very Bright',
			},
		];

		return (
			<Dialog fullWidth open={open} onClose={this.onCancel}>
				<DialogTitle>Rainbow</DialogTitle>
				<DialogContent className={classes.dialog}>
					<div className={classes.sliderContainer}>
						<Typography gutterBottom>
							Speed
						</Typography>
						<Slider
							min={1}
							max={100}
							step={5}
							marks={speedMarks}
							value={speed}
							onChange={this.onSpeedChanged}
							className={classes.slider}
						/>
						<Typography gutterBottom>
							Brightness
						</Typography>
						<Slider
							min={20}
							max={100}
							step={5}
							marks={brightnessMarks}
							value={brightness}
							onChange={this.onBrightnessChanged}
							className={classes.slider}
						/>
					</div>
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