module.exports = {
  apps: [
    {
      // Application name
      name: 'vibe-app',

      // Script to run
      script: 'npm',
      args: 'run start',

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Scaling
      instances: 'max',
      exec_mode: 'cluster',

      // Restart policies
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',

      // Logging
      out_file: 'logs/out.log',
      err_file: 'logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,

      // Health check
      cron_restart: '0 0 * * *', // Daily restart at midnight
      max_restarts: 10,
      min_uptime: '10s',

      // Environment-specific configs
      env_production: {
        NODE_ENV: 'production',
      },

      env_development: {
        NODE_ENV: 'development',
      },

      env_staging: {
        NODE_ENV: 'staging',
      },
    },
  ],

  // Deployment configuration for remote servers
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/your-repo.git',
      path: '/var/www/vibe-app',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production"',
    },

    staging: {
      user: 'deploy',
      host: 'your-staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/your-repo.git',
      path: '/var/www/vibe-app-staging',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
    },
  },
}
