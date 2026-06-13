import {
  Code,
  Newspaper,
  Sparkles,
  GraduationCap,
  Briefcase,
  Lightbulb,
  BookOpen,
} from "lucide-react";

export const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Write a professional LinkedIn post about my latest project",
      "Generate a startup idea for college students",
      "Create a 30-day JavaScript learning roadmap",
      "Write a short story about a hacker solving a mystery",
    ],
  },
  {
    tabName: "Explore",
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      "Good books for fans of Rick Rubin",
      "Explain quantum computing like I'm 10",
      "What are the latest trends in AI startups?",
      "Best places to visit in Japan for first-time travelers",
    ],
  },
  {
    tabName: "Code",
    icon: <Code className="h-4 w-4" />,
    messages: [
      "Build a JWT authentication system with Express and MongoDB",
      "Explain React Server Components with examples",
      "Optimize this DFS solution for large graphs",
      "Create a Socket.IO chat application from scratch",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Explain recursion with simple examples",
      "Teach me system design from beginner to advanced",
      "Create a roadmap for learning backend development",
      "How does the internet work behind the scenes?",
    ],
  },
  {
    tabName: "Career",
    icon: <Briefcase className="h-4 w-4" />,
    messages: [
      "Review my resume for a software engineering role",
      "Prepare me for a React interview",
      "What projects should I build to get internships?",
      "Create a 90-day job search plan",
    ],
  },
  {
    tabName: "Ideas",
    icon: <Lightbulb className="h-4 w-4" />,
    messages: [
      "Give me 10 SaaS ideas for students",
      "Suggest a unique final-year project",
      "What problems can AI solve in education?",
      "Brainstorm features for a college management system",
    ],
  },
  {
    tabName: "Research",
    icon: <BookOpen className="h-4 w-4" />,
    messages: [
      "Compare PostgreSQL and MongoDB",
      "Summarize the latest AI developments",
      "Explain microservices vs monolith architecture",
      "Analyze the pros and cons of serverless computing",
    ],
  },
];