                                                **AiTherapist: Agentic Emotional Intelligence System:**

**1. The Vision:**
   
Most AI "therapists" are simple wrappers around a chat API. AiTherapist is built to be different. It is an agentic support platform designed to move beyond simple response-generation. By leveraging structured agentic workflows, it aims to provide cognitive-behavioral insights through a stateful, context-aware interface.


The Problem:
- Context Fragmentation: Traditional LLM chats lose the "thread" of emotional progress.
- Lack of Structure: Standard AI responses are often too generic or lack a framework (e.g., CBT, Stoicism).

The Solution:
- Agentic Orchestration: Using the Gemini SDK to process not just text, but the intent and emotional state of the user.

- TypeScript-First Architecture: Ensuring high reliability and structured data flow in sensitive conversational contexts.

  

**2. Technical Architecture:**

Ai Therapist is built on a modern, reactive stack designed for low-latency and high type-safety.

The Stack:
- Frontend: Next.js (App Router) for optimized rendering and routing.

- Language: TypeScript (Strict Mode) to manage complex state and API schemas.

- AI Engine: Gemini SDK for high-performance natural language understanding.

- Styling: Tailwind CSS for a minimalist, "calm" user experience.



**3. Key Engineering Patterns**
  
- Structured Prompting: Utilizing system instructions to enforce a "supportive listener" persona while maintaining strict safety guardrails.

- Stateful Memory Management: (Planned/Implemented) Strategies to maintain conversation depth without hitting token caps or losing architectural focus.



                                                               **  Getting Started:**

  
**1. Prerequisites**
- Node.js 18.x or higher

A Gemini API Key (via Google AI Studio)




**2. Installation:**
- Clone the repository:

git clone https://github.com/Malikzee24/AiTherapist.git

cd AiTherapist



**3. Install dependencies:**

   Bash npm install
   

**4. Environment Setup:**
   Create a .env.local file in the root directory:

   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here

   

**5. Run Development Server:**
   
npm run dev

The app will be live at http://localhost:3000



                                                       **Roadmap & Strategic Evolution:**
                                

**Phase 1: Core Chat Integration**

**Phase 2: Sentiment Analysis Dashboard – visualizing emotional trends over time.**

**Phase 3: RAG Integration – allowing the agent to "remember" specific user-defined goals or past breakthroughs.**

**Phase 4: Multi-modal Support – voice-to-text for more natural interaction.**
