import React, { createContext } from 'react';
import createReactClass from 'create-react-class';

class Ctx {
  constructor(Consumer) {
    this.Consumer = Consumer;
  }

  connect = (Klass) => {
    let Consumer = this.Consumer;

    return createReactClass({
      render: function () {
        return (
          <Consumer>
            {ctx => <Klass ctx={ctx.$value} updateCtx={ctx.$update} />}
          </Consumer>
        );
      }
    });
  };
}

export const create = (value) => {
  const { Provider, Consumer } = createContext(null);

  const ProviderWrapper = createReactClass({
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
      console.log(this.state);
      return (
        <Provider value={this.state}>
          {this.props.children}
        </Provider>
      );
    }
  });

  const ctxObject = new Ctx(Consumer)

  return {
    Provider: ProviderWrapper,
    connect: ctxObject.connect,
  };
}