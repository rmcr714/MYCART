import { combineReducers } from 'redux'
import { userReducer } from './userReducer'
import { searchReducer } from './searchReducer'
import { cartReducer } from './cartReducer'
import { drawerReducer } from './drawerReducer'
import { addressReducer } from './addressReducer'
import { couponReducer } from './couponReducer'
import { codReducer } from './codReducer'

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  drawer: drawerReducer,
  userAddress: addressReducer,
  coupon: couponReducer,
  cod: codReducer,
})

export default rootReducer
