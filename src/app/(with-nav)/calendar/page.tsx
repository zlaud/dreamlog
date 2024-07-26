"use client";
import '@/styles/globals.css';
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Moon1 from "@/components/icons/Moon1";
import Moon2 from "@/components/icons/Moon2";
import Moon3 from "@/components/icons/Moon3";
import MonthNavigator from "@/components/MonthNavigator";
import styles from './Calendar.module.css';
import dayjs, { Dayjs } from "dayjs";

const CalendarPage = () => {
    const [user, loading, error] = useAuthState(auth);
    const [logs, setLogs] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const router = useRouter();

    useEffect(() => {
        const fetchLogs = async () => {
            if (user) {
                const userLogs = await getDocs(collection(db, `users/${user.uid}/logs`));
                const logsData = userLogs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setLogs(logsData);
            }
        };

        if (user) {
            fetchLogs();
        } else if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleMonthChange = (newDate: Dayjs) => {
        setCurrentMonth(newDate);
    };

    const getDaysInMonth = (date: Dayjs) => {
        const daysInMonth = [];
        const startOfMonth = date.startOf("month");
        const endOfMonth = date.endOf("month");

        for (let day = startOfMonth; day.isBefore(endOfMonth) || day.isSame(endOfMonth); day = day.add(1, "day")) {
            daysInMonth.push(day);
        }

        return daysInMonth;
    };

    const renderTileContent = (date: Dayjs) => {
        const log = logs.find(log => {
            const logDate = dayjs(log.createdAt.toDate());
            return logDate.isSame(date, 'day');
        });

        if (log) {
            switch (log.dreamType) {
                case 'Regular Dream':
                    return <Moon1 className={styles.moonIcon} />;
                case 'Nightmare':
                    return <Moon2 className={styles.moonIcon} />;
                default:
                    return <Moon3 className={styles.moonIcon} />;
            }
        }
        return null;
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const startDayOfMonth = currentMonth.startOf("month").day();

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className={styles.page}>
            {loading && <div>Loading...</div>}
            {user && (
                <div className={styles.calendar}>

                    <h1>Calendar</h1>
                    <MonthNavigator onMonthChange={handleMonthChange} />
                    <div className={styles.calendarGrid}>
                        {daysOfWeek.map(day => (
                            <div key={day} className={styles.dayHeader}>{day}</div>
                        ))}
                        {/* Add empty tiles for the days before the start of the month */}
                        {Array.from({ length: startDayOfMonth }).map((_, index) => (
                            <div key={`empty-${index}`} className={styles.dayTile}></div>
                        ))}
                        {daysInMonth.map((day) => (
                            <div key={day.format('YYYY-MM-DD')} className={styles.dayTile}>
                                <div>{day.format('D')}</div>
                                {renderTileContent(day)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
