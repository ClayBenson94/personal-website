import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home'
import LED from './components/LED/LED'
import NotFound from './components/NotFound/NotFound'
import { createMuiTheme, MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { Consumer } from './Context';

class App extends Component {
	render() {
		return (
			<Consumer>
				{(context) => {
					const theme = createMuiTheme({
						palette: {
							type: context.isDark ? 'dark' : 'light',
							primary: {
								main: '#ffb300',
							},
						},
					});
					theme.palette.darkAndLight = context.isDark ? theme.palette.primary.main : theme.palette.primary.dark;
					return (
						<MuiThemeProvider theme={theme}>
							<CssBaseline />
							<Router>
								<Switch>
									<Route exact path='/' component={Home} />
									<Route exact path='/led' component={LED} />
									<Route status={404} component={NotFound}/>
									{/* <Route status={404} component={() => {
										return (
											<div>
												<div><pre>Page Not Found at {window.location.href}</pre></div>
												<div><a href="/">Go Home</a></div>
											</div>
										);
									}} /> */}
								</Switch>
							</Router>
						</MuiThemeProvider>
					);
				}}
			</Consumer>
		);
	}
}

export default App;
