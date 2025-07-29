# Password Generator

A modern, responsive password generator built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Customizable Password Length**: Generate passwords from 4 to 50 characters
- **Character Type Selection**: Choose which character types to include:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Symbols (!@#$%^&*)
- **Password Strength Indicator**: Visual feedback on password strength
- **Copy to Clipboard**: One-click password copying
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Migration from HTML/CSS/JS

This project was migrated from a simple HTML/CSS/JavaScript implementation to a modern Next.js application with the following improvements:

- **React Components**: Modular, reusable components
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Enhanced Features**: Added password strength indicators, copy functionality, and better UX
- **Better Architecture**: Separation of concerns and maintainable code structure

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd password-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Set Password Length**: Use the slider to choose your desired password length (4-50 characters)
2. **Select Character Types**: Check/uncheck the boxes to include or exclude specific character types
3. **Generate Password**: Click the "Generate Password" button
4. **Copy Password**: Click the copy icon to copy the generated password to your clipboard
5. **Check Strength**: View the password strength indicator below the generated password

## Password Strength Levels

- **Weak**: Basic passwords with limited character variety
- **Fair**: Passwords with moderate complexity
- **Good**: Strong passwords with good character variety
- **Strong**: Very secure passwords with maximum complexity

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management and side effects

## Project Structure

```
password-generator/
├── app/
│   ├── components/
│   │   └── PasswordGenerator.tsx    # Main password generator component
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout component
│   └── page.tsx                     # Main page component
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This Next.js application can be deployed to various platforms:

- **Vercel** (recommended): Automatic deployment from Git
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
