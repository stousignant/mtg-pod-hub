import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { usePodMutations } from '@/hooks/usePodMutations'
import { usePlayers } from '@/hooks/usePlayers'
import { podFormSchema, type PodFormData } from '@/schemas/podSchema'
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

const emptyPod: PodFormData = { name: '', player_ids: [] }

export const PodManagementForm = () => {
  const form = useForm<PodFormData>({
    resolver: zodResolver(podFormSchema),
    defaultValues: emptyPod,
  })
  const { createPod } = usePodMutations()
  const { data: players = [], isLoading: playersLoading } = usePlayers()

  const onSubmit = async (data: PodFormData) => {
    try {
      await createPod.mutateAsync(data)
      toast.success('Pod created successfully!')
      form.reset(emptyPod)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create pod'
      )
    }
  }

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-purple-500/30 glow-purple">
      <CardHeader>
        <CardTitle>Create Pod</CardTitle>
        <CardDescription>
          Add a new pod and select the players who belong to it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pod Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Friday Night Chaos"
                      {...field}
                      disabled={createPod.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="player_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Players</FormLabel>
                  <div className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-2">
                    {players.map(player => (
                      <FormField
                        key={player.id}
                        control={form.control}
                        name="player_ids"
                        render={({ field }) => {
                          const playerId = String(player.id)
                          return (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  id={`pod-player-${playerId}`}
                                  checked={field.value.includes(playerId)}
                                  onChange={event =>
                                    field.onChange(
                                      event.target.checked
                                        ? [...field.value, playerId]
                                        : field.value.filter(
                                            id => id !== playerId
                                          )
                                    )
                                  }
                                  disabled={
                                    playersLoading || createPod.isPending
                                  }
                                  className="h-4 w-4 rounded border-primary accent-primary"
                                />
                              </FormControl>
                              <label
                                htmlFor={`pod-player-${playerId}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {player.name}
                              </label>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    {!playersLoading && players.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add a player before creating a pod.
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                playersLoading || createPod.isPending || players.length === 0
              }
            >
              {createPod.isPending ? 'Creating...' : 'Create Pod'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
