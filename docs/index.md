<!-- # TAHADHARI

![TAHADHARI](assets/brand/tahadhari-logo.png){ width="320" }

**TAHADHARI is an offline-first conservation intelligence and patrol prioritisation platform.**
It turns fragmented park data — ranger patrol history, community reports, snare records, satellite
vegetation indices and weather — into a ranked map of where poachers are most likely to set snares
next, so commanders can send patrols to the right grid cell instead of guessing.

The field app keeps working with no cellular signal, stores reports locally, and syncs when the
ranger returns to base camp.

---

## Start here

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting Started](getting-started/index.md)**

    Clone, install, configure, migrate, seed, run, and confirm the stack is alive.

- :material-sitemap: **[Architecture](architecture/index.md)**

    The components, how data moves between them, and the offline sync model.

- :material-api: **[API Reference](backend/api-reference.md)**

    Every endpoint currently exposed by the deployed backend, transcribed from the live OpenAPI schema.

- :material-database: **[Database](database/index.md)**

    Tables, columns, types, constraints, and the ERD.

- :material-brain: **[AI and Prediction](ai/index.md)**

    The risk model, its inputs, how it is evaluated, and what it cannot do.

- :material-help-circle: **[Open Questions](open-questions.md)**

    Everything this documentation could **not** verify, in one list.

</div>

---

## How to read this documentation

This site follows one rule, in this order of priority:

!!! quote "Accuracy > completeness > polish"
    A clearly marked gap is better than a confident invention.

Because of that rule you will see three markers throughout:

| Marker | Meaning |
| --- | --- |
| `[VERIFY]` | Stated in a project document but **not** confirmed against running code or the live API. Treat as a strong hint, not a fact. |
| `[NOT YET DOCUMENTED]` | Nobody has written this down yet. It is a task, not an omission. |
| `[DECISION NEEDED]` | Two project sources contradict each other. The team must pick one. See [Open Questions](open-questions.md). |

## What was used as the source of truth

Documentation was written against the following evidence, in descending order of authority:

1. **The live deployed API** at `https://tahadhari-4157e9afb97a.herokuapp.com` — its Swagger UI,
   ReDoc page, OpenAPI 3.1 schema, and real request/response captures. This is the highest
   authority: it is running code.
2. **The entity relationship diagram** exported from the working database.
3. **The internal draft "Production Technical Documentation"** — useful for intent and rationale,
   but it disagrees with the live system in several places. Those disagreements are recorded in
   [Open Questions](open-questions.md) rather than smoothed over.

Anything not covered by those three sources is marked, not guessed. -->
