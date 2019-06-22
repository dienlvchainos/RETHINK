
import { AsyncStorage } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
// import storage from 'redux-persist/lib/storage'
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import reducer from './reducers';
import promise from './promise';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

export default function configureStore() {
  const enhancer = compose(
    applyMiddleware(thunk, promise),
    devTools({
      name: 'rethink', realtime: true,
    })
  );

  const store = createStore(persistedReducer, enhancer);
  persistStore(
    store,
    null,
    () => {
      
    }
  )
  return store;
}
