import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faTwitch } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { ArrowDropDown } from '@material-ui/icons'
import { Parallax } from 'react-parallax';
import FadeOnStart from '../../UtilComponents/FadeOnStart';

// import './Intro.css'

const styles = theme => ({
	greeting: {
		color: theme.palette.primary.main,
		[theme.breakpoints.down('sm')]: {
			fontSize: '2rem',
		},
		[theme.breakpoints.up('md')]: {
			fontSize: '2.7rem',
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: '3rem',
		},
	},
	name: {
		color: 'rgba(255,255,255,1)',
		[theme.breakpoints.down('sm')]: {
			fontSize: '2.5rem',
		},
		[theme.breakpoints.up('md')]: {
			fontSize: '3.2rem',
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: '3.5rem',
		},
	},
	intro: {
		color: 'rgba(255,255,255,.8)',
		marginLeft: '1rem',
		marginRight: '1rem',
		[theme.breakpoints.down('sm')]: {
			fontSize: '0.9rem',
		},
		[theme.breakpoints.up('md')]: {
			fontSize: '1.2rem',
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: '1.3125rem',
		},
	},
	button: {
		color: theme.palette.primary.main,
		// border: '1px solid rgba(255, 255, 0, 0.8)'
		border: `1px solid ${theme.palette.primary.main}`
	},
	noAnchorStyle: {
		textDecoration: 'none',
	},
	heroUnit: {
		// background: 'linear-gradient(rgba(20,20,20, 0.5), rgba(20,20,20, 0.5)), url(./intro-bg.jpg) no-repeat center center',
		background: 'linear-gradient(rgba(20,20,20, 0.5), rgba(20,20,20, 0.5))',
		backgroundSize: 'cover',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		position: 'relative',
		minHeight: '400px'
	},
	parallaxBg: {
		bottom: '-200px',
	},
	iconSet: {
		position: 'absolute',
		bottom: '0',
		fontSize: '3rem',
		[theme.breakpoints.down('sm')]: {
			marginBottom: theme.spacing(3),
		},
		[theme.breakpoints.up('md')]: {
			marginBottom: theme.spacing(7),
		},
		[theme.breakpoints.up('lg')]: {
			marginBottom: theme.spacing(10),
		},
	},
	icon: {
		color: 'white',
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			fontSize: '2rem',
		},
		[theme.breakpoints.up('md')]: {
			fontSize: '2.7rem',
		},
		[theme.breakpoints.up('lg')]: {
			fontSize: '3rem',
		},
		transition: 'color .3s linear',
		'&:hover': {
			color: theme.palette.primary.main,
		},
	},
	heroContent: {
		[theme.breakpoints.down('sm')]: {
			maxWidth: '18rem',
		},
		[theme.breakpoints.up('sm')]: {
			maxWidth: '28rem',
		},
		[theme.breakpoints.up('md')]: {
			maxWidth: '36rem',
		},
		[theme.breakpoints.up('lg')]: {
			maxWidth: '40rem',
		},
	},
	heroButtons: {
		marginTop: theme.spacing(4),
	},
});

class Intro extends React.Component {
	render() {
		const { classes } = this.props;
		const fadeDelayUnit = 150;
		const timeout = 1000;

		return (
			<main>
				{/* Hero unit */}
				<Parallax blur={{ min: -100, max: 100 }} bgClassName={classes.parallaxBg} strength={400} bgImage={'/intro-bg.jpg'}>
					<div className={classes.heroUnit}>
						<div className={classes.heroContent}>
							<FadeOnStart timeout={timeout} delay={0 * fadeDelayUnit}>
								<Typography align="center" className={classes.greeting} gutterBottom>
									Hello!
								</Typography>
							</FadeOnStart>
							<FadeOnStart timeout={timeout} delay={1 * fadeDelayUnit}>
								<Typography variant="h2" align="center" className={classes.name} gutterBottom>
									I'm Clay Benson
								</Typography>
							</FadeOnStart>
							<FadeOnStart timeout={timeout} delay={2 * fadeDelayUnit}>
								<div>
									<Typography variant="h6" align="center" className={classes.intro} paragraph>
										I'm a Software Engineering Lead.
									</Typography>
									<Typography variant="h6" align="center" className={classes.intro} paragraph>
										I enjoy deleting code and learning by doing.
									</Typography>
								</div>
							</FadeOnStart>
							<FadeOnStart timeout={timeout} delay={3 * fadeDelayUnit}>
								<div className={classes.heroButtons}>
									<Grid container spacing={8} justify="center">
										<Grid item>
											<AnchorLink className={classes.noAnchorStyle} href='#about'>
												<IconButton className={classes.button} aria-label="Delete">
													<ArrowDropDown />
												</IconButton>
											</AnchorLink>
										</Grid>
									</Grid>
								</div>
							</FadeOnStart>
						</div>
						<FadeOnStart timeout={timeout} delay={4 * fadeDelayUnit}>
							<div className={classes.iconSet}>
								<Tooltip title="Contact me!"><a href="mailto:contact@claybenson.me" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon className={classNames(classes.icon, 'clickable')} icon={faEnvelope} /></a></Tooltip>
								<Tooltip title="GitHub"><a href="https://github.com/ClayBenson94" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon className={classNames(classes.icon, 'clickable')} icon={faGithub} /></a></Tooltip>
								<Tooltip title="LinkedIn"><a href="https://www.linkedin.com/in/claybenson94/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon className={classNames(classes.icon, 'clickable')} icon={faLinkedin} /></a></Tooltip>
								<Tooltip title="Twitch"><a href="https://www.twitch.tv/piercinggoblin" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon className={classNames(classes.icon, 'clickable')} icon={faTwitch} /></a></Tooltip>
							</div>
						</FadeOnStart>
					</div>
				</Parallax>
			</main>
		);
	}
}

Intro.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Intro);