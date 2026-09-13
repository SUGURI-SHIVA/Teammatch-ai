import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@college.edu' },
    update: {},
    create: { email: 'alice@college.edu', password, name: 'Alice Johnson', role: 'BOTH' },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@college.edu' },
    update: {},
    create: { email: 'bob@college.edu', password, name: 'Bob Smith', role: 'STUDENT' },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'carol@college.edu' },
    update: {},
    create: { email: 'carol@college.edu', password, name: 'Carol Davis', role: 'STUDENT' },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'dave@college.edu' },
    update: {},
    create: { email: 'dave@college.edu', password, name: 'Dave Wilson', role: 'STUDENT' },
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'eve@college.edu' },
    update: {},
    create: { email: 'eve@college.edu', password, name: 'Eve Martinez', role: 'STUDENT' },
  });

  const user6 = await prisma.user.upsert({
    where: { email: 'frank@college.edu' },
    update: {},
    create: { email: 'frank@college.edu', password, name: 'Frank Brown', role: 'BOTH' },
  });

  const user7 = await prisma.user.upsert({
    where: { email: 'grace@college.edu' },
    update: {},
    create: { email: 'grace@college.edu', password, name: 'Grace Lee', role: 'STUDENT' },
  });

  const user8 = await prisma.user.upsert({
    where: { email: 'henry@college.edu' },
    update: {},
    create: { email: 'henry@college.edu', password, name: 'Henry Taylor', role: 'STUDENT' },
  });

  console.log('Users created');

  const skills = ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'Deep Learning',
    'Java', 'C', 'C++', 'TypeScript', 'HTML', 'CSS', 'UI/UX', 'Flutter', 'Django',
    'Flask', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'TensorFlow', 'PyTorch',
    'NLP', 'Computer Vision', 'Data Science', 'IoT', 'Blockchain', 'Cybersecurity',
    'REST API', 'GraphQL', 'Vue.js', 'Angular', 'Swift', 'Kotlin', 'Rust', 'Go',
    'Redis', 'Kafka', 'Linux', 'Figma', 'Adobe XD', 'Firebase', 'Supabase', 'Dart', 'SQL'];

  for (const name of skills) {
    await prisma.skill.upsert({ where: { name }, update: {}, create: { name } });
  }

  const interests = ['AI/ML', 'Web Development', 'Mobile Development', 'IoT', 'Cybersecurity',
    'Healthcare', 'Education', 'FinTech', 'Agriculture', 'Gaming', 'E-commerce',
    'Social Impact', 'Sustainability', 'Robotics', 'AR/VR', 'Cloud Computing',
    'DevOps', 'Open Source', 'Research', 'Startups'];

  for (const name of interests) {
    await prisma.interest.upsert({ where: { name }, update: {}, create: { name } });
  }

  const roles = ['AI/ML Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'UI/UX Designer', 'Researcher', 'Project Manager', 'Presenter', 'DevOps Engineer',
    'Mobile Developer', 'Data Analyst', 'Security Analyst'];

  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log('Skills, interests, roles created');

  const createProfile = async (userId: string, data: any) => {
    const { roles: _roles, skills: _skills, interests: _interests, learningGoals: _goals, previousProjects: _prevProjects, ...basicData } = data;
    return prisma.studentProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        ...basicData,
        skills: {
          create: await Promise.all(
            _skills.map(async (s: any) => {
              const skill = await prisma.skill.findUnique({ where: { name: s.name } });
              return { skillId: skill!.id, level: s.level || 'Intermediate' };
            })
          ),
        },
        interests: {
          create: await Promise.all(
            _interests.map(async (name: string) => {
              const interest = await prisma.interest.findUnique({ where: { name } });
              return { interestId: interest!.id };
            })
          ),
        },
        preferredRoles: {
          create: await Promise.all(
            _roles.map(async (name: string) => {
              const role = await prisma.role.findUnique({ where: { name } });
              return { roleId: role!.id };
            })
          ),
        },
        learningGoals: {
          create: (_goals || []).map((skill: string) => ({ skill })),
        },
        previousProjects: {
          create: (_prevProjects || []).map((p: any) => ({ name: p.name, description: p.description || '', skills: p.skills || '' })),
        },
      },
    });
  };

  await createProfile(user1.id, {
    college: 'MIT', department: 'Computer Science', year: '3rd',
    experience: 'Advanced', availability: 'Monday, Wednesday, Friday',
    bio: 'Passionate about AI and full-stack development',
    skills: [
      { name: 'Python', level: 'Advanced' }, { name: 'Machine Learning', level: 'Advanced' },
      { name: 'React', level: 'Intermediate' }, { name: 'Node.js', level: 'Intermediate' },
      { name: 'TensorFlow', level: 'Advanced' }, { name: 'Git', level: 'Advanced' },
    ],
    interests: ['AI/ML', 'Web Development', 'Healthcare'],
    roles: ['AI/ML Developer', 'Full Stack Developer'],
    learningGoals: ['Kubernetes', 'Rust'],
  });

  await createProfile(user2.id, {
    college: 'MIT', department: 'Computer Science', year: '2nd',
    experience: 'Intermediate', availability: 'Tuesday, Thursday, Saturday',
    bio: 'Frontend enthusiast who loves creating beautiful interfaces',
    skills: [
      { name: 'JavaScript', level: 'Advanced' }, { name: 'React', level: 'Advanced' },
      { name: 'HTML', level: 'Advanced' }, { name: 'CSS', level: 'Advanced' },
      { name: 'TypeScript', level: 'Intermediate' }, { name: 'UI/UX', level: 'Intermediate' },
      { name: 'Figma', level: 'Intermediate' },
    ],
    interests: ['Web Development', 'Gaming', 'AR/VR'],
    roles: ['Frontend Developer', 'UI/UX Designer'],
    learningGoals: ['Three.js', 'WebGL'],
  });

  await createProfile(user3.id, {
    college: 'Stanford', department: 'Computer Engineering', year: '3rd',
    experience: 'Advanced', availability: 'Monday, Tuesday, Wednesday, Thursday',
    bio: 'Backend specialist with a passion for scalable systems',
    skills: [
      { name: 'Java', level: 'Advanced' }, { name: 'Python', level: 'Intermediate' },
      { name: 'Node.js', level: 'Advanced' }, { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'MongoDB', level: 'Advanced' }, { name: 'Docker', level: 'Intermediate' },
      { name: 'REST API', level: 'Advanced' }, { name: 'Git', level: 'Advanced' },
    ],
    interests: ['Cloud Computing', 'DevOps', 'Startups'],
    roles: ['Backend Developer', 'DevOps Engineer'],
    learningGoals: ['Kubernetes', 'Go'],
  });

  await createProfile(user4.id, {
    college: 'Stanford', department: 'Computer Science', year: '2nd',
    experience: 'Beginner', availability: 'Friday, Saturday, Sunday',
    bio: 'Interested in IoT and embedded systems',
    skills: [
      { name: 'C', level: 'Intermediate' }, { name: 'C++', level: 'Intermediate' },
      { name: 'Python', level: 'Beginner' }, { name: 'IoT', level: 'Beginner' },
    ],
    interests: ['IoT', 'Robotics', 'Sustainability'],
    roles: ['Backend Developer', 'Researcher'],
    learningGoals: ['Machine Learning', 'Rust'],
  });

  await createProfile(user5.id, {
    college: 'UC Berkeley', department: 'Data Science', year: '3rd',
    experience: 'Intermediate', availability: 'Monday, Wednesday, Friday, Saturday',
    bio: 'Data science enthusiast who wants to make an impact',
    skills: [
      { name: 'Python', level: 'Advanced' }, { name: 'Data Science', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Intermediate' }, { name: 'TensorFlow', level: 'Intermediate' },
      { name: 'SQL', level: 'Advanced' }, { name: 'PostgreSQL', level: 'Intermediate' },
    ],
    interests: ['AI/ML', 'Healthcare', 'Education'],
    roles: ['Data Analyst', 'AI/ML Developer', 'Researcher'],
    learningGoals: ['Deep Learning', 'NLP'],
  });

  await createProfile(user6.id, {
    college: 'UC Berkeley', department: 'Computer Science', year: '4th',
    experience: 'Advanced', availability: 'Monday, Tuesday, Wednesday',
    bio: 'Security researcher and penetration tester',
    skills: [
      { name: 'Python', level: 'Advanced' }, { name: 'Cybersecurity', level: 'Advanced' },
      { name: 'Linux', level: 'Advanced' }, { name: 'Java', level: 'Intermediate' },
      { name: 'Go', level: 'Intermediate' }, { name: 'Docker', level: 'Intermediate' },
    ],
    interests: ['Cybersecurity', 'Cloud Computing', 'Startups'],
    roles: ['Security Analyst', 'Backend Developer'],
    learningGoals: ['Blockchain', 'Rust'],
  });

  await createProfile(user7.id, {
    college: 'Georgia Tech', department: 'Computer Science', year: '2nd',
    experience: 'Intermediate', availability: 'Tuesday, Thursday, Saturday, Sunday',
    bio: 'Mobile developer and UI designer',
    skills: [
      { name: 'Flutter', level: 'Advanced' }, { name: 'Dart', level: 'Advanced' },
      { name: 'React', level: 'Intermediate' }, { name: 'UI/UX', level: 'Advanced' },
      { name: 'Figma', level: 'Advanced' }, { name: 'Firebase', level: 'Intermediate' },
      { name: 'Swift', level: 'Beginner' },
    ],
    interests: ['Mobile Development', 'Gaming', 'Social Impact'],
    roles: ['Mobile Developer', 'UI/UX Designer'],
    learningGoals: ['Kotlin', 'AR/VR'],
  });

  await createProfile(user8.id, {
    college: 'Georgia Tech', department: 'Computer Science', year: '3rd',
    experience: 'Intermediate', availability: 'Monday, Wednesday, Friday',
    bio: 'NLP researcher interested in language understanding',
    skills: [
      { name: 'Python', level: 'Advanced' }, { name: 'NLP', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Intermediate' }, { name: 'PyTorch', level: 'Advanced' },
      { name: 'Deep Learning', level: 'Advanced' }, { name: 'Data Science', level: 'Intermediate' },
    ],
    interests: ['AI/ML', 'Education', 'Research'],
    roles: ['Researcher', 'AI/ML Developer'],
    learningGoals: ['Computer Vision', 'MLOps'],
  });

  console.log('Student profiles created');

  const project1 = await prisma.project.create({
    data: {
      title: 'AI-Based Smart Campus',
      description: 'Building an AI-powered platform to optimize campus operations including smart scheduling, resource allocation, and student support chatbot. The system will use ML to predict classroom usage and recommend optimal study spaces.',
      domain: 'AI, Education',
      creatorId: user1.id,
      teamSize: 4,
      experienceLevel: 'Intermediate',
      availability: 'Monday, Wednesday, Friday',
      skills: {
        create: [
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Python' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Machine Learning' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'React' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Node.js' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'NLP' } }))!.id, required: false },
        ],
      },
      roles: {
        create: [
          { roleId: (await prisma.role.findUnique({ where: { name: 'AI/ML Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'Frontend Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'Backend Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'UI/UX Designer' } }))!.id, count: 1 },
        ],
      },
      interests: {
        create: [
          { interestId: (await prisma.interest.findUnique({ where: { name: 'AI/ML' } }))!.id },
          { interestId: (await prisma.interest.findUnique({ where: { name: 'Education' } }))!.id },
        ],
      },
    },
    include: { skills: true, roles: true, interests: true },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'HealthTrack - Wearable Health Monitor',
      description: 'Developing a mobile app that connects to wearable devices to track health metrics. Uses ML to detect anomalies and predict health issues. Features include real-time monitoring, health reports, and doctor consultation booking.',
      domain: 'Healthcare, IoT',
      creatorId: user6.id,
      teamSize: 3,
      experienceLevel: 'Intermediate',
      availability: 'Tuesday, Thursday, Saturday',
      skills: {
        create: [
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Flutter' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Python' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Machine Learning' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'IoT' } }))!.id, required: false },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Firebase' } }))!.id, required: true },
        ],
      },
      roles: {
        create: [
          { roleId: (await prisma.role.findUnique({ where: { name: 'Mobile Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'AI/ML Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'UI/UX Designer' } }))!.id, count: 1 },
        ],
      },
      interests: {
        create: [
          { interestId: (await prisma.interest.findUnique({ where: { name: 'Healthcare' } }))!.id },
          { interestId: (await prisma.interest.findUnique({ where: { name: 'IoT' } }))!.id },
        ],
      },
    },
    include: { skills: true, roles: true, interests: true },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'FinSecure - Blockchain Banking',
      description: 'Creating a decentralized banking platform using blockchain technology. Features include secure transactions, smart contracts for loans, and AI-powered fraud detection.',
      domain: 'FinTech, Blockchain',
      creatorId: user1.id,
      teamSize: 3,
      experienceLevel: 'Advanced',
      availability: 'Monday, Wednesday, Friday, Saturday',
      skills: {
        create: [
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Python' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Blockchain' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'Cybersecurity' } }))!.id, required: true },
          { skillId: (await prisma.skill.findUnique({ where: { name: 'React' } }))!.id, required: true },
        ],
      },
      roles: {
        create: [
          { roleId: (await prisma.role.findUnique({ where: { name: 'Backend Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'Frontend Developer' } }))!.id, count: 1 },
          { roleId: (await prisma.role.findUnique({ where: { name: 'Security Analyst' } }))!.id, count: 1 },
        ],
      },
      interests: {
        create: [
          { interestId: (await prisma.interest.findUnique({ where: { name: 'FinTech' } }))!.id },
          { interestId: (await prisma.interest.findUnique({ where: { name: 'Cybersecurity' } }))!.id },
        ],
      },
    },
    include: { skills: true, roles: true, interests: true },
  });

  console.log('Projects created');
  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
