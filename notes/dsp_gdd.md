# Dead Saints Parade — Game Design Document

| Field | Value |
|---|---|
| **Version** | 1.1 (consolidated) |
| **Date** | 9 June 2026 |
| **Author** | Jhonnatan C. Barbosa |
| **Status** | Draft — solo dev, iterated in place |
| **Platforms** | Steam (PC + Steam Deck) |
| **Target Release** | Q2 2027 · Steam Next Fest demo Feb 2027 |
| **Engine** | Unity 6.3 (6000.3.10f1) |

## About This Document

This is the **single design doc** for Dead Saints Parade (DSP). It replaces the earlier modular ecosystem (separate GDD, FDDs, multiple manuals) because the team is one person, and maintaining cross-references between files was slower than the value they provided. Each section is **overview depth**; the two fully-designed features (Cover, Lockpicking) and the fully-specced implemented feature (Sound Propagation) are kept in full detail because their numbers matter. Implementation manuals (catalogued in §29) remain as deep-dive references for whoever is coding a specific system that day.

When in conflict, **this document is authoritative** for design intent; individual manuals are authoritative for implementation detail.

---

## Table of Contents

**Part 1: Foundation & Identity**
- [1. Game Overview](#1-game-overview) · [2. Core Pillars](#2-core-pillars) · [3. Design Boundaries](#3-design-boundaries) · [4. Competitive Analysis](#4-competitive-analysis)

**Part 2: Player Experience**
- [5. Core Loop](#5-core-loop)
- [6. Controls](#6-controls)
- [7. Character Mechanics](#7-character-mechanics) — inc. [7.4 Cover & Stealth Movement](#74-cover--stealth-movement)
- [8. Combat System](#8-combat-system) — inc. [8.5 Detection Escape & Alert Decay](#85-detection-escape--alert-decay)
- [9. Progression Systems](#9-progression-systems) — inc. [9.4 Character Stats & Use-Based Progression](#94-character-stats--use-based-progression)
- [10. Puzzle & Exploration Mechanics](#10-puzzle--exploration-mechanics) — inc. [10.4 Lockpicking](#104-lockpicking) · [10.4a Cascading Interactions](#104a-cascading-interactions) · [10.5 Journal, Observations & Clues](#105-journal-observations--clues) · [10.6 Inspection Mode](#106-inspection-mode)
- [11. Player Fantasy & Power Curve](#11-player-fantasy--power-curve)
- [12. AI & NPC Behavior Philosophy](#12-ai--npc-behavior-philosophy) — inc. [12.2.5 Suspicion Formula](#1225-suspicion-formula) · [12.6 Multi-Guard Coordination](#126-multi-guard-coordination) · [12.7 Patrol & Investigation Design](#127-patrol--investigation-design) · [12.8 Civilian NPC Brains](#128-civilian-npc-brains)
- [13. Systems Interaction Matrix](#13-systems-interaction-matrix)
- [14. Difficulty & Accessibility Philosophy](#14-difficulty--accessibility-philosophy) — inc. [14.4 Tuning Parameters by Difficulty](#144-tuning-parameters-by-difficulty)
- [15. Narrative & World](#15-narrative--world) — inc. [15.5 Antagonists — Three Bosses](#155-antagonists--three-bosses-three-zones)
- [16. Art & Visual Style](#16-art--visual-style)
- [17. Audio & Sound Design](#17-audio--sound-design) — inc. [17.5 Sound Propagation Model](#175-sound-propagation-model)

**Part 3: Technical Blueprint**
- [18. Technical Specifications](#18-technical-specifications) — inc. [18.5 Architecture Principles](#185-architecture-principles) · [18.6 Implemented Systems Snapshot](#186-implemented-systems-snapshot) · [18.7 Save System & Scene Transitions](#187-save-system--scene-transitions)
- [19. Technical Risk Register](#19-technical-risk-register)
- [20. Content & Level Breakdown](#20-content--level-breakdown) — inc. [20.3 Vertical Slice](#203-vertical-slice--the-church-of-lost-consolation) · [20.4 Clue Density Targets](#204-clue-density-targets) · [20.5 Sub-area Archetype Contracts](#205-sub-area-archetype-contracts) · [20.6 Sub-area Roster](#206-sub-area-roster-proposed) · [20.7 Branch Theory & Visual Language](#207-branch-theory--visual-language) · [20.8 Backtracking, Gating & Scene Transitions](#208-backtracking-gating--scene-transitions) · [20.9 Per-Scene Performance Budget](#209-per-scene-performance-budget)
- [21. Project Scope & Milestones](#21-project-scope--milestones) — inc. [21.3 Roadmap](#213-roadmap--whats-next)

**Part 4: Business & Support**
- [22. Localization Plan](#22-localization-plan) · [23. QA & Testing Plan](#23-qa--testing-plan) · [24. Marketing & PR](#24-marketing--pr) · [25. Monetization & Post-Launch Plan](#25-monetization--post-launch-plan) · [26. Analytics & Metrics](#26-analytics--metrics)

**Part 5: Process & Compliance**
- [27. Decision Log](#27-decision-log) · [28. Legal & Compliance](#28-legal--compliance)

**Part 6: Appendices**
- [29. Satellite Document Links](#29-satellite-document-links) · [30. Glossary](#30-glossary)

---

# Part 1: Foundation & Identity

## 1. Game Overview

### 1.1. Elevator Pitch

Dead Saints Parade is a third-person immersive sim stealth game where you play a vulnerable spy infiltrating an oppressive Gothic-Victorian world. Information is your most powerful weapon. The constant fear of discovery fuels a narrative that critiques power structures and confronts you with obscure moral choices.

### 1.2. Concept Statement

You are fragile. The guards are not. The city is old and rotting from within. You are here to steal its secrets — letters, ledgers, overheard prayers, whispered confessions — and to slip out before the wrong person notices the wrong shadow moving. Every level is a problem solved with patience, route-planning, and the careful use of masks, shadows, and silence. The real weight of the story is revealed not by cutscenes but by what you read in the margins of someone else's diary.

### 1.3. Genre

- **Primary:** Immersive Sim
- **Secondary:** Stealth, Psychological Horror, Suspense

### 1.4. Target Audience

- **Demographics:** Core PC players, 25–45.
- **Psychographics:** Players who replay Thief's *The Sword* to find one more loot, who remember the codec calls in MGS, who lit candles in Gloomwood just to see what moved.
- **Reference audiences:** Fans of *Thief* (1/2/Deadly Shadows), *Metal Gear Solid*, *Deus Ex*, *System Shock*, *Dishonored*, *Gloomwood*.
- **Target rating:** PEGI 16+ / ESRB M — intense violence, psychological horror, complex social themes.

### 1.5. Platforms & Distribution

- **Primary platform:** PC
- **Storefronts:** Steam (primary), Epic Games Store, GOG (post-launch)
- **Performance targets:** PC 1080p, high settings, 60 fps · Steam Deck 800p, low settings, 60 fps
- **Secondary platforms:** Consoles only post-launch, not in scope for 1.0.

### 1.6. Key Features

- **Punishing, tense stealth.** A classic, austere stealth system where direct combat is a death sentence. Survival depends on observation and avoiding conflict.
- **Interconnected, atmospheric world.** A decaying Gothic-Victorian setting where every shadow hides a threat and every document reveals a fragment of a deeper conspiracy.
- **Information as a weapon.** Read letters, overhear conversations, spy on rituals, and use what you learn to unlock routes, timings, and the truth. Narrative is conveyed primarily through environmental storytelling.
- **Lovecraftian, psychological terror.** The danger is not only physical. Paranoia, obscure moral choices, and the suggestion of something occult create tension that never fully releases.
- **Embedded social critique.** The narrative is a mirror of real oppressive power structures: authority, morality, and the price of knowing.

### 1.7. Core Team

| Name | Role(s) |
|---|---|
| Jhonnatan Barbosa | Game Director, Producer, Technical Game Designer, Narrative Designer, Sole Developer |
| Tallis Toyama | Support Programmer (part-time) |

### 1.8. Current Implementation Status

As of June 2026 the codebase carries **18 named systems** (full snapshot in §18.6, mirrored from `README.md`). **Fifteen are complete:** lockpicking, cover, single-guard AI, multi-guard coordination, light & shadow detection, contextual interaction, inventory, health & damage, journal & observations (including RE4-style inspection), character progression (use-based stats), Steam integration, two tiers of debug infrastructure, extended player controller, and sound propagation (§17.5 — four-term attenuation model with surface types, wall occlusion, masking volumes/emitters, and debug HUD). **Three are in progress:**

- **Distraction / throwables** (§8.3, §18.6 #17) — phases 1–2 shipped and end-to-end verified (a thrown brick emits a `SoundCategory.Distraction` event and guards investigate the *impact point*, not the player), then deliberately **put on hold** to resume alongside combat or after the Phase C UI.
- **Save / load + scene transitions** (§18.7, §20.8) — phases 1–6 of 10 complete; **pending:** Steam Cloud routing, settings split, difficulty gates + quicksave, migration table.
- **Analytics collection** (§26) — the event plan is complete and locked, but the `AnalyticsAccumulator` and dashboard declarations are not built, so no events fire yet.

**Not yet started in-engine:** combat (the dagger stealth-kill foundation is fully specced in `CombatSystem_Manual.md` — see §8), NPC dialogue, and the Influence stat. All current UI is placeholder OnGUI; the Canvas pass is Phase C. The project is in a solid "systems done, content and polish next" state.

### 1.9. Thematic Intent (original design north star)

The themes the game is built to explore — written down here so they aren't lost as design evolves. Approached **indirectly**, in the Kojima-MGS tradition: the game never lectures, the message lives in environmental detail, document margins, NPC behaviour, and what the player chooses to do about what they've read.

**Top-level themes:**

- **Revolution and espionage.** The protagonist is not just a spy — they are a spy operating in a moment of would-be revolution. Who employs them, what cause is being served, and whether either deserves loyalty are themselves questions the game raises and does not resolve.
- **Class oppression.** The Gothic-Victorian setting is not aesthetic dressing. The city's power runs along class lines: nobles, clergy, lay staff (Informants — §12.3), drugged worshippers (Civilians), street poor. NPC archetypes, document authorship, and document content should keep those rungs visible without ever stating them.
- **Religion as institution.** The Church of Lost Consolation is the game's central institution; faith, authority, and complicity sit on top of each other and cannot be cleanly separated. The §20.3 three-layer ambiguity extends to the religion itself: corrupt scheme, mass delusion, or something that may simply be true.
- **"Revolutionary justice."** What is permissible in service of liberation? The protagonist's mission, what they read, and what they do about it should keep this question open — not as a dilemma the game adjudicates, but as a residue the player carries.

**Intended player feelings:**

- **Fear.** Not jump-scare fear; the slow, embodied fear of being noticed. Mechanically reinforced by Pillar 1 (Vulnerability) and Pillar 2 (Tactical Stealth with Severe Consequences).
- **Weight of conscience.** Killing leaves bodies; bodies escalate alerts; bodies are also people. The civilian NPC system (§12.8) makes this a system, not a slogan — every act of violence has a witness, a corpse, or both. The narrative thread — what the spy carries from this — lives in the protagonist's diary entries (Layer 2, §20.3) and in observations (§10.6).

**How "indirectly" works in DSP — concrete rules:**

- No expository monologues, no on-screen briefings about politics, no character explaining the moral of the scene.
- Theme is carried by: document text (§10.5), observations (§10.6), the protagonist's own journal entries that may be unreliable (§20.3 Layer 2), NPC barks, costume and placement of civilian archetypes (§12.3, §12.8, §15.5), and what the player must *do* to progress.
- The player is trusted to read between the lines. Players who don't are not punished; they get the surface game and miss the substrate, which is fine.

This subsection is a **reference target** for the rest of the GDD: when a future feature's thematic justification reduces to "for atmosphere," it should be checked against §1.9. If it doesn't pull on at least one of these themes, it is decoration.

---

## 2. Core Pillars

The four pillars below are non-negotiable. Any feature that does not support at least one of them gets cut. Pillars are *feelings and philosophies*, not features.

### 2.1. Pillar Definitions

#### Pillar 1 — Vulnerability and Survival through Observation

You are always fragile. Direct combat is almost always fatal. Progression depends on avoiding confrontation, observing meticulously, and using intelligence to survive. Knowledge of the environment is the key to survival, not brute force.

**Manifestations:** 3 HP baseline, no passive regen, scarce healing items; lockpicks break; guards kill you in 2–3 hits; death is frequent, reloading is cheap, learning is expected.

#### Pillar 2 — Tactical Stealth with Severe Consequences

Stealth is the primary gameplay mechanic, with deep detection systems based on sound, cover, light, and shadow. Being discovered has drastic consequences. Every move must be planned.

**Manifestations:** Multi-guard alert propagation; Alert-state timers force commitment to hiding; damage cry broadcasts your position at 10m; body discovery bypasses suspicion and triggers instant Alert; sound travels through walls (partially muffled, never fully blocked).

#### Pillar 3 — Non-Linear Exploration with Environmental Narrative

The world is linear in its spine (beginning, middle, end) but offers multiple paths, secrets, and optional areas. Exploration is rewarded with lore, items, and information that deepen story and social critique. Narrative is told primarily through environment, documents, and secondary dialogue.

**Manifestations:** Locked doors gate optional areas; new keys open old doors (backtracking rewarded); Master-tier locks hide the best narrative documents; observations in corners reward curiosity; clues pulled from documents and observations feed a single journal knowledge graph.

#### Pillar 4 — Information as Power and Psychological Terror

Information is the in-game economy. The journal is not a log; it *is* the game. Themes of the occult and of creeping sanity loss are suggested rather than stated. Tension and paranoia never fully resolve.

**Manifestations:** Every document and observation becomes a journal entry; author-defined clues are the actionable nuggets; three-layer narrative ambiguity (see §20.3) means the player is never sure whether what they saw was real, imagined, or something worse.

### 2.2. How the Pillars Reinforce Each Other

| Pillar Interaction | Resulting Feeling |
|---|---|
| Vulnerability + Tactical Stealth | Paranoia — every step matters because every failure is expensive |
| Tactical Stealth + Non-Linear Exploration | Mastery — knowing the space means knowing the safe routes |
| Non-Linear Exploration + Information as Power | Discovery — secrets reveal both lore and tactical advantages |
| Information as Power + Vulnerability | Dread — the more you know, the more the world feels unsafe |

### 2.3. Pillar Conflict Resolution

When pillars conflict, the priority order is **1 > 2 > 4 > 3**. Vulnerability beats everything — a feature that lets you shortcut stealth (e.g. bullet-time combat) is cut even if it's "cool." Information-richness beats exploration convenience — a long detour to a document is preferred over "auto-collect."

---

## 3. Design Boundaries

**DSP is not:**

- Not an action game. No dodge rolls, no parry windows, no combo meters. Combat is a planning *failure*, not a system to master.
- Not open world. The map is three linked areas with aggressive asset reuse.
- Not a full RPG. Stats exist but are parameter-space (see §9.1); there are no skill trees, no class choices, no dialogue branching with stat checks.
- Not multiplayer. Single-player only.
- Not procedurally generated. Every lock, route, and clue is hand-placed.
- Not a walking sim. Stealth tension is real; failure has cost.
- Not free-to-play. One-time purchase, no microtransactions, no battle pass.

---

## 4. Competitive Analysis

### 4.1. Market Position Statement

DSP sits in the niche between **Gloomwood** (first-person survival horror stealth) and **Dishonored** (action-stealth sandbox), leaning toward the classic-Thief end of the spectrum. It is shorter than Dishonored (~2–3 hr vs. 10–15 hr), quieter than Gloomwood (no shotgun power fantasy), and more information-centric than either.

### 4.2. Competitor Breakdown

| Game | Strength | What DSP Does Differently |
|---|---|---|
| *Thief* (1/2) | Lockpicking + light/shadow tension | Modernised third-person camera; cover system; author-defined clue extraction into a journal |
| *Dishonored* | Powers-driven stealth sandbox | No supernatural player powers; vulnerability is the whole point |
| *Gloomwood* | Atmosphere, object physics | Third-person (not first-person), narrative-forward, no combat power fantasy |
| *Metal Gear Solid* | Linked-area map flow | Adopts the linked-area structure without the cinematic cutscene weight |
| *Deus Ex / System Shock* | Immersive-sim systems depth | Pares the simulation back to stealth + information; no RPG dialogue trees |

---

# Part 2: Player Experience

## 5. Core Loop

### 5.1. Loop Diagram

```
       ┌──────────────────────────────────────────────┐
       │                                              ▼
   OBSERVE → PLAN → INFILTRATE → COLLECT → ASSIMILATE → EVADE
       ▲                                              │
       └──────────────────────────────────────────────┘
                     (loop repeats per area)
```

### 5.2. Phase Breakdown

| Phase | Action | Systems | Feeling |
|---|---|---|---|
| **Observe** | Arrive at a safe overlook, scan patrols, sound sources, light sources, interactables | AI Senses, Light/Shadow, Sound Propagation, Journal | Cautious awareness |
| **Plan** | Pick a route, sequence, contingency | Player knowledge, environmental awareness | Calculated tension |
| **Infiltrate** | Execute: crouch, sidle, hug walls, extinguish lights, distract | Cover, Movement, Sound, Interaction | Adrenaline-laced focus |
| **Collect** | Steal documents, overhear dialogue, find diaries | Interaction, Lockpicking, Inventory, Journal | Rewarding discovery |
| **Assimilate** | Pause in safe location; journal auto-updates; clues guide next step | Journal, Progression | Quiet satisfaction |
| **Evade** | Escape with what you know | All stealth systems | Relief + lingering tension |

### 5.3. Secondary Loops

- **Backtracking loop:** A key found late opens a door seen early. Reward: a missed document or shortcut.
- **Progression loop:** Use-based XP means the loop itself raises stats — pick locks → Finesse ↑; read documents → Acuity ↑; survive damage → Vigor ↑.
- **Clue inference loop:** A clue from one document ("the combination is 7-3-9") unlocks a safe elsewhere. Inference is the reward.

---

## 6. Controls

Controls follow the genre norm. Keyboard/mouse is primary; gamepad is fully supported via Steam Input.

| Action | Keyboard | Gamepad |
|---|---|---|
| Move | WASD | Left Stick |
| Look | Mouse | Right Stick |
| Sprint | Left Shift (hold) | Click Left Stick |
| Crouch toggle | C | B / Circle |
| Prone toggle | Z | Click Right Stick |
| Jump | Space | A / Cross |
| Interact | E | Y / Triangle |
| Cover | *automatic* (walk into wall) | *automatic* |
| Peek (in cover) | *automatic* at edges | *automatic* |
| Cancel interaction / inspection | Esc | B / Circle |
| Journal (planned) | J | D-Pad Up |
| Inventory (planned) | Tab | D-Pad Down |

Lockpicking and inspection use direct-device reads while `Time.timeScale = 0`, so the Input System action map is temporarily bypassed during those modes.

---

## 7. Character Mechanics

### 7.1. Movement

Third-person controller extended from Unity's StarterAssets. Movement states, their animator bools, and the base noise radius they emit (before surface modifiers):

| State | Speed | Noise Radius | Notes |
|---|---|---|---|
| Still | 0 | 0 m | No footsteps emitted |
| Crouch | 1.5 m/s | 1.5 m | `Crouch` bool true; suspicion ×0.5 |
| Prone | 0.8 m/s | 0.5 m | `Prone` bool true; forces exit from cover |
| Walk | 4 m/s | 4 m | Default |
| Run / Sprint | 7 m/s | 12 m | Only available out of cover |
| In Cover (sliding) | 1.5 m/s | 1 m | Footsteps every 0.45 m of lateral travel |

Noise radius is *before* surface-type multiplication (§17.5.a) and ambient masking subtraction (§17.5.c).

### 7.2. Interaction

A single contextual interaction framework drives the whole game. Any world object implementing `IInteractable` gets detected, prioritised, prompted, and activated through one button.

- **Detection:** `InteractionManager` singleton, `OverlapSphereNonAlloc` at `MaxScanRange` (6 m) from player chest, filtered by priority. Each interactable carries an editor-tunable `InteractionRange`; `0` falls back to the global default `InteractRange` (2.5 m). A keyhole detail can be set to 0.8 m, a wall mural to 4 m — range is per object, not one global value.
- **Prompt:** OnGUI placeholder, priority-tinted. Canvas UI deferred to Phase C.
- **Priority tiers (lower = higher priority):** Lockpick **10** > Door/Lever **20** > LightSource **25** > Pickup/Document **30**.
- **Sound on interaction:** Every interaction emits into `AISoundSystem`. Door slow/normal/fast = 2/5/8 m, light extinguish = 4 m, item pickup = 1 m, lever = 3 m, document read = 0 m (silent).
- **Lock + Door handoff:** When both exist on the same GameObject, lock (priority 10) overrides door (priority 20) while locked. After the pick succeeds, `lock.CanInteract → false`, `door.CanInteract → true` — the transition is automatic with zero explicit code.
- **Cascading (tiered) interactions:** Every interactable fires an `OnInteractionCompleted` UnityEvent on success, and the manager skips any interactable whose component is disabled. A designer ships a later tier gated and wires the previous tier's event to enable it — observe a locked drawer → enables the lockpick → succeeding reveals an item pickup. Full mechanic in §10.4a.

Six interactable types exist today: `DoorInteractable`, `LightSourceInteractable`, `ItemPickup`, `DocumentPickup`, `LeverInteractable`, `LockInteractable`. New types implement `IInteractable` on any MonoBehaviour — no base class, no manager changes.

### 7.3. Physical Constraints

- No climbing, no vaulting, no swimming in 1.0.
- Fall damage: triggers above a vertical speed threshold, scales with Vigor (see §9.4).
- `IsDead` and `IsStaggered` on the controller block all input during death fade-out and post-hit stagger (0.3 s).
- `InteractionManager.IsInteracting` blocks movement during any full-screen interaction (lockpicking, reading, inspection).

### 7.4. Cover & Stealth Movement

Cover is the primary defensive tool. It is **automatic, not button-activated** — walk toward a wall and the player snaps into cover after 4 frames of sustained contact (~66 ms at 60 fps). This removes a button press during high-tension moments.

**Detection and validation:**

- 5-ray fan cast (0°, ±30°, ±60° from player forward) at 0.7 m range, from player chest height.
- Walls must be vertical (rejects floors/ceilings).
- Approach angle < 60° — parallel running past a wall won't trigger cover.
- 4 contact frames required before snap-in — prevents single-frame flicker.

**Magnetic standoff:** Once in cover, the system keeps the player at an ideal **0.42 m** from the wall (≥ controller radius + 0.1 to avoid penetration). Perpendicular-axis corrective nudge at speed 10 keeps the player glued without jitter.

**Wall-tangent movement:** Camera-relative input projects onto the wall's tangent:

```
wallTangent   = Cross(CoverNormal, Vector3.up).normalized
worldInput    = camRight × input.x + camForward × input.y
tangentSlide  = Dot(worldInput, wallTangent)
```

Effect: a wall facing the camera uses A/D to slide left/right. A wall on the player's left uses W/S. Any arbitrary angle works automatically, with no special cases.

**Movement numbers while in cover:**

| Parameter | Value | Purpose |
|---|---|---|
| Walk speed | 1.5 m/s | Slower than normal walk; sprint disabled |
| Rotation slerp | 10 | Player rotates to face away from wall |
| Footstep emit interval | every 0.45 m | Lateral travel; feeds AI hearing at 1 m radius |
| Exit dot threshold | > 0.65 | Player pushing ~49° into wall — deliberate exit only |

**Automatic edge peek:** Two shoulder rays (height 1.2 m, width ±0.45 m, forward 0.3 m) detect wall edges. When a ray misses, the system activates a dedicated over-the-shoulder peek camera.

**3-tier Cinemachine camera system:**

1. **Scene cameras** — designer-placed with `CameraTrigger` volumes.
2. **Cover offset camera** — `CoverCameraController` lateral shift (base offset 0.4, peek extra 0.35, lerp 6–8).
3. **Peek camera** — `PeekCameraController` dedicated shoulder-swap with world-space aim target 4 m away, shoulder offsets (±0.55, 1.4, −1.8).

**Animator parameters:** `InCover` (bool), `CoverIsPeeking` (bool), `CoverPeekDirection` (float −1/0/+1), `CoverMoveSpeed` (float −1..+1 blend).

**Exit conditions:** Jump, prone, or push-away input > 49° into wall. Crouch and stance toggles persist within cover without exiting.

**AI interaction:** While in cover and *not* peeking, vision detection is fully blocked (the wall handles LOS naturally). Peeking treats the player as partially exposed — suspicion fills as if the player were crouched (×0.5).

**Corner behaviour:** The system commits to one wall and stays on it. When the player reaches an outer corner, the peek camera looks around it but the body is clamped at the edge — to round the corner, the player exits cover (push away from the wall) and re-engages on the next wall. This is intentional: free auto-wrap would undercut the Vulnerability pillar by gliding the player blindly into unknown space. Inside corners stay committed to the original wall via fan-ray normal locking (`NormalLockDot`), so the surface-alternation jitter that earlier builds had is gone.

**Known limitations:**

- No cover-to-cover dash transitions.
- No scripted/animated corner turn — corner rounding is a manual exit + re-engage, not a button-confirmed wrap.
- No vault/climb over cover.
- Peek uses `FindObjectsByType` to save/restore the scene camera — minor allocation.
- Single-surface tracking only; complex geometry may break.

---

## 8. Combat System

### 8.1. Combat Philosophy

Combat in DSP is brutal, fast, and lethal for both sides. It is the result of a planning *error*, never the intended resolution of an encounter. Every combat system is tuned so that *fleeing and hiding* is the optimal response to any alerted guard.

### 8.2. Lethality Model

- **Max HP:** 3 by default (Easy = 5, Normal = 3, Hard = 2; ship with Normal only, the other values tested but not exposed at launch — see §14).
- **No passive regeneration.** HP only returns via scarce `ConsumableData` healing items routed through `ItemUseHandler → PlayerHealth.Heal()`.
- **I-frames:** 1.0 s invulnerability after any damage.
- **Stagger:** 0.3 s movement freeze on hit, `IsStaggered` guard in the controller.
- **Low-health state:** At ≤ 1 HP, a vignette overlay and a breathing-loop audio cue activate.
- **Death:** Fade to black (1.5 s), scene reload (~2.5 s total).
- **Damage sources:** `GuardAttack` (melee, 1 HP/hit, only in Alert state), `HazardZone` (environmental tick), `TrapDamage` (one-shot, disarmable), `FallDamageDetector` (1–2 HP, threshold modified by Vigor).
- **Damage cry:** On any damage, the player emits a 10 m `SoundCategory.Environment` event. Getting hit once is free; getting hit while a second guard is nearby usually isn't.

### 8.3. Weapon Overview

| Weapon | Role | Scarcity | Notes |
|---|---|---|---|
| Dagger | Stealth kill from behind | Always carried | One-hit kill on common enemies; useless in frontal combat |
| Caplock Pistol | Loud, desperate | 3–5 shots per playthrough | Emits 50 m `SoundCategory.Weapon` (2× suspicion multiplier) — wakes the whole building; can also shoot lanterns to extinguish them |
| Improvised (bottles, bricks) | Distraction | Scavenged | **No NPC damage** — thrown to emit a `SoundCategory.Distraction` event so guards investigate the impact point, not you (see §18.6 #17) |

### 8.4. Alert & Detection States

Full perception and state-machine details live in §12. Summary for combat context:

- **Normal** — patrol route, no stimulus.
- **Cautious** — investigating a sound or sighting; walks to stimulus and does a 60° head sweep.
- **Alert** — pursues the last-known position with a 90° sweep; kills on melee contact.

### 8.5. Detection Escape & Alert Decay

When you get caught:

1. **Break line of sight immediately.** The Alert timer only ticks while the guard *cannot* see you. If visible, the guard resets the timer every frame.
2. **Hide in shadow.** Below `LightInvisibilityThreshold` (0.2) the guard cannot see you even at close range.
3. **Wait out the timers.** Alert duration = **30 s**, then decays to Cautious. Cautious duration = **20 s**, then returns to Normal.
4. **Don't get spotted mid-escape.** Every re-sighting resets Alert to full.
5. **Kill the body.** Body discovery bypasses suspicion entirely, triggers *instant* Alert, and sets a persistent `HasSpottedBody` flag — the guard will not return to Normal until you hide the corpse. Design intent: stealth kills have real consequences.

---

## 9. Progression Systems

### 9.1. Progression Philosophy

Progression in DSP is **use-based and parameter-space**. You never stop to spend points. You don't unlock new abilities. What changes is how *easy* existing mechanics are to execute: the sweet spot widens, suspicion fills slower, you take one more hit before dying. A max-Finesse player still has to *find* the lockpick sweet spot — skill doesn't bypass the minigame, it nudges its parameters. This is the immersive-sim balance: character stats and player skill both matter, neither replaces the other.

### 9.2. Progression Channels

1. **Stats** (use-based, see §9.4) — Vigor, Finesse, Acuity, Influence.
2. **Inventory** — keys, lockpicks, consumables, documents.
3. **Knowledge** — journal entries and clues (see §10.5).

No experience points are shared across channels; reading a document does not raise Vigor.

### 9.3. Inventory & Equipment

A small, purposeful item system — no grid Tetris.

- **ScriptableObject-driven:** `ItemData`, `DocumentData` (extends ItemData), `ConsumableData` (extends ItemData). Each defines type, max stack, weight, whether it's consumable, whether it's quest-protected.
- **`InventoryManager` singleton:** 20-slot capacity. `AddItem`, `RemoveItem`, `HasItem`, `GetCount`, `UseItem`, `GetItemsByCategory`, `GetAllDocuments`.
- **Stacking:** Identical items stack up to max (lockpicks = 20, keys = 1, documents = 1).
- **Quest-item protection:** Flagged items cannot be dropped or lost.
- **Keys are consumed on use.** A key that unlocks a door is removed from inventory. Design intent: keys are one-shot solutions, not master tools.
- **LockpickInventory** is now a thin bridge over `InventoryManager` — zero breaking changes to existing lockpicking code.
- **UI status:** debug HUD only until Phase C adds the pause menu.

### 9.4. Character Stats & Use-Based Progression

Four stats, use-based XP, no point allocation:

| Stat | Governs | XP Sources |
|---|---|---|
| **Vigor** | Effective Max HP (+2 at max), fall damage threshold (+3 m/s at max) | Surviving damage, healing items |
| **Finesse** | Lockpick sweet-spot width (+4° per side at max), pick break speed (×0.5 at max), movement noise radius (−30% at max) | Successfully picked locks (tier-scaled) |
| **Acuity** | Suspicion fill rate on self (−30% at max), future trap detection | Reading documents (XP on `DocumentData.AcuityXPOnRead`), making observations |
| **Influence** | NPC interactions *(deferred — no XP source wired yet)* | Reserved |

**XP curve:** Gently exponential. Level 1 = 50 XP. Level 10 = 680 XP. Per-stat max level 10 by default. `AnimationCurve` on `StatData` is the authoring handle.

**System hooks (six):**

1. `LockpickMinigame.PlayerSkillLevel` reads `PlayerProgression.GetNormalisedValue(StatType.Finesse)` every frame.
2. `EnemySenses` multiplies its suspicion-fill rate by `(1 − 0.3 × NormalisedAcuity)`.
3. `PlayerNoiseEmitter` multiplies its radius by `(1 − 0.3 × NormalisedFinesse)`.
4. `PlayerHealth.EffectiveMaxHP = MaxHP + floor(VigorBonus × 2)`.
5. `FallDamageDetector` adds `+3 m/s` threshold at max Vigor.
6. `DocumentPickup` awards Acuity XP on first read, plus any `BonusStatXP` entries (training manuals grant Finesse, etc.).

**Events:** `OnStatLevelUp`, `OnXPGained`, `OnStatChanged` — UI and other systems subscribe for reactions (HP grant on Vigor level-up, toast on level change).

---

## 10. Puzzle & Exploration Mechanics

### 10.1. Puzzle Philosophy

Puzzles in DSP are **observational**, not combinatorial. The player doesn't rearrange sliding tiles; they notice a pattern, connect a clue to a lock, realise a conversation describes a schedule. Lockpicking is the only reflex-based puzzle and it is about dexterity and pick economy, not logic. The rest of the design leans on environmental storytelling: the *real* puzzle is the world itself.

### 10.2. Puzzle Types

- **Environmental puzzles** — a candle next to a piece of flash paper; a lever hidden behind a tapestry.
- **Lockpicking** (§10.4) — dexterity + pick economy + risk/reward.
- **Clue-based inference** — a document mentions a safe combination; another describes where the safe is. The player connects them.
- **Lever sequences** — `LeverInteractable` wired to `UnityEvent` chains; used for drawbridges, gate shutters, concealed doors.
- **Tiered interactions** — completing one interaction enables the next (observe a drawer → unlock it → take what is inside). A generalisation of the lever pattern to every interactable; see §10.4a.

### 10.3. Exploration Rewards

| Optional area | Typical reward |
|---|---|
| Locked side-door | Document + supplies (lockpicks, consumable) |
| Hidden alcove | Observation with a clue |
| Backtrack with new key | Skipped corridor + strategic shortcut |
| Master-tier lock | Best narrative documents in the region |

### 10.4. Lockpicking

Lockpicking is a Skyrim-inspired **pick-and-turn minigame**, adapted for a third-person Gothic-Victorian immersive sim. The player sees the lock top-down, rotates the pick to find the sweet spot, then applies tension to turn the cylinder. Misalignment shakes the pick and degrades it.

**Core fiction and scarcity:** Picks are rare loot. Starting inventory is 5; max stack is 20. Each broken pick is a meaningful resource loss — this is the Vulnerability pillar in action.

**The five tiers:**

| Tier | Sweet-spot arc, base (total) | Sweet-spot arc, skill 1.0 (total) | Break Speed (HP/s, base) | Break Speed (skill 1.0) | Worst-case break time (skill 0) |
|---|---|---|---|---|---|
| Simple | 30° | 38° | 15 | 7.5 | ~6.7 s |
| Standard | 20° | 28° | 22 | 11 | ~4.5 s |
| Advanced | 12° | 20° | 32 | 16 | ~3.1 s |
| Expert | 6° | 14° | 45 | 22.5 | ~2.2 s |
| Master | 3° | 11° | 65 | 32.5 | ~1.5 s |

Pick HP is a flat **100** for all tiers. Difficulty scales via break *speed*, not durability. The sweet-spot columns are the **total arc**; the minigame stores half-widths (half these numbers) and Finesse adds **+4° per side** at max (§9.4) — so Master goes from 3° total (1.5° half) to 11° total (5.5° half).

**Pick degradation formula:**

```
damage = baseBreakSpeed × breakMultiplier × skillReduction × dt

breakMultiplier = lerp(0.3, 1.0, errorNormalised)   // 0.3 at sweet-spot edge, 1.0 at max error
skillReduction  = lerp(1.0, SkillBreakSpeedMultiplier, PlayerSkillLevel)
                                                     // default SkillBreakSpeedMultiplier = 0.5
```

**Cylinder rotation limit (quadratic falloff):**

```
if inside sweet spot:
    maxRotation = 90° (full open)
else:
    rotationError = clamp01((angularError - halfWidth) / (90 - halfWidth))
    maxRotation  = (1 - rotationError²) × 90°
```

Close misses still allow substantial rotation — that's the feedback loop. Far misses jam almost immediately.

**Sweet spot widening (Finesse stat hook):**

The minigame stores sweet spots as **half-widths**; `SkillBonusHalfWidth` (default **4°**) is added to *each side* at max skill. The tier table above is in **total arc** (= 2 × half-width).

```
effectiveHalfWidth = baseSweetSpotHalfWidth + (SkillBonusHalfWidth × PlayerSkillLevel)
// SkillBonusHalfWidth = 4°  → added to EACH side at skill 1.0
// Master: base half-width 1.5°  (= 3° total arc)
//   skill 0 → 1.5° half  →  3° total
//   skill 1 → 5.5° half  → 11° total
// Simple: base half-width 15°   (= 30° total arc)
//   skill 1 → 19° half   → 38° total
```

**Time and input:** `Time.timeScale = 0` on start (world fully paused); all logic uses `Time.unscaledDeltaTime`. Dismiss and rotation inputs are polled directly from device (bypassing the Input System action map, which is framework-stalled at timeScale 0). On end, `Time.timeScale` is restored.

| Input | Device | Action | Detail |
|---|---|---|---|
| Mouse X / Right Stick X | Mouse / Gamepad | Rotate pick | sensitivity 0.5, `× 60` dt normalisation |
| LMB / Right Trigger | Mouse / Gamepad | Apply tension | trigger threshold > 0.3 |
| Esc / Gamepad B | Keyboard / Gamepad | Cancel |  |

**Rendering is fully decoupled from logic.** Current implementation is OnGUI + GL immediate-mode — zero asset dependencies, placeholder art. Swapping to a Canvas UI requires replacing only the render methods; all math, input, events, timing stay identical. A future 3D lock model with a close-up Cinemachine camera is a polish item, not a design dependency.

**XP on success:** Tier-scaled XP to Finesse — Simple 10, Standard 15, Advanced 20, Expert 30, Master 50.

**Future hook:** `OnPickBroken` event fires on every break. Sound Propagation (§17.5) will subscribe to emit a `SoundCategory.Interaction` event at ~6 m radius, making failed picks a stealth risk. Currently lockpicking is silent.

**Known limitations:**

- Placeholder rendering (no resolution scaling, no animated sprites).
- No kneeling / hand-placement animation on the character.
- Singleton pattern — fine for single-player.
- Sweet spot re-randomises each attempt; not save-serialised.

### 10.4a. Cascading Interactions

Interactions can be **tiered**: completing one enables the next, so a designer stops stacking three overlapping prompts on one object and instead reveals them in sequence.

- **The event.** `ObservationInteractable`, `LockInteractable`, `ItemPickup`, `DoorInteractable`, and `DocumentPickup` each fire an `OnInteractionCompleted` UnityEvent on success — wired in the Inspector, no code.
- **The gate.** `InteractionManager` skips any interactable whose component is disabled. A later tier ships with its component unchecked (object stays visible — e.g. a lock on a drawer you can already see) or its whole GameObject inactive (object hidden — e.g. an item inside a closed drawer). The previous tier's event flips it on.
- **Canonical example.** A desk drawer: observe it (tier 1) → the event enables the `LockInteractable` (tier 2) → picking the lock fires the lock's event, which `SetActive`s the `ItemPickup` hidden inside (tier 3). At no point do two prompts overlap.
- **Persistence.** The four saveable sources re-fire `OnInteractionCompleted` on load, so a cascade survives a save made mid-sequence. `LockInteractable` is not saveable — a tier gated purely behind a lock is not restored (acceptable: the downstream pickup re-appears via its own save state).
- **Authoring rule.** Wire only idempotent, state-setting actions (`enabled`, `SetActive`, `ForceOpen`) to `OnInteractionCompleted` — the event re-fires on load, so one-shot side effects (VFX, SFX, XP) would replay.

This generalises the existing `LeverInteractable` UnityEvent pattern and the Lock + Door handoff (§7.2) into one mechanism available to every interaction type.

### 10.5. Journal, Observations & Clues

The journal is not a log. **It is the game.** Every document read and every environmental observation creates a journal entry. Entries contain **author-defined clues** — the actionable nuggets extracted at asset-creation time by the narrative author, not runtime-parsed from prose. This gives narrative total control over what is "important" and prevents ambiguity about what is actionable.

**Two information sources:**

- **Documents** — picked up and read via `DocumentPickup`. First read creates a journal entry.
- **Observations** — detected via `ObservationInteractable`. The protagonist has a first-person thought overlay; the journal entry is created; Acuity XP is granted.

**Two orthogonal classification axes:**

| Axis | Values | Meaning |
|---|---|---|
| `JournalEntryType` | Document, Observation, Conversation *(future)* | How the entry was obtained |
| `JournalCategory` | Intelligence, LoreAndHistory, PersonalDiary, FinancialRecord, Map | What the entry is about |

A bloodstain observation might be `Observation × Intelligence`. A church-history document might be `Document × LoreAndHistory`. The pause-menu UI (Phase C) can filter by either axis.

**`ClueData` (serializable):**

```csharp
public class ClueData
{
    public string ClueID;            // "clue_ledger_safecode"
    public string ClueText;          // "The safe combination is 7-3-9."
    public string LinkedObjective;   // optional objective ID
    public string SourceTitle;       // auto-populated by JournalManager
}
```

**`JournalManager` (singleton) API:**

```
AddDocumentEntry(DocumentData, locationDesc)    // deduplicated by ItemID
AddObservationEntry(title, thought, category, clues, locationDesc)
GetAllEntries() / GetEntriesByCategory / GetEntriesByType
GetAllClues() / GetUnreadCount / GetEntryCount / HasEntry

Events: OnEntryAdded, OnClueDiscovered, OnEntryRead
```

**Authoring workflow (documents):** Create a `DocumentData` SO → fill ItemID, DisplayName, FullText, Author, DocumentDate, JournalCategory, AcuityXPOnRead → expand Clues → add `ClueData` entries with ClueID + ClueText → assign to a scene `DocumentPickup`.

**Authoring workflow (observations):** Add `ObservationInteractable` to any object with a Collider → fill ThoughtText (first-person, present tense, 1–3 sentences), ThoughtDisplayDuration, JournalTitle, JournalCategory → optionally add Clues → set AcuityXPReward (5–10 minor, 15–20 standard, 25–40 major) → flag `IsOneShot` unless re-examination makes narrative sense → optionally wire `OnInteractionCompleted` to gate a follow-up interaction (§10.4a).

**Vertical-slice clue-density target:**

| Area | Documents | Observations | Total Clues |
|---|---|---|---|
| Clergy Offices | 2–3 | 0–1 | 1–2 |
| Cloister | 1–2 | 2–3 | 2–3 |
| Main Nave | 3–4 | 2–3 | 4–6 |
| Catacombs & Chapel | 2–3 | 3–4 | 5–8 |
| **Total** | **~10–12** | **~8–12** | **~15–20** |

**Known limitations:**

- No in-world journal UI yet (Phase C task). Debug HUD is the stand-in.
- New-entry notifications are console-only via `DebugToast`.
- Entries reset on Play Mode exit — save/load not yet implemented.
- Clues don't cross-reference each other automatically.

### 10.6. Inspection Mode

Some observations deserve a stage, not a whisper. A bloody altar with ritual carvings, a ledger with crossed-out names, the Maestro's half-written *Chant for the Void* — these demand **RE4-style** treatment. Game freezes. Camera cuts to a dramatic close-up. The world waits. The moment breathes.

Inspection is **opt-in per observation**: designer adds an `InspectionCameraController` component alongside `ObservationInteractable`. Without it, the observation stays ambient (thought fades in, world keeps running). This way most observations are cheap to author; the load-bearing narrative beats get full cinematic treatment.

**Mechanics:**

- Dedicated Cinemachine camera (disabled until activated).
- `Time.timeScale = 0` pause on start; guards freeze, everything holds.
- `InteractionManager.IsInteracting = true` blocks all movement.
- Optional hard cut vs. blend (`UseBlend`, default hard cut — more dramatic).
- Optional orbit (RE4 look-around), pitch/yaw clamped per observation.
- Dismiss input via direct device reads (same pattern as lockpicking).

**Inspector-tunable:**

| Field | Default | Purpose |
|---|---|---|
| `UseBlend` | false | Hard cut or Cinemachine blend into inspection |
| `BlendDuration` | 0.3 s | Blend time |
| `AllowLookInput` | false | Enables orbit |
| `LookSensitivity` | 1.5 | Orbit speed |
| `PitchClamp` | 30° | Max vertical rotation from initial angle |
| `YawClamp` | 45° | Max horizontal rotation |
| `InspectionEnterSound` / `InspectionExitSound` | null | Optional audio cues |

**Camera placement guidance:**

- **Close-ups** (0.5–1 m) fill 60–80% of frame — documents, ritual markings.
- **Medium** (1.5–3 m) shows object + surroundings — altars, desks.
- **Low angle** (camera below eye level) for dread — hanging figures, looming crucifixes.
- **Dutch tilt** (5–10° Z-roll) for "wrongness" — occult markings.

**Decoupled responsibility:** `InspectionCameraController` knows nothing about observations, journals, XP. It only manages camera, time, input. `ObservationInteractable` detects it via `GetComponent` and delegates. The controller is reusable on `DocumentPickup`, `ItemPickup`, or any future interactable.

**Open questions (see Decision Log §27):** Post-processing during inspection (vignette + DoF)? Mute ambient sound on `AudioListener.pause`? True 3D object rotation via a dedicated render layer? Not answered yet — the current implementation achieves ~80% of RE4 feel at ~10% of engineering cost.

---

## 11. Player Fantasy & Power Curve

### 11.1. The Player Fantasy

You are a patient, clever, fragile person who knows more than the people hunting you. Your power is not supernatural or athletic. It is: *knowing which candle to extinguish before the guard turns*, *knowing which corridor the rain masks your steps through*, *knowing the safe combination because you read the chamberlain's diary three levels ago*.

### 11.2. Emotional Arc

- **Early:** Cautious, over-careful, reloading often. The world feels oppressive.
- **Middle:** Confident, reading patrols fluently, exploiting masking zones. The world feels *knowable*.
- **Late:** The occult layer surfaces; confidence breaks. What you thought you knew is not what's happening. The world feels *wrong*.

### 11.3. Power Curve Guardrails

- **No new abilities.** Stats adjust parameters only (§9.1).
- **Caps are hard.** Max Finesse is +8° total sweet-spot width — Master locks are still thin.
- **Scarcity is permanent.** Lockpicks and pistol shots never become plentiful.
- **Rewards are informational, not combat.** Progression sharpens knowledge, not lethality.

---

## 12. AI & NPC Behavior Philosophy

### 12.1. AI Philosophy

Guards are the *thing stealth pushes against*. Without them, cover hides you from nothing, footsteps make noise nobody hears, lockpicks have no stakes. The design goals:

1. **Readable, learnable patrols.** Predictable enough to observe, complex enough to create real timing challenges.
2. **Seeing vs. noticing** modelled by two-zone vision (§12.2).
3. **Stats + player skill coexist.** Every perception parameter is tunable per guard via `GuardData` ScriptableObject. A crouched, still player in shadow at max range fills suspicion hundreds of times slower than a sprinting, lit player at close range.
4. **Sound is global, vision is local.** Sound travels through walls (partially muffled); vision requires line-of-sight. The asymmetry rewards different play styles.
5. **Three-tier alert.** Combat is a fail state. Alert decays. The player waits.
6. **Body discovery escalates immediately.** Stealth kills have consequences; corpses must be hidden.
7. **Nothing is hardcoded.** All thresholds live on `GuardData`. Designers tune without touching code.

### 12.2. Perception Model

Perception inputs: **vision, sound, light level, player posture, movement state, body sightings**. These are combined into a single suspicion value on `AIBlackboard`, which the state machine (§12.4) reads.

#### 12.2.1. Vision — Two-Zone Cone

- **Inner (focused) cone:** `InnerConeHalfAngle` 30° (total 60°), `InnerConeRange` 15 m. Detects *any* player — moving or still.
- **Outer (peripheral) cone:** `OuterConeHalfAngle` 60° (total 120°), `OuterConeRange` 8 m. Detects only players *moving* above `MovementDetectionThreshold`. A stationary player in peripheral vision is invisible. This creates the classic "freeze when the cone sweeps toward you" moment.
- Peripheral detection fills suspicion at **40% of the normal rate** — it's a vague sense, not a clear sighting.

#### 12.2.2. Line of Sight

After the cone check passes, **1–3 raycasts** fire from the guard's `EyeHeight` (default 1.6 m) to player centre-mass, head, and feet. ANY clear ray counts as LOS. Multiple rays reduce false negatives when only the player's head pokes above cover.

#### 12.2.3. Light Gating

If `lightLevel < LightInvisibilityThreshold` (default 0.2) → guard **cannot see the player**, full stop. Above threshold, light is remapped to [0..1] and raised to `LightCurveExponent` (default 2.0, quadratic). 50% light = 25% detection speed. Shadow matters.

#### 12.2.4. Cover Integration

In cover and not peeking → vision is fully blocked by the wall raycast. Peeking → partial exposure, treated as "crouched" for suspicion math.

#### 12.2.5. Suspicion Formula

`GuardData.CalculateSuspicionFillRate()` takes five inputs:

| Input | Range | Source |
|---|---|---|
| `distanceNormalised` | 0 (point blank) – 1 (max range) | `EnemySenses` |
| `angleNormalised` | 0 (dead centre) – 1 (cone edge) | `EnemySenses` |
| `lightLevel` | 0 (darkness) – 1 (full light) | `PlayerLightDetector` |
| `isMoving` | bool | `CharacterController.velocity` |
| `isCrouching` | bool | Animator `Crouch` bool |

Formula, step by step:

1. **Light gate** — if below threshold, return 0.
2. **Light multiplier** — `pow(remap(lightLevel, threshold..1, 0..1), LightCurveExponent)`.
3. **Distance multiplier** — linear, 1.0 at point blank, 0.1 at max range.
4. **Angle multiplier** — quadratic falloff from centre (1.0) to edge (0.0).
5. **Crouch multiplier** — 0.5× crouched, 1.0× standing.
6. **Movement multiplier** — 1.0× moving, 0.6× still.
7. **Combine** — all multipliers × together → `combinedMult` in [0..1].
8. **Map to fill rate** — linear interpolation between `WorstCaseFillTime` (default 0.5 s) at `combinedMult = 1.0` and `BestCaseFillTime` (default 5.0 s) at `combinedMult = 0.0`.

**Example scenarios:**

| Scenario | Fill Time to Alert |
|---|---|
| Standing, full light, centre of cone, close range | ~0.5 s (worst case) |
| Crouching, dim light (0.4), edge of cone, far range | ~5 s+ (best case) |
| Still, in shadow (below threshold), anywhere | ∞ (invisible) |
| Moving in peripheral cone only | ~12 s (40% of normal rate) |

### 12.3. NPC Archetypes

**Combatant / civilian roster:**

| Archetype | Preset | Role |
|---|---|---|
| Standard Guard | `StandardGuard.asset` | Baseline patrols; majority of enemies in Church |
| Nervous Guard | `NervousGuard.asset` | Lower suspicion thresholds, jumpier — used in Catacombs |
| Civilian | `CivilianData.asset` + civilian-tuned `GuardData` | Passive observer; reacts to violence, not sight; killing leaves an `EnemyBody` |
| Screamer | `ScreamerData.asset` + civilian-tuned `GuardData` | On sight: gasp delay → scream → flee. Scream is a `CivilianScream` sound event guards investigate as Cautious |
| Informant | `InformantData.asset` + civilian-tuned `GuardData` | On sight: walks to nearest non-Alert guard and reports. Player wins by intercepting before contact (see §12.8) |

**Bosses (one per zone, see §15.5):**

| Boss | Zone | Preset | Notes |
|---|---|---|---|
| The Maestro | Church | `Maestro.asset` | Distraction-only; low `LightCurveExponent` (sees better in dim light), larger detection range |
| (TBD) | Dungeons | `Boss2.asset` (TBD) | **Open** — design constraints in §15.5 |
| The Dreamer (working title) | Cave | `Dreamer.asset` (TBD) | "Welcoming antagonist" archetype; psychic dream-contact precedes the encounter |

Each archetype is one asset; swapping behaviour profiles is a drag-and-drop. Civilian archetypes share a `Civilian_GuardData.asset` perception preset (narrower cones, shorter range, higher `LightInvisibilityThreshold`, slower fill) — they glance, they don't search.

### 12.4. Communication & Escalation

State transitions and timers:

| From | To | Condition |
|---|---|---|
| Normal | Cautious | Suspicion ≥ `CautiousThreshold` (0.30) |
| Normal | Alert | Suspicion ≥ `AlertThreshold` (0.85) **or** body discovered |
| Cautious | Alert | Suspicion ≥ `AlertThreshold` **or** body discovered |
| Alert | Cautious | `AlertDuration` (30 s) expires **and** player not visible |
| Cautious | Normal | `CautiousDuration` (20 s) expires |

**Alert timer only ticks while the player is not visible** — maintain LOS, and the guard chases indefinitely.

**Investigation (Cautious):** Walk to stimulus at `CautiousMoveSpeed`, 60° head sweep for `InvestigationLookDuration`, then timer ticks. New sound > 2 m from current target redirects.

**Pursuit (Alert):** Chase at `AlertMoveSpeed`, update destination in real time if visible. On LOS loss, go to last-known position and search with a 90° sweep.

**Patrol resumption:** On return to Normal, the state machine calls `EnemyPatrol.ResumePatrol()` — guard returns to the exact waypoint they were interrupted at. All stimulus data clears via `Blackboard.ClearStimulusData()`.

### 12.5. AI Believability & Failure States

#### 12.5.1. Acceptable AI Limitations

- Guards don't open doors autonomously (level design avoids door-blocked patrol routes).
- No dynamic conversation; guards emit barks, not dialogue.
- Sound currently travels through walls unattenuated; Sound Propagation (§17.5) fixes this.
- No dynamic ambient behaviour (guards don't smoke, eat, or vary idle between patrol waits).

#### 12.5.2. AI Behavior Red Lines

- Guards must *never* teleport to the player.
- Guards must *never* walk in circles on investigation.
- Guards must *never* enter an "always on alert" state not triggered by player action.
- Alert timer must always tick toward Normal when the player is hidden.

#### 12.5.3. Emergent Behavior Tolerance

Acceptable emergence: a guard losing sight of the player behind a pillar, searching nearby, *then* hearing a distant masking-zone sound and redirecting. Not acceptable: a guard "forgetting" the player is behind them because suspicion decayed.

### 12.6. Multi-Guard Coordination

`GuardCoordinator` (singleton, auto-discovers all guards on Start) lifts perception from per-guard to per-team.

**Mechanisms:**

- **Alert shout propagation.** When a guard enters Alert, it emits a `GuardShout` through `AISoundSystem` (follows sound rules, attenuates with distance). Other guards within `ShoutRadius` receive a *scheduled* state escalation via `ShoutReactionDelay` (staggered, human-feeling). Body discovery triggers *instant* reaction for all nearby.
- **Shared last-known position.** Coordinator maintains `TeamLastKnownPosition` on the blackboard. Guards without their own sighting use this as their investigation target — they converge.
- **"Did you hear that?" soft propagation.** Cautious-level events nudge nearby guards with a small suspicion bump and a look-toward, capped below `CautiousThreshold` so soft alerts alone never escalate.
- **Dynamic group search roles.** When 2+ guards are in Alert, the coordinator assigns roles every frame by position:
  - **Pursuer** — closest to last-known position.
  - **Sentry** — closest to nearest Exit `SearchNode`.
  - **Flanker** — assigned to `HidingSpot` nodes or calculated flank.
  Roles swap as guards move.
- **`SearchNode` level-design component.** Designers place markers in the scene: `Exit`, `HidingSpot`, `Chokepoint`, `General`. Colour-coded gizmos, priority-based scoring, static self-registry for zero-allocation lookup.

**Blackboard as coordination layer.** The coordinator writes to blackboard fields (`ReceivedTeamAlert`, `TeamRequestedState`, `AssignedSearchRole`, `AssignedSearchPosition`). The state machine reads on its own tick. The coordinator **never** calls `TransitionTo()` directly — preserves per-guard state-machine autonomy.

### 12.7. Patrol & Investigation Design

**Patrol routes** are sequences of `PatrolWaypoint` entries, each with:

- **Wait time** — seconds guard pauses at the stop.
- **Movement speed** — per-segment override (optional).
- **Look-at target** — Transform the guard faces while waiting (optional).

**Ping-pong vs. loop** is a per-route boolean. Loops are good for rectangular rooms; ping-pong is good for corridor patrols. Designers should avoid mid-route chokepoints that force ping-pong collisions.

**Length guidance:** 4–8 waypoints per route; waits of 1.5–4 s at meaningful positions. Avoid pure-movement routes — the "Observe" phase needs *pauses* to work.

**Investigation vs. pursuit sweep angles:** Cautious = 60° head sweep. Alert = 90°. The wider Alert sweep compensates for higher stress (guards are worse at focused scanning when alarmed).

**Body discovery setup:** Tag a GameObject `EnemyBody` → `EnemySenses.BodyDetectionRange` default 10 m → inner cone + range + LOS → `SpottedBodyThisFrame` (impulse) + `HasSpottedBody` (persistent) + `Suspicion = 1.0` (guaranteed Alert on next frame).

### 12.8. Civilian NPC Brains

Three "brains" (`ScreamerBehaviour`, `CivilianBehaviour`, `InformantBehaviour`) implement a new `INPCBrain` interface. They sit alongside `EnemyStateMachine` rather than replacing it; perception (`EnemySenses`, `EnemyHearing`, `PlayerLightDetector`) and patrols (`EnemyPatrol`) are unchanged. Civilians use a shared higher-threshold `GuardData` preset — narrower cones, shorter range, higher `LightInvisibilityThreshold`, slower fill.

A shared `PanicStimulus` struct (`LoudViolence`, `CivilianScreamHeard`, `BodyWitnessed`, `CombatWitnessed`, `DirectSighting`) routes panic events from `EnemyHearing` and `EnemySenses` into the brain. A new `SoundCategory.CivilianScream` is added; guards treat it as a sound event and escalate to Cautious (not Alert) — the guard didn't see the player themselves.

Killing any civilian leaves an `EnemyBody`; same discovery → Alert pipeline as a guard body. Violence is punished even against the unarmed (Pillar 2). The Informant's "report" writes directly to the contacted guard's blackboard (`ReceivedTeamAlert = true`, `TeamLastKnownPosition = ReportedSightingPosition`); standard `GuardCoordinator` propagation handles the rest.

Full state machines, ScriptableObject schemas, panic-stimulus integration matrix, build phases, and the test runbook are in `Development_Plan_Civilian_NPC_System.md`. **All three archetypes are in Vertical Slice scope** (overriding the source plan's Informant-deferral recommendation — the trade is more variety in the demo for ~2.5 days of additional engineering).

---

## 13. Systems Interaction Matrix

Which systems feed which. Read row → column.

|  | Cover | Interaction | Sound | Light | Journal | Inventory | Progression | AI Senses | AI State |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Player Movement** | emits | reads | emits | reads | — | — | — | — | — |
| **Cover** | — | blocks | reads | — | — | — | — | blocks LOS | — |
| **Lockpicking** | — | — | emits (future) | — | — | uses | XP → Finesse | — | — |
| **Interaction** | — | — | emits | toggles | — | — | — | — | — |
| **Documents / Observations** | — | — | — | — | writes | reads | XP → Acuity | — | — |
| **Sound Propagation** | — | — | — | — | — | — | — | reads | — |
| **Guard Coordinator** | — | — | emits shouts | — | — | — | — | — | writes blackboard |

Empty cells are either not wired or not meaningful. Columns "AI Senses" and "AI State" are the primary consumers — most player actions eventually express themselves as a suspicion delta.

---

## 14. Difficulty & Accessibility Philosophy

### 14.1. Difficulty Philosophy

DSP ships with a **single tuned difficulty (Normal)**. The codebase supports Easy/Hard via `MaxHP` and a few tunable knobs, but the decision to expose additional modes is deferred to post-playtest. The immersive-sim tradition is that the challenge comes from systems depth, not from a difficulty slider, and DSP respects that.

### 14.2. Difficulty Parameters

What a difficulty mode *could* change, for reference:

- Player Max HP.
- Starting pick count.
- Suspicion fill times (worst/best case).
- Alert / Cautious decay durations.
- Masking zone subtraction (wider zones = easier).

### 14.3. Accessibility Features

Planned (not yet implemented):

- Subtitle size + background opacity.
- High-contrast outline mode for interactables.
- Reduced-motion toggle (disables Cinemachine impulse shake).
- Colour-blind friendly palette for `SearchNode` gizmos (already true; codify for final UI).
- Remappable controls through Steam Input (already functional).
- Masking-zone player indicator (debug flag exists; promote for accessibility).

### 14.4. Tuning Parameters by Difficulty

The single place to answer "what changes between difficulties?"

| Parameter | Easy | Normal (ship) | Hard |
|---|:-:|:-:|:-:|
| Max HP | 5 | **3** | 2 |
| Starting lockpicks | 8 | **5** | 3 |
| `WorstCaseFillTime` (s) | 0.8 | **0.5** | 0.3 |
| `BestCaseFillTime` (s) | 6.0 | **5.0** | 3.5 |
| Alert duration (s) | 20 | **30** | 45 |
| Cautious duration (s) | 15 | **20** | 25 |
| Masking cap (m) | −12 | **−10** | −8 |
| Guard LOS rays | 1 (centre only) | **3 (centre/head/feet)** | 3 |

---

## 15. Narrative & World

### 15.1. Story Synopsis

You are a spy sent into the Church of Lost Consolation, a decaying cathedral at the edge of an oppressive Gothic-Victorian city. Your mission: learn what the Maestro — the church's charismatic head — is really doing behind the rituals. What begins as a straightforward infiltration reveals a conspiracy that is, depending on how you read the evidence, a political coup, a slow collapse of your own sanity, or something much older and much worse.

The Maestro is the first of three antagonists — one for each region of the journey (Church → Dungeons → Cave). See §15.5.

### 15.2. Themes

- **Power and authority.** Who gets to decide what is sacred, and who pays for the decision.
- **Information as currency.** Every letter is a transaction; every whisper is a debt.
- **Moral ambiguity.** There are no clean answers. The church is corrupt; its enemies are also corrupt.
- **Occult ambiguity.** The game never confirms whether the supernatural is real or imagined — see §20.3.
- **Revolution and legitimacy.** What the spy serves, and whether that cause has earned its claim on them. The game raises the question; it does not adjudicate. (§1.9)
- **Class and complicity.** The city's power runs along class lines; nobles, clergy, lay staff, drugged worshippers, and street poor each occupy a different rung. NPC archetypes (§12.3, §12.8) and document authorship (§10.5) make those rungs visible without naming them. (§1.9)
- **Conscience under coercion.** Every act of violence leaves a body and a witness. The protagonist's diary entries (§20.3 Layer 2) carry the residue. (§1.9)

### 15.3. World Overview

- **Setting:** A city-state in perpetual decline. Gas-lit streets, soot-blackened stone, cold rain through broken roofs.
- **The Church of Lost Consolation:** The vertical-slice area. Once grand, now rotting from within. Three linked regions (§20).
- **The outside world:** Referenced through documents and overheard talk; never directly playable.

### 15.4. Storytelling Methods

Ranked by priority:

1. **Environmental storytelling** — the room state tells the story without text. A half-eaten meal, a door locked from the inside.
2. **Found documents** — diaries, letters, ledgers; max ~200 words each; feed the journal + clues.
3. **Observations** — first-person protagonist thoughts on environmental details. Ambient or Inspection (§10.6) depending on importance.
4. **NPC dialogue / barks** — limited; most NPCs are environmental. Barks communicate AI state ("Was that a sound?").
5. **Cinematics** — reserved for major beats only (2–3 in the whole game), max 2 min each.

Voice acting is a stretch goal. Music and SFX are mostly licensed assets, not original recordings.

### 15.5. Antagonists — Three Bosses, Three Zones

Each region has its own boss, each tuned to that region's dominant pillar and signature mechanic. The three together form the protagonist's arc from rational scepticism → psychological unmooring → confrontation with something that may simply be true. Each boss also maps onto one layer of the §20.3 ambiguity (Rational / Psychological / Occult) without locking the player into believing that layer.

**Boss 1 — The Maestro (Church).** Charismatic head of the Church of Lost Consolation. Distraction-only encounter in the Chapel of the Dead. Carries the three-layer ambiguity at its peak — the player can leave still uncertain whether he is a fraud, a symptom, or a vessel.

**Boss 2 — TBD (Dungeons).** **Open.** Design constraints: must reinforce the dungeons' signature mechanics (extinguishable candles, Nervous Guards) and the Layer-2 (psychological) strand of the narrative. Candidate framings to be evaluated during dungeons pre-production.

**Boss 3 — The Dreamer (working title) (Cave).** A "welcoming antagonist" in the mould of the great archetypal villains — polite, curious, addresses the protagonist as an old friend. Establishes psychic dream-contact in the Catacombs **before** any face-to-face meeting in the Cave. Leads a cult mentally linked to him as a hive; followers are physically and psychologically transformed by proximity. Believes he is the hero of the story; his motive is ideological (purification, isolation, "saving our people from outsiders"). Drawn from a deep archetype lineage (Dagoth Ur, Kreia, Lord Soth, Sauron-in-the-Silmarillion, real-world cult leaders) — the parts kept are **archetypal, not IP-specific**.

*Specifically reskinned to avoid Bethesda fingerprints:* no volcano / red-mountain imagery; no "blight," "corprus," "ash," "sleepers," or "Sixth House" naming; no golden mask with fixed smile; no beat-for-beat replication of the Nerevar/Tribunal betrayal. The corruption mechanism is native to our setting (the **fungal agent** already named in Layer 2 of §20.3 is the strongest candidate); the power source is native to our world (a candidate: something pre-human buried under the Cave; final choice deferred to the cave LDD). His prior relationship to the protagonist — and whether either of them was ever the betrayer — is left for the cave LDD to resolve. The single most transferable trait is **tone**: he is disappointed, not enraged, when the player refuses him.

**Open in this section:**

- Working name for Boss 3 (default: *The Dreamer*).
- Boss 2 identity, encounter style, and link to extinguishable-candle mechanics.
- Whether Boss 3's dream-contact uses the existing pistol low-health breathing / ambient-ghost loop (§20.3 Layer 2) as its sound bed, or gets dedicated sound design.
- Final naming for the corruption mechanism (current working term: "fungal agent").

---

## 16. Art & Visual Style

### 16.1. Artistic Vision

Decaying, oppressive Gothic-Victorian with heavy chiaroscuro lighting. Every environment was once grand and is now rotting from within. Light is scarce and precious; shadow is the default.

### 16.2. Key Visual References

- *Thief: The Dark Project* and *Thief 2* — for mood, gas-lamp palette, stone textures.
- *Dishonored* — for silhouette language of guards and architecture.
- *Bloodborne* — for the ambient dread of stone and verticality.
- Chiaroscuro painting (Caravaggio, de la Tour) — for lighting philosophy.

### 16.3. Technical Art Direction

- **Style:** Stylised realism with painterly PBR. Not photoreal; not cel-shaded.
- **Character poly budget:** 15–30k triangles.
- **Environment:** Modular assets, aggressive reuse. Poly budget per module TBD per playtest.
- **Texture resolution:** 2K for hero assets, 1K for props.
- **Lighting:** Baked GI + dynamic lights for gameplay-critical sources (extinguishable candles, guard lanterns). Only lights that matter for detection are dynamic.
- **Post-processing:** Vignette, film grain, subtle chromatic aberration. Bloom dialled down to preserve shadow detail.

---

## 17. Audio & Sound Design

### 17.1. Audio Philosophy

Diegetic wherever possible. Every sound exists in the world, not in a soundtrack. Music is rare and therefore powerful.

### 17.2. Music Direction

Sparse. Only during key moments: title screen, area transitions, the Maestro's chant, endings. Dynamic layered stems for boss beats, responding to alert state.

### 17.3. Sound Design Priorities

1. **Player footsteps by surface** — core stealth mechanic; must be distinct and satisfying.
2. **Environmental ambience** — drives atmosphere and spatial awareness.
3. **NPC barks and reactions** — communicates AI state.
4. **Mechanical sounds** — doors, levers, trap mechanisms, pick degradation.

### 17.4. Audio as Gameplay

Sound is not decoration. It is a **mechanic** (see §17.5). Guards hear. The player is *meant* to hear. The Maestro's pipe organ is both atmosphere and tactical opportunity.

### 17.5. Sound Propagation Model

**Status:** Implemented (April 2026). All four phases shipped; the system is wired into the existing `AISoundSystem` / `PlayerNoiseEmitter` / `EnemyHearing` pipeline without breaking the public contract (`ISoundListener`, `SoundEvent`, blackboard fields unchanged). Three new calculation steps were inserted.

The **tactical vocabulary** the player learns:

- *"The metal grating will give me away — I'll go around."*
- *"If I drop the lockpick on the carpet, the guard in the next room won't hear it."*
- *"The organ masks everything near the altar — that's where I'll take the shot."*
- *"This iron fence doesn't block sound; the stone wall behind it does."*

Masking zones are measured **at the sound origin**, not the listener — the player is rewarded for *positioning themselves* near masking sources.

#### 17.5.a. Surface Types (Phase 1)

The floor beneath the player modifies emitted sound radius at source.

**`SurfaceData` ScriptableObject:** `FootstepRadiusMultiplier`, `FootstepVolumeMultiplier`, `FootstepSounds[]`.

| Surface | Multiplier | Rationale |
|---|:-:|---|
| Default | 1.0× | Fallback |
| Stone | 1.0× | Cathedral baseline |
| Wood | 1.1× | Creakier |
| Carpet | 0.5× | Muffles — player's friend |
| Tile | 1.15× | Clacky |
| Marble | 1.2× | Hard, echoing |
| Gravel | 1.4× | Crunchy |
| Metal Grate | 2.5× | Punishment surface — louder than walking on stone |

**Implementation:** `SurfaceTag` MonoBehaviour on floor colliders (opt-in). `SurfaceDetector` raycasts down every 0.2 s from player feet, caches `CurrentSurface`. `PlayerNoiseEmitter` multiplies its emitted radius by the current surface multiplier before calling `AISoundSystem.EmitSound()`.

**Scope:** Surfaces affect footsteps only. Lockpick drops, pistol shots, door sounds are unchanged by surface.

#### 17.5.b. Wall Occlusion (Phase 2)

Sound behind walls is muffled. Stone muffles more than wood. Closed doors occlude; open doors don't. Iron grates barely occlude.

**Layer:** `SoundOccluder`.

**`OccluderMaterialData` ScriptableObject** (`TagName`, `DisplayName`, `AttenuationMultiplier`):

| Material | Attenuation | Meaning |
|---|:-:|---|
| Stone Wall | 0.2× | Thick cathedral stone, muffles heavily |
| Wood | 0.5× | Wooden panel |
| Thin Partition | 0.6× | Plasterboard |
| Curtain | 0.8× | Fabric, barely attenuates |
| Iron Grate | 0.85× | Mostly open |
| *(default, untagged)* | 0.3× | Fallback |

**`SoundOccluderRegistry`** — single asset at `Assets/Data/SoundPropagation/OccluderRegistry.asset`. Tag → `OccluderMaterialData` map.

**`AISoundSystem.CalculateOcclusion(origin, listener)`** — one raycast per listener per sound event:

```csharp
if (Physics.Raycast(origin, dir.normalized, out hit, dist, _soundOccluderMask))
    return _registry.GetAttenuation(hit.collider.tag);
return 1f;   // clear path
```

Called from `EnemyHearing.OnSoundEmitted()`. Suspicion-to-add becomes `SoundSuspicionAmount × attenuation × occlusion`.

**Why partial muffle, never hard block:** Pistol shots (50 m × 2× weapon = 100-radius equivalent) still punch meaningful suspicion through a stone wall. Hard block would make guards deaf behind cover and destroy the "weapons are always a disaster" rule. Partial muffle preserves that contract.

**Door integration:** `SoundOccluderToggle` component hooked to door state — `OnDoorOpen → SetOccluding(false)`, `OnDoorClose → SetOccluding(true)`. Enable/disable on collider.

#### 17.5.c. Ambient Masking (Phase 3)

Rain, organ music, crowd noise, fountain splashes reduce the effective radius of sounds originating inside them. Masking zones are a **resource** the player seeks out.

**Two component types:**

**`MaskingVolume`** (trigger collider, uniform subtraction inside):

```csharp
[SerializeField] float _maskingSubtraction = 4f;   // metres

public static float GetMaskingAt(Vector3 position)
{
    float total = 0f;
    foreach (var v in _active)
        if (v._collider.bounds.Contains(position))
            total += v._maskingSubtraction;
    return total;
}
```

**`MaskingEmitter`** (point source with linear falloff):

```csharp
[SerializeField] float _centerSubtraction = 5f;
[SerializeField] float _radius = 15f;

public static float GetMaskingAt(Vector3 position)
{
    float total = 0f;
    foreach (var e in _active)
    {
        float d = Vector3.Distance(position, e.transform.position);
        if (d >= e._radius) continue;
        float falloff = 1f - (d / e._radius);
        total += e._centerSubtraction * falloff;
    }
    return total;
}
```

**Use cases:**

| Source | Type | Value | Radius |
|---|---|:-:|:-:|
| Rain through broken cathedral roof | Volume | −4 m | over Nave |
| Crowd of worshippers during service | Volume | −3 m | over central pews |
| Echoing stairwell | Volume | −2 m | cylinder |
| Pipe organ at altar | Emitter | −5 m | 15 m |
| Stone fountain in cloister | Emitter | −2 m | 6 m |
| Squeaky machinery in catacombs | Emitter | −3 m | 10 m |
| The Maestro (boss) | Moving Emitter | −4 m | 8 m |

**Aggregator with cap:**

```csharp
public static float GetMaskingAt(Vector3 position)
{
    float total = MaskingVolume.GetMaskingAt(position)
                + MaskingEmitter.GetMaskingAt(position);
    return Mathf.Min(total, MAX_MASKING);   // cap −10 m
}
```

Cap prevents pathological stacking. A pistol shot (50 m) in a fully masked zone still has effective radius 40 m — intentional; half the cathedral still wakes up.

**Masking subtracts from *radius*, not suspicion:**

```csharp
float masking = GetMaskingAt(position);
float effectiveRadius = Mathf.Max(0f, radius - masking);
if (effectiveRadius <= 0f) return;     // sound swallowed entirely, skip dispatch
```

Examples:

- Crouched player (1.5 m) in rain (−4 m) = `max(0, 1.5 − 4) = 0 m` → completely silent.
- Walking player (4 m) in rain = 0 m → silent.
- Running player (12 m) in rain = 8 m → audible but reduced.

**`PlayerMaskingDetector`** (debug overlay): shows `MUFFLED (−X.Xm)` at top-left when the player is in a masking zone. Future accessibility feature — swap OnGUI for Canvas.

#### 17.5.d. Debug Infrastructure (Phase 4)

**`SoundPropagationHUD`** (editor-only): game-view overlay, last 10 events with full calculation breakdown:

```
[12:34.56] Footstep   raw 4.0  surf×1.15 = 4.6   mask−3.0 = 1.6   occ×0.2 → suspicion 0.012
[12:34.71] Footstep   raw 4.0  surf×2.50 = 10.0  mask−0.0 = 10.0  occ×1.0 → suspicion 0.18
```

Ring buffer of 10. Compiled out of release builds via `#if UNITY_EDITOR || DEVELOPMENT_BUILD`.

**Scene-view gizmos:** green/red occlusion rays, wireframe masking volumes, concentric masking emitter spheres, colour-coded surface tags on floor colliders. All wired into `DebugToggleWindow` under `◄ SOUNDPROP`.

#### 17.5.e. Known Limitations and Future Work

- **Single-ray occlusion.** A thin pillar between sound and listener blocks 100% even though most of the path is clear. Multi-sample (3 rays to head/torso/feet) fixes but costs 3× raycasts. Defer until VS tuning reveals a problem.
- **No sustained emitters.** Dragged body, humming generator, leaking pipe emit once. A `SustainedSoundEmitter` with per-frame re-evaluation is v2.
- **No frequency curves.** Stone walls attenuate high frequencies more. Pure multiplier loses nuance; future audio pass.
- **Guards don't respect surfaces.** For VS this doesn't matter; if player-side hearing ever happens, guards should emit properly.
- **Layer collision with `coverSurface`.** Walls on the cover layer will need resolution — recommended: make `coverSurface` a *tag*, put all walls on the `SoundOccluder` layer, update Cover System raycasts to tag-based.
- **Door state integration stub-level.** `SoundOccluderToggle` exists but not yet wired to `DoorInteractable`.

---

# Part 3: Technical Blueprint

## 18. Technical Specifications

### 18.1. Engine & Tools

- **Engine:** Unity 6.3 (6000.3.10f1), URP.
- **Camera:** Cinemachine 3.1.4.
- **Input:** New Input System (with direct-device read fallback during timeScale 0).
- **AI movement:** NavMesh.
- **Version control:** Git + LFS.
- **External:** Steamworks.NET for achievements, cloud saves, Steam Input.
- **IDE:** Visual Studio / Rider.

### 18.2. Target Hardware

| Tier | CPU | GPU | RAM | Target |
|---|---|---|---|---|
| Minimum | i5-4th gen / Ryzen 3 | GTX 1050 / RX 560 | 8 GB | 1080p low, 60 fps |
| Recommended | i5-9th gen / Ryzen 5 | GTX 1660 / RX 5600 | 16 GB | 1080p high, 60 fps |
| Steam Deck | — | — | — | 800p low, 60 fps |

### 18.3. Key Technical Challenges

1. **Sound propagation performance** at 8 guards × 5 sounds/s = 40 raycasts/s (mitigation: single-ray first pass; multi-sample only if needed).
2. **AI perception consistency** — multiple component execution orders must not produce different alert outcomes in the same frame. (Mitigation: `SpottedBodyThisFrame` impulse + persistent flag + suspicion spike all set simultaneously.)
3. **Steam Deck memory budget** — aggressive texture streaming, modular asset reuse.
4. **Placeholder UI migration** — every current OnGUI surface must swap to Canvas without logic changes. Decoupling is already in place.

### 18.4. Network & Online Features

Single-player only. Steam is used for:

- Achievements
- Cloud saves (once save/load is built)
- Steam Input (controller remapping)

Graceful fallback if Steam is absent (dev mode).

### 18.5. Architecture Principles

The architecture of every system follows six principles, inherited from the README. This is the *style guide* for adding new systems.

1. **Decoupled systems.** Logic and rendering are separated. Example: the lockpicking minigame can swap OnGUI → Canvas without touching logic. No coupling between presentation and math.
2. **ScriptableObject-driven data.** Lock tiers, guard profiles, light properties, items, surfaces, occluders are all SOs. One asset change, all instances update. No magic numbers in code.
3. **Interface-based extension.** The `IInteractable` framework allows new interaction types without modifying the manager. Same pattern planned for `ISoundListener` extensions, future `IDamageable`, etc.
4. **Auto-discovery over manual setup.** `PlayerLightDetector.FindObjectsByType<Light>`, `GuardCoordinator` discovers guards on Start, `SearchNode` self-registers. Designers place things in the scene; code finds them.
5. **Blackboard as coordination layer.** `GuardCoordinator` writes to `AIBlackboard` fields; the state machine reads independently on its own tick. Coordinators never call `TransitionTo()` directly. Preserves per-unit autonomy.
6. **Stub-first integration.** Every system ships with explicit hooks for the next — `OnPickBroken` events, `Heal()` stubs, `IDamageSource` interface, `OnInteractionCompleted` events for tiered interactions. Future features slot in; they don't require surgery.

### 18.6. Implemented Systems Snapshot

Numbering and statuses mirror `README.md`, the source of truth for implementation state.

| # | System | Key classes | Status |
|---|---|---|---|
| 1 | Lockpicking | `LockData`, `LockpickMinigame`, `LockInteractable` | Complete · placeholder UI |
| 2 | Cover | `CoverSystem`, `CoverCameraController`, `PeekCameraController` | Complete · known inside-corner jitter |
| 3 | Single-Guard AI | `EnemyController`, `EnemySenses`, `EnemyStateMachine`, `GuardData` | Complete |
| 4 | Light & Shadow Detection | `PlayerLightDetector`, `LightSourceData` | Complete |
| 5 | Contextual Interaction | `IInteractable`, `InteractionManager`, per-interactable range, `OnInteractionCompleted` cascades, 6 types | Complete |
| 6 | Inventory | `ItemData`, `InventoryManager`, `ItemUseHandler` | Complete · no UI yet |
| 7 | Health & Damage | `PlayerHealth`, `DamageInfo`, 4 damage sources | Complete |
| 8 | Multi-Guard Coordination | `GuardCoordinator`, `SearchNode` | Complete |
| 9 | Debug Infrastructure v1 | `DebugToggleWindow` (Ctrl+Shift+D) | Complete |
| 10 | Player Controller | `ThirdPersonController` extensions | Complete |
| 11 | Character Progression | `StatData`, `PlayerProgression`, 6 hooks | Complete |
| 12 | Journal & Observations | `JournalManager`, `ClueData`, `ObservationInteractable`; includes **Inspection Mode** (`InspectionCameraController`, §10.6) | Complete · no UI yet |
| 13 | Debug Infrastructure v2 | Unified runtime HUD (F12), `IDebugHUDProvider` | Complete |
| 14 | Analytics Collection Plan | 7 custom events defined (§26) | Spec'd · events not yet firing |
| 15 | Steam Integration | Steamworks.NET wrappers (achievements, cloud, Input) | Complete · service-oriented |
| 16 | Sound Propagation | `SurfaceData`, `SurfaceDetector`, `OccluderMaterialData`, `SoundOccluderRegistry`, `SoundOccluderToggle`, `MaskingVolume`, `MaskingEmitter`, `SoundPropagationHUD` | Complete |
| 17 | Distraction / Throwables | `ThrowableData`, `ThrowableProjectile`, `PlayerThrowController`, `TrajectoryPreview` | **Partial — on hold.** Phases 1–2 shipped & verified (throw emits a Distraction event; guards investigate the impact point). Aim-camera tuning + phases 3–5 (animator, debug HUD, knock-overs) deferred — resume with combat or after Phase C |
| 18 | Save System & Scene Transitions | `SaveData` (DTOs), `ISaveable`, `SaveableEntity`, `SaveManager`, `SceneStateRouter`, `SceneTransitioner`, `SceneTransitionTrigger`, `SpawnAnchor`, `FadeOverlay`, `SaveLoadMenu`, `SaveShrineInteractable` — full design in §18.7 | Partial — phases 1–6 of 10. Pending: Steam Cloud routing, settings split, difficulty gates + quicksave, migration table |
| — | Combat | stealth-kill "Slice 1" specced in `CombatSystem_Manual.md` | Not started in-engine |
| — | NPC Dialogue / Influence | — | Not started |

### 18.7. Save System & Scene Transitions

The single home for save/load architecture. The scene-transition *design* and backtrack rules live in §20.8; this subsection is the as-built technical model. Deep dive: `SaveSystem_Manual.md`. **Status: phases 1–6 of 10** (foundation, manager core, manager adapters, per-scene adapters, scene transitions, shrine + menu UI). Pending: Steam Cloud routing (step 7), settings split (step 8), difficulty gates + quicksave (step 9), migration table (step 10).

**Two-tier `SaveData`.** Plain `[Serializable]` POCOs that round-trip through `JsonUtility`:

- `SaveHeader` — slot id, timestamp, scene, playtime, format version.
- `MetaStateDTO` — cross-scene player state (Health, Inventory, Progression, Journal).
- `WorldStateDTO` — per-scene `SceneStateDTO` lists keyed by scene name (doors, lights, pickups, documents, observations). Only the active scene's slice is restored on load.

**Adapter pattern (`ISaveable`).** A two-method interface (`object CaptureState()` / `void RestoreState(object)`). Cross-scene singletons register with `SaveManager` by string key; per-scene interactables are found via their `SaveableEntity` sibling. Every existing manager and interactable got a 5–10 line capture/restore pair — no rewrites.

**`SaveableEntity` GUID.** Stable string id auto-assigned in `OnValidate` (deferred via `EditorApplication.delayCall`) with same-scene duplicate detection; right-click → "Regenerate Save ID" for copy-paste cases. Survives scene reloads, prefab variants, hierarchy moves, and renames — the only key resilient to designer iteration.

**`SaveManager`** (`DontDestroyOnLoad`). Captures Meta + active-scene World, serialises to JSON, frames it as `[magic 'DSPS'][int32 version][uint32 CRC32][JSON UTF-8]`, and writes both `slotN.dat` and a small `slotN.meta` sidecar (so the load menu renders summaries without a full deserialise) under `Application.persistentDataPath/saves/`. Restore order is `Progression → Health → Inventory → Journal` (Health's `EffectiveMaxHP` reads Vigor on the fly). Six events: `OnBeforeSave`, `OnAfterSave`, `OnBeforeLoad`, `OnAfterLoad`, `OnSaveFailed`, `OnLoadFailed`.

**Slots:** 1 autosave (slot 0, written on every scene transition) + 3 manual (1–3). ~150 KB/save + ~50 KB sidecar × 4 ≈ 1 MB worst-case Steam Cloud footprint.

**Scene-transition pipeline (`SceneTransitioner`).** Coroutine: lock input → fade out (with `AudioListener` duck) → capture → autosave slot 0 → `LoadSceneAsync` → restore Meta + World → place player at the matching `SpawnAnchor` → minimum black hold (`1.2 s`, §20.8) → fade in → unlock. A `try/finally` guarantees input unlock and audio restore even on exception. Supporting pieces: `SceneTransitionTrigger` (trigger-collider doorway, optional press-to-confirm), `SpawnAnchor` (per-origin entry points), `FadeOverlay` (`CanvasGroup`, `unscaledDeltaTime` so it works at `timeScale = 0`), `SaveLoadMenu` (OnGUI placeholder, Canvas in Phase C), `SaveShrineInteractable` (diegetic save points — "Pray", "Light Candle"), and a backward-compat `SceneChanger` wrapper.

**Locked decisions** (Decision Log, 2026-05-01):

- **Difficulty-gated saving:** autosave + shrines on every difficulty; save-anywhere on Easy/Normal; quicksave/quickload on Easy only (gating wired in step 9).
- **Backtrack semantics:** environmental player changes *persist* (doors stay open, items stay taken, candles stay extinguished); **enemies always reset to patrol** on every scene entry and every load. `EnemyController` deliberately does **not** implement `ISaveable`.
- **Singleton lifetime:** `SaveManager` / `SceneTransitioner` / `SaveLoadMenu` / `FadeOverlay` are `DontDestroyOnLoad`; the four game-state singletons stay scene-local and are rehydrated from `SaveManager.CurrentData` on each load. This supersedes the earlier §20.8 "DontDestroyOnLoad on game-state singletons" sketch — same end-user effect, but every scene stays independently loadable for editor testing.

---

## 19. Technical Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Solo dev burnout | High | Single-doc workflow (this document); aggressive asset reuse; cut ruthlessly |
| UI migration from OnGUI to Canvas slips | Medium | Rendering decoupled in all systems; can ship beta with placeholder UI if needed |
| Sound propagation perf on Steam Deck | Medium | Start with single-ray occlusion; profile early |
| Save/load system complexity | Medium | All systems already use ScriptableObjects for definitions; only runtime instances need serialisation |
| AI feels "too solved" once optimal routes are found | Medium | Coordinator's dynamic role assignment intentionally shuffles encounters |
| Player can't find clues to progress | High | §20.4 clue density targets; always at least one "golden path" clue per critical lock |
| Scope creep on narrative | High | Vertical slice (§20.3) locked; other areas reuse its structural template |

---

## 20. Content & Level Breakdown

### 20.1. World Map

The game is a Metal Gear Solid 1-style interconnected world, three linked regions:

```
    ┌───────────────────────────┐
    │   CHURCH & surrounding    │◄────────┐
    │    "Lost Consolation"     │         │
    └────────────┬──────────────┘         │
                 │                        │
                 ▼                        │
    ┌───────────────────────────┐         │  (backtrack
    │        DUNGEONS           │─────────┘   with new keys)
    │       (catacombs)         │
    └────────────┬──────────────┘
                 │
                 ▼
    ┌───────────────────────────┐
    │      CAVE + FINALE        │
    └───────────────────────────┘
```

**Bosses (one per zone, see §15.5):**

- Church → **Boss 1: The Maestro** (Chapel of the Dead)
- Dungeons → **Boss 2: TBD**
- Cave + Finale → **Boss 3: The Dreamer (working title)**

**World architecture:** hub-and-spoke with hard scene boundaries, built in two tiers. A **sub-area** is a named grouping carrying one §20.5 archetype; the three regions hold ~12 sub-areas total — 1 hub (Main Nave) + 4–6 spokes + 1–2 gauntlet/setpiece + 3 boss arenas + 1–2 thresholds. A **scene** is the scene-swap unit: every door is a `SceneManager.LoadSceneAsync` swap with a ~2 s fade (transition contract in §20.8). Each sub-area is divided into ~2–4 scenes, so a region runs **~15–20 scenes** and the full game **~45–55**. Playtime ~2–3 hours; aggressive asset reuse keeps the footprint affordable. Backtracking with new keys is encouraged by design.

### 20.2. Area Breakdown

| Area | Major sub-areas | Guard / NPC count | Boss | Signature mechanic |
|---|---|:-:|---|---|
| Church (surface + interior) | Clergy Offices (start), Cloister (living monastery), Main Nave (hub), Churchyard (spoke), Organ Loft (masking), Chapel of the Dead (boss) | 8–10 guards, ~6 civilians, 2 screamers, 1 informant | Maestro | Introduces all systems; organ masking zone (boss setup); distraction-only Maestro encounter in the Chapel of the Dead |
| Dungeons (Catacombs) | Catacombs Entrance (threshold), Catacombs (gauntlet), Crypts, Records Room | 4–6 Nervous Guards | TBD (§15.5) | Extinguishable candles gain priority; near-darkness teaches shadow-by-default |
| Cave + Finale | Ritual cavern, Dreamer's chamber | 2–3 + boss | The Dreamer | Dynamic masking emitter; psychic dream-contact precedes the encounter; stealth-forward boss |

### 20.3. Vertical Slice — The Church of Lost Consolation

The vertical slice is the **Church** area alone. It is built to be narratively complete (a self-contained arc) while serving as the template for the other regions.

**Three-layer ambiguity proposal (from the original design doc, retained):**

1. **Rational layer.** What the Maestro is doing is a political scheme — faked miracles, ledger fraud, cooperation with outside powers. Everything the player sees can be explained by human motive. Documents in this layer are ledgers, letters, coded messages.
2. **Psychological layer.** The player character is unwell. Observations double back on themselves; some documents may be hallucinated. The pistol's low-health breathing loop blurs into ambient ghosts. Documents in this layer are the protagonist's own journal entries becoming unreliable.
3. **Occult layer.** Something *is* there. The Maestro's chant carries real weight. Rituals have outcomes. Documents in this layer are fragments of pre-church texts, cave drawings predating the building.

All three layers are **consistent with the same evidence**. The game never adjudicates. The ending's moral weight comes from which layer the player believes — not from what the game confirms.

### 20.4. Clue Density Targets

(Reprinted from §10.5 for level-design convenience.)

| Area | Documents | Observations | Total Clues |
|---|:-:|:-:|:-:|
| Clergy Offices | 2–3 | 0–1 | 1–2 |
| Cloister | 1–2 | 2–3 | 2–3 |
| Main Nave | 3–4 | 2–3 | 4–6 |
| Catacombs & Chapel | 2–3 | 3–4 | 5–8 |
| **Total** | **~10–12** | **~8–12** | **~15–20** |

### 20.5. Sub-area Archetype Contracts

Each **sub-area** is tagged with an archetype that fixes its loop, branching, and budget. If a sub-area can't meet its archetype's contract, it must be retagged or split. The `Count (target)` column is a count of *sub-areas*; the `First-visit time` is the sub-area total — the sum of its constituent scenes.

| Archetype | Count (target) | First-visit time | Visits | Visible budget hooks |
|---|:-:|---|:-:|---|
| **Hub** | 1 (Main Nave) | 12–20 min | 3–5 | High light density; one elevated vantage; one safe shadow zone; legible from a single position |
| **Spoke (medium)** | 4–6 | 8–15 min | 1–2 | Single dominant teaching point; objective visible early, reachable late |
| **Gauntlet (linear forward)** | 1–2 (Catacombs) | 5–10 min | 1 | Low light; sound-driven; one-way drops as natural partitions |
| **Setpiece / Boss** | 3 (one per zone) | 8–15 min | 1 | Distraction-driven (Maestro); Boss 2 + Dreamer specs TBD |
| **Threshold / Antechamber** | 1–2 | 1–5 min | 1–2 | Tonal contrast; reading interactable / single ES beat (a multi-scene threshold runs to the upper bound; in the Church the threshold beat — the facade reveal — is now folded into the Churchyard hub-spoke, §20.6) |

Full per-archetype loop, branching, and design notes live in `Development_Plan_WorldStructure.md` §2.

### 20.6. Sub-area Roster (proposed)

This is a roster of **sub-areas**, not scenes — each row is divided into the
scenes given in the `Scenes` column (§20.1 two-tier model). Church rows are
listed in **play order**; the full sub-area/scene breakdown, door cue audit, and
gating for the Church live in `LDD_Church.md`.

| # | Sub-area | Archetype | First-visit time | Scenes | Visits | Status |
|---|---|---|---|:-:|:-:|---|
| 1 | Clergy Offices | Spoke | 8–10 min | 3 | 1–2 | LDD authored — `LDD_Church.md` |
| 2 | Cloister | Spoke | 10–12 min | 4 | 1 | LDD authored — `LDD_Church.md` |
| 3 | Main Nave | **Hub** | 15–20 min | 6 | 3–5 | LDD authored — `LDD_Church.md` |
| 4 | Churchyard | Threshold (hub spoke) | 6–8 min | 3 | 1–2 | LDD authored — `LDD_Church.md` |
| 5 | Organ Loft | Spoke (masking) | 4–6 min | 1 | 1–2 | LDD authored — `LDD_Church.md` |
| 6 | Chapel of the Dead | **Boss 1** | 10–15 min | 2 | 1 | LDD authored — `LDD_Church.md` |
| 7 | Catacombs Entrance | Threshold | 1–2 min | TBD | 1 | Proposed |
| 8 | Catacombs | Gauntlet | 8–10 min | TBD | 1 | Proposed |
| 9 | Dungeons (full) + Boss 2 arena | Spoke / Setpiece | TBD | TBD | TBD | Full-game scope |
| 10 | Cave / Finale + Dreamer arena | Setpiece | TBD | TBD | 1 | Full-game scope |

The Church (sub-areas 1–6) totals **19 scenes**. Play route: Clergy Offices →
Cloister → Main Nave (hub) → spokes (Churchyard, Organ Loft) → Chapel of the
Dead → Catacombs. The Churchyard is now a hub spoke, not the entry funnel.

**Church restructure (reconciled from `LDD_Church.md`):** the interior start is
committed — the game opens in the **Clergy Offices**, not the Sacristy. The
**Sacristy is no longer a sub-area**; it is now Main Nave scene **C6** (off the
presbytery). The old **Bell Tower / Organ Loft** sub-area is split: the **organ**
stays at the hub (Crossing pulpitum + Organ Loft spoke), the **bells** move to a
**West Bell Tower** in the Churchyard, whose climb is a first-visit objective that
yields the mechanism opening the Chapel. The **Churchyard** is demoted from entry
threshold to a hub **spoke** that loops back through the great west doors. The
**Cloister** gains a **Chapter House** (conspiracy anchor) and is now a living
monastery. Sub-area letters in the LDD (A–F) map to roster rows 1–6 in order.

**Next Fest demo cut (Feb 2027):** sub-areas 1–8 (Church + Catacombs end-to-end). Sub-areas 9–10 are full-game scope (Q2 2027 launch).

### 20.7. Branch Theory & Visual Language

Every navigable threshold falls into exactly one of four categories. The LDD for each scene must label every door before greybox.

1. **Forward** — current critical-path exit. Strong cues (light cones, lit candle lines, banners pointing, distant audio hooks, higher guard density, grander framing).
2. **Side** — optional content (lore, items, alternate routes). Visible but de-emphasised; intimate scale, glimpsed loot, environmental storytelling props.
3. **Locked-now / Foreshadowed** — clearly visible, clearly inaccessible right now, with a diegetic reason (signage, chains, sigil locks). Player should *remember* it.
4. **One-way** — a drop, a collapsing structure, a grate latched from the far side. Used to partition the world cleanly past a point of no return.

**Two locked rules:**

- **Cue audit before greybox** — every door labelled with category and listed cues in its LDD's Map Layout section. Non-negotiable; the most common immersive-sim level-design failure is the designer assuming clarity that wasn't there.
- **Diegetic-only navigation** — no HUD waypoints, no glowing doors, no quest markers in 3D space. Journal and clue system handle textual guidance.

Full cue toolkit (gothic-cathedral specifics) in `Development_Plan_WorldStructure.md` §3.

### 20.8. Backtracking, Gating & Scene Transitions

**Four gate types:**

1. **Key gating** — item from another spoke unlocks the door. Standard MGS1/Metroid pattern.
2. **Lock-tier gating** — pickable but at a tier the player's Acuity / pick inventory can't yet handle. Soft gate.
3. **One-way drop gating** — once committed, can only return via a different route. Partitions the world without an explicit lock.
4. **Cascading gating** — a follow-up interactable ships disabled until a prior interaction completes (observe → unlock → take). Built on `OnInteractionCompleted`; see §10.4a.

**Backtrack reward rule (locked):** every backtrack must yield at least one of: a new document, a new item, a previously locked-now door becoming openable, or a new narrative beat. Backtracking with no reward is a design failure.

**Hub re-entry rule:** when the player returns to the hub, at least one observable thing changes (worshippers move, a patrol re-stations, a door opens, candles re-lit or stay extinguished per `WorldStateManager`, a new document on the altar).

**Scene transition contract** — every door is a full scene swap (`SceneManager.LoadSceneAsync`) wrapped in a fade. Timing: fade-to-black 0.4–0.6 s, minimum total black 1.2–1.8 s (pads short loads to feel uniform), fade-from-black 0.4–0.6 s. **Total transition feel ~2 s.** Input locked across the full transition; pause menu disabled.

**State on transition:**

- *Persists* (`DontDestroyOnLoad`): `PlayerProgression`, `InventoryManager`, `JournalManager`, `PlayerHealth`, new `WorldStateManager` (cross-scene flags: extinguished candles, picked locks, read documents, scripted events fired).
- *Resets per scene load:* guard alert states, `GuardCoordinator` last-known-position broadcasts, `AIBlackboard` contents, all transient AI state. Treated as a feature: rewards the player for escaping through a door.
- *Override hook:* `WorldStateManager.AlertCarryOver` flag (default false). Scripted moments can set true to prevent the panic-through-door reset for one specific transition.

Full transition-system component sketch (`SceneTransitionManager`, `SceneTransitionTrigger`, `SceneSpawnPoint`, `WorldStateManager`) and audio rules in `Development_Plan_WorldStructure.md` §6. Engineering work tracked in §21.3.

### 20.9. Per-Scene Performance Budget

Targets for the Steam Deck 800p low preset (PC high may exceed). Budgets apply per **scene** — the scene-swap unit of the §20.1 two-tier model, not the sub-area. Every scene must hit 60 fps on Steam Deck before being considered greybox-complete.

| Resource | Budget |
|---|:-:|
| RAM (active scene + persistent managers) | ≤ 1.5 GB |
| Realtime shadow-casting lights (visible) | ≤ 6 |
| Total active lights (visible) | ≤ 32 |
| NavMesh size | ≤ 5 MB |
| Lightmap atlases | ≤ 3 (1024² each, BC6H compressed) |
| Concurrent active guards | ≤ 6 |
| Concurrent active civilians | ≤ 8 |
| Draw calls (typical view) | ≤ 1500 |
| Triangles (typical view) | ≤ 1.2 M |

Cross-reference §18.3 for scene-load + transition perf concerns and §19 for risk register.

---

## 21. Project Scope & Milestones

### 21.1. Scope Summary

| Metric | Target |
|---|---|
| Playtime | 2–3 hours per playthrough |
| Areas | 3 linked regions |
| Guards (total in world) | ~14–18 |
| Documents | ~10–12 (vertical slice), ~25–35 (full game) |
| Observations | ~8–12 (vertical slice), ~20–30 (full game) |
| Clues | ~15–20 (vertical slice), ~40–50 (full game) |
| Languages | EN + PT-BR at launch; JA + ES stretch |
| Voice acting | Stretch goal |

### 21.2. Milestone Targets

| Milestone | Date | Definition of Done |
|---|---|---|
| Systems complete | Q3 2026 (achieved Apr 2026) | 16 core gameplay systems implemented; see §18.6 for the live snapshot (18 named systems as of June 2026) |
| Vertical slice playable | Q4 2026 | Church area end-to-end, all 3 narrative layers present |
| Steam Next Fest demo | Feb 2027 | Church area alone, polished, public demo build |
| Beta | Q1 2027 | Full 3-area playthrough, all content in, UI still iterating |
| Full launch | Q2 2027 | 1.0 ship |

### 21.3. Roadmap — What's Next

Priority order, trimmed from the README's roadmap (Sound Propagation dropped — shipped April 2026):

1. **Phase C UI** — pause menu, journal UI (tabs by entry type / category), inventory UI, settings.
2. **Save / Load (in progress)** — phases 1–6 of 10 complete: DTOs + `ISaveable` adapters on all four cross-scene singletons (`PlayerProgression`, `InventoryManager`, `JournalManager`, `PlayerHealth`) and all five persistable interactable types (`DoorInteractable`, `LightSourceInteractable`, `ItemPickup`, `DocumentPickup`, `ObservationInteractable`); `SaveManager` with framed JSON I/O (magic + version + CRC32) into `Application.persistentDataPath/saves/slot{0..3}.dat` + sidecar; `SceneTransitioner` with fade + autosave; `SaveShrineInteractable` + `SaveLoadMenu` placeholder. **Pending:** Steam Cloud mirror through `SteamCloudSaveService` (step 7), settings split into a slot-less local-only manager (step 8), difficulty gates + F5/F9 quicksave (step 9), migration table on `SaveHeader.version` bump (step 10). Notes on the original list above: per-scene world state is keyed by `SceneStateDTO` slices inside `WorldStateDTO` (no separate `WorldStateManager` shipped — its responsibilities are split between `SceneStateRouter` for live walking and `SaveManager.CurrentData.World` for the persisted dictionary). See §18.7 and `SaveSystem_Manual.md`.
3. **`SceneTransitionManager` + `WorldStateManager`** — implements §20.8 (hard scene boundaries, ~2 s fade, persist/reset rules, alert-carry-over override hook). Build alongside the second scene; don't build in isolation. Source: `Development_Plan_WorldStructure.md` §6.
4. **Civilian NPC system** — Phase 1 shared infra (`PanicStimulus`, `INPCBrain`, `PanicHelper`, `CivilianRegistry`, plus `AIBlackboard` / `AISoundSystem` / `GuardCoordinator` / `EnemyHearing` extensions) → Phase 2 Screamer → Phase 3 Civilian → Phase 4 Informant. **All three archetypes are in Vertical Slice scope** (overrides the source plan's Informant-deferral recommendation; trade is more variety in the demo for ~2.5 days of additional engineering and tighter playtest tuning). Source: `Development_Plan_Civilian_NPC_System.md`.
5. **Combat system** — minimal: dagger backstab, caplock pistol, melee guard attack animations.
6. **Throwables / Distraction** — bottles and bricks emitting sound; `PlayerNoiseEmitter.EmitInteractionSound(radius)` already supports it.
7. **Lockpicking 3D model** — close-up Cinemachine camera with a tier-matched physical lock; Canvas pick overlay.
8. **Dialogue + Influence stat** — first wiring of the Influence stat to NPC interactions (guards who can be bribed, clergy who can be persuaded). Civilian `IDialogueTarget` stub already in place.
9. **Boss 2 (Dungeons) and Boss 3 (Dreamer, Cave) — pre-production design.** Not engineering yet; resolves §15.5 open items before greybox of the Dungeons and Cave zones begins.
10. **Accessibility pass** — subtitles, outlines, reduced motion, colourblind gizmos, masking indicator promoted.
11. **Analytics firing** — build `AnalyticsAccumulator`, declare the 7 events in the UGS dashboard, wire integration points (§26). Dashboard queries post-demo.
12. **Localisation pass** — string extraction, PT-BR, then JA/ES if time.

---

# Part 4: Business & Support

## 22. Localization Plan

### 22.1. Language Support

- **At launch:** English, Brazilian Portuguese.
- **Stretch:** Japanese, Spanish.

### 22.2. Technical Considerations

- All user-facing strings extracted to `StringTable` SOs.
- `DocumentData.FullText` localised via per-language asset bundles.
- Fonts: Noto Serif family for consistent glyph coverage across languages.
- No baked text in textures.
- UI layouts tested at +30% string expansion for Brazilian Portuguese.

---

## 23. QA & Testing Plan

### 23.1. Testing Phases

| Phase | Who | When | Scope |
|---|---|---|---|
| Dev playtests | Solo dev | Weekly | System correctness, debug HUD |
| Closed alpha | 3–5 trusted testers | Q4 2026 | Vertical slice playability, clue findability |
| Steam Next Fest demo | Public | Feb 2027 | Telemetry + community feedback |
| Closed beta | 15–25 testers | Q1 2027 | End-to-end playthrough, difficulty tuning |
| Release candidate | Internal | Q2 2027 | Regression pass, perf pass |

### 23.2. Priority Test Areas

1. **Clue findability.** No "dead end" states where a player can't progress.
2. **AI correctness.** No invisible-wall suspicion, no teleports, no permanent-alert edge cases.
3. **Cover system at complex geometry.** Inside corners, multi-surface joints.
4. **Steam Deck 60 fps floor.**
5. **Save/load reliability** (once implemented).

### 23.3. Required Dev Tools

Already in place:

- **`DebugToggleWindow`** — `Ctrl+Shift+D`. Master toggle for every debug visualisation.
- **Runtime Debug HUD** — `F12`. Unified in-game panel; auto-discovers `IDebugHUDProvider` implementations.
- **Per-system toasts and console logs** with timestamps and transition reasons.
- **Scene-view gizmos** — vision cones, patrol routes, LOS rays, sound emission rings, light detection rays, search role lines, `SearchNode` markers.

---

## 24. Marketing & PR

### 24.1. Key Selling Points

- **"A Thief for 2027."** Classic, austere stealth in a modern engine with modern camera and cover.
- **Information, not combat, is the power fantasy.** A genuine mechanical point of difference.
- **Three-layer narrative ambiguity.** Rational, psychological, occult — all consistent with the same evidence.
- **Short and replayable** (~2–3 hr, multiple routes, backtracking rewarded).
- **Steam Deck first-class support.**

### 24.2. Community Strategy

- Devlog posts during development, public from ~Q4 2026.
- Steam Next Fest demo (Feb 2027) as the primary wishlist driver.
- Stream the development of select systems (cover, sound propagation) for credibility.
- Small, tight Discord — quality over size.

### 24.3. Asset Pipeline

- **Screenshots:** in-engine, post-process on. Target the chiaroscuro look.
- **Trailers:** gameplay-first. Show stealth tension, not combat. Let silence do work.
- **Capsule art:** emphasises architecture + a single silhouette. No gun on the cover.
- **Key art:** the Maestro, out of focus, with the player silhouette watching.

### 24.4. Key PR Dates

| Date | Event |
|---|---|
| Q4 2026 | Devlog goes public |
| Jan 2027 | Announce Steam Next Fest participation |
| Feb 2027 | Next Fest demo live |
| Q2 2027 | Launch |

---

## 25. Monetization & Post-Launch Plan

### 25.1. Business Model

- **One-time purchase.** Target price ~USD 4.99 / BRL equivalent.
- **No microtransactions, no battle pass, no DLC at launch.**
- **Regional pricing via Steam standard tables.**

### 25.2. Post-Launch Content

- **Patches:** bug fixes, difficulty tuning, accessibility, localisation improvements.
- **Potential DLC:** a second infiltration target (another faction) as a separate standalone campaign, ~1 hr, ~USD 4.99. Evaluated post-launch based on reception.
- **No content updates that invalidate existing saves.**

### 25.3. Live Operations

None. This is a finite single-player game. Steam Workshop (for additional languages, community-translated mods) is a nice-to-have post-launch, not a commitment.

---

## 26. Analytics & Metrics

Full event schema, parameter catalogue, and SQL queries live in `Analytic_Collection_Plan.md`. This section covers the philosophy, high-level model, and design-facing reasoning.

### 26.1. Analytics Philosophy

**We never track data for the sake of tracking data.** Every parameter maps to a concrete design question — "Is the Main Nave too hard?", "Are players using the Ghost path?", "Is Finesse levelling too fast?". If a parameter cannot be tied to an actionable decision, it does not ship.

Analytics is a **tuning tool**, not a surveillance layer. No PII is collected. No IPs, no device fingerprints, no email addresses — only Unity's anonymised user ID plus the parameters in the event catalogue.

### 26.2. The Fat-Event Model

Instead of firing dozens of micro-events during gameplay (`player_crouched`, `light_extinguished`, `lockpick_started`), we **accumulate counters locally** in a singleton `AnalyticsAccumulator` MonoBehaviour and **batch them into a small number of summary events at natural breakpoints** — area completion, death, session end.

Reasons:

1. **Free-tier respect.** Unity Analytics' fair-usage guideline is 500 custom events per MAU per month. Our model targets 4–8 events per session — well within budget even for daily players.
2. **Better data quality.** Thirty parameters in one event = one row with all correlations intact. Thirty events with one parameter each = thirty rows that need joins in the SQL Data Explorer. Same cost, far worse ergonomics.
3. **Invalid events count against quota.** Schema mismatches waste budget. Fewer event types = fewer schemas to get wrong.

### 26.3. Event Catalogue (7 events)

| Event | Trigger | Primary use |
|---|---|---|
| `level_completed` | Player exits an area (or dies in it, with `completed: false`) | The primary event. ~30 parameters covering time, detection, playstyle, content engagement, exploration. Answers ~80% of design questions. |
| `player_death` | Player HP hits zero | Death heatmaps (pos_x/y/z), cause-of-death, alert state at death, seconds since detection — validates "combat is a fail state" philosophy |
| `detection_incident` | Guard transitions to Alert targeting player (10 s cooldown to avoid spam) | What broke stealth: detection source, player posture, light level, distance, guard type, suspicion at trigger. The AI tuning feedback event. |
| `session_summary` | App quit, main menu return, or 5-min idle timeout | Session-level engagement: duration, areas completed, quit area + reason, is_first_session. Identifies churn points and rage-quits. |
| `puzzle_interaction` | Puzzle completed (success/fail) or abandoned | Per-puzzle success rate, time spent, attempts, `had_required_info` for information-gate puzzles, lockpick breaks |
| `boss_encounter` | Maestro encounter ends (death / escape / defeat) | Attempt count, duration, times spotted, hiding spots used — separates boss tuning from area tuning |
| `progression_snapshot` | Fires alongside `level_completed` + at stat-level-up milestones | Full stat state (Vigor/Finesse/Acuity/Influence levels + raw XP), inventory snapshot, cumulative playtime — validates XP curve and "knowledge > combat power" |

Typical 30-minute vertical-slice session: ~11–19 events total. At 30 sessions/month = 330–570 events per MAU — within the 500 fair-usage guideline.

### 26.4. Key Performance Indicators

| KPI | Sourced from | Why it matters |
|---|---|---|
| Demo conversion (wishlist → purchase) | Steam | Commercial outcome |
| First-hour retention | session_summary (`session_duration_sec`, `is_first_session`) | Tutorial / onboarding quality |
| Average playthrough length | session_summary aggregated | Scope validation |
| Death heatmap | player_death (`area_name`, `pos_x`, `pos_z`) | Level design friction points |
| Detection incident density | detection_incident per area | AI tuning — is stealth working? |
| Journal completion % at end of game | level_completed (`documents_found` / `documents_available`) | Information-reward tuning |
| Playstyle distribution | level_completed (`primary_path_used`) | Are Ghost / Shadow / Distraction paths all viable? Target: no path >70%. |
| XP curve health | progression_snapshot (stat levels by area) | Is any stat running away or lagging? Flat Influence is expected until dialogue ships. |
| Achievement completion distribution | Steam | Content balance |

### 26.5. Design Questions → Event Mapping (selected)

Rule of thumb for the dashboard: start with the design question, then look up the event.

| Question | Event | Key signal |
|---|---|---|
| Is the Main Nave too hard? | `level_completed` + `player_death` | Filter by `area_name="main_nave"`. If median `attempt_number` > 3 and `player_deaths_in_area` > 2 → reduce guard density or widen patrol gaps. |
| Are players engaging with the Observe phase? | `level_completed` | `time_in_observe_sec / time_in_area_sec` — target 15–25%. Below 10% = rushing. Above 40% = paralysis. |
| Is the lockpick difficulty right? | `level_completed` + `puzzle_interaction` | Success rate target 60–75% (lockpicks_succeeded / lockpicks_attempted). Below 50% = too hard. Above 90% = too easy. Slice per Finesse level. |
| Is the detection formula fair? | `detection_incident` | If `player_light_level < 0.3` AND `distance_to_guard > 8` AND detections still occur → formula too aggressive. |
| Where are the difficulty spikes? | `player_death` | Aggregate by `area_name`, heatmap `pos_x`/`pos_z`. Clusters = spikes. |
| Is the Maestro balanced? | `boss_encounter` | Target 2–4 attempts average. First-attempt deaths with duration < 15 s = unfair opening. First-attempt escape = too easy. |
| Why are players quitting? | `session_summary` | `quit_area` cluster + high `total_deaths` + `quit_reason="alt_f4"` = rage quit. `session_duration_sec < 5 min` + `is_first_session=true` = failed to engage. |

### 26.6. Implementation Architecture

Planned (not yet built — see roadmap §21.3 item 11):

- **`AnalyticsAccumulator` singleton** (same pattern as `PlayerProgression`). MonoBehaviour on a persistent GameObject. Exposes `RecordDetection()`, `UpdatePostureTime()`, `RecordLockpickAttempt()`, `RecordDeath()`, etc. Builds event dictionaries at trigger points, calls `AnalyticsService.Instance.CustomData()`. Resets area counters after each `level_completed`.
- **`AnalyticsEvents`** — static constants for event names and parameter keys. Prevents typo-induced schema mismatches.
- **`AnalyticsConsent`** — wraps the UGS `EndUserConsent` API. No events fire until the user opts in.
- **Integration points:** `EnemyStateMachine` → detection recording. `ThirdPersonController` → posture timers. `CoverSystem` → cover time. `PlayerHealth` → death. `InteractionManager` → lockpick/document/light events. `PlayerProgression` → XP snapshots. `LevelExitTrigger` (future) → fire `level_completed`.
- **Dashboard step:** every event and parameter must be declared in the Unity Analytics Event Manager before shipping. Invalid events still count against quota.

### 26.7. Privacy & GDPR

Unity Analytics makes us the data controller; Unity is the processor. Ship requirements:

- Consent dialog on first launch; `SetConsentState(AnalyticsIntent, Granted)` only after explicit opt-in.
- Settings-menu toggle to revoke (`Denied`) at any time.
- Settings-menu button calling `RequestDataDeletion()` to purge the player's stored data.
- Privacy policy linked from Steam store page and in-game Settings.
- COPPA: evaluate once the official rating is determined.

### 26.8. Status

Events are **not yet firing.** The plan is complete and locked; the `AnalyticsAccumulator` and dashboard declarations are a future task (see §21.3). Steam stats/leaderboards layer on top where relevant and are independent of the Unity Analytics pipeline.

---

# Part 5: Process & Compliance

## 27. Decision Log

Key design decisions made to date. When a decision is reversed, don't delete it — strike it through and add the reason.

| Date | Decision | Rationale |
|---|---|---|
| 2026-02 | GDD split into FDDs/LDDs/Art Bible modules | Easier handoff; team scaling |
| 2026-03 | Health punitive (3 HP, no regen) | Vulnerability pillar |
| 2026-03 | Lockpicking uses `Time.timeScale = 0` | Tension from pick economy + skill, not patrol timers; reconsider after AI is complete |
| 2026-03 | Cover system is automatic, not button-activated | Reduces friction in high-tension moments |
| 2026-03 | Progression is use-based, no skill points | Immersive-sim parameter-space, not RPG bypass |
| 2026-03 | Clues are author-defined, not runtime-parsed | Narrative controls what's actionable |
| 2026-03 | Sound propagation masking subtracts from *radius* not suspicion | Consistent distance-based falloff; weapons still always loud |
| 2026-03 | Sound wall occlusion is partial muffle, never hard block | Preserves "weapons are always a disaster" rule |
| 2026-03 | Inspection mode is opt-in per observation, not default | Most observations stay ambient; cinematic attention is earned |
| 2026-04 | Journal is the game, not a log; RE4-style inspection for key beats | Information-as-power pillar fully expressed |
| 2026-04 | **Single consolidated GDD** (this doc) replaces modular ecosystem for solo-dev workflow | Maintenance cost of modular docs exceeded value for single author |
| 2026-04 | Sound propagation shipped as implemented system (was designed-only) | Closes the AI hearing pipeline — weapons and footsteps now attenuate correctly through walls, surfaces, and masking zones |
| 2026-04 | Analytics: fat-event model over real-time events | Respects UGS free-tier 500-events/MAU quota (4–8 events/session vs. dozens of micro-events); correlates data in one row per area |
| 2026-04-25 | World structure doc folded into §20; archetype contracts (Hub/Spoke/Gauntlet/Boss/Threshold), scene roster, branch theory, gating rules, transition spec, and per-scene perf budgets adopted | Single source of truth in the GDD; deeper plan retained for implementation detail (`Development_Plan_WorldStructure.md`) |
| 2026-04-25 | Three civilian NPC archetypes (Screamer / Civilian / Informant) added per `Development_Plan_Civilian_NPC_System.md`; **all three in Vertical Slice scope** (overrides the source plan's recommendation to defer the Informant) | Maximises stealth-verb variety in the demo; accepts the extra ~2.5 days of Informant engineering as a deliberate cost |
| 2026-04-25 | Three-boss / three-zone framing adopted: Boss 1 = Maestro (Church, existing), Boss 2 = TBD (Dungeons, open), Boss 3 = "The Dreamer" (Cave, working title; archetype-only reskin of a classic "welcoming antagonist" — Dagoth Ur / Kreia / Lord Soth lineage) | Each zone gets its own climactic beat; villains map onto the §20.3 three-layer narrative (rational → psychological → occult); avoids Bethesda-IP fingerprints by design |
| 2026-04-25 | §1.9 Thematic Intent added (revolution / espionage, class oppression, religion-as-institution, "revolutionary justice"; fear + weight-of-conscience as target player feelings; indirection as method); §15.2 extended with three rows aligned to §1.9 | Recovers the original design north star that had drifted into generic "power structures critique"; gives the rest of the GDD a stable reference target |
| 2026-05-01 | Save system architecture locked: two-tier `SaveData` (cross-scene `MetaStateDTO` + per-scene `WorldStateDTO` keyed by scene name); slot layout `1 autosave (slot 0) + 3 manual (1–3)`; framed file format `[magic 'DSPS'][int32 version][uint32 CRC32][JSON UTF-8]` at `Application.persistentDataPath/saves/`; difficulty-gated trigger model (autosave + shrines on every difficulty, save-anywhere on Easy/Normal, quicksave on Easy only) | Single doc + manual (`SaveSystem_Manual.md`); reuses existing `SteamCloudSaveService` byte-level wrapper for step 7 cloud routing; `JsonUtility` constraints (no dictionaries, no polymorphism) drive the DTO-flattening discipline |
| 2026-05-01 | Backtracking semantics: environmental player-actions (doors opened, items taken, candles extinguished, documents collected, observations made) **persist** across scene re-entry; **enemies always reset to patrol** on every scene entry and every load. `EnemyController` does not implement `ISaveable` and is deliberately excluded from the save data | Gives the player a clean retry from any save and avoids reloading straight into an alert spiral; matches Pillar 1 (Vulnerability) by keeping consequence on player actions while sparing the player a punishing alert-state replay |
| 2026-05-01 | Singleton lifetime: `SaveManager`, `SceneTransitioner`, `SaveLoadMenu`, `FadeOverlay`, and `SteamServicesBootstrap` use `DontDestroyOnLoad` on a `[Persistent Systems]` root; cross-scene game-state singletons (`PlayerHealth`, `PlayerProgression`, `InventoryManager`, `JournalManager`) **stay scene-local** and are rehydrated from `SaveManager.CurrentData` on each scene load | Keeps every scene independently loadable from the editor for testing (no required bootstrap chain); rehydration is a 1 ms operation against in-memory data; differs from §20.8's earlier "DontDestroyOnLoad on game-state singletons" sketch but achieves the same end-user effect |
| 2026-05-01 | `SaveableEntity` GUID component carries the persistent identity for every persistable scene object; ids are auto-assigned by `OnValidate` (deferred via `EditorApplication.delayCall`) with same-scene duplicate detection. Right-click → "Regenerate Save ID" for copy-paste duplicates | Survives scene reloads, prefab variants, hierarchy moves, and renames — the only key resilient to designer iteration. Scene-name + transform-position keys would silently break under any of those |
| 2026-05-16 | Level-design tiering corrected: §20 now distinguishes **sub-areas** (named §20.5-archetype groupings; ~6 per region) from **scenes** (the scene-swap unit; ~15–20 per region). The §20.6 roster was relabelled a *Sub-area Roster* — it had mislabelled sub-areas as scenes — and §20.1's "6–10 scenes" whole-game figure corrected to ~45–55. Church `LDD_Church.md` authored: 6 sub-areas → 18 scenes, in play order Sacristy → Cloister → Churchyard → Main Nave → Bell Tower → Chapel | The original roster conflated the two tiers, making scene counts and per-scene budgets ambiguous for level design; the LDD is now the source of truth for the Church and the GDD reconciles to it |
| 2026-06-09 | Reconciliation pass (v1.1): TOC rebuilt to surface §10.4a / §12.8 / §15.5 / §18.7 / §20.5–20.9; header date refreshed; implemented-system count reconciled to `README.md` (18 named systems — 15 complete, distraction + save partial, analytics spec-only); save system consolidated into new §18.7; lockpicking sweet-spot pseudocode (§10.4) corrected to half-width semantics per `LockpickingSystem_Manual.md`; throwables status corrected to *partial — on hold*; §26.6 cross-ref fixed (item 8 → 11); §29 satellite index rebuilt against files that actually exist (retired the dead GDD/FDD entries; added `LDD_Church.md`, `Scene_Organization_Conventions.md`, `CombatSystem_Manual.md`) | Make this the single authoritative file. `README.md` is the source of truth for implementation state; this document for design intent |
| 2026-06-30 | Church layout restructured in `LDD_Church.md` and reconciled into §20.2/§20.4/§20.5/§20.6: interior start committed (game opens in the **Clergy Offices**); **Sacristy** relocated out of sub-area 1 into the Main Nave as scene **C6**; old **Bell Tower / Organ Loft** sub-area split — organ stays at the hub (Crossing pulpitum + Organ Loft spoke), bells move to a **West Bell Tower** in the Churchyard; **Churchyard** demoted from entry threshold to a hub **spoke** (loops back via the great west doors; its bell-tower mechanism opens the Chapel); **Chapter House** added to a now-living-monastery Cloister. Church re-lettered to a new **A–F** order and grows 18 → **19 scenes** | Honours the committed interior start and puts the Sacristy, organ, and bells in their architecturally correct homes; `LDD_Church.md` remains the source of truth for Church layout and the GDD reconciles to it (§20.6) |

---

## 28. Legal & Compliance

### 28.1. Intellectual Property

All game code and narrative content are original work of Jhonnatan Barbosa. Character likenesses, location names, and story content are fictional; any resemblance to real persons, institutions, or events is coincidental or clearly parodic.

### 28.2. Third-Party Licenses

| Dependency | License | Usage |
|---|---|---|
| Unity 6.3 | Unity Personal / Pro terms | Engine |
| Cinemachine 3.1.4 | Unity EULA | Camera system |
| Steamworks.NET | MIT | Steam integration |
| StarterAssets Third Person Controller | Unity Asset Store (standard) | Base controller (extended) |
| Modern UI Pack | Asset Store standard | UI base |
| Heat UI | Asset Store standard | UI components |
| Hivemind Gothic Cathedral | Asset Store standard | Church environment modular |
| Modular Dungeon / Modular Cave | Asset Store standard | Catacombs, cave environments |
| Noto Serif (font) | SIL Open Font License | All in-game text |

Full asset log maintained separately (see §29.1).

### 28.3. Ratings & Compliance

- **Target rating:** PEGI 16+ / ESRB M.
- **Descriptors:** intense violence, psychological horror themes, strong thematic content.
- **Steam store tags:** Stealth, Immersive Sim, Psychological Horror, Dark, Atmospheric, Singleplayer, Story-Rich.
- **No loot boxes, no gambling mechanics, no online connection required after install.**

---

# Part 6: Appendices

## 29. Satellite Document Links

### 29.1. Active Satellite Docs

This document absorbed the prior modular ecosystem (the old GDD, the per-feature FDDs, the Art Bible); those originals have been **retired**. The files below are the live satellite docs, kept as **deep-dive references** for implementation work — they are **not** authoritative for design intent (this document is). Paths are relative to the docs folder (the same folder as this file). Ordered roughly by frequency-of-use:

| Path | Purpose |
|---|---|
| `README.md` | Repo-level status snapshot — **source of truth for implementation state** |
| `EnemyAI_System_Manual.md` | Per-method reference for the AI stack (§12) |
| `SaveSystem_Manual.md` | Save/load architecture, file format, adapters, scene-transition pipeline — deep dive for §18.7 / §20.8 |
| `FDD_SoundPropagation.md` | Implementation-ready detail for §17.5 |
| `LDD_Church.md` | Church level design — 6 sub-areas → 19 scenes, door-cue audit, gating. Authoritative for Church layout/flow (§20.6) |
| `Scene_Organization_Conventions.md` | Per-scene hierarchy, naming, prefab, layer/tag standard. Companion to §18.5 and `LDD_Church.md` |
| `Analytic_Collection_Plan.md` | Full event schema, parameter reference, SQL queries — deep dive for §26 |
| `CombatSystem_Manual.md` | Stealth-kill "Slice 1" spec (dagger backstab, body discovery) — forward reference for §8; **not yet implemented in-engine** |
| `JournalSystem_Manual.md` | Authoring workflow reference (§10.5) |
| `CoverSystem_Manual.md` | Tuning handbook (§7.4) |
| `LockpickingSystem_Manual.md` | Tuning + migration guide (§10.4) |
| `InspectionSystem_Manual.md` | Scene-setup walkthrough (§10.6) |
| `HealthSystem_Manual.md` | Damage pipeline reference (§8.2) |
| `CharacterProgression_Manual.md` | Stat-curve authoring (§9.4) |
| `InventorySystem_Manual.md` | Item SO reference (§9.3) |
| `InteractionSystem_Manual.md` | `IInteractable` extension guide (§7.2) |

### 29.2. Planning Docs (design absorbed)

Two working planning docs drove sections of this GDD. Their *design* content is already consolidated here, so they are not required reading; they are retained in the project for implementation detail only.

| Path | Design absorbed into |
|---|---|
| `Development_Plan_WorldStructure.md` | §20.5–20.9 (archetype contracts, branch theory, gating, scene-transition spec, perf budget) |
| `Development_Plan_Civilian_NPC_System.md` | §12.8 (civilian brains, panic-stimulus routing, archetype roster) |

> **Note:** these two planning docs are not present in this docs folder. If they exist, they live in the Unity project tree; the design intent they carried is reproduced in the sections above regardless.

---

## 30. Glossary

| Term | Meaning |
|---|---|
| **Blackboard** | `AIBlackboard`, a plain C# class that holds per-guard runtime state shared between AI subsystems |
| **Clue** | Author-defined actionable fact embedded in a document or observation; stored as `ClueData` |
| **Cover offset camera** | Cinemachine camera with a lateral shift toward a wall edge; tier 2 of the cover camera stack |
| **Detection incident** | Any moment the guard's suspicion crosses `CautiousThreshold`; tracked in analytics |
| **FDD** | Feature Design Document — formerly a separate file per feature; now absorbed into this doc |
| **Finesse** | One of four character stats; governs lockpicking and noise |
| **Golden path clue** | A clue that lives on the critical path; guaranteed findable |
| **LDD** | Level Design Document — not yet authored; would be absorbed the same way as FDDs |
| **LOS** | Line of Sight — unobstructed raycast from guard eye to player sample point |
| **Masking zone** | A volume or point emitter that subtracts from the effective radius of sounds originating inside it |
| **Peek camera** | Dedicated Cinemachine camera for over-the-shoulder peeking at wall edges; tier 3 of the cover camera stack |
| **Pillar** | One of four non-negotiable design principles (§2) |
| **SearchNode** | Level-design component marking Exit / HidingSpot / Chokepoint / General positions for the guard coordinator |
| **Sweet spot** | The angular window in the lockpicking minigame where the pick can turn the cylinder |
| **Suspicion** | Scalar 0..1 per guard; drives state transitions (§12.2.5) |
| **Vigor** | One of four character stats; governs HP and fall tolerance |
| **Vertical slice** | The Church area, playable end-to-end, narratively complete (§20.3) |
