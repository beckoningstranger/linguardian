# Linguardian - Enrich your vocabulary with the power of spaced repetition.

## <a href="https://www.youtube.com/watch?v=1GnSWYvB5uc" target="_blank" rel="noopener">Watch a short demo video on Youtube (in German)</a>

This is a project using **Next.js** and an **Express** backend that communicates with **MongoDB**.

On Linguardian users can **learn and review user-generated vocabulary lists** that can be created using the website or by uploading csv-files. Of course they can also pick from the existing list catalogue. After learning the items users wait for a set period of time (the default is 4 hours), after which they are then tested on each of the learned items. If the tests go well, the amount of time between reviews increases, but once they make a mistake, it is reset to the initial 4 hours. This scientifically proven concept is called **spaced repetition**.

Depending the language they are learning, users are also tested on the gender of nouns (for German or French) or the case that is followed by a preposition (German).

Uploading learnable items will also be added to a **browsable dictionary** that can be edited and refined. It aims to be as complete as possible, including example sentences, images, recordings, phonetic transcription, etc.

## Project Status

As of right now, the dictionary, creating and managing lists and learning and reviewing lists have basic functionality, but the experience is unpolished and the design is bare-bones to say the least.

## Overview of Languages, Frameworks & Libraries Used

### General

- [Typescript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- [Git](https://git-scm.com/) - For version control
- [Figma](https://figma.com) - For creating wireframes and experimenting with page layouts
- [Zod](https://www.npmjs.com/package/zod) - Schemas for user data validation

### Front End

- [Next.js](https://nextjs.org/) - React Framework powering my Front End
- [NextAuth](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Headless UI](https://github.com/tailwindlabs/headlessui) - Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
- [React Hot Toast](https://www.npmjs.com/package/react-hot-toast) - Notifications for React
- [React Hook Form](https://www.npmjs.com/package/react-hook-form) - Performant forms with great integration, validation and Zod support
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Drag and drop for lists with React
- [react-world-flags](https://www.npmjs.com/package/react-world-flags) - SVG flags of the world for React
- [ApexCharts](https://www.npmjs.com/package/apexcharts) - A modern JavaScript charting library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon Library
- [clsx](https://www.npmjs.com/package/clsx) - Construct className string conditionally
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) - Efficiently merge Tailwind CSS classes without style conflicts
- [Google Fonts](https://fonts.google.com/) - Find and import fonts

### Backend

- [Node.js](https://nodejs.org/) - Javascript Runtime Environment running on my backend
- [Express.js](https://expressjs.com/) - Build RESTful APIs
- [ts-node](https://www.npmjs.com/package/ts-node) - Directly execute TypeScript on Node.js without precompiling
- [csv-parse](https://www.npmjs.com/package/csv-parse) - CSV Parser for uploading user created vocabulary lists
- [Mongoose](https://mongoosejs.com/) - Communication between backend and database
- [bcryptjs](https://www.npmjs.com/package/bcrypt) - Encryption of user password
- [helmet](https://www.npmjs.com/package/helmet) - Secures Express Apps
- [multer](https://www.npmjs.com/package/multer) - Handle uploaded files
- [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware
- [cors](https://www.npmjs.com/package/cors) - Cross origin resource sharing middleware for Express.js
- [dotenv](https://www.npmjs.com/package/dotenv) - Load environment variables
- [nodemon](https://www.npmjs.com/package/nodemon) - Automatically restart node applications on file changes
