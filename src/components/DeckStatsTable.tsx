import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeckStatsEntry } from "@/data/mockData";

interface DeckStatsTableProps {
  data: DeckStatsEntry[];
  isLoading: boolean;
}

const DeckStatsTable = ({ data, isLoading }: DeckStatsTableProps) => {
  if (isLoading) {
    return (
      <Card className="glow-purple">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glow-purple border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Deck Statistics
        </CardTitle>
        <CardDescription>
          All decks ranked by win rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Deck</TableHead>
                <TableHead className="hidden sm:table-cell">Owner</TableHead>
                <TableHead className="text-center hidden md:table-cell">Games</TableHead>
                <TableHead className="text-center hidden md:table-cell">Wins</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((deck, index) => (
                <TableRow
                  key={`${deck.deck_name}-${deck.owner_name}`}
                  className={cn(
                    "transition-colors",
                    index === 0 && "bg-[hsl(var(--gold)/0.1)]"
                  )}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-medium",
                          index === 0 && "text-gold"
                        )}
                      >
                        {deck.deck_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {deck.commander_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {deck.owner_name}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {deck.games_played}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {deck.wins}
                  </TableCell>
                  <TableCell className="text-right">
                  <span
                      className={cn(
                        "font-semibold",
                        deck.win_rate >= 60
                          ? "text-emerald-400"
                          : deck.win_rate >= 40
                          ? "text-amber-400"
                          : "text-rose-400"
                      )}
                    >
                      {deck.win_rate.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckStatsTable;
