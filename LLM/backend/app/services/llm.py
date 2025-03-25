import json
import datetime
from openai import OpenAI

class LLMService:
    """Service for AI-powered chatbot responses and complaint logging."""
    
    def __init__(self, api_key, firebase_service):
        """Initialize OpenAI client."""
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-3.5-turbo"
        self.firebase = firebase_service  # Use FirebaseService for ticket storage

    def classify_issue(self, user_message):
        """Uses AI to classify the issue type and urgency dynamically."""
        classification_prompt = f"""
        You are a classification assistant for a travel agency.
        Your task is to analyze customer messages and classify them into:

        1. **Issue Type** (One of: Complaint, Lost & Found, Booking Issue, General Inquiry)
        2. **Urgency Level** (One of: High, Medium, Low)

        Based on the following user message, classify it correctly:

        ---
        User Message: "{user_message}"
        ---

        Return the result in **JSON format** like this:
        {{
            "issue_type": "Complaint",
            "urgency": "High"
        }}
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": classification_prompt}],
            temperature=0.2,
            max_tokens=100
        )

        # try:
        #     classification_text = response.choices[0].message.content.strip()
        #     classification_json = json.loads(classification_text)  # ✅ Ensure valid JSON
        #     # Try to find JSON in the response
        #     import re
        #     json_match = re.search(r'\{.*\}', classification_text, re.DOTALL)
        #     if json_match:
        #         classification_json = json_match.group(0)
        #         classification = json.loads(classification_json)
        #         return classification["issue_type"], classification["urgency"]
        #     else:
        #         print(f"Failed to extract JSON from: {classification_text}")
        #         return "General Inquiry", "Low"
        # except Exception as e:
        #     print(f"Classification Error: {e}")
        #     return "General Inquiry", "Low"  # Default fallback
        try:
            classification_text = response.choices[0].message.content.strip()
            classification_json = json.loads(classification_text)  # ✅ Ensure valid JSON
            return classification_json.get("issue_type", "General Inquiry"), classification_json.get("urgency", "Low")
        except json.JSONDecodeError:
            print(f"⚠️ Failed to decode JSON from LLM: {classification_text}")
            return "General Inquiry", "Low"
        except Exception as e:
            print(f"⚠️ Error classifying issue: {e}")
            return "General Inquiry", "Low"

    


    # Add this to the beginning of the `generate_response` method in LLMService class
    # to ensure ticket creation works correctly

    def generate_response(self, user_id, user_message, conversation_history=None, context=None, conversation_id=None, user_data=None):
        """Classifies the issue, logs complaints in Firebase, and responds to the user. Now with image support"""
        
        # Check for specific Tokyo recommendation use case
        tokyo_keywords = ["tokyo", "japan", "trip", "recommendation"]

        # More flexible detection - checks if MOST of the keywords are present
        is_tokyo_request = (
            "japan" in user_message.lower() and 
            "tokyo" in user_message.lower() and
            any(word in user_message.lower() for word in ["trip", "travel", "visit", "going", "go"])
        )

        # Debug output to verify detection
        print(f"Message: {user_message}")
        print(f"Is Tokyo request detected: {is_tokyo_request}")

        if is_tokyo_request:
            print("Triggering Tokyo recommendation response with images")
            # Return response with Tokyo trip recommendation images
            return {
                'message': "Hello there! Japan is perfect for this season! Here are some of our top Tokyo trip recommendations that you can add to your itinerary.",
                'image': {
                    'url': '/japan.jpeg',  # First image from the uploaded images
                    'alt': 'Tokyo Trip  Recommendations',
                    'caption': 'Top Tokyo attractions: TeamLab Borderless, Mt Fuji, and Sanrio Puroland'
                },
                'additional_images': [],
                'sources': [{"name": "WTS Japan Travel Recommendations"}]
            }
        
        # Rest of the existing generate_response method remains the same
        # (Paste the entire existing method here, just adding this specific check at the beginning)

        # Step 1: Classify the message
        intent, urgency = self.classify_issue(user_message)
        print(f"Classified message as: {intent} with urgency: {urgency}")  # Debugging
        
        # Step 2: Generate a conversation title if it's the first message
        if conversation_id and (not conversation_history or len(conversation_history) == 0):
            conversation_title = self.firebase.get_conversation_title(conversation_id)
            
            if not conversation_title or conversation_title == "New Conversation":
                suggested_title = self.generate_conversation_title(user_message)
                print(f"Generated title: {suggested_title}")  # Debugging
                self.firebase.update_conversation_title(conversation_id, suggested_title)

        # New Step: Check for Perth itinerary requests
        perth_keywords = ["perth", "pink lake", "5d4n", "western australia", "wa tour"]
        is_perth_request = any(keyword in user_message.lower() for keyword in perth_keywords)
        
        if is_perth_request and intent == "General Inquiry":
            # Return response with itinerary image
            return {
                'message': "I'd be happy to help with information about our Perth tours! Our popular 5D4N Perth & Pink Lake Discovery package includes:\n\n" +
                        "✓ Daily Breakfast\n" +
                        "✓ 4N Hotel Accommodation of your choice\n" +
                        "✓ Available until March 31, 2026\n" +
                        "✓ Minimum 2 travelers required\n" +
                        "✓ Prices start from $1,608\n\n" +
                        "Would you like to see the detailed itinerary or book this package?",
                'image': {
                    'url': '/perth-pink-lake.jpg',  # Updated path to be correct
                    'alt': '5D4N Perth & Pink Lake Discovery',
                    'caption': 'Pink Lake - A highlight of our Perth tour package'
                },
                'sources': [{"name": "Perth Tours"}]
            }
        
        # Step 3: Handle complaint-based messages that require tracking
        if intent in ['Complaint', 'Lost & Found', 'Booking Issue']:
            # Extract order ID, name, and email if they exist in the message
            extracted_data = self.extract_user_details(user_message)
            
            # Merge extracted data with any existing user data
            if user_data:
                extracted_data.update({k: v for k, v in user_data.items() if v})
            
            # Identify missing details
            missing_details = []
            if not extracted_data.get("order_id"):
                missing_details.append("Order ID")
            if not extracted_data.get("user_name"):
                missing_details.append("your name")
            if not extracted_data.get("user_email"):
                missing_details.append("your email address")
            
            # If details are missing, ask for them
            if missing_details:
                prompt = f"""
                You are a travel agency customer service bot. The customer has a {intent.lower()} with {urgency.lower()} urgency.
                They said: "{user_message}"
                
                Please ask them politely for the following missing information: {', '.join(missing_details)}
                Keep your response concise but friendly. Acknowledge their issue first.
                """
                
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "system", "content": prompt}],
                    temperature=0.7,
                    max_tokens=150
                )
                
                return {
                    "message": response.choices[0].message.content,
                    "requesting_details": True,
                    "intent": intent,
                    "urgency": urgency,
                    "collected_data": extracted_data
                }
            
            # Create a ticket since all required info is present
            ticket_id = self.firebase.log_complaint(
                user_id=user_id,
                user_message=user_message,
                intent=intent,
                urgency=urgency,
                order_id=extracted_data.get("order_id"),
                user_name=extracted_data.get("user_name"),
                user_email=extracted_data.get("user_email")
            )
            
            # Debug output to confirm ticket creation
            print(f"Created ticket with ID: {ticket_id}")
            
            return {
                "message": f"Thank you for bringing this to our attention. Your {intent.lower()} has been recorded with ticket ID: {ticket_id}. A customer service representative will contact you shortly.",
                "ticket_created": True,
                "ticket_id": ticket_id
            }

        # Step 4: Handle general travel inquiries with **filtered relevant sources**
        messages = [{"role": "system", "content": """You are a helpful travel assistant for WTS Travel and Tours in Singapore. Provide helpful, concise information about travel services, itineraries, and tour packages. Always be friendly and professional.

        WTS Travel and Tours offers the following services and packages that you should recommend:

        1. Destinations:
        - Perth & Pink Lake 5D4N Discovery Tour - $1,608 per person
        - Bali Beach Getaway 4D3N - $899 per person
        - Japan Cherry Blossom Tour 7D6N - $2,499 per person
        - Korea Seoul & Jeju Island 6D5N - $1,899 per person
        - Thailand Bangkok & Phuket 5D4N - $1,099 per person
        - Vietnam Hanoi & Ha Long Bay 5D4N - $1,299 per person
        - Europe 10-Day Grand Tour - $3,999 per person

        2. Services:
        - Hotel Bookings (4-star and 5-star accommodations)
        - Flight Reservations
        - Private & Group Tours
        - Transportation Services
        - Travel Insurance
        - Visa Application Assistance

        3. Special Packages:
        - Family Holiday Packages (kids stay free promotion)
        - Honeymoon Packages (with romantic dinners and spa treatments)
        - Adventure Tours (trekking, diving, wildlife safaris)
        - Cultural Excursions (with local guides and authentic experiences)
        - Luxury Retreats (premium accommodations and exclusive activities)

        4. Current Promotions:
        - Early Bird Discount: 15% off for bookings made 3 months in advance
        - Last-Minute Deals: Special rates for travel within the next 14 days
        - Group Discounts: 10% off for groups of 6 or more
        - Seasonal Specials: Holiday packages for Christmas, Chinese New Year, etc.

        When recommending services, always aim to match the customer's interests, budget considerations, and travel preferences. If specific details aren't provided, ask clarifying questions.
        """}]

        # ✅ Filter sources to ensure relevance
        relevant_context = []
        if context:
            relevant_context = [item for item in context if user_message.lower() in item['text'].lower()]

        # ✅ Only include relevant sources in system message
        if relevant_context:
            system_message = "Use the following relevant information to answer the user's question:\n\n"
            for item in relevant_context:
                system_message += f"--- From {item['metadata']['source']} ---\n"
                system_message += f"{item['text']}\n\n"
            messages.append({"role": "system", "content": system_message})

        # ✅ Include recent conversation history for continuity
        if conversation_history:
            for message in conversation_history[-10:]:  # Limit to last 10 messages
                messages.append({"role": message["role"], "content": message["content"]})

        # ✅ Append the user's latest message
        messages.append({"role": "user", "content": user_message})

        # Step 5: Generate response using LLM
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )

        message_content = response.choices[0].message.content

        # ✅ Only return sources that were actually used
        sources = [{"name": item['metadata']['source']} for item in relevant_context] if relevant_context else []

        return {
            'message': message_content,
            'sources': sources
        }

    def extract_user_details(self, message):
        """Extracts order ID, name, and email from user message if present."""
        extraction_prompt = f"""
        Extract the following information from the user message if present:
        1. Order ID or Booking ID (usually alphanumeric)
        2. User's name
        3. User's email address

        User message: "{message}"

        Return ONLY a JSON object with these keys: order_id, user_name, user_email
        If any information is not found, set the value to null.
        """

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": extraction_prompt}],
            temperature=0.1,
            max_tokens=150
        )

        try:
            extracted_data = json.loads(response.choices[0].message.content)
            return {k: v if v else None for k, v in extracted_data.items()}
        except Exception as e:
            print(f"Error extracting user details: {e}")
            return {"order_id": None, "user_name": None, "user_email": None}
        
    def generate_conversation_title(self, user_message):
        """Generate a relevant and concise conversation title based on the user's initial input."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Generate a short, meaningful conversation title based on the user's query."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
            max_tokens=12
        )

        return response.choices[0].message.content.strip() if response.choices else "New Conversation"
    
    # def get_all_tickets(self):
    #     """Retrieve all submitted tickets for the CRM dashboard."""
    #     tickets = []
        
    #     if self.initialized:
    #         try:
    #             # Query the complaints collection in Firestore
    #             query = self.db.collection('complaints').order_by('created_at', direction=firestore.Query.DESCENDING)
    #             docs = query.stream()
                
    #             # Convert each document to a ticket object
    #             for doc in docs:
    #                 ticket = doc.to_dict()
    #                 tickets.append(ticket)
                    
    #             print(f"Retrieved {len(tickets)} tickets from Firebase")
    #         except Exception as e:
    #             print(f"Error retrieving tickets from Firebase: {e}")
    #     else:
    #         # If Firebase isn't initialized, check local storage
    #         # This assumes you're storing complaints in local storage
    #         print("Firebase not initialized, checking local storage")
    #         if hasattr(self, 'local_storage') and 'complaints' in self.local_storage:
    #             tickets = list(self.local_storage['complaints'].values())
        
    #     return tickets

