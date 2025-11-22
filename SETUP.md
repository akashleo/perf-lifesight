# Setup Guide

## Quick Start

Follow these steps to get your marketing dashboard running:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18 & React DOM
- TypeScript
- Redux Toolkit & React Redux
- @tanstack/react-table
- Recharts
- Tailwind CSS
- Vite

### 2. Verify Data File

Ensure your data file is in the **public** directory:
```
public/1. marketing_dashboard_data.json
```

The app will fetch this file at runtime. If your file is currently in the root, move it:

```bash
# Create public directory if it doesn't exist
mkdir public

# Move the data file (if it's in root)
move "1. marketing_dashboard_data.json" public/
```

### 3. Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or another port if 5173 is busy).

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Troubleshooting

### Issue: Data not loading

**Solution**: Make sure `1. marketing_dashboard_data.json` is in the `public/` directory, not in `src/` or root.

### Issue: Port already in use

**Solution**: Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Issue: TypeScript errors

**Solution**: Run `npm install` to ensure all type definitions are installed.

### Issue: Tailwind styles not working

**Solution**: Ensure `postcss.config.js` and `tailwind.config.js` exist in the root directory.

## Performance Tips

1. **Production Build**: Always use `npm run build` for production - it's significantly faster
2. **Data Size**: The app handles 5k records efficiently. For larger datasets (>50k), consider server-side pagination
3. **Browser DevTools**: Use React DevTools and Redux DevTools for debugging

## File Structure Reference

```
perf-lifesight/
├── public/
│   └── 1. marketing_dashboard_data.json  ← Your data file goes here
├── src/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Next Steps

After setup:
1. Open http://localhost:5173
2. Explore the dashboard features
3. Try filtering by channel/region
4. Sort columns by clicking headers
5. Search for specific records
6. View performance charts

## Support

For issues or questions:
- Check the README.md for feature documentation
- Review the code comments in source files
- Ensure all dependencies are installed correctly
