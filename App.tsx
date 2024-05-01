import 'react-native-gesture-handler';
import { View, Text } from 'react-native'
import React from 'react'
import Navigation from './src/Navigations/Navigation'
import { Provider } from 'react-redux';
import { store } from './src/redux/slices/store/store';

const App = () => {
  return (
<Provider store={store}>
      <Navigation/>
      </Provider>
  )
}

export default App