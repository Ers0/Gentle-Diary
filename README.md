# Your Gentle Diary

A premium sanctuary for your thoughts and feelings.

## Features

- **Digital Journal**: Write your thoughts in a distraction-free, elegant space
- **Mood Tracking**: Gently monitor your emotional well-being with insightful analytics
- **Daily Reflection**: Build a meaningful habit of mindful reflection
- **AI Mood Insights**: Get personalized emotional analysis
- **Cloud Sync**: Save your entries to the cloud and access them from anywhere

## Tech Stack

- React + TypeScript
- Vite
- Supabase (Authentication & Database)
- Tailwind CSS
- shadcn/ui components

## Deployment

This app is ready to be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Deploying to Vercel (Recommended)

1. Push this code to a GitHub repository
2. Sign up at [vercel.com](https://vercel.com)
3. Create a new project and import your GitHub repository
4. Add the following environment variables in your Vercel project settings:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key
5. Deploy!

### Deploying to Netlify

1. Push this code to a GitHub repository
2. Sign up at [netlify.com](https://netlify.com)
3. Create a new site from Git and select your repository
4. Set the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add the environment variables in the Netlify dashboard:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key
6. Deploy!

## Development

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Supabase Setup

Make sure to set up the following in your Supabase project:

1. Enable Email Authentication in Supabase Authentication settings
2. Set the Site URL in Authentication → URL Configuration to your deployed app's URL
3. Run the SQL queries in the `supabase.sql` file to set up the database schema

## Contributing

Feel free to fork this project and make your own improvements!

## License

This project is open source and available under the MIT License.