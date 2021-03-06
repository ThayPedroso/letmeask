import React, { FormEvent, useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Button } from '../components/Button'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import logoImgDark from '../assets/images/logo_dark.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { database } from '../services/firebase'

export function Home() {
  
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  const { theme } = useTheme()

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    console.log('autenticou')
    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={theme === 'light' ? logoImg : logoImgDark} alt="Letmeask" />
          {!user ? (
            <>
              <button onClick={handleCreateRoom} className="create-room">
                <img src={googleIconImg} alt="Logo do Google" />
                Crie sua sala com o Google
              </button>
              <div className="separator">ou entre em uma sala</div>
            </>
          ) : (
            <>
              <Button onClick={handleCreateRoom}>Crie sua sala</Button>
              <div className="separator">ou entre em uma sala</div>
            </>
          )}

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
