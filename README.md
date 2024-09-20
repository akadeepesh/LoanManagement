# LoanManagement

LoanManagement is a modern, secure web application designed to streamline the loan application process. Built with Next.js 14, TypeScript, and MongoDB, it offers a robust platform for users to manage loan applications, verifiers to review submissions, and administrators to oversee the entire system.

![image](https://github.com/user-attachments/assets/9a97a4e2-6617-484d-85e5-f67ba703fd7e)

## Features

- **User Dashboard**: Create, update, delete, and track personal loan applications
- **Verifier Tools**: Review and approve loan applications efficiently
- **Admin Controls**: Manage users, assign roles, and oversee all applications
- **Secure Authentication**: Powered by NextAuth for robust, flexible authentication
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, Shadcn UI and framer-motion

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js

## Role-Based Access Control (RBAC)

LoanManagement implements a comprehensive RBAC system:

1. **Users**: CRUD operations on personal loan applications
2. **Verifiers**: Review and approve any application
3. **Administrators**: Full system access, user management, and global CRUD capabilities

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/akadeepesh/LoanManagement.git
   ```

2. Navigate to the project directory:

   ```
   cd loan_management
   ```

3. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

5. Run the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application can be easily deployed on Vercel, the platform created by the creators of Next.js. For other deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

We welcome contributions to LoanManagement! Please read our [CONTRIBUTING](CONTRIBUTING) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the seamless deployment platform
- MongoDB team for the powerful database solution

---

For support or queries, please open an issue or contact me at deepesh.kumar.ug21@nsut.ac.in.
