import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = theme => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
	},
	link: {
		color: theme.palette.darkAndLight,
	},
});

class NotFound extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<div>
					<Typography align="center" paragraph variant="h2">
						Page not found.
					</Typography>
					<Typography color="textSecondary" align="center" variant="h5">
						Would you like to go to the <Link className={classes.link} to="/">Homepage</Link>?
					</Typography>
				</div>
			</div>
		)
	}
}

NotFound.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);