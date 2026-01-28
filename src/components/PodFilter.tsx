import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Filter } from 'lucide-react'

interface PodFilterProps {
  pods: string[]
  selectedPod: string
  onPodChange: (pod: string) => void
  isLoading: boolean
}

const PodFilter = ({
  pods,
  selectedPod,
  onPodChange,
  isLoading,
}: PodFilterProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Filter className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedPod} onValueChange={onPodChange}>
        <SelectTrigger className="w-[200px] sm:w-[250px] bg-card border-primary/30 focus:ring-primary">
          <SelectValue placeholder="Select a pod" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {pods.map(pod => (
            <SelectItem
              key={pod}
              value={pod}
              className="focus:bg-primary/20 focus:text-foreground"
            >
              {pod}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PodFilter
