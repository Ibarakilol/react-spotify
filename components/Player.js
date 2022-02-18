import { useState, useEffect, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { useSession } from 'next-auth/react'
import { VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline'
import { RewindIcon, SwitchHorizontalIcon, FastForwardIcon, PauseIcon, PlayIcon, VolumeUpIcon, ReplyIcon } from '@heroicons/react/solid'
import { debounce } from 'lodash'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'


export default function Player() {
  const spotifyApi = useSpotify()
  const songInfo = useSongInfo()
  const { data: session } = useSession()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(100)

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id)
        spotifyApi.getMyCurrentPlaybackState().then((data) => setIsPlaying(data.body?.is_playing))
      })
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(100)
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) debouncedAdjustVolume(volume)
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {})
    }, 500)
  )

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-sm md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img className="w-10 h-10" src={songInfo?.album.images[0].url} alt={songInfo?.name} />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-white transition transform duration-100 ease-out" />
        <RewindIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-white transition transform duration-100 ease-out" onClick={() => spotifyApi.skipToPrevious()} />

        {isPlaying ? (
          <PauseIcon className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" onClick={handlePlayPause} />
        )}

        <FastForwardIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-white transition transform duration-100 ease-out" onClick={() => spotifyApi.skipToNext()} />
        <ReplyIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-white transition transform duration-100 ease-out" />
      </div>

      <div className="flex items-center justify-end space-x-3 md:space-x-4 pr-5">
        <VolumeDownIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-white transition transform duration-100 ease-out" onClick={() => volume > 0 && setVolume(volume - 10)} />
        <input className="w-14 md:w-28" type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        <VolumeUpIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-white transition transform duration-100 ease-out" onClick={() => volume < 100 && setVolume(volume + 10)} />
      </div>
    </div>
  )
}
