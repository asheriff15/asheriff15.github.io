// Everything personal lives here. Edit this file to change the site's details.

export const site = {
  name: "Adnan Sheriff",
  tagline: "Cloud & security engineer in training",
  intro:
    "I build AWS and Azure environments, break them on purpose, and write up exactly how I found and fixed the problem.",

  // Set to "/resume.pdf" after adding the file to /public. null hides the button.
  resumeUrl: null as string | null,

  // null hides the link.
  email: "adnansheriff.cyber@gmail.com" as string | null,
  github: "https://github.com/asheriff15",
  linkedin: "https://www.linkedin.com/in/adnan-s-058305439" as string | null,

  about: [
    "I work on the Cybersecurity, Networks & Telecom team at Fairfax Water, where I triage SIEM alerts, run vulnerability scans and help manage identity and endpoints.",
    "Outside of work I'm studying cybersecurity at George Mason University and working through a DevOps roadmap: Linux, Docker, Terraform, CI/CD and Kubernetes. Every lab I build ends up written up here.",
  ],

  skills: [
    "AWS",
    "Azure",
    "Entra ID",
    "IAM & least privilege",
    "SIEM",
    "Tenable Nessus",
    "Linux",
    "Git",
    "Docker",
    "Terraform",
    "GitHub Actions",
    "Kubernetes",
  ],

  timeline: [
    { when: "Now", what: "IT Network Analyst", where: "Fairfax Water · Cybersecurity, Networks & Telecom" },
    { when: "2028", what: "B.A.S. Cybersecurity", where: "George Mason University" },
    { when: "Earned", what: "CompTIA Security+", where: "Certification" },
    { when: "Earned", what: "A.A.S. Information Technology", where: "Northern Virginia Community College" },
  ],
};
