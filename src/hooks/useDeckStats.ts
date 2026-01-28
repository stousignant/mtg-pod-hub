import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConnected } from "@/lib/supabaseClient";
import { mockDeckStats, type DeckStatsEntry } from "@/data/mockData";

export const useDeckStats = () => {
  return useQuery({
    queryKey: ["deck_stats"],
    queryFn: async (): Promise<DeckStatsEntry[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from("deck_stats")
          .select("*")
          .order("win_rate", { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data || [];
      }
      
      // Use mock data when Supabase is not connected
      return [...mockDeckStats].sort((a, b) => b.win_rate - a.win_rate);
    },
  });
};
