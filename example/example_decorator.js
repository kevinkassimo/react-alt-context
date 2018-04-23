import React from 'react';
import { render } from 'react-dom';
// Import altCtx
import altCtx from '../index';

// Provider is a crafted provider wrapper of default React 16 Context Provider
// altCtx.create(defaultValue)
// const { Provider, connect } = altCtx.create({ color: 'red' });

const { provider, consumer } = altCtx.createDecorator();

@provider({color: 'red'})
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Click button below to change its color to GREEN!</h1>
        <Button text={'Click Me!!!'}/>
      </div>
    )
  }
}

@consumer('colorWrapper')
class Button extends React.Component {
  render() {
    return (
      <div>
        <button
          style={{ backgroundColor: this.props.colorWrapper.color }}
          onClick={() => this.props.setColorWrapper({ color: 'green' })}>
          {this.props.text}
        </button>
      </div>
    );
  }
}

render(<App prop1={123}/>, document.getElementById('root'));