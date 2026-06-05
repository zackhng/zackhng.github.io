import HomeContent from "@/components/homeContent";
import TemplePanel from "@/components/templePanel";
import LeetCodeDashboard from "@/components/leetcodeDashboard";
import styles from "@/styles/home.module.css";

export default function Home() {
    return (
        <main className={styles.home}>
            <div className={styles.left}>
                <HomeContent />
            </div>
            <aside className={styles.right}>
                <TemplePanel />
                {/* gap reserved for the temple hover popup, which overlays it */}
                <div className={styles.leetcodeSlot}>
                    <LeetCodeDashboard />
                </div>
            </aside>
        </main>
    );
}
