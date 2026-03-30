# Zayka - Digital Restaurant Menu Management

A comprehensive restaurant management platform that enables restaurants to create digital QR menus, manage dishes, engage with customers, and grow their business.

## 🚀 Features

### For Restaurant Owners
- **Digital QR Menus**: Generate beautiful QR codes for instant menu access
- **Menu Management**: Add, edit, and organize dishes with categories
- **Customer Management**: Track customer information and preferences
- **Analytics Dashboard**: Monitor menu views, customer engagement, and ratings
- **Image Gallery**: Showcase your restaurant with professional photos
- **Announcements**: Share updates and special offers with customers
- **Rating System**: Collect and manage customer feedback

### For Customers
- **QR Menu Access**: Scan QR codes to view menus instantly
- **Dish Details**: View descriptions, prices, and images
- **Rating & Reviews**: Provide feedback on dining experience
- **Contactless Experience**: No physical menu handling required

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Storage**: Cloudinary
- **QR Code Generation**: qrcode library
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudinary account
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dineinn_tier2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dineinn_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
REQUEST_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
dineinn_tier2/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── onboarding/        # Onboarding pages
│   ├── restaurant/        # Restaurant dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── zod/                  # Validation schemas
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Database Changes

When making database changes:

1. Update the Prisma schema in `prisma/schema.prisma`
2. Generate a new migration:
   ```bash
   npx prisma migrate dev --name description-of-changes
   ```
3. Update the Prisma client:
   ```bash
   npx prisma generate
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔒 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation with Zod
- CORS protection
- Rate limiting on API routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@dineinn.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Mobile app for customers
- [ ] Online ordering integration
- [ ] Payment processing
- [ ] Inventory management
- [ ] Staff management
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API for third-party integrations

---

Made with ❤️ by the DineInn Team

next todos 

1 implement rating api's frontend and backend for menu page and admin dashboard #done
2 implement upvoting for all dishes for authenticated user @google auth
3 implement adding reviews feature for authenticated user @google auth  #done
4 show popup to get authenticated to unlock extra features like -:
    1 add to fav to order later on 
    2 upvote a dish 
    3 add a review with a msg 

    



#tasks to do 
post announcemnt cruds api and frontend
show proper analytics on analytics section and 
 