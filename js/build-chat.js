const esbuild = require('esbuild');

async function build() {
  try {
    const result = await esbuild.build({
      entryPoints: ['src/pages/ChatPage.tsx'],
      bundle: true,
      outfile: 'js/chat-bundle.js',
      format: 'esm',
      platform: 'browser',
      target: ['es2020'],
      jsx: 'automatic',
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      minify: process.env.NODE_ENV === 'production',
      sourcemap: process.env.NODE_ENV !== 'production',
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx',
      },
    });
    console.log('Build completed');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 