"use client";
import { useEffect, useState, useRef } from "react";
import styles from './LandingPage.module.css';
import Link from "next/link";
import Cloud1 from '@/components/icons/Cloud1';
import Cloud2 from '@/components/icons/Cloud2';

type TabName = 'details' | 'customization' | 'reflection';

const Home = () => {
    const [activeTab, setActiveTab] = useState<TabName>('details');
    const [moveClouds, setMoveClouds] = useState(false);
    const featureRef = useRef(null);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        if (scrollPercentage > 10) {
            setMoveClouds(true);
            document.body.style.overflowX = 'hidden';
        } else {
            setMoveClouds(false);
            document.body.style.overflowX = 'hidden';
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const opentab = (tabname: TabName) => {
        setActiveTab(tabname);
    };

    return (
        <div className={styles.landingPage}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>Dream Log</div>
                <div className={styles.authButtons}>
                    <Link href="/login">
                        <button className={styles.loginButton}>Login</button>
                    </Link>
                </div>
            </nav>

            <div className={styles.header}>
                <h1>Capture Your Dreams with Ease</h1>
                <p>Dream Log can make your journaling journal easy and fast</p>
                <div>
                    <Link href="/sign-up">
                        <span className={styles.hsb}>Get Started For Free</span>
                    </Link>
                </div>

            </div>
            <div className={styles.arrow}>
                <span>↓</span>
            </div>


            <div className={styles.cloud}>
                <Cloud1 className={styles.cloud1} style={{ transform: moveClouds ? 'translateX(-100%)' : 'translateX(0)' }} />
                <Cloud2 className={styles.cloud2} style={{ transform: moveClouds ? 'translateX(100%)' : 'translateX(0)' }} />
            </div>

            <div ref={featureRef} className={styles.features}>
                <h1>Features</h1>
                <div className={styles.tabTitles}>
                    <p
                        className={`${styles.tabLinks} ${activeTab === 'details' ? styles.activeLink : ''}`}
                        onClick={() => opentab('details')}
                    >
                        Details
                    </p>
                    <p
                        className={`${styles.tabLinks} ${activeTab === 'customization' ? styles.activeLink : ''}`}
                        onClick={() => opentab('customization')}
                    >
                        Customization
                    </p>
                    <p
                        className={`${styles.tabLinks} ${activeTab === 'reflection' ? styles.activeLink : ''}`}
                        onClick={() => opentab('reflection')}
                    >
                        Reflection
                    </p>
                </div>

                <div className={styles.tabContents}>
                    {activeTab === 'details' && (
                        <div className={styles.tabContent}>
                            Make detailed entries by adding the people you saw, places you've been to,
                            emotions you felt etc.
                            <img className={styles.image} src={'images/replacable1.png'} />
                        </div>
                    )}
                    {activeTab === 'customization' && (
                        <div className={styles.tabContent}>
                            Customize your logs by adding custom icons for everything.
                            <img className={styles.image} src={'images/replacable1.png'} />
                        </div>
                    )}
                    {activeTab === 'reflection' && (
                        <div className={styles.tabContent}>
                            Search and filter your past logs and reflect.
                            <img className={styles.image} src={'images/replacable1.png'} />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.gettingStarted}>
                <div>Getting started is as easy as just signing up and clicking on New Entry</div>
                <div>Journal, Explore & Reflect</div>
            </div>

            <div className={styles.secondaryContent}>
                <p>Dream Log is the easiest and fastest way to start journaling</p>
                <div className={styles.ctaButtons}>
                    <Link href="/sign-up"><span className={styles.ctaButton}>Sign Up Now</span></Link>
                    <Link href="/login"><span className={styles.ctaButton}>Login</span></Link>
                </div>
            </div>
        </div>
    );
};

export default Home;


// const [scrollY, setScrollY] = useState(0);
// const handleScroll = () => {
//     setScrollY(window.scrollY);
// };
//
// useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//         window.removeEventListener('scroll', handleScroll);
//     };
// }, []);

{/*<div className={styles.cloud} style={{ transform: `translateY(${scrollY * 0.5}px)` }}>*/}
{/*    <Cloud1 className={styles.cloud1} style={{ transform: `translateX(-${scrollY * 0.5}px)` }} />*/}
{/*    <Cloud2 className={styles.cloud2} style={{ transform: `translateX(${scrollY * 0.5}px)` }} />*/}
{/*</div>*/}