export const addressReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHECKOUT_ADDRESS_SAVED':
      return action.payload
    default:
      return state
  }
}
