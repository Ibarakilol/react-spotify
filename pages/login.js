import Head from 'next/head'
import { getProviders, signIn } from 'next-auth/react'
import Layout from '../components/layout'

export default function Login({ providers }) {
  return (
    <Layout>
      <Head>
        <title>React Spotify - Login</title>
      </Head>
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        <img className="w-24 mb-5" src="https://pnggrid.com/wp-content/uploads/2021/05/White-Spotify-Icon-1024x1024.png" alt="Spotify Logo" />
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="mt-5">
            <button className="bg-[#18D860] text-white px-5 py-3 rounded-full font-semibold" onClick={() => signIn(provider.id, { callbackUrl: '/' })}>Login with {provider.name}</button>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}
