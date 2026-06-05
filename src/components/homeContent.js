import intro from "@/data/introduction.json";
import projects from "@/data/projects.json";
import AsciiFrame from "@/components/asciiFrame";
import styles from "@/styles/homeContent.module.css";

const SKILL_GROUPS = [
    { key: "lang", title: "Languages" },
    { key: "frameworks", title: "Frameworks" },
    { key: "tools", title: "Tools" },
];

export default function HomeContent() {
    return (
        <div className={styles.content}>
            <section className={styles.hero}>
                <div className={styles.heroFrame}>
                    <AsciiFrame imagePath="/images/selfie.jpg" scale={0.24} alt={intro.name} />
                </div>
                <div className={styles.heroText}>
                    <p className={styles.kicker}>~/ portfolio</p>
                    <h1 className={styles.name}>{intro.name}</h1>
                    <p className={styles.lead}>{intro.shortIntro}</p>
                </div>
            </section>

            <section className={styles.section} id="about" style={{ scrollMarginTop: "6rem" }}>
                <p>{intro.passion}</p>
                <p>{intro.goal}</p>
                <p className={styles.edu}>{intro.education}</p>

                <div className={styles.skills}>
                    {SKILL_GROUPS.map((g) => (
                        <div key={g.key} className={styles.skillGroup}>
                            <span className={styles.skillTitle}>+ {g.title}</span>
                            <div className={styles.tags}>
                                {(intro.skills[g.key] || []).map((s) => (
                                    <span key={s} className={styles.tag}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.h2}>Projects</h2>
                <ul className={styles.projects}>
                    {projects.map((p) => (
                        <li key={p.id} className={styles.project}>
                            <span className={styles.projTitle}>{p.title}</span>
                            <span className={styles.projTech}>{p.tech.join(" · ")}</span>
                        </li>
                    ))}
                </ul>
                <a className={styles.more} href="/projects">
                    see all projects →
                </a>
            </section>

            <section className={styles.section} id="contact" style={{ scrollMarginTop: "6rem" }}>
                <h2 className={styles.h2}>Contact</h2>
                <p>
                    LinkedIn:{" "}
                    <a href={`https://${intro.links.linkedin}`} target="_blank" rel="noopener noreferrer">
                        {intro.links.linkedin}
                    </a>
                </p>
                <p>
                    Email: <a href={`mailto:${intro.links.email}`}>{intro.links.email}</a>
                </p>
                <p>
                    Phone: <a href={`tel:${intro.links.number}`}>{intro.links.number}</a>
                </p>
            </section>
        </div>
    );
}
