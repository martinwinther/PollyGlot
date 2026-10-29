import frFlag from "./assets/fr-flag.png";
import spFlag from "./assets/sp-flag.png";
import jpnFlag from "./assets/jpn-flag.png";

// `code` is what the track chip shows; `name` is what the model is asked
// for, what the screen reader announces and what labels the translation
export const LANGUAGES = [
	{ name: "French", code: "FR", flag: frFlag },
	{ name: "Spanish", code: "ES", flag: spFlag },
	{ name: "Japanese", code: "JA", flag: jpnFlag },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0].name;

// Opens the cue list as a title card, and stays put as the first cue
// once there are real exchanges above it
export const INTRO_MESSAGE = {
	id: "intro",
	role: "intro",
	text: "Choose a language below, type a line and hit send.",
};
