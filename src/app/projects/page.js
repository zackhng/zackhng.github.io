import Project from "@/components/project";
import projects from "@/data/projects.json";
import styles from "@/styles/project.module.css";

export default function Projects() {
    return (
        <main className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.h1}>~/projects</h1>
                <p className={styles.subtitle}>Things I&apos;ve built and contributed to.</p>
            </div>

            <div className={styles.grid}>
                {projects.map((p) => (
                    <Project key={p.id} project={p} />
                ))}
            </div>
        </main>
    );
}
