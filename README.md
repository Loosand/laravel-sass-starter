# Laravel React Starter Kit

A modern, full-stack web application starter kit built with Laravel and React. This project provides a solid foundation for building web applications with authentication, user management, and a beautiful, responsive UI.

## Features

- **Laravel 12** - Latest version of the Laravel framework
- **React 19** - Modern React with TypeScript support
- **Inertia.js** - Single-page app experience without the complexity
- **Tailwind CSS 4** - Utility-first CSS framework with latest features

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- NPM or PNPM
- SQLite (default) or other database supported by Laravel

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd laravel-sass-starter
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install JavaScript dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

4. **Set up environment**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Set up database**

    ```bash
    touch database/database.sqlite
    php artisan migrate
    ```

6. **Build assets**

    ```bash
    npm run build
    ```

## Development

### Quick Start

The easiest way to start development is using the built-in dev script that runs all necessary services:

```bash
composer run dev
```

This command will start:

- Laravel development server (http://localhost:8000)
- Queue worker
- Log viewer (Laravel Pail)
- Vite development server with hot reload

### Server-Side Rendering (SSR)

To enable SSR for better SEO and performance:

```bash
# Build SSR assets
npm run build:ssr

# Start with SSR
composer run dev:ssr
```

## Project Structure

```
├── app/                    # Laravel application code
├── resources/
│   ├── css/               # Stylesheets
│   ├── js/                # React application
│   │   ├── components/    # Reusable React components
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Inertia.js pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
│   └── views/             # Blade templates
├── routes/                # Laravel routes
├── database/              # Database migrations and seeders
├── tests/                 # PHP tests
└── public/                # Public assets
```

## Authentication

The application includes a complete authentication system powered by Laravel Fortify:

- **Login/Register** - Standard email/password authentication
- **Email Verification** - Optional email verification for new users
- **Password Reset** - Secure password reset via email
- **Two-Factor Authentication** - TOTP-based 2FA support
- **Profile Management** - User profile and password updates

## Deployment

1. **Build production assets**

    ```bash
    npm run build
    ```

2. **Optimize Laravel**

    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

3. **Set up environment variables**
    - Configure database connection
    - Set `APP_ENV=production`
    - Set `APP_DEBUG=false`
    - Generate secure `APP_KEY`

4. **Run migrations**

    ```bash
    php artisan migrate --force
    ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

If you encounter any issues or have questions:

1. Check the [Laravel documentation](https://laravel.com/docs)
2. Review [Inertia.js documentation](https://inertiajs.com/)
3. Search existing issues or create a new one

---

Built with ❤️ using Laravel, React, and modern web technologies.
