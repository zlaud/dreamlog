import { useState } from "react";
import styles from "./ThumbnailDropdown.module.css";
import Moon1 from "@/components/icons/Moon1";
import Moon2 from "@/components/icons/Moon2";
import Moon3 from "@/components/icons/Moon3";

const thumbnails = [
    { id: "Moon1", component: <Moon1 className={styles.thumbnail} /> },
    { id: "Moon2", component: <Moon2 className={styles.thumbnail} /> },
    { id: "Moon3", component: <Moon3 className={styles.thumbnail} /> },
];

const ThumbnailDropdown = ({ selectedThumbnail, setSelectedThumbnail }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (id) => {
        setSelectedThumbnail(id);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
                {thumbnails.find((thumbnail) => thumbnail.id === selectedThumbnail)?.component}
            </div>
            {isOpen && (
                <div className={styles.options}>
                    {thumbnails.map((thumbnail) => (
                        <div
                            key={thumbnail.id}
                            className={styles.option}
                            onClick={() => handleSelect(thumbnail.id)}
                        >
                            {thumbnail.component}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThumbnailDropdown;
