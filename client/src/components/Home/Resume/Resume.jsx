import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ResumeCard from './ResumeCard';
import { Typography, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Consumer } from '../../../Context';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import Fab from '@material-ui/core/Fab';

const styles = (theme) => {
	return {
		layout: {
			width: 'auto',
			marginLeft: theme.spacing(6),
			marginRight: theme.spacing(6),
			[theme.breakpoints.up(1000 + theme.spacing(6 * 2))]: {
				width: 1000,
				marginLeft: 'auto',
				marginRight: 'auto',
			},
			padding: `${theme.spacing(8)}px 0`,
		},
		cardCategory: {
			[theme.breakpoints.down('xs')]: {
				textAlign: 'center',
			},
		},
		cardCategoryLabel: {
			borderBottom: `3px solid ${theme.palette.darkAndLight}`,
			display: 'inline-block',
			marginBottom: theme.spacing(2),
		},
		link: {
			color: theme.palette.darkAndLight,
		},
		lightIcon: {
			margin: theme.spacing(2),
			float: 'right',
		},
	};
}

function Resume(props) {
	const { classes } = props;

	return (
		<Consumer>
			{(context) => {
				return (
					<React.Fragment>
						<Fab className={classes.lightIcon} color="primary" size="small" onClick={context.toggleTheme}>
							<FontAwesomeIcon icon={faLightbulb} />
						</Fab>
						<div id="about" className={classes.layout}>
							<Grid container direction="row">
								<Grid className={classes.cardCategory} item xs={12} sm={3}>
									<Typography className={classes.cardCategoryLabel} variant="h5">
										Work
									</Typography>
								</Grid>
								<Grid item xs={12} sm={9}>
									<ResumeCard
										title="Oddball"
										subtitle="Software Engineer"
										date="June 2019 - Current"
										caption="Node.js, MySQL, Docker, and AWS services">
										Creating, managing, and upgrading login & authentication services
										for <a className={classes.link} target="_blank" rel="noopener noreferrer" href="https://www.healthcare.gov/">healthcare.gov</a> and <a className={classes.link} target="_blank" rel="noopener noreferrer" href="https://www.mymedicare.gov/">mymedicare.gov</a>
									</ResumeCard>
									<ResumeCard
										title="Ellucian"
										subtitle="Software Developer"
										date="July 2017 - June 2019"
										caption="React, Node.js, PostgreSQL. Exposure to Terraform and AWS services">
										Full stack development building scalable web apps and APIs that enable integrations between client apps. I worked
										across several teams and received recognition for my cross-team efforts. I also had the opportunity to mentor interns during the summer, which has
										proven to be very rewarding.
									</ResumeCard>
									<ResumeCard
										title="Ellucian"
										subtitle="Software Developer Intern"
										date="May 2016 - August 2016"
										caption="Node.js, jQuery, CSS, Socket.io">
										As an intern, I created an initial implementation for a product that would help customers integrate with other Ellucian
										products. This is where I learned Node.js, and got more familiar with front end development. This was one of the first times I'd worked directly with
										remote employees, and it taught me quite a bit about communication within teams.
									</ResumeCard>
									<ResumeCard
										title="Lenel"
										subtitle="Automation Engineer"
										date="May 2015 - December 2015"
										caption="">
										At Lenel, I had the responsibility of designing and producing automated test cases for several of Lenel's products. I caught and verified bugs using regression tests,
										and worked in an agile development for the first time.
									</ResumeCard>
									<ResumeCard
										title="Rochester Software Associates"
										subtitle="Quality Assurance"
										date="May 2014 - December 2014"
										caption="">
										At RSA, I was in charge of creating and maintaining test cases for their <a className={classes.link} target="_blank" rel="noopener noreferrer" href="https://www.rocsoft.com/QDirect">QDirect</a> product
										based on feature specifications. I learned how to create useful test cases and bug reports.
									</ResumeCard>
								</Grid>
							</Grid>
							<Grid container direction="row">
								<Grid className={classes.cardCategory} item xs={12} sm={3}>
									<Typography className={classes.cardCategoryLabel} variant="h5">
										Education
									</Typography>
								</Grid>
								<Grid item xs={12} sm={9}>
									<ResumeCard
										title="Rochester Institute of Technology"
										subtitle="BS in Computer Science"
										date="May 2017"
										caption="Related coursework: Analysis of Algorithms, Discrete Mathematics">
										A wonderful five year program which allowed me to spend over a year's worth of time at co-ops and internships.
										Attained a minor in mathematics, and was able to take fun interesting courses like <i>Game Theory</i>, <i>Cryptography</i>, and <i>Computer Graphics</i>.
									</ResumeCard>
								</Grid>
							</Grid>
						</div>
					</React.Fragment>
				);
			}}

		</Consumer>
	);
}

Resume.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Resume);