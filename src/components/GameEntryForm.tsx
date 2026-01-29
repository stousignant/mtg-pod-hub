import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { usePlayers } from '@/hooks/usePlayers'
import { usePods } from '@/hooks/usePods'
import { useDecks } from '@/hooks/useDecks'
import { useGameMutations } from '@/hooks/useGameMutations'
import { gameFormSchema, type GameFormData } from '@/schemas/gameSchema'
import { GAME_ENTRY } from '@/constants/config'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
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

export const GameEntryForm = () => {
  const { data: players = [], isLoading: playersLoading } = usePlayers()
  const { data: pods = [], isLoading: podsLoading } = usePods()
  const { createGame } = useGameMutations()

  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      pod_id: '',
      game_date: new Date().toISOString().split('T')[0],
      results: Array.from({ length: GAME_ENTRY.DEFAULT_PLAYER_COUNT }, () => ({
        player_id: '',
        deck_id: '',
        placement: 1,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'results',
  })

  const onSubmit = async (data: GameFormData) => {
    try {
      await createGame.mutateAsync(data)
      toast.success('Game recorded successfully!')
      form.reset()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record game'
      )
    }
  }

  const addPlayer = () => {
    if (fields.length < GAME_ENTRY.MAX_PLAYERS) {
      append({ player_id: '', deck_id: '', placement: fields.length + 1 })
    }
  }

  const removePlayer = (index: number) => {
    if (fields.length > GAME_ENTRY.DEFAULT_PLAYER_COUNT) {
      remove(index)
    }
  }

  const isLoading = playersLoading || podsLoading || createGame.isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record New Game</CardTitle>
        <CardDescription>Enter game details and player results</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pod_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pod</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pod" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pods.map(pod => (
                          <SelectItem key={pod.id} value={pod.id}>
                            {pod.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="game_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Players</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPlayer}
                  disabled={
                    isLoading || fields.length >= GAME_ENTRY.MAX_PLAYERS
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              </div>

              {fields.map((field, index) => (
                <PlayerResultFields
                  key={field.id}
                  index={index}
                  form={form}
                  players={players}
                  onRemove={() => removePlayer(index)}
                  canRemove={fields.length > GAME_ENTRY.DEFAULT_PLAYER_COUNT}
                  isLoading={isLoading}
                />
              ))}
            </div>

            <FormMessage>{form.formState.errors.results?.message}</FormMessage>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {createGame.isPending ? 'Recording...' : 'Record Game'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

interface PlayerResultFieldsProps {
  index: number
  form: ReturnType<typeof useForm<GameFormData>>
  players: { id: string; name: string; avatar_url: string | null }[]
  onRemove: () => void
  canRemove: boolean
  isLoading: boolean
}

const PlayerResultFields = ({
  index,
  form,
  players,
  onRemove,
  canRemove,
  isLoading,
}: PlayerResultFieldsProps) => {
  const selectedPlayerId = form.watch(`results.${index}.player_id`)
  const { data: decks = [], isLoading: decksLoading } = useDecks(
    selectedPlayerId || undefined
  )

  useEffect(() => {
    if (selectedPlayerId) {
      form.setValue(`results.${index}.deck_id`, '')
    }
  }, [selectedPlayerId, form, index])

  const placementOptions = Array.from(
    { length: GAME_ENTRY.MAX_PLAYERS },
    (_, i) => i + 1
  )

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name={`results.${index}.player_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`results.${index}.deck_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deck</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading || !selectedPlayerId || decksLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedPlayerId ? 'Select deck' : 'Select player first'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {decks.map(deck => (
                    <SelectItem key={deck.id} value={deck.id}>
                      {deck.name} ({deck.commander_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`results.${index}.placement`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placement</FormLabel>
              <Select
                onValueChange={value => field.onChange(Number(value))}
                value={field.value.toString()}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {placementOptions.map(placement => (
                    <SelectItem key={placement} value={placement.toString()}>
                      {placement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
            disabled={isLoading || !canRemove}
            className="w-full md:w-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
