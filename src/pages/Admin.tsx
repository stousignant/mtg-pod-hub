import { Shield, Gamepad2, Database, Users } from 'lucide-react'
import Header from '@/components/Header'
import { GameEntryForm } from '@/components/GameEntryForm'
import { DeckManagementForm } from '@/components/DeckManagementForm'
import { PlayerManagementForm } from '@/components/PlayerManagementForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-3 bg-muted/50 border border-border">
            <TabsTrigger
              value="games"
              className="flex-1 min-w-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Game Entry</span>
              <span className="sm:hidden">Games</span>
            </TabsTrigger>

            <TabsTrigger
              value="decks"
              className="flex-1 min-w-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Deck Management</span>
              <span className="sm:hidden">Decks</span>
            </TabsTrigger>

            <TabsTrigger
              value="players"
              className="min-w-0 gap-2 px-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Players</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games">
            <GameEntryForm />
          </TabsContent>

          <TabsContent value="decks">
            <DeckManagementForm />
          </TabsContent>

          <TabsContent value="players">
            <PlayerManagementForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
