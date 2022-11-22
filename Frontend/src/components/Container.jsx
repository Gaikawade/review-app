import React from 'react'

export default function Container({children, className}) {
  return (
    <div className={'max-w-screeen-xl mx-auto' + className}>
      {children}
    </div>
  )
}
