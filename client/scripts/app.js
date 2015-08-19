var React = require('react');
var Actions = require('./actions.js');
var Store = require('./store.js')


console.log('react1213424234');

var App = React.createClass({

	render: function() {
		return (<div id="tests">
			<h1 className="title">Gifbrowse</h1>
			<SearchBox />
			<SearchResults />
			</div>);
	}

});
var ResultEntry = React.createClass({

	render: function() {
		return (<iframe class="gif" src={this.props.source}></iframe>);
	}

});

var SearchResults = React.createClass({

 	getInitialState: function() {
        return { gifs: {} };
    },

    componentDidMount: function() {
        Store.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this.onChange);
    },

    onChange: function() {       
    	console.log('updated results'); 
    	this.setState({ gifs: Store.getResults() });
    },

	render: function() {
		var elements = [];
		var gifs = this.state.gifs;
		for(var i = 0; i<gifs.length; i++) {
			var elem = <ResultEntry source={gifs[i].url}/>
			elements.push(elem);
		}
		console.log(elements);
		return (<div id="gifs">{elements}</div>);

	}

});

var SearchBox = React.createClass({

	render: function() {
		return (<input className='search input' placeholder='Look for gifs' onChange={Actions.searchForGifs}></input>);
	}

});


console.log('react1213424234');
React.render(<App />, document.body);