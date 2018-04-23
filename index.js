/*
 * Alternative React Context API
 */

import React, { createContext } from 'react';
import createReactClass from 'create-react-class';

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
    
    return createReactClass({
      render: function () {
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
    })
  }
}

/*
 * create a context, returns { Provider, connect }
 */
const create = (value) => {
  const { Provider, Consumer } = createContext(null);

  const _ProviderWrapper = createReactClass({
    getInitialState: function () {
      return {
        $value: value,
        $update: this.$update,
      };
    },
    $update: function(v) {
      this.setState({
        $value: v,
      });
    },
    render: function() {
      return (
        <Provider value={this.state}>
          {this.props.children}
        </Provider>
      );
    }
  });

  return {
    Provider: _ProviderWrapper,
    connect: _createConnector(Consumer),
  };
}

const _exports = {
  create,
};

export default _exports;
