"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import { Plus, Filter, Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import PageTransition from "../components/PageTransition"
import BlogPostCard from "../components/blog/BlogPostCard"
import BlogCategoriesSidebar from "../components/blog/BlogCategoriesSidebar"
import BlogPopularPosts from "../components/blog/BlogPopularPosts"
import BlogFeaturedAuthors from "../components/blog/BlogFeaturedAuthors"

// Sample blog posts data
const SAMPLE_BLOG_POSTS = [
  {
    id: 1,
    title: "10 Common English Phrasal Verbs You Should Know",
    excerpt:
      "Phrasal verbs can be challenging for English learners. Here are 10 common ones that will help improve your everyday conversations.",
    content:
      "Phrasal verbs are combinations of words that are used as a single verb, but their meaning is different from the meanings of the individual words combined. They are very common in everyday English.\n\n## 1. Break down\n\nMeaning: To stop functioning (for machines); to lose control of your emotions and cry.\n\nExamples:\n- My car broke down on the highway yesterday.\n- She broke down when she heard the sad news.\n\n## 2. Bring up\n\nMeaning: To mention a topic; to raise a child.\n\nExamples:\n- I didn't want to bring up the issue during dinner.\n- He was brought up by his grandparents.\n\n## 3. Call off\n\nMeaning: To cancel.\n\nExample:\n- The outdoor concert was called off due to rain.\n\n## 4. Figure out\n\nMeaning: To understand, to find the answer.\n\nExample:\n- I can't figure out how to solve this math problem.\n\n## 5. Give up\n\nMeaning: To stop trying, to surrender.\n\nExample:\n- Don't give up on your dreams.\n\n## 6. Look after\n\nMeaning: To take care of.\n\nExample:\n- Can you look after my dog while I'm away?\n\n## 7. Look forward to\n\nMeaning: To be excited about something in the future.\n\nExample:\n- I'm looking forward to meeting you next week.\n\n## 8. Run into\n\nMeaning: To meet by chance.\n\nExample:\n- I ran into my old friend at the supermarket.\n\n## 9. Turn down\n\nMeaning: To reject; to reduce the volume.\n\nExamples:\n- She turned down the job offer.\n- Please turn down the music.\n\n## 10. Work out\n\nMeaning: To exercise; to find a solution.\n\nExamples:\n- I work out at the gym three times a week.\n- We need to work out our differences.\n\nPractice using these phrasal verbs in your daily conversations to sound more natural in English!",
    author: {
      id: 101,
      name: "Emily Chen",
      username: "emilyc",
      avatar: null,
      role: "English Teacher",
    },
    category: "Vocabulary",
    tags: ["phrasal verbs", "vocabulary", "speaking"],
    coverImage: "/placeholder.svg?height=400&width=800",
    readTime: "5 min read",
    likes: 124,
    comments: 32,
    shares: 18,
    createdAt: "2023-03-10T14:28:00.000Z",
    featured: true,
  },
  {
    id: 2,
    title: "How to Improve Your English Pronunciation",
    excerpt:
      "Pronunciation is key to being understood. Learn these techniques to sound more like a native English speaker.",
    content:
      "Good pronunciation is essential for effective communication in English. Even if your grammar and vocabulary are excellent, poor pronunciation can make it difficult for others to understand you.\n\n## Why Pronunciation Matters\n\nPronunciation is the way in which a word or a language is spoken. This may refer to generally agreed-upon sequences of sounds used in speaking a given word or language in a specific dialect, or simply the way a particular individual speaks a word or language.\n\n## Common Pronunciation Challenges\n\nDepending on your native language, you might find certain English sounds challenging. For example:\n\n- The 'th' sound (as in 'think' or 'this')\n- The difference between 'r' and 'l'\n- Vowel sounds like the difference between 'ship' and 'sheep'\n- Word stress and sentence intonation\n\n## Effective Techniques to Improve\n\n### 1. Listen and Repeat\n\nListen to native speakers and repeat what they say. Pay attention to how they form sounds and try to mimic them.\n\n### 2. Record Yourself\n\nRecord yourself speaking and compare it with native speakers. This helps you identify areas for improvement.\n\n### 3. Learn Phonetics\n\nUnderstanding the International Phonetic Alphabet (IPA) can help you visualize sounds and understand pronunciation guides in dictionaries.\n\n### 4. Practice Minimal Pairs\n\nMinimal pairs are words that differ by only one sound, like 'ship' and 'sheep' or 'light' and 'right'. Practicing these helps train your ear and mouth.\n\n### 5. Use Pronunciation Apps\n\nThere are many apps designed specifically for pronunciation practice that provide feedback on your speech.\n\n### 6. Shadow Native Speakers\n\nShadowing involves listening to a native speaker and repeating what they say in real-time, mimicking their rhythm and intonation.\n\n### 7. Focus on Stress and Intonation\n\nEnglish is a stress-timed language, meaning certain syllables and words are emphasized. Learning proper stress patterns is crucial for natural-sounding speech.\n\n## Practice Regularly\n\nLike any skill, pronunciation improves with consistent practice. Set aside time each day to work on specific sounds or patterns.\n\nRemember, the goal isn't necessarily to eliminate your accent completely, but to pronounce words clearly so that others can understand you easily.",
    author: {
      id: 102,
      name: "James Wilson",
      username: "jamesw",
      avatar: null,
      role: "Pronunciation Coach",
    },
    category: "Pronunciation",
    tags: ["pronunciation", "speaking", "accent"],
    coverImage: "/placeholder.svg?height=400&width=800",
    readTime: "8 min read",
    likes: 98,
    comments: 27,
    shares: 15,
    createdAt: "2023-03-08T09:15:00.000Z",
    featured: true,
  },
  {
    id: 3,
    title: "IELTS Writing Task 2: How to Structure Your Essay",
    excerpt: "Learn the perfect structure for IELTS Writing Task 2 essays to improve your band score.",
    content:
      'The IELTS Writing Task 2 requires you to write an academic-style essay on a common topic. You\'ll have 40 minutes to write at least 250 words. Your essay will be judged on your ability to organize ideas, present a position throughout the response, support your ideas with evidence, and use language accurately.\n\n## Understanding the Task\n\nBefore you start writing, make sure you understand what the question is asking. IELTS Writing Task 2 questions generally fall into these types:\n\n- Opinion (Do you agree or disagree?)\n- Discussion (Discuss both views and give your opinion)\n- Advantage/Disadvantage\n- Problem/Solution\n- Two-part questions\n\n## The Perfect Essay Structure\n\n### Introduction (40-50 words)\n\nYour introduction should:\n\n1. Paraphrase the question (restate the topic in your own words)\n2. State your position clearly (if asked for your opinion)\n3. Outline what your essay will cover (optional)\n\nExample:\n"In recent years, there has been a growing debate about whether children should learn a foreign language in primary school. While some argue that it places unnecessary pressure on young learners, I believe that early language education offers significant benefits that outweigh the challenges."\n\n### Body Paragraph 1 (80-100 words)\n\nYour first body paragraph should:\n\n1. Start with a clear topic sentence that states your first main point\n2. Explain your point in detail\n3. Provide specific examples or evidence\n4. Link back to the question\n\n### Body Paragraph 2 (80-100 words)\n\nFollow the same structure as the first body paragraph but focus on your second main point.\n\n### Conclusion (30-40 words)\n\nYour conclusion should:\n\n1. Summarize your main points\n2. Restate your position\n3. Provide a final thought or recommendation (optional)\n\nExample:\n"In conclusion, while introducing foreign languages in primary education presents certain challenges, the cognitive benefits and increased cultural awareness make it a worthwhile addition to the curriculum. Educational authorities should focus on making language learning engaging and age-appropriate rather than avoiding it altogether."\n\n## Key Tips for Success\n\n- Plan your essay before you start writing\n- Use a variety of sentence structures\n- Include topic sentences for each paragraph\n- Use linking words to connect ideas (however, furthermore, in addition)\n- Support your points with examples\n- Check your work for grammar and spelling errors\n\nRemember, the examiner is looking for clear organization, relevant ideas, and accurate language use. With practice and the right structure, you can improve your IELTS Writing Task 2 score significantly.',
    author: {
      id: 103,
      name: "Sofia Martinez",
      username: "sofiam",
      avatar: null,
      role: "IELTS Examiner",
    },
    category: "IELTS Preparation",
    tags: ["IELTS", "writing", "essay structure"],
    coverImage: "/placeholder.svg?height=400&width=800",
    readTime: "10 min read",
    likes: 156,
    comments: 45,
    shares: 62,
    createdAt: "2023-03-05T16:42:00.000Z",
    featured: false,
  },
  {
    id: 4,
    title: "5 English Idioms About Time and Their Origins",
    excerpt: "Discover the fascinating origins of common English idioms related to time and how to use them correctly.",
    content:
      'English idioms add color and nuance to the language, but they can be confusing for learners. In this post, we\'ll explore five common idioms related to time, their meanings, and their interesting historical origins.\n\n## 1. "In the Nick of Time"\n\n**Meaning:** Just before it\'s too late; at the last possible moment.\n\n**Example:** "The ambulance arrived in the nick of time – a few minutes later would have been too late."\n\n**Origin:** This phrase dates back to the 1600s. A \'nick\' was a precise mark or notch on a tally stick used for keeping time. So, doing something \'in the nick of time\' meant doing it at the precise moment.\n\n## 2. "Beat the Clock"\n\n**Meaning:** To finish something before a deadline; to accomplish something faster than expected.\n\n**Example:** "We had to beat the clock to submit the proposal before the 5 PM deadline."\n\n**Origin:** This idiom gained popularity from a game show of the same name that aired in the 1950s, where contestants had to complete tasks before time ran out.\n\n## 3. "A Stitch in Time Saves Nine"\n\n**Meaning:** Taking care of a small problem now prevents it from becoming a bigger problem later.\n\n**Example:** "You should fix that small leak in the roof now. A stitch in time saves nine."\n\n**Origin:** This proverb comes from sewing. If you mend a small tear immediately (a stitch in time), you\'ll prevent it from getting bigger and requiring more stitches later (saves nine).\n\n## 4. "Around the Clock"\n\n**Meaning:** All day and all night; continuously for 24 hours.\n\n**Example:** "The emergency response team worked around the clock to help victims of the flood."\n\n**Origin:** This phrase became popular in the mid-20th century, referring to the face of a clock and the continuous movement of its hands through all hours of the day.\n\n## 5. "Eleventh Hour"\n\n**Meaning:** At the last possible moment; almost too late.\n\n**Example:** "They reached an agreement at the eleventh hour, just before the contract was set to expire."\n\n**Origin:** This idiom comes from the Bible, specifically the Parable of the Workers in the Vineyard (Matthew 20:1-16), where workers who were hired at the "eleventh hour" (just before the end of the workday) received the same pay as those who had worked all day.\n\n## How to Use Time Idioms Naturally\n\nTo use these idioms effectively:\n\n1. Understand the complete meaning and connotation\n2. Pay attention to how native speakers use them in context\n3. Practice using them in appropriate situations\n4. Be aware that idioms are often used in informal rather than formal communication\n\nMastering idioms like these will make your English sound more natural and help you better understand native speakers in everyday conversations.',
    author: {
      id: 104,
      name: "Ahmed Hassan",
      username: "ahmedh",
      avatar: null,
      role: "Linguist",
    },
    category: "Idioms & Phrases",
    tags: ["idioms", "vocabulary", "expressions"],
    coverImage: "/placeholder.svg?height=400&width=800",
    readTime: "7 min read",
    likes: 87,
    comments: 19,
    shares: 24,
    createdAt: "2023-03-03T11:20:00.000Z",
    featured: false,
  },
  {
    id: 5,
    title: "How I Improved My English Listening Skills in 3 Months",
    excerpt:
      "A personal journey of overcoming listening comprehension challenges with practical tips you can apply today.",
    content:
      "When I moved to the United States for my studies, I thought my English was pretty good. I had studied it for years, could read academic texts, and write decent essays. But then reality hit me: I could barely understand what people were saying in natural conversations. Fast food orders, casual chats, and even lectures were a struggle. Here's how I transformed my listening skills in just three months.\n\n## The Challenge\n\nLike many English learners, I faced several listening obstacles:\n\n- Native speakers talked much faster than I expected\n- They used contractions, slang, and idioms I wasn't familiar with\n- Different accents made comprehension even harder\n- Background noise in real-life situations added another layer of difficulty\n\n## My 3-Month Plan\n\n### Month 1: Building a Foundation\n\n**Daily Routine:**\n- 20 minutes of podcast listening (at normal speed)\n- 15 minutes of targeted listening exercises focusing on contractions and reductions\n- Watching one TV show episode with subtitles\n\n**Key Strategy:** During this month, I focused on identifying words I couldn't catch. I would listen to short clips repeatedly until I could transcribe them accurately.\n\n**Breakthrough Moment:** After three weeks, I realized I was starting to automatically recognize contractions like \"gonna,\" \"wanna,\" and \"coulda\" without having to mentally translate them.\n\n### Month 2: Increasing Difficulty\n\n**Daily Routine:**\n- 30 minutes of podcast listening (slightly faster than normal speed)\n- Watching TV shows with subtitles in English (not my native language)\n- Participating in language exchange calls twice a week\n\n**Key Strategy:** I started shadowing - listening to audio and repeating it aloud immediately, mimicking not just the words but the intonation and rhythm.\n\n**Breakthrough Moment:** During a call with a native speaker, I realized I was following the conversation without mentally translating or asking them to repeat themselves.\n\n### Month 3: Real-World Application\n\n**Daily Routine:**\n- Watching TV shows and YouTube videos without subtitles\n- Listening to podcasts at 1.25x speed\n- Engaging in group conversations with native speakers\n\n**Key Strategy:** I deliberately put myself in challenging listening situations - noisy cafés, group discussions, and phone calls.\n\n**Breakthrough Moment:** I attended a lecture and took notes successfully, understanding about 95% of the content without struggle.\n\n## Specific Techniques That Helped Most\n\n1. **Dictation practice:** Transcribing short audio clips word-for-word improved my ability to distinguish sounds and words.\n\n2. **Focused listening:** Instead of passive listening, I actively looked for specific features (contractions, linking, etc.).\n\n3. **Diverse accents:** Exposing myself to different English accents (American, British, Australian, etc.) built flexibility in my listening skills.\n\n4. **Listening journals:** I kept track of new expressions I heard and reviewed them regularly.\n\n5. **Audiobooks with text:** Following the text while listening helped me connect the written and spoken forms of words.\n\n## Results After 3 Months\n\n- I could follow most conversations without asking people to repeat themselves\n- Phone calls were no longer anxiety-inducing\n- I started to catch humor and subtle meanings\n- I could distinguish between similar-sounding words\n- Background noise became less of an obstacle\n\n## Tips for Your Listening Journey\n\n- **Be consistent:** Daily practice, even just 15 minutes, is more effective than occasional long sessions.\n- **Embrace discomfort:** If listening is always easy, you're not challenging yourself enough.\n- **Use authentic materials:** Textbook audio is too perfect. Real-world content prepares you for real-world listening.\n- **Be patient:** Progress isn't linear. Some days will be better than others.\n\nRemember that listening improvement happens gradually, often without you noticing. Trust the process, stay consistent, and you'll surprise yourself with how much your comprehension improves.",
    author: {
      id: 105,
      name: "Mei Lin",
      username: "meilin",
      avatar: null,
      role: "Language Learner",
    },
    category: "Learning Experience",
    tags: ["listening", "personal story", "study tips"],
    coverImage: "/placeholder.svg?height=400&width=800",
    readTime: "9 min read",
    likes: 215,
    comments: 64,
    shares: 78,
    createdAt: "2023-02-28T08:45:00.000Z",
    featured: false,
  },
]

const BlogPage = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "vocabulary", label: "Vocabulary" },
    { value: "grammar-tips", label: "Grammar Tips" },
    { value: "pronunciation", label: "Pronunciation" },
    { value: "ielts-preparation", label: "IELTS Preparation" },
    { value: "idioms-phrases", label: "Idioms & Phrases" },
    { value: "learning-experience", label: "Learning Experience" },
  ]

  // Simulate loading posts from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(SAMPLE_BLOG_POSTS)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter posts based on search query and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    const matchesCategory =
      categoryFilter === "all" || post.category.toLowerCase().replace(/\s+/g, "-") === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Sort posts based on filter
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "popular") {
      return b.likes + b.comments - (a.likes + a.comments)
    } else if (sortBy === "most-commented") {
      return b.comments - a.comments
    }
    return 0
  })

  // Get featured posts
  const featuredPosts = posts.filter((post) => post.featured)

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        {/* Blog Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                English Learning Blog
              </motion.h1>
              <motion.p
                className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Explore articles, tips, and stories to enhance your English learning journey
              </motion.p>
            </div>

            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate("/blog/create")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>

          {/* Featured Posts Slider */}
          {!loading && featuredPosts.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-200 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredPosts.slice(0, 2).map((post) => (
                  <motion.div
                    key={post.id}
                    className="relative rounded-xl overflow-hidden h-64 group cursor-pointer"
                    onClick={() => navigate(`/blog/post/${post.id}`)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 p-4">
                        <Badge className="mb-2 bg-emerald-500 hover:bg-emerald-600 text-white">{post.category}</Badge>
                        <h3 className="text-xl font-bold text-white mb-1">{post.title}</h3>
                        <p className="text-gray-200 text-sm line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-300">By {post.author.name}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-xs text-gray-300">{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
                  />
                </div>
              </div>

              <BlogCategoriesSidebar
                categories={categories}
                activeCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />

              <BlogPopularPosts posts={posts.slice(0, 3)} />

              <BlogFeaturedAuthors authors={posts.map((post) => post.author).slice(0, 4)} />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    Filter Articles
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Mobile Search */}
                  <div className="relative lg:hidden">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
                    />
                  </div>

                  {/* Mobile Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter} className="lg:hidden">
                    <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="most-commented">Most Commented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
                <TabsTrigger value="grammar">Grammar</TabsTrigger>
                <TabsTrigger value="ielts">IELTS</TabsTrigger>
                <TabsTrigger value="experiences">Experiences</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                      >
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sortedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors duration-200">
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      No posts found matching your criteria.
                    </p>
                    <Button
                      onClick={() => {
                        setCategoryFilter("all")
                        setSearchQuery("")
                        setSortBy("latest")
                      }}
                      variant="link"
                      className="mt-2 text-emerald-600 dark:text-emerald-400 transition-colors duration-200"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="vocabulary" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                      >
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedPosts
                      .filter((post) => post.category === "Vocabulary" || post.tags.includes("vocabulary"))
                      .map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="grammar" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                      >
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedPosts
                      .filter((post) => post.category === "Grammar Tips" || post.tags.includes("grammar"))
                      .map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ielts" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                      >
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedPosts
                      .filter((post) => post.category === "IELTS Preparation" || post.tags.includes("IELTS"))
                      .map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="experiences" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                      >
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedPosts
                      .filter((post) => post.category === "Learning Experience" || post.tags.includes("personal story"))
                      .map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default BlogPage

