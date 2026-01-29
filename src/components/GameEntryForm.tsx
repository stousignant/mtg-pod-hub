import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { usePodPlayers } from '@/hooks/usePodPlayers'
import { usePods } from '@/hooks/usePods'
import { useDecks } from '@/hooks/useDecks'
import { useGameMutations } from '@/hooks/useGameMutations'
import { gameFormSchema, type GameFormData } from '@/schemas/gameSchema'
import { GAME_ENTRY, OUTCOME } from '@/constants/config'
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

const emptyResult = () => ({
  player_id: '',
  deck_id: '',
  outcome: '' as const,
})

export const GameEntryForm = () => {
  const { data: pods = [], isLoading: podsLoading } = usePods()
  const { createGame } = useGameMutations()

  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      pod_id: '',
      game_date: new Date().toISOString().split('T')[0],
      results: Array.from(
        { length: GAME_ENTRY.DEFAULT_PLAYER_COUNT },
        emptyResult
      ),
    },
  })

  const selectedPodId = form.watch('pod_id')
  const { data: podPlayers = [], isLoading: podPlayersLoading } = usePodPlayers(
    selectedPodId || undefined
  )

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'results',
  })

  useEffect(() => {
    if (!selectedPodId || podPlayers.length === 0) {
      return
    }

    const results = podPlayers.map(player => ({
      player_id: String(player.id),
      deck_id: '',
      outcome: '' as const,
    }))

    replace(results)
  }, [selectedPodId, podPlayers, replace])

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
      append(emptyResult())
    }
  }

  const removePlayer = (index: number) => {
    if (fields.length > GAME_ENTRY.DEFAULT_PLAYER_COUNT) {
      remove(index)
    }
  }

  const isLoading = podsLoading || podPlayersLoading || createGame.isPending

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
                          <SelectItem key={pod.id} value={String(pod.id)}>
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
                      <Input
                        type="date"
                        {...field}
                        disabled={isLoading}
                        className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                      />
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
                  podPlayers={podPlayers}
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

interface PodPlayer {
  id: number
  name: string
  avatar_url: string | null
}

interface PlayerResultFieldsProps {
  index: number
  form: ReturnType<typeof useForm<GameFormData>>
  podPlayers: PodPlayer[]
  onRemove: () => void
  canRemove: boolean
  isLoading: boolean
}

const PlayerResultFields = ({
  index,
  form,
  podPlayers,
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

  useEffect(() => {
    if (decks.length === 1 && selectedPlayerId) {
      form.setValue(`results.${index}.deck_id`, String(decks[0].id))
    }
  }, [decks, selectedPlayerId, form, index])

  const outcomeOptions = [
    { value: OUTCOME.WIN, label: 'Win' },
    { value: OUTCOME.DRAW, label: 'Draw' },
    { value: OUTCOME.LOSS, label: 'Loss' },
  ]

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
                  {podPlayers.map(player => (
                    <SelectItem key={player.id} value={String(player.id)}>
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
                    <SelectItem key={deck.id} value={String(deck.id)}>
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
          name={`results.${index}.outcome`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outcome</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {outcomeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
