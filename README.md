Online Exam Engine (Secure Proctoring)
A high-performance, secure online examination platform engineered with Next.js, Node.js, and MongoDB. This engine is designed for educational institutions and corporate certifications requiring real-time proctoring and sub-100ms response times.

🛡️ Key Features
Real-Time Proctoring: Active monitoring for tab-switching, window blurring, and unauthorized copy-paste actions.

Dynamic Exam Generation: Fetches randomized question sets from MongoDB based on exam configuration.

Fail-Safe Persistence: Exam state is synced to the database every 30 seconds to prevent data loss during network interruptions.

Instant Grading: Server-side evaluation for objective questions with immediate result generation.

🏗️ System Architecture
The system utilizes a decoupled architecture to ensure 100/100 performance scores and maximum security.

Frontend: Next.js (Pages Router) optimized for LCP (Largest Contentful Paint).

Backend: Node.js / Express microservice for handling high-frequency proctoring logs.

Database: MongoDB Atlas utilizing indexes on userId and examId for rapid state retrieval.

📊 Database Schema (MongoDB)
The engine utilizes three primary collections to maintain high performance:

exams: Metadata and question banks.

attempts: Live session tracking and proctoring event logs.

results: Archival storage of completed and graded examinations.

🛠️ Installation & Setup
1. Configure Environment
Create a .env file in the root directory:

Bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
NEXT_PUBLIC_API_URL=http://localhost:5000
2. Run the Development Server
Bash
npm install
npm run dev
🔒 Security Protocols
Full-Screen Enforcement: Uses the HTML5 Fullscreen API to isolate the testing environment.

JWT Authentication: Secure sessions with short-lived tokens to prevent account sharing.

Server-Side Validation: All timers and submissions are validated against the server clock to prevent client-side manipulation.

🦎 Lizrd Engineering Standards
This project follows the Lizard Interactive philosophy:

Performance: No bloat, minimal bundles.

Security: Zero-trust architecture.

Accessibility: ARIA-compliant exam interfaces for inclusive testing.

Pro-Tip for your Portfolio:
When you push this to GitHub, make sure to include a "Demo Credentials" section in your README (e.g., test_student / password123) so visitors can immediately experience the proctoring features without having to create an account.

Since you're also a video editor, have you considered recording a 30-second "Speed Test" of this app to post on your socials using your automation script?