import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';

const styles = theme => ({

});

class LockModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			password: '',
		};

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onPasswordKeyPress = this.onPasswordKeyPress.bind(this);
	}

	onCancel() {
		this.props.onCancel();
		this.setState({
			password: '',
		});
	}

	onSubmit() {
		this.props.onSubmit(this.state.password);
		this.setState({
			password: '',
		});
	}

	onPasswordChange(e) {
		this.setState({
			password: e.target.value,
		});
	}

	onPasswordKeyPress(e) {
		if (e.key.toLowerCase() === 'enter') {
			this.onSubmit();
		}
	}

	render() {
		const { open } = this.props;

		return (
			<Dialog open={open} onClose={this.onCancel}>
				<DialogTitle>Enter password to lock</DialogTitle>
				<DialogContent>
					<TextField
						onKeyPress={this.onPasswordKeyPress}
						onChange={this.onPasswordChange}
						autoFocus
						margin="dense"
						label="Password"
						type="password"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.onCancel} color="primary">
						Cancel
					</Button>
					<Button onClick={this.onSubmit} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

LockModal.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(LockModal);