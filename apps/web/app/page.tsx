import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          VibeVault
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Your Visual Link Collection
        </p>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border p-8">
          {session ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Welcome back, {session.user?.name}!</h2>
              <p>You're signed in. Start collecting links now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Sign in to get started</h2>
              <p>Sign in with GitHub to start collecting and organizing your links.</p>
              <div className="flex justify-center">
                <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Sign in with GitHub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
