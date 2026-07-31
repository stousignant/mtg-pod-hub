import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { usePlayerMutations } from '@/hooks/usePlayerMutations'
import { usePlayers } from '@/hooks/usePlayers'
import { playerFormSchema, type PlayerFormData } from '@/schemas/playerSchema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FormMode = 'create' | 'edit'

const emptyPlayer: PlayerFormData = {
  name: '',
  avatar_url: '',
}

export const PlayerManagementForm = () => {
  const [mode, setMode] = useState<FormMode>('create')
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: emptyPlayer,
  })

  const { data: players = [], isLoading: playersLoading } = usePlayers()
  const { createPlayer, updatePlayer } = usePlayerMutations()

  const handleModeChange = (value: string) => {
    setMode(value as FormMode)
    setSelectedPlayerId('')
    form.reset(emptyPlayer)
  }

  const handlePlayerChange = (playerId: string) => {
    setSelectedPlayerId(playerId)
    const player = players.find(item => String(item.id) === playerId)

    if (player) {
      form.reset({
        name: player.name,
        avatar_url: player.avatar_url ?? '',
      })
    }
  }

  const onSubmit = async (data: PlayerFormData) => {
    try {
      if (mode === 'edit') {
        if (!selectedPlayerId) return

        await updatePlayer.mutateAsync({ id: selectedPlayerId, input: data })
        toast.success('Player updated successfully!')
      } else {
        await createPlayer.mutateAsync(data)
        toast.success('Player created successfully!')
        form.reset(emptyPlayer)
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === 'edit' ? 'update' : 'create'} player`
      )
    }
  }

  const isLoading =
    playersLoading || createPlayer.isPending || updatePlayer.isPending
  const isFormDisabled = isLoading || (mode === 'edit' && !selectedPlayerId)

  let submitLabel = mode === 'edit' ? 'Update Player' : 'Create Player'
  if (updatePlayer.isPending) submitLabel = 'Updating...'
  if (createPlayer.isPending) submitLabel = 'Creating...'

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-purple-500/30 glow-purple">
      <CardHeader>
        <CardTitle>Player Management</CardTitle>
        <CardDescription>
          Add a new player or modify an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={handleModeChange} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Add Player</TabsTrigger>
            <TabsTrigger value="edit">Modify Player</TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === 'edit' && (
          <div className="mb-6 space-y-2">
            <label className="text-sm font-medium" htmlFor="player-to-edit">
              Player to modify
            </label>
            <Select
              value={selectedPlayerId}
              onValueChange={handlePlayerChange}
              disabled={isLoading}
            >
              <SelectTrigger id="player-to-edit">
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                {players.map(player => (
                  <SelectItem key={player.id} value={String(player.id)}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Archmage Viktor"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Avatar URL{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/avatar.png"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              {submitLabel}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
