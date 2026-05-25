import styles from './LandingPage.module.scss';

export default function LandingPage() {
    return (
        <div className={styles.pageWrapper}>
            {/* HEADER */}
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>Logo</div>
                    <nav className={styles.nav}>
                        <a href="#" className={styles.navLink}>Logo</a>
                        <a href="#" className={styles.navLink}>Logo</a>
                        <a href="#" className={styles.navLink}>Logo</a>
                        <a href="#" className={styles.navLink}>Logo</a>
                        <a href="#" className={styles.navLink}>Logo</a>
                    </nav>
                    <div className={styles.headerRight}>
                        <a href="#" className={styles.navLink}>Logo</a>
                        <button className={styles.btnPrimary}>Get Started</button>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroContent}>
                            <span className={styles.badge}>✦ Platform for your business</span>
                            <h1 className={styles.heroTitle}>Smart solutions for your business</h1>
                            <p className={styles.heroText}>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                            </p>
                            <button className={styles.btnPrimary}>Get Started</button>
                        </div>
                        <div className={styles.heroDashboard}>
                            {/* Заглушка под дашборд с графиками */}
                            <div className={styles.mockDashboard}>
                                <div className={styles.mockHeader}>
                                    <span>Overview</span>
                                    <span>...</span>
                                </div>
                                <div className={styles.mockMetrics}>
                                    <div>Earnings<br/><strong>$24,560</strong></div>
                                    <div>New Tasks<br/><strong>1,248</strong></div>
                                    <div>Opportunities<br/><strong>3.42%</strong></div>
                                </div>
                                <div className={styles.mockChart}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className={styles.features}>
                <div className={styles.container}>
                    <div className={styles.featuresIntro}>
                        <h2 className={styles.featuresTitle}>Everything you need to grow your business</h2>
                        <p className={styles.featuresDescription}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        </p>
                    </div>

                    <div className={styles.gridWrapper}>
                        {/* Top row (3 columns) */}
                        <div className={styles.rowThree}>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}>📊</span>
                                    <h3>Analytics & Reports</h3>
                                </div>
                                <p className={styles.cardText}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</p>
                                <a href="#" className={styles.cardLink}>Learn more</a>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}>⚙️</span>
                                    <h3>Process Automation</h3>
                                </div>
                                <p className={styles.cardText}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</p>
                                <a href="#" className={styles.cardLink}>Learn more</a>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}>🔌</span>
                                    <h3>Integrations</h3>
                                </div>
                                <p className={styles.cardText}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</p>
                                <a href="#" className={styles.cardLink}>Learn more</a>
                            </div>
                        </div>

                        {/* Bottom row (2 columns) */}
                        <div className={styles.rowTwo}>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}>🛡️</span>
                                    <h3>Data Security</h3>
                                </div>
                                <p className={styles.cardText}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</p>
                                <a href="#" className={styles.cardLink}>Learn more</a>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}>👥</span>
                                    <h3>Customer Management</h3>
                                </div>
                                <p className={styles.cardText}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</p>
                                <a href="#" className={styles.cardLink}>Learn more</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerMain}>
                        <div className={styles.footerBrand}>
                            <div className={styles.footerLogo}>Logo</div>
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.</p>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Product</h4>
                            <a href="#">Overview</a>
                            <a href="#">Features</a>
                            <a href="#">Solutions</a>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Solutions</h4>
                            <a href="#">Overview</a>
                            <a href="#">Features</a>
                            <a href="#">Solutions</a>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Resources</h4>
                            <a href="#">Overview</a>
                            <a href="#">Features</a>
                            <a href="#">Solutions</a>
                        </div>

                        <div className={styles.footerCol}>
                            <h4>Company</h4>
                            <a href="#">Overview</a>
                            <a href="#">Features</a>
                            <a href="#">Solutions</a>
                        </div>
                    </div>

                    <div className={styles.footerBottom}>
                        <div>© 2026 Logo. All rights reserved.</div>
                        <div className={styles.footerMeta}>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
