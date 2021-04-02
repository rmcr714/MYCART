import { combineReducers } from 'redux'
import { userReducer } from './userReducer'
import { searchReducer } from './searchReducer'
import { cartReducer } from './cartReducer'
import { sideDrawerReducer } from './sideDrawerReducer'

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: sideDrawerReducer,
})

export default rootReducer
