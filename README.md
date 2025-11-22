# Marketing Dashboard

A high-performance React + TypeScript dashboard for analyzing marketing data across channels and regions.

## Features

- **📊 Interactive Data Table**: Paginated table with sorting, filtering, and search capabilities
- **📈 Performance Charts**: Visual insights with Recharts (Bar & Line charts)
- **🎯 Real-time Metrics**: Dynamically computed totals (Spend, Conversions, CTR, CPA)
- **🔍 Advanced Filtering**: Multi-select filters for channels and regions with debounced search
- **⚡ Optimized Performance**: React hooks (useMemo, useCallback), Redux Toolkit selectors
- **🎨 Modern UI**: Custom SCSS with CSS Modules and responsive design
- **📱 Mobile Friendly**: Responsive layout for all screen sizes

## Tech Stack

- **Framework**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Table**: @tanstack/react-table v8
- **Charts**: Recharts
- **Styling**: Custom SCSS/CSS Modules
- **Build Tool**: Vite
- **Data**: ~5,000 marketing records

## Performance Optimizations

- ✅ Memoized selectors with Reselect
- ✅ Code splitting with dynamic imports
- ✅ Debounced search (300ms)
- ✅ Optimized rendering with React.memo
- ✅ Proper React keys for list items
- ✅ Tree-shaking for minimal bundle size
- ✅ Target: Lighthouse Performance Score >90

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx          # Main dashboard container
│   │   ├── MetricCards.tsx        # KPI metric cards
│   │   └── PerformanceChart.tsx   # Recharts visualizations
│   ├── Table/
│   │   ├── DataTable.tsx          # Main table with sorting
│   │   └── Pagination.tsx         # Pagination controls
│   └── Filters/
│       ├── FilterBar.tsx          # Multi-select filters
│       └── SearchInput.tsx        # Debounced search
├── hooks/
│   ├── useDebounce.ts             # Debounce hook
│   ├── useTableData.ts            # Table data hook
│   └── useDataLoader.ts           # Data loading hook
├── store/
│   ├── slices/
│   │   └── marketingSlice.ts      # Redux slice with selectors
│   ├── store.ts                   # Redux store configuration
│   └── hooks.ts                   # Typed Redux hooks
├── types/
│   └── marketing.types.ts         # TypeScript interfaces
├── utils/
│   ├── calculations.ts            # Metric calculations
│   └── dataProcessing.ts          # Data utilities
├── App.tsx                        # Root component
├── main.tsx                       # Entry point
└── index.css                      # Global styles
```

## Key Metrics Explained

- **CTR (Click-Through Rate)**: (Clicks / Impressions) × 100
- **CPA (Cost Per Acquisition)**: Total Spend / Total Conversions
- **ROI (Return on Investment)**: ((Revenue - Spend) / Spend) × 100

## Features in Detail

### Data Table
- Sortable columns (click header to sort)
- Multi-column sorting support
- Pagination (25, 50, 100, 200 rows per page)
- Responsive design with horizontal scroll

### Filters
- Channel filter (multi-select)
- Region filter (multi-select)
- Search across all fields (debounced)
- Active filter count display
- Reset all filters button

### Charts
- Top 10 channels by spend (Bar chart)
- Spend & Conversions comparison
- CTR trend by channel (Line chart)
- Interactive tooltips with detailed metrics

### Performance
- Client-side pagination for fast navigation
- Memoized computed metrics
- Optimized re-renders with React.memo
- Efficient Redux selectors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

Built with ❤️ using React, TypeScript, Redux Toolkit, and Recharts
