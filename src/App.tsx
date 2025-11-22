import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

export default App;
