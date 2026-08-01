import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { usePodMutations } from '@/hooks/usePodMutations'
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

const emptyPod: PodFormData = { name: '' }

export const PodManagementForm = () => {
  const form = useForm<PodFormData>({
    resolver: zodResolver(podFormSchema),
    defaultValues: emptyPod,
  })
  const { createPod } = usePodMutations()

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
        <CardDescription>Add a new pod for games and standings</CardDescription>
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

            <Button
              type="submit"
              className="w-full"
              disabled={createPod.isPending}
            >
              {createPod.isPending ? 'Creating...' : 'Create Pod'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
