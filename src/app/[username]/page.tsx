'use client'
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import ListView2 from "@/components/ListView2";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { type Book } from "@/lib/rssParser";
import ListView from "@/components/ListView";

export default function BookshelfPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const username = typeof params.username === 'string' ? params.username : '';

  const [profile, setProfile] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnBookshelf, setIsOwnBookshelf] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [user, authLoading, username, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", username.toLowerCase())
        .single();

      if (!profileData) {
        notFound();
        return;
      }

      setProfile(profileData);

      // Check if this is the user's own bookshelf
      const ownBookshelf = user.id === profileData.id;
      setIsOwnBookshelf(ownBookshelf);

      // Fetch cached books
      const { data: cachedData } = await supabase
        .from("cached_books")
        .select("book_data, last_synced")
        .eq("user_id", profileData.id)
        .single();

      const booksData = cachedData?.book_data || [];
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading profile:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-16 border-b border-muted flex justify-between items-center px-8 z-10">
          <h1 className="text-lg font-semibold">{username}'s bookshelf</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return notFound();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* header */}
      <div className="min-h-16 border-b border-muted flex justify-between items-center px-8 z-10">
        <h1 className="text-lg font-semibold">{username}'s recent reading</h1>

        {isOwnBookshelf && (
          <Link
            href="/settings"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
          >
            Settings
          </Link>
        )}
      </div>
      {/* content */}
      <ScrollArea.Root className="min-h-0 flex-1">
        <ScrollArea.Viewport className="h-full overscroll-contain">
          <ListView books={books} />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
}
