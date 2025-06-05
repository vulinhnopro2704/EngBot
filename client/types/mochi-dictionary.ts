// Bạn có thể đặt trong: types/api-response.d.ts

export interface ApiResponse {
    code: number;
    data: WordData[];
    suggests: any[];
    msg: string;
}
  
  export interface WordData {
    id: number;
    content: string;
    position: string;
    phoneticUk: string;
    phoneticUs: string;
    audioUk: string;
    audioUs: string;
    frequency: number | null;
    createdAt: string;
    alalyzing: Analyzing;
    phrasalVerb: PhrasalVerb[];
    idioms: Idiom[];
    words: WordDetail[];
    verbForm: VerbForm | null;
    thesaurus: Thesaurus[];
  }
  
  export interface Analyzing {
    typeWord: string;
    countPhoneme: number;
    phonemesUs: Phoneme[];
    phonemesUk: Phoneme[];
  }
  
  export interface Phoneme {
    character: string;
    characterAudio: string | null;
    phonemes: string;
    phonemesAudio: string | null;
  }
  
  export interface PhrasalVerb {
    id: number;
    wmId: number;
    phrasalVerbs: string;
    phoneticUk: string;
    phoneticUs: string;
    audioUk: string;
    audioUs: string;
  }
  
  export interface Idiom {
    id: number;
    wmId: number;
    idiom: string;
    audio: string | null;
    definition: string;
    definitionGpt: string;
    example: string;
    idiomsExAudio: string | null;
    example2: string;
    stressed: string | null;
    reason: string | null;
    idiomsTran: IdiomTran;
    pivot: {
      wmId: number;
      idiomId: number;
    };
  }
  
  export interface IdiomTran {
    id: number;
    idiomId: number;
    idiom: string;
    definition: string | null;
    example: string;
    example2: string;
  }
  
  export interface WordDetail {
    id: number;
    wmId: number;
    picture: string;
    audio: string | null;
    content: string | null;
    position: string | null;
    phonetic: string | null;
    definition: string | null;
    definitionGpt: string | null;
    cefrLevel: string;
    cefrGpt: string | null;
    ieltsLevel: string;
    toeic: string;
    single: number;
    collo: number;
    synonym: number;
    review: number;
    createdAt: string;
    isErrorGf2: number;
    isErrorG4o: number;
    updatedAt: string | null;
    trans: string;
    sentenceAudio: SentenceAudio[];
    collocations: Collocation[];
    synonyms: Synonyms | null;
  }
  
  export interface SentenceAudio {
    key: string;
    audio: string;
    trans: string;
  }
  
  export interface Collocation {
    id: number;
    wId: number;
    collocations: string;
    phonetic: string | null;
    position: string | null;
    audioUk: string | null;
    definition: string;
    audio: string | null;
    review: number;
    example: string;
    example2: string;
    colloExAudio: string | null;
    stressed: string | null;
    reason: string | null;
    answer: string | null;
    collocationTrans: CollocationTrans;
  }
  
  export interface CollocationTrans {
    id: number;
    colloId: number;
    collo: string;
    explain: string | null;
    definition: string | null;
    example: string;
    example2: string;
  }
  
  export interface Synonyms {
    id: number;
    wId: number;
    synonym: string[];
  }
  
  export interface VerbForm {
    id: number;
    wmId: number;
    presentSimple: string;
    presentSimplePhonetic: string | null;
    presentSimpleAudioUs: string | null;
    presentSimpleAudioUk: string | null;
    singularVerb: string;
    singularVerbPhonetic: string | null;
    singularVerbAudioUs: string | null;
    singularVerbAudioUk: string | null;
    pastSimple: string;
    pastSimplePhonetic: string | null;
    pastSimpleAudioUs: string | null;
    pastSimpleAudioUk: string | null;
    pastParticiple: string;
    pastParticiplePhonetic: string | null;
    pastParticipleAudioUs: string | null;
    pastParticipleAudioUk: string | null;
    ingForm: string;
    ingFormPhonetic: string | null;
    ingFormAudioUs: string | null;
    ingFormAudioUk: string | null;
  }
  
  export interface Thesaurus {
    id: number;
    wmId: number;
    position: string;
    positionContent: string;
    strongestMatch: string;
    strongMatch: string;
    weakMatch: string;
    strongestOpposite: string;
    strongOpposite: string;
    weakOpposite: string;
    createdAt: string;
    updatedAt: string;
  }