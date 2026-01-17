import React from 'react'
import LoadingImg from 'assets/img/loading_gray.gif'

export default function LoadingScreen({ normalSize }) {
  return (
    <div className={`loading-screen ${normalSize ? 'normal' : ''}`}>
      <img src={LoadingImg} alt="loading" />
    </div>
  )
}
