"use client";
import { useEffect, useState, useRef } from "react";
import styles from './LandingPage.module.css';
import Link from "next/link";
type TabName = 'details' | 'customization' | 'reflection';

const Home = () => {
    const [activeTab, setActiveTab] = useState<TabName>('details');
    const featureRef = useRef(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=> {
        setLoading(false);
    })


    const opentab = (tabname: TabName) => {
        setActiveTab(tabname);
    };



    return (
        <div className={styles.page}>
            {loading}
            {!loading && (
            <div className={styles.landingPage}>

                <nav className={styles.navbar}>
                    <div className={styles.logo}>Dream Log</div>
                    <div className={styles.authButtons}>
                        <Link href="/login">
                            <button className={styles.loginButton}>Login</button>
                        </Link>
                    </div>

                </nav>
                <div className={styles.curves1}>
                </div>

                <div className={styles.header}>
                    <h1 className={styles.fadeIn}>Capture Your Dreams with Ease</h1>
                    <p className={styles.fadeIn}>Dream Log can make your journaling journal easy and fast</p>
                    <div className={styles.hsb}>
                        <Link href="/sign-up">
                            <span >Get Started For Free</span>
                        </Link>
                    </div>
                </div>
                <h1 className={styles.featuresText}>See Features</h1>
                <div className={styles.arrow}>
                    <span>↓</span>
                </div>
                <div ref={featureRef} className={styles.features}>

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

                <div className={styles.bubble}>
                </div>
                <div className={styles.bubblebg}>
                </div>
                <div className={styles.blur}></div>
                <div className={styles.secondaryContent}>
                    <p>Dream Log is the easiest and fastest way to start journaling</p>
                    <Link href="/sign-up"><span className={styles.ctaButton}>Sign Up Now</span></Link>
                </div>

                <div className={styles.contacts}>
                    <h1> Contacts </h1>
                    <div className={styles.us}>

                        <div className={styles.jhkim}>
                            <img className={styles.pfp} src={"https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"}/>
                            <h2> Juhyun Kim </h2>
                            <p> Email: isweartogodthisisntme@gmail.com</p>
                            <p> Linkedin: <Link href={"Linkedin: www.linkedin.com/in/iswearthisisntme"}> /in/iswearthisisntme</Link></p>
                            <p>GitHub: <Link href={"https://github.com/Iswearthisisntme"}>  github.com/Iswearthisisntme</Link></p>
                        </div>

                        <div className={styles.zlaud}>
                            <img className={styles.pfp} src={"https://media.npr.org/assets/img/2011/12/08/rat-d80bf1ebda9726e2772eecb934e881eeeb6023b5.jpg"}/>

                            <h2> Zophia K. Laud </h2>
                            <p> Email: laudkimberly@gmail.com</p>
                            <p> Linkedin: <Link href={"https://www.linkedin.com/in/zophia-laud/"}> /in/zophia-laud</Link></p>
                            <p>GitHub: <Link href={"GitHub: https://github.com/zlaud"}> github.com/zlaud</Link></p>
                        </div>
                    </div>


                    <h2>We securely store our user's data through <Link href={"https://firebase.google.com/"}> Firebase </Link>  :)</h2>

                </div>
            </div>

            )}
        </div>



    );
};

export default Home;


