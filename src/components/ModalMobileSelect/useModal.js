const { useState } = require('react')

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false)
  const [response, setResponse] = useState(false)
  const toggle = () => setIsShowing(!isShowing)
  return [isShowing, toggle, response, setResponse]
}
export default useModal
