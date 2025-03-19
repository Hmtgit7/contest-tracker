# Contest Tracker

A comprehensive web application to track programming contests from platforms like Codeforces, CodeChef, and LeetCode, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Contest Listing**: View upcoming, ongoing, and past programming contests from multiple platforms
- **Platform Filtering**: Filter contests by platform (Codeforces, CodeChef, LeetCode)
- **Bookmarking**: Save contests to your personal bookmarks
- **Contest Solutions**: Link YouTube solution videos to past contests
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **React**: JavaScript library for building the user interface
- **React Router**: For navigation and routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: For animations and transitions
- **Axios**: For HTTP requests
- **date-fns**: For date formatting and manipulation
- **React Icons**: For UI icons

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: For authentication
- **bcrypt**: For password hashing
- **YouTube API**: For fetching contest solution videos

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- NPM or Yarn

### Setting Up the Project

1. Clone the repository
   ```bash
   git clone https://github.com/Hmtgit7/contest-tracker.git
   cd contest-tracker
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in both the server and client directories:

   **Server .env**:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/contest-tracker
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   YOUTUBE_API_KEY=your_youtube_api_key
   LEETCODE_PLAYLIST_ID=your_leetcode_playlist_id
   CODEFORCES_PLAYLIST_ID=your_codeforces_playlist_id
   CODECHEF_PLAYLIST_ID=your_codechef_playlist_id
   CORS_ORIGIN=http://localhost:3000
   CONTEST_REFRESH_INTERVAL=3600000
   ```

   **Client .env**:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. Start the development server
   ```bash
   # In the server directory
   npm run dev

   # In a separate terminal, in the client directory
   npm start
   ```

## Project Structure

```
contest-tracker/
├── client/                     # Frontend React application
│   ├── node_modules/           # Frontend dependencies
│   ├── public/                 # Static files
│   ├── src/                    # React source code
│   ├── .env                    # Environment variables
│   ├── .gitignore              # Git ignore file
│   ├── package.json            # Frontend dependencies and scripts
│   ├── package-lock.json       # Locked versions of dependencies
│   └── tailwind.config.js      # Tailwind CSS configuration
│
├── server/                     # Backend Node.js/Express application
│   ├── node_modules/           # Backend dependencies
│   ├── src/                    # Server source code
│   ├── .env                    # Environment variables
│   ├── .gitignore              # Git ignore file
│   ├── package.json            # Backend dependencies and scripts
│   └── package-lock.json       # Locked versions of dependencies
│
└── README.md                   # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/preferences` - Update user preferences

### Contests
- `GET /api/contests` - Get all contests with filters
- `GET /api/contests/:id` - Get a single contest by ID
- `POST /api/contests/bookmark` - Bookmark a contest
- `DELETE /api/contests/bookmark/:contestId` - Remove bookmark from a contest
- `GET /api/contests/bookmarks/me` - Get bookmarked contests for current user
- `POST /api/contests/solution` - Update contest solution URL manually (Admin only)
- `POST /api/contests/refresh` - Force refresh contests data (Admin only)
- `POST /api/contests/refresh-solutions` - Force refresh contest solutions (Admin only)

## Data Models

### User
- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `bookmarkedContests`: Array of Contest IDs
- `preferences`: Object (platform preferences, dark mode)
- `createdAt`: Date

### Contest
- `name`: String (required)
- `platform`: String (required, enum: ['codeforces', 'codechef', 'leetcode'])
- `url`: String (required)
- `startTime`: Date (required)
- `endTime`: Date (required)
- `duration`: Number (minutes)
- `status`: String (enum: ['upcoming', 'ongoing', 'past'])
- `solutionUrl`: String (YouTube link)
- `externalId`: String (required, platform-specific ID)
- `createdAt`: Date
- `updatedAt`: Date

### Bookmark
- `user`: User ID (required)
- `contest`: Contest ID (required)
- `createdAt`: Date

## YouTube Solution Integration

The application supports two methods for adding contest solution videos:

1. **Manual Entry**: Admins can add YouTube solution URLs through the admin dashboard
2. **Automatic Fetching**: The system can fetch solutions from specified YouTube playlists

To set up automatic fetching, add your YouTube API key and playlist IDs to the server's `.env` file.

## Responsive Design

The application is fully responsive and works on:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## Dark Mode

Users can toggle between light and dark modes using:
- The theme toggle button in the navigation bar
- Their profile preferences page (persists across sessions)

## Deployment

### Deploying to Heroku

1. Create a new Heroku app
   ```bash
   heroku create your-app-name
   ```

2. Add MongoDB Atlas connection string to Heroku config
   ```bash
   heroku config:set MONGO_URI=your_mongodb_atlas_uri
   ```

3. Add other environment variables
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set YOUTUBE_API_KEY=your_youtube_api_key
   # Add other variables as needed
   ```

4. Deploy to Heroku
   ```bash
   git push heroku main
   ```

## Future Enhancements

- Email notifications for upcoming contests
- Calendar integration
- Contest difficulty ratings
- User performance tracking
- Social sharing features
- Additional programming platforms

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Codeforces, CodeChef, and LeetCode for their programming contest platforms
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Framer Motion](https://www.framer.com/motion/)