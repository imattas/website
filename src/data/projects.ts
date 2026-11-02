export const projects = [
  {
    title: "GSpots",
    description: "A reusable C++ static library for scanning Unreal Engine binaries and reporting useful engine and offset information.",
    tags: ["C++", "Unreal Engine", "Reverse Engineering"],
    link: "https://github.com/imattas/GSpots",
    status: "Active",
  },
  {
    title: "Vectora",
    description: "A browser-first graphing studio with a symbolic math engine for curves, vector fields, probability, complex functions, and 3D surfaces.",
    tags: ["TypeScript", "Math", "WebGL"],
    link: "https://github.com/imattas/vectora",
    status: "Active",
  },
  {
    title: "kernel-and-boot",
    description: "A custom x86_64 kernel and bootloader built from scratch with C and Assembly, targeting UEFI and QEMU.",
    tags: ["C", "Assembly", "UEFI", "QEMU"],
    link: "https://github.com/imattas/kernel-and-boot",
    status: "In progress",
  },
  {
    title: "binobf",
    description: "A deterministic native binary transformation and selected-function virtualization framework with fail-closed verification.",
    tags: ["C++", "LLVM", "Binary Analysis"],
    link: "https://github.com/imattas/binobf",
    status: "Maintained",
  },
  {
    title: "atlas",
    description: "A from-scratch CTF math, symbolic-solving, and hardware-accelerated search platform for reversing and cryptography research.",
    tags: ["Rust", "Symbolic Execution", "GPU"],
    link: "https://github.com/imattas/atlas",
    status: "Active research",
  },
  {
    title: "TensorStudio",
    description: "A compact C++ tensor and autograd engine with a Python API for learning, experimentation, and lightweight machine-learning workloads.",
    tags: ["C++", "Python", "Autograd"],
    link: "https://github.com/imattas/TensorStudio",
    status: "Active",
  },
] as const;
