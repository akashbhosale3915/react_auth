import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://react-auth-vlhs.onrender.com', // Target backend API URL
        changeOrigin: true, // Enable CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the '/api' prefix
      },
    },
  },
});
