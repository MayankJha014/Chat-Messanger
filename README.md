# Chat Application

This project is a feature-rich real-time chat application built using the MERN stack (MongoDB, Express.js, ReactJS, Node.js) along with Socket.io for real-time communication and Redux for efficient state management. This chat app enables users to send messages instantly, manage contacts, and maintain chat history in a responsive and intuitive interface.

## Features

### Real-Time Messaging

- Instant message delivery using Socket.io for real-time, bidirectional communication.
- Typing indicators to see when other users are typing.
- Message delivery and read receipts.

### User Authentication & Authorization

- Secure user registration and login using JWT (JSON Web Tokens).
- Passwords are hashed and securely stored in the database.
- Access control to protect routes and functionalities based on user roles.

### Chat Functionality

- One-to-One Chat: Users can send private messages to other users.
- Group Chat: Users can create chat groups and invite others to participate.
- Online/Offline Status: Real-time updates of user status to show who is online.

### User Interface

- **Responsive Design:** Optimized for both desktop and mobile devices using TailwindCSS.
- **User-Friendly Interface:** Clean and intuitive design for easy navigation.
- **Dark Mode:** Option to switch between light and dark themes.

### Additional Features

- **Chat History:** Persist messages in MongoDB to allow users to view past conversations.
- **Notifications:** Receive real-time notifications for new messages.
- **Search:** Search functionality to find messages and users.
- **Emojis and Media:** Support for sending emojis, images, and files in chat.

## Tech Stack

### Frontend

- **ReactJS:** JavaScript library for building user interfaces.
- **Redux:** State management for handling user and chat states efficiently.
- **Socket.io-client:** For establishing real-time communication between client and server.
- **TailwindCSS:** Utility-first CSS framework for rapid UI development.

### Backend

- **Node.js:** JavaScript runtime for building the server-side logic.
- **Express.js:** Web framework for creating RESTful APIs.
- **Socket.io:** For real-time, event-based communication.
- **JWT:** For secure user authentication.

### Database

- **MongoDB:** NoSQL database for storing user information, chat messages, and chat rooms.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (v14.x or higher)
- **npm** (Node Package Manager)
- **MongoDB** (running locally or hosted)

### Installation

Follow these steps to set up and run the application locally:

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. **Install Dependencies**

   - **Server-Side Dependencies:**

     Navigate to the server directory and install the required Node.js packages:

     ```bash
     cd server
     npm install
     ```

   - **Client-Side Dependencies:**

     Navigate to the client directory and install the necessary React packages:

     ```bash
     cd client
     npm install
     ```

3. **Environment Configuration**

   Create a `.env` file in the `server` directory to store environment variables:

   ```bash
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret` with a secret key for JWT.

### Running the Application

1. **Start MongoDB**

   Ensure your MongoDB server is running. If using MongoDB Atlas, ensure the service is configured correctly.

2. **Run the Backend Server**

   Start the Node.js server by navigating to the `server` directory and running:

   ```bash
   cd server
   npm start
   ```

   The backend server will start on `http://localhost:5000`.

3. **Run the Frontend Server**

   Start the React development server by navigating to the `client` directory and running:

   ```bash
   cd client
   npm start
   ```

   The frontend will start on `http://localhost:3000`.

### Usage

- **Access the Chat Application:** Open a web browser and go to `http://localhost:3000`.
- **Register:** Create a new account or log in with existing credentials.
- **Chat:** Start a new conversation with users or join a group chat to communicate in real time.

## Screenshots

![Screenshot 2024-09-01 140210](https://github.com/user-attachments/assets/29c81271-b641-4bbd-b3d1-63cd5f53d214)
![Screenshot 2024-09-01 140238](https://github.com/user-attachments/assets/f7b4aff5-3150-4be6-ba97-b9680042e034)
![Screenshot 2024-09-01 140346](https://github.com/user-attachments/assets/1e4f0ff1-e5cd-4c1c-8206-0653e92d820b)
![Screenshot 2024-09-01 140434](https://github.com/user-attachments/assets/dec7c88c-7a40-4b27-ae62-b1093c5e69b2)
![Screenshot 2024-09-01 140521](https://github.com/user-attachments/assets/008f1942-668f-4c76-9e1e-35bf8d5d1a0f)

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software as long as the original license is included.

## Acknowledgments

- **[Socket.io](https://socket.io/):** For real-time communication capabilities.
- **[MERN Stack](https://www.mongodb.com/mern-stack):** A powerful full-stack solution for building modern web applications.
- **[Redux](https://redux.js.org/):** For predictable state management.
- **[TailwindCSS](https://tailwindcss.com/):** For creating beautiful and responsive user interfaces quickly.

## Conclusion

This chat application is a robust and scalable solution for real-time messaging, suitable for personal projects or as a base for more complex applications. Feel free to customize and expand upon the features as needed. Happy coding!
