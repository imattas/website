export interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  link: string;
  year: string;
  status: string;
  outcome: string;
}

export interface Skill {
  name: string;
  level: number;
  color: string;
}

export interface SkillGroup {
  title: string;
  description: string;
  tools: string[];
  color: string;
}

export interface RoadmapItem {
  label: string;
  title: string;
  detail: string;
}

export const projects: Project[] = [
  {
    title: "GSpots",
    description:
      "A reusable C++ static library for scanning Unreal Engine binaries and reporting useful engine and offset information.",
    tags: ["C++", "Unreal Engine", "Reverse Engineering", "Static Library"],
    gradient: "linear-gradient(135deg, #ff4d00, #ffb800)",
    link: "https://github.com/imattas/GSpots",
    year: "Current",
    status: "Active",
    outcome: "Reusable scanning components with file-only and memory-aware workflows.",
  },
  {
    title: "Vectora",
    description:
      "A browser-first graphing studio with a symbolic math engine for curves, vector fields, probability, complex functions, and 3D surfaces.",
    tags: ["TypeScript", "Math", "WebGL", "Symbolic Engine"],
    gradient: "linear-gradient(135deg, #2f6bff, #c6f432)",
    link: "https://github.com/imattas/vectora",
    year: "Current",
    status: "Active",
    outcome: "Shareable interactive math graphs with no server or account required.",
  },
  {
    title: "kernel-and-boot",
    description:
      "A custom x86_64 kernel and bootloader built fully from scratch with C and Assembly, targeting UEFI and QEMU.",
    tags: ["C", "Assembly", "UEFI", "QEMU"],
    gradient: "linear-gradient(135deg, #ff4d00, #2f6bff)",
    link: "https://github.com/imattas/kernel-and-boot",
    year: "Current",
    status: "In progress",
    outcome: "A first-principles learning project for boot, memory, and execution.",
  },
  {
    title: "binobf",
    description:
      "A deterministic native binary transformation and selected-function virtualization framework with fail-closed verification.",
    tags: ["C++", "LLVM", "Obfuscation", "Binary Analysis"],
    gradient: "linear-gradient(135deg, #c6f432, #2f6bff)",
    link: "https://github.com/imattas/binobf",
    year: "Current",
    status: "Maintained",
    outcome: "Behavior-preserving transformations with differential verification.",
  },
  {
    title: "atlas",
    description:
      "A from-scratch CTF math, symbolic-solving, and hardware-accelerated search platform for reversing and cryptography research.",
    tags: ["Rust", "Symbolic Execution", "GPU", "CTF"],
    gradient: "linear-gradient(135deg, #ff4d00, #ffb800)",
    link: "https://github.com/imattas/atlas",
    year: "Current",
    status: "Active research",
    outcome: "Reusable solver infrastructure for difficult reverse-engineering problems.",
  },
  {
    title: "TensorStudio",
    description:
      "A compact C++ tensor and autograd engine with a Python API for learning, experimentation, and lightweight machine-learning workloads.",
    tags: ["C++", "Python", "Autograd", "Machine Learning"],
    gradient: "linear-gradient(135deg, #2f6bff, #ff4d00)",
    link: "https://github.com/imattas/TensorStudio",
    year: "Current",
    status: "Active",
    outcome: "A compact native foundation for tensors, gradients, and ML experimentation.",
  },
];

export const skills: Skill[] = [
  { name: "C / C++", level: 92, color: "#ff4d00" },
  { name: "Python", level: 90, color: "#2f6bff" },
  { name: "Rust", level: 85, color: "#c6f432" },
  { name: "Assembly", level: 80, color: "#14120f" },
  { name: "Reverse Engineering", level: 88, color: "#ff4d00" },
  { name: "Binary Analysis", level: 85, color: "#2f6bff" },
  { name: "Cryptography", level: 78, color: "#c6f432" },
  { name: "TypeScript / JS", level: 75, color: "#14120f" },
];

export const skillGroups: SkillGroup[] = [
  { title: "Reverse engineering", description: "Understanding software behavior when the source is missing, misleading, or only part of the story.", tools: ["Ghidra", "IDA", "Binary Ninja", "WinDbg", "x64dbg"], color: "#ff4d00" },
  { title: "Malware analysis", description: "Following execution, persistence, and communication paths to separate behavior from assumptions.", tools: ["Static analysis", "Dynamic analysis", "Debuggers", "YARA", "Sandboxing"], color: "#2f6bff" },
  { title: "Systems programming", description: "Building close to the machine, from boot paths to memory, concurrency, and execution.", tools: ["Kernels", "Bootloaders", "Windows", "Linux", "Memory", "Concurrency"], color: "#2f6bff" },
  { title: "Security research", description: "Tracing attack surface, validating behavior, and documenting conclusions that hold up to scrutiny.", tools: ["Binary analysis", "Cryptography", "Fuzzing", "Threat modeling", "Vulnerability research"], color: "#ff4d00" },
  { title: "CTF methodology", description: "Breaking unfamiliar challenges into observable behavior, hypotheses, tests, and reproducible solves.", tools: ["Reversing", "Crypto", "Pwn", "Web", "Forensics"], color: "#2f6bff" },
  { title: "Research tooling", description: "Turning repeated investigation work into tools that are easier to reuse, measure, and verify.", tools: ["Python", "TypeScript", "Z3", "LLVM", "Git"], color: "#14120f" },
];

export const programmingLanguages: Skill[] = [
  { name: "C / C++", level: 92, color: "#ff4d00" },
  { name: "Python", level: 90, color: "#2f6bff" },
  { name: "Rust", level: 85, color: "#c6f432" },
  { name: "Assembly", level: 80, color: "#14120f" },
  { name: "TypeScript / JS", level: 75, color: "#ff4d00" },
  { name: "Java", level: 70, color: "#2f6bff" },
  { name: "C#", level: 68, color: "#c6f432" },
  { name: "Zig", level: 62, color: "#14120f" },
];

export const roadmap: RoadmapItem[] = [
  { label: "Before 2025", title: "Low-level curiosity", detail: "Started learning how programs, memory, and operating systems actually work." },
  { label: "December 2025", title: "idktheflag begins", detail: "Joined idktheflag when the security team was created, then grew into its owner and captain." },
  { label: "July 2026", title: "Diagnosis", detail: "Diagnosed with dysgraphia and autism, giving clearer language to how I learn, work, and communicate." },
  { label: "Ongoing", title: "Build + document", detail: "Building systems tooling, operating redsecc, leading idktheflag, and publishing reproducible research." },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/imattas" },
  { label: "Website", href: "https://ianmattas.com" },
  { label: "idktheflag", href: "https://idktheflag.sh" },
  { label: "Email", href: "mailto:ian@mattas.net" },
];
