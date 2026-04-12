// Tech Hub BBS Event Data - Updated from Unstop Competition JSON
export const EVENT_DATA = {
  id: '1',
  name: 'TechQuiz 2026 | C Programming & Computer Awareness Quiz (Beginner Friendly)',
  title: 'TechQuiz 2026 | C Programming & Computer Awareness Quiz (Beginner Friendly)',
  shortName: 'TechQuiz 2026',
  description: 'Test your C programming and computer awareness skills in this exciting online quiz challenge',
  mode: 'Online',
  date: '14 April 2026',
  time: '6:00 PM – 6:10 PM IST',
  registrationDeadline: '14 April 2026, 6:00 PM IST',
  registrationOpens: '05 April 2026',
  duration: '20 minutes',
  questions: 20,
  capacity: null as number | null,
  registeredCount: 234,
  status: 'LIVE',
  eventType: 'Quiz Challenge',
  region: 'online',
  
  organizer: {
    name: 'BBS College of Engineering and Technology (BBSCET)',
    location: 'BBS Campus Santipuram, Prayagraj 211013',
  },

  teamSize: 'Individual',
  venue: 'Online',
  brochureUrl: 'https://example.com/event-brochure.pdf',
  rules: [
    'No external assistance is allowed.',
    'All answers must be submitted within 20 minutes.',
    'Participants should maintain academic honesty.',
    'Join the official WhatsApp community: https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA',
  ],

  contacts: [
    {
      name: 'Mukesh Kumar',
      role: 'Lead Organizer',
      email: 'mukeshkumar916241@gmail.com',
      phone: '+91 9771894062',
    },
    {
      name: 'Aryaman Patel',
      role: 'Support',
      email: 'Techwitharyan2211@gmail.com',
      phone: '+91 8081615288',
    },
  ],

  eligibility: [
    'Engineering Students',
    'Undergraduate',
    'Postgraduate',
    'Management',
    'Medical',
    'Law',
    'Arts, Commerce, Sciences & Others',
  ],

  rounds: [
    {
      id: 'tech-quiz-round',
      name: 'Assessment Round (Tech Quiz)',
      displayText: '20 MCQs in 20 Minutes',
      date: '14 April 2026',
      time: '6:00 PM IST',
      endTime: '6:10 PM IST',
      duration: '20 minutes',
      questions: 20,
      difficulty: 'Easy to Moderate',
      topics: 'Computer Awareness + C Programming',
      scoring: 'Ranking based on score + time',
      totalRounds: 1,
    },
  ],

  quizFormat: [
    {
      title: '5 Basic Computer Awareness',
      description: 'Fundamentals of computers, digital literacy, basic OS concepts and hardware awareness.',
    },
    {
      title: '5 Basic C Programming',
      description: 'Core C concepts including syntax, data types, operators, and control flow.',
    },
    {
      title: 'Moderate C Questions',
      description: 'Topics from functions, pointers, arrays, and simple memory handling.',
    },
    {
      title: 'Hard C Questions',
      description: 'Advanced C challenges around pointers, file management, and problem-solving.',
    },
  ],

  highlights: [
    {
      id: 'h1',
      eventId: '1',
      order: 1,
      title: 'Online Quiz Challenge',
      description: '20 MCQs in 20 minutes covering computer awareness and C programming',
      icon: 'Zap',
    },
    {
      id: 'h2',
      eventId: '1',
      order: 2,
      title: 'C Programming Focus',
      description: 'Test your knowledge of C language fundamentals and concepts',
      icon: 'Code',
    },
    {
      id: 'h3',
      eventId: '1',
      order: 3,
      title: 'Certificates for All',
      description: 'Every participant receives a digital certificate',
      icon: 'Award',
    },
    {
      id: 'h4',
      eventId: '1',
      order: 4,
      title: 'Google Swag Rewards',
      description: 'Top 3 winners get exclusive Google merchandise',
      icon: 'Gift',
    },
  ],

  prizes: [
    {
      position: 'Top 3',
      reward: 'Google swag & certificate',
      icon: '🥇',
    },
    {
      position: 'All Participants',
      reward: 'Digital participation certificate within 3 days',
      icon: '⭐',
    },
  ],

  faqs: [
    {
      question: 'What is the registration deadline?',
      answer: 'The registration deadline is 14 April 2026 at 6:00 PM IST (same time as quiz start). Make sure to register before this date to participate.',
    },
    {
      question: 'How long is the quiz?',
      answer: 'The quiz duration is 20 minutes with 20 multiple-choice questions covering Computer Awareness and C Programming.',
    },
    {
      question: 'When will I receive my certificate?',
      answer: 'Certificates will be released within 3 days of the event completion. Certificates are issued only to valid registered participants who attend/attempt the event and follow all event rules.',
    },
    {
      question: 'Is this event limited to engineering students?',
      answer: 'No, students from all streams are eligible - Engineering, Management, Medical, Law, Arts, Commerce, Sciences, and others.',
    },
    {
      question: 'How is the ranking determined?',
      answer: 'Ranking is based on your quiz score combined with the time taken to complete the quiz.',
    },
    {
      question: 'What topics are covered in the quiz?',
      answer: 'The quiz covers Computer Awareness and C Programming. Topics include basic computer concepts and C language fundamentals.',
    },
    {
      question: 'Do I need to join the WhatsApp community?',
      answer: 'Yes, joining the official WhatsApp community is mandatory for all participants. Join here: https://chat.whatsapp.com/Hc1zaz52LdOAh6kM5NHREA',
    },
  ],

  timeline: [
    {
      phase: 'Registration Opens',
      date: '05 April 2026',
      time: '12:00 AM IST',
      description: 'Registration window opens for all eligible students',
    },
    {
      phase: 'Registration Closes',
      date: '14 April 2026',
      time: '6:00 PM IST',
      description: 'Last day to register - Quiz starts at 6:00 PM!',
    },
    {
      phase: 'Quiz Starts',
      date: '14 April 2026',
      time: '6:00 PM IST',
      description: 'Live TechQuiz challenge begins - 20 MCQs in 20 Minutes',
    },
    {
      phase: 'Quiz Ends',
      date: '14 April 2026',
      time: '6:10 PM IST',
      description: 'Submission window closes',
    },
    {
      phase: 'Results',
      date: 'Within 3 days',
      time: '',
      description: 'Rankings announced based on score. Time as tie-breaker.',
    },
  ],

  seats: {
    status: 'Open',
    participation: 'Individual',
    teamSize: 1,
  },

  features: [
    'Free to participate',
    'Certificates for all participants',
    'No prior registration needed',
    'Compete with students nationwide',
    'Earn valuable certificates',
    'Win Google swag prizes',
  ],

  sponsors: [
    { name: 'BBS Coding Club', tier: 'Gold' },
  ],
}

export type EventData = typeof EVENT_DATA
