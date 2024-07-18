import React, { useState, useRef } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import styles from "@/app/(with-nav)/logs/Logs.module.css";

interface TagInputProps {
    userId: string;
    collectionName: string;
    placeholder: string;
    tags: string[];
    setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ userId, collectionName, placeholder, tags, setTags }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
            const newTag = e.currentTarget.value.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            e.currentTarget.value = "";
            setSuggestions([]);
        } else if (e.key === "Tab" && suggestions.length > 0) {
            e.preventDefault();
            const selectedSuggestion = suggestions[activeSuggestionIndex];
            if (selectedSuggestion && !tags.includes(selectedSuggestion)) {
                setTags([...tags, selectedSuggestion]);
            }
            e.currentTarget.value = "";
            setSuggestions([]);
        } else if (e.key === "ArrowDown") {
            setActiveSuggestionIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            setActiveSuggestionIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
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

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div >
            {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
          {tag}
                    <button type="button" onClick={() => removeTag(tag)}>x</button>
        </span>
            ))}
            <input
                type="text"
                placeholder={placeholder}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => handleAutocomplete(e.target.value)}
            />
            {suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={index === activeSuggestionIndex ? styles.activeSuggestion : ""}
                            onClick={() => {
                                if (!tags.includes(suggestion)) {
                                    setTags([...tags, suggestion]);
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

export default TagInput;
