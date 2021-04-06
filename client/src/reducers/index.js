import { combineReducers } from 'redux'
import { userReducer } from './userReducer'
import { searchReducer } from './searchReducer'
import { cartReducer } from './cartReducer'
import { drawerReducer } from './drawerReducer'
import { addressReducer } from './addressReducer'

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  userAddress: addressReducer,
})

export default rootReducer
