const Caret = ({direction}) => {
  return direction === "asc" 
    ? <i className="fa-solid fa-caret-up"></i>
    : <i className="fa-solid fa-caret-down"></i>
}

export default Caret;