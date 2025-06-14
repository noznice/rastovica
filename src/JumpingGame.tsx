import React, { useEffect, useRef, useState } from 'react'
import './JumpingGame.css'

const GRAVITY = 0.5
const JUMP_POWER = 20
const GAME_WIDTH = 1024
const GAME_HEIGHT = 1024
const PLAYER_WIDTH = 100
const PLAYER_HEIGHT = 100
const PLATFORM = { x: 100, y: 333, width: 80, height: 10 }

const MOVE_SPEED = 5

export default function JumpingGame() {
  const [y, setY] = useState(0)
  const [x, setX] = useState((GAME_WIDTH - PLAYER_WIDTH) / 2)
  const velocity = useRef(0)
  const frame = useRef<number>()
  const keys = useRef({ left: false, right: false, space: false })
  const yRef = useRef(0)



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') keys.current.left = true
      else if (e.code === 'ArrowRight') keys.current.right = true
      else if (e.code === 'Space' || e.code === 'ArrowUp' ) keys.current.space = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') keys.current.left = false
      else if (e.code === 'ArrowRight') keys.current.right = false
      else if (e.code === 'Space'|| e.code === 'ArrowUp') keys.current.space = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const update = () => {
      if (keys.current.left) {
        setX(prev => Math.max(0+PLAYER_WIDTH/2.5, prev - MOVE_SPEED))
      }
      if (keys.current.right) {
        setX(prev => Math.min(GAME_WIDTH - PLAYER_WIDTH/2.5, prev + MOVE_SPEED))
      }
      if (keys.current.space && yRef.current === 0 && velocity.current === 0) {
        velocity.current = JUMP_POWER
      }

      velocity.current -= GRAVITY
      setY(prev => {
        let newY = prev + velocity.current
          const withinPlatformX =
          x + PLAYER_WIDTH > PLATFORM.x && x < PLATFORM.x + PLATFORM.width

        const wasAbovePlatform = prev >= PLATFORM.y + PLATFORM.height
        const crossedDown =
          velocity.current <= 0 &&
          wasAbovePlatform &&
          newY <= PLATFORM.y + PLATFORM.height

        const wasBelowPlatform = prev + PLAYER_HEIGHT <= PLATFORM.y
        const crossedUp =
          velocity.current > 0 &&
          wasBelowPlatform &&
          newY + PLAYER_HEIGHT >= PLATFORM.y

        if (crossedDown && withinPlatformX) {
          newY = PLATFORM.y + PLATFORM.height
          velocity.current = 0
        } else if (crossedUp && withinPlatformX) {
          newY = PLATFORM.y - PLAYER_HEIGHT
          velocity.current = 0
        } else {
          if (newY < 0) {
            newY = 0
            velocity.current = 0
          } else if (newY > GAME_HEIGHT - PLAYER_HEIGHT) {
            newY = GAME_HEIGHT - PLAYER_HEIGHT
            velocity.current = 0
          }
        }

        yRef.current = newY
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
      <div
        className="player"
        style={{ bottom: `${y}px`, left: `${x}px` }}
      />
         <div
        className="platform"
        style={{ left: PLATFORM.x, bottom: PLATFORM.y, width: PLATFORM.width, height: PLATFORM.height }}
      />
      <div className="floor" />
    </div>
  )
}