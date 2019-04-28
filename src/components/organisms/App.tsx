import React, { useState, useEffect } from 'react'
import Game from './Game'
import Dashboard from './Dashboard'
import StartScreen from '../molecules/StartScreen'
import LoadingScreen from '../molecules/LoadingScreen'
import AudioPlayer from '../atoms/AudioPlayer'
import Overlay from '../atoms/Overlay'
// @ts-ignore
import gameSound from '../../sounds/GameSound.mp3'
// @ts-ignore
import gameMenu from '../../sounds/GameMenu.mp3'

interface IAuth {
  login: (service: string) => void
  isLoggedIn: (service: string) => boolean
}

const App: React.FC<{ auth: IAuth }> = ({ auth }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [song, setSong] = useState(gameMenu)
  const [loading, setLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)
  useEffect(() => {
    async function checkIfLoggedIn() {
      try {
        const loggedIn = await auth.isLoggedIn('github')
        if (loggedIn) {
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
        }
        setLoading(false)
      } catch (e) {
        console.error('Error: could not login with OneGraph')
        setAuthenticated(false)
        setLoading(false)
      }
    }

    checkIfLoggedIn()
  }, [auth])

  useEffect(() => {
    if (authenticated) {
      setSong(gameSound)
    } else {
      setSong(gameMenu)
    }
  }, [authenticated])

  function login(service = 'github') {
    return async () => {
      await auth.login(service)
      setAuthenticated(await auth.isLoggedIn('github'))
    }
  }
  return (
    <React.Fragment>
      {loading && <LoadingScreen />}
      <Overlay show={showOverlay} toggleOverlay={setShowOverlay}>
        <Game />
      </Overlay>
      <AudioPlayer url={song} />
      {authenticated && !loading ? (
        <Dashboard toggleOverlay={setShowOverlay} />
      ) : (
        <StartScreen login={login()} />
      )}
    </React.Fragment>
  )
}

export default App