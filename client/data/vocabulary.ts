import type { VocabularyWord, WordType } from "@/data/types"

// Vocabulary data organized by course and lesson
const vocabularyData: Record<string, VocabularyWord[]> = {
  // Beginner Vocabulary
  "1-1": [
    // Course 1, Lesson 1: Greetings and Introductions
    {
      id: 1,
      word: "hello",
      definition: "Used as a greeting or to begin a phone conversation",
      definitionVi: "Dùng để chào hỏi hoặc bắt đầu cuộc trò chuyện qua điện thoại",
      phonetic: "/həˈloʊ/",
      example: "Hello, how are you today?",
      exampleVi: "Xin chào, hôm nay bạn khỏe không?",
      wordType: "interjection",
      imageUrl: "/placeholder.svg?height=200&width=200&text=hello",
      relatedWords: ["hi", "greetings", "good morning"],
      isFavorite: false,
    },
    {
      id: 2,
      word: "goodbye",
      definition: "Used when leaving or ending a conversation",
      definitionVi: "Dùng khi rời đi hoặc kết thúc cuộc trò chuyện",
      phonetic: "/ˌɡʊdˈbaɪ/",
      example: "I have to go now, goodbye!",
      exampleVi: "Tôi phải đi bây giờ, tạm biệt!",
      wordType: "interjection",
      imageUrl: "/placeholder.svg?height=200&width=200&text=goodbye",
      relatedWords: ["bye", "farewell", "see you"],
      isFavorite: false,
    },
    {
      id: 3,
      word: "please",
      definition: "Used as a polite way of asking for something",
      definitionVi: "Dùng như một cách lịch sự để yêu cầu điều gì đó",
      phonetic: "/pliz/",
      example: "Could I have some water, please?",
      exampleVi: "Tôi có thể xin chút nước được không, làm ơn?",
      wordType: "adverb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=please",
      relatedWords: ["kindly", "politely", "thank you"],
      isFavorite: false,
    },
    {
      id: 4,
      word: "thank you",
      definition: "Used to express gratitude",
      definitionVi: "Dùng để bày tỏ lòng biết ơn",
      phonetic: "/ˈθæŋk ju/",
      example: "Thank you for your help.",
      exampleVi: "Cảm ơn bạn vì sự giúp đỡ.",
      wordType: "phrase",
      imageUrl: "/placeholder.svg?height=200&width=200&text=thank+you",
      relatedWords: ["thanks", "grateful", "appreciation"],
      isFavorite: false,
    },
    {
      id: 5,
      word: "welcome",
      definition: "Used as a greeting to someone arriving",
      definitionVi: "Dùng như lời chào đón ai đó khi họ đến",
      phonetic: "/ˈwɛlkəm/",
      example: "Welcome to our home!",
      exampleVi: "Chào mừng đến nhà chúng tôi!",
      wordType: "interjection",
      imageUrl: "/placeholder.svg?height=200&width=200&text=welcome",
      relatedWords: ["greetings", "reception", "hospitality"],
      isFavorite: false,
    },
    {
      id: 6,
      word: "introduce",
      definition: "To present someone by name to another person",
      definitionVi: "Giới thiệu ai đó bằng tên với người khác",
      phonetic: "/ˌɪntrəˈdus/",
      example: "Let me introduce you to my friend.",
      exampleVi: "Hãy để tôi giới thiệu bạn với bạn của tôi.",
      wordType: "verb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=introduce",
      relatedWords: ["present", "acquaint", "introduction"],
      isFavorite: false,
    },
    {
      id: 7,
      word: "name",
      definition: "A word or words by which a person is known",
      definitionVi: "Một từ hoặc các từ mà một người được biết đến",
      phonetic: "/neɪm/",
      example: "My name is John.",
      exampleVi: "Tên tôi là John.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=name",
      relatedWords: ["title", "label", "identity"],
      isFavorite: false,
    },
    {
      id: 8,
      word: "meet",
      definition: "To come into the presence of someone for the first time",
      definitionVi: "Đến gặp ai đó lần đầu tiên",
      phonetic: "/mit/",
      example: "It's nice to meet you.",
      exampleVi: "Rất vui được gặp bạn.",
      wordType: "verb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=meet",
      relatedWords: ["encounter", "introduction", "greet"],
      isFavorite: false,
    },
    {
      id: 9,
      word: "friend",
      definition: "A person with whom one has a bond of mutual affection",
      definitionVi: "Một người mà bạn có mối quan hệ thân thiết",
      phonetic: "/frɛnd/",
      example: "She is my best friend.",
      exampleVi: "Cô ấy là bạn thân nhất của tôi.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=friend",
      relatedWords: ["companion", "buddy", "pal"],
      isFavorite: false,
    },
    {
      id: 10,
      word: "family",
      definition: "A group of people related by blood or marriage",
      definitionVi: "Một nhóm người có quan hệ huyết thống hoặc hôn nhân",
      phonetic: "/ˈfæməli/",
      example: "I have a large family with many cousins.",
      exampleVi: "Tôi có một gia đình lớn với nhiều anh em họ.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=family",
      relatedWords: ["relatives", "parents", "siblings"],
      isFavorite: false,
    },
  ],
  "1-2": [
    // Course 1, Lesson 2: Daily Activities
    {
      id: 1,
      word: "morning",
      definition: "The early part of the day",
      definitionVi: "Phần đầu của ngày",
      phonetic: "/ˈmɔrnɪŋ/",
      example: "I always eat breakfast in the morning.",
      exampleVi: "Tôi luôn ăn sáng vào buổi sáng.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=morning",
      relatedWords: ["dawn", "sunrise", "early"],
      isFavorite: false,
    },
    {
      id: 2,
      word: "afternoon",
      definition: "The time from noon until evening",
      definitionVi: "Thời gian từ trưa đến tối",
      phonetic: "/ˌæftərˈnun/",
      example: "We have a meeting this afternoon.",
      exampleVi: "Chúng tôi có một cuộc họp chiều nay.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=afternoon",
      relatedWords: ["noon", "midday", "post-lunch"],
      isFavorite: false,
    },
    {
      id: 3,
      word: "evening",
      definition: "The period of time at the end of the day",
      definitionVi: "Khoảng thời gian cuối ngày",
      phonetic: "/ˈivnɪŋ/",
      example: "I like to read in the evening.",
      exampleVi: "Tôi thích đọc sách vào buổi tối.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=evening",
      relatedWords: ["dusk", "sunset", "nightfall"],
      isFavorite: false,
    },
    {
      id: 4,
      word: "breakfast",
      definition: "The first meal of the day",
      definitionVi: "Bữa ăn đầu tiên trong ngày",
      phonetic: "/ˈbrɛkfəst/",
      example: "I had eggs for breakfast.",
      exampleVi: "Tôi đã ăn trứng cho bữa sáng.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=breakfast",
      relatedWords: ["meal", "morning", "food"],
      isFavorite: false,
    },
    {
      id: 5,
      word: "lunch",
      definition: "A meal eaten in the middle of the day",
      definitionVi: "Bữa ăn vào giữa ngày",
      phonetic: "/lʌntʃ/",
      example: "Let's have lunch together.",
      exampleVi: "Hãy cùng ăn trưa với nhau.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=lunch",
      relatedWords: ["meal", "noon", "midday"],
      isFavorite: false,
    },
    {
      id: 6,
      word: "dinner",
      definition: "The main meal of the day, typically in the evening",
      definitionVi: "Bữa ăn chính trong ngày, thường là vào buổi tối",
      phonetic: "/ˈdɪnər/",
      example: "We're having pasta for dinner.",
      exampleVi: "Chúng tôi đang ăn mì Ý cho bữa tối.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=dinner",
      relatedWords: ["meal", "supper", "evening"],
      isFavorite: false,
    },
    {
      id: 7,
      word: "work",
      definition: "Activity involving mental or physical effort",
      definitionVi: "Hoạt động liên quan đến nỗ lực tinh thần hoặc thể chất",
      phonetic: "/wɜrk/",
      example: "I go to work at 8 AM.",
      exampleVi: "Tôi đi làm lúc 8 giờ sáng.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=work",
      relatedWords: ["job", "employment", "labor"],
      isFavorite: false,
    },
    {
      id: 8,
      word: "study",
      definition: "The devotion of time and attention to gaining knowledge",
      definitionVi: "Dành thời gian và sự chú ý để thu thập kiến thức",
      phonetic: "/ˈstʌdi/",
      example: "I need to study for my exam.",
      exampleVi: "Tôi cần học cho kỳ thi của mình.",
      wordType: "verb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=study",
      relatedWords: ["learn", "education", "research"],
      isFavorite: false,
    },
    {
      id: 9,
      word: "sleep",
      definition: "A condition of body and mind in which consciousness is temporarily lost",
      definitionVi: "Trạng thái của cơ thể và tâm trí khi tạm thời mất ý thức",
      phonetic: "/slip/",
      example: "I usually sleep for eight hours each night.",
      exampleVi: "Tôi thường ngủ tám tiếng mỗi đêm.",
      wordType: "verb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=sleep",
      relatedWords: ["rest", "slumber", "nap"],
      isFavorite: false,
    },
    {
      id: 10,
      word: "exercise",
      definition: "Activity requiring physical effort, carried out to sustain health",
      definitionVi: "Hoạt động đòi hỏi nỗ lực thể chất, được thực hiện để duy trì sức khỏe",
      phonetic: "/ˈɛksərˌsaɪz/",
      example: "I do exercise every morning to stay healthy.",
      exampleVi: "Tôi tập thể dục mỗi sáng để giữ gìn sức khỏe.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=exercise",
      relatedWords: ["workout", "fitness", "training"],
      isFavorite: false,
    },
  ],
  // Add more lessons for other courses
  "2-1": [
    // Course 2, Lesson 1: Business English
    {
      id: 1,
      word: "meeting",
      definition: "An assembly of people for discussion or business",
      definitionVi: "Một cuộc họp của mọi người để thảo luận hoặc kinh doanh",
      phonetic: "/ˈmiːtɪŋ/",
      example: "We have a team meeting every Monday.",
      exampleVi: "Chúng tôi có cuộc họp nhóm vào mỗi thứ Hai.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=meeting",
      relatedWords: ["conference", "discussion", "assembly"],
      isFavorite: false,
    },
    {
      id: 2,
      word: "deadline",
      definition: "The latest time by which something should be completed",
      definitionVi: "Thời hạn cuối cùng mà một việc gì đó phải được hoàn thành",
      phonetic: "/ˈdɛdˌlaɪn/",
      example: "The deadline for this project is Friday.",
      exampleVi: "Thời hạn cho dự án này là thứ Sáu.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=deadline",
      relatedWords: ["due date", "time limit", "cutoff"],
      isFavorite: false,
    },
    {
      id: 3,
      word: "negotiate",
      definition: "To discuss with a view to finding an agreement",
      definitionVi: "Thảo luận với mục đích tìm ra thỏa thuận",
      phonetic: "/nɪˈɡoʊʃiˌeɪt/",
      example: "We need to negotiate the terms of the contract.",
      exampleVi: "Chúng ta cần đàm phán các điều khoản của hợp đồng.",
      wordType: "verb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=negotiate",
      relatedWords: ["bargain", "discuss", "compromise"],
      isFavorite: false,
    },
    {
      id: 4,
      word: "budget",
      definition: "An estimate of income and expenditure for a set period",
      definitionVi: "Ước tính thu nhập và chi tiêu cho một khoảng thời gian nhất định",
      phonetic: "/ˈbʌdʒɪt/",
      example: "The budget for this quarter is very tight.",
      exampleVi: "Ngân sách cho quý này rất hạn hẹp.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=budget",
      relatedWords: ["finance", "funds", "allocation"],
      isFavorite: false,
    },
    {
      id: 5,
      word: "client",
      definition: "A person who receives professional services",
      definitionVi: "Người nhận dịch vụ chuyên nghiệp",
      phonetic: "/ˈklaɪənt/",
      example: "Our client was very satisfied with our work.",
      exampleVi: "Khách hàng của chúng tôi rất hài lòng với công việc của chúng tôi.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=client",
      relatedWords: ["customer", "patron", "consumer"],
      isFavorite: false,
    },
    {
      id: 6,
      word: "proposal",
      definition: "A plan or suggestion put forward for consideration",
      definitionVi: "Một kế hoạch hoặc đề xuất đưa ra để xem xét",
      phonetic: "/prəˈpoʊzəl/",
      example: "I submitted my proposal to the board yesterday.",
      exampleVi: "Tôi đã nộp đề xuất của mình cho hội đồng quản trị hôm qua.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=proposal",
      relatedWords: ["suggestion", "plan", "proposition"],
      isFavorite: false,
    },
    {
      id: 7,
      word: "schedule",
      definition: "A plan for carrying out a process or procedure",
      definitionVi: "Kế hoạch để thực hiện một quy trình hoặc thủ tục",
      phonetic: "/ˈskɛdʒuːl/",
      example: "Let's check the schedule for next week.",
      exampleVi: "Hãy kiểm tra lịch trình cho tuần tới.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=schedule",
      relatedWords: ["timetable", "agenda", "plan"],
      isFavorite: false,
    },
    {
      id: 8,
      word: "collaborate",
      definition: "To work jointly on an activity or project",
      definitionVi: "Làm việc cùng nhau trong một hoạt động hoặc dự án",
      phonetic: "/kəˈlæbəˌreɪt/",
      example: "Our teams will collaborate on this initiative.",
      exampleVi: "Các nhóm của chúng tôi sẽ hợp tác trong sáng kiến này.",
      wordType: "verb",
      imageUrl: "/placeholder.svg?height=200&width=200&text=collaborate",
      relatedWords: ["cooperate", "teamwork", "partnership"],
      isFavorite: false,
    },
    {
      id: 9,
      word: "strategy",
      definition: "A plan of action designed to achieve a long-term goal",
      definitionVi: "Kế hoạch hành động được thiết kế để đạt được mục tiêu dài hạn",
      phonetic: "/ˈstrætədʒi/",
      example: "We need to develop a new marketing strategy.",
      exampleVi: "Chúng ta cần phát triển một chiến lược tiếp thị mới.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=strategy",
      relatedWords: ["plan", "approach", "tactic"],
      isFavorite: false,
    },
    {
      id: 10,
      word: "presentation",
      definition: "A speech or talk in which a new product, idea, or piece of work is shown",
      definitionVi: "Bài phát biểu hoặc nói chuyện trong đó một sản phẩm, ý tưởng hoặc tác phẩm mới được trình bày",
      phonetic: "/ˌprɛzənˈteɪʃən/",
      example: "I'm preparing a presentation for tomorrow's meeting.",
      exampleVi: "Tôi đang chuẩn bị một bài thuyết trình cho cuộc họp ngày mai.",
      wordType: "noun",
      imageUrl: "/placeholder.svg?height=200&width=200&text=presentation",
      relatedWords: ["speech", "demonstration", "display"],
      isFavorite: false,
    },
  ],
}

// Default vocabulary words if specific course/lesson not found
const defaultVocabularyWords: VocabularyWord[] = [
  {
    id: 1,
    word: "example",
    definition: "A thing characteristic of its kind or illustrating a general rule",
    definitionVi: "Một điều đặc trưng cho loại của nó hoặc minh họa một quy tắc chung",
    example: "This is an example of a vocabulary word.",
    exampleVi: "Đây là một ví dụ về từ vựng.",
    wordType: "noun",
    imageUrl: "/placeholder.svg?height=200&width=200&text=example",
    relatedWords: ["sample", "instance", "illustration"],
    isFavorite: false,
  },
  {
    id: 2,
    word: "vocabulary",
    definition: "The body of words used in a particular language",
    definitionVi: "Tập hợp các từ được sử dụng trong một ngôn ngữ cụ thể",
    example: "Learning vocabulary is essential for language acquisition.",
    exampleVi: "Học từ vựng là điều cần thiết để tiếp thu ngôn ngữ.",
    wordType: "noun",
    imageUrl: "/placeholder.svg?height=200&width=200&text=vocabulary",
    relatedWords: ["lexicon", "terminology", "words"],
    isFavorite: false,
  },
  {
    id: 3,
    word: "practice",
    definition: "The actual application or use of an idea, belief, or method",
    definitionVi: "Ứng dụng hoặc sử dụng thực tế một ý tưởng, niềm tin hoặc phương pháp",
    example: "Practice makes perfect.",
    exampleVi: "Thực hành tạo nên sự hoàn hảo.",
    wordType: "noun",
    imageUrl: "/placeholder.svg?height=200&width=200&text=practice",
    relatedWords: ["exercise", "training", "rehearsal"],
    isFavorite: false,
  },
  {
    id: 4,
    word: "learn",
    definition: "Gain or acquire knowledge of or skill in by study, experience, or being taught",
    definitionVi: "Đạt được hoặc tiếp thu kiến thức hoặc kỹ năng bằng cách học tập, trải nghiệm hoặc được dạy",
    example: "I want to learn English.",
    exampleVi: "Tôi muốn học tiếng Anh.",
    wordType: "verb",
    imageUrl: "/placeholder.svg?height=200&width=200&text=learn",
    relatedWords: ["study", "acquire", "master"],
    isFavorite: false,
  },
  {
    id: 5,
    word: "language",
    definition: "The method of human communication, either spoken or written",
    definitionVi: "Phương pháp giao tiếp của con người, bằng lời nói hoặc văn bản",
    example: "English is a global language.",
    exampleVi: "Tiếng Anh là một ngôn ngữ toàn cầu.",
    wordType: "noun",
    imageUrl: "/placeholder.svg?height=200&width=200&text=language",
    relatedWords: ["speech", "tongue", "dialect"],
    isFavorite: false,
  },
]

export const getVocabularyWords = (courseId: number, lessonId: number): VocabularyWord[] => {
  const key = `${courseId}-${lessonId}`
  return vocabularyData[key] || defaultVocabularyWords
}

export const getAllVocabularyWords = (): VocabularyWord[] => {
  return Object.values(vocabularyData).flat()
}

export const getRandomVocabularyWords = (count: number): VocabularyWord[] => {
  const allWords = getAllVocabularyWords()
  const shuffled = [...allWords].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getWordTypeOptions = (): { value: WordType; label: string }[] => {
  return [
    { value: "noun", label: "Noun" },
    { value: "verb", label: "Verb" },
    { value: "adjective", label: "Adjective" },
    { value: "adverb", label: "Adverb" },
    { value: "preposition", label: "Preposition" },
    { value: "conjunction", label: "Conjunction" },
    { value: "pronoun", label: "Pronoun" },
    { value: "interjection", label: "Interjection" },
    { value: "phrase", label: "Phrase" },
  ]
}
