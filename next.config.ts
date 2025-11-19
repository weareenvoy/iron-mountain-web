import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    /* Add your ip address here if you need to test on a device locally */
  ],
  // Enable new caching and pre-rendering behavior
  cacheComponents: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  compress: true,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
  },
  experimental: {
    // Forward browser logs to the terminal for easier debugging
    browserDebugInfoInTerminal: true,
    globalNotFound: true,
    // cssChunking: true,
    // inlineCss: true, // Disabled due to font loading issues in production
    mcpServer: true,
    optimizePackageImports: [],
    ppr: false,
    taint: true,
    // Enable filesystem caching for `next build`
    // turbopackFileSystemCacheForBuild: true, // Available in Canary only
    // Enable filesystem caching for `next dev`
    turbopackFileSystemCacheForDev: true,
    typedEnv: true,
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // localPatterns: [
    //   {
    //     pathname: '/assets/images/**',
    //     search: '',
    //   },
    // ],
    qualities: [75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        hostname: '**.amazonaws.com',
        protocol: 'https',
      },
      {
        hostname: '*.envoyctrl.net',
        protocol: 'https',
      },
      {
        hostname: '*.googleusercontent.com',
        protocol: 'https',
      },
    ],
    unoptimized: true,
  },
  output: 'export',
  poweredByHeader: false,
  // productionBrowserSourceMaps: true,
  reactCompiler: true,
  reactStrictMode: true,
  trailingSlash: false,
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
    rules: {
      '*.svg': {
        as: '*.js',
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
              memo: true,
              svgoConfig: {
                multipass: true,
                plugins: [
                  'removeDimensions',
                  'removeOffCanvasPaths',
                  'reusePaths',
                  'removeElementsByAttr',
                  'removeStyleElement',
                  'removeScriptElement',
                  'prefixIds',
                  'cleanupIds',
                  {
                    name: 'cleanupNumericValues',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                  {
                    name: 'convertPathData',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                  {
                    name: 'convertTransform',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                  {
                    name: 'cleanupListOfValues',
                    params: {
                      floatPrecision: 1,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

const bundleAnalyzerPlugin = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const NextApp = () => {
  const plugins = [bundleAnalyzerPlugin];
  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};

export default NextApp;
