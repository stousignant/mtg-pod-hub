import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
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
  unsatisfying: false,
})

export const GameEntryForm = () => {
  const { data: pods = [], isLoading: podsLoading } = usePods()
  const { createGame } = useGameMutations()

  const form = useForm<GameFormData>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      pod_id: '',
      game_date: new Date().toISOString().split('T')[0],
      notes: '',
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

  const { fields, replace } = useFieldArray({
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
      unsatisfying: false,
    }))

    replace(results)
  }, [selectedPodId, podPlayers, replace])

  const onSubmit = async (data: GameFormData) => {
    try {
      await createGame.mutateAsync(data)
      toast.success('Game recorded successfully!')
      const currentResults = form.getValues('results')
      const resetResults = currentResults.map(result => ({
        ...result,
        outcome: '' as const,
        unsatisfying: false,
      }))
      form.setValue('results', resetResults)
      form.setValue('notes', '')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record game'
      )
    }
  }

  const handleOutcomeChange = (changedIndex: number, value: string) => {
    form.setValue(`results.${changedIndex}.outcome`, value)

    if (value === OUTCOME.WIN) {
      const results = form.getValues('results')
      results.forEach((_, index) => {
        if (index !== changedIndex) {
          form.setValue(`results.${index}.outcome`, OUTCOME.LOSS)
          form.setValue(`results.${index}.unsatisfying`, false)
        }
      })
    } else {
      form.setValue(`results.${changedIndex}.unsatisfying`, false)
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this game..."
                      {...field}
                      disabled={isLoading}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Players</h3>

              {fields.map((field, index) => (
                <PlayerResultFields
                  key={field.id}
                  index={index}
                  form={form}
                  podPlayers={podPlayers}
                  isLoading={isLoading}
                  onOutcomeChange={handleOutcomeChange}
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
  isLoading: boolean
  onOutcomeChange: (index: number, value: string) => void
}

const PlayerResultFields = ({
  index,
  form,
  podPlayers,
  isLoading,
  onOutcomeChange,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onValueChange={value => onOutcomeChange(index, value)}
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
      </div>

      {form.watch(`results.${index}.outcome`) === OUTCOME.WIN && (
        <FormField
          control={form.control}
          name={`results.${index}.unsatisfying`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Unsatisfying win (doesn't count for Trash Test)
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      )}
    </Card>
  )
}
