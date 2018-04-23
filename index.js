/*
 * Alternative React Context API
 */

import React, { createContext } from 'react';

/*
 * Create a connect function with using the given Consumer wrapper
 */
function _createConnector(Consumer) {
  return (Klass, ctxName = null) => {
    // Use default name `ctx` if no other names are given
    if (!ctxName) {
      ctxName = 'ctx';
    }
    // Attempt to capitalize the first character
    const ctxUpdateName = `set${ ctxName.replace(/^\w/, (chr) => chr.toUpperCase()) }`;
    
    return class extends React.Component {
      render() {
        const props = this.props;
        const _consumerFunc = (context) => {
          // Apply custom prop names
          const _ctxProps = {
            [ctxName]: context.$value,
            [ctxUpdateName]: context.$update,
          };
          return <Klass {...props} {..._ctxProps}/>
        }
        return (
          <Consumer>
            {_consumerFunc}
          </Consumer>
        );
      }
    };
  };
}

/*
 * create a context, returns { Provider, connect }
 */
const createConnector = (value) => {
  const { Provider, Consumer } = createContext(null);

  return {
    Provider: class extends React.Component {
      constructor(props) {
        super(props);

        this.$update = (v) => {
          this.setState({ $value: v });
        };

        this.state = {
          $value: value,
          $update: this.$update,
        };
      }
      render() {
        return (
          <Provider value={this.state}>
            {this.props.children}
          </Provider>
        );
      }
    },
    connect: _createConnector(Consumer),
  };
};

/*
 * create the context decorators
 */
const createDecorator = () => {
  const {
    Provider: RawProvider,
    Consumer: RawConsumer,
  } = createContext(null);

  const provider = (value) => (WrappedClass) => {
    return class extends React.Component {
      constructor(props) {
        super(props);

        this.$update = (v) => {
          this.setState({ $value: v });
        };

        this.state = {
          $value: value,
          $update: this.$update,
        };
      }
      render() {
        return (
          <RawProvider value={this.state}>
            <WrappedClass {...this.props} />
          </RawProvider>
        );
      }
    };
  }

  const consumer = (ctxName) => (WrappedClass) => {
    // Use default name `ctx` if no other names are given
    if (!ctxName) {
      ctxName = 'ctx';
    }
    // Attempt to capitalize the first character
    const ctxUpdateName = `set${ ctxName.replace(/^\w/, (chr) => chr.toUpperCase()) }`;

    return class extends React.Component {
      render() {
        const _consumerFunc = (context) => {
          // Apply custom prop names
          const _ctxProps = {
            [ctxName]: context.$value,
            [ctxUpdateName]: context.$update,
          };
          return <WrappedClass {...this.props} {..._ctxProps}/>
        }
        return (
          <RawConsumer>
            {_consumerFunc}
          </RawConsumer>
        );
      }
    };
  }

  return {
    provider,
    consumer,
  };
};

const _exports = {
  createConnector,
  createDecorator,
};

export default _exports;
