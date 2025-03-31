
import { supabase } from "../src/integrations/supabase/client";

// Sample Categories
const categories = [
  { id: "languages", name: "Languages" },
  { id: "science", name: "Science" },
  { id: "mathematics", name: "Mathematics" },
  { id: "history", name: "History" },
  { id: "technology", name: "Technology" },
];

// Sample decks with cards
const sampleDecks = [
  {
    title: "Spanish Vocabulary Basics",
    description: "Essential Spanish words and phrases for beginners",
    category: "languages",
    color: "bg-primary",
    is_public: true,
    cards: [
      { front: "Hello", back: "Hola", example: "Hola, ¿cómo estás?" },
      { front: "Goodbye", back: "Adiós", example: "Adiós, hasta mañana" },
      { front: "Thank you", back: "Gracias", example: "Muchas gracias por tu ayuda" },
      { front: "Please", back: "Por favor", example: "Por favor, pásame el libro" },
      { front: "How are you?", back: "¿Cómo estás?", example: "¿Cómo estás hoy?" },
    ],
  },
  {
    title: "Basic Physics Concepts",
    description: "Fundamental principles and equations of physics",
    category: "science",
    color: "bg-green-500",
    is_public: true,
    cards: [
      { front: "Newton's First Law", back: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.", example: "A book on a table remains at rest until a force moves it." },
      { front: "Newton's Second Law", back: "F = ma (Force equals mass times acceleration)", example: "Pushing a shopping cart - the more mass in the cart, the more force needed for the same acceleration." },
      { front: "Newton's Third Law", back: "For every action, there is an equal and opposite reaction.", example: "When a bird pushes down on air with its wings, the air pushes back up and lifts the bird." },
      { front: "Law of Conservation of Energy", back: "Energy cannot be created or destroyed, only transformed from one form to another.", example: "A pendulum converting between potential and kinetic energy." },
    ],
  },
  {
    title: "JavaScript Fundamentals",
    description: "Core concepts of JavaScript programming language",
    category: "technology",
    color: "bg-yellow-500",
    is_public: true,
    cards: [
      { front: "Variable Declaration", back: "let, const, var", example: "let name = 'John'; const PI = 3.14159;" },
      { front: "Array Methods", back: "push(), pop(), map(), filter(), reduce()", example: "const newArray = [1,2,3].map(x => x * 2); // [2,4,6]" },
      { front: "Function Declaration", back: "function name() {} vs const name = () => {}", example: "function add(a, b) { return a + b; }" },
      { front: "Objects", back: "Collections of key-value pairs", example: "const person = { name: 'John', age: 30 };" },
      { front: "Promises", back: "Objects representing eventual completion/failure of an async operation", example: "fetch('/api/data').then(response => response.json())" },
    ],
  },
  {
    title: "World War II Timeline",
    description: "Key events and dates of the Second World War",
    category: "history",
    color: "bg-red-500",
    is_public: true,
    cards: [
      { front: "When did World War II begin?", back: "September 1, 1939", example: "Germany invaded Poland, triggering declarations of war by France and Britain." },
      { front: "Battle of Britain", back: "July-October 1940", example: "Air campaign waged by Nazi Germany against the United Kingdom." },
      { front: "Attack on Pearl Harbor", back: "December 7, 1941", example: "Surprise military strike by Japan against the US naval base at Pearl Harbor, Hawaii." },
      { front: "D-Day (Normandy landings)", back: "June 6, 1944", example: "Allied invasion of Normandy, the largest seaborne invasion in history." },
      { front: "When did World War II end?", back: "September 2, 1945", example: "Japan formally surrendered on the deck of the USS Missouri." },
    ],
  },
  {
    title: "Mathematics: Basic Algebra",
    description: "Fundamental algebraic concepts and formulas",
    category: "mathematics",
    color: "bg-purple-500",
    is_public: true,
    cards: [
      { front: "Linear Equation", back: "An equation where the highest power of the variable is 1", example: "y = mx + b" },
      { front: "Quadratic Formula", back: "x = (-b ± √(b² - 4ac)) / 2a", example: "Used to solve ax² + bx + c = 0" },
      { front: "Polynomial", back: "An expression of more than two algebraic terms", example: "x³ + 2x² - 4x + 7" },
      { front: "FOIL Method", back: "First, Outer, Inner, Last - used to multiply binomials", example: "(a+b)(c+d) = ac + ad + bc + bd" },
      { front: "Factoring", back: "Finding expressions that multiply to give the original expression", example: "x² - 4 = (x-2)(x+2)" },
    ],
  },
];

export const seedDatabase = async () => {
  // Insert sample decks and cards
  for (const deckData of sampleDecks) {
    const { cards, ...deck } = deckData;
    
    // Insert deck
    const { data: newDeck, error: deckError } = await supabase
      .from("decks")
      .insert(deck)
      .select()
      .single();
    
    if (deckError) {
      console.error("Error inserting deck:", deckError);
      continue;
    }
    
    // Insert cards for this deck
    for (const card of cards) {
      const cardWithDeckId = { ...card, deck_id: newDeck.id };
      const { error: cardError } = await supabase
        .from("cards")
        .insert(cardWithDeckId);
      
      if (cardError) {
        console.error("Error inserting card:", cardError);
      }
    }
  }
  
  return { success: true };
};
