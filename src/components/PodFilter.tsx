import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Filter } from 'lucide-react'
import { POD_FILTER } from '@/constants/config'

export interface PodOption {
  name: string
  playerCount: number
}

interface PodFilterProps {
  pods: (string | PodOption)[]
  selectedPod: string
  onPodChange: (pod: string) => void
  isLoading: boolean
  allPodsValue?: string
  showAllPods?: boolean
}

const PodFilter = ({
  pods,
  selectedPod,
  onPodChange,
  isLoading,
  allPodsValue,
  showAllPods = false,
}: PodFilterProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
    )
  }

  const normalizedPods: PodOption[] = pods.map(pod =>
    typeof pod === 'string' ? { name: pod, playerCount: 0 } : pod
  )

  const hasAllPodsEntry =
    allPodsValue && normalizedPods.some(p => p.name === allPodsValue)

  return (
    <div className="flex items-center gap-3">
      <Filter className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedPod} onValueChange={onPodChange}>
        <SelectTrigger className="w-[200px] sm:w-[250px] bg-card border-primary/30 focus:ring-primary">
          <SelectValue placeholder="Select a pod" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {showAllPods && (
            <SelectItem
              value={POD_FILTER.ALL_PODS}
              className="focus:bg-primary/20 focus:text-foreground"
            >
              All Pods
            </SelectItem>
          )}
          {normalizedPods.map(pod => {
            const isAllPodsItem = allPodsValue && pod.name === allPodsValue
            const label = isAllPodsItem
              ? 'All Pods'
              : pod.playerCount > 0
                ? `${pod.name} (${pod.playerCount})`
                : pod.name

            return (
              <SelectItem
                key={pod.name}
                value={pod.name}
                className="focus:bg-primary/20 focus:text-foreground"
              >
                {label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PodFilter
