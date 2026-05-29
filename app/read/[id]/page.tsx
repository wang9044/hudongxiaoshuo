import { notFound } from 'next/navigation'
import { supabase, Novel, Scene } from '@/lib/supabase'
import ReaderClient from './ReaderClient'

async function getNovelAndScenes(id: string): Promise<{ novel: Novel; scenes: Scene[] } | null> {
  const [novelRes, scenesRes] = await Promise.all([
    supabase.from('novels').select('*').eq('id', id).single(),
    supabase.from('scenes').select('*').eq('novel_id', id).order('order_index', { ascending: true }),
  ])

  if (novelRes.error || !novelRes.data) return null
  return {
    novel: novelRes.data,
    scenes: scenesRes.data ?? [],
  }
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getNovelAndScenes(id)

  if (!result) {
    notFound()
  }

  return <ReaderClient novel={result.novel} scenes={result.scenes} />
}
