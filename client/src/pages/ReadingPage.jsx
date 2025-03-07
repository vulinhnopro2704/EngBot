"use client"

import { useState } from "react"
import { Bookmark, Share2, ThumbsUp, MessageSquare, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const ReadingPage = () => {
  const [activeTab, setActiveTab] = useState("articles")
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const readingTypes = [
    { id: "articles", name: "Articles" },
    { id: "stories", name: "Short Stories" },
    { id: "news", name: "News" },
    { id: "science", name: "Science" },
    { id: "business", name: "Business" },
  ]

  const articles = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence",
      category: "Technology",
      level: "Intermediate",
      readTime: "5 min",
      image: "/placeholder.svg?height=200&width=400",
      excerpt:
        "Artificial Intelligence is transforming industries across the globe. From healthcare to finance, AI-powered solutions are enhancing efficiency and decision-making processes.",
      content: `
        <h2>The Rise of AI</h2>
        <p>Artificial Intelligence (AI) has made significant strides in recent years, transforming various industries and aspects of daily life. From healthcare to finance, AI-powered solutions are enhancing efficiency, accuracy, and decision-making processes.</p>
        
        <p>Machine learning, a subset of AI, enables computers to learn from data and improve their performance over time without being explicitly programmed. This capability has led to breakthroughs in image recognition, natural language processing, and predictive analytics.</p>
        
        <h2>Applications Across Industries</h2>
        <p>In healthcare, AI algorithms can analyze medical images to detect diseases like cancer with remarkable accuracy. They can also predict patient outcomes and help doctors make more informed treatment decisions.</p>
        
        <p>The financial sector uses AI for fraud detection, algorithmic trading, and personalized banking experiences. AI systems can analyze vast amounts of transaction data in real-time to identify suspicious activities that might indicate fraud.</p>
        
        <p>In transportation, self-driving cars represent one of the most visible applications of AI. Companies like Tesla, Waymo, and Uber are investing heavily in autonomous vehicle technology, which has the potential to revolutionize how we travel and reduce accidents caused by human error.</p>
        
        <h2>Ethical Considerations</h2>
        <p>As AI becomes more integrated into society, ethical considerations become increasingly important. Issues such as privacy, bias in algorithms, job displacement, and the potential for autonomous weapons raise complex questions that require thoughtful discussion and regulation.</p>
        
        <p>Ensuring that AI systems are transparent, fair, and accountable is crucial for building public trust and maximizing the benefits of this technology while minimizing potential harms.</p>
        
        <h2>The Future Outlook</h2>
        <p>The future of AI holds immense promise. Advances in deep learning, reinforcement learning, and neural networks continue to push the boundaries of what's possible. As computing power increases and algorithms become more sophisticated, AI will likely play an even greater role in solving complex problems and improving quality of life.</p>
        
        <p>However, realizing this potential will require collaboration between technologists, policymakers, ethicists, and the public to ensure that AI development aligns with human values and benefits humanity as a whole.</p>
      `,
      quiz: [
        {
          id: "q1",
          question: "What is a subset of AI mentioned in the article?",
          options: ["Deep learning", "Machine learning", "Neural networks", "Reinforcement learning"],
          correctAnswer: "Machine learning",
        },
        {
          id: "q2",
          question: "Which industry uses AI for fraud detection according to the article?",
          options: ["Healthcare", "Transportation", "Finance", "Education"],
          correctAnswer: "Finance",
        },
        {
          id: "q3",
          question: "What ethical consideration related to AI is NOT mentioned in the article?",
          options: ["Privacy", "Bias in algorithms", "Environmental impact", "Job displacement"],
          correctAnswer: "Environmental impact",
        },
      ],
    },
    {
      id: 2,
      title: "Sustainable Living in Urban Environments",
      category: "Environment",
      level: "Beginner",
      readTime: "4 min",
      image: "/placeholder.svg?height=200&width=400",
      excerpt:
        "As cities continue to grow, sustainable living practices become increasingly important. Learn how urban dwellers can reduce their environmental footprint.",
    },
    {
      id: 3,
      title: "The Psychology of Learning Languages",
      category: "Education",
      level: "Advanced",
      readTime: "7 min",
      image: "/placeholder.svg?height=200&width=400",
      excerpt:
        "Understanding the cognitive processes involved in language acquisition can help learners develop more effective study strategies.",
    },
  ]

  const handleArticleSelect = (article) => {
    setSelectedArticle(article)
    setReadingProgress(0)
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizSubmitted(false)

    // Scroll to top
    window.scrollTo(0, 0)
  }

  const handleScroll = (e) => {
    const element = e.target
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = (scrollTop / scrollHeight) * 100
    setReadingProgress(progress)

    // Show quiz when user reaches the end of the article
    if (progress > 90 && !showQuiz) {
      setShowQuiz(true)
    }
  }

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer,
    })
  }

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
  }

  const getQuizScore = () => {
    if (!selectedArticle || !quizSubmitted) return 0

    let correctCount = 0
    selectedArticle.quiz.forEach((question) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctCount++
      }
    })

    return Math.round((correctCount / selectedArticle.quiz.length) * 100)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Reading Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
            Improve your reading comprehension with articles on various topics
          </p>
        </motion.div>

        {/* Reading Types Tabs */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 transition-colors duration-200"
          variants={itemVariants}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {readingTypes.map((type) => (
              <motion.button
                key={type.id}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === type.id
                    ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(type.id)}
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
              >
                {type.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {selectedArticle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Article Content */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                {/* Reading Progress Bar */}
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 transition-colors duration-200">
                  <div
                    className="h-1 bg-emerald-500 dark:bg-emerald-400 transition-all duration-200"
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                      {selectedArticle.level}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                      {selectedArticle.category}
                    </span>
                    <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                    {selectedArticle.title}
                  </h2>

                  <img
                    src={selectedArticle.image || "/placeholder.svg"}
                    alt={selectedArticle.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />

                  <div className="flex justify-between mb-6">
                    <div className="flex space-x-3">
                      <motion.button
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Bookmark className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      <div className="flex items-center mr-3">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>24</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>8</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="prose dark:prose-invert max-w-none mb-8 transition-colors duration-200 overflow-y-auto max-h-[500px] pr-4"
                    onScroll={handleScroll}
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  ></div>

                  {/* Comprehension Quiz */}
                  {showQuiz && selectedArticle.quiz && (
                    <motion.div
                      className="border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                        Comprehension Quiz
                      </h3>

                      {!quizSubmitted ? (
                        <>
                          <div className="space-y-6 mb-6">
                            {selectedArticle.quiz.map((question, qIndex) => (
                              <div
                                key={question.id}
                                className="border dark:border-gray-700 rounded-lg p-4 transition-colors duration-200"
                              >
                                <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 transition-colors duration-200">
                                  {qIndex + 1}. {question.question}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {question.options.map((option, oIndex) => (
                                    <motion.button
                                      key={oIndex}
                                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                                        quizAnswers[question.id] === option
                                          ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                                      }`}
                                      onClick={() => handleQuizAnswer(question.id, option)}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {option}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end">
                            <motion.button
                              className="px-6 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                              onClick={handleQuizSubmit}
                              disabled={Object.keys(quizAnswers).length < selectedArticle.quiz.length}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Submit Answers
                            </motion.button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <div className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-4 transition-colors duration-200">
                            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
                            Quiz Completed!
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
                            Your score: {getQuizScore()}%
                          </p>
                          <motion.button
                            className="px-6 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                            onClick={() => {
                              setSelectedArticle(null)
                              window.scrollTo(0, 0)
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Back to Articles
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Vocabulary and Related Articles */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-colors duration-200">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                  Key Vocabulary
                </h3>
                <ul className="space-y-3">
                  <li className="border-b dark:border-gray-700 pb-2 transition-colors duration-200">
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      algorithm
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      a process or set of rules to be followed in calculations or other problem-solving operations
                    </p>
                  </li>
                  <li className="border-b dark:border-gray-700 pb-2 transition-colors duration-200">
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      autonomous
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      having the freedom to act independently
                    </p>
                  </li>
                  <li className="border-b dark:border-gray-700 pb-2 transition-colors duration-200">
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      ethical
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      relating to moral principles or the branch of knowledge dealing with these
                    </p>
                  </li>
                  <li className="border-b dark:border-gray-700 pb-2 transition-colors duration-200">
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      integration
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      the action or process of combining things to form a whole
                    </p>
                  </li>
                  <li>
                    <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      sophisticated
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      having, revealing, or involving a great deal of worldly experience and knowledge
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {articles
                    .filter((a) => a.id !== selectedArticle.id)
                    .map((article) => (
                      <motion.div
                        key={article.id}
                        className="flex items-start cursor-pointer"
                        onClick={() => handleArticleSelect(article)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1 transition-colors duration-200">
                            {article.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <span className="mr-2">{article.category}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {article.readTime}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
            {articles.map((article) => (
              <motion.div
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                onClick={() => handleArticleSelect(article)}
              >
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                      {article.level}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium rounded transition-colors duration-200">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 transition-colors duration-200">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </span>
                    <motion.button
                      className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default ReadingPage

