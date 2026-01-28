import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface PlaneswalkerAvatarProps {
  avatarUrl: string | null
  name: string
  className?: string
  isFirstPlace?: boolean
}

const PlaneswalkerAvatar = ({
  avatarUrl,
  name,
  className,
  isFirstPlace = false,
}: PlaneswalkerAvatarProps) => {
  return (
    <Avatar
      className={cn(
        'border-2 border-border',
        isFirstPlace && 'border-[hsl(var(--gold))] glow-gold',
        className
      )}
    >
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
      <AvatarFallback className="bg-muted">
        {/* Planeswalker silhouette SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-primary"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Hooded figure silhouette */}
          <path
            d="M12 2C9.5 2 8 4 8 6.5C8 9 9.5 11 12 11C14.5 11 16 9 16 6.5C16 4 14.5 2 12 2Z"
            fill="currentColor"
          />
          <path
            d="M6 22V18C6 15.5 8 13 12 13C16 13 18 15.5 18 18V22"
            fill="currentColor"
          />
          {/* Mystical hood/cloak detail */}
          <path d="M4 22L8 15M20 22L16 15" strokeLinecap="round" />
          {/* Spark symbol */}
          <path
            d="M12 7L12.5 5.5L14 6L12.5 6.5L12 8L11.5 6.5L10 6L11.5 5.5L12 7Z"
            fill="hsl(var(--purple-glow))"
            stroke="none"
          />
        </svg>
      </AvatarFallback>
    </Avatar>
  )
}

export default PlaneswalkerAvatar
