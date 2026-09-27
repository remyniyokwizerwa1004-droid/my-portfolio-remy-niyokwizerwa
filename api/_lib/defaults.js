// Sample content shown until the first save from /admin.
export const DEFAULT_CONTENT = {
  name: 'Niyokwizerwa Remy',
  title: 'Electronics & Telecommunication Engineer',
  location: 'Kigali, Rwanda',
  tagline: 'Designing reliable circuits and connected systems that keep people and communities communicating.',
  status: 'Open to opportunities',
  photo: '',
  cv: '',

  about:
    "I'm Niyokwizerwa Remy, an Electronics and Telecommunication Engineer based in Kigali, Rwanda. I've been fascinated by how signals travel, how circuits think, and how technology connects people for as long as I can remember.\n\n" +
    'My work sits where hardware meets communication: designing and troubleshooting electronic circuits, building embedded systems, and maintaining the telecom and network infrastructure that people rely on every day.\n\n' +
    "I enjoy turning complex technical problems into practical, dependable solutions, and I'm always learning, whether that's a new microcontroller, a wireless standard, or a better way to analyze a signal.",
  degree: 'BSc. Electronics & Telecom Eng.',
  stats: [
    { value: '2+', label: 'Years experience' },
    { value: '10+', label: 'Projects built' },
    { value: '5+', label: 'Technologies' },
  ],

  email: 'remy@example.com',
  phone: '+250 7XX XXX XXX',
  contactText: "Have a project, a role, or a question in mind? I'd be glad to hear from you.",
  socials: [
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/your-profile' },
    { platform: 'github', url: 'https://github.com/your-username' },
  ],

  education: [
    {
      title: "Bachelor's Degree in Electronics and Telecommunication Engineering",
      org: 'University of Rwanda — College of Science and Technology',
      dates: '2019 – 2023',
      description:
        'Studied analog and digital electronics, communication systems, signal processing, microwave and antenna engineering, and computer networks. Final-year project on IoT-based environmental monitoring.',
      tags: ['Communication Systems', 'Digital Electronics', 'Signal Processing', 'Networks'],
    },
    {
      title: 'Advanced Level (A2) Secondary School Certificate',
      org: 'Sample Secondary School, Rwanda',
      dates: '2016 – 2018',
      description:
        'Combination in Mathematics, Physics and Computer Science (MPC). Built a strong foundation in physics, applied mathematics and problem solving.',
      tags: [],
    },
  ],

  experience: [
    {
      title: 'Telecommunications Technician',
      org: 'Sample Telecom Company Ltd, Kigali',
      dates: 'Jan 2024 – Present',
      bullets: [
        'Install, configure and maintain base station and transmission equipment across field sites.',
        'Diagnose network faults and perform signal-strength and coverage measurements.',
        'Support fiber and microwave link commissioning and preventive maintenance.',
      ],
      tags: ['BTS / RAN', 'Microwave Links', 'Fiber Optics', 'Troubleshooting'],
    },
    {
      title: 'Electronics Intern',
      org: 'Sample Electronics Workshop, Kigali',
      dates: 'Jun 2022 – Sep 2022',
      bullets: [
        'Assembled, tested and repaired electronic circuit boards and power supplies.',
        'Programmed microcontrollers for small automation and sensing prototypes.',
        'Documented test procedures and component inventories.',
      ],
      tags: ['Soldering', 'Arduino', 'Circuit Testing'],
    },
  ],

  skills: [
    { name: 'Circuit Design', description: 'Analog & digital circuit design, simulation and prototyping.', level: 88, icon: 'chip' },
    { name: 'Telecommunications', description: 'Mobile networks, RF fundamentals, transmission and link planning.', level: 90, icon: 'radio' },
    { name: 'Embedded Systems', description: 'Microcontrollers (Arduino, ESP32, STM32), sensors and firmware.', level: 82, icon: 'cpu' },
    { name: 'Programming', description: 'C for embedded targets and Python for automation and data analysis.', level: 78, icon: 'code' },
    { name: 'Networking', description: 'TCP/IP, routing & switching, LAN/WAN setup and troubleshooting.', level: 80, icon: 'network' },
    { name: 'PCB Design', description: 'Schematic capture and board layout in KiCad / EasyEDA.', level: 75, icon: 'board' },
    { name: 'Signal Processing', description: 'Filtering, modulation and spectrum analysis with MATLAB / Python.', level: 76, icon: 'wave' },
    { name: 'Problem Solving', description: 'Methodical fault finding and practical, reliable solutions.', level: 92, icon: 'bulb' },
  ],

  projects: [
    {
      title: 'IoT Weather Station',
      description: 'A wireless sensor network measuring temperature, humidity and pressure, streaming readings to a live web dashboard.',
      images: [],
      tags: ['ESP32', 'MQTT', 'Python'],
      link: '',
      linkLabel: '',
    },
    {
      title: 'GSM Signal Analyzer',
      description: 'A portable tool that measures cellular signal strength and logs coverage data to help locate weak network areas.',
      images: [],
      tags: ['GSM Module', 'C', 'Data Logging'],
      link: '',
      linkLabel: '',
    },
    {
      title: 'Smart Home Controller',
      description: 'An embedded system for home automation that controls lights and appliances remotely and responds to sensor triggers.',
      images: [],
      tags: ['Arduino', 'Relays', 'Bluetooth'],
      link: '',
      linkLabel: '',
    },
  ],

  references: [
    { name: 'Dr. Jean Mugisha', role: 'Senior Lecturer', org: 'University of Rwanda, Dept. of Electrical & Electronics Engineering', email: 'reference1@example.com', phone: '+250 7XX XXX XXX' },
    { name: 'Alice Uwase', role: 'Network Operations Manager', org: 'Sample Telecom Company Ltd', email: 'reference2@example.com', phone: '+250 7XX XXX XXX' },
    { name: 'Eric Niyonzima', role: 'Workshop Supervisor', org: 'Sample Electronics Workshop', email: 'reference3@example.com', phone: '+250 7XX XXX XXX' },
  ],
};
