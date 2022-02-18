import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { HomeIcon } from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid'
import { useRecoilState } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import { playlistIdState } from '../atoms/playlistAtom'

export default function Sidebar() {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyApi])

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r overflow-y-scroll scrollbar-hide border-gray-900 h-screen sm:max-w-[12rem] lg:max-w-[15rem] pb-36">
      <div className="space-y-4">
        <img className="w-52 mb-8" src="/logo.svg" alt="Spotify Logo" />
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="w-5 h-5 text-blue-500" />
          <p>Liked Songs</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <div className="space-y-4">
          {playlists?.map((playlist) => <p key={playlist.id} className="cursor-pointer truncate hover:text-white" onClick={() => setPlaylistId(playlist.id)}>{playlist.name}</p>)}
        </div>
      </div>
    </div>
  )
}
