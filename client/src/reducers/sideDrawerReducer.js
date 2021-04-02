export const sideDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case 'DRAWER_TOGGLE':
      return action.payload
    default:
      return state
  }
}
