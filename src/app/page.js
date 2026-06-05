import HomeContent from "@/components/homeContent";
import TemplePanel from "@/components/templePanel";
import styles from "@/styles/home.module.css";

export default function Home() {
    return (
        <main className={styles.home}>
            <div className={styles.left}>
                <HomeContent />
            </div>
            <aside className={styles.right}>
                <TemplePanel />
            </aside>
        </main>
    );
}
