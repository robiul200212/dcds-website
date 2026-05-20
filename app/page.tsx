import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { AboutSection } from '@/components/home/AboutSection'
import { AchievementsSection } from '@/components/home/AchievementsSection'
import { ECShowcase } from '@/components/home/ECShowcase'
import { SpeechesSection } from '@/components/home/SpeechesSection'
import { EventsSection } from '@/components/home/EventsSection'
import { NewsSection } from '@/components/home/NewsSection'
import { NoticeSection } from '@/components/home/NoticeSection'
import { WhyJoinSection } from '@/components/home/WhyJoinSection'
import { ContactCTA } from '@/components/home/ContactCTA'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: ecMembers },
    { data: speeches },
    { data: achievements },
    { data: events },
    { data: articles },
    { data: notices },
  ] = await Promise.all([
    supabase.from('executive_body').select('*').eq('is_active', true).order('display_order').limit(8),
    supabase.from('speeches').select('*').eq('is_active', true).order('display_order'),
    supabase.from('achievements').select('*').eq('is_featured', true).order('display_order').limit(6),
    supabase.from('events').select('*').eq('is_published', true).eq('is_featured', true).order('start_date', { ascending: false }).limit(4),
    supabase.from('articles').select('id,title,slug,excerpt,cover_image_url,category,published_at,author_id').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('notices').select('*').eq('is_published', true).order('pinned', { ascending: false }).order('published_at', { ascending: false }).limit(5),
  ])

  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <AchievementsSection achievements={achievements ?? []} />
      <ECShowcase members={ecMembers ?? []} />
      <SpeechesSection speeches={speeches ?? []} />
      <EventsSection events={events ?? []} />
      <NoticeSection notices={notices ?? []} />
      <NewsSection articles={articles ?? []} />
      <WhyJoinSection />
      <ContactCTA />
    </>
  )
}
