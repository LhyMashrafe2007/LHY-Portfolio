import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  proficiency: Number,
});

const ExperienceSchema = new mongoose.Schema({
  id: String,
  title: String,
  company: String,
  date: String,
  description: [String],
  techStack: [String],
});

const ProjectSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  status: String,
  techStack: [String],
  description: String,
  liveUrl: String,
  sourceUrl: String,
  imageUrl: String,
});

const ContactLinksSchema = new mongoose.Schema({
  whatsapp: String,
  linkedin: String,
  telegram: String,
  github: String,
  twitter: String,
  email: String,
});

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  resumeUrl: String,
  profileImageUrl: String,
});

const PortfolioSchema = new mongoose.Schema(
  {
    profile: ProfileSchema,
    skills: [SkillSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    contactLinks: ContactLinksSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", PortfolioSchema);
