// TechQuiz Event Data
export const EVENT_DATA = {
  name: 'TechQuiz: Computer Awareness & C Language Challenge',
  shortName: 'TechQuiz',
  description: 'Test your C programming and computer awareness skills in this exciting online quiz challenge',
  mode: 'Online',
  date: '12 April 2026',
  time: '6:00 PM – 6:30 PM IST',
  registrationDeadline: '11 April 2026, 12:00 AM IST',
  duration: '20 minutes',
  questions: 20,
  
  organizer: {
    name: 'BBS College of Engineering and Technology (BBSCET)',
    location: 'Allahabad, Uttar Pradesh',
  },

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
      id: 'assessment',
      name: 'Assessment Round (Tech Quiz)',
      date: '12 April 2026',
      time: '6:00 PM – 6:30 PM IST',
      duration: '20 minutes',
      questions: 20,
      difficulty: 'Easy to Moderate',
      topics: 'Computer Awareness + C Programming',
      scoring: 'Ranking based on score + time',
    },
  ],

  highlights: [
    {
      title: 'Online Quiz Challenge',
      description: '20 MCQs in 20 minutes covering computer awareness and C programming',
      icon: 'Zap',
    },
    {
      title: 'C Programming Focus',
      description: 'Test your knowledge of C language fundamentals and concepts',
      icon: 'Code',
    },
    {
      title: 'Certificates for All',
      description: 'Every participant receives a digital certificate',
      icon: 'Award',
    },
    {
      title: 'Google Swag Rewards',
      description: 'Top 3 winners get exclusive Google merchandise',
      icon: 'Gift',
    },
  ],

  prizes: [
    {
      position: '1st',
      reward: 'Google Swag + Certificate',
      icon: '🥇',
    },
    {
      position: '2nd',
      reward: 'Google Swag + Certificate',
      icon: '🥈',
    },
    {
      position: '3rd',
      reward: 'Google Swag + Certificate',
      icon: '🥉',
    },
    {
      position: 'Participation',
      reward: 'Certificate',
      icon: '⭐',
    },
  ],

  faqs: [
    {
      question: 'What is the registration deadline?',
      answer: 'The registration deadline is 11 April 2026 at 12:00 AM IST. Make sure to register before this date to participate.',
    },
    {
      question: 'How long is the quiz?',
      answer: 'The quiz duration is 20 minutes with 20 multiple-choice questions covering Computer Awareness and C Programming.',
    },
    {
      question: 'When will I receive my certificate?',
      answer: 'Certificates will be released within 3 days of the event completion.',
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
  ],

  timeline: [
    {
      phase: 'Registration Opens',
      date: 'Early April 2026',
      description: 'Registration window opens for all eligible students',
    },
    {
      phase: 'Registration Deadline',
      date: '11 April 2026, 12:00 AM IST',
      description: 'Last day to register for the quiz challenge',
    },
    {
      phase: 'Quiz Challenge',
      date: '12 April 2026',
      time: '6:00 PM - 6:30 PM IST',
      description: 'Take the 20-minute online quiz',
    },
    {
      phase: 'Result Announcement',
      date: '12 April 2026 (Evening)',
      description: 'Winners and results announced',
    },
    {
      phase: 'Certificate Release',
      date: 'Within 3 days',
      description: 'Digital certificates issued to all participants',
    },
  ],

  seats: {
    total: 50,
    available: 29,
  },

  sponsors: [
    { name: 'Google', tier: 'Platinum' },
    { name: 'Microsoft', tier: 'Gold' },
    { name: 'Amazon', tier: 'Gold' },
    { name: 'IBM', tier: 'Silver' },
  ],
}

export type EventData = typeof EVENT_DATA
