// Tech Hub BBS Event Data
export const EVENT_DATA = {
  id: '1',
  name: 'Tech Hub BBS: Computer Awareness & C Language Challenge',
  title: 'Tech Hub BBS: Computer Awareness & C Language Challenge',
  shortName: 'Tech Hub BBS',
  description: 'Test your C programming and computer awareness skills in this exciting online quiz challenge',
  mode: 'Online',
  date: '12 April 2026',
  time: '6:00 PM – 6:30 PM IST',
  registrationDeadline: '11 April 2026, 12:00 AM IST',
  duration: '20 minutes',
  questions: 20,
  capacity: 50,
  registeredCount: 29,
  status: 'upcoming',
  
  organizer: {
    name: 'BBS College of Engineering and Technology (BBSCET)',
    location: 'BBS Campus Santipuram, Prayagraj 210013',
  },

  eventType: 'Quiz Championship',
  teamSize: 'Individual / Team of 2',
  venue: 'Virtual + BBSCET Auditorium',
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
      answer: 'The registration deadline is 11 April 2026 at 12:00 AM IST. Make sure to register before this date to participate.',
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
      date: 'Early April 2026',
      description: 'Registration window opens for all eligible students',
    },
    {
      phase: 'Registration Deadline',
      date: '11 April 2026, 12:00 AM IST',
      description: 'Last day to register for the quiz challenge',
    },
    {
      phase: 'Technical Session',
      date: 'Saturday 11 April 2026, 7:00 PM IST',
      description: 'Google Meet session for event briefing and rules.',
    },
    {
      phase: 'Quiz Time',
      date: '12 April 2026, 6:00 PM IST',
      description: 'Live TechQuiz challenge begins on time.',
    },
    {
      phase: 'Certificate Time',
      date: 'Within 3 days after quiz',
      description: 'Digital certificates issued to all participants after the quiz.',
    },
  ],

  seats: {
    total: 50,
    available: 29,
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
