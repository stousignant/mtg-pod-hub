import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useDeckMutations } from '@/hooks/useDeckMutations'
import { useDecks } from '@/hooks/useDecks'
import { usePlayers } from '@/hooks/usePlayers'
import { deckFormSchema, type DeckFormData } from '@/schemas/deckSchema'
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

const emptyDeck: DeckFormData = {
  name: '',
  commander_name: '',
  owner_id: '',
  commander_image_url: '',
}

export const DeckManagementForm = () => {
  const [mode, setMode] = useState<FormMode>('create')
  const [selectedDeckId, setSelectedDeckId] = useState('')
  const form = useForm<DeckFormData>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: emptyDeck,
  })

  const { data: players = [], isLoading: playersLoading } = usePlayers()
  const { data: decks = [], isLoading: decksLoading } = useDecks()
  const { createDeck, updateDeck } = useDeckMutations()

  const handleModeChange = (value: string) => {
    setMode(value as FormMode)
    setSelectedDeckId('')
    form.reset(emptyDeck)
  }

  const handleDeckChange = (deckId: string) => {
    setSelectedDeckId(deckId)
    const deck = decks.find(item => item.id === deckId)

    if (deck) {
      form.reset({
        name: deck.name,
        commander_name: deck.commander_name,
        owner_id: deck.owner_id,
        commander_image_url: deck.commander_image_url ?? '',
      })
    }
  }

  const onSubmit = async (data: DeckFormData) => {
    try {
      if (mode === 'edit') {
        if (!selectedDeckId) return

        await updateDeck.mutateAsync({ id: selectedDeckId, input: data })
        toast.success('Deck updated successfully!')
      } else {
        await createDeck.mutateAsync(data)
        toast.success('Deck created successfully!')
        form.reset(emptyDeck)
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === 'edit' ? 'update' : 'create'} deck`
      )
    }
  }

  const isLoading =
    playersLoading ||
    decksLoading ||
    createDeck.isPending ||
    updateDeck.isPending
  const isFormDisabled = isLoading || (mode === 'edit' && !selectedDeckId)

  let submitLabel = mode === 'edit' ? 'Update Deck' : 'Create Deck'
  if (updateDeck.isPending) submitLabel = 'Updating...'
  if (createDeck.isPending) submitLabel = 'Creating...'

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-purple-500/30 glow-purple">
      <CardHeader>
        <CardTitle>Deck Management</CardTitle>
        <CardDescription>
          Create a new deck or modify an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={handleModeChange} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Add Deck</TabsTrigger>
            <TabsTrigger value="edit">Modify Deck</TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === 'edit' && (
          <div className="mb-6 space-y-2">
            <label className="text-sm font-medium" htmlFor="deck-to-edit">
              Deck to modify
            </label>
            <Select
              value={selectedDeckId}
              onValueChange={handleDeckChange}
              disabled={isLoading}
            >
              <SelectTrigger id="deck-to-edit">
                <SelectValue placeholder="Select a deck" />
              </SelectTrigger>
              <SelectContent>
                {decks.map(deck => (
                  <SelectItem key={deck.id} value={deck.id}>
                    {deck.name} — {deck.commander_name}
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
              name="owner_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isFormDisabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {players.map(player => (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Eldrazi Menace"
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
              name="commander_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commander Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Kozilek, the Great Distortion"
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
              name="commander_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Commander Image URL{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://cards.scryfall.io/..."
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
