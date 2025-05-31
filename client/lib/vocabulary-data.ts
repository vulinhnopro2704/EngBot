interface VocabularyWord {
  id: number
  word: string
  definition: string
  phonetic?: string
  example?: string
}

// Mock vocabulary data
const vocabularyData: Record<string, VocabularyWord[]> = {
  // Beginner Vocabulary
  "1-1": [
    // Course 1, Lesson 1: Greetings and Introductions
    {
      id: 1,
      word: "hello",
      definition: "Used as a greeting or to begin a phone conversation",
      phonetic: "/həˈloʊ/",
      example: "Hello, how are you today?",
    },
    {
      id: 2,
      word: "goodbye",
      definition: "Used when leaving or ending a conversation",
      phonetic: "/ˌɡʊdˈbaɪ/",
      example: "I have to go now, goodbye!",
    },
    {
      id: 3,
      word: "please",
      definition: "Used as a polite way of asking for something",
      phonetic: "/pliz/",
      example: "Could I have some water, please?",
    },
    {
      id: 4,
      word: "thank you",
      definition: "Used to express gratitude",
      phonetic: "/ˈθæŋk ju/",
      example: "Thank you for your help.",
    },
    {
      id: 5,
      word: "welcome",
      definition: "Used as a greeting to someone arriving",
      phonetic: "/ˈwɛlkəm/",
      example: "Welcome to our home!",
    },
    {
      id: 6,
      word: "introduce",
      definition: "To present someone by name to another person",
      phonetic: "/ˌɪntrəˈdus/",
      example: "Let me introduce you to my friend.",
    },
    {
      id: 7,
      word: "name",
      definition: "A word or words by which a person is known",
      phonetic: "/neɪm/",
      example: "My name is John.",
    },
    {
      id: 8,
      word: "meet",
      definition: "To come into the presence of someone for the first time",
      phonetic: "/mit/",
      example: "It's nice to meet you.",
    },
    {
      id: 9,
      word: "friend",
      definition: "A person with whom one has a bond of mutual affection",
      phonetic: "/frɛnd/",
      example: "She is my best friend.",
    },
    {
      id: 10,
      word: "family",
      definition: "A group of people related by blood or marriage",
      phonetic: "/ˈfæməli/",
      example: "I have a large family with many cousins.",
    },
  ],
  "1-2": [
    // Course 1, Lesson 2: Daily Activities
    {
      id: 1,
      word: "morning",
      definition: "The early part of the day",
      phonetic: "/ˈmɔrnɪŋ/",
      example: "I always eat breakfast in the morning.",
    },
    {
      id: 2,
      word: "afternoon",
      definition: "The time from noon until evening",
      phonetic: "/ˌæftərˈnun/",
      example: "We have a meeting this afternoon.",
    },
    {
      id: 3,
      word: "evening",
      definition: "The period of time at the end of the day",
      phonetic: "/ˈivnɪŋ/",
      example: "I like to read in the evening.",
    },
    {
      id: 4,
      word: "breakfast",
      definition: "The first meal of the day",
      phonetic: "/ˈbrɛkfəst/",
      example: "I had eggs for breakfast.",
    },
    {
      id: 5,
      word: "lunch",
      definition: "A meal eaten in the middle of the day",
      phonetic: "/lʌntʃ/",
      example: "Let's have lunch together.",
    },
    {
      id: 6,
      word: "dinner",
      definition: "The main meal of the day, typically in the evening",
      phonetic: "/ˈdɪnər/",
      example: "We're having pasta for dinner.",
    },
    {
      id: 7,
      word: "work",
      definition: "Activity involving mental or physical effort",
      phonetic: "/wɜrk/",
      example: "I go to work at 8 AM.",
    },
    {
      id: 8,
      word: "study",
      definition: "The devotion of time and attention to gaining knowledge",
      phonetic: "/ˈstʌdi/",
      example: "I need to study for my exam.",
    },
    {
      id: 9,
      word: "sleep",
      definition: "A condition of body and mind in which consciousness is temporarily lost",
      phonetic: "/slip/",
      example: "I usually sleep for eight hours each night.",
    },
    {
      id: 10,
      word: "exercise",
      definition: "Activity requiring physical effort, carried out to sustain health",
      phonetic: "/ˈɛksərˌsaɪz/",
      example: "I do exercise every morning to stay healthy.",
    },
  ],
  // Add more lessons for other courses
  "2-1": [
    // Course 2, Lesson 1: Business English
    {
      id: 1,
      word: "meeting",
      definition: "An assembly of people for discussion or business",
      phonetic: "/ˈmiːtɪŋ/",
      example: "We have a team meeting every Monday.",
    },
    {
      id: 2,
      word: "deadline",
      definition: "The latest time by which something should be completed",
      phonetic: "/ˈdɛdˌlaɪn/",
      example: "The deadline for this project is Friday.",
    },
    {
      id: 3,
      word: "negotiate",
      definition: "To discuss with a view to finding an agreement",
      phonetic: "/nɪˈɡoʊʃiˌeɪt/",
      example: "We need to negotiate the terms of the contract.",
    },
    {
      id: 4,
      word: "budget",
      definition: "An estimate of income and expenditure for a set period",
      phonetic: "/ˈbʌdʒɪt/",
      example: "The budget for this quarter is very tight.",
    },
    {
      id: 5,
      word: "client",
      definition: "A person who receives professional services",
      phonetic: "/ˈklaɪənt/",
      example: "Our client was very satisfied with our work.",
    },
    {
      id: 6,
      word: "proposal",
      definition: "A plan or suggestion put forward for consideration",
      phonetic: "/prəˈpoʊzəl/",
      example: "I submitted my proposal to the board yesterday.",
    },
    {
      id: 7,
      word: "schedule",
      definition: "A plan for carrying out a process or procedure",
      phonetic: "/ˈskɛdʒuːl/",
      example: "Let's check the schedule for next week.",
    },
    {
      id: 8,
      word: "collaborate",
      definition: "To work jointly on an activity or project",
      phonetic: "/kəˈlæbəˌreɪt/",
      example: "Our teams will collaborate on this initiative.",
    },
    {
      id: 9,
      word: "strategy",
      definition: "A plan of action designed to achieve a long-term goal",
      phonetic: "/ˈstrætədʒi/",
      example: "We need to develop a new marketing strategy.",
    },
    {
      id: 10,
      word: "presentation",
      definition: "A speech or talk in which a new product, idea, or piece of work is shown",
      phonetic: "/ˌprɛzənˈteɪʃən/",
      example: "I'm preparing a presentation for tomorrow's meeting.",
    },
  ],
}

export function getVocabularyWords(courseId: number, lessonId: number): VocabularyWord[] {
  const key = `${courseId}-${lessonId}`

  // Return the vocabulary words for the specified course and lesson
  // If not found, return a default set
  return (
    vocabularyData[key] || [
      {
        id: 1,
        word: "example",
        definition: "A thing characteristic of its kind or illustrating a general rule",
        example: "This is an example of a vocabulary word.",
      },
      {
        id: 2,
        word: "vocabulary",
        definition: "The body of words used in a particular language",
        example: "Learning vocabulary is essential for language acquisition.",
      },
      {
        id: 3,
        word: "practice",
        definition: "The actual application or use of an idea, belief, or method",
        example: "Practice makes perfect.",
      },
      {
        id: 4,
        word: "learn",
        definition: "Gain or acquire knowledge of or skill in by study, experience, or being taught",
        example: "I want to learn English.",
      },
      {
        id: 5,
        word: "language",
        definition: "The method of human communication, either spoken or written",
        example: "English is a global language.",
      },
      {
        id: 6,
        word: "study",
        definition: "The devotion of time and attention to acquiring knowledge",
        example: "I study for two hours every day.",
      },
      {
        id: 7,
        word: "word",
        definition: "A single distinct meaningful element of speech or writing",
        example: "This sentence has seven words.",
      },
      {
        id: 8,
        word: "sentence",
        definition: "A set of words that is complete in itself",
        example: "Can you write a complete sentence?",
      },
      {
        id: 9,
        word: "meaning",
        definition: "What is meant by a word, text, concept, or action",
        example: "Do you know the meaning of this word?",
      },
      {
        id: 10,
        word: "pronunciation",
        definition: "The way in which a word is pronounced",
        example: "English pronunciation can be difficult.",
      },
    ]
  )
}
