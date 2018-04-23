# `react-alt-context` Alternative API for React Context

This is a working-in-progress minimal experiment with the brand-new React 16 `Context` API. This is created such that people no longer need to write their own update functions to Context values.

Currently, 2 different alternative API is created: decorator based and connect based.

## Decorator Based API
```javascript
import altCtx from 'react-alt-context';

const DecoratorContext = altCtx.createDecorator();

/*
 * DecoratorContext has 2 properties:
 * Decorator.provider: decorator on provider component
 * Decorator.consumer: decorator on consumer component
 */

const { provider, consumer } = DecoratorContext

/*
 * provider takes a single parameter: defaultValue
 * defaultValue is the inital value of the context storage
 */
@provider('red')
class ClassA extends React.Component { /* ... */ }

/*
 * provider takes a single optional parameter: contextName (if not specified, default to 'ctx')
 * contextName is the name of the prop that would be mounted on consumer class (this.props[contextName], or this.props.contextName; default to this.props.ctx)
 * It automatically comes with update function `set${contextName capitalized}` (this.props.[`set{contextName capitalized}`](newValue) or this.props.setContextNameCapitalized(newValue), default to this.props.setCtx(newValue))
 */
@consumer('color')
class ClassB extends React.Component {
  render() {
    return (
      <button
        style={{ color: this.props.color }}
        onClick={() => this.props.setColor('green')}>
        Change Color
      </button>
    );
  }
}
```

## Connector Based API
```javascript
import altCtx from 'react-alt-context';

// Provider is a crafted provider wrapper of default React 16 Context Provider
// altCtx.create(defaultValue)
// We need to provide an initial value here! (different from the connector version)
const { Provider, connect } = altCtx.createConnector({ color: 'red' });

class App extends React.Component {
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
// We tell altCtx to connect the context value to a prop named 'colorWrapper'. If not specified, the default value will be accessible at `this.props.ctx` and update function will be at `this.props.setCtx(newVal)`
const Button = connect(UnconnectedButton, 'colorWrapper');

render(<App />, document.getElementById('root'));
```

## Requirement
Simply \> React 16.3