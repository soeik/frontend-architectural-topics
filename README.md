# Frontend Architecture Patterns

This repository is a curated collection of architectural patterns, design principles, and complex case studies. It serves as a living documentation for our regular architectural syncs and workshops.

## Goal

To move from "writing features" to "building systems." The focus is on creating **scalable**, **testable**, and **maintainable** frontend applications by reducing coupling and managing complexity.

---

## Inversion of Control (IoC)

The fundamental problem we solve is the **Multiplier Effect** of technical debt. A small dependency (like a direct import of `axios` or a toast library) in a small app is a minor detail. In a large-scale application, this multiplies across hundreds of components, leading to a "Fragile System" where the cost of change grows exponentially.

We use IoC to make our components **ignorant** of the outside world.

#### 1. UI Layer: Component Composition (Slots)

Moving away from prop-heavy configurations to flexible layouts.

- **Pattern:** `children` / Render Props.
- **Concept:** Default Slot Content for high-velocity development without losing flexibility.

#### 2. Logic Layer: Dependency Injection (DI)

Decoupling business logic from specific implementations.

- **Pattern:** Poor Man's DI (Functional partial application).
- **Concept:** Parameterization of side effects to enable painless Unit Testing.

#### 3. Infrastructure: Ambient Dependencies

Managing global services without Prop Drilling.

- **Pattern:** Service Locator via React Context.
- **Concept:** Module Injection in Thunks/Sagas (Inverting the Store dependencies).

---

## Repository Structure

The repository is organized by architectural concepts. Each folder contains:

- `topic.md`: Theory, "The Why", and trade-offs.
- `sub-topic.jsx`: A real-world examples

```text
topics/ioc
├── 01-ioc-ui-composition      # Slots, Children, Compound Components
├── 02-functional-di           # Partial application, Factory functions
└── ... (future topics)
├── 03-context-di              # Service Locators, DI Providers

```
