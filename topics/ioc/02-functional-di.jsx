// 1. The "Poor Man’s DI" (High-Order Functions)
// In functional programming, DI is just Partial Application. You don't need a framework; you just need a function that returns a function.
// The Problem: A function is hardcoded to a specific API call, making it impossible to unit test without network interception.
// The Pattern: Factory / Closure

// POOR MAN'S DI: We "inject" the dependency as the first argument
const createUser = (apiClient) => (userData) => {
  return apiClient.post("/users", userData);
};

// Usage in Production:
const saveWithAxios = createUser(axiosInstance);

// Usage in Tests (No mocks needed!):
const mockClient = { post: () => Promise.resolve({ id: 1 }) };
const saveWithMock = createUser(mockClient);

// Key takeaway: DI is fundamentally just parameterization.
// If you hardcode an import, you lose control. If you pass it as an argument, you keep it.

// 2. React Level: Props-based DI
// This is the most explicit form of DI in React. It’s great for small trees but leads to "Prop Drilling" if overused.
// The Pattern: Constructor Injection (via Props)
const UserList = ({ fetcher }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetcher().then(setData);
  }, [fetcher]);
  return (
    <ul>
      {data.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
};

// High-level "Composition Root" decides which fetcher to use
const CompTree = () => <UserList fetcher={api.getUsers} />;

// How to avoid abstraction hell

// 1. The "Leaf vs. Branch" Rule
// Leaf Components (Pure UI): Use Props/Slots. They should be "dumb" and easy to test by just passing data.
// Branch Components (Features/Pages): Do NOT make them 100% DI-ready via props. It makes the parent (the "Root") a nightmare to maintain.
// The Line: If a component represents a Business Feature (e.g., UserDashboard), it’s okay for it to "know" how to get its dependencies (via Context or Hooks).

// 2. The "Container/Presenter" split (The Classic)
// To keep the parent testable without prop-drilling, we use the Container Pattern.
// Presenter (UserList): Pure DI via props. Easy to test.
// Container (UserListContainer): Injects dependencies (from Context/Hooks) and passes them down.
// The Trade-off: You don't unit test the Container; you Integration Test it or trust that it’s just "glue code."

// 3. The "Injected Hook" (Better than HOC)
// Instead of passing the service via props, we wrap the dependency in a hook. To make it testable, we provide a Provider in the test setup.

// 1. The Logic (Injected via Context)
const useUserService = () => useContext(UserContext);

// 2. The Component (Clean, no prop-drilling)
const UserProfile = () => {
  const { getUser } = useUserService(); // DI happens here internally
};

// 3. The Test (We don't mock the component, we provide the dependency)
it("is easy to test", () => {
  render(
    <UserContext.Provider value={mockService}>
      <UserProfile />
    </UserContext.Provider>,
  );
});

// Rule of Thumb: If you find yourself writing jest.mock('./api') more than 3 times for the same module, it’s a signal that the module should have been Injected via Context or Props.

// The Concept: Ambient Dependencies
// Instead of "Pushing" dependencies down (Props), components "Pull" them from the environment (Context). In classic architecture, this is the Service Locator pattern.

// 1. Define the "Container" (The Registry)
```typescript
      const DIContext = createContext<{
        api: ApiService;
        logger: LoggerService;
      } | null>(null);
```;

// 2. The Consumer (The "Pull" mechanism)
const SaveButton = () => {
  // We resolve dependencies from the tree
  const { api, logger } = useContext(DIContext);

  const handleSave = async () => {
    try {
      await api.save();
    } catch (e) {
      logger.error(e);
      // or notifier.showMessage(), you don't have to import it directly as thunk action whatsoever
    }
  };

  return <button onClick={handleSave}>Save</button>;
};

// Instead of this (Hard Dependency):
import { showToast } from "@/store/actions/notifications";

// You do this (Inversion of Control):
const { notifier } = useDI();
notifier.showMessage("Success!");

// Implementation Swapping (Strategy Pattern)
// Use case: Environment-based Injection.
// Production: notifier sends data to Sentry and shows a UI Toast.
// Development: notifier just does console.log to keep the terminal clean.
// Tests: notifier is a simple jest.fn() (Spy) to verify the call happened.

// Composition Root (например, index.js)
// Single point in app where we import real implementation
const api = new AxiosApiService();
const logger =
  process.env.NODE_ENV === "production"
    ? new SentryLogger()
    : new ConsoleLogger();

const Root = () => (
  <DIContext.Provider value={{ api, logger }}>
    <App />
  </DIContext.Provider>
);

// The Redux withExtraArgument Pattern
// If you use Redux Toolkit, you don't have to import the API inside your thunks. You can inject it when creating the store.

// 1. Setup: Injecting at the "Root" (IoC)
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { api, logger, notifier },
      },
    }),
});

// 2. Usage: The Thunk doesn't "know" where api comes from
export const fetchUser =
  (id) =>
  async (dispatch, getState, { api, logger }) => {
    try {
      const user = await api.getUser(id);
      dispatch(userLoaded(user));
    } catch (e) {
      logger.error(e);
    }
  };
