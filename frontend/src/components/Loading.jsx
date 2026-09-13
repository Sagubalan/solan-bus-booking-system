import './Loading.css'

function Loading({ message = 'Loading…' }) {
  return (
    <div className="loading-wrapper" aria-live="polite">
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <div className="spinner-bus">🚌</div>
      </div>
      <p className="loading-msg">{message}</p>
    </div>
  )
}

export default Loading
