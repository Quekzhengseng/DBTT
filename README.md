# SMU Digital Business for Technologies & Transformation Project
## WTS Travel Digital Transformation

### 1. Project Overview
This is Group 1's digital transformation project to transform WTS Travel for the future.

### 2. Description
A concise summary of what the project does and its purpose. The team has implemented several features to enable WTS Travel to expand their business domain and ventures.

#### 2.1 Key Features
1. **Redesigned Website** - Enables drag and drop travel itinerary creation
2. **LLM Chatbot** - Includes RAG implementation to enable self-help for users and selling of packages
3. **Auto CRM Ticketing System** - Identifies and classifies customer issues through the LLM chatbot, allowing agents to clear tickets more efficiently
4. **Data Analysis** - Analysis of Kaggle-based file and deployment via Streamlit

### 3. Installation
For running the project for the first time, you should be provided with a `.env` file and a `firebase.json` key to allow the chatbot and storage functions to work. Drag these 2 files into `DBTT/backend`.

#### 3.1 Setting Up the Project
1. Make sure you are in the WTS directory with the command terminal opened
2. Run `npm i` and wait for it to finish
3. Run `npm run dev` - you should be prompted with the server starting and a link provided
4. In another terminal, go into the backend directory within the DBTT folder
5. Run `docker compose up --build` to start the backend server

With this setup, you should be able to view the website with all functions deployed.

### 4. Usage Instructions

#### 4.1 Creating a Trip
1. Type "tokyo, japan" into the search bar and click search
2. Choose "Free and Easy" and select any of the packages
3. In the popup, scroll down and click on "create trip"
4. In the subsequent popup, click on "save and exit"
5. Return to the main page by clicking on the logo in the top left
6. On the main page, you should see a new trip labeled "Japan Trip"
7. Click into it to view the trip itinerary
8. Add activities from the right side of the screen (payment amount will increase accordingly)
9. To confirm the trip, click "make payment" and then "pay"
10. The page will auto-reload once payment is processed
11. Return to the main page via the logo - the trip will now be shown as "upcoming" to indicate confirmation

#### 4.2 Using the Chatbot
1. Click the chat button logo in the bottom right corner
2. You will enter a chat interface similar to ChatGPT
3. You can ask questions about trips to Japan

#### 4.3 Creating a Support Ticket
1. In the chatbot interface, start a conversation by saying "I have a booking issue"
2. You will be prompted to provide your details

#### 4.4 Accessing the Staff Page
1. Add "/staff" to the URL to access the staff page to view tickets
2. You should be able to see any issues you've raised
3. Resolve tickets by clicking on them and scrolling down to change the filter

#### 4.5 Uploading Documents for the RAG System
1. In the staff page, click on "upload" in the header
2. You'll see a page for uploading documents
3. Scroll down to view documents that have already been uploaded
4. You can upload additional documents to enhance the chatbot's RAG capabilities

#### 4.6 Viewing Data Analysis of the Kaggle Dataset
1. Access the deployment at: https://dbbtanalytics-ay2425g10t01.streamlit.app/
2. A more detailed README for self-deployment is available in the analytics folder with the source code

### 5. Architecture
1. The team has utilized Chroma DB with OpenAI 3.5 Turbo for a lightweight and fast RAG system
2. Python Flask powers the backend server and endpoints
3. Next.js is used for the frontend website and UI/UX
4. For data analytics deployed on Streamlit, the team has used classification via random forest to determine insights

### 6. Contact
If any issues occur during installation or usage, please contact @quekkyz on Telegram for troubleshooting.
