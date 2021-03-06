import React from 'react';
import { render } from 'react-dom';
// Import altCtx
import altCtx from '../index';

// Provider is a crafted provider wrapper of default React 16 Context Provider
// altCtx.create(defaultValue)
const { Provider, connect } = altCtx.createConnector({ color: 'red' });

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider> {/* don't specify value here */}
        <h1>Click button below to change its color to GREEN!</h1>
        <Button />
      </Provider>
    )
  }
}

class UnconnectedButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/* notice here, context value is available at this.props.colorWrapper */}
        <button style={{ backgroundColor: this.props.colorWrapper.color }} onClick={() => this.props.setColorWrapper({ color: 'green' })}>Click Me!</button>
      </div>
    );
  }
}

// Connecting context to UnconnectedButton 
// We tell altCtx to connect the context value to a prop named 'colorWrapper'. If not specified, the default value will be accessible at `this.props.ctx` and update function will be at `this.props.updateCtx`
const Button = connect(UnconnectedButton, 'colorWrapper');

render(<App />, document.getElementById('root'));