// Simple UI

// PROBLEM: Tight Coupling. Search bar "owns" button
// When OK: Part of design system or component where there is no variation in shape and style of the button
// High level business components
const SearchInput = ({ onSearch }) => (
  <div>
    <input type="text" />
    <button onClick={onSearch}>Найти</button>
  </div>
);

// SOLUTION (IoC): SearchBar provides a slot
// Button or icon is responsibility of parent component
// When to use: better for containers eg Layout, Wrapper, Modal etc
// Low-level components supposed to be building blocks
const SearchBar = ({ children }) => (
  <div className="flex">
    <input type="text" />
    {children}
  </div>
);

// Rule of a thumb (rule of 3 props)
// If you have to pass more than 3 props to adjust underlying button slyle then it's a sign to go IoC path

// Practical examples
// Pattern: Fixed UI
const DeleteConfirmation = ({ onConfirm }) => (
  <div>
    <p>Are you sure?</p>
    <PrimaryButton onClick={onConfirm}>Delete</PrimaryButton>
  </div>
);

// Pattern: Slot / Compound Component. User has full control
const ModalFooter = ({ children }) => <div>{children}</div>;

// Usage
const CustomModalFooter = () => (
  <ModalFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="danger">Delete</Button>
  </ModalFooter>
);

// IoC is a powerful tool, but this power comes with a cost of higher cognitive load for the consumer
// Sometimes default slot is a way to go

// The component provides a default button,
// but "inverts control" if children are provided.
const BetterSearchBar = ({ onSearch, children }) => (
  <div>
    <input type="text" placeholder="Search..." />
    {/* If children exist, render them. Otherwise, render the default action */}
    {children ? (
      children
    ) : (
      <button onClick={onSearch} className="default-btn">
        Submit
      </button>
    )}
  </div>
);

// Usage 1: Standard (Convenience)
const CompOne = () => <SearchBar onSearch={handleSearch} />;

// Usage 2: Custom (IoC in action)
const Comptwo = () => (
  <SearchBar>
    <IconButton icon="voice-search" onClick={handleVoice} />
    <button onClick={handleSearch}>GO</button>
  </SearchBar>
);
