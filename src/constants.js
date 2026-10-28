import frFlag from "./assets/fr-flag.png";
import spFlag from "./assets/sp-flag.png";
import jpnFlag from "./assets/jpn-flag.png";

export const LANGUAGES = [
	{ name: "French", flag: frFlag },
	{ name: "Spanish", flag: spFlag },
	{ name: "Japanese", flag: jpnFlag },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0].name;

// Greets you in the conversation column before anything has been translated,
// and stays put as the first bubble afterwards.
export const INTRO_MESSAGE = {
	id: "intro",
	role: "intro",
	text: "Select the language you want me to translate into, type your text and hit Translate!",
};
