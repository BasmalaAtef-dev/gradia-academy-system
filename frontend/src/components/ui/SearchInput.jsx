import { Input } from './Input';

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export function SearchInput({ value, onChange, placeholder = 'Search...', ...rest }) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      iconLeft={<SearchIcon />}
      aria-label={placeholder}
      {...rest}
    />
  );
}
