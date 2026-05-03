import { Router } from "express";
import Portfolio from "../models/Portfolio";
import { isConnected } from "../lib/mongo";

const router = Router();

const initialData = {
  profile: {
    name: "LHY Mashrafe",
    title: "Full Stack Engineer & Creative Developer",
    bio: "I craft cinematic web experiences and build robust, scalable architectures. Deep space meets neon Tokyo — that's my aesthetic. With over 5 years of experience building full-stack applications, I bridge the gap between design and engineering to create unforgettable digital products.",
    resumeUrl: "#",
    profileImageUrl: "",
  },
  skills: [
    { id: "s1", name: "JavaScript", category: "Languages", proficiency: 95 },
    { id: "s2", name: "TypeScript", category: "Languages", proficiency: 90 },
    { id: "s3", name: "Python", category: "Languages", proficiency: 85 },
    { id: "s4", name: "Java", category: "Languages", proficiency: 80 },
    { id: "s5", name: "SQL", category: "Languages", proficiency: 85 },
    { id: "s6", name: "React.js", category: "Frontend", proficiency: 95 },
    { id: "s7", name: "Next.js", category: "Frontend", proficiency: 90 },
    { id: "s8", name: "Redux", category: "Frontend", proficiency: 85 },
    { id: "s9", name: "Tailwind CSS", category: "Frontend", proficiency: 95 },
    { id: "s10", name: "HTML5/CSS3", category: "Frontend", proficiency: 98 },
    { id: "s11", name: "Node.js", category: "Backend", proficiency: 90 },
    { id: "s12", name: "Express.js", category: "Backend", proficiency: 88 },
    { id: "s13", name: "Django", category: "Backend", proficiency: 80 },
    { id: "s14", name: "Spring Boot", category: "Backend", proficiency: 75 },
    { id: "s15", name: "MongoDB", category: "Database", proficiency: 85 },
    { id: "s16", name: "PostgreSQL", category: "Database", proficiency: 88 },
    { id: "s17", name: "MySQL", category: "Database", proficiency: 85 },
    { id: "s18", name: "Redis", category: "Database", proficiency: 80 },
    { id: "s19", name: "Docker", category: "DevOps", proficiency: 82 },
    { id: "s20", name: "Kubernetes", category: "DevOps", proficiency: 75 },
    { id: "s21", name: "AWS", category: "DevOps", proficiency: 80 },
    { id: "s22", name: "Git", category: "DevOps", proficiency: 95 },
    { id: "s23", name: "CI/CD", category: "DevOps", proficiency: 85 },
    { id: "s24", name: "Jira", category: "DevOps", proficiency: 90 },
    { id: "s25", name: "DSA", category: "Core Concepts", proficiency: 90 },
    { id: "s26", name: "OOP", category: "Core Concepts", proficiency: 95 },
    { id: "s27", name: "REST APIs", category: "Core Concepts", proficiency: 95 },
    { id: "s28", name: "System Design", category: "Core Concepts", proficiency: 85 },
  ],
  experience: [
    {
      id: "e1",
      title: "Senior Full Stack Engineer",
      company: "Google",
      date: "2024–Present",
      description: ["Leading microservices migration.", "Mentoring junior engineers and conducting code reviews.", "Optimized core systems reducing latency by 40%."],
      techStack: ["Kubernetes", "Go", "React", "GCP"],
    },
    {
      id: "e2",
      title: "Full Stack Developer",
      company: "Microsoft",
      date: "2022–2024",
      description: ["Built Azure DevOps integrations.", "Architected scalable frontend architectures.", "Collaborated with cross-functional teams for successful feature launches."],
      techStack: ["TypeScript", "Node.js", "Azure"],
    },
    {
      id: "e3",
      title: "Software Engineer",
      company: "Amazon",
      date: "2020–2022",
      description: ["Inventory management systems.", "Implemented complex business logic and robust backend services."],
      techStack: ["Java", "Spring Boot", "AWS"],
    },
    {
      id: "e4",
      title: "Junior Developer",
      company: "Meta",
      date: "2019–2020",
      description: ["Facebook Ads frontend optimization.", "Improved ad rendering performance."],
      techStack: ["React", "GraphQL", "Relay"],
    },
  ],
  projects: [
    { id: "p1", title: "Nebula Dashboard", category: "Web App", status: "Live", techStack: ["React", "Three.js", "Python", "TensorFlow"], description: "AI-powered analytics dashboard." },
    { id: "p2", title: "Quantum Chat", category: "Web App", status: "Live", techStack: ["Next.js", "Socket.io", "Redis"], description: "E2E encrypted messaging." },
    { id: "p3", title: "CryptoVision", category: "Mobile", status: "In Progress", techStack: ["React Three Fiber", "WebSockets"], description: "Real-time crypto tracking with 3D visuals." },
  ],
  contactLinks: {
    whatsapp: "https://wa.me/1234567890",
    linkedin: "https://linkedin.com/in/lhymashrafe",
    telegram: "https://t.me/lhymashrafe",
    github: "https://github.com/lhymashrafe",
    twitter: "https://twitter.com/lhymashrafe",
    email: "mashrafexyz@gmail.com",
  },
};

router.post("/bootstrap", async (req, res) => {
  if (!isConnected()) {
    res.status(503).json({ error: "Database not connected" });
    return;
  }

  try {
    const existing = await Portfolio.findOne().lean();
    if (existing) {
      res.json({ ok: true, seeded: false });
      return;
    }

    const doc = await Portfolio.create(initialData);
    res.status(201).json({ ok: true, seeded: true, id: doc._id });
  } catch (err) {
    req.log.error({ err }, "Failed to bootstrap portfolio");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
