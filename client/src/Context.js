import React from 'react';

const Context = React.createContext();

class Provider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isDark: true,
		}

		this.toggleTheme = this.toggleTheme.bind(this);
	}

	toggleTheme() {
		this.setState({
			isDark: !this.state.isDark,
		});
	}

	render() {
		return (
			<Context.Provider value={{
				toggleTheme: this.toggleTheme,
				...this.state,
			}}>
				{this.props.children}
			</Context.Provider>
		)
	}
}

const Consumer = Context.Consumer;

export {
	Provider,
	Consumer,
}