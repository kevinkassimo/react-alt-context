/*
 * Alternative React Context API
 */

import React, { createContext } from 'react';
import createReactClass from 'create-react-class';

function _createConnector(Consumer) {
  return (Klass, ctxName = null) => {
    if (!ctxName) {
      ctxName = 'ctx';
    }
    const ctxUpdateName = `set${ ctxName.replace(/^\w/, (chr) => chr.toUpperCase()) }`;
    
    return createReactClass({
      render: function () {
        const props = this.props;
        const _consumerFunc = (context) => {
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
