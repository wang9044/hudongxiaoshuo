import { supabase, Novel } from '@/lib/supabase'
import RankingClient from './RankingClient'

async function getNovels(): Promise<Novel[]> {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching novels:', error)
    return []
  }
  return data ?? []
}

export default async function RankingPage() {
  const novels = await getNovels()
  return <RankingClient novels={novels} />
}
