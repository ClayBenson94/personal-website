import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const styles = theme => ({
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing.unit * 6,
	},
	link: {
		color: theme.palette.darkAndLight,
	},
});

function Footer(props) {
	const { classes } = props;

	return (
		<footer className={classes.footer}>
			<Typography variant="title" align="center" gutterBottom>
				Some other pages to check out:
			</Typography>
			<Typography variant="subheading" align="center" color="textSecondary" component="p">
				<Link className={classes.link} to='/led'>Control the lights in my house</Link>
			</Typography>
		</footer>
	);
}

Footer.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);