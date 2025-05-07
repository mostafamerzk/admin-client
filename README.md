# Admin Dashboard

A modern admin dashboard built with React, TypeScript, and Tailwind CSS for managing users, suppliers, categories, and orders.

## Features

- User Management
  - View all customers and suppliers
  - Search and filter users
  - View detailed user profiles
  - Ban/unban users

- Supplier Management
  - View supplier company details
  - Verify supplier applications
  - Manage supplier inventory

- Category Management
  - Add, edit, or delete product categories
  - View category statistics

- Order Management
  - View all orders with filters
  - Approve or reject orders
  - View order details
  - Export order data

- Dashboard Analytics
  - Key metrics visualization
  - Sales trends
  - User growth statistics
  - Inventory alerts

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Chart.js
- React Router DOM
- Headless UI

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # React context
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── utils/              # Helper functions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
├── package.json
└── tailwind.config.js
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 