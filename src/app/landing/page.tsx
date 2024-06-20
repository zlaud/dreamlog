'use client';

import Link from 'next/link';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    return (
        <div className={styles.landingPage}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>Dream Log</div>
                <div className={styles.authButtons}>
                    <Link href="/login"><button className={styles.loginButton}>Login</button></Link>
                    <Link href="/sign-up"><button className={styles.signupButton}>Sign Up</button></Link>
                </div>
            </nav>
            <div className={styles.mainContent}>
                <h1>Start Your Dream Journal Today</h1>
                <div className={styles.arrowContainer}>
                    <span className={styles.arrow}>↓</span>
                </div>
            </div>
            <div className={styles.secondaryContent}>
                <p>Dream Log is the easiest and fastest way to start journaling</p>
                <div className={styles.ctaButtons}>
                    <Link href="/sign-up"><button className={styles.ctaButton}>Sign Up Now</button></Link>
                    <Link href="/login"><button className={styles.ctaButton}>Login</button></Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;