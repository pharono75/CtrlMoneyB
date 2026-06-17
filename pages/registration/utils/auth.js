export const isAuth = () => {
  return !!localStorage.getItem('token')
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}