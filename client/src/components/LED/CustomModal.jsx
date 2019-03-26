import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Fab, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndoAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { ChromePicker } from 'react-color';
import Slider from "@material-ui/lab/Slider";

const styles = theme => ({
	picker: {
		margin: 'auto',
		touchAction: 'none',
		[theme.breakpoints.down('xs')]: {
			width: '160px !important',
		},
		marginBottom: theme.spacing(2),
	},
	buttons: {
		display: 'flex',
		justifyContent: 'space-evenly',
		marginBottom: theme.spacing(2),
	},
	slider: {
		marginBottom: theme.spacing(4),
		touchAction: 'none',
	},
	dialog: {
		overflowX: 'hidden', //hack because dialog has scrollbars even though no content overflows? Maybe MUI v4 issue
	},
});

const defaultColors = [
	{
		r: 255,
		g: 0,
		b: 0,
	},
	{
		r: 0,
		g: 0,
		b: 255,
	},
];

class CustomModal extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			speed: 45,
			customColors: defaultColors.slice(),
		};

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onSubmitSmooth = this.onSubmitSmooth.bind(this);
		this.onSpeedChanged = this.onSpeedChanged.bind(this);
		this.onColorChanged = this.onColorChanged.bind(this);
		this.resetColors = this.resetColors.bind(this);
		this.addColor = this.addColor.bind(this);
	}

	onCancel() {
		this.props.onCancel();
		// this.setState({
		// 	speed: 45,
		// 	customColors: defaultColors.slice(),
		// });
	}

	onSubmit() {
		this.props.onSubmit(this.state.speed, this.state.customColors, false);
		// this.setState({
		// 	speed: 45,
		// 	customColors: defaultColors.slice(),
		// });
	}

	onSubmitSmooth() {
		this.props.onSubmit(this.state.speed, this.state.customColors, true);
		// this.setState({
		// 	speed: 45,
		// 	customColors: defaultColors.slice(),
		// });
	}

	onSpeedChanged(event, value) {
		this.setState({
			speed: value,
		});
	}

	onColorChanged(i) {
		return (customColor) => {
			const customColors = this.state.customColors;
			customColors[i] = customColor.rgb;
			this.setState({
				customColors: customColors,
			});
		}
	}

	resetColors() {
		this.setState({
			customColors: defaultColors.slice(),
		});
	}

	addColor() {
		const customColors = this.state.customColors;
		customColors.push({
			r: 255,
			g: 0,
			b: 0,
		});
		this.setState({
			customColors: customColors,
		});
	}

	render() {
		const { classes, open } = this.props;
		const { speed, customColors } = this.state;

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
				<DialogTitle>Custom ({customColors.length} colors)</DialogTitle>
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
					<div className={classes.buttons}>
						<Tooltip title="Reset" placement="right">
							<Fab size="small" color="primary" onClick={this.resetColors}>
								<FontAwesomeIcon icon={faUndoAlt} />
							</Fab>
						</Tooltip>
						<Tooltip title="Add Color" placement="right">
							<Fab size="small" color="primary" onClick={this.addColor}>
								<FontAwesomeIcon icon={faPlus} />
							</Fab>
						</Tooltip>
					</div>
					{customColors.map((customColor, i) => {
						return (
							<ChromePicker
								color={customColor}
								onChangeComplete={this.onColorChanged(i)}
								className={classes.picker}
								disableAlpha={true}
								key={i}
							/>
						);
					})}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.onCancel} color="primary">
						Cancel
					</Button>
					<Button onClick={this.onSubmit} color="primary">
						Start
					</Button>
					<Button onClick={this.onSubmitSmooth} color="primary">
						Start (Smooth)
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

CustomModal.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(CustomModal);