import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useDeckMutations } from '@/hooks/useDeckMutations'
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

export const DeckManagementForm = () => {
  const form = useForm<DeckFormData>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      name: '',
      commander_name: '',
      owner_id: '',
      commander_image_url: '',
    },
  })

  const { data: players = [], isLoading: playersLoading } = usePlayers()
  const { createDeck } = useDeckMutations()

  const onSubmit = async (data: DeckFormData) => {
    try {
      await createDeck.mutateAsync(data)
      toast.success('Deck created successfully!')
      form.reset()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create deck'
      )
    }
  }

  const isLoading = playersLoading || createDeck.isPending

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-purple-500/30 glow-purple">
      <CardHeader>
        <CardTitle>Add New Deck</CardTitle>
        <CardDescription>Create a new deck for a player</CardDescription>
      </CardHeader>
      <CardContent>
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
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {createDeck.isPending ? 'Creating...' : 'Create Deck'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
