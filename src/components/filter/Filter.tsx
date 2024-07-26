import React, { useState, useRef } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import styles from "@/app/(with-nav)/logs/Logs.module.css";

interface FilterInputProps {
    className?: string;
    userId: string;
    collectionName: string;
    placeholder: string;
    filters: string[];
    setFilters: (filters: string[]) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ className, userId, collectionName, placeholder, filters, setFilters }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && suggestions.length > 0) {
            e.preventDefault();
            const selectedSuggestion = suggestions[activeSuggestionIndex];
            if (selectedSuggestion && !filters.includes(selectedSuggestion)) {
                setFilters([...filters, selectedSuggestion]);
            }
            e.currentTarget.value = "";
            setSuggestions([]);
        } else if (e.key === "Tab" && suggestions.length > 0) {
            e.preventDefault();
            const selectedSuggestion = suggestions[activeSuggestionIndex];
            if (selectedSuggestion && !filters.includes(selectedSuggestion)) {
                setFilters([...filters, selectedSuggestion]);
            }
            e.currentTarget.value = "";
            setSuggestions([]);
        } else if (e.key === "ArrowDown") {
            setActiveSuggestionIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % suggestions.length;
                scrollToSuggestion(newIndex);
                return newIndex;
            });
        } else if (e.key === "ArrowUp") {
            setActiveSuggestionIndex((prevIndex) => {
                const newIndex = (prevIndex - 1 + suggestions.length) % suggestions.length;
                scrollToSuggestion(newIndex);
                return newIndex;
            });
        }
    };

    const handleAutocomplete = async (searchQuery: string) => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            return;
        }

        const ref = collection(db, `users/${userId}/${collectionName}`);
        const q = query(ref, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'), limit(5));
        const querySnapshot = await getDocs(q);
        const fetchedSuggestions = querySnapshot.docs.map(doc => doc.data().name);
        setSuggestions(fetchedSuggestions);
        setActiveSuggestionIndex(0);
    };

    const removeFilter = (filterToRemove: string) => {
        setFilters(filters.filter(filter => filter !== filterToRemove));
    };

    const scrollToSuggestion = (index: number) => {
        if (suggestionsRef.current) {
            const listItems = suggestionsRef.current.children;
            if (listItems[index]) {
                listItems[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow click events to register
        setTimeout(() => setIsFocused(false), 200);
    };

    return (
        <div>
            <div className={styles.filterTags}>
                {filters.map((filter, index) => (
                    <span key={index} className={styles.filterTag}>
                        <span>{filter} </span>
                        <button type="button" onClick={() => removeFilter(filter)}>x</button>
                    </span>
                ))}
            </div>

            <input
                className={styles.filterInput}
                type="text"
                placeholder={placeholder}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => handleAutocomplete(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {isFocused && suggestions.length > 0 && (
                <ul className={styles.suggestions} ref={suggestionsRef}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={index === activeSuggestionIndex ? styles.activeSuggestion : ""}
                            onClick={() => {
                                if (!filters.includes(suggestion)) {
                                    setFilters([...filters, suggestion]);
                                }
                                setSuggestions([]);
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                }
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FilterInput;
