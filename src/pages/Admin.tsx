import { Shield } from 'lucide-react'
import Header from '@/components/Header'
import { GameEntryForm } from '@/components/GameEntryForm'

export const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Record new games and manage tournament data
          </p>
        </div>

        <GameEntryForm />
      </main>
    </div>
  )
}
