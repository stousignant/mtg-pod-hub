import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConnected } from "@/lib/supabaseClient";
import {
  mockPodLeaderboard,
  getUniquePods,
  filterByPod,
  type PodLeaderboardEntry,
} from "@/data/mockData";

export const useLeaderboard = (selectedPod?: string) => {
  return useQuery({
    queryKey: ["pod_leaderboard", selectedPod],
    queryFn: async (): Promise<PodLeaderboardEntry[]> => {
      if (isSupabaseConnected() && supabase) {
        let query = supabase.from("pod_leaderboard").select("*");
        
        if (selectedPod) {
          query = query.eq("pod_name", selectedPod);
        }
        
        const { data, error } = await query.order("points", { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data || [];
      }
      
      // Use mock data when Supabase is not connected
      if (selectedPod) {
        return filterByPod(mockPodLeaderboard, selectedPod);
      }
      return mockPodLeaderboard.sort((a, b) => b.points - a.points);
    },
  });
};

export const usePodNames = () => {
  return useQuery({
    queryKey: ["pod_names"],
    queryFn: async (): Promise<string[]> => {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase
          .from("pod_leaderboard")
          .select("pod_name");
        
        if (error) {
          throw new Error(error.message);
        }
        
        return [...new Set((data || []).map((d) => d.pod_name))];
      }
      
      // Use mock data when Supabase is not connected
      return getUniquePods(mockPodLeaderboard);
    },
  });
};
