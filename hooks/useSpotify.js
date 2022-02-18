import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import spotifyApi from '../libs/spotifyApi'

export default function useSpotify() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      if (session.error === 'RefreshAccessTokenError') signIn()

      spotifyApi.setAccessToken(session.user.accessToken)
    }
  }, [session])

  return spotifyApi
}
