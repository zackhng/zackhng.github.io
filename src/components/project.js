import styles from "@/styles/project.module.css";
import {
    SiPython,
    SiPytorch,
    SiTypescript,
    SiDocker,
    SiAndroid,
    SiOpenai,
    SiGoogle,
    SiNextdotjs,
    SiPrisma,
    SiSupabase,
    SiReact,
    SiNodedotjs,
    SiExpress,
    SiPostgresql,
    SiTailwindcss,
} from "react-icons/si";
import { FaJava, FaCode } from "react-icons/fa";

// Map a tech-stack label (as written in projects.json) to its brand icon.
const ICONS = {
    Python: SiPython,
    PyTorch: SiPytorch,
    TypeScript: SiTypescript,
    Docker: SiDocker,
    Java: FaJava,
    Android: SiAndroid,
    OpenAI: SiOpenai,
    Google: SiGoogle,
    "Next.js": SiNextdotjs,
    Prisma: SiPrisma,
    Supabase: SiSupabase,
    React: SiReact,
    "Node.js": SiNodedotjs,
    Express: SiExpress,
    PostgreSQL: SiPostgresql,
    Tailwind: SiTailwindcss,
};

export default function Project({ project }) {
    const { title, description, tech, role } = project;

    return (
        <div className={styles.card}>
            <div className={styles.titleBar}>
                <span className={styles.dot}>+</span>
                <span className={styles.title}>{title}</span>
                <span className={styles.role}>[{role}]</span>
            </div>

            <p className={styles.desc}>{description}</p>

            <div className={styles.techRow}>
                {tech.map((t) => {
                    const Icon = ICONS[t] || FaCode;
                    return (
                        <span key={t} className={styles.techTag}>
                            <Icon className={styles.techIcon} aria-hidden="true" />
                            {t}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
