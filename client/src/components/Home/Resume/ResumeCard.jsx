import React from 'react';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = theme => ({
	resumePaper: {
		paddingBottom: theme.spacing(2),
		marginBottom: theme.spacing(4),
		[theme.breakpoints.down('xs')]: {
			textAlign: 'center',
		},
	},
	title: {
		fontWeight: 600,
	},
	information: {
		display: 'inline-block',
		[theme.breakpoints.down('xs')]: {
			display: 'block',
		},
	},
	bullet: {
		marginLeft: '5px',
		marginRight: '5px',
	},
	content: {
		textAlign: 'left',
	},
});

function ResumeCard(props) {
	const {
		classes,
		title,
		subtitle,
		date,
		caption,
		children,
	} = props;

	return (
		<div className={classes.resumePaper}>
			<Typography className={classes.title} color="textPrimary" paragraph variant="h5" >
				{title}
			</Typography>
			<Typography color="textSecondary" className={classes.information} variant="h6" >
				{subtitle}
			</Typography>
			<Hidden xsDown>
				<Typography color="textSecondary" className={classNames(classes.information, classes.bullet)} paragraph variant="body2" >
					•
				</Typography>
			</Hidden>
			<Typography color="textSecondary" className={classes.information} paragraph variant="body2" >
				{date}
			</Typography>
			<div className={classes.content}>
				<Typography color="textPrimary" paragraph variant="body1" >
					{children}
				</Typography>
				<Typography color="textSecondary" variant="caption" >
					{caption}
				</Typography>
			</div>
		</div>
	);
}

ResumeCard.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	caption: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default withStyles(styles)(ResumeCard);