import Head from 'next/head'
import { getSession } from 'next-auth/react'
import Layout from '../components/layout'
import Center from '../components/Center'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>React Spotify</title>
      </Head>
      <div className="bg-black h-screen overflow-hidden">
        <main className="flex">
          <Sidebar />
          <Center />
        </main>
        <div className="sticky bottom-0">
          <Player />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  return {
    props: {
      session
    }
  }
}
