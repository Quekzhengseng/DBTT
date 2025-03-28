# DBTT

SMU Digital Business for Technologies &amp; Transformation Project to transform WTS Travel

1. Project Title
	This is Groups 1's digital transformation project to transform WTS Travel for the future.

2. Description
A concise summary of what the project does and its purpose.
The team has implemented a few features to enable WTS Travel to expand their business domain and ventures. Some key features include: <br>
  a. Redesigned Website to enable drag and drop travel itinenary.   <br>
  b. Access to a LLM chatbot with RAG implementation to enable self help of users and selling of packages.  <br>
  c. Auto CRM ticketing system that identifies and classifies issues that customers have through the LLM chatbot, allowing agents to clear tickets with more efficiency  <br>
  d. Data Analysis of Kaggle Based File and Deployment via Streamlit

4. Installation
	For running the project for the first time, you should be provided with a .env file and a firebase.json key to allow for the chatbot and storage functions to work.
	Drag these 2 files into DBTT/backend.

Step-by-step guide to setting up the project
Now to start the server:  <br>
	  a. Make sure that you are in the WTS directory with the command terminal opened. Then type "npm i" and wait for it to run finish.  <br>
	  b. Then run "npm run dev", you should be prompted to the server starting with the link provided.  <br>
	  c. In another terminal, go into backend directory that is within DBTT folder.  <br>
	  d. Run "docker compose up --build" to start the backend server.  <br>

With this, you should be able to view the website with the functions deployed.

5. Usage
Instructions on how to run the project

For instructions to go about the website and create a trip:  <br>
	a. Type in tokyo, japan into the search bar and click search.  <br>
	b. Choose Free and Easy and select any of the packages. You will be prompted with a popup, scroll below to click on create trip.  <br>
	c. Upon clicking create trip, you will be prompted to another pop up. Click on save and exit subsequently.  <br>
	d. Now, go back to the main page via clicking on the logo on the top left.  <br>
	e. In the main page, you should be able to see another trip added labelled Japan Trip.  <br>
	f. Click into it to see the trip itinenary. You will be able to add activities on the right side of the screen and the payment amount would increase.  <br>
	g. To confirm the trip, click into make payment and subsequently click on pay.  <br>
	h. The page would auto reload once the payment goes through, you can head to the main page via the logo again. The trip would now be shown upcoming to indicate that it is confirmed.  <br>

For instructions to go the the chatbot:  <br>
  a. To view the chatbot, click into the chatbutton logo on the bottom right.  <br>
  b. You will enter a chat interface similar to chatgpt. You will then be able to ask about trips to japan.  <br>

For instructions to start a ticket:  <br>
  a. In the chatbot interface, start a conversation and ask it that "I have an booking issue".  <br>
  b. You will be prompted to give your details.  <br>

For instructions to view the staff page:  <br>
  a. In the url, put "/staff" to access the staff page to view the tickets.  <br>
  b. Upon viewing the tickets, you should be able to see the issue that you have raised just now.  <br>
  c. You would be able to resolve the ticket via clicking on it and scrolling below to change the filter.  <br>

For instructions to view the upload document page for the Rag System:  <br>
  a. In the staff page, you will be able to see upload within the header.  <br>
  b. Upon clicking it, you will be able to see a page indicating upload. Scrolling below, you will see the documents that has been already uploaded.  <br>
  c. You will be able to upload more documents to enhance the RAG capability of the chatbot to answer questions.  <br>

For instructions to view the Data Analysis of the Kaggle Dataset: <br>
  a. Link to the Deployment: https://dbbtanalytics-ay2425g10t01.streamlit.app/ <br>
  b. A more defined readMe for the self deployment is within the analytics folder where the source code is contained. <br>

6. Architecture  <br>
  a. The team has utilised Chroma DB with OpenAI 3.5 Turbo. This enables our RAG System and at the same time keeps the system lightweight and fast.  <br>
  b. To enable our backend Server, the team utilised Python Flask to maintain the server and the endpoints.  <br>
  c. To enable our frontend website, the team utilised Next.Js to display UI/UX.  <br>
  d. For the data analytics deployed on streamlit, our team has used Classification via random forest to determine the insights.

7. Contact 
If any issues occur upon installation or after, please contact @quekkyz on telegram for troubleshooting.

