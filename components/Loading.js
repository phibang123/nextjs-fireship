export default function Loading(props)
{ 
  const {show} = props
  return show ? <div className="loader"></div> : null
}