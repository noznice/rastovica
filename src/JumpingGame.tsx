import React, { useEffect, useRef, useState } from 'react'
import './JumpingGame.css'

const GRAVITY = 0.5
const JUMP_POWER = 10

export default function JumpingGame() {
  const [y, setY] = useState(0)
  const velocity = useRef(0)
  const frame = useRef<number>()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && y === 0) {
        velocity.current = JUMP_POWER
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [y])

  useEffect(() => {
    const update = () => {
      velocity.current -= GRAVITY
      setY(prev => {
        let newY = prev + velocity.current
        if (newY < 0) {
          newY = 0
          velocity.current = 0
        }
        return newY
      })
      frame.current = requestAnimationFrame(update)
    }
    frame.current = requestAnimationFrame(update)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div className="game">
      <div className="player" style={{ bottom: `${y}px` }} />
      <div className="floor" />
    </div>
  )
}
